const express = require('express');
const router = express.Router();
const storage = require('../services/storage');

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'gottiaashish';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '04160416';
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'klapp_admin_secret_2026';

// Helper middleware to authenticate admin token
function requireAdminAuth(req, res, next) {
  const token = req.headers['authorization'] || req.headers['x-admin-token'] || req.query.token;
  if (token === `Bearer ${ADMIN_SECRET_KEY}` || token === ADMIN_SECRET_KEY || token === 'klapp_admin_token_04160416') {
    return next();
  }
  return res.status(401).json({
    success: false,
    error: 'Unauthorized access. Valid admin session required.'
  });
}

/**
 * @route   POST /api/admin/login
 * @desc    Authenticate Gotti Aashish (Founder Admin)
 * @access  Public
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: 'Please enter both username and password.'
    });
  }

  if (username.trim() === ADMIN_USERNAME && password.trim() === ADMIN_PASSWORD) {
    return res.json({
      success: true,
      token: 'klapp_admin_token_04160416',
      admin: {
        username: ADMIN_USERNAME,
        name: 'Gotti Aashish',
        role: 'Founder & Lead Architect'
      }
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid credentials. Access denied.'
  });
});

/**
 * @route   GET /api/admin/inquiries
 * @desc    Fetch all client inquiries for admin dashboard
 * @access  Protected
 */
router.get('/inquiries', requireAdminAuth, (req, res) => {
  const inquiries = storage.getAllInquiries();
  
  // Calculate summary metrics
  const total = inquiries.length;
  const newLeads = inquiries.filter(i => i.status === 'NEW').length;
  const contacted = inquiries.filter(i => i.status === 'CONTACTED').length;
  const closed = inquiries.filter(i => i.status === 'CLOSED').length;

  return res.json({
    success: true,
    metrics: {
      total,
      newLeads,
      contacted,
      closed
    },
    inquiries
  });
});

/**
 * @route   PATCH /api/admin/inquiry/:id
 * @desc    Update inquiry status
 * @access  Protected
 */
router.patch('/inquiry/:id', requireAdminAuth, (req, res) => {
  const { status } = req.body;
  const validStatuses = ['NEW', 'CONTACTED', 'IN_PROGRESS', 'CLOSED'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid status provided.'
    });
  }

  const updated = storage.updateInquiryStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({
      success: false,
      error: 'Inquiry not found.'
    });
  }

  return res.json({
    success: true,
    message: `Inquiry status updated to ${status}`,
    inquiry: updated
  });
});

/**
 * @route   DELETE /api/admin/inquiry/:id
 * @desc    Delete inquiry record
 * @access  Protected
 */
router.delete('/inquiry/:id', requireAdminAuth, (req, res) => {
  const deleted = storage.deleteInquiry(req.params.id);
  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: 'Inquiry not found.'
    });
  }

  return res.json({
    success: true,
    message: 'Inquiry deleted successfully.'
  });
});

module.exports = router;
