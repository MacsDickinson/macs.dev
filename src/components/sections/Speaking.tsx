import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '../SectionHeader';
import { Reveal } from '../Reveal';
import { TALKS, type Talk } from '../../data/content';
const typeStyles: Record<Talk['type'], string> = {
  Talk: 'text-[var(--accent)]',
  Workshop: 'text-[var(--ink)]',
  Podcast: 'text-[var(--ink-soft)]',
  Panel: 'text-[var(--ink)]'
};
export function Speaking({ onBook }: {onBook: () => void;}) {
  return (
    <section
      id="speaking"
      className="scroll-mt-20 border-t border-[var(--line)] bg-[var(--paper-alt)]">
      
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-24 md:py-32">
        <SectionHeader
          index="02"
          label="Speaking"
          title={
          <>
              Talks, workshops <span className="italic">&amp; stages</span>.
            </>
          }
          description="Sharing insights on engineering leadership, team scaling, and adopting AI safely — at conferences, internal summits, and on podcasts." />
        

        <div className="border-t border-[var(--ink)]/15">
          {TALKS.map((talk, i) =>
          <Reveal key={talk.title + i}>
              <article className="group grid md:grid-cols-12 gap-4 md:gap-8 py-8 border-b border-[var(--line)] hover:bg-[var(--paper)] transition-colors -mx-4 px-4">
                <div className="md:col-span-2 flex items-center gap-3">
                  <span
                  className={`font-mono text-xs uppercase tracking-[0.15em] ${typeStyles[talk.type]}`}>
                  
                    {talk.type}
                  </span>
                  {talk.upcoming &&
                <span className="font-mono text-[10px] uppercase tracking-widest bg-[var(--accent)] text-[var(--field)] px-1.5 py-0.5">
                      Upcoming
                    </span>
                }
                </div>
                <div className="md:col-span-7">
                  <h3 className="font-display text-xl md:text-2xl font-light text-[var(--ink)] leading-snug">
                    {talk.link ?
                    <a
                      href={talk.link}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[var(--accent)] transition-colors">
                        {talk.title}
                      </a> :
                    talk.title
                    }
                  </h3>
                  <p className="mt-2 text-sm text-[var(--ink-soft)]">
                    {talk.description}
                  </p>
                </div>
                <div className="md:col-span-3 md:text-right">
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--ink)]">
                    {talk.venue}
                  </p>
                  <p className="mt-1 font-mono text-xs text-[var(--ink-soft)]">
                    {talk.date}
                  </p>
                </div>
              </article>
            </Reveal>
          )}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-wrap items-center gap-6">
            <button
              onClick={onBook}
              className="inline-flex items-center gap-3 bg-[var(--ink)] text-[var(--paper)] px-7 py-4 font-mono text-xs uppercase tracking-[0.15em] hover:bg-[var(--accent)] hover:text-[var(--field)] transition-colors">
              
              Invite me to your event
            </button>
            <p className="font-mono text-xs text-[var(--ink-soft)] max-w-xs">
              Keynotes, panels, workshops and podcast guest spots — remote or in
              person.
            </p>
          </div>
        </Reveal>
      </div>
    </section>);

}