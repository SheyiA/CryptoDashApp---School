let btnSubmit = document.getElementById('btnSubmit');
let tokenName = document.getElementById("tokenName");
let tokenTitle = document.getElementById("tokenTitle");
let tokenPrice = document.getElementById("tokenPrice");
let tokenCap = document.getElementById("tokenCap");
let tokenScore = document.getElementById("tokenScore");
let tokenRisk = document.getElementById("tokenRisk");
let tokenBuzz = document.getElementById("tokenBuzz");
let tokenLink = document.getElementById("tokenLink");
let errorText = document.getElementById("errorText");
let chartFrame = document.getElementById("chartFrame");
btnSubmit.addEventListener('click', getTokenData);



async function getTokenData() {

    let token = document.getElementById("getToken").value.trim();


    if (token === "") {
        alert("Please enter a token");
        return
    } else {
        console.log("Token entered:", getToken.value);
        getToken.value = "";

        try {
            const res = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${token}`);
            const data = await res.json();
            console.log("API response:", data);
            if (data.pairs && data.pairs.length > 0) {
                const coin = data.pairs[0];
                console.log(coin);
                tokenName.textContent = coin.baseToken.name || "N/A";
                await get_AI_InvestScore(coin.baseToken.name);
                await get_AI_RiskScore(coin.baseToken.name);
                await get_AI_Buzz(coin.baseToken.name);
                tokenTitle.textContent = coin.baseToken.name;
                tokenPrice.textContent = coin.priceUsd ? `$${parseFloat(coin.priceUsd).toFixed(4)}` : "N/A";
                tokenCap.textContent = coin.liquidity.usd ? `$${parseFloat(coin.liquidity.usd).toLocaleString()}` : "N/A";

                tokenLink.innerHTML = `<a href="https://dexscreener.com/${coin.chainId}/${coin.pairAddress}" target="_blank">View in DEXscreener</a>`;
                chartFrame.src = `https://dexscreener.com/${coin.chainId}/${coin.pairAddress}`;
            } else {
                errorText.textContent = "Token not found or no data.";
            }
        } catch (err) {
            errorText.textContent = "Error fetching data.";
            console.error(err);
        }
    }
}


async function get_AI_InvestScore(tokenName) {
    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: `You are acting as a cryptocurrency analyst in a simulation. Based only on publicly available historical trends and reasoning, estimate a hypothetical AI Investment Score (0–10) for the token ${tokenName}. Consider factors like technology, adoption rate, developer activity, and past price performance. Do not give financial advice — this is for educational purposes only. Provide only the score and a one-sentence reason.`
            }),
        });

        const result = await response.json();
        if (result && result.insight) {
            tokenScore.textContent = result.insight;
        } else {
            tokenScore.textContent = "No Insight Available";
        }
    } catch (err) {
        console.error("AI request failed", err);
        tokenScore.textContent = "AI request failed";
    }
}

async function get_AI_RiskScore(tokenName) {
    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: `You are acting as a risk analyst in a simulation. Based only on publicly available historical data and reasoning, estimate a hypothetical Risk Score (0–10) for the token ${tokenName}. Consider volatility, liquidity, market trends, and security incidents. Do not give financial advice — this is for educational purposes only. Provide only the score and a one-sentence reason.`
            }),
        });

        const result = await response.json();
        if (result && result.insight) {
            tokenRisk.textContent = result.insight;
        } else {
            tokenRisk.textContent = "No Insight Available";
        }
    } catch (err) {
        console.error("AI request failed", err);
        tokenRisk.textContent = "AI request failed";
    }
}

async function get_AI_Buzz(tokenName) {
    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: `You are acting as a cryptocurrency social trend analyst in a simulation. 
Based only on publicly available historical and online community data, classify the current social buzz level for the token ${tokenName} into one of three categories: "Low Buzz", "Moderate Buzz", or "High Buzz". 
Consider online mentions, trending hashtags, news coverage, and crypto community engagement. 
Do not give financial advice — this is for educational purposes only.`
            }),
        });

        const result = await response.json();
        if (result && result.insight) {
            tokenBuzz.textContent = result.insight;
        } else {
            tokenBuzz.textContent = "No Insight Available";
        }
    } catch (err) {
        console.error("AI request failed", err);
        tokenBuzz.textContent = "AI request failed";
    }
}