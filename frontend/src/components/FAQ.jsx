import React, { useState } from 'react';

const faqs = [
  {
    q: 'How fast can KLAPP Developers launch my project?',
    a: 'Standard websites and WhatsApp automation tools are completed in 7 to 14 business days. Complex custom enterprise software or full AI agent integrations take between 2 to 4 weeks with daily staging updates.'
  },
  {
    q: 'Do I need prior technical knowledge to manage my website or bot?',
    a: 'Not at all! We build intuitive admin dashboards and provide complete walkthrough documentation and video guides. Additionally, our 24/7 team handles maintenance for you.'
  },
  {
    q: 'How does the WhatsApp Cloud API integration work?',
    a: 'We connect directly to Meta\'s official WhatsApp Cloud API, allowing your business phone number to send automated instant replies, booking confirmations, payment links, and multi-step interactive menus directly inside WhatsApp.'
  },
  {
    q: 'Is my business data secure when using your AI agents?',
    a: 'Yes, 100%. We utilize private enterprise API keys with strict data retention rules. Your private company documents and customer information are never used to train public LLM models.'
  }
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        
        <div className="section-header">
          <div className="section-tag">
            <span className="section-tag-dot"></span> FREQUENTLY ASKED
          </div>
          <h2 className="section-title">
            Got questions? <span className="serif-italic">We have answers.</span>
          </h2>
        </div>

        <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx} 
                className="glass-card" 
                style={{ padding: '20px 24px', cursor: 'pointer' }}
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                  <span>{faq.q}</span>
                  <i className={isOpen ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}></i>
                </div>
                {isOpen && (
                  <div style={{ marginTop: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
