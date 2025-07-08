// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const { v4: uuidv4 } = require('uuid'); // ✅ Generate unique report_id
// const Report = require('../schema/report');

// const router = express.Router();

// // Ensure uploads directory exists
// const uploadsDir = path.join(__dirname, '../uploads');
// if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// // Multer configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadsDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   }
// });
// const upload = multer({ storage });

// // ✅ Fetch reports by Patient ID
// router.get('/api/reports/:patientId', async (req, res) => {
//   try {
//     const reports = await Report.find({ patientId: req.params.patientId }).sort({ uploadedAt: -1 });
//     res.json(reports);
//   } catch (error) {
//     console.error('❌ Error fetching reports:', error);
//     res.status(500).json({ message: 'Error fetching patient reports' });
//   }
// });

// // Upload endpoint
// router.post('/upload-report', upload.single('report'), async (req, res) => {
//   const { patientId, reportType } = req.body;

//   if (!req.file) {
//     console.error('❌ No file uploaded');
//     return res.status(400).send('No file uploaded');
//   }

//   try {
//     const report = new Report({
//       report_id: uuidv4(), // 👈 Generate unique report ID
//       patientId,
//       reportType,
//       filename: req.file.filename,
//       filePath: req.file.path
//     });

//     await report.save();
//     console.log(`✅ Report uploaded for patient ${patientId}: ${req.file.filename}`);
//     res.send(`<script>alert('✅ Report uploaded successfully'); window.location.href='/hospitaldashboard';</script>`);
//   } catch (err) {
//     console.error('❌ Error saving report to DB:', err.message, err);
//     res.status(500).send('Error saving report to database');
//   }
// });

// module.exports = router;





//////////////////////////


const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Report = require('../schema/report');
const User = require('../schema/user'); // ✅ Needed for validation

const router = express.Router();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

/**
 * ✅ Fetch reports by patient ID
 * Used by doctors to search patient reports
 */
router.get('/api/reports/:patientId', async (req, res) => {
  try {
    const reports = await Report.find({ patientId: req.params.patientId }).sort({ uploadedAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error('❌ Error fetching reports:', error);
    res.status(500).json({ message: 'Error fetching patient reports' });
  }
});

/**
 * ✅ Upload report endpoint
 * Handles uploads from both hospital and patient sides
 */
router.post('/upload-report', upload.single('report'), async (req, res) => {
  const { patientId, reportType } = req.body;

  if (!req.file) {
    console.error('❌ No file uploaded');
    return res.status(400).send('No file uploaded');
  }

  try {
    let finalPatientId = patientId;

    // ✅ Check if this is a patient uploading their own report
    if (req.session && req.session.userId && req.session.role === 'patient') {
      finalPatientId = req.session.userId; // Use logged-in patient's ID
    } else {
      // ✅ Hospital uploading: Validate patient ID
      const patient = await User.findOne({ _id: patientId, role: 'patient' });
      if (!patient) {
        console.error(`❌ Invalid patient ID or not a patient: ${patientId}`);
        return res.send(`<script>alert('❌ Invalid Patient ID or User is not a patient'); window.location.href='/hospitaldashboard';</script>`);
      }
    }

    // ✅ Save report
    const report = new Report({
      report_id: uuidv4(),
      patientId: finalPatientId,
      reportType,
      filename: req.file.filename,
      filePath: `uploads/${req.file.filename}` // ✅ relative path
    });

    await report.save();
    console.log(`✅ Report uploaded for patient ${finalPatientId}: ${report.filePath}`);

    // Send appropriate response
    if (req.session && req.session.role === 'patient') {
      res.send('✅ Report uploaded successfully!'); // Patient upload
    } else {
      res.send(`<script>alert('✅ Report uploaded successfully'); window.location.href='/hospitaldashboard';</script>`); // Hospital upload
    }
  } catch (err) {
    console.error('❌ Error saving report to DB:', err.message, err);
    res.status(500).send('Error saving report to database');
  }
});

/**
 * ✅ Delete report endpoint
 * Allows patients to delete their own reports
 */
router.delete('/delete-report/:reportId', async (req, res) => {
  try {
    const reportId = req.params.reportId;

    // Fetch the report
    const report = await Report.findById(reportId);
    if (!report) {
      console.error(`❌ Report not found: ${reportId}`);
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if the user is allowed to delete this report
    if (
      req.session &&
      req.session.role === 'patient' &&
      req.session.userId !== report.patientId
    ) {
      console.error(`❌ Unauthorized delete attempt by user: ${req.session.userId}`);
      return res.status(403).json({ message: 'Unauthorized to delete this report' });
    }

    // Delete the file from the filesystem
    const filePath = path.join(__dirname, '..', report.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await Report.findByIdAndDelete(reportId);
    console.log(`🗑️ Report deleted: ${reportId}`);

    res.json({ message: '✅ Report deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting report:', error);
    res.status(500).json({ message: 'Error deleting report' });
  }
});

module.exports = router;



