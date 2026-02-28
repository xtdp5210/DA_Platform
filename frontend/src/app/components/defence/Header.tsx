import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import mhaLogo from "../../../Assets/Ministry_of_Home_Affairs_India.jpg";
import meaLogo from "../../../Assets/Ministry_of_External_Affairs_India.jpg";
import rruLogo from "../../../Assets/Rashtriya_Raksha_University_logo.png";
import modLogo from "../../../Assets/Ministry_of_Defence_India.jpg";
import drdoLogo from "../../../Assets/drdo.jpg";

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

function InstitutionLogo({ abbr, full }: { abbr: string; full: string }) {
  return (
    <div className="flex flex-col items-center px-0 m-0" style={{gap:0,margin:0}}>
      <div
        className="flex items-center justify-center overflow-hidden"
        style={{}}
      >
        <img
          src={logoMap[abbr]}
          alt={abbr}
          style={{
            width:
              abbr === "MHA" || abbr === "MEA" || abbr === "MoD"
                ? "180px"
                : abbr === "DRDO"
                ? "90px"
                : "60px",
            height:
              abbr === "MHA" || abbr === "MEA" || abbr === "MoD"
                ? "120px"
                : abbr === "DRDO"
                ? "90px"
                : "60px",
            objectFit: "contain",
            borderRadius: 0,
            background: "none",
            boxShadow: "none",
            display: "block",
            marginTop: abbr === "MHA" || abbr === "MEA" || abbr === "MoD" ? "-20px" : "0px",
            marginBottom: abbr === "MHA" || abbr === "MEA" || abbr === "MoD" ? "-20px" : "0px"
          }}
          onError={(e) => {
            const el = e.currentTarget;
            el.style.display = "none";
            const parent = el.parentElement;
            if (parent) {
              const span = document.createElement("span");
              span.style.cssText = "font-size:12px;font-weight:700;color:#0A1628;letter-spacing:0.02em;text-align:center";
              span.textContent = abbr;
              parent.appendChild(span);
            }
          }}
        />
      </div>
      {abbr === "RRU" && (
        <span
          className="text-center hidden md:block"
          style={{ fontSize: "13px", color: "#444", maxWidth: "120px", lineHeight: "1.2", fontWeight: "bold" }}
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
  const headerTopOffset = 44;
  const headerHeight = 144;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div style={{ height: `${headerHeight}px` }} aria-hidden="true" />
      <header
        className="w-full"
        style={{ position: "fixed", top: `${headerTopOffset}px`, left: 0, right: 0, zIndex: 120 }}
      >
      {/* Top bar: logos */}
      <div
        className="w-full"
        style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e0e0e0", minHeight: "1px", height: "auto" }}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-2">
          <div className="flex-shrink-0">
            <InstitutionLogo abbr="RRU" full="Rashtriya Raksha University" />
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            <InstitutionLogo abbr="MHA" full="Ministry of Home Affairs" />
            <div className="hidden sm:block w-px h-12 bg-gray-200" />
            <InstitutionLogo abbr="MEA" full="Ministry of External Affairs" />
            <div className="hidden sm:block w-px h-12 bg-gray-200" />
            <InstitutionLogo abbr="MoD" full="Ministry of Defence" />
          </div>

          <div className="flex-shrink-0">
            <InstitutionLogo abbr="DRDO" full="Defence Research & Development Organisation" />
          </div>
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
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded flex items-center justify-center"
              style={{ backgroundColor: "#C24F1D" }}
            >
              <span style={{ color: "#fff", fontSize: "10px", fontWeight: 800, letterSpacing: "0.05em" }}>RRU</span>
            </div>
            <span
              className="hidden sm:block"
              style={{ color: "#fff", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em" }}
            >
              DEFENCE ATTACHÉ ROUNDTABLE 2026
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
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
          <button
            className="md:hidden"
            style={{ color: "#fff", background: "none", border: "none", cursor: "pointer" }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
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
                className="text-left py-2 border-b cursor-pointer"
                style={{
                  color: "#cbd5e1",
                  fontSize: "13px",
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
            <button
              onClick={() => scrollTo("#contact")}
              className="mt-2 px-4 py-2 rounded cursor-pointer"
              style={{ backgroundColor: "#C24F1D", color: "#fff", fontSize: "12px", fontWeight: 700, border: "none" }}
            >
              ENQUIRE NOW
            </button>
          </div>
        )}
      </nav>
      </header>
    </>
  );
}