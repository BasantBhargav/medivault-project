const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  doc_id: { type: Number, required: true, unique: true },     // Auto-generated
  user_id: { type: String, required: true, unique: true },    // Links to User._id
  license_number: String,
  specialization: String,
  hospital_id: String,     // Hospital where doctor works
  contact_number: String,
  experience_years: Number,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Doctor', doctorSchema);
