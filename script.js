let btnSubmit = document.getElementById('btnSubmit');
let token = document.getElementById("getToken").value.trim();


btnSubmit.addEventListener('click', getTokenData);

async function getTokenData() {


    if (token === "") {
        alert("Please enter a token");
    } else {
        console.log("Token entered:", getToken.value);
        getToken.value = "";

        try {
            const res = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${token}`);
            const data = await res.json();
            if (data.pairs && data.pairs.length > 0) {
                const coin = data.pairs[0]; // top result
                output.textContent = `
                Name: ${coin.baseToken.name} (${coin.baseToken.symbol})
                Price: $${coin.priceUsd}
                Market Cap: ${coin.marketCapUsd}
                24h Volume: ${coin.volume.h24}
                Liquidity: $${coin.liquidity.usd}
                Price Change (24h): ${coin.priceChange.h24}%
        `;
            } else {
                output.textContent = "Token not found or no data.";
            }
        } catch (err) {
            output.textContent = "Error fetching data.";
            console.error(err);
        }
    }
}