import React, { useState, useEffect } from 'react';

const ROTATING_PROMPTS = [
  'Ask KLAPP digital solutions...',
  'Ask about custom React Web Applications...',
  'Ask about AI Automations & Meta WhatsApp Bots...',
  'Ask about Enterprise ERP & Business Software...',
  'Ask about Founder Gotti Aashish & KLAPP Group...',
  'Ask about Pricing, Timelines & MVP Packages...'
];

export default function Hero({ onOpenAi }) {
  const [selectedTag, setSelectedTag] = useState('Web Apps');
  const [promptText, setPromptText] = useState('');
  
  // Typewriter Loop State
  const [placeholderText, setPlaceholderText] = useState('');
  const [promptIndex, setPromptIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = ROTATING_PROMPTS[promptIndex];
    let typingSpeed = isDeleting ? 30 : 65;

    if (!isDeleting && placeholderText === currentFullText) {
      typingSpeed = 1800; // Pause at end of phrase
    } else if (isDeleting && placeholderText === '') {
      setIsDeleting(false);
      setPromptIndex((prev) => (prev + 1) % ROTATING_PROMPTS.length);
      typingSpeed = 300; // Pause before typing next phrase
    }

    const timer = setTimeout(() => {
      if (!isDeleting && placeholderText !== currentFullText) {
        setPlaceholderText(currentFullText.slice(0, placeholderText.length + 1));
      } else if (isDeleting && placeholderText !== '') {
        setPlaceholderText(currentFullText.slice(0, placeholderText.length - 1));
      } else if (!isDeleting && placeholderText === currentFullText) {
        setIsDeleting(true);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [placeholderText, isDeleting, promptIndex]);

  const handleAsk = (e) => {
    if (e) e.preventDefault();
    const query = promptText.trim();
    if (onOpenAi) onOpenAi(query);
  };



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
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .prompt-pill-wrapper:focus-within {
          border-color: var(--border-highlight);
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
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
          letter-spacing: 0.04em;
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .filter-pill:hover, .filter-pill.active {
          background: #18181b;
          color: #ffffff;
          border-color: #18181b;
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
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .hero-section {
            padding-top: 110px;
          }
          .hero-title {
            font-size: 2.8rem;
          }
          .prompt-pill-wrapper {
            flex-direction: row;
            padding: 6px 6px 6px 16px;
          }
          .prompt-btn-mobile {
            padding: 8px 14px !important;
            font-size: 0.78rem !important;
          }
          .hero-actions {
            flex-direction: column;
            width: 100%;
            max-width: 320px;
            margin-left: auto;
            margin-right: auto;
          }
          .hero-actions .btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="container">
        {/* Editorial Subtag Badge */}
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

        {/* Pill Input Box with Real Typewriter Animation */}
        <form className="prompt-pill-wrapper" onSubmit={handleAsk}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, width: '100%' }}>
            <i className="ri-sparkling-fill" style={{ color: '#d9532f', fontSize: '1.1rem' }}></i>
            <input 
              type="text" 
              className="prompt-pill-input" 
              placeholder={placeholderText || 'Ask KLAPP digital solutions...'}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary prompt-btn-mobile" style={{ padding: '8px 20px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
            Ask <i className="ri-arrow-right-line"></i>
          </button>
        </form>

        {/* Filter Pills Underneath */}
        <div className="filter-pills-row">
          <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.06em', marginRight: '4px' }}>SERVICES:</span>
          {['Web Apps', 'AI Automation', 'WhatsApp API', 'Enterprise Software'].map((tag) => (
            <button 
              key={tag}
              onClick={() => {
                setSelectedTag(tag);
              }}
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
