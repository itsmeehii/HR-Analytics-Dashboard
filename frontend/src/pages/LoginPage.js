import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (email, password) => setForm({ email, password });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--sidebar-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)',
        top: '-100px', right: '-100px', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
        bottom: '-50px', left: '-50px', pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: 420, animation: 'fadeInUp 0.5s ease' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #f59e0b, #f97316)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', fontWeight: 800, color: '#0f1624', fontFamily: 'var(--font-display)',
            boxShadow: '0 8px 24px rgba(245,158,11,0.3)'
          }}>H</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#fff', marginBottom: 6 }}>
            HRAnalytics
          </h1>
          <p style={{ color: '#6b7e99', fontSize: '0.85rem' }}>Sign in to your dashboard</p>
        </div>

        {/* Form Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20, padding: '32px 36px',
          backdropFilter: 'blur(12px)'
        }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label style={{ color: '#8899b4' }}>Email Address</label>
              <input
                type="email" value={form.email} placeholder="you@hranalytics.com"
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              />
            </div>
            <div className="form-group">
              <label style={{ color: '#8899b4' }}>Password</label>
              <input
                type="password" value={form.password} placeholder="••••••••"
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem', marginTop: 8 }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: '0.72rem', color: '#4a5a72', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, fontWeight: 700 }}>
              Demo Credentials
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => quickFill('admin@hranalytics.com', 'admin123')}
                style={{
                  flex: 1, padding: '8px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(245,158,11,0.1)', color: '#f59e0b', fontSize: '0.75rem',
                  cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600
                }}>
                👑 Admin
              </button>
              <button onClick={() => quickFill('hr@hranalytics.com', 'hr123456')}
                style={{
                  flex: 1, padding: '8px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(59,130,246,0.1)', color: '#3b82f6', fontSize: '0.75rem',
                  cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600
                }}>
                👤 HR Manager
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
