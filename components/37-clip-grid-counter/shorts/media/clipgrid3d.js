/* ClipGrid3D: the physical layer of the clip-grid counter (Three.js r160, global THREE). Identical file in a/media and b/media.
   Everything on screen except the caption is real geometry, lit by one PMREM studio:
     - tiles:   a dark clearcoat slab (rounded-rect extrusion) carrying a footage screen, a real neon tube (TubeGeometry along
                the rim) with a white-hot core, an additive halo and a soft contact shadow on the grid plane;
     - badges:  a bevelled green candy rounded square with an extruded white check, stamped onto the tile corner;
     - counter: extruded, bevelled Inter 900 digits on odometer drums (each column a real drum of digits, clipped to a
                window), candy-pink faces, magenta metal walls, a rake light and a local bloom on the lock-in.
   Footage: each tile samples a framework-owned <video class="clip">. At render time HyperFrames swaps every video for an
   injected <img class="__render_frame__"> sibling (the extracted frame) and re-dispatches hf-seek, so the texture reads that
   img; in live preview it reads the <video> itself.
   Motion blur: during motion the frame is rendered as N shutter sub-frames into a half-float target and averaged, then
   encoded to sRGB once. Lit materials carry their own ACES (three only tone-maps the default framebuffer).
   Seek-safe: nothing animates on its own; renderAt(t) is a pure function of t (the camera springs are pre-integrated). */
