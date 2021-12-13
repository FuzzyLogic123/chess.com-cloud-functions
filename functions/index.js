const functions = require("firebase-functions");

//html fetching (doesn't seem to always work)
const cors = require("cors")({ origin: true });

const fetch = require("node-fetch");


const scrapeBestWin = async url => {

    const res = await fetch(url);
    const html = await res.text();
    const el = html.split('"player":"')[1];

    return el.split('"')[0];
}

//using puppeteer
const puppeteer = require('puppeteer');

const scrapeWinsBrowser = async url => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url);
    functions.logger.log(url);

    
    await page.waitForSelector('#vue-instance > div.game-parent > div > section:nth-child(7) > div:nth-child(1) > div.icon-block-large-subheader > a', {
        visible: true,
    });
    
    // await page.screenshot({path: '1.png'});

    //excecutes in the dom
    const data = await page.evaluate(() => {
        const bestWin = document.querySelector('#vue-instance > div.game-parent > div > section:nth-child(7) > div:nth-child(1) > div.icon-block-large-subheader > a');
        return bestWin.innerHTML;
    });
    
    functions.logger.log(data);
    await browser.close();

    return data;
}

exports.scraper = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {


        const body = JSON.parse(request.body);
        const data = await scrapeBestWin(body.text);

        response.send(data);
    });
});

exports.scraperSlow = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {


        const body = JSON.parse(request.body);
        const data = await scrapeWinsBrowser(body.text);

        response.send(data);
    });
});