import { useState } from "react";
import { IndianBorder } from "./IndianBorder";

export function RegisterPage({ onBack }: { onBack: () => void }) {
  const [form, setForm] = useState({ repName: "", company: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    const e: Record<string, string> = {};
    if (!form.repName.trim()) e.repName = "Required";
    if (!form.company.trim()) e.company = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    setErrors(e);
    setErrorMsg("");
    if (Object.keys(e).length === 0) {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/register/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setSuccess(true);
        } else {
          const data = await res.json();
          setErrorMsg(data.detail || "Registration failed");
        }
      } catch (err) {
        setErrorMsg("Network error");
      }
      setLoading(false);
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

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9f7f4", display: "flex", flexDirection: "column" }}>
      <IndianBorder sticky />
      <div style={{ backgroundColor: "#0A1628", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Back to Home
        </button>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#C9933A", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em" }}>USER REGISTRATION</p>
          <p style={{ color: "#fff", fontSize: "14px", fontWeight: 700 }}>Register</p>
        </div>
        <div style={{ width: "120px" }} />
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ maxWidth: "480px", width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ width: 64, height: 64, backgroundColor: "#C24F1D", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0A1628", marginBottom: "6px" }}>User Registration</h2>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>Sign up to access the platform</p>
          </div>
          <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "32px", border: "1px solid #e5e7eb", boxShadow: "0 4px 24px rgba(10,22,40,0.06)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={labelStyle}>NAME OF THE REPRESENTATIVE *</label>
                <input value={form.repName} onChange={(e) => set("repName", e.target.value)}
                  placeholder="Your full name" style={inputStyle("repName")}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#C24F1D")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = errors.repName ? "#ef4444" : "#e2e8f0")}
                />
                {errors.repName && <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px" }}>{errors.repName}</p>}
              </div>
              <div>
                <label style={labelStyle}>COMPANY NAME *</label>
                <input value={form.company} onChange={(e) => set("company", e.target.value)}
                  placeholder="Registered company name" style={inputStyle("company")}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#C24F1D")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = errors.company ? "#ef4444" : "#e2e8f0")}
                />
                {errors.company && <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px" }}>{errors.company}</p>}
              </div>
              <div>
                <label style={labelStyle}>EMAIL ADDRESS *</label>
                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                  placeholder="official@company.com" style={inputStyle("email")}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#C24F1D")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = errors.email ? "#ef4444" : "#e2e8f0")}
                />
                {errors.email && <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px" }}>{errors.email}</p>}
              </div>
              <div>
                <label style={labelStyle}>PHONE NUMBER *</label>
                <input value={form.phone} onChange={(e) => set("phone", e.target.value)}
                  placeholder="+91 XXXXX XXXXX" style={inputStyle("phone")}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#C24F1D")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = errors.phone ? "#ef4444" : "#e2e8f0")}
                />
                {errors.phone && <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px" }}>{errors.phone}</p>}
              </div>
              {errorMsg && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "8px" }}>{errorMsg}</p>}
              {success && <p style={{ color: "#16a34a", fontSize: "13px", marginTop: "8px" }}>Registration successful!</p>}
            </div>
            <button onClick={handleSubmit} disabled={loading}
              style={{ width: "100%", marginTop: "28px", padding: "14px", backgroundColor: loading ? "#9ca3af" : "#C24F1D", color: "#fff", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", letterSpacing: "0.08em", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.2s" }}>
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Registering...
                </>
              ) : "REGISTER →"}
            </button>
          </div>
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