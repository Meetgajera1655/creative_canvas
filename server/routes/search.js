// routes/search.js
const router = require('express').Router();
const { dbGetAll } = require('../config/firebase');

router.get('/', async (req, res) => {
  try {
    const q = (req.query.q || '').trim().toLowerCase();
    if (!q) return res.json({ results: [] });
    const all = await dbGetAll('items');
    const results = all
      .filter(p => (p.name||'').toLowerCase().includes(q) || (p.type||'').toLowerCase().includes(q) || (p.brand||'').toLowerCase().includes(q))
      .slice(0, 10)
      .map(p => ({ _key: p._key, name: p.name, price: p.price, brand: p.brand||'resin', type: p.type, photo: p.photo, rating_avg: p.rating_avg||0 }));
    res.json({ results });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
