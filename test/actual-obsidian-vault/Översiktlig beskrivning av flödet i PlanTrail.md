# Översiktlig beskrivning av flödet i PlanTrail
#plantrail/security

Detta dokument är endast ämnat för de personer som erhåller det direkt från PlanTrail. Våra säkerhetslösningar är inga konstigheter, utan snarare “best practice”. Men vi vill ändå inte sprida kunskap om detta i onödan eftersom det förenklar en eventuell attack.

Vänligen sprid inte dokumentet till obehöriga.

### PlanTrail
PlanTrail är ett system för egenkontroll, främst inriktat på brandskydd och besiktning. Det löpande arbetet sker i en app. Data lagras lokalt i appen samt sparas på våra servrar i Amazons molntjänst.

### Projekt
PlanTrails kunder har f.n. hanterat sin egenkontroll i ca 2,000 skarpa projekt och lagrat ca 300,000 bilder från projekten. Några projekt är av känslig natur, såsom polisstationer, flygplatser, fängelser, mm.

### Lagring
All data lagras på våra servrar hos Amazon. 

Filer (foton, ritningar, mm) lagras på Amazon S3 och krypteras med AES-256.

Strukturerad data lagras i databas på Amazon RDS. Databasen är krypterad "at rest" med AES-256.

Hantering av krypterings-nycklar görs via Amazon KMS. Endast vissa av våra servar kan använda sig av dessa nycklar. Inga nycklar hanteras på klient-sidan.

Data som lagras lokalt i appen raderas automatiskt när användaren loggar ut, eller blir automatiskt utloggad pga inaktivitet.

### Kommunikation
All kommunikation med servarna sker krypterat via TLS.

### Rättighets-system
Endast användare med tilldelade rättigheter kan komma åt respektive projekt.

Användare loggar in med mailadress och egen-valt lösenord.

### Rapportering
Egenkontroll-rapporter skapas som PDF:er på våra servrar och distribueras till av användaren angivna mailadresser. Mailet innehåller en nedladdnings-länk som förfaller efter 7 dagar.

Rapporterna innehåller bilder som användaren har lagt in på kontrollpunkterna samt ritningar med utritade flaggor.

### Arbetsflöde
* Användaren öppnar projektet i appen
* Tillhörande ritningar hämtas ut till appen och lagras lokalt, okrypterat, för offline-användning.
* Användaren sätter ut kontrollpunkter (flaggor) på ritningen
* Användaren skapar journalposter på flaggorna. Journalposter kan innehålla bilder, kommentarer, kategorisering av installationen, installerade produkter, mm.
* Appen sparar automatiskt allt till servrarna så fort appen får Internet-täckning.

### Anonymiserade projekt
På ett antal känsliga projekt har våra kunder använt PlanTrail med anonymiserade ritningar och anonymiserad projektinformation.

Ritningarna har anonymiserats genom att ritningshuvud och annan känslig information har tagits bort. I vissa fall har detta inte räckt, då har vi lagt in "tomma ritningar", dvs ett tomt rutat papper. Detta hjälper installatören att hitta sina kontrollpunkter på ett ungefär, eftersom flaggorna sätts ut på pappret i ungefär den del av byggnaden de befinner sig.

Här är ett exempel på hur ett "ritningslöst" projekt kan se ut i appen.
![[93516974-7927-42B0-BC52-9440D0C28E96.png]]


Lösningen med ritningslösa projekt har godkänts på flera håll, men inte accepterats på försvarsanläggningar där man inte ens får ha med sig mobiltelefon.

### Risker med känsliga projekt
Även med ritningslösa projekt i appen kan det uppstå spårbarhet. 

#### Risker på klient-sidan
- [ ] användaren fotograferar spårbara objekt
- [ ] användaren skriver in spårbara anteckningar i appen

#### Risker hos PlanTrail
Hantering av kundernas projekt sker antingen av oss på PlanTrail eller av kunden själv. Om kunden själv lägger upp projektet och ser till att allt är anonymiserat finns ingen spårbarhetsrisk hos oss, utan enbart hos vår kund som vet vad det anonymiserade projektet avser.