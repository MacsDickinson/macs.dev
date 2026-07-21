import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';

// The reading view carries react-markdown + the full text of every post —
// split it out so the homepage (most visits) never downloads any of it.
const BlogPost = React.lazy(() =>
import('./pages/BlogPost').then((m) => ({ default: m.BlogPost }))
);

// Blank deck-coloured screen while the blog chunk loads — avoids a white flash.
const blogFallback = <div className="h-full w-full bg-[var(--ground)]" />;

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/blog/:slug"
          element={
          <Suspense fallback={blogFallback}>
              <BlogPost />
            </Suspense>
          } />
        {/* Each constellation section is deep-linkable, e.g. /podcast, /about.
            Home reads the :section param and opens that overlay directly. */}
        <Route path="/:section" element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>);

}