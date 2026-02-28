import { useState } from "react";

const day1 = [
  {
    time: "Morning",
    title: "Welcome Address",
    type: "ceremony",
    details: [
      "Opening of the Roundtable Conference for Defence Attachés",
      "Address by Vice Chancellor, Rashtriya Raksha University",
      "Felicitation of distinguished dignitaries and Defence Attachés",
    ],
  },
  {
    time: "Inaugural",
    title: "Inaugural Address",
    subtitle: "Aatmanirbhar Bharat in the Global Defence Tech Landscape: Accelerating Innovation, Exports, and Joint Technology Partnerships",
    type: "keynote",
    details: [
      "India's pivot to a net exporter of combat-proven platforms: BrahMos missiles, Akash air defence, and Tejas fighters",
      "Cost-effective co-production models, shared IP frameworks, and interoperable architectures via defence corridors and joint ventures",
      "Linking Aatmanirbhar reforms in procurement, testing, and supply chain resilience to India's 2047 vision",
      "Collaborative pathways enabling India to lead trusted technology diplomacy for a multipolar security order",
    ],
  },
  {
    time: "Special Address",
    title: "India's Equitable Cooperation Framework",
    subtitle: "Stability, Economic Growth, and Technological Parity for Collaborative Growth with Developing Nations",
    type: "session",
    details: [
      "India's unique approach to international partnerships as a reliable ally for developing countries",
      "Flexible support arrangements and genuine capacity building that preserves partner nations' independence",
      "Real-world examples of affordable solutions delivered during global challenges",
      "A vision of equal partnership where collaborative growth creates opportunities for all nations",
    ],
  },
  {
    time: "Session 1",
    title: "Policy Reforms and Global Integration",
    subtitle: "Building India's Innovation-Led and Inclusive Defence Industrial Framework for Developing Nations",
    type: "session",
    details: [
      "How India's industrial corridors, indigenisation policies, and export facilitation create collaborative opportunities for developing countries",
      "Capacity-building, technology sharing, and skill development partnerships",
      "Offset policies, ease of doing business measures, and integration of MSMEs and startups into global supply chains",
      "How Indian OEMs and R&D institutions can co-develop cost-efficient defence platforms for developing nations",
    ],
  },
  {
    time: "Session 2",
    title: "Streamlined Defence Export Acquisition",
    subtitle: "Enhancing Ease of Defence Acquisition for Strengthened Security & Strategic Cooperation",
    type: "session",
    details: [
      "How India has transformed defence acquisition into a seamless, partner-friendly process delivering quality systems faster and affordably",
      "Simplified export procedures that reduce approval times for partner nations",
      "Flexible financing arrangements tailored to diverse national budgets",
      "Complete technology transfer packages ensuring sovereign control and long-term independence",
    ],
  },
  {
    time: "Session 3",
    title: "Strengthening the Indian Defence Ecosystem",
    subtitle: "Challenges and Opportunities for India and Partner Countries",
    type: "session",
    details: [
      "Advanced financial structures and production frameworks that streamline India's defence exports",
      "Flexible Lines of Credit and payment models to optimise lifecycle costs with rapid delivery",
      "Real-time export monitoring systems, automated compliance processes, and modular architectures",
      "Accelerated platform deployment and partnership models for long-term bilateral engagement",
    ],
  },
  {
    time: "Evening",
    title: "Networking Dinner & Cultural Evening",
    type: "social",
    details: [
      "Gala dinner with India's defence leadership, policymakers, and senior military officials",
      "Traditional cultural performance celebrating India's heritage",
      "Facilitated bilateral meetings on request between Defence Attachés and industry representatives",
    ],
  },
];

const day2 = [
  {
    time: "Full Day",
    title: "Defence Exhibition and Demonstration",
    subtitle: "Indigenous Industry Exposition",
    type: "keynote",
    details: [
      "A curated exhibition and live demonstrations showcasing indigenous defence platforms, technologies, and innovations",
      "Participation by Public Sector Undertakings, private industry, start-ups, and research institutions",
      "Company showcases and B2B formats for direct procurement and co-development discussions",
      "Start-up pitch sessions featuring iDEX-backed innovators across drones, AI/ML, and autonomous systems",
    ],
  },
  {
    time: "Scheduled",
    title: "School & Laboratory Visits",
    subtitle: "Rashtriya Raksha University, Lavad, Gandhinagar, Gujarat",
    type: "session",
    details: [
      "Guided tour of RRU's Lavad campus research and training facilities",
      "Visit to simulation laboratories, security research centres, and academic wings",
      "Interaction with faculty, research scholars, and programme leadership",
      "Hands-on demonstration of security and defence technologies developed at RRU",
    ],
  },
];

