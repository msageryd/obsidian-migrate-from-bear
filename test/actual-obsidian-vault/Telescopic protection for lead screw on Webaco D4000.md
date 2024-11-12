# Telescopic protection for lead screw on Webaco D4000
#privat/3dprint

## Background
The lead screw on Wabeco D4000 is completely unprotected. There is a telescopic spring steel protection is available for 299 EUR. Really expensive and and only available for the bigger D6000 anyway.

![[Attachment-3.png]]

I'll try to design a 3D printable telescopic protection for the left side of the screw. The right side will not get as much exposed to swarf.

## Measurements
I don't yet have a D4000 at hand. The following measurements are eye-balled from the sketch in the brochure.

Maximum length (fully expanded telescopic): 375 mm.
Minimum length (fully contracted): 115 mm.

![[BA143BAF-756A-4AE5-AB04-D28314152E18.png]]


## Test print 1
Filament: Ultimaker PC+
Nozzle size: 0.4
Started off with default setting "Engineering 0.15".
Speed lowered to 25 mm/s
100% infill
Top layers: 3
Bottom layers: 3
No skirt.
Doors and Air Manager top was closed. PC want's it warm and cosey.

I left a 0,1 mm gap between the parts. This wasn't enough, so I had to sand it down a bit.

The outer rim on the pieces needs to be a bit longer in order to get directional stability while fully expanded.

![[801EEDCD-55BD-411C-9E95-C026062F8B70.png]]


## Test print 2
Outer rim elongated from 1 mm to 12 mm gap between pieces extended from 0,1 mm to 0,2 mm

![[7E2198E0-82D0-4956-99AB-C5F8F596E459.png]]

![[FCAD97B7-AE24-40E4-8F54-B6C1678ABD81.png]]
![[F8FE2B88-7BC2-4845-99F2-3D7472FFE2F3.png]]

### Problems
* Too tight fit, again.
* The 12 mm outer rim is 1 mm thicker than the rest of the tube. Printing this also leaves a small rim on the inside. Less than 0,1 mm, but needs to be zero.
* The top of the tubes are printed downwards, i.e. sits on the print bed. This leaves a little rim due to squeeze out at the first layers.  Adding a small chamfer to this end might solve this.
* There is nothing stopping a smaller tube to go too long into the bigger tube at contraction. There needs to be a small rim there as well. This rim will make it really hard to press the small tube through at mounting time. Maybe a softer material than PC would work better. Try PLA..

