/* ============================================================
   loader.js  –  Intro loading animation
   ============================================================ */
import gsap from 'gsap';

export function initLoader() {
  return new Promise((resolve) => {
    const loader    = document.getElementById('loader');
    const bar       = loader?.querySelector('.loader__bar');
    const textEl    = loader?.querySelector('.loader__text');

    if (!loader || !bar || !textEl) {
      resolve();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out loader
        gsap.to(loader, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete: () => {
            loader.style.display = 'none';
            resolve();
          },
        });
      },
    });

    // Animate progress bar fill
    tl.to(bar.querySelector('::after') || bar, {
      duration: 0, // we'll use the pseudo-element via a custom prop
    });

    // We animate via a proxy object since we can't target pseudo-elements directly
    const proxy = { progress: 0 };

    tl.to(proxy, {
      progress: 100,
      duration: 2.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        const p = Math.round(proxy.progress);
        textEl.textContent = `${p}%`;
        bar.style.setProperty('--loader-progress', proxy.progress / 100);
      },
    }, 0);

    // Add the CSS variable driven scaleX
    bar.style.cssText += '; --loader-progress: 0';
    // Override the ::after with inline style approach
    const style = document.createElement('style');
    style.textContent = `
      .loader__bar::after {
        transform: scaleX(var(--loader-progress, 0)) !important;
      }
    `;
    document.head.appendChild(style);
  });
}
