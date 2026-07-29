import React, { useState } from 'react';

const projectsList = [
  {
    id: 'nandhakam',
    category: 'resort',
    title: 'Nandhakam Luxury Stays & Banquet Hall',
    badge: '2 PORTALS: ADMIN & RECEPTION',
    url: 'https://nandakam.vercel.app',
    secondaryUrl: 'https://nandakambanquethall.com',
    shortDesc: 'Dual-portal resort & banquet management platform with real-time WhatsApp guest confirmations and owner revenue analytics.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    client: 'Nandhakam Hospitality Group',
    tech: 'React, Vite, WhatsApp Cloud API, PostgreSQL, Node.js',
    story: `Nandhakam was built to eliminate manual register bookings and phone call back-and-forth for a premier luxury resort and banquet hall. We engineered a complete digital hospitality platform split into two dedicated portals: a Guest Booking Engine and an Owner/Reception Command Center.

When guests browse rooms or banquet dates online, they can instantly verify real-time availability, select check-in/out dates, and complete their booking online. The moment a booking is confirmed, an automated WhatsApp webhook triggers: sending an instant confirmation ticket to the guest with room details, while simultaneously firing an instant WhatsApp alert to the resort owner's phone.

On the backend, the Owner Command Dashboard provides complete operational control: live room matrix, daily/upcoming/cancelled bookings, monthly & yearly revenue analytics, occupancy reports, staff management, and automated receipt generation.`,
    highlights: [
      'Customer Web App: Live room availability, instant date picker & direct booking engine',
      'Dual WhatsApp Automation: Simultaneous instant guest tickets & owner push notifications',
      'Owner Command Dashboard: Real-time revenue analytics, room occupancy, & staff management',
      'Banquet Hall Management: Event slot reservation & advance payment tracking'
    ],
    metrics: [
      { label: 'Portals Delivered', val: '2 Active' },
      { label: 'Direct Bookings', val: '+180%' },
      { label: 'Response Speed', val: '< 50ms' }
    ]
  },
  {
    id: 'admyra',
    category: 'edtech',
    title: 'Admyra EAPCET & College Predictor',
    badge: 'EDTECH & ADMISSION ANALYTICS',
    url: 'https://www.admyra.in',
    shortDesc: 'Data-driven EAPCET engineering college predictor platform helping students calculate rank odds, cutoff history, and placement stats.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    client: 'Admyra Student Network',
    tech: 'React, Vite, EAPCET Analytics Engine, Node.js',
    story: `Choosing the right engineering college after EAPCET exams is often stressful and based on guesswork. We built Admyra as an all-in-one data-driven admission guide for engineering aspirants in Telangana and Andhra Pradesh.

Using expected marks, Admyra predicts student rank probabilities and correlates them against historical category, gender, local area reservation, and cutoff trends. Students gain instant access to an exhaustive college directory with detailed profiles, fee structures, branch availability, historical closing ranks, average placement packages, and authentic campus reviews.

Additionally, Admyra guides students step-by-step through counselling certificate verification, web options strategies, and seat allotment procedures—empowering thousands of students to secure their ideal college branch without anxiety.`,
    highlights: [
      'EAPCET Rank Predictor: Real-time rank estimation based on expected marks',
      'Smart College Predictor: Filtered by category, gender, local area, & cutoff history',
      'Exhaustive College DB: Placements data, average package, fees, & branch availability',
      'Counselling Walkthrough: Step-by-step web options guidance & verification steps'
    ],
    metrics: [
      { label: 'Students Helped', val: '50k+' },
      { label: 'Prediction Precision', val: '96.4%' },
      { label: 'Lighthouse Score', val: '99/100' }
    ]
  },
  {
    id: 'motionbook',
    category: 'creative',
    title: 'MotionBook Interactive QR Albums',
    badge: 'DIGITAL MEMORY PLATFORM',
    url: 'https://motionbook.vercel.app',
    shortDesc: 'QR-coded interactive digital album experience bridging physical wedding albums with dynamic high-resolution photo & video galleries.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    client: 'MotionBook Studios',
    tech: 'React, Motion Engines, WebGL, Cloud Storage',
    story: `Physical wedding and event photo albums are cherished, but they cannot play videos or capture the full motion of special moments. We created MotionBook to revolutionize event photography by bridging physical print with rich digital experiences.

Each physical album features an elegantly embedded QR code. When scanned by couples or family members, a custom digital portal opens instantly—displaying high-definition photo galleries, cinematic highlight reels, drone videos, and interactive page flip memories.

MotionBook allows families to relive their wedding and celebration memories anytime, anywhere, on any smartphone or tablet.`,
    highlights: [
      'Physical QR Code Integration: Printed inside physical wedding albums for instant mobile scan',
      'Hybrid Media Player: Smooth high-definition video playback & photo carousel',
      'Cloud Archive: Secure cloud storage accessible anytime globally',
      'Interactive Flip Engine: Ultra-smooth 60fps gesture animations'
    ],
    metrics: [
      { label: 'Frame Rate', val: '60 FPS' },
      { label: 'User Dwell Time', val: '+310%' },
      { label: 'Scan Latency', val: '< 1s' }
    ]
  },
  {
    id: 'amanviai',
    category: 'ai',
    title: 'Amanvi AI Call & Task Automation',
    badge: 'CONVERSATIONAL AI AGENT',
    url: 'https://amanvi-ai.vercel.app',
    shortDesc: 'Autonomous conversational AI assistant capable of scheduling calls, answering inquiries, and connecting A to Z business workflows.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    client: 'Amanvi AI Labs',
    tech: 'OpenAI GPT-4o, LLM Orchestration, Python, Webhooks',
    story: `Amanvi AI was engineered to handle complex business communication and administrative tasks autonomously. Rather than relying on rigid, pre-scripted bots, Amanvi uses Large Language Models and custom call/schedule integrations to understand natural human conversations.

Amanvi AI handles customer inquiries, schedules phone calls, collects prospect data, routes priority messages, and connects A to Z operational software seamlessly. Businesses reduce human support overhead while delivering 24/7 instant responses to their clients.`,
    highlights: [
      'Call & Schedule Automation: Book discovery calls & set automated reminders',
      'Natural Conversation: Powered by fine-tuned LLMs for human-like interaction',
      'A to Z Workflow Sync: Automatically routes leads into CRM, WhatsApp, & email',
      'Enterprise Guardrails: Bank-grade data encryption and strict privacy protocols'
    ],
    metrics: [
      { label: 'Inquiries Automated', val: '85%' },
      { label: 'Call Schedule Rate', val: '3.4x' },
      { label: 'Response Latency', val: '< 1.1s' }
    ]
  },
  {
    id: 'seek',
    category: 'ai',
    title: 'Seek - AI Study Hub & Drowsiness Siren App',
    badge: 'HACKATHON WINNER · GOKARAJU RANGARAJU',
    url: 'https://seek-lac.vercel.app',
    shortDesc: 'Award-winning student portal for Gokaraju Rangaraju College featuring study materials, earning tools, and a computer vision Drowsiness Siren Alarm.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    client: 'Gokaraju Rangaraju Institute of Engineering & Technology',
    tech: 'React, Computer Vision (face-api.js), Eye Aspect Ratio (EAR), AI Search',
    story: `Built specifically for Gokaraju Rangaraju College students during their Hackathon, Seek is an all-in-one study platform designed for late-night exam preparation and academic productivity.

The highlight feature of Seek is its AI-powered Computer Vision Drowsiness Siren. When students study late into the night with their webcam enabled, the system calculates their Eye Aspect Ratio (EAR) in real-time. If a student begins nodding off or closing their eyes for prolonged intervals, Seek triggers a loud warning siren alarm—alerting them to take a short break, refresh, and resume studying safely!

Additionally, Seek provides a centralized repository for semester study materials, notes, previous year question papers, and student micro-earning opportunities.`,
    highlights: [
      'AI Drowsiness Siren Alarm: Computer vision eye tracking triggers loud alert when student falls asleep',
      'Semester Study Hub: Access notes, textbooks, & previous exam question papers',
      'Student Micro-Earning: Platform tools enabling students to earn while learning',
      'Hackathon Award Winner: Custom built for Gokaraju Rangaraju college hackathon'
    ],
    metrics: [
      { label: 'Hackathon Status', val: 'Winner' },
      { label: 'Eye Tracking FPS', val: '30 FPS' },
      { label: 'College Adoption', val: '1,500+ Users' }
    ]
  },
  {
    id: 'chanakyahighschool',
    category: 'edtech',
    title: 'Chanakya High School Portal',
    badge: 'SCHOOL ERP & DIGITAL INFO',
    url: 'https://chanakyahighschool.vercel.app',
    shortDesc: 'Complete school website and parent communication portal featuring academic programs, faculty profiles, and online admissions.',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    client: 'Chanakya Educational Society',
    tech: 'React, Node.js, Express, MongoDB',
    story: `Chanakya High School needed a modern digital home to communicate transparently with prospective parents and current students. We designed a clean, structured school management website that showcases academic excellence and simplifies school administration.

Parents can explore academic programs, faculty credentials, campus facilities, photo galleries, and official announcements online. The built-in digital enquiry module streamlines new student admissions without requiring parents to stand in physical queues.`,
    highlights: [
      'Digital Admission Enquiry: Streamlined online application submission',
      'Parent Communication: Live digital noticeboard & academic announcements',
      'Faculty & Campus Showcase: Detailed profiles of teachers, labs, & facilities',
      'Mobile Optimized: Instant loading across all smartphone browsers'
    ],
    metrics: [
      { label: 'Admissions Processed', val: '1,200+' },
      { label: 'Paper Saved', val: '90%' },
      { label: 'Uptime SLA', val: '99.9%' }
    ]
  },
  {
    id: 'balajikishoremedical',
    category: 'enterprise',
    title: 'Balaji Kishore Medical Platform',
    badge: 'HEALTHCARE & PHARMACY PORTAL',
    url: 'https://balajikishoremedical.vercel.app',
    shortDesc: 'Professional digital catalog and customer enquiry platform for medical business and pharmacy operations.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    client: 'Balaji Kishore Medicals',
    tech: 'React, Node.js, PostgreSQL',
    story: `Balaji Kishore Medicals required a trustworthy web presence to showcase their extensive pharmaceutical catalog and facilitate B2B/B2C healthcare inquiries.

We engineered a structured web platform categorized by medicine types, healthcare equipment, supplier details, and location maps. Customers can submit product inquiries directly online, accelerating order placement and customer service.`,
    highlights: [
      'Medicine Catalog: Clear categorization of pharmaceuticals & medical supplies',
      'Direct Enquiry Engine: Fast product availability request form',
      'Business Location & Contact: Integrated map navigation & direct phone line',
      'High Security: SSL encrypted data handling'
    ],
    metrics: [
      { label: 'Catalog Items', val: '2,500+' },
      { label: 'Inquiry Speed', val: 'Instant' },
      { label: 'Client Satisfaction', val: '100%' }
    ]
  },
  {
    id: 'sleepdetector',
    category: 'ai',
    title: 'React Sleep & Drowsiness Detector',
    badge: 'AI COMPUTER VISION COMPONENT',
    url: 'https://github.com/gottisaiaashish/react-sleep-detector',
    shortDesc: 'Open-source React component leveraging computer vision (face-api.js) to monitor Eye Aspect Ratio (EAR) and detect fatigue in real-time.',
    image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80',
    client: 'Open Source Community / KLAPP R&D',
    tech: 'React, face-api.js, Computer Vision, Canvas API',
    story: `Driver fatigue and student burnout are severe safety concerns. We engineered an advanced open-source AI React component that performs real-time facial landmark tracking directly inside the web browser using webcam feed.

By measuring the Eye Aspect Ratio (EAR) continuously, the component detects when eyes remain closed beyond safety thresholds—firing immediate audio alerts and callback events to prevent accidents.`,
    highlights: [
      'Real-Time Landmark Tracking: Uses face-api.js for sub-30ms facial landmark detection',
      'Eye Aspect Ratio Math: Calculates precise EAR ratios to distinguish blinking from sleeping',
      'Zero Server Dependency: Runs 100% locally inside client browser without sending video data',
      'Developer Friendly: Easy npm/component wrapper integration for React & Capacitor apps'
    ],
    metrics: [
      { label: 'Detection Speed', val: '30 FPS' },
      { label: 'Privacy', val: '100% On-Device' },
      { label: 'Accuracy', val: '95.8%' }
    ]
  },
  {
    id: 'videosplash',
    category: 'creative',
    title: 'React Capacitor Video Splash',
    badge: 'MOBILE UI & ANIMATION COMPONENT',
    url: 'https://github.com/gottisaiaashish/react-capacitor-video-splash',
    shortDesc: 'Mobile application component for React + Capacitor creating smooth 60fps animated video splash screens during app startup.',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80',
    client: 'Open Source Community / Mobile Apps',
    tech: 'React, Capacitor, iOS/Android Native Bridge',
    story: `First impressions dictate mobile app retention. Standard static splash screens feel outdated. We developed a specialized React + Capacitor component that renders seamless high-definition video splash screen animations during mobile app startup.

While the app initializes native plugins and fetches initial API data in the background, users experience a luxury branded video splash, elevating mobile app perceived quality.`,
    highlights: [
      'Native Bridge: Seamless integration with Capacitor on iOS & Android',
      'Seamless Transition: Smooth fade-out into the main application UI',
      'Background Preload: Allows initial data hydration while video plays',
      'Lightweight Asset: Optimized video player with zero frame drops'
    ],
    metrics: [
      { label: 'Frame Rate', val: '60 FPS' },
      { label: 'Load Delay', val: '0ms' },
      { label: 'App Retention', val: '+22%' }
    ]
  }
];

