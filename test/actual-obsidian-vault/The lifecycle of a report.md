# The lifecycle of a report
#plantrail/reports


## Report properties vs config
The report table has a properties field. This field started out as a holder of report configurations. The config came from report_type and report_type_variant as kind of inherited config params. Inheritance chain also includes `report_type_variant_company` for company specific properties. This is currently only used for `isShowAllControlpointImages` which might remain in properties for users to edit.

For regular reports (i.e. non ddp-reports), the properties field also holds filter definitions, which are used for defining actual filter params. DDP reports has better filter handling by being able to both create and edit filter definitions as parameters instead of a json object.

Lately, the properties field also started to hold user data for ddp reports. This data includes report titles, coverpage- and other settings. The settings are edited via our FormEngine.

We need to separate config from user properties. Since “properties” is our standard concept for holding form data, it’s resonable to move the config part away and let the properties field hold formData.
### Moving to “config”
Any part of properties which should never be editable by the user should be moved to a new field, `config`.

**Use of properties which needs to be migrated**

| field                       | comment                                                      | should move | handled? |
|-----------------------------|--------------------------------------------------------------|-------------|----------|
| portalUrlHost               | Probably never used, since an automatic hardcoded fallback is in place. See augmentDdpJson.js in app-api, line 47 | X           |          |
| isDemo                      | see reportDistributionQueue.js at worker                     |             |          |
| **jsReportHost**            | Should move to a single database field                       | X           |          |
| subTitle                    | Should be named subtitle. This is not a good mixup<br>see reportRenderQueue |             |          |
| isUsePdfOwnerPassword       | Should mabe be included in `properties` and editable in the form |             |          |
| dimScaleFactor              | report 5001, controlpoint email                              | X           |          |
| controlpointTypeIds         | report 5002 statistics email                                 | X           |          |
| controlpointTypeILevelIds   | report 5002 statistics email                                 | X           |          |
| coverPageType               |                                                              |             |          |
| coverImageTags              |                                                              |             |          |
| coverImageStyle             |                                                              |             |          |
| productIntentId             |                                                              | ?           |          |
| isIncludeBlueprints         |                                                              |             |          |
| **mainControlpointTypeId**  |                                                              | X           |          |
| isShowAllControlpointImages |                                                              |             |          |
| **controlpointEventTypes**  | DDP reports                                                  | X           | X        |
| languageCode                | Add to form                                                  |             |          |


**Other updates**
- [ ] getReports (needs to include config)
- [ ] updateReportType
- [ ] getReportType


## Clean upp structure (db-functions and api-endpoints):
### upsert_report
- [x] redirect API to use create_report instead of upsert_report
- [ ] drop upsert_report when safe

### update_report_status
- [ ] no changes

update_report_status is only used directly from the worker service, for saving current status and status data to the db while working on a report. I.e. no API endpoint can access this,

### update_report
Currently, update_report is only used from the app via the API to change status between 9-11, i.e. move a report between draft/private/public

We need this function to cover more use cases
- [x] updating of sections, properties, title, etc from the web-app
- [x] alter language, filter, from the app when reports are stopped by preflight

### update_section




A report leads a complicated life. Its life cycle is dictated by external factors and kept track of via status codes. The goal is to reach status = 9, which is the Nirvana for our precious reports.

Reports with status < 0 will not be synced to any clients. Negative numbers represents deleted or cancelled reports. These will remain in the database for two weeks before the automatic report purge routine will remove them permanently. There is also a special negative status for template reports, these have status = -1000.

The purge routine can be ran anytime by calling the database function `purge_deleted_reports()`. This function is called every night by the worker process.

1 interactive editing pending
2 preflight check
3 error -> update+preflight OR cancel (-97)
4 info/warning -> update+preflight OR cancel (-96) OR release (5)
5 queued for processing -> 7
6 requeued -> 7
7 querying -> 8 or 6 or -95
8 rendering -> 9 or 6 or -94
9 finished


## Database functions
### upsert_report()
Creates or updates a report record with filter and properties as per the function call.

If an existing report is updated, the following data will be completely replaced by the update-call:
* filter values
* properties
* language_code
* report_status_id

upsert_record will automatically call `report_preflight_perform_check()` if this is not overridden via parameter `_is_override_preflight_check`.

