const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fetchuser = require('../middleware/fetchuser');

const signToken = (user) =>
  jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ROUTE 1: Create a user - POST /api/auth/createuser (no login required)
router.post(
  '/createuser',
  [
    body('name', 'Name must be at least 3 characters').trim().isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array()[0].msg });
    }
    try {
      const email = req.body.email.toLowerCase();
      if (await User.findOne({ email })) {
        return res.status(400).json({ success: false, error: 'An account with this email already exists' });
      }
      const salt = await bcrypt.genSalt(10);
      const user = await User.create({
        name: req.body.name,
        email,
        password: await bcrypt.hash(req.body.password, salt),
      });
      res.json({ success: true, authtoken: signToken(user) });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

// ROUTE 2: Login - POST /api/auth/login (no login required)
router.post(
  '/login',
  [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists({ checkFalsy: true }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array()[0].msg });
    }
    try {
      const user = await User.findOne({ email: req.body.email.toLowerCase() });
      const ok = user && (await bcrypt.compare(req.body.password, user.password));
      if (!ok) {
        return res.status(400).json({ success: false, error: 'Incorrect email or password' });
      }
      res.json({ success: true, authtoken: signToken(user) });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

// ROUTE 3: Get logged-in user - GET /api/auth/getuser (login required)
router.get('/getuser', fetchuser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
