import { AnimatePresence, MotionConfig, LayoutGroup } from 'framer-motion';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { BlogPost } from './pages/BlogPost';
import { PortraitExperience } from './components/PortraitExperience';
export function App() {
  return <BrowserRouter basename={import.meta.env.BASE_URL}><MotionConfig reducedMotion="user"><LayoutGroup><PageRoutes /></LayoutGroup></MotionConfig></BrowserRouter>;
}
function PageRoutes() {
  const location = useLocation();
  return <><PortraitExperience /><AnimatePresence mode="wait" initial={false}><Routes location={location} key={location.pathname}>
    <Route path="/" element={<Home />} />
    <Route path="/blog/:slug" element={<BlogPost />} />
    <Route path="/:section" element={<Home />} />
    <Route path="*" element={<Home />} />
  </Routes></AnimatePresence></>;
}
