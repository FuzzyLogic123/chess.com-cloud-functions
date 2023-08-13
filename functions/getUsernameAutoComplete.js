export const getUsernameAutoComplete = async (username) => {
        const response = await fetch(`https://www.chess.com/search/callback/autofill/${encodeURIComponent(username)}?type=member`);

        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }

        const data = await response.json();
        return data;
}