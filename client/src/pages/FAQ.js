import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';

const faqs = [
  { q: "What is Creative Canvas?", a: "Creative Canvas is a premium store specializing in handcrafted resin art and Kasab embroidery. Every piece is unique and meticulously crafted with love in India, ensuring you receive a one-of-a-kind masterpiece." },
  { q: "Do you deliver outside Surat?", a: "We primarily deliver within Surat to ensure the safe and timely arrival of our delicate artworks. However, if you are located outside Surat and wish to purchase, we can arrange shipping with extra delivery charges applied." },
  { q: "Can I return my order?", a: "Due to the personalized and handcrafted nature of our products, all items are made to order. Therefore, we do not accept returns or exchanges. We ensure strict quality checks before dispatch." },
  { q: "How can I contact you?", a: "You can reach out to us directly via WhatsApp at +91 9327313381 or follow and message our Instagram page @creative_canvas26_." }
];

const Decoration = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: -1, pointerEvents: 'none' }}>
    <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.03, 0.06, 0.03] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '80vw', height: '80vw', background: 'var(--rose)', filter: 'blur(150px)', borderRadius: '50%' }} />
  </div>
);

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div style={{ position: 'relative', minHeight: '80vh', padding: '80px 20px' }}>
      <Decoration />
      <div className="container" style={{ maxWidth: 800 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: 60 }}>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--rose)', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>FAQ</span>
          <h1 style={{ fontSize: 52, marginBottom: 20, fontFamily: 'var(--font-display)', color: 'var(--kasab-dark)', letterSpacing: '-0.02em' }}>Common Questions</h1>
          <p style={{ fontSize: 17, color: 'var(--kasab-mid)', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>Everything you need to know about our handcrafted products, shipping, and store policies.</p>
        </motion.div>
        
        <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div key={i} variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} style={{ background: isOpen ? '#fff' : 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)', border: `1px solid ${isOpen ? 'var(--rose)' : 'var(--border-light)'}`, borderRadius: 'var(--r-xl)', overflow: 'hidden', boxShadow: isOpen ? '0 10px 30px rgba(0,0,0,0.06)' : 'none', transition: 'all 0.3s' }}>
                <button onClick={() => setOpenIndex(isOpen ? null : i)} style={{ width: '100%', padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ fontSize: 18, fontWeight: 600, color: isOpen ? 'var(--rose)' : 'var(--kasab-dark)', fontFamily: 'var(--font-display)', transition: 'color 0.3s' }}>{faq.q}</span>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: isOpen ? 'var(--rose)' : 'var(--warm-50)', color: isOpen ? '#fff' : 'var(--kasab-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', flexShrink: 0, marginLeft: 20 }}>
                    {isOpen ? <FiMinus size={18} /> : <FiPlus size={18} />}
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} style={{ overflow: 'hidden' }}>
                      <div style={{ padding: '0 30px 30px', fontSize: 16, lineHeight: 1.8, color: 'var(--kasab-mid)' }}>
                        <div style={{ width: 40, height: 3, background: 'var(--rose)', opacity: 0.3, marginBottom: 20, borderRadius: 2 }} />
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
