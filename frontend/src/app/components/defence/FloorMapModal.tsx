import { memo, useEffect, useRef, useState } from "react";

/* ─────────────────────────────── data ─────────────────────────────── */
const A_STALLS = ["A1","A2","A3","A4","A5","A6","A7","A8","A9","A10","A11","A12","A13","A14","A15"];
const B_STALLS = ["B1","B2","B3","B4","B5","B6","B7"];
const C_STALLS = ["C1","C2","C3","C4","C5","C6","C7","C8","C9","C10","C11","C12","C13","C14","C15","C16","C17","C18","C19","C20"];
const D_STALLS = ["D1","D2","D3","D4","D5","D6","D7","D8","D9","D10","D11","D12","D13"];

/* ────────────────────────── stall button ───────────────────────────── */
interface StallProps {
  id: string;
  w?: number;
  h?: number;
  tooltip: string;
}

const Stall = memo(({ id, w = 54, h = 34, tooltip }: StallProps) => {
  const isC = id.startsWith("C");
  const bg    = isC ? "#15803d" : "#1e40af";
  const hover = isC ? "#16a34a" : "#2563eb";

  return (
    <div
      title={tooltip}
      style={{
        width: w,
        height: h,
        backgroundColor: bg,
        border: "1.5px solid rgba(255,255,255,0.25)",
        borderRadius: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        cursor: "default",
        transition: "background-color 200ms ease",
        boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = hover; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = bg; }}
    >
      <span style={{ fontSize: 9, fontWeight: 800, color: "#fff", letterSpacing: "0.04em", userSelect: "none" }}>
        {id}
      </span>
    </div>
  );
});

/* ────────────────────── small label badge ──────────────────────────── */
function Badge({ label, sub, color = "#C24F1D" }: { label: string; sub?: string; color?: string }) {
  return (
    <div
      style={{
        backgroundColor: color,
        borderRadius: 5,
        padding: "4px 6px",
        textAlign: "center",
        flexShrink: 0,
        boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
      }}
    >
      <div style={{ fontSize: 8, fontWeight: 800, color: "#fff", lineHeight: 1.3, whiteSpace: "nowrap" }}>{label}</div>
      {sub && <div style={{ fontSize: 7, color: "rgba(255,255,255,0.75)", lineHeight: 1.2 }}>{sub}</div>}
    </div>
  );
}

