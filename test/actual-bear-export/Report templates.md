# Report templates
#plantrail/reports

## TODO - upgrade
- [x] New JSReport server
- [x] Revert apply_report_template, remove version handling code
- [x] Revert get_report_types, remove version handling code
- [x] Revert get_reports, remove version handling code
- [x] Publish web-app to staging
- [x] Publish web-app to prod
- [ ] remove column report.calculated
## Background
We need a flexible concept for creating reports. The user must be able to interact in the creation process by adding text and/or other sections to the report.

Some use-cases are very strict, such as an ABT inspection where 25 headings (sections) are specified in ABT06. The user must be able to use all or some of the 25 sections and complete them with text and other data where needed.

## Goal
The goal is to create a data structure which can be used in an interactive environment in our web app to define reports, as well as being used in jsReport to render the actual PDF reports.

Preferably, the new structure for defining reports should replace our current report layouts. This will increase the flexibility substantially.

## Concept
### Component type 
Component types are the lowest type definition in a hierarchy. A component depicts the main input component to use in the GUI

#### 1. FreeText
The free text component shows a WYSIWYG editor in the GUI. Currently TinyMCE is used as editor component in the web-app.

The html created by the users input into this component is stored in `report_component.content`

#### 2. Controlpoints
The control points component is used for selecting control points from `autoData`  and visualizing in a specified layout. The selection is performed by choosing from a predefined set of filters.

Example usage is: 
* deviation tables in the report
* charts based on statistics for selected controlpoints
* blueprints showing the selected controlpoints

#### 3. Distribution list
The distribution list component is used for including all recipients in a table layout in the report, i.e. “this report is distributed to the following…”.

The distribution list is also used for the actual distribution of the report. I.e. sending by email and keeping track of the delivery.

The GUI for a distribution list includes both the list and a button for adding/removing recipients.

#### 5. Document links
The documents component lets the user select available documents for the current project as well as uploading new documents to the project.

Example usage for linked documents could be:
* links to previous reports in a series of inspections (i.e. besiktningsbilaga)
* links to regulations documents or other external docs (must first be uploaded to PlanTrail)


#### 17. Form input
The form component renders a form in the GUI. The input fields in the form are defined in `report_component_config.properties_config`. 

The resulting input data is stored in `report_component.properties`.


### Component config 
Configs defines the usage of components. Each added component in a report must state it's config. The selected config implicitly selects an underlying component type.

Some configs are specifically tailored for a usage. Example:



## API
### AUTO-DATA
#### GET: /reports/:guid/auto-data
`report_get_report_data_ddp(_user_account_id integer, _report_guid uuid, _component_id integer DEFAULT NULL::integer)`
Get all or some autoData for the report. To minimize bandwidth use, provide a componentId as a query parameter. Only datasets related to the componentType och the provided componentId will be returned.

Part of the auto-data is a branch called `components`  This is read-only data for components, keyed by componentGuid. The component branch is prepared with `CREATE OR REPLACE FUNCTION app_api.get_report_component_auto_data(_project_id, _report_guid, _ddp_filter_ids, _user_account_id, _controlpoint_guids, _component_guid)` which is called from within report_get_auto_data.

### SECTIONS
#### GET: /reports/:guid/sections?sectionId=nn
`report_get_sections_ddp(_user_account_id, report_guid, _section_guid)`
Get all or one section.
Provide a sectionId as query parameter to get only one section, including the section's components.

#### POST: /reports/:guid/sections
- [x] database function
- [ ] API endpoint

`report_add_section(_user_account_id, report_guid, _section)`
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
- [x] database function
- [ ] API endpoint

`report_update_sections(_user_account_id, _report_guid, _sections)`
Update one or more sections.
{
  sections: [{
    "id": 127,
    "title": "Urklipp",
    "sortOrder": 10,
    "paragraphNumber": [1,1],
    "indentationLevel": 0,
    "isPageBreakBefore: true
  }]
}

