const express = require('express');
const router = express.Router();
const User = require('../schema/user'); // Adjust path if needed
const Report = require('../schema/report'); // Adjust path if needed

// API to fetch hospital details dynamically
router.get('/api/hospital/details', async (req, res) => {
  try {
    const hospitalId = req.session.userId; // assuming hospital user is logged in
    const hospital = await User.findById(hospitalId);
    if (!hospital) return res.status(404).json({ error: 'Hospital not found' });
    const totalReports = await Report.countDocuments({ hospitalId: hospitalId });
    res.json({
      id: hospital._id,
      name: hospital.name,
      phone: hospital.phone,
      email: hospital.email,
      totalReports
    });
  } catch (err) {
    console.error('Error fetching hospital details:', err);
    res.status(500).json({ error: 'Unable to fetch hospital details' });
  }
});

// New API endpoint to fetch patient details
router.get('/api/patient/details', async (req, res) => {
  try {
    const patientId = req.query.patientId;
    if (!patientId) {
      return res.status(400).json({ error: 'Patient ID is required' });
    }

    const patient = await User.findOne({ 
      _id: patientId,
      role: 'patient'
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({
      id: patient._id,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      verified: patient.verified,
      createdAt: patient.created_at
    });
  } catch (err) {
    console.error('Error fetching patient details:', err);
    res.status(500).json({ error: 'Unable to fetch patient details' });
  }
});

module.exports = router;