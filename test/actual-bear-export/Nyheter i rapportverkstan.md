# Nyheter i rapportverkstan

Vi har gjort ganska många uppdateringar i vår rapportverkstad. Förhoppningsvis leder alla ändringar till en mer intuitiv miljö.

## Sektionslayout
- Vi har tagit bort de “grå” sektionerna i början och slutet av rapporten eftersom dessa inte var självförklarande.
- Högst upp på alla rapporter visas nu fälten “Rubrik” och “Underrubrik”
- Knappar för sidbrytning m.m. har nu ersatts av en tydligare meny.
- Om rapporttypen är “Bilaga Entreprenadbesiktning” visas inmatningsfält för besiktning och fackområde. Inmatade värden kan nås via autokoder om man t.ex vill ha “FB1-MARK” i sidhuvudet eller i filnamnet.
![](Nyheter%20i%20rapportverkstan/image%2010.png)<!-- {"width":386} -->

### Färgkodade sektioner
Om man lämnar en hel sektion tom kommer den inte att skrivas ut i rapporten, inte ens sektions-titeln skrivs ut. Med denna hantering får man möjlighet att skapa många sektioner i sin mall, men bara de man fyller i kommer med.

Nu visar vi tydligare om en sektion inte kommer skrivas ut i rapporten genom att gråmarkera den.

Här är “Entreprenaden” tom, dvs varken den sektionen eller dess tomma övergripande sektion “Entreprenaden samt parterna” kommer skrivas ut i rapporten.
![](Nyheter%20i%20rapportverkstan/image%208.png)<!-- {"width":313} -->

Så fort innehåll läggs till i “Entreprenaden” försvinner gråmarkeringen. Alla blå sektioner kommer med i rapporten.
![](Nyheter%20i%20rapportverkstan/image%209.png)<!-- {"width":282} -->

## Slutför rapport
Funktionen “Slutför rapport” har nu fått en egen knapp uppe till höger.
![](Nyheter%20i%20rapportverkstan/image%203.png)<!-- {"width":519} -->

Vid slutförande kan man, om man vill, ändra e-postämne, e-postmeddelande samt filnamn på den bifogade filen.
- Standardinställningen ger samma ämne och filnamn som tidigare
![](Nyheter%20i%20rapportverkstan/image%204.png)<!-- {"width":519} -->

### Egna inställningar
Den avancerade användaren kan bygga egna filnamn och automatisera detta i rapportinställningarna. Filnamn, e-postämne och e-postmeddelande som anges i inställningarna kan innehålla våra autoKoder. Koderna omvandlas till korrekta texter när rapporten slutförs.
![](Nyheter%20i%20rapportverkstan/image%202.png)<!-- {"width":519} -->

> Här är ett exempel på koden för filnamn om man vill använda de nya autokoderna för besiktningsnamn (projektet i exemplet heter “Demo”):
> 
> Kod:
>  `{{[2204]}}-{{[2205]}} {{[1201]}}`
> 
> Ger filnamn:
> `FB1-MARK Demo.pdf`

Kontakta oss om ni behöver hjälp med att ställa in era egna format på filnamn och mail-ämnen. Om det känns alldeles för krångligt är det bara att lämna allting tomt så sköts detta automatiskt som ni är vana vid.
## Tydligare inställningar
Vi har samlat alla rapportinställningar i ett tydligt formulär. Tidigare var dessa inställning utspridda under speciella sektioner (grå) i början och slutet av rapporten.
![](Nyheter%20i%20rapportverkstan/image.png)<!-- {"width":451} -->


## Automatisk innehållsförteckning
Två nya komponenter finns ny i komponent-listan, en vanlig innehållsförteckning som visar sektioner och en som visar en lista med bilagda ritningar.
![](Nyheter%20i%20rapportverkstan/image%205.png)<!-- {"width":259} -->

Innehållsförteckningen visas direkt i komponenten. När rapporten slutförs kompletteras förteckningen med sidnummer. Innehållsförteckningen är klickbar för snabb navigering i dokumentet. En sk “outline” genereras även så att PDF-visarens egen innehållsförteckning fylls på med samma sak.
![](Nyheter%20i%20rapportverkstan/image%206.png)

## Fler sektionsinställningar
Den nya menyknappen för sektionsinställningar ger nu ännu mer flexibilitet. Inställningarna syns bara i “avancerat läge” och sparas med din mall. Dessa inställningar är alltså inte tänkta för dagligt bruk, utan för att ge maximal flexibilitet när du bygger dina mallar.
![](Nyheter%20i%20rapportverkstan/image%207.png)<!-- {"width":360} -->

### Uteslut från styckenumrering
Om rapporten är inställd på att visa styckenumrering kan undantag göras på valda sektioner. Om man använder sig av styckenumrering (paragrafnummer) vill man kanske ha några stycken (sektioner) i början som inte är numrerade.

### Uteslut från innehållsförteckning
Om en viss sektion inte ska komma med i den automatiska innehållsförteckningen kan man ange det genom att kryssa i denna ruta.

### Dölj titel i rapporten
Ibland vill man skapa en sektions-hierarki med våra sektions-funktioner, men man vill inte ha någon sektions-titel utskriven. “Dölj titel i rapporten” löser detta. Sektioner som har denna ikryssad får ingen titel och inget mellanrum från föregående sektion, dvs det är ett sätt att slå ihop sektioner i rapporten men ändå bibehålla en tydlig sektions-struktur vid inmatning.