/* ============================================================
   animations.js  –  GSAP scroll-triggered animations
   ============================================================ */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Expose ScrollTrigger globally so Lenis can sync
window.ScrollTrigger = ScrollTrigger;

export function initAnimations() {

  /* ---- Reveal elements on scroll ---- */
  const reveals = document.querySelectorAll('[data-reveal]');

  reveals.forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  /* ---- Parallax hero title lines ---- */
  const heroLines = document.querySelectorAll('.hero__line');
  heroLines.forEach((line, i) => {
    gsap.to(line, {
      y: -20 * (i + 1),
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  });

  /* ---- Staggered work cards ---- */
  const cards = document.querySelectorAll('.work__card');
  if (cards.length) {
    gsap.fromTo(cards,
      { opacity: 0, y: 60, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.work__grid',
          start: 'top 80%',
        },
      }
    );
  }

  /* ---- Counter animation ---- */
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach((el) => {
    const target = parseInt(el.dataset.count, 10);

    gsap.to(el, {
      innerText: target,
      duration: 2,
      ease: 'power2.out',
      snap: { innerText: 1 },
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
      },
    });
  });

  /* ---- Skills stagger ---- */
  const skills = document.querySelectorAll('.about__skill');
  if (skills.length) {
    gsap.fromTo(skills,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about__skills',
          start: 'top 85%',
        },
      }
    );
  }

  /* ---- Marquee speed-up on scroll ---- */
  const marqueeTrack = document.querySelector('.marquee__track');
  if (marqueeTrack) {
    gsap.to(marqueeTrack, {
      x: '-=200',
      scrollTrigger: {
        trigger: '.marquee',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
      },
    });
  }
}
