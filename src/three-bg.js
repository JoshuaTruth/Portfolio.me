/* ============================================================
   three-bg.js  –  Animated particle-field background
   ============================================================ */
import * as THREE from 'three';

export function initThreeBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  /* ---- Renderer ---- */
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  /* ---- Scene & Camera ---- */
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 3;

  /* ---- Particles ---- */
  const PARTICLE_COUNT = 1200;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors    = new Float32Array(PARTICLE_COUNT * 3);

  const accentColor  = new THREE.Color('#a78bfa');
  const baseColor    = new THREE.Color('#3a3660');

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    positions[i3]     = (Math.random() - 0.5) * 10;
    positions[i3 + 1] = (Math.random() - 0.5) * 10;
    positions[i3 + 2] = (Math.random() - 0.5) * 10;

    const mix = Math.random();
    const col = baseColor.clone().lerp(accentColor, mix * 0.4);
    colors[i3]     = col.r;
    colors[i3 + 1] = col.g;
    colors[i3 + 2] = col.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.015,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  /* ---- Mouse interaction ---- */
  const mouse = { x: 0, y: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ---- Resize ---- */
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onResize);

  /* ---- Render loop ---- */
  const clock = new THREE.Clock();

  const tick = () => {
    const elapsed = clock.getElapsedTime();

    // Gentle auto-rotation
    points.rotation.y = elapsed * 0.05;
    points.rotation.x = elapsed * 0.03;

    // Subtle mouse parallax
    camera.position.x += (mouse.x * 0.3 - camera.position.x) * 0.05;
    camera.position.y += (-mouse.y * 0.3 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };

  tick();
}
