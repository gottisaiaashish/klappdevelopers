const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Inquiry = require('../models/Inquiry');
const AiSession = require('../models/AiSession');

const DATA_DIR = path.join(__dirname, '..', 'data');
const FILE_PATH = path.join(DATA_DIR, 'inquiries.json');
const AI_SESSIONS_FILE_PATH = path.join(DATA_DIR, 'ai_sessions.json');

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify([], null, 2), 'utf-8');
  }
  if (!fs.existsSync(AI_SESSIONS_FILE_PATH)) {
    fs.writeFileSync(AI_SESSIONS_FILE_PATH, JSON.stringify([], null, 2), 'utf-8');
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

// ---------------------------------------------------------------------------
// AI Session Storage Helpers (Hybrid MongoDB + Local JSON File)
// ---------------------------------------------------------------------------

async function getAllAiSessions() {
  ensureStorage();
  if (mongoose.connection.readyState === 1) {
    try {
      const docs = await AiSession.find().sort({ updatedAt: -1 }).lean();
      if (docs && docs.length >= 0) return docs;
    } catch (err) {
      console.warn('MongoDB fetch AI Sessions fallback to local file:', err.message);
    }
  }

  try {
    const raw = fs.readFileSync(AI_SESSIONS_FILE_PATH, 'utf-8');
    const sessions = JSON.parse(raw || '[]');
    sessions.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
    return sessions;
  } catch (err) {
    console.error('Error reading AI sessions storage:', err);
    return [];
  }
}

async function saveOrUpdateAiSession(sessionData) {
  ensureStorage();
  const sessionId = sessionData.sessionId;
  const nowIso = new Date().toISOString();

  // Try MongoDB upsert first
  if (mongoose.connection.readyState === 1) {
    try {
      await AiSession.findOneAndUpdate(
        { sessionId },
        {
          $set: {
            clientName: sessionData.clientName || 'Anonymous Visitor',
            contact: sessionData.contact || '',
            businessType: sessionData.businessType || 'Unspecified Business',
            budget: sessionData.budget || 'Not Stated',
            status: sessionData.status || 'ACTIVE',
            messages: sessionData.messages || [],
            inquiryId: sessionData.inquiryId || null,
            updatedAt: new Date()
          },
          $setOnInsert: {
            createdAt: new Date()
          }
        },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.warn('Error saving AI Session to MongoDB:', err.message);
    }
  }

  // Local JSON fallback storage
  try {
    let sessions = [];
    try {
      const raw = fs.readFileSync(AI_SESSIONS_FILE_PATH, 'utf-8');
      sessions = JSON.parse(raw || '[]');
    } catch (e) {}

    const index = sessions.findIndex(s => s.sessionId === sessionId);
    const updatedRecord = {
      sessionId,
      clientName: sessionData.clientName || (index >= 0 ? sessions[index].clientName : 'Anonymous Visitor'),
      contact: sessionData.contact || (index >= 0 ? sessions[index].contact : ''),
      businessType: sessionData.businessType || (index >= 0 ? sessions[index].businessType : 'Unspecified Business'),
      budget: sessionData.budget || (index >= 0 ? sessions[index].budget : 'Not Stated'),
      status: sessionData.status || (index >= 0 ? sessions[index].status : 'ACTIVE'),
      messages: sessionData.messages || (index >= 0 ? sessions[index].messages : []),
      inquiryId: sessionData.inquiryId || (index >= 0 ? sessions[index].inquiryId : null),
      createdAt: index >= 0 ? sessions[index].createdAt : nowIso,
      updatedAt: nowIso
    };

    if (index >= 0) {
      sessions[index] = updatedRecord;
    } else {
      sessions.unshift(updatedRecord);
    }

    fs.writeFileSync(AI_SESSIONS_FILE_PATH, JSON.stringify(sessions, null, 2), 'utf-8');
    return updatedRecord;
  } catch (err) {
    console.error('Error saving AI Session to local file:', err);
    return null;
  }
}

async function deleteAiSession(sessionId) {
  ensureStorage();
  if (mongoose.connection.readyState === 1) {
    try {
      await AiSession.deleteOne({ sessionId });
    } catch (err) {}
  }

  try {
    let sessions = [];
    try {
      const raw = fs.readFileSync(AI_SESSIONS_FILE_PATH, 'utf-8');
      sessions = JSON.parse(raw || '[]');
    } catch (e) {}
    sessions = sessions.filter(s => s.sessionId !== sessionId);
    fs.writeFileSync(AI_SESSIONS_FILE_PATH, JSON.stringify(sessions, null, 2), 'utf-8');
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = {
  getAllInquiries,
  saveInquiry,
  deleteInquiry,
  updateInquiryStatus,
  getAllAiSessions,
  saveOrUpdateAiSession,
  deleteAiSession
};
