/*
Extract RPI model from offical site and generate pi-model.json file
*/

const fetch = require('node-fetch');
const DomParser = require('dom-parser');
const fs = require('fs');

console.log('Extracting RPI model from: ');
const rpiRevisionCodeUrl = 'https://www.raspberrypi.org/documentation/hardware/raspberrypi/revision-codes/README.md';
console.log(rpiRevisionCodeUrl);

fetch(rpiRevisionCodeUrl)
    .then(function (response) {
        return response.text();
    })
    .then(function (html) {
        const parser = new DomParser();
        const doc = parser.parseFromString(html, "text/html");
        const tables = doc.getElementsByTagName('table');
        var rows = null;
        var tds = null;

        var allmodel = [
            {
                "date": new Date().toISOString().split('T')[0],
                "source": rpiRevisionCodeUrl,
                "generator": "https://github.com/gablau/rpi-revision-codes-utility",
            },
        ];

        //convert old revision code
        rows = tables[0].getElementsByTagName('tr');
        for (i = 0; i < rows.length; i++) {
            var tds = rows[i].getElementsByTagName('td');
            if (tds.length <= 0) continue;
            jsrow = {
                "Code": tds[0].innerHTML,
                "Model": tds[1].innerHTML,
                "Revision": tds[2].innerHTML,
                "RAM": tds[3].innerHTML,
                "Manufacturer": tds[4].innerHTML,
            };
            allmodel.push(jsrow);
        }

        //convert new revision code
        rows = tables[2].getElementsByTagName('tr');
        for (i = 0; i < rows.length; i++) {
            tds = rows[i].getElementsByTagName('td');
            if (tds.length <= 0) continue;
            jsrow = {
                "Code": tds[0].innerHTML,
                "Model": tds[1].innerHTML,
                "Revision": tds[2].innerHTML,
                "RAM": tds[3].innerHTML,
                "Manufacturer": tds[4].innerHTML,
            };
            allmodel.push(jsrow);
        }
        console.log('Found ' + (allmodel.length - 1) + ' different models! ');
        console.log('Saving pi-model.json ... ');
        var data = JSON.stringify(allmodel, null, 2);
        fs.writeFileSync('pi-model.json', data);
        console.log('... done!');
    })
    .catch(function (err) {
        console.log('Error - Failed to fetch page: \n', err);
    });


