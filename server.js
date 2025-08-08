const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY
});

const app = express();
const path = require('path');
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/analyze', async(req, res) => {
    try {
        const { prompt } = req.body;

        const response = await cohere.generate({
            model: 'command',
            prompt: prompt,
            max_tokens: 50,
            temperature: 0.9,
        });

        const insight = response.generations[0].text.trim();
        res.json({ insight });
    } catch (err) {
        console.error('Cohere error:', err);
        res.status(500).json({ error: 'Cohere API request failed' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});