export default function Portfolio() {
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = filter === 'all' 
    ? projectsList 
    : projectsList.filter(p => p.category === filter);

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
            Explore live production systems built for hospitality, education, AI automation, creative media, and enterprise operations.
          </p>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '36px', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'All Work' },
            { key: 'resort', label: 'Resorts & Booking' },
            { key: 'edtech', label: 'EdTech & Admissions' },
            { key: 'ai', label: 'AI & Automation' },
            { key: 'creative', label: 'Creative & Media' },
            { key: 'enterprise', label: 'Enterprise Software' }
          ].map(f => (
            <button 
              key={f.key} 
              onClick={() => setFilter(f.key)}
              className={`btn ${filter === f.key ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 16px', fontSize: '0.8rem' }}
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
              background: linear-gradient(180deg, rgba(24,24,27,0.15) 0%, rgba(24,24,27,0.94) 80%);
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
                <p style={{ color: '#d4d4d8', fontSize: '0.85rem', marginBottom: '16px', lineHeight: '1.5' }}>{p.shortDesc}</p>
                
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => setSelectedProject(p)} 
                    className="btn"
                    style={{ background: '#ffffff', color: '#000000', padding: '8px 16px', fontSize: '0.82rem', fontWeight: '600' }}
                  >
                    Read Full Story & Case Study <i className="ri-article-line"></i>
                  </button>
                  <a 
                    href={p.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn"
                    style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', padding: '8px 14px', fontSize: '0.82rem', border: '1px solid rgba(255,255,255,0.3)' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Live Site <i className="ri-external-link-line"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FULL PAGE / LARGE EDITORIAL CASE STUDY DRAWER */}
        {selectedProject && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2500, background: 'rgba(244, 241, 234, 0.96)', backdropFilter: 'blur(16px)', overflowY: 'auto', padding: '40px 16px' }}>
            <div className="container" style={{ maxWidth: '860px', margin: '0 auto', position: 'relative' }}>
              
              {/* Close Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  CASE STUDY ARCHIVE // {selectedProject.id.toUpperCase()}
                </div>
                <button 
                  onClick={() => setSelectedProject(null)}
                  style={{ background: '#18181b', color: '#ffffff', border: 'none', borderRadius: '9999px', padding: '8px 18px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  Close Story <i className="ri-close-line"></i>
                </button>
              </div>

              {/* Header Info */}
              <div className="glass-card" style={{ padding: '36px', marginBottom: '28px', background: '#ffffff' }}>
                <span className="badge badge-cyan" style={{ marginBottom: '14px' }}>{selectedProject.badge}</span>
                <h1 style={{ fontSize: '2.8rem', fontFamily: 'var(--font-serif)', lineHeight: '1.1', color: 'var(--text-primary)', marginBottom: '12px' }}>
                  {selectedProject.title}
                </h1>
                
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '16px' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>CLIENT / INSTITUTION</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>{selectedProject.client}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>TECHNOLOGY STACK</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>{selectedProject.tech}</div>
                  </div>
                </div>
              </div>

              {/* Story Narrative Box */}
              <div className="glass-card" style={{ padding: '36px', marginBottom: '28px', background: '#ffffff' }}>
                <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="ri-book-open-line" style={{ color: 'var(--accent-dot)' }}></i> Engineering Story & Overview
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: '1.8', whiteSpace: 'pre-line', marginBottom: '28px' }}>
                  {selectedProject.story}
                </p>

                {/* Highlights List */}
                <div style={{ background: '#f9f7f2', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    ⚡ KEY TECHNICAL HIGHLIGHTS & ARCHITECTURE:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {selectedProject.highlights.map((h, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                        <i className="ri-checkbox-circle-fill" style={{ color: '#22c55e', fontSize: '1.1rem', marginTop: '2px' }}></i>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {selectedProject.metrics.map((m, i) => (
                    <div key={i} style={{ background: '#f4f1ea', padding: '16px', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>{m.val}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>{m.label}</div>
                    </div>
                  ))}
                </div>

              </div>

              {/* Action Buttons Footer */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '40px' }}>
                <a 
                  href={selectedProject.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '16px', fontSize: '0.95rem', justifyContent: 'center' }}
                >
                  Launch Production App ({selectedProject.url.replace('https://', '')}) <i className="ri-external-link-line"></i>
                </a>
                
                {selectedProject.secondaryUrl && (
                  <a 
                    href={selectedProject.secondaryUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-secondary" 
                    style={{ padding: '16px 24px', fontSize: '0.95rem' }}
                  >
                    Open Banquet Portal <i className="ri-external-link-line"></i>
                  </a>
                )}

                <a 
                  href="#contact" 
                  onClick={() => setSelectedProject(null)}
                  className="btn btn-secondary" 
                  style={{ padding: '16px 24px', fontSize: '0.95rem' }}
                >
                  Build Similar Software
                </a>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
