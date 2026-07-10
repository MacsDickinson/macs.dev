import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRightIcon } from 'lucide-react';
import { format } from 'date-fns';
import { SectionHeader } from '../SectionHeader';
import { Reveal } from '../Reveal';
import { BLOG_POSTS } from '../../data/content';

export function Writing() {
  const featured = BLOG_POSTS.filter((post) => post.featured);
  const archive = BLOG_POSTS.filter((post) => !post.featured);
  return (
    <section id="writing" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-24 md:py-32">
        <SectionHeader
          index="04"
          label="Writing"
          title={
          <>
              Notes on <span className="italic text-[var(--ac)]">the craft</span>.
            </>
          }
          description="Longer thoughts on leadership, org design and building software where being wrong is expensive. Most started life as LinkedIn posts, dated to when they were first published." />


        <div className="grid gap-5 md:grid-cols-3">
          {featured.map((post, i) =>
          <Reveal key={post.slug} delay={i * 0.06}>
              <Link
              to={`/blog/${post.slug}`}
              className="group relative flex h-full flex-col rounded-2xl bg-[var(--surface)] p-7 no-underline shadow-[var(--nm-raise)] transition-[transform,box-shadow] duration-300 [transition-timing-function:cubic-bezier(.2,.8,.25,1)] hover:-translate-y-1.5 hover:shadow-[var(--nm-hover)]">

                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--ac)]">
                  {post.tag}
                </span>
                <ArrowUpRightIcon className="absolute right-6 top-6 h-4 w-4 text-[var(--text-soft)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--ac)]" />
                <h3 className="mt-5 font-display text-2xl font-light leading-snug text-[var(--text)]">
                  {post.title}
                </h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-[var(--text-soft)]">
                  {post.excerpt}
                </p>
                <p className="mt-6 font-mono text-[10.5px] uppercase tracking-[0.06em] text-[var(--text-dim)]">
                  {format(new Date(post.date), 'dd MMM yyyy')} · {post.readingTime}
                </p>
              </Link>
            </Reveal>
          )}
        </div>

        {/* The rest of the archive, newest first — a historic blog, so the
            publish date leads each row. */}
        {archive.length > 0 &&
        <div className="mt-16">
            <Reveal>
              <div className="mb-6 flex items-center gap-4">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-soft)]">
                  All posts
                </span>
                <span className="h-px flex-1 bg-[var(--edge-soft)]" />
              </div>
            </Reveal>
            <div className="flex flex-col">
              {archive.map((post) =>
            <Reveal key={post.slug}>
                  <Link
                to={`/blog/${post.slug}`}
                className="group relative grid grid-cols-1 md:grid-cols-[130px_1fr_auto] items-baseline gap-1 md:gap-6 rounded-2xl px-4 py-5 md:px-5 no-underline border-t border-[var(--edge-soft)] first:border-t-0 transition-[background,box-shadow,transform] duration-300 hover:border-transparent hover:bg-[var(--surface)] hover:shadow-[var(--nm-raise)] md:hover:translate-x-1">

                    <span className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--ac)]">
                      {format(new Date(post.date), 'dd MMM yyyy')}
                    </span>
                    <h3 className="font-display text-xl md:text-2xl font-light leading-snug tracking-tight text-[var(--text)]">
                      {post.title}
                    </h3>
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--text-dim)] md:text-right">
                      {post.tag} · {post.readingTime}
                    </span>
                  </Link>
                </Reveal>
            )}
            </div>
          </div>
        }
      </div>
    </section>);

}
