# rpi-revision-codes-utility

Some utility for Raspberry Pi revision codes

**rpi-decode:** Decode revision codes in a readable format.\
**rpi-generator:** Generate a json file with all Raspberry Pi models

## How to use

From CLI run `npm run rpi-decode <revision-code>` to decode one or more codes 
 
Example:
```
$ npm run rpi-decode 0010 00C03111

> rpi-revision-codes-utility@0.1.0 rpi-decode C:\gitbase\rpi-revision-codes-utility
> node rpi-decode.js "0010" "00C03111"

### Code: 0010 #############################################################

Model: B+
Revision: 1.0
RAM: 512 MB
Manufacturer: Sony UK
Processor: n/a

String: Raspberry Pi Model B+ Rev 1.0 - 512 MB (Sony UK) (Broadcom n/a)

### Code: c03111 #############################################################

Model: 4B
Revision: 1.1
RAM: 4GB
Manufacturer: Sony UK
Processor: BCM2711

String: Raspberry Pi 4 Model B Rev 1.1 - 4GB (Sony UK) (Broadcom BCM2711)
```

From CLI run `npm run rpi-generator` to generate models json file `pi-models.json` 
 
Example:
```
$ npm run rpi-generator

> rpi-revision-codes-utility@0.1.0 rpi-generator C:\gitbase\rpi-revision-codes-utility
> node rpi-model-generator.js

Extracting RPI model from:
https://www.raspberrypi.org/documentation/hardware/raspberrypi/revision-codes/README.md
Found 42 different models!
Saving pi-model.json ...
... done!
```

