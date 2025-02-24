const express = require('express');
const cors = require('cors');
const OpenAI = require('openai'); // Change this import
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // Use environment variable for security
});

app.post('/chat', async (req, res) => {
    try {
        const { prompt } = req.body;

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // Update the model name if needed
            messages: [{ role: 'user', content: prompt }], // Change to 'messages' format
            max_tokens: 150,
        });

        res.json({ message: response.choices[0].message.content }); // Adjust response extraction
    } catch (error) {
        console.error(error);
        res.status(500).send('Error connecting to OpenAI API');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});