// ─────────────────────────────────────────────
//  AURELIA HOTEL — Site Configuration
//  All text, colours, prices, images and settings live here.
//  Set demoMode: true to show "Sample Website" notices.
// ─────────────────────────────────────────────

const siteConfig = {
  // ── Demo / meta ──────────────────────────────
  demoMode: true,                     // shows footer badge + noindex meta
  brandName: "Aurelia Hotel",
  tagline: "Where the cliff meets the sea",
  location: "Varkala, Kerala, India",

  seo: {
    title: "Aurelia Hotel — Cliff Resort in Varkala, Kerala",
    description:
      "A boutique cliff-top resort in Varkala, Kerala. Ocean-view rooms, farm-to-table dining and sunset terraces perched above the Arabian Sea.",
    ogImage: "/frames/poster.webp",
    siteUrl: "https://aureliahotel.com",   // update for production
    favicon: "/favicon.svg",
  },

  // ── Contact & WhatsApp ───────────────────────
  contact: {
    whatsapp: "+916369403544",         // international format, no spaces
    email: "hello@aureliahotel.com",
    phone: "+91 63694 03544",
    address: "Cliff Side, Varkala Beach Road, Varkala, Kerala 695141",
    googleMapsUrl:
      "https://maps.google.com/?q=Varkala+Cliff+Kerala+India",
    googleMapsEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3942.123456789!2d76.715!3d8.733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwNDMnNTkuNiJOIDc2wrA0Myc1NC4wIkU!5e0!3m2!1sen!2sin!4v1600000000000",
  },

  // ── Colours (CSS custom properties fed in via index.css) ──
  palette: {
    teal:      "#1a7a7a",
    tealLight: "#2aa8a8",
    tealDark:  "#0f4f4f",
    sand:      "#f5e6c8",
    sandDark:  "#e8d4a0",
    laterite:  "#c05a2a",
    lateriteLight: "#e07040",
    seafoam:   "#a8d8d8",
    ivory:     "#fdf8f0",
    dark:      "#1a1a1a",
    text:      "#2d2d2d",
    textLight: "#666666",
  },

  // ── Typography ───────────────────────────────
  fonts: {
    display: "'Playfair Display', Georgia, serif",
    body:    "'Inter', system-ui, sans-serif",
  },

  // ── Hero / Frame Sequence ────────────────────
  hero: {
    // Set enabled: false to replace the canvas hero with a static poster + parallax
    enabled: true,
    frames: {
      desktop: { path: "/frames/desktop/", count: 120, ext: "webp" },
      mobile:  { path: "/frames/mobile/",  count: 100, ext: "webp" },
      poster:  "/frames/poster.webp",
    },
    // Text steps: [ progress-start, progress-end, text ]
    steps: [
      { from: 0.00, to: 0.30, text: "Where the cliff meets the sea" },
      { from: 0.35, to: 0.65, text: "Rooms with a view" },
      { from: 0.70, to: 0.98, text: "Sunset on the terrace" },
    ],
    // Canvas DPR cap (keeps memory sane on Retina screens)
    dprCap: 1.5,
    // Smoothing factor for frame interpolation (0 = instant, 1 = no movement)
    smoothing: 0.12,
    // Frames to preload before showing the hero
    preloadInitial: 0.20,   // 20% of total frame count
  },

  // ── About section ────────────────────────────
  about: {
    heading: "A cliff-top haven above the Arabian Sea",
    body: [
      "Aurelia Hotel sits on the edge of Varkala's ancient laterite cliff, 30 metres above the turquoise waters of the Arabian Sea. Here, the air smells of salt and cardamom, and the horizon belongs to you.",
      "Designed with local Keralan craftsmanship — timber, laterite stone and hand-woven textiles — every corner of Aurelia is a quiet conversation between the land and the sea.",
    ],
    image: "/images/about.webp",
    stats: [
      { value: "30m", label: "Above sea level" },
      { value: "18", label: "Ocean-view rooms" },
      { value: "5★", label: "Cliff-side dining" },
    ],
  },

  // ── Rooms ─────────────────────────────────────
  rooms: [
    {
      id: "cliff-suite",
      name: "Cliff Suite",
      description:
        "Floor-to-ceiling glass, a private plunge pool and a 180° panorama of the Arabian Sea. Wake up to the horizon.",
      priceINR: 18500,
      priceLabel: "₹18,500 / night",
      image: "/images/room-cliff-suite.webp",
      badge: "Most Popular",
      amenities: ["Private plunge pool", "King bed", "Ocean view", "Sea-facing balcony"],
    },
    {
      id: "heritage-room",
      name: "Heritage Room",
      description:
        "Exposed laterite walls, hand-turned teak furniture and a bathtub that frames the sunset perfectly.",
      priceINR: 9800,
      priceLabel: "₹9,800 / night",
      image: "/images/room-heritage.webp",
      badge: null,
      amenities: ["Soaking tub", "Queen bed", "Garden terrace", "Heritage decor"],
    },
    {
      id: "garden-villa",
      name: "Garden Villa",
      description:
        "A private cottage set in a fragrant spice garden, steps from the cliff-edge infinity pool.",
      priceINR: 12500,
      priceLabel: "₹12,500 / night",
      image: "/images/room-garden-villa.webp",
      badge: null,
      amenities: ["Private garden", "King bed", "Outdoor shower", "Pool access"],
    },
    {
      id: "sea-breeze",
      name: "Sea Breeze Room",
      description:
        "Light, breezy and perfectly positioned to catch the evening trade winds off the sea.",
      priceINR: 6500,
      priceLabel: "₹6,500 / night",
      image: "/images/room-sea-breeze.webp",
      badge: "Best Value",
      amenities: ["Sea view", "Twin / Queen bed", "Open-air shower", "Balcony"],
    },
  ],

  // ── Amenities ─────────────────────────────────
  amenities: [
    { icon: "🌊", title: "Infinity Pool", desc: "Cliff-edge pool merging into the Arabian Sea horizon" },
    { icon: "🧘", title: "Ayurvedic Spa", desc: "Traditional Keralan treatments with organic oils" },
    { icon: "🍃", title: "Spice Garden", desc: "Walk through cardamom, pepper and vanilla vines" },
    { icon: "🚤", title: "Sea Activities", desc: "Kayaking, snorkelling and sunset cruises" },
    { icon: "📚", title: "Library Lounge", desc: "Curated reads, board games and hammocks" },
    { icon: "🍽️", title: "Rooftop Dining", desc: "Farm-to-table Keralan cuisine, open to the sky" },
  ],

  // ── Dining ────────────────────────────────────
  dining: {
    heading: "Eat with the sea below you",
    description:
      "Our kitchen celebrates the Malabar coast — fresh catch from the morning boats, coconut curries from generations-old recipes, and a wine list as deep as the sea below.",
    highlights: [
      { name: "The Cliff Table", desc: "Fine Keralan tasting menus at the very edge of the cliff" },
      { name: "Tide Café", desc: "All-day café with filter coffee, coconut pancakes and sea views" },
      { name: "Sundowner Bar", desc: "Craft cocktails and small plates as the sun melts into the Arabian Sea" },
    ],
    image: "/images/dining.webp",
  },

  // ── Gallery ────────────────────────────────────
  gallery: [
    { src: "/images/gallery-1.webp", alt: "Cliff-edge infinity pool at dusk" },
    { src: "/images/gallery-2.webp", alt: "Heritage room interior with laterite walls" },
    { src: "/images/gallery-3.webp", alt: "Rooftop dining under the stars" },
    { src: "/images/gallery-4.webp", alt: "Varkala cliff sunrise" },
    { src: "/images/gallery-5.webp", alt: "Ayurvedic spa treatment room" },
    { src: "/images/gallery-6.webp", alt: "Sea-view breakfast spread" },
  ],

  // ── Reviews ────────────────────────────────────
  reviews: [
    {
      name: "Priya Nair",
      location: "Bangalore",
      rating: 5,
      text: "Waking up to the cliff view in the Suite was genuinely life-changing. The Ayurvedic massage was the best I've had anywhere in Kerala.",
      date: "September 2026",
    },
    {
      name: "James & Sophie",
      location: "London, UK",
      rating: 5,
      text: "We honeymooned here and can't imagine a more perfect place. The cliff-edge dinners, the sound of waves below — pure magic.",
      date: "August 2026",
    },
    {
      name: "Arjun Menon",
      location: "Dubai",
      rating: 5,
      text: "The attention to detail is exceptional — from the locally sourced breakfast to the hand-painted tiles in the bathroom. Aurelia sets a new benchmark.",
      date: "October 2026",
    },
  ],

  // ── FAQ ────────────────────────────────────────
  faq: [
    {
      q: "How do I reach Aurelia Hotel?",
      a: "We are a 15-minute drive from Varkala Railway Station and 90 minutes from Trivandrum International Airport. We offer complimentary airport transfers for Cliff Suite guests.",
    },
    {
      q: "What is the check-in / check-out time?",
      a: "Check-in is from 2 PM. Check-out is by 11 AM. Early check-in and late check-out are subject to availability and can be arranged via WhatsApp.",
    },
    {
      q: "Do you accept direct bookings?",
      a: "Yes — and we give the best rate for direct bookings. Enquire via WhatsApp or email and we'll confirm within 2 hours.",
    },
    {
      q: "Is the property suitable for families?",
      a: "Absolutely. We have garden villas with connecting rooms and a separate children's pool area. Under-5s stay free.",
    },
    {
      q: "What are the nearest beaches?",
      a: "Varkala Beach is directly below the cliff, accessible by steps. Papanasam Beach is 3 km away. We can arrange guided trips.",
    },
  ],

  // ── Footer ─────────────────────────────────────
  footer: {
    tagline: "Perched on the edge of forever.",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Sitemap", href: "#" },
    ],
    socialLinks: [
      { platform: "Instagram", href: "#", icon: "📷" },
      { platform: "Facebook",  href: "#", icon: "📘" },
    ],
    copyright: `© ${new Date().getFullYear()} Aurelia Hotel. All rights reserved.`,
    demoNote: "Sample website — not a real booking portal. For demonstration purposes only.",
  },
};

export default siteConfig;
