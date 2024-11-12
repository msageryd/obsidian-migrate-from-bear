# SBF-rapporter, Eladministration

#plantrail/onboarding

## Todo
- [ ] tag component in mobile app
- [x] tags in AG grid
  - [x] create virtual field for each tagGroup with fieldPath to [tags, groupId]
- [ ] ACL for formFills
- [x] Include projectFormData in DDP datasets
- [ ] UI for selecting form to fill
- [x] database structure for storing projectFormData
- [x] sync domain for project formData SYNC_DOMAIN_PROJECT_FORM_DATA
- [x] sync GET endpoint for formData
- [x] update endpoint for saving formData POST /projects/:id/form-data/:schemaName
- [x] update function form update endpoint to use update_project_form_data()
- [ ] speedy way to render report, i.e. maybe directly from mobile app, foregoing template input
- [x] socket notify behövs på tag_group
- [x] FormEngine
  - [x] support for fieldArrays 
  - [x] tweak layout for better readability in large forms (compact view, dividers, etc)
- [ ] FormSchemas:
  - [x] SBF 111, brandlarm
  - [ ] SBF 180, talat meddelande
  - [ ] SBF 117, gassläck
- [ ] Report definitions
  - [x] SBF 111, brandlarm
  - [ ] SBF 180, talat meddelande
  - [ ] SBF 117, gassläck
- [x] Bygg ut ddp_filter får att hantera tags
- [ ] Filter get_ddp_ds_project_form_data for specified formSchemaMnemonics

## SBF
### Regler

