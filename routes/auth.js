// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcrypt');
// const path = require('path');
// const User = require('../schema/user');
// const Patient = require('../schema/patient');
// const Doctor = require('../schema/doctor');
// const Hospital = require('../schema/hospital');
// const Counter = require('../schema/counter');

// // Helper function to get next sequence
// async function getNextSequence(name) {
//   const counter = await Counter.findOneAndUpdate(
//     { name },
//     { $inc: { seq: 1 } },
//     { new: true, upsert: true }
//   );
//   return counter.seq;
// }

// // Serve Signup Page
// router.get('/signup', (req, res) => {
//   res.sendFile(path.join(__dirname, '../front/signup.html'));
// });

// // Handle Signup POST
// router.post('/signup', async (req, res) => {
//   try {
//     const { name, email, phone, password, role } = req.body;

//     // Get next user ID
//     const userId = await getNextSequence('user');

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user document
//     const newUser = new User({
//       _id: userId,
//       name,
//       email,
//       phone,
//       role,
//       password_hash: hashedPassword,
//       verified: false,
//       created_at: new Date()
//     });

//     await newUser.save();

//     // Create role-specific document
//     if (role === 'patient') {
//       const patientId = await getNextSequence('patient');
//       const newPatient = new Patient({
//         patient_id: patientId,
//         user_id: userId,
//         age: req.body.age,
//         gender: req.body.gender,
//         address: req.body.address,
//         contact_number: req.body.contact_number,
//         medical_history: req.body.medical_history ? 
//                           req.body.medical_history.split(',').map(item => item.trim()) : []
//       });
//       await newPatient.save();

//     } else if (role === 'doctor') {
//       const doctorId = await getNextSequence('doctor');
//       const newDoctor = new Doctor({
//         doc_id: doctorId,
//         user_id: userId,
//         license_number: req.body.license_number,
//         specialization: req.body.specialization,
//         hospital_id: req.body.hospital_id,
//         contact_number: req.body.contact_number,
//         experience_years: req.body.experience_years
//       });
//       await newDoctor.save();

//     } else if (role === 'hospital_staff') {
//       const hospitalId = await getNextSequence('hospital');
//       const newHospital = new Hospital({
//         hospital_id: hospitalId,
//         name: req.body.hospital_name,
//         location: {
//           address_line: req.body.address_line,
//           city: req.body.city,
//           state: req.body.state,
//           country: 'India',
//           pin_code: req.body.pin_code
//         },
//         contact: {
//           phone: req.body.hospital_phone,
//           email: req.body.hospital_email
//         },
//         admin_user_id: userId
//       });
//       await newHospital.save();
//     }

//     // Redirect based on role
//     if (role === 'admin') return res.redirect('/admindashboard');
//     if (role === 'doctor') return res.redirect('/doctordashboard');
//     if (role === 'patient') return res.redirect('/patientdashboard');
//     if (role === 'hospital_staff') return res.redirect('/hospitaldashboard');

//     res.redirect('/home');

//   } catch (err) {
//     console.error("❌ Error saving user:", err);
//     res.status(500).send("Signup failed. Email or phone may already be used.");
//   }
// });

// // Serve Login Page
// router.get('/login', (req, res) => {
//   res.sendFile(path.join(__dirname, '../front/login.html'));
// });

// // Handle Login POST
// router.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({
//       $or: [{ email: username }, { name: username }]
//     });

//     if (!user) return res.status(401).send("User not found");

//     const isMatch = await bcrypt.compare(password, user.password_hash);
//     if (!isMatch) return res.status(401).send("Invalid password");

//     // Set session data
//     req.session.userId = user._id;
//     req.session.role = user.role;
//     req.session.name = user.name;

//     if (user.role === 'admin') return res.redirect('/admindashboard');
//     if (user.role === 'doctor') return res.redirect('/doctordashboard');
//     if (user.role === 'patient') return res.redirect('/patientdashboard');
//     if (user.role === 'hospital_staff') return res.redirect('/hospitaldashboard');

//     res.redirect('/home');

//   } catch (err) {
//     console.error("❌ Login error:", err);
//     res.status(500).send("Login failed");
//   }
// });

// // ✅ Serve Forgot Password Page
// router.get('/forgot-password', (req, res) => {
//   res.sendFile(path.join(__dirname, '../front/forgot-password.html'));
// });

// // ✅ Handle Forgot Password POST (AJAX Version)
// router.post('/forgot-password', async (req, res) => {
//   const { email, newPassword } = req.body;

