// Cena 3D do topo: uma lojinha com toldo listrado (o mesmo toldo do logo),
// vitrine com prateleiras e um celular flutuando com o site da loja na tela.
import * as THREE from 'three';
import { RoundedBoxGeometry } from './RoundedBoxGeometry.js';

const C = {
  ink: 0x14213d, inkDeep: 0x0d1830, coral: 0xff5a36, white: 0xffffff,
  sun: 0xffc93c, mint: 0x2ec4b6, glass: 0x24395f, wood: 0xc98b5a,
};

export function startVitrine(canvas, opts = {}) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    return false;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  const target = new THREE.Vector3(0.25, 1.9, 0.6);
  const camBase = new THREE.Vector3(5.6, 3.4, 10.2);

  // luz
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd6deea, 1.15));
  const sunLight = new THREE.DirectionalLight(0xfff1e0, 2.2);
  sunLight.position.set(5, 9, 7);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(1024, 1024);
  Object.assign(sunLight.shadow.camera, { left: -7, right: 7, top: 7, bottom: -3, near: 1, far: 30 });
  sunLight.shadow.radius = 6;
  sunLight.shadow.bias = -0.0005;
  scene.add(sunLight);
  const rim = new THREE.DirectionalLight(0xffd2c4, 0.6);
  rim.position.set(-6, 4, -4);
  scene.add(rim);

  const std = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.65, metalness: 0.05, ...extra });
  const mesh = (geo, mat, cast = true, receive = true) => {
    const m = new THREE.Mesh(geo, mat); m.castShadow = cast; m.receiveShadow = receive; return m;
  };

  // chão que só recebe sombra
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.16 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true;
  scene.add(ground);

  const shop = new THREE.Group();
  scene.add(shop);

  // calçada
  const curb = mesh(new RoundedBoxGeometry(5.2, 0.16, 2.6, 2, 0.05), std(0xe6ebf2));
  curb.position.set(0, 0.08, 0.5); shop.add(curb);

  // corpo da loja
  const W = 4.2, H = 3.5, D = 1.7;
  const body = mesh(new RoundedBoxGeometry(W, H, D, 3, 0.08), std(C.ink));
  body.position.set(0, 0.16 + H / 2, 0); shop.add(body);
  const front = D / 2 + 0.001;

  // porta
  const door = mesh(new RoundedBoxGeometry(0.95, 1.85, 0.08, 2, 0.03), std(C.inkDeep));
  door.position.set(-1.45, 0.16 + 0.925, front + 0.02); shop.add(door);
  const doorGlass = mesh(new THREE.PlaneGeometry(0.7, 0.9), std(C.glass, { roughness: 0.15, metalness: 0.3, emissive: 0x1b2c50, emissiveIntensity: 0.4 }), false);
  doorGlass.position.set(-1.45, 1.4, front + 0.065); shop.add(doorGlass);
  const knob = mesh(new THREE.SphereGeometry(0.05, 16, 12), std(C.sun, { metalness: 0.6, roughness: 0.3 }));
  knob.position.set(-1.12, 1.05, front + 0.1); shop.add(knob);

  // vitrine
  const winW = 2.35, winH = 1.55, winX = 0.72, winY = 1.38;
  const winFrame = mesh(new RoundedBoxGeometry(winW + 0.18, winH + 0.18, 0.1, 2, 0.04), std(C.white));
  winFrame.position.set(winX, winY, front + 0.02); shop.add(winFrame);
  const back = mesh(new THREE.PlaneGeometry(winW, winH), std(0xfff4e8, { emissive: 0xfff1df, emissiveIntensity: 0.55 }), false);
  back.position.set(winX, winY, front + 0.075); shop.add(back);
  // prateleiras com produtos
  const shelfMat = std(C.wood);
  [winY - 0.42, winY + 0.18].forEach((y, row) => {
    const shelf = mesh(new THREE.BoxGeometry(winW - 0.2, 0.05, 0.22), shelfMat);
    shelf.position.set(winX, y, front + 0.18); shop.add(shelf);
    const colors = row ? [C.coral, C.mint, C.sun, C.ink] : [C.sun, C.coral, C.white, C.mint, C.coral];
    colors.forEach((c, i) => {
      const w = 0.22 + ((i * 37) % 3) * 0.05, h = 0.2 + ((i * 53) % 4) * 0.06;
      const item = mesh(new RoundedBoxGeometry(w, h, 0.16, 2, 0.03), std(c));
      item.position.set(winX - winW / 2 + 0.3 + i * ((winW - 0.5) / (colors.length - 1)), y + 0.025 + h / 2, front + 0.18);
      shop.add(item);
    });
  });
  // vidro
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(winW, winH),
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.12, clearcoat: 1 }));
  glass.position.set(winX, winY, front + 0.32); shop.add(glass);

  // letreiro com o logo
  const sign = mesh(new RoundedBoxGeometry(2.7, 0.62, 0.12, 2, 0.05), std(C.inkDeep));
  sign.position.set(0, 0.16 + H - 0.42, front + 0.03); shop.add(sign);
  new THREE.TextureLoader().load(opts.logo, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const ratio = tex.image.width / tex.image.height || 3.55;
    const h = 0.38, plane = new THREE.Mesh(new THREE.PlaneGeometry(h * ratio, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
    plane.position.set(0, sign.position.y, front + 0.1); shop.add(plane); requestRender();
  });

  // toldo listrado com babado em meia-lua, igual ao do logo
  const stripes = 9, aw = W + 0.3, sw = aw / stripes, depth = 1.05, tilt = 0.42;
  const awY = 0.16 + H - 0.86;
  const awning = new THREE.Group();
  const flaps = new THREE.Group();
  const stripeMat = [std(C.coral, { roughness: 0.8, side: THREE.DoubleSide }), std(C.white, { roughness: 0.8, side: THREE.DoubleSide })];
  for (let i = 0; i < stripes; i++) {
    const mat = stripeMat[i % 2], x = -aw / 2 + sw * (i + 0.5);
    const strip = mesh(new THREE.BoxGeometry(sw, 0.04, depth), mat);
    strip.position.set(x, 0, depth / 2); awning.add(strip);
    const band = mesh(new THREE.PlaneGeometry(sw, 0.16), mat);
    band.position.set(x, -0.08, 0); flaps.add(band);
    const flap = mesh(new THREE.CircleGeometry(sw / 2, 24, Math.PI, Math.PI), mat);
    flap.position.set(x, -0.16, 0); flaps.add(flap);
  }
  awning.rotation.x = tilt;
  awning.position.set(0, awY, front);
  flaps.position.set(0, awY - depth * Math.sin(tilt), front + depth * Math.cos(tilt));
  shop.add(awning, flaps);

  // celular flutuando com o site na tela
  const phone = new THREE.Group();
  const bodyPhone = mesh(new RoundedBoxGeometry(1.2, 2.5, 0.12, 4, 0.16), std(C.inkDeep, { roughness: 0.35, metalness: 0.4 }));
  phone.add(bodyPhone);
  const screenMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const screen = new THREE.Mesh(new RoundedScreen(1.08, 2.36, 0.11), screenMat);
  screen.position.z = 0.062; phone.add(screen);
  new THREE.TextureLoader().load(opts.screen, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    screenMat.map = tex; screenMat.needsUpdate = true; requestRender();
  });
  phone.position.set(2.75, 1.95, 2.35);
  phone.rotation.set(-0.04, -0.42, 0.06);
  scene.add(phone);

  // objetos flutuando: sacolas, etiqueta de preço e balão de mensagem
  const floaters = [];
  const bag = (color, handle) => {
    const g = new THREE.Group();
    g.add(mesh(new RoundedBoxGeometry(0.5, 0.58, 0.24, 2, 0.04), std(color)));
    const h = mesh(new THREE.TorusGeometry(0.13, 0.025, 10, 28, Math.PI), std(handle));
    h.position.y = 0.29; g.add(h);
    return g;
  };
  const tag = () => {
    const g = new THREE.Group();
    const s = new THREE.Shape();
    s.moveTo(-0.22, -0.32); s.lineTo(0.22, -0.32); s.lineTo(0.22, 0.2); s.lineTo(0, 0.36); s.lineTo(-0.22, 0.2); s.closePath();
    const hole = new THREE.Path(); hole.absarc(0, 0.2, 0.05, 0, Math.PI * 2, true); s.holes.push(hole);
    g.add(mesh(new THREE.ExtrudeGeometry(s, { depth: 0.04, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 2 }), std(C.sun)));
    return g;
  };
  const bubble = () => {
    const g = new THREE.Group();
    g.add(mesh(new RoundedBoxGeometry(0.78, 0.48, 0.14, 3, 0.16), std(0x25d366)));
    for (let i = -1; i <= 1; i++) {
      const d = mesh(new THREE.SphereGeometry(0.045, 12, 10), std(C.white));
      d.position.set(i * 0.15, 0, 0.08); g.add(d);
    }
    const tail = mesh(new THREE.ConeGeometry(0.08, 0.16, 12), std(0x25d366));
    tail.position.set(-0.3, -0.26, 0); tail.rotation.z = 0.6; g.add(tail);
    return g;
  };
  [
    [bag(C.coral, C.ink), [-2.7, 2.4, 1.6], 0.0],
    [bag(C.mint, C.ink), [-2.2, 0.95, 2.3], 1.4],
    [tag(), [-1.9, 4.25, 1.0], 2.6],
    [bubble(), [3.35, 3.7, 1.4], 3.7],
  ].forEach(([obj, pos, phase]) => {
    obj.position.set(...pos); obj.userData = { base: new THREE.Vector3(...pos), phase };
    obj.rotation.y = -0.3; scene.add(obj); floaters.push(obj);
  });

  // tamanho e câmera
  const pointer = new THREE.Vector2(0, 0), look = new THREE.Vector2(0, 0);
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // em telas estreitas a câmera recua pra caber a loja e o celular
    const narrow = camera.aspect < 1;
    camera.fov = narrow ? 40 : 32;
    camBase.set(narrow ? 4.2 : 5.4, narrow ? 3.6 : 3.4, narrow ? 12.6 : 11.6);
    camera.updateProjectionMatrix();
    requestRender();
  }
  new ResizeObserver(resize).observe(canvas);

  if (!reduce) {
    window.addEventListener('pointermove', (e) => {
      pointer.set((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1);
      requestRender();
    }, { passive: true });
  }

  // animação: entrada única na carga, depois só um balanço leve
  const clock = new THREE.Clock();
  let visible = true, frameRequested = false;
  const ease = (t) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
  function frame() {
    frameRequested = false;
    const t = reduce ? 10 : clock.getElapsedTime();
    look.lerp(pointer, reduce ? 1 : 0.06);
    camera.position.set(camBase.x + look.x * 0.9, camBase.y - look.y * 0.45, camBase.z);
    camera.lookAt(target);

    const intro = ease(t / 1.4);
    shop.position.y = (1 - intro) * -0.6;
    shop.scale.setScalar(0.92 + 0.08 * intro);
    const pIn = ease((t - 0.35) / 1.2);
    phone.position.y = 1.95 + (1 - pIn) * -1.4 + Math.sin(t * 1.1) * 0.06;
    phone.rotation.y = -0.42 + Math.sin(t * 0.6) * 0.05;
    phone.scale.setScalar(Math.max(0.001, pIn));
    floaters.forEach((o, i) => {
      const k = ease((t - 0.6 - i * 0.12) / 1);
      o.scale.setScalar(Math.max(0.001, k));
      o.position.y = o.userData.base.y + Math.sin(t * 0.9 + o.userData.phase) * 0.12;
      o.rotation.y = -0.3 + Math.sin(t * 0.5 + o.userData.phase) * 0.35;
    });
    renderer.render(scene, camera);
    if (!reduce && visible && !document.hidden) requestRender();
  }
  function requestRender() {
    if (!frameRequested) { frameRequested = true; requestAnimationFrame(frame); }
  }
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) requestRender(); }).observe(canvas);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) requestRender(); });
  resize();
  requestRender();
  canvas.dataset.ready = '1';
  return true;
}

// tela com cantos arredondados e UV certinho pra textura
class RoundedScreen extends THREE.ShapeGeometry {
  constructor(w, h, r) {
    const s = new THREE.Shape();
    const x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    super(s, 12);
    const uv = this.attributes.uv, pos = this.attributes.position;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (pos.getX(i) - x) / w, (pos.getY(i) - y) / h);
  }
}
