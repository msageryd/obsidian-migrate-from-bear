# Form engine

#plantrail/forms


## Emptying and merging form-data

Our latest form concept works really smooth when it comes to DX.
1. a formId is provided to the formEngine
2. formData is provided, i.e. the root object of interest. The form only shows relevant fields from the root object and the formOutput can then be merged back to the original root object (for example in Zustand), as well as be sent to the API for server updates.

There are some problems with this approach regarding emptying of fields and shallow merging when data is only partial, i.e. a smaller version of a form with only partial data.
### Emptying fields
As of now it is not possible to set a field to NULL, this is due to two problems.
1. An empty field in a form is usually represented as an empty string.
2. Updates in the database usually omits null values, i.e. null = leave as it was, rather than null = set to null.

#### Solution to null vs empty string
There are multiple scenarios in which a field could be empty in the form output.
1. the field was empty form start -> null should be preserved
2. the user emptied the field during form interaction -> output should be set to null
3. the field was emptied due to some form conditions -> output should be set to null
4. the field is not included in the formOutput because the field was hidden due to some form conditions -> output should be set to null

### Shallow merging with partial data
Consider the following scenario:
The complete form for report information has the following fields in the properties object:
- title
- subtitle
- paragraphNumber (object with paragraph numbering settings)
- coverPage (object with coverPage settings)

A smaller form is used for other purposes, this form has the following fields:
- title
- subtitle

Our previous default behaviour is that the output data from a form only consists of field values for fields shown in the form. In this case a shallow merge of properties would remove any other values than title and subtitle.

The input (formData) to a form is always the complete report object, i.e. we actually have access to the current values for coverField etc, even if those fields are not shown in the form. Could we simply include the initial data in the output data in order to preserve values from non visible fields? Maybe, but we need to form some rules around this.

Input fields in a form could change visibility during the lifetime of a form, either via form conditions (e.g. hide the name field if the address is “foo”). If a field is hidden during the form interaction, we do not want to save the data from this field. Example:

Initially visible fields and their values
- name = “Project X”
- client = “Joe”
- contractor = “Moe”

During editing the user unchecks “show contractor fields”, i.e. “contractor” gets invisible. Upon saving this form we would not want to save contractor=“Moe”, since this field isn’t visible.

Good to know: No matter how many different forms are shown for the same object type (e.g. a report), all forms share the same fieldDefinition.

Rules for reinstating invisible field into form output:
- All input fields which are not included in this form definition, but exist in the field definition should be reinstated.

Example:
**fieldSet**
- title
- subtitle
- client
- contractor

**form1**
- title
- subtitle
- client
- contractor

**form2**
- title
- subtitle

**formData** (input)
- title
- subtitle
- client
- contractor
- acl (does not exist in fieldSet)
- other stuff (does not exists in fieldSet)

**formOutput directly from form2**
- title
- subtitle
..merged with non form-field which exist in the fieldSet:
- client
- contractor

A rule in the current setup is that hidden fields should result in emptied output fields, i.e. if “name” field gets hidden due to some form condition, we should empty the name field. This rule should be preserved in the new setup, but only for fields in the current form.



## Lookups
We need a way for forms to access lookup datasets to show in dropdown lists and selection boxes. Ideally the data access would be performed via Zustand or Redux selectors, but in order to use these selectors we would need to call `useStore` or `useSelector` respectively. As hooks cannot be called conditionally, we would have to call all lookup selectors even if only one is used.

```
import { useStore } from 'zustand';

function useGridLookups() {
  const drawings = useStore(selectDrawings);
  const users = useStore(selectUsers);
  const projects = useStore(selectProjects);
  // Call other selectors as needed

  return {
    drawings,
    users,
    projects,
    // Return other data as needed
  };
}
```


### Selector based datasets
Selector based lookup datasets are sourced from selectors in the app-store (Zustand or Redux). A field in a fieldSet can use the property `selectorLookup` to activate a selector. A lookup dataset must be an array of objects. The objects should have properties in accordance with the lookup specification.

#### companies301
The `companies301` lookup dataset should only contain companies for which the user has permission 301 (or 1). I.e. only companies in which the user has permission to create new projects.
ww
Object properties
- id
- name

#### projectTemplates
The `projectTemplates` lookup dataset holds all project templates for a company. This dataset is dependent on the value in `companyId` for the form.

This dataset is also a formIdBearer, i.e. each template can have an array of formIds which will be applied to the form upon selection.

Object properties:
- id
- name
- formIds

