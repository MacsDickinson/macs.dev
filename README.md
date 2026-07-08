# macs.dev — Portfolio & Blog

Personal portfolio and blog for Macs Dickinson. An interactive constellation
homepage with overlay sections, built as a fully static site.

**Stack:** [Vite](https://vitejs.dev) + React + TypeScript + Tailwind CSS,
deployed to **GitHub Pages** for free via GitHub Actions.

## Editing content (no code required)

All copy lives in plain JSON under [`src/content/`](src/content/). Edit a
file, commit, and the site redeploys automatically.

| File | What it controls |
| --- | --- |
| `profile.json` | Name, role, tagline, intro, email, past companies, "ask me about" topics |
| `talks.json` | Talks, workshops & podcast appearances (set `"upcoming": true` to badge one) |
| `work.json` | Work history timeline |
| `podcasts.json` | Podcast episodes |
| `principles.json` | The principles grid in About |
| `posts/*.json` | Blog posts — **one file per post** |

### Adding a blog post

Create `src/content/posts/my-new-post.json`:

```json
{
  "slug": "my-new-post",
  "title": "My New Post",
  "excerpt": "One-line teaser shown in the Writing section.",
  "date": "2026-07-07",
  "readingTime": "5 min read",
  "tag": "Leadership",
  "body": [
    "Each string in this array is a paragraph.",
    "Add as many as you like."
  ]
}
```

The post appears automatically at `/blog/my-new-post`, newest first. The
`slug` should match the filename and becomes the URL.

## Local development

```bash
npm install
npm run dev      # dev server with hot reload
npm run build    # production build → dist/
npm run preview  # serve the production build locally
```

> **Note:** the built site in `dist/` must be served over HTTP — use
> `npm run preview` (or any static file server). Opening `dist/index.html`
> directly from the file system shows a blank page, because the app's asset
> URLs and client-side routing need a web server.

## Deployment (GitHub Pages, free)

Every push to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the site and publishes it to GitHub Pages at:

```
https://macsdickinson.github.io/macs.dev/
```

**One-time setup:** in the repo go to *Settings → Pages* and set **Source**
to **GitHub Actions**.

The workflow reads the site's URL from the Pages configuration at build
time (`actions/configure-pages`), so the asset base path stays correct if
the repository is renamed or a custom domain is attached — no workflow
edits needed.

### Using a custom domain (e.g. macs.dev)

Add the domain under *Settings → Pages → Custom domain* and create the DNS
records GitHub shows you. The next push to `main` (or a manual re-run of the
deploy workflow) rebuilds the site for the new URL automatically.

## Known limitations

- **The "Book me" form relays through [FormSubmit](https://formsubmit.co)**
  (no backend on a static host). It emails the `FORM_INBOX` address set in
  `src/components/sections/BookMe.tsx` — a real inbox, *not* the public
  forwarding alias, because FormSubmit's activation emails didn't survive
  the `*@macs.dev` forward. The address must be **activated once**: the
  first submission triggers a FormSubmit confirmation email (sometimes
  hours late) — click the "Activate Form" link in it. Until then, visitors
  see the error state with a direct `mailto:` fallback. Changing the inbox
  means re-activating the new address.
- Content is rendered client-side (it's a single-page app), which is fine
  for a personal site but means search engines see the JS-rendered page
  rather than pre-rendered HTML per post.
