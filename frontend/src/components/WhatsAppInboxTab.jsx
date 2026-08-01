import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../config/api';

export default function WhatsAppInboxTab({ currentUser = 'AASHISH' }) {
  const [chats, setChats] = useState([]);
  const [activePhone, setActivePhone] = useState('917989033580');
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [hoveredMsgId, setHoveredMsgId] = useState(null);

  // New Contact / Team Member Modal State
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  const messagesEndRef = useRef(null);
  const isAashish = String(currentUser).toUpperCase().includes('AASHISH');

  const emojiList = ['❤️', '👍', '🔥', '😂', '😮', '🙏', '✨', '⚡', '💯', '🎯', '🤝', '💼', '🚀', '🥳'];
  const reactionOptions = ['❤️', '👍', '🔥', '😂', '😮', '🙏'];

  const fetchChats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/whatsapp/chats`);
      const data = await res.json();
      if (data.success && Array.isArray(data.chats)) {
        setChats(prev => {
          if (!prev || prev.length === 0) return data.chats;

          return data.chats.map(serverChat => {
            const localChat = prev.find(p => p.phone === serverChat.phone);
            if (!localChat) return serverChat;

            const serverMsgIds = new Set((serverChat.messages || []).map(m => m.id));
            const serverMsgTexts = new Set((serverChat.messages || []).map(m => m.text + '|' + new Date(m.timestamp).getTime()));
            const now = Date.now();

            // Only keep truly-pending local messages: sent in last 15s and not yet in server
            const pendingMsgs = (localChat.messages || []).filter(localMsg => {
              const isTemp = String(localMsg.id).startsWith('MSG-TEMP-');
              const ageMs = now - new Date(localMsg.timestamp).getTime();
              if (!isTemp || ageMs > 15000) return false; // discard old temps
              if (serverMsgIds.has(localMsg.id)) return false;
              // Also discard if server has same text sent within 15s
              const isDuplicate = (serverChat.messages || []).some(
                sm => sm.text === localMsg.text && Math.abs(new Date(sm.timestamp) - new Date(localMsg.timestamp)) < 15000
              );
              return !isDuplicate;
            });

            const allMsgs = [...(serverChat.messages || []), ...pendingMsgs];
            allMsgs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            const lastMsg = allMsgs.length > 0 ? allMsgs[allMsgs.length - 1] : null;

            return {
              ...serverChat,
              messages: allMsgs,
              lastMessage: lastMsg ? lastMsg.text : (serverChat.lastMessage || ''),
              lastMessageTime: lastMsg ? lastMsg.timestamp : serverChat.lastMessageTime
            };
          });
        });

        if (!activePhone && data.chats.length > 0) {
          setActivePhone(data.chats[0].phone);
        }
      }
    } catch (err) {
      console.error('Failed to load chats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 2000); // 2s fast polling for live chat
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!activePhone) return;
    fetch(`${API_BASE_URL}/api/whatsapp/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: activePhone })
    }).catch(() => {});
  }, [activePhone]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, activePhone]);

  const activeChat = chats.find(c => c.phone === activePhone) || chats[0];

  // Dynamic Contact Name for Aashish vs Minni
  const getDisplayContactName = (c) => {
    if (!c) return 'Contact';
    if (c.phone === '917989033580' || c.phone === 'KLAPP-TEAM-AASHISH-MINNI') {
      return isAashish ? 'Manashvini (Minni)' : 'Gotti Aashish';
    }
    return c.contactName || `Contact (${c.phone})`;
  };

  const getDisplayContactRole = (c) => {
    if (!c) return 'Team Member';
    if (c.phone === '917989033580' || c.phone === 'KLAPP-TEAM-AASHISH-MINNI') {
      return isAashish ? 'Klapp Growth & Operations Lead' : 'Klapp Co-Founder & Tech Lead';
    }
    return c.serviceInterest || 'Klapp Team Member';
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const targetPhone = activePhone || (activeChat ? activeChat.phone : '917989033580');
    if (!messageText.trim() || !targetPhone || sending) return;

    const textToSend = messageText.trim();
    setMessageText('');
    setShowEmojiPicker(false);
    setSending(true);

    const senderRole = (currentUser && currentUser.toUpperCase().includes('MINNI')) ? 'MINNI' : 'AASHISH';
    const tempMsgId = 'MSG-TEMP-' + Date.now();
    const optMsg = {
      id: tempMsgId,
      sender: senderRole,
      text: textToSend,
      timestamp: new Date().toISOString(),
      status: 'DELIVERED'
    };

    // 0ms Optimistic UI: instantly show message on screen
    setChats(prev => {
      const exists = prev.some(c => c.phone === targetPhone);
      if (exists) {
        return prev.map(c => {
          if (c.phone === targetPhone) {
            return {
              ...c,
              lastMessage: textToSend,
              lastMessageTime: new Date().toISOString(),
              messages: [...(c.messages || []), optMsg]
            };
          }
          return c;
        });
      }
      return prev;
    });

    try {
      const res = await fetch(`${API_BASE_URL}/api/whatsapp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: targetPhone,
          text: textToSend,
          sender: currentUser,
          contactName: activeChat ? getDisplayContactName(activeChat) : 'Contact'
        })
      });
      const data = await res.json();
      if (data.success && data.chat) {
        // Smart merge: keep ALL local messages (especially after clear + new send)
        // Never blindly overwrite local state with server - merge instead
        setChats(prev => prev.map(c => {
          if (c.phone !== targetPhone && c.phone !== data.chat.phone) return c;

          const serverMsgs = data.chat.messages || [];
          const localMsgs = c.messages || [];

          // Build combined list: start with server messages, then add any local ones not already there
          const combined = [...serverMsgs];
          localMsgs.forEach(localMsg => {
            const alreadyInServer = combined.some(
              m => m.id === localMsg.id ||
              (m.text === localMsg.text &&
                Math.abs(new Date(m.timestamp) - new Date(localMsg.timestamp)) < 15000)
            );
            if (!alreadyInServer) combined.push(localMsg);
          });

          return {
            ...data.chat,
            messages: combined
          };
        }));
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };


  const handleStartNewChat = async (e) => {
    e.preventDefault();
    if (!newContactPhone.trim()) return;

    let cleanPhone = newContactPhone.trim().replace(/\D/g, '');
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;
    if (!cleanPhone) cleanPhone = 'TEAM-' + Date.now();

    const nameToSet = newContactName.trim() || `Team Member (${cleanPhone})`;

    setShowNewChatModal(false);
    setNewContactName('');
    setNewContactPhone('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/whatsapp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          text: 'Hi! Added to Klapp Messenger.',
          sender: currentUser,
          contactName: nameToSet
        })
      });
      const data = await res.json();
      if (data.success && data.chat) {
        setChats(prev => [data.chat, ...prev.filter(c => c.phone !== cleanPhone)]);
        setActivePhone(cleanPhone);
      }
    } catch (err) {
      console.error('Error adding new contact:', err);
    }
  };

  const handleClearChat = async () => {
    const targetPhone = activePhone || (activeChat ? activeChat.phone : '917989033580');
    if (!window.confirm('Are you sure you want to clear this chat history?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/whatsapp/clear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: targetPhone })
      });
      const data = await res.json();
      if (data.success) {
        // lastMessage = '' so sidebar shows 'Start conversation...' instead of 'Chat cleared'
        setChats(prev => prev.map(c => (c.phone === targetPhone || c.phone === activePhone) ? { ...c, messages: [], lastMessage: '' } : c));
      }
    } catch (err) {
      console.error('Error clearing chat:', err);
    }
  };

  const handleReactToMessage = async (msgTargetId, emoji) => {
    // Instant optimistic local update for 0ms feedback
    setChats(prev => prev.map(c => {
      if (c.phone !== activePhone || !c.messages) return c;
      const updatedMsgs = c.messages.map((m, idx) => {
        const idMatches = m.id === msgTargetId || String(idx) === String(msgTargetId);
        if (idMatches) {
          return {
            ...m,
            reaction: m.reaction === emoji ? null : emoji
          };
        }
        return m;
      });
      return { ...c, messages: updatedMsgs };
    }));

    try {
      await fetch(`${API_BASE_URL}/api/whatsapp/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: activePhone,
          messageId: msgTargetId,
          emoji: emoji,
          sender: currentUser
        })
      });
    } catch (err) {
      console.error('Error reacting to message:', err);
    }
  };

  const handleDeleteContact = async (phoneToDelete, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Delete this contact card from your inbox?')) return;

    setChats(prev => prev.filter(c => c.phone !== phoneToDelete));
    if (activePhone === phoneToDelete) {
      const remaining = chats.filter(c => c.phone !== phoneToDelete);
      setActivePhone(remaining.length > 0 ? remaining[0].phone : '');
    }

    try {
      await fetch(`${API_BASE_URL}/api/whatsapp/chat/${phoneToDelete}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Error deleting contact:', err);
    }
  };

  const addEmojiToText = (emoji) => {
    setMessageText(prev => prev + emoji);
  };

  const filteredChats = chats.filter(c => {
    const name = getDisplayContactName(c).toLowerCase();
    return name.includes(searchQuery.toLowerCase()) || (c.phone && c.phone.includes(searchQuery));
  });

  return (
    <div className="wa-direct-wrapper">
      <style>{`
        .wa-direct-wrapper {
          width: 100%;
          height: 100%;
          background: #ffffff;
          display: flex;
          flex-direction: row;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #1e293b;
          position: relative;
        }

        /* SIDEBAR */
        .wa-sidebar {
          width: 320px;
          min-width: 320px;
          background: #ffffff;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
        }

        .wa-sidebar-top {
          padding: 12px 14px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .wa-search-bar {
          padding: 8px 12px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .wa-search-input {
          flex: 1;
          padding: 7px 12px 7px 32px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.8rem;
          color: #1e293b;
          outline: none;
          box-sizing: border-box;
        }
        .wa-search-input:focus {
          border-color: #16a34a;
          background: #ffffff;
        }

        .wa-add-contact-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #16a34a;
          color: #ffffff;
          border: none;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .wa-add-contact-btn:hover {
          background: #15803d;
        }

        .wa-contact-card {
          padding: 14px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .wa-contact-card:hover {
          background: #f8fafc;
        }
        .wa-contact-card.active {
          background: #f0fdf4;
          border-left: 4px solid #16a34a;
        }

        .wa-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #2563eb;
          color: #ffffff;
          font-weight: 800;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
        }

        .wa-contact-info {
          flex: 1;
          min-width: 0;
        }

        .wa-contact-name {
          font-weight: 700;
          font-size: 0.88rem;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .wa-last-msg {
          font-size: 0.78rem;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 3px;
        }

        .wa-unread-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #16a34a;
          box-shadow: 0 0 0 2px #ffffff;
          flex-shrink: 0;
        }

        /* MAIN CHAT WINDOW */
        .wa-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
          position: relative;
        }

        .wa-header {
          padding: 12px 20px;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .wa-stream {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: #f8fafc;
        }

        .wa-bubble-wrap {
          display: flex;
          flex-direction: column;
          position: relative;
          padding-top: 32px;
          margin-top: -20px;
        }

        .wa-bubble-wrap.my-wrap {
          align-self: flex-end;
          align-items: flex-end;
        }

        .wa-bubble-wrap.other-wrap {
          align-self: flex-start;
          align-items: flex-start;
        }

        .wa-bubble {
          min-width: 90px;
          max-width: 65%;
          padding: 8px 14px 6px 14px;
          font-size: 0.88rem;
          line-height: 1.45;
          position: relative;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .wa-bubble-my {
          background: #dcfce7;
          color: #064e3b;
          border-radius: 12px 0 12px 12px;
          border: 1px solid #bbf7d0;
        }

        .wa-bubble-other {
          background: #ffffff;
          color: #1e293b;
          border-radius: 0 12px 12px 12px;
          border: 1px solid #e2e8f0;
        }

        /* EMOJI REACTION POPUP BAR */
        .wa-reaction-bar {
          position: absolute;
          top: 0px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 20px;
          padding: 4px 10px;
          display: flex;
          gap: 6px;
          box-shadow: 0 6px 16px rgba(0,0,0,0.18);
          z-index: 20;
        }
        .wa-bubble-wrap.my-wrap .wa-reaction-bar { right: 0; }
        .wa-bubble-wrap.other-wrap .wa-reaction-bar { left: 0; }

        .wa-react-btn {
          background: none;
          border: none;
          font-size: 1.1rem;
          cursor: pointer;
          transition: transform 0.15s;
        }
        .wa-react-btn:hover {
          transform: scale(1.3);
        }

        .wa-reaction-badge {
          position: absolute;
          bottom: -10px;
          right: 10px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          padding: 1px 6px;
          font-size: 0.76rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        /* COMPOSER */
        .wa-composer {
          padding: 12px 20px;
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 10px;
          position: relative;
        }

        .wa-emoji-picker-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .wa-emoji-picker-btn:hover {
          background: #e2e8f0;
        }

        .wa-emoji-panel {
          position: absolute;
          bottom: 60px;
          left: 20px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 10px;
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          z-index: 20;
        }

        .wa-emoji-item {
          font-size: 1.25rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
        }
        .wa-emoji-item:hover {
          background: #f1f5f9;
        }

        .wa-composer-input {
          flex: 1;
          padding: 11px 16px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.86rem;
          color: #0f172a;
          outline: none;
        }
        .wa-composer-input:focus {
          border-color: #16a34a;
          background: #ffffff;
        }

        .wa-send-btn {
          background: #16a34a;
          color: #ffffff;
          font-weight: 700;
          border: none;
          padding: 11px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.86rem;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.2s;
        }
        .wa-send-btn:hover {
          background: #15803d;
        }
        .wa-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* MODAL */
        .wa-modal-overlay {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          box-sizing: border-box;
        }
        .wa-modal-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          width: 100%;
          max-width: 420px;
          padding: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }
      `}</style>

      {/* NEW CONTACT MODAL */}
      {showNewChatModal && (
        <div className="wa-modal-overlay">
          <div className="wa-modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontWeight: '700', fontSize: '1rem', color: '#0f172a' }}>Add Team Member / Contact</span>
              <button onClick={() => setShowNewChatModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleStartNewChat}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>Contact Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul - Developer"
                  value={newContactName}
                  onChange={e => setNewContactName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.84rem', marginTop: '4px', outline: 'none', boxSizing: 'border-box' }}
                  autoFocus
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>Phone / Contact ID *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9876543210 or DEV-RAHUL"
                  value={newContactPhone}
                  onChange={e => setNewContactPhone(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.84rem', marginTop: '4px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowNewChatModal(false)} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ background: '#16a34a', color: '#ffffff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer' }}>Add Contact</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LEFT SIDEBAR */}
      <div className="wa-sidebar">
        <div className="wa-sidebar-top">
          <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="ri-phone-line" style={{ color: '#64748b' }}></i>
            <span>Inbox</span>
          </div>

          <button
            onClick={fetchChats}
            style={{ width: '30px', height: '30px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#ffffff', color: '#64748b', cursor: 'pointer' }}
            title="Refresh Inbox"
          >
            <i className="ri-refresh-line"></i>
          </button>
        </div>

        <div className="wa-search-bar">
          <div style={{ position: 'relative', flex: 1 }}>
            <i className="ri-search-line" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.8rem' }}></i>
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="wa-search-input"
            />
          </div>

          <button
            onClick={() => setShowNewChatModal(true)}
            className="wa-add-contact-btn"
            title="Add New Team Member / Contact"
          >
            +
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
              <i className="ri-loader-4-line animate-spin" style={{ color: '#16a34a', marginRight: '6px' }}></i> Loading contacts...
            </div>
          ) : filteredChats.length === 0 ? (
            <div style={{ padding: '28px', textAlign: 'center', fontSize: '0.82rem', color: '#94a3b8' }}>
              No contacts. Click <strong style={{ color: '#16a34a' }}>+</strong> to add a team member!
            </div>
          ) : (
            filteredChats.map(c => {
              const isActive = c.phone === activePhone;
              const displayName = getDisplayContactName(c);

              const isTeamMain = c.phone === '917989033580' || c.phone === 'KLAPP-TEAM-AASHISH-MINNI';
              const avatarIcon = isTeamMain ? (isAashish ? '✨' : '⚡') : '👤';
              const avatarGradient = isTeamMain ? (isAashish ? 'linear-gradient(135deg, #ec4899, #f43f5e)' : 'linear-gradient(135deg, #2563eb, #3b82f6)') : 'linear-gradient(135deg, #0284c7, #0ea5e9)';

              // Unread dot check
              const lastMsg = c.messages && c.messages.length > 0 ? c.messages[c.messages.length - 1] : null;
              const isUnread = c.unreadCount > 0 || (lastMsg && ((isAashish && lastMsg.sender === 'MINNI') || (!isAashish && lastMsg.sender === 'AASHISH')));

              return (
                <div
                  key={c.phone}
                  onClick={() => setActivePhone(c.phone)}
                  className={`wa-contact-card ${isActive ? 'active' : ''}`}
                >
                  <div className="wa-avatar" style={{ background: avatarGradient, boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }}>
                    {avatarIcon}
                  </div>
                  <div className="wa-contact-info">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="wa-contact-name">{displayName}</span>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                        {c.lastMessageTime ? new Date(c.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <div className="wa-last-msg">
                      {(c.messages && c.messages.length > 0)
                        ? c.messages[c.messages.length - 1].text
                        : (c.lastMessage && c.lastMessage !== 'Chat cleared' ? c.lastMessage : 'Start conversation...')}
                    </div>
                  </div>
                  {isUnread && <div className="wa-unread-dot" title="New Message"></div>}
                  {c.phone !== '917989033580' && (
                    <button
                      onClick={(e) => handleDeleteContact(c.phone, e)}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer', marginLeft: '4px', padding: '2px 4px' }}
                      title="Delete Contact"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT MAIN CHAT WINDOW */}
      <div className="wa-main">
        {activeChat ? (
          <>
            {/* Header */}
            <div className="wa-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="wa-avatar" style={{ width: '38px', height: '38px', fontSize: '1rem', background: (activeChat.phone === '917989033580' || activeChat.phone === 'KLAPP-TEAM-AASHISH-MINNI') ? (isAashish ? 'linear-gradient(135deg, #ec4899, #f43f5e)' : 'linear-gradient(135deg, #2563eb, #3b82f6)') : 'linear-gradient(135deg, #0284c7, #0ea5e9)' }}>
                  {(activeChat.phone === '917989033580' || activeChat.phone === 'KLAPP-TEAM-AASHISH-MINNI') ? (isAashish ? '✨' : '⚡') : '👤'}
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#0f172a' }}>
                    {getDisplayContactName(activeChat)}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }}></span>
                    {getDisplayContactRole(activeChat)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleClearChat}
                  style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fca5a5', padding: '6px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  title="Clear all chat history"
                >
                  <i className="ri-delete-bin-line"></i> Clear Chat
                </button>
              </div>
            </div>

            {/* Stream */}
            <div className="wa-stream">
              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem' }}>
                  <i className="ri-loader-4-line animate-spin" style={{ color: '#16a34a', marginRight: '6px' }}></i> Loading conversation...
                </div>
              ) : activeChat.messages && activeChat.messages.length > 0 ? (
                activeChat.messages.map((m, idx) => {
                  const isMyMsg = (isAashish && m.sender === 'AASHISH') || (!isAashish && m.sender === 'MINNI') || (m.sender === currentUser);
                  const msgTargetId = m.id || idx;
                  const isHovered = hoveredMsgId === msgTargetId;

                  return (
                    <div
                      key={m.id || idx}
                      className={`wa-bubble-wrap ${isMyMsg ? 'my-wrap' : 'other-wrap'}`}
                      onMouseEnter={() => setHoveredMsgId(msgTargetId)}
                      onMouseLeave={() => setHoveredMsgId(null)}
                    >
                      {/* EMOJI REACTION FLOATING BAR */}
                      {isHovered && (
                        <div className="wa-reaction-bar">
                          {reactionOptions.map(emoji => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => handleReactToMessage(msgTargetId, emoji)}
                              className="wa-react-btn"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className={`wa-bubble ${isMyMsg ? 'wa-bubble-my' : 'wa-bubble-other'}`}>
                        <div style={{ whitespace: 'pre-wrap' }}>{m.text}</div>
                        <div style={{ fontSize: '0.66rem', color: isMyMsg ? '#047857' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '4px', whiteSpace: 'nowrap' }}>
                          <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {isMyMsg && <span style={{ fontWeight: '700', color: '#15803d' }}>✓✓</span>}
                        </div>

                        {/* REACTION BADGE */}
                        {m.reaction && (
                          <div className="wa-reaction-badge">
                            {m.reaction}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem' }}>
                  No messages yet with {getDisplayContactName(activeChat)}. Type below to send a message!
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Composer */}
            <form onSubmit={handleSendMessage} className="wa-composer">
              {/* EMOJI PICKER POPUP */}
              {showEmojiPicker && (
                <div className="wa-emoji-panel">
                  {emojiList.map(emoji => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => addEmojiToText(emoji)}
                      className="wa-emoji-item"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="wa-emoji-picker-btn"
                title="Add Emojis"
              >
                😊
              </button>

              <input
                type="text"
                placeholder={`Type a message to ${getDisplayContactName(activeChat)}...`}
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                className="wa-composer-input"
              />

              <button
                type="submit"
                disabled={!messageText.trim() || sending}
                className="wa-send-btn"
              >
                Send ➢
              </button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🖱️</div>
            <div style={{ fontWeight: '600', fontSize: '0.92rem', color: '#334155' }}>Select contact from the left sidebar to open chat</div>
          </div>
        )}
      </div>
    </div>
  );
}
