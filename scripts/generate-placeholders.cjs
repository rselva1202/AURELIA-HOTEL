/**
 * Generates SVG placeholder images for the demo site.
 * Run once: node scripts/generate-placeholders.js
 */
const fs = require('fs');
const path = require('path');

const placeholders = [
  { file: 'about.webp',          label: 'About — Cliff View',         bg: '#1a7a7a', accent: '#2aa8a8' },
  { file: 'room-cliff-suite.webp', label: 'Cliff Suite',               bg: '#0f4f4f', accent: '#1a7a7a' },
  { file: 'room-heritage.webp',  label: 'Heritage Room',               bg: '#6b3a2a', accent: '#c05a2a' },
  { file: 'room-garden-villa.webp', label: 'Garden Villa',             bg: '#2d5a2d', accent: '#4a8a4a' },
  { file: 'room-sea-breeze.webp', label: 'Sea Breeze Room',            bg: '#1a6a8a', accent: '#2a9ac8' },
  { file: 'dining.webp',         label: 'Rooftop Dining',              bg: '#1a1a2a', accent: '#c05a2a' },
  { file: 'gallery-1.webp',      label: 'Infinity Pool at Dusk',       bg: '#0f4f4f', accent: '#2aa8a8' },
  { file: 'gallery-2.webp',      label: 'Heritage Room Interior',      bg: '#4a2a1a', accent: '#c05a2a' },
  { file: 'gallery-3.webp',      label: 'Rooftop Dining',              bg: '#1a1a1a', accent: '#e8a93a' },
  { file: 'gallery-4.webp',      label: 'Varkala Cliff Sunrise',       bg: '#1a5a8a', accent: '#f5a030' },
  { file: 'gallery-5.webp',      label: 'Ayurvedic Spa',               bg: '#3a5a3a', accent: '#a8d8a8' },
  { file: 'gallery-6.webp',      label: 'Sea-View Breakfast',          bg: '#5a4a2a', accent: '#f5e6c8' },
];

const outDir = path.join(__dirname, '..', 'public', 'images');
fs.mkdirSync(outDir, { recursive: true });

// poster frame placeholder
const posterDir = path.join(__dirname, '..', 'public', 'frames');
fs.mkdirSync(posterDir, { recursive: true });

function makeSVG(label, bg, accent) {
  // For .webp filenames we write an SVG — browsers will still render it
  // (rename to .svg in the src attrs during development if needed)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="${bg}"/>
  <rect y="450" width="800" height="150" fill="${accent}" opacity="0.25"/>
  <circle cx="400" cy="270" r="90" fill="${accent}" opacity="0.3"/>
  <text x="400" y="265" text-anchor="middle" font-family="Georgia,serif"
    font-size="22" fill="#f5e6c8" font-weight="bold">Aurelia Hotel</text>
  <text x="400" y="298" text-anchor="middle" font-family="sans-serif"
    font-size="13" fill="#a8d8d8" opacity="0.8">${label}</text>
  <text x="400" y="540" text-anchor="middle" font-family="sans-serif"
    font-size="11" fill="white" opacity="0.3">Replace with real photo</text>
</svg>`;
}

placeholders.forEach(({ file, label, bg, accent }) => {
  // Write as SVG content but with the .webp extension so the img src matches
  // In production these will be replaced with real WebP images
  const content = makeSVG(label, bg, accent);
  fs.writeFileSync(path.join(outDir, file), content, 'utf8');
  console.log(`✓ ${file}`);
});

// Poster frame
const posterSVG = makeSVG('Aurelia Hotel — Varkala Cliff', '#0f4f4f', '#1a7a7a');
fs.writeFileSync(path.join(posterDir, 'poster.webp'), posterSVG, 'utf8');
console.log('✓ frames/poster.webp (SVG placeholder)');

console.log('\nDone! Replace these SVG placeholders with real WebP images for production.');
