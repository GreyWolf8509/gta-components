/* Plate3D: the disclaimer's warning plate as real geometry (Three.js r160, global THREE).
   A steel-framed red enamel sign: a rounded slab extruded with a rounded, polished-steel bevel, four domed chrome screws,
   a raised white-enamel pinstripe, a raised white-enamel warning triangle whose "!" is cut through to the red, and the
   heading in raised white-enamel letters traced from Archivo's own outlines (media/glyphs.js). Optional printed line
   (a canvas decal in our own Inter) under the heading.
   Light: a PMREM studio environment (softboxes the clearcoat reflects), a key that rakes across the bevels, a hemisphere
   fill, one wide soft specular band, and a hot pulse on the triangle. Post: sub-frame motion blur, HDR bloom and a soft
   contact shadow. Seek-safe: nothing animates on its own; renderAt(t) draws time t from o.pose(t, frameTime).
   Pipeline adapted from gta/19 card3d.js. Identical file in a/ and b/. */
(function () {
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const srgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.substr(i, 2), 16) / 255);
  const toLin = (x) => (x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
  const lin = (hex) => { const a = srgb(hex).map(toLin); return new THREE.Color(a[0], a[1], a[2]); };
  const v3 = (c) => "vec3(" + c.r.toFixed(4) + "," + c.g.toFixed(4) + "," + c.b.toFixed(4) + ")";
  let KEY = 0;

  function layout(F, text, size, tracking, wordGap) {
    const s = size / F.upm, track = (tracking || 0) * F.upm, gap = (wordGap || 0) * F.upm;
    const items = []; let pen = 0;
    for (let i = 0; i < text.length; i++) {
      const ch = F.g[text[i]] ? text[i] : " ", g = F.g[ch], nx = text[i + 1];
      items.push({ ch, x: pen, g, inkL: pen + g[2], inkR: pen + g[3] });
      pen += g[0] + (nx ? (F.k[ch + nx] || 0) : 0) + (i < text.length - 1 ? track : 0) + (ch === " " ? gap : 0);
    }
    const inks = items.filter((p) => p.ch !== " ");
    const inkL = inks[0].inkL, inkR = inks[inks.length - 1].inkR;
    return { items, s, cap: F.cap * s, inkL, inkR, inkW: (inkR - inkL) * s };
  }

  const MIN_SEG = 0.5;
  function clean(pts) {
    const out = []; for (const p of pts) if (!out.length || p.distanceTo(out[out.length - 1]) > MIN_SEG) out.push(p);
    while (out.length > 3 && out[0].distanceTo(out[out.length - 1]) <= MIN_SEG) out.pop(); return out;
  }
  // glyph outline (font units, y-down) -> shapes in plate space via map(x, y) -> [x, y]
  function pathShapes(d, map) {
    const sp = new THREE.ShapePath(), re = /([MLQCZ])([^MLQCZ]*)/g; let m;
    while ((m = re.exec(d))) {
      const n = m[2].trim() ? m[2].trim().split(/[\s,]+/).map(Number) : [], P = [];
      for (let i = 0; i < n.length; i += 2) { const q = map(n[i], n[i + 1]); P.push(q[0], q[1]); }
      if (m[1] === "M") sp.moveTo(P[0], P[1]); else if (m[1] === "L") sp.lineTo(P[0], P[1]);
      else if (m[1] === "Q") sp.quadraticCurveTo(P[0], P[1], P[2], P[3]); else if (m[1] === "C") sp.bezierCurveTo(P[0], P[1], P[2], P[3], P[4], P[5]);
    }
    return sp.toShapes(false).map((sh) => {
      const s2 = new THREE.Shape(clean(sh.getPoints(10)));
      sh.holes.forEach((h) => s2.holes.push(new THREE.Path(clean(h.getPoints(10)))));
      return s2;
    });
  }
  // a polygon with rounded corners (quadratic corners), as points
  function roundPoly(pts, r, seg) {
    const n = pts.length, out = [];
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i + n - 1) % n], p1 = pts[i], p2 = pts[(i + 1) % n];
      const d0 = Math.hypot(p0[0] - p1[0], p0[1] - p1[1]), d2 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
      const rr = Math.min(Array.isArray(r) ? r[i] : r, d0 * 0.49, d2 * 0.49);
      const a = [p1[0] + (p0[0] - p1[0]) / d0 * rr, p1[1] + (p0[1] - p1[1]) / d0 * rr];
      const b = [p1[0] + (p2[0] - p1[0]) / d2 * rr, p1[1] + (p2[1] - p1[1]) / d2 * rr];
      for (let k = 0; k <= seg; k++) {
        const t = k / seg, u = 1 - t;
        out.push(new THREE.Vector2(u * u * a[0] + 2 * u * t * p1[0] + t * t * b[0], u * u * a[1] + 2 * u * t * p1[1] + t * t * b[1]));
      }
    }
    return clean(out);
  }
  const rrect = (w, h, r, cx, cy) => roundPoly([[cx - w / 2, cy - h / 2], [cx + w / 2, cy - h / 2], [cx + w / 2, cy + h / 2], [cx - w / 2, cy + h / 2]], r, 10);

  window.Plate3D = function (o) {
    const W = o.W, H = o.H;
    const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
    canvas.style.cssText = "position:absolute;left:0;top:0;width:" + W + "px;height:" + H + "px;display:block";
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;
    renderer.autoClear = false;
    const scene = new THREE.Scene();
    const FOV = o.fov || 18, DIST = (H / 2) / Math.tan((FOV / 2) * Math.PI / 180);
    const camera = new THREE.PerspectiveCamera(FOV, W / H, 10, DIST * 4);
    camera.position.set(0, 0, DIST); camera.lookAt(0, 0, 0);
    const PX = o.px == null ? W / 2 : o.px, PY = o.py == null ? H / 2 : o.py;
    camera.setViewOffset(W, H, W / 2 - PX, H / 2 - PY, W, H);

    // ---------- environment: a studio the clearcoat and steel reflect (softboxes, a front strip, a hot back bar) ----------
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(1.8,1.74,1.66), hor = vec3(0.30,0.28,0.27), low = vec3(0.03,0.028,0.026);" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.05, 0.75, y)) : mix(hor, low, smoothstep(0.0, 0.4, -y));" +
        " c *= 0.7 + 0.4 * smoothstep(-0.2, 1.0, vP.z); gl_FragColor = vec4(c, 1.0); }"
    })));
    const panel = (w, h, x, y, z, k) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k * 0.98, k * 0.96), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); envScene.add(m); };
    panel(40, 10, 0, 30, 24, 2.4);      // big softbox above and in front
    panel(46, 3.2, 0, 7.5, 40, 2.4);    // a strip in front, a little high: lights the top bevels
    // the gloss band: a wide strip just above the lens axis, so the enamel's upper part reflects it (it slides as the plate tilts)
    const GL = o.gloss || { elev: 1.6, span: 1.4, k: 5 }, tg = (d) => Math.tan(d * Math.PI / 180) * 40;
    panel(70, tg(GL.elev + GL.span / 2) - tg(GL.elev - GL.span / 2), 0, tg(GL.elev), 40, GL.k);
    panel(46, 6, 0, 26, -22, 3.4);      // hot bar up and behind: the top bevels read as a lit lip
    panel(4, 30, -34, 4, 18, 1.8);      // tall strip at the left: the left walls catch a highlight
    panel(4, 30, 34, -2, 18, 1.0);      // weaker strip at the right
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(envScene, 0.0, 0.1, 200).texture;

    // ---------- lights ----------
    const key = new THREE.DirectionalLight(0xfff1dc, 2.2); scene.add(key); scene.add(key.target);
    const hemi = new THREE.HemisphereLight(0xfff4ea, 0x1a1210, 0.6); scene.add(hemi);

    // ---------- materials: one shader patch gives each part its gradient, the shared specular band and a hot pulse ----------
    const GU = { uSpecX: { value: -1e5 }, uSpecW: { value: 100 }, uSpecAmp: { value: 0 } };
    function mat(opt) {
      const U = Object.assign({ uHot: { value: 0 } }, GU);
      const key = "plate3d-" + (++KEY);
      const isFace = opt.kind === "face";
      let col;
      if (isFace) {
        const st = opt.stops.map(lin), y0 = opt.y0.toFixed(3), y1 = opt.y1.toFixed(3);
        col = "  float u = clamp((vLP.y - (" + y0 + ")) / ((" + y1 + ") - (" + y0 + ")), 0.0, 1.0); vec3 base = " + v3(st[0]) + ";\n";
        for (let i = 1; i < st.length; i++) col += "  base = mix(base, " + v3(st[i]) + ", smoothstep(" + ((i - 1) / (st.length - 1)).toFixed(3) + ", " + (i / (st.length - 1)).toFixed(3) + ", 1.0 - u));\n";
      } else {
        const near = lin(opt.near), far = lin(opt.far), lip = lin(opt.lip || opt.near);
        col = "  float dzz = clamp(((" + opt.zF.toFixed(3) + ") - vLP.z) / " + opt.depth.toFixed(3) + ", 0.0, 1.0);\n" +
          "  float lipK = 1.0 - smoothstep(" + (opt.bevel * 0.7).toFixed(3) + ", " + (opt.bevel * 1.3).toFixed(3) + ", (" + opt.zF.toFixed(3) + ") - vLP.z);\n" +
          "  vec3 base = mix(mix(" + v3(near) + ", " + v3(far) + ", smoothstep(0.0, 1.0, dzz)), " + v3(lip) + ", lipK);\n";
      }
      const hot = lin(opt.hot || "#FFF4E0");
      const m = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, metalness: opt.metal, roughness: opt.rough, clearcoat: opt.clearcoat || 0, clearcoatRoughness: opt.ccRough == null ? 0.06 : opt.ccRough,
        envMapIntensity: opt.env == null ? 1 : opt.env, side: THREE.FrontSide
      });
      m.customProgramCacheKey = () => key;
      m.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, U);
        sh.vertexShader = "varying vec3 vLP;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vLP = position;");
        sh.fragmentShader = "varying vec3 vLP; uniform float uSpecX, uSpecW, uSpecAmp, uHot;\n" + sh.fragmentShader
          .replace("#include <color_fragment>", "#include <color_fragment>\n {\n" + col + "  diffuseColor.rgb = base;\n }")
          .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n {\n" + col +
            "  totalEmissiveRadiance += base * " + (opt.em || 0).toFixed(3) + ";\n" +
            "  totalEmissiveRadiance += " + v3(hot) + " * uHot;\n" +
            "  float sd = (vLP.x + vLP.y * 0.36 - uSpecX) / uSpecW; float sb = exp(-sd * sd * 0.9);\n" +
            "  totalEmissiveRadiance += vec3(1.0, 0.97, 0.93) * sb * uSpecAmp * " + (opt.specK == null ? 1 : opt.specK).toFixed(3) + ";\n }");
      };
      m.userData.U = U;
      return m;
    }
    function extrude(shapes, zFront, total, bevel, mats) {
      const depth = Math.max(0.5, total - 2 * bevel), BS = bevel * 0.62;
      const geo = new THREE.ExtrudeGeometry(shapes, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: BS, bevelOffset: -BS, bevelSegments: 5, curveSegments: 1 });
      geo.translate(0, 0, zFront - (depth + 2 * bevel));
      geo.computeVertexNormals();
      return new THREE.Mesh(geo, mats);
    }

    // ---------- layout (plate space: px, y up, origin = plate centre) ----------
    const F = o.glyphs, C = o.colors;
    const capPx = o.cap, size = capPx / F.cap * F.upm;
    const Lay = layout(F, o.word, size, o.tracking || 0, o.wordGap || 0), s = Lay.s, cap = Lay.cap;
    const ic = o.icon ? { h: o.icon.h, w: o.icon.h * 1.14, gap: o.icon.gap } : null;
    const row1W = (ic ? ic.w + ic.gap : 0) + Lay.inkW;
    let dec = null;
    if (o.decal) {
      const mc = document.createElement("canvas").getContext("2d");
      mc.font = o.decal.font; const tw = mc.measureText(o.decal.text).width;
      dec = { tw, h: o.decal.box };
    }
    const contentW = Math.max(row1W, dec ? dec.tw : 0);
    const pw = o.plate.w || Math.round(contentW + 2 * o.plate.padX), ph = o.plate.h;
    const rowY = o.rowY || 0;
    const x0 = -row1W / 2;
    const wordL = x0 + (ic ? ic.w + ic.gap : 0);
    const ox = wordL - Lay.inkL * s;

    const group = new THREE.Group(); scene.add(group);
    const PL = o.plate, RB = PL.bevel, RD = PL.depth;
    // the slab
    const slabFace = mat({ kind: "face", stops: C.plate, y0: -ph / 2, y1: ph / 2, metal: 0.0, rough: 0.34, clearcoat: 1.0, ccRough: 0.04, env: 0.55, em: C.plateEm == null ? 0.22 : C.plateEm, specK: 0.75 });
    const slabSide = mat({ kind: "side", near: C.steel[0], far: C.steel[1], lip: C.steel[2], zF: 0, depth: RD, bevel: RB, metal: 1.0, rough: 0.26, env: 1.0, specK: 0.8 });
    group.add(extrude([new THREE.Shape(rrect(pw, ph, PL.r, 0, 0))], 0, RD, RB, [slabFace, slabSide]));
    // raised parts: white enamel faces, light steel walls
    const LH = o.letterH, LE = 2, LB = o.letterBevel;
    const enamelFace = (y0, y1) => mat({ kind: "face", stops: C.white, y0, y1, metal: 0.08, rough: 0.3, clearcoat: 0.8, ccRough: 0.08, env: 0.42, em: C.whiteEm == null ? 0.5 : C.whiteEm, specK: 0.16, hot: C.hot });
    const enamelSide = mat({ kind: "side", near: C.wall[0], far: C.wall[1], lip: C.wall[2], zF: LH, depth: LH + LE, bevel: LB, metal: 0.85, rough: 0.28, env: 1.0, specK: 0.3 });
    // pinstripe
    if (PL.ring) {
      const R = PL.ring, ow = pw - 2 * R.inset, oh = ph - 2 * R.inset;
      const sh = new THREE.Shape(rrect(ow, oh, Math.max(4, PL.r - R.inset), 0, 0));
      sh.holes.push(new THREE.Path(rrect(ow - 2 * R.w, oh - 2 * R.w, Math.max(3, PL.r - R.inset - R.w), 0, 0)));
      const rs = mat({ kind: "side", near: C.wall[0], far: C.wall[1], lip: C.wall[2], zF: R.h, depth: R.h + LE, bevel: Math.min(R.w * 0.3, 1.6), metal: 0.85, rough: 0.28, env: 1.0, specK: 0.7 });
      group.add(extrude([sh], R.h, R.h + LE, Math.min(R.w * 0.3, 1.6), [enamelFace(-oh / 2, oh / 2), rs]));
    }
    // the warning triangle with its "!" cut through to the red
    let iconMats = null;
    if (ic) {
      const cx = x0 + ic.w / 2, cy = rowY + (o.icon.dy || 0), h = ic.h, w = ic.w;
      const top = [cx, cy + h * 0.5], bl = [cx - w / 2, cy - h * 0.5], br = [cx + w / 2, cy - h * 0.5];
      const tri = new THREE.Shape(roundPoly([top, br, bl], [h * 0.16, h * 0.12, h * 0.12], 10));
      const bw0 = h * 0.085, bw1 = h * 0.06, by0 = cy + h * 0.2, by1 = cy - h * 0.14;
      tri.holes.push(new THREE.Path(roundPoly([[cx - bw0, by0], [cx + bw0, by0], [cx + bw1, by1], [cx - bw1, by1]], h * 0.03, 4)));
      const dr = h * 0.068, dy = cy - h * 0.29;
      const dot = []; for (let k = 0; k < 28; k++) { const a = -k / 28 * Math.PI * 2; dot.push(new THREE.Vector2(cx + Math.cos(a) * dr, dy + Math.sin(a) * dr)); }
      tri.holes.push(new THREE.Path(dot));
      iconMats = [enamelFace(cy - h / 2, cy + h / 2), enamelSide];
      group.add(extrude([tri], LH, LH + LE, LB, iconMats));
    }
    // the heading
    const wordFace = enamelFace(rowY - cap / 2, rowY + cap / 2);
    Lay.items.forEach((it) => {
      if (it.ch === " ") return;
      const shapes = pathShapes(it.g[1], (x, y) => [ox + (it.x + x) * s, -y * s - cap / 2 + rowY]);
      group.add(extrude(shapes, LH, LH + LE, LB, [wordFace, enamelSide]));
    });
    // screws: domed chrome heads
    if (PL.screws) {
      const S = PL.screws, sm = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0.78, 0.8, 0.84), metalness: 1, roughness: 0.2, envMapIntensity: 1.2 });
      const ring = new THREE.CylinderGeometry(S.r, S.r * 1.04, S.r * 0.3, 32); ring.rotateX(Math.PI / 2); ring.translate(0, 0, S.r * 0.15);
      const dome = new THREE.SphereGeometry(S.r * 0.98, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2); dome.rotateX(Math.PI / 2); dome.scale(1, 1, 0.42); dome.translate(0, 0, S.r * 0.28);
      const slotM = new THREE.MeshStandardMaterial({ color: 0x1a1c20, metalness: 0.5, roughness: 0.6 });
      const slot = new THREE.BoxGeometry(S.r * 1.5, S.r * 0.22, S.r * 0.5);
      [[-1, 1], [1, 1], [1, -1], [-1, -1]].forEach(([sx, sy], i) => {
        const g = new THREE.Group(); g.position.set(sx * (pw / 2 - S.inset), sy * (ph / 2 - S.inset), 0);
        g.add(new THREE.Mesh(ring, sm)); g.add(new THREE.Mesh(dome, sm));
        const sl = new THREE.Mesh(slot, slotM); sl.position.z = S.r * 0.62; sl.rotation.z = 0.6 + i * 0.9; g.add(sl);
        group.add(g);
      });
    }
    // the printed line (our Inter, drawn after the fonts load)
    if (dec) {
      const SS = 3, dw = Math.ceil(dec.tw + 24), dh = dec.h;
      const cv = document.createElement("canvas"); cv.width = dw * SS; cv.height = dh * SS;
      const cx = cv.getContext("2d"); cx.scale(SS, SS);
      cx.font = o.decal.font; cx.textAlign = "center"; cx.textBaseline = "middle"; cx.fillStyle = o.decal.color || "#FFFFFF";
      cx.fillText(o.decal.text, dw / 2, dh / 2 + (o.decal.base || 0));
      const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
      const dm = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false, color: new THREE.Color(1, 1, 1) });
      const dp = new THREE.Mesh(new THREE.PlaneGeometry(dw, dh), dm); dp.position.set(0, o.decal.y, 0.8); group.add(dp);
    }

    // ---------- post: accumulation (motion blur) + HDR bloom + soft contact shadow ----------
    const HFT = renderer.capabilities.isWebGL2 && renderer.extensions.has("EXT_color_buffer_float");
    const TYPE = HFT ? THREE.HalfFloatType : THREE.UnsignedByteType;
    const SAMPLES = renderer.capabilities.isWebGL2 ? Math.min(8, renderer.capabilities.maxSamples || 4) : 0;
    const rtMain = new THREE.WebGLRenderTarget(W, H, { type: TYPE, samples: SAMPLES });
    const RTO = { type: TYPE, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false };
    const rtAcc = new THREE.WebGLRenderTarget(W, H, RTO);
    const LV = [2, 4, 8, 16].map((d) => [new THREE.WebGLRenderTarget(Math.ceil(W / d), Math.ceil(H / d), RTO), new THREE.WebGLRenderTarget(Math.ceil(W / d), Math.ceil(H / d), RTO)]);
    const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), postScene = new THREE.Scene();
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2)); quad.frustumCulled = false; postScene.add(quad);
    const VS = "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }";
    const post = (u, fs, blend) => new THREE.ShaderMaterial(Object.assign({ uniforms: u, vertexShader: VS, fragmentShader: fs, depthTest: false, depthWrite: false, blending: THREE.NoBlending, toneMapped: false }, blend || {}));
    const accMat = post({ tSrc: { value: null }, uW: { value: 1 } }, "uniform sampler2D tSrc; uniform float uW; varying vec2 vUv; void main(){ gl_FragColor = texture2D(tSrc, vUv) * uW; }",
      { blending: THREE.CustomBlending, blendEquation: THREE.AddEquation, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneFactor, transparent: true });
    const brightMat = post({ tSrc: { value: null }, uTh: { value: 1.0 } },
      "uniform sampler2D tSrc; uniform float uTh; varying vec2 vUv; void main(){ vec4 c = texture2D(tSrc, vUv); vec3 u = c.a > 0.0 ? c.rgb / c.a : vec3(0.0);" +
      " float l = max(u.r, max(u.g, u.b)); gl_FragColor = vec4(c.rgb * smoothstep(uTh, uTh + 0.8, l), c.a); }");
    const blurMat = post({ tSrc: { value: null }, uDir: { value: new THREE.Vector2() } },
      "uniform sampler2D tSrc; uniform vec2 uDir; varying vec2 vUv; void main(){ vec4 c = texture2D(tSrc, vUv) * 0.2270270270;" +
      " c += (texture2D(tSrc, vUv + uDir * 1.3846153846) + texture2D(tSrc, vUv - uDir * 1.3846153846)) * 0.3162162162;" +
      " c += (texture2D(tSrc, vUv + uDir * 3.2307692308) + texture2D(tSrc, vUv - uDir * 3.2307692308)) * 0.0702702703; gl_FragColor = c; }");
    const compMat = post({
      tMain: { value: null }, t1: { value: null }, t2: { value: null }, t3: { value: null }, t4: { value: null },
      uPx: { value: new THREE.Vector2(1 / W, 1 / H) },
      uBloom: { value: 0.2 }, uShadow: { value: o.shadow == null ? 0.55 : o.shadow }, uShOff: { value: new THREE.Vector2(o.shadowOff ? -o.shadowOff[0] : -6, o.shadowOff ? o.shadowOff[1] : 9) },
      uWide: { value: o.wideShadow == null ? 0.35 : o.wideShadow }, uBloomC: { value: new THREE.Vector3(1, 1, 1) }
    }, [
      "uniform sampler2D tMain, t1, t2, t3, t4; uniform vec2 uPx, uShOff; uniform float uBloom, uShadow, uWide; uniform vec3 uBloomC; varying vec2 vUv;",
      "vec3 shoulder(vec3 x){ return mix(x, 0.82 + 0.18 * (1.0 - exp(-max(x - 0.82, 0.0) / 0.18)), step(0.82, x)); }",
      "vec3 toSRGB(vec3 c){ c = clamp(c, 0.0, 1.0); return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }",
      "void main(){",
      "  vec4 m = texture2D(tMain, vUv);",
      "  float sh = (texture2D(t2, vUv + uShOff * uPx).a * 0.7 + texture2D(t3, vUv + uShOff * uPx * 2.0).a * 0.5) * uShadow;",
      "  sh += texture2D(t4, vUv + uShOff * uPx * 3.5).a * uWide;",
      "  vec3 wc = m.a > 0.0 ? toSRGB(shoulder(m.rgb / m.a)) : vec3(0.0);",
      "  float a = m.a; vec3 col = wc * a;",
      "  float sa = clamp(sh, 0.0, 0.82); a += sa * (1.0 - a);",
      "  vec3 b = (texture2D(t1, vUv).rgb + texture2D(t2, vUv).rgb * 0.8 + texture2D(t3, vUv).rgb * 0.6) * uBloom * uBloomC;",
      "  col += toSRGB(1.0 - exp(-b)) * 0.9;",
      "  gl_FragColor = vec4(col, a);",
      "}"].join("\n"));
    function pass(m, target, noClear) { quad.material = m; renderer.setRenderTarget(target); if (!noClear) renderer.clear(); renderer.render(postScene, postCam); }

    // ---------- pose ----------
    let hidden = false;
    function setPose(t, tf) {
      const P = o.pose(t, tf == null ? t : tf) || {};
      hidden = !!P.hide;
      const sc = P.s == null ? 1 : P.s;
      const scx = (P.cx == null ? o.cx : P.cx) + (P.x || 0), scy = (P.cy == null ? o.cy : P.cy) + (P.y || 0);
      if (o.follow) {        // the principal point rides with the plate: same perspective and reflections wherever it sits
        camera.setViewOffset(W, H, W / 2 - scx, H / 2 - scy, W, H);
        group.position.set(0, 0, P.z || 0);
      } else group.position.set(scx - PX, -(scy - PY), P.z || 0);
      group.rotation.set(P.rx || 0, P.ry || 0, P.rz || 0);
      group.scale.set(sc * (P.sx == null ? 1 : P.sx), sc * (P.sy == null ? 1 : P.sy), sc);
      GU.uSpecX.value = P.specX == null ? -1e5 : P.specX; GU.uSpecAmp.value = P.specAmp || 0; GU.uSpecW.value = P.specW || 100;
      if (iconMats) iconMats[0].userData.U.uHot.value = P.iconHot || 0;
      slabSide.userData.U.uHot.value = P.rimHot || 0;           // the steel bevel's hot rim on the payoff
      const ka = P.keyAngle == null ? -0.5 : P.keyAngle;
      key.position.set(Math.sin(ka) * 10, 8 + (P.keyY || 0), 9);
      key.intensity = P.key == null ? 2.2 : P.key;
      hemi.intensity = P.hemi == null ? 0.6 : P.hemi;
      compMat.uniforms.uBloom.value = P.bloom == null ? 0.12 : P.bloom;
      compMat.uniforms.uShadow.value = P.shadow == null ? (o.shadow == null ? 0.55 : o.shadow) : P.shadow;
      brightMat.uniforms.uTh.value = P.bloomTh == null ? 1.3 : P.bloomTh;
      scene.updateMatrixWorld(true);
    }
    function renderAt(t) {
      const sh = o.shutter ? o.shutter(t) : 0;
      const N = sh > 0 ? (typeof o.subframes === "function" ? o.subframes(t) : (o.subframes || 10)) : 1;
      setPose(t, t);
      if (hidden) { renderer.setRenderTarget(null); renderer.clear(); return; }
      renderer.setRenderTarget(rtAcc); renderer.clear();
      for (let i = 0; i < N; i++) {
        const ti = N === 1 ? t : t + sh * ((i + 0.5) / N - 0.5);
        setPose(ti, t);
        renderer.setRenderTarget(rtMain); renderer.clear(); renderer.render(scene, camera);
        accMat.uniforms.tSrc.value = rtMain.texture; accMat.uniforms.uW.value = 1 / N;
        pass(accMat, rtAcc, true);
      }
      if (N > 1) setPose(t, t);
      brightMat.uniforms.tSrc.value = rtAcc.texture; pass(brightMat, LV[0][0]);
      let src = LV[0][0];
      LV.forEach(([A, B]) => {
        blurMat.uniforms.tSrc.value = src.texture; blurMat.uniforms.uDir.value.set(1 / A.width, 0); pass(blurMat, B);
        blurMat.uniforms.tSrc.value = B.texture; blurMat.uniforms.uDir.value.set(0, 1 / A.height); pass(blurMat, A);
        src = A;
      });
      compMat.uniforms.tMain.value = rtAcc.texture; compMat.uniforms.t1.value = LV[0][0].texture;
      compMat.uniforms.t2.value = LV[1][0].texture; compMat.uniforms.t3.value = LV[2][0].texture; compMat.uniforms.t4.value = LV[3][0].texture;
      pass(compMat, null);
    }
    window.addEventListener("hf-seek", (e) => { if (e && e.detail && typeof e.detail.time === "number") renderAt(e.detail.time); });
    return { canvas, renderAt, DIST, pw, ph, cap, row1W, wordL, wordR: wordL + Lay.inkW, iconL: x0 };
  };
})();
