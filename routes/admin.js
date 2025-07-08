const express = require('express');
const User = require('../schema/user'); // User schema (Doctor, Patient, Hospital)
const Report = require('../schema/report'); // Report schema
const router = express.Router();

// Admin Dashboard Stats
router.get('/stats', async (req, res) => {
  try {
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalHospitals = await User.countDocuments({ role: 'hospital_staff' });
    const totalReports = await Report.countDocuments();
    res.json({ totalDoctors, totalPatients, totalHospitals, totalReports });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

//// CRUD for Doctors ////
// Get all doctors
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

// Add new doctor
router.post('/doctors', async (req, res) => {
  try {
    const { _id, name, email, password } = req.body;
    const newDoctor = new User({ _id, role: 'doctor', name, email, password });
    await newDoctor.save();
    res.json({ message: 'Doctor added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add doctor' });
  }
});

// Update doctor
router.put('/doctors/:id', async (req, res) => {
  try {
    await User.updateOne({ _id: req.params.id, role: 'doctor' }, req.body);
    res.json({ message: 'Doctor updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update doctor' });
  }
});

// Delete doctor
router.delete('/doctors/:id', async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id, role: 'doctor' });
    res.json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete doctor' });
  }
});


//// CRUD for Patients ////
// Get all patients
router.get('/patients', async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

// Add new patient
router.post('/patients', async (req, res) => {
  try {
    const { _id, name, email, password } = req.body;
    const newPatient = new User({ _id, role: 'patient', name, email, password });
    await newPatient.save();
    res.json({ message: 'Patient added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add patient' });
  }
});

// Update patient
router.put('/patients/:id', async (req, res) => {
  try {
    await User.updateOne({ _id: req.params.id, role: 'patient' }, req.body);
    res.json({ message: 'Patient updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update patient' });
  }
});

// Delete patient
router.delete('/patients/:id', async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id, role: 'patient' });
    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete patient' });
  }
});


//// CRUD for Hospital Staff ////
// Get all hospital staff
router.get('/hospitals', async (req, res) => {
  try {
    const hospitals = await User.find({ role: 'hospital_staff' });
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hospitals' });
  }
});

// Add new hospital staff
router.post('/hospitals', async (req, res) => {
  try {
    const { _id, name, email, password } = req.body;
    const newHospital = new User({ _id, role: 'hospital_staff', name, email, password });
    await newHospital.save();
    res.json({ message: 'Hospital staff added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add hospital staff' });
  }
});

// Update hospital staff
router.put('/hospitals/:id', async (req, res) => {
  try {
    await User.updateOne({ _id: req.params.id, role: 'hospital_staff' }, req.body);
    res.json({ message: 'Hospital staff updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update hospital staff' });
  }
});

// Delete hospital staff
router.delete('/hospitals/:id', async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id, role: 'hospital_staff' });
    res.json({ message: 'Hospital staff deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete hospital staff' });
  }
});


//// Manage Reports ////
// Get all reports
router.get('/reports', async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Delete a report
router.delete('/reports/:id', async (req, res) => {
  try {
    await Report.deleteOne({ _id: req.params.id });
    res.json({ message: 'Report deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

module.exports = router;
