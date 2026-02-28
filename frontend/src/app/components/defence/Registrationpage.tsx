import { useState } from "react";
import { IndianBorder } from "./IndianBorder";

// Stall layout from the image
// A series (right wall): A1-A15 (A1,A2 at bottom, A3-A15 going up)
// B series (top row): B1-B7
// C series (center green): C1-C20 (2 columns)
// D series (left wall + bottom): D1-D4 bottom, D5-D13 left wall

const A_STALLS = ["A1","A2","A3","A4","A5","A6","A7","A8","A9","A10","A11","A12","A13","A14","A15"];
const B_STALLS = ["B1","B2","B3","B4","B5","B6","B7"];
const C_STALLS = ["C1","C2","C3","C4","C5","C6","C7","C8","C9","C10","C11","C12","C13","C14","C15","C16","C17","C18","C19","C20"];
const D_STALLS = ["D1","D2","D3","D4","D5","D6","D7","D8","D9","D10","D11","D12","D13"];

const SECTORS = [
  "Aerospace & Aviation","Armoured Vehicles","Artillery & Ordnance","Autonomous Systems & Drones",
  "C4ISR & Communications","Cyber & Electronic Warfare","Defence Electronics","Defence Finance & Investment",
  "Defence Manufacturing","Defence R&D","Explosives & Ammunition","Land Combat Systems",
  "Maritime & Naval","Medical & CBRNE","Missiles & Rockets","Optronics & Sensors",
  "Propulsion Systems","Security & Surveillance","Small Arms","Space & Satellite",
  "Start-up / Innovation","Training & Simulation","Other",
];

const SUPPORT = [
  "Audio-Visual Equipment","Electricity Connection","Exhibition Furniture","High-Speed Internet",
  "Interpreter/Translation","Meeting Arrangement","Promotional Material Display","Security Escort",
];

function StallMap({ selected, onSelect, booked }: { selected: string; onSelect: (s: string) => void; booked: string[] }) {
  const stallColor = (id: string) => {
    if (booked.includes(id)) return { bg: "#6b7280", text: "#9ca3af", cursor: "not-allowed", label: "Taken" };
    if (id === selected) return { bg: "#C24F1D", text: "#fff", cursor: "pointer", label: "" };
    if (id.startsWith("C")) return { bg: "#16a34a", text: "#fff", cursor: "pointer", label: "" };
    if (id.startsWith("A") || id.startsWith("D") || id.startsWith("B"))
      return { bg: "#1d4ed8", text: "#fff", cursor: "pointer", label: "" };
    return { bg: "#1d4ed8", text: "#fff", cursor: "pointer", label: "" };
  };

  const StallBtn = ({ id, w = 52, h = 36 }: { id: string; w?: number; h?: number }) => {
    const s = stallColor(id);
    const isBooked = booked.includes(id);
    return (
      <button
        onClick={() => !isBooked && onSelect(id)}
        title={isBooked ? "Already booked" : `Select stall ${id}`}
        style={{
          width: w, height: h, backgroundColor: s.bg, color: s.text,
          fontSize: "10px", fontWeight: 700, border: id === selected ? "2px solid #ff6b35" : "1.5px solid rgba(255,255,255,0.3)",
          borderRadius: "4px", cursor: s.cursor, display: "flex", alignItems: "center",
          justifyContent: "center", transition: "all 0.15s", flexShrink: 0,
          boxShadow: id === selected ? "0 0 0 3px rgba(194,79,29,0.4)" : "none",
          letterSpacing: "0.02em",
        }}
        onMouseEnter={(e) => { if (!isBooked && id !== selected) (e.currentTarget as HTMLElement).style.opacity = "0.8"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
      >
        {id}
      </button>
    );
  };

  return (
    <div style={{ backgroundColor: "#f1f5f9", borderRadius: "12px", padding: "16px", border: "1px solid #e2e8f0" }}>
      <p style={{ fontSize: "11px", fontWeight: 700, color: "#C24F1D", letterSpacing: "0.15em", marginBottom: "12px", textAlign: "center" }}>
        STALL SIZE: 10×10 FT — CLICK TO SELECT
      </p>

      {/* Legend */}
      <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "16px", flexWrap: "wrap" }}>
        {[
          { color: "#1d4ed8", label: "Available (A/B/D)" },
          { color: "#16a34a", label: "Available (C — Centre)" },
          { color: "#C24F1D", label: "Your Selection" },
          { color: "#6b7280", label: "Already Booked" },
        ].map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: 12, height: 12, backgroundColor: l.color, borderRadius: 2 }} />
            <span style={{ fontSize: "10px", color: "#374151" }}>{l.label}</span>
          </div>
        ))}
      </div>

      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: "480px" }}>

          {/* Top row: Refreshments + B stalls + Refreshments */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "8px", justifyContent: "space-between" }}>
            <div style={{ backgroundColor: "#C24F1D", color: "#fff", fontSize: "9px", fontWeight: 700, padding: "4px 8px", borderRadius: "4px", textAlign: "center", width: "60px" }}>
              Refresh-<br />ments
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
              {[...B_STALLS].reverse().map((id) => <StallBtn key={id} id={id} w={48} h={32} />)}
            </div>
            <div style={{ backgroundColor: "#C24F1D", color: "#fff", fontSize: "9px", fontWeight: 700, padding: "4px 8px", borderRadius: "4px", textAlign: "center", width: "60px" }}>
              Refresh-<br />ments
            </div>
          </div>

          {/* Main hall */}
          <div style={{ display: "flex", gap: "8px", alignItems: "stretch" }}>

            {/* Left column: Way to Exit + B2B + D stalls */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "center" }}>
              <div style={{ fontSize: "9px", color: "#374151", fontWeight: 600, writingMode: "vertical-rl", transform: "rotate(180deg)", marginBottom: "4px" }}>Way to Exit ←</div>
              <div style={{ backgroundColor: "#dc2626", color: "#fff", fontSize: "8px", fontWeight: 700, padding: "6px 4px", borderRadius: "4px", textAlign: "center", width: "48px", marginBottom: "4px" }}>
                B2B<br/>Meeting<br/>Room
              </div>
              {["D13","D12","D11","D10","D9","D8","D7","D6","D5"].map((id) => (
                <StallBtn key={id} id={id} w={48} h={32} />
              ))}
            </div>

            {/* Centre: flow arrows + C stalls grid */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              {/* Flow arrow down */}
              <div style={{ color: "#9ca3af", fontSize: "18px" }}>↓</div>

              {/* C stalls: 2 columns, C11/C10 at top, C20/C1 at bottom */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
                {Array.from({ length: 10 }).map((_, i) => {
                  const leftId = `C${11 + i}`;
                  const rightId = `C${10 - i}`;
                  return (
                    <div key={i} style={{ display: "contents" }}>
                      <StallBtn id={leftId} w={60} h={36} />
                      <StallBtn id={rightId} w={60} h={36} />
                    </div>
                  );
                })}
              </div>

              {/* Flow arrow down */}
              <div style={{ color: "#9ca3af", fontSize: "18px" }}>↓</div>
            </div>

            {/* Right column: B2B + A stalls */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "center" }}>
              <div style={{ backgroundColor: "#dc2626", color: "#fff", fontSize: "8px", fontWeight: 700, padding: "6px 4px", borderRadius: "4px", textAlign: "center", width: "48px", marginBottom: "4px" }}>
                B2B<br/>Meeting<br/>Room
              </div>
              {["A15","A14","A13","A12","A11","A10","A9","A8","A7","A6","A5","A4","A3"].map((id) => (
                <StallBtn key={id} id={id} w={48} h={32} />
              ))}
            </div>
          </div>

          {/* Bottom: Entry 2 + D1-D4 + Entry 1 + A1-A2 */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "8px", gap: "8px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <div style={{ display: "flex", gap: "4px" }}>
                {["D4","D3","D2","D1"].map((id) => <StallBtn key={id} id={id} w={48} h={32} />)}
              </div>
              <div style={{ fontSize: "9px", color: "#374151", fontWeight: 600 }}>← Entry 2</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <div style={{ fontSize: "9px", color: "#374151", fontWeight: 600 }}>↑ Entry 1</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <div style={{ display: "flex", gap: "4px" }}>
                {["A1","A2"].map((id) => <StallBtn key={id} id={id} w={48} h={32} />)}
              </div>
            </div>
          </div>

        </div>
      </div>

      {selected && (
        <div style={{ marginTop: "12px", padding: "10px 14px", backgroundColor: "#fff7ed", border: "1px solid #C24F1D", borderRadius: "8px", textAlign: "center" }}>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#C24F1D" }}>
            ✓ Stall {selected} selected — 10×10 ft
          </span>
        </div>
      )}
    </div>
  );
}

// Already-booked stalls (demo)
const BOOKED_STALLS = ["A3","A7","B3","C5","C12","D8","D11"];

