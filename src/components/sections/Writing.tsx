import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { BLOG_POSTS } from '../../data/content';
import { ReadingTitle } from '../ReadingTitle';
import { PageNavigation, PageFooter } from '../PaperPage';

export function Writing() {
  const reduced = useReducedMotion();
  const featured = BLOG_POSTS.filter(post => post.featured);
  const archive = BLOG_POSTS.filter(post => !post.featured);
  return <motion.main id="writing" className="portrait-page" initial={{ opacity: 0, y: reduced ? 0 : 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -20 }} transition={{ duration: reduced ? 0 : .45, delay: reduced ? 0 : .25 }}>
    <div className="portrait-page-inner">
      <PageNavigation label="Writing" />
      <header className="portrait-writing-heading"><ReadingTitle>Thinking out loud.</ReadingTitle><p>On engineering leadership, the shape of teams, and making AI useful.</p></header>
      <div className="portrait-featured">{featured.map(post => <Link to={`/blog/${post.slug}`} key={post.slug} className="portrait-story"><div><span className="portrait-story-tag">{post.tag}</span><h2>{post.title}</h2><p>{post.excerpt}</p></div><span className="portrait-story-date">{format(new Date(post.date), 'MMM yyyy')}<span>{post.readingTime}</span></span></Link>)}</div>
      <section className="portrait-archive"><h2>From the archive</h2>{archive.map(post => <Link to={`/blog/${post.slug}`} key={post.slug} className="portrait-archive-row"><time dateTime={post.date}>{format(new Date(post.date), 'MMM yyyy')}</time><h3>{post.title}</h3><span>{post.tag}</span></Link>)}</section>
      <PageFooter />
    </div>
  </motion.main>;
}
