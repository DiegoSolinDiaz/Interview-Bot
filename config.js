// Site settings. Edit this file for the common changes, so you rarely need to touch index.html.
window.INTERVIEW_CONFIG = {
  // Text at the top of the page
  orgName: 'ALPFA UIUC',
  title: 'Interview Practice',
  subtitle: 'Pick a question, answer out loud or in writing, and get feedback you can use before your next interview.',

  // AI scoring. Leave both of these off and the page shows a "Copy review prompt" button
  // instead, which works with any AI chat (ChatGPT, Claude, Gemini, Copilot) and costs nothing.
  //
  // Option 1: point to your own server function that calls an AI for you.
  // The page sends { prompt } as JSON and expects { text } back, where text is the AI's reply.
  // See examples/vercel-api-review.js. Never put an API key in this file or in index.html.
  aiEndpoint: '',          // for example '/api/review'

  // Option 2: a function you write yourself. It gets (prompt, abortSignal) and must return a
  // Promise that resolves to the review as an object, or as text that contains one JSON object.
  ai: null
};
