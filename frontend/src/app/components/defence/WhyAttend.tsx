const pillars = [
  {
    num: "01",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="16" stroke="#C24F1D" strokeWidth="2" opacity="0.3" />
        <path d="M10 18h6l3-6 3 9 3-4 2 4" stroke="#C24F1D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="18" cy="18" r="3" fill="#C24F1D" opacity="0.3" />
      </svg>
    ),
    title: "First-hand Access",
    subtitle: "Unfiltered intelligence from decision-makers",
    desc: "Gain direct, unfiltered access to India's top defence policymakers, ministry officials, and military leadership — intelligence that no briefing document can replicate.",
    accent: "#C24F1D",
  },
  {
    num: "02",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M18 4l3.5 7.5L30 13l-6 5.5 1.5 8.5L18 23l-7.5 4 1.5-8.5L6 13l8.5-1.5z" stroke="#C9933A" strokeWidth="2" fill="none" strokeLinejoin="round" />
      </svg>
    ),
    title: "Explore Pathways",
    subtitle: "Co-production, tech transfer & joint ventures",
    desc: "Navigate India's defence acquisition landscape with expert guidance — identifying co-production opportunities, technology transfer channels, and Joint Venture frameworks tailored to your nation.",
    accent: "#C9933A",
  },
  {
    num: "03",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="12" cy="12" r="5" stroke="#0A1628" strokeWidth="2" />
        <circle cx="24" cy="12" r="5" stroke="#0A1628" strokeWidth="2" />
        <circle cx="18" cy="24" r="5" stroke="#0A1628" strokeWidth="2" />
        <line x1="12" y1="17" x2="18" y2="19" stroke="#0A1628" strokeWidth="1.5" />
        <line x1="24" y1="17" x2="18" y2="19" stroke="#0A1628" strokeWidth="1.5" />
        <line x1="12" y1="17" x2="24" y2="17" stroke="#0A1628" strokeWidth="1.5" />
      </svg>
    ),
    title: "Engage with Leadership",
    subtitle: "C-suite & ministerial access in one room",
    desc: "Meet and engage directly with CEOs, CMDs, and technical leadership from India's top defence companies — alongside senior officials from MHA, MEA, MoD, and DRDO.",
    accent: "#0A1628",
  },
  {
    num: "04",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="4" y="20" width="7" height="12" rx="1" fill="#C24F1D" opacity="0.6" />
        <rect x="14" y="14" width="7" height="18" rx="1" fill="#C24F1D" opacity="0.75" />
        <rect x="24" y="8" width="7" height="24" rx="1" fill="#C24F1D" />
        <path d="M6 12l8-6 8 4 8-8" stroke="#C9933A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="30" cy="2" r="2" fill="#C9933A" />
      </svg>
    ),
    title: "Identify Export-Ready Tech",
    subtitle: "Live demos of battle-proven platforms",
    desc: "Assess export-ready, battle-proven Indian defence platforms live and in person — from UAVs and armoured vehicles to electronic warfare systems and naval technologies.",
    accent: "#C24F1D",
  },
];

export function WhyAttend({ onRegister }: { onRegister?: () => void }) {
  return (
    <section id="why-attend" className="w-full py-20" style={{ backgroundColor: "#ffffff" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div style={{ width: "40px", height: "2px", backgroundColor: "#C24F1D" }} />
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: "#C24F1D" }}>
              WHY ATTEND
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
            Four Compelling Reasons to{" "}
            <span style={{ color: "#C24F1D" }}>Be There</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto" style={{ color: "#6b7280", fontSize: "15px", lineHeight: 1.7 }}>
            The Defence Attaché Roundtable 2026 offers an unprecedented convergence of access,
            intelligence, and opportunity that simply cannot be replicated anywhere else.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, i) => (
            <div
              key={i}
              className="relative rounded-2xl p-7 flex flex-col gap-5 transition-all duration-300 cursor-default"
              style={{
                backgroundColor: "#f9f7f4",
                border: "1px solid #e5e7eb",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = p.accent;
                (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
                (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 60px ${p.accent}44`;
                const title = e.currentTarget.querySelector(".pillar-title") as HTMLElement;
                const sub = e.currentTarget.querySelector(".pillar-sub") as HTMLElement;
                const desc = e.currentTarget.querySelector(".pillar-desc") as HTMLElement;
                const num = e.currentTarget.querySelector(".pillar-num") as HTMLElement;
                if (title) title.style.color = "#ffffff";
                if (sub) sub.style.color = "rgba(255,255,255,0.75)";
                if (desc) desc.style.color = "rgba(255,255,255,0.85)";
                if (num) num.style.color = "rgba(255,255,255,0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#f9f7f4";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                const title = e.currentTarget.querySelector(".pillar-title") as HTMLElement;
                const sub = e.currentTarget.querySelector(".pillar-sub") as HTMLElement;
                const desc = e.currentTarget.querySelector(".pillar-desc") as HTMLElement;
                const num = e.currentTarget.querySelector(".pillar-num") as HTMLElement;
                if (title) title.style.color = "#0A1628";
                if (sub) sub.style.color = p.accent;
                if (desc) desc.style.color = "#6b7280";
                if (num) num.style.color = "#e5e7eb";
              }}
            >
              {/* Large number */}
              <div
                className="pillar-num absolute top-4 right-5 transition-colors duration-300"
                style={{ fontSize: "56px", fontWeight: 900, color: "#e5e7eb", lineHeight: 1 }}
              >
                {p.num}
              </div>

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
              >
                {p.icon}
              </div>

              <div>
                <h3
                  className="pillar-title transition-colors duration-300 mb-1"
                  style={{ fontSize: "18px", fontWeight: 800, color: "#0A1628", lineHeight: 1.2 }}
                >
                  {p.title}
                </h3>
                <p
                  className="pillar-sub transition-colors duration-300 mb-3"
                  style={{ fontSize: "11px", fontWeight: 600, color: p.accent, letterSpacing: "0.05em" }}
                >
                  {p.subtitle}
                </p>
                <p
                  className="pillar-desc transition-colors duration-300"
                  style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.7 }}
                >
                  {p.desc}
                </p>
              </div>

              {/* Bottom arrow */}
              <div className="mt-auto">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div
          className="mt-16 rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{
            background: "linear-gradient(135deg, #0A1628 60%, #1a2f55)",
            border: "1px solid rgba(201,147,58,0.2)",
          }}
        >
          <div>
            <p style={{ color: "#C9933A", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", marginBottom: "8px" }}>
              LIMITED SEATS AVAILABLE
            </p>
            <h3 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>
              Secure Your Invitation Today
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "14px", marginTop: "8px" }}>
              This is an exclusive, invitation-based event. Registrations are limited and subject to
              confirmation.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onRegister?.(); }}
              className="inline-block px-8 py-4 rounded-xl transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: "#C24F1D",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textDecoration: "none",
              }}
            >
              REGISTER NOW
            </a>
            <a
              href="tel:+919142982258"
              className="inline-block px-8 py-4 rounded-xl transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                border: "1px solid rgba(255,255,255,0.2)",
                textDecoration: "none",
              }}
            >
              CALL US
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}