### report_preflight_perform_check() 
Performs all preflight checks associated with this report_type and specific report_type_variant.

During the check the status of the report will be 2 *(performing preflight check)*. But this status will not remain once the check is done. This is kind of an unnecessary status and might be removed for clarity.

Depending on the outcome of these checks the report will get one of the following statuses automatically assigned.
* 3. On hold due to preflight error
* 4. On hold due to preflight warning or info
* 5. ready for processing, i.e. there were no errors, warnings or info-data

### report_preflight_release()
A report with status 4 or for can be released for processing via this function call. 

update_report()

report_delete()
report_retain_controlpoints()
report_auto_delete()

## API calls
POST: /reports/create
GET: /reports/<reportGuid>/preflight
POST: /reports/<reportGuid>/preflight-release 
DELETE: /reports/<reportGuid>


## -99	. Cancelled
General cancellation. Probably performed manually by a developer.

## -98	. Cancelled - too many retries
If a report has failed and reached it's maximum number of retries, status -98 will be set.

## -97	. Cancelled due to preflight error
Status -97 is for reports which are cancelled after a preflight error

## -96. Cancelled due to preflight info or warning
Status -96 is for reports which are cancelled after a "preflight info" or "preflight warning". This is a scenario where the user gets preflight information and manually aborts the report because of this information.

Preflight information could be "3 controlpoints will be included in this report". The user might have expected more and aborts even if this is not an error per se.

## -1. Not synced
This is a special status value which is only used at the client side to keep track of reports which are not yet synced to the server.

## 1. Manual edit
Reports with status = 1 will just sit in the queue. No worker will touch this report until status increases.

This status is used when the user wants to interact with the report before rendering. This is only possible with DDP-reports, which are supported in the report editing GUI in the web app.

## 2. Processing preflight check
A call to database function `report_process_preflight_check()` will automatically set status = 2 and perform a preflight check. The result from the check will be stored in the report table in column `preflight_check`, and will also be returned to the caller if a synchronous workflow is needed.

The API call for performing a preflight check: 
`POST: api/reports/<reportGuid>/preflight`

## 3. Preflight hold due to error
If any of the preflight checks, which was performed, resulted in a preflight error, the complete check will be deemed as erroneous.

Reports with status 3, only has two possible paths forward:

#### 3.1 New preflight check
A new preflight check might show a different result if anyone else has made updates to the project which affects this report.

Prior to the retried preflight check the user might chose to alter the specification for the report, maybe change a filter. A changed filter will probably alter the outcome of preflight checks as well.

#### 3.2 Cancel an "error-held" report
If the report is cancelled in this state it will get status = 97 which means "cancelled due to preflight error"

## 4. Preflight hold due to info or warning
If no error exists in the preflight check but one or more "info" exists, the report will get status 4. 
Reports with status 4 can either be released by the user or cancelled by the user.

#### 4.1 Releasing a held report
Releasing a report will increase the status to 5.

#### 4.2 Cancel an "info-held" report
If a report with status 4 gets cancelled , the new status will be -96, i.e. "cancelled due to preflight info"

## 5. Queued, ready for processing
When a report reaches status = 5, the worker service will take care of the rest of the processing. No more intervention is possible.

## 6. Re-queued for processing
If something goes wrong while the report is processed by the worker, the report might be requeued or cancelled.

A requeued report will get status 6 and will get picked up again by the worker as soon as possible.

Most report types only gets two retries. After this the report will be cancelled with status -98, i.e. "cancelled due to too many retries".

## 7. Processing - querying
The first stage in the processing of the report is to query the database for report data. The total query time in milliseconds will be stored with the report for future analysis.

When a report gets to state = 7, it will also get a document id. We delay assignment of document ids until we are sure that the report is being processed. Otherwise we would get unnecessary gaps in the series of document ids due to cancelled reports.

At state 7 we will also retain report data if the report type specifies this.

## 8. Processing - rendering
When the report data is sent to jsReport for PDF rendering the report will get status = 8. The total render time in milliseconds will be stored with the report for future analysis.

If the render fails the report might be requeued (6) or cancelled due to rendering problems. 

## 9. Finished
When a report reaches state = 9 it's rendered and any rendered files will be ready in the S3 bucket.

Reports with status = 9 will be picked up by the report distribution worker for distribution to recipients.

