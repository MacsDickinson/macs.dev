import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Footer } from '../components/Footer';
import { BLOG_POSTS, PROFILE } from '../data/content';

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
  return (
    <div
      className="relative h-full w-full overflow-y-auto bg-[var(--ground)] text-[var(--text)]"
      style={{ ['--ac' as string]: 'var(--signal)' }}>

      {/* Atmosphere — same instrument-deck world as the sections */}
      <div className="pointer-events-none fixed inset-0 z-0 deck-grid" aria-hidden="true" />
      <div className="pointer-events-none fixed inset-0 z-0 deck-scan" aria-hidden="true" />
      <div className="pointer-events-none fixed inset-0 z-0 deck-grain" aria-hidden="true" />

      <div className="relative z-10">
        <div className="mx-auto max-w-3xl px-6 md:px-10 pt-16 pb-24">
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
            className="mt-10 rounded-3xl bg-[var(--surface)] p-8 shadow-[var(--nm-raise-lg)] md:p-12 lg:p-16">

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

            <p className="mt-8 font-display text-xl md:text-2xl font-light italic leading-relaxed text-[var(--text-soft)]">
              {post.excerpt}
            </p>

            <div className="mt-10 h-px bg-[var(--edge-soft)]" />

            <div className="mt-10 space-y-6">
              {post.body.map((para, i) =>
              <p key={i} className="text-lg leading-relaxed text-[#dfe3ea]">
                  {para}
                </p>
              )}
            </div>

            <div className="mt-14 border-t border-[var(--edge-soft)] pt-6 font-mono text-xs uppercase tracking-[0.15em] text-[var(--text-dim)]">
              Written by {PROFILE.name}
            </div>
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
