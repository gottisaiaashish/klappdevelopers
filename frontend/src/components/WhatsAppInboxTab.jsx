import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../config/api';

export default function WhatsAppInboxTab({ currentUser = 'AASHISH' }) {
  const [chats, setChats] = useState([]);
  const [activeChatPhone, setActiveChatPhone] = useState('');
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'HOT_LEAD', 'CLIENT', 'UNREAD'
  const messagesEndRef = useRef(null);

  // Fetch all active chats from backend
  const fetchChats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/whatsapp/chats`);
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
    // Poll every 4 seconds for live inbound WhatsApp updates
    const interval = setInterval(fetchChats, 4000);
    return () => clearInterval(interval);
  }, []);

  // Mark chat as read when selected
  useEffect(() => {
    if (!activeChatPhone) return;
    const markRead = async () => {
      try {
        await fetch(`${API_BASE_URL}/whatsapp/read`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: activeChatPhone })
        });
        setChats(prev => prev.map(c => c.phone === activeChatPhone ? { ...c, unreadCount: 0 } : c));
      } catch (e) {}
    };
    markRead();
  }, [activeChatPhone]);

  // Scroll to bottom of message window
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
      const res = await fetch(`${API_BASE_URL}/whatsapp/send`, {
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

  // Filtered Chats
  const filteredChats = chats.filter(c => {
    const matchesSearch = c.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.phone.includes(searchQuery);
    if (!matchesSearch) return false;
    if (statusFilter === 'HOT_LEAD') return c.statusTag === 'HOT_LEAD';
    if (statusFilter === 'CLIENT') return c.statusTag === 'CLIENT';
    if (statusFilter === 'UNREAD') return (c.unreadCount || 0) > 0;
    return true;
  });

  const getTagBadgeColor = (tag) => {
    switch (tag) {
      case 'HOT_LEAD': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'CLIENT': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'PENDING_QUOTE': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="flex flex-col h-[750px] bg-[#0b141a] text-zinc-100 rounded-2xl border border-emerald-500/20 shadow-2xl overflow-hidden font-sans">
      
      {/* Top Header Banner */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-[#111b21] border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xl">
            <i className="ri-whatsapp-fill"></i>
          </div>
          <div>
            <h2 className="font-bold text-base tracking-wide flex items-center gap-2">
              KLAPP WhatsApp Shared Inbox
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                🟢 Live Connected
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Active Number: <span className="text-emerald-400 font-mono">+91 79890 33580 / 8247758835</span> (Shared with {currentUser === 'AASHISH' ? 'Aashish & Minni' : 'Minni & Aashish'})
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300">
            Role: <strong className="text-emerald-400">{currentUser}</strong>
          </span>
          <button 
            onClick={fetchChats} 
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition text-sm flex items-center gap-1"
            title="Refresh Conversations"
          >
            <i className="ri-refresh-line"></i> Refresh
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar - Chat List */}
        <div className="w-80 border-r border-zinc-800 bg-[#111b21] flex flex-col">
          
          {/* Search & Filter Bar */}
          <div className="p-3 border-b border-zinc-800 space-y-2">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-2.5 text-zinc-400 text-sm"></i>
              <input
                type="text"
                placeholder="Search contact or phone..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#202c33] border border-zinc-700/60 rounded-xl text-xs text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center gap-1 overflow-x-auto text-[11px] no-scrollbar pt-1">
              {['ALL', 'HOT_LEAD', 'CLIENT', 'UNREAD'].map(f => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-2.5 py-1 rounded-lg border transition whitespace-nowrap ${
                    statusFilter === f 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-semibold' 
                      : 'bg-[#202c33] text-zinc-400 border-transparent hover:bg-zinc-700'
                  }`}
                >
                  {f === 'ALL' ? 'All Chats' : f === 'HOT_LEAD' ? '🔥 Hot Leads' : f === 'CLIENT' ? '🤝 Clients' : '📩 Unread'}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Items List */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/50">
            {loading ? (
              <div className="p-6 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
                <i className="ri-loader-4-line animate-spin text-emerald-400"></i> Syncing WhatsApp chats...
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-500">
                No chats found for filter.
              </div>
            ) : (
              filteredChats.map(c => {
                const isActive = c.phone === activeChatPhone;
                return (
                  <div
                    key={c.phone}
                    onClick={() => setActiveChatPhone(c.phone)}
                    className={`p-3 cursor-pointer transition flex items-start gap-3 ${
                      isActive ? 'bg-[#2a3942] border-l-4 border-emerald-500' : 'hover:bg-[#202c33]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-bold text-sm shadow-md flex-shrink-0">
                      {c.contactName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-zinc-100 truncate">{c.contactName}</h4>
                        <span className="text-[10px] text-zinc-400">
                          {new Date(c.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">{c.lastMessage || 'No messages yet'}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded border ${getTagBadgeColor(c.statusTag)}`}>
                          {c.statusTag || 'LEAD'}
                        </span>
                        {c.unreadCount > 0 && (
                          <span className="text-[10px] bg-emerald-500 text-zinc-950 font-bold px-1.5 py-0.2 rounded-full shadow">
                            {c.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Section - Active Chat Feed & Composer */}
        <div className="flex-1 flex flex-col bg-[#0b141a] relative">
          {activeChat ? (
            <>
              {/* Active Chat Header */}
              <div className="px-5 py-3 bg-[#202c33] border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                    {activeChat.contactName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                      {activeChat.contactName}
                      <span className="text-xs text-zinc-400 font-mono">({activeChat.phone})</span>
                    </h3>
                    <p className="text-[11px] text-emerald-400">
                      Interest: {activeChat.serviceInterest || 'Web & AI Development'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <a
                    href={`https://wa.me/${activeChat.phone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 font-medium flex items-center gap-1 transition"
                  >
                    <i className="ri-whatsapp-line text-sm"></i> Open in WhatsApp Web
                  </a>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px]">
                {activeChat.messages && activeChat.messages.length > 0 ? (
                  activeChat.messages.map((m, idx) => {
                    const isOutbound = m.sender === 'AASHISH' || m.sender === 'MINNI' || m.sender === 'BOT';
                    return (
                      <div
                        key={m.id || idx}
                        className={`flex flex-col ${isOutbound ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[75%] px-3.5 py-2 rounded-2xl shadow text-xs relative leading-relaxed ${
                            isOutbound
                              ? 'bg-[#005c4b] text-zinc-100 rounded-tr-none border border-emerald-500/20'
                              : 'bg-[#202c33] text-zinc-100 rounded-tl-none border border-zinc-700/50'
                          }`}
                        >
                          {isOutbound && (
                            <span className="text-[10px] text-emerald-300 font-bold block mb-1">
                              {m.sender === 'AASHISH' ? '⚡ Aashish (Tech)' : m.sender === 'MINNI' ? '✨ Minni (Growth)' : '🤖 Klapp AI Bot'}
                            </span>
                          )}
                          <p className="whitespace-pre-wrap">{m.text}</p>
                          <div className={`flex items-center gap-1 justify-end text-[9px] mt-1 ${isOutbound ? 'text-emerald-200/70' : 'text-zinc-400'}`}>
                            <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {isOutbound && <i className="ri-double-check-line text-emerald-300 text-xs"></i>}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-zinc-500 text-xs">
                    No messages exchanged yet with {activeChat.contactName}. Type below to start conversation!
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Bar */}
              <div className="px-4 py-2 bg-[#111b21] border-t border-zinc-800 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex-shrink-0">Quick Replies:</span>
                <button
                  onClick={() => handleQuickReply('Hi! Thank you for reaching out to KLAPP Developers. We build sub-100ms web apps and AI automations. When are you free for a 10-min discovery call?')}
                  className="px-2.5 py-1 rounded-full bg-[#202c33] hover:bg-emerald-500/20 hover:text-emerald-300 text-zinc-300 border border-zinc-700 text-[11px] whitespace-nowrap transition"
                >
                  👋 Intro & Discovery Call
                </button>
                <button
                  onClick={() => handleQuickReply('Here is our Web App starter package proposal: Includes React Frontend, Node.js API, Sub-100ms speed, & Meta WhatsApp integration at ₹50,000.')}
                  className="px-2.5 py-1 rounded-full bg-[#202c33] hover:bg-emerald-500/20 hover:text-emerald-300 text-zinc-300 border border-zinc-700 text-[11px] whitespace-nowrap transition"
                >
                  💼 Web Package Quote (₹50k)
                </button>
                <button
                  onClick={() => handleQuickReply('You can view our live work portfolio & case studies here: https://klappdevelopers.in/#portfolio')}
                  className="px-2.5 py-1 rounded-full bg-[#202c33] hover:bg-emerald-500/20 hover:text-emerald-300 text-zinc-300 border border-zinc-700 text-[11px] whitespace-nowrap transition"
                >
                  📁 Live Portfolio Link
                </button>
              </div>

              {/* Message Composer Bar */}
              <form onSubmit={handleSendMessage} className="p-3 bg-[#202c33] border-t border-zinc-800 flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder={`Type WhatsApp message to ${activeChat.contactName}... (Sending as ${currentUser})`}
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 bg-[#2a3942] border border-zinc-700/80 rounded-xl text-xs text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!messageText.trim() || sending}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg"
                >
                  {sending ? (
                    <i className="ri-loader-4-line animate-spin"></i>
                  ) : (
                    <i className="ri-send-plane-fill"></i>
                  )}
                  Send WhatsApp
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 p-8 text-center">
              <i className="ri-whatsapp-line text-5xl text-emerald-500/40 mb-2"></i>
              <p className="text-sm font-semibold text-zinc-300">Select a contact to view WhatsApp chat history</p>
              <p className="text-xs text-zinc-500 mt-1">All incoming WhatsApp messages to Klapp numbers will land here live.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
