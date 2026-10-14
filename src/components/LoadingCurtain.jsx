import { useState, useEffect } from 'react';
import styles from './LoadingCurtain.module.css';

/**
 * Editorial Loading Curtain
 * @param {boolean} isAppReady - External ready signal (e.g., initial frames loaded)
 * @param {number} minDisplayTime - Minimum presentation time before lift-off
 * @param {Function} onCurtainComplete - Callback after curtain lifts offscreen
 * @param {string} brandTitle - Primary brand name
 * @param {string} subtitle - Line 1 under progress hairline
 * @param {string} edition - Line 2 under progress hairline
 */
export default function LoadingCurtain({
  isAppReady = true,
  minDisplayTime = 5300,
  onCurtainComplete,
  brandTitle = "AURELIA",
  subtitle = "BOUTIQUE CLIFF SANCTUARY",
  edition = "VARKALA · KERALA · 08°44′ N"
}) {
  const [isReady, setIsReady] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsRemoved(true);
      if (onCurtainComplete) onCurtainComplete();
      return;
    }

    const timer = setTimeout(() => {
      setIsReady(true);
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [minDisplayTime, onCurtainComplete]);

  const handleTransitionEnd = (e) => {
    if (e.target === e.currentTarget && e.propertyName === 'opacity' && isReady) {
      setIsRemoved(true);
      if (onCurtainComplete) onCurtainComplete();
    }
  };

  if (isRemoved) return null;

  return (
    <div
      className={`${styles.curtainOverlay} ${isReady ? styles.isExiting : ''}`}
      onTransitionEnd={handleTransitionEnd}
      aria-hidden={isReady}
      role="status"
      aria-label="Loading experience"
    >
      {/* Ambient Coastal Glow */}
      <div className={styles.curtainGlow} aria-hidden="true" />

      {/* Birds Layer */}
      <div className={styles.curtainBirdsLayer} aria-hidden="true">
        <svg className={`${styles.curtainBird} ${styles.bird1}`} viewBox="0 0 32 16" style={{ top: '17%', '--bird-scale': 1, '--bird-delay': '3.4s', '--bird-duration': '4.2s' }}>
          <path d="M 2 13 C 8 4, 13 6, 16 10 C 19 6, 24 4, 30 13 C 24 8, 19 9, 16 12 C 13 9, 8 8, 2 13 Z" fill="rgba(245, 230, 200, 0.8)" />
        </svg>
        <svg className={`${styles.curtainBird} ${styles.bird2}`} viewBox="0 0 32 16" style={{ top: '24%', '--bird-scale': 0.82, '--bird-delay': '3.75s', '--bird-duration': '3.8s' }}>
          <path d="M 2 13 C 8 4, 13 6, 16 10 C 19 6, 24 4, 30 13 C 24 8, 19 9, 16 12 C 13 9, 8 8, 2 13 Z" fill="rgba(245, 230, 200, 0.72)" />
        </svg>
        <svg className={`${styles.curtainBird} ${styles.bird3}`} viewBox="0 0 32 16" style={{ top: '12%', '--bird-scale': 0.68, '--bird-delay': '4.1s', '--bird-duration': '4.0s' }}>
          <path d="M 2 13 C 8 4, 13 6, 16 10 C 19 6, 24 4, 30 13 C 24 8, 19 9, 16 12 C 13 9, 8 8, 2 13 Z" fill="rgba(245, 230, 200, 0.6)" />
        </svg>
      </div>

      <div className={styles.introContent}>
        <div className={styles.curtainBrandStage}>
          {/* Fish 1 */}
          <div className={`${styles.fishWrap} ${styles.fish1}`} style={{ '--fish-delay': '3.15s', left: '22%' }}>
            <svg className={styles.curtainFish} viewBox="0 0 46 26" aria-hidden="true">
              <path d="M 6 13 L 0 5 C 2 10, 2 16, 0 21 Z" fill="#B34920" />
              <path d="M 5 13 C 12 4, 30 5, 42 12 C 45 13, 45 14, 42 15 C 30 22, 12 23, 5 13 Z" fill="#DFC27E" />
              <path d="M 18 6 C 22 1, 28 2, 31 7 C 26 5, 21 5, 18 6 Z" fill="#B34920" />
              <path d="M 22 15 C 25 18, 29 20, 27 23 C 24 21, 22 18, 22 15 Z" fill="#B34920" />
              <circle cx="37" cy="12" r="1.8" fill="#082326" />
            </svg>
          </div>

          {/* Fish 2 */}
          <div className={`${styles.fishWrap} ${styles.fish2}`} style={{ '--fish-delay': '3.35s', left: '51%' }}>
            <svg className={styles.curtainFish} viewBox="0 0 46 26" aria-hidden="true">
              <path d="M 6 13 L 0 5 C 2 10, 2 16, 0 21 Z" fill="#B34920" />
              <path d="M 5 13 C 12 4, 30 5, 42 12 C 45 13, 45 14, 42 15 C 30 22, 12 23, 5 13 Z" fill="#DFC27E" />
              <path d="M 18 6 C 22 1, 28 2, 31 7 C 26 5, 21 5, 18 6 Z" fill="#B34920" />
              <path d="M 22 15 C 25 18, 29 20, 27 23 C 24 21, 22 18, 22 15 Z" fill="#B34920" />
              <circle cx="37" cy="12" r="1.8" fill="#082326" />
            </svg>
          </div>

          {/* Fish 3 */}
          <div className={`${styles.fishWrap} ${styles.fish3}`} style={{ '--fish-delay': '3.55s', left: '77%' }}>
            <svg className={styles.curtainFish} viewBox="0 0 46 26" aria-hidden="true">
              <path d="M 6 13 L 0 5 C 2 10, 2 16, 0 21 Z" fill="#B34920" />
              <path d="M 5 13 C 12 4, 30 5, 42 12 C 45 13, 45 14, 42 15 C 30 22, 12 23, 5 13 Z" fill="#DFC27E" />
              <path d="M 18 6 C 22 1, 28 2, 31 7 C 26 5, 21 5, 18 6 Z" fill="#B34920" />
              <path d="M 22 15 C 25 18, 29 20, 27 23 C 24 21, 22 18, 22 15 Z" fill="#B34920" />
              <circle cx="37" cy="12" r="1.8" fill="#082326" />
            </svg>
          </div>

          {/* Wordmark Letters Layer */}
          <h1 className={styles.brandMark} aria-label={brandTitle}>
            <span className={styles.curtainLetter} style={{ '--start-x': '-110px', '--start-y': '-65px', '--start-rotate': '-18deg', '--delay': '0.15s' }}>A</span>
            <span className={styles.curtainLetter} style={{ '--start-x': '85px', '--start-y': '-95px', '--start-rotate': '14deg', '--delay': '0.28s' }}>U</span>
            <span className={styles.curtainLetter} style={{ '--start-x': '-95px', '--start-y': '80px', '--start-rotate': '-12deg', '--delay': '0.42s' }}>R</span>
            <span className={styles.curtainLetter} style={{ '--start-x': '90px', '--start-y': '85px', '--start-rotate': '18deg', '--delay': '0.56s' }}>E</span>
            <span className={styles.curtainLetter} style={{ '--start-x': '-80px', '--start-y': '-85px', '--start-rotate': '-15deg', '--delay': '0.70s' }}>L</span>
            <span className={styles.curtainLetter} style={{ '--start-x': '70px', '--start-y': '70px', '--start-rotate': '13deg', '--delay': '0.82s' }}>I</span>
            <span className={styles.curtainLetter} style={{ '--start-x': '105px', '--start-y': '-75px', '--start-rotate': '17deg', '--delay': '0.94s' }}>A</span>
          </h1>
        </div>

        {/* Thin Decorative Divider */}
        <div className={styles.curtainDivider} aria-hidden="true" />

        {/* Subtitle */}
        <div className={styles.curtainSubtitle}>{subtitle}</div>

        {/* Location */}
        <div className={styles.curtainLocation}>{edition}</div>
      </div>
    </div>
  );
}