export function RegistrationPage({ onBack, onLogin }: { onBack: () => void; onLogin: () => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    companyName: "", sector: "", repName: "", email: "", phone: "",
    companyProfile: "", products: "", stallNumber: "", support: [] as string[], notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));
  const toggleSupport = (item: string) => setForm((f) => ({
    ...f,
    support: f.support.includes(item) ? f.support.filter((s) => s !== item) : [...f.support, item],
  }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.companyName.trim()) e.companyName = "Required";
    if (!form.sector) e.sector = "Required";
    if (!form.repName.trim()) e.repName = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.stallNumber) e.stallNumber = "Please select a stall from the map";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) setSubmitted(true);
  };

  const inputStyle = (key: string) => ({
    width: "100%", padding: "10px 14px", borderRadius: "8px", fontSize: "14px",
    border: `1.5px solid ${errors[key] ? "#ef4444" : "#e2e8f0"}`,
    outline: "none", backgroundColor: "#fff", color: "#0A1628",
    fontFamily: "inherit",
  });

  const labelStyle = { fontSize: "12px", fontWeight: 700, color: "#374151", letterSpacing: "0.06em", display: "block", marginBottom: "6px" };

  if (submitted) return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9f7f4", display: "flex", flexDirection: "column" }}>
      <IndianBorder sticky />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ maxWidth: "520px", width: "100%", textAlign: "center" }}>
          <div style={{ width: 80, height: 80, backgroundColor: "#C24F1D", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#0A1628", marginBottom: "12px" }}>Registration Submitted!</h2>
          <p style={{ color: "#6b7280", fontSize: "15px", lineHeight: 1.7, marginBottom: "8px" }}>
            Thank you, <strong style={{ color: "#0A1628" }}>{form.repName}</strong> from <strong style={{ color: "#0A1628" }}>{form.companyName}</strong>.
          </p>
          <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px" }}>
            Stall <strong style={{ color: "#C24F1D" }}>{form.stallNumber}</strong> has been reserved. A confirmation will be sent to <strong>{form.email}</strong>.
          </p>
          <div style={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", marginBottom: "24px" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#C24F1D", letterSpacing: "0.12em", marginBottom: "12px" }}>REGISTRATION SUMMARY</p>
            {[
              ["Company", form.companyName],
              ["Sector", form.sector],
              ["Representative", form.repName],
              ["Email", form.email],
              ["Phone", form.phone],
              ["Stall", form.stallNumber + " (10×10 ft)"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f3f4f6" }}>
                <span style={{ fontSize: "12px", color: "#9ca3af" }}>{k}</span>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#0A1628" }}>{v}</span>
              </div>
            ))}
          </div>
          <button onClick={onBack} style={{ backgroundColor: "#C24F1D", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 32px", fontSize: "14px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.06em" }}>
            ← BACK TO HOME
          </button>
        </div>
      </div>
      <IndianBorder flip />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9f7f4", display: "flex", flexDirection: "column" }}>
      <IndianBorder sticky />

      {/* Page header */}
      <div style={{ backgroundColor: "#0A1628", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Back to Home
          </button>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#C9933A", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em" }}>DEFENCE ATTACHÉ ROUNDTABLE 2026</p>
          <p style={{ color: "#fff", fontSize: "14px", fontWeight: 700 }}>Exhibitor Registration</p>
        </div>
        <button onClick={onLogin} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", cursor: "pointer", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: 600 }}>
          Already registered? Login
        </button>
      </div>

      <div style={{ flex: 1, maxWidth: "900px", width: "100%", margin: "0 auto", padding: "40px 24px" }}>

        {/* Progress steps */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0", marginBottom: "40px" }}>
          {[
            { n: 1, label: "Company Details" },
            { n: 2, label: "Stall Booking" },
            { n: 3, label: "Review & Submit" },
          ].map(({ n, label }, i) => (
            <div key={n} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  backgroundColor: step >= n ? "#C24F1D" : "#e5e7eb",
                  color: step >= n ? "#fff" : "#9ca3af",
                  fontSize: "13px", fontWeight: 800, transition: "all 0.3s",
                }}>
                  {step > n ? "✓" : n}
                </div>
                <span style={{ fontSize: "10px", fontWeight: 600, color: step >= n ? "#C24F1D" : "#9ca3af", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{label}</span>
              </div>
              {i < 2 && (
                <div style={{ width: "80px", height: "2px", backgroundColor: step > n ? "#C24F1D" : "#e5e7eb", margin: "0 8px", marginBottom: "22px", transition: "all 0.3s" }} />
              )}
            </div>
          ))}
        </div>

        {/* STEP 1: Company Details */}
        {step === 1 && (
          <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "32px", border: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#0A1628", marginBottom: "24px", paddingBottom: "16px", borderBottom: "2px solid #f3f4f6" }}>
              Company & Representative Information
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {/* 1. Company Name */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>1. NAME OF THE COMPANY *</label>
                <input value={form.companyName} onChange={(e) => set("companyName", e.target.value)}
                  placeholder="Enter full legal company name" style={inputStyle("companyName")} />
                {errors.companyName && <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px" }}>{errors.companyName}</p>}
              </div>

              {/* 2. Sector */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>2. CATEGORY / SECTOR OF PRODUCTION / INNOVATION *</label>
                <select value={form.sector} onChange={(e) => set("sector", e.target.value)} style={{ ...inputStyle("sector"), appearance: "none" }}>
                  <option value="">— Select sector —</option>
                  {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.sector && <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px" }}>{errors.sector}</p>}
              </div>

              {/* 3. Rep Name */}
              <div>
                <label style={labelStyle}>3. NAME OF THE HEAD / REPRESENTATIVE *</label>
                <input value={form.repName} onChange={(e) => set("repName", e.target.value)}
                  placeholder="Full name with designation" style={inputStyle("repName")} />
                {errors.repName && <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px" }}>{errors.repName}</p>}
              </div>

              {/* 4a. Email */}
              <div>
                <label style={labelStyle}>4. EMAIL ADDRESS *</label>
                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                  placeholder="official@company.com" style={inputStyle("email")} />
                {errors.email && <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px" }}>{errors.email}</p>}
              </div>

              {/* 4b. Phone */}
              <div>
                <label style={labelStyle}>PHONE NUMBER *</label>
                <input value={form.phone} onChange={(e) => set("phone", e.target.value)}
                  placeholder="+91 XXXXX XXXXX" style={inputStyle("phone")} />
                {errors.phone && <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px" }}>{errors.phone}</p>}
              </div>

              {/* 5. Company Profile URL */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>5. LINK TO COMPANY PROFILE / WEBSITE</label>
                <input value={form.companyProfile} onChange={(e) => set("companyProfile", e.target.value)}
                  placeholder="https://www.yourcompany.com" style={inputStyle("companyProfile")} />
              </div>

              {/* 6. Products */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>6. PRODUCTS / INNOVATIONS FEATURING IN THE EXPO *</label>
                <textarea value={form.products} onChange={(e) => set("products", e.target.value)}
                  placeholder="List the key products, platforms, or innovations you will exhibit (one per line)..."
                  rows={4}
                  style={{ ...inputStyle("products"), resize: "vertical", lineHeight: "1.6" }} />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "28px" }}>
              <button onClick={() => {
                const e: Record<string, string> = {};
                if (!form.companyName.trim()) e.companyName = "Required";
                if (!form.sector) e.sector = "Required";
                if (!form.repName.trim()) e.repName = "Required";
                if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
                if (!form.phone.trim()) e.phone = "Required";
                setErrors(e);
                if (Object.keys(e).length === 0) setStep(2);
              }} style={{ backgroundColor: "#C24F1D", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 32px", fontSize: "14px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.06em" }}>
                NEXT: BOOK YOUR STALL →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Stall Booking */}
        {step === 2 && (
          <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "32px", border: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#0A1628", marginBottom: "8px" }}>
              7. Select Your Stall Number
            </h3>
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px", paddingBottom: "16px", borderBottom: "2px solid #f3f4f6" }}>
              Click on any available stall to select it. Stall size is 10×10 ft. Grey stalls are already booked.
            </p>

            <StallMap
              selected={form.stallNumber}
              onSelect={(s) => { set("stallNumber", s); setErrors((e) => ({ ...e, stallNumber: "" })); }}
              booked={BOOKED_STALLS}
            />
            {errors.stallNumber && (
              <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "8px", textAlign: "center" }}>{errors.stallNumber}</p>
            )}

            {/* 8. Additional Support */}
            <div style={{ marginTop: "32px" }}>
              <label style={{ ...labelStyle, fontSize: "13px" }}>8. ADDITIONAL SUPPORT REQUIRED (select all that apply)</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "12px" }}>
                {SUPPORT.map((item) => (
                  <label key={item} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "10px 14px", borderRadius: "8px", border: `1.5px solid ${form.support.includes(item) ? "#C24F1D" : "#e5e7eb"}`, backgroundColor: form.support.includes(item) ? "#fff7ed" : "#fff", transition: "all 0.2s" }}>
                    <div style={{ width: 18, height: 18, borderRadius: "4px", backgroundColor: form.support.includes(item) ? "#C24F1D" : "#fff", border: `2px solid ${form.support.includes(item) ? "#C24F1D" : "#d1d5db"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}
                      onClick={() => toggleSupport(item)}>
                      {form.support.includes(item) && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /></svg>}
                    </div>
                    <span style={{ fontSize: "13px", color: "#374151", fontWeight: form.support.includes(item) ? 600 : 400 }}>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginTop: "20px" }}>
              <label style={labelStyle}>ADDITIONAL NOTES / SPECIAL REQUIREMENTS</label>
              <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)}
                placeholder="Any special requirements, setup preferences, or additional information..."
                rows={3}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", fontSize: "14px", border: "1.5px solid #e2e8f0", outline: "none", backgroundColor: "#fff", resize: "vertical", fontFamily: "inherit" }} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "28px" }}>
              <button onClick={() => setStep(1)} style={{ backgroundColor: "#f3f4f6", color: "#374151", border: "none", borderRadius: "10px", padding: "12px 24px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                ← Back
              </button>
              <button onClick={() => { if (!form.stallNumber) { setErrors((e) => ({ ...e, stallNumber: "Please select a stall from the map" })); } else setStep(3); }}
                style={{ backgroundColor: "#C24F1D", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 32px", fontSize: "14px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.06em" }}>
                NEXT: REVIEW →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Review */}
        {step === 3 && (
          <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "32px", border: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#0A1628", marginBottom: "8px" }}>Review Your Registration</h3>
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px", paddingBottom: "16px", borderBottom: "2px solid #f3f4f6" }}>
              Please verify all details before submitting.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[
                { label: "Company Name", value: form.companyName },
                { label: "Sector", value: form.sector },
                { label: "Representative", value: form.repName },
                { label: "Email", value: form.email },
                { label: "Phone", value: form.phone },
                { label: "Company Profile", value: form.companyProfile || "—" },
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: "14px", backgroundColor: "#f9f7f4", borderRadius: "10px", border: "1px solid #e5e7eb" }}>
                  <p style={{ fontSize: "10px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", marginBottom: "4px" }}>{label.toUpperCase()}</p>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#0A1628" }}>{value}</p>
                </div>
              ))}
              <div style={{ padding: "14px", backgroundColor: "#fff7ed", borderRadius: "10px", border: "1px solid #C24F1D", gridColumn: "1 / -1" }}>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "#C24F1D", letterSpacing: "0.1em", marginBottom: "4px" }}>STALL NUMBER</p>
                <p style={{ fontSize: "18px", fontWeight: 800, color: "#C24F1D" }}>{form.stallNumber} <span style={{ fontSize: "12px", fontWeight: 500, color: "#9ca3af" }}>— 10×10 ft</span></p>
              </div>
              {form.products && (
                <div style={{ padding: "14px", backgroundColor: "#f9f7f4", borderRadius: "10px", border: "1px solid #e5e7eb", gridColumn: "1 / -1" }}>
                  <p style={{ fontSize: "10px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", marginBottom: "4px" }}>PRODUCTS IN EXPO</p>
                  <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.6, whiteSpace: "pre-line" }}>{form.products}</p>
                </div>
              )}
              {form.support.length > 0 && (
                <div style={{ padding: "14px", backgroundColor: "#f9f7f4", borderRadius: "10px", border: "1px solid #e5e7eb", gridColumn: "1 / -1" }}>
                  <p style={{ fontSize: "10px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", marginBottom: "8px" }}>ADDITIONAL SUPPORT REQUESTED</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {form.support.map((s) => (
                      <span key={s} style={{ padding: "4px 10px", backgroundColor: "#0A1628", color: "#C9933A", borderRadius: "20px", fontSize: "11px", fontWeight: 600 }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Declaration */}
            <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "#f0f4ff", borderRadius: "10px", border: "1px solid #c7d2fe" }}>
              <p style={{ fontSize: "12px", color: "#374151", lineHeight: 1.7 }}>
                By submitting this form, I confirm that the information provided is accurate and that my organisation agrees to comply with the rules and regulations of the Defence Attaché Roundtable 2026, Rashtriya Raksha University, Gandhinagar, Gujarat.
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "28px" }}>
              <button onClick={() => setStep(2)} style={{ backgroundColor: "#f3f4f6", color: "#374151", border: "none", borderRadius: "10px", padding: "12px 24px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                ← Back
              </button>
              <button onClick={handleSubmit}
                style={{ backgroundColor: "#C24F1D", color: "#fff", border: "none", borderRadius: "10px", padding: "14px 40px", fontSize: "15px", fontWeight: 800, cursor: "pointer", letterSpacing: "0.08em", boxShadow: "0 4px 20px rgba(194,79,29,0.4)" }}>
                SUBMIT REGISTRATION ✓
              </button>
            </div>
          </div>
        )}
      </div>

      <IndianBorder flip />
    </div>
  );
}