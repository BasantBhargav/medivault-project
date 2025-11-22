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
const nodemailer = require('nodemailer'); // ✅ Added nodemailer
const Report = require('../schema/report');
const User = require('../schema/user'); // ✅ For patient details

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
 * ✅ Send email notification to patient
 */
async function sendReportMail(patient, report) {
  try {
    // ✅ Create transporter with hardcoded credentials
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'bhargavbasant123@gmail.com', // 👉 Your Gmail here
        pass: 'onok cstd xctp pguj'         // 👉 Your App Password here
      }
    });

    // ✅ Mail content with Login Button
    let mailOptions = {
      from: '"MediVault" <bhargavbasant123@gmail.com>',
      to: patient.email,
      subject: `MediVault: New Report Uploaded`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 10px; color: #333;">
          <h2>Hello ${patient.name},</h2>
          <p>A new medical report has been uploaded to your MediVault account. Below are the details:</p>
          <ul>
            <li><strong>Patient ID:</strong> ${patient._id}</li>
            <li><strong>Patient Name:</strong> ${patient.name}</li>
            <li><strong>Report Type:</strong> ${report.reportType}</li>
            <li><strong>Upload Date:</strong> ${new Date(report.uploadedAt).toLocaleString()}</li>
            <li><strong>Report File:</strong> ${report.filename}</li>
          </ul>
          <p>You can login to your account to view and download the report.</p>
          <p style="margin-top:20px;">
            <a href="http://localhost:3000/login" style="
              background-color:#4CAF50;
              color:white;
              padding:10px 20px;
              text-decoration:none;
              border-radius:5px;">
              🔒 Login to MediVault
            </a>
          </p>
          <p style="margin-top:20px;">Thank you,<br/>MediVault Team</p>
        </div>
      `
    };

    // ✅ Send mail
    let info = await transporter.sendMail(mailOptions);
    console.log('📧 Mail sent to:', patient.email, '| Message ID:', info.messageId);
  } catch (err) {
    console.error('❌ Error sending mail:', err.message);
  }
}
// fixed the send mail logic in mailOptions API of upload.js

/**
 * Upload report endpoint
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
    let patient;
    if (req.session && req.session.userId && req.session.role === 'patient') {
      finalPatientId = req.session.userId; // Use logged-in patient's ID
      patient = await User.findOne({ _id: finalPatientId });
    } else {
      // ✅ Hospital uploading: Validate patient ID
      patient = await User.findOne({ _id: patientId, role: 'patient' });
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
      filePath: `uploads/${req.file.filename}`, // ✅ relative path
      uploadedAt: new Date()
    });

    await report.save();
    console.log(`✅ Report uploaded for patient ${finalPatientId}: ${report.filePath}`);

    // ✅ Send email notification
    await sendReportMail(patient, report);

    // Send appropriate response
    if (req.session && req.session.role === 'patient') {
      res.send('✅ Report uploaded successfully!');
    } else {
      res.send(`<script>alert('✅ Report uploaded successfully'); window.location.href='/hospitaldashboard';</script>`);
    }
  } catch (err) {
    console.error('❌ Error saving report to DB:', err.message, err);
    res.status(500).send('Error saving report to database');
  }
});

module.exports = router;