| SBF     | Beskrivning                                                  |
|---------|--------------------------------------------------------------|
| SBF 110 | Regler för brandlarm<br><br>Checklista för kontroll av processen:<br>[checklista-for-kontroll-av-processen-sbf-110](https://www.brandskyddsforeningen.se/globalassets/blanketter/checklista-for-kontroll-av-processen-sbf-110.pdf) |
| SBF 115 | Regler för koldioxidsläckanläggning                          |
| SBF 120 | Regler för automatiskt vattensprinklersystem                 |
| SBF 141 | Regler för utförandet av besiktningar av brandskyddsanläggningar<br>[SBF 141 Regler för utförandet av besiktning av brandskyddsanläggningar](https://www.brandskyddsforeningen.se/enorm/brandlarm/relaterade-regelverk-anvisningar-och-dokument/sbf-141-regler-for-utforandet-av-besiktning-av-brandskyddsanlaggningar/) |
| SBF 500 | Regler för gassläcksystem                                    |
| SBF 501 | Regler för boendesprinklersystem                             |
| SBF 503 | Regler för vattendimsystem                                   |
| SBF 504 | Regler för trycksatt stigarledning                           |
| SBF 502 | Regler för <br><br>[checklista-for-kontroll-av-processen-sbf-502](https://www.brandskyddsforeningen.se/globalassets/blanketter/checklista-for-kontroll-av-processen-sbf-502.pdf) |

### Besiktningsfirma
[Blanketter och informationsblad](https://www.brandskyddsforeningen.se/normer--riktlinjer/blanketter/)

| SBF     | Beskrivning                      |     |
|---------|----------------------------------|-----|
| SBF 111 | Besiktningsintyg brandlarm       |     |
| SBF 190 | Besiktningsintyg kökssläcksystem |     |
|         |                                  |     |
| 184     | Stigarledning                    |     |
|         |                                  |     |
|         |                                  |     |
|         |                                  |     |
|         |                                  |     |
|         |                                  |     |
|         |                                  |     |

### Anläggare

| SBF     | Beskrivning                                                |                                                              |
|---------|------------------------------------------------------------|--------------------------------------------------------------|
| SBF 178 | Utförandespecifikation utrymningslarm med talat meddelande | [utforandespecifikation-utrymningslarm-talat-meddelande-maj18](https://www.brandskyddsforeningen.se/globalassets/blanketter/utforandespecifikation-utrymningslarm-talat-meddelande-maj18.pdf) |
| SBF 179 | Anläggarintyg utrymningslarm med talat meddelande          | [anlaggarintyg-utrymningslarm-talat-meddelande](https://www.brandskyddsforeningen.se/globalassets/blanketter/anlaggarintyg-utrymningslarm-talat-meddelande.pdf)<br><br>Anvisningar:<br>[vagledning-till-ifyllande-av-sbf-179_1](https://www.brandskyddsforeningen.se/globalassets/blanketter/vagledning-till-ifyllande-av-sbf-179_1.pdf) |
| SBF 173 | Utförandespecifikation brandlarm                           |                                                              |
| SBF 103 | Anläggarintyg brandlarm                                    | **Intyg:**<br>[Hmm … \(404 Not Found\) / Brandskyddsföreningen](https://www.brandskyddsforeningen.se/api/enorm/document/03ea0b9b-d7cf-4bfa-84c5-8c94e4247869)<br><br>[SBF 103 Anläggarintyg brandlarm](https://www.brandskyddsforeningen.se/enorm/brandlarm/exempel-pa-intyg-och-blanketter/sbf-1038/)<br><br>Vägledning:<br>[lathund-for-ifyllande-av-anlaggarintyg—2015-06-26](https://www.brandskyddsforeningen.se/globalassets/blanketter/lathund-for-ifyllande-av-anlaggarintyg---2015-06-26.pdf)<br><br>Gamla anläggningar använder denna:<br>[sbf-172-1-intyg-overensstammelse-utrymning-2015-06](https://www.brandskyddsforeningen.se/globalassets/blanketter/sbf-172-1-intyg-overensstammelse-utrymning-2015-06.pdf) |
| SBF 121 | Anläggarintyg sprinkleranläggning                          | [sbf-121-5-anlintyg-sprinkler-2014-09](https://www.brandskyddsforeningen.se/globalassets/blanketter/sbf-121-5-anlintyg-sprinkler-2014-09.pdf) |

### Checklistor

| SBF      | Beskrivning                              |                                                              |
|----------|------------------------------------------|--------------------------------------------------------------|
| SBF 1013 | Checklista brandlarm ??                  | [Hmm … \(404 Not Found\) / Brandskyddsföreningen](https://www.brandskyddsforeningen.se/api/enorm/document/80045762-ea5c-497d-ad59-8e5b03e2b150) |
| SBF 141  | Innehåller också checklista brandlarm ?? |                                                              |
|          |                                          |                                                              |
|          |                                          |                                                              |
|          |                                          |                                                              |
|          |                                          |                                                              |
|          |                                          |                                                              |
|          |                                          |                                                              |
|          |                                          |                                                              |


## Todo

- [ ] Minns senaste kategori-valet så man slipper välja “sprinkler” för varje flagga
- [ ] Endast en ny tag får finnas i journal_item_tag om group.allow_multi_select = true

## Frågor till Brandskyddsföreningen
### Trycksatt stigarledning
- intyget kallas “Installationsintyg” istf anläggarintyg, varför?
- stigarledning verkar ha tydligt krav på “Besiktningsfirma”, varför
- 



## Frågor till Peter Borg

- fyller man i blanketterna exakt som de är, eller lägger man till egen text?
- Flera sektioner i blanketterna är list-betonade, t.ex “utökningar”
  - men “utökningar” på brandlarm är ingen lista, utan endast några fölt
- kan ni skicka ert certifieringsmärke?
- har försökt förstå mig på “checklistor”
  - SBF1013 är “Checklista
  - SBF 141 innehåller också checklista
- om vi framöver bygger ut med checklistor och fler intyg kanske PlanTrail behöver bli lite mer organiserat när det gäller lagring av dessa, dvs inte bara ett tidsordnat “rapportarkiv”, utan en strukturerad lagring
- När man “medger avvikelse” ska detta dokumenteras. Brukar detta finnas som separat dokumentation? Framöver kanske vi kan länka till sådana dokument om det finns behov
  - vem, när, vad
- Många olika intyg:
  - Utförandespecifikation - projektering, brandskyddsdok
  - Anläggarintyg
  - Installationsintyg (stigarledning)
  - Intyg om överensstämmande - använd ej längre, anläggarfirman
  - Besiktningsintyg
- Besiktningsintyg Brandlarm anger “Regelverk SBF 110 och utgåva:”
  - övriga anger bara “Regelverk och utgåva”
  - jag gissar att det ska anges respektive “Regler”, t.ex SBF 502 för talat utrymn.larm?
- Sekretess?
  - Anonyma projektnamn
1003:5

SBSC



### Delar inom SBF 1003
SS-EN 13565 (1 & 2): Skumsläcksystem
Numera heter det “anläggning” inte “anordning”

Olika färger på A,B,C?

### Besiktningsintyg
#### Allmäna sektionen
Översta delen, “Allmänt”, är samma på alla blanketter. Om olika släckanordningar besiktigas på samma projekt, är “Allmänt” alltid gemensam, eller kan den skilja.
Ex. Brandlarm -> allmänt.typ = revisionsbesiktning
Ex. Sprinkler -> allmänt.typ = leveransbesiktning
**Svar: Ja, det kan skilja. Kan även vara olika anläggningsfirmor på olika delar**

#### Exakt layout
Dikterar SBF:erna en exakt layout, eller kan man justera lite? Vi vill t.ex samordna så att “Allmänt” ser likadan ut på alla blanketter, men de är inte exakt lika på SBF:erna.
**Svar: Inkonsekvent layout i SBF:er leder till att vi går en medelväg**

#### Upprepad övre del
Sida två inleds med samma info som övre delen av sida ett. Måste man göra så?
**Svar: Ja, den måste vara med på alla sidor**

Sida 1:
![[4f0fb83d-7104-481e-b9aa-cacbf4922978.png]]

Sida 2:
![[image 2.png]]

#### Medgivanden
Vissa anordningstyper har en större ruta för “Medgivanden”, medan Brandlarm bara har en liten ruta som hänvisar till bilaga. Även de större rutorna hänvisar till bilaga. Kan man strunta i de stora rutorna och helt enkelt skriva medgivanden separat på nästa sida?
#### Utökningar
Samma fråga som på “medgivanden”. Utökningar finns på alla utom brandlarm, men med hänvisning till bilaga om det inte får plats. Kan man strunta i den rutan och alltid ha en hänvisning? Vad händer annars om man inte får plats?


## Tel med Brandskyddsföreningen om blanketter mm
Ikaros Savvidis, 08-588 474 19
ikaros.savvidis@brandskyddsforeningen.se
- behörig om man har ett av gas eller vattensprinkler eller vattendimma 1003:5. 5.5.1, 4.5.8, SBF2008.
- FTR finns ej för Talat meddelande, Svensk försäkring. Vägledningar/Rekommendationer/FTR. [FTR:er](https://www.svenskforsakring.se/vagledningar/rekommendationer/ftrer/)
- 


## Mickes mini-utredning av olika typer
Peter bekräftar at följande stämmer:

**Brandskyddsbesiktning**
Avser endast larm-delen i brandskyddet
Utförs av en "Besiktningsfirma" och leder till ett "Besiktningsintyg".
Regleras i olika SBF:er för respektve typ av larmanordning
Nya BBR hänvisar till SBF:erna

**Utförandekontroll**
Utförs av brandkonsult, ibland verkar det krävas “Sak-n” nivå på kunskaperna.
Leder till ett Slutbevis så att byggnaden kan tas i bruk
Regleras i PBL

**Brandskyddskontroll eller Brandkontroll**
Detta verkar i stort sett handla om SBA-arbete, men det är väldigt luddigt.
Kopplar till LSO precis som “SBA"

**SBA**
Lite tydligare variant av brandskyddskontroll.
Förtydligad ansvars-fördelning mellan hyresgäst och fastighetsägare samt definierade arbetsflöden
Brandskyddsföreningen specificerar ganska bra vad SBA innebär, men det verkar vara samma sak som “brandskyddskontroll"

**Brandskyddsinventering**
Verkar vara ett slags försteg till SBA där t.ex en nyinflyttad hyresgäst får hjälp med att inventera brandskyddet. Jag gissar att en sådan inventering ofta utmynnar i att den brandkonsult som gör inventeringen också hjälper till med det fortsatta SBA-arbetet.

**Entreprenadbesiktning, brand**
Är det här samma sak som “utförandekontroll"
ABT-06

## Blankett: SBF 111:11, Besiktningsintyg brandlarm

``` 
{ 
  sbf111: {
    
  }
}
```

### Allmänt
Typ av besiktning: Leveransbesiktning/Revisionsbesiktning
Regelverk. T.ex “SBF 110.8”
Besiktningsfirma, referensnummer
Anläggningens namn och adress
Anläggningsägare och adress

Användare
Anläggningsskötare, lista med flera personer?
Telefon (gissningsvis till skötaren?)

### Omfattning
Övervakningsområde, checkboxes. Klass A-E
Beskrivning av dito

Larmsignalering, tre val
Beskrivning av dito