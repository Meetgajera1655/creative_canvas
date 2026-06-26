import React from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';

const Decoration = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: -1, pointerEvents: 'none' }}>
    <motion.div animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', top: '10%', left: '10%', width: 300, height: 300, background: 'var(--rose)', filter: 'blur(100px)', opacity: 0.1, borderRadius: '50%' }} />
    <motion.div animate={{ y: [0, 30, 0], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', bottom: '10%', right: '10%', width: 400, height: 400, background: '#F59E0B', filter: 'blur(120px)', opacity: 0.05, borderRadius: '50%' }} />
  </div>
);

export default function ContactUs() {
  const cards = [
    { image: "/founder.jpg", title: "Founder & Artist", value: "Drashti Gajera", desc: "The creative mind behind every masterpiece.", link: null, color: "var(--kasab-dark)" },
    { icon: <FaWhatsapp size={32} />, title: "Chat with Us", value: "+91 9327313381", desc: "Fastest way to get answers and place custom orders.", link: "https://wa.me/919327313381", color: "#25D366" },
    { icon: <FaInstagram size={32} />, title: "Follow Us", value: "@creative_canvas26_", desc: "Join our community and see behind the scenes.", link: "https://www.instagram.com/creative_canvas26_/", color: "#E1306C" },
  ];

  return (
    <div style={{ position: 'relative', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <Decoration />
      <div className="container" style={{ padding: '80px 20px', maxWidth: 1100, width: '100%' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }} style={{ textAlign: 'center', marginBottom: 70 }}>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--rose)', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>We're here for you</span>
          <h1 style={{ fontSize: 56, marginBottom: 20, fontFamily: 'var(--font-display)', color: 'var(--kasab-dark)', letterSpacing: '-0.02em' }}>Let's start a conversation</h1>
          <p style={{ fontSize: 18, color: 'var(--kasab-mid)', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>Have a question about a piece? Want to discuss a custom order? We'd love to hear from you.</p>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 30 }}>
          {cards.map((card, i) => (
            <motion.div key={i} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } }} whileHover={{ y: -10 }} style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', borderRadius: 'var(--r-xl)', padding: '50px 30px', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 20px 40px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              {card.image ? (
                <div style={{ width: 140, height: 140, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 24px', boxShadow: '0 15px 30px rgba(0,0,0,0.15)', border: '4px solid #fff' }}>
                  <img src={card.image} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
                </div>
              ) : (
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.5) 100%)', color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                  {card.icon}
                </div>
              )}
              <h3 style={{ fontSize: 22, marginBottom: 12, color: 'var(--kasab-dark)', fontFamily: 'var(--font-display)' }}>{card.title}</h3>
              <p style={{ fontSize: 15, color: 'var(--kasab-mid)', marginBottom: 30, lineHeight: 1.6, flex: 1 }}>{card.desc}</p>
              {card.link ? (
                <a href={card.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: card.color, color: '#fff', borderRadius: 'var(--r-full)', textDecoration: 'none', fontWeight: 600, fontSize: 14, transition: 'all 0.3s', boxShadow: `0 8px 16px ${card.color}40` }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                  {card.value} <FiArrowRight />
                </a>
              ) : (
                <div style={{ display: 'inline-flex', padding: '12px 28px', background: 'var(--kasab-dark)', color: '#fff', borderRadius: 'var(--r-full)', fontWeight: 600, fontSize: 14 }}>
                  {card.value}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
