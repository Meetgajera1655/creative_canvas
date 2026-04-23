import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', mobile: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  if (user) { navigate('/', { replace: true }); return null; }
  const up = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try { const u = await signup(form); toast.success(`Welcome, ${u.username}!`, { style: { borderRadius: '10px', background: '#111', color: '#fff' } }); navigate('/'); }
    catch (e) { setError(e.response?.data?.error || 'Signup failed'); }
    setLoading(false);
  };
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'var(--cream)' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }} style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, color: 'var(--off-black)', letterSpacing: '-.02em', marginBottom: 6 }}>Create account</div>
          <p style={{ fontSize: 14, color: 'var(--light-gray)' }}>Join Creative Canvas today</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <div style={{ background: 'var(--white)', borderRadius: 'var(--r-xl)', padding: 28, boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-light)' }}>
          <form onSubmit={handleSubmit}>
            {[['Full Name', 'username', 'text', 'Your name', true], ['Email Address', 'email', 'email', 'your@email.com', true], ['Mobile Number', 'mobile', 'tel', '+91 98765 43210', false], ['Password', 'password', 'password', 'Minimum 6 characters', true, 6]].map(([label, key, type, ph, req, min]) => (
              <div key={key} className="form-group">
                <label className="form-label">{label}{req ? ' *' : ''}</label>
                <input className="form-input" type={type} value={form[key]} onChange={e => up(key, e.target.value)} placeholder={ph} required={req} minLength={min} autoFocus={key === 'username'} />
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn btn-primary btn-full btn-lg" style={{ justifyContent: 'center', marginTop: 6 }}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        </div>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--light-gray)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--rose)', fontWeight: 600 }}>Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
}
