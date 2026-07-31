const express = require('express');
const router = express.Router();
const storage = require('../services/storage');
const notifier = require('../services/notifier');

/**
 * @route   POST /api/inquiry
 * @desc    Submit a new client inquiry from contact form
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, service, message } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please provide your full name.'
      });
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please provide your work email or WhatsApp phone number.'
      });
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please provide project details or scope.'
      });
    }

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    const inquiry = await storage.saveInquiry({
      name: name.trim(),
      email: email.trim(),
      service: service ? service.trim() : 'Website Development',
      message: message.trim(),
      ip: clientIp
    });

    notifier.notifyNewInquiry(inquiry);

    return res.status(201).json({
      success: true,
      message: 'Inquiry received successfully! Our team will contact you within 2 hours.',
      inquiryId: inquiry.id
    });

  } catch (err) {
    console.error('Error handling inquiry submission:', err);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred. Please try again or contact us directly on WhatsApp.'
    });
  }
});

/**
 * @route   GET /api/inquiry
 * @desc    Get all submitted inquiries (Admin API)
 * @access  Protected
 */
router.get('/', async (req, res) => {
  const adminKey = req.headers['x-admin-key'] || req.query.admin_key;
  const expectedKey = process.env.ADMIN_SECRET_KEY || 'klapp_admin_secret_2026';

  if (adminKey !== expectedKey) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized access. Valid admin key required.'
    });
  }

  const inquiries = await storage.getAllInquiries();
  return res.json({
    success: true,
    count: inquiries.length,
    inquiries
  });
});

/**
 * @route   PATCH /api/inquiry/:id
 * @desc    Update inquiry status
 * @access  Protected
 */
router.patch('/:id', async (req, res) => {
  const adminKey = req.headers['x-admin-key'] || req.query.admin_key;
  const expectedKey = process.env.ADMIN_SECRET_KEY || 'klapp_admin_secret_2026';

  if (adminKey !== expectedKey) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized access.'
    });
  }

  const { status } = req.body;
  const updated = await storage.updateInquiryStatus(req.params.id, status);

  if (!updated) {
    return res.status(404).json({
      success: false,
      error: 'Inquiry not found.'
    });
  }

  return res.json({
    success: true,
    inquiry: updated
  });
});

/**
 * @route   DELETE /api/inquiry/:id
 * @desc    Delete inquiry by ID
 * @access  Protected
 */
router.delete('/:id', async (req, res) => {
  const adminKey = req.headers['x-admin-key'] || req.query.admin_key;
  const expectedKey = process.env.ADMIN_SECRET_KEY || 'klapp_admin_secret_2026';

  if (adminKey !== expectedKey) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized access.'
    });
  }

  const deleted = await storage.deleteInquiry(req.params.id);
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
