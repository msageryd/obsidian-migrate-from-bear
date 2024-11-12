# Bengt Dahlgren, Wilma Krausches utvärdering

#plantrail/inspection

## Mickes tankar kring Wilmas punkter
> Lägga till ”inventering” och ”utförandekontroll” som förval.
Det här kanske löses bäst med två separata kontrollpunktstyper.

> Internt flöde ska prioriteras för inventering (alt. vara möjligt även för brandbesiktning), med tydliga skillnader på fotodokumentation och avvikelser. ”Allvarlighetsgraden” bör också särskiljas med färgkoder (ex rött, orange & grönt).


> ”Fråga-svar”-funktionen samt ”intyg” borde läggas in som valbara uppgiftstyper.
Fråga-svar har vi på vår att-göra-lista. Det kommer bli en mycket användbar funktion inom alla våra kundtyper (besiktningsmän, brandkonsulter, brandskydds-installationer)

> Checklistor/”att-göra-listor bör finnas, både en enkel och en mer avancerad version.
Checklistor har vi också på vår lista, men vi har avvaktat lite för att kunna lösa detta i samarbete med någon så vi kan få input för att bygga den bästa lösningen.

> Ha möjlighet att välja vilka punkter som ska visas på ritningen (både uppgiftstyper och kategorier), både i appen och på hemsidan.
Först ut kommer bli appen. Där kan man f.n. tända och släcka ritningslager. Vi kommer lägga till fler urvalsmöjligheter i den filterfunktionen, t.ex: 
- status på kontrollpunkter
- kategorier
- typ av kontrollpunkt
- datumintervall
- skapad/ändrad av “användare”

> Bra med funktionen att kunna redigera befintliga punkter. Även bilder bör kunna hanteras i efterhand.
Bilder kommer kunna läggas till och tas bort mha ändrings-journaler

> ”Punktformat” för noteringarna (ett tillägg till flagga, moln mm.) bör finnas.
“Punkt” eller “kartnål” är lätt att lösa, men vi ha aldrig hört det önskemålet. Problem med denna typ av flagga är att det inte går att peka ut exakt vad som avses (ingen ledarlinje) och det finns ingen yta att skriva varken nummer eller text. Innan vi lägger till denna funktion behöver vi veta att den verkligen är användbar. I våra ögon är precisionen i våra flaggor överlägsen andra system och vi är inte jättesugna på att “nedgradera” till konkurrenternas nivå.

> Intressant idé med att få ut en brandskiss och underlag för utrymningsplan direkt i appen. Då krävs dock större utbud av symboler (förslagsvis Bimfire) för att vara konkurrenskraftig med Bluebeam.
Inga problem att lägga till fler symboler. Helst vill vi hålla oss till standardsymboler (ISO, SBF, etc), men om dessa inte räcker till kan vi lägga till andra symboler.

> Redigering av punkter bör även kunna ske på hemsidan.
Just nu pågår utveckling av detta. I steg ett blir hanteringen i tabellform på webappen. I nästa steg kommer även ritnings-hantering byggas in i webappen.

> En överblicksbild på ritningen med samtliga valda punkter bör finnas även i brandskyddsbesiktningsrapporten.
Denna funktion finns redan. Det är bara att kryssa i detta i rapportinställningarna.

> Möjlighet att välja vilka punkter som ska vara med i rapporten.
Filterfunktion finns för rapporter, men fler urval kommer läggas till. F.n. kan man välja vilka ritningar och vilka ritningslager som ska tas med.

> Eftersom inventeringar är en stor del av brandkonsulters uppdrag tror jag att det skulle vara mycket användbart med en funktion i appen som underlättar detta arbete. Till exempel skulle det vara bra att kunna välja "inventering" direkt från början, istället för att endast ha alternativet "brandskyddsbesiktning". Även "utförandekontroll" borde finnas som ett valbart alternativ.
Betyder det att det behövs tre olika typer av kontrollpunkter, var och en med egna “flöden” och egna rapporter? Eller är utförandekontroll och brandskyddsbesiktning samma sak?
- inventering
- utförandekontroll
- brandskyddsbesiktning

