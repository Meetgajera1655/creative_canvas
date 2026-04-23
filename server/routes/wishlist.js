const router = require('express').Router();
const { dbGet, dbInsert, dbDelete, dbQuery } = require('../config/firebase');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const items = await dbQuery('wishlist', 'user_id', req.user.userId);
    // Enrich with product data
    const enriched = [];
    for (const item of items) {
      const product = await dbGet('items/' + item.product_id);
      if (product) enriched.push({ ...item, product: { _key: item.product_id, ...product } });
    }
    res.json({ items: enriched });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/toggle', authMiddleware, async (req, res) => {
  try {
    const { product_id } = req.body;
    if (!product_id) return res.status(400).json({ error: 'product_id required' });
    const all = await dbQuery('wishlist', 'user_id', req.user.userId);
    const existing = all.find(i => i.product_id === product_id);
    if (existing) {
      await dbDelete('wishlist/' + existing._key);
      res.json({ wishlisted: false, message: 'Removed from wishlist' });
    } else {
      await dbInsert('wishlist', { user_id: req.user.userId, product_id, added_at: new Date().toISOString() });
      res.json({ wishlisted: true, message: 'Added to wishlist' });
    }
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/check/:productId', authMiddleware, async (req, res) => {
  try {
    const all = await dbQuery('wishlist', 'user_id', req.user.userId);
    const found = all.find(i => i.product_id === req.params.productId);
    res.json({ wishlisted: !!found });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
