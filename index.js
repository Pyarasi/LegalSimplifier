const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Groq = require('groq-sdk'); // Import Groq SDK

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Groq API with hardcoded API key
const groq = new Groq({ apiKey: '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' }); // Replace with your actual Groq API key

// Function to get chat completion from Groq
async function getGroqChatCompletion(text) {
    return groq.chat.completions.create({
        messages: [
            {
                role: 'user',
                content: `Simplify the following legal text for common people:\n${text}`,
            },
        ],
        model: 'llama3-8b-8192', // Using the specified model
    });
}

app.post('/simplify', async (req, res) => {
    const { text } = req.body;

    try {
        // Call the function to get the simplified text
        const chatCompletion = await getGroqChatCompletion(text);
        const simplifiedText = chatCompletion.choices[0]?.message?.content || 'No simplification available';

        // Send the simplified text back to the frontend
        res.json({ simplifiedText });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error simplifying the document');
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
