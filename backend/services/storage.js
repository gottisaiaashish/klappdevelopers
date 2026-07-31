const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const FILE_PATH = path.join(DATA_DIR, 'inquiries.json');

// Ensure data directory and file exist
function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify([], null, 2), 'utf-8');
  }
}

// Get all inquiries
function getAllInquiries() {
  ensureStorage();
  try {
    const raw = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('Error reading inquiries storage:', err);
    return [];
  }
}

// Save new inquiry
function saveInquiry(data) {
  ensureStorage();
  const inquiries = getAllInquiries();
  
  const newInquiry = {
    id: 'INQ-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
    name: data.name,
    email: data.email, // Can be work email or WhatsApp number
    service: data.service || 'General Inquiry',
    message: data.message,
    status: 'NEW', // NEW, CONTACTED, IN_PROGRESS, CLOSED
    createdAt: new Date().toISOString(),
    ip: data.ip || '127.0.0.1'
  };

  inquiries.unshift(newInquiry); // Newest first
  fs.writeFileSync(FILE_PATH, JSON.stringify(inquiries, null, 2), 'utf-8');
  return newInquiry;
}

// Delete inquiry by ID
function deleteInquiry(id) {
  ensureStorage();
  let inquiries = getAllInquiries();
  const initialLength = inquiries.length;
  inquiries = inquiries.filter(inq => inq.id !== id);
  
  if (inquiries.length < initialLength) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(inquiries, null, 2), 'utf-8');
    return true;
  }
  return false;
}

// Update inquiry status by ID
function updateInquiryStatus(id, status) {
  ensureStorage();
  const inquiries = getAllInquiries();
  const target = inquiries.find(inq => inq.id === id);
  if (target) {
    target.status = status;
    target.updatedAt = new Date().toISOString();
    fs.writeFileSync(FILE_PATH, JSON.stringify(inquiries, null, 2), 'utf-8');
    return target;
  }
  return null;
}

module.exports = {
  getAllInquiries,
  saveInquiry,
  deleteInquiry,
  updateInquiryStatus
};
