const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patient_id: { type: Number, required: true, unique: true }, // Auto-generated
  user_id: { type: String, required: true, unique: true },    // Links to User._id
  age: Number,
  gender: String,
  address: String,
  contact_number: String,
  medical_history: [String], // Optional
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', patientSchema);
