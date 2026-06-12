/* Painted background — Three.js shader wash */
export function initThreeBackground() {
  const THREE = window.THREE;
  const canvas = document.getElementById('bg-canvas');
  if (!THREE || !canvas) return null;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const uniforms = {
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uTime: { value: 0 },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec2 uMouse;
      uniform float uTime;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;

        float n1 = sin(uv.x * 3.2 + uTime * 0.14 + uMouse.x * 1.8)
                 * cos(uv.y * 2.8 + uTime * 0.11 + uMouse.y * 1.6);
        float n2 = sin(uv.x * 5.1 - uTime * 0.09 + uMouse.y * 2.4)
                 * cos(uv.y * 4.3 + uTime * 0.07 + uMouse.x * 2.0);
        float n3 = cos(uv.x * 2.0 + uv.y * 2.5 + uTime * 0.05);
        float blend = (n1 + n2 + n3) / 3.0;

        vec3 navy = vec3(0.106, 0.227, 0.420);
        vec3 teal = vec3(0.059, 0.443, 0.451);
        vec3 base = vec3(0.980, 0.984, 0.988);

        vec3 painted = mix(navy, teal, blend * 0.5 + 0.5);
        vec3 color = mix(base, painted, 0.08);

        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(mesh);

  const targetMouse = { x: 0.5, y: 0.5 };
  const currentMouse = { x: 0.5, y: 0.5 };

  const onPointerMove = (e) => {
    targetMouse.x = e.clientX / window.innerWidth;
    targetMouse.y = 1 - e.clientY / window.innerHeight;
  };

  const onResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('resize', onResize);
  onResize();

  const clock = new THREE.Clock();

  const animate = () => {
    uniforms.uTime.value = clock.getElapsedTime();

    currentMouse.x += (targetMouse.x - currentMouse.x) * 0.04;
    currentMouse.y += (targetMouse.y - currentMouse.y) * 0.04;
    uniforms.uMouse.value.set(currentMouse.x, currentMouse.y);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();

  return { destroy: () => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('resize', onResize);
    renderer.dispose();
    material.dispose();
    mesh.geometry.dispose();
  }};
}
