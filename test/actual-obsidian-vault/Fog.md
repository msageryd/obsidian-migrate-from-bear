# Fog
#plantrail/controlpointTypes

## Produkter - ljudtätning
### Lista från Jörgen
- [ ] Protega
- [x] Paroc FPS17
- [x] Sikasil C
- [ ] Mira Supersil
- [ ] Schönox ES
- [ ] PCI Silkoferm
- [ ] Tec 7
- [x] Habe Latex 12
- [x] Habe Seal 25
- [x] Habe Seal 40
- [x] Habe Bottningslist
- [x] Paroc FPY1
- [x] Rockwool Roxremsa
- [x] Superwool 607 Blanket



kugghjul/gul hammare

![[E09DBA15-A67C-44EA-BB75-F3A0C4A3C315.png]]

![[52F0BCF3-DB78-45A1-998C-A910546F74EC.png]]

![[27385893-54A7-4117-9099-0AB237C6CBD1.png]]




## Todo
### Justera omdöpta property-fält
- [x] facadeTypeId -> wallTypeId
- [x] joinConstructionTypeId -> constructionTypeId
- [x] Döp om fält i rapporten

Kontrollera att inga flaggor har gamla strukturen (om någon har skapat nya flaggor utan synkad app)
```
  select 
    guid, identifier,
    (properties->'constructionType')->'joinConstructionTypeId' as join_construction_type_id,
    properties
  
  from controlpoint where controlpoint_type_id = 30101 
  and (properties->'constructionType')->'joinConstructionTypeId' IS NOT NULL;

  select 
    guid, identifier,
    (properties->'constructionType')->'facadeTypeId' as facade_type_id,
    properties
  
  from controlpoint where controlpoint_type_id = 30101 
  and (properties->'constructionType')->'facadeTypeId' IS NOT NULL;
```

## Symbol
Symbol-id: 104

![[347B2D8C-31EA-47AB-A320-640951AD7CF6.png]]

## Möte PM Fog 2022-02-16
## Ritningar
* Funkar det att ha 14 delar?
* Hur hantera element i ritnings-skarvar?
* Klammer över flera element eller en flagga per element?

## Ny kontrollpunktstyp
* Eller Fog, generellt
* Fasadfog specifikt

### Generell fogtyp
Fördel, vi bygger ett flöde som funkar till all fog.
* Fasad
* Fönster
* Sanitet
* Golv
* Övrigt

### Fasadfog specifikt
Fördel, mindre att mata in om man bara sysslar med fasadfog.
Egenkontroll-rapporten kanske behöver vara specifik för just fasadfog?

### Inmatning-fält
- [ ] bredd
- [ ] djup
- [ ] Fog-längd
- [ ] Väderlek (väder-tjänst)
- [ ] Kulör?
- [ ] Förberedd yta?
  - [ ] stålborstad
  - [ ] damsugen
  - [ ] urtorkad
- [ ] Material?
  - [ ] Gips
  - [ ] Puts
  - [ ] Betong
  - [ ] Trä


### Bilder
- [ ] Bild före (med tumstock i bild?)
- [ ] Bild efter

### Avvikelser
Fel bredd? Offerera uppsågning?

### Fogberäkning?
(L+B)/500 = bredd

## Journalflöde
Samma flöde som brandtätningar?
Vilka fält behöver tas med/matas in?

## Produkter
Ska produkter väljas i en omgång? Dvs drev+primer+bottningslist+fog?

Eller behövs separata produktval för respektive kategori?

- [x] Vilka produkter behövs för FSE209?

## Rapporten
Vilka kolumner behöver tas med?
- [x] Längd + material

## Kontrollpunkts-portal
Klick på flagga eller nummer i rapport. Specifik portal-layout för fasad-fog
* Visar fog-bredd/djup

## Pris
- [x] Vi bygger ny kontrollpunktstyp på vår bekostnad inklusive inmatningsformulär, journalflöde, slutrapport.
- [x] Om PM vill ha specifika funktioner som inte är generellt gångbara debiteras 1400 kr/tim.
- [x] "Fog" blir en egen modul som kostar 300kr/anv/mån (samma som brandtätning)
- [x] Litauiska blir ingen "riktig" översättning", utan görs med Google Translate. Vi tar gärna emot ändringsförslag från de som kan språket.
- [x] PM blir först ut med fog-modulen och har därmed störst chans att påverka utformningen.
- [x] Ritningsimport kostar som vanligt, dvs 15 ritningar i FSE-fallet (2,500kr)

