import { useState } from "react";

const videos = [
  {
    id: "vsz5ngv38RY",
    title: "Video Highlight 01",
    tag: "HIGHLIGHT",
    duration: "--:--",
  },
  {
    id: "k2xVMriYdFk",
    title: "Video Highlight 02",
    tag: "HIGHLIGHT",
    duration: "--:--",
  },
  {
    id: "ExxMvOoMWaQ",
    title: "Video Highlight 03",
    tag: "HIGHLIGHT",
    duration: "--:--",
  },
  {
    id: "0-i_5iaMP2Q",
    title: "Video Highlight 04",
    tag: "HIGHLIGHT",
    duration: "--:--",
  },
  {
    id: "7Sf32gdLpjw",
    title: "Video Highlight 05",
    tag: "HIGHLIGHT",
    duration: "--:--",
  },
  {
    id: "dXPhRNjL84s",
    title: "Video Highlight 06",
    tag: "HIGHLIGHT",
    duration: "--:--",
  },
];

function VideoCard({
  video,
  isActive,
  onClick,
}: {
  video: (typeof videos)[0];
  isActive: boolean;
  onClick: () => void;
}) {
  const [playing, setPlaying] = useState(false);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaying(true);
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        border: isActive ? "2px solid #C24F1D" : "2px solid transparent",
        boxShadow: isActive ? "0 8px 32px rgba(194,79,29,0.25)" : "none",
      }}
      onClick={onClick}
    >
      {playing ? (
        <div style={{ aspectRatio: "16/9" }}>
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ display: "block", border: "none" }}
          />
        </div>
      ) : (
        <div style={{ position: "relative", aspectRatio: "16/9", backgroundColor: "#0A1628" }}>
          {/* Thumbnail */}
          <img
            src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
            alt={video.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.75 }}
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              img.onerror = null; // prevent infinite loop if fallback also fails
              img.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
            }}
          />
          {/* Dark overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(10,22,40,0.85) 0%, rgba(10,22,40,0.2) 60%, transparent 100%)" }}
          />
          {/* Tag */}
          <div className="absolute top-3 left-3">
            <span
              className="px-2 py-1 rounded"
              style={{ backgroundColor: "#C24F1D", color: "#fff", fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em" }}
            >
              {video.tag}
            </span>
          </div>
          {/* Duration */}
          <div className="absolute top-3 right-3">
            <span
              className="px-2 py-1 rounded"
              style={{ backgroundColor: "rgba(0,0,0,0.7)", color: "#fff", fontSize: "10px", fontWeight: 600 }}
            >
              {video.duration}
            </span>
          </div>
          {/* Play button */}
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            style={{ background: "none", border: "none" }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200"
              style={{ backgroundColor: "rgba(194,79,29,0.9)", backdropFilter: "blur(4px)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#C24F1D")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "rgba(194,79,29,0.9)")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
          {/* Title */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p style={{ color: "#fff", fontSize: "13px", fontWeight: 600, lineHeight: 1.4 }}>
              {video.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const COLS = 3;

export function VideoGallery() {
  const [page, setPage] = useState(0);
  const [active, setActive] = useState(0);
  const totalPages = Math.ceil(videos.length / COLS);
  const visibleVideos = videos.slice(page * COLS, page * COLS + COLS);

  return (
    <section id="videos" className="w-full py-20" style={{ backgroundColor: "#0A1628" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div style={{ width: "40px", height: "3px", backgroundColor: "#C9933A" }} />
              <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: "#C9933A" }}>
                VIDEO HIGHLIGHTS
              </span>
            </div>
            <h2
              style={{
                fontSize: "clamp(22px, 3.5vw, 38px)",
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.15,
              }}
            >
              Watch{" "}
              <span style={{ color: "#C9933A" }}>2026 Highlights</span>
            </h2>
          </div>

          {/* Prev/Next controls */}
          <div className="flex items-center gap-3">
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
              {page + 1} / {totalPages}
            </span>
            {[
              { disabled: page === 0, action: () => setPage(page - 1), icon: "M15 18l-6-6 6-6" },
              { disabled: page >= totalPages - 1, action: () => setPage(page + 1), icon: "M9 18l6-6-6-6" },
            ].map(({ disabled, action, icon }, i) => (
              <button
                key={i}
                onClick={action}
                disabled={disabled}
                className="w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: disabled ? "rgba(255,255,255,0.05)" : "#C24F1D",
                  border: "none",
                  color: disabled ? "#4b5563" : "#fff",
                  cursor: disabled ? "not-allowed" : "pointer",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d={icon} />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {visibleVideos.map((video, i) => {
            const realIdx = page * COLS + i;
            return (
              <VideoCard
                key={video.id}
                video={video}
                isActive={active === realIdx}
                onClick={() => setActive(realIdx)}
              />
            );
          })}
        </div>

        {/* Dot nav */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              style={{
                width: i === page ? "28px" : "8px",
                height: "8px",
                borderRadius: "4px",
                backgroundColor: i === page ? "#C24F1D" : "rgba(255,255,255,0.2)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        {/* YouTube CTA */}
        <div className="flex justify-center mt-10">
          <a
            href="https://www.youtube.com/@RakshaUni"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-200"
            style={{
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#e2e8f0",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <svg width="20" height="14" viewBox="0 0 20 14" fill="#C24F1D">
              <path d="M19.6 2.2C19.4 1.4 18.8.8 18 .6 16.4.2 10 .2 10 .2S3.6.2 2 .6C1.2.8.6 1.4.4 2.2 0 3.8 0 7 0 7s0 3.2.4 4.8c.2.8.8 1.4 1.6 1.6C3.6 13.8 10 13.8 10 13.8s6.4 0 8-.4c.8-.2 1.4-.8 1.6-1.6C20 10.2 20 7 20 7s0-3.2-.4-4.8zM8 10V4l5.3 3L8 10z" />
            </svg>
            View all videos on YouTube
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}