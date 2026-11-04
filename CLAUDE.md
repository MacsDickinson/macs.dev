# CLAUDE.md — working in this repo

Guidance for AI agents (and humans) working on **macs.dev**. Read this before
making changes. For content-editing and deployment basics aimed at end users,
see [`README.md`](README.md) — this file is about *how we build and verify*.

## What this is

Personal portfolio + blog for Macs Dickinson. A fully static single-page app
with a photographic portrait stage. Every section opens on a light reading sheet;
blog posts are separate routes in the same persistent scene.

The portrait and name respond to the pointer on home, then move aside for content.
`PortraitExperience.tsx` stays mounted across all section and blog routes.
Use `/?constellation` to compare the original 3D homepage; its assets remain lazy.
The accepted portrait/paper direction now applies to the whole site.

**Stack:** Vite + React 18 + TypeScript + Tailwind CSS 3 + framer-motion,
deployed to GitHub Pages via GitHub Actions.

## Architecture map

| Path | Role |
| --- | --- |
| `src/pages/Home.tsx` | Section-route shell; all sections use the portrait reading sheet; `?constellation` loads the original hero |
| `src/pages/BlogPost.tsx` | `/blog/:slug` reading view (standalone route) |
| `src/components/sections/Hero.tsx` | Portrait-stage home controls, destination hover/focus previews, and existing section navigation |
| `src/components/HeroScene.tsx` | react-three-fiber scene: the name as extruded **glass** (Fraunces, MeshTransmissionMaterial — recipes in `GLASS_MATERIALS`), a photoreal JWST backdrop, a slowly rotating starfield, the clickable nav stars (drei `<Html>`), and a cursor-steered off-screen key light + bloom. Code-split — three.js loads only for `?constellation` |
| `src/components/HeroBackdrop.tsx` | The photographic backdrop plane (cover-fit, Ken-Burns drift, pointer parallax) |
| `src/data/heroConfig.ts` | **Hero configuration**: backdrop image registry + per-day schedule, and the glass style (`HERO_GLASS`) |
| `src/components/NavNode.tsx` | Dot + label button for a nav star; anchored in 3D by `HeroScene` |
| `public/fonts/*.typeface.json` | Fraunces subsetted to the name's glyphs for the 3D text (see below) |
| `public/backdrops/*.jpg` | Backdrop photography (JWST releases, CC BY 4.0 — credit renders in the hero corner) |
| `src/components/SectionOverlay.tsx` | Legacy circle-clip panel, retained for reference; no longer used by the main routes |
| `src/components/sections/*` | About, Speaking, Work, Podcast, Writing, BookMe |
| `src/components/SectionHeader.tsx`, `Reveal.tsx`, `Footer.tsx` | Legacy dark section chrome and scroll-reveal wrapper |
| `src/content/*.json` | **Structured content** — profile, principles, talks, work history, and podcast episodes |
| `src/content/posts/*.md`, `*.html` | **Blog posts** — markdown or standalone interactive HTML (see below) |
| `src/data/content.ts` | Typed loader for the JSON; add fields to the types here |
| `src/canvas.manifest.js` | Screen registry — powers `?mp_screen=` deep links (see Verifying) |
| `src/index.css` | Design tokens + the Signal Deck system (below) |
| `src/components/PaperPage.tsx` | Shared section sheet, page switcher, animated heading and booking footer |
| `src/components/PaperDisclosure.tsx` | Keyboard-accessible animated role and talk details |
| `src/components/PortraitExperience.tsx` | Persistent photographic scene; damped pointer depth and portrait transitions with uniform name scaling |
| `src/components/ReadingTitle.tsx` | Clipped word entrance for section and article headings; reduced-motion fallback |
| `src/components/sections/ConstellationHero.tsx` | Original hero preserved for comparison via `/?constellation` |
| `src/portrait.css` | Site palette, portrait composition, paper layouts, reading prose, forms and motion rules |
| `public/portraits/macs-cutout.png` | Transparent foreground prepared from IMG_6721; provenance and prompt in public/portraits/README.md |

Structured content lives in JSON; edit the corresponding file to change it.
Section headings, descriptions, navigation labels, and form labels/messages
currently live in components. Edit those strings in place; extracting them
into JSON is optional, not a prerequisite for a copy change. Add new structured
content to JSON and its types to `src/data/content.ts`. Change appearance in
the component + `portrait.css`; legacy scene styles remain in `index.css`.

