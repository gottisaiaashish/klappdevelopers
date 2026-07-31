import React, { useState } from 'react';

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
          background: rgba(12, 12, 15, 0.78);
          backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: adminModalScale 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes adminModalScale {
          from { opacity: 0; transform: scale(0.94) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .admin-login-card {
          background: #18181b;
          background-image: 
            radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.08) 0%, transparent 60%),
            linear-gradient(180deg, #18181b 0%, #111113 100%);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 24px;
          width: 100%;
          max-width: 440px;
          padding: 40px 36px;
          color: #ffffff;
          box-shadow: 
            0 30px 80px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(255, 255, 255, 0.05);
          position: relative;
          overflow: hidden;
        }
        .admin-login-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 15%;
          right: 15%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        }

        .close-btn-round {
          position: absolute;
          top: 24px;
          right: 24px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #a1a1aa;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.2s ease;
        }
        .close-btn-round:hover {
          background: #ffffff;
          color: #18181b;
          transform: rotate(90deg);
        }

        .brand-header-box {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        .brand-logo-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: #ffffff;
          padding: 6px;
          object-fit: contain;
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.15);
        }
        .admin-security-tag {
          font-family: var(--font-mono, monospace);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: #22c55e;
          text-transform: uppercase;
          background: rgba(34, 197, 94, 0.12);
          border: 1px solid rgba(34, 197, 94, 0.3);
          padding: 4px 10px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .login-title {
          font-family: var(--font-serif, Georgia, serif);
          font-size: 2rem;
          font-weight: 700;
          line-height: 1.15;
          margin-bottom: 8px;
          color: #ffffff;
          letter-spacing: -0.02em;
        }
        .serif-italic {
          font-style: italic;
          font-weight: 400;
          color: #d4d4d8;
        }

        .login-subtitle {
          color: #a1a1aa;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 28px;
        }

        .input-group {
          margin-bottom: 20px;
        }
        .input-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #d4d4d8;
          margin-bottom: 8px;
          letter-spacing: 0.02em;
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 16px;
          color: #71717a;
          font-size: 1.1rem;
          pointer-events: none;
        }
        .styled-input {
          width: 100%;
          background: rgba(39, 39, 42, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 14px 16px 14px 44px;
          color: #ffffff;
          font-family: var(--font-sans, system-ui, sans-serif);
          font-size: 0.95rem;
          outline: none;
          transition: all 0.2s ease;
        }
        .styled-input:focus {
          border-color: #ffffff;
          background: #27272a;
          box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.08);
        }
        .toggle-pwd-btn {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          color: #71717a;
          cursor: pointer;
          font-size: 1.1rem;
          padding: 4px;
          transition: color 0.2s ease;
        }
        .toggle-pwd-btn:hover {
          color: #ffffff;
        }

        .submit-btn-luxury {
          width: 100%;
          background: #ffffff;
          color: #18181b;
          border: none;
          padding: 16px;
          border-radius: 12px;
          font-family: var(--font-sans, system-ui, sans-serif);
          font-weight: 700;
          font-size: 0.98rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 8px 24px rgba(255, 255, 255, 0.12);
          margin-top: 28px;
        }
        .submit-btn-luxury:hover {
          background: #f4f4f5;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(255, 255, 255, 0.2);
        }
        .submit-btn-luxury:active {
          transform: translateY(0);
        }

        .error-alert-box {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 10px;
          padding: 12px 16px;
          color: #fca5a5;
          font-size: 0.86rem;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>

      <div className="admin-login-card">
        <button onClick={onClose} className="close-btn-round" aria-label="Close modal">
          <i className="ri-close-line"></i>
        </button>

        <div className="brand-header-box">
          <img 
            src="/logo.png" 
            alt="KLAPP Logo" 
            className="brand-logo-icon" 
            onError={(e) => { e.target.style.display = 'none'; }} 
          />
          <div className="admin-security-tag">
            <i className="ri-shield-keyhole-fill"></i> Founder Portal
          </div>
        </div>

        <h3 className="login-title">
          Founder Portal <span className="serif-italic">Access</span>
        </h3>
        <p className="login-subtitle">
          Enter founder credentials to view and manage client inquiries in real time.
        </p>

        {errorMsg && (
          <div className="error-alert-box">
            <i className="ri-error-warning-fill" style={{ fontSize: '1.1rem' }}></i>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Founder Username</label>
            <div className="input-wrapper">
              <i className="ri-user-3-line input-icon"></i>
              <input 
                type="text" 
                required 
                className="styled-input" 
                placeholder="Username (e.g. gottiaashish)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-wrapper">
              <i className="ri-lock-2-line input-icon"></i>
              <input 
                type={showPassword ? 'text' : 'password'} 
                required 
                className="styled-input" 
                placeholder="••••••••"
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

          <button type="submit" disabled={loading} className="submit-btn-luxury">
            {loading ? (
              <>
                <i className="ri-loader-4-line ri-spin"></i> Authenticating...
              </>
            ) : (
              <>
                Access Founder Dashboard <i className="ri-arrow-right-line"></i>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
