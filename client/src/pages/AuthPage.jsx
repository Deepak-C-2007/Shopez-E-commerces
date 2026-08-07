import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AuthPage({ onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();

  const handleAdminQuickFill = () => {
    setIsLogin(true);
    setEmail('admin@gmail.com');
    setPassword('admin123');
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    let res;
    if (isLogin) {
      res = await login(email, password);
    } else {
      res = await register(name, email, password);
    }

    setSubmitting(false);

    if (res.success) {
      if (onSuccess) onSuccess();
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        background: '#fff',
        border: '1.5px solid #d1ddf7',
        borderRadius: '16px',
        boxShadow: '0 8px 28px rgba(29,106,229,0.10)',
        padding: '2.25rem 2rem',
        position: 'relative'
      }}>

        {/* Admin Preset Banner */}
        <div
          onClick={handleAdminQuickFill}
          style={{
            background: '#eff6ff',
            border: '1.5px dashed #93c5fd',
            borderRadius: '10px',
            padding: '0.7rem 1rem',
            marginBottom: '1.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'background 0.15s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#dbeafe'}
          onMouseLeave={e => e.currentTarget.style.background = '#eff6ff'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={17} color="#1d6ae5" />
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1d6ae5' }}>Admin Preset Login</div>
              <div style={{ fontSize: '0.74rem', color: '#6b7280' }}>admin@gmail.com | admin123</div>
            </div>
          </div>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1d6ae5', background: '#bfdbfe', padding: '0.15rem 0.55rem', borderRadius: '999px' }}>Click to Fill</span>
        </div>

        {/* Tab Header */}
        <div style={{ display: 'flex', background: '#f1f5fd', borderRadius: '9px', padding: '0.25rem', marginBottom: '1.5rem', border: '1px solid #e5eeff' }}>
          <button
            onClick={() => { setIsLogin(true); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '0.55rem',
              background: isLogin ? '#1d6ae5' : 'none',
              color: isLogin ? '#fff' : '#6b7280',
              border: 'none',
              borderRadius: '7px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.88rem',
              transition: 'all 0.18s ease',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLogin(false); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '0.55rem',
              background: !isLogin ? '#1d6ae5' : 'none',
              color: !isLogin ? '#fff' : '#6b7280',
              border: 'none',
              borderRadius: '7px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.88rem',
              transition: 'all 0.18s ease',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Register
          </button>
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.4rem', color: '#111827' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.84rem', textAlign: 'center', marginBottom: '1.6rem' }}>
          {isLogin ? 'Sign in to access your orders and profile' : 'Join ShopEZ for effortless online shopping'}
        </p>

        {errorMsg && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626', padding: '0.7rem', borderRadius: '8px', fontSize: '0.84rem', marginBottom: '1.1rem', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

          {!isLogin && (
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={15} color="#9ca3af" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input"
                  style={{ paddingLeft: '2.4rem' }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} color="#9ca3af" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input"
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} color="#9ca3af" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input"
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="glass-btn-primary"
            style={{ width: '100%', padding: '0.8rem', marginTop: '0.3rem' }}
          >
            {submitting ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')} <ArrowRight size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
