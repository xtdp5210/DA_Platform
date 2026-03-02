import { useState } from "react";

import logoLT                  from "../../../Assets/L&T.jpeg";
import logoShreeram             from "../../../Assets/shreeram.jpeg";
import logoUnique               from "../../../Assets/unique.jpeg";
import logoTata                 from "../../../Assets/Tata Advanced Systems.jpeg";
import logoHeliocentric         from "../../../Assets/Heliocentric Precision.jpeg";
import logoArnobot              from "../../../Assets/Arnobot.jpeg";
import logoVirtualCaim          from "../../../Assets/Virtual Caim.jpeg";
import logoSnasIoT              from "../../../Assets/Snas IoT.jpeg";
import logoSwasemi              from "../../../Assets/Swasemi.jpeg";
import logoMobisec              from "../../../Assets/Mobisec.jpeg";
import logoAchuk                from "../../../Assets/Achuk.jpeg";
import logoOptimizedElectrotech from "../../../Assets/Optimized Electrotech.jpeg";
import logoMDMetalline          from "../../../Assets/MD Metalline.jpeg";
import logoBeyondata            from "../../../Assets/Beyondata.jpeg";
import logoChetnaKiran          from "../../../Assets/Chetna Kiran.jpeg";
import logoAlliedEngineering    from "../../../Assets/Allied Engineering.jpeg";
import logoQuantumFort          from "../../../Assets/Quantum Fort.jpeg";
import logoCligentAerospace     from "../../../Assets/Cligent Aerospace.jpeg";
import logoBingBangBoom         from "../../../Assets/Bing Bang Boom Solutions.jpeg";
import logoEyerov               from "../../../Assets/Eyerov.jpeg";
import logoGCCI                 from "../../../Assets/GCCI.jpeg";
import logoZenTechnologies      from "../../../Assets/Zen Technologies.jpeg";
import logoA1Fence              from "../../../Assets/A-1 Fence.jpeg";
import logoOptimisedElectrotech from "../../../Assets/Optimised Electrotech.jpeg";
import logoTVSFOSS              from "../../../Assets/TVS FOSS.jpeg";

interface Company {
  id: number;
  name: string;
  description: string;
  initials: string;
  color: string;
  logo?: string;
}

