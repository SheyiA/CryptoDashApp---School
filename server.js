// server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); // Load env vars first

const cohere = require('cohere-ai'); // ✅ CORRECTED

cohere.init(process.env.COHERE_API_KEY); // ✅ This will now work

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

        const insight = response.body.generations[0].text.trim();
        res.json({ insight });
    } catch (err) {
        console.error('Cohere error:', err);
        res.status(500).json({ error: 'Cohere API request failed' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});