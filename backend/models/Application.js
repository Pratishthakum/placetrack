const mongoose = require('mongoose');
const { Schema } = mongoose;

const STATUSES = ['Wishlist', 'Applied', 'Online Test', 'Interview', 'Offer', 'Rejected'];
const TYPES = ['Full-time', 'Internship', 'Contract'];

// One line of the per-application prep checklist
const ChecklistItemSchema = new Schema(
  {
    text: { type: String, required: true, trim: true, maxlength: 200 },
    done: { type: Boolean, default: false },
  },
  { _id: false }
);

// One entry per status change (used for the timeline + insights)
const TimelineSchema = new Schema(
  {
    status: { type: String, enum: STATUSES, required: true },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ApplicationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true, index: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    status: { type: String, enum: STATUSES, default: 'Applied' },
    type: { type: String, enum: TYPES, default: 'Full-time' },
    location: { type: String, trim: true, default: '' },
    ctc: { type: String, trim: true, default: '' }, // e.g. "12 LPA" or "40k/month"
    deadline: { type: Date, default: null },
    link: { type: String, trim: true, default: '' },
    notes: { type: String, default: '' },
    checklist: { type: [ChecklistItemSchema], default: [] },
    timeline: { type: [TimelineSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('application', ApplicationSchema);
module.exports.STATUSES = STATUSES;
module.exports.TYPES = TYPES;
