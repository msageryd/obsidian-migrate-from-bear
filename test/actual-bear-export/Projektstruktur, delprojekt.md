# Projektstruktur, delprojekt
#plantrail/projects

## Project templates
Projects needs to be configured differently for different use cases. The following parameters is configured in what we call **project templates**. 
- Form config (input form for project information)
- Layers
- ControlpointTypes and identifier sequences
- Default dimScale

Templates are associated with companies, i.e. there is a defined list of available project templates for each company. To associate a template with a company the template needs to have system scope (i.e. usable to everyone), or be a company specific template (i.e. only usable within the specified company).

### Changing template on an existing project
A project have another template applied in a later stage. This can be useful if no template was applied from start or if the wrong template was applied. 

There are some gotchas when changing template:
- If any controlpoints exists on a layer which is not in the new template we need to handle those in some way. Either move them to the base layer or leave them on the same layerId if this id exists in the new Template.
- If the new template has controlpointTypes with different identifier sequence config the controlpoints will be re-numbered.
- If the new template has fewer fields in the input form, previously entered information might be lost (if entered in fields which are not included in the new template)

**TODO: We need to create a “what-if”-function** in order to identify all side effects from a potential template change. These side effects should be presented to the user before the new template is applied

### Changing project config on top of a template config.
In many cases a project template will only be the starting point for a project . Later on the user might want to change the config, i.e.
- add or remove layers
- add or remove controlpointTypes
- change identifier sequence settings for controlpointTypes

**TODO:** **How should this be handled?**

### Projects without template
Before the availability of project templates, all projects were created without a template. This is perfectly fine even now. A project without a specified template will get the following config:
- Standard project form
- No specified controlpointTypes, i.e. users can create any controlpointType they have access to. Created controlpointTypes will get a default config from the type definition, i.e. identifier sequences, shape configs, etc.
- No layers automatically created. (all projects will have a “base layer”)

### Examples of system scoped templates
#### PlanTrail standard template for ABT06 inspections
- Standard project form is extended with ABT specific fields and a field group for contractor information.
- Only controlpointType 111 (EB) allowed
- Default dimScale = 0.8 (flag size). Inspections typically has less flags than fire sealing, hence a larger dimScale is preferable.

#### PlanTrail standard template for BL (byggledning)
- Standard project form is extended with a field group for contractor information.
- Only controlpointType 120 (BL) allowed
- Default dimScale = 0.8 (flag size). Inspections typically has less flags than fire sealing, hence a larger dimScale is preferable.

### Examples of company specific templates
#### PrefireSyd standard project (fire sealing)
- Standard project form
- No controlpointTypes specified, i.e. all types allowed
- Two layers; B=Brand, L=Ljud

#### RoMo standard project (inspection)
- Standard project form extended with ABT- and contractor fields
- Only controlpointType 111 (EB) allowed
- Default dimScale = 0.8
- Six layers; Generell, Bygg, Fasad, Balkong, Plåt, Måleri


### ProjectTemplates
För maximal flexibilitet definierar vi projektmallar. 
- Varje företag kan specificera en standard-mall för nya projekt
- Mallar kan vara företags-specifika
- En mall innehåller följande delar
  - projectType (grund-typen)
  - layers (lista med lager som skapas automatiskt)
  - controlpointTypes (lista med kontrollpunkt-typer och nummerserieinställning)
  - defaultDimScale (oftast vill besiktningmän ha större flaggor än brandtätare)

Exempel på standard-mallar
* Brandtätning (BT-flaggor med ritningsnummerserier)
  * projectType = underentreprenad
* Entreprenadbesiktning (EB-flaggor med projekt-nummerserie) 
  * projectType = EB
* Byggedning (BL-flaggor med projektnummerserie)
  * projectType = BL
* Brandskyddskontroll
  * projectType = brandskyddskontroll

Exempel på kundspecifika mallar
* Turega, EB-mall
  * lager: "bas", "VS", "bygg"
  * EB-flaggor med projekt-nummerserie
* RoMo, EB-mall
  * fem lager + baslager
  * EB-flaggor med projekt-nummerserie
