const stats = [
  {
    value: "₹1.54L Cr",
    label: "Defence Production",
    sub: "FY 2024–25",
    accent: "#C24F1D",
  },
  {
    value: "₹3L Cr",
    label: "Target by 2029",
    sub: "Long-term goal",
    accent: "#0A1628",
  },
  {
    value: "₹23,622 Cr",
    label: "Defence Exports",
    sub: "FY 2024–25",
    accent: "#C9933A",
  },
  {
    value: "82+",
    label: "Partner Countries",
    sub: "via RRU programmes",
    accent: "#C24F1D",
  },
];

export function Background() {
  return (
    <section id="background" className="w-full py-20" style={{ backgroundColor: "#ffffff" }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Label */}
        <div className="flex items-center gap-3 mb-4">
          <div style={{ width: "40px", height: "3px", backgroundColor: "#C24F1D" }} />
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: "#C24F1D" }}>
            BACKGROUND
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Text */}
          <div>
            <h2
              style={{
                fontSize: "clamp(22px, 3vw, 38px)",
                fontWeight: 800,
                color: "#0A1628",
                lineHeight: 1.2,
                marginBottom: "24px",
              }}
            >
              India's Rising{" "}
              <span style={{ color: "#C24F1D" }}>Defence Ecosystem</span>
            </h2>

            <p style={{ color: "#4a5568", fontSize: "15px", lineHeight: 1.85, marginBottom: "16px" }}>
              Over the past decade, India has undertaken sustained efforts to strengthen its
              indigenous defence manufacturing ecosystem. Indigenous defence production reached{" "}
              <strong style={{ color: "#0A1628" }}>₹1,27,434 crore in FY 2023–24</strong>, rising
              from ₹46,429 crore in FY 2014–15 — nearly a 3× increase in under a decade.
            </p>

            <p style={{ color: "#4a5568", fontSize: "15px", lineHeight: 1.85, marginBottom: "16px" }}>
              In FY 2024–25, defence production crossed{" "}
              <strong style={{ color: "#0A1628" }}>₹1.54 lakh crore</strong>, with a long-term
              target of ₹3 lakh crore by 2029. This growth has been supported by Defence Public
              Sector Undertakings and private industries alongside enabling measures such as Defence
              Industrial Corridors, innovation incentives, and industry–academia collaborations.
            </p>

            <p style={{ color: "#4a5568", fontSize: "15px", lineHeight: 1.85, marginBottom: "16px" }}>
              India's defence exports reached{" "}
              <strong style={{ color: "#0A1628" }}>₹23,622 crore in FY 2024–25</strong>, reflecting
              a diversified industrial base. Streamlined export procedures, digital authorisation
              systems, and rationalised licensing have enabled timely and predictable engagement
              with partner nations.
            </p>

            <p style={{ color: "#4a5568", fontSize: "15px", lineHeight: 1.85 }}>
              India's expanding defence partnerships — particularly with countries of the{" "}
              <strong style={{ color: "#0A1628" }}>Global South</strong> — reflect growing
              confidence in Indian platforms and recognition of shared pathways in building national
              defence capabilities while remaining connected to global supply chains.
            </p>

            {/* Growth bar visual */}
            <div
              className="mt-10 p-6 rounded-2xl"
              style={{ backgroundColor: "#f9f7f4", border: "1px solid #e5e7eb" }}
            >
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  color: "#C24F1D",
                  marginBottom: "16px",
                }}
              >
                DEFENCE PRODUCTION GROWTH TRAJECTORY
              </p>
              {[
                { year: "FY 2014–15", value: 46429, max: 154000, label: "₹46,429 Cr" },
                { year: "FY 2023–24", value: 127434, max: 154000, label: "₹1,27,434 Cr" },
                { year: "FY 2024–25", value: 154000, max: 154000, label: "₹1.54L Cr" },
                { year: "Target 2029", value: 300000, max: 300000, label: "₹3L Cr", isTarget: true },
              ].map((row, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>{row.year}</span>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: row.isTarget ? "#C9933A" : "#C24F1D",
                      }}
                    >
                      {row.label}
                    </span>
                  </div>
                  <div
                    className="w-full rounded-full overflow-hidden"
                    style={{ height: "8px", backgroundColor: "#e5e7eb" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (row.value / row.max) * 100)}%`,
                        background: row.isTarget
                          ? "linear-gradient(90deg, #C9933A, #f0b429)"
                          : "linear-gradient(90deg, #C24F1D, #e06035)",
                        transition: "width 1s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Stats grid + context */}
          <div className="flex flex-col gap-6">
            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-6 flex flex-col gap-2"
                  style={{
                    backgroundColor: "#f9f7f4",
                    border: `1px solid ${s.accent}22`,
                    borderTop: `4px solid ${s.accent}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: "clamp(20px, 2.5vw, 28px)",
                      fontWeight: 900,
                      color: s.accent,
                      lineHeight: 1,
                    }}
                  >
                    {s.value}
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#0A1628" }}>{s.label}</div>
                  <div style={{ fontSize: "11px", color: "#9ca3af" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Context box */}
            <div
              className="rounded-2xl p-7"
              style={{ backgroundColor: "#0A1628" }}
            >
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  color: "#C9933A",
                  marginBottom: "14px",
                }}
              >
                THE ROUNDTABLE'S FOUNDING RATIONALE
              </p>
              <p style={{ color: "#e2e8f0", fontSize: "14px", lineHeight: 1.8, marginBottom: "14px" }}>
                Against this backdrop, the Defence Attachés' Roundtable is proposed as a platform
                for dialogue, reflection, and exchange — recognising the central role of Defence
                Attachés in shaping cooperation, institutional linkages, and long-term partnerships.
              </p>
              <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.8 }}>
                The emphasis will be on understanding how national defence ecosystems can{" "}
                <span style={{ color: "#C9933A", fontWeight: 600 }}>
                  connect, complement, and strengthen
                </span>{" "}
                one another through cooperation — with India as a trusted development partner
                within the Global South.
              </p>
            </div>

            {/* Export context */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "linear-gradient(135deg, rgba(194,79,29,0.08), rgba(201,147,58,0.06))",
                border: "1px solid rgba(194,79,29,0.2)",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#C24F1D" }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#0A1628", marginBottom: "6px" }}>
                    Defence Exports as Strategic Instruments
                  </p>
                  <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.7 }}>
                    Alongside equipment supply, exports are accompanied by training, logistics
                    support, maintenance, and institutional engagement — contributing to
                    interoperability and long-term partnerships.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}