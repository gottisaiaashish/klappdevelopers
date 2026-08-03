import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../config/api';

/**
 * KLAPP AI - Official AI Solutions Consultant Knowledge Engine
 * Dual-Engine Architecture:
 * 1. Primary Engine: Backend API Sync & Gemini LLM Proxy Engine
 * 2. Fallback Engine: Smart Local Memory Engine
 */
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const GEMINI_SYSTEM_INSTRUCTION = `
You are KLAPP AI, the official Senior Solutions Architect for KLAPP Developers (founded by Gotti Aashish, 18 years old, 4+ yrs experience).

YOUR PERSONALITY & CONVERSATIONAL STYLE:
- Speak like a friendly, warm, ultra-intelligent human software engineer. Speak in natural English or Telish depending on how the user talks to you.
- CRITICAL SCRIPT RULE: DO NOT use raw Telugu font script characters (e.g. no Telugu alphabet font). Use ONLY English / Roman script.
- Keep answers crisp, structured, engaging, and professional. Use bullet points and clear formatting.
- DO NOT use any Markdown formatting like **bold** or *italics*. Use plain text only.
- MAINTAIN FULL CONVERSATION MEMORY (e.g., if the user previously mentioned "gym", know that any subsequent question about attendance, slots, pricing, or features refers to their Gym!).

COMPANY PORTFOLIO & CASE STUDIES:
- Nandhakam Luxury Stays (Hospitality booking engine with instant WhatsApp alerts)
- Admyra (Fashion e-commerce storefront with Razorpay gateway)
- Chanakya High School (EdTech portal with admissions & parent WhatsApp alerts)
- Balaji Kishore Medical (Pharma inventory & prescription portal)
- Amanvi AI (Autonomous AI customer service platform)
- Seek (Job search & candidate matching portal)

CRITICAL LEAD CAPTURE & CONVERSATION RULES:
1. ALWAYS warmly ask for the user's Name and WhatsApp Phone Number (or Email) during the conversation (especially after understanding their business type or explaining budget/pricing tiers).
2. DO NOT reveal internal team members' names (like Manashvini). Refer ONLY to "our team", "KLAPP Developers team", or "Founder Gotti Aashish & our engineering team".
3. When the user provides their contact details (or asks to connect), give a warm, high-converting reassurance closing line:
   "Thank you so much! 🚀 I have securely recorded our complete conversation and your project requirements. Our team will review your project details and reach out to you within 2 hours to discuss the next steps! You can also contact us directly on WhatsApp at +91 79890 33580."

SALES FUNNEL & PRICING RULES:
1. NEVER DUMP PRICES UPFRONT when a user names a business! First explain the custom features you can build for their business, mention relevant case studies, and ASK THE CLIENT FOR THEIR TARGET BUDGET.
2. When the user asks "how much it costs" without giving a budget, outline the price tiers (Starter Web App: ₹25k-35k, Custom App/Store: ₹45k-75k, Enterprise ERP & Payment Gateway: ₹50k-1.2L+) and ASK FOR THEIR TARGET BUDGET.
3. When the user states their budget:
   - ₹10,000 - ₹25,000: High-performance 1-2 page React site + WhatsApp lead capture (50% milestone available). Note: Full Razorpay Payment Gateway & Meta WhatsApp Automation require a ₹50,000+ package.
   - ₹50,000+: Full E-Commerce / Custom App with Razorpay Gateway, Custom Admin Dashboard & Meta WhatsApp API Bot.
   - ₹90,000+: Enterprise ERP & Autonomous AI Agents.
4. At the bottom of budget recommendations, offer optional growth add-ons:
   • Meta WhatsApp Cloud API Bot Setup: +₹50,000
   • High-ROI Google Search Ads & Meta Performance Marketing: +₹25,000/month
`;

const PROJECT_PORTFOLIO = {
  nandhakam: `Nandhakam Luxury Stays — Luxury hospitality website & direct booking engine with WhatsApp alerts.`,
  admyra: `Admyra — Premium fashion e-commerce storefront with Razorpay gateway & order tracking.`,
  motionbook: `MotionBook — Digital storybook platform with smooth micro-animations.`,
  chanakya: `Chanakya High School — EdTech portal with admissions & automated WhatsApp parent notifications.`,
  balaji: `Balaji Kishore Medical — Healthcare & pharma inventory portal with live stock tracking & GST invoicing.`,
  amanvi: `Amanvi AI — Autonomous AI customer service platform with Gemini RAG engine.`,
  seek: `Seek — High-performance job search & candidate matching portal.`
};

