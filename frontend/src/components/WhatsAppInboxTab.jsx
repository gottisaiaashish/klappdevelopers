import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../config/api';

export default function WhatsAppInboxTab({ currentUser = 'AASHISH' }) {
  const [chats, setChats] = useState([]);
  const [activeChatPhone, setActiveChatPhone] = useState('');
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Periskope Style New Chat Modal
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newContactQuery, setNewContactQuery] = useState('');
  const [newContactName, setNewContactName] = useState('');

  const fetchChats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/whatsapp/chats`);
      const data = await res.json();
      if (data.success && Array.isArray(data.chats)) {
        setChats(data.chats);
      }
    } catch (err) {
      console.error('Failed to load WhatsApp chats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!activeChatPhone) return;
    const markRead = async () => {
      try {
        await fetch(`${API_BASE_URL}/api/whatsapp/read`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: activeChatPhone })
        });
        setChats(prev => prev.map(c => c.phone === activeChatPhone ? { ...c, unreadCount: 0 } : c));
      } catch (e) {}
    };
    markRead();
  }, [activeChatPhone]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, activeChatPhone]);

  const activeChat = chats.find(c => c.phone === activeChatPhone);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!messageText.trim() || !activeChatPhone || sending) return;

    const textToSend = messageText.trim();
    setMessageText('');
    setSending(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/whatsapp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: activeChatPhone,
          text: textToSend,
          sender: currentUser,
          contactName: activeChat?.contactName
        })
      });
      const data = await res.json();
      if (data.success && data.chat) {
        setChats(prev => prev.map(c => c.phone === activeChatPhone ? data.chat : c));
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleStartNewChat = async (e) => {
    e.preventDefault();
    if (!newContactQuery.trim()) return;

    let cleanPhone = newContactQuery.trim().replace(/\D/g, '');
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;

    const contactName = newContactName.trim() || `Client (${cleanPhone})`;

    setShowNewChatModal(false);
    setNewContactQuery('');
    setNewContactName('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/whatsapp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          text: 'Hi! Reaching out from KLAPP Developers.',
          sender: currentUser,
          contactName: contactName
        })
      });
      const data = await res.json();
      if (data.success && data.chat) {
        setChats(prev => [data.chat, ...prev.filter(c => c.phone !== cleanPhone)]);
        setActiveChatPhone(cleanPhone);
      }
    } catch (err) {
      console.error('Error starting new chat:', err);
    }
  };

  const filteredChats = chats.filter(c =>
    c.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  return (
    <div className="periskope-inbox-wrapper">
      <style>{`
        .periskope-inbox-wrapper {
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

        /* PERISKOPE SIDEBAR */
        .periskope-sidebar {
          width: 320px;
          min-width: 320px;
          background: #ffffff;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .periskope-sidebar-header {
          padding: 12px 14px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .periskope-inbox-dropdown {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          font-size: 0.88rem;
          color: #0f172a;
          cursor: pointer;
        }

        .periskope-header-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .periskope-icon-btn {
          width: 30px;
          height: 30px;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s;
        }
        .periskope-icon-btn:hover {
          background: #f8fafc;
          color: #0f172a;
        }

        .periskope-search-bar {
          padding: 8px 12px;
          border-bottom: 1px solid #f1f5f9;
        }

        .periskope-search-input {
          width: 100%;
          padding: 7px 12px 7px 32px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.8rem;
          color: #1e293b;
          outline: none;
          box-sizing: border-box;
        }
        .periskope-search-input:focus {
          border-color: #16a34a;
          background: #ffffff;
        }

        .periskope-chat-list {
          flex: 1;
          overflow-y: auto;
        }

        .periskope-chat-card {
          padding: 12px 14px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .periskope-chat-card:hover {
          background: #f8fafc;
        }
        .periskope-chat-card.active {
          background: #f0fdf4;
          border-left: 3px solid #16a34a;
        }

        .periskope-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #1e293b;
          color: #ffffff;
          font-weight: 700;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .periskope-chat-info {
          flex: 1;
          min-width: 0;
        }

        .periskope-contact-name {
          font-weight: 700;
          font-size: 0.86rem;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .periskope-label-tag {
          display: inline-block;
          border: 1px solid #cbd5e1;
          color: #64748b;
          border-radius: 4px;
          padding: 1px 5px;
          font-size: 0.65rem;
          font-weight: 600;
          margin-left: 6px;
        }

        .periskope-last-msg {
          font-size: 0.78rem;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 3px;
        }

        .periskope-timestamp {
          font-size: 0.68rem;
          color: #94a3b8;
          white-space: nowrap;
        }

        .periskope-unread-badge {
          background: #16a34a;
          color: #ffffff;
          font-weight: 800;
          font-size: 0.68rem;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 4px;
        }

        /* PERISKOPE FLOATING + BUTTON */
        .periskope-fab {
          position: absolute;
          bottom: 16px;
          left: 16px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #16a34a;
          color: #ffffff;
          border: none;
          font-size: 1.3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(22, 163, 74, 0.35);
          transition: transform 0.2s, background 0.2s;
          z-index: 10;
        }
        .periskope-fab:hover {
          background: #15803d;
          transform: scale(1.06);
        }

        /* PERISKOPE MAIN WINDOW */
        .periskope-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
        }

        .periskope-header {
          padding: 12px 20px;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .periskope-stream {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #f8fafc;
        }

        .periskope-bubble {
          max-width: 65%;
          padding: 10px 14px;
          font-size: 0.84rem;
          line-height: 1.45;
          position: relative;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .periskope-bubble-inbound {
          align-self: flex-start;
          background: #ffffff;
          color: #1e293b;
          border-radius: 0 12px 12px 12px;
          border: 1px solid #e2e8f0;
        }

        .periskope-bubble-outbound {
          align-self: flex-end;
          background: #dcfce7;
          color: #064e3b;
          border-radius: 12px 0 12px 12px;
          border: 1px solid #bbf7d0;
        }

        .periskope-composer {
          padding: 12px 20px;
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .periskope-composer-input {
          flex: 1;
          padding: 10px 16px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.85rem;
          color: #0f172a;
          outline: none;
        }
        .periskope-composer-input:focus {
          border-color: #16a34a;
          background: #ffffff;
        }

        .periskope-send-btn {
          background: #16a34a;
          color: #ffffff;
          font-weight: 700;
          border: none;
          padding: 10px 18px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.84rem;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.2s;
        }
        .periskope-send-btn:hover {
          background: #15803d;
        }

        /* PERISKOPE NEW CHAT MODAL (EXACT PERISKOPE POPUP LOOK) */
        .periskope-modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          box-sizing: border-box;
        }

        .periskope-modal-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          width: 100%;
          max-width: 480px;
          padding: 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .periskope-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .periskope-modal-title {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
        }

        .periskope-modal-input-wrap {
          border: 1px solid #16a34a;
          border-radius: 8px;
          padding: 10px 14px;
          margin-bottom: 20px;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
        }

        .periskope-modal-input {
          width: 100%;
          border: none;
          outline: none;
          font-size: 0.88rem;
          color: #0f172a;
        }

        .periskope-sender-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
        }

        .periskope-account-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #334155;
        }

        .periskope-account-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #2563eb;
          color: #ffffff;
          font-size: 0.68rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      {/* PERISKOPE DITTO NEW CHAT MODAL */}
      {showNewChatModal && (
        <div className="periskope-modal-overlay">
          <div className="periskope-modal-card">
            <div className="periskope-modal-header">
              <span className="periskope-modal-title">New Chat</span>
              <button
                onClick={() => setShowNewChatModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleStartNewChat}>
              <div className="periskope-modal-input-wrap">
                <input
                  type="text"
                  required
                  placeholder="Search contact by name or number..."
                  value={newContactQuery}
                  onChange={e => setNewContactQuery(e.target.value)}
                  className="periskope-modal-input"
                  autoFocus
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <input
                  type="text"
                  placeholder="Optional: Contact Name (e.g. Lavanya)"
                  value={newContactName}
                  onChange={e => setNewContactName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div className="periskope-sender-row">
                <div className="periskope-account-badge">
                  <div className="periskope-account-avatar">KL</div>
                  <span>KLAPP (+91 79890 33580)</span>
                </div>

                <button
                  type="submit"
                  disabled={!newContactQuery.trim()}
                  style={{
                    background: newContactQuery.trim() ? '#16a34a' : '#e2e8f0',
                    color: newContactQuery.trim() ? '#ffffff' : '#94a3b8',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontSize: '0.84rem',
                    fontWeight: '700',
                    cursor: newContactQuery.trim() ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  Start Chat <span>➢</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LEFT PERISKOPE SIDEBAR */}
      <div className="periskope-sidebar">
        <div className="periskope-sidebar-header">
          <div className="periskope-inbox-dropdown">
            <i className="ri-phone-line" style={{ color: '#64748b' }}></i>
            <span>Inbox</span>
          </div>

          <div className="periskope-header-actions">
            <button className="periskope-icon-btn" onClick={fetchChats} title="Refresh Inbox">
              <i className="ri-refresh-line"></i>
            </button>
            <button className="periskope-icon-btn" title="Search">
              <i className="ri-search-line"></i>
            </button>
            <button className="periskope-icon-btn" title="Filter">
              <i className="ri-filter-3-line"></i>
            </button>
          </div>
        </div>

        <div className="periskope-search-bar">
          <div style={{ position: 'relative' }}>
            <i className="ri-search-line" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.8rem' }}></i>
            <input
              type="text"
              placeholder="Search chats, messages, contacts..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="periskope-search-input"
            />
          </div>
        </div>

        <div className="periskope-chat-list">
          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
              <i className="ri-loader-4-line animate-spin" style={{ color: '#16a34a', marginRight: '6px' }}></i> Loading chats...
            </div>
          ) : filteredChats.length === 0 ? (
            <div style={{ padding: '28px', textAlign: 'center', fontSize: '0.82rem', color: '#94a3b8' }}>
              No chats found. Click <strong style={{ color: '#16a34a' }}>+</strong> below to start a conversation!
            </div>
          ) : (
            filteredChats.map(c => {
              const isActive = c.phone === activeChatPhone;
              return (
                <div
                  key={c.phone}
                  onClick={() => setActiveChatPhone(c.phone)}
                  className={`periskope-chat-card ${isActive ? 'active' : ''}`}
                >
                  <div className="periskope-avatar">
                    {c.contactName ? c.contactName.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div className="periskope-chat-info">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span className="periskope-contact-name">{c.contactName}</span>
                        <span className="periskope-label-tag">+ Label</span>
                      </div>
                      <span className="periskope-timestamp">
                        {new Date(c.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="periskope-last-msg">{c.lastMessage || 'No messages'}</div>
                      {c.unreadCount > 0 && (
                        <div className="periskope-unread-badge">{c.unreadCount}</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* FLOATING ACTION BUTTON (+) FOR NEW CHAT */}
        <button
          className="periskope-fab"
          onClick={() => setShowNewChatModal(true)}
          title="New Chat"
        >
          +
        </button>
      </div>

      {/* RIGHT PERISKOPE MAIN WINDOW */}
      <div className="periskope-main">
        {activeChat ? (
          <>
            {/* Header */}
            <div className="periskope-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="periskope-avatar" style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}>
                  {activeChat.contactName ? activeChat.contactName.charAt(0).toUpperCase() : 'C'}
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a' }}>
                    {activeChat.contactName}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', fontFamily: 'monospace' }}>
                    +{activeChat.phone}
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/${activeChat.phone}`}
                target="_blank"
                rel="noreferrer"
                style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', padding: '6px 14px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <i className="ri-whatsapp-line" style={{ color: '#16a34a' }}></i> Open WhatsApp
              </a>
            </div>

            {/* Chat Stream */}
            <div className="periskope-stream">
              {activeChat.messages && activeChat.messages.length > 0 ? (
                activeChat.messages.map((m, idx) => {
                  const isOutbound = m.sender === 'AASHISH' || m.sender === 'MINNI' || m.sender === 'BOT';
                  return (
                    <div
                      key={m.id || idx}
                      className={`periskope-bubble ${isOutbound ? 'periskope-bubble-outbound' : 'periskope-bubble-inbound'}`}
                    >
                      <div style={{ whitespace: 'pre-wrap' }}>{m.text}</div>
                      <div style={{ fontSize: '0.65rem', color: isOutbound ? '#047857' : '#94a3b8', textAlign: 'right', marginTop: '4px' }}>
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {isOutbound && <span style={{ marginLeft: '4px' }}>✓✓</span>}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem', padding: '40px' }}>
                  No messages in this chat. Type below to send a message.
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Composer */}
            <form onSubmit={handleSendMessage} className="periskope-composer">
              <input
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                className="periskope-composer-input"
              />
              <button
                type="submit"
                disabled={!messageText.trim() || sending}
                className="periskope-send-btn"
              >
                Send ➢
              </button>
            </form>
          </>
        ) : (
          /* EMPTY STATE (EXACT PERISKOPE LOOK) */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px', color: '#94a3b8' }}>
              🖱️
            </div>
            <div style={{ fontWeight: '600', fontSize: '0.92rem', color: '#334155' }}>
              Select a chat to view
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px', cursor: 'pointer', textDecoration: 'underline' }} onClick={fetchChats}>
              Can't see all data? Click to refresh
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
