import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../config/api';

export default function WhatsAppInboxTab({ currentUser = 'AASHISH' }) {
  const [chat, setChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const isAashish = String(currentUser).toUpperCase().includes('AASHISH');
  const userDisplayName = isAashish ? '⚡ Gotti Aashish' : '✨ Manashvini (Minni)';
  const otherDisplayName = isAashish ? '✨ Manashvini (Minni)' : '⚡ Gotti Aashish';

  const fetchChat = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/whatsapp/chats`);
      const data = await res.json();
      if (data.success && Array.isArray(data.chats) && data.chats.length > 0) {
        setChat(data.chats[0]);
      }
    } catch (err) {
      console.error('Failed to load team chat:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChat();
    const interval = setInterval(fetchChat, 2500); // 2.5s fast polling for live chat feel
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!messageText.trim() || sending) return;

    const textToSend = messageText.trim();
    setMessageText('');
    setSending(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/whatsapp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSend,
          sender: currentUser
        })
      });
      const data = await res.json();
      if (data.success && data.chat) {
        setChat(data.chat);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="team-chat-wrapper">
      <style>{`
        .team-chat-wrapper {
          width: 100%;
          height: 100%;
          background: #ffffff;
          display: flex;
          flex-direction: row;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #1e293b;
        }

        /* SIDEBAR */
        .team-sidebar {
          width: 300px;
          min-width: 300px;
          background: #f8fafc;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
        }

        .team-sidebar-header {
          padding: 16px 18px;
          border-bottom: 1px solid #e2e8f0;
          background: #ffffff;
        }

        .team-channel-card {
          padding: 14px 16px;
          background: #f0fdf4;
          border-left: 4px solid #16a34a;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        .team-avatar-group {
          position: relative;
          width: 44px;
          height: 44px;
        }

        .team-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #2563eb;
          color: #ffffff;
          font-weight: 800;
          font-size: 0.72rem;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          border: 2px solid #ffffff;
        }

        .team-avatar-1 { top: 0; left: 0; background: #2563eb; }
        .team-avatar-2 { bottom: 0; right: 0; background: #ec4899; }

        /* MAIN CHAT WINDOW */
        .team-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
        }

        .team-header {
          padding: 14px 24px;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .team-stream {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: #f8fafc;
        }

        .team-bubble {
          max-width: 65%;
          padding: 12px 16px;
          font-size: 0.88rem;
          line-height: 1.45;
          position: relative;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
        }

        .team-bubble-my {
          align-self: flex-end;
          background: #dcfce7;
          color: #064e3b;
          border-radius: 14px 0 14px 14px;
          border: 1px solid #bbf7d0;
        }

        .team-bubble-other {
          align-self: flex-start;
          background: #ffffff;
          color: #1e293b;
          border-radius: 0 14px 14px 14px;
          border: 1px solid #e2e8f0;
        }

        .team-sender-name {
          font-size: 0.72rem;
          font-weight: 800;
          display: block;
          margin-bottom: 4px;
        }

        .team-composer {
          padding: 14px 24px;
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .team-composer-input {
          flex: 1;
          padding: 12px 18px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-size: 0.88rem;
          color: #0f172a;
          outline: none;
        }
        .team-composer-input:focus {
          border-color: #16a34a;
          background: #ffffff;
        }

        .team-send-btn {
          background: #16a34a;
          color: #ffffff;
          font-weight: 700;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.88rem;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.2s;
        }
        .team-send-btn:hover {
          background: #15803d;
        }
        .team-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      {/* LEFT SIDEBAR */}
      <div className="team-sidebar">
        <div className="team-sidebar-header">
          <div style={{ fontWeight: '800', fontSize: '0.94rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="ri-chat-smile-2-fill" style={{ color: '#16a34a' }}></i> Team Live Messenger
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
            Internal Private Channel (Aashish ↔ Minni)
          </div>
        </div>

        <div className="team-channel-card">
          <div className="team-avatar-group">
            <div className="team-avatar team-avatar-1">A</div>
            <div className="team-avatar team-avatar-2">M</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: '800', fontSize: '0.86rem', color: '#0f172a' }}>
              Aashish & Minni Chat
            </div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '600', marginTop: '2px' }}>
              🟢 Live Connected
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT MAIN CHAT AREA */}
      <div className="team-main">
        {/* Header Bar */}
        <div className="team-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="team-avatar-group" style={{ width: '40px', height: '40px' }}>
              <div className="team-avatar team-avatar-1" style={{ width: '26px', height: '26px' }}>A</div>
              <div className="team-avatar team-avatar-2" style={{ width: '26px', height: '26px' }}>M</div>
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#0f172a' }}>
                Klapp OS Team Messenger
              </div>
              <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                You are logged in as <strong style={{ color: '#2563eb' }}>{userDisplayName}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={fetchChat}
            style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '6px 14px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <i className="ri-refresh-line"></i> Refresh
          </button>
        </div>

        {/* Message Stream */}
        <div className="team-stream">
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
              <i className="ri-loader-4-line animate-spin" style={{ color: '#16a34a', marginRight: '6px' }}></i> Loading live chat...
            </div>
          ) : chat && chat.messages && chat.messages.length > 0 ? (
            chat.messages.map((m, idx) => {
              const isMyMsg = (isAashish && m.sender === 'AASHISH') || (!isAashish && m.sender === 'MINNI');
              const senderLabel = m.sender === 'AASHISH' ? '⚡ Gotti Aashish' : '✨ Manashvini (Minni)';
              const senderColor = m.sender === 'AASHISH' ? '#2563eb' : '#db2777';

              return (
                <div
                  key={m.id || idx}
                  className={`team-bubble ${isMyMsg ? 'team-bubble-my' : 'team-bubble-other'}`}
                >
                  <span className="team-sender-name" style={{ color: isMyMsg ? '#047857' : senderColor }}>
                    {senderLabel}
                  </span>
                  <div style={{ whitespace: 'pre-wrap' }}>{m.text}</div>
                  <div style={{ fontSize: '0.65rem', color: isMyMsg ? '#047857' : '#94a3b8', textAlign: 'right', marginTop: '4px' }}>
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {isMyMsg && <span style={{ marginLeft: '4px' }}>✓✓</span>}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
              No messages yet. Type below to send a message to {otherDisplayName}!
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Composer */}
        <form onSubmit={handleSendMessage} className="team-composer">
          <input
            type="text"
            placeholder={`Type a message to ${otherDisplayName}...`}
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            className="team-composer-input"
          />
          <button
            type="submit"
            disabled={!messageText.trim() || sending}
            className="team-send-btn"
          >
            Send ➢
          </button>
        </form>
      </div>
    </div>
  );
}
