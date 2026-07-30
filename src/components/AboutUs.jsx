import React, { useState } from 'react';

export default function AboutUs() {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="about" className="section" style={{ background: '#FAF8F5', position: 'relative' }}>
      <style>{`
        .about-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 60px auto;
        }
        .about-title {
          font-family: var(--font-serif);
          font-size: 3rem;
          font-weight: 500;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          margin-bottom: 16px;
        }
        .about-subtitle {
          font-size: 1.15rem;
          color: var(--text-secondary);
          line-height: 1.6;
          font-family: var(--font-sans);
        }

        .cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          margin-bottom: 72px;
        }

        .goal-card {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 20px;
          padding: 36px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .goal-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.06);
        }

        .card-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: rgba(99, 102, 241, 0.08);
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-bottom: 20px;
        }

        .card-heading {
          font-family: var(--font-sans);
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 14px;
        }

        .card-text {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.7;
        }

        /* Founder Card */
        .founder-section-title {
          text-align: center;
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: 2.2rem;
          color: var(--text-primary);
          margin-bottom: 40px;
        }

        .founder-card {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 24px;
          padding: 44px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
          max-width: 920px;
          margin: 0 auto;
        }

        .founder-header-flex {
          display: flex;
          gap: 28px;
          align-items: flex-start;
          margin-bottom: 28px;
        }

        .founder-avatar {
          width: 110px;
          height: 110px;
          border-radius: 24px;
          object-fit: cover;
          background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-family: var(--font-sans);
          font-weight: 800;
          font-size: 2rem;
          flex-shrink: 0;
          box-shadow: 0 8px 24px rgba(79, 70, 229, 0.25);
          overflow: hidden;
        }

        .founder-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .founder-meta {
          flex: 1;
        }

        .founder-name-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 8px;
        }

        .founder-name {
          font-family: var(--font-sans);
          font-weight: 800;
          font-size: 1.85rem;
          color: var(--text-primary);
        }

        .founder-links {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .insta-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(225, 48, 108, 0.08);
          color: #e1306c;
          padding: 6px 14px;
          border-radius: 30px;
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .insta-badge:hover {
          background: #e1306c;
          color: #ffffff;
          transform: translateY(-2px);
        }

        .founder-role {
          font-size: 1.05rem;
          font-weight: 600;
          color: #4f46e5;
          margin-bottom: 16px;
        }

        .founder-bio p {
          color: var(--text-secondary);
          font-size: 0.96rem;
          line-height: 1.75;
          margin-bottom: 18px;
        }

        .founder-bio strong {
          color: var(--text-primary);
          font-weight: 600;
        }

        /* Journey Timeline */
        .journey-wrapper {
          margin-top: 36px;
          padding-top: 32px;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
        }

        .journey-heading {
          font-family: var(--font-sans);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 24px;
        }

        .timeline {
          position: relative;
          padding-left: 28px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .timeline::before {
          content: '';
          position: absolute;
          left: 7px;
          top: 8px;
          bottom: 8px;
          width: 2px;
          background: rgba(0, 0, 0, 0.1);
        }

        .timeline-item {
          position: relative;
        }
        .timeline-dot {
          position: absolute;
          left: -28px;
          top: 6px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ffffff;
          border: 4px solid #4f46e5;
        }

        .item-title {
          font-weight: 700;
          font-size: 1rem;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .item-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .pills-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 32px;
        }

        .skill-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 30px;
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        @media (max-width: 768px) {
          .cards-grid {
            grid-template-columns: 1fr;
          }
          .about-title {
            font-size: 2.2rem;
          }
          .founder-card {
            padding: 28px 20px;
          }
          .founder-header-flex {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .founder-name-row {
            justify-content: center;
          }
        }
      `}</style>

      <div className="container">
        {/* About Header */}
        <div className="about-header">
          <h2 className="about-title">About KLAPP Developers</h2>
          <p className="about-subtitle">
            Transforming digital architectures through transparency, data-driven predictions, and genuine performance engineering.
          </p>
        </div>

        {/* Goal & Theme Cards */}
        <div className="cards-grid">
          <div className="goal-card">
            <div className="card-icon">
              <i className="ri-target-line"></i>
            </div>
            <h3 className="card-heading">Our Goal</h3>
            <p className="card-text">
              KLAPP Developers was built with a single mission: to demystify complex software & web applications. We aim to provide comprehensive, high-performance digital solutions, AI automation predictors, and scalable infrastructure that brings transparency and growth directly to modern businesses.
            </p>
          </div>

          <div className="goal-card">
            <div className="card-icon">
              <i className="ri-shield-check-line"></i>
            </div>
            <h3 className="card-heading">Our Theme</h3>
            <p className="card-text">
              Rooted in modern digital architecture and a seamless user experience, our theme revolves around empowerment through technical clarity. We believe that scaling your digital presence shouldn't be a puzzle—it should be a guided, beautiful, and high-converting experience.
            </p>
          </div>
        </div>

        {/* Meet The Founder */}
        <h2 className="founder-section-title">Meet The Founder</h2>

        <div className="founder-card">
          <div className="founder-header-flex">
            <div className="founder-avatar">
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

            <div className="founder-meta">
              <div className="founder-name-row">
                <h3 className="founder-name">Gotti Aashish</h3>
                <div className="founder-links">
                  <a 
                    href="https://www.instagram.com/_nanisagar_" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="insta-badge"
                  >
                    <i className="ri-instagram-line"></i> @_nanisagar_ <i className="ri-external-link-line"></i>
                  </a>
                </div>
              </div>

              <div className="founder-role">
                Founder, Full-Stack Developer, Social Media Strategist & Digital Architect
              </div>
            </div>
          </div>

          <div className="founder-bio">
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

          {/* The Journey */}
          <div className="journey-wrapper">
            <h4 className="journey-heading">The Journey</h4>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="item-title">Alpha Phase</div>
                <div className="item-desc">
                  Immersed in gaming environments and community servers, learning the foundations of digital behavior and mass coordination.
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="item-title">Creative Ignition</div>
                <div className="item-desc">
                  Pivoted to content creation, exploring cinematic editing, and learning exactly how visual retention algorithms operate across platforms.
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="item-title">Strategic Architecture</div>
                <div className="item-desc">
                  Applying mass-scale methodologies—developing analytical processes for growth via Social Media analysis and building digital experiences.
                </div>
              </div>
            </div>
          </div>

          {/* Skill Pills */}
          <div className="pills-row">
            <div className="skill-pill"><i className="ri-code-s-slash-line"></i> Full-Stack Development</div>
            <div className="skill-pill"><i className="ri-cpu-line"></i> AI Automations (KLAPP AI)</div>
            <div className="skill-pill"><i className="ri-group-line"></i> Community Architecture</div>
            <div className="skill-pill"><i className="ri-bar-chart-box-line"></i> Content Strategy</div>
          </div>
        </div>
      </div>
    </section>
  );
}
