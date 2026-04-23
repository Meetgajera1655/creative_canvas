// routes/products.js
const router  = require('express').Router();
const multer  = require('multer');
const path    = require('path');
const { dbGetAll, dbGet, dbInsert, dbUpdate, dbDelete, dbQuery } = require('../config/firebase');
const { adminMiddleware, authMiddleware } = require('../middleware/auth');

// Multer for image upload
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename:    (_, file, cb) => cb(null, Date.now() + '_' + file.originalname.replace(/\s/g, '_'))
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, brand, q, sort, min_price, max_price, min_rating, limit: lim } = req.query;
    let products = await dbGetAll('items');

    if (brand)    products = products.filter(p => (p.brand || 'resin') === brand);
    if (category) products = products.filter(p => p.type === category);
    if (q) {
      const ql = q.toLowerCase();
      products = products.filter(p =>
        (p.name || '').toLowerCase().includes(ql) ||
        (p.type || '').toLowerCase().includes(ql) ||
        (p.brand || '').toLowerCase().includes(ql) ||
        (p.description || '').toLowerCase().includes(ql)
      );
    }
    if (min_price) products = products.filter(p => (p.price || 0) >= parseFloat(min_price));
    if (max_price) products = products.filter(p => (p.price || 0) <= parseFloat(max_price));
    if (min_rating) products = products.filter(p => (p.rating_avg || 0) >= parseFloat(min_rating));

    if (sort === 'price_asc')  products.sort((a, b) => a.price - b.price);
    if (sort === 'price_desc') products.sort((a, b) => b.price - a.price);
    if (sort === 'rating')     products.sort((a, b) => (b.rating_avg || 0) - (a.rating_avg || 0));
    if (sort === 'newest')     products.sort((a, b) => b._key.localeCompare(a._key));

    if (lim) products = products.slice(0, parseInt(lim));

    res.json({ products, total: products.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/products/categories
router.get('/categories', async (req, res) => {
  try {
    const { brand } = req.query;
    const products = await dbGetAll('items');
    const filtered = brand ? products.filter(p => (p.brand || 'resin') === brand) : products;
    const cats = [...new Set(filtered.map(p => p.type).filter(Boolean))].sort();
    const counts = {};
    cats.forEach(c => counts[c] = filtered.filter(p => p.type === c).length);
    res.json({ categories: cats, counts });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await dbGet('items/' + req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ product: { _key: req.params.id, ...product } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/products  (admin only)
router.post('/', adminMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const { name, type, brand, price, description, stock } = req.body;
    if (!name || !price) return res.status(400).json({ error: 'Name and price required' });
    const data = {
      name, type: type || '', brand: brand || 'resin',
      price: parseFloat(price), stock: parseInt(stock) || 0,
      description: description || '',
      photo: req.file ? req.file.filename : '',
      rating_avg: 0, review_count: 0,
      created_at: new Date().toISOString()
    };
    const id = await dbInsert('items', data);
    res.status(201).json({ product: { _key: id, ...data } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/products/:id  (admin only)
router.put('/:id', adminMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const { name, type, brand, price, description, stock } = req.body;
    const data = { name, type, brand: brand || 'resin', price: parseFloat(price), description, stock: parseInt(stock) || 0 };
    if (req.file) data.photo = req.file.filename;
    await dbUpdate('items/' + req.params.id, data);
    res.json({ message: 'Product updated' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/products/:id  (admin only)
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    await dbDelete('items/' + req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
