import React, { useState } from 'react';

export default function AdminLoginModal({ isOpen, onClose, onSuccessLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Try Backend API login
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        sessionStorage.setItem('klapp_admin_token', data.token);
        sessionStorage.setItem('klapp_admin_user', data.admin.name);
        onSuccessLogin();
        return;
      } else {
        setErrorMsg(data.error || 'Invalid credentials');
      }
    } catch (err) {
      console.warn('Backend login fallback to direct credentials check:', err);
      // 2. Direct client verification fallback for local dev / offline
      if (username.trim() === 'gottiaashish' && password.trim() === '04160416') {
        sessionStorage.setItem('klapp_admin_token', 'klapp_admin_token_04160416');
        sessionStorage.setItem('klapp_admin_user', 'Gotti Aashish');
        onSuccessLogin();
        return;
      } else {
        setErrorMsg('Invalid Username or Password! Access Denied.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-overlay">
      <style>{`
        .admin-login-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 999999;
          background: rgba(15, 15, 18, 0.85);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.25s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .admin-login-card {
          background: #18181b;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          width: 100%;
          max-width: 440px;
          padding: 36px;
          color: #ffffff;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
          position: relative;
        }
        .admin-login-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #4ade80;
          font-family: var(--font-mono, monospace);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          padding: 4px 10px;
          border-radius: 999px;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .admin-input-group {
          margin-bottom: 20px;
        }
        .admin-label {
          display: block;
          font-size: 0.82rem;
          color: #a1a1aa;
          font-weight: 500;
          margin-bottom: 8px;
        }
        .admin-input {
          width: 100%;
          background: #27272a;
          border: 1px solid #3f3f46;
          border-radius: 10px;
          padding: 14px 16px;
          color: #ffffff;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .admin-input:focus {
          border-color: #e4e4e7;
        }
        .admin-submit-btn {
          width: 100%;
          background: #ffffff;
          color: #18181b;
          border: none;
          padding: 14px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .admin-submit-btn:hover {
          background: #e4e4e7;
        }
      `}</style>

      <div className="admin-login-card">
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#a1a1aa',
            fontSize: '1.4rem',
            cursor: 'pointer'
          }}
        >
          <i className="ri-close-line"></i>
        </button>

        <div className="admin-login-badge">
          <i className="ri-shield-keyhole-line"></i> Restricted Access
        </div>

        <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif, serif)', marginBottom: '8px', color: '#fff' }}>
          Founder Portal Login
        </h3>
        <p style={{ color: '#a1a1aa', fontSize: '0.88rem', marginBottom: '24px', lineHeight: '1.5' }}>
          Enter founder credentials to access client inquiries & leads dashboard.
        </p>

        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '8px', padding: '12px', color: '#fca5a5', fontSize: '0.85rem', marginBottom: '20px' }}>
            <i className="ri-error-warning-fill" style={{ marginRight: '6px' }}></i> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="admin-input-group">
            <label className="admin-label">Username</label>
            <input 
              type="text" 
              required 
              className="admin-input" 
              placeholder="e.g. gottiaashish"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>

          <div className="admin-input-group">
            <label className="admin-label">Password</label>
            <input 
              type="password" 
              required 
              className="admin-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className="admin-submit-btn">
            {loading ? 'Authenticating...' : 'Access Dashboard'} <i className="ri-arrow-right-line" style={{ marginLeft: '6px' }}></i>
          </button>
        </form>
      </div>
    </div>
  );
}
