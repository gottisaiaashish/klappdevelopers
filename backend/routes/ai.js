const express = require('express');
const router = express.Router();
const storage = require('../services/storage');
const notifier = require('../services/notifier');

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'klapp_admin_secret_2026';

function requireAdminAuth(req, res, next) {
  const token = req.headers['authorization'] || req.headers['x-admin-token'] || req.query.token;
  if (token === `Bearer ${ADMIN_SECRET_KEY}` || token === ADMIN_SECRET_KEY || token === 'klapp_admin_token_04160416' || token === 'klapp_admin_token_minni') {
    return next();
  }
  return res.status(401).json({
    success: false,
    error: 'Unauthorized access. Valid admin session required.'
  });
}

const GEMINI_SYSTEM_INSTRUCTION = `
You are KLAPP AI, the official Senior Solutions Architect for KLAPP Developers (founded by Gotti Aashish, 18 years old, 4+ yrs experience).

YOUR PERSONALITY & CONVERSATIONAL STYLE:
- Speak like a friendly, warm, ultra-intelligent human software engineer. Speak in natural English or Telish depending on how the user talks to you.
- CRITICAL SCRIPT RULE: DO NOT use raw Telugu font script characters (e.g. no Telugu alphabet font). Use ONLY English / Roman script.
- Keep answers crisp, structured, engaging, and professional. Use bullet points and clear formatting.
- DO NOT use any Markdown formatting like **bold** or *italics*. Use plain text only.
- MAINTAIN FULL CONVERSATION MEMORY.

COMPANY PORTFOLIO & CASE STUDIES:
- Nandhakam Luxury Stays (Hospitality booking engine with instant WhatsApp alerts)
- Admyra (Fashion e-commerce storefront with Razorpay gateway)
- Chanakya High School (EdTech portal with admissions & parent WhatsApp alerts)
- Balaji Kishore Medical (Pharma inventory & prescription portal)
- Amanvi AI (Autonomous AI customer service platform)
- Seek (Job search & candidate matching portal)

PRICING & PACKAGES:
- Starter Web App: ₹25,000 - ₹35,000
- Custom App & Admin Dashboard: ₹45,000 - ₹75,000
- Enterprise ERP & Meta WhatsApp Bot: ₹50,000 - ₹1,20,000+

CRITICAL LEAD CAPTURE & CONVERSATION RULES:
1. ALWAYS warmly ask for the user's Name and WhatsApp Phone Number (or Email) during the conversation (especially after understanding their business type or explaining budget/pricing tiers).
2. DO NOT reveal internal team members' names (like Manashvini). Refer ONLY to "our team", "KLAPP Developers team", or "Founder Gotti Aashish & our engineering team".
3. When the user provides their contact details (or asks to connect), give a warm, high-converting reassurance closing line:
   "Thank you so much! 🚀 I have securely recorded our complete conversation and your project requirements. Our team will review your project details and reach out to you within 2 hours to discuss the next steps! You can also contact us directly on WhatsApp at +91 79890 33580."
`;

/**
 * Regex helper to extract phone numbers and emails
 */
function extractContactDetails(text, historyMessages = []) {
  const fullText = [text, ...historyMessages.map(m => m.text)].join('\n');

  // Phone regex (Indian 10-digit formats with optional +91/0)
  const phoneMatch = fullText.match(/(?:\+?91[\-\s]?)?[6-9]\d{9}\b/);
  // Email regex
  const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);

  // Business type regex hints
  const bizMatch = fullText.match(/(?:gym|fitness|medical|pharmacy|school|college|hotel|resort|restaurant|fashion|boutique|real estate|grocery|bakery|travel|clinic|salon|furniture|hardware)\b/i);

  // Budget regex hints
  const budgetMatch = fullText.match(/(?:₹?\d{1,2}(?:,\d{3})*(?:\s*k|\s*000)?|\b\d+\s*lakh\b)/i);

  return {
    phone: phoneMatch ? phoneMatch[0].replace(/\s+/g, '') : null,
    email: emailMatch ? emailMatch[0] : null,
    businessType: bizMatch ? bizMatch[0] : 'Custom App / Business',
    budget: budgetMatch ? budgetMatch[0] : 'Not Stated'
  };
}

