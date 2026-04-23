import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--off-black)', color: 'rgba(255,255,255,.5)', paddingTop: 56, paddingBottom: 28 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--white)', marginBottom: 4, letterSpacing: '-.01em' }}>
              Creative<em style={{ color: 'var(--rose)', fontStyle: 'italic', fontWeight: 400 }}> Canvas</em>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.8, color: 'rgba(255,255,255,.38)', maxWidth: 270, marginTop: 10 }}>
              Premium handcrafted resin art and Kasab embroidery — made with love in India.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
              {['Instagram', 'Pinterest', 'WhatsApp'].map(s => (
                <a key={s} href="#top" style={{ fontSize: 11, padding: '5px 11px', border: '1px solid rgba(255,255,255,.12)', borderRadius: 'var(--r-full)', color: 'rgba(255,255,255,.38)', transition: 'all .2s' }}
                  onMouseEnter={e => { e.target.style.borderColor = 'var(--rose)'; e.target.style.color = 'var(--rose)'; }}
                  onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,.12)'; e.target.style.color = 'rgba(255,255,255,.38)'; }}>
                  {s}
                </a>
              ))}
            </div>
          </div>
          {[
            ['Shop', [['/', 'Home'], ['/shop', 'All Products'], ['/creative-canvas', 'Resin Art'], ['/kasab', 'Kasab']]],
            ['Account', [['/account', 'My Account'], ['/orders', 'Orders'], ['/cart', 'Cart'], ['/wishlist', 'Wishlist']]],
            ['Help', [['#', 'Contact Us'], ['#', 'Shipping Policy'], ['#', 'Returns'], ['#', 'FAQ']]],
          ].map(([title, links]) => (
            <div key={title}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginBottom: 14 }}>{title}</div>
              {links.map(([to, label]) => (
                <Link key={label} to={to} style={{ display: 'block', fontSize: 13, marginBottom: 9, color: 'rgba(255,255,255,.42)', transition: 'color .15s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--white)'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,.42)'}>
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,.07)', paddingTop: 22, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, fontSize: 12, color: 'rgba(255,255,255,.2)' }}>
          <span>© {new Date().getFullYear()} Creative Canvas. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 16 }}>
            <span>🔒 Secure Payments</span>
            <span>🇮🇳 Made in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
