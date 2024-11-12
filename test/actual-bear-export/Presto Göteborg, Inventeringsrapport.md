# Presto Göteborg, Inventeringsrapport
#plantrail/reports

## Bakgrund
Jonatan Gustafsson på Presto Väst (Göteborg) använder rosa brtandtätningsflaggor vid inventering av bygnadstekniskt brandskydd. Då dessa flaggor redan är av typen "brandtätning" är lätt att fortsätta på samma flagga om offerten accepteras och faktisk brandtätning ska utföras.

Ibland påträffas andra problem som inte är konkreta brandtätningar i byggnader. I dessa fall vill Jonatan dokumentera problemet och få med denna dokumentation i inventeringsrapporten. Inventeringsrapporten innehåller i vanliga fall endast brandtätningar som har status "rosa".

Jonatan vill kunna rita ut de andra problemen med moln-funktionen på ritningar.

## Möjlig lösning
Vi har en kontrollpunktstyp som vi kallar "Besiktning/Dokumentation". Denna typ kan ritas ut med formen "revideringsmoln" på ritningen, som Jonatan önskar.

Vi skulle behöva bygga ut inventeringsrapporten så att den även visar utestående avvikelser av typen "Besiktning/Dokumentation".

## Frågor och problem
### Q1. Status på besiktnings-flaggorna (färg)
Besiktningsmodulen använder f.n. tre status-färger, orange, röd och grön.

Orange = avvikelse som inte behöver åtgärdas
Röd = avvikelse som måste åtgärdas
Grön = Ingen avvikelse (endast notering) eller avvikelse åtgärdad

Vilken statusfärg vill Jonatan använda för att få med besiktningsflaggor i brandtätnings-inventeringsrapporten?

Ska vi lägga till rosa status för besiktningsflaggorna?
Eller ska vi ta med alla röda besiktingsflaggor i rapporten?

**Svar:** Rapporten ska visa alla rosa brandtätningar samt alla röda besiktnings-flaggor.

### Q2. Nummerserier
Normalt sett numreras varje kontrollpunktstyp med separat nummerserie. Om vi låter flera kontrollpunktstyper samexistera på samma rapport kommer det bli dubbletter i nummerserierna. 

Dvs det kan finnas brandtätningar med nr 1,2,3, etc samt besiktningar med nr 1,2,3.

Hur vill Jonatan numrera avvikelserna?

Jag föreslår att vi låter det vara precis som det är. Besiktningsflaggorna har en egen symbol som särskiljer dem på ritningen. Dessa flaggor kommer dessutom presenteras i separat tabell i rapporten.

**Svar:** En nummerserie per kontrollpunktstyp blir utmärkt.

### Q3. Lagerseparering
PlanTrail har stöd för separering av kontrollpunkter på olika "ritnings-lager". Besiktningsmodulen använder lager-funktionen för att separera de olika skrån som kan tänkas åtgärda respektive besiktnings-avvikelse.

Behövs denna hantering i Jonatans use-case?

**Svar:** Jonatan ser inget behov av lagerseparering i dagsläget