/* Holo3D v2: the holo scan's hero object, a faceted wedge supercar built as hard-surface geometry (Three.js r160, global THREE).
   The body is a loft of 8 crease rails (keel, floor, sill, side crease, shoulder, beltline, roof edge, crown), linear between
   key stations, so every panel is a flat facet and every crease is a real edge. Hexagonal wheel arches are cut into the flank,
   a scoop intake sits ahead of the rear wheel, glass / louvres / intake are their own facets, lamps are their own clusters.
   Layers, all drawn by render(S), where S is a pure function of timeline time upstream (nothing animates on its own):
     - shell: a dark clearcoat facet body (flat shaded, PMREM studio) + glass + rubber + chrome, printed behind the lock wave;
     - points: surface samples on lidar strata + dense feature lines (the creases, panel seams, window frames, arch lips, rims)
       + lamp clusters that switch on at the lock;
     - wire: the thin laser contour where the scan plane cuts the body, a fresnel rim, the lock / erase edges, the rake band;
     - floor (b copy): a projector pad (rim drawn on boot, dashed ring, turning ticks, radar sweep, lock ripple), a dotted lens bed,
       a contact glow under the footprint and tyres, the scan line, a projector pool and a contact shadow;
     - (b copy) rear flank: 1.7x sample density and a cool rim light from behind the tail, so the haunch never reads empty;
     - bloom: a quarter-res blurred copy of the frame added on top (canvas 2D filter, drawn in the same render call).
   project([x,y,z]) maps a model point to canvas px for the DOM HUD. Units are metres; the nose is +x, the tail -x. */
