import { useCallback, useEffect, useRef, useState } from "react";
import {
  getPhotoLightboxCopy,
  type PhotoLightboxLocale,
} from "../../lib/photo-lightbox-copy";

interface Photo {
  url: string;
  caption?: string;
}

export default function PhotoLightbox({
  photos,
  locale = "en",
  projectTitle,
}: {
  photos: Photo[];
  locale?: PhotoLightboxLocale;
  projectTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const touchStart = useRef(0);
  const triggerButton = useRef<HTMLButtonElement | null>(null);
  const closeButton = useRef<HTMLButtonElement | null>(null);
  const dialog = useRef<HTMLDivElement | null>(null);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % photos.length),
    [photos.length],
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + photos.length) % photos.length),
    [photos.length],
  );
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") close();
      else if (e.key === "Tab" && dialog.current) {
        const controls = dialog.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        const first = controls.item(0);
        const last = controls.item(controls.length - 1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
      triggerButton.current?.focus();
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
            onClick={(event) => {
              triggerButton.current = event.currentTarget;
              setIndex(i);
              setOpen(true);
            }}
            className="group relative aspect-[4/3] rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label={
              getPhotoLightboxCopy(
                locale,
                projectTitle,
                i,
                photos.length,
                photo.caption,
              ).thumbnail
            }
            aria-haspopup="dialog"
          >
            <img
              src={photo.url}
              alt={
                photo.caption ||
                (locale === "fr"
                  ? `Photo ${i + 1} du projet ${projectTitle}`
                  : `Photo ${i + 1} for ${projectTitle}`)
              }
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity text-sm font-medium">
                {locale === "fr" ? "Voir" : "View"}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center"
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-label={
            getPhotoLightboxCopy(
              locale,
              projectTitle,
              index,
              photos.length,
              photos[index].caption,
            ).dialog
          }
          onClick={close}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10">
            <span className="text-white/70 text-sm font-medium">
              {index + 1} / {photos.length}
            </span>
            <button
              ref={closeButton}
              onClick={close}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white text-xl"
              aria-label={
                getPhotoLightboxCopy(
                  locale,
                  projectTitle,
                  index,
                  photos.length,
                  photos[index].caption,
                ).close
              }
            >
              ✕
            </button>
          </div>

          {/* Image */}
          <div
            className="flex-1 flex items-center justify-center w-full px-16 py-20"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => {
              touchStart.current = e.touches[0].clientX;
            }}
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
              <p className="text-white/80 text-sm px-4">
                {photos[index].caption}
              </p>
            </div>
          )}

          {/* Navigation Arrows */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white text-2xl"
                aria-label={
                  getPhotoLightboxCopy(
                    locale,
                    projectTitle,
                    index,
                    photos.length,
                    photos[index].caption,
                  ).previous
                }
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white text-2xl"
                aria-label={
                  getPhotoLightboxCopy(
                    locale,
                    projectTitle,
                    index,
                    photos.length,
                    photos[index].caption,
                  ).next
                }
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setIndex(i);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${i === index ? "bg-white" : "bg-white/30 hover:bg-white/50"}`}
                  aria-label={
                    getPhotoLightboxCopy(
                      locale,
                      projectTitle,
                      i,
                      photos.length,
                      photos[i].caption,
                    ).goTo
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
