# Domains, API data, app state and form data
## Domains
In PlanTrail the term domain is used for describing a specific resource in our database. Examples of domains:
- project
- drawing
- userAccount
- company
## Data formats
### Postgres
The main storage for all of our data is our Postgres database. The structure for this storage is kind of domain specific, but we try to be aligned with best practice for database structures, so the database storage structure will not describe the domain structures.
### API
When a resource is requested from our API, the database and our API servers will rearrange the data to comply with the domain structure.
### App state
Both our mobile app and our web app has a local store in which the state of resources is kept up to date when needed. The app state is synchronized with the database when socket messages instructs the app to refresh data within a specific domain. The socket messages includes domain names so the client knows what to sync.
#### Mobile app
The mobile app uses Redux for state management. This store is almost complete in regards of which domains and resources are stored locally. This is to ensure full app functionality off line.
#### Web app
The web app uses a more modern state management library, Zustand. The Zustand store is mostly organized as the Redux store in the mobile app. A key difference is that we don’t want nor need to store too much data in local state. Hence the Zustand store is much smaller than the Redux store.
### Form data
When our form engine is used for editing domain data it’s convenient if both the input to a form as well as the output from a form matches the structure of respective domain. This makes it possible to send updates straight from the form to the api, as well as to update the local state optimistically while waiting for the api response.

To enable form data to be posted back to the API as well as making optimistic updates to local state some extra keys might be needed. Such keys must be provided to the form via the `formKeys` prop.

Most forms are used for manipulating the data in the properties object, i.e. the data which is stored as json in the database. Some forms can also manipulate data in the root of the item, i.e. siblings to properties. We call these siblings sideCars.

Example, project form:
``` 
{
  properties: { regular form fields },
  thumbnail: { sidecar for thumbnail storage }
}
```
## Compatibility between formats
In general terms, the database is where the most detailed information is kept. Second runner up is local app state and last is form state.

This example data representation explains the above statement.
N.B. the example shows a subset of the project domain.
![[9c6e52ee-e4c3-40ea-b3a2-9960a4ff438e.png]]

## Domains
### Project
The project domain regards project data, duh.

#### API item format for a single project
```
{
    "id": 111,
    "companyId": 66,
    "name": "Project X",
    "files": [],
    "layers": [],
    "thumbnail": {
        "fileGuid": "3112935f-3451-4c5a-a522-1b77c34a6cd1",
        "fileTypeId": 1,
        "pixelWidth": 385,
        "pixelHeight": 385,
        "hasMediumResFile": false,
        "hasThumbnailFile": true,
        "urlOriginal": "https://...",
        "urlThumbnail": "https://..."
    },
    "properties": {},
    "modifiedAt": "2023-10-31T14:13:18.087+00:00",
    "projectStateId": 3,
    "controlpointTypes": {},
    "thumbnailFileGuid": "3112935f-3451-4c5a-a522-1b77c34a6cd1",
    "isProjectContainer": false
}
```

#### Form state
All forms which are linked to formSchema “project” are compatible with project state, i.e. the output data from a submitted form is viable for posting to our /projects endpoint.

formKeys: projectId, companyId
sideCars: thumbnail

Layers and controlpointTypes might be candidates for future sideCars. But these objects are quite complex and needs special care. Changes in these might alter other data in the database, such as reapplying identifier sequences to controlpoints.

Output from a project form might look like this:
```
{
    "id": 111,
    "companyId": 66,
    "name": "Project X",
    "thumbnail": {
        "fileGuid": "3112935f-3451-4c5a-a522-1b77c34a6cd1"
    },
    "properties": {},
}
```

This output format is directly mergable with any locally stored project state, as long as the local state is created from a project API response object.

I.e.
``` 
  newLocalState = {...localState, ...formState}
```