const CONSULTANT_KNOWLEDGE_BASE = {
  greeting: `Hey there! Welcome to KLAPP Developers. I'm KLAPP AI, your Senior Solutions Architect.

We build high-performance custom digital architecture and run performance marketing! What kind of business do you run? (e.g. medical shop, gym, school, hotel, grocery, salon, bakery, travel agency, real estate, hardware, or any other business?)`,

  about: `KLAPP Developers is a premier digital architecture studio founded by Gotti Aashish (18 years old, 4+ yrs experience).

We engineer 360° Digital Growth Ecosystems:
• Custom Web Apps & E-Commerce (React + Vite)
• AI Automations & Meta WhatsApp Cloud API Bots
• High-ROI Google Ads, Meta Marketing & Local SEO Growth
• Enterprise ERP Systems & Admin Portals

Proven Case Studies: Nandhakam Stays, Admyra Fashion, Chanakya School, Balaji Medical, Amanvi AI, Seek Portal.

What solution can we design for your business today?`,

  portfolio: `Here are our top client case studies:

• Nandhakam Luxury Stays: ${PROJECT_PORTFOLIO.nandhakam}
• Admyra: ${PROJECT_PORTFOLIO.admyra}
• Chanakya High School: ${PROJECT_PORTFOLIO.chanakya}
• Balaji Kishore Medical: ${PROJECT_PORTFOLIO.balaji}
• Amanvi AI: ${PROJECT_PORTFOLIO.amanvi}
• Seek Portal: ${PROJECT_PORTFOLIO.seek}

Which industry aligns best with your business?`,

  medical: `Ah, a Medical Shop & Pharmacy! Here is exactly how KLAPP Developers can transform your medical business:

• Online Medicine Ordering & Doctor Prescription Upload (Patients upload prescriptions via site or WhatsApp)
• Live Stock, Batch No. & Expiry Date Inventory Management
• Automated GST Billing & Customer WhatsApp Invoice Alerts
• Daily Sales & Expiry Analytics Dashboard

In fact, we engineered 'Balaji Kishore Medical'—a complete pharma inventory & prescription portal!

What is your target budget for this project? (Tell me your budget, and I will outline exactly what we can deliver for your medical shop within your budget!)`,

  school: `An Educational Institution! Here is how we help schools & colleges streamline operations:

• Student Online Admissions & Fee Payment Gateway
• Automated WhatsApp Parent Alerts (Attendance, Marks, Notices & Fee Receipts)
• Student Marks, ID Cards & Report Card Portal

We built 'Chanakya High School'—a complete EdTech portal serving thousands of students!

What is your target budget for this project? (Tell me your ideal budget, and I'll outline the exact portal setup we can build for your school!)`,

  hotel: `A Hotel & Hospitality business! Direct bookings save you 20-30% OTA commissions:

• Direct Room Booking Engine with Instant Razorpay/UPI Payments
• WhatsApp Booking Confirmation & PDF Voucher Alerts
• Room Availability & Seasonal Tariff Calendar Admin Dashboard

We engineered 'Nandhakam Luxury Stays'—a high-converting luxury booking engine!

What is your target budget for this project? (Tell me your ideal budget, and I'll outline the exact booking engine features we can deliver for you!)`,

  fashion: `A Fashion & Clothing Storefront! We build ultra-sleek e-commerce stores:

• Editorial UI Showcase with Sub-100ms Load Speed
• Razorpay/Stripe Payment Gateway + Cash on Delivery (COD) Flow
• Automated Order Tracking & WhatsApp Status Updates

We engineered 'Admyra'—a high-converting fashion e-commerce platform!

What is your target budget for this project? (Tell me your budget, and I'll outline what we can build for your fashion brand!)`,

  restaurant: `A Restaurant & Food Business! We help you take direct orders with zero commission:

• Digital QR Menu & Direct Online Table/Home Delivery Ordering
• WhatsApp Order Receipt & Kitchen Order Ticket (KOT) Dispatch
• Daily Sales & Menu Availability Admin Panel

What is your target budget for this project? (Tell me your ideal budget, and I'll outline what we can deliver for your food business!)`,

  realestate: `A Real Estate & Construction Company! We build lead-generating property portals:

• Property Listings & 360 Floor Plan Showcase
• Automated WhatsApp Lead Capture & Instant Brochure Dispatch
• Site Visit Booking Calendar & Agent Lead CRM

What is your target budget for this project? (Tell me your budget, and I'll outline the property portal setup for your company!)`,

  webInitial: `That's awesome! We'd love to build a high-performance website for your business.

Tell me what business you run (e.g. medical shop, gym, grocery, hotel, online store, or web app) and what your target budget is?`,

  marketing: `Yes, absolutely! KLAPP Developers offers end-to-end 360° Digital Growth & Performance Marketing:

• Google Search & Shopping Ads (Target customers actively searching for your services)
• Meta Facebook & Instagram Lead Ads (High-converting visual campaign funnels)
• Meta WhatsApp Cloud API Automation (Automated broadcast campaigns & instant lead follow-up)
• SEO & Google Business Profile Optimization (Rank #1 locally)

What is your monthly marketing budget? Tell me your budget, and I will outline the exact lead generation strategy for your business!`,

  founder: `Gotti Aashish is the Founder & Lead Digital Architect at KLAPP Developers!

He is an 18-year-old full-stack software engineer (born March 4, 2008) with 4+ years of hands-on experience.
• Personal IG: @_nanisagar_ | Official IG: @klapp.in
• Direct WhatsApp: +91 79890 33580`,

  default: `That sounds like a great project concept!

Tell me a bit more about your business, and what your target budget is, and I'll outline the exact technical setup for you!`
};

