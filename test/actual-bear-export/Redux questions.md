# Redux questions
## Selecting from normalized store

What is best practice for selecting from a normalized store such as the below. This is in a quite complex class component which is not easily converted to a functional component. I.e. I need to handle all selections from the store in the **connect** function.

There are two slices, **project** and **files**. Both slices are keyed objects. The slices are refreshed via  API calls which are performed when needed (triggered by socket messages)

**projects**
  projectA: {
      fileGuids: [guid1, guid2]
    }
  projectB: {..}

**files**
  guid1: {url, etc}
  guid2: {url, etc}
  guid3:  {url, etc}


### Typical data flow
1. User opens the project view
2. Project is selected from **project** slice
3. Data request for needed files are performed (Redux Saga)
4. **files** slice is updated with the response
5. Files are shown in the project view

### Questions
- How do I avoid a re-render of the projectView if some un-needed file is updated (guid3)?
- I would like to solve this with reselect, but I cannot figure out how.