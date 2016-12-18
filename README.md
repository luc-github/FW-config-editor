# FW-config-editor
Firmware configuration editor
The purpose of this "tool" is to allow edition of repetier EEPROM and smoothieware config.txt using web page.
More option may come later

The web server is an ESP3D one, but it should work on native smoothieware webserver also (TBC)

##Repetier EEPROM
the EEPROM content can be catched by command __M205__
```
EPR:0 1126 0 Filament Sensor On:
EPR:1 252 0 Extr.1 distance to retract when heating [mm]
EPR:2 1121 0 Powersave after [ms,0=off]:
EPR:3 129 0.000 Filament printed [m]
```
and modified by M206 command
`M206 T[type] P[pos] [Sint(long] [Xfloat]`

##Smoothieware config.txt
The file content can be catched by __ls /sd/config.txt__
```
# Robot module configurations : general handling of movement G-codes and slicing into moves
default_feed_rate                            4000             # Default rate ( mm/minute ) for G1/G2/G3 moves
```

and modified by console command
`config-set [<configuration_source>] <configuration_setting> <value>`


So mechanism is almost identical, just commands change as well as flags and separators :winkle:
