import './style.css';
import { initThreeBackground } from './three-bg.js';

/* ---- Portrait fallback ---- */
function initPortraitFallback() {
  document.querySelectorAll('.portrait__img').forEach((img) => {
    const portrait = img.closest('.portrait');
    const showFallback = () => portrait.classList.add('portrait--fallback');

    if (img.complete && img.naturalWidth === 0) {
      showFallback();
    } else {
      img.addEventListener('error', showFallback);
    }
  });
}

/* ---- Custom cursor ---- */
function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot = document.getElementById('cursor-dot');
  if (!dot) return;

  document.body.classList.add('has-custom-cursor');

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  const interactive = 'a, button, .btn, input, textarea, label';

  document.addEventListener('pointermove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  }, { passive: true });

  document.addEventListener('mouseover', (e) => {
    document.body.classList.toggle('cursor--hover', !!e.target.closest(interactive));
  });

  const tick = () => {
    currentX += (targetX - currentX) * 0.15;
    currentY += (targetY - currentY) * 0.15;
    dot.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  };

  tick();
}

/* ---- Lenis smooth scroll ---- */
function initLenis() {
  const Lenis = window.Lenis;
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!Lenis || !gsap) return null;

  const lenis = new Lenis({
    lerp: 0.08,
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  lenis.on('scroll', () => {
    if (ScrollTrigger) ScrollTrigger.update();
  });

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      lenis.scrollTo(target, { offset: -72, duration: 1.2 });
    });
  });

  window.__lenis = lenis;
  return lenis;
}

/* ---- GSAP scroll animations ---- */
function initGSAPAnimations() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  const once = { toggleActions: 'play none none none' };

  /* Hero — on load */
  const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTimeline
    .from('.hero__portrait-wrap', {
      opacity: 0,
      scale: 0.88,
      duration: 1,
    })
    .from(
      ['.hero__eyebrow', '.hero__name', '.hero__subtitle', '.hero__bio', '.hero__actions'],
      {
        opacity: 0,
        y: 32,
        duration: 0.9,
        stagger: 0.12,
      },
      '-=0.6'
    );

  gsap.to('.hero__portrait-glow', {
    scale: 1.08,
    opacity: 0.85,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  gsap.to('.portrait--hero', {
    y: -10,
    duration: 2.8,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  gsap.to('.hero__float-shape--1', {
    y: -16,
    x: 8,
    rotation: 12,
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  gsap.to('.hero__float-shape--2', {
    y: 12,
    x: -6,
    rotation: -10,
    duration: 3.2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, { scale: 1.03, duration: 0.25, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { scale: 1, duration: 0.25, ease: 'power2.out' });
    });
  });

  /* Section headings — clip-path reveal */
  gsap.utils.toArray('.section__title').forEach((title) => {
    gsap.from(title, {
      clipPath: 'inset(0 100% 0 0)',
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
        ...once,
      },
    });
  });

  /* Project cards — staggered per grid */
  gsap.utils.toArray('.projects__grid').forEach((grid) => {
    const cards = grid.querySelectorAll('.project-card');
    gsap.from(cards, {
      y: 48,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: grid,
        start: 'top 85%',
        ...once,
      },
    });
  });

  /* Skill pills — about section */
  gsap.utils.toArray('.skill-pills').forEach((container) => {
    const pills = container.querySelectorAll('.skill-pill');
    gsap.from(pills, {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      stagger: 0.06,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        ...once,
      },
    });
  });

  /* Timeline items */
  gsap.utils.toArray('.timeline__item').forEach((item) => {
    gsap.from(item, {
      x: -32,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 88%',
        ...once,
      },
    });
  });

  /* Remaining fade elements not covered above */
  gsap.utils.toArray('[data-fade]').forEach((el) => {
    if (
      el.classList.contains('section__title') ||
      el.classList.contains('project-card') ||
      el.classList.contains('timeline__item') ||
      el.classList.contains('hero__eyebrow') ||
      el.closest('.hero__portrait-wrap') ||
      el.closest('.hero__content') ||
      el.closest('.skill-pills')
    ) {
      return;
    }

    gsap.from(el, {
      y: 24,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        ...once,
      },
    });
  });
}

/* ---- Nav scroll behaviour ---- */
function initHeader(lenis) {
  const header = document.getElementById('header');
  if (!header) return;

  const update = (scrollY) => {
    header.classList.toggle('header--scrolled', scrollY > 80);
  };

  if (lenis) {
    lenis.on('scroll', ({ scroll }) => update(scroll));
  } else {
    window.addEventListener('scroll', () => update(window.scrollY), { passive: true });
  }

  update(window.scrollY);
}

/* ---- Mobile menu ---- */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  const links = menu.querySelectorAll('.mobile-menu__link');

  const close = () => {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (window.__lenis) window.__lenis.start();
  };

  const open = () => {
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (window.__lenis) window.__lenis.stop();
  };

  toggle.addEventListener('click', () => {
    menu.classList.contains('is-open') ? close() : open();
  });

  links.forEach((link) => link.addEventListener('click', close));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) close();
  });
}

/* ---- Contact form ---- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

    window.location.href = `mailto:rwendeirejoshuatruth@gmail.com?subject=${subject}&body=${body}`;
  });
}

/* ---- Boot — order: Three → Lenis → GSAP ---- */
function init() {
  initPortraitFallback();
  initThreeBackground();
  const lenis = initLenis();
  initGSAPAnimations();
  initCursor();
  initHeader(lenis);
  initMobileMenu();
  initContactForm();
}

init();
