/* Clock3D: the time-passing clock engine (66 Time-passing clock). Identical copy in a/media and b/media.
   A real Three.js analog clock over footage: a lathed black-ceramic bezel with polished steel lips, applied (extruded)
   Archivo numerals and hour bars that cast real shadows onto a frosted-glass dial, extruded lacquer hands with steel
   edges and a red minute tip, a recessed digital readout window, and a domed crystal glare.
   The dial's frost is a DOM disc behind the WebGL canvas (backdrop blur of the footage), driven by a CSS 3D transform
   that matches the Three.js camera exactly (perspective = camera distance), so the glass and the 3D parts tilt as one.
   Time model: the minute hand sweeps CONFIG.hours turns with a velocity profile (ease in, cruise, decelerate), arrives
   still moving and hits its stop: a damped spring overshoot (the lock-in). The hour hand is geared 1:12. Motion blur
   is real shutter sampling: the hands are drawn as N transparent copies across a 180-degree shutter.
   The sun moves with the clock time (key light swings and warms, the hand shadows lengthen); at the lock-in the face
   lamp switches on (the frosted face glows warm, a halo spills past the bezel), a specular rake crosses the bezel,
   and the readout locks warm.
   Everything is a pure function of t: renderAt(t). No requestAnimationFrame, no randomness. */
