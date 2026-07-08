import React from 'react';
import { PlayIcon } from 'lucide-react';
import { SectionHeader } from '../SectionHeader';
import { Reveal } from '../Reveal';
import { PODCASTS } from '../../data/content';

const Waveform = () =>
<div className="mt-2 flex h-4 items-end justify-end gap-[3px] opacity-40 transition-opacity duration-300 group-hover:opacity-100">
    {[40, 80, 55, 100, 65].map((h, i) =>
  <span
    key={i}
    className="eq-bar"
    style={{ height: `${h}%`, animationDelay: `${i * 0.13}s` }} />

  )}
  </div>;

export function Podcast() {
  return (
    <section id="podcast" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-24 md:py-32">
        <SectionHeader
          index="05"
          label="Podcast"
          title={
          <>
              On the <span className="italic text-[var(--ac)]">airwaves</span>.
            </>
          }
          description="Recent conversations on engineering leadership, AI adoption and doing this work sustainably." />


        <div className="flex flex-col gap-4">
          {PODCASTS.map((ep, i) => {
            const Row: React.ElementType = ep.link ? 'a' : 'div';
            return (
              <Reveal key={ep.slug ?? ep.number ?? ep.title} delay={i * 0.05}>
                <Row
                  {...(ep.link ?
                  { href: ep.link, target: '_blank', rel: 'noreferrer' } :
                  {})}
                  className="group relative grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-6 rounded-2xl bg-[var(--surface)] p-5 md:p-6 no-underline text-[var(--text)] shadow-[var(--nm-raise)] transition-[transform,box-shadow] duration-300 [transition-timing-function:cubic-bezier(.2,.8,.25,1)] hover:-translate-y-1 hover:shadow-[var(--nm-hover)] active:translate-y-0 active:shadow-[var(--nm-inset)]">

                  {ep.number &&
                  <span className="pointer-events-none absolute right-6 top-4 hidden font-display text-4xl font-light italic leading-none text-[var(--edge)] transition-colors duration-300 group-hover:text-[color-mix(in_srgb,var(--ac)_55%,var(--edge))] sm:block">
                      {ep.number}
                    </span>
                  }

                  <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[var(--field)] text-[var(--text-soft)] shadow-[var(--nm-flat)] transition-all duration-300 group-hover:bg-[var(--ac)] group-hover:text-[var(--ground)] group-hover:shadow-[0_0_24px_-3px_var(--ac)]">
                    <PlayIcon className="ml-0.5 h-4 w-4 fill-current" />
                  </span>

                  <div className="min-w-0">
                    <h3 className="font-display text-xl md:text-2xl font-light leading-tight tracking-tight text-[var(--text)]">
                      {ep.title}
                    </h3>
                    <p className="mt-1.5 max-w-[62ch] text-sm text-[var(--text-soft)]">
                      {ep.description}
                    </p>
                  </div>

                  <div className="col-span-2 sm:col-span-1 sm:text-right">
                    <p className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text)]">
                      {ep.show}
                    </p>
                    <p className="mt-1 font-mono text-xs text-[var(--text-dim)]">
                      {ep.date}{ep.duration ? ` · ${ep.duration}` : ''}
                    </p>
                    <div className="hidden sm:block"><Waveform /></div>
                  </div>
                </Row>
              </Reveal>);

          })}
        </div>
      </div>
    </section>);

}
