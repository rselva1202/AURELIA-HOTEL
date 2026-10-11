import { useState, useEffect, useRef, useCallback } from 'react';
import { useLenis } from './hooks/useLenis';
import { useScrollReveal } from './hooks/useScrollReveal';
import { shouldUseFallback } from './utils/helpers';
import siteConfig from './data/siteConfig';

// Components
import LoadingScreen   from './components/LoadingScreen';
import Navbar          from './components/Navbar';
import Hero            from './components/Hero';
import WaveDivider     from './components/WaveDivider';
import About           from './components/About';
import Rooms           from './components/Rooms';
import Amenities       from './components/Amenities';
import Dining          from './components/Dining';
import Gallery         from './components/Gallery';
import Reviews         from './components/Reviews';
import Location        from './components/Location';
import FAQ             from './components/FAQ';
import Booking         from './components/Booking';
import Contact         from './components/Contact';
import Footer          from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';

export default function App() {
  const mainRef = useRef(null);

  // ── Reduce-motion user override (footer toggle) ──
  const [reduceMotion, setReduceMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('aurelia-reduce-motion');
    if (stored !== null) return stored === 'true';
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const handleReduceMotionToggle = useCallback(() => {
    setReduceMotion((v) => {
      const next = !v;
      localStorage.setItem('aurelia-reduce-motion', String(next));
      return next;
    });
  }, []);

  // ── Loading state ──────────────────────────────
  // fallback mode: skip loading screen entirely
  const useFallback = shouldUseFallback(siteConfig.hero.enabled) || reduceMotion;

  const [loadProgress, setLoadProgress] = useState(useFallback ? 1 : 0);
  const [loadingDone, setLoadingDone]   = useState(useFallback);

  const handleLoadProgress = useCallback((progress) => {
    setLoadProgress(progress);
    if (progress >= (siteConfig.hero.preloadInitial ?? 0.2)) {
      setTimeout(() => setLoadingDone(true), 300);
    }
  }, []);

  // Safety fallback: ensure loading screen disappears within 2.5s even under slow conditions
  useEffect(() => {
    if (useFallback) return;
    const t = setTimeout(() => setLoadingDone(true), 2500);
    return () => clearTimeout(t);
  }, [useFallback]);

  // ── Lenis smooth scroll ────────────────────────
  const lenisRef = useLenis();

  // ── Scroll reveal ──────────────────────────────
  useScrollReveal(mainRef);

  // ── SEO meta injection ─────────────────────────
  useEffect(() => {
    const { seo, demoMode } = siteConfig;
    document.title = seo.title;

    const setMeta = (name, content, prop = false) => {
      const sel = prop
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
      let el = document.querySelector(sel);
      if (!el) {
        el = document.createElement('meta');
        if (prop) el.setAttribute('property', name);
        else el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', seo.description);
    setMeta('og:title', seo.title, true);
    setMeta('og:description', seo.description, true);
    setMeta('og:image', seo.ogImage, true);
    setMeta('og:url', seo.siteUrl, true);

    if (demoMode) {
      setMeta('robots', 'noindex, nofollow');
    }
  }, []);

  return (
    <>
      {/* Loading screen (canvas hero only) */}
      {!useFallback && !loadingDone && (
        <LoadingScreen
          progress={loadProgress}
          hidden={loadingDone}
          brandName={siteConfig.brandName}
        />
      )}

      <Navbar />

      <main id="main-content" ref={mainRef}>
        {/* 3D scroll hero */}
        <Hero
          config={siteConfig.hero}
          onLoadProgress={handleLoadProgress}
          lenisRef={lenisRef}
        />

        {/* ── About ────────────────────── */}
        <WaveDivider fillFrom="#0f4f4f" fillTo="#fdf8f0" />
        <About data={siteConfig.about} />

        {/* ── Rooms ─────────────────────── */}
        <WaveDivider fillFrom="#fdf8f0" fillTo="#f5e6c8" />
        <Rooms
          rooms={siteConfig.rooms}
          contact={siteConfig.contact}
          brandName={siteConfig.brandName}
        />

        {/* ── Amenities ─────────────────── */}
        <WaveDivider fillFrom="#f5e6c8" fillTo="#fdf8f0" />
        <Amenities items={siteConfig.amenities} />

        {/* ── Dining ─────────────────────── */}
        <WaveDivider fillFrom="#fdf8f0" fillTo="#0f4f4f" />
        <Dining data={siteConfig.dining} />

        {/* ── Gallery ────────────────────── */}
        <WaveDivider fillFrom="#0f4f4f" fillTo="#f5e6c8" />
        <Gallery images={siteConfig.gallery} />

        {/* ── Reviews ────────────────────── */}
        <WaveDivider fillFrom="#f5e6c8" fillTo="#fdf8f0" />
        <Reviews reviews={siteConfig.reviews} />

        {/* ── Location ───────────────────── */}
        <WaveDivider fillFrom="#fdf8f0" fillTo="#0f4f4f" />
        <Location contact={siteConfig.contact} />

        {/* ── FAQ ────────────────────────── */}
        <WaveDivider fillFrom="#0f4f4f" fillTo="#f5e6c8" />
        <FAQ items={siteConfig.faq} />

        {/* ── Booking ────────────────────── */}
        <WaveDivider fillFrom="#f5e6c8" fillTo="#0f4f4f" />
        <Booking
          contact={siteConfig.contact}
          brandName={siteConfig.brandName}
        />

        {/* ── Contact ────────────────────── */}
        <WaveDivider fillFrom="#0f4f4f" fillTo="#fdf8f0" />
        <Contact
          contact={siteConfig.contact}
          brandName={siteConfig.brandName}
        />
      </main>

      <Footer
        onReduceMotionToggle={handleReduceMotionToggle}
        reduceMotion={reduceMotion}
      />

      {/* Floating WhatsApp button */}
      <FloatingWhatsApp
        contact={siteConfig.contact}
        brandName={siteConfig.brandName}
      />
    </>
  );
}
