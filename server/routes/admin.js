// routes/admin.js
const router = require('express').Router();
const { dbGetAll, dbGet, dbUpdate } = require('../config/firebase');
const { adminMiddleware } = require('../middleware/auth');

router.get('/stats', adminMiddleware, async (req, res) => {
  try {
    const [orders, products, users, reviews] = await Promise.all([
      dbGetAll('orders'), dbGetAll('items'), dbGetAll('users'), dbGetAll('reviews')
    ]);
    const revenue = orders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + (o.total_amount || 0), 0);
    res.json({ totalOrders: orders.length, totalProducts: products.length, totalUsers: users.length, totalReviews: reviews.length, revenue, resinCount: products.filter(p => (p.brand||'resin')==='resin').length, kasabCount: products.filter(p => p.brand==='kasab').length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const users = await dbGetAll('users');
    users.sort((a, b) => b._key.localeCompare(a._key));
    res.json({ users: users.map(({ password: _, ...u }) => u) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/users/:id/status', adminMiddleware, async (req, res) => {
  try {
    await dbUpdate('users/' + req.params.id, { status: req.body.status });
    res.json({ message: 'Updated' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/reviews', adminMiddleware, async (req, res) => {
  try {
    const reviews = await dbGetAll('reviews');
    for (const r of reviews) {
      if (r.product_id) { const p = await dbGet('items/' + r.product_id); r.product_name = p?.name || ''; }
    }
    reviews.sort((a, b) => b._key.localeCompare(a._key));
    res.json({ reviews });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
