import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import mhaLogo from "../../../Assets/Ministry_of_Home_Affairs_India.svg";
import meaLogo from "../../../Assets/Ministry_of_External_Affairs_India.svg";
import rruLogo from "../../../Assets/Rashtriya_Raksha_University_logo.png";
import modLogo from "../../../Assets/Ministry_of_Defence_India.svg";
import drdoLogo from "../../../Assets/drdo.svg";

const navLinks = [
  // { label: "Home", href: "#home" },
  { label: "About RRU", href: "#about" },
  { label: "Programme", href: "#programme" },
  { label: "Gallery", href: "#gallery" },
  { label: "Videos", href: "#videos" },
  { label: "Sponsors", href: "#sponsors" },
  { label: "Why Attend", href: "#why-attend" },
];

// Government institution logos from local assets
const logoMap: Record<string, string> = {
  MHA: mhaLogo,
  MEA: meaLogo,
  RRU: rruLogo,
  MoD: modLogo,
  DRDO: drdoLogo,
};

function InstitutionLogo({ abbr, full, mobile = false }: { abbr: string; full: string; mobile?: boolean }) {
  const isMinistrySeal = abbr === "MHA" || abbr === "MEA" || abbr === "MoD";

  // All 3 ministry seals share IDENTICAL box — SVG scales to fit via objectFit contain
  const boxW = mobile ? 52 : 130;
  const boxH = mobile ? 42 : 88;

  const drdoboxW = mobile ? 42 : 80;
  const drdoboxH = mobile ? 42 : 80;

  const rruboxW = mobile ? 34 : 56;
  const rruboxH = mobile ? 34 : 56;

  const w = isMinistrySeal ? boxW : abbr === "DRDO" ? drdoboxW : rruboxW;
  const h = isMinistrySeal ? boxH : abbr === "DRDO" ? drdoboxH : rruboxH;

  return (
    <div className="flex flex-col items-center justify-center" style={{ margin: 0 }}>
      {/* Fixed-size container — all ministry seals are identical boxes */}
      <div
        style={{
          width: `${w}px`,
          height: `${h}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <img
          src={logoMap[abbr]}
          alt={full}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
            display: "block",
          }}
          onError={(e) => {
            const el = e.currentTarget;
            el.style.display = "none";
            const parent = el.parentElement;
            if (parent) {
              const span = document.createElement("span");
              span.style.cssText = "font-size:10px;font-weight:700;color:#0A1628;text-align:center";
              span.textContent = abbr;
              parent.appendChild(span);
            }
          }}
        />
      </div>
      {abbr === "RRU" && !mobile && (
        <span
          className="text-center hidden md:block"
          style={{ fontSize: "11px", color: "#444", maxWidth: "100px", lineHeight: "1.2", fontWeight: "bold", marginTop: "2px" }}
        >
          {full}
        </span>
      )}
    </div>
  );
}

export function Header({ onRegister, onLogin }: { onRegister?: () => void; onLogin?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [headerTop, setHeaderTop] = useState(44);
  const [spacerH, setSpacerH] = useState(145);
  const headerRef = useRef<HTMLElement>(null);
  const BORDER_HEIGHT = 44;

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSpacerH(el.offsetHeight));
    ro.observe(el);
    setSpacerH(el.offsetHeight);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      setScrolled(sy > 60);
      setHeaderTop(Math.max(0, BORDER_HEIGHT - sy));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div style={{ height: `${spacerH}px` }} aria-hidden="true" />
      <header
        ref={headerRef}
        className="w-full"
        style={{ position: "fixed", top: `${headerTop}px`, left: 0, right: 0, zIndex: 120 }}
      >
      {/* Top bar: logos — desktop */}
      <div
        className="hidden sm:block w-full"
        style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e0e0e0" }}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-2">
          <div className="flex-shrink-0">
            <InstitutionLogo abbr="RRU" full="Rashtriya Raksha University" />
          </div>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <InstitutionLogo abbr="MHA" full="Ministry of Home Affairs" />
            <div className="hidden sm:block w-px h-14 bg-gray-300" />
            <InstitutionLogo abbr="MEA" full="Ministry of External Affairs" />
            <div className="hidden sm:block w-px h-14 bg-gray-300" />
            <InstitutionLogo abbr="MoD" full="Ministry of Defence" />
          </div>
          <div className="flex-shrink-0">
            <InstitutionLogo abbr="DRDO" full="Defence Research & Development Organisation" />
          </div>
        </div>
      </div>

      {/* Top bar: logos — mobile (compact 2-row) */}
      <div
        className="sm:hidden w-full"
        style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e0e0e0" }}
      >
        <div className="flex items-center justify-around px-2 py-1">
          <InstitutionLogo abbr="RRU" full="Rashtriya Raksha University" mobile />
          <InstitutionLogo abbr="MHA" full="Ministry of Home Affairs" mobile />
          <InstitutionLogo abbr="MEA" full="Ministry of External Affairs" mobile />
          <InstitutionLogo abbr="MoD" full="Ministry of Defence" mobile />
          <InstitutionLogo abbr="DRDO" full="Defence Research & Development Organisation" mobile />
        </div>
      </div>

      {/* Navigation bar */}
      <nav
        className="w-full transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "#0A1628f5" : "#0A1628",
          backdropFilter: scrolled ? "blur(8px)" : "none",
          boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.3)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center h-14">
          {/* Left spacer (balances the right buttons) — desktop only */}
          <div className="hidden md:flex items-center" style={{ minWidth: "200px" }} />

          {/* Desktop Nav Links — centered */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-20">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="transition-colors duration-200 cursor-pointer"
                style={{ color: "#cbd5e1", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", background: "none", border: "none" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#C9933A")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#cbd5e1")}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right: Register + Login buttons — desktop */}
          <div className="hidden md:flex items-center gap-3" style={{ minWidth: "200px", justifyContent: "flex-end" }}>
            <button
              onClick={() => onRegister?.()}
              className="px-4 py-2 rounded transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: "#C24F1D",
                color: "#fff",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                border: "none",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#a83f18")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#C24F1D")}
            >
              REGISTER NOW
            </button>
            <button
              onClick={() => onLogin?.()}
              className="px-4 py-2 rounded transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: "transparent",
                color: "#cbd5e1",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#C9933A")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)")}
            >
              LOGIN
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex flex-1 justify-end">
            <button
              style={{ color: "#fff", background: "none", border: "none", cursor: "pointer" }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className="md:hidden px-4 pb-4 pt-2 flex flex-col gap-3"
            style={{ backgroundColor: "#0d2244" }}
          >
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="text-left py-2 cursor-pointer"
                style={{
                  color: "#cbd5e1",
                  fontSize: "14px",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  background: "none",
                  border: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {link.label}
              </button>
            ))}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => { setMobileOpen(false); onRegister?.(); }}
                className="flex-1 py-3 rounded cursor-pointer"
                style={{ backgroundColor: "#C24F1D", color: "#fff", fontSize: "13px", fontWeight: 700, border: "none" }}
              >
                REGISTER NOW
              </button>
              <button
                onClick={() => { setMobileOpen(false); onLogin?.(); }}
                className="flex-1 py-3 rounded cursor-pointer"
                style={{ backgroundColor: "transparent", color: "#cbd5e1", fontSize: "13px", fontWeight: 600, border: "1px solid rgba(255,255,255,0.25)" }}
              >
                LOGIN
              </button>
            </div>
          </div>
        )}
      </nav>
      </header>
    </>
  );
}