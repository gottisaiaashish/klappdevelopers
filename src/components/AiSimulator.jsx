import React, { useState } from 'react';

const knowledgeBase = [
  {
    keywords: ['price', 'pricing', 'cost', 'fee', 'charge', 'rate'],
    response: "⚡ Our website plans start at ₹29,999 for Basic Web. Our popular Professional Suite with AI & WhatsApp bot is ₹59,999, and Custom Enterprise solutions start at ₹1,19,999."
  },
  {
    keywords: ['whatsapp', 'bot', 'cloud api', 'chat'],
    response: "📲 We connect directly with Meta's official WhatsApp Cloud API. Your business number can send automated replies, booking links, payment collection URLs, and CRM updates instantly."
  },
  {
    keywords: ['time', 'duration', 'days', 'fast', 'launch', 'delivery'],
    response: "🚀 Standard websites and WhatsApp automation tools are delivered in 7 to 14 business days. Enterprise AI apps and ERP software take 2 to 4 weeks with daily updates."
  },
  {
    keywords: ['security', 'privacy', 'safe', 'data'],
    response: "🔒 100% Secure. We use private enterprise API keys with strict data retention rules. Your private company documents and data are never used to train public AI models."
  }
];

export default function AiSimulator() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '👋 Hi! I am the KLAPP AI Assistant. Ask me anything below (e.g. "What are your prices?", "How fast can you launch?", or "Tell me about WhatsApp automation").'
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    const newMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(newMessages);
    setInput('');

    setTimeout(() => {
      const lower = userText.toLowerCase();
      let matchedResponse = knowledgeBase.find(kb => kb.keywords.some(k => lower.includes(k)));
      
      let botReply = matchedResponse 
        ? matchedResponse.response 
        : "✨ Thanks for your inquiry! KLAPP Developers engineers high-performance websites, AI automations, and custom software. Would you like to book a direct discovery call with our team?";

      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 500);
  };

  return (
    <section id="simulator" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="glass-card" style={{ padding: '32px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div className="section-tag" style={{ marginBottom: '6px' }}>
                  <span className="section-tag-dot"></span> LIVE PLAYGROUND
                </div>
                <h3 className="section-title" style={{ fontSize: '2rem', marginBottom: 0 }}>Test KLAPP AI Assistant</h3>
              </div>
              <span className="badge badge-emerald" style={{ padding: '6px 14px' }}>
                ● AI AGENT ONLINE
              </span>
            </div>

            <style>{`
              .chat-history {
                min-height: 220px;
                max-height: 340px;
                overflow-y: auto;
                background: #ffffff;
                border: 1px solid var(--border-color);
                border-radius: 12px;
                padding: 18px;
                margin-bottom: 18px;
                display: flex;
                flex-direction: column;
                gap: 10px;
              }
              .chat-bubble {
                max-width: 85%;
                padding: 10px 16px;
                border-radius: 12px;
                font-size: 0.9rem;
                line-height: 1.5;
              }
              .chat-bubble.bot {
                align-self: flex-start;
                background: #f4f1ea;
                border: 1px solid var(--border-color);
                color: var(--text-primary);
              }
              .chat-bubble.user {
                align-self: flex-end;
                background: #18181b;
                color: #ffffff;
              }
              .chat-input-row {
                display: flex;
                gap: 10px;
              }
              .chat-input {
                flex: 1;
                background: #ffffff;
                border: 1px solid var(--border-color);
                border-radius: 9999px;
                padding: 12px 20px;
                color: var(--text-primary);
                font-family: var(--font-sans);
                font-size: 0.9rem;
                outline: none;
              }
              .chat-input:focus {
                border-color: var(--border-highlight);
              }
            `}</style>

            <div className="chat-history">
              {messages.map((m, i) => (
                <div key={i} className={`chat-bubble ${m.sender}`}>
                  {m.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="chat-input-row">
              <input 
                type="text" 
                className="chat-input"
                placeholder="Type a question (e.g. 'What are your prices?')..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0 24px' }}>
                Send <i className="ri-send-plane-fill"></i>
              </button>
            </form>

          </div>
        </div>

      </div>
    </section>
  );
}
