const objectives = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" stroke="#C24F1D" strokeWidth="2" />
        <path d="M8 16h5l3-7 3 14 3-7h4" stroke="#C24F1D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Strengthen International Defence Partnerships",
    desc: "Strengthen international defence partnerships through trust-based, long-term engagement.",
    color: "#C24F1D",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="10" cy="10" r="4" stroke="#0A1628" strokeWidth="2" />
        <circle cx="22" cy="10" r="4" stroke="#0A1628" strokeWidth="2" />
        <circle cx="16" cy="22" r="4" stroke="#0A1628" strokeWidth="2" />
        <line x1="14" y1="10" x2="18" y2="10" stroke="#0A1628" strokeWidth="1.5" />
        <line x1="12" y1="14" x2="14" y2="18" stroke="#0A1628" strokeWidth="1.5" />
        <line x1="20" y1="14" x2="18" y2="18" stroke="#0A1628" strokeWidth="1.5" />
      </svg>
    ),
    title: "Facilitate Dialogue Across Stakeholders",
    desc: "Facilitate dialogue between Defence Attachés, policymakers, academia, and Indian defence industry representatives.",
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
    title: "Explore Defence Trade & Collaboration",
    desc: "Explore opportunities for defence trade, co-development, and technology collaboration.",
    color: "#C9933A",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="8" width="10" height="16" rx="2" stroke="#C24F1D" strokeWidth="2" />
        <rect x="18" y="8" width="10" height="16" rx="2" stroke="#C24F1D" strokeWidth="2" />
        <path d="M14 16h4" stroke="#C24F1D" strokeWidth="2" strokeLinecap="round" />
        <path d="M14 13l4 3-4 3" fill="#C24F1D" />
      </svg>
    ),
    title: "Share Practical Policy Perspectives",
    desc: "Share practical perspectives on policy frameworks, institutional design, industrial integration, and financial models.",
    color: "#C24F1D",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4l3 6h7l-5.5 4 2 7L16 17l-6.5 4 2-7L6 10h7z" stroke="#0A1628" strokeWidth="2" fill="none" strokeLinejoin="round" />
        <circle cx="16" cy="16" r="3" fill="#0A1628" opacity="0.3" />
      </svg>
    ),
    title: "Global South-Centric Cooperation",
    desc: "Encourage Global South-centric cooperation models that balance national capability with global engagement.",
    color: "#0A1628",
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
              ROUNDTABLE OBJECTIVES
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
            Roundtable{" "}
            <span style={{ color: "#C24F1D" }}>Objectives</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto" style={{ color: "#6b7280", fontSize: "15px", lineHeight: 1.7 }}>
            The Defence Attaché Roundtable 2026 is structured around five core objectives —
            each designed to build lasting strategic defence partnerships between India and the world.
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
