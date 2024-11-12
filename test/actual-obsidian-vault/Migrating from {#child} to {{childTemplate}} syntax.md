# Migrating from {#child} to {{childTemplate}} syntax
#plantrail/reports


## Benchmarking
Report: 107.1
Project: 134 (Juno)
Render time with old child syntax: 600+ seconds

Render time with the worst child calls converted to childTemplate: 140 sec



## 107
## All variants
{#child child-controlpoint-statistics-chart @template.recipe=html @data.chartHeight=6cm @data.chartWidth=100%}

{#child toc @template.recipe=html}

{#child child_company_presentation @template.recipe=html}

{#child child_signature_list @template.recipe=html}

### Each level 200
{#child child_deviation_page2 @template.recipe=html @data.drawingIndex={{*@..//index}} @data.controlpointIndex={{*@index/}}}

### Each drawing
{#child child_107.1.table @template.recipe=html @data.drawingIndex={{*@index*}}}

{#child child_107.2.table @template.recipe=html @data.drawingIndex={{*@index*}}}

{#child child_107.4.table @template.recipe=html @data.drawingIndex={{*@index*}}}

{#child child_107.5.table @template.recipe=html @data.drawingIndex={{*@index*}}}

{#child child_107.6.table @template.recipe=html @data.drawingIndex={{*@index*}}}

{#child child_107.7.table @template.recipe=html @data.drawingIndex={{*@index*}}}

## Variant = 3
{#child child_107.3.table @template.recipe=html}

## child_107.1.table
No children

## child_107.2.table
### each controlpoint
{#child child_blueprint_with_controlpoint2 @template.recipe=html @data.drawingIndex={{*@root.drawingIndex*}} @data.controlpointIndex={{*@index*}} @data.zoomSize={{*getBlueprintZoomSize* /..//this}} }

## child_107.3.table
### each controlpoint
{#child child_blueprint_with_controlpoint2 @template.recipe=html @data.size=3 @data.drawingIndex={{*drawingIndex*}} @data.controlpointIndex={{*controlpointIndex*}} @data.zoomSize={{*getBlueprintZoomSize* *drawingIndex*}} }

## child_107.4.table
### each controlpoint
{#child child_blueprint_with_controlpoint2 @template.recipe=html @data.drawingIndex={{*@root.drawingIndex*}} @data.controlpointIndex={{*@index*}} @data.zoomSize={{*getBlueprintZoomSize* /..//this}} }

## child_107.5
.table
### each controlpoint
{#child child_blueprint_with_controlpoint2 @template.recipe=html @data.drawingIndex={{*@root.drawingIndex*}} @data.controlpointIndex={{*@index*}} @data.zoomSize={{*getBlueprintZoomSize* /..//this}} }
