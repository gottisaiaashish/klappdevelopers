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

  // New Contact Modal State
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [newChatPhone, setNewChatPhone] = useState('');
  const [newChatInitialMsg, setNewChatInitialMsg] = useState('');

  const fetchChats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/whatsapp/chats`);
      const data = await res.json();
      if (data.success && Array.isArray(data.chats)) {
        setChats(data.chats);
        if (!activeChatPhone && data.chats.length > 0) {
          setActiveChatPhone(data.chats[0].phone);
        }
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

  const activeChat = chats.find(c => c.phone === activeChatPhone) || chats[0];

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

  const handleCreateNewChat = async (e) => {
    e.preventDefault();
    if (!newChatPhone.trim()) return;

    let cleanPhone = newChatPhone.trim().replace(/\D/g, '');
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;

    const contactName = newChatName.trim() || `Client (${cleanPhone})`;
    const initialMsg = newChatInitialMsg.trim() || 'Hi! Connecting from KLAPP Developers.';

    setShowNewChatModal(false);
    setNewChatName('');
    setNewChatPhone('');
    setNewChatInitialMsg('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/whatsapp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          text: initialMsg,
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

  const handleQuickReply = (text) => {
    setMessageText(text);
  };

  const filteredChats = chats.filter(c =>
    c.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  return (
    <div className="wa-inbox-wrapper">
      <style>{`
        .wa-inbox-wrapper {
          width: 100%;
          height: calc(100vh - 140px);
          min-height: 600px;
          background: #0b141a;
          border-radius: 12px;
          border: 1px solid #202c33;
          display: flex;
          flex-direction: row;
          overflow: hidden;
          font-family: var(--font-sans, system-ui, sans-serif);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          color: #e9edef;
          position: relative;
        }

        /* Sidebar Styling */
        .wa-sidebar {
          width: 320px;
          min-width: 320px;
          background: #111b21;
          border-right: 1px solid #202c33;
          display: flex;
          flex-direction: column;
        }

        .wa-sidebar-top {
          padding: 12px;
          border-bottom: 1px solid #202c33;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .wa-search-wrap {
          position: relative;
          flex: 1;
        }

        .wa-search-wrap i {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #8696a0;
          font-size: 0.9rem;
        }

        .wa-search-input {
          width: 100%;
          padding: 9px 12px 9px 38px;
          background: #202c33;
          border: 1px solid #2a3942;
          border-radius: 10px;
          color: #e9edef;
          font-size: 0.82rem;
          outline: none;
          box-sizing: border-box;
        }
        .wa-search-input:focus {
          border-color: #25d366;
        }

        .wa-add-chat-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #25d366;
          color: #0b141a;
          border: none;
          font-size: 1.2rem;
          font-weight: 900;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, transform 0.1s;
          flex-shrink: 0;
        }
        .wa-add-chat-btn:hover {
          background: #20ba5a;
          transform: scale(1.04);
        }

        .wa-chat-list {
          flex: 1;
          overflow-y: auto;
        }

        .wa-chat-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-bottom: 1px solid #1f2c34;
          cursor: pointer;
          transition: background 0.2s;
        }
        .wa-chat-item:hover {
          background: #202c33;
        }
        .wa-chat-item.active {
          background: #2a3942;
          border-left: 4px solid #25d366;
        }

        .wa-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: linear-gradient(135deg, #128c7e, #075e54);
          color: #fff;
          font-weight: 700;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .wa-chat-meta {
          flex: 1;
          min-width: 0;
        }

        .wa-chat-name {
          font-weight: 700;
          font-size: 0.88rem;
          color: #e9edef;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .wa-chat-last-msg {
          font-size: 0.78rem;
          color: #8696a0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 3px;
        }

        .wa-unread-badge {
          background: #25d366;
          color: #0b141a;
          font-weight: 800;
          font-size: 0.7rem;
          padding: 2px 7px;
          border-radius: 999px;
        }

        /* Right Window Styling */
        .wa-window {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #0b141a;
        }

        .wa-window-header {
          padding: 12px 20px;
          background: #202c33;
          border-bottom: 1px solid #2a3942;
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
          gap: 12px;
          background-color: #0b141a;
          background-image: radial-gradient(#1f2c34 1px, transparent 1px);
          background-size: 18px 18px;
        }

        .wa-bubble {
          max-width: 68%;
          padding: 10px 14px;
          font-size: 0.84rem;
          line-height: 1.45;
          position: relative;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
        }

        .wa-bubble-customer {
          align-self: flex-start;
          background: #202c33;
          color: #e9edef;
          border-radius: 0 14px 14px 14px;
          border: 1px solid #2a3942;
        }

        .wa-bubble-outbound {
          align-self: flex-end;
          background: #005c4b;
          color: #e9edef;
          border-radius: 14px 0 14px 14px;
          border: 1px solid #128c7e;
        }

        .wa-sender-tag {
          font-size: 0.68rem;
          font-weight: 800;
          color: #53bdeb;
          display: block;
          margin-bottom: 4px;
        }

        .wa-time-tag {
          font-size: 0.65rem;
          color: rgba(233, 237, 239, 0.6);
          text-align: right;
          margin-top: 4px;
        }

        .wa-quick-bar {
          padding: 8px 16px;
          background: #111b21;
          border-top: 1px solid #202c33;
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
        }

        .wa-quick-btn {
          background: #202c33;
          border: 1px solid #2a3942;
          color: #e9edef;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .wa-quick-btn:hover {
          background: #005c4b;
          border-color: #25d366;
          color: #fff;
        }

        .wa-composer {
          padding: 12px 16px;
          background: #202c33;
          border-top: 1px solid #2a3942;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .wa-composer-input {
          flex: 1;
          padding: 11px 16px;
          background: #2a3942;
          border: 1px solid #3b4a54;
          border-radius: 12px;
          color: #fff;
          font-size: 0.85rem;
          outline: none;
        }
        .wa-composer-input:focus {
          border-color: #25d366;
        }

        .wa-send-btn {
          background: #25d366;
          color: #0b141a;
          font-weight: 800;
          border: none;
          padding: 11px 20px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 0.84rem;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.2s;
        }
        .wa-send-btn:hover {
          background: #20ba5a;
        }
        .wa-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* New Chat Modal Styling */
        .wa-modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(11, 20, 26, 0.85);
          backdrop-filter: blur(6px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          box-sizing: border-box;
        }

        .wa-modal-card {
          background: #111b21;
          border: 1px solid #2a3942;
          border-radius: 16px;
          width: 100%;
          max-width: 420px;
          padding: 24px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
        }

        .wa-modal-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #e9edef;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .wa-modal-input {
          width: 100%;
          padding: 10px 14px;
          background: #202c33;
          border: 1px solid #2a3942;
          border-radius: 10px;
          color: #e9edef;
          font-size: 0.86rem;
          outline: none;
          margin-top: 6px;
          box-sizing: border-box;
        }
        .wa-modal-input:focus {
          border-color: #25d366;
        }
      `}</style>

      {/* NEW CHAT POPUP MODAL */}
      {showNewChatModal && (
        <div className="wa-modal-overlay">
          <div className="wa-modal-card">
            <div className="wa-modal-title">
              <span>💬 Start New WhatsApp Chat</span>
              <button
                onClick={() => setShowNewChatModal(false)}
                style={{ background: 'none', border: 'none', color: '#8696a0', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#8696a0', marginBottom: '16px' }}>
              Enter client details to send a direct WhatsApp message from Klapp.
            </p>

            <form onSubmit={handleCreateNewChat}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.78rem', color: '#8696a0', fontWeight: '600' }}>Client Name / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh - Real Estate Lead"
                  value={newChatName}
                  onChange={e => setNewChatName(e.target.value)}
                  className="wa-modal-input"
                  autoFocus
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.78rem', color: '#8696a0', fontWeight: '600' }}>WhatsApp Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 8247758835 or +91 82477 58835"
                  value={newChatPhone}
                  onChange={e => setNewChatPhone(e.target.value)}
                  className="wa-modal-input"
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '0.78rem', color: '#8696a0', fontWeight: '600' }}>Initial WhatsApp Message</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Hi Ramesh! This is Aashish from KLAPP Developers. Reaching out regarding your web inquiry."
                  value={newChatInitialMsg}
                  onChange={e => setNewChatInitialMsg(e.target.value)}
                  className="wa-modal-input"
                  style={{ resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowNewChatModal(false)}
                  style={{ background: '#202c33', color: '#e9edef', border: '1px solid #2a3942', padding: '8px 16px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#25d366', color: '#0b141a', border: 'none', padding: '8px 18px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: '800', cursor: 'pointer' }}
                >
                  Start WhatsApp Chat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LEFT SIDEBAR */}
      <div className="wa-sidebar">
        <div className="wa-sidebar-top">
          <div className="wa-search-wrap">
            <i className="ri-search-line"></i>
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="wa-search-input"
            />
          </div>

          <button
            onClick={() => setShowNewChatModal(true)}
            className="wa-add-chat-btn"
            title="Start New Direct WhatsApp Chat (+ Number)"
          >
            <i className="ri-add-line"></i>
          </button>
        </div>

        <div className="wa-chat-list">
          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center', fontSize: '0.78rem', color: '#8696a0' }}>
              <i className="ri-loader-4-line animate-spin" style={{ color: '#25d366', marginRight: '6px' }}></i> Syncing WhatsApp chats...
            </div>
          ) : filteredChats.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', fontSize: '0.78rem', color: '#8696a0' }}>
              No active chats. Click <strong style={{ color: '#25d366' }}>+</strong> above to start a conversation!
            </div>
          ) : (
            filteredChats.map(c => {
              const isActive = c.phone === activeChatPhone;
              return (
                <div
                  key={c.phone}
                  onClick={() => setActiveChatPhone(c.phone)}
                  className={`wa-chat-item ${isActive ? 'active' : ''}`}
                >
                  <div className="wa-avatar">
                    {c.contactName ? c.contactName.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div className="wa-chat-meta">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="wa-chat-name">{c.contactName}</span>
                      <span style={{ fontSize: '0.68rem', color: '#8696a0' }}>
                        {new Date(c.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="wa-chat-last-msg">{c.lastMessage || 'No messages yet'}</div>
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="wa-unread-badge">{c.unreadCount}</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT CHAT WINDOW */}
      <div className="wa-window">
        {activeChat ? (
          <>
            {/* Active Chat Header */}
            <div className="wa-window-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="wa-avatar" style={{ width: '40px', height: '40px', fontSize: '0.9rem' }}>
                  {activeChat.contactName ? activeChat.contactName.charAt(0).toUpperCase() : 'C'}
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#e9edef' }}>
                    {activeChat.contactName} <span style={{ fontSize: '0.78rem', color: '#8696a0', fontFamily: 'monospace' }}>({activeChat.phone})</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#25d366' }}>
                    WhatsApp Connected
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/${activeChat.phone}`}
                target="_blank"
                rel="noreferrer"
                style={{ background: 'rgba(37, 211, 102, 0.15)', color: '#25d366', border: '1px solid rgba(37, 211, 102, 0.3)', padding: '6px 14px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <i className="ri-whatsapp-line"></i> Open in WhatsApp
              </a>
            </div>

            {/* Chat Stream */}
            <div className="wa-stream">
              {activeChat.messages && activeChat.messages.length > 0 ? (
                activeChat.messages.map((m, idx) => {
                  const isOutbound = m.sender === 'AASHISH' || m.sender === 'MINNI' || m.sender === 'BOT';
                  return (
                    <div
                      key={m.id || idx}
                      className={`wa-bubble ${isOutbound ? 'wa-bubble-outbound' : 'wa-bubble-customer'}`}
                    >
                      {isOutbound && (
                        <span className="wa-sender-tag">
                          {m.sender === 'AASHISH' ? '⚡ Aashish' : m.sender === 'MINNI' ? '✨ Minni' : '🤖 Klapp AI'}
                        </span>
                      )}
                      <div style={{ whitespace: 'pre-wrap' }}>{m.text}</div>
                      <div className="wa-time-tag">
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {isOutbound && <span style={{ marginLeft: '4px', color: '#53bdeb' }}>✓✓</span>}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', color: '#8696a0', fontSize: '0.8rem', padding: '40px' }}>
                  No chat history yet with {activeChat.contactName}. Type below to send a message!
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Reply Bar */}
            <div className="wa-quick-bar">
              <button
                onClick={() => handleQuickReply('Hi! Thank you for contacting KLAPP Developers. We build sub-100ms web apps and AI automations. When are you available for a 10-min discovery call?')}
                className="wa-quick-btn"
              >
                👋 Discovery Call
              </button>
              <button
                onClick={() => handleQuickReply('Here is our Web App package proposal: React Frontend, Node.js API, Sub-100ms speed & Meta WhatsApp integration at ₹50,000.')}
                className="wa-quick-btn"
              >
                💼 Web Package (₹50k)
              </button>
              <button
                onClick={() => handleQuickReply('You can view our live work portfolio & case studies here: https://klappdevelopers.in/#portfolio')}
                className="wa-quick-btn"
              >
                📁 Portfolio Link
              </button>
            </div>

            {/* Message Composer Bar */}
            <form onSubmit={handleSendMessage} className="wa-composer">
              <input
                type="text"
                placeholder={`Type message to ${activeChat.contactName}...`}
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                className="wa-composer-input"
              />
              <button
                type="submit"
                disabled={!messageText.trim() || sending}
                className="wa-send-btn"
              >
                {sending ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-send-plane-fill"></i>}
                Send
              </button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#8696a0', padding: '40px', textAlign: 'center' }}>
            <i className="ri-whatsapp-line" style={{ fontSize: '3.5rem', color: '#25d366', opacity: 0.5, marginBottom: '12px' }}></i>
            <div style={{ fontWeight: '700', fontSize: '1rem', color: '#e9edef' }}>WhatsApp Web for Klapp</div>
            <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>Select a contact from the left sidebar or click <strong style={{ color: '#25d366' }}>+</strong> to start a new chat.</div>
          </div>
        )}
      </div>
    </div>
  );
}
