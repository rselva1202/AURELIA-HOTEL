import { useState, useEffect } from 'react';
import styles from './FloatingWhatsApp.module.css';
import { buildWhatsAppUrl } from '../utils/helpers';

export default function FloatingWhatsApp({ contact, brandName }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const waUrl = buildWhatsAppUrl(
    contact.whatsapp,
    `Hello ${brandName}! I'd like to enquire about a booking.`
  );

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.fab} ${visible ? styles.visible : ''}`}
      aria-label="Chat with us on WhatsApp"
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className={styles.icon}
      >
        <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.445h.006c6.585 0 11.946-5.336 11.949-11.896.001-3.176-1.24-6.165-3.48-8.448zm-8.475 18.308h-.005c-1.775 0-3.513-.477-5.031-1.378l-.361-.214-3.741.975.997-3.648-.235-.374c-.99-1.574-1.512-3.393-1.511-5.255.002-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898 1.866 1.869 2.893 4.352 2.892 6.993-.003 5.45-4.437 9.887-9.884 9.887zm5.422-7.403c-.297-.149-1.758-.867-2.03-.967-.273-.099-.473-.148-.673.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      </svg>
      <span className={styles.label}>Book via WhatsApp</span>
    </a>
  );
}
