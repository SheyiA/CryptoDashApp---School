// server.js
// Import necessary modules
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
// Import Cohere AI client
const { CohereClient } = require("cohere-ai");
// Initialize Cohere AI client with API key
const cohere = new CohereClient({
    // Use your Cohere API key from environment variables
    token: process.env.COHERE_API_KEY,
});

const app = express();
const path = require("path");
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/analyze", async(req, res) => {
    try {
        const { prompt } = req.body;

        const response = await cohere.chat({
            model: "command-r-plus",
            message: prompt,
            temperature: 0.7
        });

        let insight = "No insight returned";

        if (response && response.text) {
            insight = response.text.trim();
        }

        res.json({ insight });

    } catch (err) {
        console.error("Cohere analyze crash:", err);
        res.status(500).json({ error: "Analyze failed" });
    }
});
app.get("/healthz", (req, res) => {
    res.status(200).send("OK");
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});