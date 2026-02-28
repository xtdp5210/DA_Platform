interface Company {
  id: number;
  name: string;
  description: string;
  initials: string;
  color: string;
}

const companies: Company[] = [
  { id: 1, name: "Tata Advanced Systems Ltd.", initials: "TASL", color: "#C24F1D", description: "Indian aerospace and defence manufacturer focused on integrated platforms and advanced systems." },
  { id: 2, name: "Larsen & Toubro Defence", initials: "L&T", color: "#0A1628", description: "Delivers land, naval, and strategic defence solutions with strong indigenous engineering capability." },
  { id: 3, name: "Hindustan Aeronautics Ltd.", initials: "HAL", color: "#1e3a5f", description: "Leading aerospace PSU supporting aircraft design, production, and life-cycle sustainment." },
  { id: 4, name: "Bharat Electronics Ltd.", initials: "BEL", color: "#C9933A", description: "Specialises in defence electronics, radars, communication systems, and command networks." },
  { id: 5, name: "Mahindra Defence Systems", initials: "MDS", color: "#2563eb", description: "Provides mission-ready mobility, armored systems, and defence manufacturing solutions." },
  { id: 6, name: "Bharat Forge Ltd.", initials: "BFL", color: "#0f766e", description: "Builds artillery and advanced forgings for defence platforms and critical weapon systems." },
  { id: 7, name: "BEML Limited", initials: "BEML", color: "#4b5563", description: "Supplies land systems and heavy platforms for defence and strategic mobility needs." },
  { id: 8, name: "Adani Defence & Aerospace", initials: "ADA", color: "#7c3aed", description: "Develops aerospace, unmanned, and defence solutions aligned with Atmanirbhar Bharat goals." },
  { id: 9, name: "Safran India Pvt. Ltd.", initials: "SFR", color: "#1d4ed8", description: "Global propulsion and aerospace technology company with expanding defence partnerships in India." },
  { id: 10, name: "Thales India Pvt. Ltd.", initials: "THL", color: "#7c2d12", description: "Supports avionics, sensors, and secure systems across air, land, and maritime defence domains." },
  { id: 11, name: "BAE Systems India", initials: "BAE", color: "#111827", description: "International defence major engaged in combat systems and strategic industrial collaborations." },
  { id: 12, name: "BrahMos Aerospace Pvt. Ltd.", initials: "BMAL", color: "#9333ea", description: "Joint venture known for high-precision supersonic missile technology and strategic deterrence." },
  { id: 13, name: "Kalyani Strategic Systems", initials: "KSSL", color: "#b45309", description: "Focuses on artillery systems, munitions, and next-generation land warfare solutions." },
  { id: 14, name: "IdeaForge Technology Ltd.", initials: "IDEA", color: "#dc2626", description: "Drone technology company offering unmanned aerial systems for surveillance and security." },
  { id: 15, name: "Solar Industries India", initials: "SII", color: "#0f766e", description: "Develops energetics, explosives, and ammunition solutions for defence applications." },
  { id: 16, name: "Yantra India Ltd.", initials: "YIL", color: "#374151", description: "Manufacturing enterprise supporting ordnance and defence production for armed forces." },
];

export function SponsorsSection() {
  return (
    <section id="sponsors" className="w-full py-20" style={{ backgroundColor: "#ffffff" }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div style={{ width: "40px", height: "2px", backgroundColor: "#C24F1D" }} />
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: "#C24F1D" }}>
              POTENTIAL EXHIBITORS
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
            Potential Exhibiting{" "}
            <span style={{ color: "#C24F1D" }}>Companies</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto" style={{ color: "#6b7280", fontSize: "15px", lineHeight: 1.7 }}>
            A consolidated list of likely participating defence and aerospace companies for exposition engagement.
          </p>

          {/* Total badge */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ backgroundColor: "#f9f7f4", border: "1px solid #e5e7eb" }}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#C24F1D" }} />
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#0A1628" }}>
                {companies.length} Potential Exhibitors
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CompanyCard({
  company,
}: {
  company: Company;
}) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col items-center gap-4 transition-all duration-200"
      style={{
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
      }}
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: company.color + "22", border: `1.5px solid ${company.color}66` }}
      >
        <span style={{ fontSize: "11px", fontWeight: 800, color: company.color, letterSpacing: "0.03em", textAlign: "center" }}>
          {company.initials}
        </span>
      </div>

      <div className="text-center">
        <p
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#0A1628",
            lineHeight: 1.35,
            marginBottom: "8px",
          }}
        >
          {company.name}
        </p>
        <p style={{ fontSize: "12px", color: "#6b7280", lineHeight: 1.6 }}>
          {company.description}
        </p>
      </div>
    </div>
  );
}