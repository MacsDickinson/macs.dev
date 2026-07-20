// Typed loader for the site's content. All copy lives in plain JSON files
// under `src/content/` — edit those to change the site, no code required.
//
//   src/content/profile.json     → who you are, contact, "ask me about" topics
//   src/content/principles.json  → the principles grid in About
//   src/content/talks.json       → talks / workshops / podcast appearances
//   src/content/work.json        → work history
//   src/content/podcasts.json    → podcast episodes
//   src/content/posts/*.json     → one file per blog post (sorted by date)

import profileJson from '../content/profile.json';
import principlesJson from '../content/principles.json';
import talksJson from '../content/talks.json';
import workJson from '../content/work.json';
import podcastsJson from '../content/podcasts.json';

export type Talk = {
  type: 'Talk' | 'Workshop' | 'Podcast' | 'Panel';
  title: string;
  venue: string;
  date: string;
  description: string;
  upcoming?: boolean;
  slug?: string;
  link?: string;
};

export type Principle = {
  title: string;
  body: string;
};

export type WorkRole = {
  period: string;
  role: string;
  company: string;
  description: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  tag: string;
  featured?: boolean; // pinned to the featured cards at the top of Writing
  linkedin?: string; // original LinkedIn post, when the piece started life there
  kind: 'markdown' | 'html';
  content: string; // markdown source, or the html document/fragment
};

export type PodcastEpisode = {
  title: string;
  show: string;
  date: string;
  description: string;
  number?: string;
  duration?: string;
  slug?: string;
  link?: string;
};

export type Profile = {
  name: string;
  role: string;
  company: string;
  tagline: string;
  intro: string;
  previously: string[];
  email: string;
  location: string;
  askMeAbout: string[];
};

export const PROFILE: Profile = profileJson;
export const ASK_ME_ABOUT: string[] = profileJson.askMeAbout;
export const PRINCIPLES: Principle[] = principlesJson;
export const TALKS: Talk[] = talksJson as Talk[];
export const WORK: WorkRole[] = workJson;
export const PODCASTS: PodcastEpisode[] = podcastsJson;

// ---------------------------------------------------------------------------
// Blog posts. Each post is its own file in `src/content/posts/` — drop one in
// and it appears on the site, newest first. Two formats:
//
//   *.md    — markdown with a `---` YAML-style frontmatter block
//   *.html  — a standalone interactive post; frontmatter lives in a leading
//             `<!-- ... -->` comment. Fragments are wrapped in the site's
//             design tokens; full documents (with an <html> tag) are used
//             verbatim. Rendered in a sandboxed-by-structure iframe by
//             BlogPost.tsx.
//
// Files starting with `_` (e.g. `_template.md`) are authoring templates and
// are skipped. Frontmatter fields: title, excerpt, date (YYYY-MM-DD), tag,
// and optionally featured, linkedin, readingTime (computed if omitted).
// ---------------------------------------------------------------------------

type PostMeta = Record<string, string | boolean>;

// Parses simple `key: value` lines. Values may be bare or quoted; `true` and
// `false` become booleans. Deliberately not full YAML — keep frontmatter flat.
function parseMeta(block: string): PostMeta {
  const meta: PostMeta = {};
  for (const line of block.split('\n')) {
    const match = line.match(/^(\w+):\s*(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'")))

    value = value.slice(1, -1);
    meta[match[1]] = value === 'true' ? true : value === 'false' ? false : value;
  }
  return meta;
}

function estimateReadingTime(text: string): string {
  const plain = text.
  replace(/<[^>]+>/g, ' ') // html tags
  .replace(/[#>*`_[\]()!-]/g, ' '); // markdown punctuation
  const words = plain.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}

// Post files are named `yyyy-MM-dd-title.md` for easy sorting on disk. The
// date prefix stays out of the URL: `2026-03-07-feedback-loops.md` publishes
// at `/blog/feedback-loops`. It also acts as the date if frontmatter omits one.
function fileParts(path: string): {slug: string;fileDate?: string;} {
  const name = (path.split('/').pop() ?? path).replace(/\.(md|html)$/, '');
  const match = name.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
  return match ?
  { slug: match[2], fileDate: match[1] } :
  { slug: name };
}

function toPost(path: string, raw: string, kind: BlogPost['kind']): BlogPost | null {
  const { slug, fileDate } = fileParts(path);
  if (slug.startsWith('_')) return null; // authoring templates
  let meta: PostMeta = {};
  let content = raw;
  if (kind === 'markdown') {
    const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
    if (match) {
      meta = parseMeta(match[1]);
      content = raw.slice(match[0].length);
    }
  } else {
    const match = raw.match(/^\s*<!--([\s\S]*?)-->\s*/);
    if (match) {
      meta = parseMeta(match[1]);
      content = raw.slice(match[0].length);
    }
  }
  if (meta.draft === true) return null; // unpublished drafts stay off the site
  return {
    slug,
    title: String(meta.title ?? slug),
    excerpt: String(meta.excerpt ?? ''),
    date: String(meta.date ?? fileDate ?? ''),
    readingTime: String(meta.readingTime ?? estimateReadingTime(content)),
    tag: String(meta.tag ?? 'Notes'),
    featured: meta.featured === true,
    linkedin: typeof meta.linkedin === 'string' ? meta.linkedin : undefined,
    kind,
    content
  };
}

const mdModules = import.meta.glob<string>('../content/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
});
const htmlModules = import.meta.glob<string>('../content/posts/*.html', {
  eager: true,
  query: '?raw',
  import: 'default'
});

export const BLOG_POSTS: BlogPost[] = [
...Object.entries(mdModules).map(([path, raw]) =>
toPost(path, raw, 'markdown')
),
...Object.entries(htmlModules).map(([path, raw]) => toPost(path, raw, 'html'))].

filter((post): post is BlogPost => post !== null).
sort((a, b) => b.date.localeCompare(a.date));
