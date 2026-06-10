/* ============================================================
   main.js  –  Entry point
   ============================================================ */
import './style.css';
import { initThreeBackground } from './three-bg.js';
import { initSmoothScroll }    from './smooth-scroll.js';
import { initAnimations }      from './animations.js';
import { initCursor }          from './cursor.js';
import { initLoader }          from './loader.js';
import { initMobileMenu }      from './mobile-menu.js';


/* ---- Boot sequence ---- */
const init = async () => {
  // 1. Loader (resolves when complete)
  await initLoader();

  // 2. Core systems
  initThreeBackground();
  initSmoothScroll();
  initCursor();
  initMobileMenu();

  // 3. Scroll-triggered animations (last so DOM is ready)
  initAnimations();
};

init();
