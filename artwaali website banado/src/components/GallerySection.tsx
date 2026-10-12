import React, { useState } from 'react';
import { X } from 'lucide-react';

const PHOTOS = [
  { src: '/images/ocean-table.jpg', alt: 'Ocean resin side table' },
  { src: '/images/shiva-glow-clock.jpg', alt: 'Glow-in-the-dark Shiva clock' },
  { src: '/images/name-plate.jpg', alt: 'Custom resin name plate' },
  { src: '/images/emerald-tray.jpg', alt: 'Emerald geode tray' },
  { src: '/images/panther.jpg', alt: 'Black panther resin sculpture' },
  { src: '/images/butterfly-magenta.jpg', alt: 'Magenta galaxy resin butterfly' },
  { src: '/images/butterfly-indigo.jpg', alt: 'Indigo midnight resin butterfly' },
];

const VIDEOS = [
  { src: '/videos/home-letters.mp4', poster: '/videos/home-letters.jpg', title: 'Every HOME deserves a touch of art' },
  { src: '/videos/tray-closeup.mp4', poster: '/videos/tray-closeup.jpg', title: 'Tray close-up' },
];

export const GallerySection: React.FC = () => {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="gallery" className="max-w-7xl mx-auto px-6 sm:px-12 py-24">
      <div className="text-center mb-12">
        <span className="text-[10px] font-medium tracking-[0.24em] uppercase text-[#C9A84C] block font-mono mb-3">
          Gallery
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#ddeaf8]">
          Moments from the <em className="italic text-[#7FFFD4]">studio</em>
        </h2>
      </div>

      {/* Videos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
        {VIDEOS.map((v) => (
          <figure key={v.src} className="rounded-xl overflow-hidden border border-[#4DC8C8]/20 bg-[#101c2b]">
            <video
              src={v.src}
              poster={v.poster}
              controls
              playsInline
              preload="metadata"
              className="w-full max-h-[520px] bg-black object-contain"
            />
            <figcaption className="px-4 py-3 text-xs text-[#7a9ab8]">{v.title}</figcaption>
          </figure>
        ))}
      </div>

      {/* Photos */}
      <div className="columns-2 md:columns-3 gap-4 space-y-4">
        {PHOTOS.map((p) => (
          <button
            key={p.src}
            onClick={() => setOpen(p.src)}
            className="block w-full overflow-hidden rounded-xl border border-[#4DC8C8]/20 hover:border-[#4DC8C8]/50 transition-colors break-inside-avoid"
          >
            <img src={p.src} alt={p.alt} loading="lazy" className="w-full h-auto block hover:scale-[1.03] transition-transform duration-500" />
          </button>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setOpen(null)}
        >
          <button className="absolute top-4 right-4 text-white" aria-label="Close">
            <X size={28} />
          </button>
          <img src={open} alt="" className="max-w-full max-h-full object-contain rounded-lg" />
        </div>
      )}
    </section>
  );
};
