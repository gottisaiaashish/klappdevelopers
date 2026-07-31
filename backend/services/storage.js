const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Inquiry = require('../models/Inquiry');

const DATA_DIR = path.join(__dirname, '..', 'data');
const FILE_PATH = path.join(DATA_DIR, 'inquiries.json');

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify([], null, 2), 'utf-8');
  }
}

async function getAllInquiries() {
  ensureStorage();
  if (mongoose.connection.readyState === 1) {
    try {
      const docs = await Inquiry.find().sort({ createdAt: -1 }).lean();
      if (docs && docs.length >= 0) return docs;
    } catch (err) {
      console.warn('MongoDB fetch fallback to local file:', err.message);
    }
  }

  try {
    const raw = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('Error reading inquiries storage:', err);
    return [];
  }
}

async function saveInquiry(data) {
  ensureStorage();
  const id = 'INQ-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
  const newInquiry = {
    id,
    name: data.name,
    email: data.email,
    service: data.service || 'General Inquiry',
    message: data.message,
    status: 'NEW',
    createdAt: new Date().toISOString(),
    ip: data.ip || '127.0.0.1'
  };

  if (mongoose.connection.readyState === 1) {
    try {
      await Inquiry.create(newInquiry);
    } catch (err) {
      console.warn('Error saving to MongoDB:', err.message);
    }
  }

  try {
    let inquiries = [];
    try {
      const raw = fs.readFileSync(FILE_PATH, 'utf-8');
      inquiries = JSON.parse(raw || '[]');
    } catch (e) {}
    inquiries.unshift(newInquiry);
    fs.writeFileSync(FILE_PATH, JSON.stringify(inquiries, null, 2), 'utf-8');
  } catch (err) {}

  return newInquiry;
}

async function deleteInquiry(id) {
  ensureStorage();
  if (mongoose.connection.readyState === 1) {
    try {
      await Inquiry.deleteOne({ id });
    } catch (err) {}
  }

  try {
    let inquiries = [];
    try {
      const raw = fs.readFileSync(FILE_PATH, 'utf-8');
      inquiries = JSON.parse(raw || '[]');
    } catch (e) {}
    inquiries = inquiries.filter(inq => inq.id !== id);
    fs.writeFileSync(FILE_PATH, JSON.stringify(inquiries, null, 2), 'utf-8');
    return true;
  } catch (err) {
    return false;
  }
}

async function updateInquiryStatus(id, status) {
  ensureStorage();
  if (mongoose.connection.readyState === 1) {
    try {
      await Inquiry.updateOne({ id }, { status, updatedAt: new Date().toISOString() });
    } catch (err) {}
  }

  try {
    let inquiries = [];
    try {
      const raw = fs.readFileSync(FILE_PATH, 'utf-8');
      inquiries = JSON.parse(raw || '[]');
    } catch (e) {}
    const target = inquiries.find(inq => inq.id === id);
    if (target) {
      target.status = status;
      target.updatedAt = new Date().toISOString();
      fs.writeFileSync(FILE_PATH, JSON.stringify(inquiries, null, 2), 'utf-8');
      return target;
    }
  } catch (err) {}
  return null;
}

module.exports = {
  getAllInquiries,
  saveInquiry,
  deleteInquiry,
  updateInquiryStatus
};