const SPECIFIC_BUSINESSES = [
  { keywords: ['gym', 'fitness', 'workout'], name: 'Gym & Fitness Center', features: 'Member subscription tracking, slot booking & WhatsApp renewal reminders' },
  { keywords: ['salon', 'spa', 'beauty', 'hair', 'parlour'], name: 'Salon & Spa', features: 'Online appointment booking calendar, staff slot management & WhatsApp appointment alerts' },
  { keywords: ['grocery', 'supermarket', 'kirana', 'provision'], name: 'Grocery & Supermarket', features: 'Online product catalog, WhatsApp delivery orders & daily stock inventory dashboard' },
  { keywords: ['bakery', 'cake', 'sweets'], name: 'Bakery & Cake Shop', features: 'Custom cake order builder, WhatsApp kitchen ticket dispatch & payment gateway' },
  { keywords: ['travel', 'tours', 'cab', 'car rental', 'taxi'], name: 'Travels & Car Rental Agency', features: 'Tour package showcase, vehicle booking engine & WhatsApp booking confirmation tickets' },
  { keywords: ['clinic', 'hospital', 'lab', 'diagnostic'], name: 'Medical Clinic & Diagnostic Lab', features: 'Doctor appointment booking, diagnostic report PDF WhatsApp download & patient portal' },
  { keywords: ['jewelry', 'gold', 'diamond'], name: 'Jewelry Store', features: 'High-end gold & diamond catalog showcase, WhatsApp price quotes & custom inquiry funnel' },
  { keywords: ['furniture', 'interior', 'decor'], name: 'Furniture & Decor Shop', features: '3D product showcase, WhatsApp custom quote builder & stock management dashboard' },
  { keywords: ['logistics', 'transport', 'courier', 'cargo'], name: 'Logistics & Transport Company', features: 'Shipment tracking portal, vehicle dispatch admin & WhatsApp delivery notifications' },
  { keywords: ['hardware', 'plywood', 'sanitary', 'cement'], name: 'Hardware & Building Supplies', features: 'Product stock catalog, WhatsApp bulk quote calculator & GST invoice generator' }
];

const AI_ROTATING_PROMPTS = [
  'Ask KLAPP AI about Web Applications...',
  'Ask about Meta WhatsApp API & Automations...',
  'Ask about Google Ads & Meta Digital Marketing...',
  'Ask about Enterprise ERP Software...'
];

