import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRightIcon } from 'lucide-react';
import { format } from 'date-fns';
import { SectionHeader } from '../SectionHeader';
import { Reveal } from '../Reveal';
import { BLOG_POSTS } from '../../data/content';

export function Writing() {
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
          description="Longer thoughts on leadership, org design and building software where being wrong is expensive." />


        <div className="grid gap-5 md:grid-cols-3">
          {BLOG_POSTS.map((post, i) =>
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
      </div>
    </section>);

}
