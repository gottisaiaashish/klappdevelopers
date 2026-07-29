import React from 'react';

const steps = [
  { num: '01', title: 'Discovery', desc: 'Scope & requirements analysis' },
  { num: '02', title: 'Design', desc: 'Luxury Figma UI/UX mockups' },
  { num: '03', title: 'Development', desc: 'Agile full-stack engineering' },
  { num: '04', title: 'Testing', desc: 'QA & speed optimization' },
  { num: '05', title: 'Deployment', desc: 'AWS / Cloud production release' },
  { num: '06', title: 'Support', desc: '24/7 Monitoring & maintenance' }
];

export default function Process() {
  return (
    <section className="section-padding">
      <div className="container">
        
        <div className="section-header">
          <div className="section-tag">
            <span className="section-tag-dot"></span> OUR METHODOLOGY
          </div>
          <h2 className="section-title">
            The <span className="serif-italic">6-step execution</span> process.
          </h2>
          <p className="section-subtitle">
            A seamless transparent roadmap from initial discovery call to live production deployment.
          </p>
        </div>

        <div className="process-grid">
          <style>{`
            .process-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
              gap: 16px;
            }
            .step-card {
              position: relative;
              padding: 24px 16px;
              text-align: center;
            }
            .step-num {
              width: 36px;
              height: 36px;
              border-radius: 50%;
              background: #18181b;
              color: #ffffff;
              font-family: var(--font-mono);
              font-weight: 700;
              font-size: 0.95rem;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 14px auto;
            }
            .step-title {
              font-family: var(--font-serif);
              font-size: 1.35rem;
              color: var(--text-primary);
              margin-bottom: 4px;
            }
            .step-desc {
              font-size: 0.82rem;
              color: var(--text-secondary);
            }
          `}</style>

          {steps.map((s, idx) => (
            <div key={idx} className="glass-card step-card">
              <div className="step-num">{s.num}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
