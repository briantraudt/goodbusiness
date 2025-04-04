
import React from "react";
import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';

// Pages
import Index from './pages/Index';
import About from './pages/About';
import Consulting from './pages/Consulting';
import Ventures from './pages/Ventures';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

import "./App.css";

function App() {
  return (
    <HelmetProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/consulting" element={<Consulting />} />
        <Route path="/ventures" element={<Ventures />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HelmetProvider>
  );
}

export default App;
