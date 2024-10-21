const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Groq = require('groq-sdk'); 

const app = express();
app.use(cors());
app.use(bodyParser.json());

const groq = new Groq({ apiKey: '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' }); // Replace with your actual Groq API key

async function getGroqChatCompletion(text) {
    return groq.chat.completions.create({
        messages: [
            {
                role: 'user',
                content: `Simplify the following legal text and simplify it for people who are not well versed in legal lingo. Start the reply with the answer directly, don't say silly shit like "here's the answer" or some other nonsense. Also divide the answer into meaningful headings such as "Allegations, repurcussions etc" but be smart about it. Keep it crisp and meaninngful, don't beat around the bush' \n${text}`,
            },
        ],
        model: 'llama3-8b-8192', 
    });
}

app.post('/simplify', async (req, res) => {
    const { text } = req.body;

    try {
        const chatCompletion = await getGroqChatCompletion(text);
        const simplifiedText = chatCompletion.choices[0]?.message?.content || 'No simplification available';

        res.json({ simplifiedText });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error simplifying the document');
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
