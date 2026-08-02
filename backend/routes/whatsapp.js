const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const WhatsAppChatModel = require('../models/WhatsAppChat');

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const TEAM_PHONE = '917989033580';
const LEGACY_PHONES = ['KLAPP-TEAM-AASHISH-MINNI', '918247758835', 'DEFAULT'];

function formatPhone(phone) {
  if (!phone || LEGACY_PHONES.includes(String(phone).trim())) return TEAM_PHONE;
  return String(phone).trim();
}

function isMongoUp() {
  return mongoose.connection.readyState === 1 && WhatsAppChatModel;
}

// Seed document — only the contact record, no sample messages
function buildSeedContact() {
  return {
    phone: TEAM_PHONE,
    contactName: 'Manashvini (Minni)',
    email: 'minni@klappdevelopers.in',
    serviceInterest: 'Klapp Growth & Operations Lead',
    statusTag: 'TEAM',
    unreadCount: 0,
    assignedTo: 'AASHISH',
    lastMessage: '',
    lastMessageTime: new Date(),
    messages: []
  };
}

// One-time legacy key cleanup at startup (runs once after MongoDB connects)
let legacyCleanupDone = false;
async function runLegacyCleanup() {
  if (legacyCleanupDone || !isMongoUp()) return;
  legacyCleanupDone = true;
  try {
    await WhatsAppChatModel.deleteMany({ phone: { $in: LEGACY_PHONES } });
    console.log('[WhatsApp] Legacy key cleanup done');
  } catch (e) {
    console.error('[WhatsApp] Legacy cleanup error:', e.message);
  }
}

