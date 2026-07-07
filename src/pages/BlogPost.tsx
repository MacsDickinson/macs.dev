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
      <div className="h-full w-full overflow-y-auto bg-[var(--paper)] flex flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="font-display text-4xl text-[var(--ink)]">
          Post not found
        </p>
        <Link
          to="/"
          className="font-mono text-xs uppercase tracking-[0.15em] border-b border-[var(--ink)] pb-1 hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors">
          
          Back home
        </Link>
      </div>);

  }
  const more = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);
  return (
    <div className="h-full w-full overflow-y-auto bg-[var(--paper)]">
      <div className="mx-auto max-w-3xl px-6 md:px-10 pt-16 pb-24">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors">
          
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
          className="mt-12">
          
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.15em] text-[var(--ink-soft)]">
            <span className="text-[var(--accent)]">{post.tag}</span>
            <span>·</span>
            <span>{format(new Date(post.date), 'dd MMM yyyy')}</span>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>

          <h1 className="mt-6 font-display text-4xl md:text-6xl font-light leading-[1] tracking-tight text-[var(--ink)]">
            {post.title}
          </h1>

          <p className="mt-8 text-xl md:text-2xl font-display font-light leading-relaxed text-[var(--ink-soft)]">
            {post.excerpt}
          </p>

          <div className="mt-10 h-px bg-[var(--line)]" />

          <div className="mt-10 space-y-6">
            {post.body.map((para, i) =>
            <p key={i} className="text-lg leading-relaxed text-[var(--ink)]">
                {para}
              </p>
            )}
          </div>

          <div className="mt-14 border-t border-[var(--line)] pt-6 font-mono text-xs uppercase tracking-[0.15em] text-[var(--ink-soft)]">
            Written by {PROFILE.name}
          </div>
        </motion.article>

        {more.length > 0 &&
        <div className="mt-20">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)] mb-6">
              Keep reading
            </p>
            <div className="grid sm:grid-cols-2 gap-px bg-[var(--line)] border border-[var(--line)]">
              {more.map((p) =>
            <Link
              key={p.slug}
              to={`/blog/${p.slug}`}
              className="group bg-[var(--paper)] p-6 hover:bg-[var(--paper-alt)] transition-colors">
              
                  <span className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--accent)]">
                    {p.tag}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-light text-[var(--ink)] leading-snug">
                    {p.title}
                  </h3>
                </Link>
            )}
            </div>
          </div>
        }
      </div>
      <Footer />
    </div>);

}