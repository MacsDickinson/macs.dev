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
  type: 'Talk' | 'Workshop' | 'Podcast';
  title: string;
  venue: string;
  date: string;
  description: string;
  upcoming?: boolean;
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
  body: string[];
};

export type PodcastEpisode = {
  number: string;
  title: string;
  show: string;
  date: string;
  duration: string;
  description: string;
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

// Each post is its own file — drop a new JSON file into `src/content/posts/`
// and it appears on the site, newest first.
const postModules = import.meta.glob<BlogPost>('../content/posts/*.json', {
  eager: true,
  import: 'default'
});

export const BLOG_POSTS: BlogPost[] = Object.values(postModules).sort((a, b) =>
b.date.localeCompare(a.date)
);
