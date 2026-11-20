// EXAMPLE ONLY. Not tested against a live account, so try it with a small test first.
//
// A small serverless function that lets the page get AI scoring without exposing your API key.
// On Vercel: copy this file to api/review.js in your own copy of the project, add the two
// environment variables from examples/.env.example in the Vercel dashboard, then set
// aiEndpoint: '/api/review' in config.js.
//
// The page sends { prompt } and expects { text } back.
//
// WARNING: a public endpoint like this lets anyone who finds it spend your AI credits.
// Before you share the site, set a low monthly spending limit in your AI provider's dashboard,
// and consider adding a rate limit or an access code.

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST only' });
    return;
  }
  const prompt = req.body && req.body.prompt;
  if (typeof prompt !== 'string' || prompt.length < 50 || prompt.length > 12000) {
    res.status(400).json({ error: 'Bad request' });
    return;
  }
  if (!process.env.ANTHROPIC_API_KEY || !process.env.ANTHROPIC_MODEL) {
    res.status(500).json({ error: 'Server is not configured' });
    return;
  }
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL,
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    if (!r.ok) {
      res.status(r.status === 429 ? 429 : 502).json({ error: 'AI request failed' });
      return;
    }
    const data = await r.json();
    const text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('');
    res.status(200).json({ text });
  } catch (e) {
    res.status(502).json({ error: 'AI request failed' });
  }
};
