import React, { useState } from 'react';

export default function Hero() {
  const [selectedTag, setSelectedTag] = useState('Web Apps');

  return (
    <section id="home" className="hero-section">
      <style>{`
        .hero-section {
          position: relative;
          padding-top: 170px;
          padding-bottom: 100px;
          text-align: center;
        }
        .hero-title {
          font-family: var(--font-serif);
          font-weight: 400;
          font-size: 4.8rem;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          max-width: 900px;
          margin: 0 auto 24px auto;
        }
        .hero-title .emphasis {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 400;
          color: #18181b;
        }
        @media (max-width: 768px) {
          .hero-title {
            font-size: 3rem;
          }
        }
        .hero-desc {
          font-size: 1.1rem;
          color: var(--text-secondary);
          line-height: 1.6;
          max-width: 640px;
          margin: 0 auto 36px auto;
        }

        /* Hero Tag Line Adjustment */
        .hero-tag-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 0.76rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 24px;
        }

        /* Wide Pill Prompt Box */
        .prompt-pill-wrapper {
          display: flex;
          align-items: center;
          background: #eae5db;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 9999px;
          padding: 6px 8px 6px 24px;
          max-width: 620px;
          margin: 0 auto 28px auto;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }
        .prompt-pill-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 0.95rem;
        }
        .prompt-pill-input::placeholder {
          color: var(--text-muted);
        }

        /* Filter Pills Underneath */
        .filter-pills-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        .filter-pill {
          padding: 6px 16px;
          border-radius: 9999px;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          border: 1px solid transparent;
          background: rgba(0, 0, 0, 0.04);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .filter-pill.active {
          background: #18181b;
          color: #ffffff;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 40px;
        }

        .trust-text {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-muted);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
      `}</style>

      <div className="container">
        
        {/* Joined Badge without EST 2026 */}
        <div className="hero-tag-badge">
          <span className="section-tag-dot"></span> KNOWLEDGE LED APPS & PERFORMANCE PARTNERS
        </div>

        {/* High Contrast Regular Serif Title */}
        <h1 className="hero-title">
          Building <span className="emphasis">intelligent</span> websites & AI business solutions.
        </h1>

        {/* Subtitle */}
        <p className="hero-desc">
          Grounded software engineering & high-performance digital apps — built at <i>your</i> level. Zero bloat if you want. Full scalability if you do.
        </p>

        {/* Pill Input Box */}
        <div className="prompt-pill-wrapper">
          <i className="ri-question-line" style={{ color: 'var(--text-muted)', marginRight: '10px', fontSize: '1.2rem' }}></i>
          <input 
            type="text" 
            className="prompt-pill-input" 
            placeholder="Ask KLAPP digital solutions anything..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />
          <a href="#contact" className="btn btn-primary" style={{ padding: '10px 22px', fontSize: '0.85rem' }}>
            Ask <i className="ri-arrow-right-line"></i>
          </a>
        </div>

        {/* Filter Pills Underneath */}
        <div className="filter-pills-row">
          <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.08em', marginRight: '6px' }}>SERVICES:</span>
          {['Web Apps', 'AI Automation', 'WhatsApp API', 'Enterprise Software'].map((tag) => (
            <button 
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`filter-pill ${selectedTag === tag ? 'active' : ''}`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hero-actions">
          <a href="#contact" className="btn btn-primary" style={{ padding: '12px 28px' }}>
            Get Started <i className="ri-arrow-right-line"></i>
          </a>
          <a href="#showcase" className="btn btn-secondary" style={{ padding: '12px 24px' }}>
            View Live Demos
          </a>
        </div>

        <div className="trust-text">
          FREE CONSULTATION · 24/7 SUPPORT SLA · 50+ ENTERPRISE CLIENTS GLOBALLY
        </div>

      </div>
    </section>
  );
}
