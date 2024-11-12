# Hantering av “Återför till besiktning” vid följdfel
2023-11-23: Tel med Ted.
#plantrail/controlpointTypes

**Scenario:**
Teds entreprenör har gulmarkerat en flagga (arbete utfört). 
Ted anser att åtgärden har åsamkat följdfel, så han vill fortsätta på samma flagga.
Teds önske-funktion:
- Vid följdfel skriver Ted in en helt ny text som avser nya felet
- Föregående text visas i bilagan med överstruken text

**Problem:**
- Hur ska det se ut om det blir flera följdfel på raken?
- Ibland är en “återföring” inget följdfel, utan en korrigering av stavning eller beteckning (från E till B)

**Tankar:**
- Följdfel leder till en specifik kedja av händelser/texter. Användaren måste ange att en ändring avser “följdfel”
- text-kedjor som skapas pga följdfel går inte att redigera eftersom de hamnar i tidigare journalposter.
- Vi kanske måste ge användaren möjlighet att korrigera texten i tidigare fel så att följdfels-kedjan blir bra läsning? Men detta strider mot vårt “lagd-journal-ligger”-koncept.
- Det är väl bara rimligt att registrera “följdfel” på gröna och gula flaggor? Ursprungliga felet måste ju vara åtgärdat innan något kan kallas följdfel.
- “Överstruken” text används redan i bilagor och betyder oftast “ej besiktigad på plats”. Detta koncept krockar med överstruken historik vid följdfel.
- Vi kommer få ett liknande “text-kedje-problem” att lösa vid vibration och stöt-besiktning. Dessa besiktningar göres enligt standarden SS 4604860:2022. Där definieras liknande “text-kedjor” med  färgkoder, t.ex grön textfärg för en “mellanbesiktning” och röd textfärg för efterbesiktning.

**Lösning?**
- Journaltyp “återför till besiktning” får en valruta högst upp där man får välja varför man återför flaggan: “Korrigering” eller “Följdfel”
- “Korrigering” är detsamma som vi hanterar idag, dvs stavning, betecknings-ändring, etc
- “Följdfel” skapar en kedja av texter inklusive senaste anteckningen.
- Text-kedja med datum-stämplar sparas så tidigare texter kan tas med i bilagan med överstruken text.


**Spara som utkast:**
Följdfelshanteringen tangerar ett annat koncept, “spara som utkast”, som vi kanske vill införa. Detta innebär att en journalpost lämnas öppen för redigering och inget annat kan utföras på kontrollpunkten innan man har stängt redigeringen. Detta kan vara lösning för de som vill komma hem till kontoret och skriva klart sina texter (brandkonsulter)
