const mongoose = require('mongoose');

const AiSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  clientName: { type: String, default: 'Anonymous Visitor' },
  contact: { type: String, default: '' },
  businessType: { type: String, default: 'Unspecified Business' },
  budget: { type: String, default: 'Not Stated' },
  status: { type: String, enum: ['ACTIVE', 'LEAD_CAPTURED', 'CLOSED'], default: 'ACTIVE' },
  messages: [{
    id: String,
    sender: String, // 'user' or 'ai'
    text: String,
    time: String,
    timestamp: { type: Date, default: Date.now }
  }],
  inquiryId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AiSession', AiSessionSchema);
