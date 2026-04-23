import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import { getImageUrl, formatPrice } from '../utils/image';

function FadeIn({ children, delay = 0, y = 24 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: .55, delay, ease: [.16,1,.3,1] }}>
      {children}
    </motion.div>
  );
}

function SectionHeader({ eyebrow, title, sub, center = false }) {
  return (
    <FadeIn>
      <div style={{ ...(center ? { textAlign: 'center' } : {}), marginBottom: 36 }}>
        {eyebrow && <div className="eyebrow" style={{ marginBottom: 10 }}>{eyebrow}</div>}
        <h2 className="heading-lg" style={{ marginBottom: sub ? 10 : 0 }} dangerouslySetInnerHTML={{ __html: title }} />
        {sub && <p style={{ fontSize: 15, color: 'var(--light-gray)', maxWidth: center ? 480 : 520, ...(center ? { margin: '0 auto' } : {}) }}>{sub}</p>}
      </div>
    </FadeIn>
  );
}

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    Promise.all([
      productsAPI.getAll({ limit: 8, sort: 'newest' }),
      productsAPI.getAll({ limit: 5, sort: 'rating' }),
    ]).then(([f, t]) => {
      setFeatured(f.data.products || []);
      setTrending(t.data.products || []);
    }).finally(() => setLoading(false));
  }, []);

  const resin = featured.filter(p => (p.brand || 'resin') === 'resin');
  const kasab = featured.filter(p => p.brand === 'kasab');
  const display = tab === 'resin' ? resin : tab === 'kasab' ? kasab : featured;
  const heroImg = featured[0];
  const heroImg2 = featured[1];
  const heroImg3 = featured[2];

  return (
    <>
      {/* ══ HERO ══ */}
      <section style={{ minHeight: '92vh', display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--cream)', overflow: 'hidden' }}>
        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 56px 80px 40px', background: 'var(--warm-50)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: -100, left: -60, width: 360, height: 360, borderRadius: '50%', background: 'rgba(201,137,122,.07)', pointerEvents: 'none' }} />
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: [.16,1,.3,1] }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--white)', border: '1px solid var(--border-light)', borderRadius: 'var(--r-full)', padding: '5px 14px', fontSize: 11, fontWeight: 700, color: 'var(--rose)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 24, boxShadow: 'var(--shadow-xs)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--rose)', flexShrink: 0 }} />
              Handcrafted in India
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(34px,4.5vw,64px)', fontWeight: 700, color: 'var(--off-black)', lineHeight: 1.08, letterSpacing: '-.03em', marginBottom: 20 }}>
              Art that<br />
              <em style={{ fontStyle: 'italic', color: 'var(--rose)', fontWeight: 400 }}>speaks</em> to<br />
              your soul
            </h1>
            <p style={{ fontSize: 16, color: 'var(--mid-gray)', lineHeight: 1.75, maxWidth: 380, marginBottom: 36 }}>
              Two worlds of Indian craft — luminous resin art and timeless Kasab embroidery. Every piece made by hand.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 52 }}>
              <Link to="/creative-canvas" className="btn btn-primary btn-lg">Explore Resin Art</Link>
              <Link to="/kasab" className="btn btn-outline btn-lg" style={{ borderColor: 'var(--gold)', color: 'var(--kasab-mid)' }}>Kasab Collection</Link>
            </div>
            <div style={{ display: 'flex', gap: 32, paddingTop: 28, borderTop: '1px solid var(--border-light)' }}>
              {[['200+', 'Happy Clients'], ['50+', 'Unique Designs'], ['100%', 'Handmade']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--off-black)', lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '.06em', marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        {/* RIGHT — mosaic */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 3, overflow: 'hidden', background: 'var(--border-light)' }}>
          {[heroImg, heroImg2, heroImg3, featured[3]].map((p, i) => (
            <div key={i} style={{ background: 'var(--warm-100)', overflow: 'hidden', position: 'relative', ...(i === 0 ? { gridRow: 'span 2' } : {}) }}>
              {p?.photo ? (
                <img src={getImageUrl(p.photo, p?.name)} alt={p?.name || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s' }} onError={e => { e.target.style.display = 'none'; }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, opacity: .25 }}>{i === 2 ? '🧵' : '🎨'}</div>
              )}
              {i === 0 && p && (
                <div style={{ position: 'absolute', bottom: 18, left: 18, background: 'rgba(255,255,255,.93)', borderRadius: 'var(--r-md)', padding: '7px 13px', fontSize: 12, fontWeight: 600, color: 'var(--off-black)', backdropFilter: 'blur(8px)' }}>
                  {p.name?.substring(0, 20)}{p.name?.length > 20 ? '…' : ''} · {formatPrice(p.price)}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ══ MARQUEE ══ */}
      <div style={{ background: 'var(--off-black)', overflow: 'hidden', padding: '13px 0' }}>
        <div style={{ display: 'flex', animation: 'marquee 30s linear infinite', whiteSpace: 'nowrap', width: 'max-content' }}>
          {[...Array(4)].map((_, j) => ['Creative Canvas Resin Art', '·', 'Kasab Embroidery', '·', 'Custom Orders Welcome', '·', 'Free Shipping on ₹999+', '·', '100% Handmade', '·'].map((t, i) => (
            <span key={`${j}-${i}`} style={{ padding: '0 18px', fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: t === '·' ? 'var(--rose)' : 'rgba(255,255,255,.3)' }}>{t}</span>
          )))}
        </div>
        <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-25%)}}`}</style>
      </div>

      {/* ══ CATEGORIES ══ */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <SectionHeader eyebrow="Collections" title="Shop by <em>Category</em>" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
              { to: '/creative-canvas', label: 'Resin Art', title: 'Creative Canvas', sub: 'Luminous epoxy pieces — each one unique', img: resin[0]?.photo, name: resin[0]?.name, dark: false },
              { to: '/kasab', label: 'Embroidery & Textile', title: 'Kasab', sub: 'Khatali embroidery rooted in heritage', img: kasab[0]?.photo, name: kasab[0]?.name, dark: true },
            ].map(cat => (
              <FadeIn key={cat.to} delay={.1}>
                <Link to={cat.to} style={{ display: 'block', borderRadius: 'var(--r-xl)', overflow: 'hidden', position: 'relative', aspectRatio: '16/9', background: cat.dark ? 'var(--kasab-dark)' : 'var(--warm-100)' }}>
                  {cat.img && <img src={getImageUrl(cat.img, cat.name)} alt={cat.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s' }} onError={e => e.target.style.display = 'none'} onMouseEnter={e => e.target.style.transform = 'scale(1.04)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'} />}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.75) 0%, rgba(0,0,0,.1) 60%)' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 28px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', marginBottom: 5 }}>{cat.label}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--white)', fontWeight: 600, marginBottom: 5 }}>{cat.title}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', marginBottom: 12 }}>{cat.sub}</div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.8)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>Browse Collection →</span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURED PRODUCTS ══ */}
      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 14 }}>
            <FadeIn>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Featured</div>
              <h2 className="heading-lg" style={{ marginBottom: 0 }}>Handpicked <em style={{ fontStyle: 'italic', color: 'var(--rose)' }}>for you</em></h2>
            </FadeIn>
            <div style={{ display: 'flex', gap: 4, background: 'var(--white)', border: '1px solid var(--border-light)', borderRadius: 'var(--r-full)', padding: 4 }}>
              {[['all', 'All'], ['resin', 'Resin Art'], ['kasab', 'Kasab']].map(([t, l]) => (
                <button key={t} onClick={() => setTab(t)}
                  style={{ padding: '6px 16px', borderRadius: 'var(--r-full)', fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none', background: tab === t ? 'var(--off-black)' : 'transparent', color: tab === t ? 'var(--white)' : 'var(--mid-gray)', transition: 'all .15s', fontFamily: 'var(--font-body)' }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          {loading ? <div className="loading-center"><div className="spinner" /></div>
            : <div className="products-grid">{display.slice(0, 8).map((p, i) => <ProductCard key={p._key} product={p} index={i} />)}</div>}
          <div style={{ textAlign: 'center', marginTop: 44 }}>
            <Link to="/shop" className="btn btn-primary btn-lg">View All Products →</Link>
          </div>
        </div>
      </section>

      {/* ══ TRENDING ══ */}
      {trending.length > 0 && (
        <section className="section" style={{ background: 'var(--white)' }}>
          <div className="container">
            <SectionHeader eyebrow="Trending Now" title="Most <em>loved</em> pieces" sub="Top-rated products our customers can't stop talking about" />
            <div className="products-grid-5">
              {trending.map((p, i) => <ProductCard key={p._key} product={p} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* ══ WHY US ══ */}
      <section className="section" style={{ background: 'var(--off-black)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <FadeIn>
            <div className="eyebrow" style={{ color: 'var(--rose)', marginBottom: 10 }}>Why Creative Canvas</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,3vw,38px)', fontWeight: 600, color: 'var(--white)', letterSpacing: '-.02em', marginBottom: 48, fontStyle: 'italic' }}>Crafted with intention</h2>
          </FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
            {[
              { icon: '🤲', title: '100% Handmade', desc: 'Every piece crafted by skilled artisans with no machines' },
              { icon: '✨', title: 'Premium Quality', desc: 'Only the finest resins and embroidery threads used' },
              { icon: '🚚', title: 'Free Shipping', desc: 'Complimentary shipping on all orders above ₹999' },
              { icon: '💝', title: 'Custom Orders', desc: 'Create personalised pieces exactly as you envision' },
            ].map(f => (
              <FadeIn key={f.title} delay={.05}>
                <div style={{ padding: '28px 20px', borderRadius: 'var(--r-xl)', border: '1px solid rgba(255,255,255,.07)', background: 'rgba(255,255,255,.02)', transition: 'all .25s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,137,122,.3)'; e.currentTarget.style.background = 'rgba(201,137,122,.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.07)'; e.currentTarget.style.background = 'rgba(255,255,255,.02)'; }}>
                  <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 500, color: 'var(--white)', marginBottom: 8 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.38)', lineHeight: 1.7 }}>{f.desc}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ REVIEWS ══ */}
      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <SectionHeader eyebrow="Customer Reviews" title="What customers <em>say</em>" center />
          <div className="products-grid-3">
            {[
              { name: 'Priya Mehta', loc: 'Mumbai', text: 'The resin tray is absolutely stunning. The depth of colour is like nothing I\'ve seen — it\'s the centrepiece of our living room.', stars: 5 },
              { name: 'Ananya Singh', loc: 'Delhi', text: 'The Kasab dupatta exceeded all expectations. The embroidery is meticulous. Gifted it to my mother — she was in tears.', stars: 5 },
              { name: 'Ravi Kumar', loc: 'Bengaluru', text: 'Fast shipping, beautiful packaging, and the night lamp glows so warmly. Will definitely order again!', stars: 5 },
            ].map(r => (
              <FadeIn key={r.name} delay={.08}>
                <div style={{ background: 'var(--white)', borderRadius: 'var(--r-xl)', padding: '26px 22px', border: '1px solid var(--border-light)' }}>
                  <div style={{ color: '#ff9500', fontSize: 14, letterSpacing: 2, marginBottom: 14 }}>{'★'.repeat(r.stars)}</div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontStyle: 'italic', color: 'var(--dark-gray)', lineHeight: 1.7, marginBottom: 20 }}>"{r.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--warm-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--rose-dark)' }}>{r.name.charAt(0)}</div>
                    <div><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--off-black)' }}>{r.name}</div><div style={{ fontSize: 11, color: 'var(--light-gray)' }}>{r.loc}</div></div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ NEWSLETTER ══ */}
      <section style={{ background: 'linear-gradient(135deg, var(--warm-100), var(--warm-200))', padding: '72px 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 520 }}>
          <FadeIn>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Stay Connected</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,3vw,34px)', fontWeight: 600, color: 'var(--off-black)', marginBottom: 10, letterSpacing: '-.02em' }}>New designs, in your inbox</h2>
            <p style={{ fontSize: 14, color: 'var(--mid-gray)', marginBottom: 28 }}>Exclusive offers and behind-the-scenes craft stories.</p>
            <div style={{ display: 'flex', gap: 8, maxWidth: 420, margin: '0 auto' }}>
              <input type="email" placeholder="your@email.com" className="form-input" style={{ flex: 1, borderRadius: 'var(--r-full)' }} />
              <button className="btn btn-primary" style={{ borderRadius: 'var(--r-full)', flexShrink: 0 }}>Subscribe</button>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
