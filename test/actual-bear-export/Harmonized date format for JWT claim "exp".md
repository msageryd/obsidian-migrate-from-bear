# Harmonized date format for JWT claim "exp"

#plantrail/tokens

## New standard
The JWT standard promotes epoch values for timestamps in for example  **exp** claims.

Epoch is not a good developer experience in most cases, so we use datestrings instead.  `new Date().toISOString()`.

As of 2022-11-02 our security sdk will throw an error if **exp** or **iat** are not valid date strings. 

SDK deps:
* security 1.0.37
* auth 1.0.28
* app-api 2.14
* socket-api 2.3
* worker 2.4

## Testing
After harmonizing the code so all token funkctions works in the same manner, as well as updating the test suite, every usage of decodeToken or encodeToken need to be tested.

The following parts have been updated to comply with our new sate string standard. Test the following thoroughly:

**App-api**
- [ ] Email validation token in signup email
- [x] urls in all augmented fileGuid jsons
- [ ] urls in ddpReportPreview
- [x] access tokens (the are now actually expiring)
- [x] file download tokens

**worker**
- [x] portal-links in pdf files