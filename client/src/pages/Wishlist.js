import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { wishlistAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { getImageUrl, formatPrice, renderStars } from '../utils/image';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [addingId, setAddingId] = useState(null);

  const fetchWishlist = () => {
    wishlistAPI.get().then(r => setItems(r.data.items || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchWishlist(); }, []);

  const handleRemove = async (productId, name) => {
    try {
      await wishlistAPI.toggle(productId);
      setItems(prev => prev.filter(i => i.product_id !== productId));
      toast.success(`${name} removed from wishlist`);
    } catch { toast.error('Failed to remove'); }
  };

  const handleAddToCart = async (productId, name) => {
    setAddingId(productId);
    try {
      await addToCart(productId, 1);
      toast.success(`${name} added to cart!`, { icon: '🛍', style: { borderRadius: '10px', background: '#111', color: '#fff', fontSize: '13px' } });
    } catch { toast.error('Could not add to cart'); }
    finally { setAddingId(null); }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 72 }}>
      <div className="breadcrumb" style={{ marginBottom: 20 }}><Link to="/">Home</Link><span className="breadcrumb-sep">›</span><span>Wishlist</span></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600, color: 'var(--off-black)', letterSpacing: '-.02em' }}>My Wishlist</h1>
        <span style={{ fontSize: 13, color: 'var(--light-gray)' }}>{items.length} item{items.length !== 1 ? 's' : ''}</span>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon" style={{ fontSize: 36 }}>♡</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--off-black)', marginBottom: 8 }}>Your wishlist is empty</h3>
          <p style={{ color: 'var(--light-gray)', marginBottom: 24 }}>Save items you love by clicking the heart icon</p>
          <Link to="/shop" className="btn btn-primary">Browse Collection</Link>
        </div>
      ) : (
        <div className="products-grid">
          <AnimatePresence>
            {items.map(({ product_id, product }, i) => {
              if (!product) return null;
              const isKasab = product.brand === 'kasab';
              return (
                <motion.div key={product_id} layout initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .9 }} transition={{ duration: .22 }}>
                  <div className="product-card">
                    <Link to={`/product/${product_id}`} style={{ display: 'block' }}>
                      <div className="product-card-img">
                        <img src={getImageUrl(product.photo, product.name)} alt={product.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/FAE8DB/C9897A?text=Art'; }} />
                        <span className={`product-badge ${isKasab ? 'product-badge-kasab' : ''}`}>{product.type || (isKasab ? 'Kasab' : 'Resin Art')}</span>
                      </div>
                    </Link>
                    <button className="product-wish-btn active" onClick={() => handleRemove(product_id, product.name)} title="Remove from wishlist">♥</button>
                    <div className="product-card-body">
                      <div className="product-brand-tag">{isKasab ? '🧵 Kasab' : '🎨 Resin Art'}</div>
                      <Link to={`/product/${product_id}`} style={{ textDecoration: 'none' }}>
                        <div className="product-card-name">{product.name}</div>
                      </Link>
                      {Number(product.rating_avg) > 0 && (
                        <div className="product-stars"><span className="product-stars-icons">{renderStars(product.rating_avg)}</span><span className="product-stars-count">({product.review_count || 0})</span></div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                        <span className={`product-price ${isKasab ? 'product-price-kasab' : ''}`}>{formatPrice(product.price)}</span>
                        <button onClick={() => handleAddToCart(product_id, product.name)} disabled={addingId === product_id} className="btn btn-sm btn-rose" style={{ borderRadius: 'var(--r-sm)', padding: '6px 14px', fontSize: 12 }}>
                          {addingId === product_id ? '…' : '+ Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
