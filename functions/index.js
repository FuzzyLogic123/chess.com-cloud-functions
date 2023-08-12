import functions from '@google-cloud/functions-framework';
import cors from 'cors';
import { scrapeBestWin } from './scrapeBestWin.js';

const corsMiddleware = cors({ origin: true });

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