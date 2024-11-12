# Error format in API response object
#plantrail/api

## Background
During the years several different ways to deliver errors to the client has emerged in the PlanTrail API. It’s time to standardise and pick the best parts of our current concepts.

## Current error concept
Errors can emerge from several different layers:
- Standardised Postgres database error
- Specialised PlanTrail database error
- PlanTrail API error, i.e. not originating from a database problem
- PlanTrail input validation error, i.e. input error in url or body

The first two types of error, which has their origin in the database, are communicated from the database to the API via `RAISE ERROR`. This is a robust way to communicate, but it lacks any menas of attaching metadata.
## Needs for standardised solution
Our new solution should meet the following needs:
- Error codes should be easy to translate via Locize
- Possibility to categorise errors in different ways, e.g
  - disclosure level, i.e. can this error be shown to the user?
  - severity level, i.e should this error lead to any action at the client or pass silently?
  - retention period, i.e. for how long should we save data about the error in the error log table?
- Good DX (developer experience), i.e. an error should be readable directly in the response without the need to lookup a code in the database or Locize.
- Not unnecessarily bloated

### Use cases
API errors emanates from several different layers in our stack:
- Database, native Postgres errors 
  - Exceptions are raised with standard Postgres error codes.
- Database, custom PlanTrail errors
  - Exceptions are raised with custom PlanTrail codes
- Database, json object returned from database, augmented with error information
- API server, due to request validation errors or other “controlled” events
- API server, due to bug or other “uncontrolled” event

Some database functions returns datasets to the API server, which is converted to arrays in the pg-promise library. Since no json is returned from the database, there is no way to include any error information. In these cases the function will raise exceptions if errors occur.

Some database functions returns jsonb objects. These objects will be augmented with error or warning information.

#### Raising errors from the database
Functions which returns dataset, as opposed to a json object, cannot return error information in the return value. Instead we need to raise exceptions. Exceptions are marshalled to the API server and we can catch them in a catch block.

The API server needs to convert the raised error into a standardised error object and send to the client. Some PG errors include metadata such as affected table name. This metadata should be packaged in a sub-object named `pgMeta`.



### Packaging the information
Error or warning information needs to be propagated from the database via the Api servers to the client. The API server needs to know what http status to send to the client. Sometimes the client will handle the situation in silence and sometimes a message might be needed for the end user. The client and/or user might also need more information to handle the situation. E.g. severityLevel, translation information and other metadata.

Sometimes Postgres error codes needs to be used (when raising exceptions from pg code). Those codes use both numbers and letters, so we cannot use integers for our error codes. Since we need to use strings for error codes we might as well make these strings readable, except for Postgres codes which are all but readable.

Some Postgres codes consists of only numbers. E.g. 23505 = Unique violation. In order to not cause lookup problems with Locize we need to prefix the number with a hash sign. To streamline this we will add a hash sign to all error codes in Locize.

Eg.
`lookup.errorCode:#blueprint.duplicateName.title`
`lookup.errorCode:#23505.title`

Examples:

**Error returned as object directly from the database**
```
error: {
  code: 'blueprint.duplicateName',

  //data from our error definition
  httpStatus: 409,
  message: 'Blueprint names must be unique within each project',
  title: 'lookup.errorCode:#blueprint.duplicateName.title',

  meta: {
    //meta added by the API. For example from the original request.
 	projectId: 111,
    name: 'Plan 1',

    //meta added from within the database function
    //sometimes the db function has access to more/better metadata
    //than the API can harvest from requests. Hence, the API server 
    //needs to merge any request meta (above) with meta from the db function
    xyz: 12
  }  
}
```

**Error raised from the database and caught in a catch-block**
```
error: {
  code: '23505',

  //data from our error definition for "23505"
  message: 'One or more values are violating UNIQUE constraint.',
  httpStatus: 409,
  title: 'lookup.errorCode:#23505.title',

  //data from the request call
  meta: {
 	projectId: 111,
    name: 'Plan 1'
  },

  //data from Postgres
  pgMeta: {
 	tablename: 'blueprint',
    data: 'Plan 1 already exists'
  }  
}
```


#### Postgres error codes
We can define custom error codes to be raised from within our own functions in the database. Thes code must not clash with standard Postgres codes, as per [Appendix A. PostgreSQL Error Codes](https://www.postgresql.org/docs/current/errcodes-appendix.html). Therefore all of our custom database errors will start with “S3”. This is an arbitrary code which will not clash with Postgres as of PG version 16.1.

After **S3** we have three characters to identify our error. We will use numbers (0-9) and letters (A-Z) which gives room for roughly 46,000 different codes. No specific scheme will be created within our codes, instead we will simply start incrementing from 001 and up.

We already have some codes defined in the S3GA-range, i.e. S3GA0-S3GA9. These will be migrated to the new range.




## Proposed solution
A centralised error table is created in the database. Whenever we need a new error code, this will be added to the error_code table. Each code has a name (for internal use, DX) and possibly some categorisation to guide the client how to handle the error.

If an error should be shown to the user a title and description should be stored at Locize. We will use namespace `lookup.error`. Example:
- `lookup.error:#1003.title`
- `lookup.error:#1003.description`

### Response format
The error will be delivered to the client in the following format:
```
{
	code: 1003,
	error: "Report is already finished or queued"
}
```

Categoriy, severuty, etc will be added when the concept has matured and we know what we need in this area.

If more data needs to be communicated to the client this should be packaged in a sub object called `meta`. By doing so, the meta object can be easily passed to Locize for interpolation of error description. Ex:

```
{
	code: 1003,
	error: "Report is already finished or queued",
	meta: {
		finishedAt: "2023-01-01"
	}
}
```

The Locize translation string could look like this:
`lookup.error:#1003.description = "This report was finished at {finishedAt}."`

### Origin from the database
Currently we communicate errors from the database to the API via raise error. The error codes are a mix of Postgres standardised error codes and PlanTrail specific error codes. We cannot leave this concept entirely in the database since we don’t always control how and why an error is raised.

I.e. we need to keep part of this concept, but the API can repackage those errors to json object as per above.

In the cases when we raise PlanTrail specific errors from the database or when we deliberately raise Postgres errors, we could migrate to the new concept at the database level. Before doing this, the API server needs to be upgraded to handle the new concept.

New endpoints, which does not yet use the old concept can use the new concept directly, i.e. instead of raising errors a json object should be returned as per above.

### Error code 0 = no error
Sometimes the database needs to communicate “no error” so the API can respond with status 200 or similar to the client. In these cases the same concept can be used, but with `code = 0`. Returning 0 when no error has occurred is the standard in Linux shells and many other error handling situations.

### Warnings
Sometimes we need to present a warning to the user. Warnings will not halt any execution as errors do. The severity of an error is “error”, i.e. operation will be halted due to this fact. The severity of a warning differ. I suggest that we define three warning levels;
1. severe warning (red)
2. warning (orange)
3. minor warning/information (yellow)

In order to fit both warnings and errors in the same database table as well as report warning or errors we could do the following:
- add warningCodes with negative numbers, this would not interfere with “above zero = error)
- add severityLevel, 9 = error, 1 = info, 5 = warning, 8 = severe warning (almost an error)
- 