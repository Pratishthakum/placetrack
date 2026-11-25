require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is missing. Copy .env.example to .env first.');
  process.exit(1);
}

connectToMongo();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/resources', require('./routes/resources'));

// Unknown route
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

app.listen(port, () => {
  console.log(`PlaceTrack API listening at http://localhost:${port}`);
});
