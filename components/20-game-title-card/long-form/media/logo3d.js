/* Logo3D: the game-title "logo sticker" lock-up as real geometry (Three.js r160, global THREE).
   Stacked heavy caps traced from Archivo's own outlines (media/glyphs.js) and extruded with a rounded bevel:
   white enamel faces, a polished white lip on the bevel, glossy black lacquer walls (the logo's black edge, built in depth),
   and a candy-enamel accent bar with raised letters (the "ONLINE" / "FIVE" badge slot, our own). In post: one uniform ink
   outline around the whole silhouette and a soft contact shadow (the sticker vernacular), plus HDR bloom on the hot metal.
   Seek-safe: nothing animates on its own; renderAt(t) draws the frame for time t. Shared by a/ and b/ (identical file). */
(function () {
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const srgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.substr(i, 2), 16) / 255);
  const toLin = (x) => (x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
  const lin = (hex) => { const a = srgb(hex).map(toLin); return new THREE.Color(a[0], a[1], a[2]); };
  const v3 = (c) => "vec3(" + c.r.toFixed(4) + "," + c.g.toFixed(4) + "," + c.b.toFixed(4) + ")";
  const smooth01 = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

  // crease-angle normal smoothing for non-indexed ExtrudeGeometry: curved walls and bevels shade smooth, hard corners stay hard
  function smoothNormals(geo, creaseDeg) {
    const pos = geo.attributes.position, nor = geo.attributes.normal, n = pos.count, cosT = Math.cos(creaseDeg * Math.PI / 180);
    const key = (i) => Math.round(pos.getX(i) * 20) + "," + Math.round(pos.getY(i) * 20) + "," + Math.round(pos.getZ(i) * 20);
    const map = new Map();
    for (let i = 0; i < n; i++) { const k = key(i); let a = map.get(k); if (!a) map.set(k, (a = [])); a.push(i); }
    const out = new Float32Array(n * 3);
    for (const arr of map.values()) {
      for (const i of arr) {
        const ax = nor.getX(i), ay = nor.getY(i), az = nor.getZ(i); let sx = 0, sy = 0, sz = 0;
        for (const j of arr) { const bx = nor.getX(j), by = nor.getY(j), bz = nor.getZ(j); if (ax * bx + ay * by + az * bz >= cosT) { sx += bx; sy += by; sz += bz; } }
        const l = Math.hypot(sx, sy, sz) || 1; out[i * 3] = sx / l; out[i * 3 + 1] = sy / l; out[i * 3 + 2] = sz / l;
      }
    }
    geo.setAttribute("normal", new THREE.BufferAttribute(out, 3));
  }

  window.Logo3D = function (o) {
    const W = o.W, H = o.H, E = (n) => gsap.parseEase(n), C = o.colors;

    // ---------- renderer + camera (1 world unit = 1 px at z = 0; principal point on the lock-up) ----------
    const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
    canvas.style.cssText = "position:absolute;left:0;top:0;width:" + W + "px;height:" + H + "px;display:block";
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;
    const scene = new THREE.Scene();
    const FOV = 20, DIST = (H / 2) / Math.tan((FOV / 2) * Math.PI / 180);
    const camera = new THREE.PerspectiveCamera(FOV, W / H, 10, DIST * 3);
    camera.position.set(0, 0, DIST); camera.lookAt(0, 0, 0);

    // ---------- environment: a studio (big top softbox, a front strip, a hot rim bar, dark floor) for enamel + lacquer ----------
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(1.3,1.33,1.4), hor = vec3(0.07,0.07,0.08), low = vec3(0.012,0.012,0.014);" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.18, 0.85, y)) : mix(hor, low, smoothstep(0.0, 0.3, -y));" +
        " gl_FragColor = vec4(c, 1.0); }"
    })));
    const panel = (w, h, x, y, z, k, tint) => {
      const c = tint ? new THREE.Color(tint[0] * k, tint[1] * k, tint[2] * k) : new THREE.Color(k, k, k);
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide }));
      m.position.set(x, y, z); m.lookAt(0, 0, 0); envScene.add(m);
    };
    panel(46, 12, -6, 30, 22, 3.0);               // big top-front softbox: the enamel's even sheen
    panel(34, 2.4, 0, 7, 42, 4.2);                // a strip in front, slightly high: a crisp line along the top bevels
    panel(40, 5, 8, 24, -26, 4.0, [1.0, 0.92, 0.82]);   // a warm hot bar up and behind: the top lips read as lit metal
    panel(10, 30, -40, 4, 10, 1.7, (o.envWarm || [1.0, 0.62, 0.34]));   // a warm side card on the left: the walls' long streak picks up the footage's sun
    panel(10, 30, 40, 4, 6, 1.1, (o.envCool || [0.55, 0.72, 1.0]));    // a cool card on the right: sky bounce on the right-hand walls
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(envScene, 0.0, 0.1, 200).texture;

    // ---------- lights ----------
    const key = new THREE.DirectionalLight(0xfff4e8, 2.0); scene.add(key); scene.add(key.target);
    key.position.set(-6, 9, 8);
    const hemi = new THREE.HemisphereLight(0xf2f5ff, 0x1a1410, 0.75); scene.add(hemi);
    // the payoff light: a hot point light carried across just in front of the lock-up (real speculars on enamel, glints on every bevel)
    const sweepLight = new THREE.PointLight(0xfff3e2, 0, 0, 0); scene.add(sweepLight);

    // ---------- shared uniforms: the light sweep (payoff) and per-material geometry constants ----------
    const U = { uSweep: { value: -1e5 }, uSweepW: { value: 60 }, uSweepAmp: { value: 0 }, uSlant: { value: -0.5 }, uLock: { value: 0 } };

    let matUid = 0;
    // material factory: a shader patch colours face / lip / wall from local geometry coords and adds the sweep band
    function mat(kind, p) {
      const m = new THREE.MeshPhysicalMaterial(p.phys);
      const id = "lg-" + kind + "-" + (++matUid);
      m.customProgramCacheKey = () => id;     // every patch bakes its own colours: never share a compiled program between them
      const own = { uCap: { value: p.cap || 100 }, uDepth: { value: p.depth || 10 }, uBevel: { value: p.bevel || 2 }, uLen: { value: p.len || 100 } };
      m.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, U, own);
        sh.vertexShader = "varying vec3 vLP; varying vec3 vWP;\n" + sh.vertexShader.replace("#include <begin_vertex>",
          "#include <begin_vertex>\n vLP = position; vWP = (modelMatrix * vec4(position, 1.0)).xyz;");
        const head = "varying vec3 vLP; varying vec3 vWP; uniform float uSweep, uSweepW, uSweepAmp, uSlant, uLock, uCap, uDepth, uBevel, uLen;\n";
        let col = "", emi = "", rough = "", metal = "";
        const band = "  float sd = (vWP.x + vWP.y * uSlant - uSweep) / uSweepW; float sb = exp(-sd * sd);\n";
        if (kind === "face") {           // pearl-white cap: a 3-stop gradient (top white, mid pearl, cool foot) so light has room to land
          const cT = v3(lin(p.c[0])), cM = v3(lin(p.c[1])), cF = v3(lin(p.c[2] || p.c[1]));
          const grad = (y) => "(" + y + " > 0.5 ? mix(" + cM + ", " + cT + ", smoothstep(0.5, 0.96, " + y + ")) : mix(" + cF + ", " + cM + ", smoothstep(0.0, 0.5, " + y + ")))";
          col = "  float yy = clamp(vLP.y / uCap, 0.0, 1.0); diffuseColor.rgb = " + grad("yy") + ";\n";
          emi = "  float yy2 = clamp(vLP.y / uCap, 0.0, 1.0); totalEmissiveRadiance += " + grad("yy2") + " * " + (p.glow || 0.42).toFixed(3) + ";\n" +
            band + "  totalEmissiveRadiance += vec3(1.0, 0.97, 0.92) * sb * uSweepAmp * " + (p.faceSweep == null ? 0.38 : p.faceSweep).toFixed(3) + ";\n";
        } else if (kind === "wall") {    // bevel lip (polished, bright) blends into glossy lacquer walls
          col = "  float lipK = 1.0 - smoothstep(uBevel * 0.8, uBevel * 1.08, -vLP.z); float dz = clamp(-vLP.z / uDepth, 0.0, 1.0);\n" +
            "  vec3 wall = mix(" + v3(lin(p.wall[0])) + ", " + v3(lin(p.wall[1])) + ", smoothstep(0.1, 1.0, dz));\n" +
            "  diffuseColor.rgb = mix(wall, " + v3(lin(p.lip)) + ", lipK);\n";
          rough = "  roughnessFactor = mix(roughnessFactor, " + (p.lipRough == null ? 0.16 : p.lipRough).toFixed(3) + ", 1.0 - smoothstep(uBevel * 0.8, uBevel * 1.08, -vLP.z));\n";
          metal = "  metalnessFactor = mix(metalnessFactor, " + (p.lipMetal == null ? 0.35 : p.lipMetal).toFixed(3) + ", 1.0 - smoothstep(uBevel * 0.8, uBevel * 1.08, -vLP.z));\n";
          emi = "  float lk = 1.0 - smoothstep(uBevel * 0.8, uBevel * 1.08, -vLP.z);\n" +
            "  totalEmissiveRadiance += " + v3(lin(p.lip)) + " * lk * " + (p.lipGlow || 0.18).toFixed(3) + ";\n" + band +
            "  totalEmissiveRadiance += vec3(1.0, 0.95, 0.86) * sb * uSweepAmp * (" + (p.wallSweep == null ? 0.55 : p.wallSweep).toFixed(3) + " + " + (p.lipSweep == null ? 2.4 : p.lipSweep).toFixed(3) + " * lk);\n" +
            "  totalEmissiveRadiance += vec3(1.0, 0.88, 0.92) * lk * uLock * " + (p.lockGain || 0).toFixed(3) + ";\n";
        } else if (kind === "bar") {     // candy enamel slab: a 2-stop gradient along the bar, lighter top, darker foot
          // candy gloss split: the upper 45% is lifted (a glossy cap), the lower half sits darker, with a 2-3 px inner highlight line under the top lip
          col = "  float u = clamp(vLP.x / uLen, 0.0, 1.0); float yy = clamp(vLP.y / uCap + 0.5, 0.0, 1.0);\n" +
            "  vec3 g = mix(" + v3(lin(p.c[0])) + ", " + v3(lin(p.c[1])) + ", smoothstep(0.0, 1.0, u));\n" +
            "  float up = smoothstep(0.52, 0.57, yy);\n" +
            "  vec3 lo = g * mix(0.50, 0.78, smoothstep(0.0, 0.52, yy));\n" +
            "  vec3 hi = mix(g, vec3(1.0), 0.16) * mix(1.12, 0.98, smoothstep(0.57, 1.0, yy));\n" +
            "  diffuseColor.rgb = mix(lo, hi, up);\n";
          emi = "  float u2 = clamp(vLP.x / uLen, 0.0, 1.0); float yy2 = clamp(vLP.y / uCap + 0.5, 0.0, 1.0);\n" +
            "  vec3 g2 = mix(" + v3(lin(p.c[0])) + ", " + v3(lin(p.c[1])) + ", u2);\n" +
            "  totalEmissiveRadiance += g2 * mix(0.03, 0.20, smoothstep(0.52, 0.57, yy2));\n" +
            "  float hl = (yy2 - 0.875) / 0.022; totalEmissiveRadiance += vec3(1.0, 0.92, 0.95) * exp(-hl * hl) * 0.42;\n" + band +
            "  totalEmissiveRadiance += vec3(1.0, 0.9, 0.85) * sb * uSweepAmp * 0.30;\n";
        }
        sh.fragmentShader = head + sh.fragmentShader
          .replace("#include <color_fragment>", "#include <color_fragment>\n{\n" + col + "}")
          .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\n{\n" + rough + "}")
          .replace("#include <metalnessmap_fragment>", "#include <metalnessmap_fragment>\n{\n" + metal + "}")
          .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n{\n" + emi + "}");
      };
      return m;
    }

    // ---------- glyph shapes ----------
    const CURVE_SEG = 14, MIN_SEG = 0.5;
    function shapesFor(d, s, ox) {       // glyph path (font units, y-down) -> THREE.Shapes in px, y-up, baseline 0, x offset ox (font units)
      const sp = new THREE.ShapePath(), re = /([MLQCZ])([^MLQCZ]*)/g; let m;
      while ((m = re.exec(d))) {
        const n = m[2].trim() ? m[2].trim().split(/[\s,]+/).map(Number) : [], P = [];
        for (let i = 0; i < n.length; i += 2) P.push((n[i] - ox) * s, -n[i + 1] * s);
        if (m[1] === "M") sp.moveTo(P[0], P[1]); else if (m[1] === "L") sp.lineTo(P[0], P[1]);
        else if (m[1] === "Q") sp.quadraticCurveTo(P[0], P[1], P[2], P[3]); else if (m[1] === "C") sp.bezierCurveTo(P[0], P[1], P[2], P[3], P[4], P[5]);
      }
      const clean = (pts) => { const out = []; for (const p of pts) if (!out.length || p.distanceTo(out[out.length - 1]) > MIN_SEG) out.push(p);
        while (out.length > 3 && out[0].distanceTo(out[out.length - 1]) <= MIN_SEG) out.pop(); return out; };
      return sp.toShapes(false).map((sh) => {
        const s2 = new THREE.Shape(clean(sh.getPoints(CURVE_SEG)));
        sh.holes.forEach((h) => s2.holes.push(new THREE.Path(clean(h.getPoints(CURVE_SEG)))));
        return s2;
      });
    }
    function extrude(shapes, depth, bt, bs, segs) {
      const geo = new THREE.ExtrudeGeometry(shapes, { depth, bevelEnabled: true, bevelThickness: bt, bevelSize: bs, bevelOffset: -bs, bevelSegments: segs || 5, curveSegments: 1 });
      geo.translate(0, 0, -(depth + bt));
      smoothNormals(geo, 52);
      return geo;
    }
    // lay a line of text out: pens in font units with kerning + tracking; returns ink extents
    function layout(F, text, trackEm) {
      const tr = (trackEm || 0) * F.upm, pens = []; let pen = 0;
      for (let i = 0; i < text.length; i++) {
        const ch = F.g[text[i]] ? text[i] : " ", g = F.g[ch];
        pens.push({ ch, x: pen, g });
        pen += g[0] + (i < text.length - 1 ? (F.k[text[i] + text[i + 1]] || 0) + tr : 0);
      }
      const inks = pens.filter((p) => p.ch !== " ");
      return { pens, inkL: inks[0].x + inks[0].g[2], inkR: inks[inks.length - 1].x + inks[inks.length - 1].g[3] };
    }

    // ---------- build the lock-up ----------
    const G = o.glyphs, FT = G[o.titleSet || "title"], FG = G[o.tagSet || "tag"];
    const cap = o.cap, sT = cap / FT.cap;
    const DEP = cap * (o.depthK || 0.42), BT = cap * 0.045, BS = cap * 0.034;
    const faceMat = mat("face", { phys: { color: 0xffffff, roughness: 0.26, metalness: 0.0, clearcoat: 1.0, clearcoatRoughness: 0.05, envMapIntensity: o.faceEnv || 0.6 }, c: C.face, cap, glow: C.faceGlow, faceSweep: o.faceSweep });
    const wallMat = mat("wall", { phys: { color: 0xffffff, roughness: 0.3, metalness: 0.2, clearcoat: 1.0, clearcoatRoughness: 0.06, envMapIntensity: o.wallEnv || 0.55 },
      wall: C.wall, lip: C.lip, depth: DEP + 2 * BT, bevel: BT, lipRough: 0.14, lipMetal: 0.55, lipGlow: 0.22 });

    const root = new THREE.Group(); scene.add(root);           // whole lock-up (punch, shake, living turn)
    const lines = o.lines.map((t) => ({ text: t.toUpperCase(), L: layout(FT, t.toUpperCase(), o.tracking || 0) }));
    const widths = lines.map((l) => (l.L.inkR - l.L.inkL) * sT), maxW = Math.max.apply(null, widths);
    const gap = cap * (o.lead == null ? 0.16 : o.lead);
    const B = o.bar, barH = B ? B.h : 0, barGap = B ? B.gap : 0, barW = B ? (B.w || maxW) : 0;
    const totH = lines.length * cap + (lines.length - 1) * gap + (B ? barGap + barH : 0);
    const left = -maxW / 2, top = totH / 2;
    // placement: o.cx/o.cy = lock-up centre, or o.anchor "tl" with o.x/o.y = top-left of the ink box (scaled by o.scale)
    if (o.anchor === "tl") { o.cx = o.x + maxW * (o.scale || 1) / 2; o.cy = o.y + totH * (o.scale || 1) / 2; }
    camera.setViewOffset(W, H, W / 2 - o.cx, H / 2 - o.cy, W, H);
    const letters = [];
    lines.forEach((ln, li) => {
      const base = top - cap - li * (cap + gap), w = widths[li];
      const lx = o.align === "center" ? -w / 2 : o.align === "right" ? maxW / 2 - w : left;
      let k = 0;
      ln.L.pens.forEach((p) => {
        if (p.ch === " ") return;
        const mid = (p.g[2] + p.g[3]) / 2;
        const geo = extrude(shapesFor(p.g[1], sT, mid), DEP, BT, BS, 5);
        const mesh = new THREE.Mesh(geo, [faceMat, wallMat]);
        const g = new THREE.Group(); g.add(mesh);
        g.position.set(lx + (p.x + mid - ln.L.inkL) * sT, base, 0);
        root.add(g); letters.push({ g, line: li, i: k++, x: g.position.x });
      });
    });

    // accent bar + raised tag letters
    let bar = null, tagLetters = [];
    if (B) {
      const by = top - lines.length * cap - (lines.length - 1) * gap - barGap - barH / 2;
      const bx = o.barAlign === "right" ? maxW / 2 - barW : o.barAlign === "center" ? -barW / 2 : left;
      const r = Math.min(B.radius || barH * 0.16, barH / 2), sh = new THREE.Shape();
      const x0 = 0, x1 = barW, y0 = -barH / 2, y1 = barH / 2;
      sh.moveTo(x0 + r, y0); sh.lineTo(x1 - r, y0); sh.quadraticCurveTo(x1, y0, x1, y0 + r); sh.lineTo(x1, y1 - r); sh.quadraticCurveTo(x1, y1, x1 - r, y1);
      sh.lineTo(x0 + r, y1); sh.quadraticCurveTo(x0, y1, x0, y1 - r); sh.lineTo(x0, y0 + r); sh.quadraticCurveTo(x0, y0, x0 + r, y0);
      const bDep = barH * 0.42, bBT = barH * 0.09, bBS = barH * 0.07;
      const bgeo = new THREE.ExtrudeGeometry([sh], { depth: bDep, bevelEnabled: true, bevelThickness: bBT, bevelSize: bBS, bevelOffset: -bBS, bevelSegments: 6, curveSegments: 10 });
      bgeo.translate(0, 0, -(bDep + bBT)); smoothNormals(bgeo, 52);
      const barFace = mat("bar", { phys: { color: 0xffffff, roughness: 0.3, metalness: 0.0, clearcoat: 1.0, clearcoatRoughness: 0.05, envMapIntensity: 0.4 }, c: B.colors, cap: barH, len: barW });
      const barWall = mat("wall", { phys: { color: 0xffffff, roughness: 0.26, metalness: 0.2, clearcoat: 1.0, clearcoatRoughness: 0.06, envMapIntensity: 0.9 },
        wall: B.wall, lip: B.lip, depth: bDep + 2 * bBT, bevel: bBT, lipRough: 0.16, lipMetal: 0.3, lipGlow: 0.25, wallSweep: 0.1, lipSweep: 1.1, lockGain: 3.2 });
      const bmesh = new THREE.Mesh(bgeo, [barFace, barWall]);
      bar = new THREE.Group(); bar.add(bmesh); bar.position.set(bx, by, (B.z || 0)); root.add(bar);
      bar.userData = { bx, by, barW };
      // raised letters on the bar face
      const tl = layout(FG, B.text.toUpperCase(), B.tracking || 0.06), tcap = B.cap, sG = tcap / FG.cap;
      const tw = (tl.inkR - tl.inkL) * sG, tx = bx + (barW - tw) / 2, tyBase = by - tcap / 2;
      const TD = tcap * 0.22, TBT = tcap * 0.06, TBS = tcap * 0.045;
      const tFace = mat("face", { phys: { color: 0xffffff, roughness: 0.3, metalness: 0.0, clearcoat: 1.0, clearcoatRoughness: 0.06, envMapIntensity: 0.55 }, c: C.face, cap: tcap, glow: (C.tagGlow || 0.3), faceSweep: 0.1 });
      const tWall = mat("wall", { phys: { color: 0xffffff, roughness: 0.3, metalness: 0.1, clearcoat: 0.6, clearcoatRoughness: 0.1, envMapIntensity: 0.7 },
        wall: B.textWall, lip: C.lip, depth: TD + 2 * TBT, bevel: TBT, lipRough: 0.16, lipMetal: 0.4, lipGlow: 0.2, wallSweep: 0.15, lipSweep: 0.9 });
      let k = 0;
      tl.pens.forEach((p) => {
        if (p.ch === " ") return;
        const mid = (p.g[2] + p.g[3]) / 2;
        const geo = extrude(shapesFor(p.g[1], sG, mid), TD, TBT, TBS, 4);
        const g = new THREE.Group(); g.add(new THREE.Mesh(geo, [tFace, tWall]));
        g.position.set(tx + (p.x + mid - tl.inkL) * sG, tyBase, (B.z || 0) + TD + 2 * TBT);
        g.userData.z = g.position.z;
        root.add(g); tagLetters.push({ g, i: k++, x: g.position.x });
      });
    }
    root.rotation.order = "YXZ";

    // ---------- post: HDR bloom + the sticker vernacular (uniform ink outline, soft contact shadow) ----------
    const HF = renderer.capabilities.isWebGL2 && renderer.extensions.has("EXT_color_buffer_float");
    const TYPE = HF ? THREE.HalfFloatType : THREE.UnsignedByteType;
    const rtMain = new THREE.WebGLRenderTarget(W, H, { type: TYPE, samples: renderer.capabilities.isWebGL2 ? 4 : 0 });
    const RTO = { type: TYPE, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false };
    const LV = [2, 4, 8].map((d) => [new THREE.WebGLRenderTarget(W / d, H / d, RTO), new THREE.WebGLRenderTarget(W / d, H / d, RTO)]);
    const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), postScene = new THREE.Scene();
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2)); quad.frustumCulled = false; postScene.add(quad);
    const VS = "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }";
    const post = (u, fs) => new THREE.ShaderMaterial({ uniforms: u, vertexShader: VS, fragmentShader: fs, depthTest: false, depthWrite: false, blending: THREE.NoBlending, toneMapped: false });
    const brightMat = post({ tSrc: { value: null }, uTh: { value: 1.2 } },
      "uniform sampler2D tSrc; uniform float uTh; varying vec2 vUv; void main(){ vec4 c = texture2D(tSrc, vUv); vec3 u = c.a > 0.0 ? c.rgb / c.a : vec3(0.0);" +
      " float l = max(u.r, max(u.g, u.b)); gl_FragColor = vec4(c.rgb * smoothstep(uTh, uTh + 0.8, l), c.a); }");
    const blurMat = post({ tSrc: { value: null }, uDir: { value: new THREE.Vector2() } },
      "uniform sampler2D tSrc; uniform vec2 uDir; varying vec2 vUv; void main(){ vec4 c = texture2D(tSrc, vUv) * 0.2270270270;" +
      " c += (texture2D(tSrc, vUv + uDir * 1.3846153846) + texture2D(tSrc, vUv - uDir * 1.3846153846)) * 0.3162162162;" +
      " c += (texture2D(tSrc, vUv + uDir * 3.2307692308) + texture2D(tSrc, vUv - uDir * 3.2307692308)) * 0.0702702703; gl_FragColor = c; }");
    const NT = 32, taps = [];
    for (let i = 0; i < NT; i++) taps.push("vec2(" + Math.cos(i / NT * 6.2832).toFixed(4) + "," + Math.sin(i / NT * 6.2832).toFixed(4) + ")");
    const compMat = post({
      tMain: { value: null }, t1: { value: null }, t2: { value: null }, t3: { value: null },
      uPx: { value: new THREE.Vector2(1 / W, 1 / H) }, uInk: { value: o.inkPx || 5 }, uInkC: { value: lin(C.ink) },
      uBloom: { value: 0.2 }, uShadow: { value: o.shadow == null ? 0.55 : o.shadow }, uShOff: { value: new THREE.Vector2(o.shadowOff ? o.shadowOff[0] : 4, o.shadowOff ? o.shadowOff[1] : -10) },
      uFloat: { value: 0 }, uMB: { value: 0 }
    }, [
      "uniform sampler2D tMain, t1, t2, t3; uniform vec2 uPx, uShOff; uniform float uInk, uBloom, uShadow, uFloat, uMB; uniform vec3 uInkC; varying vec2 vUv;",
      "vec3 shoulder(vec3 x){ return mix(x, 0.84 + 0.16 * (1.0 - exp(-max(x - 0.84, 0.0) / 0.16)), step(0.84, x)); }",
      "vec3 toSRGB(vec3 c){ c = clamp(c, 0.0, 1.0); return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }",
      "const vec2 TAPS[" + NT + "] = vec2[](" + taps.join(",") + ");",
      "void main(){",
      "  vec4 m = texture2D(tMain, vUv);",
      "  if (uMB > 0.05) { vec4 acc = vec4(0.0); for (int k = -4; k <= 4; k++) acc += texture2D(tMain, vUv + vec2(0.0, float(k) / 4.0 * uMB) * uPx); m = acc / 9.0; }",
      "  float dil = m.a;",
      "  for (int i = 0; i < " + NT + "; i++) { dil = max(dil, texture2D(tMain, vUv + TAPS[i] * uPx * uInk).a); dil = max(dil, texture2D(tMain, vUv + TAPS[i] * uPx * uInk * 0.55).a); }",
      "  vec2 so = uShOff * uPx * (1.0 + 2.2 * uFloat);",
      "  float shT = texture2D(t1, vUv + so).a * 0.55 + texture2D(t2, vUv + so).a * 0.55;",
      "  float shS = texture2D(t3, vUv + so).a * 0.9;",
      "  float sh = mix(shT, shS, uFloat) * uShadow * mix(1.0, 0.45, uFloat);",
      "  vec3 wc = m.a > 0.0 ? toSRGB(shoulder(m.rgb / m.a)) : vec3(0.0);",
      "  vec3 inkS = toSRGB(uInkC);",
      "  float a = m.a; vec3 col = wc * a;",
      "  col += inkS * dil * (1.0 - a); a += dil * (1.0 - a);",
      "  a += clamp(sh, 0.0, 0.75) * (1.0 - a);",
      "  vec3 b = (texture2D(t1, vUv).rgb + texture2D(t2, vUv).rgb * 0.8 + texture2D(t3, vUv).rgb * 0.6) * uBloom;",
      "  vec3 bl = toSRGB(1.0 - exp(-b)) * 0.9;",
      "  col += bl; a = max(a, clamp(max(bl.r, max(bl.g, bl.b)), 0.0, 1.0));",
      "  gl_FragColor = vec4(col, a);",
      "}"].join("\n"));
    function pass(m, target) { quad.material = m; renderer.setRenderTarget(target); renderer.render(postScene, postCam); }

    // ---------- choreography ----------
    const T = o.timing;
    const eStretch = E("back.out(2.6)"), eWide = E("back.out(1.3)"), eSc = E("expo.out"), eBar = E("back.out(1.25)"), eTag = E("back.out(2.2)"), eIn = E("power3.in"), eSw = E("sine.inOut"), eSine = E("sine.inOut");
    const inkX0 = left - 40, inkX1 = left + maxW + 40;
    const HALF = Math.PI / 2;
    const uSlantNeg = () => -U.uSlant.value;

    function renderAt(t) {
      // title letters: spring up out of the baseline (stretch: height overshoots ~12% before width settles), tipping forward
      // from a slight lean-back; exit: squash back down into the baseline (wider, flatter) and cut on the zero frame
      letters.forEach((L, n) => {
        const t0 = T.lineIn[L.line] + L.i * T.stagger, p = clamp((t - t0) / T.upDur, 0, 1);
        const tx = T.exit + (o.exitOrder === "rtl" ? (letters.length - 1 - n) : n) * T.exitStagger, q = clamp((t - tx) / T.exitDur, 0, 1);
        const vis = t > t0 && q < 1;
        L.g.visible = vis; if (!vis) return;
        const fall = eIn(q);
        const sy = eStretch(p) * (1 - fall), sx = (0.35 + 0.65 * eWide(p)) * (1 + 0.16 * fall);
        L.g.scale.set(sx, Math.max(0.001, sy), sx);
        L.g.rotation.x = -0.5 * (1 - eSc(p));
        L.g.position.z = -90 * (1 - eSc(p));
      });
      // the bar shoots out of the left edge (scale from its left end), overshoots, settles; exit: retracts into its left end
      if (bar) {
        const p = clamp((t - T.barIn) / T.barDur, 0, 1), q = clamp((t - T.barOut) / T.barOutDur, 0, 1);
        bar.visible = t >= T.barIn && q < 1;
        const sx = Math.max(0.002, eBar(p) * (1 - eIn(q)));
        bar.scale.set(sx, 1, 1);
        tagLetters.forEach((L) => {
          const t0 = T.tagIn + L.i * T.tagStagger, pp = clamp((t - t0) / T.tagDur, 0, 1);
          const qq = clamp((t - (T.barOut - 0.12 + L.i * 0.008)) / 0.14, 0, 1);
          L.g.visible = t > t0 && qq < 1;
          const e = eTag(pp), sc = (0.55 + 0.45 * e) * (1 - 0.2 * eIn(qq));
          L.g.scale.set(sc, sc, sc);
          L.g.position.z = L.g.userData.z - (1 - e) * 30 - 34 * eIn(qq);   // pushes out of the bar face; exit: sinks back in
        });
      }
      // lock-in: the lock-up builds floating (z +floatZ, a soft far shadow), then slams down onto the plate on the cut:
      // accelerating fall (power3.in), contact squash (y 0.92 / x 1.05) that rings out as a damped spring, a small decaying shake,
      // the contact shadow snapping tight, and a 3-frame light hit on the bar lip.
      const FZ = T.floatZ == null ? 140 : T.floatZ, FD = T.fallDur || 0.14, pk = t - T.lock;
      const fallP = clamp((t - (T.lock - FD)) / FD, 0, 1);
      let z = FZ * (1 - eIn(fallP));
      if (pk > 0) z = -14 * Math.sin(Math.min(1, pk / 0.16) * Math.PI) * Math.exp(-pk * 6);
      const ring = pk > 0 ? Math.exp(-pk * 11) * Math.cos(pk * 30) : 0;
      const stretch = pk <= 0 ? 0.03 * eIn(fallP) : 0;
      const sAll = o.scale || 1;
      root.scale.set(sAll * (1 + (T.squashX || 0.05) * ring - stretch * 0.5), sAll * (1 - (T.squashY || 0.08) * ring + stretch), sAll);
      const sk = pk > 0 && pk < 0.28 ? Math.pow(1 - pk / 0.28, 2) : 0, f = Math.floor(t * 30);
      root.position.set((Look.hash(f * 3 + 11) * 2 - 1) * (T.shake || 4) * sk, (Look.hash(f * 3 + 12) * 2 - 1) * (T.shake || 4) * sk, z);
      compMat.uniforms.uFloat.value = clamp(z / FZ, 0, 1);
      U.uLock.value = pk >= 0 && pk < 3 / 30 ? 1 : pk >= 3 / 30 && pk < 0.3 ? Math.exp(-(pk - 3 / 30) / 0.07) : 0;
      // vertical motion blur on the rise of the letters (they all spring up inside ~0.3 s) and on the fall
      const riseA = T.lineIn[0], riseB = T.lineIn[T.lineIn.length - 1] + T.upDur * 0.55;
      const rb = t > riseA && t < riseB ? Math.sin(Math.PI * (t - riseA) / (riseB - riseA)) : 0;
      compMat.uniforms.uMB.value = (T.riseBlur || 7) * rb + 5 * Math.sin(Math.PI * fallP) * (pk < 0 ? 1 : 0);
      const hp = eSine(clamp((t - T.lineIn[0]) / Math.max(0.5, T.exit - T.lineIn[0]), 0, 1));
      root.rotation.y = o.turn[0] + (o.turn[1] - o.turn[0]) * hp;
      root.rotation.x = o.tilt;
      // payoff light: a soft slanted band rakes left -> right over every bevel; the key light rides with it; bloom peaks and holds 3 frames
      const sp = clamp((t - T.sweep) / T.sweepDur, 0, 1);
      U.uSweep.value = (inkX0 - 200) + (inkX1 - inkX0 + 400) * eSw(sp);
      U.uSweepW.value = cap * (o.sweepW || 0.42);
      U.uSweepAmp.value = sp > 0 && sp < 1 ? (o.sweepAmp || 1.0) * Math.pow(Math.sin(Math.PI * sp), 0.8) : 0;
      const ka = -1.0 + 2.0 * eSw(sp);
      key.position.set(ka * 9, 9, 8);
      key.intensity = 2.0 + 1.0 * (sp > 0 && sp < 1 ? Math.sin(Math.PI * sp) : 0) + 1.2 * U.uLock.value;
      sweepLight.position.set(U.uSweep.value + (o.sweepLift || 0.6) * cap * uSlantNeg(), cap * (o.sweepLift || 0.6), cap * (o.sweepZ || 1.6));
      sweepLight.intensity = sp > 0 && sp < 1 ? (o.sweepLight || 0) * Math.pow(Math.sin(Math.PI * sp), 0.7) : 0;
      const bt = t - T.bloomAt, env = bt < 0 ? 0 : bt < 0.1 ? smooth01(0, 0.03, bt) : Math.exp(-(bt - 0.1) / 0.3);
      compMat.uniforms.uBloom.value = (o.bloomBase == null ? 0.05 : o.bloomBase) + (o.bloomPeak || 0.75) * env;
      brightMat.uniforms.uTh.value = o.bloomTh || 2.0;

      renderer.setRenderTarget(rtMain); renderer.clear(); renderer.render(scene, camera);
      brightMat.uniforms.tSrc.value = rtMain.texture; pass(brightMat, LV[0][0]);
      let src = LV[0][0];
      LV.forEach(([A, Bt]) => {
        blurMat.uniforms.tSrc.value = src.texture; blurMat.uniforms.uDir.value.set(1 / A.width, 0); pass(blurMat, Bt);
        blurMat.uniforms.tSrc.value = Bt.texture; blurMat.uniforms.uDir.value.set(0, 1 / A.height); pass(blurMat, A);
        src = A;
      });
      compMat.uniforms.tMain.value = rtMain.texture; compMat.uniforms.t1.value = LV[0][0].texture;
      compMat.uniforms.t2.value = LV[1][0].texture; compMat.uniforms.t3.value = LV[2][0].texture;
      pass(compMat, null);
    }
    window.addEventListener("hf-seek", (e) => { if (e && e.detail && typeof e.detail.time === "number") renderAt(e.detail.time); });

    return { canvas, renderAt, width: maxW, height: totH, cap, barW, left: o.cx + left, top: o.cy - top };
  };
})();
