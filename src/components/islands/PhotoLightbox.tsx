import { useState, useEffect, useCallback, useRef } from 'react';

interface Photo {
  url: string;
  caption?: string;
}

export default function PhotoLightbox({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const touchStart = useRef(0);

  const next = useCallback(() => setIndex(i => (i + 1) % photos.length), [photos.length]);
  const prev = useCallback(() => setIndex(i => (i - 1 + photos.length) % photos.length), [photos.length]);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, next, prev, close]);

  if (!photos?.length) return null;

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {photos.map((photo, i) => (
          <button
            key={i}
            onClick={() => { setIndex(i); setOpen(true); }}
            className="group relative aspect-[4/3] rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <img
              src={photo.url}
              alt={photo.caption || `Photo ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">View</span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center"
          onClick={close}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10">
            <span className="text-white/70 text-sm font-medium">{index + 1} / {photos.length}</span>
            <button
              onClick={close}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white text-xl"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Image */}
          <div
            className="flex-1 flex items-center justify-center w-full px-16 py-20"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              const diff = touchStart.current - e.changedTouches[0].clientX;
              if (diff > 50) next();
              else if (diff < -50) prev();
            }}
          >
            <img
              src={photos[index].url}
              alt={photos[index].caption || `Photo ${index + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg select-none"
              draggable={false}
            />
          </div>

          {/* Caption */}
          {photos[index].caption && (
            <div className="absolute bottom-16 left-0 right-0 text-center">
              <p className="text-white/80 text-sm px-4">{photos[index].caption}</p>
            </div>
          )}

          {/* Navigation Arrows */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white text-2xl"
                aria-label="Previous photo"
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white text-2xl"
                aria-label="Next photo"
              >
                ›
              </button>
            </>
          )}

          {/* Dots */}
          {photos.length > 1 && photos.length <= 10 && (
            <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-1.5">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setIndex(i); }}
                  className={`w-2 h-2 rounded-full transition-colors ${i === index ? 'bg-white' : 'bg-white/30 hover:bg-white/50'}`}
                  aria-label={`Go to photo ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
