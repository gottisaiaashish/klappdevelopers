import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

export default function AdminDashboardModal({ isOpen, onClose, onLogout }) {
  const [activeTab, setActiveTab] = useState('inquiries'); // 'inquiries', 'addLead', 'calculator', 'notes'
  const [inquiries, setInquiries] = useState([]);
  const [metrics, setMetrics] = useState({ total: 0, newLeads: 0, contacted: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Manual Lead Form State
  const [manualLead, setManualLead] = useState({
    name: '',
    email: '',
    service: 'Website Development',
    message: ''
  });

  // Agency Proposal Calculator State
  const [calcService, setCalcService] = useState('Starter Web App');
  const [calcBudget, setCalcBudget] = useState(30000);
  const [calcAddonWhatsapp, setCalcAddonWhatsapp] = useState(false);
  const [calcAddonMarketing, setCalcAddonMarketing] = useState(false);

  // Agency Scratchpad State
  const [scratchpadText, setScratchpadText] = useState(
    localStorage.getItem('klapp_admin_scratchpad') || 
    "• Call Rahul about Gym App proposal\n• Follow up on Nandhakam booking engine payment gateway\n• Draft scope document for medical shop software"
  );

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
        calculateMetrics(data.inquiries || []);
        localStorage.setItem('klapp_cached_inquiries', JSON.stringify(data.inquiries || []));
      } else {
        const fRes = await fetch(`${API_BASE_URL}/api/inquiry?admin_key=klapp_admin_secret_2026`);
        const fData = await fRes.json();
        if (fRes.ok && fData.success) {
          setInquiries(fData.inquiries || []);
          calculateMetrics(fData.inquiries || []);
          localStorage.setItem('klapp_cached_inquiries', JSON.stringify(fData.inquiries || []));
        } else {
          loadCachedInquiries();
        }
      }
    } catch (err) {
      console.warn('Backend fetch fallback to cached/demo inquiries:', err);
      loadCachedInquiries();
    } finally {
      setLoading(false);
    }
  };

  const loadCachedInquiries = () => {
    const cached = localStorage.getItem('klapp_cached_inquiries');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setInquiries(parsed);
        calculateMetrics(parsed);
        return;
      } catch (e) {}
    }

    const sampleLeads = [];
    setInquiries(sampleLeads);
    calculateMetrics(sampleLeads);
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
    const updatedList = inquiries.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq);
    setInquiries(updatedList);
    calculateMetrics(updatedList);
    localStorage.setItem('klapp_cached_inquiries', JSON.stringify(updatedList));

    const token = sessionStorage.getItem('klapp_admin_token') || 'klapp_admin_token_04160416';
    try {
      await fetch(`${API_BASE_URL}/api/admin/inquiry/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.warn('Status updated locally:', err);
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    const updatedList = inquiries.filter(inq => inq.id !== id);
    setInquiries(updatedList);
    calculateMetrics(updatedList);
    localStorage.setItem('klapp_cached_inquiries', JSON.stringify(updatedList));

    const token = sessionStorage.getItem('klapp_admin_token') || 'klapp_admin_token_04160416';
    try {
      await fetch(`${API_BASE_URL}/api/admin/inquiry/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });
    } catch (err) {
      console.warn('Lead deleted locally:', err);
    }
  };

  const handleAddManualLeadSubmit = async (e) => {
    e.preventDefault();
    if (!manualLead.name || !manualLead.email || !manualLead.message) return;

    const newLead = {
      id: 'INQ-MANUAL-' + Date.now(),
      name: manualLead.name.trim(),
      email: manualLead.email.trim(),
      service: manualLead.service,
      message: manualLead.message.trim(),
      status: 'NEW',
      createdAt: new Date().toISOString()
    };

    const updatedList = [newLead, ...inquiries];
    setInquiries(updatedList);
    calculateMetrics(updatedList);
    localStorage.setItem('klapp_cached_inquiries', JSON.stringify(updatedList));

    try {
      await fetch(`${API_BASE_URL}/api/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(manualLead)
      });
    } catch (err) {
      console.warn('Manual lead saved locally:', err);
    }

    setManualLead({ name: '', email: '', service: 'Website Development', message: '' });
    setActiveTab('inquiries');
    alert('✅ Lead added successfully!');
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(inquiries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `klapp_leads_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSaveScratchpad = (text) => {
    setScratchpadText(text);
    localStorage.setItem('klapp_admin_scratchpad', text);
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
          font-family: var(--font-sans, Plus Jakarta Sans, system-ui, sans-serif);
          display: flex;
          flex-direction: row;
          overflow: hidden;
          animation: slideUpFull 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Left Vertical Sidebar */
        .admin-sidebar {
          width: 280px;
          min-width: 280px;
          background: #eae6dd;
          border-right: 1px solid #c8c3b7;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 28px 20px;
          overflow-y: auto;
          box-shadow: 4px 0 16px rgba(0, 0, 0, 0.02);
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
          padding-left: 6px;
        }
        .sidebar-logo {
          height: 32px;
          width: auto;
          object-fit: contain;
        }
        .sidebar-title {
          font-weight: 800;
          font-size: 1.05rem;
          letter-spacing: 0.08em;
          color: #18181b;
          text-transform: uppercase;
          line-height: 1.1;
        }
        .sidebar-tag {
          font-size: 0.68rem;
          color: #18181b;
          background: #ffffff;
          border: 1px solid #c8c3b7;
          padding: 3px 8px;
          border-radius: 999px;
          font-weight: 700;
          display: inline-block;
          margin-top: 4px;
        }

        .sidebar-nav-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 24px;
        }
        .sidebar-nav-btn {
          width: 100%;
          background: #ffffff;
          border: 1px solid #c8c3b7;
          color: #52525b;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.2s ease;
          text-align: left;
          font-family: var(--font-sans, Plus Jakarta Sans, sans-serif);
        }
        .sidebar-nav-btn:hover {
          background: rgba(255, 255, 255, 0.9);
          border-color: #18181b;
          color: #18181b;
        }
        .sidebar-nav-btn.active {
          background: #18181b;
          border-color: #18181b;
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
        }
        .sidebar-badge {
          background: #f4f1ea;
          color: #18181b;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 999px;
          border: 1px solid #c8c3b7;
        }
        .sidebar-nav-btn.active .sidebar-badge {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
          border-color: transparent;
        }

        .sidebar-footer {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-top: 20px;
          border-top: 1px solid #c8c3b7;
        }

        /* Right Content Area */
        .admin-main-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
        }

        /* Top Header */
        .admin-header-bar {
          background: rgba(244, 241, 234, 0.95);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid #c8c3b7;
          padding: 16px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        /* Metrics Row */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          padding: 20px 32px;
          border-bottom: 1px solid #c8c3b7;
          width: 100%;
          background: rgba(244, 241, 234, 0.5);
        }
        .metric-card {
          background: #ffffff;
          border: 1px solid #c8c3b7;
          border-radius: 16px;
          padding: 18px 20px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .metric-card:hover {
          transform: translateY(-2px);
          border-color: #18181b;
        }
        .metric-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .metric-label {
          font-size: 0.75rem;
          color: #71717a;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
        }
        .metric-icon-box {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: #f4f1ea;
          color: #18181b;
          border: 1px solid #d4d0c5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }
        .metric-value {
          font-size: 1.8rem;
          font-weight: 800;
          color: #18181b;
        }

        /* Main Scrollable Workspace */
        .main-workspace {
          flex: 1;
          overflow-y: auto;
          padding: 28px 32px 60px 32px;
        }

        .inquiry-card {
          background: #ffffff;
          border: 1px solid #c8c3b7;
          border-radius: 18px;
          padding: 26px;
          margin-bottom: 20px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04);
          transition: all 0.2s ease;
        }
        .inquiry-card:hover {
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          border-color: #18181b;
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
          padding: 3px 10px;
          border-radius: 6px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .status-NEW { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
        .status-CONTACTED { background: #fefce8; color: #854d0e; border: 1px solid #fef08a; }
        .status-IN_PROGRESS { background: #f4f4f5; color: #3f3f46; border: 1px solid #d4d4d8; }
        .status-CLOSED { background: #18181b; color: #ffffff; border: 1px solid #18181b; }

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
          font-family: var(--font-sans, Plus Jakarta Sans, sans-serif);
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
          font-family: var(--font-sans, Plus Jakarta Sans, sans-serif);
        }
        .btn-action-outline:hover {
          background: #f4f1ea;
        }

        .c-input-styled {
          width: 100%;
          background: #ffffff;
          border: 1px solid #e4e0d7;
          border-radius: 10px;
          padding: 12px 16px;
          color: #18181b;
          font-family: var(--font-sans, Plus Jakarta Sans, sans-serif);
          font-size: 0.9rem;
          outline: none;
        }
        .c-input-styled:focus {
          border-color: #18181b;
        }
      `}</style>

      {/* LEFT VERTICAL SIDEBAR */}
      <div className="admin-sidebar">
        <div>
          <div className="sidebar-brand">
            <img 
              src="/logo.png" 
              alt="KLAPP" 
              className="sidebar-logo" 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <div className="sidebar-title">KLAPP</div>
            </div>
          </div>

          <div className="sidebar-nav-list">
            <button 
              className={`sidebar-nav-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
              onClick={() => setActiveTab('inquiries')}
            >
              <span><i className="ri-inbox-archive-line" style={{ marginRight: '10px' }}></i> Client Inquiries</span>
              <span className="sidebar-badge">{inquiries.length}</span>
            </button>

            <button 
              className={`sidebar-nav-btn ${activeTab === 'addLead' ? 'active' : ''}`}
              onClick={() => setActiveTab('addLead')}
            >
              <span><i className="ri-user-add-line" style={{ marginRight: '10px' }}></i> Add New Lead</span>
            </button>

            <button 
              className={`sidebar-nav-btn ${activeTab === 'calculator' ? 'active' : ''}`}
              onClick={() => setActiveTab('calculator')}
            >
              <span><i className="ri-calculator-line" style={{ marginRight: '10px' }}></i> Quote Calculator</span>
            </button>

            <button 
              className={`sidebar-nav-btn ${activeTab === 'notes' ? 'active' : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              <span><i className="ri-sticky-note-line" style={{ marginRight: '10px' }}></i> Scratchpad & Notes</span>
            </button>
          </div>
        </div>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#18181b' }}>Gotti Aashish</span>
            </div>

            <button onClick={onLogout} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600' }}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT MAIN CONTENT AREA */}
      <div className="admin-main-container">
        {/* Top Header */}
        <div className="admin-header-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', flex: 1 }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <i className="ri-search-line" style={{ position: 'absolute', left: '14px', color: '#71717a' }}></i>
              <input 
                type="text" 
                className="c-input-styled" 
                style={{ width: '340px', paddingLeft: '40px' }}
                placeholder="Search leads by name, email, service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={fetchInquiries} className="btn-action-outline" title="Refresh leads">
              <i className="ri-refresh-line"></i> Refresh
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
              <span className="metric-label">New Unread</span>
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

        {/* Main Workspace Feed */}
        <div className="main-workspace">

          {/* TAB 1: CLIENT INQUIRIES FEED */}
          {activeTab === 'inquiries' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '22px' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#18181b', margin: 0 }}>
                  Client Leads ({filteredInquiries.length})
                </h4>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {['ALL', 'NEW', 'CONTACTED', 'IN_PROGRESS', 'CLOSED'].map(status => (
                    <button 
                      key={status}
                      className={`sidebar-nav-btn ${statusFilter === status ? 'active' : ''}`}
                      onClick={() => setStatusFilter(status)}
                      style={{ borderRadius: '999px', fontSize: '0.78rem', padding: '6px 14px', width: 'auto' }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#71717a' }}>
                  <i className="ri-loader-4-line ri-spin" style={{ fontSize: '2.4rem', display: 'block', marginBottom: '12px', color: '#18181b' }}></i>
                  Loading client inquiries...
                </div>
              ) : filteredInquiries.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: '#71717a' }}>
                  <i className="ri-inbox-archive-line" style={{ fontSize: '3.5rem', display: 'block', marginBottom: '14px', color: '#a1a1aa' }}></i>
                  <h4 style={{ fontSize: '1.25rem', color: '#18181b', marginBottom: '6px', fontWeight: '700' }}>No Client Inquiries Found</h4>
                  <p style={{ fontSize: '0.9rem', color: '#71717a', marginBottom: '20px' }}>When clients fill out the contact form, their leads appear here in real time.</p>
                  <button onClick={() => setActiveTab('addLead')} className="btn-action-brand">
                    + Add Manual Lead Now
                  </button>
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '4px' }}>
                            <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#18181b', margin: 0 }}>{inq.name}</h4>
                            <span className={`badge-status status-${inq.status}`}>{inq.status}</span>
                          </div>
                          <div style={{ fontSize: '0.88rem', color: '#71717a' }}>
                            <i className="ri-contacts-line" style={{ marginRight: '6px', color: '#a1a1aa' }}></i> {inq.email}
                          </div>
                        </div>

                        <div style={{ fontSize: '0.82rem', color: '#71717a', background: '#eae6dd', padding: '6px 12px', borderRadius: '8px', border: '1px solid #c8c3b7', fontWeight: '500' }}>
                          <i className="ri-time-line" style={{ marginRight: '6px' }}></i>
                          {new Date(inq.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div style={{ background: '#faf8f5', borderRadius: '12px', padding: '18px', marginBottom: '20px', border: '1px solid #c8c3b7' }}>
                        <div style={{ fontSize: '0.78rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <i className="ri-stack-line" style={{ color: '#18181b' }}></i>
                          SERVICE REQUIRED: <strong style={{ color: '#18181b' }}>{inq.service}</strong>
                        </div>
                        <p style={{ color: '#18181b', fontSize: '0.94rem', lineHeight: '1.6', margin: 0, fontWeight: '400' }}>
                          "{inq.message}"
                        </p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', paddingTop: '14px', borderTop: '1px solid #c8c3b7' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <a 
                            href={waUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn-action-outline"
                            style={{ background: '#f0fdf4', color: '#15803d', borderColor: '#bbf7d0' }}
                          >
                            <i className="ri-whatsapp-fill" style={{ color: '#22c55e', fontSize: '1.05rem' }}></i> WhatsApp
                          </a>

                          <a href={`mailto:${inq.email}`} className="btn-action-outline">
                            <i className="ri-mail-line" style={{ color: '#52525b', fontSize: '1.05rem' }}></i> Email
                          </a>

                          <button 
                            onClick={() => {
                              const quote = `Hi ${inq.name}! KLAPP Developers Proposal for ${inq.service}:\n• Custom React App Setup\n• Sub-100ms Speed & Mobile Responsive\n• 50% Milestone Available\nDirect WhatsApp: +91 79890 33580`;
                              navigator.clipboard.writeText(quote);
                              alert('📋 Proposal quote copied to clipboard! Paste it into WhatsApp.');
                            }} 
                            className="btn-action-outline"
                            title="Copy proposal quote"
                          >
                            <i className="ri-file-copy-line" style={{ color: '#52525b', fontSize: '1.05rem' }}></i> Copy Proposal
                          </button>
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
            </>
          )}

          {/* TAB 2: ADD NEW MANUAL LEAD */}
          {activeTab === 'addLead' && (
            <div style={{ background: '#ffffff', border: '1px solid #e4e0d7', borderRadius: '18px', padding: '32px', maxWidth: '640px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px', color: '#18181b' }}>
                Add Lead Manually
              </h3>
              <p style={{ color: '#71717a', fontSize: '0.88rem', marginBottom: '24px' }}>
                Received a lead via WhatsApp, Call, or Instagram? Add it here to track in your CRM.
              </p>

              <form onSubmit={handleAddManualLeadSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#52525b', marginBottom: '6px' }}>Client Name</label>
                  <input 
                    type="text" 
                    required 
                    className="c-input-styled" 
                    placeholder="e.g. Ramesh Kumar"
                    value={manualLead.name}
                    onChange={(e) => setManualLead({ ...manualLead, name: e.target.value })}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#52525b', marginBottom: '6px' }}>Work Email or WhatsApp Number</label>
                  <input 
                    type="text" 
                    required 
                    className="c-input-styled" 
                    placeholder="e.g. +91 98765 43210 or email@company.com"
                    value={manualLead.email}
                    onChange={(e) => setManualLead({ ...manualLead, email: e.target.value })}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#52525b', marginBottom: '6px' }}>Service Required</label>
                  <select 
                    className="c-input-styled"
                    value={manualLead.service}
                    onChange={(e) => setManualLead({ ...manualLead, service: e.target.value })}
                  >
                    <option value="Website Development">Website Development</option>
                    <option value="AI Automation">AI Automation & Agents</option>
                    <option value="WhatsApp Automation">WhatsApp API Automation</option>
                    <option value="Mobile App">Mobile App (iOS / Android)</option>
                    <option value="Business Software">Business Software / ERP</option>
                  </select>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#52525b', marginBottom: '6px' }}>Project Requirements / Notes</label>
                  <textarea 
                    rows={4} 
                    required 
                    className="c-input-styled"
                    placeholder="Client project details, timeline, agreed budget..."
                    value={manualLead.message}
                    onChange={(e) => setManualLead({ ...manualLead, message: e.target.value })}
                  ></textarea>
                </div>

                <button type="submit" className="btn-action-brand" style={{ width: '100%', padding: '14px', justifyContent: 'center' }}>
                  <i className="ri-save-line"></i> Save Lead to CRM
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: PACKAGE & PROPOSAL CALCULATOR */}
          {activeTab === 'calculator' && (
            <div style={{ background: '#ffffff', border: '1px solid #e4e0d7', borderRadius: '18px', padding: '32px', maxWidth: '700px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px', color: '#18181b' }}>
                KLAPP Package & Quote Generator
              </h3>
              <p style={{ color: '#71717a', fontSize: '0.88rem', marginBottom: '24px' }}>
                Quickly calculate client project estimates and copy custom proposal text for WhatsApp.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#52525b', marginBottom: '6px' }}>Package Tier</label>
                  <select 
                    className="c-input-styled"
                    value={calcService}
                    onChange={(e) => {
                      setCalcService(e.target.value);
                      if (e.target.value === 'Starter Web App') setCalcBudget(30000);
                      if (e.target.value === 'Custom App & Dashboard') setCalcBudget(55000);
                      if (e.target.value === 'Enterprise ERP') setCalcBudget(95000);
                    }}
                  >
                    <option value="Starter Web App">Starter Web App (₹25k - ₹35k)</option>
                    <option value="Custom App & Dashboard">Custom App & Dashboard (₹45k - ₹75k)</option>
                    <option value="Enterprise ERP">Enterprise ERP (₹50k - ₹1.2L+)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#52525b', marginBottom: '6px' }}>Base Price (₹)</label>
                  <input 
                    type="number" 
                    className="c-input-styled"
                    value={calcBudget}
                    onChange={(e) => setCalcBudget(Number(e.target.value))}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px', background: '#f4f1ea', padding: '16px', borderRadius: '12px', border: '1px solid #e4e0d7' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#18181b', marginBottom: '10px' }}>Add-on Growth Features:</div>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#18181b', marginBottom: '8px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={calcAddonWhatsapp} 
                    onChange={(e) => setCalcAddonWhatsapp(e.target.checked)} 
                  />
                  Meta WhatsApp Cloud API Automation (+₹50,000)
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#18181b', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={calcAddonMarketing} 
                    onChange={(e) => setCalcAddonMarketing(e.target.checked)} 
                  />
                  High-ROI Google & Meta Performance Marketing (+₹25,000/mo)
                </label>
              </div>

              {/* Proposal Output Box */}
              <div style={{ background: '#18181b', color: '#ffffff', borderRadius: '14px', padding: '24px', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.78rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', fontWeight: '700' }}>
                  TOTAL ESTIMATE: ₹{(calcBudget + (calcAddonWhatsapp ? 50000 : 0) + (calcAddonMarketing ? 25000 : 0)).toLocaleString()} (50% Milestone: ₹{((calcBudget + (calcAddonWhatsapp ? 50000 : 0) + (calcAddonMarketing ? 25000 : 0)) / 2).toLocaleString()})
                </div>

                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-sans, Plus Jakarta Sans, sans-serif)', fontSize: '0.88rem', color: '#e4e4e7', margin: 0, lineHeight: '1.6' }}>
{`🚀 KLAPP DEVELOPERS — PROPOSAL QUOTE
Package: ${calcService}
Total Estimate: ₹${(calcBudget + (calcAddonWhatsapp ? 50000 : 0) + (calcAddonMarketing ? 25000 : 0)).toLocaleString()}
50% Milestone: Pay ₹${((calcBudget + (calcAddonWhatsapp ? 50000 : 0) + (calcAddonMarketing ? 25000 : 0)) / 2).toLocaleString()} to initiate build!

Deliverables Included:
• React + Vite Sub-100ms Speed Architecture
• Mobile-Responsive Design & Free SSL
${calcAddonWhatsapp ? '• Meta WhatsApp Cloud API Bot Setup\n' : ''}${calcAddonMarketing ? '• Performance Marketing Campaign Setup\n' : ''}• Full Source Code Ownership

Direct WhatsApp: +91 79890 33580`}
                </pre>
              </div>

              <button 
                onClick={() => {
                  const text = `🚀 KLAPP DEVELOPERS — PROPOSAL QUOTE\nPackage: ${calcService}\nTotal Estimate: ₹${(calcBudget + (calcAddonWhatsapp ? 50000 : 0) + (calcAddonMarketing ? 25000 : 0)).toLocaleString()}\n50% Milestone: Pay ₹${((calcBudget + (calcAddonWhatsapp ? 50000 : 0) + (calcAddonMarketing ? 25000 : 0)) / 2).toLocaleString()} to start!\n\nDeliverables Included:\n• React + Vite Sub-100ms Speed Architecture\n• Mobile-Responsive Design & Free SSL\n${calcAddonWhatsapp ? '• Meta WhatsApp Cloud API Bot Setup\n' : ''}${calcAddonMarketing ? '• Performance Marketing Campaign Setup\n' : ''}• Full Source Code Ownership\n\nDirect WhatsApp: +91 79890 33580`;
                  navigator.clipboard.writeText(text);
                  alert('📋 Custom proposal quote copied to clipboard!');
                }} 
                className="btn-action-brand" 
                style={{ width: '100%', padding: '14px', justifyContent: 'center' }}
              >
                <i className="ri-file-copy-line"></i> Copy WhatsApp Proposal Quote
              </button>
            </div>
          )}

          {/* TAB 4: SCRATCHPAD & NOTES */}
          {activeTab === 'notes' && (
            <div style={{ background: '#ffffff', border: '1px solid #e4e0d7', borderRadius: '18px', padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px', color: '#18181b' }}>
                Agency Scratchpad & Client Notes
              </h3>
              <p style={{ color: '#71717a', fontSize: '0.88rem', marginBottom: '20px' }}>
                Write down meeting notes, client requirement checklists, and follow-up reminders. Automatically saved in your browser.
              </p>

              <textarea 
                rows={12}
                className="c-input-styled"
                style={{ fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '16px' }}
                value={scratchpadText}
                onChange={(e) => handleSaveScratchpad(e.target.value)}
                placeholder="Write your notes here..."
              ></textarea>

              <div style={{ fontSize: '0.82rem', color: '#22c55e', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="ri-checkbox-circle-line"></i> Auto-saved locally in browser storage
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
