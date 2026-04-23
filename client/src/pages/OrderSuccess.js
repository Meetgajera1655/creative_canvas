import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function OrderSuccess() {
  const { state } = useLocation();
  return (
    <div className="container" style={{ paddingTop: 100, paddingBottom: 100, textAlign: 'center', maxWidth: 520 }}>
      <motion.div initial={{ scale: .6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }}>
        <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', fontSize: 42, boxShadow: '0 8px 32px rgba(34,197,94,.2)' }}>✓</div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, duration: .5 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: 'var(--off-black)', letterSpacing: '-.02em', marginBottom: 10 }}>Order Confirmed!</h1>
        <p style={{ fontSize: 15, color: 'var(--mid-gray)', marginBottom: state?.orderId ? 8 : 28, lineHeight: 1.7 }}>
          Thank you for your purchase. Your handcrafted items are being prepared with love and care.
        </p>
        {state?.orderId && (
          <div style={{ fontSize: 12, color: 'var(--silver)', fontFamily: 'monospace', marginBottom: 32, background: 'var(--off-white)', display: 'inline-block', padding: '6px 16px', borderRadius: 'var(--r-full)', border: '1px solid var(--border-light)' }}>
            Order ID: #{state.orderId.slice(-8).toUpperCase()}
          </div>
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/orders" className="btn btn-primary btn-lg">Track Order</Link>
          <Link to="/shop" className="btn btn-outline btn-lg">Continue Shopping</Link>
        </div>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 32, fontSize: 13, color: 'var(--light-gray)' }}>
          <span>📧 Confirmation sent to your email</span>
          <span>🚚 Delivery in 3-5 days</span>
        </div>
      </motion.div>
    </div>
  );
}
