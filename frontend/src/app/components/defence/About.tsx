import { ImageWithFallback } from "../figma/ImageWithFallback";

export function About() {
  return (
    <section id="about" className="w-full py-20" style={{ backgroundColor: "#f9f7f4" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Label */}
        <div className="flex items-center gap-3 mb-14">
          <div style={{ width: "40px", height: "3px", backgroundColor: "#C24F1D" }} />
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: "#C24F1D",
            }}
          >
            BACKGROUND & CONTEXT
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left Column: About RRU */}
          <div>
            <div
              className="inline-block px-3 py-1 rounded mb-4"
              style={{ backgroundColor: "#0A1628", color: "#C9933A", fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em" }}
            >
              ABOUT RRU
            </div>
            <h2
              className="mb-6"
              style={{
                fontSize: "clamp(22px, 3vw, 36px)",
                fontWeight: 800,
                color: "#0A1628",
                lineHeight: 1.2,
              }}
            >
              Institution of National
              <br />
              <span style={{ color: "#C24F1D" }}>Importance</span>
            </h2>
            <p className="mb-4" style={{ color: "#4a5568", fontSize: "15px", lineHeight: 1.8 }}>
              Rashtriya Raksha University (RRU) is India's premier institution designated as a{" "}
              <strong style={{ color: "#0A1628" }}>Centre of Excellence in National Security and Defence Management</strong>{" "}
              by Hon'ble Prime Minister Shri Narendra Modi.
            </p>
            <p className="mb-6" style={{ color: "#4a5568", fontSize: "15px", lineHeight: 1.8 }}>
              Established under an Act of Parliament, RRU is mandated to develop human resources
              for national security, policing, criminal justice, and allied disciplines — integrating
              research, education, and training at the highest levels.
            </p>

            {/* Credentials */}
            <div className="flex flex-col gap-3">
              {[
                "Act of Parliament – Institution of National Importance",
                "Gandhinagar, Gujarat — Heart of India's Defence Corridor",
                "Premier research in security, policing & strategic affairs",
                "Direct collaboration with MHA, MEA, MoD & DRDO",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#C24F1D" }}
                  >
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l2.5 2.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span style={{ color: "#374151", fontSize: "14px", lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>

            {/* RRU Global Reach Stats — from PDF */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                { num: "1,700+", label: "Programme Participants", sub: "from across the world" },
                { num: "82+", label: "Countries Engaged", sub: "internal & external security" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 text-center"
                  style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderTop: "3px solid #C24F1D" }}
                >
                  <div style={{ fontSize: "26px", fontWeight: 900, color: "#C24F1D", lineHeight: 1 }}>{s.num}</div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#0A1628", marginTop: "4px" }}>{s.label}</div>
                  <div style={{ fontSize: "10px", color: "#9ca3af", marginTop: "2px" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* PM Quote */}
            <div
              className="mt-8 p-5 rounded-xl"
              style={{ backgroundColor: "#0A1628", borderLeft: "4px solid #C24F1D" }}
            >
              <p style={{ color: "#e2e8f0", fontSize: "13px", lineHeight: 1.8, fontStyle: "italic" }}>
                "RRU represents India's commitment to building world-class institutions in the domain
                of national security and defence management."
              </p>
              <p className="mt-2" style={{ color: "#C9933A", fontSize: "11px", fontWeight: 700 }}>
                — Hon'ble PM Shri Narendra Modi
              </p>
            </div>
          </div>

          {/* Right Column: The Event */}
          <div>
            <div
              className="inline-block px-3 py-1 rounded mb-4"
              style={{ backgroundColor: "#C24F1D", color: "#fff", fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em" }}
            >
              THE EVENT
            </div>
            <h2
              className="mb-6"
              style={{
                fontSize: "clamp(22px, 3vw, 36px)",
                fontWeight: 800,
                color: "#0A1628",
                lineHeight: 1.2,
              }}
            >
              A High-Level
              <br />
              <span style={{ color: "#C24F1D" }}>Strategic Forum</span>
            </h2>

            {/* Event image */}
            <div className="rounded-xl overflow-hidden mb-6" style={{ height: "200px" }}>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1665571193857-d9eb56a95fe2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYSUyMGRlZmVuY2UlMjB0ZWNobm9sb2d5JTIwbWlsaXRhcnklMjBleHBvJTIwaGFyZHdhcmV8ZW58MXx8fHwxNzcyMjAzNDUxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Defence Technology"
                className="w-full h-full object-cover"
              />
            </div>

            <p className="mb-4" style={{ color: "#4a5568", fontSize: "15px", lineHeight: 1.8 }}>
              The Defence Attaché Roundtable 2026 is an <strong style={{ color: "#0A1628" }}>exclusive, invitation-only
              high-level diplomatic forum</strong> bringing together Defence Attachés, military representatives,
              and diplomats from across the globe.
            </p>
            <p className="mb-6" style={{ color: "#4a5568", fontSize: "15px", lineHeight: 1.8 }}>
              The event creates a structured platform to build strategic relationships with India's
              defence leadership — spanning policymakers, industry captains, and innovators driving
              the Aatmanirbhar Bharat mission.
            </p>

            {/* Key stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { num: "50+", label: "Countries\nRepresented" },
                { num: "2", label: "Days of\nEngagement" },
                { num: "100+", label: "Indigenous\nCompanies" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="text-center p-4 rounded-xl"
                  style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }}
                >
                  <div
                    style={{ fontSize: "28px", fontWeight: 900, color: "#C24F1D", lineHeight: 1 }}
                  >
                    {stat.num}
                  </div>
                  <div
                    style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px", whiteSpace: "pre-line", lineHeight: 1.3 }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
