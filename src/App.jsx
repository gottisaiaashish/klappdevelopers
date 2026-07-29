import React from 'react';
import './styles/global.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import DeviceShowcase from './components/DeviceShowcase';
import AiSimulator from './components/AiSimulator';
import WhyUs from './components/WhyUs';
import TechStack from './components/TechStack';
import Process from './components/Process';
import Portfolio from './components/Portfolio';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="app-root">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <DeviceShowcase />
        <AiSimulator />
        <WhyUs />
        <TechStack />
        <Process />
        <Portfolio />
        <Pricing />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
