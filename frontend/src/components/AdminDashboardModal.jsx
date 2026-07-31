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
      setError('Could not connect to backend server. Make sure node server is running.');
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
          color: #f4f4f5;
          font-family: var(--font-sans, system-ui, sans-serif);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* Top Admin Bar */
        .admin-topbar {
          background: #18181b;
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
          padding: 3px 8px;
          border-radius: 999px;
          text-transform: uppercase;
        }

        /* Metrics Row */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          padding: 24px 32px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .metric-card {
          background: #18181b;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          padding: 20px;
        }
        .metric-label {
          font-size: 0.78rem;
          color: #a1a1aa;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 6px;
        }
        .metric-value {
          font-size: 1.8rem;
          font-weight: 800;
          color: #ffffff;
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
          background: #121215;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .search-box {
          background: #27272a;
          border: 1px solid #3f3f46;
          border-radius: 10px;
          padding: 10px 16px;
          color: #ffffff;
          outline: none;
          font-size: 0.88rem;
          width: 320px;
        }
        .status-tab {
          background: transparent;
          border: 1px solid transparent;
          color: #a1a1aa;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .status-tab.active {
          background: #27272a;
          border-color: #3f3f46;
          color: #ffffff;
        }

        /* Main Inquiry Feed */
        .feed-area {
          flex: 1;
          overflow-y: auto;
          padding: 24px 32px;
        }
        .inquiry-card {
          background: #18181b;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 16px;
          transition: border-color 0.2s ease;
        }
        .inquiry-card:hover {
          border-color: rgba(255, 255, 255, 0.25);
        }
        .badge-status {
          font-size: 0.72rem;
          font-family: var(--font-mono, monospace);
          padding: 4px 10px;
          border-radius: 999px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .status-NEW { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4); }
        .status-CONTACTED { background: rgba(234, 179, 8, 0.2); color: #facc15; border: 1px solid rgba(234, 179, 8, 0.4); }
        .status-IN_PROGRESS { background: rgba(168, 85, 247, 0.2); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.4); }
        .status-CLOSED { background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.4); }

        .btn-action {
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px solid #3f3f46;
          background: #27272a;
          color: #ffffff;
          font-size: 0.82rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          transition: background 0.2s ease;
        }
        .btn-action:hover {
          background: #3f3f46;
        }
        .btn-whatsapp {
          background: #15803d;
          border-color: #166534;
          color: #ffffff;
        }
        .btn-whatsapp:hover {
          background: #166534;
        }
      `}</style>

      {/* Top Header */}
      <div className="admin-topbar">
        <div className="admin-brand">
          <div className="admin-title">KLAPP DEVELOPERS</div>
          <span className="admin-tag"><i className="ri-shield-check-fill"></i> Founder CRM</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
            Welcome, <strong style={{ color: '#fff' }}>Gotti Aashish</strong>
          </span>
          
          <button onClick={fetchInquiries} className="btn-action" title="Refresh leads">
            <i className="ri-refresh-line"></i> Refresh
          </button>

          <button onClick={onLogout} className="btn-action" style={{ background: '#ef4444', borderColor: '#dc2626' }}>
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
          <div className="metric-label">Total Inquiries</div>
          <div className="metric-value">{metrics.total}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label" style={{ color: '#60a5fa' }}>New Unread Leads</div>
          <div className="metric-value" style={{ color: '#60a5fa' }}>{metrics.newLeads}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label" style={{ color: '#facc15' }}>Contacted Leads</div>
          <div className="metric-value" style={{ color: '#facc15' }}>{metrics.contacted}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label" style={{ color: '#4ade80' }}>Closed Deals</div>
          <div className="metric-value" style={{ color: '#4ade80' }}>{metrics.closed}</div>
        </div>
      </div>

      {/* Controls Row */}
      <div className="controls-row">
        <input 
          type="text" 
          className="search-box" 
          placeholder="Search by client name, email, service..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div style={{ display: 'flex', gap: '8px' }}>
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
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#a1a1aa' }}>
            <i className="ri-loader-4-line ri-spin" style={{ fontSize: '2rem', display: 'block', marginBottom: '12px' }}></i>
            Loading client inquiries...
          </div>
        ) : error ? (
          <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', padding: '24px', textAlign: 'center', color: '#fca5a5', maxWidth: '600px', margin: '40px auto' }}>
            <i className="ri-error-warning-fill" style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}></i>
            {error}
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#71717a' }}>
            <i className="ri-inbox-line" style={{ fontSize: '3rem', display: 'block', marginBottom: '12px' }}></i>
            <h4 style={{ fontSize: '1.2rem', color: '#a1a1aa', marginBottom: '4px' }}>No Inquiries Found</h4>
            <p style={{ fontSize: '0.9rem' }}>When clients fill out the contact form, their details will appear here instantly.</p>
          </div>
        ) : (
          filteredInquiries.map(inq => {
            // Clean phone or email for WhatsApp
            const cleanContact = inq.email.replace(/[^0-9]/g, '');
            const isPhone = cleanContact.length >= 10;
            const waUrl = isPhone 
              ? `https://wa.me/${cleanContact}?text=${encodeURIComponent(`Hi ${inq.name}, I am Gotti Aashish from KLAPP Developers! Thank you for inquiring about ${inq.service}. I would love to discuss your project!`)}`
              : `https://wa.me/917989033580?text=${encodeURIComponent(`Reaching out to ${inq.name} (${inq.email}) regarding ${inq.service}`)}`;

            return (
              <div key={inq.id} className="inquiry-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff' }}>{inq.name}</h4>
                      <span className={`badge-status status-${inq.status}`}>{inq.status}</span>
                    </div>
                    <div style={{ fontSize: '0.88rem', color: '#a1a1aa', fontFamily: 'var(--font-mono, monospace)' }}>
                      <i className="ri-contacts-line" style={{ marginRight: '6px' }}></i> {inq.email}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#71717a', fontFamily: 'var(--font-mono, monospace)' }}>
                    {new Date(inq.createdAt).toLocaleString()}
                  </div>
                </div>

                <div style={{ background: '#27272a', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', fontFamily: 'var(--font-mono, monospace)' }}>
                    Service Requested: <strong style={{ color: '#38bdf8' }}>{inq.service}</strong>
                  </div>
                  <p style={{ color: '#e4e4e7', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
                    "{inq.message}"
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-action btn-whatsapp">
                      <i className="ri-whatsapp-fill"></i> WhatsApp Client
                    </a>

                    <a href={`mailto:${inq.email}`} className="btn-action">
                      <i className="ri-mail-line"></i> Email Client
                    </a>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>Update Status:</span>
                    <select 
                      value={inq.status} 
                      onChange={(e) => handleUpdateStatus(inq.id, e.target.value)}
                      style={{
                        background: '#27272a',
                        border: '1px solid #3f3f46',
                        color: '#ffffff',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        outline: none
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