//   try {
//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) {
//       return res.status(404).json({ success: false, message: "❌ Email not found" });
//     }

//     // Hash the new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // Update password
//     user.password_hash = hashedPassword;
//     await user.save();

//     res.status(200).json({ success: true, message: "✅ Password updated successfully!" });
//   } catch (err) {
//     console.error("❌ Error updating password:", err);
//     res.status(500).json({ success: false, message: "Internal server error." });
//   }
// });

// module.exports = router;




//////// 222222222 ////////

// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcrypt');
// const path = require('path');

// const User = require('../schema/user');
// const Patient = require('../schema/patient');
// const Doctor = require('../schema/doctor');
// const Hospital = require('../schema/hospital');
// const Counter = require('../schema/counter');
// const PendingUser = require('../schema/pendingUser'); // 🆕 Add PendingUser schema

// // Helper function to get next sequence
// async function getNextSequence(name) {
//   const counter = await Counter.findOneAndUpdate(
//     { name },
//     { $inc: { seq: 1 } },
//     { new: true, upsert: true }
//   );
//   return counter.seq;
// }

// // Serve Signup Page
// router.get('/signup', (req, res) => {
//   res.sendFile(path.join(__dirname, '../front/signup.html'));
// });

// // Handle Signup POST
// router.post('/signup', async (req, res) => {
//   try {
//     const { name, email, phone, password, role } = req.body;

