import { useState, useCallback, useEffect, useRef } from "react";
import img1 from "../../../Assets/066A6616.JPG";
import img2 from "../../../Assets/066A6619.JPG";
import img3 from "../../../Assets/066A6640.JPG";
import img4 from "../../../Assets/066A6648.JPG";
import img5 from "../../../Assets/066A6652.JPG";
import img6 from "../../../Assets/066A6666.JPG";
import img7 from "../../../Assets/066A6713.JPG";

const photos = [
  { src: img1, caption: "Defence Attaché Roundtable — RRU 2026", tag: "Gallery" },
  { src: img2, caption: "Defence Attaché Roundtable — RRU 2026", tag: "Gallery" },
  { src: img3, caption: "Defence Attaché Roundtable — RRU 2026", tag: "Gallery" },
  { src: img4, caption: "Defence Attaché Roundtable — RRU 2026", tag: "Gallery" },
  { src: img5, caption: "Defence Attaché Roundtable — RRU 2026", tag: "Gallery" },
  { src: img6, caption: "Defence Attaché Roundtable — RRU 2026", tag: "Gallery" },
  { src: img7, caption: "Defence Attaché Roundtable — RRU 2026", tag: "Gallery" },
];

const THUMB_VISIBLE = 7;

export function PhotoGallery() {
  const [active, setActive] = useState(0);
  const [thumbStart, setThumbStart] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  // Track which images have finished loading so we can show skeleton until ready
  const [loaded, setLoaded] = useState<boolean[]>(Array(photos.length).fill(false));

  const goTo = useCallback(
    (idx: number) => {
      setActive(idx);
      if (idx >= thumbStart + THUMB_VISIBLE) setThumbStart(idx - THUMB_VISIBLE + 1);
      else if (idx < thumbStart) setThumbStart(idx);
    },
    [thumbStart]
  );

  const prev = () => goTo((active - 1 + photos.length) % photos.length);
  const next = () => goTo((active + 1) % photos.length);

  const markLoaded = useCallback((idx: number) => {
    setLoaded((prev) => {
      if (prev[idx]) return prev;
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  }, []);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox !== null) {
        if (e.key === "ArrowLeft") setLightbox((l) => (l! - 1 + photos.length) % photos.length);
        if (e.key === "ArrowRight") setLightbox((l) => (l! + 1) % photos.length);
        if (e.key === "Escape") setLightbox(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const visibleThumbs = photos.slice(thumbStart, thumbStart + THUMB_VISIBLE);

  return (
    <section id="gallery" className="w-full py-20" style={{ backgroundColor: "#f9f7f4" }}>
      {/* Shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div style={{ width: "40px", height: "3px", backgroundColor: "#C24F1D" }} />
              <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: "#C24F1D" }}>
                PHOTO GALLERY
              </span>
            </div>
            <h2
              style={{
                fontSize: "clamp(22px, 3.5vw, 38px)",
                fontWeight: 800,
                color: "#0A1628",
                lineHeight: 1.15,
              }}
            >
              Relive the{" "}
              <span style={{ color: "#C24F1D" }}>Moments</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: "13px", color: "#9ca3af", fontWeight: 600 }}>
              {String(active + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Main viewer — all images stacked, only active one is visible */}
        <div
          className="relative rounded-2xl overflow-hidden mb-4"
          style={{ aspectRatio: "16/7", backgroundColor: "#1a2a40" }}
        >
          {/* Shimmer skeleton shown while active image is still decoding */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, #1a2a40 25%, #243550 50%, #1a2a40 75%)",
              backgroundSize: "200% 100%",
              animation: loaded[active] ? "none" : "shimmer 1.4s infinite",
              opacity: loaded[active] ? 0 : 1,
              transition: "opacity 0.3s ease",
              zIndex: 0,
            }}
          />

          {/* All images pre-rendered, toggled via opacity for zero-flicker navigation */}
          {photos.map((photo, idx) => (
            <img
              key={idx}
              src={photo.src}
              alt={photo.caption}
              decoding="async"
              fetchPriority={idx === 0 ? "high" : "low"}
              onLoad={() => markLoaded(idx)}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                opacity: idx === active ? 1 : 0,
                transition: "opacity 0.35s ease",
                zIndex: idx === active ? 1 : 0,
                willChange: "opacity",
              }}
            />
          ))}

          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(10,22,40,0.75) 0%, transparent 50%)",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />

          {/* Caption */}
          <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between" style={{ zIndex: 3 }}>
            <div>
              <span
                className="inline-block px-2 py-1 rounded mb-2"
                style={{
                  backgroundColor: "#C24F1D",
                  color: "#fff",
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                }}
              >
                {photos[active].tag.toUpperCase()}
              </span>
              <p style={{ color: "#fff", fontSize: "15px", fontWeight: 600 }}>
                {photos[active].caption}
              </p>
            </div>

            {/* Expand button */}
            <button
              onClick={() => setLightbox(active)}
              className="rounded-lg flex items-center gap-2 px-3 py-2 cursor-pointer"
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff",
                fontSize: "11px",
                fontWeight: 600,
                backdropFilter: "blur(4px)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
              Expand
            </button>
          </div>

          {/* Prev / Next arrows */}
          {[
            { dir: "prev", action: prev, icon: "M15 18l-6-6 6-6", side: "left-4" },
            { dir: "next", action: next, icon: "M9 18l6-6-6-6", side: "right-4" },
          ].map(({ dir, action, icon, side }) => (
            <button
              key={dir}
              onClick={action}
              className={`absolute top-1/2 -translate-y-1/2 ${side} w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200`}
              style={{ zIndex: 4, backgroundColor: "rgba(10,22,40,0.65)", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", color: "#fff" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#C24F1D";
                (e.currentTarget as HTMLElement).style.borderColor = "#C24F1D";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(10,22,40,0.65)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d={icon} />
              </svg>
            </button>
          ))}

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: "rgba(255,255,255,0.15)", zIndex: 3 }}>
            <div
              style={{
                height: "100%",
                width: `${((active + 1) / photos.length) * 100}%`,
                backgroundColor: "#C24F1D",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="flex items-center gap-3">
          {/* Thumb prev */}
          <button
            onClick={() => setThumbStart(Math.max(0, thumbStart - 1))}
            disabled={thumbStart === 0}
            className="flex items-center justify-center flex-shrink-0 transition-all duration-200"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              backgroundColor: thumbStart === 0 ? "rgba(0,0,0,0.04)" : "#C24F1D",
              color: thumbStart === 0 ? "rgba(0,0,0,0.25)" : "#fff",
              border: thumbStart === 0 ? "1.5px solid rgba(0,0,0,0.12)" : "1.5px solid #C24F1D",
              cursor: thumbStart === 0 ? "not-allowed" : "pointer",
              boxShadow: thumbStart === 0 ? "none" : "0 4px 14px rgba(194,79,29,0.35)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Thumbnails */}
          <div className="flex gap-2 flex-1 overflow-hidden">
            {visibleThumbs.map((photo, i) => {
              const realIdx = thumbStart + i;
              const isActive = realIdx === active;
              return (
                <button
                  key={realIdx}
                  onClick={() => goTo(realIdx)}
                  className="flex-1 rounded-lg overflow-hidden cursor-pointer relative"
                  style={{
                    aspectRatio: "16/9",
                    border: isActive ? "2px solid #C24F1D" : "2px solid transparent",
                    transition: "border-color 0.2s",
                    padding: 0,
                    background: "none",
                  }}
                >
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: isActive ? 1 : 0.55,
                      transition: "opacity 0.2s",
                    }}
                  />
                  {isActive && (
                    <div
                      className="absolute inset-0"
                      style={{ background: "rgba(194,79,29,0.15)" }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Thumb next */}
          <button
            onClick={() => setThumbStart(Math.min(photos.length - THUMB_VISIBLE, thumbStart + 1))}
            disabled={thumbStart >= photos.length - THUMB_VISIBLE}
            className="flex items-center justify-center flex-shrink-0 transition-all duration-200"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              backgroundColor: thumbStart >= photos.length - THUMB_VISIBLE ? "rgba(0,0,0,0.04)" : "#C24F1D",
              color: thumbStart >= photos.length - THUMB_VISIBLE ? "rgba(0,0,0,0.25)" : "#fff",
              border: thumbStart >= photos.length - THUMB_VISIBLE ? "1.5px solid rgba(0,0,0,0.12)" : "1.5px solid #C24F1D",
              cursor: thumbStart >= photos.length - THUMB_VISIBLE ? "not-allowed" : "pointer",
              boxShadow: thumbStart >= photos.length - THUMB_VISIBLE ? "none" : "0 4px 14px rgba(194,79,29,0.35)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Dot indicators with arrows */}
        <div className="flex justify-center items-center gap-4 mt-6">
          {/* Prev arrow */}
          <button
            onClick={prev}
            className="flex items-center justify-center transition-all duration-200"
            style={{
              width: "38px", height: "38px", borderRadius: "50%",
              backgroundColor: "#C24F1D", border: "none",
              color: "#fff", cursor: "pointer",
              boxShadow: "0 4px 12px rgba(194,79,29,0.35)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="rounded-full cursor-pointer transition-all duration-200"
                style={{
                  width: i === active ? "24px" : "8px",
                  height: "8px",
                  backgroundColor: i === active ? "#C24F1D" : "#d1d5db",
                  border: "none",
                  padding: 0,
                }}
              />
            ))}
          </div>

          {/* Next arrow */}
          <button
            onClick={next}
            className="flex items-center justify-center transition-all duration-200"
            style={{
              width: "38px", height: "38px", borderRadius: "50%",
              backgroundColor: "#C24F1D", border: "none",
              color: "#fff", cursor: "pointer",
              boxShadow: "0 4px 12px rgba(194,79,29,0.35)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)" }}
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-5xl w-full mx-6"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[lightbox].src}
              alt={photos[lightbox].caption}
              style={{ width: "100%", borderRadius: "12px", maxHeight: "80vh", objectFit: "contain" }}
            />
            <p className="text-center mt-4" style={{ color: "#e2e8f0", fontSize: "14px" }}>
              {photos[lightbox].caption}
            </p>

            {/* Lightbox controls */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: "#C24F1D", color: "#fff", border: "none" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            {[
              { action: () => setLightbox((l) => (l! - 1 + photos.length) % photos.length), icon: "M15 18l-6-6 6-6", pos: "-left-14" },
              { action: () => setLightbox((l) => (l! + 1) % photos.length), icon: "M9 18l6-6-6-6", pos: "-right-14" },
            ].map(({ action, icon, pos }, i) => (
              <button
                key={i}
                onClick={action}
                className={`absolute top-1/2 -translate-y-1/2 ${pos} w-12 h-12 rounded-full flex items-center justify-center cursor-pointer`}
                style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d={icon} />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}