// declare variables
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


// Function to fetch token data from the API and update the UI
async function getTokenData() {
    //get token input from user
    let token = document.getElementById("getToken").value.trim();

    // if token is empty alert the user 
    if (token === "") {
        alert("Please enter a token");
        return
    } else {
        // begin logic --> probably shouldve wrapped this in a function that I could call instead of writing full logic in if statement
        console.log("Token entered:", getToken.value);
        getToken.value = ""; // clear token value
        // api try catch block to fetch data from dexscreener API
        try {
            const res = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${token}`);
            const data = await res.json();
            console.log("API response:", data);
            // if data pairs and length is greater than 0, then we have a valid tokens available 
            if (data.pairs && data.pairs.length > 0) {
                // get coin thats first in array
                const coin = data.pairs[0];
                console.log(coin);
                tokenName.textContent = coin.baseToken.name || "N/A"; // Display token name
                await get_AI_InvestScore(coin.baseToken.name); // Call AI function to get investment score
                await get_AI_RiskScore(coin.baseToken.name); // Call AI function to get risk score
                await get_AI_Buzz(coin.baseToken.name); // Call AI function to get buzz score
                tokenTitle.textContent = coin.baseToken.name; // Display token title
                tokenPrice.textContent = coin.priceUsd ? `$${parseFloat(coin.priceUsd).toFixed(4)}` : "N/A"; // Display token price
                tokenCap.textContent = coin.liquidity.usd ? `$${parseFloat(coin.liquidity.usd).toLocaleString()}` : "N/A"; // Display token market cap
                tokenLink.innerHTML = `<a href="https://dexscreener.com/${coin.chainId}/${coin.pairAddress}" target="_blank">View in DEXscreener</a>`; // Create link to DEXscreener
                chartFrame.src = `https://dexscreener.com/${coin.chainId}/${coin.pairAddress}`; // Set the chart frame source to the DEXscreener URL
            } else {
                errorText.textContent = "Token not found or no data.";
            }
        } catch (err) {
            errorText.textContent = "Error fetching data.";
            console.error(err);
        }
    }
}

// AI functions to get investment, risk, and buzz scores
async function get_AI_InvestScore(tokenName) {
    try {
        // Fetch AI investment score from the server
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: `You are acting as a cryptocurrency analyst in a simulation. Based only on publicly available historical trends and reasoning, estimate a hypothetical AI Investment Score (0–10) for the token ${tokenName}. Consider factors like technology, adoption rate, developer activity, and past price performance. Do not give financial advice — this is for educational purposes only. Provide only the score and a one-sentence reason.`
            }),
        });
        // Check if the response is ok
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