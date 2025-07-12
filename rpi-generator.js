/*
Extract RPI model from offical site and generate pi-model.json file
*/

const fetch = require('node-fetch');
const fs = require('fs');

console.log('Extracting RPI model from: ');
const rpiRevisionCodeUrl = 'https://github.com/raspberrypi/documentation/raw/refs/heads/develop/documentation/asciidoc/computers/raspberry-pi/revision-codes.adoc';
console.log(rpiRevisionCodeUrl);

fetch(rpiRevisionCodeUrl)
    .then(function (response) {
        return response.text();
    })
    .then(async function (markdown) {
        const lines = markdown.split("\n");

        var allmodel = [
            {
                "date": new Date().toISOString().split('T')[0],
                "source": rpiRevisionCodeUrl,
                "generator": "https://github.com/gablau/rpi-revision-codes-utility",
            },
        ];

        let start = false;
        let table = "";
        let header = "";
        for (i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (!start) {
                table = "";
                header = "";
            }
            if (line.trim().startsWith("|==")) {
                if (!start) {
                    header = lines[i + 1];
                    start = true;
                    continue;
                } else {
                    start = false;

                    table = table.replaceAll("\n|", " |");
                    const ls = table.split("\n");

                    let ck = ls[0].replaceAll(" ", "").trim();
                    if (!(ck == "|Code|Model|Revision|RAM|Manufacturer")) continue;

                    for (j = 0; j < ls.length; j++) {
                        if (j == 0) continue;

                        let l = ls[j].trim().substring(1).split("|");
                        if (l.length < 5) continue;
                        let jsrow = {
                            "Code": l[0].trim(),
                            "Model": l[1].trim(),
                            "Revision": l[2].trim(),
                            "RAM": l[3].trim(),
                            "Manufacturer": l[4].trim(),
                        };
                        allmodel.push(jsrow);
                    }
                }
            }
            if (start) {
                table = table + line + "\n";
            }
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


