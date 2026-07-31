import React from 'react';

const techItems = [
  { name: 'React / Next.js', icon: 'ri-reactjs-line' },
  { name: 'Vite Bundler', icon: 'ri-flashlight-line' },
  { name: 'Node.js', icon: 'ri-node-tree' },
  { name: 'JavaScript ES6+', icon: 'ri-javascript-fill' },
  { name: 'HTML5 & CSS3', icon: 'ri-html5-fill' },
  { name: 'PostgreSQL', icon: 'ri-database-fill' },
  { name: 'MongoDB', icon: 'ri-database-2-line' },
  { name: 'Firebase', icon: 'ri-firebase-fill' },
  { name: 'AWS Cloud', icon: 'ri-amazon-fill' },
  { name: 'OpenAI API', icon: 'ri-openai-fill' },
  { name: 'Gemini AI', icon: 'ri-sparkling-fill' },
  { name: 'WhatsApp Cloud API', icon: 'ri-whatsapp-fill' },
];

export default function TechStack() {
  return (
    <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        
        <div className="section-header">
          <div className="section-tag">
            <span className="section-tag-dot"></span> TECH STACK
          </div>
          <h2 className="section-title">
            Powered by <span className="serif-italic">next-gen tech.</span>
          </h2>
          <p className="section-subtitle">
            We build with cutting-edge languages, frameworks, AI vector models, and cloud databases to construct world-class software.
          </p>
        </div>

        <div className="tech-grid">
          <style>{`
            .tech-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
              gap: 16px;
            }
            .tech-card {
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 16px 20px;
              border-radius: 12px;
            }
            .tech-icon {
              font-size: 1.4rem;
              color: var(--text-primary);
            }
            .tech-name {
              font-weight: 500;
              font-size: 0.88rem;
              color: var(--text-primary);
            }
          `}</style>

          {techItems.map((t, idx) => (
            <div key={idx} className="glass-card tech-card">
              <i className={`tech-icon ${t.icon}`}></i>
              <span className="tech-name">{t.name}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
