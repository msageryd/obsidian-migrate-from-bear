# WIP.. FormDef Structure
#plantrail/forms

## 2022-02-02: The below is WIP. just scrap-booking for now..


The structure of fieldDefinitions, formDefinitions and previewDefinitions need to be decided upon. Here are some thoughts.

* A formDefinition can only use fields which are specified in fieldDefinition(s)
* Many forms will have a 1-1 relationship with it's field definition
* Previews for a controlpointType will need access to all fieldDefs for the controlpointType, i.e. filedDefs from all journalItem formDefs

*

Example:
More than one journalItem form might need to use field `workNotes`, hence workNotes must be defined in common fieldDef. Most likely this common fieldDef is the complete fieldDef for a particular controlpointType.

### Conclusion
1. FormDefs and previewDefs are always linked to one fieldDef
2. Each formDef can only have one fieldDef
3. Each previewDef can only have one fieldDef
4. I.e. fieldDef is master, formDefs are details
5. Augmented formDefs can exist per company and/or per project
6. Augmented fieldDefs can exist per company and/or per project
7. 
8. FormDefs can be chained, but only if they share the same fieldDef


### Sample forms
#### JournalItem forms
* 

JournalItemForms (1001, 1002, 1003,..) -> fieldDef (1000)
JournalItemForms (3001, 3002, 3003,..) -> fieldDef (3000)
ProjectInfo (9001) -> filedDef (9001)
BlueprintInfo (99991) -> fieldDef (99991)
UserProfile
Report form
Report preflight form
Login form
Settings forms

### Sample previews
Controlpoint, compact, full, minimal, etc
ProjectInfo
BlueprintInfo
etc..

