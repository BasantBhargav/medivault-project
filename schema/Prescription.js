// models/Prescription.js
const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patientId: {
    type: String,
    ref: 'user',
    required: true
  },
  doctorId: {
    type: String,
    ref: 'user',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  diagnosis: String,
  notes: String,
  followUpDate: Date
});

module.exports = mongoose.model('Prescription', prescriptionSchema);