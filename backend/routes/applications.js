const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const Application = require('../models/Application');
const { STATUSES, TYPES } = Application;

// Rules shared by create + update
const common = [
  body('status', 'Invalid status').optional().isIn(STATUSES),
  body('type', 'Invalid job type').optional().isIn(TYPES),
  body('deadline', 'Invalid deadline').optional({ values: 'falsy' }).isISO8601(),
  body('checklist', 'Checklist must be a list (max 50 items)').optional().isArray({ max: 50 }),
  body('checklist.*.text', 'Checklist item needs text (max 200 chars)').optional().isString().trim().notEmpty().isLength({ max: 200 }),
  body('checklist.*.done').optional().isBoolean(),
];
// Create needs company + role
const createRules = [
  body('company', 'Company name is required').trim().notEmpty(),
  body('role', 'Role is required').trim().notEmpty(),
  ...common,
];
// FIX: update used to require company + role too, so a status-only PUT
// (card dropdown / drag & drop) failed with "Company name is required".
const updateRules = [
  body('company', 'Company name cannot be empty').optional().trim().notEmpty(),
  body('role', 'Role cannot be empty').optional().trim().notEmpty(),
  ...common,
];

const FIELDS = ['company', 'role', 'status', 'type', 'location', 'ctc', 'deadline', 'link', 'notes', 'checklist'];
const pick = (src) => {
  const out = {};
  FIELDS.forEach((f) => {
    if (src[f] === undefined) return;
    if (f === 'deadline') out.deadline = src.deadline ? src.deadline : null;
    else if (f === 'checklist') out.checklist = (src.checklist || []).map((i) => ({ text: String(i.text).trim(), done: !!i.done }));
    else out[f] = src[f];
  });
  return out;
};

// ROUTE 1: List my applications - GET /api/applications
router.get('/', fetchuser, async (req, res) => {
  try {
    const apps = await Application.find({ user: req.user.id }).sort({ updatedAt: -1 });
    res.json(apps);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ROUTE 2: Create - POST /api/applications
router.post('/', fetchuser, createRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
  try {
    const data = pick(req.body);
    const app = await Application.create({
      ...data,
      user: req.user.id,
      timeline: [{ status: data.status || 'Applied', at: new Date() }],
    });
    res.status(201).json(app);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ROUTE 3: Update - PUT /api/applications/:id (partial updates allowed)
router.put('/:id', fetchuser, updateRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
  try {
    const app = await Application.findOne({ _id: req.params.id, user: req.user.id }); // only the owner can edit
    if (!app) return res.status(404).json({ error: 'Application not found' });

    const data = pick(req.body);
    const prevStatus = app.status;
    app.set(data);

    // Record every status change so the timeline + insights have history
    if (data.status && data.status !== prevStatus) {
      if (!app.timeline.length) app.timeline.push({ status: prevStatus, at: app.createdAt }); // old records
      app.timeline.push({ status: data.status, at: new Date() });
    }
    await app.save();
    res.json(app);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ROUTE 4: Delete - DELETE /api/applications/:id
router.delete('/:id', fetchuser, async (req, res) => {
  try {
    const app = await Application.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!app) return res.status(404).json({ error: 'Application not found' });
    res.json({ success: true, id: app.id });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
