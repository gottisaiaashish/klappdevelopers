import React, { useState, useEffect } from 'react';

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
      const res = await fetch(`/api/admin/inquiries?token=${token}`, {
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
        const fRes = await fetch(`/api/inquiry?admin_key=klapp_admin_secret_2026`);
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
      setError('Could not connect to backend server. Make sure Node backend server is running.');
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
      const res = await fetch(`/api/admin/inquiry/${id}`, {
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
      const res = await fetch(`/api/admin/inquiry/${id}`, {
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
          background: #0f0f12;
          background-image: 
            radial-gradient(#27272a 0.75px, transparent 0.75px),
            radial-gradient(#27272a 0.75px, #0f0f12 0.75px);
          background-size: 30px 30px;
          background-position: 0 0, 15px 15px;
          color: #f4f4f5;
          font-family: var(--font-sans, system-ui, sans-serif);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUpFull 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Top Admin Bar */
        .admin-topbar {
          background: rgba(24, 24, 27, 0.94);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #ffffff;
          padding: 5px;
          object-fit: contain;
        }
        .admin-title {
          font-weight: 800;
          font-size: 1.1rem;
          letter-spacing: 0.12em;
          color: #ffffff;
        }
        .admin-tag {
          font-family: var(--font-mono, monospace);
          font-size: 0.7rem;
          color: #22c55e;
          background: rgba(34, 197, 94, 0.12);
          border: 1px solid rgba(34, 197, 94, 0.3);
          padding: 4px 10px;
          border-radius: 999px;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        /* Metrics Row */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          padding: 24px 32px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
        }
        .metric-card {
          background: #18181b;
          background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          padding: 20px 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .metric-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .metric-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .metric-label {
          font-size: 0.78rem;
          color: #a1a1aa;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-family: var(--font-mono, monospace);
        }
        .metric-icon-box {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }
        .metric-value {
          font-size: 2rem;
          font-weight: 800;
          color: #ffffff;
          font-family: var(--font-mono, monospace);
        }

        /* Filter Controls */
        .controls-row {
          padding: 18px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          background: rgba(18, 18, 21, 0.8);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
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
          color: #71717a;
          font-size: 1rem;
        }
        .search-box {
          background: #27272a;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 10px 16px 10px 40px;
          color: #ffffff;
          outline: none;
          font-size: 0.88rem;
          width: 340px;
          transition: all 0.2s ease;
        }
        .search-box:focus {
          border-color: #ffffff;
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.08);
        }
        .status-tab {
          background: transparent;
          border: 1px solid transparent;
          color: #a1a1aa;
          padding: 8px 16px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .status-tab.active {
          background: #ffffff;
          color: #18181b;
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.15);
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
          background: #18181b;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 20px;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
          transition: all 0.25s ease;
        }
        .inquiry-card:hover {
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
        }
        .client-avatar {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: linear-gradient(135deg, #3f3f46 0%, #18181b 100%);
          border: 1px solid rgba(255, 255, 255, 0.15);
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
        .status-NEW { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4); }
        .status-CONTACTED { background: rgba(234, 179, 8, 0.15); color: #facc15; border: 1px solid rgba(234, 179, 8, 0.4); }
        .status-IN_PROGRESS { background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.4); }
        .status-CLOSED { background: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.4); }

        .btn-action {
          padding: 10px 16px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: #27272a;
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
        .btn-action:hover {
          background: #3f3f46;
          border-color: #52525b;
        }
        .btn-whatsapp {
          background: #15803d;
          border-color: #166534;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(21, 128, 61, 0.25);
        }
        .btn-whatsapp:hover {
          background: #166534;
          box-shadow: 0 6px 16px rgba(21, 128, 61, 0.4);
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
          <div>
            <div className="admin-title">KLAPP DEVELOPERS</div>
          </div>
          <span className="admin-tag"><i className="ri-shield-check-fill"></i> Founder CRM</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', padding: '6px 14px', borderRadius: '999px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
            <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
              Founder: <strong style={{ color: '#fff' }}>Gotti Aashish</strong>
            </span>
          </div>

          <button onClick={fetchInquiries} className="btn-action" title="Refresh leads">
            <i className="ri-refresh-line"></i> Refresh
          </button>

          <button onClick={onLogout} className="btn-action" style={{ background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#fca5a5' }}>
            <i className="ri-logout-box-r-line"></i> Logout
          </button>

          <button onClick={onClose} className="btn-action">
            <i className="ri-close-line"></i> Close
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Total Inquiries</span>
            <div className="metric-icon-box" style={{ color: '#ffffff' }}><i className="ri-bar-chart-fill"></i></div>
          </div>
          <div className="metric-value">{metrics.total}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label" style={{ color: '#60a5fa' }}>New Unread Leads</span>
            <div className="metric-icon-box" style={{ color: '#60a5fa', background: 'rgba(59, 130, 246, 0.1)' }}><i className="ri-notification-3-line"></i></div>
          </div>
          <div className="metric-value" style={{ color: '#60a5fa' }}>{metrics.newLeads}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label" style={{ color: '#facc15' }}>Contacted Leads</span>
            <div className="metric-icon-box" style={{ color: '#facc15', background: 'rgba(234, 179, 8, 0.1)' }}><i className="ri-chat-check-line"></i></div>
          </div>
          <div className="metric-value" style={{ color: '#facc15' }}>{metrics.contacted}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label" style={{ color: '#4ade80' }}>Closed Deals</span>
            <div className="metric-icon-box" style={{ color: '#4ade80', background: 'rgba(34, 197, 94, 0.1)' }}><i className="ri-checkbox-circle-fill"></i></div>
          </div>
          <div className="metric-value" style={{ color: '#4ade80' }}>{metrics.closed}</div>
        </div>
      </div>

      {/* Controls Row */}
      <div className="controls-row">
        <div className="search-wrapper">
          <i className="ri-search-line search-icon"></i>
          <input 
            type="text" 
            className="search-box" 
            placeholder="Search leads by name, contact, service..."
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
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#a1a1aa' }}>
            <i className="ri-loader-4-line ri-spin" style={{ fontSize: '2.4rem', display: 'block', marginBottom: '14px', color: '#ffffff' }}></i>
            Loading client inquiries...
          </div>
        ) : error ? (
          <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '16px', padding: '28px', textAlign: 'center', color: '#fca5a5', maxWidth: '600px', margin: '40px auto' }}>
            <i className="ri-error-warning-fill" style={{ fontSize: '2.4rem', display: 'block', marginBottom: '10px' }}></i>
            {error}
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '90px 0', color: '#71717a' }}>
            <i className="ri-inbox-archive-line" style={{ fontSize: '3.5rem', display: 'block', marginBottom: '14px', color: '#3f3f46' }}></i>
            <h4 style={{ fontSize: '1.25rem', color: '#a1a1aa', marginBottom: '6px' }}>No Client Inquiries Found</h4>
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
                        <h4 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>{inq.name}</h4>
                        <span className={`badge-status status-${inq.status}`}>{inq.status}</span>
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#a1a1aa', fontFamily: 'var(--font-mono, monospace)' }}>
                        <i className="ri-contacts-line" style={{ marginRight: '6px', color: '#71717a' }}></i> {inq.email}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#71717a', fontFamily: 'var(--font-mono, monospace)', background: 'rgba(255, 255, 255, 0.04)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <i className="ri-time-line" style={{ marginRight: '6px' }}></i>
                    {new Date(inq.createdAt).toLocaleString()}
                  </div>
                </div>

                <div style={{ background: '#27272a', borderRadius: '14px', padding: '20px', marginBottom: '24px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', fontFamily: 'var(--font-mono, monospace)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="ri-stack-line" style={{ color: '#38bdf8' }}></i>
                    SERVICE REQUIRED: <strong style={{ color: '#38bdf8' }}>{inq.service}</strong>
                  </div>
                  <p style={{ color: '#f4f4f5', fontSize: '0.95rem', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>
                    "{inq.message}"
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-action btn-whatsapp">
                      <i className="ri-whatsapp-fill" style={{ fontSize: '1.1rem' }}></i> WhatsApp Client
                    </a>

                    <a href={`mailto:${inq.email}`} className="btn-action">
                      <i className="ri-mail-send-line" style={{ fontSize: '1.05rem' }}></i> Email Client
                    </a>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.82rem', color: '#a1a1aa' }}>Status:</span>
                    <select 
                      value={inq.status} 
                      onChange={(e) => handleUpdateStatus(inq.id, e.target.value)}
                      style={{
                        background: '#27272a',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#ffffff',
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

                    <button onClick={() => handleDeleteInquiry(inq.id)} className="btn-action" style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }} title="Delete Inquiry">
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
