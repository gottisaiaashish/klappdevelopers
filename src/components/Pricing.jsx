import React, { useState } from 'react';

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  const priceBasic = annual ? '₹23,999' : '₹29,999';
  const priceProf = annual ? '₹47,999' : '₹59,999';
  const priceEnterprise = annual ? '₹95,999' : '₹1,19,999';

  return (
    <section id="pricing" className="section-padding">
      <div className="container">
        
        <div className="section-header">
          <div className="section-tag">
            <span className="section-tag-dot"></span> TRANSPARENT INVESTMENTS
          </div>
          <h2 className="section-title">
            Simple & <span className="serif-italic">predictable pricing.</span>
          </h2>
          <p className="section-subtitle">
            Choose a plan tailored for your business scale or contact us for custom enterprise architecture.
          </p>
        </div>

        {/* Pricing Toggle Switch */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '44px' }}>
          <span style={{ fontWeight: '500', color: annual ? 'var(--text-muted)' : 'var(--text-primary)', fontSize: '0.9rem' }}>One-Time Project</span>
          
          <button 
            onClick={() => setAnnual(!annual)}
            style={{
              width: '52px',
              height: '28px',
              borderRadius: '9999px',
              background: annual ? '#18181b' : '#d8d3c7',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.2s ease',
              padding: '3px'
            }}
          >
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: '#ffffff',
              transform: annual ? 'translateX(24px)' : 'translateX(0px)',
              transition: 'transform 0.2s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
            }}></div>
          </button>

          <span style={{ fontWeight: '500', color: annual ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Annual Retainer <span className="badge badge-purple">Save 20%</span>
          </span>
        </div>

        {/* Pricing Grid */}
        <div className="pricing-grid">
          <style>{`
            .pricing-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 24px;
              align-items: stretch;
            }
            .price-val {
              font-family: var(--font-serif);
              font-size: 2.6rem;
              font-weight: 400;
              color: var(--text-primary);
              margin: 14px 0;
            }
            .pricing-list {
              list-style: none;
              margin-bottom: 28px;
            }
            .pricing-list li {
              display: flex;
              align-items: center;
              gap: 8px;
              color: var(--text-secondary);
              font-size: 0.88rem;
              margin-bottom: 10px;
            }
            .pricing-list i {
              color: var(--accent-dot);
            }
          `}</style>

          {/* Basic Plan */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="badge badge-cyan">STARTUP EDITION</span>
              <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginTop: '10px' }}>Basic Web</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '2px' }}>Ideal for new businesses needing a high-converting website.</p>
              <div className="price-val">{priceBasic}</div>

              <ul className="pricing-list">
                <li><i className="ri-checkbox-circle-fill"></i> Custom High-Performance Web App</li>
                <li><i className="ri-checkbox-circle-fill"></i> Mobile & Tablet Responsive Layout</li>
                <li><i className="ri-checkbox-circle-fill"></i> 99+ Lighthouse Speed Optimization</li>
                <li><i className="ri-checkbox-circle-fill"></i> Basic WhatsApp Contact Integration</li>
                <li><i className="ri-checkbox-circle-fill"></i> SEO Ready & SSL Configuration</li>
              </ul>
            </div>
            <a href="#contact" className="btn btn-secondary" style={{ width: '100%', padding: '12px' }}>Select Basic</a>
          </div>

          {/* Featured Plan */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderColor: '#18181b', background: '#ffffff' }}>
            <div>
              <span className="badge" style={{ background: '#18181b', color: '#ffffff' }}>MOST POPULAR</span>
              <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginTop: '10px' }}>Professional Suite</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '2px' }}>For growing companies needing AI automation & WhatsApp CRM.</p>
              <div className="price-val">{priceProf}</div>

              <ul className="pricing-list">
                <li><i className="ri-checkbox-circle-fill"></i> Everything in Basic Web</li>
                <li><i className="ri-checkbox-circle-fill"></i> Official WhatsApp Cloud API Bot</li>
                <li><i className="ri-checkbox-circle-fill"></i> Custom AI Chatbot / RAG Agent</li>
                <li><i className="ri-checkbox-circle-fill"></i> Google Sheets & PostgreSQL Sync</li>
                <li><i className="ri-checkbox-circle-fill"></i> Editorial Fluid Animations</li>
                <li><i className="ri-checkbox-circle-fill"></i> 3 Months Priority SLA Support</li>
              </ul>
            </div>
            <a href="#contact" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>Get Professional</a>
          </div>

          {/* Enterprise Plan */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="badge badge-emerald">ENTERPRISE EDITION</span>
              <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginTop: '10px' }}>Custom Enterprise</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '2px' }}>Complete digital transformation, custom ERP & cloud infra.</p>
              <div className="price-val">{priceEnterprise}</div>

              <ul className="pricing-list">
                <li><i className="ri-checkbox-circle-fill"></i> Full Business ERP / Custom Software</li>
                <li><i className="ri-checkbox-circle-fill"></i> Multi-Agent Autonomous AI Pipeline</li>
                <li><i className="ri-checkbox-circle-fill"></i> High-Availability AWS Cloud Deploy</li>
                <li><i className="ri-checkbox-circle-fill"></i> Cross-Platform iOS & Android Mobile Apps</li>
                <li><i className="ri-checkbox-circle-fill"></i> Dedicated Senior Engineer & 24/7 SLA</li>
              </ul>
            </div>
            <a href="#contact" className="btn btn-secondary" style={{ width: '100%', padding: '12px' }}>Contact Enterprise</a>
          </div>

        </div>

      </div>
    </section>
  );
}
