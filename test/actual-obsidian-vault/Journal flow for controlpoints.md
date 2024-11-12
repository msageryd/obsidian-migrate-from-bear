# Journal flow for controlpoints
#plantrail/controlpointTypes

## Background
A controlpoint cannot be directly altered. All changes to a controlpoint must be performed via journalItems. A journalItem can alter the following characteristics of a controlpoint:
- altering data via form input such as notes, categorisation, etc
- clearing properties (e.g approving a fireseal will clear any existing caveatNotes)
- changing layer
- change controlpointLevel, i.e. the color of the flag (this is implied via deviations)
- symbol
- shape type and coordinates
- changing drawingId (currently only via special admin journalItem)
- create new deviations
- resolve old deviations

A key feature in PlanTrail is the controlled flow of journalItems throughout the lifecycle of a controlpoint. The flow control is based on rules in controlpointTypes and in journalItemTypes as well as roles granted to the user.

Currently the flow control is defined in controlpoints and roles, but executed via code directly in the mobile app. We need to standardise our flow engine so it can be used in the web app as well.
## Goal with this document
The goal with this document is to explain and simplify our journalItem rules enough to implement them into a separate library.

The library should have functions for:
- calculating allowable controlpointTypes based on input parameters
- calculating the resulting journalItem, i.e. creating/resolving deviations etc
- calculating the influence a journalItem will have on a controlpoint for optimistic client side updates (the final controlpoint calculation will be performer at the server)
- check for allowed coordinates beforehand, e.g. prohibit coordinates outside of a drawing region
- calculating a set of menuItems, one for each allowed journalItemType. The menuItem definition should define the UI of the menu (colors, names, icons) as well as metadata for creating each allowed journalItemTypes.
- All calculations needs to take into account a new param, “context”, which describes the context in which to show a journalItem menu. Our “old” context is “blueprint”, i.e. the menu will be showed in a blueprint view. A new context will be “list” for use in a controlpoint lists where, for example, a “move” journalItem would not make sense.

### API changes
Some of the definitions in this document describes a new, more concise API than the current one. There is room for improvements in this area.

## Flow control by role
Roles can be granted to a user on company- project- or layer level. The different grant levels all ends up with a calculated set of roles at layer level. Company and project roles are inherited down to layers.

Roles can define several access and permission related stuff. The following relates to journal flow:
- which controlpointTypes can the user create on the current layer in the current project
- which controlpointTypes can bee seen but not touched (i.e. no possible journal flow)
- which journalItemTypes can be created on a particular controlpointType on the current layer
- which journalItemTypes can be seen but not touched on a particular controlpointType on the current layer
## Flow control by specification in controlpointType
A controlpointType defines several parameters to govern the flow control of journalItems.
### Allowed journalItemTypes
Each controlpointType specifies a list of allowed journalItemTypes. Only journalItems of the specified types are allowed to operate on this particular controlpointType.

ParameterName:
`journalItemTypeIds: integer array`

### Automatically open a journalItem form
A controlpointType can specify if a specific journalItemType should be automatically opened when the controlpoint has been created. This feature is utilised in inspection controlpointTypes where the inspection form is always automatically opened when a controlpoint is created.

Parameter name:
`autoOpenJournalItemTypeId: integer`

## Flow control by specification in journalItemType
A journalItemType can define `actions`, i.e. stuff that will happen to the associated controlpoint and `preconditions`, i.e. stuff that must be true for the journalItem to be allowed. Currently a journalItem explicitly specifies its input form under the `ui` property. This is subject to change when we are fully migrated to the new form engine.

### Actions
“actions” will be the new name for stuff that will happen to the controlpoint. Currently actions are defined both in the body of the journalItem and in `ui.effects`.

#### Resolving deviations
A journalItemType can specify which deviationTypes can be resolved by the particular journalItemType. If a controlpoint has any of the specified deviations unresolved, these will be resolved when the journalItem is created. Resolving deviations can potentially lead to a new levelId (color) for the controlpoint. When a controlpoint has no unresolved deviations it’s considered fully resolved, i.e. levelId=1000 and color=bright green.

Parameter name:
`resolveDeviationTypes: array of deviation objects`

Example:
`FireSealing.workCompleted` (i.e. yellow hammer) will create a deviation of type 701 (yellow) and optionally 601 (orange).

