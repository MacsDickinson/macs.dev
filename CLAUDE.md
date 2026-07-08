# CLAUDE.md — working in this repo

Guidance for AI agents (and humans) working on **macs.dev**. Read this before
making changes. For content-editing and deployment basics aimed at end users,
see [`README.md`](README.md) — this file is about *how we build and verify*.

## What this is

Personal portfolio + blog for Macs Dickinson. A fully static single-page app:
an interactive constellation homepage where each drifting node opens a
full-screen **overlay section**. Blog posts are separate routes.

**Stack:** Vite + React 18 + TypeScript + Tailwind CSS 3 + framer-motion,
deployed to GitHub Pages via GitHub Actions.

## Architecture map

| Path | Role |
| --- | --- |
| `src/pages/Home.tsx` | Constellation shell; owns which overlay section is `active` |
| `src/pages/BlogPost.tsx` | `/blog/:slug` reading view (standalone route) |
| `src/components/sections/Hero.tsx` | The constellation "main level" — the visual north star everything else aligns to |
| `src/components/ConstellationBackground.tsx` | Cursor-reactive `<canvas>` particle field |
| `src/components/SectionOverlay.tsx` | Circle-clip reveal panel that every section renders inside; sets the section accent |
| `src/components/sections/*` | About, Speaking, Work, Podcast, Writing, BookMe |
| `src/components/SectionHeader.tsx`, `Reveal.tsx`, `Footer.tsx` | Shared section chrome + scroll-reveal wrapper |
| `src/content/*.json`, `src/content/posts/*.json` | **All copy** — edit JSON, never hard-code text in components |
| `src/data/content.ts` | Typed loader for the JSON; add fields to the types here |
| `src/canvas.manifest.js` | Screen registry — powers `?mp_screen=` deep links (see Verifying) |
| `src/index.css` | Design tokens + the Signal Deck system (below) |

Content is data-driven: to change words, edit the JSON. To change *look*, edit
the component + `index.css`. Keep the two separate.

**Contact form:** `BookMe.tsx` POSTs to FormSubmit
(`https://formsubmit.co/ajax/<FORM_INBOX>`) — no backend, no API key.
`FORM_INBOX` is deliberately **not** `PROFILE.email`: `contact@macs.dev` is a
Squarespace forward and FormSubmit's activation emails didn't survive the
hop — register a real inbox directly. A new address must be activated once
via FormSubmit's confirmation email, triggered by the first submission and
**sometimes hours late** — don't assume breakage too early. FormSubmit
returns HTTP 200 even on non-delivery, flagging it in the body instead, so
the code checks `success === "true"` — don't "simplify" that away. The
endpoint also rejects requests without a browser `Origin`; test with
`curl -H "Origin: https://macs.dev"`.

## Design system — "Signal Deck" (dark neumorphism × retrofuturism)

The whole site lives in **one dark world**. The hero is a dark constellation
field; the content pages extend it as a **backlit instrument deck** — every
surface is a soft-extruded "alloy" panel backlit by its section's accent.
Do **not** reintroduce the old cream/`--paper` palette on content.

Defined in `src/index.css`:

- **Surfaces:** `--ground` (deepest), `--surface` / `--surface-hi` (raised
  panels), `--surface-sunken`, `--edge` / `--edge-soft` (hairlines).
- **Text:** `--text`, `--text-soft`, `--text-dim`. Body copy stays
  high-contrast and flat — reserve extrusion for *containers/controls*, not
  running text (keeps long reads comfortable).
- **Per-section accent:** `--ac`. `SectionOverlay` sets it from the section's
  constellation node colour, so children just use `var(--ac)`. Mapping:
  About = green (`--signal`), Speaking/Podcast = purple (`--electric`),
  Work = slate (`--dim`), Book = orange (`--accent`), blog = green.
- **Neumorphic shadows:** `--nm-raise`, `--nm-raise-lg`, `--nm-inset`,
  `--nm-flat`, and `--nm-hover` (raised + accent rim-glow; resolves `--ac` at
  the call site). Apply via Tailwind arbitrary values, e.g.
  `shadow-[var(--nm-raise)] hover:shadow-[var(--nm-hover)] active:shadow-[var(--nm-inset)]`.
- **Atmosphere:** `.deck-grid`, `.deck-scan`, `.deck-grain` overlay classes;
  `.eq-bar` for the podcast equaliser.
- **Type:** Fraunces (display, `font-display`, light weight, high `opsz`),
  Inter (body), JetBrains Mono (`font-mono`, uppercase tracked labels).

**Rules of thumb when adding a content surface:**
- Use `--surface` + a `--nm-*` shadow for panels; `--surface-sunken`/`--nm-inset`
  for pressed-in slots (chips, list items).
- Make it tactile: lift on hover, press in on `active`, ignite the accent glow.
- Honour `prefers-reduced-motion` (see the media query in `index.css`).
- Keep one accent per section — don't mix constellation colours in one view.

## Development workflow

```bash
npm install
npm run dev      # hot-reload dev server (vite)
npm run build    # production build → dist/  (this is the real gate)
npm run lint     # eslint
```

**`npx tsc --noEmit` reports pre-existing "unused React import" errors
repo-wide** (automatic JSX runtime). These are noise — Vite/esbuild strips
them. Treat **`npm run build` passing** as the compile gate, not `tsc`.

### Verifying changes visually (do this for any UI change)

The app never scroll-jumps between pages, and sections open via JS, so use the
**`?mp_screen=` deep links** from `src/canvas.manifest.js` to land directly on
any state, then screenshot with a headless browser.

| Screen | URL |
| --- | --- |
| About | `/?mp_screen=scr_4btoq4` |
| Speaking | `/?mp_screen=scr_vriwrr` |
| Work | `/?mp_screen=scr_j72oo0` |
| Writing | `/?mp_screen=scr_v965fu` |
| Podcast | `/?mp_screen=scr_wynt0n` |
| Book me | `/?mp_screen=scr_uqxeto` |
| A blog post | `/blog/restructuring-for-flow` |

Reveal animations use framer-motion `whileInView` (IntersectionObserver),
which **does not fire under a plain headless `--screenshot`**. Take a
**full-page** screenshot so the viewport resizes to the full content height
and every element enters view. Example that works here:

```bash
npm run dev &   # serve on some port, e.g. 5219
PLAYWRIGHT_BROWSERS_PATH=~/Library/Caches/ms-playwright \
  npx -y playwright@1.48.0 screenshot --full-page \
  --viewport-size=1440,1000 --wait-for-timeout=2200 \
  "http://localhost:5219/?mp_screen=scr_wynt0n" /tmp/podcast.png
```

Then read the PNG. Verify against the hero for cohesion and check each
section's accent is correct.

## Git & PR conventions

- **Never commit straight to `main`.** Branch first
  (`redesign/…`, `feat/…`, `fix/…`), commit, push, open a PR against `main`.
- End commit messages with:
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`
- End PR bodies with the Claude Code generation line.
- **Merging to `main` auto-deploys** to GitHub Pages
  (`.github/workflows/deploy.yml`). Make sure `npm run build` passes and the
  change is visually verified before merging.

## Keeping this file current

**Update `CLAUDE.md` as the final step of any substantive change** — when you
add/rename a key file, change the design tokens or the Signal Deck system,
alter the build/verify workflow, or change the git/deploy process, edit the
relevant section here in the same PR. Leave it accurate for the next agent.
