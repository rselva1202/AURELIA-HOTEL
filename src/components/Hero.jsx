import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  shouldUseFallback,
  isMobileFrameset,
  frameName,
  assetUrl,
  lerp,
  clamp,
  coverFitParams,
} from '../utils/helpers';
import styles from './Hero.module.css';

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────────────────── */
/*  Sub-component: Fallback (poster + simple parallax)        */
/* ────────────────────────────────────────────────────────── */
function HeroFallback({ config }) {
  const imgRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const onScroll = () => {
      const y = window.scrollY;
      img.style.transform = `translateY(${y * 0.25}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className={styles.fallback} aria-label="Aurelia Hotel — cliff-side view">
      <div className={styles.fallbackImgWrap}>
        <img
          ref={imgRef}
          src={assetUrl(config?.frames?.poster ?? '/frames/poster.webp')}
          alt="Aurelia Hotel cliff view over the Arabian Sea"
          className={styles.fallbackImg}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
      <div className={styles.heroOverlay} aria-hidden="true" />
      <div className={styles.heroContent}>
        <span className={styles.eyebrow}>Varkala, Kerala · Arabian Sea</span>
        <h1>{config?.steps?.[0]?.text ?? 'Where the cliff meets the sea'}</h1>
        <p style={{ color: 'var(--seafoam)', fontSize: '1.1rem', maxWidth: '52ch', lineHeight: 1.7 }}>
          Perched atop the ancient red laterite cliffs of Varkala, offering uninterrupted ocean vistas, serene coastal living, and sunset dining.
        </p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#rooms" className={`btn btn-sand ${styles.heroCta}`}>
            <span>Explore Rooms</span>
            <span aria-hidden="true">→</span>
          </a>
          <a href="#booking" className={`btn btn-outline`} style={{ color: 'var(--seafoam)', borderColor: 'var(--seafoam)' }}>
            <span>Reserve Stay</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Main Canvas Hero with Sticky Pinning & Scroll Scrubbing   */
/* ────────────────────────────────────────────────────────── */
export default function Hero({ config, onLoadProgress, lenisRef }) {
  const canvasRef      = useRef(null);
  const trackRef       = useRef(null);
  const stickyRef      = useRef(null);
  const framesRef      = useRef([]);       // HTMLImageElement[]
  const curFrameRef    = useRef(0);        // smoothed float frame index
  const targetFrameRef = useRef(0);        // raw target from scroll
  const rafRef         = useRef(null);
  const posterImgRef   = useRef(null);

  const [useFallback]  = useState(() => shouldUseFallback(config?.enabled ?? true));
  const [textStep, setTextStep] = useState(0); // show first step at top
  const [hasScrolled, setHasScrolled] = useState(false);

  // Pick frame set (desktop vs mobile)
  const frameSet    = isMobileFrameset() ? config.frames.mobile : config.frames.desktop;
  const totalFrames = frameSet.count;
  const framePathFn = useCallback(
    (i) => assetUrl(`${frameSet.path}${frameName(i, frameSet.ext)}`),
    [frameSet.path, frameSet.ext]
  );

  // ── Canvas draw ────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const frames = framesRef.current;
    const idx = Math.round(clamp(curFrameRef.current, 0, Math.max(0, totalFrames - 1)));
    
    // Attempt to pick requested frame
    let img = frames?.[idx];

    // If target frame is not loaded yet, use the closest loaded frame to prevent black flash
    if (!img || !img.complete || !img.naturalWidth) {
      for (let offset = 1; offset < 35; offset++) {
        const prev = frames?.[idx - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = frames?.[idx + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    // Helper: draw atmospheric sea-cliff gradient
    const drawGradient = () => {
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#0f4f4f');
      grad.addColorStop(0.5, '#1a7a7a');
      grad.addColorStop(1, '#083333');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // 1. Draw frame if loaded
    if (img && img.complete && img.naturalWidth > 0) {
      try {
        const { sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight } = coverFitParams(
          img.naturalWidth,
          img.naturalHeight,
          canvas.width,
          canvas.height
        );
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        return;
      } catch {
        // Fallback below
      }
    }

    // 2. Poster image
    const poster = posterImgRef.current;
    if (poster && poster.complete && poster.naturalWidth > 0) {
      try {
        const { sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight } = coverFitParams(
          poster.naturalWidth,
          poster.naturalHeight,
          canvas.width,
          canvas.height
        );
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(poster, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        return;
      } catch {
        // Fallback below
      }
    }

    // 3. Gradient fallback
    drawGradient();
  }, [totalFrames]);

  // ── Resize canvas to fill viewport ─────────────────────────
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, config.dprCap ?? 1.5);
    canvas.width  = window.innerWidth  * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width  = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    draw();
  }, [config.dprCap, draw]);

  // ── RAF animation loop for frame smoothing ─────────────────
  const startRAF = useCallback(() => {
    const loop = () => {
      const prev = curFrameRef.current;
      const target = targetFrameRef.current;
      const next = lerp(prev, target, 0.18);
      curFrameRef.current = next;

      if (Math.abs(next - prev) > 0.02) {
        draw();
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, [draw]);

  // ── Text step watcher ──────────────────────────────────────
  const updateTextStep = useCallback((progress) => {
    const steps = config.steps ?? [];
    let active = -1;
    steps.forEach((s, i) => {
      if (progress >= s.from && progress <= s.to) active = i;
    });
    setTextStep(active);
    if (progress > 0.04) setHasScrolled(true);
    else setHasScrolled(false);
  }, [config.steps]);

  // ── Scroll progress calculation ────────────────────────────
  const updateProgress = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const maxScroll = rect.height - window.innerHeight;
    if (maxScroll <= 0) return;

    // Progress 0 when track top is at viewport top, 1 when track bottom meets viewport bottom
    const p = clamp(-rect.top / maxScroll, 0, 1);
    targetFrameRef.current = p * (totalFrames - 1);
    updateTextStep(p);
  }, [totalFrames, updateTextStep]);

  // ── Frame loading ──────────────────────────────────────────
  const loadFrames = useCallback((onInitialReady) => {
    const frames = new Array(totalFrames);
    framesRef.current = frames;
    let loadedCount = 0;
    const initialCount = Math.max(1, Math.ceil(totalFrames * (config.preloadInitial ?? 0.2)));

    const onLoad = () => {
      loadedCount++;
      const progress = loadedCount / totalFrames;
      onLoadProgress?.(progress);
    };

    // 1. Immediately fetch and paint Frame 0 for instant visual response
    const firstImg = new Image();
    firstImg.src = framePathFn(0);
    frames[0] = firstImg;
    firstImg.onload = () => {
      draw();
    };

    // 2. Preload initial batch
    let initialDone = 0;
    for (let i = 0; i < initialCount; i++) {
      const img = new Image();
      img.src = framePathFn(i);
      frames[i] = img;
      img.onload = () => {
        onLoad();
        initialDone++;
        if (i === 0) draw();
        if (initialDone === initialCount) {
          onInitialReady();
        }
      };
      img.onerror = () => {
        frames[i] = null;
        onLoad();
        initialDone++;
        if (initialDone === initialCount) onInitialReady();
      };
    }

    // 3. Load remaining frames progressively
    const loadRest = () => {
      for (let i = initialCount; i < totalFrames; i++) {
        const img = new Image();
        img.src = framePathFn(i);
        frames[i] = img;
        img.onload = onLoad;
        img.onerror = () => {
          frames[i] = null;
          onLoad();
        };
      }
    };

    if (typeof window !== 'undefined' && window.requestIdleCallback) {
      window.requestIdleCallback(loadRest, { timeout: 2000 });
    } else {
      setTimeout(loadRest, 300);
    }
  }, [totalFrames, config.preloadInitial, framePathFn, onLoadProgress, draw]);

  // ── Pre-load fallback poster image ─────────────────────────
  useEffect(() => {
    if (config?.frames?.poster) {
      const p = new Image();
      p.src = assetUrl(config.frames.poster);
      p.onload = () => {
        posterImgRef.current = p;
        draw();
      };
      posterImgRef.current = p;
    }
  }, [config?.frames?.poster, draw]);

  // ── Main initialization & Scroll listeners ─────────────────
  useEffect(() => {
    if (useFallback) return;

    resizeCanvas();

    loadFrames(() => {
      draw();
      startRAF();
    });

    // Native scroll listener for direct, reliable sync
    const onScroll = () => {
      updateProgress();
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // GSAP ScrollTrigger tracking the scroll track
    let st = null;
    if (trackRef.current) {
      st = ScrollTrigger.create({
        trigger: trackRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          targetFrameRef.current = p * (totalFrames - 1);
          updateTextStep(p);
        },
      });
      ScrollTrigger.refresh();
    }

    // Connect Lenis instance if active
    let intervalId = null;
    const subscribeLenis = () => {
      if (lenisRef?.current) {
        lenisRef.current.on('scroll', onScroll);
        return true;
      }
      return false;
    };

    if (!subscribeLenis()) {
      intervalId = setInterval(() => {
        if (subscribeLenis()) clearInterval(intervalId);
      }, 100);
    }

    const onResize = () => {
      resizeCanvas();
      updateProgress();
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (intervalId) clearInterval(intervalId);
      if (lenisRef?.current) lenisRef.current.off('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (st) st.kill();
    };
  }, [useFallback, resizeCanvas, loadFrames, draw, startRAF, updateProgress, totalFrames, updateTextStep, lenisRef]);

  // ── Fallback Render ────────────────────────────────────────
  if (useFallback) {
    return <HeroFallback config={config} />;
  }

  return (
    <section
      ref={trackRef}
      className={styles.heroTrack}
      aria-label="Aurelia Hotel — cinematic cliff view"
    >
      <div ref={stickyRef} className={styles.heroSticky}>
        {/* Canvas frame sequence */}
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          role="img"
          aria-label="Cinematic scroll sequence showing Aurelia Hotel's cliff setting"
        />

        {/* Atmospheric dark gradient overlay */}
        <div className={styles.heroOverlay} aria-hidden="true" />

        {/* Text overlays synced to progress intervals */}
        <div className={styles.stepsContainer} aria-live="polite">
          {config.steps?.map((step, i) => (
            <div
              key={i}
              className={`${styles.step} ${textStep === i ? styles.stepActive : ''}`}
              aria-hidden={textStep !== i}
            >
              <p className={styles.eyebrow}>Varkala, Kerala</p>
              <h1>{step.text}</h1>
              {i === config.steps.length - 1 && (
                <a href="#booking" className={`btn btn-sand ${styles.heroCta}`}>
                  <span>Enquire Now</span>
                  <span aria-hidden="true">→</span>
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div
          className={`${styles.scrollHint} ${hasScrolled ? styles.scrollHintHidden : ''}`}
          aria-hidden="true"
        >
          <span>Scroll</span>
          <div className={styles.scrollLine} />
        </div>
      </div>
    </section>
  );
}
