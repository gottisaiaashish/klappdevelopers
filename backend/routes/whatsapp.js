const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const WhatsAppChatModel = require('../models/WhatsAppChat');

// In-memory fallback if MongoDB is offline
const memoryChatsMap = new Map();

const TEAM_CHAT_PHONE = 'KLAPP-TEAM-AASHISH-MINNI';

// Default initial team chat if database is empty
const defaultTeamChat = {
  phone: TEAM_CHAT_PHONE,
  contactName: 'Aashish & Minni (Klapp Team Chat)',
  unreadCount: 0,
  statusTag: 'TEAM',
  assignedTo: 'TEAM',
  lastMessage: 'Welcome to Klapp OS Internal Live Team Chat!',
  lastMessageTime: new Date().toISOString(),
  messages: [
    {
      id: 'MSG-INIT-1',
      sender: 'AASHISH',
      text: 'Hey Minni! Internal live team messenger is active now in Klapp OS. We can chat here anytime!',
      timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
      status: 'DELIVERED'
    },
    {
      id: 'MSG-INIT-2',
      sender: 'MINNI',
      text: 'Awesome Aashish! Super clean & fast without any external apps!',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      status: 'DELIVERED'
    }
  ]
};

memoryChatsMap.set(TEAM_CHAT_PHONE, defaultTeamChat);

/**
 * GET /api/whatsapp/chats
 * Fetch internal team chats (Aashish ↔ Minni)
 */
router.get('/chats', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1 && WhatsAppChatModel) {
      let chats = await WhatsAppChatModel.find().sort({ lastMessageTime: -1 });
      if (chats.length === 0) {
        const created = await WhatsAppChatModel.create(defaultTeamChat);
        chats = [created];
      }
      return res.json({ success: true, chats });
    } else {
      const chats = Array.from(memoryChatsMap.values()).sort(
        (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
      );
      return res.json({ success: true, chats });
    }
  } catch (err) {
    console.error('Error fetching internal team chats:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/whatsapp/send
 * Send internal chat message between Aashish & Minni
 */
router.post('/send', async (req, res) => {
  try {
    const { text, sender } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, error: 'Message text is required.' });
    }

    const senderRole = (sender && sender.toUpperCase().includes('MINNI')) ? 'MINNI' : 'AASHISH';
    const newMsg = {
      id: 'MSG-TEAM-' + Date.now(),
      sender: senderRole,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      status: 'DELIVERED'
    };

    let updatedChat = null;

    if (mongoose.connection.readyState === 1 && WhatsAppChatModel) {
      updatedChat = await WhatsAppChatModel.findOneAndUpdate(
        { phone: TEAM_CHAT_PHONE },
        {
          $setOnInsert: { contactName: 'Aashish & Minni (Klapp Team Chat)' },
          $set: {
            lastMessage: text.trim(),
            lastMessageTime: new Date()
          },
          $push: { messages: newMsg }
        },
        { upsert: true, new: true }
      );
    } else {
      let chat = memoryChatsMap.get(TEAM_CHAT_PHONE) || defaultTeamChat;
      chat.messages.push(newMsg);
      chat.lastMessage = text.trim();
      chat.lastMessageTime = new Date().toISOString();
      memoryChatsMap.set(TEAM_CHAT_PHONE, chat);
      updatedChat = chat;
    }

    return res.json({ success: true, message: 'Message sent!', chat: updatedChat });
  } catch (err) {
    console.error('Error sending team message:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/whatsapp/clear
 * Clear all chat messages
 */
router.post('/clear', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1 && WhatsAppChatModel) {
      await WhatsAppChatModel.updateOne(
        { phone: TEAM_CHAT_PHONE },
        { $set: { messages: [], lastMessage: 'Chat cleared', lastMessageTime: new Date() } }
      );
    }
    const chat = memoryChatsMap.get(TEAM_CHAT_PHONE) || defaultTeamChat;
    chat.messages = [];
    chat.lastMessage = 'Chat cleared';
    chat.lastMessageTime = new Date().toISOString();
    memoryChatsMap.set(TEAM_CHAT_PHONE, chat);

    return res.json({ success: true, chat });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/whatsapp/react
 * Add or update emoji reaction on a message
 */
router.post('/react', async (req, res) => {
  try {
    const { messageId, emoji, sender } = req.body;
    if (!messageId || !emoji) {
      return res.status(400).json({ success: false, error: 'messageId and emoji required.' });
    }

    const senderRole = (sender && sender.toUpperCase().includes('MINNI')) ? 'MINNI' : 'AASHISH';
    let updatedChat = null;

    if (mongoose.connection.readyState === 1 && WhatsAppChatModel) {
      const chatDoc = await WhatsAppChatModel.findOne({ phone: TEAM_CHAT_PHONE });
      if (chatDoc && chatDoc.messages) {
        let msg = chatDoc.messages.find(m => String(m.id) === String(messageId) || String(m._id) === String(messageId));
        if (!msg && !isNaN(messageId)) {
          msg = chatDoc.messages[Number(messageId)];
        }
        if (msg) {
          msg.reaction = msg.reaction === emoji ? null : emoji;
          msg.reactionBy = senderRole;
          chatDoc.markModified('messages');
          await chatDoc.save();
          updatedChat = chatDoc;
        }
      }
    }

    if (!updatedChat) {
      const chat = memoryChatsMap.get(TEAM_CHAT_PHONE) || defaultTeamChat;
      let msg = chat.messages.find(m => String(m.id) === String(messageId));
      if (!msg && !isNaN(messageId)) {
        msg = chat.messages[Number(messageId)];
      }
      if (msg) {
        msg.reaction = msg.reaction === emoji ? null : emoji;
        msg.reactionBy = senderRole;
      }
      updatedChat = chat;
    }

    return res.json({ success: true, chat: updatedChat });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
