import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, ordersAPI } from '../../services/api';
import AdminLayout from '../../components/layout/AdminLayout';
import { formatPrice } from '../../utils/image';

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminAPI.getStats(), ordersAPI.getAllAdmin()])
      .then(([s, o]) => { setStats(s.data); setOrders((o.data.orders || []).slice(0, 6)); })
      .finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: 'Total Orders',   value: stats.totalOrders,               color: '#c9897a', icon: '🚚', link: '/admin/orders' },
    { label: 'Products',       value: stats.totalProducts,             color: '#b8963e', icon: '📦', link: '/admin/products' },
    { label: 'Revenue (paid)', value: formatPrice(stats.revenue || 0), color: '#16a34a', icon: '💰', link: '/admin/orders' },
    { label: 'Customers',      value: stats.totalUsers,                color: '#2563eb', icon: '👥', link: '/admin/users' },
  ] : [];

  const STATUS_BADGE = { delivered: 'badge-green', cancelled: 'badge-red', shipped: 'badge-blue', confirmed: 'badge-orange', placed: 'badge-gray' };

  return (
    <AdminLayout title="Dashboard">
      {loading ? <div className="loading-center"><div className="spinner" /></div> : (
        <>
          <div className="admin-stats-grid">
            {cards.map(c => (
              <Link key={c.label} to={c.link} style={{ textDecoration: 'none' }}>
                <div className="admin-stat-card" style={{ borderLeft: `4px solid ${c.color}`, cursor: 'pointer' }}>
                  <div style={{ fontSize: 24, marginBottom: 10 }}>{c.icon}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--off-black)', lineHeight: 1.1 }}>{c.value}</div>
                  <div style={{ fontSize: 12, color: 'var(--light-gray)', marginTop: 4, fontWeight: 500 }}>{c.label}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Brand split */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Creative Canvas', icon: '🎨', count: stats?.resinCount, bg: 'var(--warm-50)',  link: '/admin/products?brand=resin' },
              { label: 'Kasab Products',  icon: '🧵', count: stats?.kasabCount, bg: 'var(--gold-muted)', link: '/admin/products?brand=kasab' },
              { label: 'Reviews',         icon: '⭐', count: stats?.totalReviews, bg: 'var(--green-light)', link: '/admin/reviews' },
            ].map(c => (
              <Link key={c.label} to={c.link} className="admin-stat-card" style={{ background: c.bg, textDecoration: 'none', display: 'block', transition: 'transform .15s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--off-black)' }}>{c.count}</div>
                <div style={{ fontSize: 12, color: 'var(--mid-gray)', marginTop: 2 }}>{c.label}</div>
              </Link>
            ))}
          </div>

          {/* Recent orders */}
          <div style={{ background: 'var(--white)', border: '1px solid var(--border-light)', borderRadius: 'var(--r-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, color: 'var(--off-black)' }}>Recent Orders</h3>
              <Link to="/admin/orders" style={{ fontSize: 13, color: 'var(--rose)', fontWeight: 500 }}>View All →</Link>
            </div>
            {orders.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--light-gray)', fontSize: 14 }}>No orders yet</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Status</th><th>Payment</th></tr></thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o._key}>
                        <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--light-gray)' }}>#{(o._key || '').slice(-8).toUpperCase()}</td>
                        <td style={{ fontSize: 13 }}>{o.username || o.user_email || 'Guest'}</td>
                        <td style={{ fontWeight: 600, color: 'var(--rose)' }}>{formatPrice(o.total_amount)}</td>
                        <td><span className={`badge ${STATUS_BADGE[(o.order_status || 'placed').toLowerCase().replace(/ /g,'_')] || 'badge-gray'}`}>{o.order_status || 'placed'}</span></td>
                        <td><span className={`badge ${o.payment_status === 'paid' ? 'badge-green' : 'badge-gray'}`}>{o.payment_status || 'pending'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
