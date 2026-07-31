import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

export default function AdminDashboardModal({ isOpen, onClose, onLogout }) {
  const [inquiries, setInquiries] = useState([]);
  const [metrics, setMetrics] = useState({ total: 0, newLeads: 0, contacted: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchInquiries = async () => {
    setLoading(true);
    setError('');
    const token = sessionStorage.getItem('klapp_admin_token') || 'klapp_admin_token_04160416';

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/inquiries?token=${token}`, {
        headers: { 'x-admin-token': token }
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setInquiries(data.inquiries || []);
        if (data.metrics) {
          setMetrics(data.metrics);
        } else {
          calculateMetrics(data.inquiries || []);
        }
      } else {
        // Fallback: try standard inquiry route with admin key
        const fRes = await fetch(`${API_BASE_URL}/api/inquiry?admin_key=klapp_admin_secret_2026`);
        const fData = await fRes.json();
        if (fRes.ok && fData.success) {
          setInquiries(fData.inquiries || []);
          calculateMetrics(fData.inquiries || []);
        } else {
          setError(data.error || 'Failed to fetch inquiries.');
        }
      }
    } catch (err) {
      console.error('Error fetching admin inquiries:', err);
      setError(`Could not connect to backend server. On Render free tier, server spins down with inactivity (~20s wake up time). Please click Refresh in 15 seconds!`);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (list) => {
    setMetrics({
      total: list.length,
      newLeads: list.filter(i => i.status === 'NEW').length,
      contacted: list.filter(i => i.status === 'CONTACTED').length,
      closed: list.filter(i => i.status === 'CLOSED').length
    });
  };

  useEffect(() => {
    if (isOpen) {
      fetchInquiries();
    }
  }, [isOpen]);

  const handleUpdateStatus = async (id, newStatus) => {
    const token = sessionStorage.getItem('klapp_admin_token') || 'klapp_admin_token_04160416';
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/inquiry/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
        calculateMetrics(inquiries.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    const token = sessionStorage.getItem('klapp_admin_token') || 'klapp_admin_token_04160416';
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/inquiry/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const filtered = inquiries.filter(inq => inq.id !== id);
        setInquiries(filtered);
        calculateMetrics(filtered);
      }
    } catch (err) {
      console.error('Failed to delete inquiry:', err);
    }
  };

  // Filtered Inquiries
  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = 
      inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!isOpen) return null;

  return (
    <div className="admin-dashboard-overlay">
      <style>{`
        .admin-dashboard-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 999999;
          background-color: var(--bg-primary, #f4f1ea);
          background-image: 
            radial-gradient(#d5d0c4 0.75px, transparent 0.75px),
            radial-gradient(#d5d0c4 0.75px, #f4f1ea 0.75px);
          background-size: 30px 30px;
          background-position: 0 0, 15px 15px;
          color: var(--text-primary, #18181b);
          font-family: var(--font-sans, system-ui, sans-serif);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUpFull 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Top Bar matching website header */
        .admin-topbar {
          background: rgba(244, 241, 234, 0.94);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-color, #e4e0d7);
          padding: 16px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        .admin-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .admin-brand-logo {
          height: 32px;
          width: auto;
          object-fit: contain;
        }
        .admin-title {
          font-family: var(--font-sans);
          font-weight: 800;
          font-size: 1.1rem;
          letter-spacing: 0.12em;
          color: #18181b;
          text-transform: uppercase;
        }
        .admin-tag {
          font-family: var(--font-mono, monospace);
          font-size: 0.7rem;
          color: #18181b;
          background: #eae6dd;
          border: 1px solid #d4d0c5;
          padding: 4px 10px;
          border-radius: 999px;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
        }

        /* Metrics Row */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          padding: 24px 32px;
          border-bottom: 1px solid var(--border-color, #e4e0d7);
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
        }
        .metric-card {
          background: #ffffff;
          border: 1px solid var(--border-color, #e4e0d7);
          border-radius: 16px;
          padding: 20px 24px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
          transition: transform 0.2s ease;
        }
        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }
        .metric-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .metric-label {
          font-size: 0.76rem;
          color: var(--text-muted, #71717a);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-family: var(--font-mono, monospace);
          font-weight: 600;
        }
        .metric-icon-box {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #f4f1ea;
          color: #18181b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.05rem;
        }
        .metric-value {
          font-size: 2rem;
          font-weight: 800;
          color: #18181b;
          font-family: var(--font-mono, monospace);
        }

        /* Filter Controls */
        .controls-row {
          padding: 16px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          background: rgba(244, 241, 234, 0.8);
          border-bottom: 1px solid var(--border-color, #e4e0d7);
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
        }
        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted, #71717a);
          font-size: 1rem;
        }
        .search-box {
          background: #ffffff;
          border: 1px solid var(--border-color, #e4e0d7);
          border-radius: 10px;
          padding: 10px 16px 10px 40px;
          color: #18181b;
          outline: none;
          font-size: 0.88rem;
          width: 340px;
          transition: all 0.2s ease;
          font-family: var(--font-sans);
        }
        .search-box:focus {
          border-color: #18181b;
        }
        .status-tab {
          background: #ffffff;
          border: 1px solid var(--border-color, #e4e0d7);
          color: var(--text-secondary, #52525b);
          padding: 8px 18px;
          border-radius: 999px;
          cursor: pointer;
          font-size: 0.82rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .status-tab.active {
          background: #18181b;
          border-color: #18181b;
          color: #ffffff;
        }

        /* Main Inquiry Feed */
        .feed-area {
          flex: 1;
          overflow-y: auto;
          padding: 28px 32px 60px 32px;
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
        }
        .inquiry-card {
          background: #ffffff;
          border: 1px solid var(--border-color, #e4e0d7);
          border-radius: 18px;
          padding: 28px;
          margin-bottom: 20px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
          transition: all 0.2s ease;
        }
        .inquiry-card:hover {
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.06);
          border-color: #d4d0c5;
        }
        .client-avatar {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #18181b;
          color: #ffffff;
          font-weight: 800;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .badge-status {
          font-size: 0.72rem;
          font-family: var(--font-mono, monospace);
          padding: 4px 12px;
          border-radius: 999px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .status-NEW { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
        .status-CONTACTED { background: #fef9c3; color: #a16207; border: 1px solid #fef08a; }
        .status-IN_PROGRESS { background: #f3e8ff; color: #7e22ce; border: 1px solid #e9d5ff; }
        .status-CLOSED { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }

        .btn-action-brand {
          padding: 10px 18px;
          border-radius: 10px;
          border: 1px solid #18181b;
          background: #18181b;
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .btn-action-brand:hover {
          background: #27272a;
        }
        .btn-action-outline {
          padding: 10px 18px;
          border-radius: 10px;
          border: 1px solid var(--border-color, #e4e0d7);
          background: #ffffff;
          color: #18181b;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .btn-action-outline:hover {
          background: #f4f1ea;
        }
      `}</style>

      {/* Top Header */}
      <div className="admin-topbar">
        <div className="admin-brand">
          <img 
            src="/logo.png" 
            alt="KLAPP" 
            className="admin-brand-logo" 
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="admin-title">KLAPP DEVELOPERS</div>
          <span className="admin-tag"><i className="ri-shield-check-line"></i> Founder CRM</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', padding: '6px 14px', borderRadius: '999px', border: '1px solid #e4e0d7' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
            <span style={{ fontSize: '0.85rem', color: '#52525b' }}>
              Founder: <strong style={{ color: '#18181b' }}>Gotti Aashish</strong>
            </span>
          </div>

          <button onClick={fetchInquiries} className="btn-action-brand" title="Refresh leads">
            <i className="ri-refresh-line"></i> Refresh
          </button>

          <button onClick={onLogout} className="btn-action-outline" style={{ color: '#dc2626', borderColor: '#fca5a5' }}>
            <i className="ri-logout-box-r-line"></i> Logout
          </button>

          <button onClick={onClose} className="btn-action-outline">
            <i className="ri-close-line"></i> Close
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Total Inquiries</span>
            <div className="metric-icon-box"><i className="ri-bar-chart-line"></i></div>
          </div>
          <div className="metric-value">{metrics.total}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">New Unread Leads</span>
            <div className="metric-icon-box"><i className="ri-notification-3-line"></i></div>
          </div>
          <div className="metric-value">{metrics.newLeads}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Contacted Leads</span>
            <div className="metric-icon-box"><i className="ri-chat-check-line"></i></div>
          </div>
          <div className="metric-value">{metrics.contacted}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Closed Deals</span>
            <div className="metric-icon-box"><i className="ri-checkbox-circle-line"></i></div>
          </div>
          <div className="metric-value">{metrics.closed}</div>
        </div>
      </div>

      {/* Controls Row */}
      <div className="controls-row">
        <div className="search-wrapper">
          <i className="ri-search-line search-icon"></i>
          <input 
            type="text" 
            className="search-box" 
            placeholder="Search leads by client name, email, service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['ALL', 'NEW', 'CONTACTED', 'IN_PROGRESS', 'CLOSED'].map(status => (
            <button 
              key={status}
              className={`status-tab ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Inquiry Feed */}
      <div className="feed-area">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#71717a' }}>
            <i className="ri-loader-4-line ri-spin" style={{ fontSize: '2.4rem', display: 'block', marginBottom: '14px', color: '#18181b' }}></i>
            Loading client inquiries...
          </div>
        ) : error ? (
          <div style={{ background: '#ffffff', border: '1px solid #e4e0d7', borderRadius: '16px', padding: '32px', textAlign: 'center', color: '#18181b', maxWidth: '600px', margin: '40px auto', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
            <i className="ri-information-line" style={{ fontSize: '2.4rem', display: 'block', marginBottom: '10px', color: '#71717a' }}></i>
            <h4 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>Backend Connection Note</h4>
            <p style={{ color: '#52525b', fontSize: '0.9rem', lineHeight: '1.6' }}>{error}</p>
            <button onClick={fetchInquiries} className="btn-action-brand" style={{ marginTop: '16px' }}>
              <i className="ri-refresh-line"></i> Retry Connection
            </button>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '90px 0', color: '#71717a' }}>
            <i className="ri-inbox-archive-line" style={{ fontSize: '3.5rem', display: 'block', marginBottom: '14px', color: '#a1a1aa' }}></i>
            <h4 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: '#18181b', marginBottom: '6px' }}>No Client Inquiries Found</h4>
            <p style={{ fontSize: '0.9rem', color: '#71717a' }}>When clients submit the contact form, their leads will appear here in real-time.</p>
          </div>
        ) : (
          filteredInquiries.map(inq => {
            const cleanContact = inq.email.replace(/[^0-9]/g, '');
            const isPhone = cleanContact.length >= 10;
            const waUrl = isPhone 
              ? `https://wa.me/${cleanContact}?text=${encodeURIComponent(`Hi ${inq.name}, I am Gotti Aashish from KLAPP Developers! Thank you for inquiring about ${inq.service}. I would love to discuss your project!`)}`
              : `https://wa.me/917989033580?text=${encodeURIComponent(`Hi Gotti Aashish, following up on client inquiry from ${inq.name} (${inq.email}) regarding ${inq.service}`)}`;

            const initialLetter = inq.name ? inq.name.charAt(0).toUpperCase() : 'C';

            return (
              <div key={inq.id} className="inquiry-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div className="client-avatar">{initialLetter}</div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '4px' }}>
                        <h4 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-serif)', fontWeight: '700', color: '#18181b', margin: 0 }}>{inq.name}</h4>
                        <span className={`badge-status status-${inq.status}`}>{inq.status}</span>
                      </div>
                      <div style={{ fontSize: '0.88rem', color: '#71717a', fontFamily: 'var(--font-mono, monospace)' }}>
                        <i className="ri-contacts-line" style={{ marginRight: '6px', color: '#a1a1aa' }}></i> {inq.email}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#71717a', fontFamily: 'var(--font-mono, monospace)', background: '#f4f1ea', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e4e0d7' }}>
                    <i className="ri-time-line" style={{ marginRight: '6px' }}></i>
                    {new Date(inq.createdAt).toLocaleString()}
                  </div>
                </div>

                <div style={{ background: '#fcfbf9', borderRadius: '12px', padding: '20px', marginBottom: '24px', border: '1px solid #e4e0d7' }}>
                  <div style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', fontFamily: 'var(--font-mono, monospace)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="ri-stack-line" style={{ color: '#18181b' }}></i>
                    SERVICE REQUIRED: <strong style={{ color: '#18181b' }}>{inq.service}</strong>
                  </div>
                  <p style={{ color: '#18181b', fontSize: '0.95rem', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>
                    "{inq.message}"
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', paddingTop: '12px', borderTop: '1px solid #e4e0d7' }}>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-action-brand">
                      <i className="ri-whatsapp-fill" style={{ color: '#22c55e', fontSize: '1.1rem' }}></i> WhatsApp Client
                    </a>

                    <a href={`mailto:${inq.email}`} className="btn-action-outline">
                      <i className="ri-mail-send-line" style={{ fontSize: '1.05rem' }}></i> Email Client
                    </a>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.82rem', color: '#71717a', fontWeight: '600' }}>Status:</span>
                    <select 
                      value={inq.status} 
                      onChange={(e) => handleUpdateStatus(inq.id, e.target.value)}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e4e0d7',
                        color: '#18181b',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>

                    <button onClick={() => handleDeleteInquiry(inq.id)} className="btn-action-outline" style={{ color: '#dc2626', borderColor: '#fca5a5' }} title="Delete Inquiry">
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