The blog is a historic archive — Macs's LinkedIn posts plus his original
2013–2015 .NET/Nancy-era blog — dated to their original publish dates. Drop a
file into `src/content/posts/` and it's live (`src/data/content.ts` globs the
folder). Name files `yyyy-MM-dd-title.md` — the date prefix keeps the folder
sorted, doubles as the date if frontmatter omits one, and is stripped from the
URL (`/blog/<title>`):

- **`*.md`** — markdown with a `---` frontmatter block, rendered by
  react-markdown into the `.post-prose` styles in `index.css`.
- **`*.html`** — standalone interactive/immersive posts; frontmatter lives in
  a leading `<!-- -->` comment. `BlogPost.tsx` renders them in a transparent,
  auto-resizing iframe with no outer card or shadow. Fragments receive the
  shared `portrait.css` stylesheet, including local fonts with deployment-safe
  URLs, alongside the legacy Signal Deck tokens. New posts use `--portrait-*`,
  `var(--portrait-font)` and `var(--portrait-body)` to match the paper sheet.
  Full documents (real `<html>` tag) are used verbatim.
  Give the post one reading-width container (e.g. `max-width: 65ch`) so prose,
  figures and interactive examples align; avoid extra outer padding or
  independent paragraph widths that leave diagrams wider than the text.
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

**Original constellation scene notes (`/?constellation`):**
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

## Design system — portrait and paper

The site uses the photograph’s greys, dark ink, Ledger/Aurelia headings and Inter body text, scoped
through `--portrait-*` in `src/portrait.css`. Base colours: backdrop `#c6cac5`,
paper `#f0f1ec`, ink `#252c2c`, muted text `#59625f`, rules `#b5bcb6`, links
`#364e60`. Use open layouts, readable line lengths and quiet rules, with solid
ink booking buttons. Headings use the available content width; do not add narrow
character-width caps to section, article or podcast titles. Keep reading-width
limits on long body paragraphs instead. Short page introductions and article
excerpts also use the available content width. Avoid glowing cards, uppercase dashboard labels and section
accent colours. Each page follows its content: career disclosures, filterable talks,
linked podcast conversations, an About essay with principles, or a simple form.
Heading trials are controlled by `--portrait-font` in `src/portrait.css`: use
`Aurelia` (active) or `Ledger`. Both variable WOFF2 files are local in
`public/fonts/`, with their original OFL licences. Use regular weight with relaxed
tracking. Body paragraphs and navigation/form controls stay in Inter, including
the About introduction. The name’s glyph widths are observed so changing the
family preserves its uniform-scale masthead transition. CSS font URLs are handled
by Vite and rewritten for the configured deployment base.

Structured content stays in the existing JSON files. Social profile URLs live in
`profile.json` under `socials` (typed by `Profile` in `src/data/content.ts`).
`SocialLinks` in `PaperPage.tsx` renders LinkedIn, Twitter/X and a quieter GitHub
link in every content footer, including articles. Work ends with a LinkedIn CTA;
other sections retain the speaking CTA, except the booking page itself.

`PaperPage.tsx` provides the shared sheet, heading, page switcher and footer for
Work, Speaking, About, Podcast and Book. Writing uses the same navigation/footer
with its archive layout; articles keep their reading layout. `PaperDisclosure.tsx`
uses buttons with `aria-expanded` and animated labelled regions. Work opens its
first role by default; talk descriptions and original event links expand on demand.
Podcast uses the same quiet underlined selection controls as the talk filters:
Guest appearances contains all existing episodes; My podcast shows Coming soon.
Keep both controls keyboard-accessible and respect reduced motion.

`App.tsx` owns the persistent scene, `LayoutGroup`, route exit/entry coordination,
and `MotionConfig`. `src/hooks/useReducedMotion.ts` subscribes to live OS
preference changes for the scene and all controls; enabling it stops pointer
springs immediately without a reload. The portrait and name stay mounted across
home, all sections and articles. Pointer transforms are spring-damped, mouse-only,
and disabled with reduced motion. Hover previews expand beneath their selected
home menu item and also appear on keyboard focus. Podcast is in the main menu;
Book me to speak is the primary CTA. The employer/role belongs in the Work preview,
without a standalone “currently at” line. Name words retain fixed font/optical
metrics and animate using uniform scale plus position; do not reintroduce
non-uniform shared-layout scaling on typography.

