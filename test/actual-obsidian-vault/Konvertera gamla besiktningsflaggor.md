# Konvertera gamla besiktningsflaggor

#plantrail/inspection

## Konvertera controlpointTypes
Project.template_id = 1 -> EB
Project.template_id = 2 -> BL

## Konvertera journalItemTypes


## Gamla “Inspection”
### Fields
Layer -> deviation

- [ ] taskType
- [ ] priority
- [ ] workNotes
- [ ] isNormative
- [ ] inspectionNotes
- [ ] obstacleNotes
- [ ] closingNotes
- [ ] rejectionNotes
- [ ] inspectionMnemonic ??

### journalItemTypes
    1003010, //documentation/inspection base info
    1003011, //edit base information
    10030501, //Reject work on deviationType 1003701
    // 10030500, //decline ??
    // 10030600, //caveat ??
    10030701, //problem (1003501) fixed
    10031000, //approve and close



## BL (120)
## Fields
- [x] taskType -> labelNotes
- [ ] priority
- [x] workNotes
- [x] isNormative
- [x] inspectionNotes
- [x] obstacleNotes
- [x] closingNotes
- [x] rejectionNotes
- [x] inspectionMnemonic ??


Lägg till?
- [ ] priority
- [x] labelNotes
- [x] isNormative + normativeNotes?

### journalItemTypes
- [x] 1003010 -> 120010, //documentation/inspection base info
- [x] 1003011 -> 120011, //edit base information
- [x] 10030501 -> 1200501, //Reject work on deviationType 120701
- [x] 1200601, //work in progress
- [x] 10030701 -> 1200701, //problem (111501) fixed
- [x] 10031000 -> 1201000, //approve and close

### eventTypes
- [x] 10034 -> 1204
- [x] 10037 -> 1207
- [x] 10039 -> 1209

Roles
10100, 10102, 10111 -> 120002
10202 -> 120062 (gul hammare)

### Deviations

- [x] 1003101 -> 120101
- [x] 1003501 ->  120501
- [x] 1003502 -> 120502
- [x] 1003951 -> 120951
- [x] 1003701 -> 120701

### LayerType -> mnemonic
- [x] 1003501 -> 1221
- [x] 1003502 -> 1222
- [x] 1003101 -> 1225
- [x] 1003951 -> 1228



## EB (111)
### Fields
- [ ] notInspectedOnSite
- [ ] isNormative
- [ ] doNotRectify
- [ ] normativeNotes
- [ ] workNotes
- [ ] inspectionNotes
- [ ] obstacleNotes
- [ ] closingNotes
- [ ] rejectionNotes
- [ ] inspectionMnemonic

### journalItemTypes
- [x] 1003010 ->    111010, //documentation/inspection base info
- [x] 1003011 ->    111011, //edit base information
- [x] 10030501 ->    1110501, //Reject work on deviationType 111701
- [x] 1110601 -> 111701
- [x] 10030701 ->    1110701, //problem (111501) fixed
- [x] 10031000 ->    1111000, //approve and close

### eventTypes
- [x] 10034 -> 1114
- [x] 10037 -> 1117
- [x] 10039 -> 1119

### Roles
10100, 10102, 10111 -> 111002
10202 -> 111062 (gul hammare)

### Deviations

- [x] 1003101 -> 111101
- [x] 1003501 -> 111501
- [x] 1003502 -> 111502
- [x] 1003503 -> 111503
- [x] 1003301 -> 111301
- [x] 1003901 -> 111901
- [x] 1003902 -> 111902
- [x] 1003951 -> 111951
- [x] 1003701 -> 111701

### LayerTypes to inspectionMnemonic
- [x] 1003501 -> 1211
- [x] 1003502 -> 1212
- [x] 1003503 -> 1213
- [x] 1003101 -> 1215
- [x] 1003901 -> 1216
- [x] 1003951 -> 1218
- [x] 1003301 -> 1214


## Frågor
Malin:
By 70 har några flaggor med “Normerande besiktning” i “Typ” (taskType). Men det är ett BL-projekt. Behövs “normerande” även på BL?

Typ används flitigt på Färjan 4 och By 61. Exempel
* Beställarfråga
* Tillgänglighet
* BM3
* Åtgärdas
* Risk
* Observation
* Miljöbild
* Normerande besiktning