> Vid inventeringar är det framför allt viktigt att kunna hantera det interna flödet, och därför skulle det vara bra att kunna särskilja dokumentation från avvikelser. Det borde sedan vara enkelt att skapa en enkel ritning med de specifika punkter som man vill förmedla till beställaren.
Jag tror att vi har precis detta. Varje flagga har en “status”. Vi har hämtat statuskoderna från Entreprenadjuridiken (ABT-06) och i samråd med brandkonsulter justerat lite. Statuskod “K” ger mörkgrön färg på flaggan, vilket markerar att det är en dokumentation, till skillnad från klargrön som används för avvikelser som har blivit åtgärdade.

Man kan filtrera på dessa och t.ex skapa en rapport med endast K-flaggor, eller separera olika status på olika ställen i rapporten.

Helst skulle vi vilja mappa våra bokstäver mot någon standard inom brandskydd, men när vi pratar med brandkonsulter blir det alltid lite luddigt vad man avser. 

Ex: Om vi har en flagga som enbart används för “Besiktningsman brandskyddsanläggningar” skulle vi kunna mappa bokstäverna mot SBF 141:4, men dessa kanske inte passar så bra för “inventering”?
![[image 2.png|548]]



> För utförandekontroller tycker jag att även "intyg" borde vara en möjlig uppgiftstyp som kan läggas in, likt funktionen som finns i Dalux. Funktionen "fråga-svar" (samt "för din info", "projekteringsanvisning" och "utredningsbehov") som finns i Dalux verkar också användbar, även om jag personligen inte har testat dem än. 
Det låter spännande och vi är öppna för att lösa detta. När du skriver “uppgiftstyp” är det då en funktion i PlanTrail du syftar på? Kanske det vi kallar för “journal-typ”?


> Det skulle vara väldigt hjälpsamt att kunna skapa en checklista inför platsbesöket. Man ska ha möjlighet att göra både en enkel intern lista (likt den punktlistfunktionen som finns på iPhones anteckningar) och en mer avancerad lista där även entreprenörer kan bjudas in. Figur 1 visar exempel på hur detta är upplagt i Dalux.
>![[009caa9d-7882-4665-9df9-5f35071527bd.png|292]]
Vi vill bygga världens bästa checkliste-funktion och är väldigt intresserade av input. Vi har tänkt oss en lösning där man kan:
- skapa egna checklistor
- varje ändring av enskilda punkter i listan görs med journaler, precis som på vanliga ritnings-flaggor. Detta ger full spårbarhet och man ser vem som har bockad av vad i en lista.
- Den högra exempel bilden ser ut som en vanlig kontrollpunkt, eller? Garaget finns väl på ritningen, så den kontrollen borde väl ligga som en ritningsflagga?

> Det vore bra att kunna välja vilka punkter som visas samtidigt på ritningen. Efter en inventering kan det finnas över 100 punkter på samma ritning, vilket gör det svårt att överblicka. Därför skulle det vara tydligare om man i appen och på webbplatsen kunde välja att endast visa till exempel avvikelser eller intyg, eller att filtrera efter specifika kategorier/ämnen. En sökfunktion som både visar aktuella punkter på ritningen och i en lista skulle också vara en bra funktion att ha i PlanTrail.
Detta är vår plan.

> Jag förstår att färgerna på punkterna är förbestämda och ska vara enhetliga med andra discipliner, men att kunna särskilja dokumentation från avvikelser vid inventeringar skulle göra det mycket tydligare när alla punkter visas samtidigt. Jag skulle gärna vilja se att man kunde välja till exempel "ska åtgärdas", "åtgärd rekommenderas" och "dokumentation", med färgerna rött, orange respektive grönt. För att undvika att blanda ihop färgerna med de som redan används vid brandskyddsbesiktningar skulle inventering antingen behöva bli ett eget alternativ från början, eller så skulle andra färger behöva användas.
Detta stämmer väl ganska bra med våra färger? Vi har visserligen ingen “åtgärd rekommenderas” som egen färg. PlanTrail är väldigt flexibelt när det gäller detta och vi vill gärna sätta oss ner och definiera behoven på t.ex en”inventerings-flagga”



