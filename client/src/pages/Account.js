import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Account() {
  const { user, logout } = useAuth();
  if (!user) return null;
  const tiles = [
    { to: '/orders',   icon: '📦', label: 'My Orders',       desc: 'Track & view your orders' },
    { to: '/wishlist', icon: '♡',  label: 'Wishlist',         desc: 'Your saved items' },
    { to: '/cart',     icon: '🛍', label: 'Cart',             desc: 'Items in your cart' },
    { to: '/shop',     icon: '🛒', label: 'Continue Shopping', desc: 'Explore the collection' },
    ...(user.isAdmin ? [{ to: '/admin', icon: '⚙️', label: 'Admin Panel', desc: 'Manage your store' }] : []),
  ];
  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 620 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600, color: 'var(--off-black)', letterSpacing: '-.02em', marginBottom: 28 }}>My Account</h1>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border-light)', borderRadius: 'var(--r-xl)', padding: 28, marginBottom: 14, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24, paddingBottom: 22, borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ width: 62, height: 62, borderRadius: '50%', background: 'linear-gradient(135deg, var(--warm-200), var(--rose-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--rose-dark)', flexShrink: 0 }}>
            {(user.username || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--off-black)', marginBottom: 3 }}>{user.username}</div>
            <div style={{ fontSize: 13, color: 'var(--light-gray)' }}>{user.email}</div>
            {user.isAdmin && <span className="badge badge-black" style={{ marginTop: 6, display: 'inline-block' }}>Admin</span>}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {tiles.map(({ to, icon, label, desc }) => (
            <Link key={to} to={to} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '15px 16px', border: '1.5px solid var(--border-light)', borderRadius: 'var(--r-lg)', transition: 'all .15s', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--rose)'; e.currentTarget.style.background = 'var(--warm-50)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.background = 'transparent'; }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--off-black)' }}>{label}</div>
                <div style={{ fontSize: 11, color: 'var(--light-gray)', marginTop: 1 }}>{desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', border: '1.5px solid #fecaca', borderRadius: 'var(--r-full)', background: 'transparent', color: 'var(--red)', cursor: 'pointer', fontSize: 13, fontWeight: 500, fontFamily: 'var(--font-body)', transition: 'all .15s' }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--red-light)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
        Sign Out
      </button>
    </div>
  );
}