### Static lookup datasets
Static lookup datasets are hard-coded directly in the fieldDefinition. This concept can only be used for small static datasets where neither database lookup nor translation is useful.

Static datasets are defined under the property `staticLookup` in the fieldDefinition.

### Lookup datasets with support for translation
Lookup datasets which are translated in Locize are hybrids between static datasets and selector based datasets. The API will prepackage ids and i18n codes directly in the field definition based on data in a database table.

The name of the lookup database table should be specified under the property `databaseLookup` directly in the fieldDefinition.

Example:
databaseLookup = 

### Lookup datasets with country support and no support for translation
Some lookup terms are country specific rather than language specific. This is the case for country specific terms that might not be the same or even exist in other countries. These terms cannot be translated 1-1, so the term is stored directly in the lookup database table instead of having an i18n reference to Locize.

Country specific terms are selected based on the country code for the active project.




#### 
## FieldDefinition
This is the structure of a fieldDefinition.

### Base Fields

A special table, `field_set_base_field`, is automatically populated whenever a new `fieldName` is added to `field_set_field`. This table serves as a reference for consistent field definitions across different field sets.

Key features:
1. **Automatic Population**: When a new `fieldName` is inserted into `field_set_field`, a trigger automatically adds an entry to `field_set_base_field`.
2. **Foreign Key Constraint**: `field_set_field` references `field_set_base_field` via a foreign key.
3. **Data Type Consistency**: The foreign key constraint ensures that every subsequent use of the same `fieldName` in `field_set_field` has the exact same `dataType`.
4. **Grid View Compatibility**: This consistency allows for combining multiple field sets in a grid view, ensuring that columns with the same `fieldName` from different field sets have the same `dataType`.

Purpose:
- Maintains data integrity across field sets
- Facilitates the creation of unified views or reports that combine data from multiple field sets
- Prevents inconsistencies that could lead to data type conflicts or unexpected behavior in applications

Note: While this ensures `dataType` consistency, other attributes of fields (like `segmented_field_id` or `is_multiline`) may still vary between field sets for the same `fieldName`.

### Non overridable properties
Only **name** and **dataType** are required properties. The following properties can not be overridden in company- or project specific versions of a fieldDefinition.

| Property-name       | Description                                                  | Applicable to<br>dataTypes      |
|---------------------|--------------------------------------------------------------|---------------------------------|
| **name**            | Name of the field.                                           |                                 |
| **dataType**        | A valid dataType (e.g. string, integer, fileGuid, ..). Please see the dataTypes section for more information. |                                 |
| segmentedFieldId    | Lookup-id for segmented-definitions.                         | segmented<br>segmentedHierarchy |
| isReadOnly          |                                                              |                                 |
| tagTypeId           | Id to identify which type of tags to use.                    | tagCollection                   |
| inputType           | A valid inputType (e.g. email, number). Please see the inputTypes section for mpore information. | string<br>number                |
| units               | A valid unit (e.g. mm, m, feet, ..). Please see the units section for more information. |                                 |
| intentId            |                                                              | fileGuid<br>fileGuidCollection  |
| isFormIdBearer      | Is this field a bearer of formIds? I.e. can the form layout change based on the input in this field. This property can only be used in combination with **lookupData**. The actual formIds can be provided in the lookup dataset. |                                 |
| owner               | By default, all fields recides under the `properties` object. Specify another owner property name relocate a field in the output structure.<br>Use “ROOT” to place the field value at the root of the output from a form. |                                 |
| acceptedFileTypeIds | Array of accepted fileTypeIds. N.B. accepted types muct be dictaded by which fileType the server can handle. | fileGuid<br>fileGuidCollection  |

### Overrideable properties
The following properties can be overridden in company- or project-specific versions of a fieldDefinition.

| Property-name     |                                                              |
|-------------------|--------------------------------------------------------------|
| lookupData        |                                                              |
| componentType     |                                                              |
| uiHelperType      | Not implemented yet. example “slider”                        |
| maxValue          |                                                              |
| minValue          |                                                              |
| maxLength         |                                                              |
| minLength         |                                                              |
| isRequired        |                                                              |
| isCopyLast        | Should values be copied from previous journalItem?           |
| isMultiline       |                                                              |
| decimalPlaces     |                                                              |
| title             | Title of the field. Use “i18n” for automatic generation of 18n-key |
| help              |                                                              |
| placeholder       | placeholder for textInputs                                   |
| warning           |                                                              |
| captionTrue       | Text to show when boolean value=true                         |
| captionFalse      |                                                              |
| iconNameTrue      | Icon to show when boolean value=true                         |
| externalValidator |                                                              |
| properties        | componentType specific properties. E.g  aspectRatio, isAllowCamera, isAllowImagePicker for image components |

