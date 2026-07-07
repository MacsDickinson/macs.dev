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

## Deployment (GitHub Pages, free)

Every push to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the site and publishes it to GitHub Pages at:

```
https://macsdickinson.github.io/Speaking-Engagements-Portfolio/
```

**One-time setup:** in the repo go to *Settings → Pages* and set **Source**
to **GitHub Actions**.

### Using a custom domain (e.g. macs.dev)

1. Add the domain under *Settings → Pages → Custom domain* and create the
   DNS records GitHub shows you.
2. Delete the `BASE_PATH` env block from the `Build` step in
   `.github/workflows/deploy.yml` (the site will then be served from `/`).

## Known limitations

- **The "Book me" form doesn't send anything yet** — it's a visual mock.
  There is no backend on a static host; the quickest fix is a free form
  service like [Formspree](https://formspree.io) or
  [Web3Forms](https://web3forms.com) (point the form's `onSubmit` at their
  endpoint), or swap the form for a `mailto:` link.
- Content is rendered client-side (it's a single-page app), which is fine
  for a personal site but means search engines see the JS-rendered page
  rather than pre-rendered HTML per post.
