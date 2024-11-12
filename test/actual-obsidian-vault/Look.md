# Look

#plantrail/controlpointTypes

## Terminology
### ShapeTypes
* Flag
* Bracket
* Rectangle

### Label
Every shapeType can have a label. A label can consist of the following elements:
* pennant
* leader
* anchor



### getGeometry

**Input:**
- [ ] shapes  eller shape?
- [ ] dimConst
- [ ] text
- [ ] symbol
- [ ] look
- [ ] drawMode
- [ ] interactionMode
- [ ] controlpointLevel
- [ ] virtualScale
- [ ] portalUrl

**Output:**
```
{
	geometryArray, one geometry object per shape
  bboxArray, //one bbox per shape
  lengthsArray, //one lenght per shape
  bbox, //sum of bbox from bboxArray
  length,  //sum of lengths from lengthsArray
  portalUrl,  //same as input
}
```



Needed output in the app
```
{
  bbox,
  bracket,
	label,
	rectangle
}
```




### getSvg

**Input:**
- [ ] geometry eller geometryArray, (includes shapeTypeId)
- [ ] portalUrl (should be included in geometry)

**Output:**
- [ ] totalLength
- [ ] lenghtsArray
- [ ] svgArray
- [ ] bboxArray
- [ ] bbox

index.getGeometry
- [ ] takes shape or shapes
- [ ] returns geometry or geometryArray


## Shapelib output structure

flag = label + leader + anchor

rect = cloudSvg + flag

bracket = bracketSvg + flag



