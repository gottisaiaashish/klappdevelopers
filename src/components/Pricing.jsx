import React from 'react';

export default function Pricing() {
  return (
    <section id="pricing" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header" style={{ marginBottom: '56px' }}>
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

        {/* Custom CSS for Pricing Section */}
        <style>{`
          .pricing-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 28px;
            align-items: stretch;
          }

          .pricing-card {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background: var(--bg-card, #f9f7f2);
            border: 1px solid var(--border-color, rgba(0,0,0,0.08));
            border-radius: 20px;
            padding: 32px 28px;
            position: relative;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          }

          .pricing-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 16px 40px rgba(0,0,0,0.06);
            border-color: rgba(0, 0, 0, 0.18);
          }

          .pricing-card.featured {
            background: #ffffff;
            border: 2px solid #18181b;
            box-shadow: 0 12px 36px rgba(0,0,0,0.08);
          }

          .pricing-badge {
            display: inline-flex;
            align-items: center;
            padding: 4px 12px;
            border-radius: 999px;
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            margin-bottom: 16px;
            width: fit-content;
          }

          .badge-launch {
            background: rgba(24, 24, 27, 0.06);
            color: #18181b;
          }

          .badge-popular {
            background: #18181b;
            color: #ffffff;
          }

          .badge-enterprise {
            background: #064e3b;
            color: #ecfdf5;
          }

          .plan-title {
            font-family: var(--font-serif);
            font-size: 1.85rem;
            font-weight: 400;
            color: var(--text-primary);
            margin-bottom: 6px;
          }

          .plan-subtitle {
            color: var(--text-muted);
            font-size: 0.86rem;
            line-height: 1.5;
            min-height: 42px;
          }

          .price-block {
            margin: 22px 0 26px 0;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(0,0,0,0.08);
          }

          .main-price {
            font-family: var(--font-serif);
            font-size: 2.5rem;
            font-weight: 500;
            color: var(--text-primary);
            line-height: 1.1;
            letter-spacing: -0.02em;
          }

          .monthly-subprice {
            display: inline-block;
            margin-top: 8px;
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--text-secondary);
            background: rgba(0,0,0,0.04);
            padding: 4px 10px;
            border-radius: 6px;
          }

          .pricing-card.featured .monthly-subprice {
            background: rgba(24, 24, 27, 0.07);
            color: #18181b;
          }

          .feature-section-title {
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--text-muted);
            margin-bottom: 14px;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .feature-list {
            list-style: none;
            padding: 0;
            margin: 0 0 24px 0;
          }

          .feature-list li {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            color: var(--text-secondary);
            font-size: 0.88rem;
            margin-bottom: 10px;
            line-height: 1.4;
          }

          .feature-list i {
            color: var(--text-primary);
            font-size: 1.05rem;
            margin-top: 1px;
            flex-shrink: 0;
          }

          .monthly-support-box {
            background: rgba(0, 0, 0, 0.025);
            border: 1px dashed rgba(0, 0, 0, 0.12);
            border-radius: 12px;
            padding: 18px 16px;
            margin-top: 10px;
            margin-bottom: 28px;
          }

          .pricing-card.featured .monthly-support-box {
            background: rgba(24, 24, 27, 0.03);
            border-color: rgba(24, 24, 27, 0.2);
          }

          .pricing-note {
            margin-top: 48px;
            padding: 20px 24px;
            background: rgba(0, 0, 0, 0.02);
            border: 1px solid rgba(0, 0, 0, 0.08);
            border-radius: 14px;
            text-align: center;
            color: var(--text-secondary);
            font-size: 0.86rem;
            line-height: 1.6;
            max-width: 960px;
            margin-left: auto;
            margin-right: auto;
          }

          @media (max-width: 768px) {
            .pricing-grid {
              grid-template-columns: 1fr;
            }
            .pricing-card {
              padding: 26px 20px;
            }
            .plan-subtitle {
              min-height: auto;
            }
            .main-price {
              font-size: 2.2rem;
            }
          }
        `}</style>

        {/* Pricing Grid */}
        <div className="pricing-grid">
          
          {/* PLAN 1: Launch */}
          <div className="pricing-card">
            <div>
              <span className="pricing-badge badge-launch">STARTUP EDITION</span>
              <h3 className="plan-title">Launch</h3>
              <p className="plan-subtitle">
                Perfect for startups and small businesses looking for a premium online presence.
              </p>

              <div className="price-block">
                <div className="main-price">Starting at ₹29,999</div>
                <div className="monthly-subprice">Retainer: ₹1,999/month</div>
              </div>

              {/* One-Time Includes */}
              <div className="feature-section-title">ONE-TIME BUILD INCLUDES</div>
              <ul className="feature-list">
                <li><i className="ri-checkbox-circle-fill"></i> Premium Business Website</li>
                <li><i className="ri-checkbox-circle-fill"></i> Mobile Responsive Design</li>
                <li><i className="ri-checkbox-circle-fill"></i> SEO Ready Structure</li>
                <li><i className="ri-checkbox-circle-fill"></i> WhatsApp Integration</li>
                <li><i className="ri-checkbox-circle-fill"></i> Contact Forms</li>
                <li><i className="ri-checkbox-circle-fill"></i> SSL Security</li>
                <li><i className="ri-checkbox-circle-fill"></i> Performance Optimization</li>
                <li><i className="ri-checkbox-circle-fill"></i> 30 Days Free Support</li>
              </ul>

              {/* Monthly Support Box */}
              <div className="monthly-support-box">
                <div className="feature-section-title" style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>
                  <i className="ri-shield-check-line" style={{ fontSize: '0.9rem' }}></i> MONTHLY SUPPORT (₹1,999/MO)
                </div>
                <ul className="feature-list" style={{ margin: 0 }}>
                  <li><i className="ri-check-line"></i> Website Monitoring</li>
                  <li><i className="ri-check-line"></i> Security Updates</li>
                  <li><i className="ri-check-line"></i> Bug Fixes</li>
                  <li><i className="ri-check-line"></i> Weekly Backups</li>
                  <li><i className="ri-check-line"></i> Minor Content Updates</li>
                  <li><i className="ri-check-line"></i> Email Support</li>
                </ul>
              </div>
            </div>

            <a href="#contact" className="btn btn-secondary" style={{ width: '100%', padding: '14px', textAlign: 'center' }}>
              Select Launch Plan
            </a>
          </div>

          {/* PLAN 2: Scale (MOST POPULAR) */}
          <div className="pricing-card featured">
            <div>
              <span className="pricing-badge badge-popular">MOST POPULAR</span>
              <h3 className="plan-title">Scale</h3>
              <p className="plan-subtitle">
                For growing businesses ready to automate and scale operations.
              </p>

              <div className="price-block">
                <div className="main-price">Starting at ₹59,999</div>
                <div className="monthly-subprice">Retainer: ₹4,999/month</div>
              </div>

              {/* One-Time Includes */}
              <div className="feature-section-title">ONE-TIME BUILD INCLUDES</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px', fontStyle: 'italic' }}>
                Everything in Launch plus:
              </p>
              <ul className="feature-list">
                <li><i className="ri-checkbox-circle-fill"></i> AI Chatbot</li>
                <li><i className="ri-checkbox-circle-fill"></i> WhatsApp Automation</li>
                <li><i className="ri-checkbox-circle-fill"></i> CRM Integration</li>
                <li><i className="ri-checkbox-circle-fill"></i> Database Integration</li>
                <li><i className="ri-checkbox-circle-fill"></i> Google Sheets Sync</li>
                <li><i className="ri-checkbox-circle-fill"></i> Analytics Dashboard</li>
                <li><i className="ri-checkbox-circle-fill"></i> Advanced Forms</li>
                <li><i className="ri-checkbox-circle-fill"></i> Automation Workflows</li>
              </ul>

              {/* Monthly Support Box */}
              <div className="monthly-support-box">
                <div className="feature-section-title" style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>
                  <i className="ri-shield-check-line" style={{ fontSize: '0.9rem' }}></i> MONTHLY SUPPORT (₹4,999/MO)
                </div>
                <ul className="feature-list" style={{ margin: 0 }}>
                  <li><i className="ri-check-line"></i> AI Monitoring</li>
                  <li><i className="ri-check-line"></i> WhatsApp API Maintenance</li>
                  <li><i className="ri-check-line"></i> Feature Enhancements</li>
                  <li><i className="ri-check-line"></i> Priority Support</li>
                  <li><i className="ri-check-line"></i> Monthly Performance Reports</li>
                  <li><i className="ri-check-line"></i> Database Maintenance</li>
                  <li><i className="ri-check-line"></i> Speed Optimization</li>
                </ul>
              </div>
            </div>

            <a href="#contact" className="btn btn-primary" style={{ width: '100%', padding: '14px', textAlign: 'center' }}>
              Get Scale Plan
            </a>
          </div>

          {/* PLAN 3: Enterprise */}
          <div className="pricing-card">
            <div>
              <span className="pricing-badge badge-enterprise">ENTERPRISE</span>
              <h3 className="plan-title">Enterprise</h3>
              <p className="plan-subtitle">
                Custom software, AI systems, ERP solutions and enterprise infrastructure.
              </p>

              <div className="price-block">
                <div className="main-price">Custom Quote</div>
                <div className="monthly-subprice">Starting from ₹9,999/month</div>
              </div>

              {/* Enterprise Capabilities */}
              <div className="feature-section-title">FULL ENTERPRISE CAPABILITIES</div>
              <ul className="feature-list">
                <li><i className="ri-checkbox-circle-fill"></i> Custom ERP Systems</li>
                <li><i className="ri-checkbox-circle-fill"></i> AI Autonomous Agents</li>
                <li><i className="ri-checkbox-circle-fill"></i> Mobile Applications (iOS & Android)</li>
                <li><i className="ri-checkbox-circle-fill"></i> Cloud Infrastructure & DevOps</li>
                <li><i className="ri-checkbox-circle-fill"></i> Enterprise APIs & Integrations</li>
                <li><i className="ri-checkbox-circle-fill"></i> Custom Admin Dashboards</li>
                <li><i className="ri-checkbox-circle-fill"></i> Dedicated Development Team</li>
              </ul>

              {/* Monthly Support Box */}
              <div className="monthly-support-box">
                <div className="feature-section-title" style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>
                  <i className="ri-shield-check-line" style={{ fontSize: '0.9rem' }}></i> MONTHLY SUPPORT (FROM ₹9,999/MO)
                </div>
                <ul className="feature-list" style={{ margin: 0 }}>
                  <li><i className="ri-check-line"></i> 24/7 Priority SLA Support</li>
                  <li><i className="ri-check-line"></i> Server & Cloud Monitoring</li>
                  <li><i className="ri-check-line"></i> Database Optimization</li>
                  <li><i className="ri-check-line"></i> Continuous Feature Improvements</li>
                </ul>
              </div>
            </div>

            <a href="#contact" className="btn btn-secondary" style={{ width: '100%', padding: '14px', textAlign: 'center' }}>
              Contact Enterprise
            </a>
          </div>

        </div>

        {/* Premium Disclaimer Note */}
        <div className="pricing-note">
          <i className="ri-information-line" style={{ marginRight: '6px', color: 'var(--text-primary)' }}></i>
          All plans include consultation, deployment assistance, and technical guidance. Hosting, domain, APIs, and Meta/WhatsApp Cloud API charges (if applicable) are billed separately.
        </div>

      </div>
    </section>
  );
}