### fieldPath
Sometimes we need more advanced fieldPaths which points directly to a value and might be presented under a different name. Such data would be hard to save from a form (our form engine uses merge to consolidate form data, this won’t work without correct field names).

Rules for field specified with `fieldPath`
- `owner=‘ROOT’` implicitly
- `isReadOnly=true` implicitly
- The name of the field does not reference a real property in the source object, it’s just an alias.

FieldPath is only allowed for read-only fields. Example for a controlpoint:
``` 
resolvedBy: {
  isReadOnly: true,  //implied, does not have to be stated
  owner: 'ROOT', //implied, does not have to be stated
  fieldPath: ['events', '7', 'createdByFixed'],
  title: 'i18n',
  dataType: 'string',
}
```

The above example illustrates:
- a read-only field
- fieldPath points to the read-only data
- field name (resolvedBy) does not exist in the source data. It’s just an alias for the filedPath

## Form Arrays
Form arrays allow you to create dynamic lists of form fields, where each list item contains a set of predefined fields. This is implemented using react-hook-form's useFieldArray.
### Field Set Definition
In a fieldSet, a formArray can be defined at any level in the field hierarchy. The field with dataType 'formArray' contains a FIELDS object that defines the fields for each array item.
```
{
  section: {                       // Parent field
    details: {                     // Nested structure
      utokningar: {               // formArray can be at any level
        title: 'Utökningar',
        dataType: 'formArray',    // Indicates this is a form array
        FIELDS: {                 // Container for array item fields
          omfattning: {           // Field definitions for each array item
            title: 'Utökningens omfattning',
            dataType: 'string',
            isMultiline: true
          },
          anlaggarfirma: {
            title: 'Anläggarfirma',
            dataType: 'string'
          }
        }
      }
    }
  }
}
```
### Form Definition
In a formDefinition, the formArray item references the full path to the array field:
```
{
  'section.details.utokningar': {              // Full path to formArray
    type: 'formArray',                         // Indicates this is a form array
    pos: 100,
    items: {                                   // Layout for array item fields
      'section.details.utokningar.FIELDS.omfattning': {  // Full field path
        pos: 10
      },
      'section.details.utokningar.FIELDS.anlaggarfirma': {
        pos: 20
      },
      divider: { type: 'divider' }             // Regular form items supported
    }
  }
}
```
### Field Naming
* Field names follow the pattern: path.to.array.FIELDS.fieldName
* The FIELDS segment clearly indicates array item fields
* Full field paths are used throughout for consistency
* Matches react-hook-form's field terminology

### ⠀Form Data Structure
The resulting form data maintains the complete field paths:
```
{
  section: {
    details: {
      utokningar: [
        {
          "section.details.utokningar.FIELDS.omfattning": "text here",
          "section.details.utokningar.FIELDS.anlaggarfirma": "company name"
        },
        {
          "section.details.utokningar.FIELDS.omfattning": "more text",
          "section.details.utokningar.FIELDS.anlaggarfirma": "another company"
        }
      ]
    }
  }
}
```


## AutoSave
Forms with a formSchema can be automatically posted/patched to the PlanTrail API. To use this feature, set `autoPost={true}` on the Form component.

AutoPost will choose between POST and PATCH depending of the existence of a key. Each formSchema defines what key/keys are needed for autoPost. The keys need to be set in the formKeys property. 

N.B. The formKeys property can also hold keys for various validation purposes. The form will know what keys to use for what purpose based on the formSchema.


AutoPost urls:
blueprint-import pages are created automatically on upload, only PATCH is possible after upload.
PATCH:  `/blueprint-imports/update-page/${pageGuid}`


#### project
POST: `/projects`
keys: body.companyId

PATCH: `/projects/${projectId}`

tablename: project
tableKeys: id, companyId
formKeys: projectId, companyId

#### company
POST: `/companies`
PATCH: `/companies/${companyId}`
tablename: company
tableKeys: id
formKeys: companyId

#### blueprint
POST: /blueprints
keys: body.projectId

PATCH: /blueprints/:blueprintId

#### drawing
POST: /drawings
keys: body.projectId, body.blueprintId

PATCH: /drawings/:drawingId


#### projectControlpointType
tablename: project_controlpoint_type
tableKeys: project_id, controlpoint_type_id
formKeys: projectId, controlpointTypeId

#### drawing/blueprint

