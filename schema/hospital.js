const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  hospital_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  location: {
    address_line: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: 'India' },
    pin_code: { type: String, required: true }
  },
  contact: {
    phone: { type: String },
    email: { type: String }
  },
  admin_user_id: {
    type: String,
    ref: 'User',
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Hospital', hospitalSchema);
