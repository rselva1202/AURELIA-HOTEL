import styles from './Rooms.module.css';
import { buildWhatsAppUrl, assetUrl } from '../utils/helpers';

export default function Rooms({ rooms, contact, brandName }) {
  const handleEnquire = (room) => {
    const msg = `Hello! I'm interested in the ${room.name} at ${brandName}. Could you share availability and details? Thank you.`;
    window.open(buildWhatsAppUrl(contact.whatsapp, msg), '_blank', 'noopener');
  };

  return (
    <section id="rooms" className={`section section-alt ${styles.rooms}`}>
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Accommodation</span>
          <h2 className="reveal">Rooms &amp; Suites</h2>
          <p className={`reveal ${styles.subtitle}`}>
            Every room is a front-row seat to the Arabian Sea.
          </p>
        </div>

        <div className={styles.grid}>
          {rooms.map((room, i) => (
            <article
              key={room.id}
              className={`card reveal ${styles.card}`}
              style={{ transitionDelay: `${i * 0.1}s` }}
              aria-label={room.name}
            >
              {/* Image */}
              <div className={styles.imgWrap}>
                <img
                  src={assetUrl(room.image)}
                  alt={`${room.name} — ${room.description.slice(0, 60)}`}
                  loading="lazy"
                  decoding="async"
                  className={styles.img}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add(styles.imgPlaceholder);
                  }}
                />
                {room.badge && (
                  <span className={styles.badge} aria-label={`Badge: ${room.badge}`}>
                    {room.badge}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className={styles.body}>
                <h3>{room.name}</h3>
                <p className={styles.desc}>{room.description}</p>

                {/* Amenities */}
                <ul className={styles.amenities} aria-label="Room amenities">
                  {room.amenities.map((a) => (
                    <li key={a} className={styles.amenityTag}>
                      {a}
                    </li>
                  ))}
                </ul>

                {/* Price + CTA */}
                <div className={styles.footer}>
                  <div>
                    <span className={styles.price}>{room.priceLabel}</span>
                    <span className={styles.priceNote}> + taxes</span>
                  </div>
                  <button
                    className={`btn btn-primary ${styles.cta}`}
                    onClick={() => handleEnquire(room)}
                    aria-label={`Enquire about ${room.name} via WhatsApp`}
                  >
                    <span>Enquire</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
