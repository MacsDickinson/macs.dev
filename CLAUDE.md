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
| `src/pages/Home.tsx` | Constellation shell; the open overlay is the URL (`/:section` route), so sections deep-link and browser back/forward work |
| `src/pages/BlogPost.tsx` | `/blog/:slug` reading view (standalone route) |
| `src/components/sections/Hero.tsx` | The constellation "main level" — no copy, just the lazy-loaded 3D scene + sr-only `<h1>` + mobile nav pills |
| `src/components/HeroScene.tsx` | react-three-fiber scene: the name as extruded **glass** (Fraunces, MeshTransmissionMaterial — recipes in `GLASS_MATERIALS`), a photoreal JWST backdrop, a slowly rotating starfield, the clickable nav stars (drei `<Html>`), and a cursor-steered off-screen key light + bloom. Code-split — three.js loads only on the home route |
| `src/components/HeroBackdrop.tsx` | The photographic backdrop plane (cover-fit, Ken-Burns drift, pointer parallax) |
| `src/data/heroConfig.ts` | **Hero configuration**: backdrop image registry + per-day schedule, and the glass style (`HERO_GLASS`) |
| `src/components/NavNode.tsx` | Dot + label button for a nav star; anchored in 3D by `HeroScene` |
| `public/fonts/*.typeface.json` | Fraunces subsetted to the name's glyphs for the 3D text (see below) |
| `public/backdrops/*.jpg` | Backdrop photography (JWST releases, CC BY 4.0 — credit renders in the hero corner) |
| `src/components/SectionOverlay.tsx` | Circle-clip reveal panel that every section renders inside; sets the section accent |
| `src/components/sections/*` | About, Speaking, Work, Podcast, Writing, BookMe |
| `src/components/SectionHeader.tsx`, `Reveal.tsx`, `Footer.tsx` | Shared section chrome + scroll-reveal wrapper |
| `src/content/*.json` | **All section copy** — edit JSON, never hard-code text in components |
| `src/content/posts/*.md`, `*.html` | **Blog posts** — markdown or standalone interactive HTML (see below) |
| `src/data/content.ts` | Typed loader for the JSON; add fields to the types here |
| `src/data/posts.ts` | Blog post loader — globs `src/content/posts/`, parses frontmatter. Embeds every post's full text, so it must only be imported from lazy-loaded code (`Writing`, `BlogPost`), never from the main chunk |
| `src/canvas.manifest.js` | Screen registry — powers `?mp_screen=` deep links (see Verifying) |
| `src/index.css` | Design tokens + the Signal Deck system (below) |

Content is data-driven: to change words, edit the JSON. To change *look*, edit
the component + `index.css`. Keep the two separate.

The blog is a historic archive — Macs's LinkedIn posts plus his original
2013–2015 .NET/Nancy-era blog — dated to their original publish dates. Drop a
file into `src/content/posts/` and it's live (`src/data/posts.ts` globs the
folder). Name files `yyyy-MM-dd-title.md` — the date prefix keeps the folder
sorted, doubles as the date if frontmatter omits one, and is stripped from the
URL (`/blog/<title>`):

- **`*.md`** — markdown with a `---` frontmatter block, rendered by
  react-markdown into the `.post-prose` styles in `index.css`.
- **`*.html`** — standalone interactive/immersive posts; frontmatter lives in
  a leading `<!-- -->` comment. `BlogPost.tsx` renders them in an
  auto-resizing iframe: *fragments* get wrapped in the Signal Deck tokens +
  fonts (authors can use `var(--surface)`, `var(--ac)`, `.font-display`…);
  *full documents* (real `<html>` tag) are used verbatim.
- Files starting with `_` are skipped — `_template.md` / `_template.html`
  are copy-me starting points documenting the frontmatter.
- Frontmatter: `title`, `excerpt`, `date` (YYYY-MM-DD), `tag`, plus optional
  `featured: true` (pins to the featured cards at the top of Writing; the
  rest render as a dated archive list), `linkedin: <url>` (renders an
  "Originally posted on LinkedIn" source link), `draft: true` (keeps the post
  off the site entirely — for unfinished pieces), and `readingTime` (computed
  from word count if omitted).