#### Creating deviations
A journalItemType can specify any new deviations to be created. When the journalItem is processed deviations of defined types will be created, potentially leading to a new levelId (color) for the controlpoint.

Parameter name:
`createDeviationTypes: array of deviation objects`

Example:
`FireSealing.workCompleted` (i.e. yellow hammer) will resolve deviations of type 501 and 601 (i.e. red and yellow).

#### Clearing property fields
Some property fields are closely associated with a specific deviationType. An example is `caveatNotes`. The “approve fireseal” journalItem will clear any information stored in the caveatNotes property, since the caveat is resolved. N.B. the clearing only occurs on the controlpoint. The original journalItem which created the caveat will, of course, be untouched.

### Preconditions
#### Only allowed on specified levelIds
A journalItemType can be defined to only be allowed on specific levelIds.

Parameter name: 
`onlyOnControlpointLevelIds: boolean`

Example:
`FireSealing.workCompleted` (i.e. yellow hammer) is only allowed on levelIds [500,600] (i.e. red or yellow).

#### Only allowed when resolvable deviations exists
A journalItemType can be defined to only be allowed on controlpoints with unresolved deviations of a type which this journalItem can resolve.

Parameter name:
`onlyOnResolvableDeviations: boolean`


#### Only allowed to operate on own controlpoints
Some roles limits the users ability to operate on other’s controlpoints. The definition of “others” is if any one but the current user has created journalItems on the controlpoint i.e. the array`controlpoint.modifiedByIds` includes other userAccountIds than the current.

Parameter name:
`onlyOnOwnControlpoints: boolean`

Example:
JournalItemType 4 = “Move own controlpoint” has this property set to true.
JournalItemType 5 = “Move controlpoint” does not have this property.

#### In which context will the journalItem-meny be resented?
If the context parameter is defined in the journalItemType it means that the journalItemType can only be used within the enlisted contexts.

One usage example would be for the “move” journalItemTypes. Since the move type operates on blueprint coordinates, defining the graphical shape, it only makes sense while in a blueprint view.

Parameter name:
`context: array of strings`
possible values: 'blueprint', ‘list’


## Example journalItemType

Here is the definition of the journalItemType 111010, i.e. “EB inspection”.

An inspection journalItem will automatically resolve any unresolved inspection deviation (i.e. besiktningsbeteckningar).

All creation of new deviations are optional. This will be decided based on the users choice in the journal form (i.e. selecting a besiktningsbeteckning).

The property field “notInspectedOnSite” can be set when an inspection controlpoint is approved. If a new inspection journal is created after approval we need to clear any information given in the previous approval, since this approval apparently is not valid anymore.

This journalItemType can only be created when resolvable deviations exists on the controlpoint.

``` 
{
 id: 111010,
  name: 'Inspection base info',
  description: '',
  semver: '1.0.0',
  resolveDeviationTypes: [
    { deviationTypeId: -1, auto: true },
    { deviationTypeId: 111101, auto: true },
    { deviationTypeId: 111501, auto: true },
    { deviationTypeId: 111502, auto: true },
    { deviationTypeId: 111503, auto: true },
    { deviationTypeId: 111301, auto: true },
    { deviationTypeId: 111901, auto: true },
    { deviationTypeId: 111902, auto: true },
    { deviationTypeId: 111951, auto: true },
  ],

  createDeviationTypes: [
    { deviationTypeId: 111101, isOptional: true },
    { deviationTypeId: 111301, isOptional: true },
    { deviationTypeId: 111501, isOptional: true },
    { deviationTypeId: 111502, isOptional: true },
    { deviationTypeId: 111503, isOptional: true },
    { deviationTypeId: 111901, isOptional: true },
    { deviationTypeId: 111902, isOptional: true },
    { deviationTypeId: 111951, isOptional: true },
  ],
  clearPropertyFields: [{ fieldName: 'notInspectedOnSite' }],

  targetLevelId: 1000,

  isActive: true,
  definition: {
    preconditions: {
      onlyOnResolvableDeviations: true,
    },
    ui: {
      title: 'i18n',
      performedByVerb: 'i18n',
      menuItem: {
        iconName: 'materialCommunity|clipboard-text-search',
        iconColor: '##tint.dark',
        iconLibrary: 'Ionicons',
        group: 'evaluate',
        sortOrder: 320,
      },

	... 
    here follows the embedded form definition which
    will be migrated to formIds
    ...
  }
}
```