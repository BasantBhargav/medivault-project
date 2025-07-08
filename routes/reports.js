// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');
// const Report = require('../schema/report');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + '-' + file.originalname);
//   }
// });

// const upload = multer({ storage: storage });

// router.post('/upload-report', upload.single('report'), async (req, res) => {
//   const { patientId, reportType } = req.body;

//   if (!req.file) {
//     return res.status(400).send('No file uploaded');
//   }

//   try {
//     const newReport = new Report({
//       patientId,
//       reportType,
//       filePath: req.file.path
//     });

//     await newReport.save();
//     res.send('Report uploaded successfully!');
//   } catch (error) {
//     console.error('Error uploading report:', error);
//     res.status(500).send('Error uploading report');
//   }
// });

// module.exports = router;





////////////////////////////


const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const Report = require('../schema/report');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Multer config
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

// ✅ Upload endpoint
router.post('/upload-report', upload.single('report'), async (req, res) => {
  const { patientId, reportType } = req.body;

  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  try {
    const newReport = new Report({
      report_id: uuidv4(),
      patientId,
      reportType,
      filename: req.file.filename,
      filePath: `uploads/${req.file.filename}` // ✅ fixed here
    });

    await newReport.save();
    res.send('✅ Report uploaded successfully!');
  } catch (error) {
    console.error('Error uploading report:', error);
    res.status(500).send('Error uploading report');
  }
});

module.exports = router;
