import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { searchAPI } from '../../services/api';
import { getImageUrl, formatPrice } from '../../utils/image';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMobileOpen(false); setSearchOpen(false); setQuery(''); setResults([]); }, [location.pathname]);

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (!query.trim()) { setResults([]); return; }
    timerRef.current = setTimeout(async () => {
      setSearching(true);
      try { const r = await searchAPI.search(query); setResults(r.data.results || []); } catch {}
      setSearching(false);
    }, 300);
  }, [query]);

  useEffect(() => {
    const fn = e => { if (searchRef.current && !searchRef.current.contains(e.target)) { setSearchOpen(false); setResults([]); } };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const handleSearchKey = e => {
    if (e.key === 'Enter' && query.trim()) { navigate('/shop?q=' + encodeURIComponent(query.trim())); setSearchOpen(false); }
  };

  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    height: 'var(--nav-h)',
    background: scrolled ? 'rgba(250,248,245,.97)' : 'var(--cream)',
    backdropFilter: scrolled ? 'blur(20px)' : 'none',
    WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
    borderBottom: `1px solid ${scrolled ? 'var(--border-light)' : 'transparent'}`,
    boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
    transition: 'all .25s ease',
  };

  const iconBtn = {
    width: 38, height: 38, borderRadius: 'var(--r-md)', border: '1px solid var(--border-light)',
    background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'all var(--t2)', flexShrink: 0,
    boxShadow: 'var(--shadow-xs)', textDecoration: 'none', color: 'var(--dark-gray)',
  };

  return (
    <>
      <header style={navStyle}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', height: '100%', gap: 12 }}>
          {/* Logo */}
          <Link to="/" style={{ flexShrink: 0, marginRight: 8, textDecoration: 'none' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700, color: 'var(--off-black)', letterSpacing: '-.02em', lineHeight: 1 }}>
              Creative<em style={{ color: 'var(--rose)', fontStyle: 'italic', fontWeight: 400 }}> Canvas</em>
            </div>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--silver)', marginTop: 3, lineHeight: 1 }}>HANDCRAFTED</div>
          </Link>

          {/* Center nav */}
          <nav style={{ display: 'flex', gap: 2, flex: 1, justifyContent: 'center' }} className="nav-desktop">
            {[['/', 'Home', true], ['/shop', 'Shop'], ['/creative-canvas', 'Resin Art'], ['/kasab', 'Kasab']].map(([to, label, exact]) => (
              <NavLink key={to} to={to} end={exact || false}
                style={({ isActive }) => ({
                  padding: '6px 13px', borderRadius: 'var(--r-full)', fontSize: 13, fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--off-black)' : 'var(--mid-gray)',
                  background: isActive ? 'var(--white)' : 'transparent',
                  boxShadow: isActive ? 'var(--shadow-xs)' : 'none',
                  transition: 'all .15s',
                })}>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }} ref={searchRef}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <button style={iconBtn} onClick={() => { setSearchOpen(s => !s); setTimeout(() => document.getElementById('nsearch')?.focus(), 80); }} title="Search">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </button>
              <AnimatePresence>
                {searchOpen && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .16 }}
                    style={{ position: 'absolute', right: 0, top: 46, width: 360, background: 'var(--white)', border: '1px solid var(--border-light)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--shadow-xl)', overflow: 'hidden', zIndex: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', borderBottom: '1px solid var(--border-light)', gap: 8 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--light-gray)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      <input id="nsearch" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={handleSearchKey} placeholder="Search products, categories…"
                        style={{ flex: 1, border: 'none', outline: 'none', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--off-black)', background: 'transparent' }} autoComplete="off" />
                      {query && <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--silver)', fontSize: 18, lineHeight: 1, padding: '0 2px' }}>×</button>}
                    </div>
                    {searching && <div style={{ padding: '16px', textAlign: 'center', fontSize: 13, color: 'var(--light-gray)' }}>Searching…</div>}
                    {!searching && results.map(r => (
                      <div key={r._key} onClick={() => { navigate('/product/' + r._key); setSearchOpen(false); setQuery(''); }}
                        style={{ display: 'flex', gap: 10, padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border-light)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--warm-50)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <div style={{ width: 40, height: 40, borderRadius: 'var(--r-sm)', background: 'var(--warm-100)', overflow: 'hidden', flexShrink: 0 }}>
                          <img src={getImageUrl(r.photo, r.name)} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x40/FAE8DB/C9897A?text=A'; }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--off-black)', marginBottom: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--light-gray)' }}>{formatPrice(r.price)}</div>
                        </div>
                      </div>
                    ))}
                    {!searching && query && results.length === 0 && <div style={{ padding: '16px 14px', fontSize: 13, color: 'var(--light-gray)' }}>No results for "{query}"</div>}
                    {query && (
                      <div style={{ padding: '10px 14px' }}>
                        <button onClick={() => { navigate('/shop?q=' + encodeURIComponent(query)); setSearchOpen(false); }}
                          style={{ width: '100%', padding: '9px', background: 'var(--warm-50)', border: '1px solid var(--border-light)', borderRadius: 'var(--r-md)', fontSize: 12, cursor: 'pointer', color: 'var(--mid-gray)', fontFamily: 'var(--font-body)' }}>
                          View all results for "{query}" →
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist */}
            {user && (
              <Link to="/wishlist" title="Wishlist" style={iconBtn}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" title="Cart" style={{ ...iconBtn, position: 'relative' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              {count > 0 && <span className="cart-badge">{count > 9 ? '9+' : count}</span>}
            </Link>

            {/* Account */}
            {user ? (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {user.isAdmin && <Link to="/admin" style={{ ...iconBtn, background: 'var(--rose)', border: 'none', color: 'var(--white)', padding: '0 12px', borderRadius: 'var(--r-full)', fontSize: 12, fontWeight: 600 }}>Admin</Link>}
                <Link to="/account" title="Account" style={iconBtn}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </Link>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">Sign In</Link>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(o => !o)} style={{ ...iconBtn, display: 'none' }} className="mob-btn" title="Menu">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: .26, ease: [.16,1,.3,1] }}
              style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 290, background: 'var(--white)', zIndex: 2000, boxShadow: 'var(--shadow-xl)', padding: '80px 24px 24px', overflowY: 'auto' }}>
              <button onClick={() => setMobileOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--mid-gray)', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              {[['/', 'Home'], ['/shop', 'Shop'], ['/creative-canvas', 'Resin Art'], ['/kasab', 'Kasab'], ['/cart', `Cart (${count})`], ['/orders', 'My Orders'], ['/wishlist', 'Wishlist'], ['/account', 'Account']].map(([to, label]) => (
                <Link key={to} to={to} style={{ display: 'flex', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border-light)', fontSize: 15, fontWeight: 500, color: 'var(--dark-gray)', justifyContent: 'space-between' }}>
                  {label} <span style={{ color: 'var(--border)' }}>›</span>
                </Link>
              ))}
              <div style={{ marginTop: 24 }}>
                {user ? <button onClick={logout} className="btn btn-outline btn-full" style={{ justifyContent: 'center' }}>Sign Out</button>
                  : <Link to="/login" className="btn btn-primary btn-full" style={{ justifyContent: 'center', display: 'flex' }}>Sign In</Link>}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2 }}
              onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 1999, backdropFilter: 'blur(2px)' }} />
          </>
        )}
      </AnimatePresence>

      <div style={{ height: 'var(--nav-h)' }} />
      <style>{`.mob-btn{display:none!important}.nav-desktop{display:flex!important}@media(max-width:768px){.mob-btn{display:flex!important}.nav-desktop{display:none!important}}`}</style>
    </>
  );
}
