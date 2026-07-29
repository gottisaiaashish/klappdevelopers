import React, { useState } from 'react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    service: 'Website Development',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="section-padding">
      <div className="container">
        
        <div className="section-header">
          <div className="section-tag">
            <span className="section-tag-dot"></span> LET'S TALK
          </div>
          <h2 className="section-title">
            Start building <span className="serif-italic">your vision today.</span>
          </h2>
          <p className="section-subtitle">
            Ready to elevate your business with luxury software, AI automation, or a high-converting website? Get in touch directly with our founders.
          </p>
        </div>

        <div className="contact-grid">
          <style>{`
            .contact-grid {
              display: grid;
              grid-template-columns: 0.95fr 1.05fr;
              gap: 28px;
              align-items: start;
            }
            @media (max-width: 900px) {
              .contact-grid {
                grid-template-columns: 1fr;
              }
            }
            .c-input {
              width: 100%;
              background: #ffffff;
              border: 1px solid var(--border-color);
              border-radius: 10px;
              padding: 12px 16px;
              color: var(--text-primary);
              font-family: var(--font-sans);
              font-size: 0.9rem;
              outline: none;
              margin-top: 6px;
            }
            .c-input:focus {
              border-color: var(--border-highlight);
            }
            .form-group {
              margin-bottom: 16px;
            }
            .form-label {
              font-size: 0.82rem;
              font-weight: 600;
              color: var(--text-secondary);
            }
            .phone-professional-card {
              background: #ffffff;
              border: 1px solid var(--border-color);
              border-radius: 14px;
              padding: 24px;
              box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
              display: flex;
              align-items: center;
              justify-content: space-between;
              flex-wrap: wrap;
              gap: 16px;
            }
            .phone-mono-number {
              font-family: var(--font-mono);
              font-weight: 700;
              font-size: 1.35rem;
              color: #18181b;
              letter-spacing: 0.06em;
            }
          `}</style>

          {/* Left Info with Professional Monospace Phone Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div className="phone-professional-card">
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>
                  <span className="section-tag-dot" style={{ background: '#22c55e', display: 'inline-block', marginRight: '6px' }}></span>
                  DIRECT FOUNDER LINE
                </div>
                <div className="phone-mono-number">+91 79890 33580</div>
              </div>
              <a 
                href="https://wa.me/917989033580?text=Hi%20KLAPP%20Developers,%20I%20would%20like%20to%20discuss%20a%20project!" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.82rem', background: '#18181b', color: '#fff' }}
              >
                <i className="ri-whatsapp-line" style={{ color: '#22c55e', fontSize: '1rem' }}></i> WhatsApp
              </a>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eae5db', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                <i className="ri-mail-send-line"></i>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email Us Directly</div>
                <a href="mailto:contact@klappdevelopers.in" style={{ fontSize: '0.98rem', fontWeight: '600', color: 'var(--text-primary)', textDecoration: 'none' }}>contact@klappdevelopers.in</a>
              </div>
            </div>

            <a 
              href="https://wa.me/917989033580?text=Hi%20KLAPP%20Developers,%20I%20would%20like%20to%20discuss%20a%20project!" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn" 
              style={{ background: '#18181b', color: '#ffffff', padding: '16px', fontSize: '0.95rem', fontWeight: '600' }}
            >
              <i className="ri-whatsapp-fill" style={{ color: '#22c55e', fontSize: '1.25rem' }}></i> Chat Directly on +91 79890 33580
            </a>

            <div className="glass-card" style={{ textAlign: 'center', padding: '20px' }}>
              <i className="ri-map-pin-2-line" style={{ fontSize: '1.8rem', color: 'var(--accent-dot)', marginBottom: '6px' }}></i>
              <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>KLAPP Group HQ</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Tech Hub, Hyderabad & Global Operations</div>
            </div>

          </div>

          {/* Right Form */}
          <div className="glass-card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginBottom: '20px' }}>Send Us a Message</h3>

            {submitted ? (
              <div style={{ background: '#e6f4ea', border: '1px solid #15803d', borderRadius: '10px', padding: '20px', textAlign: 'center', color: '#15803d' }}>
                <i className="ri-checkbox-circle-fill" style={{ fontSize: '2rem', display: 'block', marginBottom: '6px' }}></i>
                <h4 style={{ fontWeight: '600', fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '2px' }}>Inquiry Received!</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Thank you for reaching out. Our team will contact you on WhatsApp / Email within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input 
                    type="text" 
                    required 
                    className="c-input" 
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Work Email / WhatsApp Number</label>
                  <input 
                    type="text" 
                    required 
                    className="c-input" 
                    placeholder="e.g. rahul@company.com or +91 79890 33580"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Service Required</label>
                  <select 
                    className="c-input" 
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                  >
                    <option value="Website Development">Website Development</option>
                    <option value="AI Automation">AI Automation & Agents</option>
                    <option value="WhatsApp Automation">WhatsApp API Automation</option>
                    <option value="Mobile App">Mobile App (iOS / Android)</option>
                    <option value="Business Software">Business Software / ERP</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Project Scope / Details</label>
                  <textarea 
                    rows={4} 
                    required 
                    className="c-input" 
                    placeholder="Tell us about your project goals, features needed, and target timeline..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
                  Submit Inquiry <i className="ri-send-plane-fill"></i>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