#### projectLayer
tablename: project_layer
tableKeys: project_id, layer_id
formKeys: projectId, layerId

#### controlpoint (only POST)
POST: app/controlpoints/
key: guid, body.drawingId

#### journalItem (only POST)
POST: app/journalItems
key: body.controlpointGuid

#### report (only POST)
POST: /reports
keys: body.projectId, body.reportTypeId, body.reportTypeVariantId
maybe alternate keys: body.projectId, body.reportTypeCode

#### portal
POST: /portals
"projectId": 2, 
  "guid": "182d6cef-cf68-4aff-a100-de8a5ea6c442",



## AutoSubmit
For some use cases a form needs to be automatically submitted `onBlur`, i.e. when leaving a field. Some fields will need to trigger submit `onChange`, for example checkboxes since checkBoxes don’t have focus and hence no onBlur.

Autosubmit is handled internally within the form engins if the form gets the property `autoSubmit={true}`

All component types have their own autosubmit handler in order to be flexible with the difference in focus handling.

Submit is called automatically on the following events for the following components:
- textInput -> onBlur
- checkBox -> onChange
- dropDown -> onChange
- list -> onChange
- radioButton -> onChange

## Id scheme for forms and fieldSets
### Forms
First two digits describes the approximate domain for the form, eg 10 = company.

Third digit describes the form intent, 1=input form, 5 = preview

Next for digits is a sequence number, giving room for 9999 different forms within each domain/intent.

Last digit describes the form version, i.e. 5 = standard, 6+ = more 4- = less information.
Eg
40500015 = standard controlpoint preview.
Usecase = information in middle section of controlpoint info i drawing view

40500016 = verbose controlpoint preview
Usecase might be to show all information in controlpoint portal

40500014 = simple controlpoint preview

40500011 = minimal controlpoint preview 
usecase might be short description in controlpoint navigation list

* 10 Company
  * 10100001 company information forms
  * 10500001 company preview
* 20 Project
  * 20100001 Standard project (includes client information)
  * 20100002 add-on for inspection (i.e. adds contractor information)
  * 201 1001 01 - 201 1001 99 = project_form_data forms with a common fieldSet
  * 201 1002 01 - 201 1001 99 = next project_form_data forms with a common fieldSet
  * 201 1999 01 - 201 1999 99 = last project_form_data forms with a common fieldSet

  * 20500001 Project preview

* 30 Drawing/Blueprint
  * 30100001 blueprint import page
  * 30100005 drawing information
  * 30500001 drawing preview
* 40 Controlpoints
  * 40501014 simple preview, fireseal
  * 40501015 standard preview, fireseal
  * 40501016 verbose preview, fireseal
  * 40100001 Share controlpoint
* 50 Journal Items
  * journal item forms 50100001 - 50199999
  * journal item previews 50500001 - 50599999
* 60 Reports
  * 60100001 create report
  * 60100002 share report
  * 60100003 report settings
* 80 User account
  * 80100001 user profile
  * 80100002 Login
  * 80100003 Create account
  * 80100004 Reset password
  * 80500001 user profile preview
* 90 Misc
  * 90100001 Layout forms for report configs
* 99 Customer specific forms
  * 9900011001 form 1 for customer 11

### FieldSets
The purpose of separating fieldSets from forms is to be able to reuse a fieldset for multiple forms/previews/grids. Hence there will not be a 1-1 relation between forms and fieldSets.

Id scheme for fieldSets will only be categorised by domain. This is accomplished via the two first digits as for form ids.

The next four digits is a sequence number, giving room for 9999 fieldSets per domain.

* 10 company
  * 100001 company fieldSet
* 20 project
  * 200001 all project fields (no need to split into specific project types)

  For projects we use series 201 for all fieldSets used in projectFormData
  * 201001 fieldSet for a specific form in projectFormData (ex. sbf111)
  * 201002 fieldSet for another form in projectFormData (ex. sbf502)
* 30 Drawing/Blueprint
  * 300001 all drawing, blueprint and blueprintFileRef fields
* 40 Controlpoints
  * 400001 base fieldSet for common controlpoint information
  * 400002 base fieldSet for controlpointEvents
  * 400101 fieldSet for firesealing
  * 400102 fieldSet for fire protection painting
  * 400103 encasement
  * 400104 sound sealing 
  * 400105 caulking
  * 400106 EB
  * 400107 BL
  * 400108 BB
* 50 Journal Items
* 60 Reports
  * 600201 fieldSet for DDP report settings
* 80 User account
* 90 Misc

