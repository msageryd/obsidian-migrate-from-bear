# Upgrading PG-Promise from 8.4.4 to 10
#plantrail/database

Current version: 8.4.4

### Used in:
- [ ] svenworks/db
- [ ] pg-promise-listener

**Debendents**
- [ ] Worker-server
- [ ] API-server

### Upgrade strategy
- [ ] Upgrade `svenworks/db` and publish sas `plantrail/db`
- [ ] upgrade `pg-promise-listener` and publish a,d `plantrail/pg-promise-listener`

### PG-Promise changelog

- [ ] 8.7.2, errors are now ES6 classes. Do we need to change something?



## Other deps
### AWS up from 252 to 12310
TranscribeService?
S3 managed upload service?
MediaConvert?
S3Control: Add support for Amazon S3 Batch Operations
WorkMail

520:
S3: add support for AWS.S3.getSignedUrlPromise which returns a promise for S3 presigned url

ForecastService

AWS Outpost.  Kan man lagra filer "bara" on premise, men använda S3-API:et mot AWS endpoint?

### 