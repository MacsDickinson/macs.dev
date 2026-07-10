import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from 'lucide-react';
import { format } from 'date-fns';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Footer } from '../components/Footer';
import { BLOG_POSTS, PROFILE } from '../data/content';
import type { BlogPost as Post } from '../data/content';

// ---------------------------------------------------------------------------
// HTML posts render inside an iframe so their scripts run in isolation.
// Fragments get wrapped in the site's design tokens + fonts so authors can
// use var(--surface), var(--ac), .font-display etc. and stay on-language;
// full documents (containing an <html> tag) are used verbatim. Either way a
// resize script is injected so the frame always matches its content height.
// ---------------------------------------------------------------------------

const RESIZE_SCRIPT = `<script>(function () {
  // Measure the body, not documentElement — the latter never reports smaller
  // than the iframe viewport, so the frame could grow but never shrink.
  var send = function () {
    var height = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight
    );
    parent.postMessage({ type: 'macs-post-height', height: height }, '*');
  };
  new ResizeObserver(send).observe(document.body);
  window.addEventListener('load', send);
  send();
})();</${'script'}>`;

// Mirror of the Signal Deck tokens in src/index.css — keep in sync.
const POST_FRAME_THEME = `<style>
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
  :root {
    --ground: #0b0e13; --surface: #161b22; --surface-hi: #1b212b;
    --surface-sunken: #0a0d12; --edge: #2a3140; --edge-soft: #20262f;
    --text: #eaedf3; --text-soft: #9aa3b4; --text-dim: #6b7484;
    --field: #0e1116; --electric: #6c5ce7; --signal: #00b894;
    --accent: #ff5a2c; --dim: #8a93a6; --ac: var(--signal);
    --nm-raise: -6px -6px 14px rgba(255,255,255,0.028), 8px 10px 22px rgba(0,0,0,0.62);
    --nm-inset: inset 5px 6px 14px rgba(0,0,0,0.6), inset -4px -5px 12px rgba(255,255,255,0.022);
    --nm-flat: -3px -3px 8px rgba(255,255,255,0.02), 4px 5px 12px rgba(0,0,0,0.5);
  }
  html, body { margin: 0; background: transparent; }
  body {
    color: var(--text);
    font-family: 'Inter', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .font-display { font-family: 'Fraunces', Georgia, serif; }
  .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
</style>`;

function buildHtmlPostDoc(content: string): string {
  // Full-document detection must ignore <html> mentioned inside comments
  // (e.g. authoring notes) — only real markup counts.
  const withoutComments = content.replace(/<!--[\s\S]*?-->/g, '');
  if (/<html[\s>]/i.test(withoutComments)) {
    return content.includes('</body>') ?
    content.replace('</body>', `${RESIZE_SCRIPT}</body>`) :
    content + RESIZE_SCRIPT;
  }
  return `<!doctype html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />${POST_FRAME_THEME}</head><body>${content}${RESIZE_SCRIPT}</body></html>`;
}

function HtmlPostFrame({ post }: {post: Post;}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(480);
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (
      e.source === frameRef.current?.contentWindow &&
      e.data?.type === 'macs-post-height' &&
      typeof e.data.height === 'number')
      {
        setHeight(Math.ceil(e.data.height));
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);
  const srcDoc = useMemo(() => buildHtmlPostDoc(post.content), [post.content]);
  return (
    <iframe
      ref={frameRef}
      srcDoc={srcDoc}
      title={post.title}
      className="w-full border-0 rounded-2xl bg-[var(--surface)] shadow-[var(--nm-raise-lg)]"
      style={{ height }} />);


}

// Root-relative asset URLs (e.g. `/img/foo.png` in a markdown post) must be
// prefixed with Vite's base — GitHub Pages serves the site from `/macs.dev/`,
// where a bare `/img/...` would 404. Only string URLs need this; imported
// assets are already rewritten by Vite.
const withBase = (src?: string) =>
src && src.startsWith('/') ?
`${import.meta.env.BASE_URL.replace(/\/$/, '')}${src}` :
src;

const MD_COMPONENTS = {
  img: ({ src, alt, ...rest }: React.ImgHTMLAttributes<HTMLImageElement>) =>
  <img src={withBase(typeof src === 'string' ? src : undefined)} alt={alt ?? ''} loading="lazy" {...rest} />

};

