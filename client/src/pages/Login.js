import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) { navigate(from, { replace: true }); return null; }

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const u = await login(form.email, form.password);
      toast.success(`Welcome back, ${u.username}!`, { style: { borderRadius: '10px', background: '#111', color: '#fff' } });
      navigate(u.isAdmin ? '/admin' : from, { replace: true });
    } catch (e) { setError(e.response?.data?.error || 'Login failed'); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'var(--cream)' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }} style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, color: 'var(--off-black)', letterSpacing: '-.02em', marginBottom: 6 }}>Welcome back</div>
          <p style={{ fontSize: 14, color: 'var(--light-gray)' }}>Sign in to your Creative Canvas account</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <div style={{ background: 'var(--white)', borderRadius: 'var(--r-xl)', padding: 28, boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-light)' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" required autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-full btn-lg" style={{ justifyContent: 'center', marginTop: 6 }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--light-gray)' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--rose)', fontWeight: 600 }}>Create Account</Link>
        </p>
      </motion.div>
    </div>
  );
}
