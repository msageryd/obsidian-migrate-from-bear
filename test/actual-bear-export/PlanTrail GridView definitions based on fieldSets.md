# PlanTrail GridView definitions based on fieldSets
## Background
PlanTrail should have the best-in-class grid view for working with controlpoints. The grid should fullfill the following:
- be fast
- be customisable regarding:
  - visible columns
  - column order
  - column sorting
  - column grouping
- user should be able to save customised layouts
- excel export
- creating journalItems, i.e. make journaled changes on controlpoints
  - journal rules applies, i.e. status, roles, etc should be taken into account for each controlpoint
- realtime synced with the server
## AG Grid
PlanTrail uses AG Grid for presenting data in grid form. 
[High-Performance React Grid, Angular Grid, JavaScript Grid](https://www.ag-grid.com/)

AG Grid has features for letting us solve all our needs.
## UI
### ControlpointTypes
Each controlpointType needs to define a fieldSet. Some fields will be shared among multiple controlpointTypes and some will be proprietary. When a field is shared, i.e. a field with the same fieldName exists in multiple fieldSets, constraints in the database ensures that the field has the same datatype in each version of the field. This makes it possible to consolidate multiple fields in one grid column.

Depending on included controlpointTypes a field list should be presented to the user for customising the view.

Since controlpointTypes are such a central thing we might want to add controlpoint-type filter as a major setting in the grid. I.e. maybe a list of controlpointTypes to check/uncheck above the grid?

### Column selection
AG Grid has a standard way of selecting columns for a view. We will use this standard for selecting columns.

## Data model
We need to model the grid definitions to match form definitions, i.e. a form is always related to a fieldSet. In the same way, a grid should be related to a fieldSet. This way we will reuse our fieldSets for grids.

### Data types
AG Grid has support for some dataTypes out of the box. PlanTrail has some proprietary dataTypes which we need to build custom formatters or custom components for. A mapping between AG dataTypes and PlanTrail dataTypes is needed.

PlanTrails proprietary types will need to be defined in AG grid via `DataTypeDefinition`.

PlanTrail dataTypes:
|                                                              |                                                           |
|--------------------------------------------------------------|-----------------------------------------------------------|
| stringCollection<br>string<br>segmentedHierarchy<br>segmented<br>number<br>integerCollection<br>integer<br>guidCollection<br>guid<br>firesealDuctDimensions<br>fileRefCollection<br>fileGuid<br>boolean | text<br>number<br>boolean<br>date<br>dateString<br>object |

### Column definitions
We need to provide our grid with a column definition object. This object should be generated from our fieldSets. If more than one controlpointType exists in the dataset the fieldSets for each controlpointType should be merged. If more than one field with the same name exists, these should be merged into one column definition.

PlanTrail fieldSets are objects, keyed with the fieldname of each field. AG column definitions looks like this in it’s simplest form:
```
[
  { field: 'athlete' },
  { field: 'sport' },
  { field: 'age' }
]
```

### Grid definitions
Just like a `formDefinition` specifies how to use fields in a fieldSet, we need to define gridDefinitions for usage of fieldSets in grids.

A gridDefinition should define the following (on top of what’s already available in the fieldSet)
- column order (the default order. User can reorder columns)
- special functions if needed, i.e. click handlers, etc
- specifying column groups/hierarchies

field = fieldPath
colId = fieldName
cellDataType = mapped dataType
headerName = locize:d title for the field
headerTooltip = locized titleTooltip for the field
aggFunc = sum, min, max, count, avg, first, last
allowedAggFuncs = array of UI selectable agg funcs

groupId = field group id
children = fields in the field group



valueGetterName = string to activate a valueGetter function
valueFormatterName = string to activate a valueFormatter function


Maybe use `refData` for simple lookup columns?
`keyCreator` might be used for translated fields where key = integer
`columnGroupShow` defines if column is shown when grouped upon ‘open’/‘closed’
`enableCellChangeFlash`  = visualize updates
`context` Attach arbitrary app data to the column definition

`contextMenuItems` might be used for creating journalItems, etc
[React Grid: Grid Options Reference](https://www.ag-grid.com/react-data-grid/grid-options/%23reference-accessories-getContextMenuItems)




const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete" },
    { field: "age", minWidth: 100 },
    { field: "hasGold", minWidth: 100, headerName: "Gold" },
    {
      field: "hasSilver",
      minWidth: 100,
      headerName: "Silver",
      cellRendererParams: { disabled: true },
    },
    { field: "dateObject", headerName: "Date" },
    { field: "date", headerName: "Date (String)" },
    { field: "countryObject", headerName: "Country" },
  ]);

## Grid state
Users can modify the layout in many ways. All layout changes, including filter, sorting, grouping, etc can be retrieved as a grid state object. 
https://www.ag-grid.com/react-data-grid/grid-state/

We want to save grid state objects for later reuse. The state should be saved with a scope similar to report templates, i.e. user, project or company. 

Each saved gridState (aka grid layout) must have a name, a type, a scope and scope identifiers. We will save gridStates in a database table like this:

| Column        | Description                               |
|---------------|-------------------------------------------|
| guid          |                                           |
| grid_type_id  | controlpoints/projects/drawings/users/etc |
| created_by_id |                                           |
| company_id    | scope identifier, defaults to 0           |
| project_id    | scope identifier, defaults to 0           |
| scope_id      | system/company/project/user               |
| name          | User selected name                        |
| description   | User applied description                  |
| state         | Json object with the actual grid state    |
| column        | array                                     |

### GridState vs column definition
At the time a gridState is saved, a specific column definition will be active. Column definitions are tied to controlpointTypes. If a gridState is restored with a different column definition active, the grid we need to handle this discrepancy.
- if columnDefinitions are missing the gridState should be restored without these columns
- we should probably tell the user that the “grid layout” is saved for a different set of columns
- what should happen if the same gridState is saved after being restored with missing column, definitions?
  a. remove columns from the grid state and save
  b. keep the “missing columns” and update the new columns
  c. don’t allow saving
### User experience
We need to make the UX as easy and smooth as possible when it comes to saving and restoring grid layouts.