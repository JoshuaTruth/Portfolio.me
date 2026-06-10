/* ============================================================
   cursor.js  –  Custom cursor with hover states
   ============================================================ */
export function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor || matchMedia('(pointer: coarse)').matches) return;

  const dot  = cursor.querySelector('.cursor__dot');
  const ring = cursor.querySelector('.cursor__ring');

  let cx = 0, cy = 0;  // current
  let tx = 0, ty = 0;  // target

  /* ---- Track mouse ---- */
  window.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });

  /* ---- Hover detection ---- */
  const interactiveSelectors = 'a, button, [data-cursor-text], .work__card, .about__skill';

  document.querySelectorAll(interactiveSelectors).forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor--hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor--hover'));
  });

  /* ---- Smooth follow loop ---- */
  function tick() {
    cx += (tx - cx) * 0.15;
    cy += (ty - cy) * 0.15;

    cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;

    requestAnimationFrame(tick);
  }

  tick();
}
