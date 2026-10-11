import styles from './Amenities.module.css';

export default function Amenities({ items }) {
  return (
    <section id="amenities" className={`section ${styles.amenities}`}>
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Experience</span>
          <h2 className="reveal">Life at Aurelia</h2>
        </div>

        <ul className={styles.grid} role="list" aria-label="Hotel amenities">
          {items.map((item, i) => (
            <li
              key={item.title}
              className={`card reveal ${styles.card}`}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <span className={styles.icon} role="img" aria-label={item.title}>
                {item.icon}
              </span>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.desc}>{item.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
