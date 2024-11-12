# Controlpoint categories in PlanTrail
#plantrail/controlpointTypes

## Background
Some clients need to categorise controlpoints. As of today we do not have any means of categorising controlpoints so they can be view or added to reports based with different filters.

We do have “layers”, but layers are overkill for a simple categorisation of controlpoints. Layers are integrated in our permission system, as well as our sequence system (identifier sequences). The layer function should be primarily used for cases when separate permissions and/or separate identifier sequences are needed.

We also have a proposal for a tag system [[Tags in PlanTrail]]. Tags and categories are similar, but have a distinct difference; a single controlpoint can only belong to a single category, whereas tags can be assigned in multiples to a single controlpoint.

## Use cases
### Filter
Categories could be used to filter controlpoints in the app as well as in reports.
### Grouping
Controlpoint lists in reports could be grouped on categories. This is not something that would be possible with tags [[Tags in PlanTrail]], since a single controlpoint can be assigned multiple tags,
### Symbols
A category could have one or more symbols assigned. The controlpoint would get the default symbol and the symbol could be switched if multiple symbols are available to a category.
### Journal form
A category could define changes to the journal form. I.e. if a specific category is assigned, the journal form could reveal additional input fields.

Form configs based on categories could be our way to be more flexible, like most of our competitors, but without being sloppy and hard to work with (as most of our competitors =).
### Controlpoint labels
The category mnemonic could be rendered in the controlpoint label, much like “layer” and “flag text” can be today.

## Category definition
* Categories need a usage scope (e.g., “project” or “company”).
* Creating new categories should be simple and limited to users with specific permissions.
* Category names could be translated, with a future UI for Locize translations.
* A category could define one or more formIds for adding fields to a form when the category is activated.
* Categories should be defined “globally”, and referenced when used in a scope. See example.
### Transfering categories between companies.
Consider the following:
1. Company A defines company scoped category “Fire extinguisher”
2. “Fire extinguisher” is assigned to a controlpoint in project X
3. Project X is transfered to company B

By design, a controlpoint in the database can point to any category, regardless of scope. This makes it possible for a project to be transfered even if the category does not exist in the new owner company. The client needs to be aware of this and show a warning for “invalid category”.

A future solution could also be to automatically copy relevant categories from the source company to the target project. This way the categories can still be used for filtering etc in the new project.

### Categorise the categories
Categories might need different contexts, similar to “albumId” for photos, to separate them in selection components and filters.
Examples:
* Context: “inventory category”
* Scope: company X
* Tags: “fire extinguisher”, “Battery powered sign”, “Automatic fire door”



## Assigning categories to controlpoints
Categories should be assigned via journalItems. A new input component is needed, which must be intuitive and efficient.

### Drop down list
For the web app we should use ordinary dropdown selectors. N.b. these need to be “single select” as opposed to tag selections which needs to be “multiselect”.

### Our category selector


## Update, Insert, Delete
### Insert new category
Creating a new category can be performed if the user has the correct permission. No other controls that permission control is needed, since creating new categories does not affect any existing categorisations.

### Deleting a category
The user needs permission to delete a category. The category will not actually be deleted, but instead marked as deleted. No existing categorisation will be affected, since the category still exists. New controlpoints cannot be assigned to a deleted category.

The client needs to be aware of the `deleted_at` property and filter out all deleted categories in selection fields. If an old controlpoint is updated with a new journalItem, we need to be able to show the deleted category if this is the currently selected.

Deleted categories should be rendered differently if they are visible.

### Updating a category
Updating an existing category is tricky. All controlpoints which are already assigned to the updated category will change. This contradicts our journal-based system where a controlpoint can only be updated via journalItems.

The user needs permission to update a category, but this is the simple part. How should we handle the rest?

One solution would be to treat categories as immutable. An update is simply a creation of a new category and a deletion of the previous category. This way we can preserve all existing controlpoints as they are.

What if the update is simply a spelling correction? Maybe we need a way to update existing categories for simple cases.

## Solution
ControlpointCategories is now a separate sync-domain, i.e. every change in the table `controlpoint_category` will result in a socket message to dependent users with an active login. The client can sync categories via the endpoint /controlpoint-categories, which in turn calls the database function `get_controlpoint_categories`

ControlpointCategories can have three scopes:
1. system
2. company
3. project

Both the socket message and the get_controlpoint_categories function takes the scope into account so no more than the affected users gets notified.

Each defined category belongs to a group, groups are defined in a table with the name `controlpoint_category_group`. When a category field is used in a form, the groupId needs to be stated in order for the input field to only show the intended categories.