- Post images live in `public/img/`; reference them root-relative in markdown
  (`![alt](/img/foo.png)`). `BlogPost.tsx` prefixes such `/…` URLs with
  `import.meta.env.BASE_URL` so they resolve under the `/macs.dev/` Pages base
  — never hardcode `/macs.dev/` yourself. Filenames on a case-insensitive
  macOS filesystem: when bulk-renaming posts, move via a temp name (write new,
  remove old, `os.replace`) — a case-only rename like `Foo.md`→`foo.md` is the
  *same inode*, so "write new then delete old" deletes the file you just wrote.

**Hero scene notes:**
- **Backdrop & glass are configured in `src/data/heroConfig.ts`**, not in the
  components. To add an image: drop a ~1920×1200 JPEG (≲1 MB) in
  `public/backdrops/`, register it in `HERO_IMAGES` with an accurate credit
  (the CC BY 4.0 credit renders in the hero's bottom-right corner), and
  optionally pin it to dates via `IMAGE_SCHEDULE` (`'MM-DD'` annual,
  `'YYYY-MM-DD'` one-off). `HERO_GLASS` picks the name's material preset
  (clear/frosted/smoke/obsidian) with optional roughness/thickness/tint
  overrides.
- The pointer does **not** attract particles — it only steers the direction of
  the off-screen light that reveals the glass name (raking angles glint; a
  frontal light would mirror into the camera and blow the effect out). The
  light's direction is damped **as an angle around the screen rim** at fixed
  low elevation — never lerp the direction vector, or crossing the cursor
  through mid-screen sends the light through a frontal orientation and the
  name flashes white. Touch devices get a slow auto-orbit. The name also
  leans a few degrees toward the cursor (`tiltRef` in `GlassName`).
- Nav stars sit in a loose ring inside the rotating sky group so a full
  revolution never carries them off-screen. They drift constantly, so
  Playwright must click them with `{ force: true }` (they never pass its
  "stable" check).
- The 3D fonts in `public/fonts/` are typeface-JSON subsets ("MacsDickinson"
  glyphs only) of Fraunces instanced at `opsz=72 wght=340`. Reference them
  through `import.meta.env.BASE_URL`, never a bare `/fonts/...` — GitHub
  Pages serves the site from `/macs.dev/`, and hardcoded absolute URLs 404
  there (Vite only rewrites *imported* assets, not string URLs). To
  regenerate:
  `fonttools varLib.instancer` on the Google Fonts variable TTF, then parse
  with three's `TTFLoader` in Node and keep only the needed glyphs.
- `prefers-reduced-motion` freezes sky rotation, float, and the light sweep.
- Stack pins for React 18: `@react-three/fiber@8`, `drei@9`,
  `@react-three/postprocessing@2`, `three@0.169` — don't bump majors until
  React 19.

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

Each section is a deep-linkable route, so land directly on any state by URL,
then screenshot with a headless browser. (`Home` reads the `:section` param
and opens that overlay; browser back/forward and refresh all work.)

| Screen | URL |
| --- | --- |
| About | `/about` |
| Speaking | `/speaking` |
| Work | `/work` |
| Writing | `/writing` |
| Podcast | `/podcast` |
| Book me | `/book` |
| A blog post | `/blog/atomic-team-design` |

The legacy `?mp_screen=<id>` deep links (`src/canvas.manifest.js`) still work —
`Home` redirects them to the canonical `/section` path on load.

Reveal animations use framer-motion `whileInView` (IntersectionObserver),
which **does not fire under a plain headless `--screenshot`**. Take a
**full-page** screenshot so the viewport resizes to the full content height
and every element enters view. Example that works here:

```bash
npm run dev &   # serve on some port, e.g. 5219
PLAYWRIGHT_BROWSERS_PATH=~/Library/Caches/ms-playwright \
  npx -y playwright@1.48.0 screenshot --full-page \
  --viewport-size=1440,1000 --wait-for-timeout=2200 \
  "http://localhost:5219/podcast" /tmp/podcast.png
```

Then read the PNG. Verify against the hero for cohesion and check each
section's accent is correct.

The hero itself is WebGL (renders fine in headless Chromium via SwiftShader)
but needs `--wait-for-timeout=4500` or so for the lazy chunk + font + first
frames. To see the light sweep, drive it with a scripted Playwright
`mouse.move(...)` and a ~2s settle before the screenshot.

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
