# Besiktningskontrollpunkt, protokoll, etc

#plantrail/controlpointTypes

[skanskas--byggordlista](https://www.skanska.se/4aabf6/siteassets/om-skanska/jobba-hos-oss/skanskas-internationella-ledarprogram/skanskas--byggordlista.pdf)
## Entreprenadform och upphandlingsform
För att ge användaren maximal möjlighet att konfigurera sitt projekt och bygga kompletta mallar för bilagor behövs inmatningsfält för entreprenadform och upphandlingsform.

Entreprenadformer i Sverige (type of contract):
- Totalentreprenad (Design & Build Contract) eller (turnkey contract)
- Utförandeentreprenad. (*Construction Contract*)

Upphandlingsform (type of procurement)
- Generalentreprenad
- Delad entreprenad


## Hantering av “Återför till besiktning” vid följdfel
2023-11-23: Tel med Ted.

**Scenario:**
Teds entreprenör har gulmarkerat ev flagga (arbete utfört). 
Ted anser att åtgärden har åsamkat följdfel, så han vill fortsätta på samma flagga.
Önske-funktion:
- Vid följdfel skriver Ted in en helt ny text som avser nya felet
- Föregående text visas i bilagan med överstruken text

**Problem:**
Hur ska det se ut om det blir flera följdfel på raken?
Ibland är en “återföring” inget följdfel, utan en korrigering av stavning eller beteckning (från E till B)

**Tankar:**
- Följdfel leder till en specifik kedja av händelser/texter. Användaren måste ange att en ändring avser “följdfel”
- text-kedjor som skapas pga följdfel går inte att redigera eftersom de hamnar i tidigare journalposter.
- Vi kanske måste ge användaren möjlighet att korrigera texten i tidigare fel så att följdfels-kedjan blir bra läsning? Men detta strider mot vårt “lagd-journal-ligger”-koncept.

**Lösning?**
- Journaltyp “återför till besiktning” får en valruta högst upp där man får välja varför man återför flaggan: “Korrigering” eller “Följdfel”
- “Korrigering” är detsamma som vi hanterar idag, dvs stavning, betecknings-ändring, etc
- “Följdfel” skapar en kedja av texter inklusive senaste anteckningen.


**Spara som utkast:**
Följdfelshanteringen tangerar ett annat koncept, “spara som utkast”, som vi kanske vill införa. Detta innebär att en journalpost lämnas öppen för redigering och inget annat kan utföras på kontrollpunkten innan man har stängt redigeringen. Detta kan vara lösning för de som vill komma hem till kontoret och skriva klart sina texter (brandkonsulter)

## Konvertering till nya besiktnings-konceptet
- [x] byt kontrollpunktstyp från 1003 till 111 i BES-projekt
- [x] byt kontrollpunktstyp från 1003 till 120 i BL-projekt
- [x] Lägg in värden i segmented-fältet som motsvarar aktuellt lager-val
- [x] Skapa controlpoint_event_type för nya deviation-typerna
- [x] Koppla om all deviation-historik
- [x] koppla om all controlpoint_event-historik
- [x] flytta flaggorna till baslagret
- [x] radera alla gamla bokstavslager

## Besiktning vs besiktningsrapport (bilaga)
Besiktning:
- [ ] Fackområde (BYGG, MARK, ..)
- [ ] Besiktningstyp (FB, SB, ..)
- [ ] Löpnummer (FB1, FB2, )
- [ ] Startdatum
- [ ] Slutdatum
- [ ] Närvarande
- [ ] rapporter, t.ex bilagan, fellista, mm

Besiktningsbilaga
- [ ] distributionslista
- [ ] rapport baserad på mall
- [ ] kontrollpunkts-logg (vilka flaggor var med på rapporten)
- [ ] kontrollpunkts-statistik från rapport-tillfället





## AMA, AMA Funktion
* AMA Hus
* AMA Anläggning
* AMA El
* AMA VVS & kyla
* AMA AF
* AMA Funktion

## Klassificering, BSAB96, AFF, CoClass
[AFF, CoClass eller BSAB 96: vad ska du välja? Vi jämför! - Planima](https://planima.se/blogg/aff-coclass-eller-bsab-96/)
Hela
![](Besiktningskontrollpunkt,%20protokoll,%20etc/aff-coclass-bsab-96-comparison.png.webp)

BSAB:
![](Besiktningskontrollpunkt,%20protokoll,%20etc/C909BF5A-38D7-4A18-80D0-5BD2AEFD1BE6.png)

CoClass:
![](Besiktningskontrollpunkt,%20protokoll,%20etc/15AA2F69-84C2-45DD-8EC0-7035A9570B14.png)

 
![](Besiktningskontrollpunkt,%20protokoll,%20etc/A323FFC6-3268-4F7D-B169-1F72E1A2A95F.png)




## Fackområde presenterat direkt i flaggan
![](Besiktningskontrollpunkt,%20protokoll,%20etc/48839A20-5E18-4DC7-B671-3184011CBF10.png)

![](Besiktningskontrollpunkt,%20protokoll,%20etc/51EC0B86-8C77-44A9-A228-029C98E6D97C.png)



## Besiktning i PlanTrail
Begreppet besiktning kan omfatta:
* Entreprenadbesiktning (AB04, ABT06)
* Brandskyddsbesiktning


## Möte Malin 2022-11-10
Tack för ett jättebra möte igår. Det är värt mycket att få träffas och visa idéer och bolla lösningar. Här nedan försöker jag förtydliga mina funderingar kring automatisk namngivning som vi pratade om. Jag vet faktiskt inte hur lång vi vågar gå när det gäller uppstyrningen av detta.

Idealet vore om vi kunde bestämma formen så här:
<Typ><Löpnr>-<Fackområde>
T:ex FB1-MARK, EB1-BYGG, etc

Men då måste varje "typ" få en egen förkortning.

**Normerande**
Jag undrar om det finns någon gängse förkortning för Normerande förbesiktning? Den är väl en slags förberedelse inför FB eller SB, eller kalibrering mot entreprenad-avtalet, så jag antar att den ska ha en egen nummerserie? NFB1-BYGG, NFB2-BYGG, eller?

Hur ska vi hantera avvikelser som dokumenteras i en normerande besiktning? Tas de upp på t.ex efterkommande FB1 som om de kom från en vanlig besiktning tidigare, eller behöver vi öronmärka dessa flaggor som "normerande"? Jag gissar att det för normeringens skull även kan tas upp "gröna" flaggor på normerande besiktningar. Dessa vill man väl i så fall ha med i bilagan för att befästa vad som är ok?

Ett alternativ är att låta de ligga som helt vanliga E- och B-flaggor. Dessa ska ändå besiktigas igen på nästkommande "riktiga" besiktning. Vid nästkommande besiktning kan man ju enkelt klassa om dessa flaggor om det skulle behövas. Om de någon gång behöver refereras till som just "normerande" kan man ju ta fram bilagan från den normerande besiktningen?

**Kompletterande**
Om man gör en "kompletterande slutbesiktning" pga t.ex snö ligger i vägen, ska denna kallas SB med nytt löpnummer, eller blir det t.ex KSB1-BYGG?

**Fortsatt..**
Samma fråga gäller "fortsatt slutbesiktning" om den planerade slutbesiktningen avbryts. Blir den fortsatta besiktningen SB med nytt löpnummer, eller blir det t.ex FSB1-BYGG?

**Särskild..**
Särskild besiktning verkar vara ovanligt. Vet du vad en sån brukar ha för förkortning? SB är ju upptaget, så det kanske blir SÄB1-BYGG?

**Bilaga och utlåtande**

När det gäller "Utlåtande" och "Bilaga" så är BKKs handledning för Entreprenadbesiktning ganska tydlig (Camilla är också tydlig om detta). Här tänker jag att vi kör över de biträdande besiktningsmän som envisas med att döpa sin bilaga till "utlåtande". Det är helt enkelt inte deras sak att göra utlåtandet.
![](Besiktningskontrollpunkt,%20protokoll,%20etc/Attachment-3.png)

**Oordning**
Den här stökar till det lite:
http://sjobrisen.com/wp-content/uploads/2013/01/SB-1-och-EB-4-Mark-Sjobrisen-1.pdf

Kan man verkligen kombinera besiktningar på det här sättet rent formellt?
I så fall kan vi inte ha några spärrar som styr upp namngivningen, utan istället låta besiktningar heta lite vad som helst =(

Nackdelen med att inte styra upp namngivningen är att vi inte automatiskt kan ha koll på "föregående besiktningar" eftersom det verkar kunna bli ganska rörigt.

Om jag har förstått rätt så är EB något som en av parterna kräver för att t.ex få ett ok på en åtgärd redan innan nästa planerade besiktning. En SB eller en ny FB verkar fylla exakt samma funktion som en EB, så det verkar helt onödigt att namnge en besiktning som både SB och EB, eller?
![](Besiktningskontrollpunkt,%20protokoll,%20etc/Attachment-1.png)
![](Besiktningskontrollpunkt,%20protokoll,%20etc/Attachment.png)



## Teamsmöte med Malin
- [x] Besiktningsanteckning i snabbnavigerings-listan i appen

Nummerserier

Om ett fackområde (MARK) inte är med på SB1 med övriga områden. Vad kommer den kommande markbesiktningen heta? SB1-MARK eller SB2-MARK?
Svar från Malin: SB1-MARK

Fackområde <> UE

Fackomåde: Mark
Entreprenör: ME

Fackomåde: Bygg
Entreprenör: BE
UE: BE-golv



#plantrail/inspection

## Frågor till Camilla 2022-10-20
### Stämmer följande?
1. Huvudbesiktningsman är med på alla besiktningar.
2. Biträdande för flera fackområden går ofta med i samma besiktning för att spara tid.
3. Om något fackområde saknas görs separat besiktning med biträdande för detta område.
4. Man kan vara huvudbesiktningsman och samtidig vara biträdande för fackområde (kanske flera områden samtidigt?).
5. Äntligen tror jag att jag har förstått: "Bilaga" är per fackområde, "Utlåtande" är från huvudbesiktningsman. "Protokoll" får man inte säga =)
6. Besiktningsutlåtandet har samma rubrikstruktur från ABT06 som bilagorna, men kanske några färre rubriker.
7. Fel/bristfälligheter räknas aldrig upp direkt i utlåtandet, utan återfinns i respektive besiktningsbilaga för aktuella fackområden.

### Frågor:
1. Måste varje biträdande skriva sin bilaga själv? Jag gissar "ja", inklusive formell signering av bilagan?
2. Biträdanden vill väl formatera sin bilaga på sitt sätt, med sin logotype, etc?
3. Eller skulle alla fel/bristfälligheter/anmärkningar från olika fackområden kunna läggas direkt i utlåtandet, dvs inga bilagor skapas?
4. Kan bilagor inom olika fackområden dela på samma nummerserie? (E:1 = bygg, E:2 = VS, etc)
5. Om ett fackområde (MARK) inte är med på SB1 med övriga områden. Vad kommer den kommande markbesiktningen heta? SB1-MARK eller SB2-MARK?
6. Camilla, du skrev "Vi besiktigar UE:s del inom entreprenaden". Det förstår jag, men er motpart är väl formellt huvudentreprenören vid totalentreprenad?
7. Vill du ändå tilldela vissa flaggor direkt till UE, t.ex målare eller brandtätare?
8. Med "tilldela" menar du då en uppmärkning för att t.ex skapa separata underlag och skicka ut, eller menar du tilldela direkt till någon som har rättighet i projektet i PlanTrail och kan släcka avvikelser direkt i appen?
9. Tänker du att flera olika biträdande på en besiktning skulle kunna köra PlanTrail och sätta ut sina egna flaggor direkt i samma projekt?
10. När en bilaga (t.ex MARK) refererar till föregående besiktningar ingår väl endast MARK-besiktningarna?
11. Vad ingår i listan med föregående besiktningar i Besiktningsutlåtandet? Är det alla? (FB1-BYGG, FB1-MARK, FB2-BYGG, EB-MARK, etc)

Vissa av frågorna kräver kanske diskussion istället för direkt svar. Jag vill bara bolla upp saker som behöver definieras logiskt så vi kan skapa en lämplig struktur i PlanTrail.



## Fler frågor 
### Datum och status i rapporten
På högerkanten av varje kontrollpunkt i rapporten visas en förenklad tidslinje. "Upprättad den", "Åtgärdad den", "Godkänd den", etc.

Vad vill man se i denna lista?

Ex:
Dag 1 (besiktningsdagen) sätts flagga ut på med status S (rosa)
Dag 2 efter inför protokollskrivning justeras flaggan till E pga felregistrering
Dag 3 blir flaggan gulmarkerad av Johan
Dag 4 godkänns flaggan av Malin och blir grön

I rapporten:
Upprättad den: dag 1, statusfärg Rosa
Eller Upprättad den: dag 2, statusfärg röd, av Malin
Åtgärd registrerad den: dag 3, av Johan
Godkänd den: dag 4, av Malin

"Upprättad den" eller "Besiktigad den" eller "Dokumenterad den" eller "Dokumenterad/Besiktigad den"



### Provning & egenkontroll
Provning resp egenkontroll. Se t.ex sid 9-10 i "Byggsektorns egenkontroll"
[Byggsektorns egenkontroll. Handbok.pdf](Besiktningskontrollpunkt,%20protokoll,%20etc/Byggsektorns%20egenkontroll.%20Handbok.pdf)<!-- {"embed":"true", "preview":"true"} -->

Malin använder orden provning och egenkontroll. Enligt ovan stående dokument är det numera samma sak, men "egenkontroll" utförs i egen verksamhet eller någon som är anlitad att kontrollera egna verksamheten.

Hur kan då Malin göra "egenkontroll/provning" av entreprenörens arbete? Detta måste de väl göra själva per definition?

![](Besiktningskontrollpunkt,%20protokoll,%20etc/634C0DA2-6B4B-4608-AE3A-4B1F24E4071D.png)


### Besiktnings-kedjor
Det verkar vara svårt att definiera en tydlig följd av besiktningstyper.

FB1, Fb2, etc är ju tydligt.
Sen kommer SB..
Efter SB kan det blir EB för att släcka röda flaggor
Men SB kan också komma efter FB av samma orsak

### Fortlöpande besiktning vs FB vs "syn"
Malin kallar sina löpande kontroller för "syn". Jag kan in te hitta detta begrepp i något dokument. Menar Malin "Fortlöpande besiktning".

Fortlöpande besiktning verkar vara samma sak som en rad med förbesiktningar. Ska vi hantera det som sådana? Varje "fortlöpande besiktning" ska leda till ett protokoll, dvs ingen skillnad mot FB.
[Entreprenadbesiktning.pdf](Besiktningskontrollpunkt,%20protokoll,%20etc/Entreprenadbesiktning.pdf)<!-- {"embed":"true", "preview":"true"} -->


## Malins portaler med kontrollpunkter
**Terminalen 3**
https://portal.plantrail.com/?t=i6zy76nu.8b309

**Färjan 4**
https://portal.plantrail.com/?t=jls74lrx.e0c8f

**By 70, fasadarbeten**
https://portal.plantrail.com/?t=tl812rrz.8d73f



## Flytt av Malins flaggor
```
--Malins gröna på baslagret, ska flyttas till lager 2 (Entreprenören), 
--inga deviations att hantera
SELECT 
  p.name, 
  d.name, 
  cp.identifier, 
  cp.layer_id, 
  cp.controlpoint_level_id, 

  pgcrypto.gen_random_uuid() as guid,
  cp.guid as controlpoint_guid,
  -9999 as journal_item_type_id,
  2 as new_layer_id
FROM main.project p 
JOIN main.drawing_with_files d ON d.project_id = p.id
JOIN main.controlpoint cp ON cp.drawing_id = d.id
WHERE company_id = 34
AND controlpoint_type_id = 1003
and controlpoint_level_id = 1000
AND layer_id = 1
and p.id <> 387
order by p.name, d.name, identifier;

--Malins röda på baslagret och E-lagret, ska flyttas till lager 2 (Entreprenören)
--samt resolva utestående dev
--samt skapa ny dev av typ 1003501
SELECT 
  p.name, 
  d.name, 
  cp.identifier, 
  cp.layer_id, 
  cp.controlpoint_level_id, 

  pgcrypto.gen_random_uuid() as guid,
  cp.guid as controlpoint_guid,
  -9999 as journal_item_type_id,
  ARRAY[dv.guid]::uuid[] as resolve_deviation_guids,
  ARRAY[jsonb_build_object('deviationTypeId',1003501, 'guid', pgcrypto.gen_random_uuid())]::jsonb[] as create_deviations,
  2 as new_layer_id
FROM main.project p 
JOIN main.drawing_with_files d ON d.project_id = p.id
JOIN main.controlpoint cp ON cp.drawing_id = d.id
JOIN main.controlpoint_deviation dv 
  ON dv.controlpoint_guid = cp.guid 
  AND dv.resolved_by_journal_item_guid IS NULL
WHERE company_id = 34
AND controlpoint_type_id = 1003
and controlpoint_level_id = 500
AND layer_id in (1,2)
and p.id <> 387
order by p.name, d.name, identifier;


--Malins röda på B-lagret, ska byta deviation till 1003502
--samt resolva utestående dev
--Inget lagerbyte
SELECT 
  p.name, 
  d.name, 
  cp.identifier, 
  cp.layer_id, 
  cp.controlpoint_level_id, 

  pgcrypto.gen_random_uuid() as guid,
  cp.guid as controlpoint_guid,
  -9999 as journal_item_type_id,
  1 as created_by_id,
  ARRAY[dv.guid]::uuid[] as resolve_deviation_guids,
  ARRAY[jsonb_build_object('deviationTypeId',1003502, 'guid', pgcrypto.gen_random_uuid())]::jsonb[] as create_deviations,
  null as new_layer_id
FROM main.project p 
JOIN main.drawing_with_files d ON d.project_id = p.id
JOIN main.controlpoint cp ON cp.drawing_id = d.id
JOIN main.controlpoint_deviation dv 
  ON dv.controlpoint_guid = cp.guid 
  AND dv.resolved_by_journal_item_guid IS NULL
WHERE company_id = 34
AND controlpoint_type_id = 1003
and controlpoint_level_id = 500
AND layer_id in (1,2)
and p.id <> 387
order by p.name, d.name, identifier;


--Malins orange flaggor ska flyttas till lager 6 (Entreprenören)
--samt resolva utestående dev
--samt skapa ny dev av typ 1003101
SELECT 
  p.name, 
  d.name, 
  cp.identifier, 
  cp.layer_id, 
  cp.controlpoint_level_id, 
  
  pgcrypto.gen_random_uuid() as guid,
  cp.guid as controlpoint_guid,
  -9999 as journal_item_type_id,
  1 as created_by_id,
  ARRAY[dv.guid]::uuid[] as resolve_deviation_guids,
  ARRAY[jsonb_build_object('deviationTypeId',1003101, 'guid', pgcrypto.gen_random_uuid())]::jsonb[] as create_deviations,
  6 as new_layer_id
FROM main.project p 
JOIN main.drawing_with_files d ON d.project_id = p.id
JOIN main.controlpoint cp ON cp.drawing_id = d.id
JOIN main.controlpoint_deviation dv 
  ON dv.controlpoint_guid = cp.guid 
  AND dv.resolved_by_journal_item_guid IS NULL
WHERE company_id = 34
AND controlpoint_type_id = 1003
and controlpoint_level_id = 600
AND layer_id in (1,2)
and p.id <> 387
order by p.name, d.name, identifier;

```


## Nya frågor 2022-09-29
Vi måste få bokstäverna helt rätt. Det verkar finnas praxis, men inte solklar.

Det här exemplet använder inte bokstaven N, men exakt samma sak löses med "Avhjälps ej".
![](Besiktningskontrollpunkt,%20protokoll,%20etc/BDCF7B8A-DBBB-46A4-821B-E463167A01E5.png)


### konvertering av befintliga flaggor
**properties:**
  deviationNotes: namnbyte till inspectionNotes
  initialLevel: tas bort

**Rapport**
ändra deviationNotes -> inspectionNotes på rapporten

**Kugghjul**
Om man råkar klicka grönt på en flagga kanske man vill kunna komma tillbaka, dvs "kugghjulet" borde kanske synas även på gröna? 

**Gamla 30600 och 30500**
Ska vi återinföra de gamla 30600 och 30500 så att de kan visas i Malins journal-historik? Helst inte. Alternativet är att konvertera dessa till 1003010..

**Historikdiagrammet i rapporten**
Vad vill Malin ha med i historikdiagrammet?
Ska grå vara med?


**Lager-flytt:**
- [x] gröna på baslagret -> flyttar till E
- [x] röda på baslagret -> flyttas till E?, deviation byts till 1003501
- [x] orange på baslagret -> flyttas till N, åtgärdas ej, deviation byts till 1003101

- [x] gröna på lager E -> stannar kvar
- [x] röda på lager E -> stannar kvar, deviation byts till 1003501
- [x] orange på lager E -> flyttar till N, åtgärdas ej, deviation byts till 1003101

- [x] gröna på lager B -> stannar kvar
- [x] röda på lager B -> stannar kvar, deviation byts till 1003502

### 704, By 70 fasad
- [x] template
- [x] orange från bas och E till N [3]
- [x] röda från bas till E
- [x] gröna till E [10]
- [x] template again to hide "baslagret"

### 627, Färjan 4
- [x] template
- [x] orange från bas och E till N [4]
- [x] röda från bas till E [7]
- [x] gröna till E [11]
- [x] röda på lager B, byt deviationtype [15]
- [x] template again to hide "baslagret"

###  764,  Terminalen 4
- [x] template
- [x] orange från bas och E till N
- [x] röda från bas till E [8]
- [x] gröna till E [12]
- [x] röda på lager B, byt deviationtype
- [x] template again to hide "baslagret"

###  622,  Terminalen 3
- [x] template
- [x] röda från bas till E [9]
- [x] gröna till E [13]
- [x] template again to hide "baslagret"

###  406,  Hälso By61
- [x] template
- [x] gröna till E [14]
- [x] template again to hide "baslagret"



## Nya frågor 2022-09-28
N = Nedsättning av entreprenadsumma, åtgärdas ej
Kan det aldrig finnas någon "åtgärdas ej" som inte ska ge nedsatt summa?
Malin: Kan finnas. Vi mjukar upp texten till så det inte blir "ska" nedsättas, utan "kanske".

B = Beställaren
Om beställaren beställer åtgärd av punkten kanske man vill jobba med den på vanligt vis med "gula hammaren" (Johan)? I så fall behöver Johan rätt att använda gula hammaren på dessa..

Kan lösas så härom det är viktigt (dvs om Malin hanterar dessa åtgärder åt B):
1. B ger lager = B samt avvikelsetyp (111) som leder till röd färg. Johan har inte rätt att jobba på avvikelser av typ 111.
2. Speciell journaltyp (avrop) kan användas för att omvandla avvikelsen från 111 till 222. 222 ger också röd färg, men denna avvikelsetyp har Entreprenören rätt att jobba på.

## Frågor till Malin 2022-09-27
Ny roll "Huvudentreprenör" sätts upp
- [ ] Får "se" besiktningsflaggor
- [ ] Får logga åtgärd på röda flaggor (gul hammare) -> ger gul flagga
- [ ] Får logga hinder på röda flaggor (blå stopp-hand) -> ger blå flagga
- [ ] Får logga "hinder undanröjt" på blå flaggor -> återgår till ursprunglig färg
- [ ] Får logga "arbete pågår" på röda flaggor -> ger orange flagga
- [ ] Får se alla journalposter, eller?
- [ ] Allt ovanstående gäller väl endast entreprenörs-lagret?
- [ ] Ska E kunna se lager B över huvud taget?

Orange -> kommer framöver betyda "arbete påbörjat"
Nya orange = grå
Mossgrön -> kommer betyda "dokumentation"

Lager:
* E = Entreprenören (huvudentreprenören)
* B = Beställaren

* S = Slutlig bedömning skjuts upp => orange arbete pågår

Mossgrönt = notering (samma som dokumentations-flaggan)
* K = notering
* A = samma som K?

* U = Ska utredas  = röd, utredning ska levereras med gul hammare

Magenta/lila, dvs det är avvikelser men de ska inte åtgärdas
* "Avhjälps ej" = beställaren kanske vill ha ersättning
* N = samma som "Avhjälps ej"


Färgjämförelse med Bluebeam:
rosa
röd
blå
grå = avvisas




## Möte Malin 2022-09-26
Framsidan är bra

Sida 2: 
Lägg till Entreprenör

Inbjudningar.

Entreprenör & Beställare ska med på sida 2 i rapporten.

Portalinbjudan-mailet har fel i rubriken {{projectName}}

Manuell inskrivning av mailadresser vid rapportdelning = krångligt

Terminalen 4, kontrollpunktsportal (röda + orange)

Terminalen 4, kontrollpunktsportal (röda + orange)

Licens per projekt.

Johan Persson, gul hammare på Terminalen 4.



## Planering 2022-08-25
* Martin visar web GUI så långt han har kommit
* Diskussion kring web GUI
* Micke går igenom grundstruktur
* Micke går igenom återstående delar
* Prioritering/planering

### Action points efter mötet

#### GUI
Vi bestämde oss för ett bra GUI-flöde med menyer och dialoger.

##### System-övergripande meny i vänster-marginalen
- [ ] hem
- [ ] projekt
- [ ] inbox
- [ ] mitt företag
- [ ] support

##### Context-meny i ovankant av arbetsytan
Contetx-menyn speglar det man f.n. har uppe på arbetsytan. Om arbetsytan visar projekt-dashboard så visas projekt-relaterad meny med t.ex följande menyval:
- [ ] Ritningar
- [ ] Rapporter
- [ ] Dokument

Dessa menyer öppnar dialogruta med t.ex ritningslista, rapportlista, etc. När ett val görs ändras arbetsytan till det valda objektet, t.ex protokoll-miljön om man klickar på skapa ny rapport. När arbetsytan ändras, ändras även contextmenyn.




## Grundstruktur
### Same same but different
Vår ursprungliga rapportstruktur används. Dvs report, report_type, report_type_variant, generering, distribution, jsreport, etc, återanvänds

### Mallbaserat
Nuvarande rapporter är "handbyggda" i HTML i jsreport. Rapporterna är flexibla och kan i viss mån ändra utseende baserat på indata och inställningar. Men användaren kan inte på något sätt ändra rapportlayouten.

Nya, mallbaserade rapporterna, kommer ge möjlighet för användaren att strukturera om rapporter, ändra, lägga till, ta bort sektioner, välja typ av innehåll i sektioner mm.

Mallar byggs interaktivt i Martins web-GUI. När en rapport har redigerats tills man är nöjd kan man spara den som mall och återanvända.

Om en mall är helt automatiserad och inte behöver någon manuell  inmatning ska man kunna beställa rapporten från appen på samma sätt som gamla generationen rapporter.

![](Besiktningskontrollpunkt,%20protokoll,%20etc/E480E575-E83E-43DD-B5B7-F47C6316A08C.png)

### Sektioner
Mallar byggs upp genom att man skapar sektioner i rapporten. Vi har ett antal grund-typer, s.k. `sectionTypes`, t.ex:
* fritext
* kontrollpunktlista
* distributionslista
* deltagarlista
* tidigare besiktningar
* dokument
* signatur
* titel
* företagsinformation

Flera av grund-typerna kommer behöva användas i olika konfigurationer, detta gäller i högsta grad kontrollpunkter. Med konfiguration avses t.ex filter och layout. Ibland vill man enbart visa kontrollpunkter med en viss status (bara röda, etc). Ibland vill man ha utförlig layout med bilder och ritningsutsnitt.

Listan med sectionTypes kanske konsolideras framöver. Flera typer liknar varandra och kanske kan slås ihop. En "titel" är te.x samma sak som "Fritext" om man inte fyller i någon text.

Vi "paketerar" konfigurationer i s.k. "sectionConfigs". En sectionConfig utgår från en sectionType och tillför inställningar såsom t.ex filter.

SectionConfigs är det som användaren kommer se. SectionTypes används bara av bakomliggande system. SectionConfigs har sina namn och beskrivningar i Locize.

Exempel på sectionConfigs:
- [ ] "Rosa brandtätningar" = kontrollpunktlista med filter för enbart rosa brandtätningar
- [ ] "Besiktningsavvikelser" = kontrollpunktlista med röda+orange besiktningsflaggor

Vilka configs som är valbara i en viss rapportlayout beror på vilken reportTypeVariant som är vald. I de flesta fall kommer reportTypeVariant vara automatiskt vald baserat på t.ex vilken typ av besiktning som har utförts. 


9	plain title	Just a plain title.
10	company content	Content linked from company content table
1	controlpoints	A list of controlpoints. Filter, sorting, column layout should be specified in section_config
2	free text editor	WYSIWYG editor for free text input
3	distribution list	A list of email addresses for automatic distribution of the finished report
4	attendance list	A list of attendees, usually automatically collected from an inspection. Can be manually edited.
5	previous inspections	List of previous inspections in the same inspection series. Only applicable if the report is connected to an inspection
6	documents	One or more links to documents from the company document archive
7	signature	Date or period for the underlaying inspection. Only applicable if the report is connected to an inspection
8	inspection date	Signature section with either a scanned signature from the report creator, or the name written in script font
11	Company information	Company information for the company owning the project
12	Project information	NULL


## Nya frågor till Malin 2022-04-13
Arbetsflöde, förslag
1. starta besiktning i appen 
   1. Välj typ av besiktning samt skrå (FB, RÖR)
   2. lägg till närvarande och/eller ge dem QR-kod för registrering
   3. mata in besiktnings-info (kan även göras senare)
2. Sätt ut flaggor som vanligt
   1. Allt som händer under pågående besiktning märks upp med t.ex "FB1-RÖR"
3. Hur "lyfter" vi in tidigare fel i aktuellt protokoll?
   1. automatiskt via typ av besiktning?

ex1: FB2 inkluderar automatiskt röda flaggor från FB1
ex2: SB1 inkluderar flaggor från senaste FB
ex2: ÖB1 inkluderar inga flaggor eftersom överbesiktning måste göras av "oanvänd" besiktningsman.
Vilka besiktningstyper ska i så fall automatiseras gällande flagg-överföring?
2. eller manuellt. Dvs man ser alla gamla röda flaggor och har möjlighet att "föra över till aktuell besiktning" genom att klicka på dem.

obs! Man ser endast röda flaggor som tillhör besiktningar inom samma skrå, dvs om man kör BETONG-SB2 så ser man alla röda betong-flaggor från FB1, FB2, SB1
1. avsluta besiktning
2. Hemma vid datorn..
3. Öppna projektet
4. Gå till "besiktningar"
5. Lista visar status för alla besiktningar, t.ex "pågående", "protokoll skapat"
6. Välj den besiktning som protokoll ska skapas för
7. Välj protokollmall (om det finns fler än en), t.ex "ABT 06, alla rubriker", eller ABT 06, min version"


### Angående protokoll-strukturen (rubriker)
Vill man alltid se alla ABT-rubriker (25st) för att inte missa något, eller villl man göra egna mallar för olika ändamål?
Ex: en FB kanske normalt har 15 av 25 rubriker,
medan en SB har 20 rubriker.

Rubrik 13-17 är ihopslagna i alla protokoll-exempel jag har sett. Gör man alltid så, eller vill man dela upp?
Svar: Ja, Malin har aldrig sett ett uppdelat protokoll. Bokstavskoderna anger ju status på varje flagga.
![](Besiktningskontrollpunkt,%20protokoll,%20etc/4F496F6C-F923-43FB-94ED-BB8585F76349.png)

Kanske även rubrik 23 slås ihop med dessa?
![](Besiktningskontrollpunkt,%20protokoll,%20etc/D280D96E-284B-4791-9687-AA890B21B8E7.png)

- [ ] Vill man ha rubrik-numrering i protokollen?

Svar: Nej

## Datamodel och API
### API endpoints

```
/protocols (GET)
/protocols (POST = skapa nytt protokoll)
/protocols/:protocolId (GET)
/protocols/:protocolId/sections (POST = spara alla sections)
/protocols/:protocolId/sections/:sectionId (POST = spara en section)


/protocol-templates (POST = skapa ny template)
/protocol-templates/:templateId (GET = hämta template)

```


## Zoom-möte med Malin
Försyn
Slutsyn
Eftersyn

AMA-21
ABT-06 Besiktning
Syn före påbörjande av arbete

Bygg
El
Glas
Fasad
BR
BYGG
EL
VS
V
VVS
S
SP
M
H

![](Besiktningskontrollpunkt,%20protokoll,%20etc/E4B1F296-2AC7-43F0-8311-877711D92DD3.png)



## Journalformulär
- [ ] Kryssruta "Inkludera bild i protokoll"
- [ ] Kryssruta "Inkludera ritningsutsnitt i protokoll"
- [ ] Valruta för bokstavskoder E, B, S, U, A, N?

Kan en och samma flagga ha flera bokstäver?
Ex: EN1 = flagga nr 1, entreprenören ska fixa, beställaren vill ha avdrag

## Numrering
### Kategoribokstäver
Är kategoribokstäverna standardiserade någonstans? Det verkar skilja lite.
* E = Entreprenören
* B = Beställaren
* S = Slutlig bedömning skjuts upp
* U = Ska utredas
* K = notering
* "Avhjälps ej" = beställaren kanske vill ha ersättning

* N = samma som "Avhjälps ej"
* A = samma som K?

### Omnumrering vid nytt protokoll?
Man verkar föra över gamla återstående avvikelser till nytt protokoll genom omnumrering. 
Jag tycker att detta blir tokigt. 
Är det ett krav?

All numrering sker inom respektive protokoll, dvs punkterna är bara unika tillsammans med sitt besiktningsnamn "FB8 E 9".

Kan man istället tänka sig en nummerserie för hela projektet, dvs nr 987 har alltid sitt unika nummer..

Ibland sätts protokollnummer efter bokstaven, t.ex "E1.1". Jag skulle föredra det andra sättet som jag har sett "FB1 E1"

### Protokoll-typer (prefix)
FB1 = första förbesiktningen
SB1 = första slutbesiktningen
EB1 = efterbesiktning 1

### Protokoll-namn
Jag har sett protokollnamn som inkluderar namn på skrået, t.ex "RÖR FB1"

Hur gör man om det är flera skrån inblandade? 
Bygg+vvs i samma besiktning, t.ex

Eftersom varje skrå/besiktningsman verkar ha en egen löpnummerserie behöver vi ett unikt prefix, t.ex "RÖR", "GLAS" etc.

Hur kan vi bygga upp dessa? Finns det en standardlista, eller blir det en lista per projekt?

Varför måste vi ha en lista? Annars riskerar man olika stavningar, e.x "Rör FB1", "RÖR FB2"...  Eller "MÅL SB1", "MÅLNING SB2".

### Starta ny besiktning
Formulär att fylla i:
- [ ] Typ = FB/SB/..
- [ ] Namn = "Bygg", etc (fritext)
- [ ] Löpnummer, automatisk räknare inom varje typ (FB1, FB2, etc)
- [ ] Kryssa i vilka skrån som ingår (från skrå-lista som vi bygger upp)

## Protokoll-rubriker
Är det standardiserat vilka rubriker som ska tas med?
1. Typ av besiktning
2. Besiktningens omfattning
3. Tid för besiktningen
4. Entreprenaden samt parterna
5. Besiktningsman **OVANLIG**
6. Närvarande (representerar, namn, funktion)
7. Sättet för kallelse till besiktningar
8. Tidigare besiktningar och provningar
9. Entreprenadhandlingar och andra överenskommelser
10. Delar som inte är åtkomliga för besiktning
11. Delar som inte besiktigas okulärt, utan endast på grundval av entreprenörens dokumentation över avtalade kvalitets och miljöåtgärder
12. Fel, bristfälligheter, anmärkningar och förhållanden
13. Parternas överenskommelse om när fel skall vara avhjälpta
14. Övriga noteringar
15. Sändlista
16. Undertecknas


## Fritext till protokollet
Det verkar som att det kommer behövas helt fria texter till inledningen på protokollet. Ex:

![](Besiktningskontrollpunkt,%20protokoll,%20etc/788DBD7F-E57E-4356-8103-1BEADED104FC.png)