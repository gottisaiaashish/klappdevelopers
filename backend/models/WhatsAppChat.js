const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  sender: { type: String, enum: ['CUSTOMER', 'AASHISH', 'MINNI', 'BOT', 'SYSTEM'], default: 'CUSTOMER' },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['SENT', 'DELIVERED', 'READ', 'FAILED'], default: 'DELIVERED' },
  mediaUrl: { type: String, default: null }
});

const WhatsAppChatSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  contactName: { type: String, default: 'Klapp Lead' },
  email: { type: String, default: '' },
  serviceInterest: { type: String, default: 'Web & AI Automation' },
  statusTag: { type: String, enum: ['HOT_LEAD', 'CLIENT', 'PENDING_QUOTE', 'CLOSED', 'NEW'], default: 'NEW' },
  unreadCount: { type: Number, default: 0 },
  assignedTo: { type: String, enum: ['AASHISH', 'MINNI', 'UNASSIGNED'], default: 'UNASSIGNED' },
  lastMessage: { type: String, default: '' },
  lastMessageTime: { type: Date, default: Date.now },
  messages: [MessageSchema]
}, { timestamps: true });

module.exports = mongoose.model('WhatsAppChat', WhatsAppChatSchema);
