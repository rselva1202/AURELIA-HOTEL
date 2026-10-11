import styles from './Reviews.module.css';

function StarRating({ rating }) {
  return (
    <div className={styles.stars} aria-label={`${rating} out of 5 stars`} role="img">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden="true" className={i < rating ? styles.starFilled : styles.starEmpty}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function Reviews({ reviews }) {
  return (
    <section id="reviews" className={`section ${styles.reviews}`}>
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Guest Voices</span>
          <h2 className="reveal">What Our Guests Say</h2>
          <p className="reveal" style={{ color: 'var(--text-light)', marginInline: 'auto', transitionDelay: '0.1s' }}>
            ⚠️ <em>Sample reviews for demonstration purposes only.</em>
          </p>
        </div>

        <ul className={styles.grid} role="list" aria-label="Guest reviews (sample)">
          {reviews.map((review, i) => (
            <li
              key={i}
              className={`card reveal ${styles.card}`}
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <StarRating rating={review.rating} />
              <blockquote className={styles.quote}>
                <p>"{review.text}"</p>
              </blockquote>
              <footer className={styles.reviewer}>
                <div className={styles.avatar} aria-hidden="true">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <cite className={styles.name}>{review.name}</cite>
                  <span className={styles.meta}>{review.location} · {review.date}</span>
                </div>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