#### DELETE /reports/:guid/sections/:sectionId
- [x] database function
- [ ] API endpoint

`report_remove_section(_user_account_id, _report_guid, section_id)`
Delete a section

### COMPONENTS
#### GET: /reports/:guid/sections/:sectionId/components
- [x] database function
- [ ] API endpoint

`get_report_sections_ddp(_user_account_id, _report_guid, _section_id)`
Get components for a single section, this is a filtered use of get_report_sections_ddp.

#### POST: /reports/:guid/sections/:sectionId/components
- [ ] database function
- [ ] API endpoint

`report_add_component(_user_account_id, _report_guid, _section_id, _component)`
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
- [ ] database function
- [ ] API endpoint

`report_update_components(_user_account_id, _report_guid, _section_id, _components)`
Update one or more components

* componentTypeId or sectionId cannot be updated.
* All components in the update-array must belong to the same sectionId
- [ ] database function
- [ ] API endpoint

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
- [ ] database function
- [ ] API endpoint

`report_remove_component(_user_account_id, _report_guid, _section_id, _component_id)`
Delete a component along with all related information (i.e. documents, content, etc)

### DOCUMENTS in COMPONENTS
#### POST: /reports/:guid/sections/:sectionId/components/:componentId/documents
- [ ] database function
- [ ] API endpoint

`report_upsert_document...`
Add a new document to component
```
{
  documentGuid: "ab12.."
}
```

#### PATCH: /reports/:guid/sections/:sectionId/components/:componentId/documents/:documentGuid
- [ ] database function
- [ ] API endpoint

`report_upsert_document(_user_account_id, _report_guid, _section_id, _component_id, _document)`
```
{
  comment: "user comment.."
}
```

#### DELETE: /reports/:guid/sections/:sectionId/components/:componentId/documents/:documentGuid
- [ ] database function
- [ ] API endpoint

`report_remove_document(_user_account_id, _report_guid, _section_id, _component_id, _document_guid)`
Delete a document from a component

### CONTROLPOINTS in COMPONENTS
#### POST: /reports/:guid/sections/:sectionId/components/:componentId/controlpoints
- [ ] database function
- [ ] API endpoint

`report_upsert_controlpoint_config..`
Add a new controlpoint config to a component.

```
{
  controlpointGuid: "ab12..",
  hideImageGuids: [...]
}
```

#### PATCH: /reports/:guid/sections/:sectionId/components/:componentId/controlpoints/:controlpointGuid
- [ ] database function
- [ ] API endpoint

`report_upsert_controlpoint_config(_user_account_id, _report_guid, _section_id, _component_id, _controlpoint_guid, _config)`Update a controlpoint-config in a component.

```
{
  hideImageGuids: [...]
}
```


### RECIPIENTS in COMPONENTS
#### POST: /reports/:guid/sections/:sectionId/components/:componentId/recipients
`report_upsert_recipient_config(_user_account_id, _report_guid, _section_id, _component_id, _controlpoint_guid, _config)`Update a Add a new recipient to a component.

- [ ] database function
- [ ] API endpoint

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


### URL-builder
```
{
	sections: (obj) => `reports/${obj.reportGuid}/sections
	section: (obj) => `reports/${obj.reportGuid}/sections/${obj.sectionId}
	components: (obj) => `reports/${obj.reportGuid}/sections/${obj.sectionId}/components
	component: (obj) => `reports/${obj.reportGuid}/sections/${obj.sectionId}/components/${obj.componentId}
	documents: (obj) => `reports/${obj.reportGuid}/sections/${obj.sectionId}/components/${obj.componentId}/documents
	document: (obj) => `reports/${obj.reportGuid}/sections/${obj.sectionId}/components/${obj.componentId}/documents/${documentGuid}

```

## Database functions for API calls
### get_report_available_section_components
Returns a list of available componentTypes based on the implied reportType and possibly company specific components.