The original Signal Deck tokens in `src/index.css` remain for the optional
constellation scene and standalone HTML posts. Their dark surfaces, per-section
accents and neumorphic shadows are legacy styling, not guidance for new pages.
Do not remove these tokens without checking the interactive blog iframe styles.
The FormSubmit transport, honeypot, validation and body-level success check must
remain intact when changing the booking layout. Test submission states with
intercepted responses, without sending real enquiries.

## Development workflow

```bash
npm install
npm run dev      # hot-reload dev server (vite)
npm run build    # production build → dist/  (this is the real gate)
npm run lint     # eslint
```

**`npm run build` is the required production build gate, but Vite does not
type-check.** For TypeScript changes, also run `npx tsc --noEmit` and compare
its diagnostics before and after the change; fix any newly introduced errors.
Known baseline diagnostics are TS6133 for unused React imports (automatic JSX
runtime) and TS7016 for the missing declaration for `src/useScreenInit.js`.
Do not dismiss other diagnostics as baseline noise.

### Verifying changes visually (do this for any UI change)

Start the dev server on an explicit unused port, e.g.
`npm run dev -- --port 5219 --strictPort`. Use the server for this checkout.

Every state is deep-linkable: `/about`, `/speaking`, `/work`, `/writing`,
`/podcast`, `/book` and `/blog/atomic-team-design`. Legacy `?mp_screen=<id>`
links redirect to their canonical section routes. Trailing section slashes are
canonicalized; unknown paths return to home. `/?constellation` retains the
original WebGL homepage for comparison; wait about 4.5s for its lazy assets.

All content routes scroll inside `.portrait-page`, not the window or a dialog.
Capture successive viewports of that element and inspect every screenshot:

```js
await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto('http://localhost:5219/work');
await page.waitForTimeout(1600);
const scroller = page.locator('.portrait-page');
let frame = 0;
while (true) {
  await page.screenshot({ path: `/tmp/work-${frame++}.png` });
  const atBottom = await scroller.evaluate(el =>
    el.scrollTop + el.clientHeight >= el.scrollHeight - 1);
  if (atBottom) break;
  await scroller.evaluate(el => { el.scrollTop += el.clientHeight * 0.7; });
  await page.waitForTimeout(400);
}
```

Check home → every section → home, the page switcher, Writing → article → Writing,
browser back/forward, refreshed deep links and Escape (articles to Writing, other
sections to home). Check keyboard disclosure controls, every Speaking filter,
booking validation and mocked success/failure/retry, and unchanged content links.
Verify 320px, phone, tablet and desktop layouts and reduced motion; mobile crops
must keep the face, name and navigation legible. Short phones use a scrolling
menu above the fixed booking CTA, with non-shrinking destination rows. Prefix portrait asset URLs with
`import.meta.env.BASE_URL`. The legacy 3D nav stars drift constantly, so use
Playwright `{ force: true }` if testing them.

## Git & PR conventions

- **Never commit straight to `main`.** Branch first
  (`redesign/…`, `feat/…`, `fix/…`), commit, push, open a PR against `main`.
- Use attribution for the tool that actually contributed. For Codex, end
  commit messages with:
  `Co-Authored-By: Codex <noreply@openai.com>`
  and PR bodies with the exact line `Generated with Codex.`
  For Claude Code, use:
  `Co-Authored-By: Claude <noreply@anthropic.com>`
  and `Generated with Claude Code.` Do not invent model names or versions.
- **Merging to `main` auto-deploys** to GitHub Pages
  (`.github/workflows/deploy.yml`). Make sure `npm run build` passes and the
  change is visually verified before merging.

## Keeping this file current

**Update `AGENTS.md` and the matching guidance in `CLAUDE.md` as the final
step of any substantive change** — when you add/rename a key file, change the
design tokens or the Signal Deck system, alter the build/verify workflow, or
change the git/deploy process, edit the relevant sections in the same PR.
Keep shared instructions consistent between the two files.
