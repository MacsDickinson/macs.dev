import React from 'react';
import { ArrowRightIcon } from 'lucide-react';
import { SectionHeader } from '../SectionHeader';
import { Reveal } from '../Reveal';
import { TALKS } from '../../data/content';

export function Speaking({ onBook }: {onBook: () => void;}) {
  return (
    <section id="speaking" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-24 md:py-32">
        <SectionHeader
          index="02"
          label="Speaking"
          title={
          <>
              Talks, workshops <span className="italic text-[var(--ac)]">&amp; stages</span>.
            </>
          }
          description="Sharing insights on engineering leadership, team scaling, and adopting AI safely — at conferences, internal summits, and on podcasts." />


        <div className="flex flex-col">
          {TALKS.map((talk, i) => {
            const Row: React.ElementType = talk.link ? 'a' : 'div';
            return (
              <Reveal key={talk.title + i}>
                <Row
                  {...(talk.link ?
                  { href: talk.link, target: '_blank', rel: 'noreferrer' } :
                  {})}
                  className="group relative grid grid-cols-1 md:grid-cols-[150px_1fr_auto] items-center gap-2 md:gap-6 rounded-2xl px-4 py-6 md:px-5 no-underline text-[var(--text)] border-t border-[var(--edge-soft)] first:border-t-0 transition-[background,box-shadow,transform] duration-300 hover:border-transparent hover:bg-[var(--surface)] hover:shadow-[var(--nm-raise)] md:hover:translate-x-1">

                  <div className="justify-self-start">
                    <span className="inline-flex items-center rounded-lg bg-[var(--field)] px-2.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--ac)] shadow-[var(--nm-inset)]">
                      {talk.type}
                    </span>
                    {talk.upcoming &&
                    <span className="ml-2 inline-block rounded bg-[var(--ac)] px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--ground)]">
                        Upcoming
                      </span>
                    }
                  </div>

                  <h3 className="font-display text-xl md:text-2xl font-light leading-snug tracking-tight text-[var(--text)]">
                    {talk.title}
                  </h3>

                  <div className="md:text-right">
                    <p className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--text)]">
                      {talk.venue}
                    </p>
                    <p className="mt-1 font-mono text-xs text-[var(--text-dim)]">
                      {talk.date}
                    </p>
                  </div>

                  {talk.link &&
                  <span className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 translate-x-2 text-[var(--ac)] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:block">
                      <ArrowRightIcon className="h-5 w-5" />
                    </span>
                  }
                </Row>
              </Reveal>);

          })}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-wrap items-center gap-6">
            <button
              onClick={onBook}
              className="inline-flex items-center gap-3 rounded-xl bg-[var(--surface)] px-7 py-4 font-mono text-xs uppercase tracking-[0.15em] text-[var(--text)] shadow-[var(--nm-raise)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:text-[var(--ac)] hover:shadow-[var(--nm-hover)] active:translate-y-0 active:shadow-[var(--nm-inset)]">

              Invite me to your event
            </button>
            <p className="max-w-xs font-mono text-xs text-[var(--text-dim)]">
              Keynotes, panels, workshops and podcast guest spots — remote or in
              person.
            </p>
          </div>
        </Reveal>
      </div>
    </section>);

}
