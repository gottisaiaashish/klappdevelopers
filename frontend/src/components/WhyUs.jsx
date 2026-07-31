import React from 'react';

const advantages = [
  {
    icon: 'ri-rocket-2-line',
    title: 'Fast Delivery',
    desc: 'Rapid 7 to 14-day turnaround times powered by our modular component libraries and automated cloud CI/CD pipelines.'
  },
  {
    icon: 'ri-palette-line',
    title: 'Editorial Visual Design',
    desc: 'High-contrast serif typography, warm minimal aesthetics, fluid interactions, and visual craftsmanship that stuns your visitors.'
  },
  {
    icon: 'ri-line-chart-line',
    title: 'Scalable Architecture',
    desc: 'Clean modular codebase built to scale effortlessly from hundreds of users to millions without performance degradation.'
  },
  {
    icon: 'ri-shield-keyhole-line',
    title: 'Bank-Grade Security',
    desc: 'Encrypted API keys, strict CORS policies, token authentication, and full compliance with modern web privacy standards.'
  },
  {
    icon: 'ri-cpu-line',
    title: 'AI Native Integration',
    desc: 'Built-in AI capabilities in every product—from intelligent document processing to automated customer acquisition.'
  },
  {
    icon: 'ri-customer-service-2-line',
    title: '24/7 Dedicated SLA',
    desc: 'Direct access to senior engineering team via WhatsApp and dedicated Slack channels with instant resolution SLA.'
  }
];

export default function WhyUs() {
  return (
    <section className="section-padding">
      <div className="container">
        
        <div className="section-header">
          <div className="section-tag">
            <span className="section-tag-dot"></span> THE KLAPP ADVANTAGE
          </div>
          <h2 className="section-title">
            Why industry leaders <span className="serif-italic">trust us.</span>
          </h2>
          <p className="section-subtitle">
            We combine deep technical software engineering with high-end editorial visual design to deliver solutions that drive real revenue.
          </p>
        </div>

        <div className="why-grid">
          <style>{`
            .why-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 24px;
            }
            .why-icon {
              font-size: 1.8rem;
              margin-bottom: 14px;
              color: var(--text-primary);
            }
            .why-title {
              font-family: var(--font-serif);
              font-weight: 400;
              font-size: 1.45rem;
              color: var(--text-primary);
              margin-bottom: 8px;
            }
          `}</style>

          {advantages.map((item, idx) => (
            <div key={idx} className="glass-card">
              <div className="why-icon">
                <i className={item.icon}></i>
              </div>
              <h3 className="why-title">{item.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
