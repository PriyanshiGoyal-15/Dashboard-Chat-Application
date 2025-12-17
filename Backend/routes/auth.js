const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const adminModule = require('./admin');

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: 'Please enter all required fields' });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    user = new User({ name, email, phone, password: hashed });
    await user.save();

    // broadcast stats update (if admin module initialized)
    if (adminModule && typeof adminModule.emitStats === 'function') {
      try { await adminModule.emitStats(); } catch (e) { console.error('emitStats error', e); }
    }

    const payload = { user: { id: user._id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, isAdmin: user.isAdmin } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    console.log(password)
    if (!email || !password) return res.status(400).json({ msg: 'Please enter all required fields' });

    const user = await User.findOne({ email });
    console.log("user", user)
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });


    const isMatch = await bcrypt.compare(password, user.password);
    console.log("match", isMatch)
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user._id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, isAdmin: user.isAdmin } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
