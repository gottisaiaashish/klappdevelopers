const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

let WhatsAppChatModel = null;
try {
  WhatsAppChatModel = require('../models/WhatsAppChat');
} catch (e) {}

// Fallback in-memory storage if MongoDB is not active
const memoryChatsMap = new Map();

// Helper to normalize phone numbers
function formatPhone(phone) {
  if (!phone) return '';
  let cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.length === 10) cleaned = '91' + cleaned;
  return cleaned;
}

/**
 * GET /api/whatsapp/chats
 * Get all active WhatsApp conversations
 */
router.get('/chats', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1 && WhatsAppChatModel) {
      const chats = await WhatsAppChatModel.find().sort({ lastMessageTime: -1 });
      return res.json({ success: true, chats });
    } else {
      const chats = Array.from(memoryChatsMap.values()).sort(
        (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
      );
      return res.json({ success: true, chats });
    }
  } catch (err) {
    console.error('Error fetching WhatsApp chats:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/whatsapp/send
 * Send an outgoing WhatsApp message to a customer from portal
 */
router.post('/send', async (req, res) => {
  try {
    const { phone, text, sender = 'AASHISH', contactName } = req.body;

    if (!phone || !text) {
      return res.status(400).json({ success: false, error: 'Phone and text are required.' });
    }

    const formattedPhone = formatPhone(phone);
    const newMsg = {
      id: 'MSG-' + Date.now(),
      sender: sender.toUpperCase(),
      text: text.trim(),
      timestamp: new Date().toISOString(),
      status: 'SENT'
    };

    let updatedChat = null;

    if (mongoose.connection.readyState === 1 && WhatsAppChatModel) {
      updatedChat = await WhatsAppChatModel.findOneAndUpdate(
        { phone: formattedPhone },
        {
          $setOnInsert: { contactName: contactName || `Client (${formattedPhone})` },
          $set: {
            lastMessage: text.trim(),
            lastMessageTime: new Date()
          },
          $push: { messages: newMsg }
        },
        { upsert: true, new: true }
      );
    } else {
      let chat = memoryChatsMap.get(formattedPhone);
      if (!chat) {
        chat = {
          phone: formattedPhone,
          contactName: contactName || `Client (${formattedPhone})`,
          unreadCount: 0,
          statusTag: 'NEW',
          assignedTo: sender,
          lastMessage: text.trim(),
          lastMessageTime: new Date().toISOString(),
          messages: []
        };
      }
      chat.messages.push(newMsg);
      chat.lastMessage = text.trim();
      chat.lastMessageTime = new Date().toISOString();
      memoryChatsMap.set(formattedPhone, chat);
      updatedChat = chat;
    }

    // Forward to Periskope / WhatsApp API Webhook if configured
    const webhookUrl = process.env.PERISKOPE_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL;
    const apiKey = process.env.PERISKOPE_API_KEY;
    if (webhookUrl) {
      try {
        const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
        const headers = { 'Content-Type': 'application/json' };
        if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
        fetch(webhookUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            event: 'OUTBOUND_MESSAGE',
            to: formattedPhone,
            message: text.trim(),
            sender: sender,
            timestamp: new Date().toISOString()
          })
        }).catch(err => console.warn('⚠️ Webhook forwarding error:', err.message));
      } catch (e) {}
    }

    return res.json({ success: true, message: 'WhatsApp message sent!', chat: updatedChat });
  } catch (err) {
    console.error('Error sending WhatsApp message:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/whatsapp/inbound
 * Webhook endpoint for receiving incoming WhatsApp messages from Periskope / Meta / n8n
 */
router.post('/inbound', async (req, res) => {
  try {
    console.log('📥 INBOUND WEBHOOK HIT WITH BODY:', JSON.stringify(req.body));

    let rawPhone = req.body.phone || req.body.from || req.body.to || req.body.chat_id;
    let msgText = req.body.text || req.body.message || req.body.body || req.body.content;
    let cName = req.body.contactName || req.body.name;
    const mediaUrl = req.body.mediaUrl || null;

    // Parse Periskope nested structures: { event: "message.created", data: { ... } }
    if (req.body && req.body.data) {
      const d = req.body.data;
      if (typeof d === 'string') msgText = msgText || d;

      if (d.message) {
        msgText = d.message.text || d.message.body || d.message.content || msgText;
        if (d.message.chat) {
          rawPhone = d.message.chat.phone || d.message.chat.id || d.message.chat.phone_number || rawPhone;
          cName = d.message.chat.name || d.message.chat.contact_name || cName;
        }
        if (d.message.sender) {
          rawPhone = rawPhone || d.message.sender.phone || d.message.sender.phone_number;
          cName = cName || d.message.sender.name;
        }
      }
      if (d.chat) {
        rawPhone = rawPhone || d.chat.phone || d.chat.id || d.chat.phone_number;
        cName = cName || d.chat.name;
      }
      if (d.sender) {
        rawPhone = rawPhone || d.sender.phone || d.sender.phone_number;
        cName = cName || d.sender.name;
      }
      if (d.phone || d.from) {
        rawPhone = rawPhone || d.phone || d.from;
      }
      if (d.text || d.body || d.content) {
        msgText = msgText || d.text || d.body || d.content;
      }
    }

    if (!rawPhone || !msgText) {
      return res.status(400).json({ success: false, error: 'Incoming payload requires phone and text.' });
    }

    const formattedPhone = formatPhone(rawPhone);

    let senderType = 'CUSTOMER';
    if (req.body && req.body.data && req.body.data.message) {
      const m = req.body.data.message;
      if (m.direction === 'outbound' || m.is_from_me === true || m.from_me === true) {
        senderType = 'MINNI';
      }
    }

    const incomingMsg = {
      id: 'MSG-IN-' + Date.now(),
      sender: senderType,
      text: String(msgText).trim(),
      timestamp: new Date().toISOString(),
      status: 'DELIVERED',
      mediaUrl: mediaUrl || null
    };

    let updatedChat = null;

    const contactName = cName || req.body.contactName || req.body.name || `Inquiry (${formattedPhone})`;

    if (mongoose.connection.readyState === 1 && WhatsAppChatModel) {
      updatedChat = await WhatsAppChatModel.findOneAndUpdate(
        { phone: formattedPhone },
        {
          $setOnInsert: { contactName: contactName },
          $set: {
            lastMessage: String(msgText).trim(),
            lastMessageTime: new Date()
          },
          $inc: { unreadCount: 1 },
          $push: { messages: incomingMsg }
        },
        { upsert: true, new: true }
      );
    } else {
      let chat = memoryChatsMap.get(formattedPhone);
      if (!chat) {
        chat = {
          phone: formattedPhone,
          contactName: contactName,
          unreadCount: 0,
          statusTag: 'HOT_LEAD',
          assignedTo: 'UNASSIGNED',
          lastMessage: String(msgText).trim(),
          lastMessageTime: new Date().toISOString(),
          messages: []
        };
      }
      chat.unreadCount = (chat.unreadCount || 0) + 1;
      chat.messages.push(incomingMsg);
      chat.lastMessage = String(msgText).trim();
      chat.lastMessageTime = new Date().toISOString();
      memoryChatsMap.set(formattedPhone, chat);
      updatedChat = chat;
    }

    console.log(`💬 Inbound WhatsApp message received from ${formattedPhone}: "${msgText}"`);
    return res.json({ success: true, message: 'Inbound message processed', chat: updatedChat });
  } catch (err) {
    console.error('Error processing inbound WhatsApp message:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/whatsapp/read
 * Mark chat messages as read
 */
router.post('/read', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, error: 'Phone required.' });

    const formattedPhone = formatPhone(phone);
    if (mongoose.connection.readyState === 1 && WhatsAppChatModel) {
      await WhatsAppChatModel.updateOne({ phone: formattedPhone }, { $set: { unreadCount: 0 } });
    } else {
      const chat = memoryChatsMap.get(formattedPhone);
      if (chat) chat.unreadCount = 0;
    }
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
