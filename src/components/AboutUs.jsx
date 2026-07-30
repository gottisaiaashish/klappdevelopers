import React, { useState, useEffect } from 'react';

export default function AboutUs({ isOpen, onClose }) {
  const [imgError, setImgError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#about') {
        setModalOpen(true);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    if (isOpen !== undefined) {
      setModalOpen(isOpen);
    }
  }, [isOpen]);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalOpen]);

  const handleClose = () => {
    setModalOpen(false);
    if (window.location.hash === '#about') {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
    if (onClose) onClose();
  };

  const copyInsta = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText('@_nanisagar_');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!modalOpen) return null;

  return (
    <div className="about-klapp-page">
      <style>{`
        .about-klapp-page {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 999999;
          background-color: var(--bg-primary);
          background-image: 
            radial-gradient(#d5d0c4 0.75px, transparent 0.75px),
            radial-gradient(#d5d0c4 0.75px, #f4f1ea 0.75px);
          background-size: 30px 30px;
          background-position: 0 0, 15px 15px;
          overflow-y: auto;
          animation: slideUpFull 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          color: var(--text-primary);
        }

        /* Editorial Top Bar */
        .about-top-bar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(244, 241, 234, 0.94);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-color);
          padding: 16px 0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }

        .about-top-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .klapp-brand-title {
          font-family: var(--font-sans);
          font-weight: 800;
          font-size: 1.12rem;
          color: var(--text-primary);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        /* Main Page Container */
        .about-container {
          max-width: 1140px;
          margin: 0 auto;
          padding: 60px 24px 100px 24px;
        }

        .about-header {
          text-align: center;
          max-width: 840px;
          margin: 0 auto 52px auto;
        }

        .about-hero-title {
          font-family: var(--font-sans);
          font-weight: 800;
          font-size: 3.4rem;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          margin-bottom: 16px;
          line-height: 1.1;
        }
        .about-hero-title .serif-italic-accent {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 400;
          color: var(--text-primary);
        }

        /* Metrics Grid */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 56px;
        }

        .metric-item {
          background: #ffffff;
          border: 1px solid var(--border-color);
          border-radius: 18px;
          padding: 24px 20px;
          text-align: center;
          box-shadow: var(--shadow-soft);
          transition: all 0.25s ease;
        }
        .metric-item:hover {
          border-color: var(--border-highlight);
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.06);
        }

        .metric-num {
          font-family: var(--font-sans);
          font-weight: 800;
          font-size: 2.1rem;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          line-height: 1;
          margin-bottom: 6px;
        }

        .metric-lbl {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
        }

        /* Goal & Theme Cards */
        .cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          margin-bottom: 64px;
        }

        .klapp-editorial-card {
          background: #ffffff;
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 40px;
          box-shadow: var(--shadow-soft);
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          height: 100%;
        }
        .klapp-editorial-card:hover {
          border-color: var(--border-highlight);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.07);
          transform: translateY(-2px);
        }

        .card-icon-badge {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: rgba(24, 24, 27, 0.05);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          margin-bottom: 20px;
        }

        .card-heading {
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: 1.65rem;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .card-desc {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.7;
          font-family: var(--font-sans);
        }

        /* Founder Section */
        .founder-card-box {
          background: #ffffff;
          border: 1px solid var(--border-color);
          border-radius: 22px;
          padding: 48px;
          box-shadow: var(--shadow-soft);
        }

        .founder-top-row {
          display: flex;
          gap: 28px;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .founder-avatar-wrap {
          position: relative;
          width: 108px;
          height: 108px;
          flex-shrink: 0;
        }

        .founder-avatar-box {
          width: 100%;
          height: 100%;
          border-radius: 22px;
          background: #18181b;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-sans);
          font-weight: 800;
          font-size: 2rem;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }
        .founder-avatar-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .verified-badge {
          position: absolute;
          bottom: -4px;
          right: -4px;
          background: #18181b;
          color: #ffffff;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          border: 2px solid #ffffff;
        }

        .founder-details {
          flex: 1;
        }

        .founder-name-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 6px;
        }

        .founder-name-text {
          font-family: var(--font-sans);
          font-weight: 800;
          font-size: 2.2rem;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          line-height: 1.1;
        }

        .social-buttons {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-insta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #18181b;
          color: #ffffff;
          padding: 8px 18px;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .btn-insta:hover {
          background: #27272a;
          transform: translateY(-1px);
        }

        .btn-copy {
          background: rgba(0, 0, 0, 0.05);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-copy:hover {
          background: var(--border-highlight);
        }

        .founder-role-tag {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .founder-bio-body p {
          font-size: 0.96rem;
          color: var(--text-secondary);
          line-height: 1.75;
          margin-bottom: 18px;
        }
        .founder-bio-body strong {
          color: var(--text-primary);
          font-weight: 600;
        }

        /* Journey Timeline Grid */
        .journey-block {
          margin-top: 40px;
          padding-top: 36px;
          border-top: 1px solid var(--border-color);
        }

        .journey-title {
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: 1.5rem;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          margin-bottom: 24px;
        }

        .timeline-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .timeline-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 24px 20px;
          transition: all 0.25s ease;
        }
        .timeline-card:hover {
          background: #ffffff;
          border-color: var(--border-highlight);
          transform: translateY(-2px);
        }

        .node-name {
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .node-desc {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* Skill Pills */
        .pills-group {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 36px;
        }

        .klapp-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(24, 24, 27, 0.05);
          border: 1px solid var(--border-color);
          border-radius: 9999px;
          font-family: var(--font-mono);
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--text-primary);
          transition: all 0.2s ease;
        }
        .klapp-pill:hover {
          background: rgba(24, 24, 27, 0.09);
          border-color: var(--border-highlight);
        }

        .bottom-nav-center {
          text-align: center;
          margin-top: 60px;
        }

        @keyframes slideUpFull {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        @media (max-width: 900px) {
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .timeline-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .about-hero-title {
            font-size: 2.3rem;
          }
          .cards-grid {
            grid-template-columns: 1fr;
          }
          .founder-card-box {
            padding: 28px 20px;
          }
          .founder-top-row {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .founder-name-row {
            justify-content: center;
          }
        }
      `}</style>

      {/* Editorial Top Bar */}
      <header className="about-top-bar">
        <div className="container">
          <div className="about-top-flex">
            <span className="klapp-brand-title">KLAPP DEVELOPERS</span>
            <button className="btn btn-primary" onClick={handleClose}>
              <i className="ri-arrow-left-line"></i> Back to Home
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Container */}
      <main className="about-container">
        {/* Header Section */}
        <div className="about-header">
          <div className="section-tag">
            <span className="section-tag-dot"></span> ABOUT & FOUNDER
          </div>
          <h1 className="about-hero-title">
            About <span className="serif-italic-accent">KLAPP Developers</span>
          </h1>
          <p className="section-subtitle">
            Transforming digital architectures through transparency, data-driven predictions, and genuine performance engineering.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          <div className="metric-item">
            <div className="metric-num">4+ Yrs</div>
            <div className="metric-lbl">Digital Engineering</div>
          </div>
          <div className="metric-item">
            <div className="metric-num">18 Yo</div>
            <div className="metric-lbl">Founder & Architect</div>
          </div>
          <div className="metric-item">
            <div className="metric-num">99.9%</div>
            <div className="metric-lbl">System Uptime</div>
          </div>
          <div className="metric-item">
            <div className="metric-num">KLAPP AI</div>
            <div className="metric-lbl">Intelligent Engine</div>
          </div>
        </div>

        {/* Goal & Theme Cards */}
        <div className="cards-grid">
          <div className="klapp-editorial-card">
            <div className="card-icon-badge">
              <i className="ri-target-line"></i>
            </div>
            <div className="section-tag" style={{ marginBottom: '12px' }}>
              <span className="section-tag-dot"></span> OUR MISSION
            </div>
            <h2 className="card-heading">Our Goal</h2>
            <p className="card-desc">
              KLAPP Developers was built with a single mission: to demystify complex software & web applications. We aim to provide comprehensive, high-performance digital solutions, AI automation predictors, and scalable infrastructure that brings transparency and growth directly to modern businesses.
            </p>
          </div>

          <div className="klapp-editorial-card">
            <div className="card-icon-badge">
              <i className="ri-shield-check-line"></i>
            </div>
            <div className="section-tag" style={{ marginBottom: '12px' }}>
              <span className="section-tag-dot"></span> DESIGN SYSTEM
            </div>
            <h2 className="card-heading">Our Theme</h2>
            <p className="card-desc">
              Rooted in modern digital architecture and a seamless user experience, our theme revolves around empowerment through technical clarity. We believe that scaling your digital presence shouldn't be a puzzle—it should be a guided, beautiful, and high-converting experience.
            </p>
          </div>
        </div>

        {/* Founder Section */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="section-tag" style={{ justifyContent: 'center' }}>
            <span className="section-tag-dot"></span> LEADERSHIP & VISION
          </div>
          <h2 className="about-hero-title" style={{ fontSize: '2.8rem' }}>
            Meet The <span className="serif-italic-accent">Founder</span>
          </h2>
        </div>

        <div className="founder-card-box">
          <div className="founder-top-row">
            <div className="founder-avatar-wrap">
              <div className="founder-avatar-box">
                {!imgError ? (
                  <img 
                    src="/aashish.jpg" 
                    alt="Gotti Aashish - Founder of KLAPP Group & KLAPP Developers"
                    onError={() => setImgError(true)} 
                  />
                ) : (
                  'GA'
                )}
              </div>
              <div className="verified-badge" title="Verified Founder">
                <i className="ri-check-line"></i>
              </div>
            </div>

            <div className="founder-details">
              <div className="founder-name-row">
                <h3 className="founder-name-text">Gotti Aashish</h3>
                <div className="social-buttons">
                  <a 
                    href="https://www.instagram.com/_nanisagar_" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-insta"
                  >
                    <i className="ri-instagram-line"></i> @_nanisagar_ <i className="ri-external-link-line"></i>
                  </a>
                  <button className="btn-copy" onClick={copyInsta} title="Copy handle">
                    <i className={copied ? 'ri-check-line' : 'ri-file-copy-line'}></i>
                  </button>
                </div>
              </div>

              <div className="founder-role-tag">
                FOUNDER, FULL-STACK DEVELOPER, SOCIAL MEDIA STRATEGIST & DIGITAL ARCHITECT
              </div>
            </div>
          </div>

          <div className="founder-bio-body">
            <p>
              At just 18 years old (born March 4, 2008), Aashish has already evolved into a digital architect with over 4 years of experience. He is the visionary <strong>Founder of the Klapp Group</strong> and the driving force behind his current startup, <strong>Klappdevelopers</strong>. Driven by a passion for building, he has developed numerous successful projects and continues to innovate with many more in the pipeline.
            </p>
            <p>
              His strong footprint in digital strategy includes his role as a Social Media Manager for <strong>OrangeArmyForever</strong> (a massive fan community) and his deep roots in leading and managing large-scale <strong>Banning Communities</strong>. By combining mass-scale community strategies, cinematic storytelling, innovative <strong>AI automations (via KLAPP AI)</strong>, and deep algorithmic understanding, he continuously shapes how modern brands and platforms interact with their audiences.
            </p>
            <p>
              <strong>The Mindset:</strong> Aashish operates on the principle of relentless execution and continuous learning. Whether architecting complex full-stack applications or building massive online communities, he approaches every challenge as an opportunity to innovate. He believes that true digital architecture goes beyond writing code—it's about crafting experiences that resonate on a massive scale. To dive deeper into his journey, daily updates, and to see what he's building next, check out his Instagram <strong>@_nanisagar_</strong>!
            </p>
          </div>

          {/* Journey Timeline Grid */}
          <div className="journey-block">
            <h3 className="journey-title">
              The Evolution <span className="serif-italic-accent" style={{ fontFamily: 'var(--font-serif)' }}>Timeline</span>
            </h3>

            <div className="timeline-grid">
              <div className="timeline-card">
                <div className="section-tag" style={{ marginBottom: '10px' }}>
                  <span className="section-tag-dot"></span> PHASE 01
                </div>
                <h4 className="node-name">Alpha Phase</h4>
                <p className="node-desc">
                  Immersed in gaming environments and community servers, learning the foundations of digital behavior and mass coordination.
                </p>
              </div>

              <div className="timeline-card">
                <div className="section-tag" style={{ marginBottom: '10px' }}>
                  <span className="section-tag-dot"></span> PHASE 02
                </div>
                <h4 className="node-name">Creative Ignition</h4>
                <p className="node-desc">
                  Pivoted to content creation, exploring cinematic editing, and learning exactly how visual retention algorithms operate across platforms.
                </p>
              </div>

              <div className="timeline-card">
                <div className="section-tag" style={{ marginBottom: '10px' }}>
                  <span className="section-tag-dot"></span> PHASE 03
                </div>
                <h4 className="node-name">Strategic Architecture</h4>
                <p className="node-desc">
                  Applying mass-scale methodologies—developing analytical processes for growth via Social Media analysis and building digital experiences.
                </p>
              </div>
            </div>
          </div>

          {/* Skill Pills */}
          <div className="pills-group">
            <div className="klapp-pill">
              <i className="ri-code-s-slash-line"></i> Full-Stack Development
            </div>
            <div className="klapp-pill">
              <i className="ri-cpu-line"></i> AI Automations (KLAPP AI)
            </div>
            <div className="klapp-pill">
              <i className="ri-group-line"></i> Community Architecture
            </div>
            <div className="klapp-pill">
              <i className="ri-bar-chart-box-line"></i> Content Strategy
            </div>
          </div>
        </div>

        {/* Bottom Back Button */}
        <div className="bottom-nav-center">
          <button className="btn btn-primary" onClick={handleClose} style={{ padding: '14px 36px', fontSize: '0.94rem' }}>
            <i className="ri-arrow-left-line"></i> Back to KLAPP Developers
          </button>
        </div>
      </main>
    </div>
  );
}
