import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

const LoginPage = () => {
  const { login, register, guestLogin } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // login | register
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        toast.success('Welcome back! 🎉');
      } else {
        await register(form.name, form.email, form.password);
        toast.success('Account created! 🎊');
      }
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setLoading(true);
    try {
      await guestLogin();
      toast.success('Joined as Guest! 👋');
      navigate('/');
    } catch (err) {
      toast.error('Failed to continue as guest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute', top: -200, left: -200,
        width: 500, height: 500,
        background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: -100, right: -100,
        width: 400, height: 400,
        background: 'radial-gradient(circle, var(--secondary-glow) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="glass fade-in" style={{
        width: '100%', maxWidth: 420,
        borderRadius: 'var(--radius-lg)',
        padding: '40px 32px',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
          <h1 className="greeting-title" style={{ fontSize: 32, fontWeight: 700, marginBottom: 4 }}>
            <span className="gradient-text">GreetMe</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Create & share personalized greeting cards
          </p>
        </div>

        {/* Mode Toggle */}
        <div style={{
          display: 'flex',
          background: 'var(--bg)',
          borderRadius: 10,
          padding: 4,
          marginBottom: 24
        }}>
          {['login', 'register'].map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1, padding: '8px 0',
                borderRadius: 8, border: 'none',
                background: mode === m ? 'var(--gradient)' : 'transparent',
                color: mode === m ? 'white' : 'var(--text-muted)',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600, fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {m === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {mode === 'register' && (
            <div className="input-group">
              <label>Full Name</label>
              <div style={{ position: 'relative' }}>
                <FiUser style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  className="input-field"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  style={{ paddingLeft: 40 }}
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="input-field"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                style={{ paddingLeft: 40 }}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="input-field"
                name="password"
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
                style={{ paddingLeft: 40, paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{
                  position: 'absolute', right: 12, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  color: 'var(--text-muted)', cursor: 'pointer'
                }}
              >
                {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-full"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : null}
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        {/* Google (placeholder) */}
        <button
          className="btn btn-secondary btn-full"
          style={{ marginBottom: 12, justifyContent: 'center' }}
          onClick={() => toast('Google login coming soon! 🚀')}
        >
          <FcGoogle size={20} />
          Continue with Google
        </button>

        {/* Guest */}
        <button
          className="btn btn-full"
          onClick={handleGuest}
          disabled={loading}
          style={{
            background: 'transparent',
            border: '1px dashed var(--border)',
            color: 'var(--text-muted)',
            fontSize: 13,
            padding: '10px',
            justifyContent: 'center'
          }}
        >
          👤 Continue as Guest (no signup needed)
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
