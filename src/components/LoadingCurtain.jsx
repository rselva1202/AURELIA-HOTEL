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
        {/* Floating & Assembling Brand Letters */}
        <h1 className={styles.brandMark} aria-label={brandTitle}>
          <span className={styles.curtainLetter} style={{ '--fx': '-65px', '--fy': '-36px', '--fr': '-15deg', '--delay': '0.04s' }}>A</span>
          <span className={styles.curtainLetter} style={{ '--fx': '-38px', '--fy': '42px', '--fr': '13deg', '--delay': '0.12s' }}>U</span>
          <span className={styles.curtainLetter} style={{ '--fx': '-16px', '--fy': '-48px', '--fr': '-11deg', '--delay': '0.20s' }}>R</span>
          <span className={styles.curtainLetter} style={{ '--fx': '12px', '--fy': '38px', '--fr': '16deg', '--delay': '0.08s' }}>E</span>
          <span className={styles.curtainLetter} style={{ '--fx': '34px', '--fy': '-34px', '--fr': '-14deg', '--delay': '0.26s' }}>L</span>
          <span className={styles.curtainLetter} style={{ '--fx': '58px', '--fy': '32px', '--fr': '10deg', '--delay': '0.16s' }}>I</span>
          <span className={styles.curtainLetter} style={{ '--fx': '82px', '--fy': '-42px', '--fr': '-13deg', '--delay': '0.24s' }}>A</span>
        </h1>

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
