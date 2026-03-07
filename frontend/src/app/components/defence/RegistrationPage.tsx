import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAvailableStalls } from "../../../api/exhibitions";
import client from "../../../api/client";
import { IndianBorder } from "./IndianBorder";

// ── Disposable / temp-mail domain blocklist ──────────────────────────────────
const BLOCKED_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.info", "guerrillamail.biz",
  "guerrillamail.de", "guerrillamail.net", "guerrillamail.org", "guerrillamailblock.com",
  "grr.la", "sharklasers.com", "spam4.me", "tempmail.com", "temp-mail.org",
  "10minutemail.com", "10minutemail.net", "throwaway.email", "throwam.com",
  "yopmail.com", "yopmail.fr", "cool.fr.nf", "jetable.fr.nf", "nospam.ze.tc",
  "trashmail.com", "trashmail.at", "trashmail.io", "trashmail.me", "trashmail.net",
  "trashmail.xyz", "trashmail.org", "dispostable.com", "maildrop.cc", "mailnull.com",
  "spamgourmet.com", "spamgourmet.net", "spamgourmet.org", "bouncr.com",
  "discard.email", "fakeinbox.com", "mailnesia.com", "spamfree24.org",
  "wegwerfmail.de", "wegwerfmail.net", "wegwerfmail.org", "mailexpire.com",
  "spamex.com", "filzmail.com", "spamthisplease.com", "noref.in",
  "spamevader.com", "getairmail.com", "tmailinator.com", "tempinbox.com",
  "mt2014.com", "mt2015.com", "spambob.com", "spamhole.com",
  "mailzilla.com", "spaml.com", "spamstack.net", "spamsink.net",
  "objectmail.com", "ownmail.net", "maileater.com", "mailscrap.com",
  "spamoff.de", "fakemail.net", "supergreatmail.com", "garbagemail.org",
  "hatespam.org", "ieatspam.eu", "ieatspam.info", "inoutmail.de",
  "spamgob.com", "spam.la", "thisisnotmyrealemail.com", "fauxmail.com",
  "mintemail.com", "tempemail.net", "incognitomail.com",
]);

function validateEmail(email: string): string {
  const trimmed = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) return "Enter a valid email address.";
  const domain = trimmed.split("@")[1];
  if (BLOCKED_DOMAINS.has(domain)) return "Temporary / disposable email addresses are not allowed.";
  return "";
}

// --- Types & Constants ---
interface Stall {
  id: number;
  stall_number: string;
  block: string;
  size: string;
  price: string | number;
  status: "available" | "pending" | "booked";
}

interface RegistrationForm {
  company_name: string;
  sector: string;
  representative_name: string;
  contact_email: string;
  contact_phone: string;
  company_profile_link: string;
  products_featuring: string;
  additional_support: string[];
  notes: string;
}

const EMPTY_FORM: RegistrationForm = {
  company_name: "",
  sector: "",
  representative_name: "",
  contact_email: "",
  contact_phone: "",
  company_profile_link: "",
  products_featuring: "",
  additional_support: [],
  notes: "",
};

// New floor map stall numbers (matching floormap_new.png exactly)
const ALL_MAP_STALLS = Array.from({ length: 33 }, (_, i) => String(i + 1));

const SUPPORT = [
  "Audio-Visual Equipment", "Electricity Connection", "Exhibition Furniture", "High-Speed Internet",
  "Interpreter/Translation", "Meeting Arrangement", "Promotional Material Display", "Security Escort",
];

// ── SVG Floor Map — pixel-perfect replica of floormap_new.png ────────────────
// viewBox 0 0 1200 520  (wider + taller for proper proportions)
//
// Stall 26 (top-left)  and  Stall 12 (top-right) are 3×6 Mtr (double height)
// All other stalls are 3×3 Mtr
//
// Layout (matching reference):
//   Top-left corner : 26 (tall, 3×6)          Top-right corner : 12 (tall, 3×6)
//   Top row         : 25 24 23 22 21 20 19 18 17 16 15 14 13
//   Left column     : 27 28 29
//   Right column    : 11 10
//   Centre islands  : 30 31 32 33
//   Bottom row      : 1 2 3 4 5 6 7 8 9
//   Entry ▲ left of stall 1   |   Emergency Exit ▶ right of stall 9

