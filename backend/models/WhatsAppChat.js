const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  sender: { type: String, default: 'CUSTOMER' },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, default: 'DELIVERED' },
  mediaUrl: { type: String, default: null },
  reaction: { type: String, default: null },
  reactionBy: { type: String, default: null }
});

const WhatsAppChatSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  contactName: { type: String, default: 'Klapp Lead' },
  email: { type: String, default: '' },
  serviceInterest: { type: String, default: 'Web & AI Automation' },
  statusTag: { type: String, default: 'NEW' },
  unreadCount: { type: Number, default: 0 },
  assignedTo: { type: String, default: 'UNASSIGNED' },
  lastMessage: { type: String, default: '' },
  lastMessageTime: { type: Date, default: Date.now },
  messages: [MessageSchema]
}, { timestamps: true });

module.exports = mongoose.model('WhatsAppChat', WhatsAppChatSchema);
