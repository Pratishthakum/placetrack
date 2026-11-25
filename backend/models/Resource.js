const mongoose = require('mongoose');
const { Schema } = mongoose;

// A link the student saved in the Resources hub ("My saved links")
const ResourceSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    url: { type: String, required: true, trim: true, maxlength: 500 },
    category: { type: String, trim: true, default: 'General', maxlength: 40 },
    note: { type: String, trim: true, default: '', maxlength: 300 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('resource', ResourceSchema);
