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
        waterGoal: true,
        gym: true,
        protein: true,
        coding: true,
        dinner9pm: true,
        nightLeadCheck: true,
        sleep11pm: true,
        mood: '⚡ High Energy'
      },
      minni: {
        attendance: true,
        waterGoal: true,
        instaPost1: true,
        instaPost2: true,
        storiesCompleted: true,
        scheduleNextDayPosts: true,
        coding: true,
        dinner9pm: true,
        sleep11pm: true,
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
    phone: '',
    email: '',
    company: '',
    service: 'Website Development (Sub-100ms)',
    budget: '₹50,000 - ₹1,00,000',
    source: 'Instagram DM',
    priority: 'HOT (Closing Today)',
    owner: 'Minni (Client Ops)',
    deadline: '',
    message: ''
  });

  // Proposal Calculator State
  const [calcService, setCalcService] = useState('Starter Web App');
  const [calcBudget, setCalcBudget] = useState(35000);

  // Shared Interactive Calendar State
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [showAddMeetingModal, setShowAddMeetingModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'Meeting', // 'Meeting', 'Deadline', 'Birthday', 'Task'
    date: new Date().toISOString().split('T')[0],
    time: '16:00',
    client: 'General',
    attendees: 'Aashish & Minni',
    link: '#'
  });

  const formatTime12h = (timeStr) => {
    if (!timeStr) return 'All Day';
    if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
    const [h, m] = timeStr.split(':');
    if (!h) return timeStr;
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m || '00'} ${ampm}`;
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title) return;

    const evt = {
      id: 'EVT-' + Date.now(),
      title: newEvent.title.trim(),
      category: newEvent.category,
      date: newEvent.date,
      time: formatTime12h(newEvent.time),
      client: newEvent.client,
      attendees: newEvent.attendees,
      type: newEvent.category,
      link: newEvent.link || '#'
    };

    const updated = {
      ...osData,
      meetings: [evt, ...osData.meetings]
    };
    syncOSDataToBackend(updated);
    setNewEvent({ title: '', category: 'Meeting', date: new Date().toISOString().split('T')[0], time: '16:00', client: 'General', attendees: 'Aashish & Minni', link: '#' });
    setShowAddMeetingModal(false);
  };

  // Expenses Tracker State
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: 'Marketing'
  });

  const handleCreateExpense = (e) => {
    e.preventDefault();
    if (!newExpense.title || !newExpense.amount) return;

    const exp = {
      id: 'EXP-' + Date.now(),
      title: newExpense.title.trim(),
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      addedBy: userRole === 'MINNI' ? 'Minni' : 'Aashish',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };

    const updated = {
      ...osData,
      expenses: [exp, ...(osData.expenses || [])]
    };
    syncOSDataToBackend(updated);
    setNewExpense({ title: '', amount: '', category: 'Marketing' });
  };

  // Content Planner Creation State
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [newContent, setNewContent] = useState({
    title: '',
    platform: 'Instagram Reel',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleCreateContent = (e) => {
    e.preventDefault();
    if (!newContent.title) return;

    const postDate = new Date(newContent.date);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = dayNames[postDate.getDay()] || 'Monday';

    const post = {
      id: 'CNT-' + Date.now(),
      title: newContent.title.trim(),
      platform: newContent.platform,
      status: 'DRAFT',
      date: newContent.date,
      dayOfWeek: dayOfWeek,
      notes: newContent.notes || 'Drafted content post idea',
      author: userRole === 'MINNI' ? 'Minni' : 'Aashish',
      approvedBy: '',
      aashishLiked: userRole === 'AASHISH',
      minniLiked: userRole === 'MINNI'
    };

    const updated = {
      ...osData,
      contentPlanner: [post, ...osData.contentPlanner]
    };
    syncOSDataToBackend(updated);
    setNewContent({ title: '', platform: 'Instagram Reel', date: new Date().toISOString().split('T')[0], notes: '' });
    setShowAddContentModal(false);
  };

  // Selected Day Filter for Mon-Sat Weekly Matrix
  const [selectedContentDay, setSelectedContentDay] = useState('ALL');

  const handleToggleContentLike = (contentId, person) => {
    if (person === 'aashish' && userRole !== 'AASHISH') return;
    if (person === 'minni' && userRole !== 'MINNI') return;

    const updatedPlanner = osData.contentPlanner.map(item => {
      if (item.id === contentId) {
        const aashishLiked = person === 'aashish' ? !item.aashishLiked : item.aashishLiked;
        const minniLiked = person === 'minni' ? !item.minniLiked : item.minniLiked;
        const isBothApproved = aashishLiked && minniLiked;
        return {
          ...item,
          aashishLiked,
          minniLiked,
          status: isBothApproved ? 'APPROVED' : (item.status === 'PUBLISHED' ? 'PUBLISHED' : 'READY_FOR_APPROVAL'),
          approvedBy: isBothApproved ? 'Aashish & Minni' : (aashishLiked ? 'Aashish' : (minniLiked ? 'Minni' : ''))
        };
      }
      return item;
    });

    const updated = { ...osData, contentPlanner: updatedPlanner };
    syncOSDataToBackend(updated);
  };

  const handlePublishContent = (contentId) => {
    const updatedPlanner = osData.contentPlanner.map(item => 
      item.id === contentId ? { ...item, status: 'PUBLISHED' } : item
    );
    const updated = { ...osData, contentPlanner: updatedPlanner };
    syncOSDataToBackend(updated);
  };

  // Minni & Aashish Confirmed Project Creation State
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [projectStatusFilter, setProjectStatusFilter] = useState('ALL');
  const [newProject, setNewProject] = useState({
    name: '',
    client: '',
    phone: '',
    requirements: '',
    service: 'Website Development',
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    budget: '',
    advancePaid: ''
  });

  const [expandedProjectIds, setExpandedProjectIds] = useState({});
  const toggleExpandProject = (id) => {
    setExpandedProjectIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProject.name || !newProject.budget) return;

    const budgetVal = parseFloat(newProject.budget) || 0;
    const advanceVal = parseFloat(newProject.advancePaid) || 0;
    const pendingVal = Math.max(0, budgetVal - advanceVal);

    const prj = {
      id: 'PRJ-' + Date.now(),
      name: newProject.name.trim(),
      client: newProject.client.trim() || 'Client',
      phone: newProject.phone.trim() || '+91 98765 43210',
      requirements: newProject.requirements.trim() || 'Standard Project Scope',
      service: newProject.service,
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: newProject.dueDate,
      budget: budgetVal,
      advancePaid: advanceVal,
      pendingAmount: pendingVal,
      owner: userRole === 'MINNI' ? 'Minni' : 'Aashish',
      lastFollowedUpBy: '',
      lastFollowedUpAt: ''
    };

    // AUTO-FEED DEADLINE TO SHARED CALENDAR (MEETINGS)
    const deadlineMeeting = {
      id: 'MTG-PRJ-' + Date.now(),
      title: `🏁 Project Deadline: ${prj.name}`,
      time: '11:59 PM',
      client: prj.client,
      attendees: 'Aashish & Minni',
      type: 'Project Milestone Deadline',
      date: prj.dueDate,
      link: '#'
    };

    const updated = {
      ...osData,
      projects: [prj, ...(osData.projects || [])],
      meetings: [deadlineMeeting, ...(osData.meetings || [])]
    };

    syncOSDataToBackend(updated);
    setNewProject({ name: '', client: '', phone: '', requirements: '', service: 'Website Development', dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0], budget: '', advancePaid: '' });
    setShowAddProjectModal(false);
  };

  const handleFollowUpCall = (projectId) => {
    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const currentUserName = userRole === 'MINNI' ? 'Minni' : 'Aashish';

    const updatedProjects = (osData.projects || []).map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          lastFollowedUpBy: currentUserName,
          lastFollowedUpAt: todayStr
        };
      }
      return p;
    });

    const updated = { ...osData, projects: updatedProjects };
    syncOSDataToBackend(updated);
  };

  const handleRecordIncrementalPayment = (projectId, paymentReceived) => {
    const amt = parseFloat(paymentReceived) || 0;
    if (amt <= 0) return;

    const updatedProjects = (osData.projects || []).map(p => {
      if (p.id === projectId) {
        const newAdvance = (p.advancePaid || 0) + amt;
        const newPending = Math.max(0, (p.budget || 0) - newAdvance);
        return { ...p, advancePaid: newAdvance, pendingAmount: newPending };
      }
      return p;
    });

    const updated = { ...osData, projects: updatedProjects };
    syncOSDataToBackend(updated);
  };

  const handleMarkFullyPaid = (projectId) => {
    const updatedProjects = (osData.projects || []).map(p => {
      if (p.id === projectId) {
        return { ...p, advancePaid: p.budget || 0, pendingAmount: 0 };
      }
      return p;
    });

    const updated = { ...osData, projects: updatedProjects };
    syncOSDataToBackend(updated);
  };

  const handleUpdateProjectPayment = (projectId, newAdvance) => {
    const updatedProjects = (osData.projects || []).map(p => {
      if (p.id === projectId) {
        const adv = parseFloat(newAdvance) || 0;
        const pend = Math.max(0, (p.budget || 0) - adv);
        return { ...p, advancePaid: adv, pendingAmount: pend };
      }
      return p;
    });

    const updated = { ...osData, projects: updatedProjects };
    syncOSDataToBackend(updated);
  };

  // Minni Project Progress Updater
  const handleUpdateProjectProgress = (prjId, newStatus) => {
    const updatedProjects = osData.projects.map(p => p.id === prjId ? { ...p, status: newStatus } : p);
    const updated = { ...osData, projects: updatedProjects };
    syncOSDataToBackend(updated);
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

            <button className={`sidebar-nav-btn ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>
              <span><i className="ri-instagram-line" style={{ marginRight: '8px' }}></i> Content Planner</span>
              <span className="sidebar-badge">{osData.contentPlanner.length}</span>
            </button>

            <button className={`sidebar-nav-btn ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>
              <span><i className="ri-calendar-event-line" style={{ marginRight: '8px' }}></i> Shared Calendar</span>
              <span className="sidebar-badge">{osData.meetings.length}</span>
            </button>

            <button className={`sidebar-nav-btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
              <span><i className="ri-folder-line" style={{ marginRight: '8px' }}></i> Projects & Board</span>
              <span className="sidebar-badge">{osData.projects.length}</span>
            </button>

            <button className={`sidebar-nav-btn ${activeTab === 'revenue' ? 'active' : ''}`} onClick={() => setActiveTab('revenue')}>
              <span><i className="ri-calculator-line" style={{ marginRight: '8px' }}></i> Revenue & Expenses</span>
            </button>

            <button className={`sidebar-nav-btn ${activeTab === 'discipline' ? 'active' : ''}`} onClick={() => setActiveTab('discipline')}>
              <span><i className="ri-shield-user-line" style={{ marginRight: '8px' }}></i> Daily Routine & Habits</span>
              <span className="sidebar-badge" style={{ background: '#22c55e', color: '#fff' }}>Live</span>
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

          {/* TAB 2: CONFIRMED PROJECTS & DELIVERABLES BOARD */}
          {activeTab === 'projects' && (
            <div>
              {/* TOP STATUS METRICS COUNTERS FOR PROJECTS */}
              {(() => {
                const totalPrjs = (osData.projects || []).length;
                const inProgressCount = (osData.projects || []).filter(p => p.status === 'IN_PROGRESS' || p.status === 'PLANNING').length;
                const reviewCount = (osData.projects || []).filter(p => p.status === 'REVIEW').length;
                const completedCount = (osData.projects || []).filter(p => p.status === 'COMPLETED').length;

                return (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                    <div className="os-card" style={{ marginBottom: 0, padding: '16px' }}>
                      <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#71717a', textTransform: 'uppercase', marginBottom: '4px' }}>Total Active Projects</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#18181b' }}>{totalPrjs}</div>
                    </div>

                    <div className="os-card" style={{ marginBottom: 0, padding: '16px', background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                      <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#1d4ed8', textTransform: 'uppercase', marginBottom: '4px' }}>⚡ In Progress</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#2563eb' }}>{inProgressCount}</div>
                    </div>

                    <div className="os-card" style={{ marginBottom: 0, padding: '16px', background: '#fffbeb', border: '1px solid #fde68a' }}>
                      <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#b45309', textTransform: 'uppercase', marginBottom: '4px' }}>🔍 Client Review</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#d97706' }}>{reviewCount}</div>
                    </div>

                    <div className="os-card" style={{ marginBottom: 0, padding: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                      <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#166534', textTransform: 'uppercase', marginBottom: '4px' }}>✅ Completed</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#15803d' }}>{completedCount}</div>
                    </div>
                  </div>
                );
              })()}

              <div className="os-card" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0 }}>Confirmed Projects & Deliverables</h3>
                  
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* STATUS FILTER PILLS */}
                    <div style={{ display: 'flex', background: '#e4e4e7', padding: '3px', borderRadius: '8px', gap: '2px' }}>
                      {['ALL', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'].map(st => {
                        let label = 'All';
                        if (st === 'IN_PROGRESS') label = 'In Progress';
                        if (st === 'REVIEW') label = 'Client Review';
                        if (st === 'COMPLETED') label = 'Completed';

                        return (
                          <button
                            key={st}
                            onClick={() => setProjectStatusFilter(st)}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              border: 'none',
                              background: projectStatusFilter === st ? '#ffffff' : 'transparent',
                              color: projectStatusFilter === st ? '#18181b' : '#52525b',
                              fontWeight: '700',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              boxShadow: projectStatusFilter === st ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                            }}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>

                    <button 
                      onClick={() => setShowAddProjectModal(!showAddProjectModal)}
                      className="btn-action-outline"
                      style={{ background: '#ffffff', color: '#18181b', borderColor: '#c8c3b7', fontWeight: '700', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
                    >
                      <i className="ri-add-line" style={{ color: '#2563eb', marginRight: '4px' }}></i> Add Confirmed Project
                    </button>
                  </div>
                </div>

                {/* ADD CONFIRMED PROJECT FORM MODAL/CARD */}
                {showAddProjectModal && (
                  <div style={{ background: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '18px', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#27272a', marginBottom: '14px' }}>Add New Confirmed Project</h4>
                    <form onSubmit={handleCreateProject}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                        <div>
                          <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#52525b', display: 'block', marginBottom: '5px' }}>Project Title *</label>
                          <input type="text" required placeholder="" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d4d4d8', background: '#fff', fontSize: '0.85rem' }} />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#52525b', display: 'block', marginBottom: '5px' }}>Client Name</label>
                          <input type="text" required placeholder="" value={newProject.client} onChange={(e) => setNewProject({ ...newProject, client: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d4d4d8', background: '#fff', fontSize: '0.85rem' }} />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#52525b', display: 'block', marginBottom: '5px' }}>Client Phone Number 📞</label>
                          <input type="text" placeholder="" value={newProject.phone} onChange={(e) => setNewProject({ ...newProject, phone: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d4d4d8', background: '#fff', fontSize: '0.85rem' }} />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#52525b', display: 'block', marginBottom: '5px' }}>Agreed Budget (₹) *</label>
                          <input type="number" required placeholder="" value={newProject.budget} onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d4d4d8', background: '#fff', fontSize: '0.85rem' }} />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#52525b', display: 'block', marginBottom: '5px' }}>Advance Paid / Received (₹)</label>
                          <input type="number" placeholder="" value={newProject.advancePaid} onChange={(e) => setNewProject({ ...newProject, advancePaid: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d4d4d8', background: '#fff', fontSize: '0.85rem' }} />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#52525b', display: 'block', marginBottom: '5px' }}>Deadline Date (Auto-syncs to Calendar)</label>
                          <input type="date" required value={newProject.dueDate} onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d4d4d8', background: '#fff', fontSize: '0.85rem' }} />
                        </div>
                      </div>

                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#52525b', display: 'block', marginBottom: '5px' }}>Project Scope & Deliverables Requirements</label>
                        <textarea rows={3} placeholder="" value={newProject.requirements} onChange={(e) => setNewProject({ ...newProject, requirements: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d4d4d8', background: '#fff', fontSize: '0.85rem', fontFamily: 'inherit' }}></textarea>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={() => setShowAddProjectModal(false)} className="btn-action-outline" style={{ background: '#ffffff', color: '#71717a', borderColor: '#d4d4d8', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', fontSize: '0.82rem' }}>
                          Cancel
                        </button>
                        <button type="submit" className="btn-action-outline" style={{ background: '#ffffff', color: '#166534', borderColor: '#bbf7d0', padding: '8px 20px', borderRadius: '8px', fontWeight: '700', fontSize: '0.82rem' }}>
                          Save Project & Feed to Calendar
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* CLEAN CONFIRMED PROJECT LIST CARDS */}
                {(() => {
                  const filteredProjects = (osData.projects || []).filter(p => {
                    if (projectStatusFilter === 'ALL') return true;
                    if (projectStatusFilter === 'IN_PROGRESS') return p.status === 'IN_PROGRESS' || p.status === 'PLANNING';
                    return p.status === projectStatusFilter;
                  });

                  if (filteredProjects.length === 0) {
                    return (
                      <div style={{ textAlign: 'center', padding: '24px', color: '#71717a', fontSize: '0.88rem' }}>
                        No projects found under {projectStatusFilter} status.
                      </div>
                    );
                  }

                  return filteredProjects.map(prj => {
                    const isExpanded = !!expandedProjectIds[prj.id];
                    const pending = prj.pendingAmount !== undefined ? prj.pendingAmount : Math.max(0, (prj.budget || 0) - (prj.advancePaid || 0));

                    return (
                      <div key={prj.id} style={{ background: '#faf8f5', border: '1px solid #c8c3b7', borderRadius: '12px', marginBottom: '14px', overflow: 'hidden' }}>
                        {/* CARD HEADER (CLICKABLE TO TOGGLE ACCORDION) */}
                        <div 
                          style={{ padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', cursor: 'pointer', background: isExpanded ? '#f4f4f5' : '#faf8f5' }}
                          onClick={(e) => {
                            if (e.target.tagName !== 'SELECT' && e.target.tagName !== 'OPTION') {
                              toggleExpandProject(prj.id);
                            }
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: '800', fontSize: '1.05rem', color: '#18181b' }}>
                              {prj.name}
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onClick={(e) => e.stopPropagation()}>
                            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#71717a' }}>Status:</span>
                            <select 
                              value={prj.status}
                              onChange={(e) => handleUpdateProjectProgress(prj.id, e.target.value)}
                              style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #c8c3b7', background: '#fff', fontSize: '0.78rem', fontWeight: '700' }}
                            >
                              <option value="IN_PROGRESS">⚡ In Progress</option>
                              <option value="REVIEW">🔍 Client Review</option>
                              <option value="COMPLETED">✅ Completed</option>
                              <option value="PAUSED">⏸️ Paused</option>
                            </select>
                          </div>
                        </div>

                        {/* ALWAYS SHOWN: SHORT DELIVERABLES SCOPE IF NOT EXPANDED */}
                        {!isExpanded && prj.requirements && (
                          <div style={{ padding: '12px 18px', background: '#ffffff', borderTop: '1px solid #e4e4e7' }}>
                            <p style={{ fontSize: '0.84rem', color: '#3f3f46', margin: '0', lineHeight: '1.4' }}>
                              <strong>Scope:</strong> {prj.requirements}
                            </p>
                          </div>
                        )}

                        {/* EXPANDED SECTION: ALL FULL ORDER DETAILS */}
                        {isExpanded && (
                          <div style={{ padding: '18px', background: '#ffffff', borderTop: '1px solid #e4e4e7' }}>
                            <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#18181b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <i className="ri-file-list-3-line" style={{ color: '#2563eb' }}></i> Full Confirmed Order & Client Metadata
                            </h4>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '14px', background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                              <div>
                                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '600', display: 'block' }}>👤 Client Name</span>
                                <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{prj.client}</strong>
                              </div>

                              <div>
                                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '600', display: 'block' }}>📞 Phone Number</span>
                                <a href={`tel:${prj.phone || ''}`} style={{ fontSize: '0.88rem', color: '#2563eb', fontWeight: '700', textDecoration: 'none' }}>
                                  {prj.phone || '+91 98765 43210'}
                                </a>
                              </div>

                              <div>
                                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '600', display: 'block' }}>🛠️ Service Required</span>
                                <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{prj.service || 'Website Development'}</strong>
                              </div>

                              <div>
                                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '600', display: 'block' }}>📅 Deadline Date</span>
                                <strong style={{ fontSize: '0.88rem', color: '#1e40af' }}>{prj.dueDate || 'TBD'}</strong>
                              </div>

                              <div>
                                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '600', display: 'block' }}>💰 Total Agreed Budget</span>
                                <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>₹{(prj.budget || 0).toLocaleString()}</strong>
                              </div>

                              <div>
                                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '600', display: 'block' }}>💵 Advance Paid</span>
                                <strong style={{ fontSize: '0.9rem', color: '#15803d' }}>₹{(prj.advancePaid || 0).toLocaleString()}</strong>
                              </div>

                              <div>
                                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '600', display: 'block' }}>⏳ Pending Balance</span>
                                <strong style={{ fontSize: '0.9rem', color: pending > 0 ? '#d97706' : '#15803d' }}>
                                  {pending > 0 ? `₹${pending.toLocaleString()} Due` : '✓ 100% Paid'}
                                </strong>
                              </div>

                              <div>
                                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '600', display: 'block' }}>👤 Order Created By</span>
                                <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{prj.owner || 'Aashish'}</strong>
                              </div>
                            </div>

                            {/* FULL DELIVERABLES SCOPE */}
                            <div>
                              <span style={{ fontSize: '0.76rem', color: '#475569', fontWeight: '700', display: 'block', marginBottom: '6px' }}>
                                📝 Complete Scope & Requirements Specification:
                              </span>
                              <div style={{ fontSize: '0.86rem', color: '#334155', lineHeight: '1.6', background: '#f1f5f9', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', whiteSpace: 'pre-wrap' }}>
                                {prj.requirements || 'No extra requirements specified.'}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* TAB 3: SHARED REAL MONTHLY CALENDAR */}
          {activeTab === 'calendar' && (
            <div>
              {/* CALENDAR HEADER TOOLBAR */}
              <div className="os-card" style={{ marginBottom: '16px', padding: '18px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, textTransform: 'uppercase', color: '#18181b' }}>
                      {calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button 
                        onClick={() => {
                          setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
                          setSelectedDay(1);
                        }}
                        style={{ border: '1px solid #c8c3b7', background: '#fff', padding: '5px 9px', borderRadius: '7px', cursor: 'pointer', color: '#18181b', display: 'flex', alignItems: 'center' }}
                        title="Previous Month"
                      >
                        <i className="ri-arrow-left-s-line" style={{ fontSize: '1.1rem' }}></i>
                      </button>

                      <button 
                        onClick={() => {
                          setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
                          setSelectedDay(1);
                        }}
                        style={{ border: '1px solid #c8c3b7', background: '#fff', padding: '5px 9px', borderRadius: '7px', cursor: 'pointer', color: '#18181b', display: 'flex', alignItems: 'center' }}
                        title="Next Month"
                      >
                        <i className="ri-arrow-right-s-line" style={{ fontSize: '1.1rem' }}></i>
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowAddMeetingModal(!showAddMeetingModal)}
                    className="btn-action-outline"
                    style={{ background: '#ffffff', color: '#18181b', borderColor: '#c8c3b7', fontWeight: '700', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
                  >
                    <i className="ri-calendar-event-line" style={{ color: '#2563eb' }}></i> + Add Event / Reminder
                  </button>
                </div>
              </div>

              {/* SCHEDULE EVENT FORM */}
              {showAddMeetingModal && (
                <div className="os-card" style={{ background: '#faf8f5', marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '12px' }}>Add Event, Milestone, or Reminder</h4>
                  <form onSubmit={handleCreateEvent}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Category</label>
                        <select 
                          value={newEvent.category} 
                          onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #c8c3b7', background: '#fff', fontSize: '0.85rem', fontWeight: '700' }}
                        >
                          <option value="Meeting">🎥 Meeting (Google Meet)</option>
                          <option value="Deadline">⏳ Project Deadline & Sprint</option>
                          <option value="Birthday">🎂 Birthday & Celebration</option>
                          <option value="Payment">💳 Client Invoice & Payment Due</option>
                          <option value="Launch">🚀 Product & Feature Launch</option>
                          <option value="Marketing">📢 Marketing & Social Post</option>
                          <option value="Task">📝 Personal Task & Reminder</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Event Title</label>
                        <input type="text" required placeholder="e.g. Client Milestone Review / Sprint Demo" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #c8c3b7' }} />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Select Date</label>
                        <input 
                          type="date" 
                          required 
                          value={newEvent.date} 
                          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} 
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #c8c3b7', background: '#fff', fontSize: '0.85rem', fontWeight: '600' }} 
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Select Time</label>
                        <input 
                          type="time" 
                          required 
                          value={newEvent.time} 
                          onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} 
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #c8c3b7', background: '#fff', fontSize: '0.85rem', fontWeight: '600' }} 
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Meet Link / Note (Optional)</label>
                        <input type="text" placeholder="https://meet.google.com/..." value={newEvent.link} onChange={(e) => setNewEvent({ ...newEvent, link: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #c8c3b7' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end', marginTop: '16px' }}>
                      <button 
                        type="submit" 
                        className="btn-action-outline" 
                        style={{ 
                          background: '#ffffff', 
                          color: '#18181b', 
                          borderColor: '#c8c3b7', 
                          padding: '9px 20px', 
                          borderRadius: '10px', 
                          fontWeight: '800', 
                          fontSize: '0.85rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                        }}
                      >
                        <i className="ri-check-line" style={{ fontSize: '1rem', color: '#16a34a' }}></i> Save Event
                      </button>

                      <button 
                        type="button" 
                        onClick={() => setShowAddMeetingModal(false)}
                        className="btn-action-outline" 
                        style={{ 
                          background: '#ffffff', 
                          color: '#71717a', 
                          borderColor: '#c8c3b7', 
                          padding: '9px 16px', 
                          borderRadius: '10px', 
                          fontWeight: '700', 
                          fontSize: '0.85rem' 
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* MONTHLY CALENDAR GRID (Sun - Sat) */}
              <div className="os-card">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontWeight: '800', fontSize: '0.8rem', color: '#71717a', textTransform: 'uppercase', marginBottom: '10px' }}>
                  <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                </div>

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
                      const isSelected = selectedDay === d;
                      const dayEvents = osData.meetings.filter(evt => {
                        if (!evt.date) return d === 31;
                        const dayNum = parseInt(evt.date.split('-').pop() || evt.date);
                        return dayNum === d;
                      });

                      gridCells.push(
                        <div 
                          key={`day-${d}`} 
                          onClick={() => setSelectedDay(d)}
                          style={{
                            height: '84px',
                            padding: '8px',
                            background: isSelected ? '#eff6ff' : (isToday ? '#eae6dd' : '#ffffff'),
                            borderRadius: '8px',
                            border: isSelected ? '2px solid #2563eb' : (isToday ? '2px solid #18181b' : '1px solid #c8c3b7'),
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            overflow: 'hidden',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.86rem', fontWeight: (isToday || isSelected) ? '800' : '700', color: isSelected ? '#2563eb' : (isToday ? '#18181b' : '#52525b') }}>
                              {d}
                            </span>
                            {isToday && <span style={{ fontSize: '0.65rem', background: '#18181b', color: '#fff', padding: '1px 5px', borderRadius: '4px', fontWeight: '800' }}>TODAY</span>}
                          </div>

                          {dayEvents.length > 0 && (
                            <div style={{ background: dayEvents[0].category === 'Birthday' ? '#fce7f3' : '#dbeafe', color: dayEvents[0].category === 'Birthday' ? '#be185d' : '#1e40af', border: dayEvents[0].category === 'Birthday' ? '1px solid #fbcfe8' : '1px solid #bfdbfe', borderRadius: '4px', padding: '2px 4px', fontSize: '0.68rem', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              <i className={dayEvents[0].category === 'Birthday' ? 'ri-cake-2-line' : 'ri-calendar-event-line'} style={{ marginRight: '2px' }}></i> {dayEvents[0].title}
                            </div>
                          )}
                        </div>
                      );
                    }
                    return gridCells;
                  })()}
                </div>
              </div>

              {/* SELECTED DATE MEETINGS & EVENTS FEED */}
              <div className="os-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="ri-calendar-check-line" style={{ color: '#2563eb' }}></i>
                    Schedule & Reminders for {calendarDate.toLocaleDateString('en-US', { month: 'long' })} {selectedDay}, {calendarDate.getFullYear()}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#71717a', fontWeight: '600' }}>
                    Click any day in calendar grid to view schedule
                  </span>
                </div>

                {(() => {
                  const selectedEvents = osData.meetings.filter(evt => {
                    if (!evt.date) return selectedDay === 31;
                    const dayNum = parseInt(evt.date.split('-').pop() || evt.date);
                    return dayNum === selectedDay;
                  });

                  if (selectedEvents.length === 0) {
                    return (
                      <div style={{ textAlign: 'center', padding: '28px', color: '#71717a', fontSize: '0.88rem' }}>
                        No events or reminders scheduled for {calendarDate.toLocaleDateString('en-US', { month: 'long' })} {selectedDay}, {calendarDate.getFullYear()}.
                      </div>
                    );
                  }

                  return selectedEvents.map(evt => {
                    const cat = evt.category || evt.type || 'Meeting';
                    
                    let bg = '#faf8f5';
                    let border = '1px solid #c8c3b7';
                    let titleColor = '#18181b';
                    let iconClass = 'ri-video-chat-line';
                    let iconColor = '#2563eb';

                    if (cat === 'Birthday' || evt.title.toLowerCase().includes('bday') || evt.title.toLowerCase().includes('birthday')) {
                      bg = '#fdf2f8'; border = '1px solid #fbcfe8'; titleColor = '#be185d'; iconClass = 'ri-cake-2-line'; iconColor = '#ec4899';
                    } else if (cat === 'Deadline') {
                      bg = '#fffbe6'; border = '1px solid #fef08a'; titleColor = '#854d0e'; iconClass = 'ri-timer-line'; iconColor = '#d97706';
                    } else if (cat === 'Payment') {
                      bg = '#f0fdf4'; border = '1px solid #bbf7d0'; titleColor = '#166534'; iconClass = 'ri-money-dollar-circle-line'; iconColor = '#16a34a';
                    } else if (cat === 'Launch') {
                      bg = '#faf5ff'; border = '1px solid #e9d5ff'; titleColor = '#6b21a8'; iconClass = 'ri-rocket-line'; iconColor = '#9333ea';
                    } else if (cat === 'Marketing') {
                      bg = '#fff7ed'; border = '1px solid #ffedd5'; titleColor = '#9a3412'; iconClass = 'ri-megaphone-line'; iconColor = '#ea580c';
                    } else if (cat === 'Task') {
                      bg = '#f8fafc'; border = '1px solid #cbd5e1'; titleColor = '#334155'; iconClass = 'ri-checkbox-circle-line'; iconColor = '#64748b';
                    }

                    return (
                      <div key={evt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: bg, border: border, borderRadius: '10px', marginBottom: '10px' }}>
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '0.98rem', color: titleColor }}>
                            <i className={iconClass} style={{ marginRight: '6px', color: iconColor }}></i>
                            {evt.title}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: '#71717a', marginTop: '2px' }}>
                            Category: <strong>{cat}</strong> • Time: {evt.time} • Date: {evt.date || 'Jul 31'} • Attendees: {evt.attendees}
                          </div>
                        </div>
                        {evt.link && evt.link !== '#' && (
                          <a href={evt.link} target="_blank" rel="noopener noreferrer" className="btn-action-outline">
                            Join Meet <i className="ri-external-link-line"></i>
                          </a>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* TAB 4: CONTENT PLANNER & WEEKLY SOCIAL MATRIX */}
          {activeTab === 'content' && (
            <div>
              {/* TOP 6-DAY WEEKLY MATRIX (MON TO SAT) */}
              <div className="os-card" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0 }}>Weekly Content Matrix</h3>
                  </div>

                  <button 
                    onClick={() => setShowAddContentModal(!showAddContentModal)}
                    className="btn-action-outline"
                    style={{ background: '#ffffff', color: '#18181b', borderColor: '#c8c3b7', fontWeight: '700', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
                  >
                    <i className="ri-add-line" style={{ color: '#2563eb' }}></i> Add Content Post / Reel
                  </button>
                </div>

                {/* 6-DAY MON-SAT WEEKLY GRID (STRICT ASIA/KOLKATA TIMEZONE) */}
                {(() => {
                  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                  
                  // Strict Kolkata Date Calculation
                  const nowKolkata = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
                  const currentDayIdx = nowKolkata.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat

                  // Calculate Monday of current week in Kolkata time
                  const distFromMon = currentDayIdx === 0 ? 6 : currentDayIdx - 1;
                  const mondayDate = new Date(nowKolkata);
                  mondayDate.setDate(nowKolkata.getDate() - distFromMon);

                  const weekDays = dayNames.map((dName, idx) => {
                    const dayDate = new Date(mondayDate);
                    dayDate.setDate(mondayDate.getDate() + idx);

                    const dateNum = dayDate.getDate();
                    const isToday = nowKolkata.toDateString() === dayDate.toDateString();
                    const dayPosts = osData.contentPlanner.filter(c => 
                      c.dayOfWeek === dName || 
                      (c.date && new Date(new Date(c.date).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })).toLocaleDateString('en-US', { weekday: 'long' }) === dName)
                    );

                    return {
                      dName,
                      dateNum,
                      isToday,
                      dayPosts
                    };
                  });

                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
                      {weekDays.map(({ dName, dateNum, isToday, dayPosts }) => {
                        const isSelected = selectedContentDay === dName;

                        return (
                          <div 
                            key={dName} 
                            onClick={() => setSelectedContentDay(isSelected ? 'ALL' : dName)}
                            style={{ 
                              background: isSelected ? '#eff6ff' : (isToday ? '#faf8f5' : '#ffffff'),
                              border: isSelected ? '2px solid #2563eb' : (isToday ? '2px solid #18181b' : '1px solid #c8c3b7'),
                              borderRadius: '10px',
                              padding: '12px 10px',
                              textAlign: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', color: isSelected ? '#2563eb' : (isToday ? '#18181b' : '#71717a') }}>
                              {dName.slice(0, 3)}
                            </div>
                            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#18181b', margin: '2px 0' }}>
                              {dateNum}
                            </div>
                            <div style={{ fontSize: '0.68rem', fontWeight: '700', color: isToday ? '#166534' : '#71717a' }}>
                              {isToday ? '📍 TODAY' : `${dayPosts.length} Ideas`}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* ADD CONTENT FORM CARD (CLEAN LIGHT DESIGN, NO PLACEHOLDERS) */}
                {showAddContentModal && (
                  <div style={{ background: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '18px', marginTop: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#27272a', marginBottom: '14px' }}>Create New Social Post Concept</h4>
                    <form onSubmit={handleCreateContent}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                        <div>
                          <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#52525b', display: 'block', marginBottom: '5px' }}>Post Title / Headline *</label>
                          <input type="text" required placeholder="" value={newContent.title} onChange={(e) => setNewContent({ ...newContent, title: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d4d4d8', background: '#fff', fontSize: '0.85rem', color: '#18181b' }} />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#52525b', display: 'block', marginBottom: '5px' }}>Platform Format</label>
                          <select value={newContent.platform} onChange={(e) => setNewContent({ ...newContent, platform: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d4d4d8', background: '#fff', fontSize: '0.85rem', fontWeight: '600', color: '#27272a' }}>
                            <option value="Instagram Reel">📸 Instagram Reel</option>
                            <option value="Instagram Carousel / Post">🖼️ Instagram Carousel / Post</option>
                            <option value="Instagram Story">📲 Instagram Story Sequence</option>
                            <option value="LinkedIn Post">💼 LinkedIn Tech Post</option>
                            <option value="YouTube Short">▶️ YouTube Short</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#52525b', display: 'block', marginBottom: '5px' }}>Target Schedule Date</label>
                          <input type="date" required value={newContent.date} onChange={(e) => setNewContent({ ...newContent, date: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d4d4d8', background: '#fff', fontSize: '0.85rem', fontWeight: '600', color: '#27272a' }} />
                        </div>
                      </div>

                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#52525b', display: 'block', marginBottom: '5px' }}>Strategy Notes & Script Hook</label>
                        <textarea rows={3} placeholder="" value={newContent.notes} onChange={(e) => setNewContent({ ...newContent, notes: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d4d4d8', background: '#fff', fontSize: '0.85rem', color: '#18181b', fontFamily: 'inherit' }}></textarea>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={() => setShowAddContentModal(false)} className="btn-action-outline" style={{ background: '#ffffff', color: '#71717a', borderColor: '#d4d4d8', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', fontSize: '0.82rem' }}>
                          Cancel
                        </button>
                        <button type="submit" className="btn-action-outline" style={{ background: '#ffffff', color: '#166534', borderColor: '#bbf7d0', padding: '8px 20px', borderRadius: '8px', fontWeight: '700', fontSize: '0.82rem' }}>
                          Save Post Idea
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {/* CONTENT POST FEED WITH DUAL LIKES & PUBLISH CLOSING BUTTON */}
              <div className="os-card">
                <h4 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '14px' }}>
                  {selectedContentDay === 'ALL' ? 'All Weekly Content Ideas' : `${selectedContentDay} Content Pipeline`}
                </h4>

                {(() => {
                  const filtered = osData.contentPlanner.filter(cnt => {
                    if (selectedContentDay === 'ALL') return true;
                    const dName = cnt.dayOfWeek || (cnt.date && new Date(cnt.date).toLocaleDateString('en-US', { weekday: 'long' }));
                    return dName === selectedContentDay;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div style={{ textAlign: 'center', padding: '24px', color: '#71717a', fontSize: '0.88rem' }}>
                        No content scheduled for {selectedContentDay}. Add a new post idea above!
                      </div>
                    );
                  }

                  return filtered.map(cnt => {
                    const isBothLiked = cnt.aashishLiked && cnt.minniLiked;
                    const isPublished = cnt.status === 'PUBLISHED';

                    return (
                      <div 
                        key={cnt.id} 
                        style={{ 
                          padding: '18px', 
                          background: isPublished ? '#f0fdf4' : (isBothLiked ? '#f0f9ff' : '#faf8f5'), 
                          border: isPublished ? '1px solid #bbf7d0' : (isBothLiked ? '1px solid #bae6fd' : '1px solid #c8c3b7'), 
                          borderRadius: '12px', 
                          marginBottom: '14px' 
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                          <div style={{ fontWeight: '800', fontSize: '1.05rem', color: '#18181b' }}>
                            {cnt.title}
                          </div>

                          {/* MUTUAL APPROVAL BADGE */}
                          <div>
                            {isPublished ? (
                              <span style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', padding: '4px 10px', borderRadius: '6px', fontSize: '0.76rem', fontWeight: '700' }}>
                                ✓ Published
                              </span>
                            ) : isBothLiked ? (
                              <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '4px 10px', borderRadius: '6px', fontSize: '0.76rem', fontWeight: '700' }}>
                                ✓ Ready To Post (2/2)
                              </span>
                            ) : (
                              <span style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', padding: '4px 10px', borderRadius: '6px', fontSize: '0.76rem', fontWeight: '700' }}>
                                ⏳ Pending Approvals ({cnt.aashishLiked ? 1 : 0} + {cnt.minniLiked ? 1 : 0}/2)
                              </span>
                            )}
                          </div>
                        </div>

                        <p style={{ fontSize: '0.88rem', color: '#3f3f46', margin: '0 0 14px 0', lineHeight: '1.5' }}>"{cnt.notes}"</p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingTop: '12px', borderTop: '1px solid #c8c3b7' }}>
                          <div style={{ fontSize: '0.78rem', color: '#71717a' }}>
                            Platform: <strong>{cnt.platform}</strong> • Author: <strong>{cnt.author}</strong> • Scheduled: <strong>{cnt.dayOfWeek || 'Weekly'} ({cnt.date || 'TBD'})</strong>
                          </div>

                          {/* DUAL LIKE / APPROVAL BUTTONS (ONLY OWN USER CAN TOGGLE OWN APPROVAL) */}
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <button 
                              onClick={() => userRole === 'AASHISH' && handleToggleContentLike(cnt.id, 'aashish')}
                              disabled={userRole !== 'AASHISH'}
                              className="btn-action-outline"
                              style={{ 
                                background: cnt.aashishLiked ? '#dbeafe' : '#ffffff', 
                                color: cnt.aashishLiked ? '#1e40af' : '#71717a', 
                                borderColor: cnt.aashishLiked ? '#93c5fd' : '#c8c3b7',
                                fontSize: '0.78rem',
                                padding: '5px 10px',
                                fontWeight: '700',
                                opacity: userRole === 'AASHISH' ? 1 : 0.75,
                                cursor: userRole === 'AASHISH' ? 'pointer' : 'not-allowed'
                              }}
                              title={userRole === 'AASHISH' ? 'Click to toggle Aashish approval' : 'Aashish approval status'}
                            >
                              👍 Aashish {cnt.aashishLiked ? 'Approved ✅' : 'Approve'}
                            </button>

                            <button 
                              onClick={() => userRole === 'MINNI' && handleToggleContentLike(cnt.id, 'minni')}
                              disabled={userRole !== 'MINNI'}
                              className="btn-action-outline"
                              style={{ 
                                background: cnt.minniLiked ? '#fce7f3' : '#ffffff', 
                                color: cnt.minniLiked ? '#be185d' : '#71717a', 
                                borderColor: cnt.minniLiked ? '#fbcfe8' : '#c8c3b7',
                                fontSize: '0.78rem',
                                padding: '5px 10px',
                                fontWeight: '700',
                                opacity: userRole === 'MINNI' ? 1 : 0.75,
                                cursor: userRole === 'MINNI' ? 'pointer' : 'not-allowed'
                              }}
                              title={userRole === 'MINNI' ? 'Click to toggle Minni approval' : 'Minni approval status'}
                            >
                              👍 Minni {cnt.minniLiked ? 'Approved ✅' : 'Approve'}
                            </button>

                            {/* MINNI FINAL PUBLISH & CLOSE BUTTON (ONLY SHOWN WHEN BOTH APPROVED) */}
                            {userRole === 'MINNI' && !isPublished && isBothLiked && (
                              <button 
                                onClick={() => handlePublishContent(cnt.id)}
                                className="btn-action-outline"
                                style={{ background: '#ffffff', color: '#166534', borderColor: '#bbf7d0', fontSize: '0.78rem', padding: '5px 12px', fontWeight: '700' }}
                              >
                                🚀 Published
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* TAB 5: PERSONAL DISCIPLINE & COMPETITIVE STREAKS */}
          {activeTab === 'discipline' && (
            <div>
              {/* COMPETITIVE STREAKS HERO CARD AT TOP */}
              <div className="os-card" style={{ marginBottom: '20px', background: '#faf8f5', border: '1px solid #c8c3b7' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>🏆</span> Daily Discipline Leaderboard & Streaks
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#71717a', margin: '4px 0 0 0' }}>
                      Competitive consistency tracking between Aashish and Minni. Live mutual accountability.
                    </p>
                  </div>
                  <span style={{ fontSize: '0.78rem', background: '#22c55e', color: '#ffffff', padding: '4px 10px', borderRadius: '6px', fontWeight: '800' }}>
                    🔥 Live Battle
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                  {/* AASHISH STREAK CARD */}
                  <div style={{ background: '#ffffff', border: '1px solid #c8c3b7', borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#2563eb', color: '#ffffff', fontWeight: '800', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      A
                    </div>
                    <div>
                      <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#71717a', textTransform: 'uppercase' }}>Aashish Streak</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#2563eb' }}>12 Days 🔥</div>
                    </div>
                  </div>

                  {/* MINNI STREAK CARD */}
                  <div style={{ background: '#ffffff', border: '1px solid #c8c3b7', borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#ec4899', color: '#ffffff', fontWeight: '800', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      M
                    </div>
                    <div>
                      <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#71717a', textTransform: 'uppercase' }}>Minni Streak</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ec4899' }}>14 Days 🔥</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="discipline-grid">
                {/* AASHISH DISCIPLINE CARD */}
                <div className="os-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #c8c3b7' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2563eb', color: '#fff', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>A</div>
                    <div>
                      <h4 style={{ margin: 0, fontWeight: '800' }}>Aashish Daily Routine</h4>
                      <div style={{ fontSize: '0.75rem', color: '#71717a' }}>Status: {osData.disciplineLogs.aashish.mood}</div>
                    </div>
                  </div>

                  {[
                    ['attendance', '🌅 College Departure (9:00 AM)'],
                    ['waterGoal', '💧 Daytime Water Goal (3L)'],
                    ['gym', '🏋️‍♂️ Evening Gym Workout (4:00 PM)'],
                    ['protein', '🥤 Post-Workout Protein Shake'],
                    ['coding', '💻 Joint Coding Session (8:00 PM - 9:30 PM)'],
                    ['dinner9pm', '🍲 Dinner Before 9:00 PM'],
                    ['nightLeadCheck', '📞 Night Lead & Inquiry Check (10:30 PM)'],
                    ['sleep11pm', '🌙 Sleep Before 11:00 PM']
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
                      <h4 style={{ margin: 0, fontWeight: '800' }}>Manashvini (Minni) Daily Routine</h4>
                      <div style={{ fontSize: '0.75rem', color: '#71717a' }}>Status: {osData.disciplineLogs.minni.mood}</div>
                    </div>
                  </div>

                  {[
                    ['attendance', '🌅 College Departure (9:00 AM)'],
                    ['waterGoal', '💧 Daytime Water Goal (3L)'],
                    ['instaPost1', '📸 Today Instagram Post 1'],
                    ['instaPost2', '📸 Today Instagram Post 2'],
                    ['storiesCompleted', '📲 Stories Sequence Completed'],
                    ['scheduleNextDayPosts', '📅 Generate & Schedule Tomorrow 2 Posts'],
                    ['coding', '💻 Joint Coding Session (8:00 PM - 9:30 PM)'],
                    ['dinner9pm', '🍲 Dinner Before 9:00 PM'],
                    ['sleep11pm', '🌙 Sleep Before 11:00 PM']
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

          {/* TAB 6: REVENUE & EXPENSES DASHBOARD */}
          {activeTab === 'revenue' && (
            <div>
              {/* TOP FINANCIAL METRICS GRID */}
              {(() => {
                const totalRevenue = osData.projects.reduce((acc, p) => acc + (p.budget || 0), 125000);
                const totalExpenses = (osData.expenses || []).reduce((acc, e) => acc + (e.amount || 0), 0);
                const netProfit = totalRevenue - totalExpenses;

                return (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                      <div className="os-card" style={{ marginBottom: 0 }}>
                        <div style={{ fontSize: '0.76rem', fontWeight: '700', color: '#71717a', textTransform: 'uppercase', marginBottom: '4px' }}>GROSS REVENUE</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#166534' }}>₹{totalRevenue.toLocaleString()}</div>
                      </div>

                      <div className="os-card" style={{ marginBottom: 0 }}>
                        <div style={{ fontSize: '0.76rem', fontWeight: '700', color: '#71717a', textTransform: 'uppercase', marginBottom: '4px' }}>TOTAL EXPENSES</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#dc2626' }}>₹{totalExpenses.toLocaleString()}</div>
                        <div style={{ fontSize: '0.74rem', color: '#71717a', marginTop: '4px' }}>Shared Expense Logging</div>
                      </div>

                      <div className="os-card" style={{ marginBottom: 0, background: '#fffbeb', border: '1px solid #fde68a' }}>
                        <div style={{ fontSize: '0.76rem', fontWeight: '700', color: '#b45309', textTransform: 'uppercase', marginBottom: '4px' }}>PENDING RECEIVABLES</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#d97706' }}>₹{((osData.projects || []).reduce((acc, p) => acc + (p.pendingAmount !== undefined ? p.pendingAmount : Math.max(0, (p.budget || 0) - (p.advancePaid || 0))), 0)).toLocaleString()}</div>
                        <div style={{ fontSize: '0.74rem', color: '#b45309', fontWeight: '600', marginTop: '4px' }}>Client Balance Due</div>
                      </div>

                      <div className="os-card" style={{ marginBottom: 0, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                        <div style={{ fontSize: '0.76rem', fontWeight: '700', color: '#166534', textTransform: 'uppercase', marginBottom: '4px' }}>MONTHLY NET PROFIT</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#15803d' }}>₹{netProfit.toLocaleString()}</div>
                        <div style={{ fontSize: '0.74rem', color: '#166534', fontWeight: '600', marginTop: '4px' }}>Overall Month Savings</div>
                      </div>
                    </div>

                    {/* EXPENSE CATEGORY BREAKDOWN GRAPH / BAR VISUALIZATION */}
                    <div className="os-card" style={{ marginBottom: '20px' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="ri-pie-chart-line" style={{ color: '#2563eb' }}></i>
                        Expense Category Breakdown
                      </h4>

                      {(() => {
                        const categories = ['Infrastructure', 'Marketing', 'Tools', 'Office', 'Personal'];
                        const catTotals = categories.map(cat => {
                          const amt = (osData.expenses || []).filter(e => e.category === cat).reduce((a, b) => a + (b.amount || 0), 0);
                          return { cat, amt };
                        });

                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {catTotals.map(({ cat, amt }) => {
                              const pct = totalExpenses > 0 ? Math.round((amt / totalExpenses) * 100) : 0;
                              return (
                                <div key={cat}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                                    <span>{cat}</span>
                                    <span style={{ color: '#71717a' }}>₹{amt.toLocaleString()} ({pct}%)</span>
                                  </div>
                                  <div style={{ height: '8px', background: '#eae6dd', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${pct}%`, background: '#18181b', borderRadius: '4px', transition: 'width 0.3s ease' }}></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>

                    {/* ADD EXPENSE FORM */}
                    <div className="os-card" style={{ background: '#faf8f5', marginBottom: '20px' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '12px' }}>+ Log New Expense</h4>
                      <form onSubmit={handleCreateExpense}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                          <div>
                            <label style={{ fontSize: '0.78rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Expense Title</label>
                            <input type="text" required placeholder="e.g. Canva Pro / Ad Campaign" value={newExpense.title} onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #c8c3b7' }} />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.78rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Amount (₹)</label>
                            <input type="number" required placeholder="800" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #c8c3b7' }} />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.78rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Category</label>
                            <select value={newExpense.category} onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #c8c3b7', background: '#fff', fontSize: '0.85rem', fontWeight: '700' }}>
                              <option value="Marketing">📢 Marketing & Ads</option>
                              <option value="Infrastructure">⚡ Infrastructure & Server</option>
                              <option value="Tools">🛠️ Tools & Subscriptions</option>
                              <option value="Office">🏢 Office & Food</option>
                              <option value="Personal">👤 Personal & Misc</option>
                            </select>
                          </div>
                        </div>
                        <button type="submit" className="btn-action-outline" style={{ background: '#ffffff', color: '#18181b', borderColor: '#c8c3b7', fontWeight: '700' }}>
                          <i className="ri-add-line" style={{ color: '#16a34a' }}></i> Save Expense
                        </button>
                      </form>
                    </div>

                    {/* EXPENSES LOG TABLE */}
                    <div className="os-card" style={{ marginBottom: '20px' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '14px' }}>Recent Logged Expenses</h4>
                      {(osData.expenses || []).map(exp => (
                        <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#faf8f5', border: '1px solid #c8c3b7', borderRadius: '8px', marginBottom: '8px' }}>
                          <div>
                            <div style={{ fontWeight: '800', fontSize: '0.9rem', color: '#18181b' }}>{exp.title}</div>
                            <div style={{ fontSize: '0.78rem', color: '#71717a' }}>Category: <strong>{exp.category}</strong> • Added by: {exp.addedBy} • {exp.date}</div>
                          </div>
                          <div style={{ fontWeight: '800', fontSize: '1rem', color: '#dc2626' }}>-₹{exp.amount?.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>

                    {/* CLIENT RECEIVABLES & PAYMENT LEDGER TABLE */}
                    <div className="os-card" style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="ri-bank-card-line" style={{ color: '#d97706' }}></i>
                            Client Receivables & Pending Dues Ledger
                          </h4>
                          <p style={{ fontSize: '0.78rem', color: '#71717a', margin: '2px 0 0 0' }}>
                            Detailed breakdown of agreed budgets, received advance payments, and pending client balance dues.
                          </p>
                        </div>

                        <span style={{ fontSize: '0.78rem', background: '#fffbeb', color: '#b45309', padding: '4px 10px', borderRadius: '6px', fontWeight: '700', border: '1px solid #fde68a' }}>
                          Total Pending Dues: ₹{((osData.projects || []).reduce((acc, p) => acc + (p.pendingAmount !== undefined ? p.pendingAmount : Math.max(0, (p.budget || 0) - (p.advancePaid || 0))), 0)).toLocaleString()}
                        </span>
                      </div>

                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                          <thead>
                            <tr style={{ background: '#f4f4f5', textAlign: 'left', borderBottom: '2px solid #e4e4e7' }}>
                              <th style={{ padding: '10px 12px', fontWeight: '700', color: '#3f3f46' }}>Client & Project Title</th>
                              <th style={{ padding: '10px 12px', fontWeight: '700', color: '#3f3f46' }}>Total Budget</th>
                              <th style={{ padding: '10px 12px', fontWeight: '700', color: '#166534' }}>Advance Received</th>
                              <th style={{ padding: '10px 12px', fontWeight: '700', color: '#b45309' }}>Pending Balance</th>
                              <th style={{ padding: '10px 12px', fontWeight: '700', color: '#3f3f46' }}>Update Payment (₹)</th>
                              <th style={{ padding: '10px 12px', fontWeight: '700', color: '#3f3f46', textAlign: 'right' }}>Call Follow-Up</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(() => {
                              const pendingProjects = (osData.projects || []).filter(p => {
                                const pending = p.pendingAmount !== undefined ? p.pendingAmount : Math.max(0, (p.budget || 0) - (p.advancePaid || 0));
                                return pending > 0;
                              });

                              if (pendingProjects.length === 0) {
                                return (
                                  <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: '#166534', fontWeight: '700', fontSize: '0.88rem' }}>
                                      🎉 All client balances are 100% collected! Zero pending dues.
                                    </td>
                                  </tr>
                                );
                              }

                              return pendingProjects.map(prj => {
                                const pending = prj.pendingAmount !== undefined ? prj.pendingAmount : Math.max(0, (prj.budget || 0) - (prj.advancePaid || 0));

                                return (
                                  <tr key={prj.id} style={{ borderBottom: '1px solid #e4e4e7' }}>
                                    <td style={{ padding: '12px' }}>
                                      <div style={{ fontWeight: '700', color: '#18181b', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                        <span>{prj.client}</span>
                                        <a href={`tel:${prj.phone || ''}`} style={{ fontSize: '0.78rem', color: '#2563eb', textDecoration: 'none', fontWeight: '600' }} title="Click to call client">
                                          📞 {prj.phone || '+91 98765 43210'}
                                        </a>
                                      </div>
                                      <div style={{ fontSize: '0.76rem', color: '#71717a', marginTop: '2px' }}>{prj.name}</div>
                                    </td>

                                    <td style={{ padding: '12px', fontWeight: '700', color: '#18181b' }}>
                                      ₹{(prj.budget || 0).toLocaleString()}
                                    </td>

                                    <td style={{ padding: '12px', fontWeight: '700', color: '#15803d' }}>
                                      ₹{(prj.advancePaid || 0).toLocaleString()}
                                    </td>

                                    <td style={{ padding: '12px' }}>
                                      <span style={{ 
                                        fontWeight: '800', 
                                        color: '#d97706',
                                        background: '#fffbeb',
                                        padding: '3px 8px',
                                        borderRadius: '6px',
                                        fontSize: '0.8rem',
                                        border: '1px solid #fde68a'
                                      }}>
                                        ₹{pending.toLocaleString()} Due
                                      </span>
                                    </td>

                                    <td style={{ padding: '12px' }}>
                                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <input 
                                          type="number" 
                                          placeholder="Enter ₹"
                                          id={`pay_input_${prj.id}`}
                                          style={{ width: '90px', padding: '5px 8px', borderRadius: '6px', border: '1px solid #d4d4d8', fontSize: '0.8rem', fontWeight: '600' }}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                              handleRecordIncrementalPayment(prj.id, e.target.value);
                                              e.target.value = '';
                                            }
                                          }}
                                        />
                                        
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const el = document.getElementById(`pay_input_${prj.id}`);
                                            if (el && el.value) {
                                              handleRecordIncrementalPayment(prj.id, el.value);
                                              el.value = '';
                                            }
                                          }}
                                          className="btn-action-outline"
                                          style={{ background: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0', fontSize: '0.75rem', padding: '4px 8px', fontWeight: '700' }}
                                          title="Add received payment and subtract from pending balance"
                                        >
                                          + Pay
                                        </button>
                                      </div>
                                    </td>

                                    <td style={{ padding: '12px', textAlign: 'right' }}>
                                      <button 
                                        onClick={() => handleFollowUpCall(prj.id)}
                                        className="btn-action-outline"
                                        style={{ 
                                          background: prj.lastFollowedUpBy ? '#f0fdf4' : '#ffffff', 
                                          color: prj.lastFollowedUpBy ? '#15803d' : '#2563eb', 
                                          borderColor: prj.lastFollowedUpBy ? '#bbf7d0' : '#bfdbfe', 
                                          fontSize: '0.76rem', 
                                          padding: '5px 10px', 
                                          fontWeight: '700' 
                                        }}
                                        title="Click to log follow up"
                                      >
                                        📞 {prj.lastFollowedUpBy ? `Followed up by ${prj.lastFollowedUpBy}` : 'Log Call'}
                                      </button>
                                    </td>
                                  </tr>
                                );
                              });
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 9: COMPREHENSIVE ADD CLIENT LEAD SUITE */}
          {activeTab === 'addLead' && (
            <div className="os-card">
              {/* TOP HEADER WITH BACK TO CRM BUTTON */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #c8c3b7', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button 
                    onClick={() => setActiveTab('inquiries')}
                    className="btn-action-outline"
                    style={{ background: '#ffffff', color: '#18181b', borderColor: '#c8c3b7', padding: '6px 14px', borderRadius: '8px', fontWeight: '700', fontSize: '0.82rem' }}
                  >
                    <i className="ri-arrow-left-line"></i> ◀ Back to Inquiries & CRM
                  </button>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>Add New Client Lead</h3>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#71717a', fontWeight: '600' }}>
                  Direct Lead Capture Engine
                </span>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const newInq = { 
                  id: 'INQ-' + Date.now(), 
                  name: manualLead.name, 
                  email: manualLead.email || `${manualLead.phone || 'client'}@klapp.lead`, 
                  phone: manualLead.phone,
                  company: manualLead.company,
                  service: manualLead.service, 
                  budget: manualLead.budget,
                  source: manualLead.source,
                  priority: manualLead.priority,
                  owner: manualLead.owner,
                  deadline: manualLead.deadline,
                  message: manualLead.message, 
                  status: 'NEW', 
                  createdAt: new Date().toISOString() 
                };
                setInquiries([newInq, ...inquiries]);
                setManualLead({ name: '', phone: '', email: '', company: '', service: 'Website Development (Sub-100ms)', budget: '₹50,000 - ₹1,00,000', source: 'Instagram DM', priority: 'HOT (Closing Today)', owner: 'Minni (Client Ops)', deadline: '', message: '' });
                setActiveTab('inquiries');
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  {/* CLIENT NAME */}
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Client Full Name *</label>
                    <input type="text" required placeholder="e.g. Rahul Sharma" value={manualLead.name} onChange={(e) => setManualLead({ ...manualLead, name: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #c8c3b7' }} />
                  </div>

                  {/* PHONE / WHATSAPP */}
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>WhatsApp / Phone Number *</label>
                    <input type="text" required placeholder="e.g. +91 98765 43210" value={manualLead.phone} onChange={(e) => setManualLead({ ...manualLead, phone: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #c8c3b7' }} />
                  </div>

                  {/* EMAIL ADDRESS */}
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Email Address</label>
                    <input type="email" placeholder="e.g. client@company.com" value={manualLead.email} onChange={(e) => setManualLead({ ...manualLead, email: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #c8c3b7' }} />
                  </div>

                  {/* COMPANY / BRAND NAME */}
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Company / Brand Name</label>
                    <input type="text" placeholder="e.g. Balaji Pharma / Gym App" value={manualLead.company} onChange={(e) => setManualLead({ ...manualLead, company: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #c8c3b7' }} />
                  </div>

                  {/* REQUIRED SERVICE */}
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Required Service</label>
                    <select value={manualLead.service} onChange={(e) => setManualLead({ ...manualLead, service: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #c8c3b7', background: '#fff', fontSize: '0.85rem', fontWeight: '700' }}>
                      <option value="Website Development (Sub-100ms)">🚀 Website Development (Sub-100ms)</option>
                      <option value="Custom Business Software / ERP">💻 Custom Business Software / ERP</option>
                      <option value="Mobile App (iOS & Android)">📱 Mobile App (iOS & Android)</option>
                      <option value="AI Agent & Automation Suite">🤖 AI Agent & Automation Suite</option>
                      <option value="E-Commerce & Payment Engine">🛒 E-Commerce & Payment Engine</option>
                      <option value="UI/UX Design & Branding">🎨 UI/UX Design & Branding</option>
                    </select>
                  </div>

                  {/* ESTIMATED BUDGET */}
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Estimated Budget Range</label>
                    <select value={manualLead.budget} onChange={(e) => setManualLead({ ...manualLead, budget: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #c8c3b7', background: '#fff', fontSize: '0.85rem', fontWeight: '700' }}>
                      <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000 (Starter)</option>
                      <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000 (Pro)</option>
                      <option value="₹1,00,000 - ₹3,00,000">₹1,00,000 - ₹3,00,000 (Enterprise)</option>
                      <option value="₹3,00,000+">₹3,00,000+ (Custom Suite)</option>
                    </select>
                  </div>

                  {/* LEAD SOURCE */}
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Lead Channel / Source</label>
                    <select value={manualLead.source} onChange={(e) => setManualLead({ ...manualLead, source: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #c8c3b7', background: '#fff', fontSize: '0.85rem', fontWeight: '700' }}>
                      <option value="Instagram DM">📸 Instagram Direct Message</option>
                      <option value="WhatsApp Inquiry">💬 WhatsApp Direct Inquiry</option>
                      <option value="Referral / Word of Mouth">🤝 Referral / Client Recommendation</option>
                      <option value="Website Contact Form">🌐 KLAPP Website Contact Form</option>
                      <option value="Cold Outreach">📞 Direct Outreach / Call</option>
                    </select>
                  </div>

                  {/* LEAD PRIORITY */}
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Lead Priority / Urgency</label>
                    <select value={manualLead.priority} onChange={(e) => setManualLead({ ...manualLead, priority: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #c8c3b7', background: '#fff', fontSize: '0.85rem', fontWeight: '700' }}>
                      <option value="HOT (Closing Today)">🔥 HOT (Closing Today)</option>
                      <option value="WARM (Interested)">⚡ WARM (Highly Interested)</option>
                      <option value="COLD (Inquiry Only)">🧊 COLD (Initial Inquiry)</option>
                    </select>
                  </div>
                </div>

                {/* PROJECT SCOPE & NOTES */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Detailed Project Scope & Client Requirements *</label>
                  <textarea required rows={4} placeholder="e.g. Client needs booking engine with payment gateway integration, sub-100ms speed, admin dashboard, and automated WhatsApp notifications..." value={manualLead.message} onChange={(e) => setManualLead({ ...manualLead, message: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #c8c3b7', fontSize: '0.88rem' }}></textarea>
                </div>

                {/* FORM ACTION BUTTONS RIGHT ALIGNED */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end', marginTop: '18px' }}>
                  <button type="button" onClick={() => setActiveTab('inquiries')} className="btn-action-outline" style={{ background: '#ffffff', color: '#71717a', borderColor: '#c8c3b7', padding: '9px 18px', borderRadius: '10px', fontWeight: '700' }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-action-outline" style={{ background: '#ffffff', color: '#18181b', borderColor: '#c8c3b7', padding: '9px 22px', borderRadius: '10px', fontWeight: '800', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                    <i className="ri-check-line" style={{ color: '#16a34a', marginRight: '4px' }}></i> Save Lead & Open CRM
                  </button>
                </div>
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
