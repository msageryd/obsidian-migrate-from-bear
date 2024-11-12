# Vad är en kontrollpunkt-typ?

#plantrail/controlpointTypes

# Kontrollpunkt-typer i PlanTrail
I PlanTrail har vi delat in kontrollpunkter (flaggor) i olika typer. Det finns många anledningar till denna indelning. Här följer en uppräkning.

## Rättigheter
Rättighets-systemet i PlanTrail är omfattande. I varje tilldelad “roll” i PlanTrail kan t.ex ge rättighet att se vissa typer av kontrollpunkter, eller att skapa vissa typer.

## Symboler och utseende
Varje kontrollpunkt-typ har sin egen symbol samt egna inställningar avseende flaggornas utseende, såsom t.ex form på ledar-linje (rak, knä, böjd). 

Vilka texter som ska visas i flaggan är också inställbart per kontrollpunkt-typ. Brandtätningsflaggor visar oftast bara flaggans nummer samt eventuell kortkod för flaggans ritningslager, eftersom det kan vara väldigt många brandtätningar på en ritning. Besiktningsflaggor visar hela lagernamnet (oftast ett fackområde) samt eventuell flagg-text om sådan anges.

Vissa kontrollpunkt-typer kan anta flera olika former (flagga, klammer, revideringsmoln). Vilka former som kan användas bestäms av kontrollpunkt-typen. En “brandtätning” kan t.ex inte visas som ett revideringsmoln.

## Nummerserier
I normala fall har varje kontrollpunkt-typ sin egen nummerserie. Om man t.ex använder både brandtätnings-flaggor och ljudtätnings-flaggor på samma ritning har de varsin nummerserie. Det går även att dela nummerserie mellan flera kontrollpunkt-typer.

## Produktregister
De kontrollpunkt-typer som ger möjlighet för användaren att koppla in “installerade produkter” presenterar ett produktregister som är anpassat för just den kontrollpunkt-typen. 

Ex: PlanTrails produktregister innehåller flera hundra produkter för brandtätning, men bara ett 10-tal för brandskyddsmålning. En kontrollpunkt av typen brandskyddsmålning visar endas de relevanta produkterna för att användaren ska slippa söka igenom hela registret.

## Rapport-filter
Varje rapport i PlanTrail är designad för ett specifikt ändamål. Oftast är designen gjord för en specifik kontrollpunkt-typ, t.ex “Egenkontroll brandtätning”.  Även om projektet innehåller andra typer av kontrollpunkter kommer brandtätningsrapporten endast ta med brandtätningar eftersom denna rapport har ett grund-filter som bara släpper igenom brandtätnings-flaggor.

## Journal-formulär
De flesta kontrollpunkt-typer har olika behov av inmatningsfält i sina journalformulär. Vissa journalformulär delas mellan flera kontrollpunkt-typer (t.ex “hinder”), men de flesta journalformulär är anpassade för en viss typ av kontrollpunkt.

## Journal-flöde
PlanTrail har ett regelbaserat journal-flöde. Reglerna bestämmer vilken typ av journal som kan skapas i olika skeden. Journal-flödes-reglerna tillsammans med användarens rättigheter bestämmer vad som kan utföras på en viss kontrollpunkt.

Ex: När en brandtätare har registrerat sitt utförda arbete med “gul hammare” blir flaggan gul och inväntar godkännande eller avslag. När man klickar på denna flagga får man välja på “godkänn” eller “avslå”, om man har rätt till dessa journaltyper. Den gula hammaren kan inte användas på gula flaggor pga journal-flödes-reglerna.

## Statusfärgernas betydelse
De olika status-färger som PlanTrail använder sig av betyder ungefär samma sak för olika kontrollpunkts-typer. Allvarlighets-graden i färgskalan är densamma för alla typer av kontrollpunkter, men den exakta betydelsen av respektive färg kan variera.

## Modul-paketering
Våra kontrollpunkt-typer säljs i moduler där vissa typer ingår, för att varje användare ska kunna betala endast för det som de har nytta av. 

Ex: Besiktningsmän vill oftast inte betala för funktionalitet som avser brandtätning.

## Projekt-paketering
En användare som har många olika PlanTrail-moduler får en lång menyrad med kontrollpunkt-typer att välja på. Om ett viss projekt bara avser en eller några typer kan detta ställas in på projektnivå så man slipper se de kontrollpunkt-typer som inte ska användas.

Ex: En besiktningsman som har modulerna EB (EntreprenadBesiktning) och BL (ByggLedning) har sällan användning för båda typerna i samma projekt.