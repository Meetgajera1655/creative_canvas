import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ordersAPI } from '../services/api';
import { formatPrice } from '../utils/image';

const STEPS = ['placed','confirmed','shipped','out_for_delivery','delivered'];
const STEP_LABELS = { placed:'Placed', confirmed:'Confirmed', shipped:'Shipped', out_for_delivery:'Out for Delivery', delivered:'Delivered', cancelled:'Cancelled' };
const statusClass = s => s === 'delivered' ? 'badge-green' : s === 'cancelled' ? 'badge-red' : s === 'shipped' || s === 'out_for_delivery' ? 'badge-orange' : 'badge-gray';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    ordersAPI.getMyOrders().then(r => setOrders(r.data.orders || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 72 }}>
      <div className="breadcrumb" style={{ marginBottom: 20 }}><Link to="/">Home</Link><span className="breadcrumb-sep">›</span><span>My Orders</span></div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600, color: 'var(--off-black)', letterSpacing: '-.02em', marginBottom: 28 }}>My Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon" style={{ fontSize: 32 }}>📦</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--off-black)', marginBottom: 8 }}>No orders yet</h3>
          <p style={{ color: 'var(--light-gray)', marginBottom: 24 }}>Your order history will appear here</p>
          <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        orders.map(order => {
          const statusKey = (order.order_status || 'placed').toLowerCase().replace(' ', '_');
          const stepIdx = STEPS.indexOf(statusKey);
          const isCancelled = statusKey === 'cancelled';
          const isExpanded = expanded === order._key;

          return (
            <motion.div key={order._key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: 'var(--white)', border: '1px solid var(--border-light)', borderRadius: 'var(--r-xl)', marginBottom: 14, overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
              {/* Header row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', cursor: 'pointer' }}
                onClick={() => setExpanded(isExpanded ? null : order._key)}>
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--silver)', marginBottom: 3 }}>ORDER #{(order._key || '').slice(-8).toUpperCase()}</div>
                  <div style={{ fontSize: 12, color: 'var(--light-gray)' }}>{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span className={`badge ${statusClass(statusKey)}`} style={{ textTransform: 'capitalize' }}>{STEP_LABELS[statusKey] || order.order_status}</span>
                  <span className={`badge ${order.payment_status === 'paid' ? 'badge-green' : 'badge-gray'}`}>{order.payment_status || 'pending'}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--off-black)' }}>{formatPrice(order.total_amount)}</span>
                  <span style={{ color: 'var(--border)', fontSize: 12, transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform .2s', display: 'inline-block' }}>▼</span>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .22 }} style={{ overflow: 'hidden' }}>
                    <div style={{ padding: '0 22px 22px', borderTop: '1px solid var(--border-light)' }}>
                      {/* Progress tracker */}
                      {!isCancelled && stepIdx >= 0 && (
                        <div style={{ padding: '24px 0 20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: 10, left: '6%', right: '6%', height: 2, background: 'var(--border-light)', zIndex: 0 }}>
                              <div style={{ height: '100%', background: 'var(--rose)', borderRadius: 2, width: stepIdx >= 0 ? `${(stepIdx / (STEPS.length - 1)) * 100}%` : '0%', transition: 'width .5s ease' }} />
                            </div>
                            {STEPS.map((s, i) => (
                              <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, zIndex: 1, flex: 1 }}>
                                <div style={{ width: 22, height: 22, borderRadius: '50%', background: i <= stepIdx ? 'var(--rose)' : 'var(--border-light)', border: `2px solid ${i <= stepIdx ? 'var(--rose)' : 'var(--border-light)'}`, transition: 'all .3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {i < stepIdx && <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>✓</span>}
                                </div>
                                <span style={{ fontSize: 10, color: i <= stepIdx ? 'var(--rose)' : 'var(--light-gray)', fontWeight: i === stepIdx ? 700 : 400, textAlign: 'center', maxWidth: 72, lineHeight: 1.3 }}>{STEP_LABELS[s]}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--silver)', marginBottom: 10 }}>Items Ordered</div>
                          {(order.items || []).map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border-light)', fontSize: 13 }}>
                              <span style={{ color: 'var(--mid-gray)' }}>{item.name} × {item.quantity || 1}</span>
                              <span style={{ fontWeight: 600 }}>{formatPrice((item.price || 0) * (item.quantity || 1))}</span>
                            </div>
                          ))}
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', fontSize: 14, fontWeight: 700 }}>
                            <span>Total</span><span>{formatPrice(order.total_amount)}</span>
                          </div>
                        </div>

                        {order.address && (
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--silver)', marginBottom: 10 }}>📍 Delivery Address</div>
                            <div style={{ fontSize: 13, color: 'var(--mid-gray)', lineHeight: 1.9 }}>
                              <div style={{ fontWeight: 600, color: 'var(--dark-gray)' }}>{order.address.name}</div>
                              <div>{order.address.phone}</div>
                              <div>{order.address.line1}{order.address.line2 ? ', ' + order.address.line2 : ''}</div>
                              <div>{order.address.city}, {order.address.state} — {order.address.pincode}</div>
                            </div>
                            <div style={{ marginTop: 14, fontSize: 12, color: 'var(--mid-gray)' }}>
                              <span style={{ fontWeight: 600 }}>Payment:</span> {order.payment_method || 'Razorpay'} · <span className={`badge ${order.payment_status === 'paid' ? 'badge-green' : 'badge-gray'}`}>{order.payment_status || 'pending'}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })
      )}
    </div>
  );
}
