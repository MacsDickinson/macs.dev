import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { BlogPost } from './pages/BlogPost';
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>);

}