const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const https = require('https');
const querystring = require('querystring');
const cors = require('cors'); // Import the cors package

app.use(bodyParser.urlencoded({ extended: true }));
const corsOptions = {
    origin: true,
    methods: ['POST','GET'],
    credentials: true,
    maxAge: 3600
};

app.options('/getProfileIDT', cors(corsOptions));

app.post('/getProfileIDT', cors(corsOptions), async (req, res) => {
    const { jmeno, prijmeni } = req.body;
    try {
        const profileIDT = await getProfileIDT(jmeno, prijmeni);
        res.json({ profileIDT });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.get('/getSouteze/:idt', cors(corsOptions), async (req, res) => {
    const idt = req.params.idt;
    try {
        const souteze = await getSouteze(idt);
        res.json(souteze);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


async function getProfileIDT(jmeno, prijmeni) {
    try {
        const url = "https://www.csts.cz/cs/Clenove/Hledat?registrovane=True";
        const postData = querystring.stringify({
            idt: "",
            prijmeni: prijmeni,
            jmeno: jmeno,
            hledat: "Hledat"
        });
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.160 Safari/537.36',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const response = await new Promise((resolve, reject) => {
            const req = https.request(url, options, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(data);
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.write(postData);
            req.end();
        });

        console.log("Response Code: " + response.statusCode);

        const regex = /(\d{8})/;
        const match = response.match(regex);
        if (match) {
            return match[1];
        }
    } catch (error) {
        console.error(error);
    }
    return null;
}

async function getSouteze(idt) {
    try {
        let soutezeList = [];
        let skip = 0;
        let count = 0;
        do {
            const response = await fetch(`https://www.csts.cz/api/evidence/clenove/detail-clena/vysledky-soutezi/${idt}?$count=true&$skip=${skip}&$top=20&$orderby=Datum%20desc`);
            const data = await response.json();
            soutezeList = soutezeList.concat(data.Items);
            count = data.Count;
            skip += 20;
        } while (skip < count);
        return soutezeList;
    } catch (error) {
        throw new Error(error);
    }
}


 // Example usage:
 const jmeno = "Anežka";
 const prijmeni = "Augustinová";
 let idt = null;

getProfileIDT(jmeno, prijmeni)
    .then((profileIDT) => {
        console.log("Profile IDT: ", profileIDT);
        idt = profileIDT;
        return getSouteze(idt); // Wait for getSouteze to finish before moving on
    })
    .then((souteze) => {
        console.log("Souteze: ", souteze);
        const kat = "Dospělí-A-LAT";
        const result = averageResult(kat, souteze);
        console.log("Average Placement: ", result);
    })
    .catch((error) => {
        console.error("Error: ", error);
    });