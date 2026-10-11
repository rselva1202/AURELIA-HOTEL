import styles from './About.module.css';
import { assetUrl } from '../utils/helpers';

export default function About({ data }) {
  return (
    <section id="about" className={`section ${styles.about}`}>
      <div className="container">
        <div className={styles.grid}>
          {/* Text column */}
          <div className={styles.textCol}>
            <div className="section-header" style={{ textAlign: 'left' }}>
              <span className="eyebrow">Our Story</span>
              <h2 className="reveal">{data.heading}</h2>
            </div>
            {data.body.map((para, i) => (
              <p key={i} className={`reveal ${styles.bodyPara}`} style={{ transitionDelay: `${i * 0.12}s` }}>
                {para}
              </p>
            ))}

            {/* Stats */}
            <div className={`reveal ${styles.stats}`} style={{ transitionDelay: '0.24s' }}>
              {data.stats.map((s) => (
                <div key={s.label} className={styles.stat}>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image column */}
          <div className={`reveal ${styles.imgCol}`} style={{ transitionDelay: '0.1s' }}>
            <div className={styles.imgFrame}>
              <img
                src={assetUrl(data.image)}
                alt="Aurelia Hotel cliff facade with ocean behind"
                loading="lazy"
                decoding="async"
                className={styles.img}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.background =
                    'linear-gradient(135deg, var(--teal) 0%, var(--teal-dark) 100%)';
                }}
              />
              <div className={styles.imgAccent} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
