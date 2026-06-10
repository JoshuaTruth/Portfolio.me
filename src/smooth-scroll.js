/* ============================================================
   smooth-scroll.js  –  Lenis smooth scrolling
   ============================================================ */
import Lenis from 'lenis';

export function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  });

  // Sync with GSAP ScrollTrigger if loaded
  lenis.on('scroll', () => {
    if (window.ScrollTrigger) {
      window.ScrollTrigger.update();
    }
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Expose globally for other modules
  window.__lenis = lenis;

  // Anchor clicks – smooth scroll to section
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        lenis.scrollTo(target, { offset: 0, duration: 1.6 });
      }
    });
  });
}
