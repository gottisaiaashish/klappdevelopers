/* ==========================================================================
   KLAPP DEVELOPERS - COMPONENTS INTERACTION ENGINE
   Portfolio Filters, Case Study Modal, Pricing Toggle, FAQ Accordion
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPortfolioFilters();
  initCaseStudyModal();
  initPricingToggle();
  initFaqAccordion();
  initContactForm();
});

/* --------------------------------------------------------------------------
   1. PORTFOLIO CATEGORY FILTERING
   -------------------------------------------------------------------------- */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-card-wrapper');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   2. CASE STUDY MODAL DIALOG
   -------------------------------------------------------------------------- */
const caseStudyData = {
  nandhakam: {
    title: 'Nandhakam Luxury Stays & Resort Portal',
    client: 'Nandhakam Hospitality Group',
    tech: 'React, Node.js, WhatsApp Automation, PostgreSQL',
    desc: 'An end-to-end luxury booking engine integrated with direct WhatsApp payment verification, n8n webhook automation, and real-time room availability matrix.',
    metrics: [
      { label: 'Booking Conversion', value: '+180%' },
      { label: 'Check-in Latency', value: '< 2 mins' },
      { label: 'WhatsApp Leads', value: '4,500+/mo' }
    ]
  },
  aiagent: {
    title: 'Enterprise AI Autonomous Customer Agent',
    client: 'FinTech Global Corp',
    tech: 'OpenAI GPT-4o, RAG Vector Search, Node.js, Redis',
    desc: 'A enterprise-grade AI chatbot system that resolves complex financial support queries, reads PDF invoices, and syncs automatically with internal CRM systems.',
    metrics: [
      { label: 'Support Ticket Reduction', value: '68%' },
      { label: 'Response Time', value: '0.4s' },
      { label: 'Customer CSAT', value: '99.4%' }
    ]
  },
  whatsappcrm: {
    title: 'Automated WhatsApp Sales Pipeline & Bot',
    client: 'Klapp Developers Internal Suite',
    tech: 'WhatsApp Cloud API, Express.js, MongoDB, Webhooks',
    desc: 'A multi-agent WhatsApp CRM suite featuring automated lead qualification, interactive multi-choice menus, and instant calendar booking links.',
    metrics: [
      { label: 'Lead Qualification Speed', value: 'Instant' },
      { label: 'Client Engagement', value: '94%' },
      { label: 'Monthly Messages', value: '250,000+' }
    ]
  }
};

function initCaseStudyModal() {
  const modal = document.getElementById('caseStudyModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const openBtns = document.querySelectorAll('.open-case-study-btn');

  if (!modal || !closeBtn) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-project');
      const data = caseStudyData[id] || caseStudyData.nandhakam;

      document.getElementById('modalTitle').textContent = data.title;
      document.getElementById('modalClient').textContent = `Client: ${data.client}`;
      document.getElementById('modalTech').textContent = `Tech Stack: ${data.tech}`;
      document.getElementById('modalDesc').textContent = data.desc;

      const metricsContainer = document.getElementById('modalMetrics');
      metricsContainer.innerHTML = data.metrics.map(m => `
        <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.08);">
          <div style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: var(--accent-cyan);">${m.value}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">${m.label}</div>
        </div>
      `).join('');

      modal.classList.add('active');
    });
  });

  closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });
}

/* --------------------------------------------------------------------------
   3. PRICING TOGGLE (MONTHLY / ANNUAL)
   -------------------------------------------------------------------------- */
function initPricingToggle() {
  const toggle = document.getElementById('pricingToggle');
  if (!toggle) return;

  const basicPrice = document.getElementById('priceBasic');
  const profPrice = document.getElementById('priceProf');
  const entPrice = document.getElementById('priceEnterprise');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    const isAnnual = toggle.classList.contains('active');

    if (isAnnual) {
      if (basicPrice) basicPrice.textContent = '₹24,999';
      if (profPrice) profPrice.textContent = '₹49,999';
      if (entPrice) entPrice.textContent = '₹99,999';
    } else {
      if (basicPrice) basicPrice.textContent = '₹29,999';
      if (profPrice) profPrice.textContent = '₹59,999';
      if (entPrice) entPrice.textContent = '₹1,19,999';
    }
  });
}

/* --------------------------------------------------------------------------
   4. FAQ ACCORDION
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    item.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      items.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
}

/* --------------------------------------------------------------------------
   5. CONTACT FORM & WHATSAPP REDIRECT
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('agencyContactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const origText = btn.innerHTML;

    btn.innerHTML = '<i class="ri-loader-4-line spin"></i> Sending Message...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="ri-checkbox-circle-fill"></i> Message Sent Successfully!';
      btn.style.background = '#10b981';
      form.reset();

      setTimeout(() => {
        btn.innerHTML = origText;
        btn.disabled = false;
        btn.style.background = '';
      }, 4000);
    }, 1500);
  });
}
