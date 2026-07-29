/* ==========================================================================
   KLAPP DEVELOPERS - 3D INTERACTIVE MOCKUPS ENGINE
   Parallax Tilt for 3D Laptop, Device Showcases
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initLaptop3DTilt();
  initCards3DTilt();
  initMockupScreenScroll();
});

/* --------------------------------------------------------------------------
   1. HERO 3D LAPTOP MOUSE TILT PARALLAX
   -------------------------------------------------------------------------- */
function initLaptop3DTilt() {
  const laptopScene = document.getElementById('laptop3dScene');
  if (!laptopScene) return;

  const wrapper = laptopScene.closest('.hero-visual-wrapper') || document.querySelector('.hero');

  wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateX = (-y / rect.height) * 18; // Max 18deg tilt
    const rotateY = (x / rect.width) * 22;  // Max 22deg tilt

    laptopScene.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
  });

  wrapper.addEventListener('mouseleave', () => {
    laptopScene.style.transform = `rotateX(0deg) rotateY(0deg) translateZ(0px)`;
    laptopScene.style.transition = 'transform 0.6s ease-out';
  });

  wrapper.addEventListener('mouseenter', () => {
    laptopScene.style.transition = 'transform 0.1s ease-out';
  });
}

/* --------------------------------------------------------------------------
   2. 3D TILT FOR SERVICE & WHY CHOOSE US CARDS
   -------------------------------------------------------------------------- */
function initCards3DTilt() {
  const cards = document.querySelectorAll('.service-card, .why-card, .portfolio-card, .pricing-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = (-y / rect.height) * 10;
      const rotateY = (x / rect.width) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
      card.style.transition = 'transform 0.5s ease-out';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease-out';
    });
  });
}

/* --------------------------------------------------------------------------
   3. AUTO SCROLL SIMULATION IN DEMO DEVICES
   -------------------------------------------------------------------------- */
function initMockupScreenScroll() {
  const desktopScreen = document.getElementById('macbookScreenScroll');
  if (!desktopScreen) return;

  let direction = 1;
  let isHovered = false;

  desktopScreen.addEventListener('mouseenter', () => isHovered = true);
  desktopScreen.addEventListener('mouseleave', () => isHovered = false);

  setInterval(() => {
    if (isHovered) return;

    if (desktopScreen.scrollTop + desktopScreen.clientHeight >= desktopScreen.scrollHeight - 5) {
      direction = -1;
    } else if (desktopScreen.scrollTop <= 5) {
      direction = 1;
    }

    desktopScreen.scrollTop += direction * 0.8;
  }, 30);
}
