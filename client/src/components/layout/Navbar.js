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
      try { const r = await searchAPI.search(query); setResults(r.data.results || []); } catch { }
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
    background: scrolled ? 'rgba(255, 255, 255, 0.98)' : '#ffffff',
    backdropFilter: scrolled ? 'blur(20px)' : 'none',
    WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
    borderBottom: '1px solid var(--border-light)',
    boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
    transition: 'all .25s ease',
  };

  const iconBtn = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'all var(--t2)', flexShrink: 0,
    background: 'transparent', border: 'none', padding: '8px',
    textDecoration: 'none', color: 'var(--kasab-mid)',
  };

  return (
    <>
      <header style={navStyle}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', height: '100%', gap: 12 }}>
          {/* Logo */}
          <Link to="/" style={{ flexShrink: 0, marginRight: 32, textDecoration: 'none', display: 'flex', alignItems: 'center', height: '100%' }}>
            <img src="/logo.png" alt="Creative Canvas" style={{ height: '75px', objectFit: 'contain' }} />
          </Link>

          {/* Center nav (Left aligned next to logo) */}
          <nav style={{ display: 'flex', gap: 28, flex: 1, marginLeft: 24 }} className="nav-desktop">
            {[['/', 'Home', true], ['/shop', 'Shop'], ['/creative-canvas', 'Resin Art'], ['/kasab', 'Kasab']].map(([to, label, exact]) => (
              <NavLink key={to} to={to} end={exact || false}
                style={({ isActive }) => ({
                  padding: '8px 0', fontSize: 13, fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--kasab-dark)' : 'var(--kasab-mid)',
                  borderBottom: isActive ? '2px solid var(--rose)' : '2px solid transparent',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  transition: 'all .2s ease',
                })}>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right section (Search + Icons) */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }} ref={searchRef}>
            {/* Embedded Search Bar */}
            <div style={{ position: 'relative', width: 220, display: 'flex', alignItems: 'center' }} className="nav-desktop">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--kasab-mid)" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: 14 }}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input id="nsearch" value={query} onChange={e => { setQuery(e.target.value); setSearchOpen(true); }} onKeyDown={handleSearchKey} placeholder="Search..."
                style={{ width: '100%', height: 40, padding: '0 32px 0 38px', border: '1px solid var(--border-light)', borderRadius: 'var(--r-full)', outline: 'none', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--kasab-dark)', background: 'var(--warm-50)', transition: 'all var(--t2)' }} autoComplete="off" />
              {query && <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 12, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--kasab-mid)', fontSize: 18, lineHeight: 1 }}>×</button>}

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {searchOpen && query && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: .16 }}
                    style={{ position: 'absolute', right: 0, top: 48, width: 360, background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--shadow-xl)', overflow: 'hidden', zIndex: 500 }}>
                    {searching && <div style={{ padding: '16px', textAlign: 'center', fontSize: 13, color: 'var(--kasab-mid)' }}>Searching…</div>}
                    {!searching && results.map(r => (
                      <div key={r._key} onClick={() => { navigate('/product/' + r._key); setSearchOpen(false); setQuery(''); }}
                        style={{ display: 'flex', gap: 10, padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border-light)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--warm-50)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <div style={{ width: 40, height: 40, borderRadius: 'var(--r-sm)', background: 'var(--warm-100)', overflow: 'hidden', flexShrink: 0 }}>
                          <img src={getImageUrl(r.photo, r.name)} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x40/FAE8DB/C9897A?text=A'; }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--kasab-dark)', marginBottom: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--kasab-mid)' }}>{formatPrice(r.price)}</div>
                        </div>
                      </div>
                    ))}
                    {!searching && query && results.length === 0 && <div style={{ padding: '16px 14px', fontSize: 13, color: 'var(--kasab-mid)' }}>No results for "{query}"</div>}
                    {query && (
                      <div style={{ padding: '10px 14px' }}>
                        <button onClick={() => { navigate('/shop?q=' + encodeURIComponent(query)); setSearchOpen(false); }}
                          style={{ width: '100%', padding: '9px', background: 'var(--rose)', border: 'none', borderRadius: 'var(--r-md)', fontSize: 12, cursor: 'pointer', color: '#fff', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                          View all results for "{query}" →
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {user && (
              <Link to="/wishlist" title="Wishlist" style={iconBtn}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" title="Cart" style={{ ...iconBtn, position: 'relative' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
              {count > 0 && <span className="cart-badge">{count > 9 ? '9+' : count}</span>}
            </Link>

            {/* Account */}
            {user ? (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {user.isAdmin && <Link to="/admin" style={{ ...iconBtn, background: 'var(--rose)', border: 'none', color: 'var(--white)', padding: '0 12px', borderRadius: 'var(--r-full)', fontSize: 12, fontWeight: 600 }}>Admin</Link>}
                <Link to="/account" title="Account" style={iconBtn}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </Link>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">Sign In</Link>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(o => !o)} style={{ ...iconBtn, display: 'none' }} className="mob-btn" title="Menu">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: .26, ease: [.16, 1, .3, 1] }}
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
