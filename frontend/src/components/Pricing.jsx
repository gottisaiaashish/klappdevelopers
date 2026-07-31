import React, { useState, useEffect } from 'react';

const KLAPP_PLANS = [
  {
    id: 'launch',
    num: '01',
    badge: 'STARTUP EDITION',
    badgeClass: 'badge-launch',
    title: 'Launch Architecture',
    serifSub: 'Built for velocity.',
    subtitle: 'High-converting, ultra-fast web presence engineered to establish instant brand authority and turn visitors into qualified leads.',
    price: 'Starting at ₹29,999',
    monthly: '₹1,999/mo retainer',
    bestFor: 'Startups, Local Services, Clinics, Consultants & Personal Brands',
    timeline: '5 - 7 Business Days',
    included: [
      'Custom High-Performance Web Application',
      'Mobile & Tablet Dynamic Responsive Design',
      'SEO-Ready Architecture & Schema Markup',
      'One-Click Instant WhatsApp Inquiry Funnel',
      'High-Converting Contact & Lead Capture Forms',
      'Bank-Grade 256-Bit SSL Security Encryption',
      '95+ Google Lighthouse Speed Optimization',
      '30-Day Post-Launch Technical Warranty'
    ],
    monthlySupport: [
      '24/7 Website Health & Uptime Monitoring',
      'Security Patches & SSL Renewal Maintenance',
      'Weekly Automated Cloud Database Backups',
      'Minor Content, Copy & Image Updates',
      'Core Framework & Security Dependencies Updates',
      'Priority Email & WhatsApp Technical Support'
    ],
    techStack: ['React 18', 'Vite', 'Vanilla CSS', 'Vercel / Cloudflare CDN']
  },
  {
    id: 'scale',
    num: '02',
    badge: 'MOST POPULAR',
    badgeClass: 'badge-popular',
    isFeatured: true,
    title: 'Scale & Automation Engine',
    serifSub: 'Engineered to scale.',
    subtitle: 'Automate lead qualification, instant response times, and customer data sync so your sales team only speaks to ready buyers.',
    price: 'Starting at ₹59,999',
    monthly: '₹4,999/mo retainer',
    bestFor: 'E-commerce, Real Estate, Clinics, Gyms & High-Volume Lead Businesses',
    timeline: '10 - 14 Business Days',
    included: [
      'Everything in Launch Architecture plus:',
      'Custom Business AI Chatbot (RAG Memory Engine)',
      'Official Meta WhatsApp Cloud API Bot',
      'Live PostgreSQL / Supabase CRM Data Sync',
      'Google Sheets Automated Lead Dispatch',
      'Real-Time Lead Tracking Analytics Dashboard',
      'Advanced Multi-Step Qualification Funnels',
      'Custom Webhook & Zapier Automation Pipelines'
    ],
    monthlySupport: [
      'AI Knowledge Base Fine-Tuning & Prompt Ops',
      'WhatsApp API Token & Webhook Maintenance',
      'Database Health Audits & Query Indexing',
      'Monthly Conversion & Analytics Performance Report',
      'Continuous Minor Feature Additions',
      'Priority SLA Support (WhatsApp + Direct Phone)'
    ],
    techStack: ['React 18', 'Google Gemini AI', 'Meta WhatsApp Cloud API', 'PostgreSQL', 'Node.js']
  },
  {
    id: 'enterprise',
    num: '03',
    badge: 'ENTERPRISE',
    badgeClass: 'badge-enterprise',
    title: 'Enterprise Systems',
    serifSub: 'Custom infrastructure.',
    subtitle: 'Bespoke business software, autonomous AI agent pipelines, mobile applications, and high-availability cloud systems.',
    price: 'Custom Quote',
    monthly: 'From ₹9,999/mo retainer',
    bestFor: 'Enterprise Brands, SaaS Startups, Multi-Location Chains & Large Organizations',
    timeline: 'Custom Scoped (2 - 6 Weeks)',
    included: [
      'Full Business Custom ERP & Operations Systems',
      'Autonomous Multi-Agent AI Pipelines',
      'Cross-Platform iOS & Android Mobile Apps',
      'High-Availability AWS / GCP Cloud DevOps',
      'Custom Enterprise REST & GraphQL APIs',
      'Multi-Tenant Executive Admin Dashboards',
      'Dedicated Senior Software Architect',
      'Custom RBAC Security & Legacy Integrations'
    ],
    monthlySupport: [
      '24/7 SLA Guarantee (99.99% Uptime Commitment)',
      'Cloud Server Infrastructure & Cost Optimization',
      'Continuous Penetration Testing & Security Audits',
      'Dedicated Account Engineer & Immediate Hotfixes',
      'Unlimited Architecture & Scalability Guidance',
      'Continuous System Feature Upgrades'
    ],
    techStack: ['React / Next.js', 'React Native', 'Python / Node.js', 'AWS Cloud', 'PostgreSQL / Redis']
  }
];