```
SELECT * FROM get_report_available_section_components(
  _user_account_id => 1, 
  _report_guid => '0efa8ad8-16c8-4d81-9f0e-0c2f07de3179'
);
```


### create_report
Same function as for creating "legacy" reports. If a template_guid is given as input, a "ddb-report" will be created.

Set _is_manual_edit = true to put the report on hold until the user has completed the report in the GUI.

```
SELECT app_api.create_report(
  _user_account_id => 1, 
  _template_guid => '222e57b6-cad2-4c26-a887-4eb4d5846ec4',
  _project_id => 1, 
  _is_manual_edit => true, 
  _is_override_preflight_check => true
);
```

### get_report_data_ddp
Get all needed "auto-data" for the report. This does not include the section structure and user-data (see get_report_sections_ddp).

Provide a _component_id to get data related to this component. The response will include all ddp-datasets related to the particular componentType. Ex: 
* if componentType is 5 (documents), only documents will be in the result.
* if componentType is 2 (controlpoints), controlpoints and depenedent datasets will be included (products, brands, levels, etc)

```
select * from get_report_data_ddp(
  _user_account_id => 1, 
  _report_guid => '1fbf56eb-b37e-4ff3-8b26-d6496e7a99f1'::uuid,
  _component_id => null --126 --set to null to get data for all components
);
```

### get_report_sections_ddp
Get the section structure including user-data. "Sections" is the user editable part of a report.

Provide a _section_id to get data for a single section.

```
select * from get_report_sections_ddp(
  _user_account_id => 1, 
  _report_guid => '41e3ca34-7110-489e-9a0c-61f3a86c9f56'::uuid,
  _section_id => null --set to null to get data for all sections);
```


## Data structure (new as per 2022-09-20)
The database structure will be built around our current `report` structure, i.e. table-names will be prefixed with "report_", and foreign keys will tie all report tables together.

`report` 
The existing report table will get a new column,  `report_template_id`  for referencing a report template.

report_status_id = 1 will be used for reports currently in edit mode in the GUI. (1 was formerly named "flightcheck started").

`report_section`
Each time a report is created, we "instantiate" a template. This means that we copy every section from report_template_section to report_section. After instantiation the instantiated version is completely separated from the template. Technically it would be possible to "revert" to the template, but I don't know if this feature would be usable.

A report_section has the following properties:
* id
* title
* indentationLevel
* paragraphNumber
* sortOrder
* isPageBreakBefore
* templateSectionId
* isNumbered
* isIncludeInToc

templateSectionId references back to the original template section, in case we'd like to implement a "revert to template" later on.

`report_section_component`
Each section holds a list of components. Components can be anything we implement support for. To start with, we will need the following component types:
* free text editor
* document links
* automatic data from the database (i.e. controlpoints, attendee list, etc)

Component properties:
* **id**
* **typeId**  (base componentType, i.e. freeText, controlpointList, etc)
* **filterId** (some contentTypes can have filters, eg "Only pink controlpoints")
* **layoutId** (eg. "slim fireseal table" or "verbose inspection deviation list")
* **sortOrder**
* **isPageBreakBefore**
* **content** (an object holding all sorts of content)

Examples of the content object:
```

{
  distributions: {
    //config is a map for overriding items in autoData
    config: {
		"1": {}
    },

    //items is an array for adding items not present in autoData
    newItems: {

    }
}



// content for a free text component
{
  html: '...'
}

// content for a documents component
{
  additions: [{
		documentGuid: '...'
		
	}]
}

// content for a controlpointList component
// most of the data can be found in autoData.sectionContent
// userContent holds changes to the autoData
{
  overrides: {
		"4f735...": {
			hideImages: ["a1ca..", "01b2.."],
          isShowBlueprintCrop: false
		} 

      //exclude this controlpoint from the report
		"43e21...": {
			isHideItem: true
		} 
	}
}

// content for a distributionList component
// most of the data can be found in autoData.sectionContent
// userContent holds changes to the autoData
{
	overrides: {
		"1": {
			companyName: "Corrected company name"
		}, 

      //2 exists in autoData, but should not be in report       		"2": {
        isHide: true   
      }
	},
	additions: [{
		name: "Michael",
		email: "michael@sageryd.se",
      companyName: "PlanTrail AB"
  }]
}


```



