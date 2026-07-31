import React, { useState } from 'react';

const realProjects = [
  {
    id: 'nandhakam',
    category: 'booking',
    title: 'Nandhakam Luxury Rooms & Banquet Hall',
    url: 'https://nandakambanquethall.com',
    shortDesc: 'Dual-portal luxury rooms & banquet hall management platform with automated WhatsApp guest confirmations and owner revenue analytics.',
    client: 'Nandhakam Hospitality Group',
    tech: 'React, Vite, WhatsApp Cloud API, PostgreSQL, Node.js',
    overview: `Nandhakam was engineered to replace manual registers and phone booking confusion for a luxury rooms & banquet hall venue. We built a complete digital hospitality platform split into two dedicated applications: a Guest Booking Engine and an Owner/Reception Command Center.

On the Customer Side: Guests can explore available luxury rooms and banquet slots, verify live availability in real-time, select check-in/out dates, and complete bookings online. The moment a booking is confirmed, an automated WhatsApp Cloud API webhook triggers: sending an instant booking confirmation pass to the guest while simultaneously firing an instant WhatsApp notification to the owner's phone.

On the Owner & Reception Dashboard: The management team has complete operational control with a live room matrix, daily/upcoming/cancelled booking tracking, monthly & yearly revenue analytics, occupancy reports, staff scheduling, and instant bill generation.`,
    highlights: [
      'Customer Booking Engine: Live room availability matrix, date picker & online checkout',
      'Instant Dual WhatsApp Webhooks: Simultaneous guest digital tickets & instant owner phone alerts',
      'Owner Command Dashboard: Revenue analytics (monthly/yearly), occupancy reports & staff manager',
      'Banquet Hall Management: Dedicated portal for event slot reservations & advance payment tracking'
    ],
    metrics: [
      { label: 'Portals Delivered', val: '2 Portals' },
      { label: 'Direct Bookings', val: '+180%' },
      { label: 'System Latency', val: '< 50ms' }
    ]
  },
  {
    id: 'admyra',
    category: 'edtech',
    title: 'Admyra EAPCET & College Predictor',
    url: 'https://www.admyra.in',
    shortDesc: 'Data-driven EAPCET engineering college predictor platform helping students calculate rank odds, cutoff history, and placement stats.',
    client: 'Admyra Student Network',
    tech: 'React, Vite, EAPCET Analytics Engine, Node.js',
    overview: `Choosing the right engineering college after EAPCET exams is often stressful and based on guesswork. We built Admyra as an all-in-one data-driven admission guide for engineering aspirants in Telangana and Andhra Pradesh.

Using expected marks, Admyra predicts student rank probabilities and correlates them against historical category, gender, local area reservation, and cutoff trends. Students gain instant access to an exhaustive college directory with detailed profiles, fee structures, branch availability, historical closing ranks, average placement packages, and authentic campus reviews.

Additionally, Admyra guides students step-by-step through counselling certificate verification, web options strategies, and seat allotment procedures—empowering thousands of students to make informed admission decisions instead of guessing.`,
    highlights: [
      'EAPCET Rank Predictor: Real-time rank estimation derived from expected student marks',
      'Smart College Predictor: Filtered by category, gender, local area, & historical closing ranks',
      'Complete College DB: Placement stats, average salary packages, fees, & branch availability',
      'Counselling Guidance: Step-by-step web options walkthrough & certificate verification steps'
    ],
    metrics: [
      { label: 'Students Guided', val: '50,000+' },
      { label: 'Prediction Precision', val: '96.4%' },
      { label: 'Lighthouse Score', val: '99/100' }
    ]
  },
  {
    id: 'motionbook',
    category: 'creative',
    title: 'MotionBook Interactive QR Albums',
    url: 'https://motionbook.vercel.app',
    shortDesc: 'QR-coded interactive digital album experience bridging physical wedding albums with dynamic high-resolution photo & video galleries.',
    client: 'MotionBook Studios',
    tech: 'React, Motion Engines, WebGL, Cloud Storage',
    overview: `Physical wedding and event photo albums are traditional keepsakes, but they are static and unable to play videos or capture the true motion of special moments. We created MotionBook to modernize event memory preservation by combining physical print albums with immersive digital experiences.

Each physical photo album features a beautifully printed QR code on its cover. When scanned by couples or guests using any smartphone camera, a dedicated web experience launches instantly—displaying high-definition photo galleries, video highlight reels, and interactive flip memories.

MotionBook enables families to relive their celebration memories anytime, anywhere, on any modern device.`,
    highlights: [
      'Physical QR Code Integration: Printed inside physical wedding albums for instant mobile scanning',
      'Hybrid Photo & Video Player: High-definition video highlight reels & photo carousels',
      'Cloud Memory Archive: Secure digital storage accessible globally without app installs',
      'Interactive Flip Engine: Ultra-smooth 60fps touch gesture animations'
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
    url: 'https://amanvi-ai.vercel.app',
    shortDesc: 'Autonomous conversational AI assistant capable of scheduling calls, answering inquiries, and connecting A to Z business workflows.',
    client: 'Amanvi AI Labs',
    tech: 'OpenAI GPT-4o, LLM Orchestration, Python, Webhooks',
    overview: `Amanvi AI was engineered to automate complex customer inquiries, call scheduling, and operational tasks autonomously using Large Language Models.

Unlike basic rigid chatbots, Amanvi AI understands natural conversational context. It assists prospective clients by answering detailed questions, scheduling discovery calls, gathering lead specifications, and executing automated follow-ups. Furthermore, Amanvi connects A to Z business software—syncing customer interaction data directly with CRM databases, WhatsApp API webhooks, and team calendars.`,
    highlights: [
      'Call & Schedule Automation: Automated discovery call booking & calendar notifications',
      'Conversational AI Intelligence: Fine-tuned LLM engine providing natural human-like responses',
      'A to Z Workflow Integration: Syncs lead data automatically to CRM, email, & WhatsApp',
      'Enterprise Guardrails: Strict data encryption ensuring corporate privacy'
    ],
    metrics: [
      { label: 'Inquiries Automated', val: '85%' },
      { label: 'Call Schedule Rate', val: '3.4x' },
      { label: 'Response Speed', val: '< 1.1s' }
    ]
  },
  {
    id: 'seek',
    category: 'ai',
    title: 'Seek - AI Study Hub & Drowsiness Siren App',
    url: 'https://seek-lac.vercel.app',
    shortDesc: 'Award-winning student portal for Gokaraju Rangaraju College featuring study materials, earning tools, and a computer vision Drowsiness Siren Alarm.',
    client: 'Gokaraju Rangaraju Institute of Engineering & Technology',
    tech: 'React, Computer Vision (face-api.js), Eye Aspect Ratio (EAR), AI Search',
    overview: `Engineered specifically for Gokaraju Rangaraju College students during their Hackathon, Seek is an innovative academic productivity hub tailored for late-night exam preparation.

The standout feature of Seek is its AI Computer Vision Drowsiness Warning Siren. When a student is studying late at night with their webcam active, the application tracks facial landmarks and calculates their Eye Aspect Ratio (EAR) in real-time. If the student nods off or closes their eyes for a prolonged duration due to fatigue, Seek triggers a loud warning siren alarm—reminding the student to take a short rest break, refresh, and resume studying safely!

Additionally, Seek acts as a centralized repository for semester study materials, lecture notes, previous year question papers, and student micro-earning tools.`,
    highlights: [
      'AI Drowsiness Warning Siren: Computer vision eye tracking triggers loud alert when student falls asleep',
      'Semester Study Hub: Access notes, textbooks, & previous exam question papers',
      'Student Micro-Earning: Platform tools enabling students to earn while learning',
      'Hackathon Winner: Custom built for Gokaraju Rangaraju college hackathon competition'
    ],
    metrics: [
      { label: 'Hackathon Award', val: '1st Place' },
      { label: 'Eye Tracking Speed', val: '30 FPS' },
      { label: 'College Users', val: '1,500+' }
    ]
  },
  {
    id: 'chanakyahighschool',
    category: 'edtech',
    title: 'Chanakya High School Portal',
    url: 'https://chanakyahighschool.vercel.app',
    shortDesc: 'Complete school website and parent communication portal featuring academic programs, faculty profiles, and online admissions.',
    client: 'Chanakya Educational Society',
    tech: 'React, Node.js, Express, MongoDB',
    overview: `Chanakya High School needed a modern digital platform to present school information online and streamline parent communication.

We designed a comprehensive school management website featuring detailed insights into academic programs, faculty qualifications, campus facilities, photo galleries, and official announcements. The online enquiry portal allows prospective parents to apply for admissions digitally without waiting in campus queues.`,
    highlights: [
      'Online Admission Enquiry: Streamlined digital application submission',
      'Parent Communication: Live announcement board & academic updates',
      'Campus Showcase: Highlighting labs, library, sports, & faculty credentials',
      'Mobile Optimized: Sub-100ms loading on mobile browsers'
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
    url: 'https://balajikishoremedical.vercel.app',
    shortDesc: 'Professional digital catalog and customer enquiry platform for medical business and pharmacy operations.',
    client: 'Balaji Kishore Medicals',
    tech: 'React, Node.js, PostgreSQL',
    overview: `Balaji Kishore Medicals required a clean, professional web portal to display their medical product categories and facilitate customer enquiries.

We engineered a structured healthcare catalog featuring clear medicine categories, product descriptions, business credentials, and direct enquiry forms. Customers and healthcare partners can quickly request product availability and connect directly with the medical team.`,
    highlights: [
      'Medicine Catalog: Organized healthcare products & pharmaceutical categories',
      'Direct Product Enquiry: Quick availability request form for customers',
      'Business Location & Info: Direct phone line & map navigation',
      'Data Security: Encrypted enquiry transmission'
    ],
    metrics: [
      { label: 'Catalog Items', val: '2,500+' },
      { label: 'Inquiry Speed', val: 'Instant' },
      { label: 'Client Rating', val: '5.0 / 5' }
    ]
  }
];

export default function Portfolio() {
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

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
            Explore production applications built for luxury hospitality, educational platforms, AI automation, creative media, and enterprise healthcare.
          </p>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '36px', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'All Work' },
            { key: 'booking', label: 'Rooms & Booking' },
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

        {/* Project Cards Grid - Single Clean Action Button */}
        <div className="portfolio-grid">
          <style>{`
            .portfolio-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 24px;
            }
            .editorial-p-card {
              background: var(--bg-card);
              border: 1px solid var(--border-color);
              border-radius: 16px;
              padding: 28px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              box-shadow: var(--shadow-soft);
              transition: all 0.25s ease;
            }
            .editorial-p-card:hover {
              border-color: var(--border-highlight);
              background: var(--bg-card-hover);
              transform: translateY(-2px);
              box-shadow: 0 16px 36px rgba(0, 0, 0, 0.08);
            }
            .p-card-title {
              font-family: var(--font-serif);
              font-weight: 400;
              font-size: 1.6rem;
              color: var(--text-primary);
              margin-bottom: 12px;
              line-height: 1.15;
            }
            .p-card-desc {
              color: var(--text-secondary);
              font-size: 0.9rem;
              line-height: 1.6;
              margin-bottom: 24px;
            }
          `}</style>

          {filteredProjects.map(p => (
            <div key={p.id} className="editorial-p-card">
              <div>
                <h3 className="p-card-title">{p.title}</h3>
                <p className="p-card-desc">{p.shortDesc}</p>
              </div>

              <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <button 
                  onClick={() => setSelectedProject(p)} 
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '10px 16px', fontSize: '0.85rem', justifyContent: 'center' }}
                >
                  More <i className="ri-arrow-right-line"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* SLEEK SEAMLESS EDITORIAL CASE STUDY VIEW WITH DIRECT LINKS INSIDE */}
        {selectedProject && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2500, background: '#f4f1ea', overflowY: 'auto', padding: '40px 20px' }}>
            <div style={{ maxWidth: '820px', margin: '0 auto' }}>
              
              {/* Back Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '16px' }}>
                <button 
                  onClick={() => setSelectedProject(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '0.92rem', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <i className="ri-arrow-left-line" style={{ fontSize: '1.2rem' }}></i> Back to All Projects
                </button>

                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  CASE STUDY // {selectedProject.id.toUpperCase()}
                </span>
              </div>

              {/* Title Section */}
              <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '3.2rem', fontFamily: 'var(--font-serif)', fontWeight: '400', lineHeight: '1.08', color: 'var(--text-primary)', marginBottom: '20px' }}>
                  {selectedProject.title}
                </h1>

                {/* Metadata Row */}
                <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', borderTop: '1px solid rgba(0,0,0,0.08)', borderBottom: '1px solid rgba(0,0,0,0.08)', padding: '16px 0' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>CLIENT / ENTITY</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', marginTop: '2px' }}>{selectedProject.client}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>STACK USED</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', marginTop: '2px' }}>{selectedProject.tech}</div>
                  </div>
                </div>
              </div>

              {/* Overview & Highlights */}
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', fontWeight: '400', color: 'var(--text-primary)', marginBottom: '16px' }}>
                  Project Overview
                </h3>
                
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '32px', whiteSpace: 'pre-line' }}>
                  {selectedProject.overview}
                </p>

                {/* Technical Highlights */}
                <div style={{ background: '#eae6dd', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    ⚡ KEY FEATURES DELIVERED:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {selectedProject.highlights.map((h, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                        <i className="ri-checkbox-circle-fill" style={{ color: '#15803d', fontSize: '1.1rem', marginTop: '2px' }}></i>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
                  {selectedProject.metrics.map((m, i) => (
                    <div key={i} style={{ background: '#ffffff', padding: '20px 16px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.08)' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>{m.val}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Bar - Clean 2 Pill Buttons Only */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '28px', marginBottom: '40px' }}>
                <a 
                  href={selectedProject.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary" 
                  style={{ padding: '12px 24px', fontSize: '0.88rem', fontWeight: '600', whiteSpace: 'nowrap' }}
                >
                  Visit Website <i className="ri-external-link-line"></i>
                </a>

                <button 
                  onClick={() => setSelectedProject(null)}
                  className="btn btn-secondary" 
                  style={{ padding: '12px 24px', fontSize: '0.88rem', fontWeight: '600', whiteSpace: 'nowrap' }}
                >
                  Close <i className="ri-close-line"></i>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
