import React from 'react';
import { motion } from 'framer-motion';
import { FiXCircle, FiShield, FiCheckCircle } from 'react-icons/fi';

const Decoration = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: -1, pointerEvents: 'none' }}>
    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.02, 0.04, 0.02] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', top: '10%', left: '10%', width: 500, height: 500, background: '#EF4444', filter: 'blur(150px)', borderRadius: '50%' }} />
  </div>
);

export default function Returns() {
  return (
    <div style={{ position: 'relative', minHeight: '80vh', padding: '80px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Decoration />
      <div className="container" style={{ maxWidth: 800 }}>
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.7, type: 'spring' }} style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', borderRadius: '32px', padding: '70px 50px', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 30px 60px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring', stiffness: 200 }} style={{ width: 100, height: 100, borderRadius: '50%', background: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 40px', boxShadow: '0 0 0 10px #FEF2F2' }}>
            <FiXCircle size={50} />
          </motion.div>
          
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.15em', color: '#EF4444', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Store Policy</span>
          <h1 style={{ fontSize: 48, marginBottom: 24, fontFamily: 'var(--font-display)', color: 'var(--kasab-dark)' }}>No Returns Policy</h1>
          
          <p style={{ fontSize: 18, lineHeight: 1.8, color: 'var(--kasab-mid)', maxWidth: 600, margin: '0 auto 40px' }}>
            At Creative Canvas, every piece of resin art and Kasab embroidery is meticulously handcrafted to order. Because of the highly personalized and delicate nature of our creations, <strong>we do not offer returns, refunds, or exchanges</strong> on any of our products.
          </p>

          <div style={{ width: '100%', height: 1, background: 'linear-gradient(90deg, transparent, var(--border-light), transparent)', marginBottom: 40 }} />

          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--warm-50)', color: 'var(--rose)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiCheckCircle size={24} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--kasab-dark)' }}>100% Handcrafted</div>
                <div style={{ fontSize: 13, color: 'var(--kasab-mid)' }}>Made uniquely for you</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--warm-50)', color: 'var(--kasab-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiShield size={24} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--kasab-dark)' }}>Quality Assured</div>
                <div style={{ fontSize: 13, color: 'var(--kasab-mid)' }}>Strictly inspected before dispatch</div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
