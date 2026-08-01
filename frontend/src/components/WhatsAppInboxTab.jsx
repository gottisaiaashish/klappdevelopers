import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../config/api';

export default function WhatsAppInboxTab({ currentUser = 'AASHISH' }) {
  const [chats, setChats] = useState([]);
  const [activeChatPhone, setActiveChatPhone] = useState('');
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const messagesEndRef = useRef(null);

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

  const handleQuickReply = (text) => {
    setMessageText(text);
  };

  const filteredChats = chats.filter(c => {
    const matchesSearch = c.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.phone.includes(searchQuery);
    if (!matchesSearch) return false;
    if (statusFilter === 'HOT_LEAD') return c.statusTag === 'HOT_LEAD';
    if (statusFilter === 'CLIENT') return c.statusTag === 'CLIENT';
    if (statusFilter === 'UNREAD') return (c.unreadCount || 0) > 0;
    return true;
  });

  return (
    <div className="wa-inbox-wrapper">
      <style>{`
        .wa-inbox-wrapper {
          width: 100%;
          height: 740px;
          background: #0b141a;
          border-radius: 16px;
          border: 1px solid #202c33;
          display: flex;
          flex-direction: row;
          overflow: hidden;
          font-family: var(--font-sans, system-ui, sans-serif);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
          color: #e9edef;
        }

        /* Sidebar Styling (WhatsApp Web Authentic) */
        .wa-sidebar {
          width: 340px;
          min-width: 340px;
          background: #111b21;
          border-right: 1px solid #202c33;
          display: flex;
          flex-direction: column;
        }

        .wa-sidebar-top {
          padding: 12px;
          border-bottom: 1px solid #202c33;
        }

        .wa-search-wrap {
          position: relative;
          width: 100%;
          margin-bottom: 10px;
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

        .wa-filter-bar {
          display: flex;
          gap: 6px;
          overflow-x: auto;
        }

        .wa-filter-chip {
          background: #202c33;
          border: 1px solid #2a3942;
          color: #8696a0;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.74rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .wa-filter-chip:hover {
          background: #2a3942;
          color: #e9edef;
        }
        .wa-filter-chip.active {
          background: #005c4b;
          color: #25d366;
          border-color: #128c7e;
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
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #128c7e, #075e54);
          color: #fff;
          font-weight: 700;
          font-size: 1rem;
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
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
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
      `}</style>

      {/* LEFT SIDEBAR (WhatsApp Web Authentic) */}
      <div className="wa-sidebar">
        <div className="wa-sidebar-top">
          <div className="wa-search-wrap">
            <i className="ri-search-line"></i>
            <input
              type="text"
              placeholder="Search or start new chat..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="wa-search-input"
            />
          </div>

          <div className="wa-filter-bar">
            {['ALL', 'HOT_LEAD', 'CLIENT', 'UNREAD'].map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`wa-filter-chip ${statusFilter === f ? 'active' : ''}`}
              >
                {f === 'ALL' ? 'All Chats' : f === 'HOT_LEAD' ? '🔥 Hot Leads' : f === 'CLIENT' ? '🤝 Clients' : '📩 Unread'}
              </button>
            ))}
          </div>
        </div>

        <div className="wa-chat-list">
          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center', fontSize: '0.78rem', color: '#8696a0' }}>
              <i className="ri-loader-4-line animate-spin" style={{ color: '#25d366', marginRight: '6px' }}></i> Syncing WhatsApp chats...
            </div>
          ) : filteredChats.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', fontSize: '0.78rem', color: '#8696a0' }}>
              No chats found.
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

      {/* RIGHT CHAT WINDOW (WhatsApp Web Authentic) */}
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
                    Online | {activeChat.serviceInterest || 'Web & AI Automation'}
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/${activeChat.phone}`}
                target="_blank"
                rel="noreferrer"
                style={{ background: 'rgba(37, 211, 102, 0.15)', color: '#25d366', border: '1px solid rgba(37, 211, 102, 0.3)', padding: '6px 14px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <i className="ri-whatsapp-line"></i> WhatsApp Web
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
            <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>Select a contact from the left sidebar to start chatting.</div>
          </div>
        )}
      </div>
    </div>
  );
}