export default function KlappAiModal({ isOpen, onClose, initialPrompt = '' }) {
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [sessionId, setSessionId] = useState('');
  
  // Smart Conversation Context Memory
  const [activeContext, setActiveContext] = useState(null);

  // Typewriter Loop State
  const [placeholderText, setPlaceholderText] = useState('');
  const [promptIndex, setPromptIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && !sessionId) {
      setSessionId('AISESSION-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7));
    }
  }, [isOpen, sessionId]);

  // Backend API Chat Caller with Live Session Sync & Lead Extraction
  const fetchBackendAiReply = async (userQuery, conversationHistory, activeSessionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userQuery,
          history: conversationHistory,
          sessionId: activeSessionId
        })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.reply) {
          return data.reply;
        }
      }
    } catch (err) {
      console.warn('Backend AI Chat Proxy warning:', err.message);
    }
    return null;
  };

  // Real Google Gemini API Caller (Direct Client Fallback)
  const fetchGeminiReply = async (userQuery, conversationHistory) => {
    if (!GEMINI_API_KEY) return null;

    try {
      const formattedHistory = conversationHistory.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const candidateModels = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-2.5-flash-lite', 'gemini-1.5-flash-latest'];
      for (const m of candidateModels) {
        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: {
                parts: [{ text: GEMINI_SYSTEM_INSTRUCTION }]
              },
              contents: [
                ...formattedHistory,
                { role: 'user', parts: [{ text: userQuery }] }
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 800
              }
            })
          });

          if (response.ok) {
            const data = await response.json();
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
              let text = data.candidates[0].content.parts[0].text;
              return text.replace(/\*\*/g, '').replace(/\*/g, '');
            }
          } else {
            const errData = await response.json().catch(() => ({}));
            console.warn(`[Client Gemini Error ${response.status} on model ${m}]:`, errData.error?.message || response.statusText);
          }
        } catch (e) {}
      }
      return null;
    } catch (err) {
      console.warn('Gemini API Error:', err);
      return null;
    }
  };

  // Local Rule Engine Fallback
  const getLocalReply = (query) => {
    const q = query.toLowerCase();

    let currentBizName = activeContext ? activeContext.name : null;

    if (q.includes('gym') || q.includes('fitness') || q.includes('workout')) {
      setActiveContext({ type: 'gym', name: 'Gym & Fitness Center' });
      currentBizName = 'Gym & Fitness Center';
    } else if (q.includes('medical') || q.includes('pharmacy') || q.includes('medicine') || q.includes('balaji')) {
      setActiveContext({ type: 'medical', name: 'Medical Shop & Pharmacy' });
      currentBizName = 'Medical Shop & Pharmacy';
    } else if (q.includes('school') || q.includes('college') || q.includes('edtech') || q.includes('chanakya')) {
      setActiveContext({ type: 'school', name: 'Educational Institution' });
      currentBizName = 'Educational Institution';
    } else if (q.includes('hotel') || q.includes('resort') || q.includes('nandhakam')) {
      setActiveContext({ type: 'hotel', name: 'Hotel & Hospitality' });
      currentBizName = 'Hotel & Hospitality';
    } else if (q.includes('fashion') || q.includes('boutique') || q.includes('admyra')) {
      setActiveContext({ type: 'fashion', name: 'Fashion & Clothing Store' });
      currentBizName = 'Fashion & Clothing Store';
    } else if (q.includes('restaurant') || q.includes('cafe') || q.includes('food')) {
      setActiveContext({ type: 'restaurant', name: 'Restaurant & Food Business' });
      currentBizName = 'Restaurant & Food Business';
    } else if (q.includes('real estate') || q.includes('builder') || q.includes('property')) {
      setActiveContext({ type: 'realestate', name: 'Real Estate & Construction' });
      currentBizName = 'Real Estate & Construction';
    }

    if (q.includes('how much') || q.includes('cost') || q.includes('costs') || q.includes('price') || q.includes('pricing') || q.includes('rate') || q.includes('rates') || q.includes('charge') || q.includes('fee')) {
      const bizLabel = currentBizName || 'your business';
      return `For a custom digital setup for your ${bizLabel}:

• Starter Web App: ₹25,000 to ₹35,000 (AMC: ₹2,500/mo)
• Custom App with Admin Dashboard & Features: ₹45,000 to ₹75,000 (AMC: ₹4,500/mo)
• Enterprise ERP System, Razorpay Gateway & Meta WhatsApp Bot: ₹50,000 to ₹1,20,000+ (AMC: ₹5,000+/mo)
• 50% Milestone Plan: Pay 50% to start, and 50% on final delivery!

What is your target budget for your ${bizLabel}? Tell me your budget, and I'll outline the exact deliverables we can build for you!`;
    }

    if (q.includes('attendance') || q.includes('checkin') || q.includes('check-in') || q.includes('biometric') || q.includes('daily attendance') || q.includes('member list') || q.includes('slot booking') || q.includes('qr code') || q.includes('prescription upload') || q.includes('expiry alert') || q.includes('gst billing') || q.includes('kot') || q.includes('so on') || q.includes('like that')) {
      const bizLabel = currentBizName || 'your business';
      return `Got it! Adding custom **Daily Feature Tracking & Attendance** (via QR Code scan, Biometric, or WhatsApp alerts) is a powerful feature for your ${bizLabel}!

Here is how KLAPP Developers implements this for your ${bizLabel}:
• Instant Member/Customer QR Code or ID Scan System
• Automated WhatsApp Confirmation & Activity Alerts
• Daily Attendance Log & Activity Analytics Dashboard

What is your target budget for your ${bizLabel} software setup? (Tell me your ideal budget, and I'll outline the exact deliverables we can build for you!)`;
    }

    if (q.includes('5k') || q.includes('5000') || q.includes('10k') || q.includes('10000') || q.includes('15k') || q.includes('15000') || q.includes('20k') || q.includes('20000') || q.includes('25k') || q.includes('25000') || q.includes('30k') || q.includes('30000') || q.includes('35k') || q.includes('35000') || q.includes('40k') || q.includes('40000') || q.includes('50k') || q.includes('50000') || q.includes('60k') || q.includes('70k') || q.includes('80k') || q.includes('90k') || q.includes('1 lakh') || q.includes('lakh') || q.includes('my budget is') || q.includes('budget is') || q.includes('cost is')) {
      const bizLabel = currentBizName || 'your business';

      if (q.includes('5k') || q.includes('5000') || q.includes('10k') || q.includes('10000') || q.includes('15k') || q.includes('15000') || q.includes('20k') || q.includes('20000') || q.includes('25k') || q.includes('25000')) {
        return `Awesome! With your budget of ₹10,000 - ₹25,000, YES! We can definitely build a solid high-performance setup for your ${bizLabel}:

What we will build within your budget:
• High-Performance 1-2 Page Business Landing Site (built with React + Vite for sub-100ms load speed)
• Direct WhatsApp Customer Lead Capture & Call Buttons
• Mobile-Responsive Design, Free SSL & Local SEO Setup
• 50% Milestone Plan: Pay 50% to start, and 50% upon delivery!

⚠️ Note: Full Razorpay Payment Gateway integration and Meta WhatsApp Automation bots require a minimum package of ₹50,000+.

💡 Optional Growth Add-ons (Can be added anytime):
• Meta WhatsApp Cloud API Bot Setup: +₹50,000
• High-ROI Google Search Ads & Meta Performance Marketing: +₹25,000/month

Shall we initiate your ${bizLabel} project with a 50% milestone payment?`;
      }

      return `Super! With a budget of ₹50,000+, YES! We can engineer a complete custom digital architecture for your ${bizLabel}:

What we will build within your ₹50,000+ budget:
• Full E-Commerce Storefront or Custom Business Web App for ${bizLabel} (React + Vite, sub-100ms speed)
• Official Razorpay Payment Gateway (UPI, Credit Cards, Netbanking) + COD Flow
• Official Meta WhatsApp Cloud API Bot Setup (Automated PDF receipts, order alerts & broadcasts)
• Custom Admin Panel for Operations/Stock Management & Full Source Code Ownership
• 50% Milestone Plan: Pay 50% to start, and 50% on final delivery!

💡 Optional Growth Add-ons:
• High-ROI Google Search Ads & Meta Performance Campaigns: +₹25,000/month management

Shall we schedule a quick 1-on-1 discovery session with Lead Architect Gotti Aashish to initiate your build?`;
    }

    if (q.includes('medical') || q.includes('pharmacy') || q.includes('medicine') || q.includes('balaji')) {
      return CONSULTANT_KNOWLEDGE_BASE.medical;
    }

    if (q.includes('school') || q.includes('college') || q.includes('edtech') || q.includes('chanakya')) {
      return CONSULTANT_KNOWLEDGE_BASE.school;
    }

    if (q.includes('hotel') || q.includes('resort') || q.includes('nandhakam')) {
      return CONSULTANT_KNOWLEDGE_BASE.hotel;
    }

    if (q.includes('fashion') || q.includes('boutique') || q.includes('admyra')) {
      return CONSULTANT_KNOWLEDGE_BASE.fashion;
    }

    if (q.includes('restaurant') || q.includes('cafe') || q.includes('food')) {
      return CONSULTANT_KNOWLEDGE_BASE.restaurant;
    }

    if (q.includes('real estate') || q.includes('builder') || q.includes('property')) {
      return CONSULTANT_KNOWLEDGE_BASE.realestate;
    }

    for (let biz of SPECIFIC_BUSINESSES) {
      if (biz.keywords.some(kw => q.includes(kw))) {
        setActiveContext({ type: biz.keywords[0], name: biz.name });
        return `Awesome! A ${biz.name} business! Here is exactly what KLAPP Developers can build for your ${biz.name}:

• ${biz.features}
• Sub-100ms Speed & Mobile-Responsive Design (built with React + Vite)
• Custom Admin Management Dashboard & Source Code Ownership

What is your target budget for this project? (Tell me your ideal budget, and I will outline what we can deliver for your ${biz.name} within your budget!)`;
      }
    }

    const bizPatternMatch = q.match(/(?:maku|we have|my business is|i have a|i run a)\s+([a-z0-9\s]+?)(?:\s+undi|\s+shop|\s+business|\s+store|\s+company|\s+ra|$)/i);
    if (bizPatternMatch && bizPatternMatch[1] && bizPatternMatch[1].trim().length > 2) {
      const extractedBiz = bizPatternMatch[1].trim();
      setActiveContext({ type: 'custom', name: extractedBiz });
      return `Awesome! A ${extractedBiz} business! Here is what KLAPP Developers can build for your ${extractedBiz}:

• Custom Web Application & Service Showcase (built with React + Vite for sub-100ms load speed)
• Direct WhatsApp Customer Lead Capture & Order Funnel
• Custom Admin Panel for Operations Tracking

What is your target budget for this project? (Tell me your budget, and I'll outline what we can build for your ${extractedBiz} within your budget!)`;
    }

    if (q.includes('marketing') || q.includes('google ads') || q.includes('meta ads') || q.includes('facebook ads') || q.includes('instagram ads') || q.includes('seo') || q.includes('adwords') || q.includes('leads')) {
      return CONSULTANT_KNOWLEDGE_BASE.marketing;
    }

    if (q === 'i need a website' || q.includes('need a website') || q.includes('want a website') || q.includes('build a website') || q.includes('make a site')) {
      return CONSULTANT_KNOWLEDGE_BASE.webInitial;
    }

    if (q.includes('portfolio') || q.includes('case study') || q.includes('previous work') || q.includes('nandhakam') || q.includes('admyra') || q.includes('chanakya') || q.includes('balaji') || q.includes('amanvi') || q.includes('seek')) {
      return CONSULTANT_KNOWLEDGE_BASE.portfolio;
    }

    if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('namaste') || q.includes('start')) {
      return CONSULTANT_KNOWLEDGE_BASE.greeting;
    }

    if (q.includes('whatsapp cloud') || q.includes('meta whatsapp api')) {
      return `Supercharge your business with an official Meta WhatsApp Cloud API Bot!

Features include interactive menus, automated lead capture, PDF invoice dispatch, and live agent handoff. (Meta WhatsApp Automation packages start at ₹50,000+).

What is your target budget for WhatsApp automation? Tell me your budget, and I'll outline the exact setup for you!`;
    }

    if (q.includes('autonomous agent') || q.includes('vector database') || q.includes('gemini rag')) {
      return `AI Automations & Autonomous Agents can cut your operational workload by up to 70%!

We build custom Gemini 1.5 & GPT-4o agents, vector database engines, and automated lead bots. (Custom AI Automation packages start at ₹50,000+).

What is your budget for AI automation? Tell me your target budget, and I'll outline what we can build for you!`;
    }

    if (q === 'nothing' || q === 'no' || q === 'nope' || q === 'just looking' || q === 'testing' || q === 'check') {
      return `No problem at all! Whenever you are ready to engineer a custom Web App, E-Commerce Storefront, or Meta WhatsApp Automation for your business, I'm here 24/7. Would you like to check our pricing tiers or see our client case studies?`;
    }

    if (q === 'ok' || q === 'okay' || q === 'sure' || q === 'fine' || q === 'cool' || q === 'super' || q === 'hmmm' || q === 'ha' || q === 'k') {
      return `Awesome! Tell me what business you run (e.g. gym, medical shop, school, hotel, salon, grocery, travel) or what your target budget is, and I'll outline the exact custom software setup for you!`;
    }

    if (q.includes('aashish') || q.includes('founder') || q.includes('nani') || q.includes('gotti')) {
      return CONSULTANT_KNOWLEDGE_BASE.founder;
    }

    if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('namaste') || q.includes('start')) {
      if (messages.length > 0) {
        return `Hello again! How can I assist you with your project today? Tell me what business you run or what custom software features you are looking for!`;
      }
      return CONSULTANT_KNOWLEDGE_BASE.greeting;
    }

    if (q.includes('about') || q.includes('service') || q.includes('solution') || q.includes('klapp')) {
      return CONSULTANT_KNOWLEDGE_BASE.about;
    }

    return `I'm here to help you design the perfect digital system for your business! We engineer custom React Web Apps, Admin Dashboards, Razorpay Gateways, and Meta WhatsApp Cloud API Bots. What solution or pricing details would you like to explore?`;
  };

  const processQuery = async (userQuery) => {
    if (!userQuery.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: userQuery,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const currentHistory = [...messages];
    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    let activeSessionId = sessionId;
    if (!activeSessionId) {
      activeSessionId = 'AISESSION-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
      setSessionId(activeSessionId);
    }

    // 1. Fetch Backend API Reply (handles Gemini + live session sync + lead extraction)
    let fullReplyText = await fetchBackendAiReply(userQuery, currentHistory, activeSessionId);

    // 2. Direct Gemini Fallback if backend API call was null
    if (!fullReplyText) {
      fullReplyText = await fetchGeminiReply(userQuery, currentHistory);
    }

    // 3. Fallback to Smart Local Engine if Gemini call returned null
    if (!fullReplyText) {
      fullReplyText = getLocalReply(userQuery);
    }

    setIsThinking(false);
    const aiMsgId = Date.now() + 1;

    const aiMsg = {
      id: aiMsgId,
      sender: 'ai',
      text: '',
      isTyping: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, aiMsg]);

    // 3. Snappy Smooth Streaming Typewriter Animation (2 chars per 12ms)
    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex < fullReplyText.length) {
        charIndex += Math.min(2, fullReplyText.length - charIndex);
        const currentText = fullReplyText.slice(0, charIndex);
        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsgId ? { ...m, text: currentText } : m))
        );
      } else {
        clearInterval(typingInterval);
        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsgId ? { ...m, isTyping: false } : m))
        );
      }
    }, 12);
  };

  useEffect(() => {
    if (isOpen && initialPrompt) {
      setMessages([]);
      setActiveContext(null);
      processQuery(initialPrompt);
    } else if (isOpen && !initialPrompt) {
      setMessages([]);
      setActiveContext(null);
    }
  }, [isOpen, initialPrompt]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim() || isThinking) return;
    const q = inputVal;
    setInputVal('');
    processQuery(q);
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveContext(null);
    setInputVal('');
    setSessionId('AISESSION-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7));
  };

  if (!isOpen) return null;

  return (
    <div className="klapp-editorial-ai-page">
      <style>{`
        .klapp-editorial-ai-page {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100dvh;
          z-index: 999999;
          background-color: var(--bg-primary);
          background-image: 
            radial-gradient(#d5d0c4 0.75px, transparent 0.75px),
            radial-gradient(#d5d0c4 0.75px, #f4f1ea 0.75px);
          background-size: 30px 30px;
          background-position: 0 0, 15px 15px;
          color: var(--text-primary);
          display: flex;
          font-family: var(--font-sans);
          overflow: hidden;
          animation: slideUpFull 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Editorial Left Sidebar */
        .editorial-sidebar {
          width: 280px;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          padding: 24px 18px;
          flex-shrink: 0;
        }

        .sidebar-brand-box {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .sidebar-brand-title {
          font-family: var(--font-sans);
          font-weight: 800;
          font-size: 1.05rem;
          color: var(--text-primary);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .new-chat-pill {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 12px 18px;
          border-radius: 9999px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 28px;
          box-shadow: var(--shadow-soft);
        }
        .new-chat-pill:hover {
          background: #ffffff;
          border-color: var(--border-highlight);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
        }

        .sidebar-tag {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--text-muted);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 12px;
          padding-left: 4px;
        }

        .preset-topics-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
          overflow-y: auto;
        }

        .topic-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 12px;
          color: var(--text-secondary);
          font-family: var(--font-sans);
          font-size: 0.88rem;
          font-weight: 500;
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
        }
        .topic-btn:hover {
          background: rgba(0, 0, 0, 0.05);
          border-color: var(--border-color);
          color: var(--text-primary);
        }

        .sidebar-footer-box {
          padding-top: 20px;
          border-top: 1px solid var(--border-color);
        }

        /* Main Workspace Canvas */
        .editorial-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: transparent;
          position: relative;
        }

        .editorial-topbar {
          height: 64px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          background: rgba(244, 241, 234, 0.94);
          backdrop-filter: blur(16px);
        }

        .close-btn-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.05);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .close-btn-circle:hover {
          background: #18181b;
          color: #ffffff;
        }

        /* Chat Feed Area */
        .chat-feed-container {
          flex: 1;
          overflow-y: auto;
          padding: 40px 0 160px 0;
          display: flex;
          flex-direction: column;
        }

        .feed-max-width {
          max-width: 840px;
          width: 100%;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Welcome Screen */
        .welcome-center {
          text-align: center;
          padding: 40px 0;
        }

        .welcome-serif-title {
          font-family: var(--font-sans);
          font-size: 2.8rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          margin-bottom: 12px;
          line-height: 1.1;
        }

        .welcome-subtitle {
          font-size: 1.02rem;
          color: var(--text-secondary);
          max-width: 540px;
          margin: 0 auto 40px auto;
          line-height: 1.6;
        }

        .prompt-cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          text-align: left;
        }

        .editorial-prompt-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 18px;
          padding: 24px;
          cursor: pointer;
          box-shadow: var(--shadow-soft);
          transition: all 0.25s ease;
        }
        .editorial-prompt-card:hover {
          background: var(--bg-card-hover);
          border-color: var(--border-highlight);
          transform: translateY(-2px);
          box-shadow: 0 14px 32px rgba(0, 0, 0, 0.06);
        }

        .prompt-card-title {
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .prompt-card-desc {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Pure Stream Message Blocks */
        .message-block {
          margin-bottom: 28px;
          display: flex;
          flex-direction: column;
        }

        .user-msg-block {
          align-items: flex-end;
        }

        .ai-msg-block {
          align-items: flex-start;
        }

        /* User Right Aligned Message Bubble */
        .user-bubble-box {
          background: #18181b;
          color: #ffffff;
          padding: 14px 22px;
          border-radius: 22px 22px 4px 22px;
          font-family: var(--font-sans);
          font-size: 0.98rem;
          font-weight: 500;
          line-height: 1.6;
          max-width: 75%;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
        }

        /* AI Pure Canvas Stream (NO BOX CONTAINER / NO DABA!) */
        .ai-response-stream {
          width: 100%;
          max-width: 780px;
          background: transparent;
          border: none;
          padding: 8px 0;
          box-shadow: none;
        }

        .ai-human-text {
          font-family: var(--font-sans);
          font-size: 1.02rem;
          color: var(--text-primary);
          line-height: 1.75;
          white-space: pre-line;
        }

        .typing-cursor {
          display: inline-block;
          font-weight: 700;
          color: var(--accent-dot);
          margin-left: 3px;
          animation: blinkCursor 0.7s infinite;
        }

        @keyframes blinkCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        /* Thinking Indicator */
        .thinking-box {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(0, 0, 0, 0.04);
          border: 1px solid var(--border-color);
          padding: 10px 18px;
          border-radius: 30px;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .thinking-dots {
          display: flex;
          gap: 4px;
        }
        .thinking-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent-dot);
          animation: dotPulse 1.4s infinite ease-in-out both;
        }
        .thinking-dot:nth-child(1) { animation-delay: -0.32s; }
        .thinking-dot:nth-child(2) { animation-delay: -0.16s; }

        /* Floating Input Bar */
        .floating-input-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px 24px 32px 24px;
          background: linear-gradient(180deg, transparent 0%, var(--bg-primary) 50%);
          display: flex;
          justify-content: center;
        }

        .input-pill-container {
          max-width: 840px;
          width: 100%;
          background: #eae5db;
          border: 1px solid var(--border-color);
          border-radius: 9999px;
          padding: 6px 8px 6px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
          transition: border-color 0.2s ease;
        }
        .input-pill-container:focus-within {
          border-color: var(--border-highlight);
        }

        .editorial-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: 0.95rem;
          font-family: var(--font-sans);
        }
        .editorial-input::placeholder {
          color: var(--text-muted);
        }

        @keyframes slideUpFull {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        /* Hide mobile brand by default (desktop) */
        .mobile-brand {
          display: none;
        }

        @media (max-width: 768px) {
          /* Hide sidebar on mobile */
          .editorial-sidebar {
            display: none;
          }

          /* Mobile topbar — show brand */
          .editorial-topbar {
            padding: 0 16px;
            height: 56px;
          }
          .mobile-brand {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .mobile-brand-name {
            font-family: var(--font-sans);
            font-weight: 800;
            font-size: 1rem;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--text-primary);
          }
          .mobile-brand-badge {
            font-family: var(--font-mono);
            font-size: 0.65rem;
            color: var(--text-muted);
            background: rgba(0,0,0,0.06);
            border-radius: 6px;
            padding: 2px 6px;
            letter-spacing: 0.05em;
          }

          /* Welcome screen compact */
          .welcome-center {
            padding: 20px 0 10px 0;
          }
          .welcome-serif-title {
            font-size: 1.65rem;
            margin-bottom: 8px;
          }
          .welcome-subtitle {
            font-size: 0.88rem;
            margin-bottom: 20px;
          }

          /* Prompt cards — 2 cols compact on mobile */
          .prompt-cards-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
          .editorial-prompt-card {
            padding: 14px;
            border-radius: 14px;
          }
          .prompt-card-title {
            font-size: 0.88rem;
            margin-bottom: 4px;
          }
          .prompt-card-desc {
            font-size: 0.78rem;
            line-height: 1.4;
          }

          /* Chat feed padding */
          .chat-feed-container {
            padding: 16px 0 130px 0;
          }
          .feed-max-width {
            padding: 0 14px;
          }

          /* User bubble */
          .user-bubble-box {
            max-width: 88%;
            font-size: 0.92rem;
            padding: 12px 16px;
          }

          /* AI text */
          .ai-human-text {
            font-size: 0.94rem;
          }

          /* Input bar compact */
          .floating-input-bar {
            padding: 12px 12px 24px 12px;
          }
          .input-pill-container {
            padding: 5px 6px 5px 16px;
          }
          .editorial-input {
            font-size: 0.88rem;
          }
        }
      `}</style>

      {/* Left Sidebar */}
      <aside className="editorial-sidebar">
        <div className="sidebar-brand-box">
          <div>
            <div className="sidebar-brand-title">KLAPP DEVELOPERS</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.08em', marginTop: '2px' }}>
              KLAPP AI 2.0
            </div>
          </div>
        </div>

        <button className="new-chat-pill" onClick={handleNewChat}>
          <span>+ New Architecture Chat</span>
          <i className="ri-edit-box-line"></i>
        </button>

        <div className="sidebar-tag">RECOMMENDED TOPICS</div>
        <div className="preset-topics-list">
          <button className="topic-btn" onClick={() => processQuery('Web App & E-Commerce Architecture')}>
            <i className="ri-global-line"></i> Web Applications
          </button>
          <button className="topic-btn" onClick={() => processQuery('Google Ads & Meta Digital Marketing')}>
            <i className="ri-line-chart-line"></i> Google Ads & Marketing
          </button>
          <button className="topic-btn" onClick={() => processQuery('Official Meta WhatsApp Cloud API')}>
            <i className="ri-whatsapp-line"></i> WhatsApp API
          </button>
          <button className="topic-btn" onClick={() => processQuery('AI Automations & Autonomous Agents')}>
            <i className="ri-sparkling-line"></i> AI Automations
          </button>
          <button className="topic-btn" onClick={() => processQuery('Enterprise ERP & Business Systems')}>
            <i className="ri-dashboard-3-line"></i> Enterprise ERP
          </button>
          <button className="topic-btn" onClick={() => processQuery('Show Portfolio Case Studies')}>
            <i className="ri-folder-user-line"></i> Client Case Studies
          </button>
          <button className="topic-btn" onClick={() => processQuery('Who is Gotti Aashish?')}>
            <i className="ri-user-3-line"></i> Founder Gotti Aashish
          </button>
        </div>

        <div className="sidebar-footer-box">
          <button className="btn btn-secondary" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
            <i className="ri-arrow-left-line"></i> Back to KLAPP Site
          </button>
        </div>
      </aside>

      {/* Main Workspace Canvas */}
      <main className="editorial-main">
        {/* Topbar */}
        <header className="editorial-topbar">
          <div className="mobile-brand">
            <span className="mobile-brand-name">KLAPP AI</span>
            <span className="mobile-brand-badge">2.0</span>
          </div>

          <button className="close-btn-circle" onClick={onClose} title="Close AI Assistant">
            <i className="ri-close-line"></i>
          </button>
        </header>

        {/* Chat Feed */}
        <div className="chat-feed-container">
          <div className="feed-max-width">
            {messages.length === 0 ? (
              <div className="welcome-center">
                <div className="section-tag" style={{ justifyContent: 'center', marginBottom: '16px' }}>
                  <span className="section-tag-dot"></span> KLAPP AI INTELLIGENT ENGINE
                </div>
                <h1 className="welcome-serif-title">What can KLAPP AI build for you?</h1>
                <p className="welcome-subtitle">
                  Consult our architectural engine for instant technical recommendations, scope analysis, and pricing estimates.
                </p>

                <div className="prompt-cards-grid">
                  <div className="editorial-prompt-card" onClick={() => processQuery('Build an e-commerce React web app with sub-100ms load speed')}>
                    <div className="prompt-card-title">Web & E-Commerce App</div>
                    <div className="prompt-card-desc">React, Vite, sub-100ms load speed & custom payment gateways.</div>
                  </div>

                  <div className="editorial-prompt-card" onClick={() => processQuery('Automate customer onboarding with AI WhatsApp Bot')}>
                    <div className="prompt-card-title">AI & WhatsApp Bot</div>
                    <div className="prompt-card-desc">Official Meta API, automated lead funnels & CRM database sync.</div>
                  </div>

                  <div className="editorial-prompt-card" onClick={() => processQuery('Run Google Ads and Meta Marketing for my business')}>
                    <div className="prompt-card-title">Google Ads & Marketing</div>
                    <div className="prompt-card-desc">High-ROI Google Search Ads, Meta Instagram marketing & SEO.</div>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`message-block ${msg.sender === 'user' ? 'user-msg-block' : 'ai-msg-block'}`}>
                  {msg.sender === 'user' ? (
                    <div className="user-bubble-box">{msg.text}</div>
                  ) : (
                    <div className="ai-response-stream">
                      <div className="ai-human-text">
                        {msg.text}
                        {msg.isTyping && <span className="typing-cursor">|</span>}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Thinking Indicator */}
            {isThinking && (
              <div className="message-block ai-msg-block">
                <div className="thinking-box">
                  <i className="ri-brain-line"></i>
                  <span>KLAPP AI is analyzing architecture</span>
                  <div className="thinking-dots">
                    <div className="thinking-dot"></div>
                    <div className="thinking-dot"></div>
                    <div className="thinking-dot"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Floating Input Bar */}
        <div className="floating-input-bar">
          <form className="input-pill-container" onSubmit={handleSubmit}>
            <i className="ri-sparkling-fill" style={{ color: 'var(--accent-dot)', fontSize: '1.1rem' }}></i>
            <input 
              type="text"
              className="editorial-input"
              placeholder={placeholderText || 'Ask KLAPP AI anything about web apps, Google Ads, WhatsApp...'}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.82rem' }}>
              Ask <i className="ri-arrow-right-line"></i>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
