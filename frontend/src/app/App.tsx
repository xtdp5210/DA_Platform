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
import { RegisterPage } from "./components/defence/RegisterPage";
import { LoginPage } from "./components/defence/Loginpage";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

function MainPage() {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full min-h-screen" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", backgroundColor: "#ffffff" }}>
        <IndianBorder sticky />
        <Header onRegister={() => navigate("/register")} onLogin={() => navigate("/login")} />
        <Hero onRegister={() => navigate("/register")} />
        <Background />
        <About />
        <Objectives />
        <Programme />
        <Exposition />
        <WhyAttend onRegister={() => navigate("/register")} />
        <PhotoGallery />
        <VideoGallery />
        <SponsorsSection />
        <StrategicOutcomes />
        <Footer onRegister={() => navigate("/register")} />
      </div>
      <IndianBorder flip />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage onBack={() => window.location.href = "/"} onRegister={() => window.location.href = "/register"} />} />
        <Route path="/registerevent" element={<RegistrationPage onBack={() => window.location.href = "/"} onLogin={() => window.location.href = "/login"} />} />
        <Route path="/register" element={<RegisterPage onBack={() => window.location.href = "/"} />} />
      </Routes>
    </Router>
  );
}