export default function Pricing({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const contentMarkup = (
    <div className="container" style={{ maxWidth: '980px', paddingBottom: '90px' }}>
      
      <div className="section-header" style={{ marginBottom: '56px', marginTop: isOpen ? '40px' : '0' }}>
        <div className="section-tag">
          <span className="section-tag-dot"></span> TRANSPARENT AGENCY INVESTMENTS
        </div>
        <h2 className="section-title">
          Architectural <span className="serif-italic">Investment Plans.</span>
        </h2>
        <p className="section-subtitle">
          Predictable, transparent agency pricing for startups, scaling companies, and enterprise systems. No hidden costs.
        </p>
      </div>

      <style>{`
        .pricing-fullscreen-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100dvh;
          background: var(--bg-primary, #f4f1ea);
          z-index: 99998;
          overflow-y: auto;
          animation: pageSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .pricing-page-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(244, 241, 234, 0.94);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          padding: 16px 0;
        }

        .klapp-plan-list {
          display: flex;
          flex-direction: column;
          gap: 36px;
        }

        .klapp-plan-card {
          background: var(--bg-card, #f9f7f2);
          border: 1px solid var(--border-color, rgba(0,0,0,0.08));
          border-radius: 20px;
          padding: 38px 34px;
          position: relative;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }

        .klapp-plan-card:hover {
          box-shadow: 0 16px 45px rgba(0,0,0,0.06);
          border-color: rgba(0, 0, 0, 0.18);
        }

        .klapp-plan-card.featured {
          background: #ffffff;
          border: 2px solid #18181b;
          box-shadow: 0 16px 48px rgba(0,0,0,0.08);
        }

        .plan-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .plan-num-indicator {
          font-family: var(--font-sans);
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: var(--text-muted);
        }

        .plan-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 14px;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .badge-launch { background: rgba(24, 24, 27, 0.06); color: #18181b; }
        .badge-popular { background: #18181b; color: #ffffff; }
        .badge-enterprise { background: #064e3b; color: #ecfdf5; }

        .plan-header-title {
          font-family: var(--font-sans);
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          line-height: 1.2;
          display: flex;
          align-items: baseline;
          gap: 10px;
          flex-wrap: wrap;
        }

        .plan-serif-italic {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 400;
          color: var(--text-secondary);
          font-size: 1.6rem;
        }

        .plan-desc {
          color: var(--text-secondary);
          font-size: 0.92rem;
          line-height: 1.55;
          margin-top: 6px;
          margin-bottom: 28px;
          max-width: 820px;
        }

        .plan-split-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-bottom: 32px;
          padding-top: 24px;
          border-top: 1px solid rgba(0,0,0,0.08);
        }

        .plan-column-header {
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .plan-feature-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .plan-feature-list li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: var(--text-primary);
          font-size: 0.88rem;
          line-height: 1.4;
        }

        .plan-feature-list i {
          color: var(--text-primary);
          font-size: 1.05rem;
          margin-top: 1px;
          flex-shrink: 0;
        }

        .support-inset-card {
          background: rgba(0, 0, 0, 0.025);
          border: 1px dashed rgba(0, 0, 0, 0.12);
          border-radius: 16px;
          padding: 20px 22px;
        }

        .klapp-plan-card.featured .support-inset-card {
          background: rgba(24, 24, 27, 0.03);
          border-color: rgba(24, 24, 27, 0.2);
        }

        .plan-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 28px;
          border-top: 1px solid rgba(0,0,0,0.08);
          gap: 20px;
          flex-wrap: wrap;
        }

        .plan-price-text {
          font-family: var(--font-sans);
          font-size: 2.1rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          line-height: 1;
        }

        .plan-retainer-text {
          font-size: 0.84rem;
          color: var(--text-secondary);
          margin-top: 4px;
          font-weight: 600;
        }

        .plan-target-audience {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-top: 10px;
        }

        .klapp-disclaimer-note {
          margin-top: 48px;
          padding: 20px 24px;
          background: rgba(0, 0, 0, 0.02);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 14px;
          text-align: center;
          color: var(--text-secondary);
          font-size: 0.86rem;
          line-height: 1.6;
        }

        @keyframes pageSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .klapp-plan-card {
            padding: 28px 20px;
          }
          .plan-header-title {
            font-size: 1.6rem;
          }
          .plan-serif-italic {
            font-size: 1.3rem;
          }
          .plan-split-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .plan-footer-row {
            flex-direction: column;
            align-items: stretch;
          }
          .plan-price-text {
            font-size: 1.8rem;
          }
        }
      `}</style>

      <div className="klapp-plan-list">
        {KLAPP_PLANS.map((plan) => (
          <div key={plan.id} className={`klapp-plan-card ${plan.isFeatured ? 'featured' : ''}`}>
            
            <div className="plan-top-row">
              <span className="plan-num-indicator">PLAN {plan.num} / 03</span>
              <span className={`plan-badge ${plan.badgeClass}`}>{plan.badge}</span>
            </div>

            <h3 className="plan-header-title">
              {plan.title} <span className="plan-serif-italic">{plan.serifSub}</span>
            </h3>
            <p className="plan-desc">{plan.subtitle}</p>

            <div className="plan-split-grid">
              
              <div>
                <div className="plan-column-header">
                  <i className="ri-checkbox-circle-line" style={{ fontSize: '0.9rem' }}></i> CORE BUILD DELIVERABLES
                </div>
                <ul className="plan-feature-list">
                  {plan.included.map((item, idx) => (
                    <li key={idx}>
                      <i className="ri-checkbox-circle-fill"></i>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="support-inset-card">
                <div className="plan-column-header" style={{ color: 'var(--text-primary)' }}>
                  <i className="ri-shield-check-line" style={{ fontSize: '0.9rem' }}></i> MONTHLY SUPPORT RETAINER ({plan.monthly})
                </div>
                <ul className="plan-feature-list">
                  {plan.monthlySupport.map((sup, idx) => (
                    <li key={idx}>
                      <i className="ri-shield-check-fill" style={{ color: 'var(--text-primary)' }}></i>
                      <span>{sup}</span>
                    </li>
                  ))}
                </ul>
                
                <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px dashed rgba(0,0,0,0.1)' }}>
                  <div className="plan-column-header" style={{ marginBottom: '4px' }}>ESTIMATED TIMELINE</div>
                  <div style={{ fontSize: '0.86rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                    <i className="ri-time-line" style={{ marginRight: '6px' }}></i>{plan.timeline}
                  </div>
                </div>
              </div>

            </div>

            <div className="plan-footer-row">
              <div>
                <div className="plan-price-text">{plan.price}</div>
                <div className="plan-retainer-text">{plan.monthly} (optional retainer)</div>
                <div className="plan-target-audience">
                  <i className="ri-compass-3-line" style={{ marginRight: '4px' }}></i>{plan.bestFor}
                </div>
              </div>

              <a 
                href="#contact" 
                className={`btn ${plan.isFeatured ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '14px 28px', whiteSpace: 'nowrap', textAlign: 'center' }}
                onClick={() => {
                  if (isOpen && onClose) onClose();
                }}
              >
                Select {plan.title} <i className="ri-arrow-right-line" style={{ marginLeft: '6px' }}></i>
              </a>
            </div>

          </div>
        ))}
      </div>

      <div className="klapp-disclaimer-note">
        <i className="ri-information-line" style={{ marginRight: '6px', color: 'var(--text-primary)' }}></i>
        All plans include consultation, deployment assistance, and technical guidance. Hosting, domain, APIs, and Meta/WhatsApp Cloud API charges (if applicable) are billed separately.
      </div>

    </div>
  );

  if (isOpen) {
    return (
      <div className="pricing-fullscreen-overlay">
        <div className="pricing-page-header">
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '980px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontWeight: '800', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '1rem' }}>
                KLAPP DEVELOPERS
              </span>
              <span className="plan-badge badge-launch" style={{ margin: 0 }}>PRICING DIRECTORY</span>
            </div>

            <button 
              className="btn btn-secondary" 
              onClick={onClose}
              style={{ padding: '8px 18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <i className="ri-arrow-left-line"></i> Back to Main Site
            </button>
          </div>
        </div>

        {contentMarkup}
      </div>
    );
  }

  return (
    <section id="pricing" className="section-padding" style={{ position: 'relative' }}>
      {contentMarkup}
    </section>
  );
}
