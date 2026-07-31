import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

export default function AdminDashboardModal({ isOpen, onClose, onLogout }) {
  // Active User Role: 'AASHISH' vs 'MINNI'
  const [userRole, setUserRole] = useState(
    sessionStorage.getItem('klapp_admin_avatar') || 'AASHISH'
  );

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'inquiries', 'projects', 'calendar', 'content', 'revenue', 'discipline', 'competition', 'reminders', 'addLead', 'notes'
  const [inquiries, setInquiries] = useState([]);
  const [metrics, setMetrics] = useState({ total: 0, newLeads: 0, contacted: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Live Clock Ticking Engine (Updates every 1 second)
  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = liveTime.getHours();
    const name = userRole === 'AASHISH' ? 'Aashish' : 'Minni';
    let greetingPrefix = 'Good Morning';
    let emoji = '👋';

    if (hour >= 12 && hour < 17) {
      greetingPrefix = 'Good Afternoon';
      emoji = '☀️';
    } else if (hour >= 17 && hour < 22) {
      greetingPrefix = 'Good Evening';
      emoji = '🌙';
    } else if (hour >= 22 || hour < 5) {
      greetingPrefix = 'Good Night';
      emoji = '🌌';
    }

    return `${greetingPrefix}, ${name} ${emoji}`;
  };

  // KLAPP OS Synced Global State
  const [osData, setOsData] = useState({
    projects: [
      { id: 'PRJ-101', name: 'Nandhakam E-Commerce & Booking System', client: 'Rahul Sharma', service: 'Website Development', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: '2026-08-15', budget: 65000, owner: 'Aashish' },
      { id: 'PRJ-102', name: 'Balaji Pharma Billing & GST Portal', client: 'Balaji Pharma', service: 'Business Software', status: 'PLANNING', priority: 'HIGH', dueDate: '2026-08-20', budget: 45000, owner: 'Minni' }
    ],
    meetings: [
      { id: 'MTG-01', title: 'Nandhakam Project Milestone Review', time: 'Today, 4:00 PM', client: 'Rahul Sharma', attendees: 'Aashish & Minni', type: 'Google Meet', link: 'https://meet.google.com/klapp-demo' },
      { id: 'MTG-02', title: 'KLAPP Q3 Agency Growth Strategy', time: 'Friday, 11:00 AM', client: 'Internal', attendees: 'Aashish & Minni', type: 'Office Room', link: '#' }
    ],
    contentPlanner: [
      { id: 'CNT-01', title: 'How we built sub-100ms websites for Indian Brands', platform: 'Instagram Reel', status: 'READY_FOR_APPROVAL', date: 'Today, 6:00 PM', notes: 'Video edited, needs Aashish approval before posting', author: 'Minni', approvedBy: '' },
      { id: 'CNT-02', title: 'KLAPP Developers Behind the Scenes - Coding Session', platform: 'LinkedIn Post', status: 'DRAFT', date: 'Tomorrow, 10:00 AM', notes: 'Drafting tech stack highlights and architecture diagram', author: 'Aashish', approvedBy: '' }
    ],
    tasks: [
      { id: 'TSK-01', title: 'Complete Razorpay integration testing', assignedTo: 'Aashish', status: 'IN_PROGRESS', dueDate: 'Today', category: 'Development' },
      { id: 'TSK-02', title: 'Draft Instagram story sequence for new client launch', assignedTo: 'Minni', status: 'DONE', dueDate: 'Today', category: 'Social Media' },
      { id: 'TSK-03', title: 'Send GST billing proposal PDF to Balaji Pharma', assignedTo: 'Minni', status: 'PENDING', dueDate: 'Today', category: 'Client Operations' }
    ],
    disciplineLogs: {
      date: new Date().toISOString().split('T')[0],
      aashish: {
        attendance: true,
        gym: true,
        coding: true,
        projectUpdate: true,
        clientFollowups: false,
        sleep11pm: true,
        wake7am: true,
        reading: true,
        waterGoal: true,
        mood: '⚡ High Energy'
      },
      minni: {
        attendance: true,
        instaPosts2: true,
        storiesCompleted: true,
        coding: true,
        clientFollowups: true,
        contentPlanning: true,
        sleep11pm: true,
        wake7am: true,
        mood: '✨ Creative Surge'
      }
    },
    sharedGoals: [
      { id: 'SG-1', title: 'Coding Together (React & Node.js System Architecture)', completed: true },
      { id: 'SG-2', title: 'KLAPP Q3 Strategy & Client Review', completed: true },
      { id: 'SG-3', title: 'Daily Night Planning & Discipline Review', completed: false },
      { id: 'SG-4', title: 'Review Weekly Content Pipeline & Approvals', completed: true }
    ]
  });

  // Manual Lead Form State
  const [manualLead, setManualLead] = useState({
    name: '',
    email: '',
    service: 'Website Development',
    message: ''
  });

  // Proposal Calculator State
  const [calcService, setCalcService] = useState('Starter Web App');
  const [calcBudget, setCalcBudget] = useState(35000);

  // Shared Interactive Calendar State
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [showAddMeetingModal, setShowAddMeetingModal] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    time: 'Today, 4:00 PM',
    client: 'Rahul Sharma',
    attendees: 'Aashish & Minni',
    link: 'https://meet.google.com/klapp-demo'
  });

  const handleCreateMeeting = (e) => {
    e.preventDefault();
    if (!newMeeting.title) return;

    const mtg = {
      id: 'MTG-' + Date.now(),
      title: newMeeting.title.trim(),
      time: newMeeting.time,
      client: newMeeting.client,
      attendees: newMeeting.attendees,
      type: 'Google Meet',
      link: newMeeting.link
    };

    const updated = {
      ...osData,
      meetings: [mtg, ...osData.meetings]
    };
    syncOSDataToBackend(updated);
    setNewMeeting({ title: '', time: 'Today, 4:00 PM', client: '', attendees: 'Aashish & Minni', link: 'https://meet.google.com/klapp-demo' });
    setShowAddMeetingModal(false);
    alert('✅ Meeting scheduled & synced to Shared Calendar!');
  };

  // Scratchpad State
  const [scratchpadText, setScratchpadText] = useState(
    localStorage.getItem('klapp_admin_scratchpad') || 
    "• Call Rahul about Gym App proposal\n• Follow up on Nandhakam booking engine payment gateway\n• Draft scope document for medical shop software"
  );

  // Fetch Inquiries & Sync KLAPP OS State from MongoDB Atlas
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
      }

      // Fetch KLAPP OS Synced State
      const osRes = await fetch(`${API_BASE_URL}/api/admin/os-data?token=${token}`, {
        headers: { 'x-admin-token': token }
      });
      const osDataRes = await osRes.json();
      if (osRes.ok && osDataRes.success && osDataRes.osData) {
        setOsData(osDataRes.osData);
      }
    } catch (err) {
      console.warn('Backend fetch fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  const syncOSDataToBackend = async (updatedState) => {
    setOsData(updatedState);
    const token = sessionStorage.getItem('klapp_admin_token') || 'klapp_admin_token_04160416';
    try {
      await fetch(`${API_BASE_URL}/api/admin/os-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify({ osData: updatedState })
      });
    } catch (e) {
      console.warn('Local OS sync update:', e);
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
    const updatedList = inquiries.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq);
    setInquiries(updatedList);
    calculateMetrics(updatedList);

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
    } catch (err) {}
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    const updatedList = inquiries.filter(inq => inq.id !== id);
    setInquiries(updatedList);
    calculateMetrics(updatedList);

    const token = sessionStorage.getItem('klapp_admin_token') || 'klapp_admin_token_04160416';
    try {
      await fetch(`${API_BASE_URL}/api/admin/inquiry/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });
    } catch (err) {}
  };

  const handleToggleDisciplineItem = (person, key) => {
    const updated = {
      ...osData,
      disciplineLogs: {
        ...osData.disciplineLogs,
        [person]: {
          ...osData.disciplineLogs[person],
          [key]: !osData.disciplineLogs[person][key]
        }
      }
    };
    syncOSDataToBackend(updated);
  };

  const handleToggleSharedGoal = (id) => {
    const updated = {
      ...osData,
      sharedGoals: osData.sharedGoals.map(g => g.id === id ? { ...g, completed: !g.completed } : g)
    };
    syncOSDataToBackend(updated);
  };

  const handleApproveContent = (contentId) => {
    const updated = {
      ...osData,
      contentPlanner: osData.contentPlanner.map(c => 
        c.id === contentId ? { ...c, status: 'APPROVED', approvedBy: 'Aashish' } : c
      )
    };
    syncOSDataToBackend(updated);
    alert('✅ Content post approved by Aashish! Ready for publishing by Minni.');
  };

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
    <div className="admin-portal-overlay">
      <style>{`
        .admin-portal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 99999;
          background: #f4f1ea;
          color: #18181b;
          display: flex;
          font-family: var(--font-sans, Plus Jakarta Sans, sans-serif);
          overflow: hidden;
          animation: slideUpFull 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Left Vertical Sidebar */
        .admin-sidebar {
          width: 290px;
          min-width: 290px;
          background: #eae6dd;
          border-right: 1px solid #c8c3b7;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 24px 18px;
          overflow-y: auto;
          box-shadow: 4px 0 16px rgba(0, 0, 0, 0.02);
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
          padding-left: 6px;
        }
        .sidebar-logo {
          height: 30px;
          width: auto;
          object-fit: contain;
        }
        .sidebar-title {
          font-weight: 800;
          font-size: 1rem;
          letter-spacing: 0.08em;
          color: #18181b;
          text-transform: uppercase;
        }

        .sidebar-nav-list {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-bottom: 24px;
        }
        .sidebar-nav-btn {
          width: 100%;
          background: #ffffff;
          border: 1px solid #c8c3b7;
          color: #52525b;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 0.85rem;
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
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 999px;
          border: 1px solid #c8c3b7;
        }

        .sidebar-footer {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-top: 16px;
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

        .admin-header-bar {
          background: rgba(244, 241, 234, 0.95);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid #c8c3b7;
          padding: 14px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .main-workspace {
          flex: 1;
          overflow-y: auto;
          padding: 24px 28px 60px 28px;
        }

        .os-card {
          background: #ffffff;
          border: 1px solid #c8c3b7;
          border-radius: 16px;
          padding: 22px;
          margin-bottom: 20px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.04);
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

        .btn-action-outline {
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px solid #c8c3b7;
          background: #ffffff;
          color: #18181b;
          font-weight: 600;
          font-size: 0.84rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .btn-action-outline:hover {
          background: #f4f1ea;
          border-color: #18181b;
        }

        .discipline-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }
        .habit-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          background: #faf8f5;
          border: 1px solid #c8c3b7;
          border-radius: 10px;
          margin-bottom: 8px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .habit-row:hover {
          background: #eae6dd;
        }
        .state-badge-done { background: #dcfce7; color: #15803d; padding: 2px 8px; border-radius: 6px; font-weight: 700; font-size: 0.74rem; }
        .state-badge-pending { background: #fef3c7; color: #b45309; padding: 2px 8px; border-radius: 6px; font-weight: 700; font-size: 0.74rem; }
      `}</style>

      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="admin-sidebar">
        <div>
          <div className="sidebar-brand">
            <img src="/logo.png" alt="KLAPP" className="sidebar-logo" onError={(e) => { e.target.style.display='none'; }} />
            <span className="sidebar-title">KLAPP OS</span>
          </div>

          <nav className="sidebar-nav-list">
            <button className={`sidebar-nav-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              <span><i className="ri-home-4-line" style={{ marginRight: '8px' }}></i> Home Overview</span>
              <span className="sidebar-badge" style={{ background: '#18181b', color: '#fff' }}>HQ</span>
            </button>

            <button className={`sidebar-nav-btn ${activeTab === 'inquiries' ? 'active' : ''}`} onClick={() => setActiveTab('inquiries')}>
              <span><i className="ri-inbox-line" style={{ marginRight: '8px' }}></i> Inquiries & CRM</span>
              <span className="sidebar-badge">{inquiries.length}</span>
            </button>

            <button className={`sidebar-nav-btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
              <span><i className="ri-folder-line" style={{ marginRight: '8px' }}></i> Projects & Board</span>
              <span className="sidebar-badge">{osData.projects.length}</span>
            </button>

            <button className={`sidebar-nav-btn ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>
              <span><i className="ri-calendar-event-line" style={{ marginRight: '8px' }}></i> Shared Calendar</span>
              <span className="sidebar-badge">{osData.meetings.length}</span>
            </button>

            <button className={`sidebar-nav-btn ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>
              <span><i className="ri-instagram-line" style={{ marginRight: '8px' }}></i> Content Planner</span>
              <span className="sidebar-badge">{osData.contentPlanner.length}</span>
            </button>

            <button className={`sidebar-nav-btn ${activeTab === 'discipline' ? 'active' : ''}`} onClick={() => setActiveTab('discipline')}>
              <span><i className="ri-shield-user-line" style={{ marginRight: '8px' }}></i> Personal Discipline</span>
              <span className="sidebar-badge" style={{ background: '#22c55e', color: '#fff' }}>Sync</span>
            </button>

            <button className={`sidebar-nav-btn ${activeTab === 'competition' ? 'active' : ''}`} onClick={() => setActiveTab('competition')}>
              <span><i className="ri-trophy-line" style={{ marginRight: '8px' }}></i> Streaks & Score</span>
              <span className="sidebar-badge">🏆</span>
            </button>

            <button className={`sidebar-nav-btn ${activeTab === 'revenue' ? 'active' : ''}`} onClick={() => setActiveTab('revenue')}>
              <span><i className="ri-calculator-line" style={{ marginRight: '8px' }}></i> Revenue & Proposals</span>
            </button>

            <button className={`sidebar-nav-btn ${activeTab === 'reminders' ? 'active' : ''}`} onClick={() => setActiveTab('reminders')}>
              <span><i className="ri-alarm-warning-line" style={{ marginRight: '8px' }}></i> Smart Reminders</span>
            </button>

            <button className={`sidebar-nav-btn ${activeTab === 'addLead' ? 'active' : ''}`} onClick={() => setActiveTab('addLead')}>
              <span><i className="ri-user-add-line" style={{ marginRight: '8px' }}></i> Add New Lead</span>
            </button>

            <button className={`sidebar-nav-btn ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>
              <span><i className="ri-sticky-note-line" style={{ marginRight: '8px' }}></i> Scratchpad</span>
            </button>
          </nav>
        </div>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#18181b', fontWeight: '700' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span>
            {userRole === 'AASHISH' ? 'Gotti Aashish' : 'Manashvini (Minni)'}
          </div>
          <button 
            onClick={onLogout} 
            style={{ width: '100%', background: 'transparent', border: '1px solid #c8c3b7', color: '#ef4444', padding: '8px', borderRadius: '8px', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}
          >
            <i className="ri-logout-box-r-line" style={{ marginRight: '6px' }}></i> Logout OS
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN WORKSPACE */}
      <main className="admin-main-container">
        {/* TOP HEADER BAR */}
        <header className="admin-header-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {activeTab === 'overview' && 'Command Center Overview'}
              {activeTab === 'inquiries' && 'Inquiries & Client CRM'}
              {activeTab === 'projects' && 'Projects & Deliverables Board'}
              {activeTab === 'calendar' && 'Shared Calendar & Meetings'}
              {activeTab === 'content' && 'Content Planner & Social Workflow'}
              {activeTab === 'discipline' && 'Personal Discipline & Accountability'}
              {activeTab === 'competition' && 'Streaks & Gamification Engine'}
              {activeTab === 'revenue' && 'Revenue Analytics & Proposals'}
              {activeTab === 'reminders' && 'Smart Reminder Engine'}
              {activeTab === 'addLead' && 'Add Manual Lead'}
              {activeTab === 'notes' && 'Agency Scratchpad'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={fetchInquiries} className="btn-action-outline">
              <i className="ri-refresh-line"></i> Refresh
            </button>

            <button onClick={onClose} className="btn-action-outline">
              <i className="ri-close-line"></i> Close OS
            </button>
          </div>
        </header>

        {/* WORKSPACE CONTENT */}
        <div className="main-workspace">

          {/* TAB 0: HOME OVERVIEW (DEFAULT LANDING PAGE) */}
          {activeTab === 'overview' && (
            <div>
              {/* HERO DYNAMIC GREETING & LIVE TICKING CLOCK */}
              <div className="os-card" style={{ background: '#ffffff', border: '1px solid #c8c3b7', padding: '24px 28px', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '0 0 4px 0', color: '#18181b', letterSpacing: '-0.02em' }}>
                      {getGreeting()}
                    </h1>
                    <p style={{ margin: 0, color: '#71717a', fontSize: '0.88rem', fontWeight: '500' }}>
                      Welcome to KLAPP Developers Command Center. Here is your live execution overview.
                    </p>
                  </div>

                  {/* LIVE TICKING CLOCK & DATE BADGE */}
                  <div style={{ background: '#faf8f5', border: '1px solid #c8c3b7', padding: '10px 18px', borderRadius: '12px', textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#18181b', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
                      {liveTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#71717a', fontWeight: '600', marginTop: '2px' }}>
                      {liveTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>

              {/* QUICK METRICS GRID */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div className="os-card" style={{ marginBottom: 0 }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: '700', color: '#71717a', textTransform: 'uppercase', marginBottom: '4px' }}>CLIENT LEADS</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#18181b' }}>{inquiries.length}</div>
                  <div style={{ fontSize: '0.76rem', color: '#166534', fontWeight: '600', marginTop: '4px' }}>{metrics.newLeads} New Unread</div>
                </div>

                <div className="os-card" style={{ marginBottom: 0 }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: '700', color: '#71717a', textTransform: 'uppercase', marginBottom: '4px' }}>ACTIVE PROJECTS</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#18181b' }}>{osData.projects.length}</div>
                  <div style={{ fontSize: '0.76rem', color: '#2563eb', fontWeight: '600', marginTop: '4px' }}>In Active Sprint</div>
                </div>

                <div className="os-card" style={{ marginBottom: 0 }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: '700', color: '#71717a', textTransform: 'uppercase', marginBottom: '4px' }}>SCHEDULED MEETINGS</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#18181b' }}>{osData.meetings.length}</div>
                  <div style={{ fontSize: '0.76rem', color: '#d97706', fontWeight: '600', marginTop: '4px' }}>Next: Milestone Review</div>
                </div>

                <div className="os-card" style={{ marginBottom: 0 }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: '700', color: '#71717a', textTransform: 'uppercase', marginBottom: '4px' }}>TODAY DISCIPLINE</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#22c55e' }}>100%</div>
                  <div style={{ fontSize: '0.76rem', color: '#166534', fontWeight: '600', marginTop: '4px' }}>Active Streak 🔥</div>
                </div>
              </div>

              {/* TODAY'S AGENDA GRID */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {/* TODAY'S SCHEDULED MEETINGS */}
                <div className="os-card" style={{ marginBottom: 0 }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="ri-calendar-todo-fill" style={{ color: '#2563eb' }}></i> Today's Meetings & Schedule
                  </h3>
                  {osData.meetings.map(mtg => (
                    <div key={mtg.id} style={{ padding: '12px', background: '#faf8f5', border: '1px solid #c8c3b7', borderRadius: '10px', marginBottom: '10px' }}>
                      <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#18181b' }}>{mtg.title}</div>
                      <div style={{ fontSize: '0.78rem', color: '#71717a', marginTop: '2px' }}>{mtg.time} • {mtg.attendees}</div>
                      <a href={mtg.link} target="_blank" rel="noopener noreferrer" className="btn-action-outline" style={{ marginTop: '8px', fontSize: '0.76rem', padding: '4px 10px' }}>
                        Join Meet <i className="ri-arrow-right-line"></i>
                      </a>
                    </div>
                  ))}
                </div>

                {/* TODAY'S ASSIGNED TASKS */}
                <div className="os-card" style={{ marginBottom: 0 }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="ri-checkbox-circle-fill" style={{ color: '#22c55e' }}></i> Today's Action Plan
                  </h3>
                  {osData.tasks.map(tsk => (
                    <div key={tsk.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#faf8f5', border: '1px solid #c8c3b7', borderRadius: '8px', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.86rem' }}>{tsk.title}</div>
                        <div style={{ fontSize: '0.74rem', color: '#71717a' }}>Assigned: {tsk.assignedTo}</div>
                      </div>
                      <span className={tsk.status === 'DONE' ? 'state-badge-done' : 'state-badge-pending'}>
                        {tsk.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: INQUIRIES & CRM */}
          {activeTab === 'inquiries' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
                <div style={{ flex: 1, display: 'flex', gap: '10px', minWidth: '280px' }}>
                  <input 
                    type="text" 
                    placeholder="Search leads by name, email, service..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1px solid #c8c3b7', outline: 'none', background: '#fff', fontSize: '0.88rem' }}
                  />
                  <button 
                    onClick={() => setActiveTab('addLead')} 
                    className="btn-action-outline" 
                    style={{ background: '#18181b', color: '#ffffff', borderColor: '#18181b', fontWeight: '700', whiteSpace: 'nowrap' }}
                  >
                    <i className="ri-user-add-line"></i> + Add Lead
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {['ALL', 'NEW', 'CONTACTED', 'IN_PROGRESS', 'CLOSED'].map(st => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        border: '1px solid #c8c3b7',
                        cursor: 'pointer',
                        background: statusFilter === st ? '#18181b' : '#ffffff',
                        color: statusFilter === st ? '#ffffff' : '#18181b'
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {filteredInquiries.length === 0 ? (
                <div className="os-card" style={{ textAlign: 'center', padding: '40px' }}>
                  <i className="ri-inbox-archive-line" style={{ fontSize: '2.5rem', color: '#a1a1aa' }}></i>
                  <p style={{ fontWeight: '600', color: '#71717a', marginTop: '10px' }}>No client inquiries found matching filter.</p>
                </div>
              ) : (
                filteredInquiries.map(inq => (
                  <div key={inq.id} className="os-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '14px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <h4 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>{inq.name}</h4>
                          <span className={`badge-status status-${inq.status}`}>{inq.status}</span>
                        </div>
                        <div style={{ fontSize: '0.86rem', color: '#71717a' }}>
                          <i className="ri-contacts-line" style={{ marginRight: '6px' }}></i> {inq.email}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#71717a', background: '#eae6dd', padding: '5px 10px', borderRadius: '6px', border: '1px solid #c8c3b7' }}>
                        {new Date(inq.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div style={{ background: '#faf8f5', borderRadius: '10px', padding: '14px', marginBottom: '16px', border: '1px solid #c8c3b7' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px', color: '#71717a' }}>
                        Service Requested: <strong style={{ color: '#18181b' }}>{inq.service}</strong>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: '1.5', color: '#18181b' }}>"{inq.message}"</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingTop: '12px', borderTop: '1px solid #c8c3b7' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <a href={`https://wa.me/${inq.email.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(inq.name)}!%20KLAPP%20Developers%20here.`} target="_blank" rel="noopener noreferrer" className="btn-action-outline" style={{ background: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0' }}>
                          <i className="ri-whatsapp-fill" style={{ color: '#22c55e' }}></i> WhatsApp
                        </a>
                        <a href={`mailto:${inq.email}`} className="btn-action-outline">
                          <i className="ri-mail-line"></i> Email
                        </a>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Status:</span>
                        <select 
                          value={inq.status} 
                          onChange={(e) => handleUpdateStatus(inq.id, e.target.value)}
                          style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #c8c3b7', background: '#fff', fontSize: '0.8rem', fontWeight: '700' }}
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="IN_PROGRESS">IN_PROGRESS</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                        <button onClick={() => handleDeleteInquiry(inq.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Delete">
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: PROJECTS & DELIVERABLES */}
          {activeTab === 'projects' && (
            <div>
              <div className="os-card" style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '14px' }}>Active KLAPP Projects</h3>
                {osData.projects.map(prj => (
                  <div key={prj.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: '#faf8f5', border: '1px solid #c8c3b7', borderRadius: '10px', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '1rem', color: '#18181b' }}>{prj.name}</div>
                      <div style={{ fontSize: '0.82rem', color: '#71717a' }}>Client: {prj.client} • Budget: ₹{prj.budget?.toLocaleString()} • Owner: {prj.owner}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="badge-status status-IN_PROGRESS">{prj.status}</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#71717a' }}>Due: {prj.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SHARED REAL MONTHLY CALENDAR */}
          {activeTab === 'calendar' && (
            <div>
              {/* CALENDAR HEADER TOOLBAR */}
              <div className="os-card" style={{ marginBottom: '16px', padding: '18px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0, textTransform: 'uppercase', color: '#18181b' }}>
                      {calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button 
                        onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))}
                        className="btn-action-outline" 
                        style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                      >
                        ◀ Prev
                      </button>
                      <button 
                        onClick={() => setCalendarDate(new Date())}
                        className="btn-action-outline" 
                        style={{ padding: '4px 10px', fontSize: '0.8rem', background: '#18181b', color: '#fff', borderColor: '#18181b' }}
                      >
                        Today
                      </button>
                      <button 
                        onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))}
                        className="btn-action-outline" 
                        style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                      >
                        Next ▶
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowAddMeetingModal(!showAddMeetingModal)}
                    className="btn-action-outline"
                    style={{ background: '#18181b', color: '#ffffff', borderColor: '#18181b', fontWeight: '700' }}
                  >
                    <i className="ri-calendar-event-line"></i> + Schedule Meeting
                  </button>
                </div>
              </div>

              {/* SCHEDULE MEETING FORM */}
              {showAddMeetingModal && (
                <div className="os-card" style={{ background: '#faf8f5', marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '12px' }}>Schedule New Meeting / Deadline</h4>
                  <form onSubmit={handleCreateMeeting}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Meeting Title</label>
                        <input type="text" required placeholder="e.g. Nandhakam Milestone Review" value={newMeeting.title} onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #c8c3b7' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Time & Day</label>
                        <input type="text" required placeholder="e.g. Today, 4:00 PM" value={newMeeting.time} onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #c8c3b7' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Google Meet Link</label>
                        <input type="text" required value={newMeeting.link} onChange={(e) => setNewMeeting({ ...newMeeting, link: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #c8c3b7' }} />
                      </div>
                    </div>
                    <button type="submit" className="btn-action-outline" style={{ background: '#18181b', color: '#fff' }}>Save to Shared Calendar</button>
                  </form>
                </div>
              )}

              {/* MONTHLY CALENDAR GRID (Sun - Sat) */}
              <div className="os-card">
                {/* DAY OF WEEK HEADER */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontWeight: '800', fontSize: '0.8rem', color: '#71717a', textTransform: 'uppercase', marginBottom: '10px' }}>
                  <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                </div>

                {/* DAYS MATRIX */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                  {(() => {
                    const year = calendarDate.getFullYear();
                    const month = calendarDate.getMonth();
                    const firstDayIndex = new Date(year, month, 1).getDay();
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    const todayDate = new Date();
                    const isCurrentMonth = todayDate.getFullYear() === year && todayDate.getMonth() === month;

                    const gridCells = [];
                    for (let i = 0; i < firstDayIndex; i++) {
                      gridCells.push(<div key={`blank-${i}`} style={{ height: '80px', background: '#fcfbf9', borderRadius: '8px', border: '1px solid #eae6dd' }}></div>);
                    }

                    for (let d = 1; d <= daysInMonth; d++) {
                      const isToday = isCurrentMonth && todayDate.getDate() === d;
                      const hasMeeting = d === todayDate.getDate() || d === 15;

                      gridCells.push(
                        <div 
                          key={`day-${d}`} 
                          style={{
                            height: '84px',
                            padding: '8px',
                            background: isToday ? '#eae6dd' : '#ffffff',
                            borderRadius: '8px',
                            border: isToday ? '2px solid #18181b' : '1px solid #c8c3b7',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            overflow: 'hidden'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.86rem', fontWeight: isToday ? '800' : '700', color: isToday ? '#18181b' : '#52525b' }}>
                              {d}
                            </span>
                            {isToday && <span style={{ fontSize: '0.65rem', background: '#18181b', color: '#fff', padding: '1px 5px', borderRadius: '4px', fontWeight: '800' }}>TODAY</span>}
                          </div>

                          {hasMeeting && (
                            <div style={{ background: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe', borderRadius: '4px', padding: '2px 4px', fontSize: '0.68rem', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              <i className="ri-video-line" style={{ marginRight: '2px' }}></i> Meet
                            </div>
                          )}
                        </div>
                      );
                    }
                    return gridCells;
                  })()}
                </div>
              </div>

              {/* SCHEDULED MEETINGS FEED */}
              <div className="os-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '14px' }}>All Shared Meetings & Milestones</h3>
                {osData.meetings.map(mtg => (
                  <div key={mtg.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: '#faf8f5', border: '1px solid #c8c3b7', borderRadius: '10px', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '0.98rem', color: '#18181b' }}>
                        <i className="ri-video-chat-line" style={{ marginRight: '6px', color: '#2563eb' }}></i> {mtg.title}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#71717a', marginTop: '2px' }}>Time: {mtg.time} • Attendees: {mtg.attendees}</div>
                    </div>
                    <a href={mtg.link} target="_blank" rel="noopener noreferrer" className="btn-action-outline">
                      Join Meet <i className="ri-external-link-line"></i>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CONTENT PLANNER */}
          {activeTab === 'content' && (
            <div>
              <div className="os-card">
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '14px' }}>Content & Social Media Workflow</h3>
                {osData.contentPlanner.map(cnt => (
                  <div key={cnt.id} style={{ padding: '16px', background: '#faf8f5', border: '1px solid #c8c3b7', borderRadius: '10px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ fontWeight: '800', fontSize: '1rem' }}>{cnt.title}</div>
                      <span className="badge-status status-NEW">{cnt.status}</span>
                    </div>
                    <p style={{ fontSize: '0.86rem', color: '#52525b', margin: '0 0 12px 0' }}>{cnt.notes}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: '#71717a' }}>Platform: {cnt.platform} • Author: {cnt.author}</span>
                      {cnt.status === 'READY_FOR_APPROVAL' && userRole === 'AASHISH' && (
                        <button onClick={() => handleApproveContent(cnt.id)} className="btn-action-outline" style={{ background: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0' }}>
                          <i className="ri-checkbox-circle-line"></i> Approve Post
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PERSONAL DISCIPLINE & ACCOUNTABILITY */}
          {activeTab === 'discipline' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '4px' }}>Personal Discipline & Transparency</h3>
                <p style={{ fontSize: '0.85rem', color: '#71717a' }}>Live mutual accountability between Aashish and Minni. No hiding.</p>
              </div>

              <div className="discipline-grid">
                {/* AASHISH DISCIPLINE CARD */}
                <div className="os-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #c8c3b7' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2563eb', color: '#fff', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>A</div>
                    <div>
                      <h4 style={{ margin: 0, fontWeight: '800' }}>Aashish (Founder)</h4>
                      <div style={{ fontSize: '0.75rem', color: '#71717a' }}>Mood: {osData.disciplineLogs.aashish.mood}</div>
                    </div>
                  </div>

                  {[
                    ['attendance', 'College Attendance'],
                    ['gym', 'Gym Workout'],
                    ['coding', 'Coding & Architecture (2+ hrs)'],
                    ['projectUpdate', 'Client Project Updates'],
                    ['clientFollowups', 'Client Follow-ups'],
                    ['sleep11pm', 'Sleep Before 11 PM'],
                    ['wake7am', 'Wake Before 7 AM'],
                    ['reading', 'Daily Reading'],
                    ['waterGoal', 'Water Goal (3L)']
                  ].map(([key, label]) => {
                    const done = osData.disciplineLogs.aashish[key];
                    return (
                      <div 
                        key={key} 
                        className="habit-row"
                        onClick={() => userRole === 'AASHISH' && handleToggleDisciplineItem('aashish', key)}
                      >
                        <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>{label}</span>
                        <span className={done ? 'state-badge-done' : 'state-badge-pending'}>
                          {done ? '✅ DONE' : '⏳ PENDING'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* MINNI DISCIPLINE CARD */}
                <div className="os-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #c8c3b7' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ec4899', color: '#fff', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>M</div>
                    <div>
                      <h4 style={{ margin: 0, fontWeight: '800' }}>Manashvini (Minni)</h4>
                      <div style={{ fontSize: '0.75rem', color: '#71717a' }}>Mood: {osData.disciplineLogs.minni.mood}</div>
                    </div>
                  </div>

                  {[
                    ['attendance', 'College Attendance'],
                    ['instaPosts2', '2 Instagram Posts'],
                    ['storiesCompleted', 'Stories Sequence Completed'],
                    ['coding', 'Coding & Development'],
                    ['clientFollowups', 'Client Follow-ups'],
                    ['contentPlanning', 'Content Planning'],
                    ['sleep11pm', 'Sleep Before 11 PM'],
                    ['wake7am', 'Wake Before 7 AM'],
                    ['waterGoal', 'Water Goal (3L)']
                  ].map(([key, label]) => {
                    const done = osData.disciplineLogs.minni[key];
                    return (
                      <div 
                        key={key} 
                        className="habit-row"
                        onClick={() => userRole === 'MINNI' && handleToggleDisciplineItem('minni', key)}
                      >
                        <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>{label}</span>
                        <span className={done ? 'state-badge-done' : 'state-badge-pending'}>
                          {done ? '✅ DONE' : '⏳ PENDING'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SHARED GOALS SECTION */}
              <div className="os-card" style={{ marginTop: '20px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '12px' }}>Shared Goals & Daily Co-Working</h4>
                {osData.sharedGoals.map(sg => (
                  <div 
                    key={sg.id} 
                    className="habit-row"
                    onClick={() => handleToggleSharedGoal(sg.id)}
                  >
                    <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>{sg.title}</span>
                    <span className={sg.completed ? 'state-badge-done' : 'state-badge-pending'}>
                      {sg.completed ? '✅ COMPLETED' : '⏳ PENDING'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: COMPETITION & STREAKS */}
          {activeTab === 'competition' && (
            <div>
              <div className="os-card" style={{ textAlign: 'center', padding: '36px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🏆</div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 6px 0' }}>Discipline Leaderboard & Streaks</h3>
                <p style={{ color: '#71717a', fontSize: '0.9rem', marginBottom: '24px' }}>Gamified consistency tracking between Aashish and Minni.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '500px', margin: '0 auto' }}>
                  <div style={{ background: '#faf8f5', border: '1px solid #c8c3b7', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#71717a' }}>AASHISH STREAK</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#2563eb' }}>12 Days 🔥</div>
                  </div>
                  <div style={{ background: '#faf8f5', border: '1px solid #c8c3b7', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#71717a' }}>MINNI STREAK</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ec4899' }}>14 Days 🔥</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: REVENUE & PROPOSALS */}
          {activeTab === 'revenue' && (
            <div>
              <div className="os-card" style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '14px' }}>Proposal & Quote Generator</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Package Scope</label>
                    <select value={calcService} onChange={(e) => setCalcService(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #c8c3b7' }}>
                      <option value="Starter Web App">Starter Web App (₹25,000 - ₹35,000)</option>
                      <option value="Custom Business Software">Custom Business Software (₹45,000 - ₹85,000)</option>
                      <option value="AI Agent & Automation">AI Agent & Automation (₹60,000 - ₹1,50,000)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Target Budget (₹)</label>
                    <input type="number" value={calcBudget} onChange={(e) => setCalcBudget(Number(e.target.value))} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #c8c3b7' }} />
                  </div>
                </div>

                <button 
                  onClick={() => {
                    const text = `Hi! KLAPP Developers Quote for ${calcService}:\n• Total Estimate: ₹${calcBudget.toLocaleString()}\n• 50% Milestone Advance\n• Guaranteed Sub-100ms Speed\nWhatsApp: +91 79890 33580`;
                    navigator.clipboard.writeText(text);
                    alert('📋 Proposal copied to clipboard!');
                  }}
                  className="btn-action-outline"
                >
                  <i className="ri-file-copy-line"></i> Copy Proposal Quote
                </button>
              </div>
            </div>
          )}

          {/* TAB 8: SMART REMINDERS */}
          {activeTab === 'reminders' && (
            <div>
              <div className="os-card">
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '14px' }}>Smart Reminder Engine</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ padding: '12px', background: '#faf8f5', border: '1px solid #c8c3b7', borderRadius: '8px' }}>
                    <strong>🌅 Morning (8:00 AM):</strong> Review Today's Priorities & Shared Goals
                  </div>
                  <div style={{ padding: '12px', background: '#faf8f5', border: '1px solid #c8c3b7', borderRadius: '8px' }}>
                    <strong>🌆 Evening (6:00 PM):</strong> Gym Workout & Coding Session Reminder
                  </div>
                  <div style={{ padding: '12px', background: '#faf8f5', border: '1px solid #c8c3b7', borderRadius: '8px' }}>
                    <strong>🌙 Night (10:30 PM):</strong> Update Discipline Dashboard & Sleep Before 11 PM
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: ADD LEAD */}
          {activeTab === 'addLead' && (
            <div className="os-card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '14px' }}>Add Manual Client Lead</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const newInq = { id: 'INQ-' + Date.now(), name: manualLead.name, email: manualLead.email, service: manualLead.service, message: manualLead.message, status: 'NEW', createdAt: new Date().toISOString() };
                setInquiries([newInq, ...inquiries]);
                setManualLead({ name: '', email: '', service: 'Website Development', message: '' });
                setActiveTab('inquiries');
                alert('✅ Lead added successfully!');
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Client Name</label>
                  <input type="text" required value={manualLead.name} onChange={(e) => setManualLead({ ...manualLead, name: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #c8c3b7' }} />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Email or Phone</label>
                  <input type="text" required value={manualLead.email} onChange={(e) => setManualLead({ ...manualLead, email: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #c8c3b7' }} />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Project Message / Scope</label>
                  <textarea required rows={3} value={manualLead.message} onChange={(e) => setManualLead({ ...manualLead, message: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #c8c3b7' }}></textarea>
                </div>
                <button type="submit" className="btn-action-outline">Save Lead</button>
              </form>
            </div>
          )}

          {/* TAB 10: SCRATCHPAD */}
          {activeTab === 'notes' && (
            <div className="os-card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '14px' }}>Agency Scratchpad</h3>
              <textarea 
                rows={10} 
                value={scratchpadText} 
                onChange={(e) => {
                  setScratchpadText(e.target.value);
                  localStorage.setItem('klapp_admin_scratchpad', e.target.value);
                }} 
                style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #c8c3b7', fontSize: '0.92rem', fontFamily: 'monospace' }}
              ></textarea>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
