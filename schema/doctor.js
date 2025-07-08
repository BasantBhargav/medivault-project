const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  doc_id: {
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
  license_number: {
    type: String,
    required: true,
    unique: true
  },
  specialization: {
    type: String,
    required: true
  },
  hospital_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  contact_number: {
    type: String
  },
  experience_years: {
    type: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
