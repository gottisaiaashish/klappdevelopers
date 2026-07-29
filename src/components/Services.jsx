import React from 'react';

const services = [
  {
    icon: 'ri-global-line',
    title: 'Website Development',
    desc: 'High-converting, ultra-fast web apps built with React, modern animation engines, dynamic layouts, and sub-100ms loading speeds.',
    features: ['99+ Lighthouse Performance', 'Custom Editorial Typography', 'SEO Optimized Architecture']
  },
  {
    icon: 'ri-brain-line',
    title: 'AI Automation & Agents',
    desc: 'Custom autonomous AI agents, RAG vector pipelines, and document intelligence workflows that automate repetitive operations.',
    features: ['OpenAI & Gemini Integrations', 'Intelligent Document Parsing', 'Enterprise Workflow Automation']
  },
  {
    icon: 'ri-whatsapp-line',
    title: 'WhatsApp Automation',
    desc: 'Official WhatsApp Cloud API bots, interactive lead generation funnels, automated booking alerts, and instant CRM sync.',
    features: ['Multi-Choice Interactive Chatbots', 'Automated Payment Link Generator', 'Google Sheets & Database Sync']
  },
  {
    icon: 'ri-smartphone-line',
    title: 'Mobile Applications',
    desc: 'Cross-platform iOS and Android applications crafted with smooth 60fps animations, push alerts, and offline-first data sync.',
    features: ['Flutter & React Native Architecture', 'Biometric Auth & Push Alerts', 'App Store & Play Store Deployment']
  },
  {
    icon: 'ri-dashboard-3-line',
    title: 'Business Software / ERP',
    desc: 'Bespoke ERPs, inventory portals, channel managers, and executive analytics suites tailored specifically to your business process.',
    features: ['Role-Based Access Control', 'Real-time Financial Reporting', 'Custom Webhooks & API Bridges']
  },
  {
    icon: 'ri-cloud-windy-line',
    title: 'Cloud & Scalable Systems',
    desc: 'High-availability AWS server infrastructure, automated CI/CD deployment pipelines, and zero-downtime microservices.',
    features: ['AWS & PostgreSQL Infrastructure', 'Automated Load Balancing', '99.99% Uptime SLA']
  }
];

export default function Services() {
  return (
    <section id="services" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        
        <div className="section-header">
          <div className="section-tag">
            <span className="section-tag-dot"></span> WHAT WE BUILD
          </div>
          <h2 className="section-title">
            Engineered for <span className="serif-italic">maximum performance.</span>
          </h2>
          <p className="section-subtitle">
            Every software solution we deliver is designed with high scalability, clean code architecture, and refined visual presentation.
          </p>
        </div>

        <div className="services-grid">
          <style>{`
            .services-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
              gap: 24px;
            }
            .service-icon-box {
              width: 44px;
              height: 44px;
              border-radius: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 1.4rem;
              margin-bottom: 20px;
              background: #eae5db;
              color: var(--text-primary);
              border: 1px solid var(--border-color);
            }
            .service-title {
              font-family: var(--font-serif);
              font-weight: 400;
              font-size: 1.6rem;
              color: var(--text-primary);
              margin-bottom: 10px;
            }
            .service-desc {
              color: var(--text-secondary);
              font-size: 0.92rem;
              line-height: 1.6;
              margin-bottom: 20px;
            }
            .service-list {
              list-style: none;
              margin-bottom: 24px;
            }
            .service-list li {
              display: flex;
              align-items: center;
              gap: 8px;
              color: var(--text-primary);
              font-size: 0.85rem;
              margin-bottom: 8px;
            }
            .service-list i {
              color: var(--accent-dot);
            }
            .service-link {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              color: var(--text-primary);
              font-weight: 600;
              font-size: 0.88rem;
              text-decoration: none;
              transition: gap 0.2s ease;
            }
            .service-link:hover {
              gap: 10px;
            }
          `}</style>

          {services.map((s, idx) => (
            <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="service-icon-box">
                  <i className={s.icon}></i>
                </div>
                <h3 className="service-title">{s.title}</h3>
                <p className="service-desc">{s.desc}</p>
                <ul className="service-list">
                  {s.features.map((f, i) => (
                    <li key={i}>
                      <i className="ri-checkbox-circle-line"></i> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <a href="#contact" className="service-link">
                Explore Capabilities <i className="ri-arrow-right-line"></i>
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
