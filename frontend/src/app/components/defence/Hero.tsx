import { memo, useCallback, useEffect, useRef, useState } from "react";
import heroVideo from "../../../Assets/Hero_Section.mp4";

// Static data — defined outside component so it's never re-allocated
const SVG_LINES = Array.from({ length: 10 }, (_, i) => i);

// Helper function to calculate time left until event
function getTimeLeft() {
  const eventDate = new Date("2026-03-16T09:00:00+05:30");
  const now = new Date();
  const diff = eventDate.getTime() - now.getTime();
  const totalSeconds = Math.max(0, Math.floor(diff / 1000));
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

// memo: only re-renders when value or label actually changes (not every second tick)
const CountdownUnit = memo(function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center px-1 sm:px-4 py-2 sm:py-3" style={{ minWidth: "52px" }}>
      <div
        className="rounded-lg flex items-center justify-center mb-1"
        style={{
          width: "clamp(44px, 12vw, 64px)",
          height: "clamp(44px, 12vw, 64px)",
          backgroundColor: "rgba(194,79,29,0.92)",
          border: "2px solid rgba(201,147,58,0.5)",
        }}
      >
        <span style={{ fontSize: "clamp(18px, 5vw, 28px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span style={{ fontSize: "clamp(7px, 2vw, 9px)", fontWeight: 700, color: "#C9933A", letterSpacing: "0.12em" }}>
        {label}
      </span>
    </div>
  );
});

export function Hero({ onRegister }: { onRegister?: () => void }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Loop video with Intersection Observer — only play when visible
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let startTime = Date.now();

    const handleTimeUpdate = () => {
      if (video.currentTime >= 9) {
        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed < 20) {
          video.currentTime = 6;
        } else {
          video.currentTime = 0;
          startTime = Date.now();
        }
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    // Only start playing when section enters viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(video);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      observer.disconnect();
    };
  }, []);

  const scrollTo = useCallback((href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section
      id="home"
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{ height: "100vh", minHeight: "600px", contain: "layout paint" }}
    >
      {/* ── Video Background ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Fallback background shown instantly while video loads */}
        {!videoReady && (
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #050e1c 0%, #0A1628 50%, #0d1f3c 100%)",
              zIndex: 1,
            }}
          />
        )}

        <video
          ref={videoRef}
          src={heroVideo}
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full"
          onCanPlay={() => setVideoReady(true)}
          style={{
            objectFit: "cover",
            objectPosition: "center",
            transform: "translateZ(0)",
            willChange: "transform",
            opacity: videoReady ? 1 : 0,
            transition: "opacity 0.8s ease",
            zIndex: 0,
          }}
        />

        {/* Layer 1 – light vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.05) 0%, rgba(5,14,28,0.32) 100%)",
          }}
        />

        {/* Layer 2 – bottom fade so countdown/CTA remain readable */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(5,14,28,0.55) 0%, rgba(5,14,28,0.15) 40%, transparent 100%)",
          }}
        />

        {/* Layer 3 – very subtle terracotta warmth */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(110deg, rgba(10,22,40,0.22) 0%, transparent 60%, rgba(90,28,8,0.15) 100%)",
          }}
        />
      </div>

      {/* Geometric accent lines */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-1"
          style={{ background: "linear-gradient(90deg, transparent, #C9933A44, transparent)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-1"
          style={{ background: "linear-gradient(90deg, transparent, #C24F1D44, transparent)" }}
        />
        {/* Decorative diagonal lines */}
        <svg
          className="absolute left-0 top-0 opacity-10"
          width="300"
          height="300"
          viewBox="0 0 300 300"
        >
          {SVG_LINES.map((i) => (
            <line key={i} x1={0} y1={i * 35} x2={i * 35} y2={0} stroke="#C9933A" strokeWidth="1" />
          ))}
        </svg>
        <svg
          className="absolute right-0 bottom-0 opacity-10 rotate-180"
          width="300"
          height="300"
          viewBox="0 0 300 300"
        >
          {SVG_LINES.map((i) => (
            <line key={i} x1={0} y1={i * 35} x2={i * 35} y2={0} stroke="#C9933A" strokeWidth="1" />
          ))}
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-6">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
          
        >
          <div className="w-1.5 h-1.5"/>
          {/* <span style={{ color: "#C9933A", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em" }}>
            EXCLUSIVE HIGH-LEVEL DIPLOMATIC FORUM
          </span> */}
        </div>

        {/* Primary Headline */}
        <div>
          <h1
            className="uppercase tracking-widest"
            style={{
              fontSize: "clamp(28px, 6vw, 72px)",
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.05,
              letterSpacing: "0.06em",
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
            }}
          >
            Defence Attaché
            <br />
            <span style={{ color: "#C9933A" }}>Roundtable</span>
          </h1>
          <div
            className="mt-2 mx-auto"
            style={{
              height: "2px",
              width: "120px",
              background: "linear-gradient(90deg, transparent, #C24F1D, transparent)",
            }}
          />
          <h2
            className="mt-4 uppercase tracking-widest"
            style={{
              fontSize: "clamp(14px, 3vw, 32px)",
              fontWeight: 700,
              color: "#e2e8f0",
              letterSpacing: "0.12em",
            }}
          >
            & Defence Industry Expo 2026
          </h2>
        </div>

        {/* Event Details */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded"
            style={{ backgroundColor: "rgba(10,22,40,0.7)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9933A" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span style={{ color: "#fff", fontSize: "13px", fontWeight: 600, letterSpacing: "0.05em" }}>
              16th & 17th March, 2026
            </span>
          </div>
          <div
            className="flex items-center gap-2 px-4 py-2 rounded"
            style={{ backgroundColor: "rgba(10,22,40,0.7)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9933A" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span style={{ color: "#fff", fontSize: "13px", fontWeight: 600, letterSpacing: "0.05em" }}>
              Gandhinagar, Gujarat, India
            </span>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="mt-4">
          <p style={{ color: "#94a3b8", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", marginBottom: "12px" }}>
            EVENT BEGINS IN
          </p>
          <div
            className="inline-flex items-center gap-1 rounded-xl px-2"
            style={{
              backgroundColor: "rgba(10,22,40,0.7)",
              border: "1px solid rgba(201,147,58,0.3)",
              // No backdropFilter — avoids expensive blur repaint on every second tick
            }}
          >
            <CountdownUnit value={timeLeft.days} label="DAYS" />
            <span style={{ color: "#C9933A", fontSize: "24px", fontWeight: 900, marginBottom: "16px" }}>:</span>
            <CountdownUnit value={timeLeft.hours} label="HOURS" />
            <span style={{ color: "#C9933A", fontSize: "24px", fontWeight: 900, marginBottom: "16px" }}>:</span>
            <CountdownUnit value={timeLeft.minutes} label="MINUTES" />
            <span style={{ color: "#C9933A", fontSize: "24px", fontWeight: 900, marginBottom: "16px" }}>:</span>
            <CountdownUnit value={timeLeft.seconds} label="SECONDS" />
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center mt-4 w-full px-2">
          <button
            onClick={() => window.location.href = "/registerevent"}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-lg cursor-pointer"
            style={{
              transition: "background-color 300ms ease, transform 300ms ease",
              backgroundColor: "#C24F1D",
              color: "#fff",
              fontSize: "clamp(11px, 3vw, 13px)",
              fontWeight: 800,
              letterSpacing: "0.1em",
              border: "none",
              boxShadow: "0 4px 24px rgba(194,79,29,0.5)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "#a83f18";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "#C24F1D";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            REGISTER FOR PARTICIPATION
          </button>
          <button
            onClick={() => scrollTo("#programme")}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-lg cursor-pointer"
            style={{
              transition: "border-color 300ms ease, color 300ms ease",
              backgroundColor: "transparent",
              color: "#fff",
              fontSize: "clamp(11px, 3vw, 13px)",
              fontWeight: 700,
              letterSpacing: "0.1em",
              border: "2px solid rgba(255,255,255,0.4)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#C9933A";
              (e.currentTarget as HTMLElement).style.color = "#C9933A";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.4)";
              (e.currentTarget as HTMLElement).style.color = "#fff";
            }}
          >
            VIEW PROGRAMME
          </button>
          <button
            onClick={() => window.location.href = "/floormap"}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-lg cursor-pointer"
            style={{
              transition: "background-color 300ms ease, border-color 300ms ease, transform 300ms ease",
              backgroundColor: "rgba(201,147,58,0.12)",
              color: "#C9933A",
              fontSize: "clamp(11px, 3vw, 13px)",
              fontWeight: 700,
              letterSpacing: "0.1em",
              border: "2px solid rgba(201,147,58,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(201,147,58,0.22)";
              (e.currentTarget as HTMLElement).style.borderColor = "#C9933A";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(201,147,58,0.12)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,147,58,0.5)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            FLOOR MAP
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="mt-8 flex flex-col items-center gap-1 opacity-50">
          <div
            className="w-px h-10 rounded"
            style={{ background: "linear-gradient(to bottom, transparent, #C9933A)" }}
          />
          <svg width="10" height="6" viewBox="0 0 10 6" fill="#C9933A">
            <path d="M0 0l5 6 5-6z" />
          </svg>
        </div>
      </div>
    </section>
  );
}