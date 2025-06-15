const fetch = require('node-fetch'); // For Node 18

exports.handler = async function (event) {
    try {
        const { prompt } = JSON.parse(event.body || '{}');

        if (!prompt) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'No prompt provided' })
            };
        }

        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
        console.log("ENV API KEY:", OPENAI_API_KEY); // This should NOT be undefined!

        if (!OPENAI_API_KEY) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Missing OpenAI API key' })
            };
        }

        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7
            })
        });

        const data = await openaiRes.json();
        console.log("OpenAI raw response:", data);

        if (!data.choices || !data.choices[0]) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Invalid response from OpenAI' })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ answer: data.choices[0].message.content.trim() })
        };

    } catch (error) {
        console.error("AI Function Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Function error occurred', detail: error.message })
        };
    }
};
