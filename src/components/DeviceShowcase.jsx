import React, { useState, useEffect } from 'react';

const OWNER_SCREENS = [
  { id: 1, title: 'Daily Revenue & Net Overview', path: '/assets/nandakam/admin/1.png', desc: 'Real-time Net Revenue, Razorpay UPI vs Cash split, and daily transaction logs.' },
  { id: 2, title: 'Banquet Hall Calendar & Shubh Muhurt', path: '/assets/nandakam/admin/2.png', desc: 'Interactive booking calendar with session color codes and Shubh Muhurt indicators.' },
  { id: 3, title: 'Surge Pricing & Rate Manager', path: '/assets/nandakam/admin/3.png', desc: 'Custom AC Deluxe room rates, weekend pricing, and special date surge controls.' },
  { id: 4, title: 'Live Hall & Room Availability', path: '/assets/nandakam/admin/4.png', desc: 'Real-time matrix showing vacant vs occupied halls and lodge suites.' },
  { id: 5, title: 'Financial Reports & Dues Audit', path: '/assets/nandakam/admin/5.png', desc: 'Executive financial breakdowns, pending dues, and automated audit reports.' }
];

const RECEPTION_SCREENS = [
  { id: 1, title: 'Receptionist Quick Dashboard', path: '/assets/nandakam/reception/1.png', desc: 'Instant access to Banquet Hall, Lodge Rooms, and Guest Enquiry modules.' },
  { id: 2, title: 'Banquet Hall Booking Schedule', path: '/assets/nandakam/reception/2.png', desc: 'Front-desk calendar with fast booking creation and session slots.' },
  { id: 3, title: 'Guests Directory & History', path: '/assets/nandakam/reception/3.png', desc: 'Comprehensive guest database with past stays, contact info, and notes.' },
  { id: 4, title: 'Online Web & WhatsApp Bookings', path: '/assets/nandakam/reception/4.png', desc: 'Incoming online inquiries auto-parsed and ready for confirmation.' },
  { id: 5, title: 'Pending Payments & Invoicing', path: '/assets/nandakam/reception/5.png', desc: 'Track pending balances and send instant WhatsApp invoices to guests.' },
  { id: 6, title: 'Live Guest Check-In Logs', path: '/assets/nandakam/reception/6.png', desc: 'Fast front-desk check-in workflow with keycard and WiFi assignment.' },
  { id: 7, title: 'Booking History & Audit Trail', path: '/assets/nandakam/reception/7.png', desc: 'Complete historical logs of all hall reservations and payment receipts.' },
  { id: 8, title: 'Petty Cash & Expense Tracker', path: '/assets/nandakam/reception/8.png', desc: 'Daily operational expenses logged directly by reception staff.' }
];

const WA_DEMO_STEPS = [
  {
    id: 'confirm',
    title: 'Booking Confirmation',
    tag: 'AUTOMATED WELCOME',
    time: '11:41 PM',
    content: (
      <div>
        <div style={{ fontWeight: '700', marginBottom: '8px' }}>Dear Gottiaashish,</div>
        <div>Welcome to <strong>Nandakam Luxury Rooms 🏨✨</strong></div>
        <div style={{ marginTop: '6px' }}>Your booking is successfully <strong>confirmed ✅</strong>.</div>
        <div style={{ margin: '8px 0', color: '#475569' }}>We wish you a very happy and comfortable stay!</div>
        
        <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', marginTop: '10px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ fontWeight: '700', fontSize: '0.85rem', marginBottom: '8px', color: '#0f172a' }}>
            Luxury Rooms Booking Details:
          </div>
          <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div>📅 <strong>Check-In:</strong> 28 Jul 2026, 11:41 pm</div>
            <div>📅 <strong>Check-Out:</strong> 29 Jul 2026, 10:00 am</div>
            <div>🏨 <strong>Room No:</strong> 402</div>
            <div>💵 <strong>Total Paid:</strong> ₹0</div>
            <div>📍 <strong>Venue:</strong> Nandakam Banquets</div>
          </div>
        </div>

        <div style={{ marginTop: '10px', fontSize: '0.78rem', background: '#fef2f2', color: '#991b1b', padding: '8px 10px', borderRadius: '8px', border: '1px solid #fecaca' }}>
          ⚠️ <strong>IMPORTANT:</strong> Advance payment is non-refundable.
        </div>
      </div>
    )
  },
  {
    id: 'payment',
    title: 'Razorpay UPI Payment Link',
    tag: 'INSTANT PAY LINK',
    time: '11:42 PM',
    content: (
      <div>
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '14px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>₹20.00</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <span>Pay with</span>
            <span style={{ fontWeight: '700', color: '#16a34a' }}>UPI</span> • 
            <span style={{ fontWeight: '700', color: '#2563eb' }}>VISA</span> • 
            <span style={{ fontWeight: '700', color: '#dc2626' }}>Mastercard</span>
          </div>

          <div style={{ fontSize: '0.84rem', color: '#334155', lineHeight: '1.4', marginBottom: '10px' }}>
            Dear <strong>nanisai</strong>,<br />
            This is an automated booking transaction update from <strong>Nandakam Banquets</strong>.
          </div>

          <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#0f172a', marginBottom: '14px' }}>
            Amount Due: <span style={{ color: '#2563eb' }}>Rs.20</span>
          </div>

          <button style={{ width: '100%', padding: '10px', background: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <i className="ri-secure-payment-line"></i> Pay Now
          </button>
        </div>
      </div>
    )
  },
  {
    id: 'checkout',
    title: 'Automated Checkout Receipt',
    tag: 'DEPARTURE THANK YOU',
    time: '01:31 AM',
    content: (
      <div>
        <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#0f172a', marginBottom: '6px' }}>
          Thank you for staying with us! 🎉
        </div>
        <div style={{ fontSize: '0.86rem', color: '#475569', marginBottom: '12px' }}>
          We hope you enjoyed your stay at <strong>Nandakam Banquets & Luxury Rooms</strong>.
        </div>

        <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '0.84rem', fontWeight: '600', color: '#334155' }}>
            🏨 <strong>Room No:</strong> 401
          </div>
          <div style={{ fontSize: '0.84rem', fontWeight: '600', color: '#334155', marginTop: '4px' }}>
            🛡️ <strong>Deposit Refund Status:</strong> Processed (N/A)
          </div>
        </div>

        <div style={{ marginTop: '12px', fontSize: '0.86rem', fontWeight: '600', color: '#16a34a' }}>
          Have a safe journey and visit us again! ✨
        </div>
      </div>
    )
  }
];

