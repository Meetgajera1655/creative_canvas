// routes/auth.js
const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { findUserByEmail, dbInsert, dbGet } = require('../config/firebase');
const { authMiddleware } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'creative-canvas-secret';
const sign = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    // Admin login
    if (email.toLowerCase() === (process.env.ADMIN_EMAIL || '').toLowerCase() &&
        password === process.env.ADMIN_PASSWORD) {
      const token = sign({ userId: 'admin', email, isAdmin: true, username: 'Admin' });
      return res.json({ token, user: { userId: 'admin', username: 'Admin', email, isAdmin: true } });
    }

    const user = await findUserByEmail(email.toLowerCase());
    if (!user) return res.status(401).json({ error: 'No account found with that email' });
    if (user.status === 'blocked') return res.status(403).json({ error: 'Account blocked' });

    const match = await bcrypt.compare(password, user.password || '');
    if (!match) return res.status(401).json({ error: 'Incorrect password' });

    const token = sign({ userId: user._key, email: user.email, isAdmin: false, username: user.username });
    res.json({ token, user: { userId: user._key, username: user.username, email: user.email, isAdmin: false, dpphoto: user.dpphoto || '' } });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, mobile } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'All fields required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const existing = await findUserByEmail(email.toLowerCase());
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hash   = await bcrypt.hash(password, 12);
    const userId = await dbInsert('users', {
      username, email: email.toLowerCase(), password: hash,
      mobile: mobile || '', status: 'active', role: 'user',
      created_at: new Date().toISOString()
    });

    const token = sign({ userId, email: email.toLowerCase(), isAdmin: false, username });
    res.status(201).json({ token, user: { userId, username, email: email.toLowerCase(), isAdmin: false } });
  } catch (e) {
    console.error('Signup error:', e);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    if (req.user.isAdmin) return res.json({ user: { ...req.user } });
    const user = await dbGet('users/' + req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password: _, ...safe } = user;
    res.json({ user: { _key: req.user.userId, ...safe } });
  } catch (e) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

module.exports = router;
