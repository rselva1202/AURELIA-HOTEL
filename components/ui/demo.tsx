import { TiltedGridHero } from "@/components/ui/tilted-grid-hero";

const HOTEL_IMAGES = [
  {
    src: "./images/gallery-1.webp",
    alt: "Infinity Pool merging into the Arabian Sea at dusk",
  },
  {
    src: "./images/room-cliff-suite.webp",
    alt: "Cliff Suite with private plunge pool",
  },
  {
    src: "./images/gallery-3.webp",
    alt: "Candlelit cliffside dining overlooking the waves",
  },
  {
    src: "./images/gallery-5.webp",
    alt: "Ayurvedic spa sanctuary and herbal therapy",
  },
  {
    src: "./images/gallery-4.webp",
    alt: "Panoramic Varkala red cliff coastline sunrise",
  },
  {
    src: "./images/gallery-2.webp",
    alt: "Heritage room with exposed laterite stone and copper bath",
  },
  {
    src: "./images/gallery-6.webp",
    alt: "Tropical terrace breakfast facing the Arabian sea",
  },
  {
    src: "./images/about.webp",
    alt: "Aurelia Hotel architecture perched on Varkala cliff",
  },
  {
    src: "./images/room-garden-villa.webp",
    alt: "Secluded garden villa among coconut palms",
  },
  {
    src: "./images/room-sea-breeze.webp",
    alt: "Airy sea breeze suite with oceanfront balcony",
  },
];

export default function TiltedGridHeroDemo() {
  return (
    <TiltedGridHero
      images={HOTEL_IMAGES}
      className="h-[560px] w-full rounded-2xl border border-[rgba(223,194,126,0.3)] bg-[#082326]"
      tileHeight={30}
      aspectRatio={16 / 9}
      speed={4.5}
      curve={78}
    >
      <div className="relative z-10 flex h-full flex-col items-center justify-between py-12 text-center pointer-events-none">
        <div className="px-6">
          <span className="text-xs uppercase tracking-[0.28em] text-[#A8D8D8] font-semibold">
            Visual Narrative · 3D Cylindrical Stream
          </span>
          <h2 className="mt-3 text-balance font-serif text-4xl font-normal tracking-tight text-[#F5E6C8] sm:text-5xl">
            A Glimpse of Aurelia
          </h2>
        </div>
        <p className="max-w-md text-balance px-6 text-sm text-[#A8D8D8]/80">
          Where the red cliff meets the turquoise sea — an infinite horizon of coastal memories.
        </p>
      </div>
    </TiltedGridHero>
  );
}