/* ─────────────────────────── arrow label ───────────────────────────── */
function ArrowLabel({ text, direction }: { text: string; direction: "up" | "down" | "left" | "right" }) {
  const arrows = { up: "↑", down: "↓", left: "←", right: "→" };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <span style={{ fontSize: 11, color: "#94a3b8" }}>{direction === "left" || direction === "up" ? arrows[direction] : ""}</span>
      <span style={{ fontSize: 8, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.12em", textTransform: "uppercase" }}>{text}</span>
      <span style={{ fontSize: 11, color: "#94a3b8" }}>{direction === "right" || direction === "down" ? arrows[direction] : ""}</span>
    </div>
  );
}

/* ──────────────────────────── main map ─────────────────────────────── */
function FloorMap() {
  return (
    <div
      style={{
        backgroundColor: "#0f172a",
        borderRadius: 16,
        padding: 24,
        minWidth: 620,
        border: "1px solid rgba(201,147,58,0.2)",
        boxShadow: "inset 0 0 60px rgba(0,0,0,0.5)",
      }}
    >
      {/* Venue title bar */}
      <div style={{
        backgroundColor: "#1e293b",
        borderRadius: 10,
        padding: "8px 16px",
        marginBottom: 20,
        textAlign: "center",
        border: "1px solid rgba(201,147,58,0.15)",
      }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: "#C9933A", letterSpacing: "0.2em" }}>
          RASHTRIYA RAKSHA UNIVERSITY — GANDHINAGAR
        </div>
        <div style={{ fontSize: 8, color: "#64748b", marginTop: 2, letterSpacing: "0.1em" }}>
          HALL FLOOR PLAN · DEFENCE INDUSTRY EXPO 2026
        </div>
      </div>

      {/* ── Top row: Refreshments + B stalls + Refreshments ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, justifyContent: "space-between" }}>
        <Badge label="Refresh-" sub="ments" color="#92400e" />
        <div style={{ display: "flex", gap: 4, flex: 1, justifyContent: "center", flexWrap: "wrap" }}>
          {[...B_STALLS].reverse().map((id) => (
            <Stall key={id} id={id} w={50} h={30} tooltip={`Stall ${id} — Block B`} />
          ))}
        </div>
        <Badge label="Refresh-" sub="ments" color="#92400e" />
      </div>

      {/* ── separator ── */}
      <div style={{
        height: 1,
        background: "linear-gradient(90deg, transparent, rgba(201,147,58,0.25), transparent)",
        marginBottom: 10,
      }} />

      {/* ── Main hall body ── */}
      <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>

        {/* LEFT: exit label + B2B + D stalls */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ fontSize: 7, color: "#64748b", fontWeight: 700, writingMode: "vertical-rl", transform: "rotate(180deg)", letterSpacing: "0.1em", marginBottom: 4 }}>
            WAY TO EXIT
          </div>
          <Badge label="B2B" sub="Room" color="#7c3aed" />
          <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 4 }}>
            {["D13","D12","D11","D10","D9","D8","D7","D6","D5"].map((id) => (
              <Stall key={id} id={id} w={50} h={28} tooltip={`Stall ${id} — Block D`} />
            ))}
          </div>
        </div>

        {/* CENTRE: aisle arrows + C stalls 2-col grid */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          {/* Aisle label top */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 8, color: "#475569", fontWeight: 600, letterSpacing: "0.12em" }}>── AISLE ──</div>
            <span style={{ fontSize: 14, color: "#475569" }}>↓</span>
          </div>

          {/* C stalls — 2 mirrored columns */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 5,
              backgroundColor: "rgba(21,128,61,0.08)",
              borderRadius: 10,
              padding: 10,
              border: "1px dashed rgba(21,128,61,0.3)",
            }}
          >
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} style={{ display: "contents" }}>
                <Stall id={`C${i + 1}`}  w={58} h={34} tooltip={`Stall C${i+1} — Centre Block`} />
                <Stall id={`C${20 - i}`} w={58} h={34} tooltip={`Stall C${20-i} — Centre Block`} />
              </div>
            ))}
          </div>

          {/* Aisle label bottom */}
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: 14, color: "#475569" }}>↓</span>
            <div style={{ fontSize: 8, color: "#475569", fontWeight: 600, letterSpacing: "0.12em" }}>── AISLE ──</div>
          </div>
        </div>

        {/* RIGHT: B2B + A stalls */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <Badge label="B2B" sub="Room" color="#7c3aed" />
          <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 4 }}>
            {["A15","A14","A13","A12","A11","A10","A9","A8","A7","A6","A5","A4","A3"].map((id) => (
              <Stall key={id} id={id} w={50} h={28} tooltip={`Stall ${id} — Block A`} />
            ))}
          </div>
        </div>
      </div>

      {/* ── separator ── */}
      <div style={{
        height: 1,
        background: "linear-gradient(90deg, transparent, rgba(201,147,58,0.25), transparent)",
        margin: "10px 0",
      }} />

      {/* ── Bottom: Entry 2 + Entry 1 + A1/A2 ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 8 }}>
        {/* Entry 2 side */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ display: "flex", gap: 3 }}>
            {["D4","D3","D2","D1"].map((id) => (
              <Stall key={id} id={id} w={50} h={28} tooltip={`Stall ${id} — Block D`} />
            ))}
          </div>
          <div style={{
            backgroundColor: "#C24F1D",
            borderRadius: 6,
            padding: "4px 14px",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}>
            <span style={{ fontSize: 10, color: "#fff" }}>←</span>
            <span style={{ fontSize: 8, fontWeight: 800, color: "#fff", letterSpacing: "0.15em" }}>ENTRY 2</span>
          </div>
        </div>

        {/* Centre: Main entry */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{
            backgroundColor: "rgba(194,79,29,0.15)",
            border: "1px solid #C24F1D",
            borderRadius: 8,
            padding: "6px 20px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9933A" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span style={{ fontSize: 8, fontWeight: 800, color: "#C9933A", letterSpacing: "0.18em" }}>MAIN ENTRY</span>
          </div>
          <span style={{ fontSize: 14, color: "#C24F1D" }}>↑</span>
        </div>

        {/* A1 / A2 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ display: "flex", gap: 3 }}>
            {["A1","A2"].map((id) => (
              <Stall key={id} id={id} w={50} h={28} tooltip={`Stall ${id} — Block A`} />
            ))}
          </div>
          <div style={{ height: 24 }} /> {/* spacer to align with entry badge */}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── legend ───────────────────────────────── */
const LEGEND = [
  { color: "#1e40af", label: "Block A / B / D — Perimeter Stalls" },
  { color: "#15803d", label: "Block C — Centre Stalls" },
  { color: "#7c3aed", label: "B2B Meeting Rooms" },
  { color: "#92400e", label: "Refreshment Counters" },
];

/* ─────────────────────────── modal ─────────────────────────────────── */
export function FloorMapModal({ onClose }: { onClose: () => void }) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(5,10,20,0.85)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        overflowY: "auto",
      }}
    >
      {/* Modal panel */}
      <div
        style={{
          backgroundColor: "#0c1a2e",
          borderRadius: 20,
          border: "1px solid rgba(201,147,58,0.35)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(201,147,58,0.1)",
          maxWidth: 900,
          width: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Accent top bar */}
        <div style={{ height: 3, background: "linear-gradient(90deg, #C24F1D, #C9933A, #C24F1D)" }} />

        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 24px 0",
        }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#C9933A", letterSpacing: "0.2em", marginBottom: 4 }}>
              DEFENCE INDUSTRY EXPO 2026
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: 0 }}>
              Exhibition Floor Map
            </h2>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
              55 stalls across 4 blocks · Gandhinagar · 17th March 2026
            </div>
          </div>

          {/* Zoom + close */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Zoom out */}
            <button
              onClick={() => setScale((s) => Math.max(0.6, +(s - 0.1).toFixed(1)))}
              title="Zoom out"
              style={{
                width: 32, height: 32, borderRadius: 8,
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff", fontSize: 16, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >−</button>
            <span style={{ fontSize: 11, color: "#94a3b8", minWidth: 36, textAlign: "center" }}>
              {Math.round(scale * 100)}%
            </span>
            {/* Zoom in */}
            <button
              onClick={() => setScale((s) => Math.min(1.6, +(s + 0.1).toFixed(1)))}
              title="Zoom in"
              style={{
                width: 32, height: 32, borderRadius: 8,
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff", fontSize: 16, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >+</button>
            {/* Close */}
            <button
              onClick={onClose}
              style={{
                width: 36, height: 36, borderRadius: 10,
                backgroundColor: "rgba(194,79,29,0.15)",
                border: "1px solid rgba(194,79,29,0.4)",
                color: "#C24F1D", fontSize: 18, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginLeft: 8,
              }}
            >✕</button>
          </div>
        </div>

        {/* Scrollable map area */}
        <div style={{ padding: "20px 24px", overflowX: "auto" }}>
          <div style={{
            transformOrigin: "top center",
            transform: `scale(${scale})`,
            transition: "transform 250ms ease",
          }}>
            <FloorMap />
          </div>
        </div>

        {/* Legend */}
        <div style={{
          padding: "16px 24px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          backgroundColor: "rgba(0,0,0,0.2)",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px 24px",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#64748b", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Legend:
          </span>
          {LEGEND.map((l) => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: l.color, flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>{l.label}</span>
            </div>
          ))}
        </div>

        {/* CTA footer */}
        <div style={{
          padding: "14px 24px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
        }}>
          <span style={{ fontSize: 11, color: "#475569" }}>
            Hover a stall to view details · Register to book a stall
          </span>
          <button
            onClick={() => { window.location.href = "/registerevent"; }}
            style={{
              backgroundColor: "#C24F1D",
              color: "#fff",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.1em",
              padding: "10px 24px",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(194,79,29,0.45)",
              transition: "background-color 250ms ease",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#a83f18"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#C24F1D"; }}
          >
            BOOK A STALL →
          </button>
        </div>
      </div>
    </div>
  );
}