* PrefireSyd, BT-mall
  * Två lager:  Brandtätning, Ljudtätning
  * BT-flaggor med ritnings-nummerserie

Mallarna används som standardinställning vid skapande av nytt projekt. Därefter kan projektet ändras med avseende på alla mall-parametrar, t.ex tillägg av kontrollpunktstyper, etc.

Om ett projekt ändrar projectType måste projekt-info matas in igen, eller i alla fall säkerställas eftersom inmatningsformuläret kan förändras.


## Projektstruktur.

Villkor ur användarens perspektiv:

- [ ] Samma enkla projekt struktur som nu, dvs Ett projekt->>flera ritningar. Projektet visas i projektlistan med tumnagel + statistik, mm.

- [ ] När man kommer på att man behöver delprojekt skapas automatiskt ett nytt huvudprojekt. Tumnageln hämtas från originalprojektet.
Originalprojektet flyttas in under nya huvudprojektet 
Nya delprojektet skapas under nya huvudprojektet (dvs blir "syskon" med originalprojektet"
Användaren får chans att döpa nya huvudprojektet och nya delprojektet, samt ges möjlighet att döpa om originalprojektet

Exempel:

1. Skapar projekt "JM Gavelhusen"

2. Börjar jobba med dessa ritningar (skapar brandtätningsflaggor)

3. Nu behöver vi även SBA på JM

- [ ] Användaren klickar på JM och väljer "skapa delprojekt" 
- [ ] Ny struktur visas för användaren
  * Nya huvudprojektet
    ** originalprojektet
    ** nya delprojektet

Dessa tre projektnamn är inmatningsrutor så att användaren kan namnge vettigt, t.ex så här:

* JM Gavelhusen
  ** Brandtätning nybyggnation
  ** SBA

Användaren får även frågan om alla tillgängliga ritningar ska användas i nya delprojektet. Här kanske vi även ska visa lista på tillgängliga ritningar så man kan kryssa för.

4. Senare behöver man även ett larm-projekt.

klicka på huvudprojektet och välj Skapa delprojekt.
- [ ] Huvudprojektet är redan en "projekt-behållare", så inget nytt huvudprojekt behöver skapas. Användaren behöver bara ange namn på nya projektet samt välja ritningar

!!! Vilka ritningar ska man kunna välja på?
- [ ] Alla ritningar som någonsin har använts inom projekt-trädet?
- [ ] Eller alla ritningar som finns i rakt uppstigande led i trädet?
- [ ] Eller bara ritningar som används inom närmaste nivå?

5. Efter färdigställt bygge får man nytt brandtätningsprojekt på JM. Detta är helt fristående och ska inte kopplas ihop med föregående brandtätning
Man vill ha en tydlig struktur där "brandtätning" är en projektbehållare för "Nybyggnation" samt nya projektet "Fiberdragning okt 2020"

Klicka på "Brandtätning nybyggnation", välj "Skapa delprojekt"

Samma som steg 3, men nu är vi en våning ner i trädet. Användaren sätter namn på projekten så att följande struktur erhålls:

* JM Gavelhusen
  ** Brandtätning
  *** Nybyggnation
  *** Fiberdragning okt 2020
  ** SBA
  ** Larm

6. 
7. 
8. 
9. 
10. 


Frågor:

Var lagrar vi original-ritningarna för de ritningar som refererar till dessa?

Vad händer om två ritningar pekar på samma originalritning och den ena får en ny dimscale-inställning
- [ ] Användaren bör få frågan om nya inställningen ska kopplas till aktuell ritning eller till originalet (dvs påverkar även andra användningar av denna ritning)


Flytta projekt i trädet

Slå ihop projekt ritningslistorna slås ihop, dvs det kan t.ex bli flera ritningar som pekar på samma ritningsfil

Slå ihop ritningar. Ritningar som ligger i samma projekt kanske man vill slå ihop, dvs samla flaggorna på en ritning och numrera om

Man kanske vill markera en bunt med flaggor och flytta ut dessa till separat ritning (t.ex i efterhand sära på brandtätning och brandskyddsmålning)