// -- Dimensions --
const UNIT = 74;          // 3×3 stall width & height
const TALL = UNIT * 2 + 6; // 3×6 stall height (double + gap)
const GAP  = 5;           // spacing between stalls
const PAD  = 8;           // padding from hall edge

// -- Derived anchors --
const LEFT_COL_X = PAD;
const LEFT_COL_W = UNIT;
const TOP_ROW_Y  = PAD;
const TOP_ROW_H  = UNIT;
const TOP_ROW_X0 = LEFT_COL_X + LEFT_COL_W + GAP;  // first top-row stall start x_

const RIGHT_COL_X = TOP_ROW_X0 + 13 * (UNIT + GAP); // right of 13 stalls
const RIGHT_COL_W = UNIT;

const VB_W = RIGHT_COL_X + RIGHT_COL_W + PAD;       // viewBox width
const BOTTOM_ROW_Y = PAD + TALL + GAP + UNIT + GAP + UNIT + GAP; // below left col last stall
const VB_H = BOTTOM_ROW_Y + UNIT + PAD + 30;         // viewBox height (+ label room)

const SVG_STALLS: { id: string; x: number; y: number; w: number; h: number }[] = [
  // ── 26: top-left corner, 3×6 (double height) ──
  { id: "26", x: LEFT_COL_X, y: TOP_ROW_Y, w: LEFT_COL_W, h: TALL },

  // ── Top row (25 → 13), left to right ──
  ...Array.from({ length: 13 }, (_, i) => ({
    id: String(25 - i),
    x: TOP_ROW_X0 + i * (UNIT + GAP),
    y: TOP_ROW_Y,
    w: UNIT,
    h: TOP_ROW_H,
  })),

  // ── 12: top-right corner, 3×6 (double height) ──
  { id: "12", x: RIGHT_COL_X, y: TOP_ROW_Y, w: RIGHT_COL_W, h: TALL },

  // ── Left column below 26 (27, 28, 29) ──
  { id: "27", x: LEFT_COL_X, y: PAD + TALL + GAP,                   w: LEFT_COL_W, h: UNIT },
  { id: "28", x: LEFT_COL_X, y: PAD + TALL + GAP + (UNIT + GAP),    w: LEFT_COL_W, h: UNIT },
  { id: "29", x: LEFT_COL_X, y: PAD + TALL + GAP + 2 * (UNIT + GAP), w: LEFT_COL_W, h: UNIT },

  // ── Right column below 12 (11, 10) ──
  { id: "11", x: RIGHT_COL_X, y: PAD + TALL + GAP,                w: RIGHT_COL_W, h: UNIT },
  { id: "10", x: RIGHT_COL_X, y: PAD + TALL + GAP + (UNIT + GAP), w: RIGHT_COL_W, h: UNIT },

  // ── Bottom row (1 → 9) — centred between left col and right col ──
  ...Array.from({ length: 9 }, (_, i) => {
    const totalW = 9 * UNIT + 8 * GAP;
    const startX = TOP_ROW_X0 + ((13 * (UNIT + GAP) - GAP) - totalW) / 2;
    return {
      id: String(i + 1),
      x: startX + i * (UNIT + GAP),
      y: BOTTOM_ROW_Y,
      w: UNIT,
      h: UNIT,
    };
  }),

  // ── Centre islands (30 31 32 33) — evenly spaced in the open hall ──
  ...Array.from({ length: 4 }, (_, i) => {
    const hallLeft = TOP_ROW_X0;
    const hallRight = RIGHT_COL_X - GAP;
    const hallW = hallRight - hallLeft;
    const islandW = UNIT + 10;
    const totalIslands = 4 * islandW;
    const spacing = (hallW - totalIslands) / 5;
    return {
      id: String(30 + i),
      x: hallLeft + spacing + i * (islandW + spacing),
      y: PAD + TOP_ROW_H + GAP + Math.round((BOTTOM_ROW_Y - (PAD + TOP_ROW_H + GAP) - UNIT) / 2),
      w: islandW,
      h: UNIT,
    };
  }),
];

