import { useReducedMotion } from '../hooks/useReducedMotion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import '../portrait.css';

/** Persistent scene: the same portrait and name remain mounted throughout the reading journey. */
export function PortraitExperience() {
  const location = useLocation();
  const pathname = location.pathname.replace(/\/+$/, '') || '/';
  const search = location.search;
  const navigate = useNavigate();
  const home = pathname === '/';
  const enabled = !(home && new URLSearchParams(search).has('constellation')) && (home || ['/writing', '/work', '/speaking', '/about', '/podcast', '/book'].includes(pathname) || pathname.startsWith('/blog/'));
  const reduced = useReducedMotion();
  const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));
  const [wordWidths, setWordWidths] = useState({ first: 380, last: 720 });
  const firstWord = useRef<HTMLSpanElement>(null);
  const lastWord = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const resize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    const measure = () => {
      if (firstWord.current && lastWord.current) setWordWidths({ first: firstWord.current.offsetWidth, last: lastWord.current.offsetWidth });
    };
    measure();
    // Font trials can change glyph widths through CSS without remounting the scene.
    const observer = new ResizeObserver(measure);
    if (firstWord.current) observer.observe(firstWord.current);
    if (lastWord.current) observer.observe(lastWord.current);
    let mounted = true;
    document.fonts.ready.then(() => { if (mounted) measure(); });
    window.addEventListener('resize', resize);
    return () => { mounted = false; observer.disconnect(); window.removeEventListener('resize', resize); };
  }, [enabled]);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 65, damping: 24, mass: 1 });
  const y = useSpring(pointerY, { stiffness: 65, damping: 24, mass: 1 });
  const photoX = useTransform(x, [-1, 1], [-14, 14]);
  const photoY = useTransform(y, [-1, 1], [-8, 8]);
  const typeX = useTransform(x, [-1, 1], [7, -7]);
  const typeY = useTransform(y, [-1, 1], [4, -4]);
  useEffect(() => {
    if (reduced) { pointerX.set(0); pointerY.set(0); x.jump(0); y.jump(0); return; }
    if (!enabled || !home) { pointerX.set(0); pointerY.set(0); return; }
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      pointerX.set((event.clientX / window.innerWidth - .5) * 2);
      pointerY.set((event.clientY / window.innerHeight - .5) * 2);
    };
    const reset = () => { pointerX.set(0); pointerY.set(0); };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', reset);
    window.addEventListener('blur', reset);
    return () => { window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', reset); window.removeEventListener('blur', reset); };
  }, [enabled, home, reduced, pointerX, pointerY, x, y]);
  useEffect(() => {
    if (!enabled || home) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') navigate(pathname.startsWith('/blog/') ? '/writing' : '/');
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [enabled, home, navigate, pathname]);
  if (!enabled) return null;
  const transition = { duration: reduced ? 0 : .95, ease: [.76, 0, .24, 1] as [number, number, number, number] };
  const { width, height } = viewport;
  const mobile = width <= 600;
  const tablet = width > 600 && width <= 900;
  let size = home ? (mobile ? Math.min(58, Math.max(40, width * .11)) : tablet ? width * .14 : Math.min(210, Math.max(110, width * .13))) : width <= 900 ? 22 : 29;
  if (home && height <= 700 && !mobile) size = width * .11;
  const left = home ? mobile ? 24 : width >= 1800 ? Math.max(width * .05, (width - 1660) / 2) : width * .05 : width <= 900 ? 24 : width * .035;
  const top = home ? mobile ? 86 : height <= 700 ? height * .18 : tablet ? height * .23 : height * .2 : mobile ? 24 : 32;
  const stacked = home ? !mobile : tablet;
  const scale = size / 210;
  const secondLeft = stacked ? left : left + wordWidths.first * scale + size * .22;
  const secondTop = stacked ? top + size * (home ? .86 : 1.04) : top;
  const nameWidth = stacked ? Math.max(wordWidths.first, wordWidths.last) * scale : (wordWidths.first + wordWidths.last) * scale + size * .22;
  return <div className={`portrait-experience ${home ? 'portrait-home' : 'portrait-reading'}`}>
    <div className="portrait-backdrop" aria-hidden="true" />
    <div className="portrait-mobile-mast" aria-hidden="true" />
    <motion.div className="portrait-name-plane" style={{ x: typeX, y: typeY }}>
      <Link className="portrait-name" to="/" aria-label="Macs Dickinson, home" style={{ left, top, width: nameWidth, height: size * (stacked ? 2 : 1.1) }}>
        <motion.span ref={firstWord} className="portrait-name-word" initial={false} animate={{ x: left, y: top, scale }} transition={transition} aria-hidden="true">Macs</motion.span>
        <motion.span ref={lastWord} className="portrait-name-word" initial={false} animate={{ x: secondLeft, y: secondTop, scale }} transition={transition} aria-hidden="true">Dickinson</motion.span>
      </Link>
    </motion.div>
    <motion.div className="portrait-figure" layout transition={transition} aria-hidden="true">
      <motion.img src={`${import.meta.env.BASE_URL}portraits/macs-cutout.png`} alt="" draggable={false} style={{ x: photoX, y: photoY }} />
    </motion.div>
    <AnimatePresence>{!home && <motion.div key="paper" className="portrait-paper" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={transition} />}</AnimatePresence>
  </div>;
}
