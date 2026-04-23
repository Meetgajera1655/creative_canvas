// ============================================================
//  routes/cart.js
// ============================================================
const router = require('express').Router();
const { dbGet, dbInsert, dbUpdate, dbDelete, dbQuery, getCartItems, checkCartItem } = require('../config/firebase');
const { authMiddleware } = require('../middleware/auth');

// GET /api/cart
router.get('/', authMiddleware, async (req, res) => {
  try {
    const items = await getCartItems(req.user.userId);
    let subtotal = 0;
    for (const item of items) { item.line_total = (item.price || 0) * (item.quantity || 1); subtotal += item.line_total; }
    const shipping = subtotal >= 999 || items.length === 0 ? 0 : 60;
    res.json({ items, subtotal, shipping, total: subtotal + shipping });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/cart
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    if (!product_id) return res.status(400).json({ error: 'product_id required' });
    const product = await dbGet('items/' + product_id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const existing = await checkCartItem(req.user.userId, product_id);
    if (existing) {
      await dbUpdate('cart/' + existing._key, { quantity: (existing.quantity || 1) + parseInt(quantity) });
    } else {
      await dbInsert('cart', { user_id: req.user.userId, product_id, name: product.name, price: product.price, photo: product.photo || '', brand: product.brand || 'resin', quantity: parseInt(quantity), added_at: new Date().toISOString() });
    }
    const all = await getCartItems(req.user.userId);
    res.json({ message: 'Added to cart', count: all.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/cart/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const qty = Math.max(1, parseInt(req.body.quantity) || 1);
    await dbUpdate('cart/' + req.params.id, { quantity: qty });
    res.json({ message: 'Cart updated' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/cart/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await dbDelete('cart/' + req.params.id);
    const all = await getCartItems(req.user.userId);
    res.json({ message: 'Item removed', count: all.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
