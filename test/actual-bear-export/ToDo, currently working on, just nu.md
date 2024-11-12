# ToDo, currently working on, just nu

#plantrail

## Prioritering

- [x] Laimonas product (Paroc)
- [ ] ny funktion get_companies_complete, med max_modified_at

### HTTP Status 204
Ensure that all sync routes actually returns 204 when empty

- [x] get_controlpoints_complete
- [x] get_drawings_complete
- [x] get_projects_complete

- [x] get_forms_complete
  - Uses old concept with now(). Will probably not be a sync problem because users cannot update forms

- [x] get_project_sequences_complete
- [x] get_project_sequences_flat_complete
  - timestamp only from seq, not from “deleted”
  - returns null for blank. API also checks for null, so this works albeit inconsistent

- [ ] get_reports_complete
  - [ ] Needs max_update_time from deleted and revoked

- [ ] get_report_sections_complete
  - [ ] Needs max_update_time from deleted and revoked

- [ ] get_inbox_items_complete
- [ ] get_inspections_complete
- [ ] get_journal_items_complete, only timestamp from JI, not from revoked
- [ ] get_notice_center_messages_complete

- [ ] get_project_sequence_values_complete

### Camera component
- [ ] byt komponent
- [ ] rita på foton
- [ ] hämta foton från album
- [ ] radera foton

### Sequences and flag sizes
- [ ] Let user choose dim-scale directly from the app
- [ ] Let user reapply sequences to selected controlpoint-type directly from the app

### Inspection - journal flow
- [x] contractor: work in progress, work done, will not do work “wont” -> dark red
- [x] inspector: do not resolve “dont” -> purple


- [x] journalItemView.js
  - [x] implement clearPropertyFields (row 744)

- [x] process_journal_item
  - [x] use clear_property_fields from input and from journal_item_type (row 336)
- [x] create_journal_item
  - [x] add clear_property_fields, if not exist in journal_Item_type (no duplicate entries)
- [x] fel-lista
  - [x] inkludera workNotes OR workProgressNotes OR wontNotes
- [ ] 111, EB, ladda upp nya definitioner
  - [ ] controlpointType 111
  - [ ] journalItemTypes
- [ ] 120 BL, uppdatera som 111
- [ ] 150 BB, uppdatera som 111
- [ ] 160 BB, uppdatera som 111
- [x] Apply new create_journal_item in prod
- [x] Apply new process_journal_item in prod
- [ ] Upload new jsReport3 for new 107-report
- [ ] Add workProgressId retroactively to all inspections “work completed”
- [x] Add eventType retroactively to all inspections “work completed”

### Magic links

### Worker restarts must be secured

### PM - SBA
- [ ] Titta igenom Mats förslag på “servicerapport”

### Skapa journaler från webappen
- [ ] Kräver nya journalItem-flow-moduler (se nedan)
- [x] Snabbfix: enkel journalpost som endast kan justera besiktningstexten
- [ ] Resten blir ett större projekt där entreprenörer kan bocka av etc

### Kategorier på kontrollpunkter
- [x] Databasstruktur som håller för projekt-nivå och företagsnivå
- [ ] Validate-funktion för att varna för dubbletter
- [ ] Skapa egna kategorier
- [ ] Redigera kategorier, inklusive “dry-run” för att visa användaren vad som kommer hända
- [ ] Ta bort kategorier, inklusive “dry-run” för att visa användaren vad som kommer hända
- [ ] Filter i appen?
- [ ] Filter i rapporter?

### Rensa orphan fileRefs
- [ ] Management job..
SELECT *
FROM main.project_file_ref fr 
LEFT JOIN main.project p
  ON fr.project_id = p.id 
  AND fr.file_guid = p.thumbnail_file_guid 
WHERE p.id IS NULL
AND fr.intent_id = 4
order by fr.project_id;

### Inbjudningar
- [ ] Förenklat inbjudningsförfarande
- [x] För-registrerade rättigheter som tilldelas vid kontovalidering

### JournalItem-flow
- [ ] Inventera behov
- [ ] förbättra journalItemType-struktur (actions, preconditions, effects.. mer logik i namngivning)
- [ ] Lyft ut funktioner till bibliotek

### Ritningsimport
- [ ] Importera jpg/png
- [ ] Rotera ritningar
- [ ] Kopiera ritningar
- [ ] Automatisk textavläsning och inmatningsförslag
- [ ] Gruppering av ritningar
- [ ] Kategorisering av “fas” (bygghandling, relationshandling, etc)

