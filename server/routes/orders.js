// routes/orders.js
const router   = require('express').Router();
const crypto   = require('crypto');
const Razorpay = require('razorpay');
const { dbGet, dbInsert, dbUpdate, dbDelete, dbQuery, getCartItems } = require('../config/firebase');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

let razorpay;
try {
  razorpay = new Razorpay({
    key_id:     process.env.RAZORPAY_KEY_ID     || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder'
  });
} catch (e) { console.warn('Razorpay init failed (set keys in .env)'); }

// POST /api/orders/create-razorpay-order
router.post('/create-razorpay-order', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body; // amount in paise
    if (!razorpay) return res.status(503).json({ error: 'Payment gateway not configured' });
    const order = await razorpay.orders.create({ amount: Math.round(amount), currency: 'INR', receipt: 'cc_' + Date.now() });
    res.json({ order_id: order.id, amount: order.amount, currency: order.currency, key: process.env.RAZORPAY_KEY_ID });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/orders/verify-payment
router.post('/verify-payment', authMiddleware, (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body      = razorpay_order_id + '|' + razorpay_payment_id;
    const expected  = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '').update(body).digest('hex');
    if (expected === razorpay_signature) res.json({ verified: true });
    else res.status(400).json({ error: 'Payment verification failed' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/orders  (place order)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const uid = req.user.userId;
    const { items, address, payment_method, payment_id, total, shipping } = req.body;
    if (!items || !items.length) return res.status(400).json({ error: 'No items' });

    const orderId = await dbInsert('orders', {
      user_id:          uid,
      items,
      address:          address || {},
      payment_method:   payment_method || 'Razorpay',
      payment_id:       payment_id     || '',
      payment_status:   payment_method === 'COD' ? 'pending' : 'paid',
      order_status:     'placed',
      total_amount:     parseFloat(total)    || 0,
      shipping_amount:  parseFloat(shipping) || 0,
      created_at:       new Date().toISOString()
    });

    // Clear cart
    const cartItems = await getCartItems(uid);
    for (const ci of cartItems) await dbDelete('cart/' + ci._key);

    res.status(201).json({ order_id: orderId, message: 'Order placed successfully' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/orders/my
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const orders = await dbQuery('orders', 'user_id', req.user.userId);
    orders.sort((a, b) => b._key.localeCompare(a._key));
    res.json({ orders });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/orders/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await dbGet('orders/' + req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.user_id !== req.user.userId && !req.user.isAdmin) return res.status(403).json({ error: 'Forbidden' });
    res.json({ order: { _key: req.params.id, ...order } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── ADMIN ────────────────────────────────────────────────────

// GET /api/orders/admin/all
router.get('/admin/all', adminMiddleware, async (req, res) => {
  try {
    const { dbGetAll } = require('../config/firebase');
    const orders = await dbGetAll('orders');
    orders.sort((a, b) => b._key.localeCompare(a._key));
    for (const o of orders) {
      if (o.user_id) { const u = await dbGet('users/' + o.user_id); o.user_email = u?.email || ''; o.username = u?.username || ''; }
    }
    res.json({ orders });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/orders/:id/status  (admin)
router.put('/:id/status', adminMiddleware, async (req, res) => {
  try {
    const { order_status, payment_status } = req.body;
    const update = {};
    if (order_status)   update.order_status   = order_status;
    if (payment_status) update.payment_status = payment_status;
    await dbUpdate('orders/' + req.params.id, update);
    res.json({ message: 'Order updated' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
