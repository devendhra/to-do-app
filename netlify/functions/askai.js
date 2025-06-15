const fetch = require('node-fetch');

exports.handler = async function (event) {
    try {
        const { prompt } = JSON.parse(event.body || '{}');

        if (!prompt) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'No prompt provided' })
            };
        }

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        if (!GEMINI_API_KEY) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Missing Gemini API key' })
            };
        }

        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        const data = await response.json();
        console.log("gemini ai response:", data);

        if (!data.candidates || !data.candidates[0]) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Invalid response from Gemini' })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ answer: data.candidates[0].content.parts[0].text })
        };

    } catch (error) {
        console.error("Gemini Function Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Function error occurred', detail: error.message })
        };
    }
};
