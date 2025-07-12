/*
Decode RPI Revision code
*/

const args = process.argv.slice(2);

function decodeOldRevisionCode(code) {
    var result = [toHex(code), "n/a", "n/a", "n/a", "n/a"]
    var oldcodes = {
        0x0002: ["0002", "B", "1.0", "256 MB", "Egoman"],
        0x0003: ["0003", "B", "1.0", "256 MB", "Egoman"],
        0x0004: ["0004", "B", "2.0", "256 MB", "Sony UK"],
        0x0005: ["0005", "B", "2.0", "256 MB", "Qisda"],
        0x0006: ["0006", "B", "2.0", "256 MB", "Egoman"],
        0x0007: ["0007", "A", "2.0", "256 MB", "Egoman"],
        0x0008: ["0008", "A", "2.0", "256 MB", "Sony UK"],
        0x0009: ["0009", "A", "2.0", "256 MB", "Qisda"],
        0x000d: ["000d", "B", "2.0", "512 MB", "Egoman"],
        0x000e: ["000e", "B", "2.0", "512 MB", "Sony UK"],
        0x000f: ["000f", "B", "2.0", "512 MB", "Egoman"],
        0x0010: ["0010", "B+", "1.0", "512 MB", "Sony UK"],
        0x0011: ["0011", "CM1", "1.0", "512 MB", "Sony UK"],
        0x0012: ["0012", "A+", "1.1", "256 MB", "Sony UK"],
        0x0013: ["0013", "B+", "1.2", "512 MB", "Embest"],
        0x0014: ["0014", "CM1", "1.0", "512 MB", "Embest"],
        0x0015: ["0015", "A+", "1.1", "256 MB / 512 MB", "Embest"],
    }

    if (oldcodes.hasOwnProperty(code)) result = oldcodes[code];
    result = result.concat(['BCM2835']); //processor
    return result;
}

function memoryToString(mem) {
    if (mem >= 8) mem = mem - 8;
    mapping = {
        0: '256MB',
        1: '512MB',
        2: '1GB',
        3: '2GB',
        4: '4GB',
        5: '8GB',
        6: '16GB'
    };
    if (mapping.hasOwnProperty(mem)) return mapping[mem];
    return 'n/a';
}

function manufacturerToString(manufacturer) {
    mapping = {
        0: 'Sony UK',
        1: 'Egoman',
        2: 'Embest',
        3: 'Sony Japan',
        4: 'Embest',
        5: 'Stadium',
    };
    if (mapping.hasOwnProperty(manufacturer)) return mapping[manufacturer];
    return 'n/a';
}

function processorToString(processor) {
    mapping = {
        0: 'BCM2835',
        1: 'BCM2836',
        2: 'BCM2837',
        3: 'BCM2711',
        4: 'BCM2712'
    };
    if (mapping.hasOwnProperty(processor)) return mapping[processor];
    return 'n/a';
}

function typeToString(type) {
    mapping = {
        0x00: 'A',
        0x01: 'B',
        0x02: 'A+',
        0x03: 'B+',
        0x04: '2B',
        0x05: 'Alpha (early prototype)',
        0x06: 'CM1',
        0x08: '3B',
        0x09: 'Zero',
        0x0a: 'CM3',
        0x0c: 'Zero W',
        0x0d: '3B+',
        0x0e: '3A+',
        0x0f: 'Internal use only',
        0x10: 'CM3+',
        0x11: '4B',
        0x12: 'Zero 2 W',
        0x13: '400',
        0x14: 'CM4',
        0x15: 'CM4S',
        0x16: 'Internal use only',
        0x17: '5',
        0x18: 'CM5',
        0x19: '500',
        0x1a: 'CM5 Lite',
    };
    if (mapping.hasOwnProperty(type)) return mapping[type];
    return 'n/a';
}

function revToString(rev) {
    return '1.' + rev;
}

function toHex(c) {
    return Math.abs(c).toString(16);
}

function toFullModelString(result) {
    //console.log(result);
    var full = "Raspberry Pi ";
    var model = result[1];
    if (parseInt(model[0]) >= 0 && (parseInt(model[0] + model[1]) <= 9 || isNaN(parseInt(model[0] + model[1])))) {
        var ver = model[0];
        model = model.substr(1);
        full += ver + " Model " + model;
    }
    else if (model.substr(0, 2) === 'CM') {
        full += "Compute Module";
        if (parseInt(model[2]) > 1) full += " " + model[2]
    }
    else if (!isNaN(parseInt(model))) {
        full += model;
    }
    else full += "Model " + model;

    full += " Rev " + result[2] + " - " + result[3] + " (" + result[4] + ")" + " (Broadcom " + result[5] + ")";

    return full;
}


function rpiDecode(code) {

    code = parseInt(code, 16);
    //console.log('Decode revision code (hex): ', toHex(code));

    if (code > 0x800000) {
        //console.log("New revision code")
        var revision = code & 0x0000000F;
        //console.log('revision: ', revToString(revision), '('+toHex(revision)+')');
        var type = (code & 0x00000FF0) >>> 4;
        //console.log('type: ', typeToString(type), '('+toHex(type)+')');
        var processor = (code & 0x0000F000) >>> 12;
        //console.log('processor: ', processorToString(processor), '('+toHex(processor)+')');
        var manufacturer = (code & 0x000F0000) >>> 16;
        //console.log('manufacturer: ', manufacturerToString(manufacturer), '('+toHex(manufacturer)+')');
        var memory = (code & 0x00F00000) >>> 20;
        if (memory >= 8) memory = memory - 8;
        //console.log('memory: ', memoryToString(memory), '('+toHex(memory)+')');
        result = [toHex(code), typeToString(type), revToString(revision), memoryToString(memory), manufacturerToString(manufacturer), processorToString(processor)]
    }
    else {
        //console.log("Old revision code")
        result = decodeOldRevisionCode(code);
    }

    fullModelString = toFullModelString(result);

    //output
    console.log('### Code: ' + result[0] + ' #############################################################');
    console.log();
    console.log('Model:        ' + result[1]);
    console.log('Revision:     ' + result[2]);
    console.log('RAM:          ' + result[3]);
    console.log('Manufacturer: ' + result[4]);
    console.log('Processor:    ' + result[5]);
    console.log();
    console.log('Full String: ' + fullModelString);
    console.log();
    //console.log('Array:', result)
    //console.log();
}

args.forEach(function (val, index) {
    rpiDecode(val);
});