// ---------------------------------------------------------------------------
// GET /api/whatsapp/chats  – return all active chat threads
// ---------------------------------------------------------------------------
router.get('/chats', async (req, res) => {
  try {
    await runLegacyCleanup();

    if (!isMongoUp()) {
      return res.json({ success: true, chats: [] });
    }

    let chats = await WhatsAppChatModel.find().sort({ lastMessageTime: -1 });

    // First-run: if no contacts exist yet, seed the Aashish-Minni thread
    if (chats.length === 0) {
      const created = await WhatsAppChatModel.create(buildSeedContact());
      chats = [created];
    }

    return res.json({ success: true, chats });
  } catch (err) {
    console.error('[GET /chats] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------------
// DELETE /api/whatsapp/chat/:phone  – delete a contact thread
// ---------------------------------------------------------------------------
router.delete('/chat/:phone', async (req, res) => {
  try {
    const targetPhone = formatPhone(req.params.phone);
    if (isMongoUp()) {
      await WhatsAppChatModel.deleteOne({ phone: targetPhone });
    }
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------------
// POST /api/whatsapp/send  – append a message to a thread
// ---------------------------------------------------------------------------
router.post('/send', async (req, res) => {
  try {
    const { phone, text, sender, contactName } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, error: 'Message text is required.' });
    }

    const targetPhone = formatPhone(phone);
    const senderRole = (sender && sender.toUpperCase().includes('MINNI')) ? 'MINNI' : 'AASHISH';

    const newMsg = {
      id: 'MSG-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      sender: senderRole,
      text: text.trim(),
      timestamp: new Date(),
      status: 'DELIVERED'
    };

    if (!isMongoUp()) {
      return res.status(503).json({ success: false, error: 'Database not available.' });
    }

    // Determine the right contactName to store (don't overwrite with the display alias)
    // contactName from frontend is the DISPLAY name (e.g. "Gotti Aashish" for Minni's view)
    // We always store the CANONICAL contactName = 'Manashvini (Minni)' for the team thread
    const canonicalName = contactName && contactName !== 'Gotti Aashish' && contactName !== 'Manashvini (Minni)'
      ? contactName
      : undefined; // don't overwrite for team thread — it's set in seed

    const setFields = {
      lastMessage: text.trim(),
      lastMessageTime: new Date()
    };

    const updatedChat = await WhatsAppChatModel.findOneAndUpdate(
      { phone: targetPhone },
      {
        $setOnInsert: {
          contactName: canonicalName || 'Manashvini (Minni)',
          email: '',
          serviceInterest: 'Klapp Growth & Operations Lead',
          statusTag: 'TEAM',
          assignedTo: 'AASHISH'
        },
        $set: setFields,
        $inc: { unreadCount: 1 },
        $push: { messages: newMsg }
      },
      { upsert: true, new: true }
    );

    return res.json({ success: true, message: 'Sent!', chat: updatedChat });
  } catch (err) {
    console.error('[POST /send] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------------
// POST /api/whatsapp/clear  – wipe all messages from a thread
// ---------------------------------------------------------------------------
router.post('/clear', async (req, res) => {
  try {
    const targetPhone = formatPhone(req.body.phone);
    if (isMongoUp()) {
      await WhatsAppChatModel.updateOne(
        { phone: targetPhone },
        { $set: { messages: [], lastMessage: '', lastMessageTime: new Date(), unreadCount: 0 } }
      );
    }
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------------
// POST /api/whatsapp/react  – toggle emoji reaction on a message
// ---------------------------------------------------------------------------
router.post('/react', async (req, res) => {
  try {
    const { phone, messageId, emoji, sender } = req.body;
    if (!emoji) return res.status(400).json({ success: false, error: 'Emoji required.' });

    const targetPhone = formatPhone(phone);
    const senderRole = (sender && sender.toUpperCase().includes('MINNI')) ? 'MINNI' : 'AASHISH';

    if (!isMongoUp()) return res.json({ success: false, error: 'DB unavailable' });

    const chatDoc = await WhatsAppChatModel.findOne({ phone: targetPhone });
    if (!chatDoc) return res.json({ success: false, error: 'Chat not found' });

    let msg = chatDoc.messages.find(m => String(m.id) === String(messageId) || String(m._id) === String(messageId));
    if (!msg && !isNaN(messageId)) msg = chatDoc.messages[Number(messageId)];

    if (msg) {
      msg.reaction = msg.reaction === emoji ? null : emoji;
      msg.reactionBy = senderRole;
      chatDoc.markModified('messages');
      await chatDoc.save();
    }

    return res.json({ success: true, chat: chatDoc });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------------
// POST /api/whatsapp/read  – mark thread as read (reset unread count & set message status to READ)
// ---------------------------------------------------------------------------
router.post('/read', async (req, res) => {
  try {
    const { phone, reader } = req.body;
    const targetPhone = formatPhone(phone);
    const readerRole = (reader && String(reader).toUpperCase().includes('MINNI')) ? 'MINNI' : 'AASHISH';

    if (isMongoUp()) {
      const chatDoc = await WhatsAppChatModel.findOne({ phone: targetPhone });
      if (chatDoc) {
        let modified = false;
        chatDoc.unreadCount = 0;
        if (Array.isArray(chatDoc.messages)) {
          chatDoc.messages.forEach(msg => {
            if (msg.sender !== readerRole && msg.status !== 'READ') {
              msg.status = 'READ';
              modified = true;
            }
          });
        }
        if (modified) {
          chatDoc.markModified('messages');
        }
        await chatDoc.save();
      }
    }
    return res.json({ success: true });
  } catch (err) {
    console.error('[POST /read] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------------
// POST /api/whatsapp/contact  – add/update a contact thread
// ---------------------------------------------------------------------------
router.post('/contact', async (req, res) => {
  try {
    const { phone, contactName } = req.body;
    if (!phone) return res.status(400).json({ success: false, error: 'Phone required.' });

    const targetPhone = formatPhone(phone);
    if (!isMongoUp()) return res.status(503).json({ success: false, error: 'DB unavailable.' });

    const chat = await WhatsAppChatModel.findOneAndUpdate(
      { phone: targetPhone },
      {
        $setOnInsert: {
          contactName: contactName || 'New Contact',
          statusTag: 'TEAM',
          unreadCount: 0,
          assignedTo: 'AASHISH',
          lastMessage: '',
          lastMessageTime: new Date(),
          messages: []
        }
      },
      { upsert: true, new: true }
    );

    return res.json({ success: true, chat });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
