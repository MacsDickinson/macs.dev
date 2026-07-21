// Typed loader for the site's content. All copy lives in plain JSON files
// under `src/content/` — edit those to change the site, no code required.
//
//   src/content/profile.json     → who you are, contact, "ask me about" topics
//   src/content/principles.json  → the principles grid in About
//   src/content/talks.json       → talks / workshops / podcast appearances
//   src/content/work.json        → work history
//   src/content/podcasts.json    → podcast episodes
//
// Blog posts live in `src/data/posts.ts` — a separate module because it
// embeds the full text of every post; it must only be imported from
// lazy-loaded code (Writing, BlogPost), never from the main chunk.

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
