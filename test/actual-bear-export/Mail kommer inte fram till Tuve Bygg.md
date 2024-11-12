# Mail kommer inte fram till Tuve Bygg
#plantrail/email

## Bakgrund
PlanTrail använder Sendgrid som mail-leverantör. Sendgrid är en av världens största mail-leverantörer. Vi sänder från en privat ip-adress (dvs den kan inte blandas ihop med spam-företag), samt har vidtagit alla av Sendgrid rekommenderade åtgärder i DNS för att minimera spam-klassning av våra mail.

Vår server har skickat ca 82,000 mail mellan 2019 och 2022. Endast 16 av dessa mail har blivit stoppade av andra servrar. Av dessa 16 var 8 adresserade till tuvebygg.se. 

### Tuve-mail som har studsat
Listan visar alla mail som har stoppats av servrar på tuvebygg.se:
![](Mail%20kommer%20inte%20fram%20till%20Tuve%20Bygg/DD11EFC8-EF5B-49BD-B275-4AECB0A9B7DB.png)

### Tidigare har Tuve-mail levererats
Listan visar alla mail som har levererats till tuvebygg.se. Det verkar alltså som att det fungerade bättre för ca ett år sedan.
![](Mail%20kommer%20inte%20fram%20till%20Tuve%20Bygg/770D0DC0-8DB6-4C35-AA2A-0C5E2EC45BF8.png)

## Vanliga mail via Gmail stoppas också
Jag försökte maila den här mini-utredningen från min gmail-adress, michael.sageryd@plantrail.com och blev blockerad även där.
![](Mail%20kommer%20inte%20fram%20till%20Tuve%20Bygg/88F102CC-E32A-466D-8EFB-59248929AB25.png)

Jag mailar på nytt via min privata mailadress och hoppas att mailet kommer fram.

## Fel-logg från SendGrid
Nedan följer några skärmavbilder från fel-loggen hos Sendgrid.

![](Mail%20kommer%20inte%20fram%20till%20Tuve%20Bygg/DA7D6E85-AC9C-47B2-98E1-33F23005031A.png)


![](Mail%20kommer%20inte%20fram%20till%20Tuve%20Bygg/C8945D55-FE96-46A9-B3D9-1C09B2D5C2D3.png)


![](Mail%20kommer%20inte%20fram%20till%20Tuve%20Bygg/1C96E1A3-7759-45C3-AAA7-E21AA4908F03.png)


![](Mail%20kommer%20inte%20fram%20till%20Tuve%20Bygg/309DDFF5-8DC9-49B1-8645-D150C7082CFE.png)