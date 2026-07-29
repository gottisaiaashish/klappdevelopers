import React, { useState } from 'react';

const projects = [
  {
    id: 'nandhakam',
    category: 'web',
    title: 'Nandhakam Luxury Stays',
    badge: 'LUXURY RESORT & BOOKING',
    desc: 'High-converting online booking platform with WhatsApp instant confirmation & real-time inventory management.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    client: 'Nandhakam Hospitality Group',
    tech: 'React, Vite, WhatsApp Cloud API, PostgreSQL',
    details: 'Custom booking engine built for Nandhakam Resort. Integrated WhatsApp instant confirmation webhooks, sub-100ms availability matrix, and online booking workflows. Boosted direct bookings by 180% in the first 60 days.',
    metrics: [
      { label: 'Direct Bookings', val: '+180%' },
      { label: 'Page Speed', val: '99/100' },
      { label: 'Response Time', val: '< 50ms' }
    ]
  },
  {
    id: 'aiagent',
    category: 'ai',
    title: 'FinTech AI Support Agent',
    badge: 'ENTERPRISE AI AGENT',
    desc: 'Autonomous LLM customer agent reducing support ticket load by 68% with sub-second response times.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    client: 'FinTech Solutions Corp',
    tech: 'OpenAI GPT-4o, RAG Vector DB, Python, React',
    details: 'Enterprise autonomous customer support agent integrated with internal document vector store. Handles 85% of tier-1 support queries automatically with bank-grade security & compliance.',
    metrics: [
      { label: 'Ticket Deflection', val: '68%' },
      { label: 'Query Latency', val: '1.2s' },
      { label: 'Resolution Rate', val: '94.2%' }
    ]
  },
  {
    id: 'whatsappcrm',
    category: 'whatsapp',
    title: 'KLAPP WhatsApp Sales Bot',
    badge: 'WHATSAPP CRM SUITE',
    desc: 'Multi-choice automated lead qualification and payment link generator processing 250k+ messages.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    client: 'E-Commerce Brands Network',
    tech: 'WhatsApp Cloud API, Node.js, Google Sheets Sync',
    details: 'Automated interactive menu chatbot for lead acquisition, instant catalog sharing, and dynamic Razorpay payment link generation directly inside WhatsApp chat.',
    metrics: [
      { label: 'Messages Sent', val: '250k+' },
      { label: 'Conversion Rate', val: '4.8x' },
      { label: 'Setup Time', val: '5 Days' }
    ]
  }
];

export default function Portfolio() {
  const [filter, setFilter] = useState('all');
  const [activeProject, setActiveProject] = useState(null);

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section id="portfolio" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        
        <div className="section-header">
          <div className="section-tag">
            <span className="section-tag-dot"></span> SELECTED WORK
          </div>
          <h2 className="section-title">
            Engineered <span className="serif-italic">case studies.</span>
          </h2>
          <p className="section-subtitle">
            Explore real software solutions we have engineered for resorts, fintech platforms, and high-growth brands.
          </p>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '36px', flexWrap: 'wrap' }}>
          {['all', 'web', 'ai', 'whatsapp'].map(cat => (
            <button 
              key={cat} 
              onClick={() => setFilter(cat)}
              className={`btn ${filter === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 18px', fontSize: '0.82rem', textTransform: 'capitalize' }}
            >
              {cat === 'all' ? 'All Projects' : cat === 'web' ? 'Web Dev' : cat === 'ai' ? 'AI Automation' : 'WhatsApp API'}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        <div className="portfolio-grid">
          <style>{`
            .portfolio-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
              gap: 24px;
            }
            .p-card {
              height: 360px;
              border-radius: 16px;
              background-size: cover;
              background-position: center;
              position: relative;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              padding: 24px;
              border: 1px solid var(--border-color);
            }
            .p-overlay {
              position: absolute;
              inset: 0;
              background: linear-gradient(180deg, rgba(24,24,27,0.1) 0%, rgba(24,24,27,0.92) 85%);
            }
            .p-content {
              position: relative;
              z-index: 2;
              color: #ffffff;
            }
          `}</style>

          {filteredProjects.map(p => (
            <div 
              key={p.id} 
              className="p-card"
              style={{ backgroundImage: `url(${p.image})` }}
            >
              <div className="p-overlay"></div>
              <div className="p-content">
                <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', marginBottom: '10px' }}>{p.badge}</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '400', fontFamily: 'var(--font-serif)', color: '#fff', marginBottom: '6px' }}>{p.title}</h3>
                <p style={{ color: '#d4d4d8', fontSize: '0.88rem', marginBottom: '14px', lineHeight: '1.5' }}>{p.desc}</p>
                <button 
                  onClick={() => setActiveProject(p)} 
                  className="btn"
                  style={{ background: '#ffffff', color: '#000000', padding: '6px 16px', fontSize: '0.82rem', fontWeight: '600' }}
                >
                  View Case Study <i className="ri-external-link-line"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Drawer */}
        {activeProject && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="glass-card" style={{ maxWidth: '600px', width: '100%', position: 'relative', padding: '32px', background: '#f4f1ea' }}>
              <button 
                onClick={() => setActiveProject(null)}
                style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                <i className="ri-close-line"></i>
              </button>

              <span className="badge badge-cyan" style={{ marginBottom: '10px' }}>{activeProject.badge}</span>
              <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginBottom: '6px' }}>{activeProject.title}</h3>
              <div style={{ color: 'var(--accent-dot)', fontWeight: '600', fontSize: '0.88rem', marginBottom: '4px' }}>Client: {activeProject.client}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginBottom: '18px' }}>Tech: {activeProject.tech}</div>

              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px', fontSize: '0.92rem' }}>{activeProject.details}</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
                {activeProject.metrics.map((m, i) => (
                  <div key={i} style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>{m.val}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{m.label}</div>
                  </div>
                ))}
              </div>

              <a 
                href="#contact" 
                onClick={() => setActiveProject(null)}
                className="btn btn-primary" 
                style={{ width: '100%', padding: '12px' }}
              >
                Request Similar Solution <i className="ri-arrow-right-line"></i>
              </a>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
