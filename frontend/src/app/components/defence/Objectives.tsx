const objectives = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" stroke="#C24F1D" strokeWidth="2" />
        <path d="M10 16h12M16 10v12" stroke="#C24F1D" strokeWidth="2" strokeLinecap="round" />
        <circle cx="16" cy="16" r="4" fill="#C24F1D" opacity="0.2" />
      </svg>
    ),
    title: "Direct Dialogue on Security",
    desc: "Facilitate candid, high-level bilateral conversations on shared security challenges, threat landscapes, and collective defence frameworks.",
    color: "#C24F1D",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="8" width="10" height="16" rx="2" stroke="#0A1628" strokeWidth="2" />
        <rect x="18" y="8" width="10" height="16" rx="2" stroke="#0A1628" strokeWidth="2" />
        <path d="M14 16h4" stroke="#0A1628" strokeWidth="2" strokeLinecap="round" />
        <path d="M14 13l4 3-4 3" fill="#0A1628" />
      </svg>
    ),
    title: "Technology Transfer",
    desc: "Explore avenues for co-development, joint production, and transfer of cutting-edge defence technologies under Make in India initiatives.",
    color: "#0A1628",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="#C9933A" strokeWidth="2" />
        <ellipse cx="16" cy="16" rx="5" ry="12" stroke="#C9933A" strokeWidth="1.5" />
        <line x1="4" y1="16" x2="28" y2="16" stroke="#C9933A" strokeWidth="1.5" />
        <line x1="4" y1="11" x2="28" y2="11" stroke="#C9933A" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="4" y1="21" x2="28" y2="21" stroke="#C9933A" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    ),
    title: "Global South Partnerships",
    desc: "Strengthen India's leadership in the Global South by building defence partnerships rooted in sovereignty, mutual respect, and shared progress.",
    color: "#C9933A",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M8 20l4-8 4 6 3-4 5 6" stroke="#C24F1D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="2" y="6" width="28" height="20" rx="3" stroke="#C24F1D" strokeWidth="2" />
      </svg>
    ),
    title: "Deeper Bilateral Cooperation",
    desc: "Identify and activate pathways for deeper bilateral defence cooperation across logistics, intelligence-sharing, and joint military exercises.",
    color: "#C24F1D",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4l3 6h7l-5.5 4 2 7L16 17l-6.5 4 2-7L6 10h7z" stroke="#0A1628" strokeWidth="2" fill="none" strokeLinejoin="round" />
      </svg>
    ),
    title: "Sovereign Capability",
    desc: "Showcase India's growing Aatmanirbhar Bharat defence ecosystem — indigenous platforms, systems, and innovations ready for global deployment.",
    color: "#0A1628",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="6" stroke="#C9933A" strokeWidth="2" />
        <path d="M16 4v4M16 24v4M4 16h4M24 16h4" stroke="#C9933A" strokeWidth="2" strokeLinecap="round" />
        <path d="M7.5 7.5l2.8 2.8M21.7 21.7l2.8 2.8M24.5 7.5l-2.8 2.8M10.3 21.7l-2.8 2.8" stroke="#C9933A" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Global Recognition",
    desc: "Position India as a premier global defence partner of choice — attracting investment, FDI, and international recognition for Made-in-India platforms.",
    color: "#C9933A",
  },
];

export function Objectives() {
  return (
    <section id="objectives" className="w-full py-20" style={{ backgroundColor: "#ffffff" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div style={{ width: "40px", height: "2px", backgroundColor: "#C24F1D" }} />
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: "#C24F1D" }}>
              CORE OBJECTIVES
            </span>
            <div style={{ width: "40px", height: "2px", backgroundColor: "#C24F1D" }} />
          </div>
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 42px)",
              fontWeight: 800,
              color: "#0A1628",
              lineHeight: 1.2,
            }}
          >
            Strategic Outcomes &{" "}
            <span style={{ color: "#C24F1D" }}>Core Objectives</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto" style={{ color: "#6b7280", fontSize: "15px", lineHeight: 1.7 }}>
            The Defence Attaché Roundtable 2026 is engineered around six pillars of strategic
            engagement — each designed to drive real, tangible outcomes for all participating nations.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {objectives.map((obj, i) => (
            <div
              key={i}
              className="group p-6 rounded-2xl transition-all duration-300 cursor-default"
              style={{
                backgroundColor: "#f9f7f4",
                border: "1px solid #e5e7eb",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(10,22,40,0.12)";
                (e.currentTarget as HTMLElement).style.borderColor = obj.color;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb";
              }}
            >
              {/* Icon */}
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: "#fff", border: `2px solid ${obj.color}22` }}
              >
                {obj.icon}
              </div>

              {/* Index */}
              <div
                className="mb-2"
                style={{ fontSize: "11px", fontWeight: 700, color: obj.color, letterSpacing: "0.15em" }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>

              <h3
                className="mb-3"
                style={{ fontSize: "17px", fontWeight: 700, color: "#0A1628", lineHeight: 1.3 }}
              >
                {obj.title}
              </h3>
              <p style={{ color: "#6b7280", fontSize: "13px", lineHeight: 1.7 }}>{obj.desc}</p>

              {/* Bottom accent */}
              <div
                className="mt-5 h-0.5 rounded transition-all duration-300"
                style={{ width: "32px", backgroundColor: obj.color }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
