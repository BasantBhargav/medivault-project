const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const path = require('path');
const User = require('../schema/user');
const Patient = require('../schema/patient');
const Doctor = require('../schema/doctor');
const Hospital = require('../schema/hospital');
const Counter = require('../schema/counter');

// Helper function to get next sequence
async function getNextSequence(name) {
  const counter = await Counter.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

// Serve Signup Page
router.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/signup.html'));
});

// Handle Signup POST
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Get next user ID
    const userId = await getNextSequence('user');

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user document
    const newUser = new User({
      _id: userId,
      name,
      email,
      phone,
      role,
      password_hash: hashedPassword,
      verified: false,
      created_at: new Date()
    });

    await newUser.save();

    // Create role-specific document
    if (role === 'patient') {
      const patientId = await getNextSequence('patient');
      const newPatient = new Patient({
        patient_id: patientId,
        user_id: userId,
        age: req.body.age,
        gender: req.body.gender,
        address: req.body.address,
        contact_number: req.body.contact_number,
        medical_history: req.body.medical_history ? 
                          req.body.medical_history.split(',').map(item => item.trim()) : []
      });
      await newPatient.save();

    } else if (role === 'doctor') {
      const doctorId = await getNextSequence('doctor');
      const newDoctor = new Doctor({
        doc_id: doctorId,
        user_id: userId,
        license_number: req.body.license_number,
        specialization: req.body.specialization,
        hospital_id: req.body.hospital_id,
        contact_number: req.body.contact_number,
        experience_years: req.body.experience_years
      });
      await newDoctor.save();

    } else if (role === 'hospital_staff') {
      const hospitalId = await getNextSequence('hospital');
      const newHospital = new Hospital({
        hospital_id: hospitalId,
        name: req.body.hospital_name,
        location: {
          address_line: req.body.address_line,
          city: req.body.city,
          state: req.body.state,
          country: 'India',
          pin_code: req.body.pin_code
        },
        contact: {
          phone: req.body.hospital_phone,
          email: req.body.hospital_email
        },
        admin_user_id: userId
      });
      await newHospital.save();
    }

    // Redirect based on role
    if (role === 'admin') return res.redirect('/admindashboard');
    if (role === 'doctor') return res.redirect('/doctordashboard');
    if (role === 'patient') return res.redirect('/patientdashboard');
    if (role === 'hospital_staff') return res.redirect('/hospitaldashboard');

    res.redirect('/home');

  } catch (err) {
    console.error("❌ Error saving user:", err);
    res.status(500).send("Signup failed. Email or phone may already be used.");
  }
});

// Serve Login Page
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/login.html'));
});

// Handle Login POST
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: username }, { name: username }]
    });

    if (!user) return res.status(401).send("User not found");

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).send("Invalid password");

    // Set session data
    req.session.userId = user._id;
    req.session.role = user.role;
    req.session.name = user.name;

    if (user.role === 'admin') return res.redirect('/admindashboard');
    if (user.role === 'doctor') return res.redirect('/doctordashboard');
    if (user.role === 'patient') return res.redirect('/patientdashboard');
    if (user.role === 'hospital_staff') return res.redirect('/hospitaldashboard');

    res.redirect('/home');

  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).send("Login failed");
  }
});

// ✅ Serve Forgot Password Page
router.get('/forgot-password', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/forgot-password.html'));
});

// ✅ Handle Forgot Password POST (AJAX Version)
router.post('/forgot-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: "❌ Email not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password_hash = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: "✅ Password updated successfully!" });
  } catch (err) {
    console.error("❌ Error updating password:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

module.exports = router;




