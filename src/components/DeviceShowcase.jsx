import React from 'react';

export default function DeviceShowcase() {
  return (
    <section id="showcase" className="section-padding">
      <div className="container">
        
        <div className="section-header">
          <div className="section-tag">
            <span className="section-tag-dot"></span> LIVE SHOWCASE
          </div>
          <h2 className="section-title">
            See our <span className="serif-italic">craftsmanship in action.</span>
          </h2>
          <p className="section-subtitle">
            Experience how our desktop web apps and mobile interfaces feel in real-time. Sub-second speed and clean editorial details.
          </p>
        </div>

        <div className="showcase-grid">
          <style>{`
            .showcase-grid {
              display: grid;
              grid-template-columns: 1.2fr 0.8fr;
              gap: 28px;
              align-items: stretch;
            }
            @media (max-width: 992px) {
              .showcase-grid {
                grid-template-columns: 1fr;
              }
            }
            .macbook-window {
              background: #ffffff;
              border: 1px solid var(--border-color);
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
            }
            .macbook-bar {
              background: #f0ece1;
              padding: 10px 14px;
              display: flex;
              align-items: center;
              gap: 10px;
              border-bottom: 1px solid var(--border-color);
              overflow: hidden;
            }
            .macbook-dots {
              display: flex;
              gap: 6px;
              flex-shrink: 0;
            }
            .macbook-dot {
              width: 9px;
              height: 9px;
              border-radius: 50%;
            }
            .macbook-url {
              background: #ffffff;
              padding: 4px 14px;
              border-radius: 9999px;
              font-family: var(--font-mono);
              font-size: 0.75rem;
              color: var(--text-muted);
              flex: 1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              min-width: 0;
            }
            .macbook-body {
              padding: 20px;
            }

            .iphone-frame {
              background: #f9f7f2;
              border: 6px solid #dcd7ca;
              border-radius: 32px;
              padding: 16px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
              position: relative;
              min-height: 440px;
              overflow: hidden;
            }
            .iphone-island {
              width: 80px;
              height: 18px;
              background: #18181b;
              border-radius: 20px;
              margin: 0 auto 16px auto;
            }
            .notif-card {
              background: #ffffff;
              border: 1px solid var(--border-color);
              border-radius: 12px;
              padding: 12px 14px;
              margin-bottom: 10px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
            }

            /* Mobile view overrides */
            @media (max-width: 600px) {
              .macbook-body {
                padding: 12px;
              }
              .iphone-frame {
                padding: 12px 10px;
                border-width: 4px;
                border-radius: 20px;
                min-height: auto;
              }
              .showcase-grid-inner {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>

          {/* Desktop MacBook Demo */}
          <div className="glass-card" style={{ padding: '24px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span className="badge badge-cyan">DESKTOP APP</span>
                <h3 style={{ fontSize: '1.2rem', marginTop: '6px', fontWeight: '700', fontFamily: 'var(--font-serif)' }}>Luxury Booking & CRM Demo</h3>
              </div>
              <span className="badge badge-emerald">99 LIGHTHOUSE</span>
            </div>

            <div className="macbook-window">
              <div className="macbook-bar">
                <div className="macbook-dots">
                  <span className="macbook-dot" style={{ background: '#ef4444' }}></span>
                  <span className="macbook-dot" style={{ background: '#f59e0b' }}></span>
                  <span className="macbook-dot" style={{ background: '#10b981' }}></span>
                </div>
                <div className="macbook-url">https://nandhakam.klappdevelopers.in</div>
              </div>

              <div className="macbook-body">
                <div style={{ background: '#f4f1ea', padding: '16px', borderRadius: '10px', marginBottom: '14px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: '600', color: 'var(--text-primary)' }}>Nandhakam Luxury Stays</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Realtime Availability Matrix</div>
                </div>

                <div className="showcase-grid-inner" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ background: '#faf8f5', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Executive Suites</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#15803d', marginTop: '2px' }}>Available (8)</div>
                  </div>
                  <div style={{ background: '#faf8f5', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>WhatsApp Webhook</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#4338ca', marginTop: '2px' }}>Connected</div>
                  </div>
                </div>

                <div style={{ background: '#faf8f5', padding: '14px', borderRadius: '8px', border: '1px dashed var(--border-color)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  <i className="ri-pulse-line" style={{ fontSize: '1.3rem', color: 'var(--accent-dot)', display: 'block', marginBottom: '4px' }}></i>
                  [ Real-time Dynamic Calendar & WhatsApp Booking Feed Operational ]
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Phone Demo */}
          <div className="glass-card" style={{ padding: '24px', overflow: 'hidden' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <span className="badge badge-purple">MOBILE APP & BOT FEED</span>
              <h3 style={{ fontSize: '1.2rem', marginTop: '6px', fontWeight: '700', fontFamily: 'var(--font-serif)' }}>Push Notification Feed</h3>
            </div>

            <div className="iphone-frame">
              <div className="iphone-island"></div>

              <div className="notif-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', gap: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#15803d' }}>
                    <i className="ri-whatsapp-fill"></i> WhatsApp Cloud API
                  </span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Just now</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>New Booking Confirmation sent to Client #84109</div>
              </div>

              <div className="notif-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', gap: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1e40af' }}>
                    <i className="ri-robot-line"></i> KLAPP AI Agent
                  </span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>2m ago</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>Automated PDF invoice parsed & synced to PostgreSQL.</div>
              </div>

              <div className="notif-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', gap: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#b91c1c' }}>
                    <i className="ri-shield-check-line"></i> AWS Cloud Monitor
                  </span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>12m ago</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>System health 100%. Uptime SLA 99.99%.</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
