import React, { useState } from 'react';
import { API_BASE_URL } from '../config/api';

export default function AdminLoginModal({ isOpen, onClose, onSuccessLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        sessionStorage.setItem('klapp_admin_token', data.token);
        sessionStorage.setItem('klapp_admin_user', data.admin.name);
        sessionStorage.setItem('klapp_admin_role', data.admin.role);
        sessionStorage.setItem('klapp_admin_avatar', data.admin.avatarRole || 'AASHISH');
        onSuccessLogin(data.admin);
        return;
      } else {
        setErrorMsg(data.error || 'Invalid credentials');
      }
    } catch (err) {
      console.warn('Backend login fallback:', err);
      const cleanU = username.trim().toLowerCase();
      const cleanP = password.trim();

      if (cleanU === 'gottiaashish' && cleanP === '04160416') {
        const admin = { name: 'Gotti Aashish', role: 'Founder & Lead Architect', avatarRole: 'AASHISH' };
        sessionStorage.setItem('klapp_admin_token', 'klapp_admin_token_04160416');
        sessionStorage.setItem('klapp_admin_user', admin.name);
        sessionStorage.setItem('klapp_admin_role', admin.role);
        sessionStorage.setItem('klapp_admin_avatar', admin.avatarRole);
        onSuccessLogin(admin);
        return;
      } else if ((cleanU === 'manashvini' || cleanU === 'minni') && cleanP === '04160416') {
        const admin = { name: 'Manashvini (Minni)', role: 'Operations Lead & Content Director', avatarRole: 'MINNI' };
        sessionStorage.setItem('klapp_admin_token', 'klapp_admin_token_minni');
        sessionStorage.setItem('klapp_admin_user', admin.name);
        sessionStorage.setItem('klapp_admin_role', admin.role);
        sessionStorage.setItem('klapp_admin_avatar', admin.avatarRole);
        onSuccessLogin(admin);
        return;
      } else {
        setErrorMsg('Invalid Username or Password');
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
          background: rgba(15, 15, 18, 0.8);
          backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: adminFadeIn 0.2s ease-out;
        }
        @keyframes adminFadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .admin-login-card {
          background: #18181b;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          width: 100%;
          max-width: 400px;
          padding: 32px 28px;
          color: #ffffff;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
          position: relative;
        }
        .close-btn-minimal {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          color: #71717a;
          font-size: 1.3rem;
          cursor: pointer;
          transition: color 0.2s ease;
          padding: 4px;
        }
        .close-btn-minimal:hover {
          color: #ffffff;
        }

        .minimal-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 6px;
          font-family: var(--font-sans, Plus Jakarta Sans, sans-serif);
        }
        .minimal-sub {
          font-size: 0.8rem;
          color: #a1a1aa;
          margin-bottom: 22px;
        }

        .role-shortcuts {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 20px;
        }
        .role-btn {
          background: #27272a;
          border: 1px solid #3f3f46;
          padding: 10px 12px;
          border-radius: 12px;
          color: #e4e4e7;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
          text-align: left;
        }
        .role-btn:hover {
          background: #3f3f46;
          border-color: #71717a;
          color: #ffffff;
        }
        .role-avatar-dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #18181b;
          color: #ffffff;
          font-weight: 800;
          font-size: 0.72rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .input-group {
          margin-bottom: 16px;
        }
        .input-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #a1a1aa;
          margin-bottom: 6px;
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .styled-input {
          width: 100%;
          background: #27272a;
          border: 1px solid #3f3f46;
          border-radius: 10px;
          padding: 12px 14px;
          color: #ffffff;
          font-family: var(--font-sans, Plus Jakarta Sans, sans-serif);
          font-size: 0.92rem;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .styled-input:focus {
          border-color: #ffffff;
        }
        .toggle-pwd-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #71717a;
          cursor: pointer;
          font-size: 1rem;
          padding: 4px;
        }
        .toggle-pwd-btn:hover {
          color: #ffffff;
        }

        .submit-btn-minimal {
          width: 100%;
          background: #ffffff;
          color: #18181b;
          border: none;
          padding: 14px;
          border-radius: 10px;
          font-family: var(--font-sans, Plus Jakarta Sans, sans-serif);
          font-weight: 700;
          font-size: 0.92rem;
          cursor: pointer;
          margin-top: 12px;
          transition: background 0.2s ease;
        }
        .submit-btn-minimal:hover {
          background: #e4e4e7;
        }

        .error-alert-box {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          padding: 10px 14px;
          color: #fca5a5;
          font-size: 0.84rem;
          margin-bottom: 16px;
        }
      `}</style>

      <div className="admin-login-card">
        <button onClick={onClose} className="close-btn-minimal" aria-label="Close">
          <i className="ri-close-line"></i>
        </button>

        <h3 className="minimal-title">KLAPP OS Sign In</h3>
        <p className="minimal-sub">Enter your credentials to access KLAPP OS</p>

        {/* 1-Click Role Quick Selectors */}
        <div className="role-shortcuts">
          <button 
            type="button" 
            className="role-btn"
            onClick={() => { setUsername('gottiaashish'); setPassword('04160416'); }}
          >
            <div className="role-avatar-dot">⚡</div>
            <div>
              <div style={{ fontWeight: '700' }}>Aashish</div>
              <div style={{ fontSize: '0.68rem', color: '#a1a1aa' }}>Founder</div>
            </div>
          </button>
          <button 
            type="button" 
            className="role-btn"
            onClick={() => { setUsername('manashvini'); setPassword('04160416'); }}
          >
            <div className="role-avatar-dot" style={{ background: '#ec4899', border: 'none' }}>✨</div>
            <div>
              <div style={{ fontWeight: '700' }}>Manashvini</div>
              <div style={{ fontSize: '0.68rem', color: '#a1a1aa' }}>Ops Lead</div>
            </div>
          </button>
        </div>

        {errorMsg && (
          <div className="error-alert-box">
            <i className="ri-error-warning-fill" style={{ marginRight: '6px' }}></i>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Username</label>
            <div className="input-wrapper">
              <input 
                type="text" 
                required 
                className="styled-input" 
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'} 
                required 
                className="styled-input" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button" 
                className="toggle-pwd-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="submit-btn-minimal">
            {loading ? 'Entering KLAPP OS...' : 'Open KLAPP OS'}
          </button>
        </form>
      </div>
    </div>
  );
}
