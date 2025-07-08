const sharedRecordSchema = new mongoose.Schema({
  shared_id: {
    type: String,
    required: true,
    unique: true
  },
  record_type: {
    type: String,
    enum: ['report', 'prescription'],
    required: true
  },
  record_id: { type: String, required: true },
  shared_with_user_id: {
    type: String,
    ref: 'User',
    required: true
  },
  accessed_by_user_id: {
    type: String,
    ref: 'User',
    required: true
  },
  timestamp: { type: Date, default: Date.now }
});
