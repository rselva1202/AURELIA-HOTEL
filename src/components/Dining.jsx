import styles from './Dining.module.css';
import { assetUrl } from '../utils/helpers';

export default function Dining({ data }) {
  return (
    <section id="dining" className={`section section-dark ${styles.dining}`}>
      <div className="container">
        <div className={styles.grid}>
          {/* Image */}
          <div className={`reveal ${styles.imgCol}`}>
            <div className={styles.imgFrame}>
              <img
                src={assetUrl(data.image)}
                alt="Aurelia Hotel rooftop dining with ocean view"
                loading="lazy"
                decoding="async"
                className={styles.img}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.background =
                    'linear-gradient(135deg, #0f4f4f 0%, #1a7a7a 100%)';
                }}
              />
            </div>
          </div>

          {/* Text */}
          <div className={styles.textCol}>
            <div className="section-header" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
              <span className="eyebrow" style={{ color: 'var(--seafoam)' }}>Culinary</span>
              <h2 className="reveal">{data.heading}</h2>
            </div>
            <p className={`reveal ${styles.intro}`}>{data.description}</p>

            <ul className={styles.highlights} role="list">
              {data.highlights.map((h, i) => (
                <li
                  key={h.name}
                  className={`reveal ${styles.highlight}`}
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <div className={styles.highlightDot} aria-hidden="true" />
                  <div>
                    <h4>{h.name}</h4>
                    <p>{h.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
