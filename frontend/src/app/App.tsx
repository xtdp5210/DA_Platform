import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Layout from "./components/Layout";
import { Hero } from "./components/defence/Hero";
import { Background } from "./components/defence/Background";
import { About } from "./components/defence/About";
import { Objectives } from "./components/defence/Objectives";
import { Programme } from "./components/defence/Programme";
import { Exposition } from "./components/defence/Exposition";
import { WhyAttend } from "./components/defence/WhyAttend";
import { StrategicOutcomes } from "./components/defence/Strategicoutcomes";
import { PhotoGallery } from "./components/defence/PhotoGallery";
import { VideoGallery } from "./components/defence/VideoGallery";
import { SponsorsSection } from "./components/defence/Sponsorssection";
import { AuthProvider } from "../store/authStore";
import ProtectedRoute from "../app/components/ProtectedRoute";
import LoginPage from "./components/defence/Loginpage";
import RegisterPage from "./components/defence/RegisterPage";
import OTPVerifyPage from "./components/defence/OTPVerifyPage";
import ForgotPasswordPage from "./components/defence/ForgotPasswordPage";
import ResetPasswordPage from "./components/defence/ResetPasswordPage";
import DashboardPage from "./components/defence/DashboardPage";
import RegistrationPage from "./components/defence/RegistrationPage";
import ProfilePage from "./components/defence/ProfilePage";
import FloorMapPage from "./components/defence/FloorMapPage";

// Keep your existing landing page import:
// import LandingPage from "./app/components/defence/YourLandingPage";
import { IndianBorder } from "./components/defence/IndianBorder";
import { Header } from "./components/defence/Header";
import { Footer } from "./components/defence/Footer";
function MainPage() {
  return (
    <>
      <div className="w-full min-h-screen" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", backgroundColor: "#ffffff" }}>
        <IndianBorder sticky />
        <Header onRegister={() => window.location.href = "/register"} onLogin={() => window.location.href = "/login"} />
        <Hero onRegister={() => window.location.href = "/register"} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <Background />
          <About />
          <Objectives />
          <Programme />
          <Exposition />
          <WhyAttend onRegister={() => window.location.href = "/register"} />
          <PhotoGallery />
          <VideoGallery />
          <SponsorsSection />
          <StrategicOutcomes />
        </div>
        <Footer onRegister={() => window.location.href = "/register"} />
      </div>
      <IndianBorder flip />
    </>
  );
}

const App = () => {
  return (
    <GoogleOAuthProvider clientId="702083542345-aumvnmv93knda278ugk9br849qh4p7jt.apps.googleusercontent.com">
      <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<MainPage />} />
          <Route path="/forgot-password" element={<Layout><ForgotPasswordPage /></Layout>} />
          <Route path="/reset-password" element={<Layout><ResetPasswordPage /></Layout>} />
          <Route path="/verify-otp" element={<Layout><OTPVerifyPage /></Layout>} />

          {/* Guest only */}
          <Route path="/login" element={<Layout><ProtectedRoute guestOnly><LoginPage /></ProtectedRoute></Layout>} />
          <Route path="/register" element={<Layout><ProtectedRoute guestOnly><RegisterPage /></ProtectedRoute></Layout>} />

          {/* Protected */}
          <Route path="/dashboard" element={<Layout><ProtectedRoute><DashboardPage /></ProtectedRoute></Layout>} />
          <Route path="/registerevent" element={<ProtectedRoute><RegistrationPage /></ProtectedRoute>} />
          <Route path="/profile" element={<Layout><ProtectedRoute><ProfilePage /></ProtectedRoute></Layout>} />
          <Route path="/floormap" element={<FloorMapPage />} />

          {/* 404 */}
          <Route path="*" element={<Layout><div className="min-h-screen flex items-center justify-center text-gray-500">Page not found.</div></Layout>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;