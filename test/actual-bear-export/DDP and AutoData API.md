# DDP and AutoData API
## API
### AUTO-DATA
#### GET: /reports/:guid/auto-data
Get all or some autoData for the report. To minimize bandwidth use, provide a componentId as a query parameter. Only datasets related to the componentType och the provided componentId will be returned.

### SECTIONS
#### GET: /reports/:guid/sections?sectionId=nn
Get all or one section.
Provide a sectionId as query parameter to get only one section.

#### POST: /reports/:guid/sections
Create a new section.
New sections will be assigned a sectionId at the server. This id will be in the response header **Location**, as well as in the responseBody property **sectionId**.
```
{
  "title": "Urklipp",
  "sortOrder": 10,
  "paragraphNumber": [1,1],
  "indentationLevel": 0,
  "isPageBreakBefore: true
}
```

#### PATCH: /reports/:guid/sections
Update one or more sections.
[{
  "id": 127,
  "title": "Urklipp",
  "sortOrder": 10,
  "paragraphNumber": [1,1],
  "indentationLevel": 0,
  "isPageBreakBefore: true
}]

#### DELETE /reports/:guid/sections/:sectionId
Delete a section

### COMPONENTS
#### GET: /reports/:guid/sections/:sectionId/components
Get components for a single section

#### POST: /reports/:guid/sections/:sectionId/components
Add a new component under a specified section
```
{
  typeId: 1,
  sortOrder: 1,
  layoutId: 3,
  filterId: 123,
  isPageBreakBefore: true,
  content: "<h1>bla bla</h1><p>User content</p>"
}
```

#### PATCH: /reports/:guid/sections/:sectionId/components
Update one or more components

* componentTypeId or sectionId cannot be updated.
* All components in the update-array must belong to the same sectionId

```
[{
  componentId: 321,
  sortOrder: 1,
  layoutId: 3,
  filterId: 123,
  isPageBreakBefore: true,
  content: "<h1>bla bla</h1><p>User content</p>"
}]
```

#### DELETE:  /reports/:guid/sections/:sectionId/components/:componentId
Delete a component along with all related information (i.e. documents, content, etc)

### DOCUMENTS in COMPONENTS
#### POST: /reports/:guid/sections/:sectionId/components/:componentId/documents
Add a new document to component
```
{
  documentGuid: "ab12.."
}
```

#### PATCH: /reports/:guid/sections/:sectionId/components/:componentId/documents/:documentGuid
```
{
  comment: "user comment.."
}
```

#### DELETE: /reports/:guid/sections/:sectionId/components/:componentId/documents/:documentGuid
Delete a document from a component

### CONTROLPOINTS in COMPONENTS
#### POST: /reports/:guid/sections/:sectionId/components/:componentId/controlpoints
Add a new controlpoint config to a component.

```
{
  controlpointGuid: "ab12..",
  hideImageGuids: [...]
}
```

PATCH: /reports/:guid/sections/:sectionId/components/:componentId/controlpoints/:controlpointGuid
Update a controlpoint-config in a component.

```
{
  hideImageGuids: [...]
}
```


### RECIPIENTS in COMPONENTS
#### POST: /reports/:guid/sections/:sectionId/components/:componentId/recipients
Add a new recipient to a component.

```
{
  email: "michael@sageryd.se",
  firstName: "Michael",
  lastName: "Sageryd",
  companyName: "PlanTrail AB"
}
```

#### PATCH: /reports/:guid/sections/:sectionId/components/:componentId/recipients/:recipientGuid
Update a recipient in a component.

```
{
  companyName
}
```

#PlanTrail