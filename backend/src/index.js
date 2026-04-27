require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/trust-safety';

const PORT = process.env.PORT || 3000;

app.use(express.json());

// ✅ Clean allowed origins
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'https://trust-safety-dashboard-2mcpnw9zp-percylandas-projects.vercel.app',
].filter(Boolean);

// ✅ Single CORS middleware (this is all you need)
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

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

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Trust & Safety API is running',
  });
});

// DB + server
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