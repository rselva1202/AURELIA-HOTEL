import styles from './Location.module.css';

export default function Location({ contact }) {
  return (
    <section id="location" className={`section section-dark ${styles.location}`}>
      <div className="container">
        <div className="section-header">
          <span className="eyebrow" style={{ color: 'var(--seafoam)' }}>Find Us</span>
          <h2 className="reveal">How to Reach Aurelia</h2>
        </div>

        <div className={styles.grid}>
          {/* Map embed */}
          <div className={`reveal ${styles.mapWrap}`}>
            <iframe
              src={contact.googleMapsEmbed}
              title="Aurelia Hotel location on Google Maps"
              className={styles.map}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              aria-label="Google Maps showing Varkala cliff area"
            />
          </div>

          {/* Details */}
          <div className={`reveal ${styles.details}`} style={{ transitionDelay: '0.15s' }}>
            <div className={styles.detailItem}>
              <span className={styles.detailIcon} aria-hidden="true">📍</span>
              <div>
                <h4>Address</h4>
                <p>{contact.address}</p>
              </div>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailIcon} aria-hidden="true">✈️</span>
              <div>
                <h4>By Air</h4>
                <p>Trivandrum International Airport (TRV) — 90 min drive. Complimentary transfers for Cliff Suite guests.</p>
              </div>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailIcon} aria-hidden="true">🚂</span>
              <div>
                <h4>By Train</h4>
                <p>Varkala Sivagiri Railway Station — 15-minute auto-rickshaw ride. We can arrange pickup.</p>
              </div>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailIcon} aria-hidden="true">📞</span>
              <div>
                <h4>Contact</h4>
                <p>
                  <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className={styles.contactLink}>
                    {contact.phone}
                  </a>
                  <br />
                  <a href={`mailto:${contact.email}`} className={styles.contactLink}>
                    {contact.email}
                  </a>
                </p>
              </div>
            </div>

            <a
              href={contact.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn btn-sand ${styles.dirBtn}`}
            >
              <span>Get Directions</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
