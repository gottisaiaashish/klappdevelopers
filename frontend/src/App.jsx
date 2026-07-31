import React, { useState } from 'react';
import './styles/global.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import DeviceShowcase from './components/DeviceShowcase';
import WhyUs from './components/WhyUs';
import TechStack from './components/TechStack';
import Process from './components/Process';
import Portfolio from './components/Portfolio';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import KlappAiModal from './components/KlappAiModal';
import AdminLoginModal from './components/AdminLoginModal';
import AdminDashboardModal from './components/AdminDashboardModal';

export default function App() {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [pricingOpen, setPricingOpen] = useState(false);
  const [showcaseOpen, setShowcaseOpen] = useState(false);

  // Admin Portal State
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);

  const handleOpenAi = (prompt = '') => {
    setAiPrompt(prompt);
    setAiModalOpen(true);
  };

  const handleOpenAdminLogin = () => {
    const existingToken = sessionStorage.getItem('klapp_admin_token');
    if (existingToken === 'klapp_admin_token_04160416') {
      setAdminDashboardOpen(true);
    } else {
      setAdminLoginOpen(true);
    }
  };

  const handleSuccessLogin = () => {
    setAdminLoginOpen(false);
    setAdminDashboardOpen(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('klapp_admin_token');
    sessionStorage.removeItem('klapp_admin_user');
    setAdminDashboardOpen(false);
  };

  return (
    <div className="app-root">
      <Navbar 
        onOpenAi={handleOpenAi} 
        onOpenPricing={() => setPricingOpen(true)} 
        onOpenShowcase={() => setShowcaseOpen(true)} 
      />
      <main>
        <Hero onOpenAi={handleOpenAi} />
        <Services />
        <WhyUs />
        <TechStack />
        <Process />
        <Portfolio />
        <FAQ />
        <AboutUs />
        <Contact />
      </main>

      <Footer 
        onOpenPricing={() => setPricingOpen(true)} 
        onOpenShowcase={() => setShowcaseOpen(true)} 
        onOpenAdminLogin={handleOpenAdminLogin}
      />

      {/* Showcase Page Overlay */}
      {showcaseOpen && (
        <DeviceShowcase isOpen={true} onClose={() => setShowcaseOpen(false)} />
      )}

      {/* Pricing Page Overlay */}
      {pricingOpen && (
        <Pricing isOpen={true} onClose={() => setPricingOpen(false)} />
      )}

      {/* KLAPP AI Full-Screen Interactive Assistant */}
      <KlappAiModal 
        isOpen={aiModalOpen} 
        onClose={() => setAiModalOpen(false)} 
        initialPrompt={aiPrompt} 
      />

      {/* Founder Admin Login Popup */}
      <AdminLoginModal 
        isOpen={adminLoginOpen} 
        onClose={() => setAdminLoginOpen(false)} 
        onSuccessLogin={handleSuccessLogin} 
      />

      {/* Founder Admin Inquiries Dashboard */}
      <AdminDashboardModal 
        isOpen={adminDashboardOpen} 
        onClose={() => setAdminDashboardOpen(false)} 
        onLogout={handleLogout} 
      />
    </div>
  );
}
