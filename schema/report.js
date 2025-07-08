const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  report_id: { type: String, unique: true, required: true }, // 👈 This is causing the error
  patientId: { type: String, required: true },
  reportType: { type: String, required: true },
  filename: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
