const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patient_id: {
    type: String,
    required: true,
    unique: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  address: {
    type: String
  },
  contact_number: {
    type: String
  },
  medical_history: {
    type: [String] // Array of conditions like ['Diabetes', 'Hypertension']
  }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