### Combining fieldSets
As of now there is a 1-1 relationship between form->fieldSet and grid->fieldSet. In order to combine more than one fieldSet we need to combine the forms or the grids. 

Example:
fieldSet 400001 (base fieldSet for controlpoints)
fieldSet 400002 (controlpoint events)
fieldSet 400106 (EB)
fieldSet 400107 (EB)
grid 4000001 (base controlpoint grid)
grid 4000002 (events grid)
grid 4000101 (EB) 
grid 4000102 (BL) 
combined grid: [4000001, 4000002, 4000101, 4000102] = combined fieldSets


## Form design elements
![[21179DD4-90CF-44C6-99B6-C8389F04F297.png]]


## PlanTrail Form engine, API documentation

### Overview
The form engine consists of three main parts:
* **formDefinitions** and **fieldSets** (metadata)
* **Form** (device independent component for all for form logic)
* **FormBuilder** (device specific component for UI rendering)

The `<Form>` component will take formDefinitions and fieldSets as input. The actual form will be rendered by `<FormBuilder>`.

#### Objectives
The goal is to use the form engine for all form rendering in both the web app and the mobile app. Therefore the functional demand is quite high on this component. The form engine handles all logic around the following areas:
* compiling chained/inherited formDefinitions from applied formIds, projectId and companyId.
* providing the FormBuilder with all necessary data and functions for rendering the form.
* processing validation-rules (i.e. simple dataType checks, required checks etc)
* processing “conditions”, i.e. advanced rules for the form appearance
* cleaning/transforming input data to correct datatypes upon form submit
* handling sub forms and provide information for animating these
* handling “sideCars”, i.e. special data not stored in the resulting form data, for example camera input, product selections, etc.

#### Installation
The form engine is packaged in a private npm package under @plantrail.
`npm install @plantrail/forms`

#### Usage
To render a form you need to provide the form engine with a FormBuilder component, which you need to build specifically for your environment. See below for details on how to create a FormBuilder.

The form engine also needs formDefinitions and fieldSets. This is static metadata which can be acquired via the API endpoint app/forms.

```
<Form
  formDefinitions={formDefinitions}
  fieldSets={fieldSets}
  compayId={companyId}
  projectId={projectid}
	formBuilder={FormBuilder}
  onSubmit={onSubmit}
  formData={initialData}
  formIds={[101, 102]}
/>
```

In addition to the above input arguments, the Form component also relies on an initialized i18Next configuration.

### Metadata
The form metadata (formDefinitions and fieldSets) is almost static, but when forms are updated at the server the clients should reflect this. For live updates the client can subscribe to socket messages which will tell the client when to refresh formDefinitions and fieldSets.

As of now, the client should cache formDefinitions and fieldSets locally.

### FormBuilder
The provided form builder need to follow certain design rules to ensure that all types of clients (currently **react** and **react-native**) will render the forms similarly.

All form logic and needed functions are exposed via context to FormBuilder and its child components. Use the hook `useFormApi` for this. Se below for complete documentation of useFormApi.

The main structure of the form is provided via `useFormApi.formDefinition`. This formDefinition is compiled from all the provided  `formIds`  as well as project- and company specific overrides for these formIds. The compiled formDefinition is list based in contrast to the input formDefinitions which are map based. The conversion from map to list is performed by the **Form** in order to make iterations easier in **FormBuilder**.

The formDefinition consists of items. Each item has a specific type. Some item types can have sub items. Currently the following itemTypes are available:
* field
* group
* formArray
* accordion
* section
* divider
* debugPanel

A simple form could consist of only **field** items. The formDefinition for such simple form could look like this. If “type” is omitted, the item will be treated as “field”.
```
formDefinition: {
  items: {
    firstname: {},
    lastname: {type: 'field'} //type is not necessary for field
  }
}
```

A more advanced formDefinition could look like this:
```
formDefinition: {
  items: [
    firstname: {},
    lastname: {},
    groupA: {
      type: 'group',
      properties: {flow: 'row'}
    }
  }
}
```


#### Render hierarchy
The hierarchy of the elements we need to render looks like this:

```
  formPageState.renderStack (
    items (
```

## Form Arrays
Form arrays allow you to create dynamic lists of form fields, where each list item contains a set of predefined fields. This is implemented using react-hook-form's useFieldArray.
### Terminology: formArray vs fieldArray
While react-hook-form uses the term 'fieldArray', we chose 'formArray' because it better describes the actual structure:
* A formArray is an array of mini-forms, where each array item is a complete form with multiple fields
* The term 'fieldArray' would imply an array of individual fields, which is not accurate
* Each array item is a self-contained form unit with its own set of fields under the FIELDS namespace

