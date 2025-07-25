const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  hospital_id: { type: Number, required: true, unique: true }, // Auto-generated
  admin_user_id: { type: String, required: true, unique: true }, // Links to User._id
  name: String,
  location: {
    address_line: String,
    city: String,
    state: String,
    pin_code: String,
    country: { type: String, default: 'India' }
  },
  contact: {
    phone: String,
    email: String
  },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hospital', hospitalSchema);