## Report definition object
The API will serve our web-app with a JSON object consisting of both the section config and the data to present in each section. If the report is based on a template, the config section will initially consist of the template. 

Any changes the user does to the section config must be saved back to the API in order for JSReport to be able to render the report as the user intends. When a section is altered the altered version will override the template it was based on. Only altered sections will be saved with the report, as the other sections can be completely rendered based on the template.

The config section also holds data which the user enters interactively, for example data for free text fields, or ad-hoc changes to distribution lists, etc.

The data section holds unaltered data from the database. This should only be used to present a preview to the user. When the report is actually rendered, fresh data will be fetched. This is obvious in the case when a report is completely template-based and the user does not even use the interactive environment to alter the config.




![](Report%20templates/9425AE20-0156-4395-8A9A-926751DFDF43.png)

## More flexibility in section structure
Some use cases indicate that we need to make the section structure even more flexible. 

### Use cases
#### KA report
One example is Tobias demo template for a KA-report. This template starts off with a 2-3 page long intro text. This text has a headline structure, much like our section titles, but the intro text should not have paragraph numbers and it should not be included in the TOC. Also, this long text are in need of some page breaks.

Currently “intro text” can only be added in the one and only intro text box, which does not get at paragraph number. In order to create a paragraph structure we would need to add more sections and more components.

Solution
- [ ] It should be possible to add multiple intro sections
- [ ] intro sections should be able have multiple components, just as ordinary sections today
- [ ] Wether a section has a paragraph number or not should be a setting on each section
- [ ] A TOC component should be created for automatic Table Of Contents
- [ ] Wether a section should be included in the TOC should be a setting for each section
- [ ] A report setting should dictate if sections have paragraph numbers or not

#### Verifire (and other fire consultants) need rule based section layout
More than once have we encountered the “dream” to create a section hierarchy with hundreds of sections, and each group of sections are automatically added based on settings in the report and some rules.

This would be possible to build but we need to carefully design the UI so the current user friendliness and logic is sustained.

**Questions**
- how should such automatic sections be placed within existing sections? Automatic sort-order/priority?
- how should we handle changes in settings which would lead to removal of auto-sections? The user could potentially loose data.

**Email message**
Verifire also suggested that they’d like to input a message for the distribution email when finishing the report. We should probably have one input field for this message in the finish dialogue, but a standard message should be saved with the template via report settings.

Possible solution
- [ ] Create a large template holding all possible sections
- [ ] Tag each root-section (i.e. include sub sections) with id/name so these could be selected via rules. The id should probably be the existing sectionGuid
- [ ] when sections are selected via rules they are inserted or merged with existing sections if existing sections has the same id.
- [ ] add message input in finishing dialogue
- [ ] add default message to report settings (i.e. saved in the template)
- [ ] It would be great if the distribution message could have auto-codes

### Today’s logic
#### Normal sections
Normal sections (type 20) can have multiple components and be sorted by the user. The sections can have paragraph numbers
#### Components
Components are added to sections (a section is a group of components)
#### Special into section
A special section is automatically added first. This section is of type 10. The intro section can have any of these three components; intro text, report title, cover page settings
The intro section does not get any paragraph number.
#### Special appendix section
A special section is automatically added to the end of the report. This section is of type 30. The appendix section can have any of these two components; blueprints, header field settings
#### Report filter
The main controlpoint filter for the report can be altered via a dialogue reachable from the report menu. As of now only “layer” is filterable on report level.