{
	labelCenter,
	labelAnchor,
	
        label: {
          x,
          y,
          width,
          height,
          labelDiagonal,

          fontSize,
          borderRadius,

          isTopArea,
          topAreaHeight,
          topAreaFillColor,

          midAreaTop,
          midAreaHeight,

          isBottomArea,
          bottomAreaTop,
          bottomAreaHeight,
          bottomAreaPadding,
          bottomAreaFillColor,

          textLines,

          strokeWidth: labelStrokeWidth,
          strokeColor: labelStrokeColor,
          fillColor: labelFillColor,

          contrastStrokeWidth,
          contrastStrokeColor,

	leader: {
		symbol,
		rotation,
		x,
		y
	}
	anchor:
	anchorRing:
	anchorRect:
	bracket:
	rect:
	
	ghostedProps
}


look: 
* label_look_id (1=label, 2=large symbol)
* anchor_look_id (1=none, 5=large symbol)
* leader_look_id (1=line, 2=knee, 3 = curve)
* label_max_layer_levels
- [ ] add label_information_2_field_path
- [ ] rename information to information1_..


AnchorRing:
- [ ] large anchor-symbol && !selected
  - [ ] level < 1000
  - [ ] or isCloaked
  - [ ] or isInteractive 
  - [ ] or isGhosted


Large Symbol:
- [ ] AnchorRing if level < 1000 or isInteractive or isCloaked
- [ ] Leaderline only if longer than symbolSize and not cloaked

Large symbol + label:
- [ ] if leaderLine shorter than symbol -> no label ??
- [ ] selectionFactor
- [ ] ghostedProps
  - [ ] stroke
  - [ ] strokeWidth
  - [ ] strokeDashArray



- [ ] clickTarget
  - [ ] size to match labelRect
  - [ ] both anchor and label

## Anchor ring
Anchor ring is rendered to visualize controlpointLevel when the label is not visible, i.e. no other means to show colors.

- [ ] Important when scheduled maintenance is due. All maintenance controlpoints should have an anchor-ring, even if label is visible.

- [ ] Cloaked controlpoints will allways show anchor ring even if label is visible?

- [ ] Green (level 1000) only shows anchor-ring in interactive mode. Needed to aid in positioning cloaked controlpoints

- [ ] Level < 1000 or INTERACTIVE  (no anchor ring is rendered for green flags, unless DRAW_MODE_INTERACTIVE)
- [ ] anchorLook = 
- [ ] 

## Draw mode
### DRAW_MODE_GHOSTED
Used for representing original shape when a shape is moved interactively.
- [ ] No anchor symbol
- [ ] No flag symbol
- [ ] GhostedProps = GHOSTED_PROPS
- [ ] no texts

### DRAW_MODE_DIMMED
Used to focus attention on a single controlpoint by dimming all other controlpoints
- [ ] opacity = DIMMED_OPACITY

### DRAW_MODE_SELECTED
Used to visualize a selected controlpoint
- [ ] no flag symbol
- [ ] selectedStrokeFactor
- [ ] anchorRing?

### DRAW_MODE_INTERACTIVE
For visualizing interaction with a controlpoint
- [ ] interactionBox
- [ ] ibland anchorrind

### DRAW_MODE_DEMO
For rendering controlpoint examples for menus
- [ ] sizeFactor = 2
- [ ] no anchor ring
- [ ] 

### LABEL_ONLY
for putting selected label on top, even on top of radialMenu.



## Leader look

### -1, None
No leader line.
No leader line automatically implies labelLook none.

### 1, line
![[A9AF525F-7B74-4524-9928-0F5C48BB4088.png]]

### 2, line with knee
![[CFFA7A6F-994B-459D-A253-4BB500E4A140.png]]

### 3, curve
![[3B0307CD-EFE9-41AA-9E85-6DBB44B0D001.png]]

### 4, curvier curve
![[90BCF41B-D698-4FB3-AFA2-85581EE69AA1.png]]

### 5, supercurvy curve
![[322E8D1A-3A3A-42DC-99A0-D6813428707A.png]]


## Anchor look
### -1, none

### 1, dot
![[97848656-B1E9-4AC0-A4E1-B95763C10C2E.png]]

### 2, small arrow
![[FD6E031C-47B2-4FBD-9912-386DE07B0B0D.png]]

### 3, large arrow
![[F898BF2B-E56E-4D9C-8FC7-5CD20ABF0D70.png]]

### 4, large symbol
![[D46401FF-EFDB-4B71-A4FE-804211223EA9.png]]

large symbol + no label = render symbolTexts


## Label look
### -1, none
No label line automatically implies labelLook none.

- [ ] 1 should be "none"
- [ ] None -> no leader -> anchorRing

### 1, label with small symbol
![[599738AC-7B4D-4222-8B49-8A86DB4B9DC8.png]]

### 2, label without symbol
![[61B76EDF-599C-4D96-B9F1-163967E85C0D.png]]

### 5, large symbol
- [ ] labelText should be rendered below
- [ ] titles above?
- [ ] infoText1 above?
- [ ] infoText2 below?

![[39BC6FBE-A977-4BE3-883C-52B9B246F02F.png]]

## Label texts
### Layer names ("titles")

![[E5CD1EE2-C535-44E3-8912-E044D60ACC94.png]]


#### Limit number of title rows:
**maxTitleRows: 1**

![[9912B79F-BEFE-47D1-AB6D-1DE8645E43ED.png]]

### Info1 = text lines above the identifier
![[34219E65-41FF-4875-B261-726846572B72.png]]

#### Limit number of title rows:
**maxInfo1Rows: 2**
![[4D0CC453-7287-414E-BF31-78AF0021672E.png]]

### Info2, text lines below the identifier
![[9C039BD0-2AC9-4819-9F7D-12C6E4696D23.png]]

#### Limit number of title rows:
**maxInfo2Rows: 2**
![[2B108766-6134-4221-A66A-4F42CE8F8CC1.png]]


### Example combinations
#### Titles + info1 + info2 + leaderLook 2 + anchorLook 2
![[D1FFBCC5-7888-41A0-B60F-CB6BB8082DBE.png]]

#### Large symbol + small arrow + curved line
![[0BEE2076-83DE-49E6-A602-79234DCD56FE.png]]
