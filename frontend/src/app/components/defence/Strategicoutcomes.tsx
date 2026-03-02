const outcomes = [
  {
    id: "01",
    title: "Deeper Cooperation",
    desc: "Trust-based partnerships aligned to shared security goals — building institutional linkages and long-term bilateral defence frameworks between India and partner nations.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" stroke="#C24F1D" strokeWidth="1.5" opacity="0.3" />
        <path d="M12 20c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8" stroke="#C24F1D" strokeWidth="2" strokeLinecap="round" />
        <path d="M14 26l-4 2 1-4" stroke="#C24F1D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="20" cy="20" r="3" fill="#C24F1D" opacity="0.4" />
        <path d="M24 14l4-2-1 4" stroke="#C24F1D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    accent: "#C24F1D",
    bg: "#fff1ee",
  },
  {
    id: "02",
    title: "Sovereign Capability",
    desc: "Self-reliant ecosystems via technology transfer & co-production — enabling partner nations to build indigenous defence manufacturing capacity with India as a trusted partner.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M20 4l4 8h9l-7 5.5 2.5 9L20 22l-8.5 4.5 2.5-9L7 12h9z" stroke="#C9933A" strokeWidth="2" fill="none" strokeLinejoin="round" />
        <circle cx="20" cy="20" r="4" fill="#C9933A" opacity="0.3" />
      </svg>
    ),
    accent: "#C9933A",
    bg: "#fffbeb",
  },
  {
    id: "03",
    title: "Global Recognition",
    desc: "India as a reliable multipolar defence partner of choice — positioning Indian platforms and institutions at the centre of a new global defence cooperation architecture.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="14" stroke="#0A1628" strokeWidth="2" />
        <ellipse cx="20" cy="20" rx="6" ry="14" stroke="#0A1628" strokeWidth="1.5" />
        <line x1="6" y1="20" x2="34" y2="20" stroke="#0A1628" strokeWidth="1.5" />
        <line x1="7" y1="14" x2="33" y2="14" stroke="#0A1628" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="7" y1="26" x2="33" y2="26" stroke="#0A1628" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    ),
    accent: "#0A1628",
    bg: "#f0f4ff",
  },
];

export function StrategicOutcomes() {
  return (
    <section id="strategic-outcomes" className="w-full py-20" style={{ backgroundColor: "#0A1628" }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div style={{ width: "40px", height: "2px", backgroundColor: "#C9933A" }} />
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: "#C9933A" }}>
              STRATEGIC OUTCOMES
            </span>
            <div style={{ width: "40px", height: "2px", backgroundColor: "#C9933A" }} />
          </div>
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 42px)",
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.2,
            }}
          >
            What This Roundtable{" "}
            <span style={{ color: "#C9933A" }}>Delivers</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto" style={{ color: "#94a3b8", fontSize: "15px", lineHeight: 1.7 }}>
            Three pillars of enduring strategic value — outcomes designed to outlast the event
            and reshape long-term defence partnerships between India and the world.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {outcomes.map((o) => (
            <div
              key={o.id}
              className="relative rounded-2xl p-8 flex flex-col gap-5 transition-all duration-300"
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderTop: `4px solid ${o.accent}`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.04)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              {/* Number */}
              <div
                className="absolute top-5 right-6"
                style={{ fontSize: "52px", fontWeight: 900, color: "rgba(255,255,255,0.04)", lineHeight: 1 }}
              >
                {o.id}
              </div>

              {/* Icon */}
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: o.bg }}
              >
                {o.icon}
              </div>

              {/* Label */}
              <div>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    color: o.accent,
                    marginBottom: "8px",
                  }}
                >
                  OUTCOME {o.id}
                </span>
                <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", lineHeight: 1.2, marginBottom: "12px" }}>
                  {o.title}
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: 1.75 }}>{o.desc}</p>
              </div>

              {/* Bottom accent line */}
              <div style={{ height: "2px", width: "40px", backgroundColor: o.accent, borderRadius: "2px", marginTop: "auto" }} />
            </div>
          ))}
        </div>

        {/* Bottom banner — from the flyer */}
        <div
          className="rounded-2xl p-8 grid md:grid-cols-3 gap-8 items-center"
          style={{
            background: "linear-gradient(135deg, rgba(194,79,29,0.15) 0%, rgba(201,147,58,0.1) 50%, rgba(10,22,40,0.8) 100%)",
            border: "1px solid rgba(201,147,58,0.25)",
          }}
        >
          {[
            { label: "Deeper Cooperation", sub: "Trust-based partnerships aligned to shared security goals" },
            { label: "Sovereign Capability", sub: "Self-reliant ecosystems via technology transfer & co-production" },
            { label: "Global Recognition", sub: "India as a reliable multipolar defence partner of choice" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <div
                className="mt-1 w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: ["#C24F1D", "#C9933A", "#ffffff"][i] }}
              />
              <div>
                <p style={{ color: "#ffffff", fontSize: "14px", fontWeight: 700, marginBottom: "4px" }}>
                  {item.label}
                </p>
                <p style={{ color: "#94a3b8", fontSize: "12px", lineHeight: 1.6 }}>{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}