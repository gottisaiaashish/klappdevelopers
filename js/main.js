/* ==========================================================================
   KLAPP DEVELOPERS - MAIN JAVASCRIPT ENGINE
   Canvas Mesh & Particles, Custom Cursor, Scroll Observer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initBgCanvas();
  initCustomCursor();
  initNavbarScroll();
  initScrollReveals();
  initMobileMenu();
});

/* --------------------------------------------------------------------------
   1. HTML5 BACKGROUND CANVAS (GRADIENT MESH + CONNECTED PARTICLES)
   -------------------------------------------------------------------------- */
function initBgCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 180 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.8 + 0.8;
      this.baseAlpha = Math.random() * 0.4 + 0.1;
      this.alpha = this.baseAlpha;
      // Soft cyan, blue, purple tint
      const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#ffffff'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse proximity interaction
      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.alpha = Math.min(0.8, this.baseAlpha + force * 0.5);
        } else {
          this.alpha = this.baseAlpha;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1.0;
    }
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 18000), 75);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const opacity = (1 - dist / 130) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = '#3b82f6';
          ctx.globalAlpha = opacity;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }
      }
    }
  }

  resize();

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    connectParticles();
    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   2. CUSTOM CURSOR & LERP FOLLOWER
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  const follower = document.getElementById('customFollower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function renderFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;

    follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderFollower);
  }

  renderFollower();

  // Attach hover state triggers for buttons, links, cards
  const clickables = document.querySelectorAll('a, button, .glass-card, .filter-btn, .faq-item, .toggle-switch');
  clickables.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering-clickable'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering-clickable'));
  });
}

/* --------------------------------------------------------------------------
   3. STICKY NAVBAR SCROLL OBSERVER
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* --------------------------------------------------------------------------
   4. SCROLL REVEAL OBSERVER & STATS COUNTER TRIGGER
   -------------------------------------------------------------------------- */
function initScrollReveals() {
  const elements = document.querySelectorAll('.reveal-element');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');

        // Check if element has counter target
        if (entry.target.classList.contains('stat-card')) {
          const numEl = entry.target.querySelector('.stat-number');
          if (numEl && !numEl.classList.contains('counted')) {
            numEl.classList.add('counted');
            animateCounter(numEl);
          }
        }

        // Trigger line progress animation in process section
        if (entry.target.classList.contains('process-timeline')) {
          const line = entry.target.querySelector('.process-progress-line');
          if (line) line.style.width = '100%';
        }
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-target'));
  const prefix = el.getAttribute('data-prefix') || '';
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic

    const val = (target * easeProgress).toFixed(target % 1 !== 0 ? 1 : 0);
    el.textContent = `${prefix}${val}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* --------------------------------------------------------------------------
   5. MOBILE MENU DRAWER
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('mobile-open');
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      icon.className = navMenu.classList.contains('mobile-open') ? 'ri-close-line' : 'ri-menu-line';
    }
  });

  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('mobile-open');
      const icon = toggleBtn.querySelector('i');
      if (icon) icon.className = 'ri-menu-line';
    });
  });
}
