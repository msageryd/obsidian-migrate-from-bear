# PM, PlanTrail på fängelse - sekretess
## Tel med Specialfastigheter enligt ök med Lennart
### Specialfastigheter:
**Ann-Marie Andre Engvall**: 073-065 31 49

### PEAB
**Lennart Åslund**

### PM Fog och brand:
**Alexander Johansson**

### Presto Norrland:
PEAB-projekt
Anstalten Sörbyn, Umeå. juli 2022?

### 2018 demo för Brandskyddsföreningen.
Patrik Dalberg, Head of Security, Swedish Transport admin
070-651 38 01

Ann-Marie sa att de inte accepterar molntjänster, utan allt måste ske i en isolerad iPad. Sen sa hon att det kanske går om det inte finns någon spårbarhet.

Jag ska skriva ihop hur arbetsflödet ser ut och maila henne.
Dokument skickat till Ann-Marie: 
[Översiktlig beskrivning av flödet i PlanTrail](bear://x-callback-url/open-note?id=E60FAC7D-769B-4DD3-9F9F-DB9D122026CC-18028-0000198E7569E16B&show_window=yes&new_window=yes)


## Interna anteckningar om säkerhetslösningar
### Infrastruktur
* Filer lagras krypterat på Amazon S3
* Databasen ligger på Amazon RDS och är krypterad "at rest"
* Krypteringsnycklar säkras i Amazon KMS, endast våra servrar kan använda nycklarna.

### Kommunikation
* All kommunikation sker över HTTPS krypterat med TLS
* Websockets används för realtidsuppdatering, men endast för notifiering. All känslig data går via vanlig HTTPS.
* Rapporter genereras på våra servrar och kan delas via mail direkt från appen. Mottagaren får en nedladdningslänk som är giltig i en vecka, dvs inga filer finns i mottagarens inbox.

### Autentisering
* Autentisering sker via Oauth 2
* Vi använder auth-tokens samt refresh-tokens för att kunna ha korta giltighetstider och automatisk refresh men ändå ha möjlighet att stänga av användare.
* Vi har inget behov av autentisering via tredje part, därför använder vi "Oauth 2 Resource Owner Flow" [RFC 6749 - The OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749%23section-1.3.3)
* Vid utloggning från appen rensas ritnings- och bildreferenser från appen
* Lösenord hashas och saltas

### Rättigheter/roller
* Användare i PlanTrail kan få tilldelade roller på projektnivå. 
* De projekt man inte har någon roll i kan man inte se
* Rollerna är finfördelade och kan ge olika rättigheter inom ett projekt
* Om en roll dras tillbaka raderas projektet i appen så fort appen får kontakt med servern.

### Potentiella svagheter
* Användarens egen lösenordshantering
* Information som hämtas ut till appen dekrypteras
* Användare med korrekt roll kan dela projektrapporter direkt från appen
* Auth-token automat-refreshas i upp till en vecka efter senaste inloggning. Borttappad telefon är därför i utsatt/känsligt läge i upp till en vecka. Men om användaren stängs av på servern kommer projekten i telefonen tas bort vid så fort appen får kontakt med servern.
* Användare med korrekt roll kan "ad-hoc"-dela frågor/avvikelser via mail. Dessa mail innehåller ritnings-utsnitt och eventuella bilder.
* Egenkontrollrapporter (PDF) innehåller länkar till en portal för varje kontrollpunkt. Portalen visar ingen ritning, men bilder och annan information om kontrollpunkten visas. 
Exempel: https://portal.plantrail.com/?t=q9wipvdk.712f4&r=495.107.1.02&l=sv


**PlanTrail - Mer än bara egenkontroll**
Tel: 020-12 11 10 |  [www.plantrail.com](http://www.plantrail.com/)  | 
Direkt: +46 (0) 739 40 00 90 | PlanTrail AB | 
Besöksadress: Sickla Industriväg 3, 131 24 Nacka |  [www.plantrail.com](http://www.plantrail.com/)  |  michael.sageryd@plantrail.com|




- [ ] Projektet startar efter sommaren
- [ ] Lennart Åslund på Peab ringer mig, antagligen på måndag

* Servrar på Amazon West (Irland)
* Databasen krypterad "at rest"
* All kommunikation via https (sha-2 cert, dvs inte gamla "trasiga" sha-1)
* Websockets används över TLS, men inte för "data", utan enbart för updaterings-information så appen kan uppdatera via vanlig https. Kunde ha använts även för data, men det skulle ge oss ytterligare ett lager att säkra upp.
* Filer lagras på S3, krypterade
* Krypteringsnyckel lagrad på Amazon KMS (Key Management Service)
* Endast våra servrar på Amazon kan använda KMS-nyckleln
* Även vår root-användare på Amazon, förstås. Denna är 2FA-säkrad
* Data ute i appen är inte krypterat när den väl är hämtad från servern
* Om användaren loggar ut från appen rensas lokal data
* Rättigheter kan tilldelas på projektnivå och person-nivå
* Rapporter levereras via mail, men inte som bilagor, utan som nedladdningslänkar
* Nedladdningslänkarna förfaller efter 2 veckor för att inte gamla mail ska leda till potentiellt känsliga rapporter
* Rapporterna innehåller länkar till en "portal" med specifikation för varje kontrollpunkt inklusive bilder. Inga ritningar visas på dessa länkar. Portalen kan stängas av per projekt.
* Exempel på portal-länk: 

https://portal.plantrail.com/?t=q9wipvdk.712f4&r=495.107.1.02&l=sv

## Oauth 2
* Vi lagrar inga lösenord
* Vi lagrar hash + individuellt salt för varje användare
* Inga krav på "säkert lösenord" i dagsläget
* All hasning och saltning utförs på servern, inte på klienten
* Vi använder "Resource Owner Flow": [RFC 6749 - The OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749%23section-1.3.3)
* 

![[E138D4AB-DFEF-4096-B111-B06E5F67D670.png]]



### Vårt "salt"
https://crackstation.net/hashing-security.htm 
"To make it impossible for an attacker to create a lookup table for every possible salt, the salt must be long. A good rule of thumb is to use a salt that is the same size as the output of the hash function. For example, the output of SHA256 is 256 bits (32 bytes), so the salt should be at least 32 random bytes."

Hur vi hashar och saltar kan vi berätta efter NDA.
Hash genereras med node.js  
`crypto.createHmac(sha1)`

Hash-version lagras med varje hash, vilket gör att det är enkelt att utöka med bättre hash-funktioner framöver och ändå ha koll på vilken funktion som används för respektive lösenord.

Salt genereras med node.js crypto-modul
`crypto.randomBytes`

### Node.js nya scrypt
Numera har node-js cryptomodul en ny funktion `scrypt`  som är byggd för att vara långsam. Vi planerar att byta till denna.