const companies: Company[] = [
  { id: 1,  name: "Larsen & Toubro Ltd",                     initials: "L&T",  color: "#0A1628", logo: logoLT,                   description: "Delivers land, naval, and strategic defence solutions with strong indigenous engineering capability." },
  { id: 2,  name: "Pixxel India",                            initials: "PIXXL", color: "#7c3aed",                                description: "Space-tech start-up building Earth observation satellites and hyperspectral imagery solutions." },
  { id: 3,  name: "Shreeram Aerospace and Defence",          initials: "SAD",  color: "#C24F1D", logo: logoShreeram,             description: "Aerospace and defence engineering firm focused on precision components and structural solutions." },
  { id: 4,  name: "Unique Forge",                            initials: "UF",   color: "#0f766e", logo: logoUnique,               description: "Precision forging manufacturer supplying critical components for defence and industrial sectors." },
  { id: 5,  name: "Tata Advanced Systems Limited",           initials: "TASL", color: "#C24F1D", logo: logoTata,                 description: "Indian aerospace and defence manufacturer focused on integrated platforms and advanced systems." },
  { id: 6,  name: "Heliocentric Precision Pvt. Ltd.",        initials: "HPPL", color: "#1e3a5f", logo: logoHeliocentric,         description: "Precision engineering company specialising in high-accuracy components for aerospace applications." },
  { id: 7,  name: "Arnobot",                                 initials: "ARN",  color: "#7c2d12", logo: logoArnobot,              description: "Robotics and automation start-up developing intelligent systems for defence and industrial use." },
  { id: 8,  name: "Virtual Caim",                            initials: "VC",   color: "#2563eb", logo: logoVirtualCaim,          description: "Technology company offering virtual simulation and AI-driven defence training platforms." },
  { id: 9,  name: "Snas IoT",                                initials: "SNAS", color: "#0f766e", logo: logoSnasIoT,              description: "IoT solutions provider delivering connected sensor networks for defence and security applications." },
  { id: 10, name: "Swasemi",                                 initials: "SWS",  color: "#4b5563", logo: logoSwasemi,              description: "Semiconductor and electronic systems company contributing to indigenous defence electronics." },
  { id: 11, name: "Solvisor",                                initials: "SOL",  color: "#b45309",                                description: "Defence advisory and technology firm providing analytical and operational decision-support tools." },
  { id: 12, name: "Mobisec",                                 initials: "MOB",  color: "#dc2626", logo: logoMobisec,              description: "Cybersecurity company specialising in mobile device security for defence and government use." },
  { id: 13, name: "Achuk",                                   initials: "ACH",  color: "#9333ea", logo: logoAchuk,                description: "Defence-focused start-up developing innovative solutions for border surveillance and security." },
  { id: 14, name: "The Moe",                                 initials: "MOE",  color: "#374151",                                description: "Deep-tech venture building advanced materials and engineering solutions for defence platforms." },
  { id: 15, name: "Optimized Electrotech",                   initials: "OET",  color: "#1d4ed8", logo: logoOptimizedElectrotech, description: "Electrical and electronics solutions company serving defence and critical infrastructure sectors." },
  { id: 16, name: "MD Metalline",                            initials: "MDM",  color: "#6b7280", logo: logoMDMetalline,          description: "Metal fabrication and precision machining enterprise supporting defence supply chains." },
  { id: 17, name: "Beyondata",                               initials: "BYD",  color: "#0f766e", logo: logoBeyondata,            description: "Data analytics and intelligence platform providing actionable insights for defence operations." },
  { id: 18, name: "Vikas Geosensing",                        initials: "VGS",  color: "#7c3aed",                                description: "Geospatial technology company offering remote sensing and earth observation services." },
  { id: 19, name: "Chetna Kiran",                            initials: "CK",   color: "#C24F1D", logo: logoChetnaKiran,          description: "Defence and security solutions provider focused on women-led innovation in the sector." },
  { id: 20, name: "Allied Engineering",                      initials: "AE",   color: "#0A1628", logo: logoAlliedEngineering,    description: "Engineering services firm specialising in defence-grade mechanical and structural solutions." },
  { id: 21, name: "Quantum Fort",                            initials: "QF",   color: "#1e3a5f", logo: logoQuantumFort,          description: "Quantum computing and cybersecurity company building next-generation defence security systems." },
  { id: 22, name: "Cligent Aerospace",                       initials: "CLIG", color: "#2563eb", logo: logoCligentAerospace,     description: "Aerospace engineering start-up developing unmanned platforms and avionics systems." },
  { id: 23, name: "Bing Bang Boom Solutions",                initials: "BBBS", color: "#dc2626", logo: logoBingBangBoom,         description: "Innovation-driven defence solutions provider offering rapid prototyping and technology integration." },
  { id: 24, name: "Technotrove",                             initials: "TECH", color: "#b45309",                                description: "Technology company focusing on indigenous defence product development and R&D services." },
  { id: 25, name: "Eyerov",                                  initials: "EYE",  color: "#0f766e", logo: logoEyerov,               description: "Underwater robotics company building remotely operated vehicles for naval and security operations." },
  { id: 26, name: "Laghu Griha Udyog",                       initials: "LGU",  color: "#374151",                                description: "Micro-enterprise collective contributing to defence component manufacturing under Make in India." },
  { id: 27, name: "GCCI",                                    initials: "GCCI", color: "#C9933A", logo: logoGCCI,                 description: "Gujarat Chamber of Commerce and Industry fostering defence-industrial partnerships and MSME growth." },
  { id: 28, name: "Army Design Bureau",                      initials: "ADB",  color: "#0A1628",                                description: "Indian Army's in-house design organisation driving indigenous defence R&D and procurement." },
  { id: 29, name: "Zen Technologies",                        initials: "ZEN",  color: "#1d4ed8", logo: logoZenTechnologies,      description: "Combat training simulation company providing realistic training systems for armed forces." },
  { id: 30, name: "MG Seating Systems Pvt. Ltd.",            initials: "MGSS", color: "#4b5563",                                description: "Specialised seating manufacturer supplying ergonomic and mission-critical seats for defence vehicles." },
  { id: 31, name: "A-1 Fence",                               initials: "A1F",  color: "#7c2d12", logo: logoA1Fence,              description: "Perimeter security solutions company providing advanced fencing for defence installations." },
  { id: 32, name: "Optimised Electrotech",                   initials: "OELT", color: "#0f766e", logo: logoOptimisedElectrotech, description: "Electronic systems integrator delivering optimised power and control solutions for defence platforms." },
  { id: 33, name: "TVS FOSS",                                initials: "FOSS", color: "#C24F1D", logo: logoTVSFOSS,              description: "Open-source software solutions provider supporting digital transformation in defence operations." },
  { id: 34, name: "Observe/eSec",                            initials: "OBS",  color: "#111827",                                description: "Cybersecurity and electronic surveillance company offering threat monitoring for critical defence assets." },
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

function CompanyCard({ company }: { company: Company }) {
  const [logoError, setLogoError] = useState(false);
  const showLogo = !!company.logo && !logoError;

  return (
    <div
      className="rounded-xl p-5 flex flex-col items-center gap-4 transition-all duration-200"
      style={{
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
      }}
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
        style={
          showLogo
            ? { backgroundColor: "#fff", border: "1.5px solid #e5e7eb", padding: "6px" }
            : { backgroundColor: company.color + "22", border: `1.5px solid ${company.color}66` }
        }
      >
        {showLogo ? (
          <img
            src={company.logo}
            alt={company.name + " logo"}
            onError={() => setLogoError(true)}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <span style={{ fontSize: "11px", fontWeight: 800, color: company.color, letterSpacing: "0.03em", textAlign: "center" }}>
            {company.initials}
          </span>
        )}
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