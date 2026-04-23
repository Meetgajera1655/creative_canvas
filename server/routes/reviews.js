// ============================================================
//  routes/reviews.js
// ============================================================
const router = require('express').Router();
const { dbGet, dbInsert, dbUpdate, dbQuery, dbDelete } = require('../config/firebase');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// GET /api/reviews/:productId
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await dbQuery('reviews', 'product_id', req.params.productId);
    reviews.sort((a, b) => b._key.localeCompare(a._key));
    res.json({ reviews });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/reviews
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body;
    if (!product_id || !rating) return res.status(400).json({ error: 'product_id and rating required' });
    const r = parseInt(rating);
    if (r < 1 || r > 5) return res.status(400).json({ error: 'Rating must be 1-5' });

    const product = await dbGet('items/' + product_id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Check existing review from this user
    const all = await dbQuery('reviews', 'product_id', product_id);
    const existing = all.find(rv => rv.user_id === req.user.userId);
    if (existing) {
      await dbUpdate('reviews/' + existing._key, { rating: r, comment: (comment || '').trim(), updated_at: new Date().toISOString() });
    } else {
      const user = await dbGet('users/' + req.user.userId);
      await dbInsert('reviews', { user_id: req.user.userId, product_id, rating: r, comment: (comment || '').trim(), username: user?.username || req.user.username || 'Customer', created_at: new Date().toISOString() });
    }

    // Recompute avg
    const updated = await dbQuery('reviews', 'product_id', product_id);
    const avg = +(updated.reduce((s, rv) => s + rv.rating, 0) / updated.length).toFixed(1);
    await dbUpdate('items/' + product_id, { rating_avg: avg, review_count: updated.length });

    res.json({ message: 'Review saved', rating_avg: avg, review_count: updated.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/reviews/:id  (admin only)
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    await dbDelete('reviews/' + req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
