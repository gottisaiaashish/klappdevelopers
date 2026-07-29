import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 24px 0;
          transition: all 0.3s ease;
        }
        .navbar.scrolled {
          padding: 16px 0;
          background: rgba(244, 241, 234, 0.92);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }
        .navbar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo {
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .logo-title {
          font-family: var(--font-sans);
          font-weight: 800;
          font-size: 1.15rem;
          color: var(--text-primary);
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
          list-style: none;
        }
        .nav-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .nav-link:hover {
          color: var(--text-primary);
        }
        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 1.5rem;
          cursor: pointer;
        }
        @media (max-width: 900px) {
          .nav-links {
            display: ${mobileMenuOpen ? 'flex' : 'none'};
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            flex-direction: column;
            background: #f4f1ea;
            padding: 24px;
            border-bottom: 1px solid var(--border-color);
            gap: 16px;
          }
          .mobile-toggle {
            display: block;
          }
        }
      `}</style>
      <div className="container">
        <div className="navbar-content">
          <a href="#home" className="logo">
            <span className="logo-title">KLAPP DEVELOPERS</span>
          </a>

          <nav>
            <ul className="nav-links">
              <li><a href="#services" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Services</a></li>
              <li><a href="#showcase" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Showcase</a></li>
              <li><a href="#simulator" className="nav-link" onClick={() => setMobileMenuOpen(false)}>AI Simulator</a></li>
              <li><a href="#portfolio" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Portfolio</a></li>
              <li><a href="#pricing" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Pricing</a></li>
              <li><a href="#faq" className="nav-link" onClick={() => setMobileMenuOpen(false)}>FAQ</a></li>
            </ul>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href="#contact" className="btn btn-primary" style={{ padding: '10px 22px', fontSize: '0.85rem' }}>
              Book a Call <i className="ri-arrow-right-line"></i>
            </a>

            <button 
              className="mobile-toggle" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <i className={mobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'}></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
