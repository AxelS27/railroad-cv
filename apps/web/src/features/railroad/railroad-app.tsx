'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import AboutPage from './components/AboutPage';
import Footer from './components/Footer';
import Hero from './components/Hero';
import ModelsPage from './components/ModelsPage';
import Navbar from './components/Navbar';
import Ticker from './components/Ticker';

type Page = 'home' | 'models' | 'about';

export function RailroadApp() {
  const [page, setPage] = useState<Page>('home');
  const contentScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    contentScrollRef.current?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [page]);

  return (
    <div className="App">
      <div className="bg-layer" />
      <div className="bg-noise" />
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-grid" />

      <Navbar active={page} onChange={setPage} />

      <div className="content-scroll" ref={contentScrollRef}>
        <div className="sticky-viewport-manager">
          <main className="page-wrapper">
            <AnimatePresence mode="wait">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                initial={{ opacity: 0, y: 14 }}
                key={page}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {page === 'home' && <Hero />}
                {page === 'models' && <ModelsPage />}
                {page === 'about' && <AboutPage />}
              </motion.div>
            </AnimatePresence>
          </main>
          <Ticker />
        </div>
        <Footer />
      </div>
    </div>
  );
}
