const mongoose = require('mongoose');

const KlappOSSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: 'klapp_os_global_state' },
  projects: [{
    id: String,
    name: String,
    client: String,
    phone: String,
    requirements: String,
    service: String,
    status: { type: String, enum: ['PLANNING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'], default: 'IN_PROGRESS' },
    priority: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], default: 'HIGH' },
    dueDate: String,
    budget: Number,
    advancePaid: Number,
    pendingAmount: Number,
    owner: String,
    lastFollowedUpBy: String,
    lastFollowedUpAt: String
  }],
  meetings: [{
    id: String,
    title: String,
    time: String,
    client: String,
    attendees: String,
    type: String,
    link: String
  }],
  contentPlanner: [{
    id: String,
    title: String,
    platform: String,
    status: { type: String, enum: ['DRAFT', 'READY_FOR_APPROVAL', 'APPROVED', 'PUBLISHED'], default: 'DRAFT' },
    date: String,
    dayOfWeek: String,
    notes: String,
    author: String,
    approvedBy: String,
    aashishLiked: { type: Boolean, default: false },
    minniLiked: { type: Boolean, default: false }
  }],
  tasks: [{
    id: String,
    title: String,
    assignedTo: String, // Aashish, Minni
    status: { type: String, enum: ['PENDING', 'IN_PROGRESS', 'DONE'], default: 'PENDING' },
    dueDate: String,
    category: String
  }],
  disciplineLogs: {
    date: String,
    aashish: {
      attendance: { type: Boolean, default: false },
      waterGoal: { type: Boolean, default: false },
      gym: { type: Boolean, default: false },
      protein: { type: Boolean, default: false },
      coding: { type: Boolean, default: false },
      dinner9pm: { type: Boolean, default: false },
      nightLeadCheck: { type: Boolean, default: false },
      sleep11pm: { type: Boolean, default: false },
      mood: { type: String, default: '⚡ High Energy' }
    },
    minni: {
      attendance: { type: Boolean, default: false },
      waterGoal: { type: Boolean, default: false },
      instaPost1: { type: Boolean, default: false },
      instaPost2: { type: Boolean, default: false },
      storiesCompleted: { type: Boolean, default: false },
      scheduleNextDayPosts: { type: Boolean, default: false },
      coding: { type: Boolean, default: false },
      dinner9pm: { type: Boolean, default: false },
      sleep11pm: { type: Boolean, default: false },
      mood: { type: String, default: '✨ Creative Surge' }
    }
  },
  expenses: [{
    id: String,
    title: String,
    amount: Number,
    category: String,
    addedBy: String,
    date: String
  }],
  sharedGoals: [{
    id: String,
    title: String,
    completed: { type: Boolean, default: false }
  }],
  aashishPad: { type: String, default: '' },
  minniPad: { type: String, default: '' },
  agencyNotes: [{
    id: String,
    title: String,
    content: String,
    category: { type: String, default: 'General' },
    author: String,
    color: { type: String, default: '#fef08a' },
    isPinned: { type: Boolean, default: false },
    updatedAt: String
  }],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('KlappOSData', KlappOSSchema);
