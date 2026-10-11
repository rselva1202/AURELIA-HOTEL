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
  minDisplayTime = 2200,
  onCurtainComplete,
  brandTitle = "AURELIA",
  subtitle = "Boutique Cliff Sanctuary",
  edition = "Varkala · Kerala"
}) {
  const [mounted, setMounted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    // 1. Kick off CSS progress and mask reveals
    setMounted(true);

    // 2. Wait for minimum presentation time AND real readiness
    const timer = setTimeout(() => {
      if (isAppReady) {
        setIsReady(true);
      }
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [isAppReady, minDisplayTime]);

  // When readiness completes after minDisplayTime
  useEffect(() => {
    if (isAppReady && mounted) {
      const fallbackTimer = setTimeout(() => {
        setIsReady(true);
      }, minDisplayTime);
      return () => clearTimeout(fallbackTimer);
    }
  }, [isAppReady, mounted, minDisplayTime]);

  const handleTransitionEnd = (e) => {
    if (e.target === e.currentTarget && e.propertyName === 'transform' && isReady) {
      setIsRemoved(true);
      if (onCurtainComplete) onCurtainComplete();
    }
  };

  if (isRemoved) return null;

  return (
    <div
      className={`${styles.curtainOverlay} ${isReady ? styles.isReady : ''}`}
      onTransitionEnd={handleTransitionEnd}
      aria-hidden={isReady}
      role="status"
      aria-label="Loading experience"
    >
      <div className={styles.introContent}>
        {/* Brand Monogram */}
        <div className={styles.brandMark}>{brandTitle}</div>

        {/* 1px Hairline Progress Bar */}
        <div className={styles.hairlineTrack} aria-hidden="true">
          <div
            className={`${styles.hairlineProgress} ${mounted ? styles.animating : ''}`}
          />
        </div>

        {/* Staggered Overflow Hidden Typography */}
        <div className={styles.maskRow}>
          <div className={`${styles.maskItem} ${mounted ? styles.revealed : ''}`}>
            {subtitle}
          </div>
        </div>
        <div className={styles.maskRow}>
          <div className={`${styles.maskItem} ${mounted ? styles.revealed : ''}`}>
            {edition}
          </div>
        </div>
      </div>
    </div>
  );
}