### ⠀Field Set Definition
In a fieldSet, a formArray can be defined at any level in the field hierarchy. The field with dataType 'formArray' contains a FIELDS object that defines the fields for each array item.
```
{
  section: {                       // Parent field
    details: {                     // Nested structure
      utokningar: {               // formArray can be at any level
        title: 'Utökningar',
        dataType: 'formArray',    // More accurate term for array of forms
        FIELDS: {                 // Container for array item fields
          omfattning: {           // Field definitions for each array item
            title: 'Utökningens omfattning',
            dataType: 'string',
            isMultiline: true
          },
          anlaggarfirma: {
            title: 'Anläggarfirma',
            dataType: 'string'
          }
        }
      }
    }
  }
}
```

### Form Definition
In a formDefinition, the formArray item references the full path to the array field:
```
{
  'section.details.utokningar': {              // Full path to formArray
    type: 'formArray',                         // Consistent terminology
    pos: 100,
    items: {                                   // Layout for array item fields
      'section.details.utokningar.FIELDS.omfattning': {  // Full field path
        pos: 10
      },
      'section.details.utokningar.FIELDS.anlaggarfirma': {
        pos: 20
      },
      divider: { type: 'divider' }             // Regular form items supported
    }
  }
}
```

### Field Naming
* Field names follow the pattern: path.to.array.FIELDS.fieldName
* The FIELDS segment clearly indicates array item fields
* Full field paths are used throughout for consistency
* While using react-hook-form's useFieldArray internally, our naming better reflects the structure

## Field Aliases in Form Arrays
### Problem Statement
When working with form arrays, we encounter two main issues:

1. Long and complex field names (e.g., `formArrayField[0].section.details.utokningar.FIELDS.anlaggarfirma`)
2. Incompatibility of dot notation with react-hook-form, which converts it to an object hierarchy

### Solution: Field Aliases
To address these issues, we introduce the concept of field aliases for form array fields.

#### Alias Creation
- All field names that include `.FIELDS.` are converted to aliases.
- Dots in the original field name are replaced with dashes.
- Example: `section.details.utokningar.FIELDS.anlaggarfirma` becomes `section-details-utokningar-FIELDS-anlaggarfirma`

#### Output Field Names
- Each alias field is assigned an `outputFieldName`.
- The `outputFieldName` is the last part of the original dot-notated name (the leaf node).
- Example: For the alias `section-details-utokningar-FIELDS-anlaggarfirma`, the `outputFieldName` would be `anlaggarfirma`.

### Implementation
#### 1. Form Preparation (selectors.prepareForms)
- Converts relevant field names to aliases.
- Adds alias fields to `fieldSet.fields`.
- Creates conversion maps in `fieldSet.formArrayFields`:
  - `toOutput`: Maps aliases to outputFieldNames.
  - `fromOutput`: Maps outputFieldNames to aliases.

#### 2. Input Data Conversion (dataTypes.fromInputToComponent)
- Converts input formData from outputFieldNames to aliases before passing to react-hook-form.
- Example: `anlaggarFirma` is converted to `section-details-utokningar-FIELDS-anlaggarfirma`

#### 3. Output Data Conversion (dataTypes.fromComponentToTyped)
- Converts output formData from outputFieldNames to aliases before data is returned from getTypedData. N.B. getOutputValues calls getTypedData before outputting values.
- Example: `section-details-utokningar-FIELDS-anlaggarfirma` is converted to `anlaggarFirma`

### Benefits
- Ensures compatibility with react-hook-form by avoiding dot notation.
- Maintains readability in input and output data by using simple field names.
- Preserves the full field path information for internal processing.

### Note
Only formArray fields that are actually used in the formDefinition are processed for alias creation.

## Form Data Structure
The resulting form data maintains the complete field paths:
```
{
  section: {
    details: {
      utokningar: [               // Array of forms, not just fields
        {
          "section.details.utokningar.FIELDS.omfattning": "text here",
          "section.details.utokningar.FIELDS.anlaggarfirma": "company name"
        },
        {
          "section.details.utokningar.FIELDS.omfattning": "more text",
          "section.details.utokningar.FIELDS.anlaggarfirma": "another company"
        }
      ]
    }
  }
}
```


