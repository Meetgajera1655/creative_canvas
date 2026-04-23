import React from 'react';
import Shop from './Shop';
const Hero = () => (
  <section style={{ background: 'linear-gradient(135deg,var(--warm-50) 0%,var(--warm-100) 100%)', padding: '64px 0 52px', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: -80, right: -60, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle,rgba(201,137,122,.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
    <div className="container" style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--white)', border: '1px solid var(--border-light)', borderRadius: 'var(--r-full)', padding: '5px 14px', fontSize: 11, fontWeight: 700, color: 'var(--rose)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 18, boxShadow: 'var(--shadow-xs)' }}>
        🎨 Resin Art Collection
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,54px)', fontWeight: 700, color: 'var(--off-black)', letterSpacing: '-.03em', lineHeight: 1.1, marginBottom: 14 }}>
        Creative <em style={{ color: 'var(--rose)', fontStyle: 'italic', fontWeight: 400 }}>Canvas</em>
      </h1>
      <p style={{ fontSize: 15, color: 'var(--mid-gray)', lineHeight: 1.75, maxWidth: 440 }}>Luminous epoxy resin pieces — each one poured, cured, and polished by hand. One-of-a-kind art for your home.</p>
    </div>
  </section>
);
export default function CreativeCanvas() { return <Shop brandFilter="resin" heroContent={<Hero />} />; }
