const mongoose = require('mongoose');
// Added the missing field in the appointment schema
const appointmentSchema = new mongoose.Schema({
  appointment_id: {
    type: String,
    required: true,
    unique: true
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  scheduled_time: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  notes: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
