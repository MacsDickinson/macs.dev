import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRightIcon } from 'lucide-react';
import { format } from 'date-fns';
import { SectionHeader } from '../SectionHeader';
import { Reveal } from '../Reveal';
import { BLOG_POSTS } from '../../data/content';
export function Writing() {
  return (
    <section
      id="writing"
      className="scroll-mt-20 border-t border-[var(--line)]">
      
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-24 md:py-32">
        <SectionHeader
          index="04"
          label="Writing"
          title={
          <>
              Notes on <span className="italic">the craft</span>.
            </>
          }
          description="Longer thoughts on leadership, org design and building software where being wrong is expensive." />
        

        <div className="grid md:grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)]">
          {BLOG_POSTS.map((post, i) =>
          <Reveal key={post.slug} delay={i * 0.06}>
              <Link
              to={`/blog/${post.slug}`}
              className="group flex flex-col h-full bg-[var(--paper)] p-8 hover:bg-[var(--paper-alt)] transition-colors">
              
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--accent)]">
                    {post.tag}
                  </span>
                  <ArrowUpRightIcon className="h-4 w-4 text-[var(--ink-soft)] group-hover:text-[var(--ink)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-light leading-snug text-[var(--ink)]">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm text-[var(--ink-soft)] leading-relaxed flex-1">
                  {post.excerpt}
                </p>
                <p className="mt-6 font-mono text-xs text-[var(--ink-soft)]">
                  {format(new Date(post.date), 'dd MMM yyyy')} ·{' '}
                  {post.readingTime}
                </p>
              </Link>
            </Reveal>
          )}
        </div>
      </div>
    </section>);

}