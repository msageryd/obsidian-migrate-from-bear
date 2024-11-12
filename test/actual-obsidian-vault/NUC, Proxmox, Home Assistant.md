# NUC, Proxmox, Home Assistant

#privat/it

## Proxmox
https://10.0.0.5:8006
root/90q..

One VM in Proxmox is Debian running Docker.
michael@10.0.0.110/90q..

HA runs as a Docker image

## Upgrade all
1. Create a new snapshot as a backup in Proxmox
2. Open console and login as michael/90q..

`cd /opt/`
`sudo ./update.sh`

## Portainer
michael/90q..
## Postgres
```
CREATE USER homeassistant WITH PASSWORD 'homeassistant';

CREATE DATABASE homeassistant_db WITH OWNER homeassistant ENCODING 'utf8' TEMPLATE template0;
```

### Reset all statistics
```
DELETE FROM statistics_runs;
DELETE FROM statistics_meta;
DELETE FROM statistics;
DELETE FROM statistics_short_term;
DELETE FROM states;
DELETE FROM state_attributes;
DELETE FROM events;
DELETE FROM event_data;
DELETE FROM recorder_runs;

SELECT setval(pg_get_serial_sequence('statistics_runs', 'run_id'), coalesce(MAX(run_id), 1)) from statistics_runs;
SELECT setval(pg_get_serial_sequence('statistics_meta', 'id'), coalesce(MAX(id), 1)) from statistics_meta;
SELECT setval(pg_get_serial_sequence('statistics', 'id'), coalesce(MAX(id), 1)) from statistics;
SELECT setval(pg_get_serial_sequence('statistics_short_term', 'id'), coalesce(MAX(id), 1)) from statistics_short_term;
SELECT setval(pg_get_serial_sequence('states', 'state_id'), coalesce(MAX(state_id), 1)) from states;
SELECT setval(pg_get_serial_sequence('state_attributes', 'attributes_id'), coalesce(MAX(attributes_id), 1)) from state_attributes;
SELECT setval(pg_get_serial_sequence('events', 'event_id'), coalesce(MAX(event_id), 1)) from events;
SELECT setval(pg_get_serial_sequence('event_data', 'data_id'), coalesce(MAX(data_id), 1)) from event_data;
SELECT setval(pg_get_serial_sequence('recorder_runs', 'run_id'), coalesce(MAX(run_id), 1)) from recorder_runs;
SELECT setval(pg_get_serial_sequence('schema_changes', 'change_id'), coalesce(MAX(change_id), 1)) from schema_changes;
```


## Devices
### Adding new ZWave devices
**Naming is essential!**

1. Disable ZWave integration in Home Assistant
2. Add device to ZWaveJS2MQTT
3. Rename device accurately
4. Enable integration
5. "Reload" integration


### Popp Wallplug, utomhus
![[c4050711-85e9-4251-aace-c8fb4d9919b4.png|149]]
[[Popp wallplug manual]]


### Fibaro Metered Wall Plug, FGWP102
https://manuals.fibaro.com/content/manuals/en/FGWPEF-102/FGWPEF-102-EN-A-v2.0.pdf
Inclusion: tripple-click
Exclusion: tripple-click
Factory reset: Hold until yellow (3:rd menu), click again to reset

### Aeotec Smart Switch 7, ZW175
[Smart Switch 7 user guide : Aeotec Help Desk](https://aeotec.freshdesk.com/support/solutions/articles/6000219911-smart-switch-7-f-plug-user-guide-)
Inclusion: click for red, then click for orange
Exclusion: double click for purple
Factory reset: Hold >20 sek

###  Aeotec Multisensor 7
[MultiSensor 7 user guide : Aeotec Help Desk](https://aeotec.freshdesk.com/support/solutions/articles/6000232605-multisensor-7-user-guide)

### Qubino mini dimmer
https://qubino.com/wp-content/uploads/2019/09/Qubino_Mini-Dimmer-PLUS-extended-manual_eng_3.4_09092019.pdf

### Qubino flush relay
Sitter t.ex i laddstationen.
[Flush_1D_Relay_PLUS_installation_manual.pdf](NUC,%20Proxmox,%20Home%20Assistant/Flush_1D_Relay_PLUS_installation_manual.pdf)<!-- {"embed":"true","width":352,"preview":"true"} -->

### Upgrade Z-Stick 7 FW
[Update Z-Stick 7 with Raspian OS / RPi V7.17.2 : Aeotec Help Desk](https://aeotec.freshdesk.com/support/solutions/articles/6000252997-update-z-stick-7-through-raspian-os)

Another version:
[700 series Controller Firmware Updates (Linux) · kpine/zwave-js-server-docker Wiki · GitHub](https://github.com/kpine/zwave-js-server-docker/wiki/700-series-Controller-Firmware-Updates-(Linux))

## ZWave database
[Z-Wave JS Config DB Browser](https://devices.zwave-js.io/?jumpTo=0x0000:0x0004:0x0004:0.0)

## Node-Red
Long lived token in HA for NodeRed:
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI0YTI0MWQ2NDcwZDA0MTc1YWQyZDg1YTdlN2E2NzMyOCIsImlhdCI6MTY2MjAyNDM2NywiZXhwIjoxOTc3Mzg0MzY3fQ.uHK8UbToRlt-1EQPEW3jHPhbG-rNg0hwUepkHMKeuQM

## NUT (UPS-kontroll)
[Network UPS Tools (NUT) Ultimate Guide | Techno Tim Documentation](https://docs.technotim.live/posts/NUT-server-guide/)
![[AA4B473D-890B-4B6B-B3DF-71A46628B01F.png]]


## Logic
### Tänd vardagsrum när det blir mörkt
- [ ] light < 200 lux
- [ ] ej larmat
- [ ] före midnatt
- [ ] efter lunch
- [ ] => altan 20%
- [ ] => vrum-lampor ON

### Släck vardagsrum när det blir ljust
- [ ] light > 300 lux
- [ ] släck alla lampor
- [ ] släck altan

### Larma av när det är mörkt
- [ ] avlarmning
- [ ] light < 60 lux
- [ ] tänd några lampor

### Larma när det är mörkt
- [ ] larmning
- [ ] light < 60 lux
- [ ] släck alla lamport
- [ ] altan 10%



## Belysnings-styrning

### Scenes
1. Morgontänt på nedervåningen
2. Kvällstänt
3. Släckt överallt
4. Utebelysning tänd
5. Utebelysning släckt

### Schema
06-10 lamp-period-morgon
15-23 lamp-period-kväll

### Ljussensor
isDark = < 200 lumen

### Larm
Disarmed
Armed

### Aktivera scener
#### Morgon-tänt
- triggers
  - disarmed
  - isDark
  - lamp-period = on
- conditions
  - disarmed
  - isDark
  - lamp-period = on



![[BE5E6F52-D442-4ABF-BAF0-9B8046210587.png]]

![[E09B50C6-CA62-41FE-9980-AD359D4F6DA4.png]]

![[A132D32B-361A-4AB2-BDA6-2577F9D8C9E5.png]]