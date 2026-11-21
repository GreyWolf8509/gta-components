/* Script3D: the district name as real geometry (Three.js r160, global THREE), written on by a pen.
   The place name is built from single-line script centre strokes (media/script-glyphs.js, EMS Allure / EMS Brush, OFL)
   swept into a gold tube whose radius follows a brush-pen pressure model (heavy downstrokes, hairline upstrokes, tapered
   free ends) and whose cross-section is a flattened ellipse, so every stroke is a lit, rounded relief. A write-on
   parameter (arc length, with pen lifts between strokes) cuts the tube at the pen tip; the fresh ink is hot white-gold
   and cools into polished gold behind the tip. A swash flicks under the word at the end (the lock-in): a soft specular
   sweep rakes the letters, a key light crosses the relief and HDR bloom peaks for 3 frames. Soft drop shadow in post.
   Seek-safe: nothing animates on its own; renderAt(t) draws the frame for time t. Shared by a/ and b/ (identical file). */
(function () {
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const sstep = (a, b, x) => { if (b === a) return x < a ? 0 : 1; const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const srgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.substr(i, 2), 16) / 255);
  const toLin = (x) => (x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
  const lin = (hex) => { const a = srgb(hex).map(toLin); return new THREE.Color(a[0], a[1], a[2]); };
  const v3 = (c) => "vec3(" + c.r.toFixed(4) + "," + c.g.toFixed(4) + "," + c.b.toFixed(4) + ")";

  // ---------- glyph path (M / L / C, font units, y up) -> polylines ----------
  function parsePath(d) {
    const out = []; let cur = null, px = 0, py = 0; const re = /([MLC])([^MLC]*)/g; let m;
    while ((m = re.exec(d))) {
      const n = m[2].trim() ? m[2].trim().split(/[\s,]+/).map(Number) : [];
      if (m[1] === "M") { cur = [[n[0], n[1]]]; out.push(cur); for (let i = 2; i + 1 < n.length; i += 2) cur.push([n[i], n[i + 1]]); }
      else if (m[1] === "L") { for (let i = 0; i + 1 < n.length; i += 2) cur.push([n[i], n[i + 1]]); }
      else if (m[1] === "C") {
        for (let i = 0; i + 5 < n.length; i += 6) {
          const x0 = cur[cur.length - 1][0], y0 = cur[cur.length - 1][1];
          for (let k = 1; k <= 10; k++) { const t = k / 10, u = 1 - t;
            cur.push([u * u * u * x0 + 3 * u * u * t * n[i] + 3 * u * t * t * n[i + 2] + t * t * t * n[i + 4],
                      u * u * u * y0 + 3 * u * u * t * n[i + 1] + 3 * u * t * t * n[i + 3] + t * t * t * n[i + 5]]); }
        }
      }
    }
    return out.filter((p) => p.length > 1);
  }

  // centripetal Catmull-Rom through a polyline, resampled at ~ds; corners sharper than `corner` stay sharp
  function smoothStroke(P, ds, cornerCos) {
    const pts = []; for (const p of P) if (!pts.length || Math.hypot(p[0] - pts[pts.length - 1][0], p[1] - pts[pts.length - 1][1]) > 0.25) pts.push(p);
    if (pts.length < 2) return null;
    const pieces = [[pts[0]]], corners = [];
    for (let i = 1; i < pts.length; i++) {
      pieces[pieces.length - 1].push(pts[i]);
      if (i < pts.length - 1) {
        const ax = pts[i][0] - pts[i - 1][0], ay = pts[i][1] - pts[i - 1][1], bx = pts[i + 1][0] - pts[i][0], by = pts[i + 1][1] - pts[i][1];
        const c = (ax * bx + ay * by) / (Math.hypot(ax, ay) * Math.hypot(bx, by) + 1e-9);
        if (c < cornerCos) { pieces.push([pts[i]]); corners.push(pts[i]); }
      }
    }
    const out = [];
    pieces.forEach((Q, pi) => {
      const n = Q.length;
      const get = (i) => i < 0 ? [2 * Q[0][0] - Q[1][0], 2 * Q[0][1] - Q[1][1]] : i >= n ? [2 * Q[n - 1][0] - Q[n - 2][0], 2 * Q[n - 1][1] - Q[n - 2][1]] : Q[i];
      for (let i = 0; i < n - 1; i++) {
        const p0 = get(i - 1), p1 = Q[i], p2 = Q[i + 1], p3 = get(i + 2);
        const d01 = Math.pow(Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), 0.5) || 1e-4, d12 = Math.pow(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]), 0.5) || 1e-4,
              d23 = Math.pow(Math.hypot(p3[0] - p2[0], p3[1] - p2[1]), 0.5) || 1e-4;
        const t0 = 0, t1 = d01, t2 = t1 + d12, t3 = t2 + d23;
        const seg = Math.max(1, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / ds));
        for (let k = (out.length && k0(out, p1)) ? 1 : 0; k <= seg; k++) {
          const t = t1 + (t2 - t1) * (k / seg);
          const A1 = lerp2(p0, p1, (t - t0) / (t1 - t0)), A2 = lerp2(p1, p2, (t - t1) / (t2 - t1)), A3 = lerp2(p2, p3, (t - t2) / (t3 - t2));
          const B1 = lerp2(A1, A2, (t - t0) / (t2 - t0)), B2 = lerp2(A2, A3, (t - t1) / (t3 - t1));
          out.push(lerp2(B1, B2, (t - t1) / (t2 - t1)));
        }
      }
    });
    return { pts: out, corners };
  }
  const lerp2 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const k0 = (out, p) => Math.hypot(out[out.length - 1][0] - p[0], out[out.length - 1][1] - p[1]) < 1e-3;

  window.Script3D = function (o) {
    const W = o.W, H = o.H, F = o.glyphs[o.font || "allure"], UPM = o.glyphs.upm, E = (n) => gsap.parseEase(n);

    // ---------- layout: each line in screen px (y down) ----------
    const rawStrokes = [];          // { pts:[[x,y]...] (screen px), em, line }
    let bx0 = 1e9, bx1 = -1e9, by0 = 1e9, by1 = -1e9;
    const lineInfo = [];
    o.lines.forEach((L, li) => {
      const s = L.size / UPM, track = (L.tracking || 0) * UPM; let pen = 0; const gl = [];
      let iL = 1e9, iR = -1e9;
      for (const ch of L.text) {
        const g = F[ch] || F[" "]; const polys = parsePath(g[1]);
        polys.forEach((p) => p.forEach((q) => { iL = Math.min(iL, pen + q[0]); iR = Math.max(iR, pen + q[0]); }));
        gl.push({ pen, polys }); pen += (ch === " " ? g[0] * (o.spaceScale || 0.72) : g[0]) + track;
      }
      const ax = L.align === "left" ? L.x - iL * s : L.align === "center" ? L.x - (iL + iR) / 2 * s : L.x - iR * s;
      gl.forEach((G) => G.polys.forEach((p) => {
        const pts = p.map((q) => [ax + (G.pen + q[0]) * s, L.baseline - q[1] * s]);
        pts.forEach((q) => { bx0 = Math.min(bx0, q[0]); bx1 = Math.max(bx1, q[0]); by0 = Math.min(by0, q[1]); by1 = Math.max(by1, q[1]); });
        rawStrokes.push({ pts, em: L.size, line: li });
      }));
      lineInfo.push({ inkL: ax + iL * s, inkR: ax + iR * s, baseline: L.baseline, size: L.size });
    });
    const cx = o.pivot ? o.pivot[0] : (bx0 + bx1) / 2, cy = o.pivot ? o.pivot[1] : (by0 + by1) / 2;
    const toW = (q) => [q[0] - cx, cy - q[1]];        // world: origin at the pivot, y up, 1 unit = 1 px at z = 0

    // ---------- strokes: merge joined pen paths, smooth, resample, pressure widths ----------
    const DS = o.ds || 1.4, ZR = o.zr == null ? 0.52 : o.zr;
    const strokes = [];
    let lastEnd = null;
    rawStrokes.forEach((r) => {
      const pts = r.pts.map(toW);
      const tol = (o.mergeTol || 0.035) * r.em;
      if (lastEnd && strokes.length && strokes[strokes.length - 1].line === r.line && Math.hypot(pts[0][0] - lastEnd[0], pts[0][1] - lastEnd[1]) < tol) {
        strokes[strokes.length - 1].raw.push(...pts.slice(1));
      } else strokes.push({ raw: pts.slice(), em: r.em, line: r.line });
      lastEnd = pts[pts.length - 1];
    });
    const SW = o.swash;
    if (SW && SW.line != null) {   // relative form: fractions of a line's ink width, dy px under its baseline
      const Li = lineInfo[SW.line], w = Li.inkR - Li.inkL;
      SW.from = [Li.inkL + w * SW.f0, Li.baseline + SW.dy + (SW.tilt || 0)]; SW.to = [Li.inkL + w * SW.f1, Li.baseline + SW.dy - (SW.tilt || 0)];
      SW.em = SW.em || Li.size;
    }
    if (SW) {   // the underline swash: a gentle arc in screen px, tapered both ends, drawn after the letters
      const P = []; const a = SW.from, b = SW.to, mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - (SW.bend || 0);
      for (let k = 0; k <= 40; k++) { const t = k / 40, u = 1 - t; P.push(toW([u * u * a[0] + 2 * u * t * mx + t * t * b[0], u * u * a[1] + 2 * u * t * my + t * t * b[1]])); }
      strokes.push({ raw: P, em: SW.em, line: -1, swash: true });
    }
    const PEN_LIFT = o.penLift == null ? 0.1 : o.penLift;
    let S = 0, sLetters = 0, sSwash0 = 0;
    const cornerCos = Math.cos((o.cornerDeg || 72) * Math.PI / 180);
    strokes.forEach((st, si) => {
      const sm = smoothStroke(st.raw, DS, cornerCos); st.pts = sm ? sm.pts : st.raw; st.corners = sm ? sm.corners : [];
      const n = st.pts.length, P = st.pts;
      // arc length + tangents
      st.s = new Float32Array(n); st.t = []; let acc = 0;
      for (let i = 0; i < n; i++) {
        if (i > 0) acc += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]);
        st.s[i] = acc;
        const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)]; const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
        st.t.push([(b[0] - a[0]) / L, (b[1] - a[1]) / L]);
      }
      st.len = acc;
      // pressure: heavy going down, hairline going up / sideways; smoothed along the stroke; free ends taper
      const thick = (st.swash ? (o.swashThick || 0.05) : (o.thick || 0.09)) * st.em / 2, thin = (st.swash ? 0.012 : (o.thin || 0.03)) * st.em / 2;
      const raw = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        if (st.swash) { const u = i / Math.max(1, n - 1); raw[i] = thick * (0.12 + 0.88 * sstep(0, 0.14, u) * (1 - 0.86 * sstep(0.22, 1.0, u))); }   // pen flick: fast attack, long release
        else raw[i] = thin + (thick - thin) * sstep(-0.25, 0.85, -st.t[i][1]);
      }
      const sig = (st.swash ? 0.0 : (o.widthSmooth || 0.035)) * st.em / DS;
      st.r = new Float32Array(n);
      if (sig > 0.5) {
        const R = Math.ceil(sig * 2.5);
        for (let i = 0; i < n; i++) { let w = 0, v = 0; for (let k = -R; k <= R; k++) { const j = clamp(i + k, 0, n - 1), g = Math.exp(-(k * k) / (2 * sig * sig)); w += g; v += raw[j] * g; } st.r[i] = v / w; }
      } else st.r.set(raw);
      const tl = (st.swash ? 0.0 : (o.taper || 0.08)) * st.em, tMin = st.swash ? 1 : 0.32;
      if (!st.swash && tl > 0) for (let i = 0; i < n; i++) {
        const dA = st.s[i], dB = acc - st.s[i];
        st.r[i] *= (tMin + (1 - tMin) * sstep(0, tl, dA)) * (tMin + (1 - tMin) * sstep(0, tl, dB));
      }
      // write parameter: arc length + a pen lift before every stroke
      if (st.swash) { sLetters = S; S += (o.swashGap || 0) ; sSwash0 = S; }
      else if (si > 0) S += PEN_LIFT * st.em;
      st.S0 = S; S += acc; st.S1 = S;
    });
    const sTotal = S; if (!SW) { sLetters = sTotal; sSwash0 = sTotal; }

    // ---------- renderer ----------
    const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
    canvas.style.cssText = "position:absolute;left:0;top:0;width:" + W + "px;height:" + H + "px;display:block";
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;
    const scene = new THREE.Scene();
    const FOV = 16, DIST = (H / 2) / Math.tan((FOV / 2) * Math.PI / 180);
    const camera = new THREE.PerspectiveCamera(FOV, W / H, 10, DIST * 3);
    camera.position.set(0, 0, DIST); camera.lookAt(0, 0, 0);
    camera.setViewOffset(W, H, W / 2 - cx, H / 2 - cy, W, H);

    // ---------- environment: warm studio for the gold to reflect ----------
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(1.9,1.78,1.55), hor = vec3(0.55,0.45,0.34), low = vec3(0.05,0.035,0.025);" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.0, 0.75, y)) : mix(hor, low, smoothstep(0.0, 0.45, -y));" +
        " c *= 0.7 + 0.4 * smoothstep(-0.3, 1.0, vP.z); gl_FragColor = vec4(c, 1.0); }"
    })));
    const panel = (w, h, x, y, z, k) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k * 0.97, k * 0.9), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); envScene.add(m); };
    panel(46, 12, 0, 30, 22, 2.8);      // big softbox above and in front: the crown of every stroke
    panel(36, 2.4, 0, 12, 40, 3.4);     // a strip in front, a little high: a crisp highlight line along the tops
    panel(40, 5, -10, -6, 34, 0.9);     // a low warm bounce in front: the undersides keep some colour
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(envScene, 0.0, 0.1, 200).texture;

    const key = new THREE.DirectionalLight(0xfff3dc, 2.4); scene.add(key); scene.add(key.target);
    const hemi = new THREE.HemisphereLight(0xfff4e0, 0x1a1006, 0.7); scene.add(hemi);

    // ---------- material: gold with the write-on cut, fresh-ink heat and a soft specular sweep ----------
    const C = o.colors;
    const U = {
      uCut: { value: -1 }, uHot: { value: -1 }, uHeatLen: { value: 0.6 * o.lines[0].size }, uHeatAmp: { value: 2.2 },
      uSpecX: { value: -1e5 }, uSpecW: { value: 0.55 * o.lines[0].size }, uSpecAmp: { value: 0 }, uGlow: { value: C.glow == null ? 0.26 : C.glow }
    };
    const gold = lin(C.gold), deep = lin(C.goldDeep), hot = lin(C.hot);
    function patch(mat, isTip) {
      mat.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, U);
        sh.vertexShader = "attribute float aS; varying float vS; varying vec3 vLP; uniform float uHot;\n" +
          sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vS = " + (isTip ? "uHot" : "aS") + "; vLP = position;");
        sh.fragmentShader = "varying float vS; varying vec3 vLP; uniform float uCut, uHot, uHeatLen, uHeatAmp, uSpecX, uSpecW, uSpecAmp, uGlow;\n" + sh.fragmentShader
          .replace("#include <clipping_planes_fragment>", "#include <clipping_planes_fragment>\n" + (isTip ? "" : " if (vS > uCut) discard;"))
          .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n {\n" +
            "  float up = clamp(normal.y * 0.5 + 0.5, 0.0, 1.0);\n" +
            "  vec3 g = mix(" + v3(deep) + ", " + v3(gold) + ", smoothstep(0.15, 0.95, up));\n" +
            "  totalEmissiveRadiance += g * uGlow * (0.45 + 0.75 * up);\n" +
            "  float age = max(uHot - vS, 0.0) / uHeatLen;\n" +
            "  float heat = exp(-age * 1.6) * uHeatAmp;\n" +
            "  totalEmissiveRadiance += " + v3(hot) + " * heat;\n" +
            "  float sd = (vLP.x + vLP.y * 0.5 - uSpecX) / uSpecW; totalEmissiveRadiance += vec3(1.0, 0.82, 0.5) * exp(-sd * sd) * uSpecAmp * (0.35 + 0.65 * up);\n }");
      };
      return mat;
    }
    const matProps = { color: gold, metalness: 1.0, roughness: C.roughness == null ? 0.26 : C.roughness, clearcoat: 0.7, clearcoatRoughness: 0.12, envMapIntensity: 1.15 };
    const goldMat = patch(new THREE.MeshPhysicalMaterial(matProps), false);
    const tipMat = patch(new THREE.MeshPhysicalMaterial(matProps), true);

    // ---------- geometry: elliptic tubes along the strokes, ellipsoid caps at ends and corners ----------
    const NSEG = o.nseg || 14;
    const pos = [], nor = [], sAt = [], idx = [];
    const unit = new THREE.SphereGeometry(1, NSEG, 10);
    const uP = unit.attributes.position.array, uN = unit.attributes.normal.array, uI = unit.index.array;
    function ellipsoid(x, y, r, sv) {
      const base = pos.length / 3;
      for (let i = 0; i < uP.length; i += 3) {
        pos.push(x + uP[i] * r, y + uP[i + 1] * r, uP[i + 2] * r * ZR);
        const nx = uN[i], ny = uN[i + 1], nz = uN[i + 2] / ZR, L = Math.hypot(nx, ny, nz); nor.push(nx / L, ny / L, nz / L); sAt.push(sv);
      }
      for (let i = 0; i < uI.length; i++) idx.push(base + uI[i]);
    }
    strokes.forEach((st) => {
      const P = st.pts, n = P.length, base = pos.length / 3;
      for (let i = 0; i < n; i++) {
        const t = st.t[i], nx = -t[1], ny = t[0], r = st.r[i];
        for (let j = 0; j < NSEG; j++) {
          const ph = (j / NSEG) * Math.PI * 2, c = Math.cos(ph), s = Math.sin(ph);
          pos.push(P[i][0] + nx * r * c, P[i][1] + ny * r * c, r * ZR * s);
          const ex = nx * c, ey = ny * c, ez = s / ZR, L = Math.hypot(ex, ey, ez); nor.push(ex / L, ey / L, ez / L);
          sAt.push(st.S0 + st.s[i]);
        }
      }
      for (let i = 0; i < n - 1; i++) for (let j = 0; j < NSEG; j++) {
        const a = base + i * NSEG + j, b = base + i * NSEG + (j + 1) % NSEG, c = base + (i + 1) * NSEG + j, d = base + (i + 1) * NSEG + (j + 1) % NSEG;
        idx.push(a, b, c, b, d, c);
      }
      ellipsoid(P[0][0], P[0][1], st.r[0], st.S0);
      ellipsoid(P[n - 1][0], P[n - 1][1], st.r[n - 1], st.S1);
      // corners: a joint so the tube never pinches where the pen turns back
      st.corners.forEach((cp) => {
        let bi = 0, bd = 1e9; for (let i = 0; i < n; i++) { const dd = Math.hypot(P[i][0] - cp[0], P[i][1] - cp[1]); if (dd < bd) { bd = dd; bi = i; } }
        ellipsoid(P[bi][0], P[bi][1], st.r[bi] * 1.02, st.S0 + st.s[bi]);
      });
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    geo.setAttribute("aS", new THREE.Float32BufferAttribute(sAt, 1));
    geo.setIndex(idx);
    const word = new THREE.Group(); scene.add(word);
    const mesh = new THREE.Mesh(geo, goldMat); mesh.frustumCulled = false; word.add(mesh);
    const tipGeo = new THREE.SphereGeometry(1, NSEG, 10); tipGeo.setAttribute("aS", new THREE.Float32BufferAttribute(new Float32Array(tipGeo.attributes.position.count), 1));
    const tip = new THREE.Mesh(tipGeo, tipMat); tip.frustumCulled = false; word.add(tip);

    function sample(Sv) {   // pen position and radius at write parameter Sv (null during a pen lift)
      for (const st of strokes) {
        if (Sv < st.S0 || Sv > st.S1) continue;
        const l = Sv - st.S0; let lo = 0, hi = st.s.length - 1;
        while (hi - lo > 1) { const m = (lo + hi) >> 1; if (st.s[m] <= l) lo = m; else hi = m; }
        const f = (l - st.s[lo]) / Math.max(1e-6, st.s[hi] - st.s[lo]);
        return { x: st.pts[lo][0] + (st.pts[hi][0] - st.pts[lo][0]) * f, y: st.pts[lo][1] + (st.pts[hi][1] - st.pts[lo][1]) * f, r: st.r[lo] + (st.r[hi] - st.r[lo]) * f };
      }
      return null;
    }

    // ---------- post: HDR bloom + soft drop shadow, composited premultiplied ----------
    const HF = renderer.capabilities.isWebGL2 && renderer.extensions.has("EXT_color_buffer_float");
    const TYPE = HF ? THREE.HalfFloatType : THREE.UnsignedByteType;
    const rtMain = new THREE.WebGLRenderTarget(W, H, { type: TYPE, samples: renderer.capabilities.isWebGL2 ? 4 : 0 });
    const RTO = { type: TYPE, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false };
    const LV = [2, 4, 8].map((d) => [new THREE.WebGLRenderTarget(W / d, H / d, RTO), new THREE.WebGLRenderTarget(W / d, H / d, RTO)]);
    const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), postScene = new THREE.Scene();
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2)); quad.frustumCulled = false; postScene.add(quad);
    const VS = "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }";
    const post = (u, fs) => new THREE.ShaderMaterial({ uniforms: u, vertexShader: VS, fragmentShader: fs, depthTest: false, depthWrite: false, blending: THREE.NoBlending, toneMapped: false });
    const brightMat = post({ tSrc: { value: null }, uTh: { value: 1.0 } },
      "uniform sampler2D tSrc; uniform float uTh; varying vec2 vUv; void main(){ vec4 c = texture2D(tSrc, vUv); vec3 u = c.a > 0.0 ? c.rgb / c.a : vec3(0.0);" +
      " float l = max(u.r, max(u.g, u.b)); gl_FragColor = vec4(c.rgb * smoothstep(uTh, uTh + 0.8, l), c.a); }");
    const blurMat = post({ tSrc: { value: null }, uDir: { value: new THREE.Vector2() } },
      "uniform sampler2D tSrc; uniform vec2 uDir; varying vec2 vUv; void main(){ vec4 c = texture2D(tSrc, vUv) * 0.2270270270;" +
      " c += (texture2D(tSrc, vUv + uDir * 1.3846153846) + texture2D(tSrc, vUv - uDir * 1.3846153846)) * 0.3162162162;" +
      " c += (texture2D(tSrc, vUv + uDir * 3.2307692308) + texture2D(tSrc, vUv - uDir * 3.2307692308)) * 0.0702702703; gl_FragColor = c; }");
    const compMat = post({
      tMain: { value: null }, t1: { value: null }, t2: { value: null }, t3: { value: null },
      uPx: { value: new THREE.Vector2(1 / W, 1 / H) }, uBloom: { value: 0.2 }, uShadow: { value: o.shadow == null ? 0.6 : o.shadow },
      uShOff: { value: new THREE.Vector2(o.shadowOff ? o.shadowOff[0] : 4, o.shadowOff ? o.shadowOff[1] : -7) }, uShC: { value: lin(C.shadow || "#120a02") },
      uFade: { value: 1 }, uInk: { value: o.ink || 0 }, uInkC: { value: lin(C.ink || "#3A2206") }, uInkA: { value: o.inkAlpha == null ? 0.9 : o.inkAlpha }, uHalo: { value: o.halo || 0 }
    }, [
      "uniform sampler2D tMain, t1, t2, t3; uniform vec2 uPx, uShOff; uniform float uBloom, uShadow, uFade, uInk, uInkA, uHalo; uniform vec3 uShC, uInkC; varying vec2 vUv;",
      "const vec2 TAPS[16] = vec2[](" + Array.from({ length: 16 }, (_, i) => "vec2(" + Math.cos(i / 16 * 6.2832).toFixed(4) + "," + Math.sin(i / 16 * 6.2832).toFixed(4) + ")").join(",") + ");",
      "vec3 shoulder(vec3 x){ return mix(x, 0.82 + 0.18 * (1.0 - exp(-max(x - 0.82, 0.0) / 0.18)), step(0.82, x)); }",
      "vec3 toSRGB(vec3 c){ c = clamp(c, 0.0, 1.0); return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }",
      "void main(){",
      "  vec4 m = texture2D(tMain, vUv);",
      "  float sh = (texture2D(t1, vUv - uShOff * uPx).a * 0.45 + texture2D(t2, vUv - uShOff * uPx * 1.5).a * 0.55 + texture2D(t3, vUv - uShOff * uPx * 2.4).a * 0.45) * uShadow;",
      "  sh += (texture2D(t3, vUv).a * 0.8 + texture2D(t2, vUv).a * 0.4) * uHalo;   // a soft dark halo: separation on bright footage",
      "  vec3 wc = m.a > 0.0 ? toSRGB(shoulder(m.rgb / m.a)) : vec3(0.0);",
      "  float a = m.a; vec3 col = wc * a;",
      "  if (uInk > 0.0) { float dil = 0.0; for (int i = 0; i < 16; i++) { dil = max(dil, texture2D(tMain, vUv + TAPS[i] * uPx * uInk).a); dil = max(dil, texture2D(tMain, vUv + TAPS[i] * uPx * uInk * 0.5).a); }",
      "    float k = dil * uInkA * (1.0 - a); col += toSRGB(uInkC) * k; a += k; }",
      "  float s = clamp(sh, 0.0, 0.85) * (1.0 - a); col += toSRGB(uShC) * s; a += s;",
      "  vec3 b = (texture2D(t1, vUv).rgb + texture2D(t2, vUv).rgb * 0.8 + texture2D(t3, vUv).rgb * 0.6) * uBloom;",
      "  col += toSRGB(1.0 - exp(-b)) * 0.9;",
      "  gl_FragColor = vec4(col, a) * uFade;",
      "}"].join("\n"));
    function pass(mat, target) { quad.material = mat; renderer.setRenderTarget(target); renderer.render(postScene, postCam); }

    // ---------- timing ----------
    const T = o.timing;   // { write, writeDur, swash, swashDur, out, outDur, end }
    const eWrite = (p) => 0.55 * p + 0.45 * E("sine.inOut")(p), eSw = E("power3.out"), eOut = E("power2.in");
    const inkX0 = bx0 - cx, inkX1 = bx1 - cx;
    const lockAt = SW ? T.swash + T.swashDur : T.write + T.writeDur;
    function params(t) {
      let cut, hot, heatAmp = U.uHeatAmp.value;
      if (t < T.write) { cut = -1; hot = -1; }
      else if (t < T.write + T.writeDur) { cut = hot = sLetters * eWrite((t - T.write) / T.writeDur); }
      else if (SW && t < T.swash) { cut = sLetters; hot = sLetters + (t - T.write - T.writeDur) * (o.coolSpeed || 3000); }
      else if (SW && t < lockAt) { cut = hot = sSwash0 + (sTotal - sSwash0) * eSw((t - T.swash) / T.swashDur); }
      else if (t < T.out) { cut = sTotal + 1; hot = sTotal + (t - lockAt) * (o.coolSpeed || 3000); }
      else { const p = clamp((t - T.out) / T.outDur, 0, 1); cut = hot = sTotal * (1 - eOut(p)) - (p >= 1 ? 10 : 0); }
      return { cut, hot };
    }

    function renderAt(t) {
      const P = params(t);
      U.uCut.value = P.cut; U.uHot.value = P.hot;
      U.uHeatAmp.value = (o.heat || 2.2) * (t >= T.out ? sstep(T.out, T.out + 0.08, t) : 1);
      // the pen tip: an ellipsoid riding the cut while the pen is down
      const sp = (t >= T.write && t < T.out + T.outDur) ? sample(P.cut) : null;
      const writing = (t >= T.write && t < T.write + T.writeDur) || (SW && t >= T.swash && t < lockAt) || (t >= T.out && t < T.out + T.outDur);
      tip.visible = !!(sp && writing && sp.r > 0.2);
      if (tip.visible) { tip.position.set(sp.x, sp.y, 0); tip.scale.set(sp.r, sp.r, sp.r * ZR); }
      // payoff: soft specular sweep across the letters + key light rake + bloom peak held 3 frames
      const sw = clamp((t - lockAt + 0.08) / 0.62, 0, 1);
      U.uSpecX.value = (inkX0 - 1.2 * o.lines[0].size) + (inkX1 - inkX0 + 2.4 * o.lines[0].size) * E("power2.inOut")(sw);
      U.uSpecAmp.value = sw > 0 && sw < 1 ? (o.specAmp || 0.6) * Math.sin(Math.PI * sw) : 0;
      const rk = E("power2.inOut")(clamp((t - lockAt + 0.15) / 0.8, 0, 1));
      const ka = -1.0 + 1.9 * rk;
      key.position.set(Math.sin(ka) * 10, 9, 7);
      const bt = t - lockAt, pk = bt < 0 ? 0 : bt < 0.1 ? 1 : Math.exp(-(bt - 0.1) / 0.28);
      key.intensity = 2.4 + 2.6 * pk;
      compMat.uniforms.uBloom.value = (o.bloomBase || 0.1) + (o.bloomPeak || 0.5) * pk;
      brightMat.uniforms.uTh.value = 1.25 - 0.3 * pk;
      // body: settles in while writing, a small punch on the lock-in, a slow living turn through the hold
      const wp = clamp((t - T.write) / (lockAt - T.write), 0, 1), hold = clamp((t - lockAt) / Math.max(0.5, T.out - lockAt), 0, 1);
      const ry = -0.16 * (1 - E("power3.out")(wp)) + 0.05 * E("sine.inOut")(hold) - 0.025;
      const rx = 0.10 * (1 - E("power3.out")(wp));
      word.rotation.set(rx, ry, 0);
      const punch = bt < 0 ? 0 : Math.exp(-bt / 0.16) * Math.sin(bt / 0.16 * Math.PI * 0.9);
      const sc = 1 + 0.028 * punch;
      word.scale.set(sc, sc, sc);

      renderer.setRenderTarget(rtMain); renderer.clear(); renderer.render(scene, camera);
      brightMat.uniforms.tSrc.value = rtMain.texture; pass(brightMat, LV[0][0]);
      let src = LV[0][0];
      LV.forEach(([A, B]) => {
        blurMat.uniforms.tSrc.value = src.texture; blurMat.uniforms.uDir.value.set(1 / A.width, 0); pass(blurMat, B);
        blurMat.uniforms.tSrc.value = B.texture; blurMat.uniforms.uDir.value.set(0, 1 / A.height); pass(blurMat, A);
        src = A;
      });
      compMat.uniforms.tMain.value = rtMain.texture; compMat.uniforms.t1.value = LV[0][0].texture;
      compMat.uniforms.t2.value = LV[1][0].texture; compMat.uniforms.t3.value = LV[2][0].texture;
      pass(compMat, null);
    }
    window.addEventListener("hf-seek", (e) => { if (e && e.detail && typeof e.detail.time === "number") renderAt(e.detail.time); });

    return { canvas, renderAt, lockAt, box: [bx0, by0, bx1, by1], lines: lineInfo, swash: SW ? { from: SW.from, to: SW.to } : null, sLetters, sTotal };
  };
})();
