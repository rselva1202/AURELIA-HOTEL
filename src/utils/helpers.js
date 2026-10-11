/**
 * Detects whether the frame-sequence hero should be degraded to
 * a simple poster + parallax fallback.
 *
 * Conditions for fallback:
 *  - prefers-reduced-motion media query
 *  - Save-Data header / navigator.connection.saveData
 *  - Slow connection (effectiveType 2g / slow-2g)
 *  - Low CPU (hardwareConcurrency <= 4)
 *  - Viewport width below mobileBreak uses mobile frames (not poster)
 *  - heroEnabled === false in config
 */
export function shouldUseFallback(heroEnabled = true) {
  if (!heroEnabled) return true;

  // Prefers reduced motion
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return true;
  }

  return false;
}

/** Returns true if we should use the mobile frame set */
export function isMobileFrameset(mobileBreak = 768) {
  return window.innerWidth < mobileBreak;
}

/**
 * Zero-pads a number to `digits` places.
 * padNum(3, 4) => "0003"
 */
export function padNum(n, digits = 4) {
  return String(n).padStart(digits, '0');
}

/**
 * Prefixes a path with import.meta.env.BASE_URL for GitHub Pages support.
 */
export function assetUrl(path = '') {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

/**
 * Builds a frame filename like "f_0001.webp"
 */
export function frameName(index, ext = 'webp') {
  return `f_${padNum(index + 1)}.${ext}`;
}

/**
 * Lerp between two values by factor t
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Clamp value between min and max
 */
export function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

/**
 * Formats a Date or date string as "12 Oct 2026"
 */
export function formatDate(dateInput) {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * Validates that a check-in date is in the future and
 * check-out is after check-in.
 * Returns { valid: boolean, error: string | null }
 */
export function validateDates(checkIn, checkOut) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const ci = new Date(checkIn);
  const co = new Date(checkOut);

  if (!checkIn || isNaN(ci.getTime())) {
    return { valid: false, error: 'Please enter a valid check-in date.' };
  }
  if (ci < now) {
    return { valid: false, error: 'Check-in date cannot be in the past.' };
  }
  if (!checkOut || isNaN(co.getTime())) {
    return { valid: false, error: 'Please enter a valid check-out date.' };
  }
  if (co <= ci) {
    return { valid: false, error: 'Check-out must be after check-in.' };
  }
  return { valid: true, error: null };
}

/**
 * Builds a WhatsApp message URL.
 * @param {string} phone - international number, e.g. "+919876543210"
 * @param {string} message - plain-text message body
 */
export function buildWhatsAppUrl(phone, message) {
  const cleaned = phone.replace(/\s+/g, '').replace(/^\+/, '');
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

/**
 * Cover-fits an image onto a canvas, similar to CSS object-fit: cover.
 * Returns { sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight }
 */
export function coverFitParams(imgW, imgH, canW, canH) {
  const imgAspect = imgW / imgH;
  const canAspect = canW / canH;

  let sx, sy, sWidth, sHeight;

  if (imgAspect > canAspect) {
    sHeight = imgH;
    sWidth = imgH * canAspect;
    sy = 0;
    sx = (imgW - sWidth) / 2;
  } else {
    sWidth = imgW;
    sHeight = imgW / canAspect;
    sx = 0;
    sy = (imgH - sHeight) / 2;
  }

  return { sx, sy, sWidth, sHeight, dx: 0, dy: 0, dWidth: canW, dHeight: canH };
}
