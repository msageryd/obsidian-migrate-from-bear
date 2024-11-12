# PlanTrail översiktlig beskrivning av säkerheten  
#plantrail/kunder/presto

*Mottagare: Magnus Bertzen, Presto*

Nedan följer en översikt av säkerhetshanteringen i PlanTrail. Dokumentet är konfidentiellt och enbart ämnade för mottagaren, Presto i detta fall. Ytterligare information kan delges efter undertecknande av NDA.

IT-säkerhet är alltid en avvägning mellan *säkert* och *smidigt*. Vi har valt en säkerhetsnivå som vi tror passar de allra flesta kunder och projekt, utan att det ska behöva kännas krångligt för användaren. Om krav på högre säkerhet ställs är vi öppna för diskussion.

### Infrastruktur
* Filer lagras krypterat på Amazon S3
* Databasen ligger på Amazon RDS och är krypterad "at rest"
* Krypteringsnycklar säkras i Amazon KMS, endast våra servrar kan använda nycklarna.

### Kommunikation
* All kommunikation sker över HTTPS krypterat med TLS
* Websockets används för realtidsuppdatering, men endast för notifiering. All känslig data går via vanlig HTTPS.
* Rapporter genereras på våra servrar hos Amazon. Användaren kan distribuera rapporter via mail direkt från appen. Mottagaren får en nedladdningslänk som är giltig i en vecka, dvs inga filer lagras i mottagarens inbox.

### Autentisering
* Autentisering sker via Oauth 2
* Vi använder auth-tokens samt refresh-tokens för att kunna ha korta giltighetstider och automatisk refresh men ändå ha möjlighet att stänga av användare.
* Vi har inget behov av autentisering via tredje part, därför använder vi "Oauth 2 Resource Owner Flow" [RFC 6749 - The OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749%23section-1.3.3)
* Vid utloggning från appen rensas ritnings- och bildreferenser från appen
* Lösenord hashas och saltas, dvs PlanTrail har aldrig någon vetskap om användarnas egentliga lösenord.

### Rättigheter/roller
* Användare i PlanTrail kan få tilldelade roller på projektnivå. 
* De projekt man inte har någon roll i kan man inte se
* Rollerna är finfördelade och kan ge olika rättigheter inom ett projekt
* Om en roll dras tillbaka raderas projektet i appen så fort appen får kontakt med servern.
* Tilldelning av roll på enhetsnivå ger automatisk tillgång till alla projekt under enheten (enhet kan t.ex vara ett regionkontor hos Presto)

### Potentiella svagheter
* Användarens egen lösenordshantering
* Information som hämtas ut till appen dekrypteras
* Användare med korrekt roll kan dela projektrapporter direkt från appen
* Auth-token automat-refreshas i upp till en vecka efter senaste inloggning. Borttappad telefon är därför i utsatt/känsligt läge i upp till en vecka. Men om användaren stängs av på servern kommer projekten i telefonen tas bort så fort appen får kontakt med servern.
* Användare med korrekt roll kan dela frågor/avvikelser via mail. Dessa mail innehåller ritnings-utsnitt och eventuella bilder.
* Egenkontrollrapporter (PDF) innehåller länkar till en portal för varje kontrollpunkt. Portalen visar ingen ritning, men bilder och annan information om kontrollpunkten visas. Portalen kan stängas av för känsliga projekt.
Exempel: https://portal.plantrail.com/?t=q9wipvdk.712f4&r=495.107.1.02&l=sv