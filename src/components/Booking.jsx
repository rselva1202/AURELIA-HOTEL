import { useState } from 'react';
import { validateDates, formatDate, buildWhatsAppUrl } from '../utils/helpers';
import styles from './Booking.module.css';

const ROOM_OPTIONS = [
  { value: '',              label: 'Select a room…' },
  { value: 'Cliff Suite',   label: 'Cliff Suite — ₹18,500/night' },
  { value: 'Heritage Room', label: 'Heritage Room — ₹9,800/night' },
  { value: 'Garden Villa',  label: 'Garden Villa — ₹12,500/night' },
  { value: 'Sea Breeze Room', label: 'Sea Breeze Room — ₹6,500/night' },
];

const INITIAL = {
  name: '',
  checkIn: '',
  checkOut: '',
  guests: '2',
  room: '',
};

export default function Booking({ contact, brandName }) {
  const [form, setForm]     = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((e2) => ({ ...e2, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Please enter your name.';

    const dateCheck = validateDates(form.checkIn, form.checkOut);
    if (!dateCheck.valid) {
      if (!form.checkIn) errs.checkIn = dateCheck.error;
      else errs.checkOut = dateCheck.error;
    }

    const guests = parseInt(form.guests, 10);
    if (!form.guests || isNaN(guests) || guests < 1 || guests > 10) {
      errs.guests = 'Please enter 1–10 guests.';
    }
    if (!form.room) errs.room = 'Please select a room type.';

    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      // Focus first error field
      const firstKey = Object.keys(errs)[0];
      document.getElementById(`booking-${firstKey}`)?.focus();
      return;
    }

    const checkInFmt  = formatDate(form.checkIn);
    const checkOutFmt = formatDate(form.checkOut);
    const nights = Math.round(
      (new Date(form.checkOut) - new Date(form.checkIn)) / (1000 * 60 * 60 * 24)
    );

    const message =
      `Hello ${brandName}! 🌊\n\n` +
      `I'd like to enquire about a booking:\n` +
      `• Name: ${form.name}\n` +
      `• Room: ${form.room}\n` +
      `• Check-in: ${checkInFmt}\n` +
      `• Check-out: ${checkOutFmt} (${nights} night${nights !== 1 ? 's' : ''})\n` +
      `• Guests: ${form.guests}\n\n` +
      `Could you please confirm availability and share the best rate? Thank you!`;

    window.open(buildWhatsAppUrl(contact.whatsapp, message), '_blank', 'noopener');
    setSubmitted(true);
    setForm(INITIAL);
    setTimeout(() => setSubmitted(false), 5000);
  };

  // Min date = today
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <section id="booking" className={`section ${styles.booking}`}>
      <div className="container">
        <div className={styles.inner}>
          {/* Header */}
          <div className={`section-header ${styles.header}`}>
            <span className="eyebrow" style={{ color: 'var(--seafoam)' }}>Book Direct</span>
            <h2 className="reveal">Plan Your Stay</h2>
            <p className="reveal" style={{ color: 'var(--seafoam)', transitionDelay: '0.1s' }}>
              Get the best rate when you book directly. We confirm within 2 hours via WhatsApp.
            </p>
          </div>

          {/* Form */}
          <form
            className={`reveal ${styles.form}`}
            onSubmit={handleSubmit}
            noValidate
            aria-label="Booking enquiry form"
          >
            {/* Name */}
            <div className={styles.field}>
              <label htmlFor="booking-name" className={styles.label}>
                Full Name <span aria-hidden="true" className={styles.req}>*</span>
              </label>
              <input
                id="booking-name"
                type="text"
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                placeholder="Your name"
                value={form.name}
                onChange={set('name')}
                autoComplete="name"
                aria-required="true"
                aria-describedby={errors.name ? 'err-name' : undefined}
              />
              {errors.name && <span id="err-name" className={styles.errMsg} role="alert">{errors.name}</span>}
            </div>

            {/* Dates row */}
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="booking-checkIn" className={styles.label}>
                  Check-in <span aria-hidden="true" className={styles.req}>*</span>
                </label>
                <input
                  id="booking-checkIn"
                  type="date"
                  className={`${styles.input} ${errors.checkIn ? styles.inputError : ''}`}
                  value={form.checkIn}
                  onChange={set('checkIn')}
                  min={todayStr}
                  aria-required="true"
                  aria-describedby={errors.checkIn ? 'err-checkin' : undefined}
                />
                {errors.checkIn && <span id="err-checkin" className={styles.errMsg} role="alert">{errors.checkIn}</span>}
              </div>

              <div className={styles.field}>
                <label htmlFor="booking-checkOut" className={styles.label}>
                  Check-out <span aria-hidden="true" className={styles.req}>*</span>
                </label>
                <input
                  id="booking-checkOut"
                  type="date"
                  className={`${styles.input} ${errors.checkOut ? styles.inputError : ''}`}
                  value={form.checkOut}
                  onChange={set('checkOut')}
                  min={form.checkIn || todayStr}
                  aria-required="true"
                  aria-describedby={errors.checkOut ? 'err-checkout' : undefined}
                />
                {errors.checkOut && <span id="err-checkout" className={styles.errMsg} role="alert">{errors.checkOut}</span>}
              </div>
            </div>

            {/* Guests + Room */}
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="booking-guests" className={styles.label}>
                  Guests <span aria-hidden="true" className={styles.req}>*</span>
                </label>
                <input
                  id="booking-guests"
                  type="number"
                  className={`${styles.input} ${errors.guests ? styles.inputError : ''}`}
                  value={form.guests}
                  onChange={set('guests')}
                  min="1"
                  max="10"
                  aria-required="true"
                  aria-describedby={errors.guests ? 'err-guests' : undefined}
                />
                {errors.guests && <span id="err-guests" className={styles.errMsg} role="alert">{errors.guests}</span>}
              </div>

              <div className={styles.field}>
                <label htmlFor="booking-room" className={styles.label}>
                  Room Type <span aria-hidden="true" className={styles.req}>*</span>
                </label>
                <select
                  id="booking-room"
                  className={`${styles.input} ${styles.select} ${errors.room ? styles.inputError : ''}`}
                  value={form.room}
                  onChange={set('room')}
                  aria-required="true"
                  aria-describedby={errors.room ? 'err-room' : undefined}
                >
                  {ROOM_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} disabled={!o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                {errors.room && <span id="err-room" className={styles.errMsg} role="alert">{errors.room}</span>}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className={`btn btn-sand ${styles.submitBtn}`}>
              <span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.445h.006c6.585 0 11.946-5.336 11.949-11.896.001-3.176-1.24-6.165-3.48-8.448zm-8.475 18.308h-.005c-1.775 0-3.513-.477-5.031-1.378l-.361-.214-3.741.975.997-3.648-.235-.374c-.99-1.574-1.512-3.393-1.511-5.255.002-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898 1.866 1.869 2.893 4.352 2.892 6.993-.003 5.45-4.437 9.887-9.884 9.887zm5.422-7.403c-.297-.149-1.758-.867-2.03-.967-.273-.099-.473-.148-.673.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                </svg>
              </span>
              <span>Send WhatsApp Enquiry</span>
            </button>

            {submitted && (
              <p className={styles.success} role="status" aria-live="polite">
                ✅ Your enquiry was sent! We'll reply within 2 hours.
              </p>
            )}

            <p className={styles.note}>
              * Direct bookings get our best rates. No spam — just a friendly WhatsApp reply.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
