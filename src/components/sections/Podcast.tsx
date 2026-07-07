import React from 'react';
import { PlayIcon } from 'lucide-react';
import { SectionHeader } from '../SectionHeader';
import { Reveal } from '../Reveal';
import { PODCASTS } from '../../data/content';
export function Podcast() {
  return (
    <section
      id="podcast"
      className="scroll-mt-20 border-t border-[var(--line)] bg-[var(--paper-alt)]">
      
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-24 md:py-32">
        <SectionHeader
          index="05"
          label="Podcast"
          title={
          <>
              On the <span className="italic">airwaves</span>.
            </>
          }
          description="Recent conversations on engineering leadership, AI adoption and doing this work sustainably." />
        

        <div className="grid gap-px bg-[var(--line)] border border-[var(--line)]">
          {PODCASTS.map((ep, i) =>
          <Reveal key={ep.slug ?? ep.number ?? ep.title} delay={i * 0.05}>
              <article className="group flex flex-col sm:flex-row sm:items-center gap-5 bg-[var(--paper)] p-6 md:p-8 hover:bg-[var(--paper-alt)] transition-colors">
                <div className="flex items-center gap-5">
                  {ep.number &&
                <span className="font-display text-4xl font-light text-[var(--line)] group-hover:text-[var(--accent)] transition-colors">
                      {ep.number}
                    </span>
                }
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--ink)] text-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)] transition-colors">
                    <PlayIcon className="h-4 w-4 fill-current" />
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl md:text-2xl font-light text-[var(--ink)]">
                    {ep.link ?
                  <a
                    href={ep.link}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[var(--accent)] transition-colors">
                        {ep.title}
                      </a> :
                  ep.title
                  }
                  </h3>
                  <p className="mt-1 text-sm text-[var(--ink-soft)]">
                    {ep.description}
                  </p>
                </div>
                <div className="sm:text-right sm:pl-6">
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--ink)]">
                    {ep.show}
                  </p>
                  <p className="mt-1 font-mono text-xs text-[var(--ink-soft)]">
                    {ep.date}{ep.duration ? ` · ${ep.duration}` : ''}
                  </p>
                </div>
              </article>
            </Reveal>
          )}
        </div>
      </div>
    </section>);

}