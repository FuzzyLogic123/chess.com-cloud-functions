async function fetchBestWin(username, timeControl) {
    const res = await fetch("http://localhost:8080", {
        // const res = await fetch("http://localhost:5001/six-degrees-of-hikaru-cf099/us-central1/scraper", {
        method: 'POST',
        body: JSON.stringify({
            "text": `https://www.chess.com/stats/live/${timeControl}/${username}/0` // /0 queries all time page
        })
    });
    if (res.status !== 200) {
        console.error(`request failed ${res.status}`);
    }

    const response = await res.json();
    return response;
}


// console.log(await fetchBestWin("iwin", "blitz"));

// "https://www.chess.com/stats/live/blitz/AnOnYmOuSK99"

