import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { wishlistAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { getImageUrl, getPlaceholder, formatPrice, renderStars } from '../../utils/image';

export default function ProductCard({ product, index = 0, showWishlist = true }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const [wished, setWished] = useState(false);

  const isKasab = product.brand === 'kasab';
  const imgSrc = imgErr ? getPlaceholder(product.name) : getImageUrl(product.photo, product.name);
  const avg = Number(product.rating_avg) || 0;
  const reviewCount = Number(product.review_count) || 0;
  const inStock = !product.stock || product.stock > 0;

  const handleAdd = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Please sign in first'); navigate('/login'); return; }
    if (!inStock) return;
    setAdding(true);
    try {
      await addToCart(product._key, 1);
      toast.success('Added to cart!', { icon: '🛍', style: { borderRadius: '10px', background: '#111', color: '#fff', fontSize: '13px' } });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not add to cart');
    } finally { setAdding(false); }
  }, [user, product._key, addToCart, inStock, navigate]);

  const handleWishlist = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Please sign in to save items'); return; }
    try {
      const res = await wishlistAPI.toggle(product._key);
      setWished(res.data.wishlisted);
      toast.success(res.data.wishlisted ? 'Saved to wishlist ♥' : 'Removed from wishlist');
    } catch { toast.error('Could not update wishlist'); }
  }, [user, product._key]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .35, delay: Math.min(index * 0.05, 0.4), ease: [.16,1,.3,1] }}>
      <div className="product-card">
        <Link to={`/product/${product._key}`} style={{ display: 'block' }}>
          <div className="product-card-img">
            <img src={imgSrc} alt={product.name} loading="lazy"
              onError={() => setImgErr(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

            <span className={`product-badge ${isKasab ? 'product-badge-kasab' : ''}`}>
              {product.type || (isKasab ? 'Kasab' : 'Resin Art')}
            </span>

            {!inStock && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ background: 'var(--red)', color: 'var(--white)', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 'var(--r-full)', letterSpacing: '.06em' }}>OUT OF STOCK</span>
              </div>
            )}
          </div>
        </Link>

        {/* Wishlist btn */}
        {showWishlist && (
          <button className={`product-wish-btn ${wished ? 'active' : ''}`} onClick={handleWishlist} title="Save to Wishlist">
            {wished ? '♥' : '♡'}
          </button>
        )}

        <div className="product-card-body">
          <div className="product-brand-tag">{isKasab ? '🧵 Kasab' : '🎨 Resin Art'}</div>
          <Link to={`/product/${product._key}`} style={{ textDecoration: 'none' }}>
            <div className="product-card-name">{product.name}</div>
          </Link>
          {avg > 0 && (
            <div className="product-stars">
              <span className="product-stars-icons">{renderStars(avg)}</span>
              <span className="product-stars-count">({reviewCount})</span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <div>
              <span className={`product-price ${isKasab ? 'product-price-kasab' : ''}`}>{formatPrice(product.price)}</span>
              {inStock && product.stock && product.stock <= 5 && (
                <span style={{ display: 'block', fontSize: 10, color: 'var(--orange)', fontWeight: 600, marginTop: 1 }}>Only {product.stock} left!</span>
              )}
            </div>
            <button onClick={handleAdd} disabled={adding || !inStock} className="btn btn-sm btn-rose"
              style={{ padding: '6px 14px', fontSize: 12, borderRadius: 'var(--r-sm)' }}>
              {adding ? '…' : inStock ? '+ Cart' : 'N/A'}
            </button>
          </div>
        </div>

        {/* Quick add on hover */}
        <button className="product-quick-add" onClick={handleAdd} disabled={adding || !inStock}>
          {adding ? 'Adding…' : inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </motion.div>
  );
}