### Problems with today’s logic
As per the use case description above, we need to be able to add multiple sections without paragraph numbering. These sections need to be able to hold more than one component as well.

Report settings should be consolidated to one place. As of now we have:
- cove page settings in a component
- report title/subtitle in a component
- report filter in a menu choice
- blueprint appendix settings in a component
- header text settings in a component

**Possible solution**
Consolidate all of the above settings into one single component in one single section. This section should not be visible among other sections, but reachable in dialogue form via a settings-button

All of the settings except title/subtitle would probably do well in a separate dialogue from a UX standpoint. But title and subtitle needs to be presented up-front in the UI.

Report filter should possibly be in a separate dialogue as well.

## ToDo, new structure
- [x] bygg reportSettings-formulär
- [x] konsolidera inställningar till ett ställe (dialog som öppnas via kugghjul eller menyval)
- [x] ta bort första och sista (grå) sektionerna som fn skapas automatiskt
- [x] lägg till inställning per sektion som anger om paragrafnumrering ska göras
- [x] lägg till inställning per sektion som anger om sektionen ska ingå i innehållsförteckning
- [x] lägg till inställning för att gömma sektionsrubrik
- [x] lägg till subject, message och fileName vid "slutför rapport" (formId 
- [ ] 
- [x] lägg till standard distributionsmeddelande i rapportinställningar (spara med mallen)
- [x] lägg till inställning som anger om rapporten ska visa paragrafnummer
- [x] skapa ny komponent för automatisk innehållsförteckning
- [x] bygg ett konverterings-script som migrerar alla gamla rapporter till nya strukturen
- [x] bygg om paragrafnumreraren (databas-funktion) så den kan hoppa över sektioner enligt sektionsinställning
- [x] flytta ut javascript-paragrafnumreraren till ddp-biblioteket och bygg om den så den ger samma resultat som databas-funktionen (denna används "optimistiskt" i webappen så man slipper vänta 1-2 sekunder innan ny numrering är skapad på servern.
- [x] Rapportens rubrik och underrubrik behöver ligga synligt direkt i inmatningen, dvs inte dolt bakom kugghjuls-knappen. Jag föreslår att vi lägger dessa högst upp i rapportversktan så de alltid är synliga, ovanför alla sektioner.
- [x] Implementera nya sektionsinställngar i ddp-rapporten
  - [x] hideTitle
  - [x] paragraphNumber.isVisible
- [ ] isSingletonComponent ska gälla hela rapporten, dvs endast EN komponent i hela rapporten

## Calculated section and component parameters
Some parameters for sections and components has to be calculated. The calculation could be triggered by any of the triggering factors described below. Example of calculated parameter is `shouldRender`, which tells the client (web-app or JSReport) if a section should be rendered or not. This is depending on settings and the actual content.

### Calculated parameters
For sections, we need to calculate the following. The objects are designed to be shallow mergeable with existing section objects in the store at the client.
``` 
sectionStats: {
  [sectionGuid]: {
    calculated: {
		shouldRender: true,
        isIncludeInToc: true
    },
    paragraphNumber: [1,1]
  }
}
```

For components we need to some other parameters. We store this in a hierarchy of sectionGuid.componentGuid.calculated for easy merge with the store at the client:
``` 
componentStats: {
  [sectionGuid]: {
    [componentGuid]: {
      calculated: {
	  	isEmpty: true,
        isRequiredViolation: true
      }
    }
  }
}
```

### Triggers for calculations
When do we need to calculate stuff?

#### Paragraph numbers
The paragraphNumber calculation needs to be performed when:
- sections are reordered
- a section gets a new indentation
- a section is added
- a section is removed

A paragraph number calculation is dependent on updated stats for each section, i.e. “shouldRender etc. Hence the above triggers always triggers a stat calculation as well.

#### Section and component stats, aka “calulated”
