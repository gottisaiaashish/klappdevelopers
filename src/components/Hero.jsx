import React, { useState } from 'react';

export default function Hero() {
  const [selectedTag, setSelectedTag] = useState('Web Apps');

  return (
    <section id="home" className="hero-section">
      <style>{`
        .hero-section {
          position: relative;
          padding-top: 150px;
          padding-bottom: 80px;
          text-align: center;
        }
        .hero-title {
          font-family: var(--font-serif);
          font-weight: 400;
          font-size: 4.5rem;
          line-height: 1.06;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          max-width: 900px;
          margin: 0 auto 20px auto;
        }
        .hero-title .emphasis {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 400;
          color: #18181b;
        }
        .hero-desc {
          font-size: 1.08rem;
          color: var(--text-secondary);
          line-height: 1.6;
          max-width: 620px;
          margin: 0 auto 32px auto;
        }

        /* Hero Tag Line Badge */
        .hero-tag-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 20px;
          flex-wrap: wrap;
          justify-content: center;
        }

        /* Wide Pill Prompt Box */
        .prompt-pill-wrapper {
          display: flex;
          align-items: center;
          background: #eae5db;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 9999px;
          padding: 6px 8px 6px 20px;
          max-width: 600px;
          margin: 0 auto 24px auto;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }
        .prompt-pill-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 0.92rem;
          min-width: 0;
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
          margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .filter-pill {
          padding: 6px 14px;
          border-radius: 9999px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
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
          gap: 12px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .trust-text {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-muted);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        /* Mobile Phone Screen Fixes (< 640px) */
        @media (max-width: 640px) {
          .hero-section {
            padding-top: 115px;
            padding-bottom: 60px;
          }
          .hero-title {
            font-size: 2.2rem;
            line-height: 1.15;
            margin-bottom: 14px;
          }
          .hero-desc {
            font-size: 0.95rem;
            margin-bottom: 24px;
            padding: 0 8px;
          }
          .hero-tag-badge {
            font-size: 0.65rem;
            letter-spacing: 0.02em;
            margin-bottom: 14px;
          }
          .prompt-pill-wrapper {
            border-radius: 16px;
            padding: 10px 14px;
            flex-direction: column;
            gap: 10px;
            align-items: stretch;
            background: #eae5db;
          }
          .prompt-pill-input {
            font-size: 0.88rem;
            text-align: center;
          }
          .prompt-btn-mobile {
            width: 100%;
            justify-content: center;
          }
          .hero-actions {
            flex-direction: column;
            width: 100%;
          }
          .hero-actions .btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="container">
        
        {/* Joined Badge */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, width: '100%' }}>
            <i className="ri-question-line" style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}></i>
            <input 
              type="text" 
              className="prompt-pill-input" 
              placeholder="Ask KLAPP digital solutions..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const el = document.getElementById('contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
          </div>
          <a href="#contact" className="btn btn-primary prompt-btn-mobile" style={{ padding: '8px 20px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
            Ask <i className="ri-arrow-right-line"></i>
          </a>
        </div>

        {/* Filter Pills Underneath */}
        <div className="filter-pills-row">
          <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.06em', marginRight: '4px' }}>SERVICES:</span>
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
          FREE CONSULTATION · 24/7 SUPPORT SLA · 50+ ENTERPRISE CLIENTS
        </div>

      </div>
    </section>
  );
}
