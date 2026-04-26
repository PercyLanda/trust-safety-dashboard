require('dotenv').config();

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

const cors = require('cors');

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'https://trust-safety-dashboard-2mcpnw9zp-percylandas-projects.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    // allow Postman / server-to-server
    if (!origin) return callback(null, true);

    // allow exact matches
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // allow ANY vercel preview deployment
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    console.log('❌ Blocked by CORS:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

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