const typeColors: Record<string, { bg: string; border: string; dot: string }> = {
  ceremony: { bg: "#fef3c7", border: "#C9933A", dot: "#C9933A" },
  keynote: { bg: "#fff1ee", border: "#C24F1D", dot: "#C24F1D" },
  session: { bg: "#f0f4ff", border: "#0A1628", dot: "#0A1628" },
  social: { bg: "#f0fdf4", border: "#15803d", dot: "#15803d" },
};

const typeLabels: Record<string, string> = {
  ceremony: "CEREMONY",
  keynote: "KEYNOTE",
  session: "SESSION",
  social: "NETWORKING",
};

export function Programme() {
  const [activeDay, setActiveDay] = useState<1 | 2>(1);
  const sessions = activeDay === 1 ? day1 : day2;

  return (
    <section id="programme" className="w-full py-20" style={{ backgroundColor: "#0A1628" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div style={{ width: "40px", height: "2px", backgroundColor: "#C9933A" }} />
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: "#C9933A" }}>
              EVENT PROGRAMME
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
            Two Days of{" "}
            <span style={{ color: "#C9933A" }}>Strategic Engagement</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto" style={{ color: "#94a3b8", fontSize: "15px", lineHeight: 1.7 }}>
            A meticulously curated programme spanning keynotes, policy sessions, live demonstrations,
            and high-level bilateral networking.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div
            className="inline-flex rounded-xl p-1"
            style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {([1, 2] as (1 | 2)[]).map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className="rounded-lg px-8 py-3 transition-all duration-300 cursor-pointer"
                style={{
                  backgroundColor: activeDay === day ? "#C24F1D" : "transparent",
                  color: activeDay === day ? "#fff" : "#94a3b8",
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  border: "none",
                  boxShadow: activeDay === day ? "0 4px 20px rgba(194,79,29,0.4)" : "none",
                }}
              >
                <span style={{ display: "block", fontSize: "11px", opacity: 0.8 }}>
                  {day === 1 ? "MARCH 16" : "MARCH 17"}
                </span>
                DAY {day}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="max-w-4xl mx-auto">
          {sessions.map((session, i) => {
            const style = typeColors[session.type];
            return (
              <div key={i} className="flex gap-5 mb-6 group">
                {/* Time & connector */}
                <div className="flex flex-col items-center" style={{ minWidth: "100px" }}>
                  <span
                    style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", letterSpacing: "0.05em", textAlign: "right", width: "100%" }}
                  >
                    {session.time}
                  </span>
                  <div
                    className="mt-2 w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: style.dot }}
                  />
                  {i < sessions.length - 1 && (
                    <div className="flex-1 w-px mt-1" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
                  )}
                </div>

                {/* Content card */}
                <div
                  className="flex-1 rounded-xl p-5 mb-2"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: `1px solid rgba(255,255,255,0.08)`,
                    borderLeft: `3px solid ${style.dot}`,
                  }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <span
                        className="inline-block px-2 py-0.5 rounded text-xs font-bold mb-2"
                        style={{
                          backgroundColor: style.border + "22",
                          color: style.border,
                          letterSpacing: "0.1em",
                          fontSize: "9px",
                        }}
                      >
                        {typeLabels[session.type]}
                      </span>
                      <h3
                        style={{ fontSize: "15px", fontWeight: 700, color: "#f1f5f9", lineHeight: 1.3 }}
                      >
                        {session.title}
                      </h3>
                      {session.subtitle && (
                        <p style={{ fontSize: "12px", color: "#C9933A", marginTop: "2px", fontStyle: "italic" }}>
                          {session.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <ul className="mt-3 flex flex-col gap-1.5">
                    {session.details.map((detail, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <div
                          className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: style.dot }}
                        />
                        <span style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.5 }}>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
