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
      if (user) wishlistAPI.check(id).then(r => setWished(r.data.wishlisted)).catch(() => { });
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
      <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
        <div className="breadcrumb" style={{ marginBottom: 32, fontSize: 13, fontWeight: 500 }}>
          <Link to="/">Home</Link><span className="breadcrumb-sep" style={{ opacity: 0.5, margin: '0 12px' }}>/</span>
          <Link to="/shop">Shop</Link><span className="breadcrumb-sep" style={{ opacity: 0.5, margin: '0 12px' }}>/</span>
          <Link to={isKasab ? '/kasab' : '/creative-canvas'}>{isKasab ? 'Kasab' : 'Creative Canvas'}</Link>
          <span className="breadcrumb-sep" style={{ opacity: 0.5, margin: '0 12px' }}>/</span><span style={{ color: 'var(--off-black)' }}>{product.name}</span>
        </div>

        {/* MASTER UNIFIED CONTAINER */}
        <div style={{ background: 'var(--white)', borderRadius: 40, padding: 'clamp(24px, 4vw, 48px)', border: '1px solid var(--border-light)', boxShadow: '0 20px 60px rgba(0,0,0,0.04)', marginBottom: 80 }}>
          <div className="product-detail-layout" style={{ gap: 'clamp(32px, 5vw, 64px)', margin: 0 }}>

            {/* LEFT — Image Area */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
              <div style={{ borderRadius: 24, overflow: 'hidden', background: 'var(--warm-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, border: '1px solid var(--border-light)' }}>
                <img src={images[activeImg] ? getImageUrl(images[activeImg], product.name) : imgSrc} alt={product.name}
                  style={{ width: '100%', height: 'auto', maxHeight: '60vh', objectFit: 'contain', filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.08))' }} onError={() => setImgErr(true)} />
              </div>

              {images.length > 1 && (
                <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {images.map((img, i) => (
                    <div key={i} onClick={() => setActiveImg(i)} style={{ width: 72, height: 72, borderRadius: 16, overflow: 'hidden', cursor: 'pointer', border: `2px solid ${activeImg === i ? 'var(--off-black)' : 'transparent'}`, background: 'var(--warm-50)', padding: 4, transition: 'all .2s', opacity: activeImg === i ? 1 : 0.6 }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => { if (activeImg !== i) e.currentTarget.style.opacity = 0.6 }}>
                      <div style={{ width: '100%', height: '100%', borderRadius: 10, overflow: 'hidden' }}>
                        <img src={getImageUrl(img, product.name)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* RIGHT — Info Area */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .6, delay: .15 }}>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
                  <span style={{ background: isKasab ? 'rgba(212,175,55,0.1)' : 'rgba(201,137,122,0.1)', color: isKasab ? '#b8860b' : 'var(--rose-dark)', padding: '6px 12px', borderRadius: 30, fontSize: 11, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase' }}>
                    {isKasab ? '🧵 Kasab Heritage' : '🎨 Original Resin'}
                  </span>
                  {!inStock && <span style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '6px 12px', borderRadius: 30, fontSize: 11, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase' }}>Out of Stock</span>}
                </div>

                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 600, color: 'var(--off-black)', lineHeight: 1.15, letterSpacing: '-.02em', marginBottom: 16 }}>{product.name}</h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--border-light)' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: 'var(--off-black)', letterSpacing: '-.02em', lineHeight: 1 }}>{formatPrice(product.price)}</div>
                  {avg > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginLeft: 'auto', alignItems: 'flex-end' }}>
                      <div style={{ display: 'flex', gap: 2, color: '#ff9500', fontSize: 14 }}>{renderStars(avg)}</div>
                      <span style={{ color: 'var(--mid-gray)', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }} onClick={() => { setActiveTab('reviews'); document.getElementById('details-section').scrollIntoView({ behavior: 'smooth' }); }}>{rCount} Review{rCount !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>

                {product.description && <p style={{ fontSize: 14, color: 'var(--dark-gray)', lineHeight: 1.7, marginBottom: 24 }}>{product.description}</p>}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 16, marginBottom: 32 }}>
                  {[['Category', product.type], ['Brand', isKasab ? 'Kasab' : 'Creative Canvas'], ['Stock', inStock ? (product.stock ? `${product.stock} units` : 'In Stock') : 'Out of Stock']].filter(([, v]) => v).map(([k, v]) => (
                    <div key={k} style={{ background: 'var(--warm-50)', padding: 12, borderRadius: 12 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--silver)', letterSpacing: '.05em', textTransform: 'uppercase', marginBottom: 4 }}>{k}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--off-black)' }}>{v}</div>
                    </div>
                  ))}
                </div>

                {/* Qty & Add to Cart Block */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 24, padding: '4px 6px', height: 48 }}>
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--off-white)', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--dark-gray)', transition: 'background .2s' }} onMouseEnter={e => e.target.style.background = 'var(--warm-100)'} onMouseLeave={e => e.target.style.background = 'var(--off-white)'}>−</button>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, width: 36, textAlign: 'center' }}>{qty}</span>
                    <button onClick={() => setQty(q => q + 1)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--off-white)', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--dark-gray)', transition: 'background .2s' }} onMouseEnter={e => e.target.style.background = 'var(--warm-100)'} onMouseLeave={e => e.target.style.background = 'var(--off-white)'}>+</button>
                  </div>
                  <button onClick={handleAdd} disabled={adding || !inStock} className="btn btn-rose" style={{ flex: 1, minWidth: 140, height: 48, borderRadius: 24, fontSize: 15, fontWeight: 600, letterSpacing: '.02em', boxShadow: '0 6px 16px rgba(201,137,122,.2)' }}>
                    {adding ? 'Adding to Cart…' : 'Add to Cart'}
                  </button>
                  <button onClick={handleWishlist} style={{ width: 48, height: 48, borderRadius: 24, border: '1.5px solid var(--border)', background: wished ? 'var(--red-light)' : 'var(--white)', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', color: wished ? 'var(--red)' : 'var(--mid-gray)', transition: 'all .2s' }}>
                    {wished ? '♥' : '♡'}
                  </button>
                </div>
                <div style={{ background: 'var(--warm-50)', borderRadius: 16, padding: 16, marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 16 }}>📦</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--off-black)' }}>Check Delivery Estimate</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Enter 6-digit pincode" style={{ flex: 1, padding: '0 16px', height: 40, fontSize: 13, border: '1px solid var(--border-light)', borderRadius: 20, outline: 'none' }} />
                    <button onClick={checkDelivery} style={{ height: 40, padding: '0 20px', borderRadius: 20, background: 'var(--off-black)', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Check</button>
                  </div>
                  {delivery && <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 12, color: '#16a34a', marginTop: 10, fontWeight: 600 }}>✓ {delivery}</motion.div>}
                </div>

                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 12, color: 'var(--mid-gray)', paddingTop: 20, borderTop: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ fontSize: 16 }}>🚚</span> Free shipping ₹999+</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ fontSize: 16 }}>↩</span> 7-day returns</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ fontSize: 16 }}>🔒</span> Secure checkout</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div style={{ background: 'var(--white)', borderRadius: 32, padding: 'clamp(24px, 3vw, 40px)', border: '1px solid var(--border-light)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>

          <div id="details-section" style={{ display: 'flex', gap: 24, borderBottom: '1px solid var(--border-light)', marginBottom: 32, paddingBottom: 12 }}>
            {[['reviews', `Reviews (${rCount})`], ['info', 'Details & Care']].map(([t, l]) => (
              <button key={t} onClick={() => setActiveTab(t)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: 15,
                  fontWeight: activeTab === t ? 700 : 500,
                  color: activeTab === t ? 'var(--off-black)' : 'var(--silver)',
                  cursor: 'pointer',
                  padding: 0,
                  position: 'relative',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-.01em',
                  transition: 'color .3s'
                }}>
                {l}
                {activeTab === t && <motion.div layoutId="activeTabIndicator" style={{ position: 'absolute', bottom: -13, left: 0, right: 0, height: 2, background: 'var(--off-black)' }} />}
              </button>
            ))}
          </div>

          {activeTab === 'info' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 800 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, marginBottom: 16 }}>The Art of Crafting</h3>
              <p style={{ fontSize: 14, color: 'var(--mid-gray)', lineHeight: 1.7, marginBottom: 32 }}>{product.description || 'A beautiful handcrafted piece made with love and care.'}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                {[['Material', isKasab ? 'Premium Thread & Fabric' : 'Food-grade Epoxy Resin'], ['Origin', 'Handcrafted in India'], ['Care', isKasab ? 'Dry clean recommended' : 'Wipe gently with damp cloth'], ['Customization', 'Available on request']].map(([k, v]) => (
                  <div key={k} style={{ padding: 16, background: 'var(--warm-50)', borderRadius: 16 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--silver)', marginBottom: 6 }}>{k}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--off-black)' }}>{v}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 900 }}>
              {avg > 0 && (
                <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', padding: 24, background: 'var(--warm-50)', borderRadius: 20, marginBottom: 32, alignItems: 'center' }}>
                  <div style={{ textAlign: 'center', minWidth: 120 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 700, color: 'var(--off-black)', lineHeight: 1 }}>{avg}</div>
                    <div style={{ color: '#ff9500', fontSize: 14, letterSpacing: 3, marginTop: 8 }}>{renderStars(avg)}</div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--light-gray)', marginTop: 8 }}>Based on {rCount} review{rCount !== 1 ? 's' : ''}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    {[5, 4, 3, 2, 1].map(s => {
                      const c = reviews.filter(r => r.rating === s).length; const pct = rCount > 0 ? Math.round((c / rCount) * 100) : 0; return (
                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--dark-gray)', width: 28 }}>{s} ★</span>
                          <div style={{ flex: 1, height: 6, background: 'var(--border-light)', borderRadius: 3, overflow: 'hidden' }}><div style={{ height: '100%', background: '#16a34a', borderRadius: 3, width: `${pct}%`, transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)' }} /></div>
                          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--light-gray)', width: 28, textAlign: 'right' }}>{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Write review */}
              {user ? (
                <div style={{ background: 'var(--white)', border: '1px solid var(--border-light)', borderRadius: 20, padding: 24, marginBottom: 32 }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, marginBottom: 16, textAlign: 'center' }}>Share your experience</h3>
                  <div className="stars-input" style={{ marginBottom: 16, textAlign: 'center', fontSize: 24 }}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <span key={s} className={`star ${s <= (hover || rating) ? 'on' : ''}`} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setRating(s)} style={{ cursor: 'pointer', transition: 'color .2s', margin: '0 4px', color: s <= (hover || rating) ? '#ff9500' : 'var(--border)' }}>★</span>
                    ))}
                  </div>
                  <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="What did you love about this piece?" style={{ width: '100%', padding: 16, fontSize: 13, borderRadius: 12, border: '1px solid var(--border-light)', outline: 'none', minHeight: 80, marginBottom: 16, fontFamily: 'var(--font-body)', resize: 'vertical' }} />
                  <div style={{ textAlign: 'center' }}>
                    <button onClick={handleReview} disabled={submitting} className="btn btn-primary" style={{ padding: '10px 32px', fontSize: 13, borderRadius: 30 }}>{submitting ? 'Submitting…' : 'Submit Review'}</button>
                  </div>
                </div>
              ) : (
                <div style={{ background: 'var(--warm-50)', padding: 20, borderRadius: 16, marginBottom: 32, textAlign: 'center' }}>
                  <p style={{ fontSize: 13, color: 'var(--mid-gray)', marginBottom: 12 }}>Have you purchased this piece?</p>
                  <Link to="/login" className="btn btn-outline" style={{ borderRadius: 30, fontSize: 13, padding: '8px 24px' }}>Sign in to write a review</Link>
                </div>
              )}

              {reviews.length > 0 && (
                <div style={{ display: 'grid', gap: 16 }}>
                  {reviews.map(r => (
                    <div key={r._key} style={{ background: 'var(--white)', border: '1px solid var(--border-light)', borderRadius: 16, padding: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--warm-200), var(--rose-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--rose-dark)' }}>{(r.username || 'C').charAt(0).toUpperCase()}</div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--off-black)' }}>{r.username || 'Customer'}</div>
                            <div style={{ fontSize: 11, color: 'var(--light-gray)' }}>{new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 2, color: '#ff9500', fontSize: 12 }}>{renderStars(r.rating)}</div>
                      </div>
                      {r.comment && <p style={{ fontSize: 13, color: 'var(--dark-gray)', lineHeight: 1.6, fontStyle: 'italic' }}>"{r.comment}"</p>}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div style={{ background: 'var(--warm-50)', padding: '80px 0' }}>
          <section className="section-sm container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 600, color: 'var(--off-black)', letterSpacing: '-.02em' }}>You may also like</h2>
              <Link to={`/${isKasab ? 'kasab' : 'creative-canvas'}`} style={{ fontSize: 14, color: 'var(--rose)', fontWeight: 600, borderBottom: '2px solid transparent', paddingBottom: 2, transition: 'border-color .2s' }} onMouseEnter={e => e.target.style.borderColor = 'var(--rose)'} onMouseLeave={e => e.target.style.borderColor = 'transparent'}>Explore Collection →</Link>
            </div>
            <div className="products-grid">{related.map((p, i) => <ProductCard key={p._key} product={p} index={i} />)}</div>
          </section>
        </div>
      )}
    </>
  );
}
