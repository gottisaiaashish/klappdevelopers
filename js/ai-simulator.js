/* ==========================================================================
   KLAPP DEVELOPERS - INTERACTIVE LIVE AI CHATBOT SIMULATOR
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAiSimulator();
});

const botKnowledge = {
  greetings: [
    "Hello! Welcome to KLAPP Developers. I am your AI assistant. How can I help transform your business today?",
    "Hey there! Ready to build something extraordinary? Ask me about our web development, AI agents, or WhatsApp automation!"
  ],
  pricing: "Our packages start at ₹29,999 for custom high-performance websites. For AI agents & WhatsApp automation suites, we craft tailored proposals based on your workflow requirements. Would you like to book a 15-minute consultation call?",
  services: "We offer 6 principal solutions:\n1. Custom Web Apps & Websites\n2. Autonomous AI Agents (LLM / RAG)\n3. WhatsApp CRM & Automation\n4. Mobile Apps (iOS & Android)\n5. Business ERP/CRM Software\n6. Scalable Cloud Architecture",
  whatsapp: "Our WhatsApp Automation enables auto-reply bots, interactive button menus, lead capture directly into Google Sheets/MongoDB, payment link generation, and 24/7 customer support without human latency!",
  ai: "We build custom AI agents trained on your private business data, documents, and API endpoints using OpenAI GPT-4o, Gemini 1.5, and vector embeddings.",
  timeline: "Custom websites take 7-14 days. WhatsApp automation bots take 3-5 days. Full enterprise AI software builds take 2-4 weeks with continuous agile staging previews.",
  contact: "You can book a quick strategy call using our CTA button, email us at contact@klappdevelopers.in, or chat with us directly on WhatsApp at +91 98765 43210!"
};

function initAiSimulator() {
  const chatHistory = document.getElementById('aiChatHistory');
  const chatInput = document.getElementById('aiChatInput');
  const sendBtn = document.getElementById('aiSendBtn');

  if (!chatHistory || !chatInput || !sendBtn) return;

  function appendMessage(text, sender) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    bubble.textContent = text;
    chatHistory.appendChild(bubble);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }

  function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    chatInput.value = '';

    // Simulate bot thinking indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chat-bubble bot';
    typingIndicator.innerHTML = '<i>KLAPP AI is thinking...</i>';
    chatHistory.appendChild(typingIndicator);
    chatHistory.scrollTop = chatHistory.scrollHeight;

    setTimeout(() => {
      typingIndicator.remove();
      const response = generateBotResponse(text.toLowerCase());
      appendMessage(response, 'bot');
    }, 1000);
  }

  sendBtn.addEventListener('click', handleSend);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });
}

function generateBotResponse(query) {
  if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
    return botKnowledge.greetings[Math.floor(Math.random() * botKnowledge.greetings.length)];
  }
  if (query.includes('price') || query.includes('cost') || query.includes('pricing') || query.includes('rate')) {
    return botKnowledge.pricing;
  }
  if (query.includes('whatsapp') || query.includes('chat') || query.includes('message')) {
    return botKnowledge.whatsapp;
  }
  if (query.includes('ai') || query.includes('agent') || query.includes('bot') || query.includes('gpt')) {
    return botKnowledge.ai;
  }
  if (query.includes('service') || query.includes('offer') || query.includes('build') || query.includes('what do you do')) {
    return botKnowledge.services;
  }
  if (query.includes('time') || query.includes('long') || query.includes('duration') || query.includes('days')) {
    return botKnowledge.timeline;
  }
  if (query.includes('contact') || query.includes('call') || query.includes('email') || query.includes('phone')) {
    return botKnowledge.contact;
  }

  return "That's a great question! At KLAPP Developers, we specialize in high-performance web development, AI automation, and custom business software. Would you like to schedule a quick call to discuss your exact requirements?";
}