function FloorMapSVG({
  selectedStalls,
  onSelect,
  booked,
}: {
  selectedStalls: string[];
  onSelect: (id: string) => void;
  booked: string[];
}) {
  const fillOf = (id: string) => {
    if (booked.includes(id)) return { fill: "#6b7280", text: "#9ca3af", cursor: "not-allowed" };
    if (selectedStalls.includes(id)) return { fill: "#C24F1D", text: "#fff", cursor: "pointer" };
    return { fill: "#1d4ed8", text: "#fff", cursor: "pointer" };
  };

  // Bottom-row x positions for Entry / Emergency Exit markers
  const bottomStalls = SVG_STALLS.filter(s => ["1","9"].includes(s.id));
  const stall1 = bottomStalls.find(s => s.id === "1")!;
  const stall9 = bottomStalls.find(s => s.id === "9")!;

  return (
    <div className="w-full overflow-x-auto">
      {/* Legend */}
      <div className="flex justify-center gap-6 mb-3 flex-wrap">
        {[
          { color: "#1d4ed8", label: "Available" },
          { color: "#C24F1D", label: "Selected" },
          { color: "#6b7280", label: "Booked" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-2">
            <div style={{ width: 12, height: 12, backgroundColor: l.color, borderRadius: 2 }} />
            <span className="text-[11px] text-gray-700 font-medium uppercase tracking-wider">{l.label}</span>
          </div>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        width="100%"
        style={{ minWidth: 480, maxWidth: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <rect x="0" y="0" width={VB_W} height={VB_H} fill="#f8fafc" rx="8" />

        {/* Hall outline */}
        <rect x="2" y="2" width={VB_W - 4} height={VB_H - 4} fill="none" stroke="#cbd5e1" strokeWidth="2" rx="6" />

        {/* Stall Size label */}
        <text x={VB_W / 2} y={PAD + TOP_ROW_H + GAP + 18} textAnchor="middle" fontSize="16" fontWeight="700" fill="#334155">
          Stall Size: 3×3 Mtr.
        </text>

        {/* Entry marker — left of stall 1 */}
        <polygon
          points={`${stall1.x - 30},${stall1.y + stall1.h} ${stall1.x - 18},${stall1.y + stall1.h - 18} ${stall1.x - 6},${stall1.y + stall1.h}`}
          fill="#dc2626"
        />
        <text
          x={stall1.x - 18} y={stall1.y + stall1.h + 16}
          textAnchor="middle" fontSize="13" fontWeight="700" fill="#dc2626"
        >Entry</text>

        {/* Emergency Exit marker — right of stall 9 */}
        <polygon
          points={`${stall9.x + stall9.w + 12},${stall9.y + stall9.h / 2 - 10} ${stall9.x + stall9.w + 28},${stall9.y + stall9.h / 2} ${stall9.x + stall9.w + 12},${stall9.y + stall9.h / 2 + 10}`}
          fill="#dc2626"
        />
        <text
          x={stall9.x + stall9.w + 20} y={stall9.y + stall9.h / 2 + 24}
          textAnchor="middle" fontSize="11" fontWeight="700" fill="#dc2626"
        >Emergency Exit</text>

        {/* Floor Map title */}
        <text x={VB_W / 2} y={VB_H - 6} textAnchor="middle" fontSize="14" fontWeight="600" fill="#94a3b8">
          Floor Map — Defence Expo
        </text>

        {/* Stalls */}
        {SVG_STALLS.map(({ id, x, y, w, h }) => {
          const s = fillOf(id);
          const isBooked = booked.includes(id);
          const isSelected = selectedStalls.includes(id);
          const fontSize = (id === "26" || id === "12") ? 16 : 14;
          return (
            <g
              key={id}
              onClick={() => !isBooked && onSelect(id)}
              style={{ cursor: s.cursor }}
            >
              <rect
                x={x} y={y} width={w} height={h}
                rx="4"
                fill={s.fill}
                stroke={isSelected ? "#ff6b35" : "rgba(255,255,255,0.25)"}
                strokeWidth={isSelected ? 2.5 : 1.5}
                opacity={isBooked ? 0.6 : 1}
              />
              {isSelected && (
                <rect
                  x={x - 2} y={y - 2} width={w + 4} height={h + 4}
                  rx="6" fill="none" stroke="#ff6b35" strokeWidth="2" opacity="0.5"
                />
              )}
              <text
                x={x + w / 2} y={y + h / 2 + 1}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={fontSize} fontWeight="700" fill={s.text}
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}


// --- Main Page Component ---
export default function RegistrationPage({ onBack, onLogin }: { onBack?: () => void; onLogin?: () => void }) {
  const navigate = useNavigate();
  
  const SESSION_KEY = "reg_session_v1";

  // Restore session from localStorage
  const savedSession = (() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
  })();

  // State — restored from session if available
  const [step, setStep] = useState<1 | 2 | 3>(savedSession?.step ?? 1);
  const [form, setForm] = useState<RegistrationForm>(savedSession?.form ?? EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // API State
  const [apiStalls, setApiStalls] = useState<Stall[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [selectedStalls, setSelectedStalls] = useState<Stall[]>(savedSession?.selectedStalls ?? []);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Persist session to localStorage whenever step/form/selectedStalls change
  useEffect(() => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ step, form, selectedStalls }));
    } catch {}
  }, [step, form, selectedStalls]);

  // Fetch stalls on mount
  useEffect(() => {
    getAvailableStalls()
      .then(({ data }) => setApiStalls(data))
      .catch(() => setFetchError("Failed to load map data. Please refresh."))
      .finally(() => setLoading(false));
  }, []);

  // Compute booked stalls for the Map (stalls not in API OR not 'available')
  const bookedStallIds = ALL_MAP_STALLS.filter(id => {
    const apiStall = apiStalls.find(s => s.stall_number === id);
    return !apiStall || apiStall.status !== "available";
  });

  // Handlers
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  /** Phone: allow only digits, spaces, +, -, () */
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^\d\s+()\-]/g, "");
    setForm({ ...form, contact_phone: cleaned });
    setErrors({ ...errors, contact_phone: "" });
  };

  const toggleSupport = (item: string) => setForm((f) => ({
    ...f,
    additional_support: f.additional_support.includes(item) 
      ? f.additional_support.filter((s) => s !== item) 
      : [...f.additional_support, item],
  }));

  const MAX_STALLS = 2;

  const handleMapSelect = (stallId: string) => {
    const apiStall = apiStalls.find(s => s.stall_number === stallId);
    if (!apiStall || apiStall.status !== "available") return;
    
    setSelectedStalls((prev) => {
      // Already selected → deselect (toggle off)
      if (prev.find((s) => s.id === apiStall.id)) {
        return prev.filter((s) => s.id !== apiStall.id);
      }
      // At limit → block
      if (prev.length >= MAX_STALLS) {
        setErrors({ ...errors, stallSelection: `You can select a maximum of ${MAX_STALLS} stalls.` });
        return prev;
      }
      return [...prev, apiStall];
    });
    setErrors((prev) => ({ ...prev, stallSelection: "" }));
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.company_name.trim()) e.company_name = "Required.";
    if (!form.sector.trim()) e.sector = "Required.";
    if (!form.representative_name.trim()) e.representative_name = "Required.";
    const emailErr = validateEmail(form.contact_email);
    if (emailErr) e.contact_email = emailErr;
    if (!form.contact_phone.trim()) {
      e.contact_phone = "Phone number is required.";
    } else if (form.contact_phone.replace(/[^\d]/g, "").length < 7) {
      e.contact_phone = "Enter a valid phone number (digits only).";
    }
    if (!form.products_featuring.trim()) e.products_featuring = "Required.";
    setErrors(e);
    if (Object.keys(e).length === 0) setStep(2);
  };

  const validateStep2 = () => {
    if (selectedStalls.length === 0) {
      setErrors({ stallSelection: "Please select at least one stall from the map." });
    } else {
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      // Prepare additional support as string if your API expects text
      const payload = {
        ...form,
        additional_support: form.additional_support.join(", ")
      };

      // Submit one registration per stall
      await Promise.all(
        selectedStalls.map((stall) =>
          client.post("/exhibitions/register_exhibitor", {
            stall_id: stall.id,
            ...payload,
          })
        )
      );
      localStorage.removeItem(SESSION_KEY);
      navigate("/dashboard", { state: { registered: true } });
    } catch (err: any) {
      const data = err.response?.data;
      setSubmitError(
        data?.stall_id?.[0] || data?.error || data?.detail ||
        Object.values(data || {})?.[0]?.[0] ||
        "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const totalPrice = selectedStalls.reduce((sum, s) => sum + Number(s.price), 0);

  return (
    <div className="min-h-screen bg-[#f9f7f4] flex flex-col font-sans">
      <IndianBorder sticky />

      {/* Page Header */}
      <div className="bg-[#0A1628] py-4 px-6 flex items-center justify-between">
        <button onClick={onBack || (() => navigate("/"))} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-semibold transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back to Home
        </button>
        <div className="text-center">
          <p className="text-[#C9933A] text-[10px] font-bold tracking-[0.2em] mb-1">DEFENCE ATTACHÉ ROUNDTABLE 2026</p>
          <p className="text-white text-base font-bold">Exhibitor Registration</p>
        </div>
        <button onClick={onLogin || (() => navigate("/login"))} className="bg-white/10 border border-white/20 text-white hover:bg-white/20 px-4 py-2 rounded-lg text-xs font-semibold transition-colors">
          Already registered? Login
        </button>
      </div>

      {/* Announcement Banner */}
      <div className="w-full bg-green-600 py-6 px-6 text-center">
        {/* <p className="text-white text-2xl sm:text-3xl font-extrabold tracking-wide leading-snug">
          🎉 All Stalls Are Available!
        </p> */}
        {/* <p className="text-green-100 text-base sm:text-lg font-semibold mt-2">
          Registration process will begin shortly — stay with us!
        </p> */}
      </div>

      <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-10">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-10">
          {[
            { n: 1, label: "Company Details" },
            { n: 2, label: "Stall Booking" },
            { n: 3, label: "Review & Submit" },
          ].map(({ n, label }, i) => (
            <div key={n} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= n ? "bg-[#C24F1D] text-white shadow-md" : "bg-gray-200 text-gray-500"}`}>
                  {step > n ? "✓" : n}
                </div>
                <span className={`text-[10px] font-bold tracking-wider whitespace-nowrap ${step >= n ? "text-[#C24F1D]" : "text-gray-400"}`}>{label.toUpperCase()}</span>
              </div>
              {i < 2 && (
                <div className={`w-16 sm:w-24 h-[2px] mx-3 mb-5 transition-all ${step > n ? "bg-[#C24F1D]" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* STEP 1: Company Details */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-gray-200 shadow-sm">
            <h3 className="text-xl font-extrabold text-[#0A1628] mb-6 pb-4 border-b border-gray-100">
              Company & Representative Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 tracking-wide mb-1.5">1. NAME OF THE COMPANY <span className="text-red-500">*</span></label>
                <input type="text" name="company_name" value={form.company_name} onChange={handleFormChange} placeholder="Enter full legal company name" 
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors.company_name ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-[#C24F1D] focus:border-[#C24F1D] outline-none transition-all`} />
                {errors.company_name && <p className="text-red-500 text-xs mt-1">{errors.company_name}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 tracking-wide mb-1.5">2. CATEGORY / SECTOR OF INNOVATION <span className="text-red-500">*</span></label>
                <input type="text" name="sector" value={form.sector} onChange={handleFormChange} placeholder="e.g. Aerospace, Cyber Security"
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors.sector ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-[#C24F1D] focus:border-[#C24F1D] outline-none transition-all`} />
                {errors.sector && <p className="text-red-500 text-xs mt-1">{errors.sector}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 tracking-wide mb-1.5">3. REPRESENTATIVE NAME <span className="text-red-500">*</span></label>
                <input type="text" name="representative_name" value={form.representative_name} onChange={handleFormChange} placeholder="Full name with designation"
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors.representative_name ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-[#C24F1D] focus:border-[#C24F1D] outline-none transition-all`} />
                {errors.representative_name && <p className="text-red-500 text-xs mt-1">{errors.representative_name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 tracking-wide mb-1.5">4. EMAIL ADDRESS <span className="text-red-500">*</span></label>
                <input type="email" name="contact_email" value={form.contact_email} onChange={handleFormChange} placeholder="official@company.com"
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors.contact_email ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-[#C24F1D] focus:border-[#C24F1D] outline-none transition-all`} />
                {errors.contact_email && <p className="text-red-500 text-xs mt-1">{errors.contact_email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 tracking-wide mb-1.5">5. PHONE NUMBER <span className="text-red-500">*</span></label>
                <input type="tel" name="contact_phone" value={form.contact_phone} onChange={handlePhoneChange} placeholder="+91 98765 43210" inputMode="tel"
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors.contact_phone ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-[#C24F1D] focus:border-[#C24F1D] outline-none transition-all`} />
                {errors.contact_phone && <p className="text-red-500 text-xs mt-1">{errors.contact_phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 tracking-wide mb-1.5">6. COMPANY WEBSITE (Optional)</label>
                <input type="url" name="company_profile_link" value={form.company_profile_link} onChange={handleFormChange} placeholder="https://www.yourcompany.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#C24F1D] focus:border-[#C24F1D] outline-none transition-all" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 tracking-wide mb-1.5">7. PRODUCTS / INNOVATIONS IN EXPO <span className="text-red-500">*</span></label>
                <textarea name="products_featuring" value={form.products_featuring} onChange={handleFormChange} rows={3} placeholder="List the key products or platforms you will exhibit..."
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors.products_featuring ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-[#C24F1D] focus:border-[#C24F1D] outline-none transition-all resize-y`} />
                {errors.products_featuring && <p className="text-red-500 text-xs mt-1">{errors.products_featuring}</p>}
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button onClick={validateStep1} className="bg-[#C24F1D] hover:bg-[#a64015] text-white font-bold py-3 px-8 rounded-xl tracking-wider text-sm transition-colors shadow-lg shadow-orange-900/20">
                NEXT: BOOK YOUR STALL →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Stall Booking */}
        {step === 2 && (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-white rounded-2xl p-6 sm:p-10 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-extrabold text-[#0A1628] mb-2">8. Select Your Stall</h3>
              <p className="text-gray-500 text-sm mb-4">Refer to the floor map below, then click on an available stall to select it.</p>

              <p className="text-gray-500 text-sm mb-4 pb-4 border-b border-gray-100">Select your preferred stall from the interactive map below (blue = available, orange = selected, grey = booked).</p>

              {loading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C24F1D]"></div></div>
              ) : fetchError ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">{fetchError}</div>
              ) : (
                <FloorMapSVG
                  selectedStalls={selectedStalls.map(s => s.stall_number)}
                  onSelect={handleMapSelect}
                  booked={bookedStallIds}
                />
              )}
              {errors.stallSelection && <p className="text-red-500 text-sm mt-3 text-center font-semibold">{errors.stallSelection}</p>}

              <div className="mt-10">
                <label className="block text-xs font-bold text-gray-700 tracking-wide mb-3">9. ADDITIONAL SUPPORT REQUIRED (Select all that apply)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SUPPORT.map((item) => {
                    const isSelected = form.additional_support.includes(item);
                    return (
                      <label key={item} onClick={() => toggleSupport(item)} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${isSelected ? "border-[#C24F1D] bg-orange-50" : "border-gray-200 hover:border-gray-300 bg-white"}`}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-[#C24F1D] border-[#C24F1D]" : "border-gray-300"}`}>
                          {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className={`text-sm ${isSelected ? "font-semibold text-gray-900" : "text-gray-600"}`}>{item}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-xs font-bold text-gray-700 tracking-wide mb-1.5">ADDITIONAL NOTES / SPECIAL REQUIREMENTS</label>
                <textarea name="notes" value={form.notes} onChange={handleFormChange} rows={3} placeholder="Any setup preferences or custom requests..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#C24F1D] focus:border-[#C24F1D] outline-none transition-all resize-y" />
              </div>
            </div>

            {/* Sidebar Cart */}
            <div className="lg:w-80 flex flex-col gap-4">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm sticky top-6">
                <h4 className="font-extrabold text-[#0A1628] mb-4 pb-3 border-b border-gray-100 flex justify-between items-center">
                  Selected Stalls
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">{selectedStalls.length}</span>
                </h4>
                
                {selectedStalls.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-6">No stalls selected yet.</p>
                ) : (
                  <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
                    {selectedStalls.map((stall) => (
                      <div key={stall.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">Stall {stall.stall_number}</p>
                          <p className="text-xs text-gray-500">Block {stall.block} · {stall.size}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-[#C24F1D]">₹{Number(stall.price).toLocaleString("en-IN")}</p>
                          <button onClick={() => handleMapSelect(stall.stall_number)} className="text-[10px] text-red-500 hover:underline mt-0.5">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between items-end">
                    <span className="text-gray-500 text-sm font-semibold">Total Price</span>
                    <span className="text-xl font-extrabold text-[#0A1628]">₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button onClick={validateStep2} disabled={selectedStalls.length === 0} 
                    className="w-full bg-[#C24F1D] hover:bg-[#a64015] disabled:bg-gray-300 text-white font-bold py-3.5 rounded-xl tracking-wider text-sm transition-colors shadow-lg shadow-orange-900/20 disabled:shadow-none">
                    REVIEW DETAILS →
                  </button>
                  <button onClick={() => setStep(1)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3 rounded-xl text-sm transition-colors">
                    ← BACK TO COMPANY
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Review */}
        {step === 3 && (
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-gray-200 shadow-sm max-w-4xl mx-auto">
            <h3 className="text-xl font-extrabold text-[#0A1628] mb-2">Review Your Registration</h3>
            <p className="text-gray-500 text-sm mb-6 pb-4 border-b border-gray-100">Please verify all details. Payment can be completed from your dashboard after submission.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {[
                { label: "Company Name", value: form.company_name },
                { label: "Sector", value: form.sector },
                { label: "Representative", value: form.representative_name },
                { label: "Email", value: form.contact_email },
                { label: "Phone", value: form.contact_phone },
                { label: "Company Profile", value: form.company_profile_link || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-1">{label.toUpperCase()}</p>
                  <p className="text-sm font-semibold text-gray-900">{value}</p>
                </div>
              ))}
              
              <div className="sm:col-span-2 bg-orange-50 border border-[#C24F1D]/30 p-5 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <p className="text-[10px] font-bold text-[#C24F1D] tracking-wider mb-2">SELECTED STALLS ({selectedStalls.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedStalls.map((s) => (
                      <span key={s.id} className="bg-white border border-[#C24F1D]/40 text-[#C24F1D] text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                        {s.stall_number} <span className="text-gray-400 font-medium ml-1">({s.size})</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="sm:text-right">
                  <p className="text-[10px] font-bold text-gray-500 tracking-wider mb-1">TOTAL AMOUNT</p>
                  <p className="text-2xl font-extrabold text-[#0A1628]">₹{totalPrice.toLocaleString("en-IN")}</p>
                </div>
              </div>

              <div className="sm:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-1">PRODUCTS IN EXPO</p>
                <p className="text-sm text-gray-700 whitespace-pre-line">{form.products_featuring}</p>
              </div>

              {form.additional_support.length > 0 && (
                <div className="sm:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-2">ADDITIONAL SUPPORT REQUESTED</p>
                  <div className="flex flex-wrap gap-2">
                    {form.additional_support.map((s) => (
                      <span key={s} className="bg-[#0A1628] text-[#C9933A] px-3 py-1 rounded-full text-[11px] font-semibold">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
              <p className="text-xs text-blue-800 leading-relaxed font-medium">
                By submitting this form, I confirm that the information provided is accurate and my organisation agrees to comply with the rules of the Defence Attaché Roundtable 2026.
              </p>
            </div>

            {submitError && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">{submitError}</div>}

            <div className="flex flex-col-reverse sm:flex-row justify-between gap-4">
              <button onClick={() => setStep(2)} disabled={submitting} className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3 px-8 rounded-xl text-sm transition-colors">
                ← BACK TO STALLS
              </button>
              <button onClick={handleSubmit} disabled={submitting} 
                className="bg-[#C24F1D] hover:bg-[#a64015] disabled:bg-[#C24F1D]/70 text-white font-bold py-3.5 px-10 rounded-xl tracking-wider text-sm transition-colors shadow-lg shadow-orange-900/30 flex justify-center items-center">
                {submitting ? (
                  <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> Processing...</span>
                ) : (
                  "SUBMIT REGISTRATION ✓"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}