import { useState } from "react";
import { IndianBorder } from "./IndianBorder";

export function LoginPage({ onBack, onRegister }: { onBack: () => void; onRegister: () => void }) {
  const [form, setForm] = useState({ repName: "", company: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleLogin = () => {
    const e: Record<string, string> = {};
    if (!form.repName.trim()) e.repName = "Required";
    if (!form.company.trim()) e.company = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setLoading(true);
      setTimeout(() => { setLoading(false); setLoggedIn(true); }, 1200);
    }
  };

  const inputStyle = (key: string): React.CSSProperties => ({
    width: "100%", padding: "12px 16px", borderRadius: "10px", fontSize: "14px",
    border: `1.5px solid ${errors[key] ? "#ef4444" : "#e2e8f0"}`,
    outline: "none", backgroundColor: "#fff", color: "#0A1628", fontFamily: "inherit",
    boxSizing: "border-box",
  });

  const labelStyle: React.CSSProperties = {
    fontSize: "11px", fontWeight: 700, color: "#374151",
    letterSpacing: "0.08em", display: "block", marginBottom: "6px",
  };

  if (loggedIn) return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9f7f4", display: "flex", flexDirection: "column" }}>
      <IndianBorder sticky />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ maxWidth: "520px", width: "100%", textAlign: "center" }}>
          <div style={{ width: 80, height: 80, backgroundColor: "#C24F1D", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#0A1628", marginBottom: "10px" }}>Welcome Back!</h2>
          <p style={{ color: "#6b7280", fontSize: "15px", marginBottom: "6px" }}>
            <strong style={{ color: "#0A1628" }}>{form.repName}</strong>
          </p>
          <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "28px" }}>{form.company}</p>

          <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "24px", border: "1px solid #e5e7eb", marginBottom: "24px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#C24F1D", letterSpacing: "0.15em", marginBottom: "16px" }}>YOUR REGISTRATION STATUS</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { icon: "✓", label: "Registration", value: "Confirmed", color: "#16a34a" },
                { icon: "📍", label: "Stall Assigned", value: "Pending confirmation", color: "#C24F1D" },
                { icon: "📅", label: "Event Date", value: "17th March, 2026", color: "#0A1628" },
                { icon: "📍", label: "Venue", value: "RRU, Gandhinagar, Gujarat", color: "#0A1628" },
              ].map(({ icon, label, value, color }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
                  <span style={{ fontSize: "13px", color: "#6b7280" }}>{icon} {label}</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button onClick={onBack} style={{ backgroundColor: "#f3f4f6", color: "#374151", border: "none", borderRadius: "10px", padding: "12px 24px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
              ← Home
            </button>
            <button onClick={() => setLoggedIn(false)} style={{ backgroundColor: "#C24F1D", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 24px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
              Logout
            </button>
          </div>
        </div>
      </div>
      <IndianBorder flip />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9f7f4", display: "flex", flexDirection: "column" }}>
      <IndianBorder sticky />

      {/* Top bar */}
      <div style={{ backgroundColor: "#0A1628", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Back to Home
        </button>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#C9933A", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em" }}>DEFENCE ATTACHÉ ROUNDTABLE 2026</p>
          <p style={{ color: "#fff", fontSize: "14px", fontWeight: 700 }}>Exhibitor Login</p>
        </div>
        <div style={{ width: "120px" }} />
      </div>

      {/* Login card */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ maxWidth: "480px", width: "100%" }}>

          {/* Logo area */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ width: 64, height: 64, backgroundColor: "#C24F1D", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0A1628", marginBottom: "6px" }}>Exhibitor Login</h2>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>Sign in to access your registration details</p>
          </div>

          <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "32px", border: "1px solid #e5e7eb", boxShadow: "0 4px 24px rgba(10,22,40,0.06)" }}>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* Representative Name */}
              <div>
                <label style={labelStyle}>NAME OF THE REPRESENTATIVE *</label>
                <input value={form.repName} onChange={(e) => set("repName", e.target.value)}
                  placeholder="Your full name" style={inputStyle("repName")}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#C24F1D")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = errors.repName ? "#ef4444" : "#e2e8f0")}
                />
                {errors.repName && <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px" }}>{errors.repName}</p>}
              </div>

              {/* Company */}
              <div>
                <label style={labelStyle}>COMPANY NAME *</label>
                <input value={form.company} onChange={(e) => set("company", e.target.value)}
                  placeholder="Registered company name" style={inputStyle("company")}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#C24F1D")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = errors.company ? "#ef4444" : "#e2e8f0")}
                />
                {errors.company && <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px" }}>{errors.company}</p>}
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>EMAIL ADDRESS *</label>
                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                  placeholder="official@company.com" style={inputStyle("email")}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#C24F1D")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = errors.email ? "#ef4444" : "#e2e8f0")}
                />
                {errors.email && <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px" }}>{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label style={labelStyle}>PHONE NUMBER *</label>
                <input value={form.phone} onChange={(e) => set("phone", e.target.value)}
                  placeholder="+91 XXXXX XXXXX" style={inputStyle("phone")}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#C24F1D")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = errors.phone ? "#ef4444" : "#e2e8f0")}
                />
                {errors.phone && <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px" }}>{errors.phone}</p>}
              </div>
            </div>

            {/* Login button */}
            <button onClick={handleLogin} disabled={loading}
              style={{ width: "100%", marginTop: "28px", padding: "14px", backgroundColor: loading ? "#9ca3af" : "#C24F1D", color: "#fff", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", letterSpacing: "0.08em", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.2s" }}>
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Verifying...
                </>
              ) : "LOGIN →"}
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
              <span style={{ fontSize: "12px", color: "#9ca3af" }}>New exhibitor?</span>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
            </div>

            <button onClick={onRegister}
              style={{ width: "100%", padding: "12px", backgroundColor: "#fff", color: "#0A1628", border: "2px solid #0A1628", borderRadius: "10px", fontSize: "14px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.06em" }}>
              REGISTER YOUR COMPANY
            </button>
          </div>

          {/* Contact */}
          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "#9ca3af" }}>
            Need help? Email{" "}
            <a href="mailto:Da2026@rru.ac.in" style={{ color: "#C24F1D", fontWeight: 600 }}>Da2026@rru.ac.in</a>
            {" "}or call{" "}
            <a href="tel:+919142982258" style={{ color: "#C24F1D", fontWeight: 600 }}>+91-9142982258</a>
          </p>
        </div>
      </div>

      <IndianBorder flip />

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}