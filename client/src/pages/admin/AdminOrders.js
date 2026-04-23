import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ordersAPI } from '../../services/api';
import AdminLayout from '../../components/layout/AdminLayout';
import { formatPrice } from '../../utils/image';

const STATUSES = ['placed','confirmed','shipped','out_for_delivery','delivered','cancelled'];
const STATUS_BADGE = { delivered: 'badge-green', cancelled: 'badge-red', shipped: 'badge-blue', confirmed: 'badge-orange', placed: 'badge-gray', out_for_delivery: 'badge-blue' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('');

  const fetchOrders = () => {
    setLoading(true);
    ordersAPI.getAllAdmin().then(r => setOrders(r.data.orders || [])).finally(() => setLoading(false));
  };
  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, order_status) => {
    try {
      await ordersAPI.updateStatus(id, { order_status });
      toast.success('Order status updated');
      setOrders(prev => prev.map(o => o._key === id ? { ...o, order_status } : o));
    } catch { toast.error('Update failed'); }
  };

  const filtered = filter ? orders.filter(o => (o.order_status || 'placed').toLowerCase() === filter) : orders;

  return (
    <AdminLayout title="Orders">
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {[['', 'All'], ...STATUSES.map(s => [s, s.replace(/_/g, ' ')])].map(([s, l]) => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ padding: '6px 14px', borderRadius: 'var(--r-full)', fontSize: 12, fontWeight: 600, cursor: 'pointer', border: `1.5px solid ${filter === s ? 'var(--off-black)' : 'var(--border-light)'}`, background: filter === s ? 'var(--off-black)' : 'var(--white)', color: filter === s ? 'var(--white)' : 'var(--mid-gray)', transition: 'all .15s', fontFamily: 'var(--font-body)', textTransform: 'capitalize' }}>
            {l}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--light-gray)' }}>{filtered.length} orders</span>
      </div>

      <div style={{ background: 'var(--white)', border: '1px solid var(--border-light)', borderRadius: 'var(--r-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
        {loading ? <div className="loading-center"><div className="spinner" /></div> :
          filtered.length === 0 ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--light-gray)', fontSize: 14 }}>No orders found</div> : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Payment</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
                <tbody>
                  {filtered.map(o => (
                    <React.Fragment key={o._key}>
                      <tr style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === o._key ? null : o._key)}>
                        <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--light-gray)' }}>#{(o._key || '').slice(-8).toUpperCase()}</td>
                        <td>
                          <div style={{ fontWeight: 500, fontSize: 13 }}>{o.username || 'Guest'}</div>
                          <div style={{ fontSize: 11, color: 'var(--silver)' }}>{o.user_email || ''}</div>
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--rose)' }}>{formatPrice(o.total_amount)}</td>
                        <td><span className={`badge ${o.payment_status === 'paid' ? 'badge-green' : 'badge-gray'}`}>{o.payment_status || 'pending'}</span></td>
                        <td onClick={e => e.stopPropagation()}>
                          <select value={o.order_status || 'placed'} onChange={e => updateStatus(o._key, e.target.value)}
                            className="form-input" style={{ padding: '5px 32px 5px 10px', fontSize: 12, borderRadius: 'var(--r-sm)', width: 'auto', minWidth: 130 }}>
                            {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                          </select>
                        </td>
                        <td style={{ fontSize: 11, color: 'var(--light-gray)', whiteSpace: 'nowrap' }}>{new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</td>
                        <td><button style={{ fontSize: 11, padding: '4px 10px', border: '1px solid var(--border-light)', borderRadius: 'var(--r-sm)', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>{expanded === o._key ? 'Hide' : 'Details'}</button></td>
                      </tr>
                      {expanded === o._key && (
                        <tr><td colSpan={7} style={{ background: 'var(--warm-50)', padding: '16px 20px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, fontSize: 13 }}>
                            <div>
                              <div style={{ fontWeight: 700, marginBottom: 8, color: 'var(--dark-gray)' }}>Items Ordered</div>
                              {(o.items || []).map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--border-light)' }}>
                                  <span style={{ color: 'var(--mid-gray)' }}>{item.name} ×{item.quantity || 1}</span>
                                  <span style={{ fontWeight: 500 }}>{formatPrice((item.price || 0) * (item.quantity || 1))}</span>
                                </div>
                              ))}
                            </div>
                            {o.address && (
                              <div>
                                <div style={{ fontWeight: 700, marginBottom: 8, color: 'var(--dark-gray)' }}>Delivery Address</div>
                                <div style={{ color: 'var(--mid-gray)', lineHeight: 1.8 }}>
                                  <div style={{ fontWeight: 600, color: 'var(--dark-gray)' }}>{o.address.name} · {o.address.phone}</div>
                                  <div>{o.address.line1}{o.address.line2 ? ', ' + o.address.line2 : ''}</div>
                                  <div>{o.address.city}, {o.address.state} — {o.address.pincode}</div>
                                  <div style={{ marginTop: 6 }}>Payment: <strong>{o.payment_method}</strong></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </td></tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </AdminLayout>
  );
}
