const mongoose = require('mongoose');

const KlappOSSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: 'klapp_os_global_state' },
  projects: [{
    id: String,
    name: String,
    client: String,
    service: String,
    status: { type: String, enum: ['PLANNING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'], default: 'IN_PROGRESS' },
    priority: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], default: 'HIGH' },
    dueDate: String,
    budget: Number,
    owner: String
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
    platform: String, // Instagram, LinkedIn, YouTube, Twitter
    status: { type: String, enum: ['DRAFT', 'READY_FOR_APPROVAL', 'APPROVED', 'PUBLISHED'], default: 'DRAFT' },
    date: String,
    notes: String,
    author: String,
    approvedBy: String
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
      gym: { type: Boolean, default: false },
      coding: { type: Boolean, default: false },
      projectUpdate: { type: Boolean, default: false },
      clientFollowups: { type: Boolean, default: false },
      sleep11pm: { type: Boolean, default: false },
      wake7am: { type: Boolean, default: false },
      reading: { type: Boolean, default: false },
      waterGoal: { type: Boolean, default: false },
      mood: { type: String, default: '⚡ Energetic' }
    },
    minni: {
      attendance: { type: Boolean, default: false },
      instaPosts2: { type: Boolean, default: false },
      storiesCompleted: { type: Boolean, default: false },
      coding: { type: Boolean, default: false },
      clientFollowups: { type: Boolean, default: false },
      contentPlanning: { type: Boolean, default: false },
      sleep11pm: { type: Boolean, default: false },
      wake7am: { type: Boolean, default: false },
      waterGoal: { type: Boolean, default: false },
      mood: { type: String, default: '✨ Creative' }
    }
  },
  sharedGoals: [{
    id: String,
    title: String,
    completed: { type: Boolean, default: false }
  }],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('KlappOSData', KlappOSSchema);
