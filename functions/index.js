import functions from '@google-cloud/functions-framework';
import cors from 'cors';
import { scrapeBestWin } from './scrapeBestWin.js';
import { getUsernameAutoComplete } from './getUsernameAutoComplete.js';

// const corsMiddleware = cors({ origin: true });
const corsMiddleware = cors({ origin: "https://sixdegreesofhikaru.com" });

functions.http('scraper', (request, response) => {
    corsMiddleware(request, response, async () => {
        const body = JSON.parse(request.body);
        const data = await scrapeBestWin(body.text);
        if (data.error) {
            response.status(500);
        }
        response.send(data);
    });
});

functions.http('autocomplete', (request, response) => {
    corsMiddleware(request, response, async () => {
        const params = request.params[0].split('/');
        try {
            const data = await getUsernameAutoComplete(params[0]);
            response.send(data);
        } catch (e) {
            response.status(500);
            response.send({ error: e.message });
        }
    });
});9


