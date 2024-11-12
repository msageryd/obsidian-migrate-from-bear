# Bahnhof Internet
#bahnhof #privat/it


Tone 

## Zyxel router
2023-12-20: Jag gav upp med att försöka få TV på VLAN 25/23 att funka i lokala nätet. Återinför Zyxel-routern som front. Denna är bryggad så samma publika IP gäller ändå.

## Fast IP
Bahnhof har till slut kommit på att det inte går tat brygga Zyxel-routern. Nu struntar jag i fast IP. Bahnhof ska ändra tillbaka samt kreditera avgiften för fast ip.

Istället får det bli någon form av dynamisk adress från någon som UXG stöder.
![](Bahnhof%20Internet/image%204.png)<!-- {"width":308} -->

### Gamla uppgifter för fast ip.
Mac-adress UXG Wan1: **E4:38:83:8D:DA:10** 
Fast IP: **81.170.159.239**

Gateway IP: 81.170.159.225
Subnet mask: 255.255.255.224

DNS: 213.80.98.2
DNS: 213.80.101.3

## Hastighet
![](Bahnhof%20Internet/image.png)<!-- {"width":319} -->


## Nertid
[[Bahnhof nere 2023-10-08]]
[[Bahnhof nere 2023-11-14]]
[[Bahnhof nere 2023-11-15]]

Nere den 16:e igen.
SSH till UXG och försökte pinga
![](Bahnhof%20Internet/image%202.png)<!-- {"width":332} -->
[deamon.log_2023-11-16.txt](Bahnhof%20Internet/deamon.log_2023-11-16.txt)<!-- {"embed":"true"} -->

## Nere 23:e 
Inget hjälpte, försökte byta mellan static/dhcp.

Kopplade datorn direkt på fiberconvertern.
- fick ip: 10.15.21.124
- gateweway: 10.15.21.97
![](Bahnhof%20Internet/image%203.png)<!-- {"width":300} -->
- Testade att starta om fiberconvertern
- Testade att byta kabel (ny kabel från förpackning)
..Men INGET Internet



## Zyxel
DHCP option = 43.

Användarnamn: admin
Lösenord: HGB8PEHY
`#2BB5usCFbV7`

![](Bahnhof%20Internet/image%205.png)
