import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../config/api';

export default function WhatsAppInboxTab({ currentUser = 'AASHISH' }) {
  const [chat, setChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const messagesEndRef = useRef(null);

  const isAashish = String(currentUser).toUpperCase().includes('AASHISH');

  // Direct 1-on-1 Contact Info depending on who is logged in
  const contactName = isAashish ? 'Manashvini (Minni)' : 'Gotti Aashish';
  const contactRole = isAashish ? 'Klapp Growth & Operations Lead' : 'Klapp Co-Founder & Tech Lead';
  const contactAvatarChar = isAashish ? 'M' : 'A';
  const contactPhone = isAashish ? '917989033580' : '918247758835';

  const emojiList = ['❤️', '👍', '🔥', '😂', '😮', '🙏', '✨', '⚡', '💯', '🎯', '🤝', '💼', '🚀', '🥳'];
  const reactionOptions = ['❤️', '👍', '🔥', '😂', '😮', '🙏'];

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
    const interval = setInterval(fetchChat, 2000); // 2s fast polling
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
    setShowEmojiPicker(false);
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

  const handleClearChat = async () => {
    if (!window.confirm('Are you sure you want to clear all chat messages?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/whatsapp/clear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        setChat(prev => ({ ...prev, messages: [], lastMessage: 'Chat cleared' }));
      }
    } catch (err) {
      console.error('Error clearing chat:', err);
    }
  };

  const handleReactToMessage = async (messageId, emoji) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/whatsapp/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          emoji,
          sender: currentUser
        })
      });
      const data = await res.json();
      if (data.success && data.chat) {
        setChat(data.chat);
      }
    } catch (err) {
      console.error('Error reacting to message:', err);
    }
  };

  const addEmojiToText = (emoji) => {
    setMessageText(prev => prev + emoji);
  };

  const matchesSearch = contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contactPhone.includes(searchQuery);

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
        }

        .wa-search-input {
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
        .wa-search-input:focus {
          border-color: #16a34a;
          background: #ffffff;
        }

        .wa-contact-card {
          padding: 14px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
          background: #f0fdf4;
          border-left: 4px solid #16a34a;
        }

        .wa-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: ${isAashish ? '#ec4899' : '#2563eb'};
          color: #ffffff;
          font-weight: 800;
          font-size: 1.05rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
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
        }

        .wa-bubble {
          max-width: 65%;
          padding: 10px 14px;
          font-size: 0.86rem;
          line-height: 1.45;
          position: relative;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .wa-bubble-my {
          align-self: flex-end;
          background: #dcfce7;
          color: #064e3b;
          border-radius: 12px 0 12px 12px;
          border: 1px solid #bbf7d0;
        }

        .wa-bubble-other {
          align-self: flex-start;
          background: #ffffff;
          color: #1e293b;
          border-radius: 0 12px 12px 12px;
          border: 1px solid #e2e8f0;
        }

        /* EMOJI REACTION POPUP BAR */
        .wa-reaction-bar {
          position: absolute;
          top: -34px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 3px 8px;
          display: flex;
          gap: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 10;
        }
        .wa-bubble-my .wa-reaction-bar { right: 0; }
        .wa-bubble-other .wa-reaction-bar { left: 0; }

        .wa-react-btn {
          background: none;
          border: none;
          font-size: 1rem;
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
          font-size: 0.72rem;
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
      `}</style>

      {/* LEFT SIDEBAR */}
      <div className="wa-sidebar">
        <div className="wa-sidebar-top">
          <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="ri-phone-line" style={{ color: '#64748b' }}></i>
            <span>Inbox</span>
          </div>

          <button
            onClick={fetchChat}
            style={{ width: '30px', height: '30px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#ffffff', color: '#64748b', cursor: 'pointer' }}
            title="Refresh Chat"
          >
            <i className="ri-refresh-line"></i>
          </button>
        </div>

        <div className="wa-search-bar">
          <div style={{ position: 'relative' }}>
            <i className="ri-search-line" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.8rem' }}></i>
            <input
              type="text"
              placeholder="Search chats, messages, contacts..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="wa-search-input"
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {matchesSearch && (
            <div className="wa-contact-card">
              <div className="wa-avatar">
                {contactAvatarChar}
              </div>
              <div className="wa-contact-info">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="wa-contact-name">{contactName}</span>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                    {chat?.lastMessageTime ? new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                  </span>
                </div>
                <div className="wa-last-msg">
                  {chat?.lastMessage || 'Start conversation...'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT MAIN CHAT WINDOW */}
      <div className="wa-main">
        {/* Header */}
        <div className="wa-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="wa-avatar" style={{ width: '38px', height: '38px', fontSize: '0.95rem' }}>
              {contactAvatarChar}
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#0f172a' }}>
                {contactName}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }}></span>
                {contactRole}
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
          ) : chat && chat.messages && chat.messages.length > 0 ? (
            chat.messages.map((m, idx) => {
              const isMyMsg = (isAashish && m.sender === 'AASHISH') || (!isAashish && m.sender === 'MINNI');
              const isHovered = hoveredMsgId === (m.id || idx);

              return (
                <div
                  key={m.id || idx}
                  className="wa-bubble-wrap"
                  onMouseEnter={() => setHoveredMsgId(m.id || idx)}
                  onMouseLeave={() => setHoveredMsgId(null)}
                >
                  <div className={`wa-bubble ${isMyMsg ? 'wa-bubble-my' : 'wa-bubble-other'}`}>
                    {/* EMOJI REACTION FLOATING BAR */}
                    {isHovered && (
                      <div className="wa-reaction-bar">
                        {reactionOptions.map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => handleReactToMessage(m.id, emoji)}
                            className="wa-react-btn"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}

                    <div style={{ whitespace: 'pre-wrap' }}>{m.text}</div>
                    <div style={{ fontSize: '0.65rem', color: isMyMsg ? '#047857' : '#94a3b8', textAlign: 'right', marginTop: '4px' }}>
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {isMyMsg && <span style={{ marginLeft: '4px' }}>✓✓</span>}
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
              No messages yet with {contactName}. Type below to send a message!
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
            placeholder={`Type a message to ${contactName}...`}
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
      </div>
    </div>
  );
}
