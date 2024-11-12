# Firesafe onboarding


Bluebeam: 350kr per månad
Acrobat: 240kr per månad

- [ ] Ingen server
- [ ] Ingen effektivisering
- [ ] Ingen säkerhet
- [ ] Inga arbetsflöden


#planTrail/kunder

## Önskemål från FireSafe
- [ ] Android
- [ ] API för att skapa projekt
- [ ] API för att hämta rapporter
- [ ] API för produktregister
- [ ] SSO/Azure för användarhantering
- [ ] Ritningsimport
- [ ] AppStore / Google Play
- [ ] Brandad rapport


### Android
Vilken hårdvaru- och mjukvaruspecifikation behöver vi stödja?

* Sämsta telefonen
* Lägsta Android-versionen

Vissa funktioner kommer inte byggas i Android, men alla viktiga funktioner för att kunna jobba ute i fält kommer vara med.

Exempel på funktioner som inte kommer till Android:
- [ ] Avancerad PDF-hantering (snippets)
- [ ] Ritningsimport direkt i appen

### Api för att skapa projekt
Vi vill inte exponera ett komplett API där alla uppgifter kan fyllas i eftersom det låser upp oss i vår interna struktur som fortfarande är ganska ung.

Ex:
projekt.properties.projectId
projekt.properties.client.contactName
projekt.properties.client.projectId
projekt.properties.contractor.streetAddress

Huvudnyttan borde vara att skapa ett enkelt projekt samt upprätta dubbelriktad kommunikation mellan PlanTrail och Firesafe.

Vi föreslår ett API som stödjer följande:
- [ ] Skapa nytt projekt under specifikt regionkontor
- [ ] Sätta ett namn på projektet (inkl dubblettkontroll)
- [ ] Sätta unikt FireSafe-id på projektet
- [ ] Alternaivt returnera det unika PlanTrail-id:t på projektet
- [ ] Kanske returnera url till projektportal

### API för att hämta rapporter
Vilka rapporter ska hämtas? Ofta skapas utkast eller testrapporter. Hur identifierar man de rapporter som man verkligen vill spara i Dynamics?

Är det inte bättre att låta användaren välja vilka rapporter som ska skickas till Dynamics och att PlanTrail skickar dessa till API i Dynamics?

### API för produktregister
PlanTrails produktregister används av många kunder. Som produktleverantör är det viktigt att FireSafes del av vårt produktregister är stabilt samt hålls uppdaterat.

Våra produkter är taggade med tillhörighet till vissa kontrollpunktstyper, ex. brandtätning. Vi vill inte att någon extern part skickar in produkter som hamnar i alla kunders produktregister utan att vi har kontroll.

Vi har också en struktur på våra produkter med t.ex sub-produkter som delar huvudproduktens datablad, men är av en annan typ. T.ex olika strypar-storlekar.

Vad är det för produkter som FireSafe vill skicka in gällande brandtätning?

Behöver vi tänka om när det gäller produktregistret? Om FireSafe vill bestämma kanske de behöver en privat del av produktregistret, eller t.o.m ett helt extent produktregister med sökfunktioner och möjlighet att länka in dessa produkter via url.


### SSO


### Ritningsimport


### AppStore


### Brandad rapport
Våra rapporter är viktiga för oss i marknadsförings-syfte. Vi vill inte skapa total-brandade rapporter, utan vi vill ha kvar vår logga samt "producerad med PlanTrail".

I övrigt kan vi designa på valfritt sätt.

Brandad rapport kommer förmodligen inte gå att passa in i vår vanliga rapport-struktur, utan kommer kräva en helt separat rapport-typ. Dvs FireSafes rapport kommer kräva separat underhåll och kan inte "ta rygg" på vårt vanliga rapportunderhåll.

Mycket beror på hur "hårt brandad" rapporten behöver vara. Om vi kan tweaka våra befintliga rapporter och göra layoutjusteringar som baseras på kundinställningar kan vi ta rygg på våra standardrapporter.

Vi behöver se ett layoutförslag från FireSafe.