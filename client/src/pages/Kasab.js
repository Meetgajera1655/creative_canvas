import React from 'react';
import Shop from './Shop';
const Hero = () => (
  <section style={{ background: 'linear-gradient(135deg,var(--kasab-dark) 0%,#3d1c00 60%,#6b2f00 100%)', padding: '64px 0 52px', position: 'relative', overflow: 'hidden' }}>
    <div className="container" style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(212,175,106,.14)', border: '1px solid rgba(212,175,106,.25)', borderRadius: 'var(--r-full)', padding: '5px 14px', fontSize: 11, fontWeight: 700, color: 'var(--gold-light)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 18 }}>
        🧵 Kasab Collection
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,54px)', fontWeight: 300, color: 'var(--white)', letterSpacing: '-.02em', lineHeight: 1.1, marginBottom: 14 }}>
        Kasab — <em style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>Woven</em> with Heritage
      </h1>
      <p style={{ fontSize: 15, color: 'rgba(255,255,255,.52)', lineHeight: 1.75, maxWidth: 440 }}>Discover Khatali embroidery and handcrafted textiles — each thread tells a story of Indian craftsmanship passed through generations.</p>
    </div>
  </section>
);
export default function Kasab() { return <Shop brandFilter="kasab" heroContent={<Hero />} />; }
