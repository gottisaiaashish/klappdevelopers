const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const WhatsAppChatModel = require('../models/WhatsAppChat');

// In-memory fallback map if MongoDB is offline
const memoryChatsMap = new Map();

// Helper to format phone / contactId
function formatPhone(phone) {
  if (!phone || phone === 'KLAPP-TEAM-AASHISH-MINNI' || phone === '918247758835' || phone === 'DEFAULT') {
    return '917989033580';
  }
  return String(phone).trim();
}

// Initial default seed contacts for Aashish & Minni
function getDefaultSeedChats() {
  return [
    {
      phone: '917989033580',
      contactName: 'Manashvini (Minni)',
      email: 'minni@klappdevelopers.in',
      serviceInterest: 'Klapp Growth & Operations Lead',
      statusTag: 'TEAM',
      unreadCount: 0,
      assignedTo: 'AASHISH',
      lastMessage: 'Welcome to Klapp OS Messenger!',
      lastMessageTime: new Date().toISOString(),
      messages: [
        {
          id: 'MSG-INIT-1',
          sender: 'AASHISH',
          text: 'Hey Minni! Klapp Messenger is active. We can chat here anytime!',
          timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
          status: 'DELIVERED'
        },
        {
          id: 'MSG-INIT-2',
          sender: 'MINNI',
          text: 'Awesome Aashish! Super clean & fast 1-on-1 team chat!',
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
          status: 'DELIVERED'
        }
      ]
    }
  ];
}

// Initialize seed data into memory if empty
if (memoryChatsMap.size === 0) {
  getDefaultSeedChats().forEach(c => memoryChatsMap.set(c.phone, c));
}

/**
 * GET /api/whatsapp/chats
 * Get all active contacts and team chat threads
 */
