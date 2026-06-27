import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (user) { navigate(from, { replace: true }); return null; }

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Please enter a valid email address';
    
    if (!form.password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setServerError('');
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      const u = await login(form.email, form.password);
      toast.success(`Welcome back, ${u.username}!`, { 
        style: { borderRadius: '10px', background: 'var(--kasab-dark)', color: 'var(--gold-light)' },
        iconTheme: { primary: 'var(--gold)', secondary: 'var(--kasab-dark)' }
      });
      navigate(u.isAdmin ? '/admin' : from, { replace: true });
    } catch (e) { 
      setServerError(e.response?.data?.error || 'Invalid credentials. Please try again.'); 
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }));
    setServerError('');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--white)' }}>
      {/* Left side: Premium Branding */}
      <div style={{ flex: 1, background: 'var(--cream)', display: 'none', position: 'relative', overflow: 'hidden' }} className="auth-left">
        {/* Abstract luxury overlay */}
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '70%', height: '70%', background: 'radial-gradient(circle, rgba(197,160,89,0.15) 0%, rgba(244,239,232,0) 70%)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(197,160,89,0.1) 0%, rgba(244,239,232,0) 70%)', borderRadius: '50%' }}></div>
        
        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', padding: '60px 80px' }}>
          
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 'auto', textDecoration: 'none' }}>
            <img src="/favicon.png" alt="Creative Canvas Logo" style={{ height: 48, width: 'auto', objectFit: 'contain', mixBlendMode: 'multiply' }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, letterSpacing: '2px', textTransform: 'uppercase' }}>
              <span style={{ fontWeight: 400, color: 'var(--kasab-dark)' }}>Creative </span>
              <span style={{ fontWeight: 700, color: 'var(--gold)' }}>Canvas</span>
            </div>
          </Link>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(44px, 5vw, 64px)', fontWeight: 300, lineHeight: 1.15, marginBottom: '24px', letterSpacing: '-0.02em', color: 'var(--kasab-dark)' }}>
              Curate your<br/><span style={{ color: 'var(--rose-dark)', fontWeight: 500 }}>masterpiece.</span>
            </h1>
            <p style={{ fontSize: '18px', opacity: 0.9, maxWidth: '420px', lineHeight: 1.6, color: 'var(--mid-gray)', fontWeight: 300 }}>
              Access exclusive collections, track your premium orders, and discover art that transforms your space.
            </p>
          </motion.div>
          
          <div style={{ marginTop: 'auto', fontSize: 13, color: 'var(--light-gray)', letterSpacing: '0.05em' }}>
            © {new Date().getFullYear()} CREATIVE CANVAS.
          </div>
        </div>
      </div>

      {/* Right side: Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'var(--white)' }}>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} style={{ width: '100%', maxWidth: '380px' }}>
          
          <div className="mobile-logo" style={{ textAlign: 'center', marginBottom: 40, display: 'none' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, textDecoration: 'none' }}>
              <img src="/favicon.png" alt="Creative Canvas Logo" style={{ height: 40, width: 'auto', objectFit: 'contain', mixBlendMode: 'multiply' }} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                <span style={{ fontWeight: 400, color: 'var(--kasab-dark)' }}>Creative </span>
                <span style={{ fontWeight: 700, color: 'var(--gold)' }}>Canvas</span>
              </div>
            </Link>
          </div>

          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 600, color: 'var(--kasab-dark)', letterSpacing: '-.02em', marginBottom: 8 }}>Sign In</h2>
            <p style={{ fontSize: 15, color: 'var(--mid-gray)' }}>Welcome back to your gallery.</p>
          </div>

          {serverError && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'var(--red-light)', color: 'var(--red)', padding: '14px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, marginBottom: '24px', border: '1px solid rgba(220,38,38,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiLock size={16} /> {serverError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label" style={{ fontSize: 12, color: 'var(--kasab-dark)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--silver)' }}>
                  <FiMail size={18} />
                </div>
                <input 
                  name="email"
                  className="form-input" 
                  type="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  placeholder="name@example.com" 
                  autoFocus 
                  style={{ 
                    paddingLeft: 46, 
                    height: 52,
                    borderRadius: '8px',
                    borderColor: errors.email ? 'var(--red)' : 'var(--border-light)',
                    backgroundColor: 'var(--off-white)',
                    transition: 'all 0.2s ease'
                  }} 
                  onFocus={e => e.target.style.backgroundColor = 'var(--white)'}
                  onBlur={e => e.target.style.backgroundColor = form.email ? 'var(--white)' : 'var(--off-white)'}
                />
              </div>
              {errors.email && <div className="form-error" style={{ marginTop: 6, fontWeight: 500 }}><motion.span initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>{errors.email}</motion.span></div>}
            </div>

            <div className="form-group" style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <label className="form-label" style={{ fontSize: 12, color: 'var(--kasab-dark)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 0 }}>Password</label>
                <Link to="#" style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600, transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--rose-dark)'} onMouseOut={e => e.target.style.color = 'var(--gold)'}>Forgot?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--silver)' }}>
                  <FiLock size={18} />
                </div>
                <input 
                  name="password"
                  className="form-input" 
                  type={showPassword ? 'text' : 'password'} 
                  value={form.password} 
                  onChange={handleChange} 
                  placeholder="••••••••" 
                  style={{ 
                    paddingLeft: 46, 
                    paddingRight: 48, 
                    height: 52,
                    borderRadius: '8px',
                    borderColor: errors.password ? 'var(--red)' : 'var(--border-light)',
                    backgroundColor: 'var(--off-white)',
                    transition: 'all 0.2s ease'
                  }} 
                  onFocus={e => e.target.style.backgroundColor = 'var(--white)'}
                  onBlur={e => e.target.style.backgroundColor = form.password ? 'var(--white)' : 'var(--off-white)'}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--light-gray)', display: 'flex', padding: 4 }} 
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.password && <div className="form-error" style={{ marginTop: 6, fontWeight: 500 }}><motion.span initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>{errors.password}</motion.span></div>}
            </div>

            <button type="submit" disabled={loading} className="btn btn-gold btn-full" style={{ height: 52, fontSize: 14, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', borderRadius: '8px' }}>
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <div className="spinner-sm" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }}></div>
                  Authenticating...
                </div>
              ) : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: 32, position: 'relative', textAlign: 'center' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px solid var(--border-light)', zIndex: 0 }}></div>
            <span style={{ position: 'relative', zIndex: 1, background: 'var(--white)', padding: '0 16px', fontSize: 12, color: 'var(--silver)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              New to Creative Canvas?
            </span>
          </div>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--mid-gray)' }}>
            <Link to="/signup" style={{ color: 'var(--kasab-dark)', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--gold)'} onMouseOut={e => e.target.style.color = 'var(--kasab-dark)'}>
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 900px) {
          .auth-left { display: flex !important; }
        }
        @media (max-width: 899px) {
          .mobile-logo { display: block !important; }
        }
      `}} />
    </div>
  );
}
