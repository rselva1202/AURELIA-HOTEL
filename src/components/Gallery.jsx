import { useState, useCallback, useEffect } from 'react';
import styles from './Gallery.module.css';

/* ── Lightbox ─────────────────────────────────── */
function Lightbox({ images, activeIndex, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft')  onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    document.body.classList.add('scroll-locked');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('scroll-locked');
    };
  }, [onClose, onPrev, onNext]);

  const img = images[activeIndex];

  return (
    <div
      className={styles.lightbox}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className={styles.lbClose}
        onClick={onClose}
        aria-label="Close lightbox"
      >
        ✕
      </button>

      {/* Prev */}
      <button
        className={`${styles.lbArrow} ${styles.lbPrev}`}
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="Previous image"
        disabled={activeIndex === 0}
      >
        ←
      </button>

      {/* Image */}
      <div className={styles.lbImgWrap} onClick={(e) => e.stopPropagation()}>
        <img
          src={img.src}
          alt={img.alt}
          className={styles.lbImg}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <p className={styles.lbCaption}>{img.alt}</p>
        <span className={styles.lbCounter} aria-live="polite">
          {activeIndex + 1} / {images.length}
        </span>
      </div>

      {/* Next */}
      <button
        className={`${styles.lbArrow} ${styles.lbNext}`}
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="Next image"
        disabled={activeIndex === images.length - 1}
      >
        →
      </button>
    </div>
  );
}

/* ── Gallery section ─────────────────────────── */
export default function Gallery({ images }) {
  const [lightboxIdx, setLightboxIdx] = useState(null);

  const open  = useCallback((i) => setLightboxIdx(i), []);
  const close  = useCallback(() => setLightboxIdx(null), []);
  const prev   = useCallback(() => setLightboxIdx((i) => Math.max(0, i - 1)), []);
  const next   = useCallback(() => setLightboxIdx((i) => Math.min(images.length - 1, i + 1)), [images.length]);

  return (
    <section id="gallery" className={`section section-alt ${styles.gallery}`}>
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Visual Story</span>
          <h2 className="reveal">A Glimpse of Aurelia</h2>
        </div>

        <ul className={styles.grid} role="list" aria-label="Photo gallery">
          {images.map((img, i) => (
            <li
              key={img.src}
              className={`reveal ${styles.item}`}
              style={{ transitionDelay: `${(i % 3) * 0.1}s` }}
            >
              <button
                className={styles.itemBtn}
                onClick={() => open(i)}
                aria-label={`View photo: ${img.alt}`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  decoding="async"
                  className={styles.img}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add(styles.imgPlaceholder);
                  }}
                />
                <div className={styles.overlay} aria-hidden="true">
                  <span className={styles.zoom}>⊕</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {lightboxIdx !== null && (
        <Lightbox
          images={images}
          activeIndex={lightboxIdx}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </section>
  );
}
