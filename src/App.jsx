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

export default function App() {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const handleOpenAi = (prompt = '') => {
    setAiPrompt(prompt);
    setAiModalOpen(true);
  };

  return (
    <div className="app-root">
      <Navbar onOpenAi={handleOpenAi} />
      <main>
        <Hero onOpenAi={handleOpenAi} />
        <Services />

        <DeviceShowcase />
        <WhyUs />
        <TechStack />
        <Process />
        <Portfolio />
        <Pricing />
        <FAQ />
        <AboutUs />
        <Contact />
      </main>

      <Footer />

      {/* KLAPP AI Full-Screen Interactive Assistant */}
      <KlappAiModal 
        isOpen={aiModalOpen} 
        onClose={() => setAiModalOpen(false)} 
        initialPrompt={aiPrompt} 
      />
    </div>
  );
}
