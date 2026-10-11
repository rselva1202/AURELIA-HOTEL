import styles from './LoadingScreen.module.css';

export default function LoadingScreen({ progress, hidden, brandName }) {
  const pct = Math.round(progress * 100);

  return (
    <div
      className={`${styles.screen} ${hidden ? styles.hidden : ''}`}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${brandName}: ${pct}%`}
    >
      <div className={styles.brand}>{brandName}</div>
      <div className={styles.sub}>Varkala, Kerala</div>
      <div className={styles.bar} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
      <div className={styles.pct}>{pct}%</div>
    </div>
  );
}