window.Clock3D = function (o) {
  "use strict";
  const THREE = window.THREE, gsap = window.gsap;
  const W = o.W, H = o.H, R = o.R, CX = o.cx, CY = o.cy, T = o.T, FPS = 30;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v)), lerp = (a, b, u) => a + (b - a) * u;
  const seg = (t, a, d) => clamp((t - a) / d, 0, 1), E = (n) => gsap.parseEase(n);
  const ss = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  const $ = (s) => document.querySelector(s);
  const DEG = Math.PI / 180;

  // ---------- renderer / camera: z = 0 maps 1:1 to page px ----------
  const canvas = o.canvas;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
  renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
  const scene = new THREE.Scene();
  const FOV = 24, DIST = (H / 2) / Math.tan((FOV / 2) * DEG);
  const camera = new THREE.PerspectiveCamera(FOV, W / H, 10, DIST * 3);
  camera.position.set(0, 0, DIST); camera.lookAt(0, 0, 0);
  const wx = (x) => x - W / 2, wy = (y) => H / 2 - y;

  // ---------- studio environment for the ceramic and steel reflections ----------
  const envScene = new THREE.Scene();
  envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
    fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(0.85,0.86,0.9), hor = vec3(0.16,0.15,0.16), low = vec3(0.015,0.014,0.018);" +
      " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.05, 0.85, y)) : mix(hor, low, smoothstep(0.0, 0.45, -y)); gl_FragColor = vec4(c, 1.0); }"
  })));
  const panel = (w, h, x, y, z, c) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); envScene.add(m); };
  panel(40, 9, -6, 30, 22, new THREE.Color(4.2, 4.1, 4.0));    // big soft top-left box: the long highlight arc on the ceramic
  panel(5, 30, -32, 2, 18, new THREE.Color(3.0, 3.0, 3.1));    // left strip
  panel(6, 24, 31, -4, 15, new THREE.Color(3.0, 2.3, 1.6));    // warm right strip (the low sun side)
  panel(34, 3, 0, -16, 30, new THREE.Color(1.5, 1.5, 1.6));    // floor bounce
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(envScene, 0.0, 0.1, 200).texture;

  // ---------- lights: the sun (casts the hand shadows), hemisphere fill, a rim ----------
  const sun = new THREE.DirectionalLight(0xfff6ee, 1.7);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.radius = 5; sun.shadow.bias = -0.0006;
  const sc = sun.shadow.camera; sc.left = -(R + 90); sc.right = R + 90; sc.top = R + 90; sc.bottom = -(R + 90); sc.near = 100; sc.far = 4000;
  scene.add(sun); scene.add(sun.target);
  const hemi = new THREE.HemisphereLight(0xeef3ff, 0x10131a, 0.55); scene.add(hemi);
  const rim = new THREE.DirectionalLight(0xffe0c0, 0.5); rim.position.set(0.9, -0.3, 0.5); scene.add(rim);

  // ---------- materials ----------
  const steel = new THREE.MeshPhysicalMaterial({ color: 0xe9ecf1, metalness: 1, roughness: 0.15, clearcoat: 0.6, clearcoatRoughness: 0.08, envMapIntensity: 1.35 });
  const ceramic = new THREE.MeshPhysicalMaterial({ color: 0x0b0d11, metalness: 0.05, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.035, envMapIntensity: 1.25 });
  const lacquer = new THREE.MeshPhysicalMaterial({ color: 0x08090c, metalness: 0.2, roughness: 0.38, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 0.6 });
  const red = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(o.accent || "#FF2E3A"), roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.06, emissive: new THREE.Color(o.accent || "#FF2E3A"), emissiveIntensity: 0.18 });
  const shadowOn = (m) => { m.castShadow = true; return m; };

  // ---------- groups: root (position/scale) > tilt (rotation) > body ----------
  const root = new THREE.Group(), tilt = new THREE.Group(), body = new THREE.Group();
  root.add(tilt); tilt.add(body); scene.add(root);

  // ---------- bezel: three lathed rings (steel inner chamfer, ceramic body, steel outer lip) ----------
  const B = o.bezel || 48, k = B / 48;  // bezel width in px; profiles are designed at 48
  const steel2 = steel.clone(); steel2.side = THREE.DoubleSide; ceramic.side = THREE.DoubleSide;
  const lathe = (pts, mat) => { const g = new THREE.LatheGeometry(pts.map(([r, z]) => new THREE.Vector2(R + r * k, z * k)), 160); g.rotateX(Math.PI / 2);
    const m = shadowOn(new THREE.Mesh(g, mat === steel ? steel2 : mat)); body.add(m); return m; };
  lathe([[-5, 0.5], [-3.5, 3], [-1, 8], [3, 15], [8, 21], [13, 25.5], [16.5, 27]], steel);               // inner polished chamfer
  lathe([[15.5, 26.6], [18.5, 29.6], [23, 31.6], [28, 32.2], [33, 31.2], [37.5, 28.4], [40.5, 24], [41.5, 20]], ceramic); // ceramic body
  lathe([[40.6, 22.5], [43.5, 18.5], [46.2, 12], [47.6, 4], [47.6, -4], [46, -10], [42, -13]], steel);   // outer polished lip

  // ---------- dial: shadow receiver + printed minute track ----------
  const shadowMat = new THREE.ShadowMaterial({ color: 0x140c06, opacity: 0.34, transparent: true, depthWrite: false });
  const dialShadow = new THREE.Mesh(new THREE.CircleGeometry(R + 2, 128), shadowMat);
  dialShadow.receiveShadow = true; dialShadow.position.z = 0.2; dialShadow.renderOrder = 2; body.add(dialShadow);
  const PC = document.createElement("canvas"), PS = 2048; PC.width = PC.height = PS;
  { const g = PC.getContext("2d"), s = PS / (2 * R); g.translate(PS / 2, PS / 2);
    for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2, major = i % 5 === 0;
      const r0 = (major ? 0.912 : 0.935) * R * s, r1 = 0.972 * R * s, w = (major ? 0.0135 : 0.0062) * R * s;
      g.save(); g.rotate(a); g.fillStyle = major ? "rgba(16,18,24,.92)" : "rgba(22,25,32,.72)";
      g.beginPath(); g.roundRect(-w / 2, -r1, w, r1 - r0, w / 2); g.fill(); g.restore(); } }
  const printTex = new THREE.CanvasTexture(PC); printTex.colorSpace = THREE.SRGBColorSpace; printTex.anisotropy = 4;
  const print = new THREE.Mesh(new THREE.PlaneGeometry(2 * R, 2 * R), new THREE.MeshBasicMaterial({ map: printTex, transparent: true, depthWrite: false, toneMapped: false }));
  print.position.z = 0.1; print.renderOrder = 1; body.add(print);

  // ---------- applied numerals (extruded Archivo outlines) and hour bars ----------
  const GL = window.CLOCK_GLYPHS.num;
  function glyphShapes(label, s) {
    let pen = 0; const parts = [];
    for (const ch of label) { const g = GL.g[ch]; parts.push([g, pen]); pen += g[0]; }
    const inkL = parts[0][0][2] + parts[0][1], last = parts[parts.length - 1], inkR = last[1] + last[0][3];
    const ox = -(inkL + inkR) / 2, oy = -GL.fig / 2, shapes = [];
    for (const [g, gx] of parts) {
      const sp = new THREE.ShapePath(), re = /([MLQCZ])([^MLQCZ]*)/g; let m;
      while ((m = re.exec(g[1]))) {
        const n = m[2].trim() ? m[2].trim().split(/[\s,]+/).map(Number) : [], P = [];
        for (let i = 0; i < n.length; i += 2) P.push((gx + n[i] + ox) * s, (-n[i + 1] + oy) * s);
        if (m[1] === "M") sp.moveTo(P[0], P[1]); else if (m[1] === "L") sp.lineTo(P[0], P[1]);
        else if (m[1] === "Q") sp.quadraticCurveTo(P[0], P[1], P[2], P[3]); else if (m[1] === "C") sp.bezierCurveTo(P[0], P[1], P[2], P[3], P[4], P[5]);
      }
      sp.toShapes(false).forEach((sh) => { const s2 = new THREE.Shape(sh.getPoints(8)); sh.holes.forEach((h) => s2.holes.push(new THREE.Path(h.getPoints(8)))); shapes.push(s2); });
    }
    return shapes;
  }
  const NUMCAP = (o.numCap || 0.22) * R, gs = NUMCAP / GL.fig;
  const ND = 0.024 * R, NB = 0.0075 * R;  // numeral depth and bevel
  const extr = (shapes, depth, bevel, mats) => { const g = new THREE.ExtrudeGeometry(shapes, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * 0.8, bevelOffset: -bevel * 0.8, bevelSegments: 3, curveSegments: 6 });
    g.translate(0, 0, bevel); g.computeVertexNormals(); return shadowOn(new THREE.Mesh(g, mats)); };
  [["3", 90, 0.768], ["6", 180, 0.742], ["9", 270, 0.768]].forEach(([lab, deg, rr]) => {
    const m = extr(glyphShapes(lab, gs), ND, NB, [lacquer, steel]);
    m.position.set(Math.sin(deg * DEG) * rr * R, Math.cos(deg * DEG) * rr * R, 0); body.add(m);
  });
  // the 12 o'clock index: a lacquer triangle pointing at the centre, the minute hand's landing target; it flashes red at the lock-in
  const triMat = lacquer.clone(); triMat.emissive = new THREE.Color(o.accent || "#FF2E3A"); triMat.emissiveIntensity = 0;
  { const tw = 0.19 * R, th = 0.17 * R, rr = 0.012 * R, top = 0.9 * R, sh = new THREE.Shape();
    sh.moveTo(-tw / 2 + rr, top); sh.lineTo(tw / 2 - rr, top); sh.quadraticCurveTo(tw / 2, top, tw / 2 - rr * 0.8, top - rr * 1.2);
    sh.lineTo(rr * 0.7, top - th + rr); sh.quadraticCurveTo(0, top - th - rr * 0.2, -rr * 0.7, top - th + rr); sh.lineTo(-tw / 2 + rr * 0.8, top - rr * 1.2); sh.quadraticCurveTo(-tw / 2, top, -tw / 2 + rr, top);
    body.add(extr([sh], ND, NB, [triMat, steel])); }
  { const bw = 0.046 * R, bl = 0.15 * R, rc = 0.79 * R, sh = new THREE.Shape();
    sh.moveTo(-bw / 2, -bl / 2 + bw / 2); sh.lineTo(-bw / 2, bl / 2 - bw / 2); sh.absarc(0, bl / 2 - bw / 2, bw / 2, Math.PI, 0, true);
    sh.lineTo(bw / 2, -bl / 2 + bw / 2); sh.absarc(0, -bl / 2 + bw / 2, bw / 2, 0, Math.PI, true);
    for (let h = 1; h < 12; h++) { if (h % 3 === 0) continue; const a = h * 30 * DEG;
      const m = extr([sh], ND * 0.85, NB, [lacquer, steel]); m.position.set(Math.sin(a) * rc, Math.cos(a) * rc, 0); m.rotation.z = -a; body.add(m); } }

  // ---------- the readout window: a steel-framed recess with a smoked display (canvas texture) ----------
  const ZWIN = 0.088 * R;  // the display sits on the crystal, above the hands
  const WIN = o.win, ww = WIN.w * R, wh = WIN.h * R, wyc = -WIN.cy * R, wr = 0.07 * R, wf = 0.028 * R;
  const rrect = (w, h, r, path) => { const p = path || new THREE.Shape(), x = -w / 2, y = -h / 2;
    p.moveTo(x + r, y); p.lineTo(x + w - r, y); p.quadraticCurveTo(x + w, y, x + w, y + r); p.lineTo(x + w, y + h - r); p.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    p.lineTo(x + r, y + h); p.quadraticCurveTo(x, y + h, x, y + h - r); p.lineTo(x, y + r); p.quadraticCurveTo(x, y, x + r, y); return p; };
  { const sh = rrect(ww + 2 * wf, wh + 2 * wf, wr + wf); sh.holes.push(rrect(ww, wh, wr, new THREE.Path()));
    const m = extr([sh], 0.012 * R, 0.008 * R, [steel, steel]); m.position.set(0, wyc, ZWIN - 0.006 * R); body.add(m); }
  const RS = 3, RC = document.createElement("canvas"); RC.width = Math.round(ww * RS); RC.height = Math.round(wh * RS);
  const rg = RC.getContext("2d");
  const readTex = new THREE.CanvasTexture(RC); readTex.colorSpace = THREE.SRGBColorSpace; readTex.anisotropy = 4;
  { const geo = new THREE.ShapeGeometry(rrect(ww, wh, wr), 6), pos = geo.attributes.position, uv = geo.attributes.uv;
    for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / ww + 0.5, pos.getY(i) / wh + 0.5);
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: readTex, toneMapped: false })); m.castShadow = true;
    m.position.set(0, wyc, ZWIN); body.add(m); }

  // ---------- hands: faceted black chrome (a ridge down the centre, so one facet catches the light) ----------
  const chrome = new THREE.MeshPhysicalMaterial({ color: 0x272a31, metalness: 1, roughness: 0.2, clearcoat: 0.6, clearcoatRoughness: 0.06, envMapIntensity: 1.25, flatShading: true, side: THREE.DoubleSide });
  const redF = red.clone(); redF.flatShading = true; redF.side = THREE.DoubleSide;
  const HR = 0.016 * R, HW = 0.007 * R;   // ridge height, wall depth
  function facetGeo(st) { // st: [[y, halfWidth, ridge], ...] in R units, y ascending; returns a faceted ridge hand piece
    const P = [], push = (...v) => v.forEach((q) => P.push(q[0], q[1], q[2]));
    for (let i = 0; i < st.length - 1; i++) {
      const [y0, w0, h0] = st[i], [y1, w1, h1] = st[i + 1];
      const C0 = [0, y0 * R, h0 * HR], C1 = [0, y1 * R, h1 * HR], L0 = [-w0 * R, y0 * R, 0], L1 = [-w1 * R, y1 * R, 0], R0 = [w0 * R, y0 * R, 0], R1 = [w1 * R, y1 * R, 0];
      push(C0, C1, L1, C0, L1, L0, C0, R0, R1, C0, R1, C1);
      const dn = (q) => [q[0], q[1], -HW];
      push(L0, L1, dn(L1), L0, dn(L1), dn(L0), R0, dn(R0), dn(R1), R0, dn(R1), R1);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(P, 3)); g.computeVertexNormals(); g.translate(0, 0, HW); return g;
  }
  function outlineGeo(st) { const sh = new THREE.Shape(); sh.moveTo(0, st[0][0] * R);
    st.forEach(([y, w]) => sh.lineTo(w * R, y * R)); for (let i = st.length - 1; i >= 0; i--) sh.lineTo(-st[i][1] * R, st[i][0] * R); return new THREE.ShapeGeometry(sh); }
  const HOUR = [[-0.13, 0.0, 0.3], [-0.06, 0.03, 0.6], [0, 0.052, 1], [0.38, 0.044, 0.8], [0.52, 0, 0.15]];
  const MINB = [[-0.19, 0.0, 0.3], [-0.08, 0.022, 0.6], [0, 0.036, 1], [0.66, 0.026, 0.75]];
  const MINT = [[0.66, 0.026, 0.75], [0.8, 0.018, 0.5], [0.885, 0, 0.12]];
  const NG = 90;
  function makeHand(parts, z) {
    // parts: [[stations, facetMat, trailColor, trailK], ...]; main = faceted 3D hand; ghosts = flat comet-trail copies
    const main = new THREE.Group(); main.position.z = z; body.add(main);
    parts.forEach(([st, mat]) => main.add(shadowOn(new THREE.Mesh(facetGeo(st), mat))));
    const ghosts = [];
    for (let i = 0; i < NG; i++) { const gr = new THREE.Group(); gr.position.z = z - 0.5; gr.visible = false; gr.renderOrder = 3;
      parts.forEach(([st, , col, kk]) => { const m = new THREE.Mesh(outlineGeo(st), new THREE.MeshBasicMaterial({ color: new THREE.Color(col), transparent: true, depthWrite: false, toneMapped: false, opacity: 0 }));
        m.userData.k = kk; m.renderOrder = 3; gr.add(m); });
      body.add(gr); ghosts.push(gr); }
    return { main, ghosts };
  }
  const hourHand = makeHand([[HOUR, chrome, "#121418", 1]], 0.03 * R);
  const minHand = makeHand([[MINB, chrome, "#121418", 1], [MINT, redF, o.accent || "#FF2E3A", 0.45]], 0.054 * R);
  { const capR = 0.058 * R, g = new THREE.CylinderGeometry(capR, capR * 1.05, 0.03 * R, 48); g.rotateX(Math.PI / 2); g.translate(0, 0, 0.088 * R);
    body.add(shadowOn(new THREE.Mesh(g, steel)));
    const d = new THREE.SphereGeometry(capR * 0.98, 48, 16, 0, Math.PI * 2, 0, Math.PI / 2); d.rotateX(Math.PI / 2); d.scale(1, 1, 0.32); d.translate(0, 0, 0.1 * R);
    body.add(shadowOn(new THREE.Mesh(d, steel)));
    const p = new THREE.CylinderGeometry(capR * 0.3, capR * 0.3, 0.01 * R, 24); p.rotateX(Math.PI / 2); p.translate(0, 0, 0.118 * R);
    body.add(new THREE.Mesh(p, lacquer)); }

  // ---------- light on the glass: a domed-crystal glare and the lock-in rake (additive, clipped to their faces) ----------
  const addMat = (frag, uni) => new THREE.ShaderMaterial({ transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, toneMapped: false, uniforms: uni,
    vertexShader: "varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }", fragmentShader: frag });
  const glareU = { uR: { value: R }, uAmp: { value: 1 }, uOff: { value: 0 } };
  const glare = new THREE.Mesh(new THREE.CircleGeometry(R - 3, 128), addMat(
    "uniform float uR; uniform float uAmp; uniform float uOff; varying vec2 vP; void main(){ vec2 p = vP / uR; float r = length(p);" +
    " float cres = smoothstep(0.62, 0.9, length(p - vec2(0.16 + uOff, -0.2))) * (1.0 - smoothstep(0.88, 0.995, r)) * smoothstep(-0.1, 0.55, p.y - 0.55 * p.x);" +
    " float a = uAmp * (0.2 * cres + 0.035 * (1.0 - smoothstep(-0.6, 0.9, p.x - p.y)) * (1.0 - smoothstep(0.9, 0.995, r))); gl_FragColor = vec4(1.0, 0.99, 0.97, a); }", glareU));
  glare.position.z = 0.125 * R; glare.renderOrder = 8; body.add(glare);
  const SG = document.createElement("canvas"); SG.width = SG.height = 128;
  { const g = SG.getContext("2d"), q = g.createRadialGradient(64, 64, 0, 64, 64, 64); q.addColorStop(0, "rgba(255,255,255,1)"); q.addColorStop(0.18, "rgba(255,246,225,.55)"); q.addColorStop(1, "rgba(255,230,190,0)"); g.fillStyle = q; g.fillRect(0, 0, 128, 128); }
  const glint = new THREE.Mesh(new THREE.PlaneGeometry(0.42 * R, 0.42 * R), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(SG), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, toneMapped: false }));
  glint.position.set(-0.02 * R, 0.02 * R, 0.13 * R); glint.renderOrder = 10; body.add(glint);
  const rakeFrag = (w) => "uniform float uPos; uniform float uAmp; uniform vec3 uCol; varying vec2 vP; void main(){ float d = dot(vP, normalize(vec2(0.74, -0.67)));" +
    " float a = uAmp * exp(-pow((d - uPos) / " + w.toFixed(1) + ", 2.0)); gl_FragColor = vec4(uCol, a); }";
  const rakeUni = (c) => ({ uPos: { value: -1e4 }, uAmp: { value: 0 }, uCol: { value: c } });
  const ring = (r1, r0) => { const s = new THREE.Shape(); s.absarc(0, 0, r1, 0, Math.PI * 2, false); const h = new THREE.Path(); h.absarc(0, 0, r0, 0, Math.PI * 2, true); s.holes.push(h); return s; };
  const rakeB = new THREE.Mesh(new THREE.ShapeGeometry(ring(R + 46 * k, R - 3), 128), addMat(rakeFrag(0.11 * R), rakeUni(new THREE.Color(1, 0.93, 0.8))));
  rakeB.position.z = 34 * k; rakeB.renderOrder = 9; body.add(rakeB);
  const rakeG = new THREE.Mesh(new THREE.CircleGeometry(R - 4, 128), addMat(rakeFrag(0.16 * R), rakeUni(new THREE.Color(1, 0.95, 0.86))));
  rakeG.position.z = 0.13 * R; rakeG.renderOrder = 9; body.add(rakeG);

  // ---------- time model ----------
  const HRS = o.hours, DEGT = HRS * 360, t0 = T.spin, D = T.spinDur, TL = t0 + D;
  const PROF = (function () { // velocity profile: smoothstep rise to cruise, cruise, decay to a residual speed; integrated and normalised
    const N = 4000, a = 0.22, b = 0.6, e = 0.16, v = [], P = [0]; let s = 0;
    for (let i = 0; i <= N; i++) { const u = i / N; v.push(u < a ? ss(u / a) : u <= b ? 1 : e + (1 - e) * (1 - ss((u - b) / (1 - b)))); }
    for (let i = 1; i <= N; i++) { s += (v[i] + v[i - 1]) / 2 / N; P.push(s); }
    return { P: P.map((x) => x / s), vEnd: e / s, N };
  })();
  const vEnd = PROF.vEnd * DEGT / D, OM = 2 * Math.PI * 5.5, ODEC = 0.075;   // deg/s at the stop; overshoot spring
  function minuteDeg(t) { // degrees of minute-hand travel since the start time (0 .. DEGT), with anticipation and the lock-in spring
    if (t < t0 - 0.16) return 0;
    if (t < t0) { const x = (t - (t0 - 0.16)) / 0.16; return -4.5 * Math.sin(Math.PI * x); }
    if (t < TL) { const f = (t - t0) / D * PROF.N, i = Math.floor(f), w = f - i; return DEGT * lerp(PROF.P[i], PROF.P[Math.min(PROF.N, i + 1)], w); }
    const tau = t - TL; return DEGT + (vEnd / OM) * Math.exp(-tau / ODEC) * Math.sin(OM * tau);
  }
  const startMin = o.start.h * 60 + (o.start.m || 0), endMin = startMin + HRS * 60;
  const clockMin = (t) => startMin + minuteDeg(t) / 6;
  // the readout follows the hands but ignores the anticipation, and settles after the lock with a quarter of the overshoot
  const readMin = (t) => t < t0 ? startMin : t < TL ? Math.max(startMin, clockMin(t)) : endMin + 0.25 * (clockMin(t) - endMin);
  const dayP = (t) => clamp(minuteDeg(t) / DEGT, 0, 1);

  // ---------- readout drawing ----------
  const RW = RC.width, RH = RC.height;
  let fsz = Math.round(RH * (o.readFs || 0.8)), fsmall = Math.round(fsz * 0.4), cellW = 0, colonW = 0, ampW = 0;
  const label12 = (i) => String(((i % 12) + 12) % 12 === 0 ? 12 : ((i % 12) + 12) % 12);
  function measure() {
    // auto-fit: the widest reading this clock shows (1- or 2-digit hours) fills at most 90% of the window
    const h0 = Math.floor((o.start.h * 60 + (o.start.m || 0)) / 60); let maxLen = 1;
    for (let i = h0; i <= h0 + o.hours; i++) maxLen = Math.max(maxLen, label12(i).length);
    const fit = () => { cellW = 0; rg.font = "900 " + fsz + "px Inter"; for (let d = 0; d < 10; d++) cellW = Math.max(cellW, rg.measureText(String(d)).width);
      cellW *= 0.98; colonW = rg.measureText(":").width * 0.92; rg.font = "800 " + fsmall + "px Inter"; ampW = rg.measureText(o.ampm || "PM").width;
      return (maxLen + 2) * cellW + colonW + fsz * 0.14 + ampW; };
    const w = fit(); if (w > RW * 0.9) { fsz = Math.floor(fsz * RW * 0.9 / w); fsmall = Math.round(fsz * 0.4); fit(); }
  }
  function drawReadout(t, lockK, flare) {
    const g = rg; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, RW, RH);
    const bg = g.createLinearGradient(0, 0, 0, RH); bg.addColorStop(0, "#040507"); bg.addColorStop(0.55, "#0c0e13"); bg.addColorStop(1, "#1a1d24");
    g.fillStyle = bg; g.fillRect(0, 0, RW, RH);
    // warm display light after the lock
    if (lockK > 0) { const rgr = g.createRadialGradient(RW / 2, RH * 0.55, 0, RW / 2, RH * 0.55, RW * 0.6);
      rgr.addColorStop(0, "rgba(255,170,80," + (0.16 * lockK + 0.12 * flare).toFixed(3) + ")"); rgr.addColorStop(1, "rgba(255,140,60,0)"); g.fillStyle = rgr; g.fillRect(0, 0, RW, RH); }
    const m = readMin(t), hIdx = Math.floor(m / 60), mi = m - hIdx * 60;
    const dt = 1 / FPS, spd = Math.abs(readMin(t + dt / 2) - readMin(t - dt / 2));   // minutes per frame
    const hRoll = ss((mi - 59.15) / 0.85), hP = hIdx + hRoll;
    const mt = Math.floor(mi / 10), mtRoll = ss(((mi % 10) - 9.15) / 0.85), mtP = mt + mtRoll, muP = mi % 10;
    // layout: [hour (1-2 cells)][:][m tens][m units]  gap  [PM]
    const hl0 = label12(hIdx), hl1 = label12(hIdx + 1);
    const hw = lerp(hl0.length, hl1.length, hRoll) * cellW;
    const gap = fsz * 0.14, total = hw + colonW + 2 * cellW + gap + ampW;
    const x0 = (RW - total) / 2, base = RH / 2 + fsz * 0.727 / 2, pitch = RH * 0.96;
    const col = lockK > 0 ? "rgb(255," + Math.round(lerp(246, 236, lockK)) + "," + Math.round(lerp(236, 200, lockK)) + ")" : "#F3F5F9";
    const drum = (x, w, P, lab, blurSpd) => {
      // shutter-sampled roll: samples spread over half a frame of travel; at speed the column smears into a soft grey blur
      g.save(); g.beginPath(); g.rect(x - 2, 0, w + 4, RH); g.clip();
      const span = Math.min(6, blurSpd * 0.5), n = span < 0.06 ? 1 : Math.min(16, 3 + Math.round(span * 5));
      const al = n === 1 ? 1 : (1 / n) * lerp(1.6, 0.5, ss((span - 0.4) / 2.2));
      for (let j = 0; j < n; j++) { const pj = n === 1 ? P : P + (j / (n - 1) - 0.5) * span; const i0 = Math.floor(pj), fr = pj - i0;
        g.globalAlpha = Math.min(1, al);
        [[i0, -fr], [i0 + 1, 1 - fr]].forEach(([i, off]) => { g.textAlign = "right"; g.fillText(lab(i), x + w, base + off * pitch); }); }
      g.restore(); g.globalAlpha = 1; };
    g.font = "900 " + fsz + "px Inter"; g.fillStyle = col;
    if (lockK > 0) { g.shadowColor = "rgba(255,170,70," + (0.75 * lockK).toFixed(3) + ")"; g.shadowBlur = fsz * (0.16 + 0.22 * flare); }
    let x = x0;
    // hour: right-aligned label, rolls up on each hour pass; digits set in fixed cells (tabular)
    g.save(); g.beginPath(); g.rect(x - 2, 0, hw + 4, RH); g.clip();
    [[hIdx, -hRoll], [hIdx + 1, 1 - hRoll]].forEach(([i, off]) => { const s = label12(i); for (let c = 0; c < s.length; c++) {
      g.textAlign = "center"; g.fillText(s[c], x + hw - (s.length - c - 0.5) * cellW, base + off * pitch); } });
    g.restore();
    x += hw;
    g.textAlign = "center"; g.fillText(":", x + colonW / 2, base - fsz * 0.04); x += colonW;
    drum(x, cellW, mtP, (i) => String(((i % 6) + 6) % 6), spd / 10);
    x += cellW;
    drum(x, cellW, muP, (i) => String(((i % 10) + 10) % 10), spd);
    x += cellW + gap;
    g.shadowBlur = 0; g.font = "800 " + fsmall + "px Inter"; g.fillStyle = "#FFD23C"; g.textAlign = "left";
    g.fillText(o.ampm || "PM", x, base - fsz * 0.727 + fsmall * 0.727);
    // glass: inner top shadow and a soft diagonal sheen
    const ts = g.createLinearGradient(0, 0, 0, RH * 0.3); ts.addColorStop(0, "rgba(0,0,0,.75)"); ts.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = ts; g.fillRect(0, 0, RW, RH * 0.3);
    const bs = g.createLinearGradient(0, RH * 0.72, 0, RH); bs.addColorStop(0, "rgba(0,0,0,0)"); bs.addColorStop(1, "rgba(0,0,0,.5)");
    g.fillStyle = bs; g.fillRect(0, RH * 0.72, RW, RH * 0.28);
    const sh = g.createLinearGradient(0, 0, RW, RH); sh.addColorStop(0.0, "rgba(255,255,255,0)"); sh.addColorStop(0.32, "rgba(255,255,255,.07)"); sh.addColorStop(0.46, "rgba(255,255,255,0)");
    g.fillStyle = sh; g.fillRect(0, 0, RW, RH);
    readTex.needsUpdate = true;
  }

  // ---------- DOM layers that ride with the clock ----------
  const frost = o.frost, warm = o.warm, flareEl = o.flareEl, halo = o.halo, cshadow = o.cshadow;
  function domTransform(cx, cy, z, rx, ry, rz, s) {
    return "translate3d(" + (cx - CX).toFixed(2) + "px," + (cy - CY).toFixed(2) + "px," + z.toFixed(2) + "px) rotateX(" + (-rx).toFixed(5) + "rad) rotateY(" + ry.toFixed(5) + "rad) rotateZ(" + (-rz).toFixed(5) + "rad) scale(" + s.toFixed(5) + ")";
  }

  // ---------- motion: a pure function of t ----------
  const eBack = E("back.out(1.35)"), eOut3 = E("power3.out"), eIn3 = E("power3.in");
  const spring = (tau, amp, f, dec) => (tau < 0 ? 0 : amp * Math.exp(-tau / dec) * Math.cos(2 * Math.PI * f * tau));
  const springS = (tau, amp, f, dec) => (tau < 0 ? 0 : amp * Math.exp(-tau / dec) * Math.sin(2 * Math.PI * f * tau));
  const sunA = new THREE.Vector3(), sunB = new THREE.Vector3(), cA = new THREE.Color(), cB = new THREE.Color();
  const SUN0 = new THREE.Vector3(-0.38, 0.55, 1.0).normalize(), SUN1 = new THREE.Vector3(0.5, 0.34, 1.0).normalize();
  const SC0 = new THREE.Color(0xfff7ef), SC1 = new THREE.Color(0xffa766);
  const HS0 = new THREE.Color(0xeef3ff), HS1 = new THREE.Color(0xffc9a4);
  function lampAt(t) { const tau = t - TL; if (tau < 0) return [0, 0];
    const flare = tau < 1 / FPS ? tau * FPS : tau < 4 / FPS ? 1 : Math.exp(-(tau - 4 / FPS) / 0.16);
    return [clamp(tau * FPS, 0, 1), flare]; }

  function renderAt(t) {
    // entrance: swings up from lying back, springs past upright and settles; opacity 1 inside 2 frames
    const u = seg(t, T.in, 0.62), ub = eBack(u), uo = eOut3(u);
    const x = seg(t, T.out, 0.3), xe = eIn3(x);
    const vis = t >= T.in && x < 1;
    let s = lerp(0.58, 1, ub) * (1 - 0.16 * xe), rx = lerp(-1.18, 0, ub) - 1.42 * xe, ry = lerp(0.22, 0, uo), rz = lerp(-0.12, 0, uo);
    let cx = CX, cy = CY + 70 * (1 - uo) - 34 * xe, z = -260 * (1 - uo);
    // life on the hold: a slow sway so the speculars travel
    const life = ss((t - T.in - 0.5) / 0.6);
    ry += life * 0.05 * Math.sin(2 * Math.PI * 0.19 * (t - T.in)); rx += life * 0.03 * Math.sin(2 * Math.PI * 0.23 * (t - T.in) + 1.2);
    // reaction torque while the hands spin up, and the recoil at the lock-in
    const tauL = t - TL;
    rz += -0.018 * ss((t - t0) / 0.5) * (1 - ss((t - (TL - 0.6)) / 0.6)) + springS(tauL, 0.022, 3.1, 0.15);
    s *= 1 + (tauL >= 0 && tauL < 1 / FPS ? 0.03 : spring(tauL - 1 / FPS, 0.045, 3.0, 0.12));
    root.visible = vis; root.position.set(wx(cx), wy(cy), z); root.scale.setScalar(s);
    tilt.rotation.set(rx, ry, rz);
    // hands (minute geared 12:1 to the hour), with shutter-sampled motion blur
    const ang = (tt, kind) => kind === "m" ? (startMin * 6 + minuteDeg(tt)) * DEG : (startMin * 0.5 + minuteDeg(tt) / 12) * DEG;
    const sh = 0.5 / FPS;
    [[minHand, "m"], [hourHand, "h"]].forEach(([hd, kind]) => {
      hd.main.rotation.z = -ang(t, kind); hd.main.visible = true;
      const trav = (ang(t, kind) - ang(t - 1 / FPS, kind)) / DEG;
      if (trav < 1.2 || t < t0 || t > TL + 0.2) { hd.ghosts.forEach((g) => (g.visible = false)); return; }
      const n = Math.min(NG, Math.ceil(trav / 0.55)), amp = ss((trav - 1.2) / 6);
      hd.ghosts.forEach((g, i) => { g.visible = i < n; if (i >= n) return; const f = (i + 1) / (n + 1);
        g.rotation.z = -ang(t - f / FPS, kind);
        g.children.forEach((m) => { const kk = m.userData.k; m.material.opacity = amp * 0.11 * kk * Math.pow(1 - f, kk < 1 ? 2.6 : 1.5); }); });
    });
    // the sun moves with the clock: swings right and low, warms; hand shadows lengthen
    const dp = ss(dayP(t));
    sunA.copy(SUN0).lerp(SUN1, dp).normalize();
    sun.position.set(root.position.x + sunA.x * 1500, root.position.y + sunA.y * 1500, sunA.z * 1500);
    sun.target.position.copy(root.position); sun.target.updateMatrixWorld();
    const [lampK, flare] = lampAt(t);
    sun.color.copy(SC0).lerp(SC1, dp); sun.intensity = 1.7 + 0.25 * dp + 1.6 * flare;
    hemi.color.copy(HS0).lerp(HS1, dp); hemi.intensity = 0.55 + 0.1 * dp;
    rim.intensity = 0.4 + 0.6 * dp;
    const mSpan = Math.abs(ang(t + sh / 2, "m") - ang(t - sh / 2, "m")) / DEG;
    shadowMat.opacity = 0.42 * (1 - 0.75 * ss((mSpan - 2) / 18)) * (1 - 0.15 * lampK);
    // the lock-in rake across the bezel and the crystal
    const rk = seg(t, TL + 0.02, 0.42), rpos = lerp(-1.25, 1.25, E("power2.inOut")(rk)) * R, ramp = rk > 0 && rk < 1 ? Math.sin(Math.PI * rk) : 0;
    rakeB.material.uniforms.uPos.value = rpos; rakeB.material.uniforms.uAmp.value = 0.85 * ramp;
    rakeG.material.uniforms.uPos.value = rpos; rakeG.material.uniforms.uAmp.value = 0.3 * ramp;
    triMat.emissiveIntensity = 1.2 * flare;
    glint.material.opacity = 0.9 * flare; glint.scale.setScalar(0.8 + 0.5 * flare);
    glareU.uOff.value = 0.04 * Math.sin(2 * Math.PI * 0.19 * (t - T.in));
    drawReadout(t, lampK, flare);
    renderer.render(scene, camera);
    const bl = (u > 0 && u < 0.4 ? 9 * (1 - u / 0.4) : 0) + 8 * xe;
    canvas.style.filter = bl > 0.2 ? "blur(" + bl.toFixed(2) + "px)" : "none";
    const op = vis ? 1 : 0;   // opaque from its first frame (the swing and blur carry the entrance)
    canvas.style.opacity = op.toFixed(3);
    // DOM glass + light, riding the same 3D transform
    const tf = domTransform(cx, cy, z, rx, ry, rz, s);
    frost.style.transform = tf; frost.style.opacity = op.toFixed(3);
    warm.style.opacity = clamp(0.2 * dp + lampK * (0.8 + 0.15 * flare), 0, 1).toFixed(3);
    flareEl.style.opacity = (0.85 * flare).toFixed(3);
    halo.style.transform = tf; halo.style.opacity = (op * (0.42 * lampK + 0.5 * flare)).toFixed(3);
    const so = 1 - 0.3 * dp;
    cshadow.style.transform = "translate(" + (cx - CX - sunA.x * 26 * so).toFixed(1) + "px," + (cy - CY + 22 + sunA.y * 14).toFixed(1) + "px) scale(" + (s * (1 - 0.3 * Math.abs(Math.sin(rx)))).toFixed(4) + ")";
    cshadow.style.opacity = (op * (1 - xe)).toFixed(3);
  }
  return { renderAt, measure, TL, hourPasses: null };
};
