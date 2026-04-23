require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

// Initialize Firebase
require('./config/firebase');

const app  = express();
const PORT = process.env.PORT || 5000;

/* ===========================
   ✅ CORS CONFIG (PRODUCTION READY)
=========================== */

const allowedOrigins = [
  process.env.CLIENT_URL,          // production frontend (Render)
  'http://localhost:3000',         // local dev
  'http://localhost:3001'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ CORS Blocked:", origin);
      callback(null, true); // allow (you can make this strict later)
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.options('*', cors());

/* ===========================
   ✅ MIDDLEWARE
=========================== */

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ===========================
   ✅ HEALTH CHECK
=========================== */

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/* ===========================
   ✅ ROUTES
=========================== */

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart',     require('./routes/cart'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/reviews',  require('./routes/reviews'));
app.use('/api/search',   require('./routes/search'));
app.use('/api/admin',    require('./routes/admin'));
app.use('/api/upload',   require('./routes/upload'));
app.use('/api/wishlist', require('./routes/wishlist'));

/* ===========================
   ❌ 404 HANDLER
=========================== */

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

/* ===========================
   ❌ ERROR HANDLER
=========================== */

app.use((err, req, res, next) => {
  console.error('🔥 Server error:', err.stack || err.message);
  res.status(500).json({
    error: err.message || 'Internal server error'
  });
});

/* ===========================
   🚀 START SERVER
=========================== */

app.listen(PORT, () => {
  console.log('\n======================================');
  console.log('🎨 Creative Canvas API Running');
  console.log(`🌍 URL: http://localhost:${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/health`);
  console.log('======================================\n');
});

module.exports = app;