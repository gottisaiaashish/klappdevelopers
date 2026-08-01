const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const storage = require('../services/storage');
const KlappOSData = require('../models/KlappOSData');

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'klapp_admin_secret_2026';

// Default initial state fallback if database is fresh
const defaultOSState = {
  key: 'klapp_os_global_state',
  projects: [],
  meetings: [],
  contentPlanner: [],
  tasks: [],
  disciplineLogs: {
    date: new Date().toISOString().split('T')[0],
    aashish: {
      attendance: false,
      waterGoal: false,
      gym: false,
      protein: false,
      coding: false,
      dinner9pm: false,
      nightLeadCheck: false,
      sleep11pm: false,
      mood: '⚡ High Energy'
    },
    minni: {
      attendance: false,
      waterGoal: false,
      instaPost1: false,
      instaPost2: false,
      storiesCompleted: false,
      scheduleNextDayPosts: false,
      coding: false,
      dinner9pm: false,
      sleep11pm: false,
      mood: '✨ Creative Surge'
    }
  },
  expenses: [],
  sharedGoals: [],
  aashishPad: '',
  minniPad: '',
  agencyNotes: []
};

function requireAdminAuth(req, res, next) {
  const token = req.headers['authorization'] || req.headers['x-admin-token'] || req.query.token;
  if (token === `Bearer ${ADMIN_SECRET_KEY}` || token === ADMIN_SECRET_KEY || token === 'klapp_admin_token_04160416' || token === 'klapp_admin_token_minni') {
    return next();
  }
  return res.status(401).json({
    success: false,
    error: 'Unauthorized access. Valid admin session required.'
  });
}

/**
 * @route   POST /api/admin/login
 * @desc    Authenticate Founder (Aashish) or Operations Lead (Manashvini / Minni)
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: 'Please enter both username and password.'
    });
  }

  const cleanUser = username.trim().toLowerCase();
  const cleanPass = password.trim();

  if (cleanUser === 'gottiaashish' && cleanPass === '04160416') {
    return res.json({
      success: true,
      token: 'klapp_admin_token_04160416',
      admin: {
        username: 'gottiaashish',
        name: 'Gotti Aashish',
        role: 'Founder & Lead Architect',
        avatarRole: 'AASHISH'
      }
    });
  }

  if ((cleanUser === 'manashvini' || cleanUser === 'minni') && cleanPass === '04160416') {
    return res.json({
      success: true,
      token: 'klapp_admin_token_minni',
      admin: {
        username: 'manashvini',
        name: 'Manashvini (Minni)',
        role: 'Operations Lead & Content Director',
        avatarRole: 'MINNI'
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
 */
router.get('/inquiries', requireAdminAuth, async (req, res) => {
  const inquiries = await storage.getAllInquiries();
  const total = inquiries.length;
  const newLeads = inquiries.filter(i => i.status === 'NEW').length;
  const contacted = inquiries.filter(i => i.status === 'CONTACTED').length;
  const closed = inquiries.filter(i => i.status === 'CLOSED').length;

  return res.json({
    success: true,
    metrics: { total, newLeads, contacted, closed },
    inquiries
  });
});

/**
 * @route   GET /api/admin/os-data
 * @desc    Fetch real-time KLAPP OS state (Projects, Meetings, Content, Tasks, Discipline)
 */
router.get('/os-data', requireAdminAuth, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let data = await KlappOSData.findOne({ key: 'klapp_os_global_state' }).lean();
      if (!data) {
        data = await KlappOSData.create(defaultOSState);
      }
      return res.json({ success: true, osData: data });
    }
    return res.json({ success: true, osData: defaultOSState });
  } catch (err) {
    console.error('Error fetching OS data:', err);
    return res.json({ success: true, osData: defaultOSState });
  }
});

/**
 * @route   POST /api/admin/os-data
 * @desc    Sync updated KLAPP OS state across Founder & Operations dashboards
 */
router.post('/os-data', requireAdminAuth, async (req, res) => {
  try {
    const { osData } = req.body;
    if (!osData) return res.status(400).json({ success: false, error: 'No OS data provided' });

    osData.updatedAt = new Date().toISOString();

    if (mongoose.connection.readyState === 1) {
      await KlappOSData.findOneAndUpdate(
        { key: 'klapp_os_global_state' },
        osData,
        { upsert: true, new: true }
      );
    }

    return res.json({ success: true, message: 'KLAPP OS state synced successfully!', osData });
  } catch (err) {
    console.error('Error updating OS data:', err);
    return res.status(500).json({ success: false, error: 'Failed to sync OS data' });
  }
});

router.patch('/inquiry/:id', requireAdminAuth, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['NEW', 'CONTACTED', 'IN_PROGRESS', 'CLOSED'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid status' });
  }
  const updated = await storage.updateInquiryStatus(req.params.id, status);
  if (!updated) return res.status(404).json({ success: false, error: 'Inquiry not found' });
  return res.json({ success: true, inquiry: updated });
});

router.delete('/inquiry/:id', requireAdminAuth, async (req, res) => {
  const deleted = await storage.deleteInquiry(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, error: 'Inquiry not found' });
  return res.json({ success: true, message: 'Inquiry deleted' });
});

module.exports = router;
