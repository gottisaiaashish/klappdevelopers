const mongoose = require('mongoose');

const KlappOSSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: 'klapp_os_global_state' },
  projects: { type: Array, default: [] },
  meetings: { type: Array, default: [] },
  contentPlanner: { type: Array, default: [] },
  tasks: { type: Array, default: [] },
  disciplineLogs: { type: Object, default: {} },
  disciplineHistory: { type: Array, default: [] },
  expenses: { type: Array, default: [] },
  sharedGoals: { type: Array, default: [] },
  agencyNotes: { type: Array, default: [] },
  retainers: { type: Array, default: [] },
  aashishPad: { type: String, default: '' },
  minniPad: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
}, { strict: false, timestamps: true });

module.exports = mongoose.model('KlappOSData', KlappOSSchema);