> Kategorierna som finns inlagda tycker jag är bra och heltäckande.
Kategorier defineras per företag, så det är enkelt att ändra dessa för t.ex BD Malmö.

> Jag tycker det är jättebra att man enkelt kan ta bort, redigera och flytta redan inlagda punkter i efterhand, något som till exempel inte är möjligt i Dalux. Det borde också vara möjligt att lägga till eller ta bort bilder för varje punkt i efterhand. Jag förstår dock varför Dalux intetillåter ändringar i efterhand, och därför skulle en funktion där man kan "låsa" punkter vara en bra kompromiss.
Lägga till bilder kan man göra i efterhand i PlanTrail. Snart kommer man även kunna ta bort bilder. Andra system som t.ex Dalux måste låsa ner såna funktioner eftersom de inte är helt journalbaserade som PlanTrail. Alla ändringar av en flagga i PlanTrail sker genom journaler. Journaler kan aldrig tas bort eller ändras. Borttagning av bilder kommer ske med en journal som anger vilka bilder som ska bort, men ursprungsbilderna kommer alltid finnas kvar i de journaler som skapade bilderna, även om de nu inte syns på själva kontrollpunkten.

> Personligen föredrar jag att förinställningen för tillagda punkter är just punkter (som i Dalux) istället för flaggor med streck, eftersom det ger en renare ritning. Det vore bra om man själv kunde välja vad som ska vara förinställt, men samtidigt ha möjligheten att ändra formen till punkter, moln, flaggor med mera. Flaggorna är absolut nödvändiga i vissa fall, så de bör vara möjliga att använda.
“Flaggorna är absolut nödvändiga i vissa fall”!
Detta betyder väl att man inte kan använda något annat system än PlanTrail =)

> Att lägga till ikoner för varje punkt under ett platsbesök kan nog bli lite för tidskrävande. Däremot ser jag, precis som ni nämnde tidigare, viss möjlighet att skapa en brandskiss (och kanske även underlag till en utrymningsplan) direkt i appen. Då olika företag använder olika symboler skulle det däremot behövas ett stort utbud av symboler. Utbudet är redan bra idag, men det som behövs kompletteras (särskilt för brandskisser och utrymningsplaner) är till exempel angreppsväg (grön pil), utrymningsplan, "här är du"-markeringar, samt ett större utbud av vägledande markeringar (som genomlysta/efterlysta symboler, fler riktningar och symboler för personer med funktionsnedsättning). Jag tror många företag använder Bimfires symboler, men jag förstår att licenser kan bli kostsamma. Utöver detta tror jag det blir svårt att införa eftersom Bluebeam redan är så etablerat i branschen, och att skisser mer och mer kommer övergå till ritningar.

> För att underlätta redigering i efterhand (till exempel för att förfina en ritning till en brandskiss) borde man kunna redigera ritningen (lägga till eller ta bort punkter med mera) även i webbversionen. Det är ofta enklare att arbeta på en större skärm än på mobilen. Att kunna få upp punkterna på ritningen i datorn skulle också göra det enkelt att snabbt ta en skärmdump eller spara ned den som en bild, till exempel för att dokumentera avvikelser.

> Jag är mycket imponerad av det arbete ni har lagt ner på rapportmallarna – där ligger ni långt före Dalux! Även om jag tyvärr inte har haft möjlighet att skicka iväg någon rapport i skarpt läge, har jag testat dem och uppskattar särskilt att man får en lista med detaljerad information om varje punkt. Jag skulle dock vilja se den överblick över alla anmärkningar som finns i "brandskyddskontrollen – fel och iakttagelser" även i brandskyddsbesiktningsrapporten.
> 

> Processen att skapa nya projekt och lägga in ritningar är enkel och smidig.

>Jag saknar dock möjligheten att välja vilka punkter som ska inkluderas i rapporten.
