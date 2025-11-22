const express = require('express');
const router = express.Router();
const User = require('../schema/user');
const Report = require('../schema/report');
const fs = require('fs');
const path = require('path');

// GET patient dashboard data
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

// DELETE the report by ID feature
router.delete('/delete-report/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '../', report.filePath); // assuming filePath is relative like 'public/uploads/xyz.pdf'
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete report document from DB
    await Report.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
