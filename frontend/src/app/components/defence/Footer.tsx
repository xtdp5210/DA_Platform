export function Footer({ onRegister }: { onRegister?: () => void }) {
  return (
    <footer id="contact" className="w-full" style={{ backgroundColor: "#C24F1D" }}>
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)" }}
              >
                <span style={{ color: "#fff", fontSize: "11px", fontWeight: 900, letterSpacing: "0.05em" }}>RRU</span>
              </div>
              <div>
                <p style={{ color: "#fff", fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em", lineHeight: 1.2 }}>
                  DEFENCE ATTACHÉ
                </p>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em" }}>
                  ROUNDTABLE & EXPO 2026
                </p>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", lineHeight: 1.7, maxWidth: "280px" }}>
              An exclusive high-level diplomatic forum connecting global defence leadership with
              India's sovereign defence ecosystem.
            </p>

            {/* Ministry logos row */}
            <div className="flex flex-wrap gap-2 mt-6">
              {["MHA", "MEA", "RRU", "MoD", "DRDO"].map((abbr) => (
                <div
                  key={abbr}
                  className="px-3 py-1.5 rounded"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    color: "#fff",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                  }}
                >
                  {abbr}
                </div>
              ))}
            </div>
          </div>

          {/* Venue */}
          <div>
            <h4
              style={{ color: "rgba(255,255,255,0.6)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", marginBottom: "16px" }}
            >
              VENUE ADDRESS
            </h4>
            <div className="flex items-start gap-3 mb-4">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="2"
                className="mt-0.5 flex-shrink-0"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <address
                className="not-italic"
                style={{ color: "#fff", fontSize: "14px", lineHeight: 1.8, fontWeight: 500 }}
              >
                Rashtriya Raksha University
                <br />
                Lavad, Dahegam
                <br />
                Gandhinagar — 382305
                <br />
                Gujarat, India
              </address>
            </div>

            {/* Date */}
            <div className="flex items-center gap-3">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="2"
                className="flex-shrink-0"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span style={{ color: "#fff", fontSize: "14px", fontWeight: 600 }}>
                16th & 17th March, 2026
              </span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{ color: "rgba(255,255,255,0.6)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", marginBottom: "16px" }}
            >
              FOR PARTICIPATION & ENQUIRIES
            </h4>

            <a
              href="mailto:Da2026@rru.ac.in"
              className="flex items-center gap-3 mb-5 group"
              style={{ textDecoration: "none" }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em" }}>
                  EMAIL
                </p>
                <p style={{ color: "#fff", fontSize: "15px", fontWeight: 700 }}>Da2026@rru.ac.in</p>
              </div>
            </a>

            <a
              href="tel:+919142982258"
              className="flex items-center gap-3"
              style={{ textDecoration: "none" }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012.18 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
              </div>
              <div>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em" }}>
                  CONTACT
                </p>
                <p style={{ color: "#fff", fontSize: "15px", fontWeight: 700 }}>+91-9142982258</p>
              </div>
            </a>

            {/* Quick register */}
            <a
              href="mailto:Da2026@rru.ac.in?subject=Registration%20Enquiry%20-%20Defence%20Attaché%20Roundtable%202026"
              className="mt-6 inline-block px-6 py-3 rounded-xl w-full text-center transition-all duration-200"
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                border: "2px solid rgba(255,255,255,0.4)",
                color: "#fff",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textDecoration: "none",
              }}
            >
              SEND ENQUIRY
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>
              © 2026 Rashtriya Raksha University. All Rights Reserved.
            </p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", textAlign: "center" }}>
              Ministry of Home Affairs · Ministry of External Affairs · Ministry of Defence · DRDO
            </p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>
              Gandhinagar, Gujarat, India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}