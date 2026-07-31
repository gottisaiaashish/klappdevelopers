const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const storage = require('../services/storage');
const KlappOSData = require('../models/KlappOSData');

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'klapp_admin_secret_2026';

// Default initial state fallback if database is fresh
const defaultOSState = {
  key: 'klapp_os_global_state',
  projects: [
    {
      id: 'PRJ-101',
      name: 'Nandhakam E-Commerce & Booking System',
      client: 'Rahul Sharma',
      service: 'Website Development',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: '2026-08-15',
      budget: 65000,
      owner: 'Aashish'
    },
    {
      id: 'PRJ-102',
      name: 'Balaji Pharma Billing & GST Portal',
      client: 'Balaji Pharma',
      service: 'Business Software',
      status: 'PLANNING',
      priority: 'HIGH',
      dueDate: '2026-08-20',
      budget: 45000,
      owner: 'Minni'
    }
  ],
  meetings: [
    {
      id: 'MTG-01',
      title: 'Nandhakam Project Milestone Review',
      time: 'Tomorrow, 4:00 PM',
      client: 'Rahul Sharma',
      attendees: 'Aashish & Minni',
      type: 'Google Meet',
      link: 'https://meet.google.com/klapp-demo'
    },
    {
      id: 'MTG-02',
      title: 'KLAPP Q3 Agency Growth Strategy',
      time: 'Friday, 11:00 AM',
      client: 'Internal',
      attendees: 'Aashish & Minni',
      type: 'Office Strategy Room',
      link: '#'
    }
  ],
  contentPlanner: [
    {
      id: 'CNT-01',
      title: 'How we built sub-100ms websites for Indian Brands',
      platform: 'Instagram Reel',
      status: 'APPROVED',
      date: new Date().toISOString().split('T')[0],
      dayOfWeek: 'Thursday',
      notes: 'Show live PageSpeed 100/100 recording and architecture breakdown',
      author: 'Minni',
      approvedBy: 'Aashish & Minni',
      aashishLiked: true,
      minniLiked: true
    },
    {
      id: 'CNT-02',
      title: 'KLAPP Developers Behind the Scenes - Coding Session',
      platform: 'LinkedIn Post',
      status: 'DRAFT',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      dayOfWeek: 'Friday',
      notes: 'Drafting tech stack highlights and architecture diagram',
      author: 'Aashish',
      approvedBy: '',
      aashishLiked: true,
      minniLiked: false
    }
  ],
  tasks: [
    { id: 'TSK-01', title: 'Complete Razorpay integration testing', assignedTo: 'Aashish', status: 'IN_PROGRESS', dueDate: 'Today', category: 'Development' },
    { id: 'TSK-02', title: 'Draft Instagram story sequence for new client launch', assignedTo: 'Minni', status: 'DONE', dueDate: 'Today', category: 'Social Media' },
    { id: 'TSK-03', title: 'Send GST billing proposal PDF to Balaji Pharma', assignedTo: 'Minni', status: 'PENDING', dueDate: 'Today', category: 'Client Operations' }
  ],
  disciplineLogs: {
    date: new Date().toISOString().split('T')[0],
    aashish: {
      attendance: true,
      waterGoal: true,
      gym: true,
      protein: true,
      coding: true,
      dinner9pm: true,
      nightLeadCheck: true,
      sleep11pm: true,
      mood: '⚡ High Energy'
    },
    minni: {
      attendance: true,
      waterGoal: true,
      instaPost1: true,
      instaPost2: true,
      storiesCompleted: true,
      scheduleNextDayPosts: true,
      coding: true,
      dinner9pm: true,
      sleep11pm: true,
      mood: '✨ Creative Surge'
    }
  },
  expenses: [
    { id: 'EXP-1', title: 'MongoDB Atlas Database Hosting', amount: 1500, category: 'Infrastructure', addedBy: 'Aashish', date: 'Jul 28' },
    { id: 'EXP-2', title: 'Canva Pro & Content Design Tools', amount: 800, category: 'Tools', addedBy: 'Minni', date: 'Jul 29' },
    { id: 'EXP-3', title: 'Instagram Campaign Ad Budget', amount: 2000, category: 'Marketing', addedBy: 'Minni', date: 'Jul 30' }
  ],
  sharedGoals: [
    { id: 'SG-1', title: 'Joint Coding Session (8:00 PM - 9:30 PM)', completed: true },
    { id: 'SG-2', title: 'KLAPP Q3 Strategy & Client Review', completed: true },
    { id: 'SG-3', title: 'Daily Night Lead Check & Planning', completed: false },
    { id: 'SG-4', title: 'Review Weekly Content Pipeline & Approvals', completed: true }
  ]
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
