import { ImageWithFallback } from "../figma/ImageWithFallback";

const highlights = [
  "Exhibit innovation-driven defence solutions with direct engagement and visibility among key defence stakeholders and global partners",
  "Align product portfolios with evolving global defence requirements",
  "Demonstrate technological maturity and scalable manufacturing competence",
  "Explore long-term collaboration in technology development, co-production, and capability enhancement",
  "B2B interaction opportunities with direct engagement with officials & international delegates",
  "Dedicated exhibition space with high-footfall visibility and institutional branding exposure",
];

const companies = [
  "Defence Manufacturers",
  "Arms & Ammunition Suppliers",
  "Defence Technology & Surveillance Companies",
  "Cyber Security & Strategic Solution Providers",
  "Startups & MSMEs",
  "Tactical Equipment & Gear Providers",
  "Research & Innovation Institutions",
];

export function Exposition() {
  return (
    <section id="exposition" className="w-full py-20" style={{ backgroundColor: "#f9f7f4" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div style={{ width: "40px", height: "2px", backgroundColor: "#C24F1D" }} />
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: "#C24F1D" }}>
              INDIGENOUS DEFENCE EXPOSITION
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
            The Heart of{" "}
            <span style={{ color: "#C24F1D" }}>Aatmanirbhar Bharat</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto" style={{ color: "#6b7280", fontSize: "15px", lineHeight: 1.7 }}>
            A parallel, fully immersive industry exposition showcasing India's sovereign defence
            manufacturing capabilities — live, at scale, and export-ready.
          </p>
        </div>

        {/* Main Content */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{ backgroundColor: "#0A1628" }}
        >
          <div className="grid lg:grid-cols-2">
            {/* Left: Images */}
            <div className="relative" style={{ minHeight: "500px" }}>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1759715262609-4e916c300402?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWZlbmNlJTIwaW5kdXN0cnklMjBleGhpYml0aW9uJTIwdGVjaG5vbG9neSUyMHNob3djYXNlfGVufDF8fHx8MTc3MjIwMzQ1NXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Defence Industry Exhibition"
                className="w-full h-full object-cover"
                style={{ minHeight: "400px" }}
              />
              {/* Overlay badge */}
              <div
                className="absolute bottom-6 left-6 right-6 p-4 rounded-xl"
                style={{
                  backgroundColor: "rgba(10,22,40,0.9)",
                  border: "1px solid rgba(201,147,58,0.3)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#C24F1D" }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ color: "#C9933A", fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em" }}>
                      VENUE
                    </p>
                    <p style={{ color: "#fff", fontSize: "13px", fontWeight: 600 }}>
                      Rashtriya Raksha University, Gandhinagar
                    </p>
                    <p style={{ color: "#94a3b8", fontSize: "11px" }}>16th & 17th March, 2026 — Full Day</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Details */}
            <div className="p-10 flex flex-col gap-8">
              {/* Highlights */}
              <div>
                <h3
                  style={{ color: "#C9933A", fontSize: "13px", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "16px" }}
                >
                  VALUE PROPOSITION
                </h3>
                <div className="flex flex-col gap-3">
                  {highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="mt-1 w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "rgba(194,79,29,0.2)", border: "1px solid #C24F1D" }}
                      >
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l2.5 2.5L9 1" stroke="#C24F1D" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                      </div>
                      <span style={{ color: "#cbd5e1", fontSize: "14px", lineHeight: 1.6 }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.08)" }} />

              {/* Featured Companies */}
              <div>
                <h3
                  style={{ color: "#C9933A", fontSize: "13px", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "16px" }}
                >
                  WHO SHOULD EXHIBIT?
                </h3>
                <div className="flex flex-wrap gap-2">
                  {companies.map((c, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "#e2e8f0",
                        fontSize: "11px",
                        fontWeight: 500,
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div
                className="p-5 rounded-xl"
                style={{
                  background: "linear-gradient(135deg, rgba(194,79,29,0.2), rgba(201,147,58,0.1))",
                  border: "1px solid rgba(194,79,29,0.3)",
                }}
              >
                <p style={{ color: "#fff", fontSize: "14px", fontWeight: 600, lineHeight: 1.6 }}>
                  Interested in exhibiting at the Exposition?
                </p>
                <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "4px" }}>
                  Contact us at{" "}
                  <a href="mailto:da2026@rru.ac.in" style={{ color: "#C9933A" }}>
                    da2026@rru.ac.in
                  </a>{" "}
                  for exhibition opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Startup Innovation Banner */}
        <div className="mt-8 rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-8" style={{ backgroundColor: "#C24F1D" }}>
              <div
                className="inline-block px-3 py-1 rounded-full mb-4"
                style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fff", fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em" }}
              >
                B2B MEETINGS
              </div>
              <h3
                style={{ fontSize: "24px", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: "12px" }}
              >
                Company Showcases
                <br />
                & B2B Formats
              </h3>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "14px", lineHeight: 1.7 }}>
                A strategic platform integrating defence diplomacy, industrial capability, and
                institutional leadership in national security — enabling informed and professional
                engagement among defence representatives, strategic community, and technology enterprises.
              </p>
            </div>
            <div className="relative" style={{ minHeight: "200px" }}>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1590098563837-5e7669b27e55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFydHVwJTIwdGVjaG5vbG9neSUyMHBpdGNoJTIwaW5ub3ZhdGlvbnxlbnwxfHx8fDE3NzIyMDM0NjR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Startup Pitch"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to right, rgba(194,79,29,0.3), transparent)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
