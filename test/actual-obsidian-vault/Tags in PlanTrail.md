# Tags in PlanTrail
#plantrail/forms

## Background
We need a categorization tool for control points. Customers also request automatic text input for repetitive texts. These needs might be combined in a tag function, or a “super-tag” function, similar to those in applications like Tana, AnyType, Heptabase, and Logseq.
Currently, control points can be categorized using “layers,” but a control point can only belong to one layer. Tags offer a more flexible solution with the following differences:
* A control point can have multiple tags.
* Tags are not controlled via access control lists (ACL).
* Tags can include additional information (e.g., deviation texts).

## Use cases
### Filter
Tags can be used to filter control points for reports or visibility in the app, similar to layers.
### Repetitive texts
Tags can store predefined texts that automatically fill repetitive text fields, such as deviation texts for multiple inspection points. While this doesn’t fully automate text input, it offers advantages:
* Translatable texts via Locize using unique tag IDs.
* Commonly defined tags for shared problems instead of repeating texts.

Custom texts should be stored in the journal item to avoid altering historical data if tag texts are updated. The tag system should define:
* The data.
* The target field (e.g., “deviationNotes”).
* The storage field for the data (e.g., “deviationNotesAutoText” if the target field is “deviationNotes”).

⠀Custom texts should only be applied if the target field is visible in the same form and should be optional (e.g., with a trash-can symbol to delete).
Alternatively, tag texts could be directly added to the target field upon tag selection.

### (Non controlpoint usage)
A common tag system could be used for other objects, such as projects, users, or drawings. The system should be designed to be open-ended and not specific to control points.
### (Shape look)
Tags could define a shape look for control points, such as a dotted halo, for future development.
### (Symbols)
Tags could be associated with symbols, although this might cause conflicts when multiple tags with different symbols are applied to a control point.
### (Super-tags)
Super-tags allow tags to have associated forms for structured data input. This could transform the tag system into a dynamic form builder, especially useful for documentation control points. For example, selecting tags “concrete” and “outdoor” could add fields for “Quality,” “K-value,” “Temperature,” and “Humidity” to the form.

## Tag definition
* Tags need a usage scope (e.g., “project” or “company”).
* Creating tags should be simple and limited to users with specific permissions.
* Tags names could be translated, with a future UI for Locize translations.
* Custom information added to a tag requires specifying a storage field.
### Tag the tags
Tags might need different contexts, similar to “albumId” for photos, to separate them in selection components and filters.
Examples:
* Context: “problem category”
* Scope: company X
* Tags: “carpentry,” “painting,” “concrete,” “electricity”

## Assigning tags to controlpoints
Tags should be assigned or removed via journal items. A new input component is needed, which must be intuitive and efficient.

### MUI tag selector
The MUI library we are using for the WebApp has a tag component in the form of a drop down + badges. It works like a multiselect where the selected items are visualised as badges.
![[fed96507-da33-47bc-8769-739851423adb.png|408]]

### Our tag selector
Drop down menus are not suitable for mobile apps, but we could come up with something similar. Maybe something like the following.

The lower part consists of recently used tags and a “…” button for opening up a complete tag list if all tags cannot fit. A “+” button is easily accessible for creating new tags (is permission is granted to the user).

Company scoped tags could have a company symbol for clarity (is this needed?)

Selected tags moves up to the selected area (blue)
![[image 2.png|530]]

Another approach could be to make the tag component slightly higher and make the bottom part scrollable to fit all available tags. This might be confusing, though, since the section itself lies within a scollview.
![[image 3.png|514]]

### Usage of tags with custom data
If a tag has custom data assigned, this data should be applied to the formInput and visualized separately from the target form field.

Example:
User selects two tags for a controlpoint, “My tag” and “My other tag”. Both of these holds custom data as per the following.

| Tag          | Data         | DataField      |
|--------------|--------------|----------------|
| My tag       | Sitter snett | deviationNotes |
| My other tag | Ful färg     | deviationNotes |

The journal input form would look like this:
![[image 4.png|571]]