//     // Get next user ID
//     const userId = await getNextSequence('user');

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     if (role === 'patient') {
//       // ✅ Save patient directly
//       const newUser = new User({
//         _id: userId,
//         name,
//         email,
//         phone,
//         role,
//         password_hash: hashedPassword,
//         verified: true,
//         created_at: new Date()
//       });
//       await newUser.save();

//       const patientId = await getNextSequence('patient');
//       const newPatient = new Patient({
//         patient_id: patientId,
//         user_id: userId,
//         age: req.body.age,
//         gender: req.body.gender,
//         address: req.body.address,
//         contact_number: req.body.contact_number,
//         medical_history: req.body.medical_history ? 
//                           req.body.medical_history.split(',').map(item => item.trim()) : []
//       });
//       await newPatient.save();

//       return res.redirect('/patientdashboard');
//     } else if (role === 'doctor' || role === 'hospital_staff') {
//       // ✅ Save doctor and hospital signup requests in PendingUser
//       const pendingUser = new PendingUser({
//         _id: userId,
//         name,
//         email,
//         phone,
//         role,
//         password_hash: hashedPassword,
//         extraData: req.body, // Store all submitted fields
//         created_at: new Date()
//       });
//       await pendingUser.save();

//       return res.send(`<script>alert('Your signup request has been sent for admin approval. You will be notified once approved.'); window.location.href='/login';</script>`);
//     }
//   } catch (err) {
//     console.error("❌ Error saving user:", err);
//     res.status(500).send("Signup failed. Email or phone may already be used.");
//   }
// });

// // Serve Login Page
// router.get('/login', (req, res) => {
//   res.sendFile(path.join(__dirname, '../front/login.html'));
// });

// // Handle Login POST
// router.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({
//       $or: [{ email: username }, { name: username }]
//     });

//     if (!user) return res.status(401).send("User not found");

//     const isMatch = await bcrypt.compare(password, user.password_hash);
//     if (!isMatch) return res.status(401).send("Invalid password");

//     // Set session data
//     req.session.userId = user._id;
//     req.session.role = user.role;
//     req.session.name = user.name;

//     if (user.role === 'admin') return res.redirect('/admindashboard');
//     if (user.role === 'doctor') return res.redirect('/doctordashboard');
//     if (user.role === 'patient') return res.redirect('/patientdashboard');
//     if (user.role === 'hospital_staff') return res.redirect('/hospitaldashboard');

//     res.redirect('/home');

//   } catch (err) {
//     console.error("❌ Login error:", err);
//     res.status(500).send("Login failed");
//   }
// });

// // ✅ Serve Forgot Password Page
// router.get('/forgot-password', (req, res) => {
//   res.sendFile(path.join(__dirname, '../front/forgot-password.html'));
// });

// // ✅ Handle Forgot Password POST (AJAX Version)
// router.post('/forgot-password', async (req, res) => {
//   const { email, newPassword } = req.body;

//   try {
//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) {
//       return res.status(404).json({ success: false, message: "❌ Email not found" });
//     }

//     // Hash the new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // Update password
//     user.password_hash = hashedPassword;
//     await user.save();

//     res.status(200).json({ success: true, message: "✅ Password updated successfully!" });
//   } catch (err) {
//     console.error("❌ Error updating password:", err);
//     res.status(500).json({ success: false, message: "Internal server error." });
//   }
// });

// module.exports = router;


/////// 333333333333333333 //////////////////////

// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcrypt');
// const path = require('path');

// const User = require('../schema/user');
// const Patient = require('../schema/patient');
// const Doctor = require('../schema/doctor');
// const Hospital = require('../schema/hospital');
// const Counter = require('../schema/counter');
// const PendingUser = require('../schema/pendingUser'); // 🆕 PendingUser schema

// // Helper function to get next sequence
// async function getNextSequence(name) {
//   const counter = await Counter.findOneAndUpdate(
//     { name },
//     { $inc: { seq: 1 } },
//     { new: true, upsert: true }
//   );
//   return counter.seq;
// }

// // Serve Signup Page
// router.get('/signup', (req, res) => {
//   res.sendFile(path.join(__dirname, '../front/signup.html'));
// });

// // Handle Signup POST
// router.post('/signup', async (req, res) => {
//   try {
//     const { name, email, phone, password, role } = req.body;

//     // Get next user ID
//     const userId = await getNextSequence('user');

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     if (role === 'patient') {
//       // ✅ Save patient directly
//       const newUser = new User({
//         _id: userId,
//         name,
//         email,
//         phone,
//         role,
//         password_hash: hashedPassword,
//         verified: true,
//         created_at: new Date()
//       });
//       await newUser.save();

//       const patientId = await getNextSequence('patient');
//       const newPatient = new Patient({
//         patient_id: patientId,
//         user_id: userId,
//         age: req.body.age,
//         gender: req.body.gender,
//         address: req.body.address,
//         contact_number: req.body.contact_number,
//         medical_history: req.body.medical_history ? 
//                           req.body.medical_history.split(',').map(item => item.trim()) : []
//       });
//       await newPatient.save();

//       return res.redirect('/patientdashboard');
//     } else if (role === 'doctor' || role === 'hospital_staff') {
//       // ✅ Save doctor and hospital signup requests in PendingUser
//       const pendingUser = new PendingUser({
//         _id: userId,
//         name,
//         email,
//         phone,
//         role,
//         password_hash: hashedPassword,
//         extraData: { ...req.body }, // Store all submitted fields
//         created_at: new Date()
//       });
//       await pendingUser.save();

//       return res.send(`<script>alert('Your signup request has been sent for admin approval. You will be notified once approved.'); window.location.href='/login';</script>`);
//     } else {
//       return res.status(400).send("Invalid role provided.");
//     }
//   } catch (err) {
//     console.error("❌ Error saving user:", err);
//     res.status(500).send("Signup failed. Email or phone may already be used.");
//   }
// });

// // Serve Login Page
// router.get('/login', (req, res) => {
//   res.sendFile(path.join(__dirname, '../front/login.html'));
// });

// // Handle Login POST
// router.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({
//       $or: [{ email: username }, { name: username }]
//     });

//     if (!user) return res.status(401).send("User not found");

//     const isMatch = await bcrypt.compare(password, user.password_hash);
//     if (!isMatch) return res.status(401).send("Invalid password");

//     // Set session data
//     req.session.userId = user._id;
//     req.session.role = user.role;
//     req.session.name = user.name;

//     if (user.role === 'admin') return res.redirect('/admindashboard');
//     if (user.role === 'doctor') return res.redirect('/doctordashboard');
//     if (user.role === 'patient') return res.redirect('/patientdashboard');
//     if (user.role === 'hospital_staff') return res.redirect('/hospitaldashboard');

//     res.redirect('/home');
//   } catch (err) {
//     console.error("❌ Login error:", err);
//     res.status(500).send("Login failed");
//   }
// });

// // ✅ Serve Forgot Password Page
// router.get('/forgot-password', (req, res) => {
//   res.sendFile(path.join(__dirname, '../front/forgot-password.html'));
// });

// // ✅ Handle Forgot Password POST (AJAX Version)
// router.post('/forgot-password', async (req, res) => {
//   const { email, newPassword } = req.body;

//   try {
//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) {
//       return res.status(404).json({ success: false, message: "❌ Email not found" });
//     }

//     // Hash the new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // Update password
//     user.password_hash = hashedPassword;
//     await user.save();

//     res.status(200).json({ success: true, message: "✅ Password updated successfully!" });
//   } catch (err) {
//     console.error("❌ Error updating password:", err);
//     res.status(500).json({ success: false, message: "Internal server error." });
//   }
// });

// module.exports = router;



/////////////////// 4444444444444444 ////////////////////

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const path = require('path');

const User = require('../schema/user');
const Patient = require('../schema/patient');
const Doctor = require('../schema/doctor');
const Hospital = require('../schema/hospital');
const Counter = require('../schema/counter');
const PendingUser = require('../schema/pendingUser');

// ✅ Temporary in-memory OTP store
let otpStore = {};

// Helper: Get next sequence for IDs
async function getNextSequence(name) {
    const counter = await Counter.findOneAndUpdate(
        { name },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return counter.seq;
}

// ✅ Serve Signup Page
router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../front/signup.html'));
});

// ✅ Handle Signup POST
router.post('/signup', async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;
        const userId = await getNextSequence('user');
        const hashedPassword = await bcrypt.hash(password, 10);

        if (role === 'patient') {
            const newUser = new User({
                _id: userId,
                name,
                email,
                phone,
                role,
                password_hash: hashedPassword,
                verified: true,
                created_at: new Date()
            });
            await newUser.save();

            const patientId = await getNextSequence('patient');
            const newPatient = new Patient({
                patient_id: patientId,
                user_id: userId,
                age: req.body.age,
                gender: req.body.gender,
                address: req.body.address,
                contact_number: req.body.contact_number,
                medical_history: req.body.medical_history ? req.body.medical_history.split(',').map(item => item.trim()) : []
            });
            await newPatient.save();

            return res.redirect('/patientdashboard');
        } else if (role === 'doctor' || role === 'hospital_staff') {
            const pendingUser = new PendingUser({
                _id: userId,
                name,
                email,
                phone,
                role,
                password_hash: hashedPassword,
                extraData: { ...req.body },
                created_at: new Date()
            });
            await pendingUser.save();

            return res.send(`<script>alert('Your signup request has been sent for admin approval. You will be notified once approved.'); window.location.href='/login';</script>`);
        } else {
            return res.status(400).send("Invalid role provided.");
        }
    } catch (err) {
        console.error("❌ Error saving user:", err);
        res.status(500).send("Signup failed. Email or phone may already be used.");
    }
});

