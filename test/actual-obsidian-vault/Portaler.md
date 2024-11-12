# Portaler

#plantrail/portals
## Projekt-portaler
Definieras och administreras från appen

Ägarföretagets portal-intro kopplas in automatiskt om intro är definierad för portaltypen

Kan ha olika innehåll beroende på användningsområdet, t.ex:
- [ ] KMA-portal
- [ ] SBA-portal

Delas via:
- [ ] QR-blad
- [ ] Länk-delning direkt från portalen
- [ ] Länk-delning från appen

## Kontrollpunkt-portal
Definieras vid första accessen. Dvs kontrollpunkter får ingen portal definierad från start, utan endast första gången någon försöker accessa portalen. Därefter bevaras portalen eftersom den innehåller loggar och eventuellt även kommunikation.

Olika innehåll beroende på kontrollpunkts-typ. T.ex:
- [ ] besiktning
- [ ] brandtätning
- [ ] SBA-flagga (brandsläckare etc)

Delas via:
- [ ] QR-kod på kontrollpunkts-ettikett
- [ ] Direkt-delning från appen (journal-post)
- [ ] Länk-delning från portalen

## Kontrollpunkt-listor
Definieras i appen när en användare delar en todo-lista

Portaldefinitionen innehåller filter som anger vilka kontrollpunkter som ingår i portalen, t.ex "alla som är tilldelade Kalle Anka"