const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const groq = new Groq({ apiKey: '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' });

async function getGroqChatCompletion(text) {
    return groq.chat.completions.create({
        messages: [
            {
                role: 'user',
                content: `Simplify the following legal text for a general audience. Include meaningful headings where applicable. Also give the result in markdown format. Don't include any starting lines like "here's your answer". Directly start with the answer.\n${text}`,
            },
        ],
        model: 'llama3-8b-8192',
    });
}

app.post('/simplify', async (req, res) => {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
        res.status(400).json({ error: 'Invalid input: Please provide a non-empty string for the analysis.' });
        return;
    }

    try {
        const chatCompletion = await getGroqChatCompletion(text);
        const simplifiedText = chatCompletion.choices[0]?.message?.content || 'No response from Groq API';

        res.json({ simplifiedText });
    } catch (error) {
        console.error('Error during document simplification:', error);
        res.status(500).json({
            error: 'Error simplifying the document.',
            details: error.message,
            suggestions: [
                'Ensure the server is running and accessible.',
                'Verify that the API key is valid and active.',
                'Check if there are any issues with the Groq service.',
            ],
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});