export default function DeviceShowcase({ isOpen, onClose }) {
  const [portalType, setPortalType] = useState('owner'); // 'owner' | 'reception'
  const [ownerIndex, setOwnerIndex] = useState(0);
  const [receptionIndex, setReceptionIndex] = useState(0);
  const [waStepIndex, setWaStepIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const screens = portalType === 'owner' ? OWNER_SCREENS : RECEPTION_SCREENS;
  const currentIndex = portalType === 'owner' ? ownerIndex : receptionIndex;
  const setIndex = portalType === 'owner' ? setOwnerIndex : setReceptionIndex;

  // Web Browser Auto-scroll timer (2.8 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev >= screens.length - 1 ? 0 : prev + 1));
    }, 2800);

    return () => clearInterval(timer);
  }, [portalType, screens.length]);

  // WhatsApp Auto-progress timer (3.5 seconds)
  useEffect(() => {
    const waTimer = setInterval(() => {
      setWaStepIndex((prev) => (prev >= WA_DEMO_STEPS.length - 1 ? 0 : prev + 1));
    }, 3500);

    return () => clearInterval(waTimer);
  }, []);

  const activeWaStep = WA_DEMO_STEPS[waStepIndex];

  const contentMarkup = (
    <section id="showcase" className="section-padding" style={{ background: '#fcfbf9' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        
        {/* Section Header */}
        <div className="section-header" style={{ marginBottom: '36px', marginTop: isOpen ? '20px' : '0' }}>
          <div className="section-tag">
            <span className="section-tag-dot"></span> LIVE ENTERPRISE SOFTWARE
          </div>
          <h2 className="section-title">
            Nandakam Banquets <span className="serif-italic">Production Suite.</span>
          </h2>
          <p className="section-subtitle" style={{ maxWidth: '720px' }}>
            Custom enterprise software engineered by KLAPP Developers. Explore real production web portals and automated Meta WhatsApp Cloud API workflows.
          </p>
        </div>

        {/* Web Portals Segmented Control */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
          <div className="portal-segmented-bar">
            <button 
              className={`portal-segment-btn ${portalType === 'owner' ? 'active' : ''}`}
              onClick={() => { setPortalType('owner'); setOwnerIndex(0); }}
            >
              <i className="ri-vip-crown-2-line" style={{ marginRight: '6px' }}></i> Owner Executive Portal (5 Screens)
            </button>
            <button 
              className={`portal-segment-btn ${portalType === 'reception' ? 'active' : ''}`}
              onClick={() => { setPortalType('reception'); setReceptionIndex(0); }}
            >
              <i className="ri-user-star-line" style={{ marginRight: '6px' }}></i> Reception Operations Portal (8 Screens)
            </button>
          </div>
        </div>

        <style>{`
          .showcase-fullscreen-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100dvh;
            background: #fcfbf9;
            z-index: 99998;
            overflow-y: auto;
            animation: pageSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .showcase-page-header {
            position: sticky;
            top: 0;
            z-index: 100;
            background: rgba(244, 241, 234, 0.94);
            backdrop-filter: blur(16px);
            border-bottom: 1px solid rgba(0, 0, 0, 0.08);
            padding: 16px 0;
          }

          .portal-segmented-bar {
            background: #eae6dd;
            padding: 5px;
            border-radius: 999px;
            display: inline-flex;
            gap: 6px;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.06);
          }

          .portal-segment-btn {
            padding: 10px 24px;
            border-radius: 999px;
            font-size: 0.85rem;
            font-weight: 700;
            border: none;
            background: transparent;
            color: var(--text-secondary);
            cursor: pointer;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .portal-segment-btn.active {
            background: #18181b;
            color: #ffffff;
            box-shadow: 0 4px 14px rgba(24, 24, 27, 0.25);
          }

          .browser-frame-container {
            background: #ffffff;
            border: 1px solid var(--border-color, rgba(0,0,0,0.1));
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 24px 60px rgba(0, 0, 0, 0.09);
            position: relative;
            margin-bottom: 60px;
          }

          .browser-top-bar {
            background: #eae6dd;
            padding: 12px 18px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(0,0,0,0.08);
          }

          .browser-dots {
            display: flex;
            gap: 7px;
          }

          .browser-dot {
            width: 11px;
            height: 11px;
            border-radius: 50%;
          }

          .browser-url-pill {
            background: #ffffff;
            padding: 6px 22px;
            border-radius: 999px;
            font-family: var(--font-mono);
            font-size: 0.8rem;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            font-weight: 500;
          }

          .browser-stage {
            position: relative;
            background: #ffffff;
            width: 100%;
            display: grid;
            grid-template-areas: "stack";
            overflow: hidden;
          }

          .browser-screen-img {
            grid-area: stack;
            width: 100%;
            height: auto;
            display: block;
            object-fit: cover;
            opacity: 0;
            transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
          }

          .browser-screen-img.active {
            opacity: 1;
            pointer-events: auto;
          }

          /* Code-based WhatsApp Simulator Styles */
          .automation-section-grid {
            display: grid;
            grid-template-columns: 0.9fr 1.1fr;
            gap: 32px;
            align-items: stretch;
          }

          @media (max-width: 900px) {
            .automation-section-grid {
              grid-template-columns: 1fr;
            }
          }

          .wa-sim-card {
            background: #ffffff;
            border: 1px solid rgba(0,0,0,0.1);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 16px 45px rgba(0, 0, 0, 0.08);
            display: flex;
            flex-direction: column;
          }

          .wa-sim-header {
            background: #075e54;
            padding: 14px 18px;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .wa-sim-chat-viewport {
            background: #e5ddd5;
            background-image: radial-gradient(#cbd5e1 1px, transparent 0);
            background-size: 16px 16px;
            padding: 20px 16px;
            min-height: 440px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
          }

          .wa-chat-bubble {
            background: #ffffff;
            border-radius: 0px 16px 16px 16px;
            padding: 16px;
            max-width: 92%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            position: relative;
            animation: bubblePopIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .wa-bubble-time {
            font-size: 0.68rem;
            color: #94a3b8;
            text-align: right;
            margin-top: 10px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 4px;
          }

          .n8n-node-flow-canvas {
            background: #0f172a;
            border-radius: 16px;
            padding: 24px;
            color: #f8fafc;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-shadow: 0 16px 45px rgba(0, 0, 0, 0.2);
            min-height: 440px;
          }

          .n8n-node-pill {
            background: #1e293b;
            border: 1px solid #334155;
            border-radius: 12px;
            padding: 14px 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
          }

          .n8n-node-pill.active {
            border-color: #22c55e;
            background: #0f291e;
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.25);
          }

          @keyframes bubblePopIn {
            from { opacity: 0; transform: translateY(12px) scale(0.96); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }

          @keyframes pageSlideIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Main MacBook Showcase Frame */}
        <div className="browser-frame-container">
          
          {/* Top Address Bar */}
          <div className="browser-top-bar">
            <div className="browser-dots">
              <span className="browser-dot" style={{ background: '#ef4444' }}></span>
              <span className="browser-dot" style={{ background: '#f59e0b' }}></span>
              <span className="browser-dot" style={{ background: '#10b981' }}></span>
            </div>

            <div className="browser-url-pill">
              <i className="ri-lock-fill" style={{ color: '#15803d' }}></i>
              https://www.nandakambanquethall.com/{portalType === 'owner' ? 'admin' : 'receptionist'}
            </div>

            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#15803d', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
              LIVE PORTAL
            </div>
          </div>

          {/* Main Screenshot Stage - Stacked Crossfade */}
          <div className="browser-stage">
            {screens.map((sc, idx) => (
              <img 
                key={sc.path}
                src={sc.path} 
                alt={sc.title}
                className={`browser-screen-img ${currentIndex === idx ? 'active' : ''}`}
              />
            ))}
          </div>

        </div>

        {/* DEDICATED CODE-BASED WHATSAPP AUTOMATION & N8N WORKFLOW SECTION */}
        <div style={{ marginTop: '20px', paddingTop: '40px', borderTop: '1px dashed rgba(0,0,0,0.12)' }}>
          
          {/* Section Header */}
          <div style={{ marginBottom: '28px' }}>
            <div className="section-tag" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#15803d', borderColor: 'rgba(34, 197, 94, 0.2)' }}>
              <span className="section-tag-dot" style={{ background: '#22c55e' }}></span> META WHATSAPP CLOUD API & N8N ENGINE
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-sans)', marginTop: '8px' }}>
              Automated Guest Messaging & <span className="serif-italic">Backend Workflows.</span>
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '780px', marginTop: '6px' }}>
              Designed by <strong>KLAPP Developers</strong>. When a receptionist updates room status, our custom n8n backend pipeline triggers instant WhatsApp notifications, Razorpay payment links, and stay confirmation rules.
            </p>
          </div>

          <div className="automation-section-grid" style={{ alignItems: 'stretch' }}>
            
            {/* Left: Native Code-based Interactive WhatsApp Chat Simulator (Fixed Height 520px) */}
            <div className="wa-sim-card" style={{ height: '520px', minHeight: '520px', display: 'flex', flexDirection: 'column' }}>
              
              {/* WhatsApp App Header */}
              <div className="wa-sim-header" style={{ flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#128c7e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#ffffff', fontSize: '1.1rem', border: '1px solid rgba(255,255,255,0.2)' }}>
                    N
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Nandakam Banquets <i className="ri-checkbox-circle-fill" style={{ color: '#25d366', fontSize: '0.9rem' }}></i>
                    </div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>Official Business Bot • Online</div>
                  </div>
                </div>

                <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '999px', fontWeight: '600' }}>
                  Meta Cloud API
                </span>
              </div>

              {/* Chat Viewport - Fixed Height Area (No jumping, 1 message at a time) */}
              <div className="wa-sim-chat-viewport" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', minHeight: '0' }}>
                <div style={{ textAlign: 'center', marginBottom: '12px', flexShrink: 0 }}>
                  <span style={{ background: 'rgba(255,255,255,0.85)', padding: '4px 12px', borderRadius: '6px', fontSize: '0.68rem', color: '#64748b', fontWeight: '600' }}>
                    AUTOMATED TRIGGER ({waStepIndex + 1}/3)
                  </span>
                </div>

                {/* Single Animated Chat Bubble (Changes every 3.5s) */}
                <div key={activeWaStep.id} className="wa-chat-bubble" style={{ flexShrink: 0 }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#075e54', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                    ● {activeWaStep.tag}
                  </div>
                  
                  {activeWaStep.content}

                  <div className="wa-bubble-time">
                    <span>{activeWaStep.time}</span>
                    <i className="ri-check-double-line" style={{ color: '#38bdf8', fontSize: '0.9rem' }}></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Clean Workflow Diagram Photo Card (Fixed Height 520px) */}
            <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '20px', padding: '20px', boxShadow: '0 16px 45px rgba(0,0,0,0.08)', height: '520px', minHeight: '520px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    BACKEND AUTOMATION FLOW
                  </span>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#16a34a', background: 'rgba(22, 163, 74, 0.1)', padding: '3px 10px', borderRadius: '999px' }}>
                    ● N8N WORKFLOW
                  </span>
                </div>

                {/* Workflow Image Screenshot */}
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', background: '#faf8f5' }}>
                  <img 
                    src="/assets/nandakam/automation/5.png?v=3" 
                    alt="Nandakam Banquets n8n Backend Workflow Diagram"
                    style={{ width: '100%', height: 'auto', maxHeight: '360px', display: 'block', objectFit: 'contain' }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '16px', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4', fontWeight: '500' }}>
                ⚡ Custom n8n workflow engineered by KLAPP Developers connecting webhooks to Meta WhatsApp Cloud API.
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );

  if (isOpen) {
    return (
      <div className="showcase-fullscreen-overlay">
        <div className="showcase-page-header">
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontWeight: '800', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '1rem' }}>
                KLAPP DEVELOPERS
              </span>
              <span className="badge badge-popular" style={{ margin: 0, padding: '4px 12px', fontSize: '0.7rem' }}>LIVE SHOWCASE</span>
            </div>

            <button 
              className="btn btn-secondary" 
              onClick={onClose}
              style={{ padding: '8px 18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <i className="ri-arrow-left-line"></i> Back to Main Site
            </button>
          </div>
        </div>

        {contentMarkup}
      </div>
    );
  }

  return contentMarkup;
}









