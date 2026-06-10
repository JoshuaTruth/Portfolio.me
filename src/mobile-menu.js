/* ============================================================
   mobile-menu.js  –  Hamburger menu toggle
   ============================================================ */
export function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu   = document.getElementById('mobile-menu');

  if (!toggle || !menu) return;

  const mobileLinks = menu.querySelectorAll('[data-mobile-nav]');

  const open  = () => {
    menu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    // Pause scroll
    if (window.__lenis) window.__lenis.stop();
  };

  const close = () => {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    // Resume scroll
    if (window.__lenis) window.__lenis.start();
  };

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.contains('is-open');
    isOpen ? close() : open();
  });

  // Close on link click
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      close();
    });
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      close();
    }
  });
}
