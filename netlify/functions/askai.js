const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  try {
    const { prompt } = JSON.parse(event.body || '{}');
    if (!prompt) {
      return { statusCode: 400, body: JSON.stringify({ error: 'No prompt provided' }) };
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();

    // Return the assistant's reply
    return {
      statusCode: 200,
      body: JSON.stringify({ answer: data.choices[0].message.content.trim() })
    };
  } catch (error) {
    console.error("OpenAI fn error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Function error occurred' })
    };
  }
};
