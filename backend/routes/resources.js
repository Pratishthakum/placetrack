const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const Resource = require('../models/Resource');

const rules = [
  body('title', 'Title is required (max 120 chars)').trim().notEmpty().isLength({ max: 120 }),
  body('url', 'Enter a valid http(s) link').trim().isURL({ protocols: ['http', 'https'], require_protocol: true }),
  body('category').optional().trim().isLength({ max: 40 }),
  body('note').optional().trim().isLength({ max: 300 }),
];

// GET /api/resources - my saved links
router.get('/', fetchuser, async (req, res) => {
  try {
    res.json(await Resource.find({ user: req.user.id }).sort({ createdAt: -1 }));
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/resources - save a link
router.post('/', fetchuser, rules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
  try {
    const { title, url, category, note } = req.body;
    const count = await Resource.countDocuments({ user: req.user.id });
    if (count >= 200) return res.status(400).json({ error: 'You can save up to 200 links' });
    const doc = await Resource.create({ user: req.user.id, title, url, category: category || 'General', note: note || '' });
    res.status(201).json(doc);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/resources/:id
router.delete('/:id', fetchuser, async (req, res) => {
  try {
    const doc = await Resource.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!doc) return res.status(404).json({ error: 'Link not found' });
    res.json({ success: true, id: doc.id });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
