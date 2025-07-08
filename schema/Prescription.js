const prescriptionSchema = new mongoose.Schema({
  prescription_id: {
    type: String,
    required: true,
    unique: true
  },
  doc_id: {
    type: String,
    ref: 'Doctor',
    required: true
  },
  patient_id: {
    type: String,
    ref: 'Patient',
    required: true
  },
  date: { type: Date, default: Date.now },
  notes: String,
  medications: [{
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true }
  }]
});
