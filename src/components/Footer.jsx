import siteConfig from '../data/siteConfig';
import styles from './Footer.module.css';

export default function Footer({ onReduceMotionToggle, reduceMotion }) {
  const { footer, brandName, location } = siteConfig;

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`container ${styles.inner}`}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoA}>A</span>
            <span className={styles.logoText}>{brandName}</span>
          </div>
          <p className={styles.tagline}>{footer.tagline}</p>
          <p className={styles.location}>{location}</p>

          {/* Social */}
          <div className={styles.social} aria-label="Social media links">
            {footer.socialLinks.map((s) => (
              <a
                key={s.platform}
                href={s.href}
                aria-label={`${brandName} on ${s.platform}`}
                className={styles.socialLink}
              >
                <span aria-hidden="true">{s.icon}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <nav aria-label="Footer navigation" className={styles.links}>
          <ul role="list">
            {footer.links.map((l) => (
              <li key={l.label}>
                <a href={l.href} className={styles.link}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Reduce motion toggle */}
        <div className={styles.a11yPanel}>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={reduceMotion}
              onChange={onReduceMotionToggle}
              aria-label="Reduce motion / disable frame sequence"
            />
            <span className={styles.toggleLabel}>Reduce motion</span>
          </label>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <div className="container">
          <p className={styles.copyright}>{footer.copyright}</p>
          {siteConfig.demoMode && (
            <p className={styles.demoNote} role="note">
              🔬 {footer.demoNote}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
