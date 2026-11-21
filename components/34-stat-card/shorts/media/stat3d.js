/* STAT3D: the stat card's physical parts as real geometry (Three.js r160, global THREE). Shared by a/ and b/ (identical copy).
   - card(): the card body is a thick edge-lit acrylic slab. Only its rim is geometry (a quarter-round bevel swept round the
     rounded rectangle, then the wall): the face itself is a DOM frosted-glass layer pinned exactly under it (css()), so the
     footage blurs through the glass while the rim takes real light, shows its thickness in perspective and glows pink.
   - coin(): a class badge: a rounded hexagon coin with a bevelled metal rim, an enamel face on each side and an extruded,
     bevelled letter on each face (Archivo Black outlines from media/glyphs.js). It flips with real thickness.
   - gauge(): a neon arc gauge: a glowing tube in a glass sleeve (a torus arc with a neon shader: white-hot core, coloured
     edges, lit up to the value), a soft additive halo, ticks, a bevelled needle with a contact shadow and a chrome hub.
   One world unit = one canvas pixel on the z = 0 plane; the camera's principal point is the canvas centre, so css(obj, ...)
   returns a CSS matrix3d that puts a DOM element exactly on an object's plane (for a parent with perspective = dist()).
   Seek-safe: nothing animates on its own; the composition sets transforms/uniforms from timeline time, then calls render(). */
