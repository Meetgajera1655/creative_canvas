import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import ProductCard from '../components/common/ProductCard';

export default function Shop({ brandFilter = null, heroContent = null }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catCounts, setCatCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const brand    = brandFilter || searchParams.get('brand') || '';
  const category = searchParams.get('category') || '';
  const q        = searchParams.get('q') || '';
  const sort     = searchParams.get('sort') || '';
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';
  const minRating= searchParams.get('min_rating') || '';

  const setParam = useCallback((key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    setSearchParams(p);
  }, [searchParams, setSearchParams]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (brand) params.brand = brand;
      if (q) params.q = q;
      if (sort) params.sort = sort;
      if (category) params.category = category;
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;
      if (minRating) params.min_rating = minRating;
      const res = await productsAPI.getAll(params);
      setProducts(res.data.products || []);
      setTotal(res.data.total || 0);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [brand, category, q, sort, minPrice, maxPrice, minRating]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { setPriceRange({ min: minPrice, max: maxPrice }); }, [minPrice, maxPrice]);
  useEffect(() => {
    productsAPI.getCategories(brand ? { brand } : {}).then(r => {
      setCategories(r.data.categories || []);
      setCatCounts(r.data.counts || {});
    });
  }, [brand]);

  const applyPrice = () => { setParam('min_price', priceRange.min); setParam('max_price', priceRange.max); };

  const pageTitle = brand === 'kasab' ? 'Kasab Collection' : brand === 'resin' ? 'Creative Canvas' : 'All Products';

  return (
    <>
      {heroContent}
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link><span className="breadcrumb-sep">›</span>
            <span>Shop</span>
            {brand && <><span className="breadcrumb-sep">›</span><span>{brand === 'kasab' ? 'Kasab' : 'Resin Art'}</span></>}
            {category && <><span className="breadcrumb-sep">›</span><span>{category}</span></>}
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,3vw,36px)', fontWeight: 600, color: 'var(--off-black)', letterSpacing: '-.02em', marginBottom: 12 }}>{pageTitle}</h1>
          {!brandFilter && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[['', 'All Products'], ['resin', '🎨 Resin Art'], ['kasab', '🧵 Kasab']].map(([b, l]) => (
                <button key={b} onClick={() => setParam('brand', b)}
                  style={{ padding: '6px 16px', borderRadius: 'var(--r-full)', fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1.5px solid ' + (brand === b ? 'var(--off-black)' : 'var(--border-light)'), background: brand === b ? 'var(--off-black)' : 'var(--white)', color: brand === b ? 'var(--white)' : 'var(--mid-gray)', transition: 'all .15s', fontFamily: 'var(--font-body)' }}>
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 80 }}>
        <div className="shop-layout">
          {/* SIDEBAR */}
          <aside className="sidebar">
            {/* Search */}
            <div className="filter-card">
              <div className="filter-title">Search</div>
              <div style={{ position: 'relative' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--light-gray)" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input value={q} onChange={e => setParam('q', e.target.value)} placeholder="Search products…" className="form-input" style={{ paddingLeft: 34, fontSize: 13, padding: '9px 10px 9px 34px' }} />
              </div>
            </div>

            {/* Category */}
            <div className="filter-card">
              <div className="filter-title">Category</div>
              <button className={`cat-pill${!category ? ' active' : ''}`} onClick={() => setParam('category', '')}>
                All Items <span className="cat-count">{total}</span>
              </button>
              {categories.map(c => (
                <button key={c} className={`cat-pill${category === c ? ' active' : ''}`} onClick={() => setParam('category', c)}>
                  {c} <span className="cat-count">{catCounts[c] || 0}</span>
                </button>
              ))}
            </div>

            {/* Price */}
            <div className="filter-card">
              <div className="filter-title">Price Range</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <input type="number" placeholder="Min ₹" value={priceRange.min} onChange={e => setPriceRange(p => ({ ...p, min: e.target.value }))} className="form-input" style={{ padding: '8px 10px', fontSize: 12 }} min="0" />
                <input type="number" placeholder="Max ₹" value={priceRange.max} onChange={e => setPriceRange(p => ({ ...p, max: e.target.value }))} className="form-input" style={{ padding: '8px 10px', fontSize: 12 }} min="0" />
              </div>
              <button onClick={applyPrice} className="btn btn-outline btn-sm btn-full" style={{ borderRadius: 'var(--r-md)', justifyContent: 'center' }}>Apply Filter</button>
              {(minPrice || maxPrice) && <button onClick={() => { setParam('min_price', ''); setParam('max_price', ''); setPriceRange({ min: '', max: '' }); }} style={{ width: '100%', marginTop: 6, fontSize: 11, color: 'var(--light-gray)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Clear price filter</button>}
            </div>

            {/* Rating */}
            <div className="filter-card">
              <div className="filter-title">Min Rating</div>
              {[4, 3, 2, 1].map(r => (
                <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px', borderRadius: 'var(--r-xs)', cursor: 'pointer', background: minRating == r ? 'var(--warm-100)' : 'transparent', transition: 'background .1s' }}>
                  <input type="radio" name="minRating" checked={minRating == r} onChange={() => setParam('min_rating', r)} style={{ accentColor: 'var(--rose)', width: 14, height: 14 }} />
                  <span style={{ color: '#ff9500', fontSize: 12, letterSpacing: 1 }}>{'★'.repeat(r)}{'☆'.repeat(5 - r)}</span>
                  <span style={{ fontSize: 11, color: 'var(--light-gray)' }}>& above</span>
                </label>
              ))}
              {minRating && <button onClick={() => setParam('min_rating', '')} style={{ fontSize: 11, color: 'var(--light-gray)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 10px', fontFamily: 'var(--font-body)' }}>Clear</button>}
            </div>

            {/* Sort */}
            <div className="filter-card">
              <div className="filter-title">Sort By</div>
              <select className="form-input" value={sort} onChange={e => setParam('sort', e.target.value)} style={{ padding: '9px 36px 9px 12px', fontSize: 13 }}>
                <option value="">Relevance</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--off-black)', fontWeight: 500 }}>
                {category || pageTitle}
              </h2>
              <span style={{ fontSize: 13, color: 'var(--light-gray)' }}>
                <strong style={{ color: 'var(--off-black)' }}>{total}</strong> item{total !== 1 ? 's' : ''}
              </span>
            </div>

            {loading ? (
              <div className="loading-center"><div className="spinner" /></div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--off-black)', marginBottom: 8 }}>No products found</h3>
                <p style={{ color: 'var(--light-gray)', marginBottom: 20 }}>Try adjusting your filters or search</p>
                <button onClick={() => setSearchParams({})} className="btn btn-primary">Clear All Filters</button>
              </div>
            ) : (
              <div className="products-grid-3">
                {products.map((p, i) => <ProductCard key={p._key} product={p} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
