# Aurelia Hotel — Boutique Cliff Resort Website

> **Demo concept** — `demoMode: true` in `src/data/siteConfig.js`. Includes `noindex` meta tag and footer notice. Not a real booking portal.

A premium, motion-rich single-page website for **Aurelia Hotel**, a boutique cliff resort in Varkala, Kerala. Built with React + Vite, GSAP ScrollTrigger, and Lenis smooth scroll.

---

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview production build
```

---

## File Structure

```
AURELIA-HOTEL/
├── public/
│   ├── favicon.svg
│   ├── frames/
│   │   ├── poster.webp          ← fallback poster image (replace with real WebP)
│   │   ├── desktop/             ← f_0001.webp … f_0144.webp  (144 frames)
│   │   └── mobile/              ← f_0001.webp … f_0090.webp  (90 frames)
│   └── images/
│       ├── about.webp
│       ├── room-cliff-suite.webp
│       ├── room-heritage.webp
│       ├── room-garden-villa.webp
│       ├── room-sea-breeze.webp
│       ├── dining.webp
│       └── gallery-1.webp … gallery-6.webp
│
├── scripts/
│   └── generate-placeholders.cjs   ← generates SVG placeholders
│
├── src/
│   ├── data/
│   │   └── siteConfig.js           ← ALL brand text, colours, prices, config
│   ├── hooks/
│   │   ├── useLenis.js             ← Lenis + GSAP ScrollTrigger sync
│   │   └── useScrollReveal.js      ← IntersectionObserver reveal
│   ├── utils/
│   │   └── helpers.js              ← frame naming, lerp, date validation, WhatsApp URL
│   ├── styles/
│   │   └── global.css              ← palette variables, reset, typography, buttons
│   ├── components/
│   │   ├── LoadingScreen.jsx / .module.css
│   │   ├── Navbar.jsx / .module.css
│   │   ├── Hero.jsx / .module.css     ← canvas frame sequence + fallback
│   │   ├── WaveDivider.jsx / .module.css
│   │   ├── About.jsx / .module.css
│   │   ├── Rooms.jsx / .module.css
│   │   ├── Amenities.jsx / .module.css
│   │   ├── Dining.jsx / .module.css
│   │   ├── Gallery.jsx / .module.css  ← lightbox included
│   │   ├── Reviews.jsx / .module.css
│   │   ├── Location.jsx / .module.css
│   │   ├── FAQ.jsx / .module.css
│   │   ├── Booking.jsx / .module.css  ← WhatsApp enquiry form
│   │   ├── Contact.jsx / .module.css
│   │   ├── Footer.jsx / .module.css
│   │   └── FloatingWhatsApp.jsx / .module.css
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
└── vite.config.js
```

---

## Adding the Frame Sequence

The hero canvas plays a numbered WebP sequence as the user scrolls.

### Frame Naming Convention
```
f_0001.webp, f_0002.webp, … f_0144.webp   (desktop — 4-digit zero-padded)
f_0001.webp, f_0002.webp, … f_0090.webp   (mobile)
```

### Generating Frames from Video (ffmpeg)

```bash
# Desktop (1920×1080, 144 frames from a ~6s clip)
ffmpeg -i your-cliff-video.mp4 \
  -vf "fps=24,scale=1920:-1" \
  -frames:v 144 \
  -q:v 80 \
  public/frames/desktop/f_%04d.webp

# Mobile (828×1792 portrait, 90 frames)
ffmpeg -i your-cliff-video.mp4 \
  -vf "fps=15,scale=828:-1,crop=828:1792" \
  -frames:v 90 \
  -q:v 80 \
  public/frames/mobile/f_%04d.webp

# Poster (single still)
ffmpeg -i your-cliff-video.mp4 -vframes 1 -q:v 85 public/frames/poster.webp
```

> **Tip:** Keep each frame under ~30 KB. Aim for total desktop sequence ≈ 3–4 MB.

### Update Frame Count in Config
```js
// src/data/siteConfig.js
hero: {
  frames: {
    desktop: { path: "/frames/desktop/", count: 144, ext: "webp" },
    mobile:  { path: "/frames/mobile/",  count: 90,  ext: "webp" },
    poster:  "/frames/poster.webp",
  },
}
```

---

## Turning the 3D Hero Off

In `src/data/siteConfig.js`, set:

```js
hero: {
  enabled: false,   // ← this line
  ...
}
```

This instantly switches to the **poster image + parallax fallback** on all devices. No code changes needed.

---

## Fallback Conditions (Automatic)

The canvas hero degrades automatically to poster + parallax when **any** of the following are true:

| Condition | Detection |
|-----------|-----------|
| `hero.enabled: false` in config | `siteConfig.js` |
| Prefers-reduced-motion OS setting | `matchMedia('(prefers-reduced-motion: reduce)')` |
| Save-Data header enabled | `navigator.connection.saveData` |
| Slow connection (2G / slow-2G) | `navigator.connection.effectiveType` |
| Low CPU (≤ 4 cores) | `navigator.hardwareConcurrency <= 4` |
| User clicked "Reduce motion" in footer | `localStorage` persisted |

---

## Customising Brand Content

**Everything** is in [`src/data/siteConfig.js`](src/data/siteConfig.js):

| Key | What it controls |
|-----|-----------------|
| `brandName` | Name in navbar, WhatsApp messages, loading screen |
| `contact.whatsapp` | International format (`+919876543210`) |
| `rooms[].priceLabel` | Displayed price string |
| `rooms[].priceINR` | Numeric price (for future booking logic) |
| `palette.*` | CSS custom property values |
| `hero.frames.desktop.count` | Number of desktop frames |
| `hero.steps[]` | Text overlaid at `from`/`to` scroll progress |
| `demoMode` | `false` removes noindex + footer badge |

---

## Responsive Breakpoints

| Width | Layout |
|-------|--------|
| 360px | Single-column, mobile nav, FAB with label |
| 390px | Same, slightly wider cards |
| 768px | Two-column grids begin, mobile hero frames |
| 1440px | Full desktop layout, desktop hero frames |

---

## Lighthouse Performance

| Mode | Target score |
|------|-------------|
| With frame sequence (real WebPs) | ~75–82 mobile |
| With `hero.enabled: false` (poster only) | ~90+ mobile |

> The frame sequence itself is the primary cost. Compress frames aggressively (`-q:v 75` in ffmpeg) and keep total size under 4 MB for best scores.

---

## Turning Off Demo Mode

```js
// src/data/siteConfig.js
demoMode: false,
```

This removes:
- `<meta name="robots" content="noindex, nofollow">`
- The "Sample website" footer note
- The ⚠️ disclaimer on the Reviews section

---

## Accessibility

- Semantic HTML (`<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, `<footer>`, `<blockquote>`, `<cite>`)
- ARIA: `role="dialog"` on lightbox/mobile menu, `aria-expanded`, `aria-live`, `role="progressbar"`
- Focus-visible outlines on all interactive elements
- Star ratings use `role="img"` + `aria-label`
- Keyboard navigation: Escape closes dialogs, arrow keys navigate lightbox
- All images have descriptive `alt` text

---

## Stack

| Package | Version | Purpose |
|---------|---------|---------|
| react | 19.x | UI |
| vite | 8.x | Build tool |
| gsap | 3.x | ScrollTrigger pinning |
| lenis | 1.x | Smooth scroll |
