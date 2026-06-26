import React from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiTruck, FiAlertCircle } from 'react-icons/fi';

const Decoration = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: -1, pointerEvents: 'none' }}>
    <div style={{ position: 'absolute', top: 0, right: 0, width: '50vw', height: '100%', background: 'linear-gradient(to left, var(--warm-50), transparent)', opacity: 0.5 }} />
  </div>
);

export default function ShippingPolicy() {
  return (
    <div style={{ position: 'relative', minHeight: '80vh', padding: '80px 20px' }}>
      <Decoration />
      <div className="container" style={{ maxWidth: 900 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: 70 }}>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--rose)', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Delivery Information</span>
          <h1 style={{ fontSize: 52, marginBottom: 20, fontFamily: 'var(--font-display)', color: 'var(--kasab-dark)', letterSpacing: '-0.02em' }}>Shipping Policy</h1>
          <p style={{ fontSize: 17, color: 'var(--kasab-mid)', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>We handle every piece of art with the utmost care to ensure it arrives perfectly.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 30 }}>
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} style={{ background: '#fff', borderRadius: 'var(--r-xl)', padding: '50px 40px', border: '1px solid var(--border-light)', boxShadow: '0 20px 40px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -30, right: -30, opacity: 0.03, color: 'var(--kasab-dark)' }}><FiMapPin size={250} /></div>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--warm-50)', color: 'var(--rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 30 }}>
              <FiMapPin size={28} />
            </div>
            <h3 style={{ fontSize: 28, marginBottom: 16, fontFamily: 'var(--font-display)', color: 'var(--kasab-dark)' }}>Local Delivery</h3>
            <div style={{ display: 'inline-block', padding: '6px 14px', background: 'var(--rose)', color: '#fff', fontSize: 12, fontWeight: 700, borderRadius: 'var(--r-full)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20 }}>Available (Surat Only)</div>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--kasab-mid)' }}>We are based in Surat and proudly provide dedicated, safe delivery services exclusively within the Surat region. This ensures our delicate resin and Kasab art pieces are handled properly and arrive directly at your doorstep in pristine condition.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} style={{ background: 'linear-gradient(135deg, #fff 0%, var(--warm-50) 100%)', borderRadius: 'var(--r-xl)', padding: '50px 40px', border: '1px solid rgba(226, 172, 151, 0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -30, right: -30, opacity: 0.03, color: 'var(--kasab-dark)' }}><FiTruck size={250} /></div>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fff', color: 'var(--kasab-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 30, boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
              <FiTruck size={28} />
            </div>
            <h3 style={{ fontSize: 28, marginBottom: 16, fontFamily: 'var(--font-display)', color: 'var(--kasab-dark)' }}>Outside Surat</h3>
            <div style={{ display: 'inline-block', padding: '6px 14px', background: 'var(--kasab-dark)', color: '#fff', fontSize: 12, fontWeight: 700, borderRadius: 'var(--r-full)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20 }}>Special Request</div>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--kasab-mid)', marginBottom: 24 }}>For our customers located outside of Surat, we do not offer standard shipping due to the fragile nature of the artworks.</p>
            <div style={{ display: 'flex', gap: 16, background: '#fff', padding: '20px', borderRadius: 'var(--r-md)', borderLeft: '4px solid var(--rose)', boxShadow: '0 5px 15px rgba(0,0,0,0.03)' }}>
              <FiAlertCircle size={24} color="var(--rose)" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: 14, color: 'var(--kasab-dark)', margin: 0, fontWeight: 500, lineHeight: 1.6 }}>If you still wish to place an order, extra delivery charges will apply. Please contact us before ordering to calculate fees and arrange logistics.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
