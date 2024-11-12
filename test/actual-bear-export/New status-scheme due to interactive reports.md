# New status-scheme due to interactive reports
#plantrail/reports

## Deprecated
This solution is deprecated. Please follow the link for a better solution:
[New status-scheme due to interactive reports, R2](bear://x-callback-url/open-note?id=586A7B9E-1BFF-4F6D-8CA8-2635DD6D65C7-88858-0001C9C8A5009978&show_window=yes&new_window=yes)

## Background
We are currently implementing a new interactive reporting engine. The interaction will take place before the report is sent to JSReport for final rendering. We need to keep track of reports currently under manual control, i.e. interactive report building.

The reasonable solution is to use the first status code in our status scheme, i.e. **1**, to indicate the manual state of a report.

## Current scheme
![](New%20status-scheme%20due%20to%20interactive%20reports/D471DEDD-01CD-417C-91BA-88DA114E0958.png)

## New scheme
Since **preflight warning (3)** and **preflight info (4)** is the same regarding the processing flow, we will merge those and move 1 and 2 up a step.

After freeing up status 1, we will use this for our new useCase.

### The new statuses will be: 
1. Work In Progress, the user is working on the report
2. Queued, ready for preflight check 
3. Preflight hold due to error
4. Preflight hold due to info or warning
5. Queued, ready for processing
6. Re-queued for processing
7. Processing - querying
8. Processing - rendering
9. Draft
10. Private
11. Project-report

## Migrating to the new scheme
Since the preflight check is not yet implemented in the app, the migration will be quite easy. Status 1-5 is essentially unused.

Both the app-api and the worker are currently only processing reports with status >= 6, i.e. any changes in the scheme below 6 will not affect these servers.

The app is currently only concerned with reports being processed or having status 9-11, hence no updates needs to be done in the app.

We need to update some stored procedures and some constants, and of course do thorough due diligence to ensure the we wont break anything.

## Migration tasks
- [ ] **const_sdk** must be updated with new values
- [ ] all use of **const_sdk** must be scrutinized and secured
- [ ] migrate function **app_api.upsert_report**
- [ ] migrate function **app_api.report_preflight_release**
- [ ] migrate function **app_api.report_preflight_abort**
- [ ] migrate function **app_api.report_delete**
- [ ] update status translations at Locize
- [ ] migrate function **app_api.create_report**
- [ ] migrate function **main.get_report_preflight_data**