// Usage: npm run seed   -> creates demo@placetrack.dev / demo1234 with sample data
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Application = require('./models/Application');

const DAY = 86400000;
// Deadlines are date-only values, stored as UTC midnight of the local calendar day.
// FIX: the old seed stored "now + n days" (with a time of day) which showed up one
// day off in some timezones.
const day = (n) => {
  const t = new Date();
  return new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate() + n));
};
const ago = (n) => new Date(Date.now() - n * DAY);

// Builds a believable status history, one step every `gap` days, ending today-ish
const PATHS = {
  Wishlist: ['Wishlist'],
  Applied: ['Applied'],
  'Online Test': ['Applied', 'Online Test'],
  Interview: ['Applied', 'Online Test', 'Interview'],
  Offer: ['Applied', 'Online Test', 'Interview', 'Offer'],
};
const history = (status, startedDaysAgo, gap, rejectedAfter) => {
  const path = status === 'Rejected' ? [...PATHS[rejectedAfter], 'Rejected'] : PATHS[status];
  return path.map((s, i) => ({ status: s, at: ago(Math.max(startedDaysAgo - i * gap, 0)) }));
};

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const old = await User.findOne({ email: 'demo@placetrack.dev' });
  if (old) await Application.deleteMany({ user: old.id });
  await User.deleteOne({ email: 'demo@placetrack.dev' });
  const user = await User.create({
    name: 'Demo Student',
    email: 'demo@placetrack.dev',
    password: await bcrypt.hash('demo1234', 10),
  });

  // company, role, status, type, location, ctc, deadline, notes, startedDaysAgo, gap, rejectedAfter
  const rows = [
    ['Google', 'Software Engineer Intern', 'Interview', 'Internship', 'Bengaluru', '1.2 L/month', day(4), 'Round 2 on Thursday. Revise graphs + DP.', 20, 7],
    ['Microsoft', 'SDE-1', 'Online Test', 'Full-time', 'Hyderabad', '45 LPA', day(2), 'OA on HackerRank, 90 mins, 3 questions.', 12, 8],
    ['Atlassian', 'Frontend Engineer', 'Applied', 'Full-time', 'Remote', '38 LPA', day(10), 'Referred by senior from college.', 9, 0],
    ['Razorpay', 'Backend Engineer', 'Wishlist', 'Full-time', 'Bengaluru', '28 LPA', day(14), 'Read their engineering blog before applying.', 16, 0],
    ['Adobe', 'Member of Technical Staff', 'Offer', 'Full-time', 'Noida', '32 LPA', day(5), 'Offer received. Reply within 7 days.', 40, 9],
    ['Flipkart', 'SDE Intern', 'Rejected', 'Internship', 'Bengaluru', '80k/month', null, 'Rejected after OA. Practice more medium problems.', 30, 10, 'Online Test'],
    ['Zomato', 'Full Stack Developer', 'Applied', 'Full-time', 'Gurugram', '24 LPA', day(7), '', 3, 0],
    ['TCS', 'Digital', 'Applied', 'Full-time', 'Pune', '7 LPA', day(21), 'NQT score valid till next month.', 24, 0],
  ];
  await Application.insertMany(
    rows.map(([company, role, status, type, location, ctc, deadline, notes, started, gap, rejectedAfter]) => ({
      user: user.id, company, role, status, type, location, ctc, deadline, notes,
      createdAt: ago(started),
      timeline: history(status, started, gap, rejectedAfter),
      checklist: [],
    }))
  );
  console.log('Seeded. Login: demo@placetrack.dev / demo1234');
  await mongoose.disconnect();
})();
