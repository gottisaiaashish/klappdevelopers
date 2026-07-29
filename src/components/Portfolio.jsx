import React, { useState } from 'react';

const realProjects = [
  {
    id: 'nandakam',
    category: 'booking',
    title: 'Nandhakam Luxury Stays',
    badge: '2 PORTALS: ADMIN & RECEPTION',
    url: 'https://nandakam.vercel.app',
    desc: 'Dual-portal resort management system featuring a Dedicated Admin Portal & Reception / Front Desk Portal with real-time WhatsApp booking confirmation.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    client: 'Nandhakam Hospitality Group',
    tech: 'React, Vite, WhatsApp Cloud API, PostgreSQL',
    portals: ['Admin Command Portal', 'Reception & Front Desk Portal', 'Guest Self-Booking Interface'],
    details: 'Complete hospitality ecosystem engineered with 2 distinct portals: (1) Admin Portal for revenue analytics & room management, and (2) Reception Desk Portal for rapid guest check-ins, bill generation & WhatsApp booking webhook sync.',
    metrics: [
      { label: 'Portals Built', val: '2 Active' },
      { label: 'Direct Bookings', val: '+180%' },
      { label: 'Page Latency', val: '< 60ms' }
    ]
  },
  {
    id: 'admyra',
    category: 'web',
    title: 'Admyra Luxury Apparel',
    badge: 'E-COMMERCE & BRAND PORTAL',
    url: 'https://www.admyra.in',
    desc: 'High-converting luxury fashion & apparel storefront with lightning-fast catalog search and frictionless checkout.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    client: 'Admyra Fashion Ltd',
    tech: 'React, Tailwind/CSS, Razorpay, Node.js',
    portals: ['Customer Storefront', 'Merchant Product & Order Manager'],
    details: 'Ultra-aesthetic e-commerce experience designed for high-end fashion buyers. Includes fast image loading, instant cart drawer, and integrated payment gateway.',
    metrics: [
      { label: 'Conversion Rate', val: '3.9%' },
      { label: 'Lighthouse Score', val: '98/100' },
      { label: 'Order Growth', val: '+240%' }
    ]
  },
  {
    id: 'motionbook',
    category: 'web',
    title: 'Motionbook Interactive Media',
    badge: 'CREATIVE & MOTION APP',
    url: 'https://motionbook.vercel.app',
    desc: 'Next-gen digital storytelling platform featuring dynamic motion graphics, custom video splash, and interactive page turns.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    client: 'Motionbook Creative Studio',
    tech: 'React, Motion Engines, WebGL, Canvas API',
    portals: ['Interactive Digital Reader', 'Content Creator Studio'],
    details: 'Immersive digital book engine built for modern digital publishers. Smooth 60fps frame rates, custom video splash screens, and responsive touch controls.',
    metrics: [
      { label: 'Frame Rate', val: '60 FPS' },
      { label: 'User Dwell Time', val: '+310%' },
      { label: 'Asset Compress', val: '75%' }
    ]
  },
  {
    id: 'amanviai',
    category: 'ai',
    title: 'Amanvi Autonomous AI Agent',
    badge: 'ENTERPRISE AI & n8n PIPELINE',
    url: 'https://amanvi-ai.vercel.app',
    desc: 'Autonomous LLM workflow automation engine integrated with n8n backend network bindings and RAG vector search.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    client: 'Amanvi Tech Labs',
    tech: 'OpenAI GPT-4o, n8n Orchestration, Python, PostgreSQL',
    portals: ['AI Workflow Builder', 'n8n Automation Console'],
    details: 'Enterprise autonomous AI pipeline capable of parsing complex PDF contracts, executing n8n webhooks, and routing customer leads automatically to CRM systems.',
    metrics: [
      { label: 'Auto Tasks', val: '85%' },
      { label: 'API Response', val: '< 1.1s' },
      { label: 'Cost Reduction', val: '64%' }
    ]
  },
  {
    id: 'chanakyahighschool',
    category: 'enterprise',
    title: 'Chanakya High School Portal',
    badge: 'EDTECH & INSTITUTION ERP',
    url: 'https://chanakyahighschool.vercel.app',
    desc: 'Comprehensive educational portal and student management dashboard with digital notices and admission workflows.',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    client: 'Chanakya Educational Society',
    tech: 'React, Node.js, Express, MongoDB',
    portals: ['Student & Parent Portal', 'Admin & Staff Management Portal'],
    details: 'Digital transformation platform for K-12 school administration. Handles student admissions, exam result publishing, fee receipts, and official announcements.',
    metrics: [
      { label: 'Students Onboarded', val: '1,200+' },
      { label: 'Paperless Rate', val: '90%' },
      { label: 'Uptime', val: '99.9%' }
    ]
  },
  {
    id: 'balajikishoremedical',
    category: 'enterprise',
    title: 'Balaji Kishore Medical ERP',
    badge: 'HEALTHCARE & PHARMACY ERP',
    url: 'https://balajikishoremedical.vercel.app',
    desc: 'Healthcare inventory management system and billing controller engineered for pharmacy networks.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    client: 'Balaji Kishore Medicals',
    tech: 'React, Node.js, Order Controller API, PostgreSQL',
    portals: ['Pharmacy Billing Counter', 'Inventory Stock Manager'],
    details: 'Precision medical billing and stock management software. Real-time batch expiration tracking, GST invoice generator, and automated supplier reorder alerts.',
    metrics: [
      { label: 'Billing Speed', val: '3x Faster' },
      { label: 'Stock Accuracy', val: '99.8%' },
      { label: 'Daily Orders', val: '500+' }
    ]
  },
  {
    id: 'seek',
    category: 'ai',
    title: 'Seek Career Discovery Platform',
    badge: 'AI TALENT & MATCHING',
    url: 'https://seek-lac.vercel.app',
    desc: 'AI-powered candidate discovery engine and talent matching web application.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    client: 'Seek Talent Group',
    tech: 'React, Vector Search, AI Parsing, Node.js',
    portals: ['Candidate Discovery App', 'Recruiter Dashboard'],
    details: 'Intelligent job matching engine that analyzes candidate skill vectors against recruiter job descriptions to recommend top 1% matching applicants.',
    metrics: [
      { label: 'Match Accuracy', val: '92%' },
      { label: 'Time-to-Hire', val: '-50%' },
      { label: 'Active Profiles', val: '15k+' }
    ]
  }
];

