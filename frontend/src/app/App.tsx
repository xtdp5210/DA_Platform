import { useState } from "react";
import { IndianBorder } from "./components/defence/IndianBorder";
import { Header } from "./components/defence/Header";
import { Hero } from "./components/defence/Hero";
import { Background } from "./components/defence/Background";
import { About } from "./components/defence/About";
import { Objectives } from "./components/defence/Objectives";
import { Programme } from "./components/defence/Programme";
import { Exposition } from "./components/defence/Exposition";
import { WhyAttend } from "./components/defence/WhyAttend";
import { StrategicOutcomes } from "./components/defence/Strategicoutcomes ";
import { PhotoGallery } from "./components/defence/PhotoGallery";
import { VideoGallery } from "./components/defence/VideoGallery";
import { SponsorsSection } from "./components/defence/Sponsorssection";
import { Footer } from "./components/defence/Footer";
import { RegistrationPage } from "./components/defence/Registrationpage";
import { LoginPage } from "./components/defence/Loginpage";

type Page = "home" | "register" | "login";

export default function App() {
  const [page, setPage] = useState<Page>("home");

  // Scroll to top on page change
  const navigate = (p: Page) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setPage(p), 150);
  };

  if (page === "register") {
    return (
      <RegistrationPage
        onBack={() => navigate("home")}
        onLogin={() => navigate("login")}
      />
    );
  }

  if (page === "login") {
    return (
      <LoginPage
        onBack={() => navigate("home")}
        onRegister={() => navigate("register")}
      />
    );
  }

  return (
    <div className="w-full min-h-screen" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", backgroundColor: "#ffffff" }}>
      {/* Sticky Traditional Indian Geometric Border — always visible */}
      <IndianBorder sticky />

      {/* Sticky Government Header + Navigation */}
      <Header onRegister={() => navigate("register")} onLogin={() => navigate("login")} />

      {/* Hero Section */}
      <Hero onRegister={() => navigate("register")} />

      {/* Background & Context */}
      <Background />

      {/* About RRU & The Event */}
      <About />

      {/* Core Objectives */}
      <Objectives />

      {/* Event Programme */}
      <Programme />

      {/* Indigenous Defence Exposition */}
      <Exposition />

      {/* Why Attend */}
      <WhyAttend onRegister={() => navigate("register")} />

      {/* Photo Gallery */}
      <PhotoGallery />

      {/* Video Highlights */}
      <VideoGallery />

      {/* Sponsors & Partners */}
      <SponsorsSection />

      {/* Strategic Outcomes */}
      <StrategicOutcomes />

      {/* Footer */}
      <Footer onRegister={() => navigate("register")} />

      {/* Bottom Traditional Indian Geometric Border */}
      <IndianBorder flip />
    </div>
  );
}