(function () {
  window.Stat3D = function (o) {
    const W = o.W, H = o.H, FOV = o.fov || 22, DIST = (H / 2) / Math.tan((FOV / 2) * Math.PI / 180);
    const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
    canvas.style.cssText = "position:absolute;left:0;top:0;width:" + W + "px;height:" + H + "px;display:block";
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = o.exposure || 1.05;
    renderer.sortObjects = true;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, W / H, 10, DIST * 4);
    camera.position.set(0, 0, DIST); camera.lookAt(0, 0, 0);

    // ---------- environment: a studio sphere (warm top softbox, dark floor) with a hot strip, a pink card and a violet card ----------
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(1.7,1.62,1.62), hor = vec3(0.42,0.36,0.48), low = vec3(0.04,0.03,0.06);" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.0, 0.75, y)) : mix(hor, low, smoothstep(0.0, 0.45, -y));" +
        " c *= 0.7 + 0.4 * smoothstep(-0.3, 1.0, vP.z); gl_FragColor = vec4(c, 1.0); }"
    })));
    const panel = (w, h, x, y, z, col) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); envScene.add(m); };
    panel(46, 12, -6, 30, 22, new THREE.Color(2.6, 2.5, 2.4));     // top-left softbox
    panel(34, 2.4, 0, 10, 40, new THREE.Color(3.2, 3.1, 3.0));     // crisp strip (the specular line on bevels)
    panel(10, 30, 36, 2, 12, new THREE.Color(2.4, 0.5, 1.7));      // pink card, right
    panel(10, 26, -36, -4, 14, new THREE.Color(0.8, 0.45, 2.2));   // violet card, left
    panel(40, 8, 0, -20, 26, new THREE.Color(0.25, 0.1, 0.3));     // dim floor bounce
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(envScene, 0.0, 0.1, 200).texture;

    // ---------- lights ----------
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(-0.55, 0.9, 0.8); scene.add(key);
    const rimL = new THREE.DirectionalLight(0xff7ad9, 0.9); rimL.position.set(0.8, -0.3, 0.5); scene.add(rimL);
    scene.add(new THREE.HemisphereLight(0xfff4fb, 0x1a0b26, 0.6));

    // ---------- geometry helpers ----------
    // outline: CCW points {x, y, nx, ny} (outward normals). Rounded rect / rounded regular polygon.
    function rrect(w, h, r, seg) {
      seg = seg || 10; const pts = [], cx = w / 2 - r, cy = h / 2 - r;
      const C = [[cx, -cy, -Math.PI / 2], [cx, cy, 0], [-cx, cy, Math.PI / 2], [-cx, -cy, Math.PI]];
      C.forEach(([x0, y0, a0]) => { for (let i = 0; i <= seg; i++) { const a = a0 + (i / seg) * Math.PI / 2; pts.push({ x: x0 + r * Math.cos(a), y: y0 + r * Math.sin(a), nx: Math.cos(a), ny: Math.sin(a) }); } });
      return pts;
    }
    function rpoly(n, R, rc, phi0, seg) {
      seg = seg || 8; const pts = [], dc = R - rc / Math.cos(Math.PI / n);
      for (let k = 0; k < n; k++) {
        const ph = phi0 + k * 2 * Math.PI / n, cx = dc * Math.cos(ph), cy = dc * Math.sin(ph);
        for (let i = 0; i <= seg; i++) { const a = ph - Math.PI / n + (i / seg) * 2 * Math.PI / n; pts.push({ x: cx + rc * Math.cos(a), y: cy + rc * Math.sin(a), nx: Math.cos(a), ny: Math.sin(a) }); }
      }
      return pts;
    }
    // profile: [{d, z, nr, nz}] (d = offset along the outward normal). Sweeps the profile round the closed outline.
    function sweep(outline, profile) {
      outline = outline.concat([outline[0]]);   // closed: the first point repeats at the end, so uv.x runs 0..1 without a wrap seam
      const N = outline.length, M = profile.length, pos = [], nor = [], idx = [], uv = [];
      for (let i = 0; i < N; i++) { const p = outline[i]; for (let j = 0; j < M; j++) { const q = profile[j];
        pos.push(p.x + p.nx * q.d, p.y + p.ny * q.d, q.z); const nl = Math.hypot(q.nr, q.nz) || 1; nor.push(p.nx * q.nr / nl, p.ny * q.nr / nl, q.nz / nl); uv.push(i / (N - 1), j / (M - 1)); } }
      for (let i = 0; i < N - 1; i++) { const i2 = i + 1; for (let j = 0; j < M - 1; j++) {
        const a = i * M + j, b = i2 * M + j, c = i2 * M + j + 1, d = i * M + j + 1; idx.push(a, b, d, b, c, d); } }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
      g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
      return g;
    }
    function tubeProfile(rad, d0, z0, n) { const P = []; for (let i = 0; i <= n; i++) { const a = (i / n) * Math.PI * 2; P.push({ d: d0 + rad * Math.cos(a), z: z0 + rad * Math.sin(a), nr: Math.cos(a), nz: Math.sin(a) }); } return P; }
    function bevelProfile(b, depth, back, segs) {
      segs = segs || 8; const P = [];
      for (let i = 0; i <= segs; i++) { const a = (i / segs) * Math.PI / 2; P.push({ d: -b + b * Math.sin(a), z: -b + b * Math.cos(a), nr: Math.sin(a), nz: Math.cos(a) }); }
      P.push({ d: 0, z: -b - depth, nr: 1, nz: 0 });
      if (back) for (let i = 1; i <= segs; i++) { const a = (i / segs) * Math.PI / 2; P.push({ d: -b + b * Math.cos(a), z: -b - depth - b * Math.sin(a), nr: Math.cos(a), nz: -Math.sin(a) }); }
      return P;
    }
    // a flat lid from an outline inset by b (convex outlines): triangle fan
    function lid(outline, b, z, facing) {
      const pos = [0, 0, z], nor = [0, 0, facing], idx = [];
      outline.forEach((p) => { const k = 0.42, l = Math.hypot(p.nx * k, p.ny * k, 1); pos.push(p.x - p.nx * b, p.y - p.ny * b, z); nor.push(p.nx * k / l, p.ny * k / l, facing / l); });
      const N = outline.length; for (let i = 0; i < N; i++) { const a = 1 + i, c = 1 + (i + 1) % N; if (facing > 0) idx.push(0, a, c); else idx.push(0, c, a); }
      const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3)); g.setIndex(idx);
      return g;
    }
    const col = (h) => new THREE.Color(h);

    // ---------- the card: an edge-lit acrylic slab rim. Front face plane at z = 0 of the returned group. ----------
    function card(c) {
      const group = new THREE.Group();
      const b = c.bevel || 8, D = c.depth || 16;
      const out = rrect(c.w, c.h, c.r, 12);
      const mat = new THREE.MeshPhysicalMaterial({ color: col(c.rim || "#FF4FCF"), roughness: 0.24, metalness: 0.0, clearcoat: 1, clearcoatRoughness: 0.05,
        emissive: col(c.glow || "#E0149F"), emissiveIntensity: c.emissive == null ? 0.55 : c.emissive, envMapIntensity: 0.75, side: THREE.DoubleSide });
      const rim = new THREE.Mesh(sweep(out, bevelProfile(b, D, false, 10)), mat);
      group.add(rim);
      // the neon seam: a glowing tube where the glass face meets the bevel, and its additive halo
      const tubeR = c.tube || 2.6;
      const neonT = neonMat(0, { c0: c.n0 || "#FF8AE6", c1: c.n1 || "#C84DFF", hot: "#FFF4FC", dim: "#3A1758", tri: 1 }); neonT.uniforms.uFill.value = 2; neonT.uniforms.uHotEnd.value = 0;
      const tube = new THREE.Mesh(sweep(out, tubeProfile(tubeR, -b - tubeR - 1.5, tubeR * 0.6, 12)), neonT); group.add(tube);
      const neonH = neonMat(0.5, { c0: c.n0 || "#FF8AE6", c1: c.n1 || "#C84DFF", tri: 1 }); neonH.uniforms.uFill.value = 2; neonH.uniforms.uHotEnd.value = 0;
      const tubeH = new THREE.Mesh(sweep(out, tubeProfile(tubeR * 3.2, -b - tubeR - 1.5, tubeR * 0.6, 12)), neonH); tubeH.renderOrder = 5; group.add(tubeH);
      scene.add(group);
      return { group, mat, rim, tube, tubeH, neonT, neonH, faceW: c.w - 2 * b, faceH: c.h - 2 * b, faceR: c.r - b };
    }

    // ---------- glyph shapes (from media/glyphs.js), centred on the ink box, scaled so the cap height = size ----------
    function glyphShapes(G, ch, size) {
      const g = G.g[ch], sc = size / G.cap, mx = (g[2] + g[3]) / 2, my = -G.cap / 2;
      const sp = new THREE.ShapePath(), re = /([MLQCZ])([^MLQCZ]*)/g; let m;
      while ((m = re.exec(g[1]))) {
        const n = m[2].trim() ? m[2].trim().split(/[\s,]+/).map(Number) : [], P = [];
        for (let i = 0; i < n.length; i += 2) P.push((n[i] - mx) * sc, -(n[i + 1] - my) * sc);
        if (m[1] === "M") sp.moveTo(P[0], P[1]); else if (m[1] === "L") sp.lineTo(P[0], P[1]);
        else if (m[1] === "Q") sp.quadraticCurveTo(P[0], P[1], P[2], P[3]); else if (m[1] === "C") sp.bezierCurveTo(P[0], P[1], P[2], P[3], P[4], P[5]);
      }
      return sp.toShapes(false);
    }

    // ---------- the class coin ----------
    function coin(c) {
      const group = new THREE.Group(), spin = new THREE.Group(); group.add(spin);
      const R = c.R || 56, rc = c.rc || 12, b = c.bevel || 5, D = c.depth || 12, half = b + D / 2;
      const out = rpoly(6, R, rc, Math.PI / 2, 8);
      const rimMat = new THREE.MeshPhysicalMaterial({ color: col("#E9E6F2"), metalness: 1, roughness: 0.24, clearcoat: 0.6, clearcoatRoughness: 0.1, envMapIntensity: 1.25, emissive: col("#000000") });
      const rim = new THREE.Mesh(sweep(out, bevelProfile(b, D, true, 8)), rimMat); rim.position.z = half; spin.add(rim);
      const fFront = new THREE.MeshPhysicalMaterial({ color: col(c.front || "#6A2FD0"), metalness: 0.0, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 0.9, emissive: col(c.frontGlow || "#2A0B66"), emissiveIntensity: 0.6 });
      const fBack = new THREE.MeshPhysicalMaterial({ color: col(c.back || "#F2AE2E"), metalness: 1, roughness: 0.26, clearcoat: 0.7, clearcoatRoughness: 0.08, envMapIntensity: 1.35, emissive: col("#000000") });
      const front = new THREE.Mesh(lid(out, b, half, 1), fFront); spin.add(front);
      const back = new THREE.Mesh(lid(out, b, -half, -1), fBack); spin.add(back);
      const letterGeo = (ch) => {
        const g = new THREE.ExtrudeGeometry(glyphShapes(c.glyphs, ch, c.cap || 54), { depth: c.ldepth || 4, bevelEnabled: true, bevelThickness: 1.6, bevelSize: 1.3, bevelOffset: -1.3, bevelSegments: 3, curveSegments: 10 });
        g.computeVertexNormals(); return g;
      };
      const lFrontMat = new THREE.MeshPhysicalMaterial({ color: col(c.frontInk || "#FFFFFF"), roughness: 0.25, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 0.8, emissive: col("#3B1470"), emissiveIntensity: 0.15 });
      const lBackMat = new THREE.MeshPhysicalMaterial({ color: col(c.backInk || "#2A0C4A"), roughness: 0.22, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 0.9 });
      const lf = new THREE.Mesh(letterGeo(c.letters[0]), lFrontMat); lf.position.set(c.lx || 0, c.ly || 0, half - 0.6); spin.add(lf);
      const lb = new THREE.Mesh(letterGeo(c.letters[1]), lBackMat); lb.rotation.y = Math.PI; lb.position.set(-(c.lx || 0), c.ly || 0, -half + 0.6); spin.add(lb);
      scene.add(group);
      const silver = col("#E9E6F2"), gold = col("#F4B43A"), tmp = new THREE.Color();
      return {
        group, spin, rimMat, fFront, fBack,
        set(s) { // {gold: 0..1 rim colour, flash: 0..1}
          tmp.copy(silver).lerp(gold, s.gold || 0); rimMat.color.copy(tmp);
          const f = s.flash || 0;
          rimMat.emissive.setRGB(1.0 * f, 0.78 * f, 0.35 * f); fBack.emissive.setRGB(0.9 * f, 0.6 * f, 0.2 * f);
          fFront.emissiveIntensity = 0.6 + 1.2 * f;
        }
      };
    }

    // ---------- the neon arc gauge (upper semicircle, value 0 at the left end, 1 at the right) ----------
    const NEON_V = "varying vec2 vUv; varying vec3 vN; varying vec3 vV; void main(){ vUv = uv; vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position,1.0); vV = -mv.xyz; gl_Position = projectionMatrix * mv; }";
    const NEON_F = "uniform float uFill, uGain, uHalo, uHotEnd; uniform vec3 uC0, uC1, uHot, uDim; varying vec2 vUv; varying vec3 vN; varying vec3 vV;" +
      " uniform float uTri; void main(){ float f = clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0); float s = 1.0 - vUv.x; float sg = uTri > 0.5 ? 1.0 - abs(2.0 * s - 1.0) : s;" +
      " float lit = 1.0 - smoothstep(uFill - 0.006, uFill + 0.006, s); if (uFill <= 0.0005) lit = 0.0;" +
      " vec3 base = mix(uC0, uC1, sg); float tip = uHotEnd * exp(-pow((uFill - s) / 0.035, 2.0)) * lit;" +
      " if (uHalo > 0.0) { float a = pow(f, 2.2) * uHalo * lit * (1.0 + 1.5 * tip); gl_FragColor = vec4(base * a * uGain, a); return; }" +
      " vec3 litC = mix(base * 0.85, uHot, pow(f, 2.6) * 0.92) * uGain + uHot * tip * 0.8;" +
      " vec3 dimC = uDim * (0.55 + 0.6 * pow(1.0 - f, 1.5));" +
      " gl_FragColor = vec4(mix(dimC, litC, lit), 1.0); }";
    function neonMat(halo, c) {
      return new THREE.ShaderMaterial({
        uniforms: { uFill: { value: 0 }, uGain: { value: 1 }, uHalo: { value: halo }, uHotEnd: { value: 1 }, uTri: { value: c.tri ? 1 : 0 },
          uC0: { value: col(c.c0 || "#FF7BE3") }, uC1: { value: col(c.c1 || "#D21DFF") }, uHot: { value: col(c.hot || "#FFF1FB") }, uDim: { value: col(c.dim || "#3A1758") } },
        vertexShader: NEON_V, fragmentShader: NEON_F, transparent: halo > 0, depthWrite: halo === 0,
        blending: halo > 0 ? THREE.AdditiveBlending : THREE.NormalBlending, toneMapped: false
      });
    }
    function gauge(c) {
      const group = new THREE.Group();
      const r = c.r || 118, tb = c.tube || 9;
      const core = new THREE.Mesh(new THREE.TorusGeometry(r, tb, 18, 180, Math.PI), neonMat(0, c)); core.position.z = tb + 4; group.add(core);
      const capGeo = new THREE.SphereGeometry(tb, 20, 12);
      const capL = new THREE.Mesh(capGeo, neonMat(0, c)); capL.position.set(-r, 0, tb + 4); group.add(capL);
      const capR = new THREE.Mesh(capGeo, neonMat(0, c)); capR.position.set(r, 0, tb + 4); group.add(capR);
      const halo1 = new THREE.Mesh(new THREE.TorusGeometry(r, tb * 2.4, 18, 180, Math.PI), neonMat(0.55, c)); halo1.position.z = tb + 4; halo1.renderOrder = 5; group.add(halo1);
      const halo2 = new THREE.Mesh(new THREE.TorusGeometry(r, tb * 4.6, 18, 180, Math.PI), neonMat(0.22, c)); halo2.position.z = tb + 4; halo2.renderOrder = 5; group.add(halo2);
      const sleeveMat = new THREE.MeshPhysicalMaterial({ color: col("#F6E2FF"), roughness: 0.06, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03, transparent: true, opacity: 0.16, envMapIntensity: 1.8, depthWrite: false });
      const sleeve = new THREE.Mesh(new THREE.TorusGeometry(r, tb * 1.5, 24, 180, Math.PI), sleeveMat); sleeve.position.z = tb + 4; sleeve.renderOrder = 6; group.add(sleeve);
      const scapGeo = new THREE.SphereGeometry(tb * 1.5, 24, 14);
      [-r, r].forEach((x) => { const m = new THREE.Mesh(scapGeo, sleeveMat); m.position.set(x, 0, tb + 4); m.renderOrder = 6; group.add(m); });
      // ticks: every 10 %, majors at 0 / 50 / 100
      const tickMat = new THREE.MeshPhysicalMaterial({ color: col("#F3E6FF"), roughness: 0.3, clearcoat: 1, emissive: col("#7A3AA8"), emissiveIntensity: 0.4 });
      for (let i = 0; i <= 10; i++) {
        const major = i % 5 === 0, L = major ? 16 : 9, a = Math.PI - (i / 10) * Math.PI;
        const m = new THREE.Mesh(new THREE.BoxGeometry(L, major ? 4 : 3, 3), tickMat);
        const rr = r + tb * 1.5 + 10 + L / 2; m.position.set(rr * Math.cos(a), rr * Math.sin(a), 3); m.rotation.z = a; group.add(m);
      }
      // needle (+ contact shadow) and hub
      const NL = c.needle || (r - tb * 1.5 - 12);
      const ns = new THREE.Shape(); ns.moveTo(-18, -7); ns.lineTo(NL - 7, -2.6); ns.quadraticCurveTo(NL + 1, 0, NL - 7, 2.6); ns.lineTo(-18, 7); ns.quadraticCurveTo(-24, 0, -18, -7);
      const nGeo = new THREE.ExtrudeGeometry(ns, { depth: 3, bevelEnabled: true, bevelThickness: 1.6, bevelSize: 1.4, bevelOffset: -1.4, bevelSegments: 3, curveSegments: 8 });
      const needleMat = new THREE.MeshPhysicalMaterial({ color: col("#FFFFFF"), roughness: 0.22, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.0, emissive: col("#FFD6F4"), emissiveIntensity: 0.18 });
      const needle = new THREE.Mesh(nGeo, needleMat); needle.position.z = tb * 2 + 10; group.add(needle);
      const shMat = new THREE.MeshBasicMaterial({ color: 0x07020c, transparent: true, opacity: 0.42, depthWrite: false });
      const nsh = new THREE.Mesh(new THREE.ShapeGeometry(ns, 8), shMat); nsh.position.set(5, -8, 1.5); nsh.renderOrder = 2; group.add(nsh);
      const chrome = new THREE.MeshPhysicalMaterial({ color: col("#ECE6F4"), metalness: 1, roughness: 0.18, envMapIntensity: 1.35 });
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(17, 18, 8, 48), chrome); hub.rotation.x = Math.PI / 2; hub.position.z = tb * 2 + 6; group.add(hub);
      const domeMat = new THREE.MeshPhysicalMaterial({ color: col(c.dome || "#FF3FC4"), roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.0, emissive: col("#7A0A5C"), emissiveIntensity: 0.4 });
      const dome = new THREE.Mesh(new THREE.SphereGeometry(11, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), domeMat); dome.rotation.x = Math.PI / 2; dome.position.z = tb * 2 + 14; group.add(dome);
      const hsh = new THREE.Mesh(new THREE.CircleGeometry(20, 32), shMat); hsh.position.set(4, -7, 1.4); hsh.renderOrder = 2; group.add(hsh);
      scene.add(group);
      const neons = [core, capL, capR, halo1, halo2], C0 = col(c.c0 || "#FF7BE3"), C1 = col(c.c1 || "#D21DFF"), G0 = col("#FFF0B0"), G1 = col("#FFA91F"), t0 = new THREE.Color(), t1 = new THREE.Color();
      return {
        group, needle, dome, domeMat, needleMat,
        set(s) { // {v: 0..1 needle (may overshoot), fill: 0..1 lit arc, gain, gold: 0..1, reveal: 0..1 tube drawn}
          const a = Math.PI - Math.max(-0.08, Math.min(1.08, s.v)) * Math.PI;
          needle.rotation.z = a; nsh.rotation.z = a;
          t0.copy(C0).lerp(G0, s.gold || 0); t1.copy(C1).lerp(G1, s.gold || 0);
          neons.forEach((m) => { const u = m.material.uniforms; u.uFill.value = s.fill; u.uGain.value = s.gain || 1; u.uC0.value.copy(t0); u.uC1.value.copy(t1); u.uHotEnd.value = s.hotEnd == null ? 1 : s.hotEnd; });
          capL.material.uniforms.uFill.value = s.fill > 0.001 ? 1 : 0;
          capR.material.uniforms.uFill.value = s.fill >= 0.995 ? 1 : 0; capR.material.uniforms.uHotEnd.value = 0; capL.material.uniforms.uHotEnd.value = 0;
          capL.material.uniforms.uC1.value.copy(t0); capR.material.uniforms.uC0.value.copy(t1);
          domeMat.emissiveIntensity = 0.4 + 1.6 * (s.flash || 0);
        }
      };
    }

    // ---------- DOM pinning: CSS matrix3d for an element (cw x ch) centred at (lx, ly, lz) in obj's local frame ----------
    const Mc = new THREE.Matrix4().makeTranslation(W / 2, H / 2, 0).multiply(new THREE.Matrix4().makeScale(1, -1, 1));
    const Ml = new THREE.Matrix4(), Mt = new THREE.Matrix4(), Mf = new THREE.Matrix4().makeScale(1, -1, 1), Mo = new THREE.Matrix4();
    function css(obj, cw, ch, lx, ly, lz) {
      obj.updateMatrixWorld(true);
      Ml.makeTranslation((lx || 0) - cw / 2, (ly || 0) + ch / 2, lz || 0).multiply(Mf);
      Mo.copy(Mc).multiply(obj.matrixWorld).multiply(Ml);
      return "matrix3d(" + Mo.elements.map((v) => (Math.abs(v) < 1e-9 ? 0 : +v.toFixed(6))).join(",") + ")";
    }
    // canvas px -> world (z = 0 plane)
    const world = (px, py) => [px - W / 2, H / 2 - py];

    return { canvas, renderer, scene, camera, card, coin, gauge, css, world, dist: () => DIST, render: () => renderer.render(scene, camera) };
  };
})();
