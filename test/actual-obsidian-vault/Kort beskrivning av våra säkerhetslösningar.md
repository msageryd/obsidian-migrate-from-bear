# Kort beskrivning av våra säkerhetslösningar
OBS. Ta bort denna tag om texten ska exporteras och delas med utomstående
#plantrail/security

## Bakgrund
Systemet är byggt med säkerhet som högsta prioritet. Innan vi ens påbörjade bygget av användar-funktionerna såg vi till att kryptering och nyckelhantering var på plats, därefter byggde vi ett rättighets-system som förhindrar att någon användare att kommer åt fel information.

## Lagring
### Moln-lagring
Data lagras på Amazon, dels i databastjänsten RDS (Postgres) som är “encrypted at rest”, och dels på S3 där alla filer är krypterade.
### Lagring på klient
Mobil-appen är byggd enligt “offline-first”-principen, dvs all data som behövs för att arbeta utan tillgång till Internet lagras i appen. Vid utloggning från appen rensas den lokala datan av säkerhetsskäl. Utloggning sker antingen manuellt av användaren eller efter tre dagar då “access token” förfaller.
## Kommunikation
All kommunikation med vårt REST-API sker över HTTPS. Certifikaten för detta utfärdas av Amazon.

Realtids-kommunikation sker via web sockets, men där skickas endast meddelanden om att klienten behöver uppdatera data via REST-apiet.
## Rättighetssystemet
Hela rättighets-systemet är implementerat på databasnivå. Fördelen jämfört med att implementera rättighets-systemet i mellanlagret är regler som styr vem som får se vad ligger så nära data som möjligt. Detta minimerar risken för misstag samt ger ett extra säkerhets-lager.

API- och databas ligger i olika “private networks” och API:et kan endast komma åt den del av databasen som är rättighets-styrd.
## Autentisering
Klienterna autentiserar sig via Oauth2. Användarnas lösenord lagras ej hos oss, utan enbart en “saltad hash” lagras enligt praxis.
## Nyckelhantering
Ingen kryptering är säker om inte krypterings-nycklar hanteras korrekt. Våra nycklar är inlåsta i Amazons nyckel-tjänst.