import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { TALKS } from '../../data/content';
import { PaperPage } from '../PaperPage';
import { PaperDisclosure } from '../PaperDisclosure';

export function Speaking() {
  const [filter, setFilter] = useState('All');
  const types = ['All', ...new Set(TALKS.map(talk => talk.type))];
  const talks = TALKS.filter(talk => filter === 'All' || talk.type === filter);
  return <PaperPage id="speaking" label="Speaking" title="Ideas are better in a room." description="Engineering leadership, useful AI, and the human side of building software. Keynotes, panels and workshops.">
    <div className="paper-speaking-invite"><Link className="paper-cta" to="/book">Book me to speak<ArrowUpRight size={18} aria-hidden="true" /></Link><p>Conferences, internal events and podcast conversations. Remote or in person.</p></div>
    <section aria-label="Talks"><div className="paper-filters" role="group" aria-label="Filter talks by format">{types.map(type => <button key={type} aria-pressed={filter === type} onClick={() => setFilter(type)}>{type === 'All' ? 'All talks' : type}</button>)}</div>
      <p className="paper-result-count" role="status">{talks.length} {talks.length === 1 ? 'appearance' : 'appearances'}</p>
      <div className="paper-talks" key={filter}>{talks.map(talk => <PaperDisclosure key={talk.slug ?? talk.title} heading={<span className="paper-talk-heading"><span className="paper-meta">{talk.date} / {talk.type}{talk.upcoming ? ' / Upcoming' : ''}</span><span className="paper-talk-title">{talk.title}</span><span className="paper-talk-venue">{talk.venue}</span></span>}>
        <p>{talk.description}</p>{talk.link && <a className="paper-text-link" href={talk.link} target="_blank" rel="noreferrer">View talk or event<ArrowUpRight size={16} aria-hidden="true" /></a>}
      </PaperDisclosure>)}</div>
    </section>
  </PaperPage>;
}