## useFormApi
```
    control,
    Controller,
    setValue,
    getValues,
    handleSubmit,
    reset,
    formState,
    formDefinition,
    conditions,
    fieldSet,
    dispatchCondition,
    calcUIState,
    sideCarMethods,
    sideCarState,
    popSubForm,
    subFormAnimationFinished,
    pushSubForm,
    formPageState,
    debug: {
      uiState,
      debugState,
      toggleShowPaths,
      toggleShowData,
      toggleShowI18n,
      toggleShowConditions,
      toggleShowErrors,
      toggleShowRenderCount,
      toggleShowDebugData,
      debugData,
      setDebugData,
    },
```

### Brainstorm 2024-10 with Claude about formArrays
Key Points from FormArray Brainstorming Session:
1 Initial Challenge:
	* Implementing fieldArrays where each array item is a mini-form
	* Needed structure for both fieldSet and formDefinition
	* Required clear naming convention for field references
2 Evolution of Structure:
	* Started with using 'owner' property to associate fields with array
	* Considered stripping array markers in output for DX
	* Realized keeping full field names was better for:
		* Direct field lookups
		* Condition rules
		* Form data mapping
3 Naming Iterations:
	* Started with ITEM/ITEMS
	* Discovered potential confusion with form 'items'
	* Switched to FIELDS to:
		* Avoid confusion with form items
		* Match react-hook-form terminology
		* Better describe array item contents
4 Key Decisions:
	* Chose 'formArray' over 'fieldArray' because:
		* More accurately describes an array of forms
		* Each array item is a complete form unit
		* Distinguishes from arrays of individual fields
	* Kept FIELDS marker in field names for:
		* Clear indication of array item fields
		* Unique field names in database
		* Consistent reference format
5 Final Structure Benefits:
	* Clear hierarchy in both fieldSet and formDefinition
	* Support for nested formArrays at any level
	* Consistent field naming across all contexts
	* Clean integration with react-hook-form
	* Clear field references for conditions and rules

⠀This evolution shows how we refined the structure to balance:
* Technical requirements (unique field names, proper references)
* Developer experience (clear structure, logical naming)
* System integration (react-hook-form compatibility, condition handling)


## Brainstorm 2023-06
- [ ] form = hierarchy of items + form/field-conditions
- [ ] field-set = list of field definitions + field-conditions

Fields in a fieldSet cannot be overridden. A Fieldset can be augmented with more fields on a per company or per project basis. If a company desperately needs to override the spec for field in a fieldSet they need a company specific field instead.

IDEA: Maybe field can be overridden with a special suffix?
a company specific field has a $c suffix, eg `address$c4`
a company specific override might have `address$$c4`, which essentially replaces `address`

- [ ] Overridden fields must exists within the same fieldSet. Check this with:
  - [ ] is_override boolean field
  - [ ] calculated and stored `overridden_fieldname`
  - [ ] FK  `field_set_id, overridden_fieldname` -> self ref `field_set, fieldname`

We gain the following with this concept:
- [ ] All fieldnames within a fieldSetId are unique
- [ ] Fields can be added per company or project
- [ ] Fields can be overridden per company or project
- [ ] A fieldSet gives the complete fieldList for dependent forms, i.e. no need to chain fieldSets

### Company or project specific overrides
Company or project can override firms and field-sets by:

#### field-set
- [ ] adding fields to field-set
- [ ] alter existing field in field-set (except for some core params such as dataType)
- [ ] adding conditions to a field-set
- [ ] alter existing conditions in a field-set (including disabling conditions)
- [ ] field-set overrides or chaning can **never** remove fields

A fieldSetField can be “base” (compnany=0, project=0) OR company specific OR project specific (not company and project at the same time).

The following field naming convention will protect against clashes. The naming should be enforced with a check constraint.
- [ ] base -> no prefix in fieldname (cannot  include a $ sign)
- [ ] company -> fieldname MUST end with $c##, where ## is companyId
- [ ] project -> fieldname MUST end with $p##, where ## is projectId
- [ ] company+override -> fieldname MUST end with $$c##
- [ ] project+override -> fieldname MUST end with $$p##

#### form
- [ ] add items to form
- [ ] alter existing items in a form (including hiding the item)
- [ ] add conditions to a form
- [ ] alter existing conditions in a form (including disabling conditions)
- [ ] items cannot be removed by overriding/chaning, but they can be hidden by setting the position to a negative number, i.r. `pos: -1`

-


### Chaining forms
Forms can be concatenated, i.e. merged together. Ordering a merged form should be as easy as stating multiple formIds in an array, i.e. [1,13,44].

Chaining forms includes chaining all related field-sets.

field-set:
original. (1)
  company specific. (1$c4)
    project specific (1$p3). 