// ✅ Serve Login Page
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../front/login.html'));
});

// ✅ Handle Login POST
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({
            $or: [{ email: username }, { name: username }]
        });

        if (!user) return res.status(401).send("❌ User not found");

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).send("❌ Invalid password");

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

// ✅ Send OTP route
router.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ success: false, message: "❌ Email not found." });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        otpStore[email] = {
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000 // 5 mins validity
        };

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'bhargavbasant123@gmail.com', // Replace with your Gmail
                pass: 'onok cstd xctp pguj'     // Replace with App Password
            }
        });

        await transporter.sendMail({
            from: '"MediVault" <your-email@gmail.com>',
            to: email,
            subject: "MediVault Password Reset OTP",
            text: `Your OTP for password reset is: ${otp} (Valid for 5 minutes)`
        });

        console.log(`✅ OTP sent to ${email}: ${otp}`);
        res.status(200).json({ success: true, message: "✅ OTP sent to your email." });
    } catch (err) {
        console.error("❌ Error sending OTP:", err);
        res.status(500).json({ success: false, message: "Failed to send OTP." });
    }
});

// ✅ Verify OTP route
router.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    const record = otpStore[email];

    if (!record || record.expiresAt < Date.now()) {
        return res.status(400).json({ success: false, message: "❌ OTP expired or invalid." });
    }

    if (parseInt(otp) !== record.otp) {
        return res.status(400).json({ success: false, message: "❌ Incorrect OTP." });
    }

    otpStore[email].verified = true; // Mark as verified
    res.status(200).json({ success: true, message: "✅ OTP verified successfully." });
});

// ✅ Reset Password route
router.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
    const record = otpStore[email];

    if (!record || !record.verified) {
        return res.status(403).json({ success: false, message: "❌ OTP verification required." });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ success: false, message: "❌ User not found." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password_hash = hashedPassword;
        await user.save();

        delete otpStore[email]; // Clear OTP after success

        res.status(200).json({ success: true, message: "✅ Password reset successfully!" });
    } catch (err) {
        console.error("❌ Error resetting password:", err);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});

module.exports = router;



