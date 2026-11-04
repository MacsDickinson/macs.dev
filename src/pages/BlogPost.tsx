import { useReducedMotion } from '../hooks/useReducedMotion';
import { SocialLinks } from '../components/PaperPage';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ReadingTitle } from '../components/ReadingTitle';
import { BLOG_POSTS, PROFILE } from '../data/content';
import type { BlogPost as Post } from '../data/content';
import portraitFrameStyles from '../portrait.css?inline';

// ---------------------------------------------------------------------------
// HTML posts render inside an iframe so their scripts run in isolation.
// Fragments get the portrait stylesheet (including deployment-safe local fonts)
// plus legacy Signal Deck tokens for existing posts.
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
  return `<!doctype html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />${POST_FRAME_THEME}<style>${portraitFrameStyles}</style></head><body>${content}${RESIZE_SCRIPT}</body></html>`;
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
      className="block w-full border-0 bg-transparent"
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
  const reduced = useReducedMotion();
  const { slug } = useParams<{
    slug: string;
  }>();
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  if (!post) return <main className="portrait-page"><div className="portrait-page-inner"><ReadingTitle>Post not found.</ReadingTitle><Link to="/writing">All writing</Link></div></main>;
  const more = BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 2);
  return <motion.main key={post.slug} className="portrait-page" initial={{ opacity: 0, y: reduced ? 0 : 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -20 }} transition={{ duration: reduced ? 0 : .4 }}>
    <div className="portrait-page-inner">
      <nav className="portrait-page-navigation" aria-label="Reading navigation"><Link to="/writing">All writing</Link><Link to="/">Home</Link></nav>
      <article>
        <header className="portrait-article-heading"><ReadingTitle>{post.title}</ReadingTitle><div className="portrait-article-meta"><span>{post.tag}</span><time dateTime={post.date}>{format(new Date(post.date), 'dd MMM yyyy')}</time><span>{post.readingTime}</span></div>{post.excerpt && <p className="portrait-article-excerpt">{post.excerpt}</p>}</header>
        {post.kind === 'html' ? <div className="mt-12"><HtmlPostFrame post={post} /></div> : <div className="portrait-prose"><Markdown remarkPlugins={[remarkGfm]} components={MD_COMPONENTS}>{post.content}</Markdown></div>}
        <div className="portrait-byline"><p>Written by {PROFILE.name}</p>{post.linkedin && <a href={post.linkedin} target="_blank" rel="noreferrer">Originally posted on LinkedIn</a>}</div>
      </article>
      <aside className="portrait-more"><h2>Keep reading</h2>{more.map(p => <Link key={p.slug} to={`/blog/${p.slug}`}>{p.title}</Link>)}</aside>
      <footer><div className="portrait-reading-footer"><Link to="/writing">All writing</Link><Link to="/">Back home</Link></div><SocialLinks /></footer>
    </div>
  </motion.main>;
}