router.get('/chats', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1 && WhatsAppChatModel) {
      // Clean up legacy keys to keep single unified thread
      await WhatsAppChatModel.deleteMany({ phone: { $in: ['KLAPP-TEAM-AASHISH-MINNI', '918247758835'] } });

      let chats = await WhatsAppChatModel.find({ phone: { $nin: ['KLAPP-TEAM-AASHISH-MINNI', '918247758835'] } }).sort({ lastMessageTime: -1 });
      if (chats.length === 0) {
        chats = await WhatsAppChatModel.insertMany(getDefaultSeedChats());
      }
      return res.json({ success: true, chats });
    } else {
      memoryChatsMap.delete('KLAPP-TEAM-AASHISH-MINNI');
      memoryChatsMap.delete('918247758835');

      const chats = Array.from(memoryChatsMap.values()).sort(
        (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
      );
      return res.json({ success: true, chats });
    }
  } catch (err) {
    console.error('Error fetching chats:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/whatsapp/chat/:phone
 * Delete a specific contact chat thread
 */
router.delete('/chat/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    const targetPhone = formatPhone(phone);

    if (mongoose.connection.readyState === 1 && WhatsAppChatModel) {
      await WhatsAppChatModel.deleteOne({ phone: targetPhone });
    }
    memoryChatsMap.delete(targetPhone);

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/whatsapp/send
 * Send message to a specific contact chat thread
 */
router.post('/send', async (req, res) => {
  try {
    const { phone, text, sender, contactName } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, error: 'Message text is required.' });
    }

    const targetPhone = formatPhone(phone || '917989033580');
    const senderRole = (sender && sender.toUpperCase().includes('MINNI')) ? 'MINNI' : 'AASHISH';

    const newMsg = {
      id: 'MSG-' + Date.now(),
      sender: senderRole,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      status: 'DELIVERED'
    };

    let updatedChat = null;

    if (mongoose.connection.readyState === 1 && WhatsAppChatModel) {
      try {
        const updateData = {
          lastMessage: text.trim(),
          lastMessageTime: new Date()
        };
        if (contactName) updateData.contactName = contactName;

        updatedChat = await WhatsAppChatModel.findOneAndUpdate(
          { phone: targetPhone },
          {
            $setOnInsert: {
              contactName: contactName || (senderRole === 'AASHISH' ? 'Manashvini (Minni)' : 'Gotti Aashish')
            },
            $set: updateData,
            $inc: { unreadCount: 1 },
            $push: { messages: newMsg }
          },
          { upsert: true, new: true }
        );
      } catch (dbErr) {
        console.error('MongoDB push error:', dbErr);
      }
    }

    // Always keep memory map in sync as fallback
    let memChat = memoryChatsMap.get(targetPhone);
    if (!memChat) {
      memChat = {
        phone: targetPhone,
        contactName: contactName || (senderRole === 'AASHISH' ? 'Manashvini (Minni)' : 'Gotti Aashish'),
        unreadCount: 0,
        statusTag: 'TEAM',
        assignedTo: senderRole,
        lastMessage: text.trim(),
        lastMessageTime: new Date().toISOString(),
        messages: []
      };
    }
    if (contactName) memChat.contactName = contactName;
    if (!memChat.messages) memChat.messages = [];
    if (!memChat.messages.some(m => m.id === newMsg.id)) {
      memChat.messages.push(newMsg);
    }
    memChat.lastMessage = text.trim();
    memChat.lastMessageTime = new Date().toISOString();
    memChat.unreadCount = (memChat.unreadCount || 0) + 1;
    memoryChatsMap.set(targetPhone, memChat);

    if (!updatedChat) updatedChat = memChat;

    return res.json({ success: true, message: 'Message sent!', chat: updatedChat });
  } catch (err) {
    console.error('Error sending message:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/whatsapp/clear
 * Clear chat history for a specific contact
 */
router.post('/clear', async (req, res) => {
  try {
    const { phone } = req.body;
    const targetPhone = formatPhone(phone || '917989033580');

    if (mongoose.connection.readyState === 1 && WhatsAppChatModel) {
      await WhatsAppChatModel.updateOne(
        { phone: targetPhone },
        { $set: { messages: [], lastMessage: '', lastMessageTime: new Date(), unreadCount: 0 } }
      );
    }

    const chat = memoryChatsMap.get(targetPhone);
    if (chat) {
      chat.messages = [];
      chat.lastMessage = '';
      chat.lastMessageTime = new Date().toISOString();
      chat.unreadCount = 0;
    }

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/whatsapp/react
 * Add or update emoji reaction on a message in a specific chat
 */
router.post('/react', async (req, res) => {
  try {
    const { phone, messageId, emoji, sender } = req.body;
    if (!emoji) {
      return res.status(400).json({ success: false, error: 'Emoji is required.' });
    }

    const targetPhone = formatPhone(phone || '917989033580');
    const senderRole = (sender && sender.toUpperCase().includes('MINNI')) ? 'MINNI' : 'AASHISH';
    let updatedChat = null;

    if (mongoose.connection.readyState === 1 && WhatsAppChatModel) {
      const chatDoc = await WhatsAppChatModel.findOne({ phone: targetPhone });
      if (chatDoc && chatDoc.messages) {
        let msg = chatDoc.messages.find(m => String(m.id) === String(messageId) || String(m._id) === String(messageId));
        if (!msg && messageId !== undefined && !isNaN(messageId)) {
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

    const memChat = memoryChatsMap.get(targetPhone);
    if (memChat && memChat.messages) {
      let msg = memChat.messages.find(m => String(m.id) === String(messageId));
      if (!msg && messageId !== undefined && !isNaN(messageId)) {
        msg = memChat.messages[Number(messageId)];
      }
      if (msg) {
        msg.reaction = msg.reaction === emoji ? null : emoji;
        msg.reactionBy = senderRole;
      }
      if (!updatedChat) updatedChat = memChat;
    }

    return res.json({ success: true, chat: updatedChat });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/whatsapp/read
 * Reset unread counter for a contact
 */
router.post('/read', async (req, res) => {
  try {
    const { phone } = req.body;
    const targetPhone = formatPhone(phone || '917989033580');

    if (mongoose.connection.readyState === 1 && WhatsAppChatModel) {
      await WhatsAppChatModel.updateOne({ phone: targetPhone }, { $set: { unreadCount: 0 } });
    }
    const chat = memoryChatsMap.get(targetPhone);
    if (chat) chat.unreadCount = 0;

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
