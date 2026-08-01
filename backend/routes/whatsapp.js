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

// Initial seed dummy chats for instant testing in portal
function getInitialSeedChats() {
  return [
    {
      phone: '918247758835',
      contactName: 'Aashish (Klapp Tech Lead)',
      email: 'aashish@klappdevelopers.in',
      serviceInterest: 'Full Stack App & AI',
      statusTag: 'HOT_LEAD',
      unreadCount: 1,
      assignedTo: 'AASHISH',
      lastMessage: 'Portal WhatsApp integration is live now!',
      lastMessageTime: new Date(Date.now() - 5 * 60000).toISOString(),
      messages: [
        {
          id: 'MSG-101',
          sender: 'CUSTOMER',
          text: 'Hi Klapp Team! Want to integrate WhatsApp inbox on our business portal.',
          timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
          status: 'READ'
        },
        {
          id: 'MSG-102',
          sender: 'AASHISH',
          text: 'Portal WhatsApp integration is live now!',
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
          status: 'DELIVERED'
        }
      ]
    },
    {
      phone: '917989033580',
      contactName: 'Minni (Klapp Growth Lead)',
      email: 'minni@klappdevelopers.in',
      serviceInterest: 'Client Ops & Marketing',
      statusTag: 'CLIENT',
      unreadCount: 0,
      assignedTo: 'MINNI',
      lastMessage: 'Checking incoming lead inquiries from Instagram & Web.',
      lastMessageTime: new Date(Date.now() - 25 * 60000).toISOString(),
      messages: [
        {
          id: 'MSG-201',
          sender: 'MINNI',
          text: 'Checking incoming lead inquiries from Instagram & Web.',
          timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
          status: 'READ'
        }
      ]
    }
  ];
}

// Initialize seed data into memory if empty
if (memoryChatsMap.size === 0) {
  getInitialSeedChats().forEach(c => memoryChatsMap.set(c.phone, c));
}

/**
 * GET /api/whatsapp/chats
 * Get all active WhatsApp conversations
 */
router.get('/chats', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1 && WhatsAppChatModel) {
      let chats = await WhatsAppChatModel.find().sort({ lastMessageTime: -1 });
      if (chats.length === 0) {
        // Insert initial seed chats into DB
        chats = await WhatsAppChatModel.insertMany(getInitialSeedChats());
      }
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
    if (webhookUrl) {
      try {
        const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
        fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
    const { phone, from, text, message, contactName, mediaUrl } = req.body;
    const rawPhone = phone || from;
    const msgText = text || message;

    if (!rawPhone || !msgText) {
      return res.status(400).json({ success: false, error: 'Incoming payload requires phone and text.' });
    }

    const formattedPhone = formatPhone(rawPhone);
    const incomingMsg = {
      id: 'MSG-IN-' + Date.now(),
      sender: 'CUSTOMER',
      text: String(msgText).trim(),
      timestamp: new Date().toISOString(),
      status: 'DELIVERED',
      mediaUrl: mediaUrl || null
    };

    let updatedChat = null;

    if (mongoose.connection.readyState === 1 && WhatsAppChatModel) {
      updatedChat = await WhatsAppChatModel.findOneAndUpdate(
        { phone: formattedPhone },
        {
          $setOnInsert: { contactName: contactName || `Inquiry (${formattedPhone})` },
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
          contactName: contactName || `Inquiry (${formattedPhone})`,
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