export default function Portfolio() {
  const [filter, setFilter] = useState('all');
  const [activeProject, setActiveProject] = useState(null);

  const filteredProjects = filter === 'all' 
    ? realProjects 
    : realProjects.filter(p => p.category === filter);

  return (
    <section id="portfolio" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        
        <div className="section-header">
          <div className="section-tag">
            <span className="section-tag-dot"></span> PROVEN CLIENT WORK
          </div>
          <h2 className="section-title">
            Engineered <span className="serif-italic">real-world software.</span>
          </h2>
          <p className="section-subtitle">
            Explore live production systems built for hospitality, fashion e-commerce, AI automation, healthcare, and education.
          </p>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '36px', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'All Projects' },
            { key: 'booking', label: 'Resorts & Booking' },
            { key: 'web', label: 'Web & E-Commerce' },
            { key: 'ai', label: 'AI & Automation' },
            { key: 'enterprise', label: 'Enterprise & ERP' }
          ].map(f => (
            <button 
              key={f.key} 
              onClick={() => setFilter(f.key)}
              className={`btn ${filter === f.key ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 18px', fontSize: '0.82rem' }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        <div className="portfolio-grid">
          <style>{`
            .portfolio-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
              gap: 24px;
            }
            .p-card {
              min-height: 380px;
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
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
              transition: all 0.3s ease;
            }
            .p-card:hover {
              transform: translateY(-4px);
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
            }
            .p-overlay {
              position: absolute;
              inset: 0;
              background: linear-gradient(180deg, rgba(24,24,27,0.15) 0%, rgba(24,24,27,0.92) 80%);
            }
            .p-content {
              position: relative;
              z-index: 2;
              color: #ffffff;
            }
            .portal-badge-pill {
              display: inline-block;
              background: rgba(255, 255, 255, 0.18);
              backdrop-filter: blur(8px);
              border: 1px solid rgba(255, 255, 255, 0.3);
              color: #ffffff;
              font-family: var(--font-mono);
              font-size: 0.68rem;
              font-weight: 600;
              padding: 4px 10px;
              border-radius: 9999px;
              margin-bottom: 10px;
              letter-spacing: 0.06em;
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
                <span className="portal-badge-pill">{p.badge}</span>
                <h3 style={{ fontSize: '1.45rem', fontWeight: '400', fontFamily: 'var(--font-serif)', color: '#fff', marginBottom: '6px' }}>{p.title}</h3>
                <p style={{ color: '#d4d4d8', fontSize: '0.85rem', marginBottom: '16px', lineHeight: '1.5' }}>{p.desc}</p>
                
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => setActiveProject(p)} 
                    className="btn"
                    style={{ background: '#ffffff', color: '#000000', padding: '6px 14px', fontSize: '0.8rem', fontWeight: '600' }}
                  >
                    View Details & Portals <i className="ri-layout-grid-line"></i>
                  </button>
                  <a 
                    href={p.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn"
                    style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', padding: '6px 12px', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.3)' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Live Demo <i className="ri-external-link-line"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comprehensive Case Study Drawer Modal */}
        {activeProject && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="glass-card" style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', padding: '32px', background: '#f4f1ea' }}>
              <button 
                onClick={() => setActiveProject(null)}
                style={{ position: 'absolute', top: '18px', right: '18px', background: '#eae5db', border: '1px solid var(--border-color)', borderRadius: '50%', width: '32px', height: '32px', color: 'var(--text-primary)', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <i className="ri-close-line"></i>
              </button>

              <span className="badge badge-cyan" style={{ marginBottom: '10px' }}>{activeProject.badge}</span>
              <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginBottom: '4px' }}>{activeProject.title}</h3>
              <div style={{ color: 'var(--accent-dot)', fontWeight: '600', fontSize: '0.88rem', marginBottom: '2px' }}>Client: {activeProject.client}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginBottom: '18px' }}>Tech: {activeProject.tech}</div>

              {/* Portals Built Highlight Box */}
              <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', marginBottom: '18px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                  <i className="ri-checkbox-circle-fill" style={{ color: '#22c55e', marginRight: '6px' }}></i> PORTALS & MODULES DELIVERED:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {activeProject.portals.map((portal, idx) => (
                    <span key={idx} style={{ background: '#f4f1ea', border: '1px solid var(--border-color)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                      ⚡ {portal}
                    </span>
                  ))}
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px', fontSize: '0.92rem' }}>{activeProject.details}</p>

              {/* Impact Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
                {activeProject.metrics.map((m, i) => (
                  <div key={i} style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>{m.val}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{m.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a 
                  href={activeProject.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
                >
                  Visit Live Production Website <i className="ri-external-link-line"></i>
                </a>
                <a 
                  href="#contact" 
                  onClick={() => setActiveProject(null)}
                  className="btn btn-secondary" 
                  style={{ padding: '12px 20px' }}
                >
                  Request Similar App
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
