const express = require('express');
const router = express.Router();
const User = require('../schema/user');
const Report = require('../schema/report');

router.get('/api/patient-dashboard', async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId).lean();
    const reports = await Report.find({ patientId: userId }).sort({ uploadedAt: -1 }).lean();

    if (!user || user.role !== 'patient') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json({ user, reports });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
