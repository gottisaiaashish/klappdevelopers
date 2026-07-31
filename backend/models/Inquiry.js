const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  service: { type: String, default: 'Website Development' },
  message: { type: String, required: true },
  status: { type: String, enum: ['NEW', 'CONTACTED', 'IN_PROGRESS', 'CLOSED'], default: 'NEW' },
  ip: { type: String, default: '127.0.0.1' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inquiry', InquirySchema);
