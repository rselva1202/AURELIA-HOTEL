import { useState } from 'react';
import styles from './FAQ.module.css';

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className={`${styles.item} ${isOpen ? styles.open : ''}`}>
      <button
        className={styles.question}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.q.slice(0, 20)}`}
      >
        <span>{item.q}</span>
        <span className={styles.icon} aria-hidden="true">{isOpen ? '−' : '+'}</span>
      </button>
      <div
        id={`faq-answer-${item.q.slice(0, 20)}`}
        className={styles.answer}
        role="region"
        aria-hidden={!isOpen}
      >
        <p>{item.a}</p>
      </div>
    </div>
  );
}

export default function FAQ({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className={`section section-alt ${styles.faq}`}>
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Help</span>
          <h2 className="reveal">Frequently Asked Questions</h2>
        </div>

        <div className={`reveal ${styles.list}`}>
          {items.map((item, i) => (
            <FAQItem
              key={i}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
