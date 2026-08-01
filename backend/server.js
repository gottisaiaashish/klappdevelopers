const dns = require('dns');
try { dns.setServers(['8.8.8.8', '8.8.4.4']); } catch (e) {}

const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const inquiryRoutes = require('./routes/inquiry');
const aiRoutes = require('./routes/ai');
const adminRoutes = require('./routes/admin');
const whatsappRoutes = require('./routes/whatsapp');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection Setup
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas Database!'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err.message));
} else {
  console.log('ℹ️ MONGODB_URI not set. Operating in local JSON storage mode.');
}

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://www.klappdevelopers.in',
  'https://klappdevelopers.in',
  'https://klappdevelopers.onrender.com',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(o => origin.startsWith(o)) || true) {
      callback(null, true);
    } else {
      callback(null, true); // Allow requests from production domains
    }
  },
  credentials: true
}));

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging Middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'KLAPP Developers Backend API',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/inquiry', inquiryRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// Root route welcome
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: system-ui, sans-serif; padding: 40px; text-align: center;">
      <h1 style="color: #18181b;">🚀 KLAPP Developers Backend API Server</h1>
      <p style="color: #52525b;">Status: Active & Running on Port ${PORT}</p>
      <hr style="max-width: 400px; margin: 20px auto; border: 0; border-top: 1px solid #e4e4e7;" />
      <p><a href="/api/health" style="color: #2563eb; text-decoration: none; font-weight: 600;">Check System Health API &rarr;</a></p>
    </div>
  `);
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint '${req.originalUrl}' not found on this server.`
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'An internal server error occurred.'
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`
==================================================
🚀 KLAPP Developers Backend API Server Running!
📡 Port       : http://localhost:${PORT}
⚡ Health API : http://localhost:${PORT}/api/health
📝 Inquiries  : http://localhost:${PORT}/api/inquiry
==================================================
  `);
});
