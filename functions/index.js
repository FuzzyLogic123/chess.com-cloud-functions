const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });

const fetch = require("node-fetch");


const scrapeBestWin = async url => {

    const res = await fetch(url);
    const html = await res.text();
    const el = html.split('"player":"')[1];

    return el.split('"')[0];
}

exports.scraper = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {

        
        const body = JSON.parse(request.body);
        const data = await scrapeBestWin(body.text);

        response.send(data);
    });
});
