import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { getImageUrl, formatPrice } from '../utils/image';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, loading, updateQty, removeItem } = useCart();
  const navigate = useNavigate();
  const { items = [], subtotal = 0, shipping = 0, total = 0 } = cart;

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 72 }}>
      <div className="breadcrumb" style={{ marginBottom: 20 }}><Link to="/">Home</Link><span className="breadcrumb-sep">›</span><span>Cart</span></div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600, color: 'var(--off-black)', letterSpacing: '-.02em', marginBottom: 28 }}>
        Shopping Cart <span style={{ fontSize: 16, color: 'var(--light-gray)', fontWeight: 400, fontFamily: 'var(--font-body)' }}>({items.length} item{items.length !== 1 ? 's' : ''})</span>
      </h1>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon" style={{ fontSize: 36 }}>🛍</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--off-black)', marginBottom: 8 }}>Your cart is empty</h3>
          <p style={{ color: 'var(--light-gray)', marginBottom: 24 }}>Discover our handcrafted collection</p>
          <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28, alignItems: 'start' }}>
          {/* Items */}
          <div>
            <AnimatePresence>
              {items.map(item => (
                <motion.div key={item._key} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }} transition={{ duration: .22 }}
                  style={{ display: 'flex', gap: 16, padding: 18, background: 'var(--white)', border: '1px solid var(--border-light)', borderRadius: 'var(--r-xl)', marginBottom: 12 }}>
                  <Link to={`/product/${item.product_id}`} style={{ width: 90, height: 90, borderRadius: 'var(--r-lg)', overflow: 'hidden', flexShrink: 0, background: 'var(--warm-100)' }}>
                    <img src={getImageUrl(item.photo, item.name)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/90x90/FAE8DB/C9897A?text=Art'; }} />
                  </Link>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link to={`/product/${item.product_id}`} style={{ fontSize: 14, fontWeight: 600, color: 'var(--off-black)', display: 'block', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</Link>
                    <span className={`badge ${item.brand === 'kasab' ? 'badge-gold' : 'badge-rose'}`} style={{ fontSize: 10 }}>{item.brand === 'kasab' ? 'Kasab' : 'Resin Art'}</span>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, flexWrap: 'wrap', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--off-white)', borderRadius: 'var(--r-full)', padding: '3px 4px' }}>
                        <button onClick={() => updateQty(item._key, Math.max(1, (item.quantity || 1) - 1)).catch(() => toast.error('Failed'))} style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: 'var(--white)', cursor: 'pointer', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-xs)' }}>−</button>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, width: 22, textAlign: 'center' }}>{item.quantity || 1}</span>
                        <button onClick={() => updateQty(item._key, (item.quantity || 1) + 1).catch(() => toast.error('Failed'))} style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: 'var(--white)', cursor: 'pointer', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-xs)' }}>+</button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--off-black)' }}>{formatPrice((item.price || 0) * (item.quantity || 1))}</span>
                        <button onClick={() => removeItem(item._key).then(() => toast.success('Removed')).catch(() => toast.error('Failed'))}
                          style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid var(--border-light)', background: 'var(--white)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--light-gray)', transition: 'all .15s', fontSize: 12 }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.color = 'var(--light-gray)'; }}>
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div style={{ background: 'var(--white)', border: '1px solid var(--border-light)', borderRadius: 'var(--r-xl)', padding: 24, position: 'sticky', top: 'calc(var(--nav-h) + 12px)', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, color: 'var(--off-black)', marginBottom: 18 }}>Order Summary</h3>
            {items.map(i => (
              <div key={i._key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: 'var(--mid-gray)', flex: 1, marginRight: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.name} ×{i.quantity || 1}</span>
                <span style={{ color: 'var(--dark-gray)', fontWeight: 500, flexShrink: 0 }}>{formatPrice((i.price || 0) * (i.quantity || 1))}</span>
              </div>
            ))}
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
              <span style={{ color: 'var(--mid-gray)' }}>Subtotal</span><span>{formatPrice(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 14 }}>
              <span style={{ color: 'var(--mid-gray)' }}>Shipping</span>
              <span style={{ color: shipping === 0 ? 'var(--green)' : 'var(--dark-gray)', fontWeight: shipping === 0 ? 600 : 400 }}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
            </div>
            {shipping > 0 && <div style={{ fontSize: 11, color: 'var(--mid-gray)', background: 'var(--warm-50)', padding: '7px 11px', borderRadius: 'var(--r-sm)', marginBottom: 14 }}>Add {formatPrice(999 - subtotal)} more for free shipping</div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid var(--border-light)', marginBottom: 18 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--off-black)' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--off-black)' }}>{formatPrice(total)}</span>
            </div>
            <button onClick={() => navigate('/checkout')} className="btn btn-rose btn-full btn-lg" style={{ justifyContent: 'center' }}>Proceed to Checkout →</button>
            <Link to="/shop" className="btn btn-ghost btn-full" style={{ justifyContent: 'center', marginTop: 8, fontSize: 13 }}>Continue Shopping</Link>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 14, fontSize: 11, color: 'var(--light-gray)' }}>
              <span>🔒 Secure</span><span>💳 Razorpay</span><span>🚚 Fast Delivery</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
