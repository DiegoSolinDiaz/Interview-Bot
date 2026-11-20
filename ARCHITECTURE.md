# Architecture notes

These notes are written for people and for AI coding assistants who need to change the project. There is no build step. Everything runs from three files.

## Files

- `index.html` holds the styles (`<style>`), the three pages (`<main>`), and all the logic (one `<script>` inside an immediately invoked function). It loads `config.js` just before the script.
- `config.js` sets `window.INTERVIEW_CONFIG`. The script reads it once as `CFG`.
- `examples/vercel-api-review.js` is an optional example server function. It is not loaded by the page.

## Pages

Three `<div class="page">` blocks inside `<main>`: `#page-practice`, `#page-bank`, `#page-sessions`. The nav buttons in `.topnav` carry `data-page` attributes. `go(name)` shows one page, hides the others, sets `aria-current` on the nav button, and renders the bank or sessions page when it opens. The `[hidden]` attribute is used for showing and hiding, so the stylesheet at the top of `index.html` keeps `[hidden]{display:none!important}`.

## Question data

All questions are plain objects.

- Built-in questions are in the array `QS`, created with helpers: `B(question, tips)` for behavioral (`c:'beh'`), `I(...)` for intro and fit (`c:'intro'`), and `R(roleKey, question, tips)` for role questions (`c:'role', r:roleKey`). A second array, `EXTRA`, is pushed onto `QS`. After that, each item gets `q.id` equal to its index.
- `tips` is a list of strings that appear under "Show what a strong answer covers" and become the self-check list.
- The text `{co}` inside a question or tip becomes the company or organization name, or "this company" or "this organization" when none is set. The function `sub(text)` does this. It also swaps a few questions for organization wording through the `ORG_ALT` table.
- Roles are listed in `ROLES` as `[key, label]`. The last one, `custom`, holds the member's saved questions.
- Tailored questions are in the array `TQ`, created with `T(kind, type, question, tips)`. `kind` is `'co'` or `'org'`. `type` is a type key from `CO_TYPES` or `ORG_TYPES`, or `'*'` for any type. Their ids start at 10000 so they never collide with `QS` ids.
- Member-added questions are created by `makeQ(c, r, text, saved)`. They have `custom:true`, and `saved:true` when they belong to the saved Custom set.

## Choosing the next question

State variables: `cat` (`'mix'`, `'beh'`, `'intro'`, `'role'`, or `'tailored'`), `role`, `tkind` (`'co'` or `'org'`), `ctype`, `coConfirmed` (the confirmed name), `seen` (ids already asked), `noRepeat`, `cur` (the current question).

- `inPool(q)` says whether a question belongs to the current set. `poolList()` returns that set (the tailored set when `cat` is `'tailored'`).
- `tailPool()` returns the tailored questions that match the current kind and type, and only when a name or type is set.
- `nextQuestion()` picks from the unseen questions in the pool. When a target is set and the pool is not the tailored one, it draws a tailored bonus question about a quarter of the time. It shows "Session complete" when nothing is left, and an empty-Custom message when the Custom set has no questions.
- `onTargetChange()` runs when the kind, name, or type changes. It refreshes the setup panel and the question.

## Answering and local feedback

- Timer functions: `startTimer`, `pauseTimer`, `tick`, `elapsed`. `limit` is the chosen seconds, or `0` for no limit.
- `renderLocal(text)` builds the metrics (time, words, pace when voice was used, filler words), the STAR keyword check for behavioral questions, and the self-check list. The filler words are matched by the `FILLERS` regular expression. The STAR checks are the `STAR` object of regular expressions.

## Voice

`attachDictation(d, kind)` wires any object with `start()`, `stop()`, `onPartial(fn)`, `onFinal(fn)`, and `onState(fn)` to the answer box. Outside Claude, `noVoice()` builds such an object from the browser's `SpeechRecognition` through `webSpeech()`, but only when the page is not in an iframe. To use a different speech service, create an object with those five methods and pass it to `attachDictation(obj, 'browser')`.

## AI scoring

- `aiPrompt(text, seconds, plain)` builds the prompt. With `plain` true it asks for a readable reply instead of JSON, which is what the Copy review prompt button uses.
- `samp` is the AI hook. It is any object with a `json(prompt, {signal})` method that resolves to the review object. Outside Claude, `initStandalone()` builds `samp` from `CFG.ai` or `CFG.aiEndpoint`. If neither is set, `samp` stays `null` and `showPromptCopy()` is used.
- `runAI(text, seconds, attempt)` calls `samp.json`, shows the result with `renderAI`, and stores the scores on the attempt with `attachAI`. Failures map through the `AI_ERR` table using the error `code` (`rate_limited`, `invalid_json`, `upstream_error`, and so on).

## Sessions

- Each press of Review creates an attempt object through `recordAttempt`. It holds the question text, label, company and type, answer text, seconds, word count, pace, filler count, STAR flags, self-check counts, and later the `ai` result.
- `log` is the current unsaved list. `sessions` is the list of saved sessions (newest first, at most 50). `saveSession(name)` moves `log` into `sessions`.
- `renderSessions()` draws the My sessions page. `sessionText(session)` creates the plain-text export, and `dl.save({filename, data})` hands it to a download function. Outside Claude, `initStandalone` supplies one that downloads through a temporary link.

## Storage

Everything is in `localStorage`, wrapped in try and catch because storage can be blocked. Keys:

- `alpfa-ip-cat`, `alpfa-ip-role`, `alpfa-ip-limit`, `alpfa-ip-norepeat` remember the member's last choices.
- `alpfa-ip-custom` holds the saved Custom questions (an array of strings).
- `alpfa-ip-log` holds the unsaved answers of the current session.
- `alpfa-ip-sessions` holds saved sessions.
- `alpfa-ip-probe` is written and removed once to check that storage works.

Change the `alpfa-ip-` prefix everywhere if you run two copies of this project on the same site, so they do not share data.

## Security notes

Answers, company names, and member-written questions are untrusted text. The page builds all of its output with `textContent` and DOM calls, never `innerHTML`. Keep it that way. The AI prompt wraps the answer in markers and tells the model to treat it as text, and the page only reads the model's reply as data. Do not add API keys to any file in the repository.

## Testing by hand

Serve the folder (`python3 -m http.server 8000`), open the page in Chrome, and walk through: set a company and type, pick Tailored, answer and review a question, save the session, open My sessions and View answers, reload and confirm the session is still there, add a Custom question and choose Custom in the Role dropdown, and open the Question bank and search.