### Rapportverkstan
#### Nya komponenter
- [ ] burndown chart
- [x] ToC
- [x] blueprint crops

### Kontrollpunkter
- [ ] Ny generell typ för allmänna ändamål
- [ ] Ritningslösa flaggor “per ritning”
- [ ] Ritningslösa flaggor per projekt
- [ ] Checklist-flaggor per projekt

### Appstore
- [ ] inventering av vad som behövs
  - [ ] kontohantering/inloggningsskärm
  - [ ] uppgraderingshantering
  - [ ] supportfunktion (ge tillfällig rättighet till supportperson)
  - [ ] flytta appen till PlanTrails Apple-konto
  - [ ] app-logotyper
  - [ ] flytta appen till “PlanTrail” (app-namn + nytt app-id)
    - [ ] meddela alla användare om att nyinstallation krävs





## Diverse

- [ ] Error handling, [[Error format in API response object]]
- [ ] Field validations and translations (TablePlus)

- [x] FormEngine - hantera tomma fält
- [x] FormEngine - hantera deep merge? properties?
- [ ] JSReport - optimera dualRender-rapporten (TOC)
- [x] JSReport - gör nya jsreport-servern kompatibel med gamla rapporter (övergångsfas)
- [x] JSReport + worker, optimera ritningsutsnitt (crop)


## Form engine

- [ ] Read-only-version för att bygga presentations-sidor av t.ex en kontrollpunkt

## Misc
- [ ] Blå hand behövs på estetisk fog (Ulrika)
- [ ] Marklaget,  [joakim@marklaget.se](mailto:joakim@marklaget.se)  

- [ ] Appen är långsam med många flaggor. Ex: Sydisol, 700+ flaggor. Släcka lager = 8 sek, tända samma lager = 1 sek. Nåt är lurt.

- [ ] Custom header/footer in ddp reports

## Buggar
- [x] Rapport 107.5, inklädnad. Roller behöver översättas
![](ToDo,%20currently%20working%20on,%20just%20nu/0A7E826B-94D2-465D-BCA6-42644E972BAA.png)

- [x] Rapport 107.5, inklädnad. Borde inte ta med vita flaggor

![](ToDo,%20currently%20working%20on,%20just%20nu/CB30B9E7-A5DF-48C3-B027-51A1C305D701.png)

- [x] Stål-inklädnad saknar journaltyp för gul hammare

- [ ] Bättre layout behövs i sidfot vid långa företagsnamn

![](ToDo,%20currently%20working%20on,%20just%20nu/140894F1-1A63-49C3-87A4-FC6D23FFF112.png)


- [ ] Saga Error, user 238
![](ToDo,%20currently%20working%20on,%20just%20nu/205AAF05-001E-4BE5-978F-7D6C78ED8584.png)

- [ ] Styr upp event-types så att fler typer samordnas. F.n. är det separata besiktnings-event vilket ställer till det i rapporter och i rapportverkstan. Se db-steg 8.30
  - [x] Uppstyrt ma eventTypeCategory, borde räcka..

Kolumner i report_component_layout
![](ToDo,%20currently%20working%20on,%20just%20nu/0C791CA4-F3A7-4103-8C92-1BCC5EA1EC95.png)

- [ ] Flaggtexter blir dåligt renderade i PDF

Exempel från rapport 1218.107.12.03
![](ToDo,%20currently%20working%20on,%20just%20nu/715C89A7-87AB-4A0D-B7C6-C5232691BEBE.png)


## Project settings
- [x] ShapeLook
- [ ] ShapeSize
- [x] Text-fields

## Layers
- [x] Sub-layers
- [ ] Inherit layer ACL
- [x] GUI Presentation (hierarchical layer view)

## Project properties
- [x] Beställare
- [x] Entreprenör
- [x] Fastighetsägare

## ## Nya fog-typer
- [x] finfog
- [x] elementfog
- [x] ljudtätning
- [x] rapporter för respektive typ
- [ ] kombinerad rapport?

## Email delivery validation
See db-upgrade step 7.897
zerobounce.com

## Portal links
- [ ] Presentera portal-länk direkt i appen
## Rename params

- [ ] jsreportShortid -> jsReportShortid
  db: update_report_type
  app_api.reportType.js
  app_api.reportTypes.js
