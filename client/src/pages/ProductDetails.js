import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { productsAPI, reviewsAPI, wishlistAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getImageUrl, getPlaceholder, formatPrice, renderStars } from '../utils/image';
import ProductCard from '../components/common/ProductCard';

export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const [wished, setWished] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState('reviews');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [pincode, setPincode] = useState('');
  const [delivery, setDelivery] = useState('');

  useEffect(() => {
    setLoading(true); setImgErr(false); setQty(1); setRating(0); setComment(''); setActiveImg(0);
    Promise.all([productsAPI.getOne(id), reviewsAPI.getForProduct(id)])
      .then(([pr, rv]) => {
        setProduct({ _key: id, ...pr.data.product });
        setReviews(rv.data.reviews || []);
      }).catch(() => toast.error('Failed to load product')).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (product) {
      productsAPI.getAll({ brand: product.brand || 'resin', limit: 6 }).then(r => {
        setRelated((r.data.products || []).filter(p => p._key !== id).slice(0, 4));
      });
      if (user) wishlistAPI.check(id).then(r => setWished(r.data.wishlisted)).catch(() => {});
    }
  }, [product, id, user]);

  const handleAdd = useCallback(async () => {
    if (!user) { toast.error('Please sign in'); navigate('/login'); return; }
    setAdding(true);
    try {
      await addToCart(id, qty);
      toast.success(`${product?.name} added to cart!`, { icon: '🛍', style: { borderRadius: '10px', background: '#111', color: '#fff', fontSize: '13px' } });
    } catch (e) { toast.error(e.response?.data?.error || 'Could not add to cart'); }
    finally { setAdding(false); }
  }, [user, id, qty, product, addToCart, navigate]);

  const handleWishlist = async () => {
    if (!user) { toast.error('Please sign in'); return; }
    try { const r = await wishlistAPI.toggle(id); setWished(r.data.wishlisted); toast.success(r.data.wishlisted ? 'Saved ♥' : 'Removed'); }
    catch { toast.error('Could not update wishlist'); }
  };

  const handleReview = async () => {
    if (!rating) { toast.error('Please select a rating'); return; }
    setSubmitting(true);
    try {
      await reviewsAPI.submit({ product_id: id, rating, comment });
      toast.success('Review submitted!');
      const [rv, pr] = await Promise.all([reviewsAPI.getForProduct(id), productsAPI.getOne(id)]);
      setReviews(rv.data.reviews || []);
      setProduct(p => ({ ...p, rating_avg: pr.data.product.rating_avg, review_count: pr.data.product.review_count }));
      setRating(0); setComment('');
    } catch (e) { toast.error(e.response?.data?.error || 'Failed to submit'); }
    finally { setSubmitting(false); }
  };

  const checkDelivery = () => {
    if (pincode.length === 6) setDelivery('Estimated delivery: 3-5 business days');
    else toast.error('Enter a valid 6-digit pincode');
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!product) return (
    <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 16 }}>Product not found</h2>
      <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
    </div>
  );

  const isKasab = product.brand === 'kasab';
  const imgSrc = imgErr ? getPlaceholder(product.name) : getImageUrl(product.photo, product.name);
  const avg = Number(product.rating_avg) || 0;
  const rCount = Number(product.review_count) || 0;
  const inStock = !product.stock || product.stock > 0;
  const images = product.images?.length ? product.images : [product.photo].filter(Boolean);

  return (
    <>
      <div className="container" style={{ paddingTop: 24, paddingBottom: 64 }}>
        <div className="breadcrumb" style={{ marginBottom: 24 }}>
          <Link to="/">Home</Link><span className="breadcrumb-sep">›</span>
          <Link to="/shop">Shop</Link><span className="breadcrumb-sep">›</span>
          <Link to={isKasab ? '/kasab' : '/creative-canvas'}>{isKasab ? 'Kasab' : 'Creative Canvas'}</Link>
          <span className="breadcrumb-sep">›</span><span style={{ color: 'var(--dark-gray)' }}>{product.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start', marginBottom: 64 }}>
          {/* LEFT — Image */}
          <div style={{ position: 'sticky', top: 'calc(var(--nav-h) + 20px)' }}>
            <motion.div initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .4 }}
              style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden', aspectRatio: '1/1', background: 'var(--warm-100)', boxShadow: 'var(--shadow-lg)' }}>
              <img src={images[activeImg] ? getImageUrl(images[activeImg], product.name) : imgSrc} alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setImgErr(true)} />
            </motion.div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                {images.map((img, i) => (
                  <div key={i} onClick={() => setActiveImg(i)} style={{ width: 64, height: 64, borderRadius: 'var(--r-md)', overflow: 'hidden', cursor: 'pointer', border: `2px solid ${activeImg === i ? 'var(--rose)' : 'var(--border-light)'}`, transition: 'border-color .15s' }}>
                    <img src={getImageUrl(img, product.name)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .4, delay: .1 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
              <span className={`badge ${isKasab ? 'badge-gold' : 'badge-rose'}`}>{isKasab ? '🧵 Kasab' : '🎨 Creative Canvas'}</span>
              {product.type && <span className="badge badge-gray">{product.type}</span>}
              {!inStock && <span className="badge badge-red">Out of Stock</span>}
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,2.5vw,32px)', fontWeight: 600, color: 'var(--off-black)', lineHeight: 1.2, letterSpacing: '-.02em', marginBottom: 14 }}>{product.name}</h1>

            {avg > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ background: avg >= 4 ? '#22c55e' : avg >= 3 ? '#f59e0b' : '#ef4444', color: '#fff', fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  ★ {avg}
                </div>
                <span style={{ color: '#2563eb', fontSize: 13, cursor: 'pointer' }} onClick={() => setActiveTab('reviews')}>{rCount} rating{rCount !== 1 ? 's' : ''}</span>
              </div>
            )}

            <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, color: 'var(--off-black)', marginBottom: 22, letterSpacing: '-.02em' }}>{formatPrice(product.price)}</div>

            {product.description && <p style={{ fontSize: 14, color: 'var(--mid-gray)', lineHeight: 1.8, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--border-light)' }}>{product.description}</p>}

            <div style={{ marginBottom: 20 }}>
              {[['Category', product.type], ['Brand', isKasab ? 'Kasab' : 'Creative Canvas'], ['Stock', inStock ? (product.stock ? `${product.stock} units` : 'In Stock') : 'Out of Stock']].filter(([, v]) => v).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: 14, marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: 'var(--light-gray)', width: 70, flexShrink: 0 }}>{k}</span>
                  <span style={{ fontWeight: 500, color: 'var(--dark-gray)' }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Qty */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, background: 'var(--off-white)', borderRadius: 'var(--r-lg)', padding: '12px 16px', width: 'fit-content' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--mid-gray)' }}>Qty</span>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid var(--border)', background: 'var(--white)', cursor: 'pointer', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, width: 32, textAlign: 'center' }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid var(--border)', background: 'var(--white)', cursor: 'pointer', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
              <button onClick={handleAdd} disabled={adding || !inStock} className="btn btn-rose btn-lg" style={{ flex: 1, minWidth: 160, justifyContent: 'center' }}>
                {adding ? 'Adding…' : '🛍 Add to Cart'}
              </button>
              <button onClick={handleWishlist} style={{ width: 48, height: 48, borderRadius: 'var(--r-md)', border: '1.5px solid var(--border-light)', background: wished ? 'var(--red-light)' : 'var(--white)', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: wished ? 'var(--red)' : 'var(--mid-gray)', transition: 'all .15s' }}>
                {wished ? '♥' : '♡'}
              </button>
            </div>

            {/* Delivery check */}
            <div style={{ background: 'var(--off-white)', borderRadius: 'var(--r-lg)', padding: '16px', marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--dark-gray)', marginBottom: 10 }}>📦 Check Delivery</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Enter pincode" className="form-input" style={{ flex: 1, padding: '8px 12px', fontSize: 13 }} />
                <button onClick={checkDelivery} className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>Check</button>
              </div>
              {delivery && <div style={{ fontSize: 12, color: 'var(--green)', marginTop: 8, fontWeight: 500 }}>✓ {delivery}</div>}
            </div>

            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 12, color: 'var(--mid-gray)' }}>
              {['🚚 Free shipping ₹999+', '↩ 7-day returns', '🔒 Secure payment'].map(t => <span key={t}>{t}</span>)}
            </div>
          </motion.div>
        </div>

        {/* TABS */}
        <div style={{ borderBottom: '1px solid var(--border-light)', marginBottom: 32, display: 'flex', gap: 0 }}>
          {[['reviews', `Reviews (${rCount})`], ['info', 'Product Info']].map(([t, l]) => (
            <button key={t} onClick={() => setActiveTab(t)}
              style={{ padding: '12px 22px', fontSize: 14, fontWeight: 500, cursor: 'pointer', border: 'none', background: 'transparent', color: activeTab === t ? 'var(--off-black)' : 'var(--light-gray)', borderBottom: `2px solid ${activeTab === t ? 'var(--off-black)' : 'transparent'}`, transition: 'all .15s', fontFamily: 'var(--font-body)', marginBottom: '-1px' }}>
              {l}
            </button>
          ))}
        </div>

        {activeTab === 'info' && (
          <div style={{ maxWidth: 640 }}>
            <p style={{ fontSize: 15, color: 'var(--mid-gray)', lineHeight: 1.8, marginBottom: 24 }}>{product.description || 'A beautiful handcrafted piece made with love and care.'}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[['Material', isKasab ? 'Premium Thread & Fabric' : 'Food-grade Epoxy Resin'], ['Origin', 'Handcrafted in India'], ['Care', isKasab ? 'Dry clean recommended' : 'Wipe with damp cloth'], ['Customization', 'Available on request']].map(([k, v]) => (
                <div key={k} style={{ padding: '14px', background: 'var(--white)', borderRadius: 'var(--r-md)', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--silver)', marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--dark-gray)' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div style={{ maxWidth: 700 }}>
            {avg > 0 && (
              <div style={{ display: 'flex', gap: 32, padding: 24, background: 'var(--white)', border: '1px solid var(--border-light)', borderRadius: 'var(--r-xl)', marginBottom: 28 }}>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 700, color: 'var(--off-black)', lineHeight: 1 }}>{avg}</div>
                  <div style={{ color: '#ff9500', fontSize: 16, letterSpacing: 2, marginTop: 6 }}>{renderStars(avg)}</div>
                  <div style={{ fontSize: 12, color: 'var(--light-gray)', marginTop: 6 }}>{rCount} reviews</div>
                </div>
                <div style={{ flex: 1 }}>
                  {[5, 4, 3, 2, 1].map(s => { const c = reviews.filter(r => r.rating === s).length; const pct = rCount > 0 ? Math.round((c / rCount) * 100) : 0; return (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: 'var(--light-gray)', width: 24 }}>{s}★</span>
                      <div style={{ flex: 1, height: 5, background: 'var(--border-light)', borderRadius: 3, overflow: 'hidden' }}><div style={{ height: '100%', background: '#ff9500', borderRadius: 3, width: `${pct}%`, transition: 'width .4s' }} /></div>
                      <span style={{ fontSize: 11, color: 'var(--light-gray)', width: 24 }}>{c}</span>
                    </div>
                  );})}
                </div>
              </div>
            )}

            {/* Write review */}
            {user ? (
              <div style={{ background: 'var(--white)', border: '1.5px solid var(--border-light)', borderRadius: 'var(--r-xl)', padding: 24, marginBottom: 24 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 500, marginBottom: 16 }}>Write a Review</h3>
                <div className="stars-input" style={{ marginBottom: 14 }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <span key={s} className={`star ${s <= (hover || rating) ? 'on' : ''}`} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setRating(s)}>★</span>
                  ))}
                </div>
                <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience with this product…" className="form-input" style={{ marginBottom: 14 }} />
                <button onClick={handleReview} disabled={submitting} className="btn btn-rose">{submitting ? 'Submitting…' : 'Submit Review'}</button>
              </div>
            ) : (
              <div style={{ background: 'var(--warm-50)', padding: '14px 18px', borderRadius: 'var(--r-lg)', marginBottom: 20, fontSize: 13, color: 'var(--mid-gray)' }}>
                <Link to="/login" style={{ color: 'var(--rose)', fontWeight: 600 }}>Sign in</Link> to write a review
              </div>
            )}

            {reviews.length === 0 ? (
              <div className="empty-state" style={{ padding: '32px 0' }}>
                <div className="empty-icon">⭐</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--off-black)', marginBottom: 6 }}>No reviews yet</h3>
                <p style={{ color: 'var(--light-gray)' }}>Be the first to share your experience!</p>
              </div>
            ) : reviews.map(r => (
              <div key={r._key} style={{ background: 'var(--white)', border: '1px solid var(--border-light)', borderRadius: 'var(--r-xl)', padding: '18px 20px', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--warm-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--rose-dark)', flexShrink: 0 }}>{(r.username || 'C').charAt(0).toUpperCase()}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--off-black)' }}>{r.username || 'Customer'}</div>
                      <div style={{ fontSize: 11, color: 'var(--light-gray)' }}>{new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                  </div>
                  <div style={{ background: r.rating >= 4 ? '#22c55e' : r.rating >= 3 ? '#f59e0b' : '#ef4444', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 'var(--r-sm)' }}>★ {r.rating}</div>
                </div>
                {r.comment && <p style={{ fontSize: 13, color: 'var(--mid-gray)', lineHeight: 1.7 }}>{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="section-sm" style={{ background: 'var(--white)' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, color: 'var(--off-black)' }}>You may also like</h2>
              <Link to={`/${isKasab ? 'kasab' : 'creative-canvas'}`} style={{ fontSize: 13, color: 'var(--rose)', fontWeight: 500 }}>View all →</Link>
            </div>
            <div className="products-grid">{related.map((p, i) => <ProductCard key={p._key} product={p} index={i} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