export function BlogPost() {
  const { slug } = useParams<{
    slug: string;
  }>();
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  if (!post) {
    return (
      <div
        className="h-full w-full overflow-y-auto bg-[var(--ground)] text-[var(--text)] flex flex-col items-center justify-center gap-6 px-6 text-center"
        style={{ ['--ac' as string]: 'var(--signal)' }}>
        <p className="font-display text-4xl text-[var(--text)]">
          Post not found
        </p>
        <Link
          to="/"
          className="font-mono text-xs uppercase tracking-[0.15em] border-b border-[var(--ac)] pb-1 text-[var(--text)] hover:text-[var(--ac)] transition-colors">

          Back home
        </Link>
      </div>);

  }
  const more = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);
  const isHtml = post.kind === 'html';
  const byline =
  <div className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[var(--edge-soft)] pt-6 font-mono text-xs uppercase tracking-[0.15em] text-[var(--text-dim)]">
      <span>
        Written by {PROFILE.name} ·{' '}
        {format(new Date(post.date), 'dd MMM yyyy')}
      </span>
      {post.linkedin &&
    <a
      href={post.linkedin}
      target="_blank"
      rel="noreferrer"
      className="text-[var(--text-soft)] border-b border-[var(--edge)] pb-0.5 hover:text-[var(--ac)] hover:border-[var(--ac)] transition-colors">

          Originally posted on LinkedIn
        </a>
    }
    </div>;

  const heading =
  <>
      <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.15em] text-[var(--text-soft)]">
        <span className="text-[var(--ac)]">{post.tag}</span>
        <span>·</span>
        <span>{format(new Date(post.date), 'dd MMM yyyy')}</span>
        <span>·</span>
        <span>{post.readingTime}</span>
      </div>

      <h1 className="mt-6 font-display text-4xl md:text-6xl font-light leading-[1] tracking-tight text-[var(--text)] [font-variation-settings:'opsz'_144]">
        {post.title}
      </h1>

      {post.excerpt &&
    <p className="mt-8 font-display text-xl md:text-2xl font-light italic leading-relaxed text-[var(--text-soft)]">
          {post.excerpt}
        </p>
    }
    </>;

  return (
    <div
      className="relative h-full w-full overflow-y-auto bg-[var(--ground)] text-[var(--text)]"
      style={{ ['--ac' as string]: 'var(--signal)' }}>

      {/* Atmosphere — same instrument-deck world as the sections */}
      <div className="pointer-events-none fixed inset-0 z-0 deck-grid" aria-hidden="true" />
      <div className="pointer-events-none fixed inset-0 z-0 deck-scan" aria-hidden="true" />
      <div className="pointer-events-none fixed inset-0 z-0 deck-grain" aria-hidden="true" />

      <div className="relative z-10">
        <div
          className={`mx-auto ${
          isHtml ? 'max-w-5xl' : 'max-w-3xl'} px-6 md:px-10 pt-16 pb-24`
          }>
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-[var(--text-soft)] hover:text-[var(--text)] transition-colors">

            <ArrowLeftIcon className="h-4 w-4" />
            All writing
          </Link>

          <motion.article
            initial={{
              opacity: 0,
              y: 24
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="mt-10">

            {isHtml ?
            // Interactive post: header floats on the deck, the piece itself
            // gets the full column width inside its own raised panel.
            <>
                <div className="max-w-3xl">{heading}</div>
                <div className="mt-10">
                  <HtmlPostFrame post={post} />
                </div>
                <div className="max-w-3xl">{byline}</div>
              </> :

            <div className="rounded-3xl bg-[var(--surface)] p-8 shadow-[var(--nm-raise-lg)] md:p-12 lg:p-16">
                {heading}
                <div className="mt-10 h-px bg-[var(--edge-soft)]" />
                <div className="post-prose mt-10">
                  <Markdown remarkPlugins={[remarkGfm]} components={MD_COMPONENTS}>
                    {post.content}
                  </Markdown>
                </div>
                {byline}
              </div>
            }
          </motion.article>

          {more.length > 0 &&
          <div className="mt-20">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-soft)] mb-6">
                Keep reading
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
                {more.map((p) =>
              <Link
                key={p.slug}
                to={`/blog/${p.slug}`}
                className="group rounded-2xl bg-[var(--surface)] p-6 no-underline shadow-[var(--nm-raise)] transition-[transform,box-shadow] duration-300 [transition-timing-function:cubic-bezier(.2,.8,.25,1)] hover:-translate-y-1.5 hover:shadow-[var(--nm-hover)]">

                    <span className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--ac)]">
                      {p.tag}
                    </span>
                    <h3 className="mt-3 font-display text-xl font-light leading-snug text-[var(--text)]">
                      {p.title}
                    </h3>
                  </Link>
              )}
              </div>
            </div>
          }
        </div>
        <Footer />
      </div>
    </div>);

}