/**
 * Smart contextual fallback reply engine when Gemini API is rate-limited or unavailable
 */
function generateSmartFallbackReply(message, history = []) {
  const q = (message || '').toLowerCase();

  const phoneMatch = q.match(/(?:\+?91[\-\s]?)?[6-9]\d{9}\b/);
  const emailMatch = q.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (phoneMatch || emailMatch) {
    const contactInfo = phoneMatch ? phoneMatch[0] : emailMatch[0];
    return `Thank you so much! 🚀 I have securely recorded your contact details (${contactInfo}) and project requirements. Our founder Gotti Aashish & the KLAPP Developers team will review your project details and reach out to you within 2 hours to discuss the next steps! You can also contact us directly on WhatsApp at +91 79890 33580.`;
  }

  if (q.includes('panichedhedhi') || q.includes('panichesthalenu') || q.includes('work aithaledhu') || q.includes('work avvatledu') || q.includes('problem') || q.includes('issue')) {
    return `I am fully active and online now! 🚀 How can I help you today? Tell me what kind of business you run (e.g. gym, medical shop, school, hotel, salon, e-commerce) or what software/website features you need!`;
  }

  if (q.includes('kavali') || q.includes('kavalani') || q.includes('veynuko') || q.includes('website') || q.includes('app') || q.includes('software')) {
    if (q.includes('cost') || q.includes('price') || q.includes('budget') || q.includes('pricing') || q.includes('entha')) {
      return `Here is KLAPP Developers official pricing structure:\n\n• Starter Web App: ₹25,000 - ₹35,000\n• Custom App & Admin Dashboard: ₹45,000 - ₹75,000\n• Enterprise ERP & Meta WhatsApp Cloud API Bot: ₹50,000 - ₹1,20,000+\n• 50% Milestone Plan: Pay 50% upfront to start, 50% on final delivery!\n\nWhat is your target budget for your project? Tell me your budget, and I will outline the exact features we will build for you!`;
    }
    return `We can engineer a sub-100ms superfast React Web App & Custom Admin Dashboard for your business at KLAPP Developers!\n\nWhat type of business do you run (e.g. Gym, Medical Shop, Hotel, School, Grocery, Fashion, Salon, Travels)? What is your target budget?`;
  }

  if (q.includes('cost') || q.includes('pricing') || q.includes('price') || q.includes('budget') || q.includes('rate') || q.includes('entha') || q.includes('how much')) {
    return `Here is KLAPP Developers official pricing structure:\n\n• Starter Web App: ₹25,000 - ₹35,000\n• Custom App & Admin Dashboard: ₹45,000 - ₹75,000\n• Enterprise ERP & Meta WhatsApp Cloud API Bot: ₹50,000 - ₹1,20,000+\n• 50% Milestone Plan: Pay 50% upfront to start, 50% on final delivery!\n\nWhat is your target budget for your project? Tell me your budget, and I will outline the exact features we will build for you!`;
  }

  if (q.includes('time') || q.includes('days') || q.includes('eppudu') || q.includes('when')) {
    return `Our engineering delivery speed is ultra-fast:\n• Standard Web Apps: 3 to 5 business days\n• E-Commerce & Admin Portals: 7 to 10 business days\n\nShare your business requirements and WhatsApp phone number, and we can initiate your project today!`;
  }

  if (q.includes('gym') || q.includes('fitness') || q.includes('workout')) {
    return `Awesome! For a Gym & Fitness Center, we build:\n• Member Attendance & Subscription Tracking (QR Scan / Biometric)\n• Automated WhatsApp Fee Renewal Alerts & Payment Gateway\n• Admin Member Dashboard & Revenue Analytics\n\nWhat is your target budget for this gym software setup?`;
  }

  if (q.includes('medical') || q.includes('pharmacy') || q.includes('medicine') || q.includes('balaji')) {
    return `Awesome! For a Medical Shop & Pharmacy (like our case study 'Balaji Kishore Medical'):\n• Online Prescription Upload & Customer Order Funnel\n• Live Stock, Expiry Date & Batch No. Inventory Tracking\n• GST Invoicing & WhatsApp Receipt Dispatch\n\nWhat is your target budget for your medical shop software?`;
  }

  if (q.includes('school') || q.includes('college') || q.includes('chanakya')) {
    return `For Educational Institutions (like our case study 'Chanakya High School'):\n• Online Student Admissions & Fee Payment Gateway\n• Automated WhatsApp Parent Notifications (Attendance, Notices & Fees)\n• Student ID & Report Card Management\n\nWhat is your target budget for your school portal?`;
  }

  if (q.includes('hotel') || q.includes('resort') || q.includes('nandhakam')) {
    return `For Hotels & Hospitality (like our case study 'Nandhakam Luxury Stays'):\n• Direct Booking Engine (Save 20-30% OTA commissions!)\n• Instant Razorpay/UPI Payments & WhatsApp Booking Vouchers\n• Seasonal Tariff & Room Availability Admin Dashboard\n\nWhat is your target budget for your hotel booking engine?`;
  }

  if (q.includes('fashion') || q.includes('boutique') || q.includes('admyra')) {
    return `For Fashion & Clothing Stores (like our case study 'Admyra'):\n• Editorial Showcase with Sub-100ms Load Speed\n• Razorpay Payment Gateway + Cash on Delivery (COD)\n• Automated Order Tracking & WhatsApp Status Updates\n\nWhat is your target budget for your fashion brand?`;
  }

  if (q.includes('salon') || q.includes('spa') || q.includes('parlour')) {
    return `For Salons & Spas:\n• Online Appointment Booking Calendar & Staff Slot Management\n• Instant WhatsApp Appointment Reminders & Customer CRM\n\nWhat is your target budget for your salon setup?`;
  }

  if (q.includes('restaurant') || q.includes('food') || q.includes('cafe')) {
    return `For Restaurants & Food Businesses:\n• Digital QR Menu & Direct Online Ordering (Zero Commission!)\n• Kitchen Order Ticket (KOT) Dispatch & WhatsApp Invoices\n\nWhat is your target budget for your restaurant ordering system?`;
  }

  if (q.includes('real estate') || q.includes('property') || q.includes('builder')) {
    return `For Real Estate Companies:\n• Property Listings & 360 Floor Plan Showcase\n• Automated WhatsApp Lead Capture & Brochure Dispatch\n\nWhat is your target budget for your real estate portal?`;
  }

  if (q === 'nothing' || q === 'no' || q === 'nope' || q === 'just looking' || q === 'testing' || q === 'check') {
    return `No problem at all! Whenever you are ready to engineer a custom Web App, E-Commerce Storefront, or Meta WhatsApp Automation for your business, I'm here 24/7. Would you like to check our pricing tiers or see our client case studies?`;
  }

  if (q === 'ok' || q === 'okay' || q === 'sure' || q === 'fine' || q === 'cool' || q === 'super' || q === 'hmmm' || q === 'ha' || q === 'k') {
    return `Awesome! Tell me what business you run (e.g. gym, medical shop, school, hotel, salon, grocery, travel) or what your target budget is, and I'll outline the exact custom software setup for you!`;
  }

  if (q.includes('aashish') || q.includes('founder') || q.includes('gotti') || q.includes('who built')) {
    return `Gotti Aashish is the Founder & Lead Digital Architect at KLAPP Developers! He is an 18-year-old software engineer with 4+ years of hands-on experience. Direct WhatsApp: +91 79890 33580.`;
  }

  if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('namaste') || q.includes('start')) {
    if (Array.isArray(history) && history.length > 0) {
      return `Hello again! How can I assist you with your project today? Tell me what business you run or what custom software features you are looking for!`;
    }
    return `Hey there! Welcome to KLAPP Developers. I'm KLAPP AI, your Senior Solutions Architect. We build high-performance custom web applications, admin dashboards, and Meta WhatsApp bots. What kind of business do you run?`;
  }

  return `I'm here to help you design the perfect digital system for your business! We engineer custom React Web Apps, Admin Dashboards, Razorpay Gateways, and Meta WhatsApp Cloud API Bots. What solution or pricing details would you like to explore?`;
}


