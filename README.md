# mGrant Builders — session site

Static site for GitHub Pages. No build step.

```
index.html                 Home (hero, latest session, session cards)
sessions/index.html        All Sessions list
sessions/session-1.html    Session 1 — Tech Fundamentals
sessions/_template.html    Copy this for each new session
assets/style.css           Shared styles (light + dark)
assets/site.js             Sidebar, mobile menu, theme toggle, session lists, prev/next
assets/sessions.js         ← the list of sessions (edit this when you add one)
assets/logo.svg            Favicon
```

## Adding a new session

1. Copy `sessions/_template.html` to `sessions/session-2.html` and fill it in.
   Set `data-page="session-2.html"` on `<body>`.
2. In `assets/sessions.js`, update the session 2 entry: title, date, summary and tags,
   then set `status: 'done'`. Move `latest: true` from session 1 to session 2.
   Add `recording: '<Stream link>'` to show the Watch buttons.
3. Commit and push. The sidebar, home page, All Sessions page and prev/next links
   update automatically.

## Publishing on GitHub Pages

Push this folder to a repo, then go to **Settings → Pages → Deploy from branch → main / root**.
The site will be at `https://<your-username>.github.io/<repo-name>/`.