form:
original. (101, fieldSet:1)
  company specific. (101$c4, fieldSet 1+1$c4)
    project specific (101$p3, fieldSet 1+1$p3).
chained (102, no new fieldSet, i.e. 1 + 1$c4) 
  chained (102$c4, fieldSet 2$c4, i.e. 1 + 1$c4 + 2$c4) 

- [ ] Chaning forms/fieldSets is almost the same as extending at company or project level.
- [ ] chained fieldSet has no constraints towards fieldSets above in the chain
- [ ] chained forms must have it’s fieldNames in the total field-chain
- [ ] a form needs to reference a fieldSet which includes all used fields, either in the base fieldSet or in the company/project specific set if the form is company/project specific

- [ ] Each form MUST reference a fieldSet which has a spec for all fields used in the form. I.e. a form must be able to stand on its own even if it’s mostly used to override another form.

If a form override need to both reference existing fields AND add new fields, this has to be done in two steps. 
Ex:
fieldset 1: name, address, city
form 10: name, address  (ref fieldSet 1)

form 20: city  (ref fieldSet 1)

fieldSet 2: phone 
form 21: phone (ref fieldSet 2)

To render the complete chain we need forms [10,20,21]


- [ ] project specific !== company specific due to transportability of projects

### Transfering projects to another company
- [ ] Some warning is needed if a project is transfered and receiving company is missing some company specific fields.


## Brainstorm 2023-02
- [ ] A `form` is always tied to a `field_set`
- [ ] Forms and fieldSets can exist in multiple variations (per company and per project), aka `form_def` and `field_set_def`
- [ ] Each form_def has form_items
- [ ] Each field_set_def has fields

- [ ] each form has an id, companyId and projectId
- [ ] forms are chainable [1,34,12]
- [ ] a form defines the item hierarchy
- [ ] an item can reference a field in the fieldSet if itemType = field.
- [ ] if field is referenced, it must exist in the fieldSet



Example
* field_set  “brandtätning” (10, 0)
  * room
  * workNotes
  * other

* form “brandtätning, work finished” (101, 0)
  * room
  * workNotes, pos 10 5

* form “brandtätning, preview” (102, 0)
  * room
  * workNotes
  * other

company specific fieldSets can add new fields and conditions or override
* field_set  “brandtätning, BCN” (10, 1)
  * otherRoom$c1. (non overridden fields are sufficed with company/project)
  * room

* form “brandtätning, work finished for BCN” (101, 1)
  * otherRoom$1
  * workNotes, pos=10. (override position for room field)



![[Kaptivo-ZKVQND_2022-01-20_17-26.png]]

## ItemTypes
- [x] Items (collection of Item)
- [x] ItemContainer
- [x] Item
- [x] ItemTitle
- [x] ItemDivider
- [x] InputField

### ItemCollections
- [x] InputAccordion
- [x] InputGroup
- [x] InputSection 

- [x] SectionHeader
- [x] PreviewSection
- [x] FormSectionSymbol
- [x] PreviewField
- [x] DebugPanel

## Input Types
- [x] TextInput
- [x] Checkbox
- [x] Segmented

- [x] SegmentedHierarchy  (90% finished) 


- [ ] Textinput, numeric (90% finished)
- [x] Switch
- [ ] MultiSelect (from lookup dataset or static list)
- [ ] Single select (from lookup dataset or static list)

## DataTypes
- [x] DataType conversion
- [ ] Check for valid types  (90% finished)
- [ ] Input patterns  (90% finished)

## External ItemType (SideCar)
- [ ] Media
- [ ] Product
- [ ] QR
- [ ] other

## Lookup
- [ ] Inject lookup lists
- [ ] Email addresses
- [ ] Drawings
- [ ] Layers
- [ ] etc..

## Database
- [ ] Decide on structure
- [ ] Api
- [ ] Redux sync


## Conditions
- [x] In form
- [ ] In database
- [ ] Create deviations

## Preview definitions
- [ ] Inline with form (section preview)
- [ ] Separate definitions (controlpoint: full, minimal, compact, etc)

## Buttons
- [x] Optional save/cancel-buttons
- [x] Callback is no buttons
- [x] Avoid keyboard

## Animations
- [x] Scroll to saved position on "back"
- [ ] Debug glitch in page animation
- [ ] Config change animations (hide/reveal items)
- [ ] SegmentedHierarchy and Segmented could use some animations
- [ ] Accordion needs animation

## Config
- [ ] Live config updates for fields
- [ ] Live config updates for valitations
- [ ] Live config updates for conditions
