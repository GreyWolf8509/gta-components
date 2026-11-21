/* Steps3D: the physical layer of the feature-steps component (Three.js r160, global THREE). Identical file in a/media and b/media.
   Everything but the A pills is real geometry lit by one PMREM studio:
     - tiles:  a purple candy clearcoat slab (rounded-rect extrusion, bevelled), a face shader (gradient, recess, glass, spill,
               lit glow, sheen), a real neon tube along the front edge that draws itself round the rim when the step lights,
               an additive halo and a soft contact shadow;
     - icons:  steering wheel (torus + capsule spokes + hub), wanted star (extruded, bevelled), gold coin (lathed, embossed "$");
     - arrows: neon tubes (shaft + head strokes + round caps) charged by a travelling light front;
     - words:  (optional, B) extruded bevelled Archivo glyphs on the slab face, white enamel; the result word turns gold behind a
               hot light front on the payoff.
   Seek-safe: renderAt(t) is a pure function of t. Fast moves render as shutter sub-frames averaged in a half-float target,
   then encoded to sRGB once (lit materials carry their own ACES). */
(function () {
  'use strict';
  const ACES = `
vec3 sfFit(vec3 v){ vec3 a = v*(v+0.0245786)-0.000090537; vec3 b = v*(0.983729*v+0.4329510)+0.238081; return a/b; }
vec3 sfACES(vec3 c){
  const mat3 I = mat3(vec3(0.59719,0.07600,0.02840), vec3(0.35458,0.90834,0.13383), vec3(0.04823,0.01566,0.83777));
  const mat3 O = mat3(vec3(1.60475,-0.10208,-0.00327), vec3(-0.53108,1.10813,-0.07276), vec3(-0.07367,-0.00605,1.07602));
  c *= EXPO / 0.6; c = I * c; c = sfFit(c); c = O * c; return clamp(c, 0.0, 1.0);
}`;
  let progKey = 0;
  // ACES in-shader (we render into a float target and encode once); extra(sh) may inject more code first
  function withACES(mat, expo, extra) {
    const k = 'sf' + (++progKey);
    mat.onBeforeCompile = (sh) => {
      if (extra) extra(sh);
      sh.fragmentShader = sh.fragmentShader
        .replace('void main() {', ACES.replace(/EXPO/g, expo.toFixed(3)) + '\nvoid main() {')
        .replace('#include <tonemapping_fragment>', 'gl_FragColor.rgb = sfACES(gl_FragColor.rgb);');
    };
    mat.customProgramCacheKey = () => k;
    return mat;
  }
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, k) => a + (b - a) * k;
  const sstep = (a, b, x) => { const k = clamp((x - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); };
  const fly = (tau, k, w) => tau <= 0 ? 0 : 1 - Math.exp(-k * tau) * Math.cos(w * tau);       // 0 -> 1 with overshoot
  const ring = (tau, k, w) => tau <= 0 ? 0 : Math.exp(-k * tau) * Math.sin(w * tau);          // damped wobble
  const p3in = (x) => { x = clamp(x, 0, 1); return x * x * x; };
  const outCubic = (x) => { x = clamp(x, 0, 1); return 1 - Math.pow(1 - x, 3); };
  const inOut = (x) => { x = clamp(x, 0, 1); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

  function rr(p, x, y, w, h, r) {   // rounded rect, x,y = bottom-left (y up)
    p.moveTo(x + r, y); p.lineTo(x + w - r, y); p.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
    p.lineTo(x + w, y + h - r); p.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
    p.lineTo(x + r, y + h); p.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
    p.lineTo(x, y + r); p.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  }
  class RRCurve extends THREE.Curve {   // closed rounded-rect centre line, clockwise from the top-left corner's end
    constructor(w, h, r, z) { super(); Object.assign(this, { w, h, r, z }); const sx = w - 2 * r, sy = h - 2 * r, arc = Math.PI * r / 2; this.L = 2 * sx + 2 * sy + 4 * arc; }
    getPoint(t, out = new THREE.Vector3()) {
      const { w, h, r, z } = this, hw = w / 2, hh = h / 2, sx = w - 2 * r, sy = h - 2 * r, arc = Math.PI * r / 2;
      let s = (((t % 1) + 1) % 1) * this.L;
      if (s < sx) return out.set(-hw + r + s, hh, z); s -= sx;
      if (s < arc) { const a = Math.PI / 2 - s / r; return out.set(hw - r + r * Math.cos(a), hh - r + r * Math.sin(a), z); } s -= arc;
      if (s < sy) return out.set(hw, hh - r - s, z); s -= sy;
      if (s < arc) { const a = -s / r; return out.set(hw - r + r * Math.cos(a), -hh + r + r * Math.sin(a), z); } s -= arc;
      if (s < sx) return out.set(hw - r - s, -hh, z); s -= sx;
      if (s < arc) { const a = -Math.PI / 2 - s / r; return out.set(-hw + r + r * Math.cos(a), -hh + r + r * Math.sin(a), z); } s -= arc;
      if (s < sy) return out.set(-hw, -hh + r + s, z); s -= sy;
      const a = Math.PI - s / r; return out.set(-hw + r + r * Math.cos(a), hh - r + r * Math.sin(a), z);
    }
  }
  const lin = (hex) => new THREE.Color(hex);   // r160: hex -> linear working space

  window.Steps3D = function (C, host) {
    const W = C.W, H = C.H, FPS = 30, T = C.timing, END = T.end, L = C.look, TL = C.tile, N = C.steps.length;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H; canvas.id = 'gl';
    canvas.style.cssText = 'position:absolute;left:0;top:0;width:' + W + 'px;height:' + H + 'px;display:block;pointer-events:none';
    host.appendChild(canvas);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping; renderer.autoClear = false;
    const EXPO = L.exposure || 1.0;

    // ---------- environment: a violet studio, a big soft key above, a hard strip for bevel lines, pink / violet sides, warm top-right ----------
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(0.50,0.48,0.56), hor = vec3(0.10,0.07,0.13), low = vec3(0.015,0.01,0.02);' +
        ' vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.05, 0.85, y)) : mix(hor, low, smoothstep(0.0, 0.45, -y)); gl_FragColor = vec4(c, 1.0); }'
    })));
    const panel = (w, h, x, y, z, col) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(col[0], col[1], col[2]), side: THREE.DoubleSide }));
      m.position.set(x, y, z); m.lookAt(0, 0, 0); envScene.add(m);
    };
    panel(60, 16, 0, 34, 22, [2.6, 2.55, 2.6]);          // big softbox above-front: the even sheen on faces
    panel(40, 2.6, 0, 9, 44, [4.2, 4.1, 4.3]);          // hard strip in front, high: the crisp line along top bevels
    panel(7, 34, -40, 2, 22, [2.8, 0.9, 1.8]);          // pink strip left
    panel(7, 34, 40, 2, 22, [1.3, 1.0, 2.8]);           // violet strip right
    panel(24, 14, 30, 26, 18, [3.8, 2.9, 1.7]);         // warm softbox top-right: gold reads gold
    panel(46, 4, 0, -18, 40, [0.9, 0.6, 1.0]);          // low front bounce
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(envScene, 0.0, 0.1, 200).texture;

    const scene = new THREE.Scene(); scene.environment = envTex;
    const key = new THREE.DirectionalLight(0xfff2f6, 1.9); key.position.set(-0.5, 0.9, 1.0); scene.add(key);
    const hemi = new THREE.HemisphereLight(0xf3e8ff, 0x1c0c1a, 0.6); scene.add(hemi);
    const rake = new THREE.PointLight(0xffd9a0, 0, 0, 0); scene.add(rake);   // the warm payoff rake
    const FOV = C.camera.fov, DIST = (H / 2) / Math.tan((FOV / 2) * Math.PI / 180);
    const cam = new THREE.PerspectiveCamera(FOV, W / H, 20, DIST * 5);
    const toX = (px) => px - W / 2, toY = (py) => H / 2 - py;

    const addBlend = { blending: THREE.CustomBlending, blendEquation: THREE.AddEquation, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
      blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneMinusSrcAlphaFactor, transparent: true, depthWrite: false };

    // ---------- shared tile geometry ----------
    const TW = TL.w, TH = TL.h, RAD = TL.r, DEP = TL.depth, BEV = TL.bevel;
    const bodyShape = new THREE.Shape(); rr(bodyShape, -TW / 2, -TH / 2, TW, TH, RAD);
    const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, { depth: DEP, bevelEnabled: true, bevelThickness: BEV, bevelSize: BEV, bevelOffset: -BEV, bevelSegments: 5, curveSegments: 14 });
    bodyGeo.translate(0, 0, BEV);
    const FRONT = DEP + 2 * BEV;
    const FW = TW - 2 * BEV, FH = TH - 2 * BEV;
    const faceShape = new THREE.Shape(); rr(faceShape, -FW / 2, -FH / 2, FW, FH, RAD - BEV);
    const faceGeo = new THREE.ShapeGeometry(faceShape, 14);
    { const p = faceGeo.attributes.position, uv = faceGeo.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + FW / 2) / FW, (p.getY(i) + FH / 2) / FH); uv.needsUpdate = true; }
    const TR = TL.tube, TIN = BEV * 0.75 + TR * 1.05;
    const tubeGeo = new THREE.TubeGeometry(new RRCurve(TW - 2 * TIN, TH - 2 * TIN, Math.max(4, RAD - TIN), FRONT + TR * 0.25), 400, TR, 12, true);
    const GP = TL.glowPad, SP = TL.shadowPad;
    const bodyMat = withACES(new THREE.MeshPhysicalMaterial({ color: lin(L.body), metalness: 0.25, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.07, envMapIntensity: 1.15 }), EXPO);

    const vsPos = 'varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }';
    const vsUv = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }';
    const vsTube = 'varying vec2 vUv; varying vec3 vN; varying vec3 vV; void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }';
    // neon: off = dark glass with a specular; on = colour with a white-hot core; a travelling front (uP) lights it with a hot head
    const fsNeon = `uniform float uOn, uP, uFix, uHot, uFlash; uniform vec3 uCol; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main(){ float u = uFix >= 0.0 ? uFix : vUv.x; float f = clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0);
        float lit = uOn * (1.0 - smoothstep(uP - 0.012, uP + 0.004, u));
        float head = uHot * exp(-pow((u - uP) / 0.035, 2.0)) * step(u, uP + 0.08);
        vec3 on = mix(uCol * 1.55, mix(uCol, vec3(1.0), 0.72) * 1.9, pow(f, 6.0));
        vec3 off = vec3(0.13, 0.08, 0.16) * (0.35 + 0.65 * f) + vec3(0.55, 0.5, 0.6) * pow(f, 30.0);
        vec3 c = mix(off, on, clamp(lit, 0.0, 1.0)) * max(1.0, lit) + vec3(1.0, 0.92, 0.96) * 2.2 * head + vec3(1.0) * uFlash * f;
        gl_FragColor = vec4(c, 1.0); }`;
    function neonMat(col) {
      return new THREE.ShaderMaterial({ uniforms: { uOn: { value: 0 }, uP: { value: 2 }, uFix: { value: -1 }, uHot: { value: 0 }, uFlash: { value: 0 }, uCol: { value: col } },
        vertexShader: vsTube, fragmentShader: fsNeon, toneMapped: false });
    }

    // ---------- icons ----------
    function enamel() {
      return withACES(new THREE.MeshPhysicalMaterial({ color: lin('#F6F2FF'), roughness: 0.26, metalness: 0.0, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.0, emissive: lin('#FF4FA3'), emissiveIntensity: 0 }), EXPO);
    }
    function buildIcon(kind, S) {
      const g = new THREE.Group(), mats = [];
      if (kind === 'wheel') {
        const m = enamel(); mats.push(m);
        const R = S * 0.4, tr = S * 0.072;
        g.add(new THREE.Mesh(new THREE.TorusGeometry(R, tr, 28, 120), m));
        const hubG = new THREE.CylinderGeometry(S * 0.13, S * 0.145, S * 0.11, 48, 1); hubG.rotateX(Math.PI / 2);
        const hub = new THREE.Mesh(hubG, m); hub.position.z = S * 0.02; g.add(hub);
        const capG = new THREE.TorusGeometry(S * 0.1, S * 0.022, 16, 64); const cap = new THREE.Mesh(capG, m); cap.position.z = S * 0.08; g.add(cap);
        [0, Math.PI, -Math.PI / 2].forEach((a) => {
          const len = R - S * 0.12, sg = new THREE.CapsuleGeometry(S * 0.05, len, 8, 20);
          const sp = new THREE.Mesh(sg, m); sp.scale.set(1.25, 1, 0.75);
          sp.position.set(Math.cos(a) * (S * 0.12 + len / 2), Math.sin(a) * (S * 0.12 + len / 2), 0);
          sp.rotation.z = a - Math.PI / 2; g.add(sp);
        });
      } else if (kind === 'star') {
        const m = enamel(); mats.push(m);
        const s = new THREE.Shape(), Ro = S * 0.5, Ri = S * 0.235;
        for (let k = 0; k < 10; k++) { const a = Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? Ri : Ro; const x = Math.cos(a) * r, y = Math.sin(a) * r - S * 0.03; k ? s.lineTo(x, y) : s.moveTo(x, y); }
        s.closePath();
        const geo = new THREE.ExtrudeGeometry(s, { depth: S * 0.05, bevelEnabled: true, bevelThickness: S * 0.1, bevelSize: S * 0.06, bevelOffset: -S * 0.03, bevelSegments: 8, curveSegments: 4 });
        geo.translate(0, 0, -S * 0.025);
        g.add(new THREE.Mesh(geo, m));
      } else if (kind === 'coin') {
        const R = S * 0.47, th = S * 0.13;
        const gold = withACES(new THREE.MeshPhysicalMaterial({ color: lin(L.goldBody || '#E8A933'), metalness: 0.88, roughness: 0.24, clearcoat: 0.7, clearcoatRoughness: 0.08, envMapIntensity: 1.35, emissive: lin('#FF9A1C'), emissiveIntensity: 0 }), EXPO);
        const goldHi = withACES(new THREE.MeshPhysicalMaterial({ color: lin('#FFE48C'), metalness: 0.7, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.5, emissive: lin('#FFB02E'), emissiveIntensity: 0 }), EXPO);
        mats.push(gold, goldHi);
        const pr = [[0.001, th * 0.28], [R * 0.74, th * 0.28], [R * 0.8, th * 0.5], [R * 0.93, th * 0.5], [R, th * 0.36], [R, -th * 0.36], [R * 0.93, -th * 0.5], [R * 0.8, -th * 0.5], [R * 0.74, -th * 0.28], [0.001, -th * 0.28]];
        const pts = pr.map((p) => new THREE.Vector2(p[0], p[1]));
        const lg = new THREE.LatheGeometry(pts, 96); lg.rotateX(Math.PI / 2);   // axis -> z
        g.add(new THREE.Mesh(lg, gold));
        const GL = window.STEP_GLYPHS && window.STEP_GLYPHS.coin;
        if (GL) {
          const cap = S * 0.5, sc = cap / GL.cap, gl = GL.g['$'];
          const shapes = glyphShapes(gl[1], sc, -(gl[2] + gl[3]) / 2 * sc, -cap / 2 + cap * 0.0);
          const dg = new THREE.ExtrudeGeometry(shapes, { depth: th * 0.18, bevelEnabled: true, bevelThickness: th * 0.12, bevelSize: S * 0.012, bevelOffset: 0, bevelSegments: 3, curveSegments: 1 });
          const front = new THREE.Mesh(dg, goldHi); front.position.z = th * 0.28 - th * 0.02; g.add(front);
          const back = new THREE.Mesh(dg, goldHi); back.rotation.y = Math.PI; back.position.z = -th * 0.28 + th * 0.02; g.add(back);
        }
      }
      return { g, mats, kind };
    }
    // glyph SVG path (font units, y-down) -> THREE shapes, scaled, offset (ox, oy) in px with y up
    function glyphShapes(path, sc, ox, oy) {
      const sp = new THREE.ShapePath(), re = /([MLQCZ])([^MLQCZ]*)/g; let m;
      const px = (nx, ny) => [ox + nx * sc, oy - ny * sc];
      while ((m = re.exec(path))) {
        const n = m[2].trim() ? m[2].trim().split(/[\s,]+/).map(Number) : [];
        const P = []; for (let j = 0; j < n.length; j += 2) P.push(...px(n[j], n[j + 1]));
        if (m[1] === 'M') sp.moveTo(P[0], P[1]); else if (m[1] === 'L') sp.lineTo(P[0], P[1]);
        else if (m[1] === 'Q') sp.quadraticCurveTo(P[0], P[1], P[2], P[3]); else if (m[1] === 'C') sp.bezierCurveTo(P[0], P[1], P[2], P[3], P[4], P[5]);
      }
      const clean = (pts) => { const out = []; for (const p of pts) if (!out.length || p.distanceTo(out[out.length - 1]) > 0.35) out.push(p);
        while (out.length > 3 && out[0].distanceTo(out[out.length - 1]) <= 0.35) out.pop(); return out; };
      return sp.toShapes(false).map((sh) => { const s2 = new THREE.Shape(clean(sh.getPoints(8))); sh.holes.forEach((h) => s2.holes.push(new THREE.Path(clean(h.getPoints(8))))); return s2; });
    }

    // ---------- words (B): extruded Archivo on the slab face, white enamel; a gold light front for the result word ----------
    function buildWord(text, capPx, maxW, depth, bev) {
      const G = window.STEP_GLYPHS.narrow;
      let adv = 0; const parts = [];
      for (let k = 0; k < text.length; k++) {
        const ch = text[k], gl = G.g[ch]; if (!gl) continue;
        parts.push([ch, adv]); adv += gl[0] + (k < text.length - 1 ? (G.k[ch + text[k + 1]] || 0) : 0);
      }
      const lastGl = G.g[text[text.length - 1]], inkW = adv - lastGl[0] + lastGl[3] - G.g[text[0]][2];
      const cap = Math.min(capPx, maxW / (inkW / G.cap)), sc = cap / G.cap, x0 = -G.g[text[0]][2] * sc;
      const shapes = [];
      parts.forEach(([ch, a]) => { if (ch !== ' ') shapes.push(...glyphShapes(G.g[ch][1], sc, x0 + a * sc, 0)); });
      const geo = new THREE.ExtrudeGeometry(shapes, { depth, bevelEnabled: true, bevelThickness: bev, bevelSize: bev * 0.8, bevelOffset: -bev * 0.8, bevelSegments: 4, curveSegments: 1 });
      geo.translate(0, 0, bev);
      const U = { uFront: { value: -1e4 }, uSoft: { value: cap * 0.35 }, uGoldOn: { value: 0 }, uHot: { value: 0 }, uBand: { value: cap * 0.45 },
        uGoldA: { value: lin('#F09A16') }, uGoldB: { value: lin('#FFF0B0') }, uCap: { value: cap }, uHotCol: { value: lin('#FFE7B0') } };
      const inject = (sh) => {
        Object.assign(sh.uniforms, U);
        sh.vertexShader = 'varying vec3 vWP;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvWP = position;');
        sh.fragmentShader = 'varying vec3 vWP; uniform float uFront, uSoft, uGoldOn, uHot, uBand, uCap; uniform vec3 uGoldA, uGoldB, uHotCol;\n' + sh.fragmentShader
          .replace('#include <color_fragment>', '#include <color_fragment>\nfloat gk = uGoldOn * (1.0 - smoothstep(uFront - uSoft, uFront + uSoft, vWP.x));\n' +
            'vec3 goldC = mix(uGoldA, uGoldB, smoothstep(-0.05, 1.0, vWP.y / uCap));\ndiffuseColor.rgb = mix(diffuseColor.rgb, goldC, gk);')
          .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\nmetalnessFactor = mix(metalnessFactor, 0.3, gk); roughnessFactor = mix(roughnessFactor, 0.22, gk);')
          .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += uHotCol * uHot * exp(-pow((vWP.x - uFront) / uBand, 2.0)) + goldC * 0.16 * gk;');
      };
      const face = withACES(new THREE.MeshPhysicalMaterial({ color: lin('#F6F2FF'), roughness: 0.3, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 0.95, emissive: lin('#FF4FA3'), emissiveIntensity: 0 }), EXPO, inject);
      const side = withACES(new THREE.MeshPhysicalMaterial({ color: lin('#B8A2D6'), roughness: 0.28, metalness: 0.2, clearcoat: 0.8, clearcoatRoughness: 0.1, envMapIntensity: 1.0, emissive: lin('#FF4FA3'), emissiveIntensity: 0 }), EXPO, inject);
      const mesh = new THREE.Mesh(geo, [face, side]);
      return { mesh, face, side, U, cap, width: inkW * sc };
    }
    function textPlane(text, px, weight, maxW) {
      const S2 = 2, c = document.createElement('canvas'), ctx = c.getContext('2d');
      const setF = () => { ctx.font = weight + ' ' + (px * S2) + 'px Inter'; ctx.letterSpacing = (0.06 * px * S2) + 'px'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; };
      setF(); const w = Math.min(maxW * S2, Math.ceil(ctx.measureText(text).width + 0.06 * px * S2 * (text.length + 1)) + 16);
      c.width = w; c.height = Math.ceil(px * S2 * 1.3);
      setF(); ctx.fillStyle = '#fff';
      ctx.fillText(text, 2, c.height / 2, w - 8);
      const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false, color: lin('#8C7AAE') });
      const m = new THREE.Mesh(new THREE.PlaneGeometry(c.width / S2, c.height / S2), mat);
      m.geometry.translate(c.width / S2 / 2, 0, 0);
      return { m, mat };
    }

    // ---------- tiles ----------
    const NEON = lin(L.neon), GOLD = lin(L.gold);
    const tiles = C.steps.map((st, i) => {
      const accent = st.accent === 'gold' ? GOLD : NEON;
      const root = new THREE.Group(); root.position.set(toX(st.cx), toY(st.cy), 0); root.rotation.set(st.rx || 0, st.ry || 0, 0); scene.add(root);
      const g = new THREE.Group(); root.add(g);
      g.add(new THREE.Mesh(bodyGeo, bodyMat));
      const fu = { uLit: { value: 0 }, uCol: { value: accent }, uTop: { value: lin(L.faceTop) }, uBot: { value: lin(L.faceBot) }, uSize: { value: new THREE.Vector2(FW, FH) },
        uGC: { value: new THREE.Vector2(0.5 + (TL.icon.x || 0) / FW, 0.5 + (TL.icon.y || 0) / FH) }, uSheen: { value: -2 }, uSheenAmp: { value: 0 }, uSheenCol: { value: lin(st.accent === 'gold' ? '#FFD98A' : '#FFF4E6') }, uDim: { value: 0.62 }, uGK: { value: st.accent === 'gold' ? (L.goldFace || 0.45) : 1 } };
      const face = new THREE.Mesh(faceGeo, new THREE.ShaderMaterial({ uniforms: fu, toneMapped: false, vertexShader: vsUv,
        fragmentShader: `uniform float uLit, uSheen, uSheenAmp, uDim, uGK; uniform vec3 uCol, uTop, uBot, uSheenCol; uniform vec2 uSize, uGC; varying vec2 vUv;
          void main(){
            vec3 c = mix(uBot, uTop, smoothstep(0.0, 1.0, vUv.y));
            c *= mix(uDim, 1.0, clamp(uLit, 0.0, 1.0));
            float ex = min(vUv.x, 1.0 - vUv.x) * uSize.x, ey = min(vUv.y, 1.0 - vUv.y) * uSize.y, e = min(ex, ey);
            vec2 d = (vUv - uGC) * uSize / uSize.y;
            c += uCol * uLit * uGK * (0.34 * exp(-dot(d, d) / 0.11) + 0.1 * exp(-dot(d, d) / 0.5));      // lit: light pools behind the icon
            c *= mix(0.5, 1.0, smoothstep(0.0, uSize.y * 0.07, e));                                  // recess under the bevel
            c += uCol * uLit * (0.3 * uGK + 0.1) * exp(-e / (uSize.y * 0.035));                                    // neon spill on the face edge
            float q = vUv.x * 0.5 + (1.0 - vUv.y) * 1.2;
            c += vec3(1.0, 0.9, 1.0) * 0.05 * smoothstep(0.42, 0.3, q);                               // glass: soft top-left reflection
            float s = (vUv.x * uSize.x * 0.85 + (1.0 - vUv.y) * uSize.y * 0.55) / uSize.x - uSheen;
            c += uSheenCol * uSheenAmp * (exp(-s * s / 0.0016) + 0.18 * exp(-s * s / 0.012));         // specular sweep
            gl_FragColor = vec4(c, 1.0);
          }` }));
      face.position.z = FRONT + 0.4; g.add(face);
      const tube = new THREE.Mesh(tubeGeo, neonMat(accent)); g.add(tube);
      const gu = { uAmt: { value: 0 }, uCol: { value: accent }, uHalf: { value: new THREE.Vector2(TW / 2, TH / 2) }, uR: { value: RAD }, uPad: { value: GP } };
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(TW + 2 * GP, TH + 2 * GP), new THREE.ShaderMaterial(Object.assign({ uniforms: gu, toneMapped: false, vertexShader: vsPos,
        fragmentShader: `uniform float uAmt, uR, uPad; uniform vec3 uCol; uniform vec2 uHalf; varying vec2 vP;
          void main(){ vec2 q = abs(vP) - uHalf + uR; float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uR;
            float dd = max(d, 0.0), g = 0.75 * exp(-dd / (uPad * 0.075)) + 0.25 * exp(-dd / (uPad * 0.26));
            g *= 1.0 - smoothstep(uPad * 0.35, uPad * 0.98, dd); g *= uAmt;
            gl_FragColor = vec4(uCol * g, clamp(g * 0.5, 0.0, 1.0)); }` }, addBlend)));
      glow.position.z = 2; g.add(glow);
      const shu = { uAmt: { value: 0 }, uHalf: { value: new THREE.Vector2(TW / 2 - 8, TH / 2 - 8) }, uR: { value: RAD }, uPad: { value: SP } };
      const shadow = new THREE.Mesh(new THREE.PlaneGeometry(TW + 2 * SP, TH + 2 * SP), new THREE.ShaderMaterial({ uniforms: shu, transparent: true, depthWrite: false, toneMapped: false, vertexShader: vsPos,
        fragmentShader: `uniform float uAmt, uR, uPad; uniform vec2 uHalf; varying vec2 vP;
          void main(){ vec2 q = abs(vP) - uHalf + uR; float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uR;
            float a = 1.0 - smoothstep(-uPad * 0.3, uPad * 0.9, d); a *= 1.0 - smoothstep(uPad * 0.75, uPad * 0.99, d);
            gl_FragColor = vec4(0.03, 0.0, 0.05, a * uAmt); }` }));
      shadow.position.set(0, -TL.shadowDrop, -TL.shadowZ); root.add(shadow);
      const ic = buildIcon(st.icon, TL.icon.size); const icRoot = new THREE.Group(); icRoot.position.set(TL.icon.x || 0, TL.icon.y || 0, FRONT + TL.icon.z); icRoot.add(ic.g); g.add(icRoot);
      let word = null, sub = null;
      if (TL.word && st.word) {
        word = buildWord(st.word, TL.word.cap, TL.word.maxW, TL.word.depth, TL.word.bevel);
        word.mesh.position.set(TL.word.x, TL.word.y, FRONT + 0.5); g.add(word.mesh);
      }
      if (TL.sub && st.sub) {
        sub = textPlane(st.sub, TL.sub.px, TL.sub.weight || 800, TL.sub.maxW);
        sub.m.position.set(TL.sub.x, TL.sub.y, FRONT + 1.2); g.add(sub.m);
      }
      return { i, st, root, g, fu, tube, gu, shu, shadow, ic, icRoot, word, sub, gold: st.accent === 'gold' };
    });

    // ---------- arrows: neon tube shaft + head strokes + round caps ----------
    const AR = C.arrow;
    const arrows = (C.arrows || []).map((a) => {
      const root = new THREE.Group(); scene.add(root);
      const p0 = new THREE.Vector3(toX(a.x0), toY(a.y0), a.z || 0), p1 = new THREE.Vector3(toX(a.x1), toY(a.y1), a.z || 0);
      const dir = p1.clone().sub(p0).normalize(), nrm = new THREE.Vector3(-dir.y, dir.x, 0), hl = AR.head;
      const tip = p1.clone(), shaftEnd = p1.clone().addScaledVector(dir, -AR.tube * 0.6);
      const hA = tip.clone().addScaledVector(dir, -hl).addScaledVector(nrm, hl * 0.82), hB = tip.clone().addScaledVector(dir, -hl).addScaledVector(nrm, -hl * 0.82);
      const mk = (q0, q1) => { const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(q0, q1), 48, AR.tube, 12, false), neonMat(NEON)); root.add(m); return m; };
      const shaft = mk(p0, shaftEnd), headA = mk(tip, hA), headB = mk(tip, hB);
      const capG = new THREE.SphereGeometry(AR.tube, 20, 12);
      const caps = [[p0, 0], [tip, 1], [hA, 1], [hB, 1]].map(([q, u]) => { const m = new THREE.Mesh(capG, neonMat(NEON)); m.position.copy(q); m.material.uniforms.uFix.value = u; root.add(m); return m; });
      const len = p0.distanceTo(p1);
      const gu = { uAmt: { value: 0 }, uCol: { value: NEON }, uHalf: { value: new THREE.Vector2(len / 2, AR.tube) }, uR: { value: AR.tube }, uPad: { value: AR.glow } };
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(len + 2 * AR.glow, AR.tube * 2 + 2 * AR.glow), new THREE.ShaderMaterial(Object.assign({ uniforms: gu, toneMapped: false, vertexShader: vsPos,
        fragmentShader: `uniform float uAmt, uR, uPad; uniform vec3 uCol; uniform vec2 uHalf; varying vec2 vP;
          void main(){ vec2 q = abs(vP) - uHalf + uR; float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uR;
            float dd = max(d, 0.0), g = exp(-dd / (uPad * 0.3)); g *= 1.0 - smoothstep(uPad * 0.6, uPad, dd); g *= uAmt;
            gl_FragColor = vec4(uCol * g, clamp(g * 0.5, 0.0, 1.0)); }` }, addBlend)));
      glow.position.copy(p0.clone().add(p1).multiplyScalar(0.5)); glow.position.z -= AR.tube * 2; glow.rotation.z = Math.atan2(dir.y, dir.x); root.add(glow);
      return { root, shaft, headA, headB, caps, gu, glow, mid: p0.clone().add(p1).multiplyScalar(0.5), dir, p0, p1 };
    });

    // ---------- choreography: pure functions of t ----------
    const LIGHT = T.light, PAY = LIGHT[N - 1];
    const flick = [0.9, 0.18, 1.0, 0.45, 1.0, 0.8, 1.0];
    function levelAt(i, t) {          // the tile's neon level (0 pending, 1 current, DONE after the next lights, 1 again after the payoff chain)
      const ig = LIGHT[i]; if (t < ig) return 0;
      const f = Math.floor((t - ig) * FPS + 1e-6); let v = f < flick.length ? flick[f] : 1;
      if (i === N - 1) return t - ig < 2 / FPS ? 1.6 : 1;               // payoff: 2 white-hot frames, no flicker
      if (i < N - 1) {
        const nx = LIGHT[i + 1]; v = lerp(v, L.done, sstep(nx, nx + 0.3, t));
        const rc = PAY + T.chain + i * T.chainStep; v = lerp(v, 1, sstep(rc, rc + 0.12, t));
      }
      return v;
    }
    function drawAt(i, t) { const ig = LIGHT[i], d = i === N - 1 ? T.drawPay : T.draw; return lerp(-0.02, 1.08, outCubic((t - (ig - d)) / d)); }
    const exitAt = (i) => T.exit + i * T.exitStep;
    function poseTile(K, t) {
      const i = K.i, tin = T.in[i], te = exitAt(i);
      if (t < tin || t >= te + T.exitDur) { K.root.visible = false; return; }
      K.root.visible = true;
      const p = fly(t - tin, 9, 12), e = t > te ? p3in((t - te) / T.exitDur) : 0;
      const ig = LIGHT[i], nx = i < N - 1 ? LIGHT[i + 1] : 1e9;
      // current lift: toward camera while it is the current step
      const up = sstep(ig - 0.05, ig + 0.12, t) * (1 - sstep(nx, nx + 0.35, t)) + (i === N - 1 ? 0 : 0);
      const settle = t > nx ? ring(t - nx - 0.2, 7, 14) * 0.25 : 0;
      // payoff punch: +8% in 2 frames, damped
      const u = t - PAY, punch = K.gold ? (u < 0 ? 0 : u < 0.066 ? u / 0.066 : Math.exp(-7 * (u - 0.066)) * Math.cos(12 * (u - 0.066))) : 0;
      const chainBump = i < N - 1 ? 0.035 * Math.exp(-Math.pow((t - (PAY + T.chain + i * T.chainStep) - 0.04) / 0.07, 2)) : 0;
      const sc = (lerp(0.5, 1, p) + 0.035 * up + L.punch * punch + chainBump) * (1 - e);
      K.g.scale.set(sc, sc, sc); K.g.visible = sc > 0.003;
      K.g.position.set(0, (1 - p) * -TH * 0.3, lerp(-260, 0, p) + up * L.lift + settle * 20 - e * 260);
      const sw = L.sway || 0;
      K.g.rotation.set((1 - p) * 0.9 - 1.25 * e + sw * 0.5 * Math.sin(t * 1.1 + i * 1.3), (1 - p) * -0.35 + sw * Math.sin(t * 1.4 + i * 0.9), (1 - p) * 0.08);
      // neon: rim draws itself round from the top-left, then flickers on
      const lv = levelAt(i, t), dp = drawAt(i, t), drawing = t >= ig - (i === N - 1 ? T.drawPay : T.draw) && t < ig;
      const nu = K.tube.material.uniforms;
      nu.uOn.value = drawing ? 1 : lv; nu.uP.value = drawing ? dp : 2; nu.uHot.value = drawing ? 1 : 0;
      nu.uFlash.value = K.gold && u >= 0 && u < 2 / FPS ? 0.8 : 0;
      const lit = drawing ? 0.25 * dp : Math.min(1, lv);
      K.fu.uLit.value = lit * (1 - e);
      // halo: the payoff tile peaks for 3 frames then rests
      let ga = Math.min(lv, 1) * L.glow;
      if (K.gold && u >= 0) ga = u < 0.1 ? L.glowPeak : lerp(L.glow * 1.15, L.glowPeak, Math.exp(-5 * (u - 0.1)));
      K.gu.uAmt.value = ga * (1 - e);
      K.shu.uAmt.value = L.shadow * clamp(p, 0, 1) * (1 - e);
      K.shadow.position.z = -TL.shadowZ + lerp(-260, 0, p) - e * 260; K.shadow.scale.setScalar(sc * (1 + 0.1 * up));
      // sheens: one as the tile lights, one in the payoff chain (left to right)
      const s1 = (t - (ig + 0.05)) / 0.4, s2 = (t - (PAY + T.chain + i * T.chainStep)) / 0.42;
      if (s2 > -0.2 && s2 < 1.3) { K.fu.uSheen.value = lerp(-0.45, 1.45, s2); K.fu.uSheenAmp.value = L.sheenPay; }
      else if (s1 > -0.2 && s1 < 1.3) { K.fu.uSheen.value = lerp(-0.45, 1.45, s1); K.fu.uSheenAmp.value = K.gold ? L.sheenPay * 1.2 : L.sheen; }
      else K.fu.uSheenAmp.value = 0;
      // icon: pending (recessed, dim) -> pop forward and turn on the light
      const ic = K.ic, ip = fly(t - ig, 10, 15), lit01 = t >= ig ? 1 : 0;
      const dimC = lin('#6E5C8E'), litC = lin('#F6F2FF');
      if (ic.kind !== 'coin') {
        ic.mats.forEach((m) => { m.color.copy(dimC).lerp(litC, lit01 ? clamp(0.4 + 0.6 * ip, 0, 1) : 0); m.emissiveIntensity = lit01 ? (0.55 * Math.exp(-7 * (t - ig))) * (K.gold ? 0 : 1) : 0; m.envMapIntensity = lit01 ? 1.25 : 0.45; });
        const isc = lit01 ? lerp(1.3, 1, ip) : 0.86;
        ic.g.scale.setScalar(isc); ic.g.position.z = lit01 ? (1 - ip) * 60 : -8;
        if (ic.kind === 'wheel') ic.g.rotation.set(0, 0, lit01 ? lerp(1.4, 0, ip) : 0.0);
        if (ic.kind === 'star') ic.g.rotation.set(0, lit01 ? lerp(-2 * Math.PI, 0, ip) : 0, 0);
        const exS = ring(t - (PAY + T.chain + i * T.chainStep), 9, 16) * 0.12;   // payoff chain: a little hop
        ic.g.scale.multiplyScalar(1 + exS);
      } else {
        // the result: on the cut the dim coin hops toward camera, flips 1.5 turns (its real edge shows) and lands face-on with a squash
        const cu = t - ig, cp = clamp(cu / T.coinDur, 0, 1), land = cu - T.coinDur;
        ic.g.visible = true;
        if (cu < 0) { ic.g.scale.setScalar(0.86); ic.g.rotation.set(0, 0, 0); ic.g.position.set(0, 0, -8);
          ic.mats[0].color.copy(lin('#6A4E3A')); ic.mats[1].color.copy(lin('#7E5E44')); ic.mats.forEach((m) => { m.envMapIntensity = 0.35; m.emissiveIntensity = 0; }); }
        else {
          const ec = outCubic(cp), hop = Math.sin(Math.PI * Math.min(1, cp * 1.05));
          ic.g.rotation.set(0.12 * hop, lerp(-3 * Math.PI, 0, ec), 0);
          const sq = land > 0 ? ring(land, 9, 20) : 0, s0 = lerp(0.86, 1, Math.min(1, cu / 0.066)) + 0.28 * hop;
          ic.g.scale.set(s0 * (1 + 0.1 * sq), s0 * (1 - 0.1 * sq), s0);
          ic.g.position.set(0, 0, 130 * hop - 26 * sq);
          ic.mats[0].color.copy(lin(L.goldBody || '#E8A933')); ic.mats[1].color.copy(lin('#FFE48C'));
          ic.mats.forEach((m) => { m.envMapIntensity = 1.5; m.emissiveIntensity = 0.12 + 0.5 * Math.exp(-5 * cu); });
        }
      }
      // word + sub (B): pending lavender -> lit white; the result word turns gold behind a hot light front
      if (K.word) {
        const W_ = K.word, wp = fly(t - ig, 11, 15);
        const wc = lit01 ? litC : lin('#8A78AC');
        W_.face.color.copy(wc); W_.side.color.copy(lit01 ? lin('#C7B2E6') : lin('#4E3E6E'));
        W_.face.envMapIntensity = lit01 ? 1.2 : 0.5;
        W_.face.emissiveIntensity = lit01 && !K.gold ? 0.35 * Math.exp(-6 * (t - ig)) : 0;
        W_.mesh.position.z = FRONT + 0.5 + (lit01 ? (1 - wp) * 26 : 0);
        if (K.gold) {
          const fs = (t - (PAY + T.goldFront)) / T.goldDur, ww = W_.width;
          W_.U.uGoldOn.value = fs > -0.05 ? 1 : 0;
          W_.U.uFront.value = lerp(-ww * 0.25, ww * 1.3, inOut(fs));
          W_.U.uHot.value = fs > 0 && fs < 1.05 ? 1.4 * Math.sin(Math.PI * clamp(fs, 0, 1)) : 0;
          if (fs >= 1) W_.side.color.copy(lin('#A8620E'));
          else if (fs > 0) W_.side.color.copy(lin('#C7B2E6')).lerp(lin('#A8620E'), fs);
        }
      }
      if (K.sub) K.sub.mat.color.copy(lit01 ? lin(K.gold ? '#FFE2A0' : '#FFC4E4') : lin('#7A6A9A'));
    }
    function poseArrow(A, k, t) {
      const tin = T.in[k + 1], te = exitAt(k) - 0.05;
      if (t < tin || t >= te + 0.2) { A.root.visible = false; return; }
      A.root.visible = true;
      const p = fly(t - tin, 10, 13), e = t > te ? p3in((t - te) / 0.2) : 0;
      A.root.scale.setScalar(1);
      A.root.position.set(0, 0, 0);
      // grow from the tail on entry / collapse into the tip on exit (scale along the arrow about its ends)
      const sIn = clamp(p, 0, 1.08), sOut = 1 - e;
      const sc = Math.max(0.001, sIn * sOut), anchor = e > 0 ? A.p1 : A.p0;
      A.root.position.copy(anchor).multiplyScalar(1 - sc); A.root.scale.set(sc, sc, sc);
      const cs = LIGHT[k + 1] - T.charge - 0.02, cp = (t - cs) / T.charge;
      let on = 0, P = 2, hot = 0;
      if (cp >= 0 && cp < 1) { on = 1; P = lerp(-0.05, 1.25, inOut(cp)); hot = 1; }
      else if (cp >= 1) { on = 1; const nx = k + 2 < N ? LIGHT[k + 2] : 1e9; on = lerp(1, L.done, sstep(nx, nx + 0.3, t)); }
      const rc = PAY + T.chain + k * T.chainStep + T.chainStep * 0.5, pulse = Math.exp(-Math.pow((t - rc) / 0.08, 2));
      if (cp >= 1) on = Math.max(on, lerp(on, 1, sstep(PAY + T.chain, PAY + T.chain + 0.15, t))) + 0.6 * pulse;
      // shaft carries the front 0..1; head strokes light once the front passes 1
      const sU = A.shaft.material.uniforms; sU.uOn.value = on; sU.uHot.value = hot; sU.uP.value = P;
      [A.headA, A.headB].forEach((m) => { const U = m.material.uniforms; U.uOn.value = on; U.uHot.value = hot * (P > 0.95 ? 1 : 0); U.uP.value = (P - 1) * 4; });
      A.caps.forEach((m, j) => { const U = m.material.uniforms; U.uOn.value = on; U.uHot.value = 0; U.uP.value = j === 0 ? P : (P - 1) * 4 + 0.2; U.uFix.value = j === 0 ? 0 : 0.1; });
      A.gu.uAmt.value = (cp >= 0 ? Math.min(1.4, on) : 0) * L.arrowGlow * (1 - e);
    }
    function poseCam(t) {
      const CM = C.camera, h = sstep(PAY, END, t), d = DIST * lerp(1, CM.dolly || 1, h);
      const yaw = (CM.yaw || 0) * (1 - h * 0.4), pitch = (CM.pitch || 0);
      cam.position.set(d * Math.sin(yaw), d * Math.sin(pitch), d * Math.cos(yaw) * Math.cos(pitch));
      cam.lookAt(0, 0, 0);
    }
    function poseRake(t) {
      const K = tiles[N - 1], u = t - (PAY + T.rakeAt), rk = clamp(u / T.rakeDur, 0, 1);
      const c = new THREE.Vector3(); K.root.getWorldPosition(c);
      rake.position.set(c.x + lerp(-TW * 0.9, TW * 0.9, rk), c.y + TH * 0.5, c.z + FRONT + TL.icon.size * 1.1);
      rake.intensity = u < 0 || u > T.rakeDur ? 0 : L.rake * Math.sin(Math.PI * rk);
      rake.distance = TL.icon.size * 3.2;
    }
    function poseAt(t) { poseCam(t); tiles.forEach((K) => poseTile(K, t)); arrows.forEach((A, k) => poseArrow(A, k, t)); scene.updateMatrixWorld(true); poseRake(t); }

    // ---------- render: shutter sub-frames into a half-float target, averaged, one sRGB encode ----------
    const rtSub = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 });
    const rtAcc = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType });
    const qCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), qGeo = new THREE.PlaneGeometry(2, 2);
    const accMat = new THREE.ShaderMaterial({ uniforms: { tex: { value: null }, uW: { value: 1 } }, depthTest: false, depthWrite: false, toneMapped: false,
      blending: THREE.CustomBlending, blendEquation: THREE.AddEquation, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneFactor,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: 'uniform sampler2D tex; uniform float uW; varying vec2 vUv; void main(){ gl_FragColor = texture2D(tex, vUv) * uW; }' });
    const outMat = new THREE.ShaderMaterial({ uniforms: { tex: { value: null } }, depthTest: false, depthWrite: false, toneMapped: false, blending: THREE.NoBlending,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: `uniform sampler2D tex; varying vec2 vUv;
        vec3 enc(vec3 c){ c = clamp(c, 0.0, 1.0); return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
        void main(){ vec4 c = texture2D(tex, vUv); float a = clamp(c.a, 0.0, 1.0); gl_FragColor = vec4(min(enc(c.rgb), vec3(1.0)), a); }` });
    const qScene = new THREE.Scene(), quad = new THREE.Mesh(qGeo, accMat); quad.frustumCulled = false; qScene.add(quad);
    const SHUT = (L.shutter || 0.5) / FPS;
    const busy = (t) => {   // motion windows that get shutter sub-frames
      const ev = [].concat(T.in.map((x) => [x, x + 0.6]), LIGHT.map((x) => [x - 0.3, x + 0.5]), [[PAY - 0.1, PAY + 0.9]], tiles.map((K) => [exitAt(K.i) - 0.05, exitAt(K.i) + T.exitDur + 0.05]));
      return ev.some(([a, b]) => t >= a && t <= b);
    };
    let lastT = -1;
    function renderAt(t) {
      t = clamp(t, 0, END);
      if (Math.abs(t - lastT) < 1e-6) return; lastT = t;
      const n = busy(t) ? (L.samples || 8) : 1;
      renderer.setRenderTarget(rtAcc); renderer.setClearColor(0x000000, 0); renderer.clear(true, true, true);
      for (let k = 0; k < n; k++) {
        poseAt(n <= 1 ? t : Math.max(0, t + ((k + 0.5) / n - 0.5) * SHUT));
        renderer.setRenderTarget(rtSub); renderer.clear(true, true, true); renderer.render(scene, cam);
        quad.material = accMat; accMat.uniforms.tex.value = rtSub.texture; accMat.uniforms.uW.value = 1 / n;
        renderer.setRenderTarget(rtAcc); renderer.render(qScene, qCam);
      }
      poseAt(t);
      quad.material = outMat; outMat.uniforms.tex.value = rtAcc.texture;
      renderer.setRenderTarget(null); renderer.setClearColor(0x000000, 0); renderer.clear(true, true, true); renderer.render(qScene, qCam);
    }
    // screen position of a tile-local point (for DOM pinning)
    const pv = new THREE.Vector3();
    function project(i, x, y, z) { poseAt(lastT < 0 ? 0 : lastT); pv.set(x, y, z); tiles[i].g.localToWorld(pv); pv.project(cam); return [(pv.x + 1) / 2 * W, (1 - pv.y) / 2 * H]; }
    return { renderAt, project, tiles, FRONT };
  };
})();
