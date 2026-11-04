import { Link } from 'react-router-dom';
import { PROFILE, ASK_ME_ABOUT, PRINCIPLES } from '../../data/content';
import { PaperPage } from '../PaperPage';

export function About() {
  return <PaperPage id="about" label="About" title="Engineering is a people business.">
    <div className="paper-about-intro"><p>{PROFILE.intro}</p><p className="paper-meta">Previously at {PROFILE.previously.join(', ')}.</p></div>
    <section className="paper-principles"><h2 className="paper-subtitle">How I think</h2>{PRINCIPLES.map(principle => <div key={principle.title} className="paper-principle"><h3>{principle.title}</h3><p>{principle.body}</p></div>)}</section>
    <section className="paper-topics"><h2 className="paper-subtitle">Ask me about</h2><ul>{ASK_ME_ABOUT.map(topic => <li key={topic}><Link to="/book">{topic}</Link></li>)}</ul></section>
  </PaperPage>;
}
