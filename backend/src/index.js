const express = require('express');
const mongoose = require('mongoose');

const app = express();

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/trust-safety';

const PORT = process.env.PORT || 3000;

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  CLIENT_URL,
].filter(Boolean);

app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,DELETE,OPTIONS'
  );

  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.sendStatus(204);

  next();
});

// API routes
app.use('/api/cases', require('./routes/cases'));

// ✅ HEALTH CHECK ROUTE (added)
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Trust & Safety API is running',
  });
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () =>
      console.log(`Backend running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  });