(function () {
  'use strict';
  const ACES = `
vec3 cgFit(vec3 v){ vec3 a = v*(v+0.0245786)-0.000090537; vec3 b = v*(0.983729*v+0.4329510)+0.238081; return a/b; }
vec3 cgACES(vec3 c){
  const mat3 I = mat3(vec3(0.59719,0.07600,0.02840), vec3(0.35458,0.90834,0.13383), vec3(0.04823,0.01566,0.83777));
  const mat3 O = mat3(vec3(1.60475,-0.10208,-0.00327), vec3(-0.53108,1.10813,-0.07276), vec3(-0.07367,-0.00605,1.07602));
  c *= EXPO / 0.6; c = I * c; c = cgFit(c); c = O * c; return clamp(c, 0.0, 1.0);
}`;
  let progKey = 0;
  // mode 'hue': hue-preserving roll-off instead of ACES (keeps a candy pink hot instead of dusty); overs bleach to white
  const HUE = `
vec3 cgHue(vec3 c){ c *= EXPO; float m = max(max(c.r, c.g), c.b); if (m > 1.0) c = mix(c / m, vec3(1.0), clamp((m - 1.0) * 0.45, 0.0, 1.0)); return c; }`;
  function withACES(mat, expo, mode) {
    const k = 'cg' + (++progKey), hue = mode === 'hue';
    mat.onBeforeCompile = (sh) => {
      sh.fragmentShader = sh.fragmentShader
        .replace('void main() {', (hue ? HUE : ACES).replace(/EXPO/g, expo.toFixed(3)) + '\nvoid main() {')
        .replace('#include <tonemapping_fragment>', hue ? 'gl_FragColor.rgb = cgHue(gl_FragColor.rgb);' : 'gl_FragColor.rgb = cgACES(gl_FragColor.rgb);');
    };
    mat.customProgramCacheKey = () => k;
    return mat;
  }
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, k) => a + (b - a) * k;
  const sstep = (a, b, x) => { const k = clamp((x - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); };
  // damped arrival 0 -> 1 with overshoot (k damping, w ring frequency)
  const fly = (tau, k, w) => tau <= 0 ? 0 : 1 - Math.exp(-k * tau) * Math.cos(w * tau);
  const p3in = (x) => { x = clamp(x, 0, 1); return x * x * x; };
  const outCubic = (x) => { x = clamp(x, 0, 1); return 1 - Math.pow(1 - x, 3); };

  function rr(p, x, y, w, h, r) {   // rounded rect, x,y = bottom-left (y up)
    p.moveTo(x + r, y); p.lineTo(x + w - r, y); p.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
    p.lineTo(x + w, y + h - r); p.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
    p.lineTo(x + r, y + h); p.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
    p.lineTo(x, y + r); p.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  }
  class RRCurve extends THREE.Curve {   // closed rounded-rect centre line for the neon tube
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
  function gradTex(stops) {   // vertical gradient, bottom -> top
    const c = document.createElement('canvas'); c.width = 4; c.height = 256;
    const x = c.getContext('2d'), gr = x.createLinearGradient(0, 256, 0, 0);
    stops.forEach((s) => gr.addColorStop(s[1], s[0]));
    x.fillStyle = gr; x.fillRect(0, 0, 4, 256);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  function canvasTex(w, h, draw) {
    const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h);
    draw(c.getContext('2d'), c.width, c.height);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.NoColorSpace; return t;
  }
  function rrPath(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

  window.ClipGrid3D = function (C, els) {
    const W = C.W, H = C.H, FPS = 30, END = C.timing.end;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H; canvas.id = 'gl';
    canvas.style.cssText = 'position:absolute;left:0;top:0;width:' + W + 'px;height:' + H + 'px;display:block;pointer-events:none';
    els.host.appendChild(canvas);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;
    renderer.autoClear = false; renderer.localClippingEnabled = true;
    const EXPO = C.look.exposure || 1.0;

    // ---------- environment: a dark violet studio with hard softboxes and pink / violet side strips ----------
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(0.42,0.36,0.56), hor = vec3(0.09,0.06,0.12), low = vec3(0.012,0.008,0.016);' +
        ' vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.05, 0.85, y)) : mix(hor, low, smoothstep(0.0, 0.45, -y)); gl_FragColor = vec4(c, 1.0); }'
    })));
    const panel = (w, h, x, y, z, col) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(col[0], col[1], col[2]), side: THREE.DoubleSide }));
      m.position.set(x, y, z); m.lookAt(0, 0, 0); envScene.add(m);
    };
    panel(64, 16, 0, 34, 22, [2.3, 2.2, 2.4]);          // big softbox above-front: the even sheen on faces
    panel(40, 2.6, 0, 9, 44, [4.0, 3.9, 4.1]);          // hard strip in front, high: the crisp line along top bevels
    panel(7, 34, -40, 2, 22, [2.6, 0.9, 1.7]);          // pink strip left
    panel(7, 34, 40, 2, 22, [1.2, 1.0, 2.6]);           // violet strip right
    panel(46, 4, 0, -18, 40, [0.9, 0.55, 1.0]);         // low front bounce
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(envScene, 0.0, 0.1, 200).texture;

    function lights(scene) {
      const key = new THREE.DirectionalLight(0xfff2f6, 1.5); key.position.set(-0.5, 0.9, 1.0); scene.add(key);
      const hemi = new THREE.HemisphereLight(0xf3e8ff, 0x1c0c1a, 0.55); scene.add(hemi);
      const rake = new THREE.PointLight(0xfff0f8, 0, 0, 0); rake.position.set(-W, 0, 600); scene.add(rake);
      scene.environment = envTex; return { key, hemi, rake };
    }
    const gScene = new THREE.Scene(), cScene = new THREE.Scene();
    const gL = lights(gScene), cL = lights(cScene);
    const FOV = C.camera.fov, DIST = (H / 2) / Math.tan((FOV / 2) * Math.PI / 180);
    const gCam = new THREE.PerspectiveCamera(FOV, W / H, 20, DIST * 6);
    const CFOV = 20, CDIST = (H / 2) / Math.tan((CFOV / 2) * Math.PI / 180);
    const cCam = new THREE.PerspectiveCamera(CFOV, W / H, 40, CDIST * 4); cCam.position.set(0, 0, CDIST); cCam.lookAt(0, 0, 0);
    const toX = (px) => px - W / 2, toY = (py) => H / 2 - py;

    // ---------- shared tile resources ----------
    const G = C.grid, TW = G.tileW, TH = Math.round(TW * 9 / 16), BO = G.border, RAD = G.radius, DEP = G.depth;
    const OW = TW + 2 * BO, OH = TH + 2 * BO, BEV = Math.max(2, BO * 0.34);
    const bodyShape = new THREE.Shape(); rr(bodyShape, -OW / 2, -OH / 2, OW, OH, RAD + BO);
    const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, { depth: DEP, bevelEnabled: true, bevelThickness: BEV, bevelSize: BEV, bevelOffset: -BEV, bevelSegments: 4, curveSegments: 12 });
    bodyGeo.translate(0, 0, BEV);                       // back face at z = 0, front face at z = DEP + 2 BEV
    const FRONT = DEP + 2 * BEV;
    const scrShape = new THREE.Shape(); rr(scrShape, -TW / 2, -TH / 2, TW, TH, RAD);
    const scrGeo = new THREE.ShapeGeometry(scrShape, 12);
    { const p = scrGeo.attributes.position, uv = scrGeo.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + TW / 2) / TW, (p.getY(i) + TH / 2) / TH); uv.needsUpdate = true; }
    const tubeR = Math.max(1.6, BO * 0.36);
    const tubeGeo = new THREE.TubeGeometry(new RRCurve(TW + BO, TH + BO, RAD + BO / 2, FRONT + tubeR * 0.35), 320, tubeR, 10, true);
    const GP = Math.round(TW * 0.2);                     // glow pad around the tile
    const SP = Math.round(TW * 0.16);
    const NEON = new THREE.Color(C.look.neon), NEONLIN = NEON.clone();   // Color() from hex is already linear in r160
    const bodyMat = withACES(new THREE.MeshPhysicalMaterial({ color: new THREE.Color(C.look.body), metalness: 0.35, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.1 }), EXPO);
    const addBlend = { blending: THREE.CustomBlending, blendEquation: THREE.AddEquation, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor,
      blendSrcAlpha: THREE.ZeroFactor, blendDstAlpha: THREE.OneFactor, transparent: true, depthWrite: false };

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const tiles = [];
    function addTile(i, cx, cy, video) {
      const root = new THREE.Group(); root.position.set(toX(cx), toY(cy), 0); gScene.add(root);
      const g = new THREE.Group(); root.add(g);             // pose group (lift / arrival / exit)
      const body = new THREE.Mesh(bodyGeo, bodyMat); g.add(body);
      const cv = document.createElement('canvas'); cv.width = 960; cv.height = 540;   // fixed-size staging canvas: the texture never changes size
      const ctx2 = cv.getContext('2d'); ctx2.fillStyle = '#060408'; ctx2.fillRect(0, 0, cv.width, cv.height);
      const tex = new THREE.Texture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter; tex.magFilter = THREE.LinearFilter; tex.anisotropy = maxAniso;
      const su = { map: { value: tex }, uHas: { value: 0 }, uBright: { value: 1 }, uSat: { value: 1 }, uNeon: { value: 0 }, uNeonCol: { value: NEONLIN },
        uSheen: { value: -2 }, uSheenAmp: { value: 0 }, uSize: { value: new THREE.Vector2(TW, TH) } };
      const scr = new THREE.Mesh(scrGeo, new THREE.ShaderMaterial({ uniforms: su, toneMapped: false,
        vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: `uniform sampler2D map; uniform float uHas, uBright, uSat, uNeon, uSheen, uSheenAmp; uniform vec3 uNeonCol; uniform vec2 uSize; varying vec2 vUv;
          void main(){
            vec3 c = uHas > 0.5 ? texture2D(map, vUv).rgb : vec3(0.02, 0.015, 0.03);
            float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
            c = mix(vec3(l), c, uSat) * uBright;
            float ex = min(vUv.x, 1.0 - vUv.x) * uSize.x, ey = min(vUv.y, 1.0 - vUv.y) * uSize.y, e = min(ex, ey);
            c *= mix(0.42, 1.0, smoothstep(0.0, uSize.y * 0.085, e));                          // recess: inner shadow under the bezel
            c += uNeonCol * uNeon * ${(C.look.spill == null ? 0.2 : C.look.spill).toFixed(3)} * exp(-e / (uSize.y * 0.03));                        // neon spill on the glass edge
            float q = vUv.x * 0.55 + (1.0 - vUv.y) * 1.1;
            c += vec3(1.0) * 0.06 * smoothstep(0.5, 0.4, q);                                   // glass: a soft top-left reflection
            float d = (vUv.x * uSize.x * 0.82 + (1.0 - vUv.y) * uSize.y * 0.6) / uSize.x - uSheen;
            c += vec3(1.0, 0.96, 1.0) * uSheenAmp * (exp(-d * d / 0.0035) + 0.35 * exp(-d * d / 0.03)); // specular sweep on the glass
            gl_FragColor = vec4(c, 1.0);
          }` }));
      scr.position.z = FRONT + 0.6; g.add(scr);
      const nu = { uOn: { value: 0 }, uCol: { value: NEONLIN } };
      const tube = new THREE.Mesh(tubeGeo, new THREE.ShaderMaterial({ uniforms: nu, toneMapped: false,
        vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
        fragmentShader: `uniform float uOn; uniform vec3 uCol; varying vec3 vN; varying vec3 vV;
          void main(){ float f = clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0);
            vec3 on = mix(uCol * 1.7, vec3(1.0, 0.72, 0.9) * 1.9, pow(f, 7.0));
            vec3 off = vec3(0.10, 0.06, 0.11) * (0.4 + 0.6 * f) + vec3(0.5) * pow(f, 40.0);
            gl_FragColor = vec4(mix(off, on, clamp(uOn, 0.0, 1.0)) * max(1.0, uOn), 1.0); }` }));
      g.add(tube);
      const gu = { uAmt: { value: 0 }, uCol: { value: NEONLIN }, uHalf: { value: new THREE.Vector2(OW / 2, OH / 2) }, uR: { value: RAD + BO }, uPad: { value: GP } };
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(OW + 2 * GP, OH + 2 * GP), new THREE.ShaderMaterial(Object.assign({ uniforms: gu, toneMapped: false,
        vertexShader: 'varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: `uniform float uAmt, uR, uPad; uniform vec3 uCol; uniform vec2 uHalf; varying vec2 vP;
          void main(){ vec2 q = abs(vP) - uHalf + uR; float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uR;   // rounded-rect SDF (px)
            float dd = max(d, 0.0), g = 0.55 * exp(-dd / (uPad * 0.09)) + 0.45 * exp(-dd / (uPad * 0.3));
            g *= 1.0 - smoothstep(uPad * 0.55, uPad * 0.98, dd);
            gl_FragColor = vec4(uCol * g * uAmt, 0.0); }` }, addBlend)));
      glow.position.z = 1; g.add(glow);
      const shu = { uAmt: { value: 0 }, uHalf: { value: new THREE.Vector2(OW / 2 - 6, OH / 2 - 6) }, uR: { value: RAD + BO }, uPad: { value: SP } };
      const shadow = new THREE.Mesh(new THREE.PlaneGeometry(OW + 2 * SP, OH + 2 * SP), new THREE.ShaderMaterial({ uniforms: shu, transparent: true, depthWrite: false, toneMapped: false,
        vertexShader: 'varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: `uniform float uAmt, uR, uPad; uniform vec2 uHalf; varying vec2 vP;
          void main(){ vec2 q = abs(vP) - uHalf + uR; float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uR;
            float a = 1.0 - smoothstep(-uPad * 0.35, uPad * 0.85, d); a *= 1.0 - smoothstep(uPad * 0.7, uPad * 0.98, d);
            gl_FragColor = vec4(0.02, 0.0, 0.03, a * uAmt); }` }));
      shadow.position.z = -C.look.shadowZ; root.add(shadow);
      const BI = C.look.badgeInset || 0.44;
      const badge = makeBadge(); badge.position.set(OW / 2 - C.look.badge * BI, OH / 2 - C.look.badge * 0.40, FRONT + 2); g.add(badge);
      const T = { i, root, g, scr, su, nu, gu, shu, shadow, badge, tex, cv, ctx2, video, X: toX(cx), Y: toY(cy), cx, cy, last: null };
      tiles.push(T); return T;
    }

    // ---------- the tick badge: green candy rounded square + extruded white check ----------
    const BS = C.look.badge;
    const bShape = new THREE.Shape(); rr(bShape, -BS / 2, -BS / 2, BS, BS, BS * 0.27);
    const bGeo = new THREE.ExtrudeGeometry(bShape, { depth: BS * 0.16, bevelEnabled: true, bevelThickness: BS * 0.07, bevelSize: BS * 0.07, bevelOffset: -BS * 0.07, bevelSegments: 5, curveSegments: 10 });
    bGeo.translate(0, 0, BS * 0.07);
    const bFaceTex = gradTex([['#0E9A4C', 0], ['#22C766', 0.45], ['#5CF29A', 0.8], ['#B6FFD2', 1]]);
    bFaceTex.repeat.set(1 / BS, 1 / BS); bFaceTex.offset.set(0.5, 0.5);
    const bFace = withACES(new THREE.MeshPhysicalMaterial({ map: bFaceTex, roughness: 0.3, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 0.9 }), EXPO);
    const bSide = withACES(new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#0B7A3B'), roughness: 0.25, metalness: 0.4, clearcoat: 0.8, clearcoatRoughness: 0.1, envMapIntensity: 1.1 }), EXPO);
    const ck = (() => {   // the check: a thick polyline (two strokes, mitred joint) as a polygon, extruded
      const P = [[-0.25, 0.0], [-0.075, -0.18], [0.26, 0.19]].map((p) => [p[0] * BS, p[1] * BS]), h = BS * 0.075;
      const nrm = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); return [-dy / l, dx / l]; };
      const n1 = nrm(P[0], P[1]), n2 = nrm(P[1], P[2]); let m = [n1[0] + n2[0], n1[1] + n2[1]]; const ml = Math.hypot(m[0], m[1]); m = [m[0] / ml, m[1] / ml];
      const mk = h / (m[0] * n1[0] + m[1] * n1[1]);
      const pts = [[P[0][0] + n1[0] * h, P[0][1] + n1[1] * h], [P[1][0] + m[0] * mk, P[1][1] + m[1] * mk], [P[2][0] + n2[0] * h, P[2][1] + n2[1] * h],
        [P[2][0] - n2[0] * h, P[2][1] - n2[1] * h], [P[1][0] - m[0] * mk, P[1][1] - m[1] * mk], [P[0][0] - n1[0] * h, P[0][1] - n1[1] * h]];
      const s = new THREE.Shape(); s.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]); s.closePath();
      const g = new THREE.ExtrudeGeometry(s, { depth: BS * 0.06, bevelEnabled: true, bevelThickness: BS * 0.035, bevelSize: BS * 0.03, bevelOffset: 0, bevelSegments: 3 });
      g.translate(0, 0, BS * (0.16 + 0.14) + BS * 0.035 - 1); return g;
    })();
    const ckMat = withACES(new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#FFFFFF'), roughness: 0.25, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 0.8 }), EXPO);
    function makeBadge() {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(bGeo, [bFace, bSide])); g.add(new THREE.Mesh(ck, ckMat));
      g.visible = false; return g;
    }

    // ---------- the counter: odometer drums of extruded digits ----------
    const K = C.counter, F = window.COUNTER_GLYPHS, CAP = K.cap, s = CAP / F.cap, ADV = F.g['0'][0] * s * K.advance;
    const cFaceTex = gradTex(K.face); cFaceTex.repeat.set(1 / (CAP * 1.04), 1 / (CAP * 1.04)); cFaceTex.offset.set(0.5, 0.5);
    const CEXP = K.exposure || EXPO;
    const cFace = withACES(new THREE.MeshPhysicalMaterial({ map: cFaceTex, roughness: 0.34, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 0.8, emissive: new THREE.Color(K.emissive || '#FF2A9A'), emissiveIntensity: K.glowBase || 0 }), CEXP, 'hue');
    const cSide = withACES(new THREE.MeshPhysicalMaterial({ color: new THREE.Color(K.side), roughness: 0.24, metalness: 0.3, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.0 }), CEXP);
    const planes = [new THREE.Plane(new THREE.Vector3(0, -1, 0), 0), new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)];
    cFace.clippingPlanes = planes; cSide.clippingPlanes = planes;
    const digitGeo = {};
    function glyphGeo(ch) {
      if (digitGeo[ch]) return digitGeo[ch];
      const gl = F.g[ch], sp = new THREE.ShapePath(), re = /([MLQCZ])([^MLQCZ]*)/g; let m;
      const ox = -gl[0] / 2;                                // centre on the tabular advance
      const px = (nx, ny) => [(ox + nx) * s, -ny * s - CAP / 2];
      while ((m = re.exec(gl[1]))) {
        const n = m[2].trim() ? m[2].trim().split(/[\s,]+/).map(Number) : [];
        const P = []; for (let j = 0; j < n.length; j += 2) P.push(...px(n[j], n[j + 1]));
        if (m[1] === 'M') sp.moveTo(P[0], P[1]); else if (m[1] === 'L') sp.lineTo(P[0], P[1]);
        else if (m[1] === 'Q') sp.quadraticCurveTo(P[0], P[1], P[2], P[3]); else if (m[1] === 'C') sp.bezierCurveTo(P[0], P[1], P[2], P[3], P[4], P[5]);
      }
      const clean = (pts) => { const out = []; for (const p of pts) if (!out.length || p.distanceTo(out[out.length - 1]) > 0.8) out.push(p);
        while (out.length > 3 && out[0].distanceTo(out[out.length - 1]) <= 0.8) out.pop(); return out; };
      const shapes = sp.toShapes(false).map((sh) => { const s2 = new THREE.Shape(clean(sh.getPoints(10))); sh.holes.forEach((h) => s2.holes.push(new THREE.Path(clean(h.getPoints(10))))); return s2; });
      const geo = new THREE.ExtrudeGeometry(shapes, { depth: K.depth, bevelEnabled: true, bevelThickness: K.bevel, bevelSize: K.bevel * 0.85, bevelOffset: -K.bevel * 0.85, bevelSegments: 4, curveSegments: 1 });
      geo.translate(0, 0, -K.depth - K.bevel);              // front face at z = +bevel..0 → sits on the drum surface
      digitGeo[ch] = geo; return geo;
    }
    const cRoot = new THREE.Group(); cScene.add(cRoot);   // counter pose (entrance / punch / exit)
    const cTilt = new THREE.Group(); cRoot.add(cTilt);
    const STEP = 2 * Math.PI / 10, R = CAP * K.drum;
    const cols = K.cols.map((syms, ci) => {
      const col = new THREE.Group(); cTilt.add(col);
      const items = syms.map((ch, k) => {
        if (ch === ' ') return null;
        const d = new THREE.Mesh(glyphGeo(ch), [cFace, cSide]); col.add(d); return { d, k };
      }).filter(Boolean);
      return { col, items, n: syms.length };
    });
    const cShadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.ShaderMaterial({ uniforms: { uAmt: { value: 0 } }, transparent: true, depthWrite: false, toneMapped: false,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform float uAmt; varying vec2 vUv; void main(){ vec2 q = (vUv - 0.5) * 2.0; float r = min(length(q), 1.0); float k = (exp(-r * r * 2.4) - exp(-2.4)) / (1.0 - exp(-2.4)); gl_FragColor = vec4(0.03, 0.0, 0.05, uAmt * k); }' }));
    const cBackScene = new THREE.Scene(), cBack = new THREE.Group(); cBackScene.add(cBack);
    cShadow.position.z = -K.depth * 2.5; cBack.add(cShadow);
    const cBloom = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.ShaderMaterial(Object.assign({ uniforms: { uAmt: { value: 0 }, uCol: { value: NEONLIN } }, toneMapped: false,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform float uAmt; uniform vec3 uCol; varying vec2 vUv; void main(){ vec2 q = (vUv - 0.5) * 2.0; float r = min(length(q), 1.0); float k = 0.7 * (exp(-r * r * 6.0) - exp(-6.0)) + 0.3 * (exp(-r * r * 2.2) - exp(-2.2)) / (1.0 - exp(-2.2)); gl_FragColor = vec4(uCol * uAmt * max(k, 0.0), 0.0); }' }, addBlend)));
    cBloom.position.z = -K.depth * 2; cBack.add(cBloom);
    const NC = K.cols.length, CW = ADV * NC;
    cL.rake.distance = CAP * 2.1;                       // the rake is a local glint that crosses the bevels, not a flood
    cShadow.scale.set(CW * 1.45 + CAP * 0.9, CAP * 1.7, 1); cBloom.scale.set(CW * 1.9 + CAP * 1.4, CAP * 2.0, 1);

    // ---------- choreography (pure functions of t) ----------
    const T = C.timing, N = C.count;
    const order = [];                                     // tick order: snake through the rows
    for (let r = 0; r < G.rows; r++) for (let c = 0; c < G.cols; c++) order.push(r * G.cols + (r % 2 ? G.cols - 1 - c : c));
    const ticks = [];                                     // tick times, intervals easing from first to last
    { let t = T.tick0; for (let k = 0; k < N; k++) { ticks.push(t); const u = N > 2 ? k / (N - 2) : 0; t += lerp(T.iv[0], T.iv[1], u); } }
    const tickOf = []; order.forEach((ti, k) => (tickOf[ti] = ticks[k]));
    const lock = ticks[N - 1] + T.roll;
    const PX = OW + G.gap, PY = OH + G.gap;
    const cellXY = (i) => { const r = Math.floor(i / G.cols), c = i % G.cols; return [G.cx + (c - (G.cols - 1) / 2) * PX, G.cy + (r - (G.rows - 1) / 2) * PY]; };
    const rowDir = (k) => (Math.floor(order[k] / G.cols) % 2 ? -1 : 1);
    const inAt = (i) => { const r = Math.floor(i / G.cols), c = i % G.cols; return T.tilesIn + T.inStagger * (c + r * 1.3); };
    const exitAt = (i) => T.exit + T.exitStagger * order.indexOf(i);
    const payDist = (i) => { const a = cellXY(i), b = cellXY(order[N - 1]); return Math.hypot(a[0] - b[0], a[1] - b[1]) / PX; };

    // camera: springs pre-integrated at 240 Hz toward phase targets
    const CAM = C.camera;
    function camTarget(t) {
      if (t < ticks[0] - CAM.lead - 0.35) { const [x, y] = cellXY(order[0]); return [x + CAM.intro.dx, y + CAM.intro.dy, CAM.intro.d, CAM.intro.yaw, CAM.intro.pitch]; }
      if (t < ticks[Math.min(N - 1, CAM.holdFrom)] + 0.04) {
        let k = 0; while (k < N - 1 && ticks[k] < t + CAM.lead) k++;
        const [x0, y0] = cellXY(order[k]), F = CAM.fly.follow || [1, 1];      // follow < 1 keeps the grid under the counter
        const x = G.cx + (x0 - G.cx) * F[0], y = G.cy + (y0 - G.cy) * F[1];
        return [x + CAM.fly.dx * rowDir(k), y + CAM.fly.dy, CAM.fly.d, CAM.fly.yaw * rowDir(k), CAM.fly.pitch];
      }
      const h = sstep(lock, T.exit, t);
      return [CAM.hold.x, CAM.hold.y, lerp(CAM.hold.d[0], CAM.hold.d[1], h), lerp(CAM.hold.yaw[0], CAM.hold.yaw[1], h), lerp(CAM.hold.pitch[0], CAM.hold.pitch[1], h)];
    }
    const DT = 1 / 240, NS = Math.ceil((END + 0.2) / DT) + 2, camTab = new Float32Array(NS * 5);
    {
      const st = CAM.start.slice(), v = [0, 0, 0, 0, 0], om = CAM.omega, ze = CAM.zeta;
      for (let n = 0; n < NS; n++) {
        for (let j = 0; j < 5; j++) camTab[n * 5 + j] = st[j];
        const tg = camTarget(n * DT);
        for (let j = 0; j < 5; j++) { const a = om[j] * om[j] * (tg[j] - st[j]) - 2 * ze[j] * om[j] * v[j]; v[j] += a * DT; st[j] += v[j] * DT; }
      }
    }
    function camAt(t) {
      const f = clamp(t / DT, 0, NS - 1.001), n = Math.floor(f), k = f - n, o = [];
      for (let j = 0; j < 5; j++) o.push(lerp(camTab[n * 5 + j], camTab[(n + 1) * 5 + j], k));
      return o;
    }
    let camYaw = 0, camPitch = 0;
    function poseCam(t) {
      const [x, y, dk, yaw, pitch] = camAt(t), d = dk * DIST, X = toX(x), Y = toY(y);
      gCam.position.set(X + d * Math.sin(yaw) * Math.cos(pitch), Y + d * Math.sin(pitch), d * Math.cos(yaw) * Math.cos(pitch));
      gCam.up.set(0, 1, 0); gCam.lookAt(X, Y, 0); camYaw = yaw; camPitch = pitch;
      if (els.onCam) els.onCam(x, y, dk);
    }
    // the lift: rise to the tick, then a damped settle that dips just past rest
    function lift(i, t) {
      const tk = tickOf[i], s0 = tk - T.liftIn, s1 = tk + 0.04;
      if (t < s0) return 0; if (t < s1) return outCubic((t - s0) / (s1 - s0));
      const u = t - s1; return Math.exp(-T.settle[0] * u) * Math.cos(T.settle[1] * u);
    }
    const flick = [0.85, 0.12, 1.0, 0.35, 1.0, 0.7, 1.0];   // neon ignition, per frame
    function neonAt(i, t) {
      const ig = tickOf[i] - 0.09; if (t < ig) return 0;
      const f = Math.floor((t - ig) * FPS + 1e-6); let v = f < flick.length ? flick[f] : 1;
      return v;
    }
    function poseTile(T_, t) {
      const i = T_.i, tin = inAt(i), te = exitAt(i);
      if (t < tin || t > te + T.exitDur) { T_.root.visible = false; return; }
      T_.root.visible = true;
      const p = fly(t - tin, T.inSpring[0], T.inSpring[1]), L = lift(i, t), lt = sstep(tickOf[i] - 0.13, tickOf[i] - 0.01, t);
      const e = t > te ? p3in((t - te) / T.exitDur) : 0;
      const g = T_.g;
      g.position.set(0, (1 - p) * -TH * 0.6, lerp(-C.look.inDepth, 0, p) + L * C.look.lift - e * 260);
      g.rotation.set((1 - p) * 0.95 - 0.9 * L * camPitch - 0.5 * e, (1 - p) * -0.55 + 0.9 * L * camYaw + 0.7 * e, (1 - p) * 0.12);
      const sc = (1 + 0.05 * L) * (1 - e); g.scale.set(sc, sc, sc); g.visible = sc > 0.002;
      T_.su.uBright.value = lerp(C.look.pending[0], 1, lt); T_.su.uSat.value = lerp(C.look.pending[1], 1, lt);
      // payoff ripple: a pulse runs out from the last tile across every tube (tube 1 + pulse, halo only a little)
      const bump = t > lock - 0.2 ? Math.exp(-Math.pow((t - lock - payDist(i) * T.ripple) / 0.08, 2)) : 0;
      const nv = neonAt(i, t); T_.nu.uOn.value = nv + C.look.pulse * bump; T_.su.uNeon.value = nv;
      T_.gu.uAmt.value = (nv * C.look.glow + bump * (C.look.glowPulse || 0.2)) * (1 - e);
      // glass sweeps: one as the tile lights, one on the payoff (a rake across the grid, left to right)
      const s1 = (t - (tickOf[i] - 0.06)) / 0.34, s2 = (t - (lock + 0.02 + (T_.cx - (G.cx - G.cols * PX / 2)) / (G.cols * PX) * 0.32)) / 0.34;
      if (s2 > -0.2 && s2 < 1.3) { T_.su.uSheen.value = lerp(-0.4, 1.4, s2); T_.su.uSheenAmp.value = 0.42; }
      else if (s1 > -0.2 && s1 < 1.3) { T_.su.uSheen.value = lerp(-0.4, 1.4, s1); T_.su.uSheenAmp.value = 0.32; }
      else T_.su.uSheenAmp.value = 0;
      // contact shadow on the grid plane: tightens as the tile lands, spreads and lifts away while it is raised
      const sh = T_.shadow; sh.visible = g.visible;
      sh.position.set(0, -10 - 26 * Math.max(0, L) - (1 - p) * TH * 0.6, -C.look.shadowZ + lerp(-C.look.inDepth, 0, p) * 0.98);
      const ss = (1 + 0.18 * Math.max(0, L) + (1 - p) * 0.3) * (1 - e); sh.scale.set(ss, ss, 1);
      T_.shu.uAmt.value = C.look.shadow * clamp(p, 0, 1) * (1 - 0.35 * Math.max(0, L));
      // the tick badge stamps on at the tick: drops from z +70 with a squash, overshoot and settle; pops a beat before the exit
      const b = T_.badge, bt = t - tickOf[i] - 0.02, bx = t > te - 0.05 ? p3in((t - te + 0.05) / 0.16) : 0;
      if (bt < 0 || bx >= 1) b.visible = false;
      else {
        b.visible = true;
        const k = fly(bt, 13, 22), sq = Math.exp(-14 * bt) * Math.sin(22 * bt);
        const pb = lock + payDist(i) * T.ripple, bump = 0.16 * Math.exp(-Math.pow((t - pb - 0.03) / 0.06, 2));
        const sxy = (lerp(1.7, 1, k) + 0.1 * sq + bump) * (1 - bx), sz = (lerp(1.7, 1, k) - 0.35 * sq) * (1 - bx);
        b.scale.set(sxy, sxy, Math.max(0.05, sz)); b.position.z = FRONT + 2 + (1 - k) * 70; b.rotation.z = (1 - k) * -0.5;
      }
    }
    // the counter: value(t) = ticks done, each rolled with a sprung overshoot; columns are drums
    const RD = T.roll;
    const rollE = (u) => u <= 0 ? 0 : u < RD ? 1.06 * (1 - Math.cos(Math.PI * u / RD)) / 2 : 1 + 0.06 * Math.exp(-16 * (u - RD)) * Math.cos(20 * (u - RD));
    function valueAt(t) { let v = 0; for (let k = 0; k < N; k++) v += rollE(t - ticks[k]); return v; }
    function tensAt(t) { let v = 0; for (let k = 9; k < N; k += 10) v += rollE(t - ticks[k]); return v; }
    const win = { top: 1, bot: 0 }, wv = new THREE.Vector3();
    const cBase = [toX(K.cx), toY(K.cy)];
    function poseCounter(t) {
      const tin = T.counterIn, p = fly(t - tin, 10, 11), vis = t >= tin;
      const units = valueAt(t), tens = tensAt(t);
      // punch on the lock-in: 2-frame rise, damped return; exit: recede while the window closes
      const u = t - lock, punch = u < 0 ? 0 : u < 0.066 ? u / 0.066 : Math.exp(-9 * (u - 0.066)) * Math.cos(13 * (u - 0.066));
      const ex = p3in((t - T.counterOut) / 0.26);
      cRoot.visible = vis && ex < 1;
      const shift = NC > 1 ? (ADV / 2) * (1 - Math.min(1, tens)) : 0;
      cRoot.position.set(cBase[0] + shift, cBase[1] + (1 - p) * CAP * 0.8, lerp(-1300, 0, p) + punch * K.punch - ex * 300);
      cRoot.rotation.set((1 - p) * -0.9, 0, 0);
      const sc = 1 + (K.pop || 0) * punch; cRoot.scale.set(sc, sc, sc);          // the slam: +pop in 2 frames, damped settle with an undershoot
      cBack.position.copy(cRoot.position); cBack.position.z = cRoot.position.z * 0.5; cBack.visible = cRoot.visible;
      cTilt.rotation.set(K.tilt[0], K.tilt[1], 0);
      cols.forEach((c, ci) => {
        const isUnits = ci === NC - 1, val = isUnits ? units : tens;
        c.col.position.set((ci - (NC - 1) / 2) * ADV, 0, -R);
        c.items.forEach(({ d, k }) => {
          let a = k * STEP - val * STEP; a = ((a + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
          d.visible = Math.abs(a) < STEP * 1.25;
          d.position.set(0, -R * Math.sin(a), R * Math.cos(a)); d.rotation.set(a, 0, 0);
        });
        if (!isUnits) c.col.visible = tens > 0.001;
      });
      // the clip window (world space, follows the counter pose); it closes to a line on the exit
      cScene.updateMatrixWorld(true);
      const half = CAP * (0.5 + K.window) * (1 - ex);
      const m = cTilt.matrixWorld, o = new THREE.Vector3(0, 0, 0).applyMatrix4(m), up = new THREE.Vector3(0, 1, 0).transformDirection(m);
      planes[0].setFromNormalAndCoplanarPoint(up.clone().negate(), o.clone().addScaledVector(up, half));
      planes[1].setFromNormalAndCoplanarPoint(up.clone(), o.clone().addScaledVector(up, -half));
      wv.copy(o).addScaledVector(up, half).project(cCam); win.top = (wv.y + 1) / 2;   // the window in screen uv, for the feathered mask
      wv.copy(o).addScaledVector(up, -half).project(cCam); win.bot = (wv.y + 1) / 2;
      // light: the lock-in face flash (3-frame hold), a rake across the bevels, the bloom snaps on and settles
      const FH = K.flashHold || 0.066, fl = u < 0 ? 0 : u < FH ? 1 : Math.exp(-(K.flashDecay || 16) * (u - FH));   // a 2-frame white-hot hit, back to hot pink fast
      cFace.emissiveIntensity = (K.glowBase || 0) + K.flash * fl;
      const RKD = K.rakeDur || 0.42, rk = clamp(u / RKD, 0, 1);
      cL.rake.position.set(cRoot.position.x + lerp(-CW * 1.1, CW * 1.1, rk), cRoot.position.y + CAP * 0.6, cRoot.position.z + CAP * 1.1);
      cL.rake.intensity = u < 0 || u > RKD ? 0 : K.rake * Math.sin(Math.PI * rk);
      cBloom.material.uniforms.uAmt.value = (u < 0 ? K.bloomPre * clamp(p, 0, 1) : u < 0.166 ? K.bloomPeak : lerp(K.bloomRest, K.bloomPeak, Math.exp(-5 * (u - 0.166)))) * (1 - ex);
      cShadow.material.uniforms.uAmt.value = (K.ink == null ? 0.6 : K.ink) * clamp(p, 0, 1) * (1 - ex);
    }
    function poseAt(t) { poseCam(t); tiles.forEach((T_) => poseTile(T_, t)); poseCounter(t); }

    // ---------- footage textures: the injected render frame if present, else the live <video> ----------
    function updateTextures() {
      let changed = false;
      tiles.forEach((T_) => {
        const v = T_.video, im = v.nextElementSibling;
        let src = null, key = null;
        if (im && im.classList && im.classList.contains('__render_frame__') && im.complete && im.naturalWidth > 0) { src = im; key = im.src; }
        else if (v.readyState >= 2) { src = v; key = 'v' + v.currentTime.toFixed(4); }
        if (!src) return;
        if (key !== T_.last) { T_.ctx2.drawImage(src, 0, 0, T_.cv.width, T_.cv.height); T_.tex.needsUpdate = true; T_.last = key; T_.su.uHas.value = 1; changed = true; }
      });
      return changed;
    }

    // ---------- render: shutter sub-frames into a half-float target, averaged, then one sRGB encode ----------
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
        void main(){ vec4 c = texture2D(tex, vUv); gl_FragColor = vec4(enc(c.rgb), clamp(c.a, 0.0, 1.0)); }` });
    const rtAccC = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType });
    const overMat = new THREE.ShaderMaterial({ uniforms: { tex: { value: null }, uTop: { value: 1 }, uBot: { value: 0 }, uF: { value: 0.01 } }, depthTest: false, depthWrite: false, toneMapped: false,
      blending: THREE.CustomBlending, blendEquation: THREE.AddEquation, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor, blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: 'uniform sampler2D tex; uniform float uTop, uBot, uF; varying vec2 vUv; void main(){ float m = smoothstep(uBot, uBot + uF, vUv.y) * (1.0 - smoothstep(uTop - uF, uTop, vUv.y)); gl_FragColor = texture2D(tex, vUv) * m; }' });
    const qScene = new THREE.Scene(), quad = new THREE.Mesh(qGeo, accMat); quad.frustumCulled = false; qScene.add(quad);
    function accumulate(n, t, pose, scene, cam, target) {
      renderer.setRenderTarget(target); renderer.setClearColor(0x000000, 0); renderer.clear(true, true, true);
      for (let k = 0; k < n; k++) {
        pose(n <= 1 ? t : Math.max(0, t + ((k + 0.5) / n - 0.5) * SHUT));
        renderer.setRenderTarget(rtSub); renderer.clear(true, true, true); renderer.render(scene, cam);
        quad.material = accMat; accMat.uniforms.tex.value = rtSub.texture; accMat.uniforms.uW.value = 1 / n;
        renderer.setRenderTarget(target); renderer.render(qScene, qCam);
      }
    }
    const poseGrid = (ts) => { poseCam(ts); tiles.forEach((T_) => poseTile(T_, ts)); };
    const SHUT = (C.look.shutter || 0.5) / FPS;
    let lastT = -1;
    function renderAt(t) {
      t = clamp(t, 0, END);
      const changed = updateTextures();
      if (!changed && Math.abs(t - lastT) < 1e-6) return;     // same frame, same footage: nothing to redraw
      lastT = t;
      const still = t >= lock + T.still && t <= T.exit - 0.04;
      const n = still ? 1 : C.look.samples, nc = still ? 1 : (K.samples || 24);
      accumulate(n, t, poseGrid, gScene, gCam, rtAcc);
      accumulate(nc, t, poseCounter, cScene, cCam, rtAccC);
      poseGrid(t); poseCounter(t);
      renderer.setRenderTarget(rtAcc); renderer.render(cBackScene, cCam);            // ink backing + bloom, over the grid
      quad.material = overMat; overMat.uniforms.tex.value = rtAccC.texture;          // the digits, feathered at the window edges
      overMat.uniforms.uTop.value = win.top; overMat.uniforms.uBot.value = win.bot; overMat.uniforms.uF.value = CAP * (K.feather || 0.1) / H;
      renderer.render(qScene, qCam);
      quad.material = outMat; outMat.uniforms.tex.value = rtAcc.texture;
      renderer.setRenderTarget(null); renderer.setClearColor(0x000000, 0); renderer.clear(true, true, true); renderer.render(qScene, qCam);
    }

    // build the grid
    for (let i = 0; i < G.cols * G.rows; i++) { const [x, y] = cellXY(i); addTile(i, x, y, els.videos[i]); }
    return { renderAt, ticks, lock, order, cellXY, tiles, camAt, DIST };
  };
})();
