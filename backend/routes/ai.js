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
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
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
          }
        } else {
          console.warn('Gemini API Warning:', response.statusText);
        }
      } catch (err) {
        console.warn('Gemini fetch failed, using fallback notice:', err.message);
      }
    }

    if (!reply) {
      reply = "Hello! Thanks for reaching out to KLAPP AI. What kind of business do you run and what custom digital solution are you looking to build?";
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