/**
 * @route   POST /api/ai/chat
 * @desc    Secure proxy endpoint for Gemini AI Chat & Live Session Sync
 * @access  Public
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, history, sessionId: incomingSessionId } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'Message is required.' });
    }

    const sessionId = incomingSessionId || ('AISESSION-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7));
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const formattedHistory = Array.isArray(history) ? history.map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    })) : [];

    let reply = null;

    if (apiKey) {
      const candidateModels = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-2.5-flash-lite', 'gemini-1.5-flash-latest'];
      for (const m of candidateModels) {
        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: GEMINI_SYSTEM_INSTRUCTION }] },
              contents: [
                ...formattedHistory,
                { role: 'user', parts: [{ text: message }] }
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
              reply = data.candidates[0].content.parts[0].text.replace(/\*\*/g, '').replace(/\*/g, '');
              break;
            }
          }
        } catch (err) {
          console.warn(`Gemini model ${m} fetch failed:`, err.message);
        }
      }
    }

    if (!reply) {
      reply = generateSmartFallbackReply(message, history);
    }

    // Build message thread array for session storage
    const updatedMessages = Array.isArray(history) ? [...history] : [];
    updatedMessages.push({
      id: 'USER-' + Date.now(),
      sender: 'user',
      text: message,
      time: nowTime,
      timestamp: new Date()
    });
    updatedMessages.push({
      id: 'AI-' + (Date.now() + 1),
      sender: 'ai',
      text: reply,
      time: nowTime,
      timestamp: new Date()
    });

    // Contact extraction & Inquiry creation logic
    const extracted = extractContactDetails(message, Array.isArray(history) ? history : []);
    const contactStr = [extracted.phone, extracted.email].filter(Boolean).join(' / ');

    let sessionStatus = 'ACTIVE';
    let inquiryRecord = null;

    if (extracted.phone || extracted.email) {
      sessionStatus = 'LEAD_CAPTURED';

      // Auto-save Inquiry to database if contact info present
      try {
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
        inquiryRecord = await storage.saveInquiry({
          name: 'KLAPP AI Lead (' + (extracted.phone || 'Web Visitor') + ')',
          email: extracted.phone || extracted.email || 'ai-lead@klappdevelopers.in',
          service: 'KLAPP AI Lead — ' + extracted.businessType,
          message: `🔥 Lead Captured via KLAPP AI Chat!\n• Contact: ${contactStr}\n• Business: ${extracted.businessType}\n• Budget: ${extracted.budget}\n• Session ID: ${sessionId}\n• Latest User Msg: "${message}"`,
          ip: clientIp
        });

        notifier.notifyNewInquiry(inquiryRecord);
      } catch (e) {
        console.warn('Failed to auto-create inquiry from AI session:', e.message);
      }
    }

    // Save/Update AI Chat Session to storage & MongoDB
    await storage.saveOrUpdateAiSession({
      sessionId,
      clientName: extracted.phone ? `Lead (${extracted.phone})` : 'Anonymous Visitor',
      contact: contactStr,
      businessType: extracted.businessType,
      budget: extracted.budget,
      status: sessionStatus,
      messages: updatedMessages,
      inquiryId: inquiryRecord ? inquiryRecord.id : null
    });

    return res.json({
      success: true,
      reply,
      sessionId,
      status: sessionStatus,
      extracted
    });

  } catch (err) {
    console.error('Error in AI Chat proxy:', err);
    return res.status(500).json({ success: false, error: 'Internal Server Error.' });
  }
});

/**
 * @route   GET /api/ai/sessions
 * @desc    Fetch all AI Chat Sessions (Admin Portal API)
 * @access  Protected
 */
router.get('/sessions', requireAdminAuth, async (req, res) => {
  try {
    const sessions = await storage.getAllAiSessions();
    return res.json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (err) {
    console.error('Error fetching AI Sessions:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * @route   DELETE /api/ai/session/:sessionId
 * @desc    Delete an AI Chat Session log by Session ID
 * @access  Protected
 */
router.delete('/session/:sessionId', requireAdminAuth, async (req, res) => {
  try {
    const deleted = await storage.deleteAiSession(req.params.sessionId);
    if (!deleted) return res.status(404).json({ success: false, error: 'Session not found' });
    return res.json({ success: true, message: 'AI Chat Session deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
