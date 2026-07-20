import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { BlogPost } from './pages/BlogPost';
export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        {/* Each constellation section is deep-linkable, e.g. /podcast, /about.
            Home reads the :section param and opens that overlay directly. */}
        <Route path="/:section" element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>);

}