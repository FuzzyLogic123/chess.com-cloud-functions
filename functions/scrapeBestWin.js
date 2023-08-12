import jsdom from 'jsdom';

const { JSDOM } = jsdom;
const RETRY_ATTEMPTS = 4

export const scrapeBestWin = async url => {    
    try {
        const html = await getPlayerStats(url, RETRY_ATTEMPTS);
        const el = html.split('"player":"')[1];
        const rating = html.split(',"leaderboardRank":')[0].split(':');
        const dom = new JSDOM(html).window.document;
        const profilePictureURL = new URL(dom.querySelector('.post-view-meta-avatar img')?.src, 'https://www.chess.com/')
        return {
            next_player: el.split('"')[0],
            rating: rating[rating.length - 1],
            name: dom.querySelector('.profile-card-name')?.innerHTML,
            avatar: profilePictureURL.href,
            title: dom.querySelector('.profile-card-chesstitle')?.innerHTML.trim(),
            username: dom.querySelector('.profile-card-username a').innerHTML
        };

    } catch (e) {
        return {
            "error": e.message
        };
    }
}

async function getPlayerStats(url, attempts_remaining) {
    let res = await fetch(url);
    let html = await res.text();
    if (!html.includes('"player":"') && attempts_remaining > 0) {
        await new Promise(r => setTimeout(r, (RETRY_ATTEMPTS - attempts_remaining) * 500));
        html = getPlayerStats(url, attempts_remaining - 1)
    } else if (!html.includes('"player":"') && attempts_remaining <= 0) {
        throw new Error("Failed to get player stats");
    }
    return html;
}
