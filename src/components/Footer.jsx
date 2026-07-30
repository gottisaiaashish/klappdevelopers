import React from 'react';

export default function Footer() {
  return (
    <footer style={{ background: '#eae6dd', borderTop: '1px solid var(--border-color)', padding: '60px 0 36px 0' }}>
      <div className="container">
        
        <div className="footer-grid">
          <style>{`
            .footer-grid {
              display: grid;
              grid-template-columns: 1.4fr 0.8fr 0.8fr 1fr;
              gap: 36px;
              margin-bottom: 48px;
            }
            @media (max-width: 900px) {
              .footer-grid {
                grid-template-columns: 1fr 1fr;
              }
            }
            @media (max-width: 600px) {
              .footer-grid {
                grid-template-columns: 1fr;
              }
            }
            .footer-title {
              font-family: var(--font-mono);
              font-weight: 500;
              font-size: 0.78rem;
              letter-spacing: 0.1em;
              text-transform: uppercase;
              color: var(--text-muted);
              margin-bottom: 16px;
            }
            .footer-links {
              list-style: none;
              display: flex;
              flex-direction: column;
              gap: 10px;
            }
            .footer-links a {
              color: var(--text-secondary);
              text-decoration: none;
              font-size: 0.88rem;
              transition: color 0.2s ease;
            }
            .footer-links a:hover {
              color: var(--text-primary);
            }
          `}</style>

          <div>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: '800', fontSize: '1.1rem', letterSpacing: '0.12em', color: 'var(--text-primary)', marginBottom: '12px' }}>
              KLAPP DEVELOPERS
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '16px', maxWidth: '300px' }}>
              Knowledge Led Apps & Performance Partners. Engineering high-performance web apps, AI automation, and scalable software.
            </p>
            <div className="badge badge-emerald" style={{ padding: '4px 12px' }}>
              ● ALL SYSTEMS OPERATIONAL - 99.99%
            </div>
          </div>

          <div>
            <h4 className="footer-title">Navigation</h4>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#showcase">Live Showcase</a></li>
              <li><a href="#portfolio">Portfolio</a></li>
              <li><a href="#pricing">Pricing</a></li>
            </ul>
          </div>


          <div>
            <h4 className="footer-title">Services</h4>
            <ul className="footer-links">
              <li><a href="#services">Website Development</a></li>
              <li><a href="#services">AI Automation</a></li>
              <li><a href="#services">WhatsApp API</a></li>
              <li><a href="#services">Mobile Applications</a></li>
              <li><a href="#services">Business Software</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Direct Contact</h4>
            <div style={{ fontSize: '0.92rem', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginBottom: '6px' }}>
              <i className="ri-phone-fill" style={{ color: '#15803d', marginRight: '6px' }}></i> +91 79890 33580
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '14px' }}>
              Direct line available 24/7 on WhatsApp & Call.
            </p>
            <div style={{ display: 'flex', gap: '14px', fontSize: '1.3rem' }}>
              <a href="#" style={{ color: 'var(--text-secondary)' }}><i className="ri-linkedin-box-fill"></i></a>
              <a href="#" style={{ color: 'var(--text-secondary)' }}><i className="ri-twitter-x-fill"></i></a>
              <a href="#" style={{ color: 'var(--text-secondary)' }}><i className="ri-github-fill"></i></a>
              <a href="https://wa.me/917989033580" target="_blank" rel="noopener noreferrer" style={{ color: '#15803d' }}><i className="ri-whatsapp-fill"></i></a>
            </div>
          </div>

        </div>

        <div style={{ paddingTop: '24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <div>© 2026 KLAPP Developers. All rights reserved. Knowledge Led Apps & Performance Partners.</div>
          <div>
            <a href="#home" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '500' }}>
              <i className="ri-arrow-up-line"></i> Back to Top
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
