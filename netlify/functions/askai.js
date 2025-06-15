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

        const API_KEY = process.env.OPENROUTER_API_KEY;
        console.log(API_KEY);

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://devendhrastodoapp.netlify.app/', // Your site
                'X-Title': 'DevaToDoAI'
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }]
            })
        });

        const data = await response.json();
        console.log("OpenRouter Response:", data);

        if (!data.choices || !data.choices[0]) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Invalid response from AI' })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ answer: data.choices[0].message.content })
        };
    } catch (error) {
        console.error("OpenRouter Function Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Function error', detail: error.message })
        };
    }
};
