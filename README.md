# Interview Practice

A free, single-page interview practice tool for student organizations. Members pick a question, answer out loud (voice to text) or in writing against a timer, and get instant feedback. It runs entirely in the browser with no build step, no framework, and no account.

Built for ALPFA UIUC. Fork it, rename it, and change the questions to fit your own club.

## What it does

- **Voice answers.** Press Start answering and talk. Words appear in the answer box as you speak (Chrome or Edge on a laptop or desktop). Typing works everywhere.
- **Timer.** Pick 30, 45, 60, 75, or 90 seconds, or no limit.
- **152 common questions.** Behavioral (21), Intro and fit (20), and role sets for finance, accounting, marketing, data analysis, data science, engineering, supply chain and operations, consulting, and human resources.
- **Company or organization tailoring.** Enter a name and an optional type (consulting, nonprofit, student club, and more). Bonus questions written for that target come up every so often, and there is a Tailored set for focused practice. The site cannot look up real facts about the company, and says so.
- **Your own questions.** Add a question to any set for the current visit, or save it to a Custom set that stays in the browser.
- **Instant local feedback.** Word count, pace, filler words, a STAR keyword check for behavioral questions, and a self-check list.
- **Optional AI scoring.** Scores for structure, specificity, impact, and clarity, plus a stronger rewrite. Works with any AI you connect, or with a copy-and-paste prompt if you connect nothing.
- **Saved sessions.** Every reviewed answer is logged with its scores. Save sessions, look back at them, and export them as text.
- **Three pages.** Practice, Question bank, and My sessions.

Everything a member writes stays in their own browser (localStorage). There is no database and no server of ours.

## Try it on your computer

You need any simple web server, because browsers only allow microphone access on `https://` pages or on `localhost`. Opening `index.html` by double-clicking it may block the microphone.

```
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
cd YOUR-REPO
python3 -m http.server 8000
```

Then open http://localhost:8000 in Chrome or Edge.

## Put it online for free

**GitHub Pages** (easiest, because the code is already on GitHub):

1. Push the project to a GitHub repository.
2. In the repository, open Settings, then Pages.
3. Under "Build and deployment", set Source to "Deploy from a branch", choose the `main` branch and the `/ (root)` folder, and save.
4. After a minute or two the site appears at `https://YOUR-USERNAME.github.io/YOUR-REPO/`. Pages uses https, so the microphone works.

**Vercel or Netlify** also work. Import the repository and use the default settings. There is nothing to build, so leave the build command and output folder empty.

## Make it yours

Most changes are in `config.js`:

- `orgName`, `title`, and `subtitle` change the text at the top of the page.

Other common changes are in `index.html`, which holds the styles, the page, and the script in one file so it is easy to hand to an AI assistant:

- **Colors and fonts.** The tokens at the top of the `<style>` block (`--bg`, `--accent`, and so on). Dark mode values are in the next two blocks.
- **Questions.** Search for `var QS = [` (the original questions) and `var EXTRA = [` (more questions). Each one is written like `B('Question text', ['tip one', 'tip two'])` for behavioral, `I(...)` for intro and fit, and `R('finance', ...)` for a role.
- **Roles.** The `ROLES` list. Add a new `['key','Label']` pair, then add questions with `R('key', ...)`.
- **Tailored questions and types.** The `TQ` block of `T(...)` lines, and the `CO_TYPES` and `ORG_TYPES` lists.
- **Time limit choices.** The `LIMITS` list.

See `docs/ARCHITECTURE.md` for how the pieces fit together.

## Connect an AI for scoring (optional)

With nothing connected, the Review button shows a **Copy review prompt** button. The member pastes that prompt into any AI chat they already use. This is free and needs no setup.

To score answers inside the page, pick one:

1. **Your own endpoint.** Write a small server function that receives `{ "prompt": "..." }`, sends the prompt to your AI provider with your API key, and returns `{ "text": "the AI's reply" }`. Set `aiEndpoint` in `config.js` to its address. `examples/vercel-api-review.js` shows one way to do this on Vercel with the Anthropic API. The same pattern works for OpenAI, Gemini, or a local model.
2. **A function in `config.js`.** Set `ai` to a function that takes `(prompt, signal)` and returns a Promise of the review. Use this if your AI is already reachable from the browser in a way you control.

The reply must contain one JSON object with `structure`, `specificity`, `impact`, `clarity` (each 1 to 5), `headline`, `worked` (list), `fix` (list), `accuracy`, `rewrite`, and, when a company or organization is set, `companyKnown` and `company`. The prompt already asks for exactly this shape.

**Never put an API key in `index.html` or `config.js`.** Anything in those files is public. Keep keys in your host's environment variables, behind a server function, and set a spending limit with your AI provider. A public endpoint lets anyone who finds it spend your credits.

## Live AI scoring with no setup (Claude)

If you use Claude, you can get voice answers and live AI scoring with no server and no API key. Claude can publish a ready-made version of this page as an artifact that is allowed to call Claude for scoring. Follow `claude-artifact/HOW-TO.md`. It takes about two minutes.

## Using it with an AI coding assistant

Hand your assistant `index.html`, `config.js`, and `docs/ARCHITECTURE.md`, then ask for what you want. For example:

- "Add a new role called Product Management with 10 common interview questions. Follow the existing `R()` pattern."
- "Change the colors to our club's palette: navy and gold. Keep dark mode working."
- "Connect AI scoring to the OpenAI API through a Vercel serverless function at `api/review.js`, and set `aiEndpoint` in `config.js`. Do not put the key in the browser."
- "Translate the interface and the question text to Spanish."

Ask it to keep the page working with no build step, and to run through the Practice, Question bank, and My sessions pages when it is done.

## Privacy

- Answers, scores, and saved questions are stored in the member's browser only. Clearing site data erases them, and a different browser or device starts empty.
- Voice recognition is done by the member's browser. In Chrome and Edge that usually means an online speech service run by the browser maker, so audio may leave the device. The page itself keeps only the text.
- If AI scoring is connected, the answer text and the company or organization name are sent to that AI service. If you use the copy-and-paste option, nothing is sent until the member pastes it somewhere.
- Fonts load from Google Fonts. Remove the three `<link>` lines near the top of `index.html` if you want no third-party requests. The page falls back to system fonts.

## Known limits

- Voice answers work in Chrome and Edge on laptops and desktops. Safari, Firefox, and most phones need typing.
- Voice recognition drops most filler words, so the filler count is a minimum.
- The STAR check is a keyword check, not a grade.
- Company and organization tailoring changes the wording of questions. It does not research the company.
- The AI can be wrong, especially about technical answers and about companies it does not know well.

## License

MIT. See `LICENSE`. Replace `[YOUR NAME]` in that file with your name before you publish.
