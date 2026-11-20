# Get live AI scoring by building this in Claude

This is the easiest way to get live AI feedback with no server, no API key, and no coding. Claude can publish this page as an "artifact" that is allowed to ask Claude to score answers.

`interview-practice.html` in this folder is the exact version built for that. It is already in the format Claude's artifact tool expects, so do not use the main `index.html` for this.

## Steps

1. Download this repository as a ZIP (green **Code** button, then **Download ZIP**) and unzip it. Open the `claude-artifact` folder.
2. Open Claude (the desktop app, or claude.ai with artifacts turned on). Start a new chat and attach `interview-practice.html`.
3. Paste this message:

> Publish the attached HTML file as an artifact exactly as it is. Do not redesign it or change the code. It uses three runtime capabilities, so declare all of them: dictation, sample, and downloads. When it is published, give me the link.

4. Open the link. The first time you use the microphone or press Review, Claude asks permission. Choose Allow.

That is it. You now have your own copy with voice answers and live AI scoring, running on your Claude account.

## Make it yours

After it is published, ask Claude in the same chat for changes, for example:

- "Change the small text at the top from ALPFA UIUC to [your group's name]."
- "Add a new role called Product Management with 10 common interview questions, following the existing pattern."
- "Change the accent color to gold and keep dark mode working."

Claude republishes to the same link each time.

## What to expect

- **AI scoring** uses the account of the person viewing the page, and Claude asks them to allow it. If you share the link, each viewer needs their own Claude account for the scoring to work.
- **Voice answers** use Claude's dictation. It works for the owner and for people in the same Claude organization as the owner, in Chrome, Edge, or the Claude desktop app on a laptop or desktop. Everyone else can type.
- **Privacy.** Your artifact is private until you share it from its Share menu. Answers and saved sessions stay in the viewer's own browser.
- **Availability.** Artifacts and these capabilities depend on your Claude plan and app version. If Claude says it cannot declare one of them, use the main version of this project with the Copy review prompt button, or connect your own AI as described in the main README.

## Using a different AI tool

Other chat tools (ChatGPT, Gemini, Copilot) can edit and show this page, but they do not let a page call the AI by itself. To get live scoring there you need a small server function that holds an API key, covered in the main README. Without it, the "Copy review prompt" button still works with any AI chat.
