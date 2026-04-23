import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LINKS = [
  { to: '/admin',          label: 'Dashboard',  icon: '▤',  exact: true },
  { to: '/admin/products', label: 'Products',   icon: '📦' },
  { to: '/admin/orders',   label: 'Orders',     icon: '🚚' },
  { to: '/admin/reviews',  label: 'Reviews',    icon: '⭐' },
  { to: '/admin/users',    label: 'Users',      icon: '👥' },
];

export default function AdminLayout({ children, title }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div style={{ padding: '0 18px 18px', borderBottom: '1px solid rgba(255,255,255,.06)', marginBottom: 8 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--white)', letterSpacing: '-.01em' }}>
            Creative<em style={{ color: 'var(--rose)', fontStyle: 'italic', fontWeight: 400 }}> Canvas</em>
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.28)', marginTop: 3, letterSpacing: '.12em', textTransform: 'uppercase' }}>Admin Panel</div>
        </div>

        <div className="admin-sidebar-section">Main</div>
        {LINKS.map(({ to, label, icon, exact }) => (
          <NavLink key={to} to={to} end={exact}
            className={({ isActive }) => `admin-sidebar-link${isActive ? ' active' : ''}`}>
            <span style={{ fontSize: 15 }}>{icon}</span> {label}
          </NavLink>
        ))}

        <div style={{ marginTop: 'auto', padding: '16px 18px', borderTop: '1px solid rgba(255,255,255,.06)' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.32)', cursor: 'pointer', fontSize: 12, display: 'block', padding: '4px 0', fontFamily: 'var(--font-body)', width: '100%', textAlign: 'left' }}>← View Store</button>
          <button onClick={logout} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.32)', cursor: 'pointer', fontSize: 12, display: 'block', padding: '4px 0', fontFamily: 'var(--font-body)', width: '100%', textAlign: 'left' }}>Sign Out</button>
        </div>
      </aside>

      <div className="admin-main">
        {title && <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, color: 'var(--off-black)', letterSpacing: '-.02em', marginBottom: 24 }}>{title}</h1>}
        {children}
      </div>
    </div>
  );
}