(function () {
  const rad = (d) => d * Math.PI / 180;
  const cl = (x) => Math.max(0, Math.min(1, x));
  const lerp = (a, b, p) => a + (b - a) * p;
  function rng(seed) {
    let s = seed >>> 0;
    return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }

  // ---------------- the car ----------------
  const L = 4.5, XN = 2.25, XT = -2.25;
  const WR = 0.335, WY = 0.335, WZ = 0.80, TW = 0.27;
  const XF = XN - L * 0.19, XR = XN - L * 0.79;      // 1.395, -1.305
  // crease rails, [x, z, y], nose -> tail
  // crease rails, [x, z, y], nose -> tail; each rail is a monotone cubic (pchip) along x, so the profiles flow
  const RAIL = [
    /* 0 keel     */ [[2.25, 0, .20], [2.05, 0, .13], [-1.90, 0, .13], [-2.25, 0, .27]],
    /* 1 floor    */ [[2.25, .64, .20], [2.05, .80, .13], [1.40, .86, .12], [-1.40, .88, .12], [-1.90, .86, .13], [-2.25, .70, .27]],
    /* 2 sill     */ [[2.25, .70, .25], [2.05, .86, .22], [1.40, .94, .22], [0.80, .95, .20], [-0.36, .96, .20], [-0.50, .91, .22], [-0.78, .91, .22], [-0.805, .97, .22], [-1.40, .98, .22], [-2.12, .90, .27], [-2.25, .76, .33]],
    /* 3 crease   */ [[2.25, .76, .34], [2.15, .86, .38], [1.40, .97, .47], [0.80, .985, .50], [-0.36, 1.0, .53], [-0.50, .89, .54], [-0.78, .89, .555], [-0.805, 1.0, .56], [-1.40, 1.02, .57], [-2.12, .93, .62], [-2.25, .78, .62]],
    /* 4 shoulder */ [[2.25, .74, .40], [2.20, .80, .47], [1.95, .88, .68], [1.70, .92, .82], [1.40, .94, .84], [1.10, .94, .82], [0.80, .93, .78], [-0.55, .95, .81], [-1.00, .97, .88], [-1.40, .98, .90], [-2.12, .90, .88], [-2.25, .74, .80]],
    /* 5 belt     */ [[2.25, .66, .42], [2.21, .72, .52], [1.95, .80, .67], [1.70, .85, .80], [1.40, .86, .825], [1.10, .86, .81], [0.80, .85, .80], [-0.55, .87, .85], [-1.00, .89, .91], [-1.40, .90, .925], [-1.95, .86, .93], [-2.15, .78, .905], [-2.25, .66, .83]],
    /* 6 roof edge*/ [[2.25, .34, .43], [2.21, .36, .535], [1.95, .40, .60], [1.40, .44, .70], [0.82, .64, .80], [0.05, .57, 1.075], [-0.55, .59, 1.085], [-1.20, .63, .975], [-1.95, .58, .93], [-2.15, .54, .915], [-2.25, .46, .835]],
    /* 7 crown    */ [[2.25, 0, .43], [2.21, 0, .535], [1.95, 0, .595], [1.40, 0, .695], [0.82, 0, .80], [0.05, 0, 1.095], [-0.55, 0, 1.105], [-1.20, 0, .985], [-1.95, 0, .94], [-2.15, 0, .92], [-2.25, 0, .84]]
  ];
  function pchip(xs, ys) {
    const n = xs.length, h = [], d = [], m = new Array(n);
    for (let i = 0; i < n - 1; i++) { h[i] = xs[i + 1] - xs[i]; d[i] = (ys[i + 1] - ys[i]) / h[i]; }
    m[0] = d[0]; m[n - 1] = d[n - 2];
    for (let i = 1; i < n - 1; i++) { if (d[i - 1] * d[i] <= 0) m[i] = 0; else { const w1 = 2 * h[i] + h[i - 1], w2 = h[i] + 2 * h[i - 1]; m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]); } }
    return (x) => {
      if (x <= xs[0]) return ys[0]; if (x >= xs[n - 1]) return ys[n - 1];
      let i = 0; while (x > xs[i + 1]) i++;
      const t = (x - xs[i]) / h[i], t2 = t * t, t3 = t2 * t;
      return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h[i] * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h[i] * m[i + 1];
    };
  }
  const RAILF = RAIL.map((R) => { const r = R.slice().reverse(); const xs = r.map((k) => k[0]); return { z: pchip(xs, r.map((k) => k[1])), y: pchip(xs, r.map((k) => k[2])) }; });
  // round wheel arches with a flared lip
  const RA = 0.42, AY = WY + 0.03;
  function archY(x) {
    let best = -1;
    for (const xw of [XF, XR]) { const d = Math.abs(x - xw); if (d < RA) best = Math.max(best, AY + Math.sqrt(RA * RA - d * d)); }
    return best;
  }
  // cross-section: the 8 rails, subdivided with Hermite curves; sill, beltline and roof edge stay crisp creases,
  // the flank between them is a smooth convex surface (no flat slab door)
  const SUB = [2, 2, 4, 4, 3, 4, 4];
  const CREASE = [true, true, true, false, false, true, true, true];
  const KR = []; { let k = 0; for (let j = 0; j < 7; j++) { KR.push(k); k += SUB[j]; } KR.push(k); }   // fine index of each coarse rail
  const NK = KR[7] + 1;
  function section(x) {
    const P = []; for (let j = 0; j < 8; j++) P.push([RAILF[j].z(x), RAILF[j].y(x)]);
    const out = [];
    for (let j = 0; j < 7; j++) {
      const a = P[j], b = P[j + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1e-6;
      const tan = (k) => {
        if (k === 0) return [L, 0];
        if (k === 7) return [-L, 0];
        if (CREASE[k]) return [b[0] - a[0], b[1] - a[1]];
        const p = P[k - 1], n = P[k + 1], dl = Math.hypot(n[0] - p[0], n[1] - p[1]) || 1e-6;
        return [(n[0] - p[0]) / dl * L, (n[1] - p[1]) / dl * L];
      };
      const m0 = tan(j), m1 = tan(j + 1);
      for (let s = 0; s < SUB[j]; s++) {
        const u = s / SUB[j], u2 = u * u, u3 = u2 * u;
        const h00 = 2 * u3 - 3 * u2 + 1, h10 = u3 - 2 * u2 + u, h01 = -2 * u3 + 3 * u2, h11 = u3 - u2;
        out.push({ z: h00 * a[0] + h10 * m0[0] + h01 * b[0] + h11 * m1[0], y: h00 * a[1] + h10 * m0[1] + h01 * b[1] + h11 * m1[1], r: j + u, c: 0 });
      }
    }
    out.push({ z: P[7][0], y: P[7][1], r: 7, c: 0 });
    // cut the arches: flank points under the arch line move up onto it; the floor edge tucks in to form the well
    const ay = archY(x);
    if (ay > 0) for (const q of out) {
      if (q.r < 0.6 || q.r > 4.6 || q.z < 0.55) continue;
      if (ay > q.y) { q.c = ay - q.y; q.y = ay; if (q.r < 2) q.z = lerp(q.z, 0.58, cl(q.c / 0.08)); }
    }
    return out;
  }
  function SP(x, r, sg) {
    const S = section(x); let i = 0; while (i < S.length - 2 && S[i + 1].r <= r) i++;
    const a = S[i], b = S[i + 1], f = cl((r - a.r) / ((b.r - a.r) || 1));
    return new THREE.Vector3(x, lerp(a.y, b.y, f), sg * lerp(a.z, b.z, f));
  }
  const XS = (() => {
    const s = [];
    for (const R of RAIL) for (const k of R) s.push(k[0]);
    for (const xw of [XF, XR]) { s.push(xw - RA - 0.002, xw - RA + 0.002, xw + RA - 0.002, xw + RA + 0.002); }
    [2.12, 0.82, 0.80, 0.78, 0.05, -0.30, -0.36, -0.50, -0.57, -1.18, -1.20, -1.28, -1.95].forEach((v) => s.push(v));
    const a = s.filter((v) => v <= XN + 1e-6 && v >= XT - 1e-6).sort((p, q) => q - p);
    const b = [a[0]]; for (let i = 1; i < a.length; i++) if (b[b.length - 1] - a[i] > 0.0015) b.push(a[i]);
    const out = [];
    for (let i = 0; i < b.length - 1; i++) {
      const mid = (b[i] + b[i + 1]) / 2, inArch = archY(mid) > 0, mx = inArch ? 0.018 : 0.035;
      const n = Math.max(1, Math.ceil((b[i] - b[i + 1]) / mx)); for (let k = 0; k < n; k++) out.push(b[i] - (b[i] - b[i + 1]) * k / n);
    }
    out.push(b[b.length - 1]); return out;
  })();
  function quadClass(xc, j) {
    if (j === 6 && xc <= 0.82 && xc >= 0.05) return "glass";
    if (j === 6 && xc <= -0.57 && xc >= -1.18) return "glass";
    if (j === 6 && xc <= -1.28 && xc >= -1.95) return "louvre";
    if (j === 5 && xc <= 0.78 && xc >= -0.50) return "glass";
    if ((j === 2 || j === 3) && xc <= -0.36 && xc >= -0.805) return "intake";
    return "body";
  }
  const GROUP = { body: "b", cap: "b", glass: "g", louvre: "l", intake: "i", liner: "x", deg: "x" };
  const BAND = (j) => (j <= 0 ? 0 : j === 1 ? 1 : j <= 4 ? 2 : j === 5 ? 3 : 4);
  const refDir = (p) => new THREE.Vector3(p.x - Math.max(-1.6, Math.min(1.6, p.x)), p.y - 0.55, p.z);

  function buildBody(COLS) {
    const NX = XS.length;
    const G = XS.map((x) => section(x));
    const pos = [], nor = [], col = [], tris = [];
    function pushTri(v, n, cls) { // v: 3 points, n: 3 normals
      const fn = new THREE.Vector3().subVectors(v[1], v[0]).cross(new THREE.Vector3().subVectors(v[2], v[0]));
      const avg = n[0].clone().add(n[1]).add(n[2]);
      if (fn.dot(avg) < 0) { v = [v[0], v[2], v[1]]; n = [n[0], n[2], n[1]]; }
      const k = COLS[cls] || COLS.body;
      for (let q = 0; q < 3; q++) { pos.push(v[q].x, v[q].y, v[q].z); nor.push(n[q].x, n[q].y, n[q].z); col.push(k.r, k.g, k.b); }
      tris.push({ a: v[0], b: v[1], c: v[2], na: n[0], nb: n[1], nc: n[2], area: fn.length() * 0.5, cls });
    }
    const Q = {}, VN = {};
    for (const sg of [1, -1]) {
      const P = (i, k) => new THREE.Vector3(XS[i], G[i][k].y, sg * G[i][k].z);
      const QQ = Q[sg] = [];
      for (let i = 0; i < NX - 1; i++) {
        QQ.push([]);
        for (let k = 0; k < NK - 1; k++) {
          const a = P(i, k), b = P(i + 1, k), c = P(i + 1, k + 1), d = P(i, k + 1);
          const n = new THREE.Vector3().subVectors(c, a).cross(new THREE.Vector3().subVectors(d, b));
          const area = n.length() * 0.5, ctr = a.clone().add(b).add(c).add(d).multiplyScalar(0.25);
          if (n.dot(refDir(ctr)) < 0) n.negate();
          const j = Math.min(6, Math.floor(G[i][k].r + 1e-6));
          const lin = G[i][k + 1].c > 0.002 && G[i + 1][k + 1].c > 0.002;
          const cls = area < 1.5e-5 ? "deg" : (lin ? "liner" : quadClass(ctr.x, j));
          QQ[i].push({ n, cls, g: (lin ? "x" : GROUP[cls]) + BAND(j), area });
        }
      }
      // smooth vertex normals within a smoothing group (creases and material edges stay hard)
      const vn = (i, k, g) => {
        const s = new THREE.Vector3();
        for (const [ii, kk] of [[i - 1, k - 1], [i - 1, k], [i, k - 1], [i, k]]) { if (ii < 0 || kk < 0 || ii >= NX - 1 || kk >= NK - 1) continue; const q = QQ[ii][kk]; if (q.g === g && q.cls !== "deg") s.add(q.n.clone().normalize().multiplyScalar(Math.max(q.area, 1e-6))); }
        return s.lengthSq() > 0 ? s.normalize() : new THREE.Vector3(0, 1, 0);
      };
      VN[sg] = (i, k) => { // feature-line normal: all visible neighbours
        const s = new THREE.Vector3();
        for (const [ii, kk] of [[i - 1, k - 1], [i - 1, k], [i, k - 1], [i, k]]) { if (ii < 0 || kk < 0 || ii >= NX - 1 || kk >= NK - 1) continue; const q = QQ[ii][kk]; if (q.cls !== "deg" && q.cls !== "liner") s.add(q.n.clone().normalize()); }
        return s.lengthSq() > 0 ? s.normalize() : null;
      };
      for (let i = 0; i < NX - 1; i++) for (let k = 0; k < NK - 1; k++) {
        const q = QQ[i][k]; if (q.cls === "deg") continue;
        const a = P(i, k), b = P(i + 1, k), c = P(i + 1, k + 1), d = P(i, k + 1);
        const na = vn(i, k, q.g), nb = vn(i + 1, k, q.g), nc = vn(i + 1, k + 1, q.g), nd = vn(i, k + 1, q.g);
        pushTri([a, b, c], [na, nb, nc], q.cls); pushTri([a, c, d], [na, nc, nd], q.cls);
      }
      for (const [i, sx] of [[0, 1], [NX - 1, -1]]) {
        const ring = []; for (let k = 0; k < NK; k++) ring.push(P(i, k));
        const ctr = new THREE.Vector3(XS[i], ring.reduce((s, p) => s + p.y, 0) / NK, sg * 0.25 * ring.reduce((s, p) => s + Math.abs(p.z), 0) / NK);
        const n = new THREE.Vector3(sx, 0, 0);
        for (let k = 0; k < NK - 1; k++) pushTri([ctr, ring[k], ring[k + 1]], [n, n, n], "cap");
        pushTri([ctr, ring[NK - 1], ring[0]], [n, n, n], "cap");
      }
    }
    // feature lines: sill, character line, shoulder/beltline, roof edge; material boundaries (window frames, louvre
    // panel, intake); the arch lips (liner boundary); the end-face outlines
    const edges = [];
    const vis = (q) => q && q.cls !== "deg" && q.cls !== "liner";
    const addE = (a, b, n) => { if (!n || a.distanceTo(b) < 1e-4 || n.y < -0.55) return; edges.push({ a, b, n }); };
    const RAILS_ON = new Set([KR[2], KR[3], KR[5], KR[6]]);
    for (const sg of [1, -1]) {
      const P = (i, k) => new THREE.Vector3(XS[i], G[i][k].y, sg * G[i][k].z), QQ = Q[sg], N = VN[sg];
      for (let i = 0; i < NX - 1; i++) for (let k = 1; k < NK - 1; k++) {
        const q1 = QQ[i][k - 1], q2 = QQ[i][k];
        if (!vis(q1) && !vis(q2)) continue;
        const on = RAILS_ON.has(k) || !(vis(q1) && vis(q2)) || GROUP[q1.cls] !== GROUP[q2.cls];
        if (on) addE(P(i, k), P(i + 1, k), N(i, k));
      }
      for (let i = 0; i < NX; i++) for (let k = 0; k < NK - 1; k++) {
        const q1 = i > 0 ? QQ[i - 1][k] : null, q2 = i < NX - 1 ? QQ[i][k] : null;
        if (!vis(q1) && !vis(q2)) continue;
        const on = !(vis(q1) && vis(q2)) || GROUP[q1.cls] !== GROUP[q2.cls];
        if (on) addE(P(i, k), P(i, k + 1), N(i, k) || new THREE.Vector3(i === 0 ? 1 : -1, 0, 0));
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    return { geo, tris, edges };
  }
  function airfoil(chord, th) {
    const sh = new THREE.Shape(), n = 28, pts = [];
    for (let i = 0; i <= n; i++) { const xx = i / n, yt = 5 * th * (0.2969 * Math.sqrt(xx) - 0.126 * xx - 0.3516 * xx * xx + 0.2843 * xx * xx * xx - 0.1036 * xx * xx * xx * xx); pts.push([xx, yt]); }
    sh.moveTo(chord, 0);
    for (let i = n; i >= 0; i--) sh.lineTo(pts[i][0] * chord, pts[i][1] * chord + 0.012 * chord * Math.sin(Math.PI * pts[i][0]));
    for (let i = 1; i <= n; i++) sh.lineTo(pts[i][0] * chord, -pts[i][1] * chord * 0.6 + 0.012 * chord * Math.sin(Math.PI * pts[i][0]));
    return sh;
  }
  function rimShape() {
    const sh = new THREE.Shape(); sh.absarc(0, 0, 0.232, 0, Math.PI * 2, false);
    const n = 5, span = rad(72), sp = rad(21);
    for (let i = 0; i < n; i++) {
      const a0 = i * span + sp / 2, a1 = (i + 1) * span - sp / 2, r0 = 0.078, r1 = 0.205, hole = new THREE.Path();
      hole.absarc(0, 0, r1, a0 + 0.06, a1 - 0.06, false);
      hole.absarc(0, 0, r0, a1 - 0.22, a0 + 0.22, true);
      hole.closePath(); sh.holes.push(hole);
    }
    return sh;
  }

  window.Holo3D = function (o) {
    const W = o.W, H = o.H, DPR = o.dpr || 1.5;
    const COL = Object.assign({ cyan: [0.2, 0.84, 1.0], white: [0.86, 0.98, 1.0], body: 0x1a3a46, glass: 0x04090d }, o.colors || {});
    const host = o.host;
    const glc = document.createElement("canvas"); glc.width = W * DPR; glc.height = H * DPR;
    glc.style.cssText = "position:absolute;left:0;top:0;width:" + W + "px;height:" + H + "px;display:block;pointer-events:none";
    const blc = document.createElement("canvas"); blc.width = Math.round(W / 4); blc.height = Math.round(H / 4);
    blc.style.cssText = "position:absolute;left:0;top:0;width:" + W + "px;height:" + H + "px;display:block;pointer-events:none;mix-blend-mode:plus-lighter";
    host.appendChild(glc); host.appendChild(blc);
    const bctx = blc.getContext("2d");

    const renderer = new THREE.WebGLRenderer({ canvas: glc, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(DPR); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = o.exposure || 1.05;
    renderer.localClippingEnabled = true;

    const scene = new THREE.Scene();
    const cam = o.cam;
    const camera = new THREE.PerspectiveCamera(cam.fov, W / H, 0.5, 200);

    // environment: a cool studio (top softbox, cyan strips, a horizon ring) so the facets and the chrome catch light
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(0.12,0.21,0.27), hor = vec3(0.02,0.045,0.06), low = vec3(0.008,0.012,0.018);" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.1, 0.95, y)) : mix(hor, low, smoothstep(0.0, 0.3, -y)); gl_FragColor = vec4(c, 1.0); }"
    })));
    const panel = (w, h, x, y, z, c) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); envScene.add(m); };
    panel(40, 9, 0, 34, 6, new THREE.Color(3.2, 3.4, 3.6));
    panel(5, 26, -28, 6, 18, new THREE.Color(2.0, 2.9, 3.4));
    panel(5, 22, 28, 4, 16, new THREE.Color(1.6, 2.3, 2.8));
    panel(36, 4, 0, 10, -32, new THREE.Color(2.2, 2.6, 2.8));
    panel(30, 3, 0, -2, 30, new THREE.Color(0.9, 1.4, 1.7));
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; panel(22, 1.6, 34 * Math.sin(a), 2.5, 34 * Math.cos(a), new THREE.Color(2.4, 2.9, 3.2)); }
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(envScene, 0.0, 0.1, 200).texture;

    const key = new THREE.DirectionalLight(0xf2fbff, 1.5); scene.add(key); scene.add(key.target);
    const rake = new THREE.DirectionalLight(0xffffff, 0); scene.add(rake); scene.add(rake.target);
    const rimL = new THREE.DirectionalLight(0x7fe6ff, 0.9); rimL.position.set(-6, 3, -8); scene.add(rimL); scene.add(rimL.target);
    scene.add(new THREE.HemisphereLight(0xd8f4ff, 0x061018, 0.5));

    // ---------- geometry ----------
    const lockPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), -10);
    const erasePlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 10);
    const clips = [lockPlane, erasePlane];
    const car = new THREE.Group(); scene.add(car);
    const parts = [];  // { geo, mesh, w, st, nrm }
    const fEdges = []; // feature segments { a, b, n, cls }

    const C = (h) => new THREE.Color(h);
    const COLS = { body: C(COL.body), cap: C(COL.body), glass: C(COL.glass), louvre: C(0x060c10), intake: C(0x030608), liner: C(0x020304) };
    const BODY = buildBody(COLS);
    const BA = o.bodyAlpha == null ? 0.36 : o.bodyAlpha;
    const mShell = new THREE.MeshPhysicalMaterial({ vertexColors: true, metalness: 0.6, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.0,
      emissive: new THREE.Color(0x03141b), emissiveIntensity: 1, clippingPlanes: clips, side: THREE.DoubleSide, transparent: true, opacity: BA });
    const mRubber = new THREE.MeshStandardMaterial({ color: 0x0b1115, roughness: 0.75, metalness: 0.0, envMapIntensity: 0.6, clippingPlanes: clips, transparent: true, opacity: Math.min(1, BA + 0.08) });
    const mChrome = new THREE.MeshPhysicalMaterial({ color: 0xa8ccd8, metalness: 1.0, roughness: 0.18, clearcoat: 1, envMapIntensity: 1.0, clippingPlanes: clips, transparent: true, opacity: Math.min(1, BA + 0.1) });
    const mCarbon = new THREE.MeshPhysicalMaterial({ color: 0x0d171c, metalness: 0.3, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 1.4, flatShading: true, clippingPlanes: clips, transparent: true, opacity: Math.min(1, BA + 0.06) });
    const mDisc = new THREE.MeshPhysicalMaterial({ color: 0x2c3c44, metalness: 0.9, roughness: 0.35, envMapIntensity: 1.2, clippingPlanes: clips, transparent: true, opacity: Math.min(1, BA + 0.1) });
    const mCaliper = new THREE.MeshPhysicalMaterial({ color: 0x0f5f7a, metalness: 0.2, roughness: 0.3, clearcoat: 1, emissive: new THREE.Color(0x064a62), emissiveIntensity: 0.5, clippingPlanes: clips, transparent: true, opacity: Math.min(1, BA + 0.12) });

    const SHELLS = [mShell, mRubber, mChrome, mCarbon, mDisc, mCaliper]; for (const m of SHELLS) m.userData.a0 = m.opacity;
    function add(geo, mat, w, m4, st, nrm) {
      const mesh = new THREE.Mesh(geo, mat); if (m4) mesh.applyMatrix4(m4); car.add(mesh); mesh.updateMatrixWorld(true);
      const p = { geo, mesh, w, st: !!st, nrm }; parts.push(p); return p;
    }
    const bodyPart = add(BODY.geo, mShell, 1, null, true);
    bodyPart.tris = BODY.tris;
    for (const e of BODY.edges) fEdges.push({ a: e.a, b: e.b, n: e.n, cls: 2 });
    const edgeSegs = (geo, mw, thr, nf, cls) => {
      const eg = new THREE.EdgesGeometry(geo, thr), pa = eg.attributes.position;
      for (let i = 0; i < pa.count; i += 2) {
        const a = new THREE.Vector3().fromBufferAttribute(pa, i).applyMatrix4(mw), b = new THREE.Vector3().fromBufferAttribute(pa, i + 1).applyMatrix4(mw);
        fEdges.push({ a, b, n: nf(a.clone().add(b).multiplyScalar(0.5)), cls: cls || 2 });
      }
    };
    const radialN = (p) => refDir(p).normalize();

    // wheels
    const tireProf = [];
    const r0 = 0.232, hwT = TW / 2, rc = 0.05;
    tireProf.push(new THREE.Vector2(r0, -hwT + 0.01));
    for (let i = 0; i <= 8; i++) { const a = -Math.PI / 2 + (Math.PI / 2) * i / 8; tireProf.push(new THREE.Vector2(WR - rc + rc * Math.cos(a), -hwT + rc + rc * Math.sin(a))); }
    for (let i = 0; i <= 8; i++) { const a = (Math.PI / 2) * i / 8; tireProf.push(new THREE.Vector2(WR - rc + rc * Math.cos(a), hwT - rc + rc * Math.sin(a))); }
    tireProf.push(new THREE.Vector2(r0, hwT - 0.01));
    const tireGeo = new THREE.LatheGeometry(tireProf, 72); tireGeo.rotateX(Math.PI / 2);
    const rimGeo = new THREE.ExtrudeGeometry(rimShape(), { depth: 0.035, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.008, bevelSegments: 2, curveSegments: 40 });
    const hubGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.05, 32); hubGeo.rotateX(Math.PI / 2);
    const discGeo = new THREE.CylinderGeometry(0.19, 0.19, 0.028, 56); discGeo.rotateX(Math.PI / 2);
    const calGeo = new THREE.BoxGeometry(0.075, 0.17, 0.07, 2, 4, 2);
    for (const xw of [XF, XR]) for (const sz of [1, -1]) {
      const g = new THREE.Group(); g.position.set(xw, WY, sz * WZ); if (sz < 0) g.rotation.y = Math.PI; car.add(g); g.updateMatrixWorld(true);
      const zN = () => new THREE.Vector3(0, 0, sz);
      const mk = (geo, mat, w, z, extra, st, feat) => {
        const m4 = new THREE.Matrix4().makeTranslation(0, 0, z); if (extra) m4.multiply(extra);
        const mesh = new THREE.Mesh(geo, mat); mesh.applyMatrix4(m4); g.add(mesh); mesh.updateMatrixWorld(true);
        parts.push({ geo, mesh, w, st: !!st });
        if (feat) edgeSegs(geo, mesh.matrixWorld, feat, zN);
        return mesh;
      };
      mk(tireGeo, mRubber, 1.2, 0, null, true);
      mk(rimGeo, mChrome, 2.0, 0.06, null, false, 32);
      mk(hubGeo, mChrome, 1, 0.105);
      mk(discGeo, mDisc, 0.8, 0.02);
      mk(calGeo, mCaliper, 1.6, 0.035, new THREE.Matrix4().makeRotationZ(rad(sz > 0 ? -35 : 35)).multiply(new THREE.Matrix4().makeTranslation(0, 0.175, 0)), false, 30);
      // tyre: the outer sidewall edge and the shoulder; rim: the lip; hub ring
      for (const [r, zz] of [[WR - 0.012, hwT - 0.004], [WR - 0.05, hwT + 0.002], [0.238, 0.1], [0.064, 0.132]]) {
        const pts = []; for (let i = 0; i <= 96; i++) { const a = i / 96 * Math.PI * 2; pts.push(new THREE.Vector3(r * Math.cos(a), r * Math.sin(a), zz).applyMatrix4(g.matrixWorld)); }
        for (let i = 0; i < 96; i++) fEdges.push({ a: pts[i], b: pts[i + 1], n: zN(), cls: 2 });
      }
    }
    // wing, endplates, struts
    const wingGeo = new THREE.ExtrudeGeometry(airfoil(0.48, 0.17), { depth: 1.72, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.006, bevelSegments: 1, curveSegments: 12 });
    wingGeo.translate(0, 0, -0.86);
    const wingM = new THREE.Matrix4().makeTranslation(XT + 0.18, 1.13, 0).multiply(new THREE.Matrix4().makeRotationZ(rad(-9)));
    const wp = add(wingGeo, mCarbon, 0.55, wingM); edgeSegs(wingGeo, wp.mesh.matrixWorld, 28, radialN);
    const plateGeo = new THREE.BoxGeometry(0.44, 0.19, 0.04, 6, 2, 1);
    for (const sz of [1, -1]) { const p = add(plateGeo, mCarbon, 0.6, new THREE.Matrix4().makeTranslation(XT + 0.38, 1.11, sz * 0.865)); edgeSegs(plateGeo, p.mesh.matrixWorld, 30, () => new THREE.Vector3(0, 0, sz)); }
    const strutGeo = new THREE.BoxGeometry(0.07, 0.30, 0.04, 1, 4, 1);
    for (const sz of [1, -1]) { const p = add(strutGeo, mCarbon, 1.0, new THREE.Matrix4().makeTranslation(XT + 0.46, 0.98, sz * 0.42).multiply(new THREE.Matrix4().makeRotationZ(rad(12)))); edgeSegs(strutGeo, p.mesh.matrixWorld, 30, () => new THREE.Vector3(0, 0, sz)); }

    // panel seams and lamps, drawn on the body surface (x, rail coordinate)
    const lightFill = [];
    const polyline = (pts, n, cls) => { for (let i = 0; i < pts.length - 1; i++) fEdges.push({ a: pts[i], b: pts[i + 1], n: n || radialN(pts[i].clone().add(pts[i + 1]).multiplyScalar(0.5)), cls: cls || 2 }); };
    const onBody = (list, sg) => list.map(([x, r]) => SP(x, r, sg).add(radialN(SP(x, r, sg)).multiplyScalar(0.003)));
    const HL = [[2.20, 4.25], [2.21, 5.0], [2.205, 5.65], [2.0, 5.88], [1.80, 5.35], [1.84, 4.7], [1.98, 4.32], [2.20, 4.25]];
    const inPoly = (P, x, y) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { if (((P[i][1] > y) !== (P[j][1] > y)) && (x < (P[j][0] - P[i][0]) * (y - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0])) c = !c; } return c; };
    const RL = rng(911);
    for (const sg of [1, -1]) {
      polyline(onBody([[0.76, 2.0], [0.76, 3.0], [0.765, 4.0], [0.77, 5.0]], sg));          // door front shut line
      polyline(onBody([[-0.30, 2.0], [-0.30, 3.0], [-0.30, 4.0], [-0.30, 5.0]], sg));       // door rear shut line
      polyline(onBody([[-0.06, 4.35], [-0.24, 4.35]], sg));                                  // door handle slot
      polyline(onBody([[2.12, 5.0], [2.12, 6.0], [2.12, 7.0]], sg));                         // front lid
      polyline(onBody([[1.50, 6.0], [1.50, 7.0]], sg));                                      // hood vent front
      polyline(onBody([[1.18, 6.0], [1.18, 7.0]], sg));
      polyline(onBody([[1.50, 6.0], [1.18, 6.0]], sg));
      for (let k = 0; k < 8; k++) { const x = -1.33 - 0.08 * k; polyline(onBody([[x, 6.04], [x, 6.5], [x, 7.0]], sg)); }   // engine louvres
      polyline(onBody([[-1.55, 4.25], [-1.95, 4.25]], sg));                                  // fuel / haunch seam
      // headlight cluster: outline, DRL stroke, lens fill (they switch on at the lock)
      polyline(onBody(HL, sg), null, 3);
      polyline(onBody([[2.175, 4.55], [2.18, 5.35], [2.05, 5.58]], sg), null, 3);
      polyline(onBody([[2.12, 4.95], [1.93, 4.85]], sg), null, 3);
      for (let n = 0; n < (o.lampPts || 1800); n++) {
        const x = 1.80 + RL() * 0.41, r = 4.25 + RL() * 1.63;
        if (!inPoly(HL, x, r)) { n--; continue; }
        lightFill.push({ p: SP(x, r, sg).add(radialN(SP(x, r, sg)).multiplyScalar(0.004)), n: radialN(SP(x, r, sg)) });
      }
      // nose blade: lower intake with slats; tail panel: light bars
      const fx = XN + 0.003, tx = XT - 0.003, fN = new THREE.Vector3(1, 0, 0), tN = new THREE.Vector3(-1, 0, 0);
      polyline([[0, .235], [0.46, .235], [0.50, .27], [0.50, .335], [0, .335]].map(([z, y]) => new THREE.Vector3(fx, y, sg * z)), fN);
      for (const z of [0.12, 0.25, 0.38]) polyline([new THREE.Vector3(fx, .245, sg * z), new THREE.Vector3(fx, .325, sg * z)], fN);
      polyline([[0.30, .73], [0.74, .73], [0.78, .76], [0.74, .80], [0.30, .80], [0.30, .73]].map(([z, y]) => new THREE.Vector3(tx, y, sg * z)), tN, 3);
      polyline([new THREE.Vector3(tx, .765, 0), new THREE.Vector3(tx, .765, sg * 0.30)], tN, 3);
      // the tail lamp wraps onto the flank
      polyline(onBody([[-2.235, 3.55], [-2.12, 3.62], [-2.08, 3.8], [-2.20, 3.85]], sg), null, 3);
    }

    // ---------- shaders ----------
    const SH = {
      uScanX: { value: 10 }, uLockX: { value: -10 }, uEraseX: { value: 10 }, uLockK: { value: 0 }, uHot: { value: 0 }, uWire: { value: 1 },
      uPts: { value: 1 }, uPR: { value: DPR }, uProj: { value: 1 }, uSize: { value: o.ptSize || 2.4 }, uBand: { value: 0.55 },
      uCyan: { value: new THREE.Vector3(...COL.cyan) }, uWhite: { value: new THREE.Vector3(...COL.white) }, uScanK: { value: 0 }, uFloor: { value: 0 },
      uExit: { value: 0 }, uGhost: { value: 0 }, uT: { value: 0 }, uLockD: { value: 0.6 },
      uRake: { value: 10 }, uRakeK: { value: 0 }, uLights: { value: 0 }, uInnerK: { value: 1 }, uErT: { value: 0 }, uSqueeze: { value: 0 }, uGlX: { value: 10 }, uGlK: { value: 0 }
    };
    const addBlend = (m) => { m.blending = THREE.CustomBlending; m.blendEquation = THREE.AddEquation; m.blendSrc = THREE.OneFactor; m.blendDst = THREE.OneFactor;
      m.blendSrcAlpha = THREE.OneFactor; m.blendDstAlpha = THREE.OneMinusSrcAlphaFactor; m.transparent = true; m.depthWrite = false; return m; };
    const wireMat = addBlend(new THREE.ShaderMaterial({
      uniforms: SH, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4,
      vertexShader: `varying vec3 vW; varying vec3 vN; varying vec3 vV;
        void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - w.xyz); gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: `uniform float uScanX, uLockX, uEraseX, uLockK, uHot, uWire, uPR, uT, uRake, uRakeK, uScanK, uErT, uGlX, uGlK; uniform vec3 uCyan, uWhite;
        varying vec3 vW; varying vec3 vN; varying vec3 vV;
        void main(){
          float x = vW.x;
          if (x > uEraseX + 0.002) discard;
          vec3 n = normalize(vN); float fac = abs(dot(n, normalize(vV)));
          float fres = pow(1.0 - clamp(fac, 0.0, 1.0), 2.6);
          // faces square to the sweep (nose blade, tail panel) never light up as a whole: the scan is a contour, not a slab
          float side = 1.0 - abs(n.x); side *= side;
          float scanned = smoothstep(uScanX - 0.006, uScanX + 0.006, x);
          float laser = exp(-pow((x - uScanX) / 0.011, 2.0)) * side * uScanK;
          float solid = uLockK * smoothstep(uLockX + 0.01, uLockX - 0.01, x);
          float lockEdge = uLockK * step(-9.0, uLockX) * step(uLockX, 2.4) * exp(-pow((x - uLockX) / 0.022, 2.0)) * side;
          float eraseEdge = exp(-pow((x - uEraseX) / 0.022, 2.0)) * step(uEraseX, 9.0) * side;
          float ff = gl_FrontFacing ? 1.0 : 0.25;
          vec3 col = uCyan * (scanned * fres * 0.42 * (1.0 - solid) + solid * fres * 0.5) * ff;
          col += uWhite * (laser * 1.5 * (1.0 - solid) + lockEdge * 1.3 + eraseEdge * 1.4) * ff;
          col += uCyan * uHot * fres * 0.7 * solid * ff;
          // (b) rear rim light on the printed shell: the haunch and rear flank catch a cool back light
          float rlS = pow(max(dot(n, normalize(vec3(-0.62, 0.30, -0.72))), 0.0), 2.0) * smoothstep(0.6, -0.9, x);
          col += mix(uCyan, uWhite, 0.3) * rlS * (0.09 + 0.36 * fres) * solid * ff;
          float gl = uGlK * exp(-pow((x + 0.4 * (vW.y - 0.6) - uGlX) / 0.12, 2.0));
          col += mix(uCyan, uWhite, 0.7) * gl * (0.32 + 0.9 * fres) * solid * ff;
          float rb = uRakeK * exp(-pow((x + 0.35 * (vW.y - 0.6) - uRake) / 0.16, 2.0));
          col += mix(uCyan, uWhite, 0.6) * rb * (0.14 + 0.45 * fres) * solid * ff;
          float band = step(mod(gl_FragCoord.y + uT * 60.0 * uPR, 6.0 * uPR), 2.0 * uPR);
          col *= uWire * (1.0 - 0.12 * band) * (1.0 - smoothstep(0.62, 0.9, uErT));
          gl_FragColor = vec4(col, clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0));
        }`
    }));
    for (const p of parts.slice()) { const m = new THREE.Mesh(p.geo, wireMat); m.matrixAutoUpdate = false; p.mesh.updateMatrixWorld(true); m.matrix.copy(p.mesh.matrixWorld); m.renderOrder = 5; scene.add(m); }
    const innerMat = addBlend(new THREE.ShaderMaterial({ uniforms: SH, side: THREE.BackSide, clipping: true,
      vertexShader: `varying vec3 vW;
        #include <clipping_planes_pars_vertex>
        void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <clipping_planes_vertex>
        }`,
      extensions: { derivatives: true },
      fragmentShader: `uniform float uLockX, uLockK, uEraseX, uInnerK; uniform vec3 uCyan, uWhite; varying vec3 vW;
        #include <clipping_planes_pars_fragment>
        void main(){
        #include <clipping_planes_fragment>
          float cut = min(uEraseX < 9.0 ? uEraseX : 10.0, (uLockK > 0.0 && uLockX < 2.4) ? uLockX : 10.0);
          float d = max(cut - vW.x, 0.0);
          float fw = max(fwidth(vW.y), 1e-5), dd = abs(fract(vW.y / 0.03 + 0.5) - 0.5) * 0.03, hatch = 1.0 - smoothstep(0.6 * fw, 1.8 * fw, dd);
          vec3 col = (uCyan * (0.07 + 0.34 * hatch) * exp(-d / 0.9) + uWhite * 0.35 * exp(-d / 0.05)) * uInnerK;
          gl_FragColor = vec4(col, clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0)); }`
    }));
    innerMat.clippingPlanes = clips;
    const inner = parts.filter((p) => p === bodyPart || p.mesh.material === mCarbon).map((p) => { const m = new THREE.Mesh(p.geo, innerMat); m.matrixAutoUpdate = false; m.matrix.copy(p.mesh.matrixWorld); m.renderOrder = 4; scene.add(m); return m; });
    const depthMat = new THREE.MeshBasicMaterial({ colorWrite: false, clippingPlanes: clips, side: THREE.DoubleSide });
    const prepass = parts.map((p) => { const m = new THREE.Mesh(p.geo, depthMat); m.matrixAutoUpdate = false; m.matrix.copy(p.mesh.matrixWorld); m.renderOrder = -1; scene.add(m); return m; });

    // ---------- point cloud: surface samples + feature lines + lamps ----------
    const NSURF = o.points || 100000;
    const WCLS = { body: 1, cap: 0.8, glass: 0.4, louvre: 0.55, intake: 0.85 };   // (b) the scoop intake carries more points so the rear flank never reads empty
    const TR = []; let TA = 0;
    // (b) the rear half of the flanks gets ~1.7x the sample density, so the haunch behind the door never reads as an empty dark slab
    const RW = o.rearDens || 1.7;
    for (const t of BODY.tris) { if (t.cls === "liner" || t.cls === "deg" || (t.na.y + t.nb.y + t.nc.y) < -1.5) continue;
      const cx = (t.a.x + t.b.x + t.c.x) / 3, nz = Math.abs(t.na.z + t.nb.z + t.nc.z) / 3;
      const w = t.area * (WCLS[t.cls] || 1) * (cx < 0.2 && nz > 0.45 ? RW : 1); if (w <= 0) continue; TA += w; TR.push({ a: t.a, b: t.b, c: t.c, na: t.na, nb: t.nb, nc: t.nc, cum: TA, st: t.cls === "body" || t.cls === "cap" }); }
    const va = new THREE.Vector3(), vb = new THREE.Vector3(), vc = new THREE.Vector3(), nm = new THREE.Matrix3();
    for (const p of parts) {
      if (p === bodyPart) continue;
      const g = p.geo, pos = g.attributes.position, nor = g.attributes.normal, idx = g.index, mw = p.mesh.matrixWorld; nm.getNormalMatrix(mw);
      const ntri = idx ? idx.count / 3 : pos.count / 3;
      for (let i = 0; i < ntri; i++) {
        const ia = idx ? idx.getX(i * 3) : i * 3, ib = idx ? idx.getX(i * 3 + 1) : i * 3 + 1, ic = idx ? idx.getX(i * 3 + 2) : i * 3 + 2;
        const a = new THREE.Vector3().fromBufferAttribute(pos, ia).applyMatrix4(mw), b = new THREE.Vector3().fromBufferAttribute(pos, ib).applyMatrix4(mw), c = new THREE.Vector3().fromBufferAttribute(pos, ic).applyMatrix4(mw);
        const ar = vb.subVectors(b, a).cross(vc.subVectors(c, a)).length() * 0.5 * p.w; if (ar <= 0) continue;
        TA += ar;
        TR.push({ a, b, c, na: new THREE.Vector3().fromBufferAttribute(nor, ia).applyMatrix3(nm).normalize(), nb: new THREE.Vector3().fromBufferAttribute(nor, ib).applyMatrix3(nm).normalize(), nc: new THREE.Vector3().fromBufferAttribute(nor, ic).applyMatrix3(nm).normalize(), cum: TA, st: p.st });
      }
    }
    let FL = 0; for (const e of fEdges) FL += e.a.distanceTo(e.b);
    const step = Math.max(o.featStep || 0.0042, FL / (o.featMax || 70000));
    let NFEAT = 0; for (const e of fEdges) NFEAT += Math.max(1, Math.round(e.a.distanceTo(e.b) / step));
    const NPTS = NSURF + NFEAT + lightFill.length;
    const P = new Float32Array(NPTS * 3), NRM = new Float32Array(NPTS * 3), RND = new Float32Array(NPTS * 4), STR = new Float32Array(NPTS);
    const R = rng(o.seed || 57); let k = 0;
    const put = (p, n, s) => { P[k * 3] = p.x; P[k * 3 + 1] = p.y; P[k * 3 + 2] = p.z; NRM[k * 3] = n.x; NRM[k * 3 + 1] = n.y; NRM[k * 3 + 2] = n.z;
      RND[k * 4] = R(); RND[k * 4 + 1] = R(); RND[k * 4 + 2] = R(); RND[k * 4 + 3] = R(); STR[k] = s; k++; };
    for (let q = 0; q < NSURF; q++) {
      const r = R() * TA; let lo = 0, hi = TR.length - 1; while (lo < hi) { const mid = (lo + hi) >> 1; if (TR[mid].cum < r) lo = mid + 1; else hi = mid; }
      const t = TR[lo]; let u = R(), v = R(); if (u + v > 1) { u = 1 - u; v = 1 - v; }
      const pt = t.a.clone().multiplyScalar(1 - u - v).add(t.b.clone().multiplyScalar(u)).add(t.c.clone().multiplyScalar(v));
      const nn = t.na.clone().multiplyScalar(1 - u - v).add(t.nb.clone().multiplyScalar(u)).add(t.nc.clone().multiplyScalar(v)).normalize();
      let s = 0;
      // lidar strata: most points slide along the facet onto scan lines (3 cm waterlines on the flanks, 3.5 cm cross lines on top)
      if (t.st && R() < 0.8) {
        s = 1;
        if (Math.abs(nn.y) < 0.72) { const d = Math.round(pt.y / 0.03) * 0.03 - pt.y, q1 = d / Math.max(1 - nn.y * nn.y, 0.3); pt.x -= nn.x * nn.y * q1; pt.y += (1 - nn.y * nn.y) * q1; pt.z -= nn.z * nn.y * q1; }
        else { const d = Math.round(pt.x / 0.035) * 0.035 - pt.x, q1 = d / Math.max(1 - nn.x * nn.x, 0.3); pt.x += (1 - nn.x * nn.x) * q1; pt.y -= nn.y * nn.x * q1; pt.z -= nn.z * nn.x * q1; }
      }
      put(pt, nn, s);
    }
    for (const e of fEdges) {
      const n = Math.max(1, Math.round(e.a.distanceTo(e.b) / step));
      for (let i = 0; i < n; i++) { const f = (i + 0.5) / n; put(e.a.clone().lerp(e.b, f), e.n, e.cls); }
    }
    for (const lf of lightFill) put(lf.p, lf.n, 3.6);   // 3.6 = lens glass (dimmer than the lamp outline / DRL)
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(P, 3)); pg.setAttribute("aN", new THREE.BufferAttribute(NRM, 3)); pg.setAttribute("aR", new THREE.BufferAttribute(RND, 4)); pg.setAttribute("aS", new THREE.BufferAttribute(STR, 1));
    const ptsMat = addBlend(new THREE.ShaderMaterial({
      uniforms: SH,
      vertexShader: `attribute vec3 aN; attribute vec4 aR; attribute float aS;
        uniform float uScanX, uLockX, uLockK, uEraseX, uSize, uPR, uProj, uPts, uBand, uHot, uGhost, uLockD, uRake, uRakeK, uLights, uErT, uT, uSqueeze, uGlX, uGlK;
        uniform vec3 uCyan, uWhite; varying vec3 vC;
        void main(){
          vec3 p = position;
          float F = step(1.5, aS), Lt = step(2.5, aS), Lf = step(3.3, aS), S = step(0.5, aS) * (1.0 - F);
          float behind = p.x - uScanX;
          float sv = smoothstep(-0.012, 0.012, behind);
          float e = clamp(behind / uBand, 0.0, 1.0), ee = 1.0 + 2.6 * pow(e - 1.0, 3.0) + 1.6 * pow(e - 1.0, 2.0);
          float spr = aR.y * aR.y;
          vec3 off = (aN * (0.03 + 0.30 * spr) + (aR.xzw - 0.5) * vec3(0.10, 0.16, 0.16) * (0.3 + spr)) * (1.0 - 0.85 * F);
          // the lock wave: loose points snap onto the strata with a back-out overshoot; the rest of the cloud fills in
          float lk = uLockK * clamp((uLockX - p.x) / 0.3, 0.0, 1.0);
          float sn = 1.0 + 2.70158 * pow(lk - 1.0, 3.0) + 1.70158 * pow(lk - 1.0, 2.0);
          vec3 loose = (aN * (0.02 + 0.05 * aR.y) + (aR.xzw - 0.5) * 0.05) * (1.0 - F);
          vec3 q = p + (off * (1.0 - ee) + loose * (1.0 - sn)) * sv;
          // the payoff squeeze: the locked cloud condenses toward the body and springs back
          q = vec3(0.0, 0.55, 0.0) + (q - vec3(0.0, 0.55, 0.0)) * (1.0 - uSqueeze * lk);
          float er = clamp((p.x - uEraseX) / 0.45, 0.0, 1.0);
          q += (aN * 0.15 + vec3(0.0, 0.5, 0.0)) * er * (0.4 + aR.x) * (1.0 - 0.6 * F);   // (b) a smaller outward kick keeps the spray inside the Shorts safe zone
          vec4 mv = modelViewMatrix * vec4(q, 1.0);
          gl_Position = projectionMatrix * mv; gl_Position.z -= 0.002 * gl_Position.w;
          float dens = (aR.w < uLockD || F > 0.5) ? 1.0 : smoothstep(0.0, 0.25, lk);
          // the erase's tail end dissolves as a whole: nothing (no end face, no lamp bar) is left floating on its own
          float fade = (1.0 - smoothstep(0.0, mix(0.8, 0.35, F), er)) * (1.0 - smoothstep(0.62, 0.9, uErT));
          float capK = 1.0 - 0.85 * abs(aN.x);
          float heat = exp(-pow(behind / 0.028, 2.0)) * capK;
          float eheat = exp(-pow((p.x - uEraseX) / 0.035, 2.0)) * step(uEraseX, 9.0) * capK;
          vec3 nV = normalize(normalMatrix * aN);
          float fac = dot(nV, normalize(-mv.xyz));
          float rim = pow(1.0 - abs(fac), 2.0);
          float back = fac < 0.0 ? mix(0.14, 0.28, F) : 1.0;
          // (b) a cool rim light from behind the tail on the camera side lights the rear flank and haunch
          float rl = pow(max(dot(aN, normalize(vec3(-0.62, 0.30, -0.72))), 0.0), 1.6) * smoothstep(0.6, -0.9, p.x);
          float keep = F > 0.5 ? 1.0 : step(fract(aR.z * 7.31 + aR.x * 3.17), 0.5 + 0.5 * smoothstep(0.0, 0.45, rim) + 0.25 * S + 0.4 * rl);
          float vis = sv * dens * fade * keep;
          float rb = uRakeK * exp(-pow((p.x + 0.35 * (p.y - 0.6) - uRake) / 0.18, 2.0));
          // the feature lines carry the read; the surface cloud is the quieter fill between them
          float Is = mix(0.22 + 0.4 * rim, (0.5 + 0.6 * rim) * mix(0.75, 1.0, S), lk);
          // a living cloud: a slow shimmer on every point, a few percent of sparkle points twinkling
          float sp = step(0.965, aR.w) * (1.0 - F);
          float tw = 0.86 + 0.28 * (0.5 + 0.5 * sin(uT * 5.0 + aR.z * 50.0));
          Is *= mix(1.0, tw, lk) * (1.0 + sp * lk * 1.6 * max(0.0, sin(uT * 7.0 + aR.x * 60.0)));
          Is *= 1.0 + rl * (0.35 + 0.75 * lk);
          float If = mix(0.95, 1.15, lk);
          float I = mix(Is, If, F) * back + heat * 1.1 + eheat * 1.2;
          float glp = uGlK * exp(-pow((p.x + 0.4 * (p.y - 0.6) - uGlX) / 0.16, 2.0));
          I *= (1.0 + 0.6 * uHot * lk) * (1.0 + 1.1 * rb * lk) * (1.0 + 1.6 * glp * lk);
          vec3 col = mix(uCyan, uWhite, clamp(heat * 1.4 + eheat * 1.4 + 0.12 + 0.38 * F + aR.w * 0.12, 0.0, 1.0));
          col = mix(col, vec3(1.0), rb * lk * 0.55);
          col = mix(col, uWhite, 0.3 * rl * lk * (1.0 - F));
          float on = uLights * lk;
          col = mix(col, mix(vec3(1.0, 0.985, 0.95), vec3(0.62, 0.9, 1.0), Lf), Lt * on);
          I = mix(I, mix(3.4, 1.1, Lf) * (fac < 0.0 ? 0.08 : 1.0), Lt * on);
          float sz = uSize * uPR * pow(uProj / -mv.z, 2.0) * (1.0 + 0.7 * heat + 0.7 * eheat) * mix(0.7 + 0.6 * aR.z, 0.95 + 0.2 * aR.z, F) * (1.0 + 0.3 * rim * (1.0 - F)) * (1.0 + 0.45 * Lt * on * (1.0 - Lf));
          gl_PointSize = max(sz * (1.0 + 0.35 * sp * lk), 1.2);
          // the ghost of the crease lines boots up from the floor like a projector (a rising line, not a fade)
          float gy = -0.05 + 1.45 * uGhost;
          float ghost = (1.0 - sv) * F * fade * (fac < 0.0 ? 0.3 : 1.0) * smoothstep(gy + 0.01, gy - 0.03, p.y);
          float gEdge = (1.0 - sv) * F * fade * exp(-pow((p.y - gy) / 0.025, 2.0)) * step(uGhost, 0.999);
          vC = col * I * uPts * vis + uCyan * 0.24 * ghost + uWhite * 0.8 * gEdge;
        }`,
      fragmentShader: `uniform float uPR, uT; varying vec3 vC;
        void main(){ vec2 c = gl_PointCoord - 0.5; float d = length(c) * 2.0; float k = smoothstep(1.0, 0.3, d);
          float band = step(mod(gl_FragCoord.y + uT * 60.0 * uPR, 6.0 * uPR), 2.0 * uPR);
          vec3 col = vC * k * (1.0 - 0.12 * band); gl_FragColor = vec4(col, clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0)); }`
    }));
    const points = new THREE.Points(pg, ptsMat); points.frustumCulled = false; points.renderOrder = 6; scene.add(points);

    // floor (b): a holographic projector pad under the car. A dotted lens bed (concentric dot rings) + the pad disc
    // (3 px rim with a halo, dashed inner ring, slowly turning tick ring, a radar sweep, the scan line, a lock ripple)
    // + a contact glow that spills out from under the footprint and the tyres + the soft pool and the contact shadow.
    const PR = o.padR || 2.2;
    SH.uPadR = { value: PR }; SH.uPadIn = { value: 0 }; SH.uPadOut = { value: 0 }; SH.uPulse = { value: 0 };
    const FD = [];
    for (let rr = 0.34; rr <= PR * 0.8; rr += 0.17) { const n = Math.max(8, Math.round(2 * Math.PI * rr / 0.12)); for (let i = 0; i < n; i++) { const a = (i + 0.5 * ((rr / 0.17) % 2)) / n * Math.PI * 2; FD.push(rr * Math.cos(a), 0.002, rr * Math.sin(a)); } }
    const fg = new THREE.BufferGeometry(); fg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(FD), 3));
    const floorMat = addBlend(new THREE.ShaderMaterial({
      uniforms: SH,
      vertexShader: `uniform float uFloor, uScanX, uScanK, uPR, uProj, uEraseX, uPadR, uPadOut; uniform vec3 uCyan, uWhite; varying vec3 vC;
        void main(){ vec3 p = position; vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;
          float r = length(p.xz) / uPadR, a = abs(atan(p.z, p.x));
          float rev = smoothstep(uFloor * 1.15, uFloor * 1.15 - 0.15, r) * step(3.14159 * uPadOut, a);
          float fall = 0.45 + 0.55 * r;
          float bar = exp(-pow((p.x - uScanX) / 0.035, 2.0)) * uScanK;
          gl_PointSize = max(2.0 * uPR * (uProj / -mv.z) * (1.0 + 0.6 * bar), 1.0);
          vC = (uCyan * (0.42 * fall * rev) + uWhite * bar * 0.9 * rev);
        }`,
      fragmentShader: `varying vec3 vC; void main(){ vec2 c = gl_PointCoord - 0.5; float k = smoothstep(1.0, 0.25, length(c) * 2.0); vec3 col = vC * k; gl_FragColor = vec4(col, clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0)); }`
    }));
    const floor = new THREE.Points(fg, floorMat); floor.renderOrder = 3; floor.frustumCulled = false; scene.add(floor);
    const padMat = addBlend(new THREE.ShaderMaterial({
      uniforms: SH, extensions: { derivatives: true },
      vertexShader: "varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",
      fragmentShader: `uniform float uFloor, uPadR, uPadIn, uPadOut, uPulse, uScanX, uScanK, uLockK, uT, uPR, uEraseX; uniform vec3 uCyan, uWhite; varying vec3 vW;
        float sq(float x){ return x * x; }
        float ln(float d, float px){ float fw = max(fwidth(d), 1e-6); return 1.0 - smoothstep(0.5 * px * uPR, 0.5 * px * uPR + 1.2, abs(d) / fw); }
        void main(){
          float R = uPadR, r = length(vW.xz), a = atan(vW.z, vW.x), aa = abs(a);
          // the rim draws around from the nose both ways on boot, and retracts toward the tail behind the erase
          float arcI = uPadIn >= 0.999 ? 1.0 : 1.0 - smoothstep(3.1416 * uPadIn - 0.02, 3.1416 * uPadIn + 0.02, aa);
          float arcO = uPadOut <= 0.001 ? 1.0 : smoothstep(3.1416 * uPadOut - 0.02, 3.1416 * uPadOut + 0.02, aa);
          float arc = arcI * arcO, nearRim = exp(-abs(r - R) / 0.05);
          float head = uPadIn > 0.001 && uPadIn < 0.999 ? exp(-sq((aa - 3.1416 * uPadIn) * r / 0.07)) * nearRim : 0.0;
          float tail = uPadOut > 0.001 && uPadOut < 0.999 ? exp(-sq((aa - 3.1416 * uPadOut) * r / 0.07)) * nearRim : 0.0;
          float inside = 1.0 - smoothstep(R - 0.01, R + 0.01, r);
          float body = uFloor * (1.0 - uPadOut);
          // rim, halo, dashed inner ring
          float rim = ln(r - R, 3.0) * arc;
          float halo = exp(-abs(r - R) / 0.07) * arc * 0.22;
          float dash = step(fract(a * 48.0 / 6.2832), 0.55);
          float ring2 = ln(r - 0.84 * R, 1.6) * dash * arc * 0.55;
          // tick ring, turning slowly (every 6 deg, long every 30 deg)
          float ta = a + uT * 0.22, tk = 6.2832 / 60.0, td = (fract(ta / tk + 0.5) - 0.5) * tk * r;
          float longT = step(abs(fract(ta / (tk * 5.0) + 0.5) - 0.5) * 5.0, 0.5);
          float band = smoothstep(mix(0.9, 0.87, longT) * R - 0.005, mix(0.9, 0.87, longT) * R + 0.005, r) * (1.0 - smoothstep(0.965 * R - 0.005, 0.965 * R + 0.005, r));
          float ticks = ln(td, mix(1.6, 2.4, longT)) * band * arc * mix(0.45, 0.8, longT);
          // lens fill and a slow radar sweep across the pad
          float fill = inside * (0.03 + 0.07 * pow(r / R, 3.0)) * body;
          float sa = mod(uT * 0.9 - a, 6.2832);
          float sweep = inside * exp(-sa / 0.55) * smoothstep(0.15 * R, 0.5 * R, r) * 0.12 * body * uLockK;
          // contact glow: spills out from under the footprint, hottest under the tyres
          // (rounded-box distance to the footprint: brightest along its edge, dimmer under the body, so it is never a flat slab)
          vec2 fq = abs(vW.xz) - vec2(1.95, 0.8);
          float sdf = length(max(fq, 0.0)) + min(max(fq.x, fq.y), 0.0);
          float cg = 0.36 * (sdf > 0.0 ? exp(-sdf / 0.3) : mix(0.3, 1.0, smoothstep(-0.45, 0.0, sdf)));
          float em = 1.0 - smoothstep(uEraseX - 0.35, uEraseX + 0.05, vW.x);   // the glow goes out behind the erase
          float wsp = 0.0;
          for (int i = 0; i < 2; i++) { float xw = i == 0 ? ${XF.toFixed(4)} : ${XR.toFixed(4)}; wsp += exp(-(sq(vW.x - xw) / 0.10 + sq(abs(vW.z) - 0.8) / 0.02)); }
          float contact = (cg + 0.5 * wsp) * em * uFloor * (0.4 + 0.6 * uLockK) * (1.0 - uPadOut) * (1.0 - smoothstep(R - 0.25, R + 0.3, r));
          // the scan line crossing the pad; the lock ripple running out to the rim
          float scan = ln(vW.x - uScanX, 2.5) * uScanK * inside * 0.7;
          float pr = clamp(uPulse, 0.0, 1.0), pe = 1.0 - pow(1.0 - pr, 3.0);
          float ripple = (uPulse > 0.0 && uPulse < 1.0) ? ln(r - mix(1.0, R, pe), 5.0) * pow(1.0 - pr, 1.4) * 0.95 : 0.0;
          vec3 col = uCyan * (fill + sweep + halo + ring2 + ticks + contact) + mix(uCyan, uWhite, 0.4) * rim * 0.9
            + uWhite * (scan + ripple * 0.8 + (head + tail) * 0.9) + uCyan * ripple * 0.4 + uWhite * 0.25 * wsp * em * uLockK * uFloor * (1.0 - uPadOut);
          float sl = step(mod(gl_FragCoord.y + uT * 60.0 * uPR, 6.0 * uPR), 2.0 * uPR);
          col *= (1.0 - 0.1 * sl);
          gl_FragColor = vec4(col, clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0)); }`
    }));
    const pad = new THREE.Mesh(new THREE.CircleGeometry(PR + 0.35, 160), padMat); pad.rotation.x = -Math.PI / 2; pad.position.y = 0.004; pad.renderOrder = 3; pad.frustumCulled = false; scene.add(pad);
    const shadowMat = new THREE.ShaderMaterial({ uniforms: { uK: { value: 0 } }, transparent: true, depthWrite: false,
      vertexShader: "varying vec2 vU; void main(){ vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "uniform float uK; varying vec2 vU; void main(){ vec2 c = (vU - 0.5) * 2.0; float r = length(c); float a = uK * 0.62 * smoothstep(1.0, 0.15, r); gl_FragColor = vec4(0.0, 0.01, 0.015, a); }" });
    const poolMat = addBlend(new THREE.ShaderMaterial({ uniforms: Object.assign({ uK: { value: 0 } }, SH),
      vertexShader: "varying vec2 vU; void main(){ vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "uniform float uK, uEraseX; uniform vec3 uCyan, uWhite; varying vec2 vU; void main(){ vec2 c = (vU - 0.5) * 2.0; float r2 = dot(c, c); float g = exp(-r2 * 3.2) * (1.0 - smoothstep(0.7, 1.0, sqrt(r2))) * (1.0 - smoothstep(uEraseX - 0.35, uEraseX + 0.05, (vU.x - 0.5) * 6.4)); vec3 col = mix(uCyan, uWhite, 0.25 * g) * g * 0.28 * uK; gl_FragColor = vec4(col, clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0)); }" }));
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 3.4), poolMat); pool.rotation.x = -Math.PI / 2; pool.position.y = 0.003; pool.renderOrder = 3; scene.add(pool);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 2.9), shadowMat); shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.001; shadow.renderOrder = 2; scene.add(shadow);

    // ---------- camera ----------
    const tgt = new THREE.Vector3(...cam.target);
    function setCam(yaw, pitch, dist) {
      const y = rad(yaw), p = rad(pitch);
      camera.position.set(tgt.x + dist * Math.sin(y) * Math.cos(p), tgt.y + dist * Math.sin(p), tgt.z + dist * Math.cos(y) * Math.cos(p));
      camera.lookAt(tgt);
      camera.setViewOffset(W, H, -(cam.shift ? cam.shift[0] : 0), -(cam.shift ? cam.shift[1] : 0), W, H);
      camera.updateMatrixWorld(true); camera.updateProjectionMatrix();
      SH.uProj.value = dist;
    }
    const v3 = new THREE.Vector3();
    function project(p) { v3.set(p[0], p[1], p[2]); car.localToWorld(v3); v3.project(camera); return { x: (v3.x + 1) / 2 * W, y: (1 - v3.y) / 2 * H, z: v3.z }; }

    function render(S) {
      setCam(S.yaw, S.pitch, S.dist);
      SH.uScanX.value = S.scanX; SH.uLockX.value = S.lockX; SH.uLockK.value = S.lockK; SH.uEraseX.value = S.eraseX;
      SH.uHot.value = S.hot || 0; SH.uWire.value = S.wire == null ? 1 : S.wire; SH.uPts.value = S.pts == null ? 1 : S.pts;
      SH.uScanK.value = S.scanK || 0; SH.uFloor.value = S.floor; SH.uLights.value = S.lights || 0;
      lockPlane.constant = S.lockK > 0 ? S.lockX : -10;
      erasePlane.constant = S.eraseX;
      shadowMat.uniforms.uK.value = S.shadow || 0; poolMat.uniforms.uK.value = S.pool == null ? S.floor : S.pool;
      SH.uGhost.value = S.ghost || 0; SH.uT.value = S.t || 0;
      SH.uPadIn.value = S.padIn == null ? S.floor : S.padIn; SH.uPadOut.value = S.padOut || 0; SH.uPulse.value = S.pulse || 0;
      pad.visible = SH.uPadIn.value > 0.001 && SH.uPadOut.value < 0.999;
      { const rk = cl(S.rake || 0), rkE = 0.5 - 0.5 * Math.cos(Math.PI * rk); SH.uRake.value = XN + 0.8 - (L + 1.6) * rkE; SH.uRakeK.value = rk > 0 && rk < 1 ? 1 : 0; }
      const solidOn = S.lockK > 0 && S.lockX > XT - 0.05;
      // the last of the erase dissolves (no glowing end slice left floating): the section and the shell thin out over the tail
      const tailK = S.eraseX < 9 ? cl((S.eraseX - XT - 0.6) / 0.9) : 1;
      SH.uInnerK.value = tailK * (1 - 0.5 * cl(S.erT || 0));
      for (const m of SHELLS) m.opacity = m.userData.a0 * tailK;
      SH.uErT.value = S.erT || 0;
      SH.uSqueeze.value = S.squeeze || 0; SH.uGlX.value = S.glX == null ? 10 : S.glX; SH.uGlK.value = S.glK || 0;
      for (const p of parts) p.mesh.visible = solidOn; for (const m of prepass) m.visible = solidOn; for (const m of inner) m.visible = solidOn && (S.eraseX < 9 || S.lockX < 2.4);

      key.position.copy(camera.position).add(new THREE.Vector3(-4, 8, 2)); key.target.position.copy(tgt);
      const ra = rad(-70 + 140 * (S.rake || 0));
      rake.position.set(tgt.x + 10 * Math.sin(ra + rad(S.yaw)), tgt.y + 6, tgt.z + 10 * Math.cos(ra + rad(S.yaw))); rake.target.position.copy(tgt);
      rake.intensity = 2.4 * Math.sin(Math.PI * cl(S.rake || 0));
      renderer.render(scene, camera);
      bctx.clearRect(0, 0, blc.width, blc.height);
      const bl = S.bloom == null ? 0.6 : S.bloom;
      if (bl > 0.01) { bctx.globalAlpha = Math.min(1, bl); bctx.filter = "blur(" + (o.bloomPx || 5) + "px)"; bctx.drawImage(glc, 0, 0, blc.width, blc.height); bctx.filter = "none"; bctx.globalAlpha = 1; }
    }
    return { render, project, XN, XT, XF, XR, WY, WZ, L, camera, renderer, canvas: glc, counts: { surf: NSURF, feat: NFEAT, lamps: lightFill.length, edges: fEdges.length },
      bbox: () => { const c = []; for (const x of [XT, XN]) for (const y of [0, 1.15]) for (const z of [-1.02, 1.02]) c.push(project([x, y, z])); const xs = c.map((p) => p.x), ys = c.map((p) => p.y); return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) }; } };
  };
})();
