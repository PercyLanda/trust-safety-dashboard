const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  status: { type: String, enum: ['pending', 'in-review', 'escalated', 'resolved'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  riskLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  category: { type: String, enum: ['spam', 'abuse', 'fraud', 'policy_violation', 'phishing', 'harassment', 'hate_speech', 'misinformation'], default: 'spam' },
  assignedTo: { type: String, default: '' },
  notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Case', caseSchema);
