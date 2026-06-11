# The Leadership Compass by Sudarshan

> Navigate · Inspire · Lead

A static blog on HR, leadership, and the future of work. No build step, no
framework — plain HTML/CSS/JS that can be hosted anywhere.

## Structure

```
index.html            Home page
pages/                Blog listing, About, Speaking, Resources, Newsletter
posts/                One HTML file per article
css/style.css         All styles (design tokens at the top in :root)
js/main.js            Mobile menu, newsletter forms, blog topic filters
js/features.js        AI features layer (see below)
images/               Logo SVGs (mark + full lockup)
serve.py              Local dev server
```

## Local preview

```bash
python3 -m http.server 8090
# then open http://localhost:8090
```

## AI features (js/features.js)

Everything is injected by one script, so pages only need the script tag:

- **Smart search** — press `/` anywhere or click the magnifier in the navbar.
  Plain-language queries are scored against a per-article keyword index.
- **Summarize** — on every post, builds a 3-bullet TL;DR from the lead
  sentence of each section.
- **Listen** — text-to-speech via the browser's Web Speech API.
- **Reading assistant** — chat bubble on posts; answers are grounded in the
  article by retrieving the most relevant passage.
- **Readers also read** — recommendations rendered from the article index.
- **Share snippet** — LinkedIn-ready post text and a branded pull quote,
  one click to copy.

### Adding a new article

1. Copy an existing file in `posts/`, replace the `<title>`, description,
   `post-header` block, and the contents of `.post-body`.
2. Add a card to `pages/blog.html` (copy a `post-card`, set `data-topic`)
   and optionally to the grid in `index.html`.
3. Add an `<item>` for it in `feed.xml` (title, link, pubDate,
   description) - this is what notifies email subscribers via the
   Mailchimp RSS automation and RSS readers.
4. Register it in the `ARTICLES` array at the top of `js/features.js`
   (url, title, tag, excerpt, keywords, quote, LinkedIn text) so search,
   recommendations, and share snippets pick it up.
5. Commit and push - Vercel deploys automatically in ~30s.
6. Notify subscribers: Mailchimp -> Create -> Email (Regular) ->
   subject = post title, body = 2-3 line teaser + link to the post ->
   send to the audience. (~5 minutes; RSS automation is not available
   on this Mailchimp plan, so sends are manual by design.)

## Deployment

The site is fully static — any of these work as-is:

### GitHub Pages
```bash
gh repo create leadership-compass --public --source=. --push
gh api repos/{owner}/leadership-compass/pages -X POST \
  -f "source[branch]=main" -f "source[path]=/"
```
Or in the repo UI: Settings → Pages → Deploy from branch → `main` / root.

### Netlify
Drag the project folder onto https://app.netlify.com/drop — done.
Or connect the Git repo; build command: none, publish directory: `/`.

### Vercel (recommended — enables the real AI features)
The `api/` folder contains serverless functions (`summarize.js`, `chat.js`)
that call the Claude API. On Vercel they make Summarize and the reading
assistant genuinely AI-powered; on static hosts the site silently falls
back to the built-in client-side versions.

1. Push this repo to GitHub.
2. vercel.com → Add New → Project → import the repo.
   Framework preset: "Other", no build command, output directory: `/`.
3. Settings → Environment Variables → add `ANTHROPIC_API_KEY`
   (create a key at console.anthropic.com). Redeploy.

Or via CLI: `npx vercel --prod`, then `npx vercel env add ANTHROPIC_API_KEY`.

## Production TODOs

- **Newsletter**: DONE - forms submit to the Mailchimp audience
  (config at the top of the newsletter block in `js/main.js`).
- **Social links**: LinkedIn / Twitter links in the footer are `#`
  placeholders.
- **Analytics**: add your snippet (Plausible/Fathom/GA) before `</head>`
  in each page.
