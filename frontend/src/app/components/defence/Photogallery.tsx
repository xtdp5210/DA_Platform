import { useState, useCallback, useEffect } from "react";

const photos = [
  {
    src: "https://images.unsplash.com/photo-1596700209466-85b32a38ab5a?w=1200&q=80",
    caption: "Inaugural Ceremony — Defence Attaché Roundtable 2026",
    tag: "Ceremony",
  },
  {
    src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80",
    caption: "Keynote Address — India's Defence Vision 2030",
    tag: "Keynote",
  },
  {
    src: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200&q=80",
    caption: "Session I — Policy Reforms & Global Integration",
    tag: "Session",
  },
  {
    src: "https://images.unsplash.com/photo-1591696331111-ef9586a5b17a?w=1200&q=80",
    caption: "Indigenous Defence Exposition — Live Demonstrations",
    tag: "Exposition",
  },
  {
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
    caption: "Networking Dinner — Defence Leadership",
    tag: "Networking",
  },
  {
    src: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&q=80",
    caption: "B2B Meetings — Procurement & Co-development",
    tag: "Business",
  },
  {
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    caption: "Start-up Pitch Sessions — iDEX Innovators",
    tag: "Innovation",
  },
  {
    src: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=1200&q=80",
    caption: "School & Laboratory Visits — RRU Lavad Campus",
    tag: "Campus",
  },
  {
    src: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80",
    caption: "Defence Attachés in Bilateral Discussions",
    tag: "Diplomacy",
  },
  {
    src: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80",
    caption: "Company Showcases — DPSU Live Demonstrations",
    tag: "Industry",
  },
  {
    src: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1200&q=80",
    caption: "High-Level Panel Discussion — Strategic Cooperation",
    tag: "Panel",
  },
  {
    src: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&q=80",
    caption: "Drone Technology Showcase — Autonomous Systems",
    tag: "Technology",
  },
];

const THUMB_VISIBLE = 6;

export function PhotoGallery() {
  const [active, setActive] = useState(0);
  const [thumbStart, setThumbStart] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [fade, setFade] = useState(true);

  const goTo = useCallback(
    (idx: number) => {
      setFade(false);
      setTimeout(() => {
        setActive(idx);
        setFade(true);
        // Scroll thumbs so active is visible
        if (idx >= thumbStart + THUMB_VISIBLE) setThumbStart(idx - THUMB_VISIBLE + 1);
        else if (idx < thumbStart) setThumbStart(idx);
      }, 180);
    },
    [thumbStart]
  );

  const prev = () => goTo((active - 1 + photos.length) % photos.length);
  const next = () => goTo((active + 1) % photos.length);

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

        {/* Main viewer */}
        <div className="relative rounded-2xl overflow-hidden mb-4" style={{ aspectRatio: "16/7" }}>
          {/* Image */}
          <img
            src={photos[active].src}
            alt={photos[active].caption}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: fade ? 1 : 0,
              transition: "opacity 0.18s ease",
            }}
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(10,22,40,0.75) 0%, transparent 50%)",
            }}
          />

          {/* Caption */}
          <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
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
              style={{
                backgroundColor: "rgba(10,22,40,0.65)",
                border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(8px)",
                color: "#fff",
              }}
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
          <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
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
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer"
            style={{
              backgroundColor: thumbStart === 0 ? "#e5e7eb" : "#0A1628",
              color: thumbStart === 0 ? "#9ca3af" : "#fff",
              border: "none",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer"
            style={{
              backgroundColor: thumbStart >= photos.length - THUMB_VISIBLE ? "#e5e7eb" : "#0A1628",
              color: thumbStart >= photos.length - THUMB_VISIBLE ? "#9ca3af" : "#fff",
              border: "none",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mt-6">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="rounded-full cursor-pointer transition-all duration-200"
              style={{
                width: i === active ? "24px" : "6px",
                height: "6px",
                backgroundColor: i === active ? "#C24F1D" : "#d1d5db",
                border: "none",
                padding: 0,
              }}
            />
          ))}
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