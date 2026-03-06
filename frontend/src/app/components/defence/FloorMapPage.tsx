import { useNavigate } from "react-router-dom";
import floorMapImg from "../../../Assets/floormap_new.png";
import { IndianBorder } from "./IndianBorder";

export default function FloorMapPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f9f7f4] flex flex-col font-sans">
      <IndianBorder sticky />

      {/* Header — same pattern as RegistrationPage */}
      <div className="bg-[#0A1628] py-4 px-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-semibold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>
        <div className="text-center">
          <p className="text-[#C9933A] text-[10px] font-bold tracking-[0.2em] mb-1">DEFENCE INDUSTRY EXPO 2026</p>
          <p className="text-white text-base font-bold">Exhibition Floor Map</p>
        </div>
        <button
          onClick={() => navigate("/registerevent")}
          className="bg-[#C24F1D] hover:bg-[#a64015] text-white text-xs font-bold px-4 py-2 rounded-lg tracking-wider transition-colors"
        >
          BOOK A STALL
        </button>
      </div>

      {/* Floor map image — centred, constrained width, scrollable on small screens */}
      <div className="flex-1 flex items-start justify-center px-4 py-10 overflow-auto">
        <img
          src={floorMapImg}
          alt="Exhibition Floor Map — Defence Industry Expo 2026"
          className="max-w-2xl w-full rounded-2xl shadow-xl border border-gray-200 object-contain"
          draggable={false}
        />
      </div>

      {/* Footer CTA */}
      <div className="bg-[#0A1628] py-4 px-6 flex items-center justify-between border-t border-white/10">
        <p className="text-slate-400 text-xs">
          Stall Size: <span className="text-[#C9933A] font-bold">10 × 10 ft</span> &nbsp;·&nbsp; 55 stalls across 4 blocks
        </p>
        <button
          onClick={() => navigate("/registerevent")}
          className="bg-[#C24F1D] hover:bg-[#a64015] text-white text-xs font-bold px-6 py-2.5 rounded-xl tracking-wider transition-colors shadow-lg shadow-orange-900/30"
        >
          REGISTER &amp; BOOK A STALL →
        </button>
      </div>
    </div>
  );
}



