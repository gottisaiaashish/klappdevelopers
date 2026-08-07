const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const storage = require('../services/storage');
const KlappOSData = require('../models/KlappOSData');

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'klapp_admin_secret_2026';

const defaultNandakamProject = {
  id: 'prj-nandakam-banquets',
  name: 'Nandakam Banquets Website & Digital Suite',
  client: 'Nandakam Banquets',
  phone: '+91 98765 43210',
  service: 'Full Website & Digital Maintenance',
  status: 'COMPLETED',
  priority: 'HIGH',
  dueDate: '2026-08-28',
  budget: 25000,
  advancePaid: 25000,
  pendingAmount: 0,
  requirements: 'Agreed budget ₹25,000. Project 100% completed. ₹3,000 monthly maintenance fee due on 28th of every month starting August 2026.',
  hasRetainer: true,
  monthlyFee: 3000,
  dueDay: 28,
  retainerStartMonth: '2026-08',
  retainerPaidMonths: []
};

// Default initial state fallback if database is fresh
const defaultOSState = {
  key: 'klapp_os_global_state',
  projects: [defaultNandakamProject],
  meetings: [],
  contentPlanner: [],
  tasks: [],
  disciplineLogs: {
    date: new Date().toISOString().split('T')[0],
    aashish: {
      attendance: false,
      waterMorning: false,
      waterAfternoon: false,
      waterEvening: false,
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
      waterMorning: false,
      waterAfternoon: false,
      waterEvening: false,
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
  disciplineHistory: [],
  expenses: [],
  sharedGoals: [],
  aashishPad: '',
  minniPad: '',
  agencyNotes: [],
  retainers: [
    {
      id: 'ret-nandakam-banquets',
      client: 'Nandakam Banquets',
      projectTitle: 'Nandakam Banquets Monthly Maintenance',
      monthlyFee: 3000,
      dueDay: 28,
      startMonth: '2026-08',
      phone: '',
      notes: 'Monthly website & digital maintenance fee. ₹3,000 due every 28th of every month starting August 2026.',
      paidMonths: [],
      payments: []
    }
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

function getTodayDateStr() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

function processDisciplineDateRollover(data) {
  const todayStr = getTodayDateStr();
  if (!data.disciplineLogs) {
    data.disciplineLogs = {
      date: todayStr,
      aashish: { attendance: false, waterMorning: false, waterAfternoon: false, waterEvening: false, gym: false, protein: false, coding: false, dinner9pm: false, nightLeadCheck: false, sleep11pm: false, mood: '⚡ High Energy' },
      minni: { attendance: false, waterMorning: false, waterAfternoon: false, waterEvening: false, instaPost1: false, instaPost2: false, storiesCompleted: false, scheduleNextDayPosts: false, coding: false, dinner9pm: false, sleep11pm: false, mood: '✨ Creative Surge' }
    };
    return true;
  }

  const logDate = data.disciplineLogs.date;

  if (logDate && logDate !== todayStr) {
    const aashishKeys = ['attendance', 'waterMorning', 'waterAfternoon', 'waterEvening', 'gym', 'protein', 'coding', 'dinner9pm', 'nightLeadCheck', 'sleep11pm'];
    const minniKeys = ['attendance', 'waterMorning', 'waterAfternoon', 'waterEvening', 'instaPost1', 'instaPost2', 'storiesCompleted', 'scheduleNextDayPosts', 'coding', 'dinner9pm', 'sleep11pm'];

    const aashishDone = aashishKeys.filter(k => data.disciplineLogs.aashish?.[k]).length;
    const minniDone = minniKeys.filter(k => data.disciplineLogs.minni?.[k]).length;
    const aashishPct = Math.round((aashishDone / aashishKeys.length) * 100);
    const minniPct = Math.round((minniDone / minniKeys.length) * 100);

    let winner = 'TIE';
    if (aashishPct > minniPct) winner = 'AASHISH';
    if (minniPct > aashishPct) winner = 'MINNI';

    if (!Array.isArray(data.disciplineHistory)) {
      data.disciplineHistory = [];
    }

    const existingIdx = data.disciplineHistory.findIndex(h => h.date === logDate);
    const historyEntry = {
      date: logDate,
      aashishScore: aashishPct,
      minniScore: minniPct,
      aashishCompleted: aashishDone,
      aashishTotal: aashishKeys.length,
      minniCompleted: minniDone,
      minniTotal: minniKeys.length,
      winner,
      aashishMood: data.disciplineLogs.aashish?.mood || '⚡ High Energy',
      minniMood: data.disciplineLogs.minni?.mood || '✨ Creative Surge',
      aashishTasks: { ...data.disciplineLogs.aashish },
      minniTasks: { ...data.disciplineLogs.minni }
    };

    if (existingIdx >= 0) {
      data.disciplineHistory[existingIdx] = historyEntry;
    } else {
      data.disciplineHistory.unshift(historyEntry);
    }

    data.disciplineLogs = {
      date: todayStr,
      aashish: { attendance: false, waterMorning: false, waterAfternoon: false, waterEvening: false, gym: false, protein: false, coding: false, dinner9pm: false, nightLeadCheck: false, sleep11pm: false, mood: data.disciplineLogs.aashish?.mood || '⚡ High Energy' },
      minni: { attendance: false, waterMorning: false, waterAfternoon: false, waterEvening: false, instaPost1: false, instaPost2: false, storiesCompleted: false, scheduleNextDayPosts: false, coding: false, dinner9pm: false, sleep11pm: false, mood: data.disciplineLogs.minni?.mood || '✨ Creative Surge' }
    };
    return true;
  }
  return false;
}

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
      let needsSave = false;
      if (!Array.isArray(data.projects) || data.projects.length === 0) {
        data.projects = [defaultNandakamProject];
        needsSave = true;
      } else {
        data.projects = data.projects.map(p => {
          if (p.id === 'prj-nandakam-banquets') {
            return { ...p, advancePaid: 25000, pendingAmount: 0 };
          }
          return p;
        });
      }
      if (!Array.isArray(data.retainers) || data.retainers.length === 0) {
        data.retainers = defaultOSState.retainers;
        needsSave = true;
      }
      const rolloverHappened = processDisciplineDateRollover(data);
      if (needsSave || rolloverHappened) {
        await KlappOSData.findOneAndUpdate(
          { key: 'klapp_os_global_state' },
          { 
            projects: data.projects, 
            retainers: data.retainers,
            disciplineLogs: data.disciplineLogs,
            disciplineHistory: data.disciplineHistory 
          },
          { upsert: true }
        );
      }
      return res.json({ success: true, osData: data });
    }
    processDisciplineDateRollover(defaultOSState);
    return res.json({ success: true, osData: defaultOSState });
  } catch (err) {
    console.error('Error fetching OS data:', err);
    processDisciplineDateRollover(defaultOSState);
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
      const existing = await KlappOSData.findOne({ key: 'klapp_os_global_state' }).lean();
      
      const payload = { ...osData };

      // Safeguard against accidental empty array overwrites
      if (existing && Array.isArray(existing.projects) && existing.projects.length > 0) {
        if (!Array.isArray(payload.projects) || payload.projects.length === 0) {
          payload.projects = existing.projects;
        }
      }
      if (existing && Array.isArray(existing.retainers) && existing.retainers.length > 0) {
        if (!Array.isArray(payload.retainers) || payload.retainers.length === 0) {
          payload.retainers = existing.retainers;
        }
      }

      const updatedDoc = await KlappOSData.findOneAndUpdate(
        { key: 'klapp_os_global_state' },
        payload,
        { upsert: true, new: true, runValidators: false }
      ).lean();

      return res.json({ success: true, message: 'KLAPP OS state synced successfully!', osData: updatedDoc || payload });
    }

    return res.json({ success: true, message: 'KLAPP OS state synced successfully!', osData });
  } catch (err) {
    console.error('Error updating OS data:', err);
    return res.status(500).json({ success: false, error: 'Failed to sync OS data: ' + err.message });
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
