import { useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import { ReadingTitle } from './ReadingTitle';
import { PROFILE } from '../data/content';

const pages = [['Writing', '/writing'], ['Work', '/work'], ['Speaking', '/speaking'], ['Podcast', '/podcast'], ['About', '/about'], ['Book me to speak', '/book']];

export function PageNavigation({ label }: { label: string }) {
  return <nav className="portrait-page-navigation" aria-label="Page navigation">
    <Link to="/">Back home</Link>
    <details className="paper-page-menu">
      <summary>{label}<ChevronDown size={14} aria-hidden="true" /></summary>
      <div>{pages.map(([name, path]) => <Link key={path} to={path} aria-current={name === label ? 'page' : undefined}>{name}</Link>)}</div>
    </details>
  </nav>;
}

export function SocialLinks() {
  return <nav className="paper-social-links" aria-label="Social profiles">
    <a href={PROFILE.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
    <a href={PROFILE.socials.twitter} target="_blank" rel="noreferrer">Twitter / X</a>
    <a className="paper-social-secondary" href={PROFILE.socials.github} target="_blank" rel="noreferrer">GitHub</a>
  </nav>;
}

export function PageFooter({ action = 'booking' }: { action?: 'booking' | 'linkedin' | null }) {
  return <footer className="paper-footer">
    {action === 'booking' && <Link className="paper-cta" to="/book">Book me to speak<ArrowUpRight size={18} aria-hidden="true" /></Link>}
    {action === 'linkedin' && <a className="paper-cta" href={PROFILE.socials.linkedin} target="_blank" rel="noreferrer">Find me on LinkedIn<ArrowUpRight size={18} aria-hidden="true" /></a>}
    <div className="portrait-reading-footer"><Link to="/">Back home</Link><a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a></div>
    <SocialLinks />
  </footer>;
}

export function PaperPage({ id, label, title, description, children }: { id: string; label: string; title: string; description?: string; children: ReactNode }) {
  const reduced = useReducedMotion();
  const main = useRef<HTMLElement>(null);
  useEffect(() => { main.current?.focus({ preventScroll: true }); }, []);
  return <motion.main ref={main} tabIndex={-1} id={id} aria-label={label} className="portrait-page paper-section" initial={{ opacity: 0, y: reduced ? 0 : 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -20 }} transition={{ duration: reduced ? 0 : .45, delay: reduced ? 0 : .25 }}>
    <div className="portrait-page-inner">
      <PageNavigation label={label} />
      <header className="portrait-writing-heading"><ReadingTitle>{title}</ReadingTitle>{description && <p>{description}</p>}</header>
      <div className="paper-section-content">{children}</div>
      <PageFooter action={id === 'work' ? 'linkedin' : id === 'book' ? null : 'booking'} />
    </div>
  </motion.main>;
}
