# Network config, Konvaljstigen
#privat/hus


## VLAN 1, internal
IP: 10.0.0.0/24

- Computers
- Roon endpoints
- NAS
- Home Assistant
- iPhones

Probably implicit in Unify: 
VLAN1 (default) intercommunication with other VLANs

I added a deny role for:
VLAN10 -> VLAN1, VLAN20
VLAN20 -> VLAN1, VLAN10


## VLAN 10, IoT
IP: 10.0.10.0/24

- Cameras
- Garo charger
- Garo load balancer
- Household appliances

## WLAN “sageryd”
VLAN1 untagged
VLAN10 tagged
VLAN20 tagged

## WLAN “sageryd IoT”
VLAN10 untagged
WiFi speed limit 30Mbit/s up7down
