# Blueprint crops, product requirement document (PRD), June 2024
#plantrail/reports
#plantrail/controlpoints

- [x] trigger på controlpoint_shape för att radera crops
- [x] trigger på controlpoint if drawing_id updated -> radera crops om kontrollpunkt byter drawing_id
- [x] trigger på blueprint_file_ref om ny revision laddas upp, rensa alla crops för denna blueprint
- [x] trigger på crop_type, rensa alla relaterade crops
- [ ] Omit crop calculations if controlpoint does not have a shape (i.e. when we implement support for shape-less controlpoints)
- [x] convert all reports with crops (fireseal inventory, BL, BB, EB fellista, painting)
  - [x] 107.4, rosa brandtätning
  - [x] 107.8, EB fellista
  - [x] 107.9, BL fellista
  - [x] 107.12, BB fellista
  - [x] 107.2, brandskyddsmålning
  - [x] 501.x, all reports with layout 100301

## Background
After many trials and much investigation to try to solve our overly large PDF file sizes, the conclusion is that “pre-processing” och blueprint crops is the best way to solve this.

Blueprint crops are needed in a variety of places throughout PlanTrail:
- reports
- report previews
- emails
- wep-app and portal

Out of the above use cases, the reports are the most troublesome with current solution. Currently we crop the blueprints via `viewBox` directly in the report html. It turns out that Chrome-PDF does not honor this crop, but instead embeds the complete original menu, which blows up the PDF size.

## Solution
We will have our worker server to process blueprints and save all needed crops to S3. The crop files will be treated as any other file within PlanTrail, i.e:
- The file is tracked in the `file` table
- Usage of the file is tracked in `file_ref` tables (in this case `controlpoint_file_ref`)
- Orphan files, i.e. files without any file_ref pointer, will be pruned regularly
- Pruned files will eventually be purged, i.e. removed from S3 and deleted from PlanTrails tracking tables

Blueprint crops has a limited use case for re-use over a longer period. A report needs the crops only during the report rendering. The same report will typically be previewed a couple of times before the final render.

Occasionally a controlpoint will be clicked in a PDF and the controlpoint portal will open up in a web browser. The portal would benefit from having access to a pre-cropped blueprint, but this is not critical, since cropping is a speedy operation.

Because of the limited use we might as well clean out old crops to save storage. A cleanout-job could for example prune all crops older than 30 days.

Certain changes in a controlpoint will lead to obsoletion of the crop. Specifically if the shape is altered, which could mean that new cropping coordinates are needed. All updates to `controlpoint_shape` should remove any crop file_ref for the controlpoint, hence forcing generation of a new crop upon next request.

## Affected parts of PlanTrail
### Worker
Processing of the report queue needs some major updates:
- identify needs for blueprint crops
- ensure that all crops exists, create them otherwise

The new crop processing will only be available via the worker server, this means that the current setup for report previews needs to be enqueued at the worker instead of being directly handler upon request. This also means that the report queue needs to handle sub-tasks, i.e. rendering a report but not changing the actual report status. Each preview render needs to be queued and have a status of their own.

- spawn sub tasks for report preview instead of direct handling at api request

The worker will need to handle a new type of file process, namely producing crops based on queued crop definitions.

- new queue: blueprint crops

### JSReport
- DDP report templates needs to use the pre-processed crops instead of cropping in html

### Shapes library
- Calculations for crop cordinates should be implemented in the shape library
- Calculations for viewbox coordinates when controlpoint shapes are rendered on top of a crop should be implemented in the shape library.

### Web app
- The web app needs to request report previews in a new way. 
Instead of senting all report-data in an api request, only a queue-request should be sent. The result should be awaited upon via socket subscription.

### Email
Emails containing blueprint crops should be migrated to the new concept. Currently this only involves the email for “share controlpoint”. Since only a single controlpoint can be shared in one email, the size problem is not as severe as in a report with many controlpoints. The email does not need immediate attention due to this.

- No change for now

