/* Emoji3D: a small seek-safe Three.js stage for 3D emoji stickers (GTA-niche 17 Emoji pop).
 * World units are canvas pixels (y up, so a canvas point (x, y) is world (x, -y, 0)); a long lens keeps perspective gentle.
 * The stage renders linear HDR into an MSAA half-float target, can average N sub-frame samples (motion blur), runs a small
 * bloom on the hot speculars, then tone-maps (ACES) and writes sRGB with premultiplied alpha onto a transparent canvas.
 * Nothing here runs on its own clock: the page calls stage.frame(t, update, samples) from its GSAP proxy and hf-seek. */
(function (root) {
  "use strict";
  const T = root.THREE;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const EASES = {};
  const ease = (n) => (n ? (EASES[n] || (EASES[n] = root.gsap.parseEase(n))) : (x) => x);
  /** kf(t, [[t0, v0], [t1, v1, "ease"], ...]): piecewise keyframes; the ease belongs to the segment ending at that key. */
  function kf(t, k) {
    if (t <= k[0][0]) return k[0][1];
    for (let i = 1; i < k.length; i++) if (t <= k[i][0]) {
      const p = (t - k[i - 1][0]) / Math.max(1e-6, k[i][0] - k[i - 1][0]);
      return lerp(k[i - 1][1], k[i][1], ease(k[i][2])(p));
    }
    return k[k.length - 1][1];
  }

  // ---------- an indexed icosphere (no poles, no seam: smooth normals everywhere) ----------
  function icoSphere(detail) {
    const g = new T.IcosahedronGeometry(1, detail), a = g.attributes.position.array;
    const map = new Map(), pos = [], idx = [];
    for (let i = 0; i < a.length; i += 3) {
      const key = Math.round(a[i] * 1e5) + "," + Math.round(a[i + 1] * 1e5) + "," + Math.round(a[i + 2] * 1e5);
      let j = map.get(key);
      if (j === undefined) { j = pos.length / 3; map.set(key, j); pos.push(a[i], a[i + 1], a[i + 2]); }
      idx.push(j);
    }
    g.dispose();
    const out = new T.BufferGeometry();
    out.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
    out.setIndex(idx);
    return out;
  }

  // ---------- the studio the gloss reflects ----------
  function studioEnv(renderer, o) {
    o = o || {};
    const es = new T.Scene();
    const sky = new T.Color(o.sky || "#f2f5ff"), hor = new T.Color(o.horizon || "#a8a094"), gnd = new T.Color(o.ground || "#2a2420");
    const dome = new T.Mesh(new T.SphereGeometry(50, 64, 32), new T.ShaderMaterial({
      side: T.BackSide, depthWrite: false,
      uniforms: { sky: { value: sky }, hor: { value: hor }, gnd: { value: gnd }, skyI: { value: o.skyI || 1.15 } },
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: [
        "uniform vec3 sky, hor, gnd; uniform float skyI; varying vec3 vP;",
        "void main(){ float y = vP.y; vec3 c = y > 0.0 ? mix(hor, sky * skyI, pow(y, 0.55)) : mix(hor, gnd, pow(-y, 0.45));",
        "  gl_FragColor = vec4(c, 1.0); }"].join("\n")
    }));
    es.add(dome);
    const hdr = (r, g, b) => new T.MeshBasicMaterial({ color: new T.Color(r, g, b), side: T.DoubleSide });
    (o.boxes || [
      { w: 30, h: 18, pos: [-14, 30, 22], c: [o.boxI || 5, (o.boxI || 5) * 0.97, (o.boxI || 5) * 0.92] },     // big soft key box, top-left front
      { w: 6, h: 34, pos: [36, 6, 10], c: [2.6, 2.8, 3.2] },     // cool strip, right
      { w: 40, h: 8, pos: [0, -30, 24], c: [0.55, 0.45, 0.35] }   // warm floor bounce
    ]).forEach((b) => {
      const m = new T.Mesh(new T.PlaneGeometry(b.w, b.h), hdr(b.c[0], b.c[1], b.c[2]));
      m.position.set(b.pos[0], b.pos[1], b.pos[2]); m.lookAt(0, 0, 0); es.add(m);
    });
    const pm = new T.PMREMGenerator(renderer);
    const tex = pm.fromScene(es, 0.015).texture;
    pm.dispose();
    return tex;
  }

  // ---------- the stage ----------
  function Stage(canvas, W, H, o) {
    o = o || {};
    const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = o.toneMapping == null ? T.ACESFilmicToneMapping : o.toneMapping; renderer.toneMappingExposure = o.exposure || 1.1;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.VSMShadowMap;
    renderer.autoClear = false;

    const scene = new T.Scene();
    scene.environment = studioEnv(renderer, o.env);
    const fov = o.fov || 14, D = H / 2 / Math.tan(fov * Math.PI / 360);
    const camera = new T.PerspectiveCamera(fov, W / H, D - 4000, D + 4000);
    camera.position.set(W / 2, -H / 2, D); camera.lookAt(W / 2, -H / 2, 0);

    // lights (directions are set per frame relative to the subject by aim())
    const key = new T.DirectionalLight(o.keyColor || 0xfff2e2, o.key == null ? 2.2 : o.key);
    const rim = new T.DirectionalLight(o.rimColor || 0xffd8a8, o.rim == null ? 1.4 : o.rim);
    const hemi = new T.HemisphereLight(o.hemiSky || 0xe4ecff, o.hemiGround || 0x5a4a3c, o.hemi == null ? 0.9 : o.hemi);
    const shadowLight = new T.DirectionalLight(0xffffff, 0.0001);
    shadowLight.castShadow = true;
    const sh = shadowLight.shadow, SS = o.shadowSize || 700;
    sh.mapSize.set(1024, 1024); sh.camera.left = -SS; sh.camera.right = SS; sh.camera.top = SS; sh.camera.bottom = -SS;
    sh.camera.near = 10; sh.camera.far = 6000; sh.radius = o.shadowRadius || 14; sh.blurSamples = 24; sh.bias = -0.0004;
    [key, rim, shadowLight].forEach((l) => { scene.add(l); scene.add(l.target); });
    scene.add(hemi);
    const shadowPlane = new T.Mesh(new T.PlaneGeometry(W * 3, H * 3), new T.ShadowMaterial({ opacity: o.shadowOpacity == null ? 0.3 : o.shadowOpacity, color: 0x0b0806 }));
    shadowPlane.position.set(W / 2, -H / 2, o.shadowZ == null ? -260 : o.shadowZ); shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    const dirs = { key: new T.Vector3(-0.55, 0.75, 0.62), rim: new T.Vector3(0.7, 0.35, -0.6), shadow: new T.Vector3(-0.22, 0.42, 1) };
    function aim(cx, cy) { // cx, cy in canvas px: the point the lights look at
      const c = new T.Vector3(cx, -cy, 0);
      [[key, dirs.key, 1500], [rim, dirs.rim, 1500], [shadowLight, dirs.shadow, 2500]].forEach(([l, d, dist]) => {
        l.target.position.copy(c); l.position.copy(c).addScaledVector(d.clone().normalize(), dist); l.target.updateMatrixWorld();
      });
    }

    // ---------- HDR targets, accumulation, bloom ----------
    const HALF = T.HalfFloatType;
    const rtS = new T.WebGLRenderTarget(W, H, { type: HALF, samples: 4 });
    const rtA = new T.WebGLRenderTarget(W, H, { type: HALF, depthBuffer: false });
    const RTO = { type: HALF, minFilter: T.LinearFilter, magFilter: T.LinearFilter, depthBuffer: false };
    const LV = [2, 4, 8].map((d) => [new T.WebGLRenderTarget(Math.ceil(W / d), Math.ceil(H / d), RTO), new T.WebGLRenderTarget(Math.ceil(W / d), Math.ceil(H / d), RTO)]);
    const postCam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1), postScene = new T.Scene();
    const quad = new T.Mesh(new T.PlaneGeometry(2, 2)); quad.frustumCulled = false; postScene.add(quad);
    const VS = "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }";
    const post = (u, fs, extra) => new T.ShaderMaterial(Object.assign({ uniforms: u, vertexShader: VS, fragmentShader: fs, depthTest: false, depthWrite: false, blending: T.NoBlending }, extra || {}));
    const accMat = post({ tSrc: { value: null }, uW: { value: 1 } },
      "uniform sampler2D tSrc; uniform float uW; varying vec2 vUv; void main(){ gl_FragColor = texture2D(tSrc, vUv) * uW; }",
      { blending: T.CustomBlending, blendSrc: T.OneFactor, blendDst: T.OneFactor, blendSrcAlpha: T.OneFactor, blendDstAlpha: T.OneFactor });
    const brightMat = post({ tSrc: { value: null }, uTh: { value: o.bloomThreshold || 1.15 }, uKnee: { value: 0.8 } }, [
      "uniform sampler2D tSrc; uniform float uTh, uKnee; varying vec2 vUv;",
      "void main(){ vec4 c = texture2D(tSrc, vUv); float l = max(c.r, max(c.g, c.b));",
      "  float k = smoothstep(uTh, uTh + uKnee, l); gl_FragColor = vec4(c.rgb * k, 1.0); }"].join("\n"));
    const blurMat = post({ tSrc: { value: null }, uDir: { value: new T.Vector2() } }, [
      "uniform sampler2D tSrc; uniform vec2 uDir; varying vec2 vUv;",
      "void main(){ vec3 c = texture2D(tSrc, vUv).rgb * 0.2270270270;",
      "  c += (texture2D(tSrc, vUv + uDir * 1.3846153846).rgb + texture2D(tSrc, vUv - uDir * 1.3846153846).rgb) * 0.3162162162;",
      "  c += (texture2D(tSrc, vUv + uDir * 3.2307692308).rgb + texture2D(tSrc, vUv - uDir * 3.2307692308).rgb) * 0.0702702703;",
      "  gl_FragColor = vec4(c, 1.0); }"].join("\n"));
    const compMat = post({ tMain: { value: null }, t1: { value: null }, t2: { value: null }, t3: { value: null }, uStr: { value: 0.35 } }, [
      "uniform sampler2D tMain, t1, t2, t3; uniform float uStr; varying vec2 vUv;",
      "void main(){ vec4 m = texture2D(tMain, vUv);",
      "  vec3 b = texture2D(t1, vUv).rgb + texture2D(t2, vUv).rgb * 0.8 + texture2D(t3, vUv).rgb * 0.6;",
      "  vec3 rgb = m.rgb + b * uStr;",
      "  gl_FragColor = vec4(rgb, m.a);",
      "  #include <tonemapping_fragment>",
      "  #include <colorspace_fragment>",
      "  gl_FragColor.a = m.a;",
      "}"].join("\n"), { toneMapped: true });
    function pass(mat, target, clear) { quad.material = mat; renderer.setRenderTarget(target); if (clear) { renderer.setClearColor(0, 0); renderer.clear(); } renderer.render(postScene, postCam); }

    /** frame(t, update, samples, shutter): update(time) poses the scene; samples > 1 averages sub-frames over shutter (frames). */
    function frame(t, update, samples, shutter, bloom) {
      const n = Math.max(1, samples | 0), sh2 = (shutter == null ? 0.5 : shutter) / 30;
      renderer.setRenderTarget(rtA); renderer.setClearColor(0, 0); renderer.clear();
      for (let i = 0; i < n; i++) {
        const ts = n === 1 ? t : t - sh2 * (i / (n - 1) - 0.5);
        update(ts);
        renderer.setRenderTarget(rtS); renderer.setClearColor(0, 0); renderer.clear();
        renderer.render(scene, camera);
        accMat.uniforms.tSrc.value = rtS.texture; accMat.uniforms.uW.value = 1 / n;
        pass(accMat, rtA, false);
      }
      update(t);
      brightMat.uniforms.tSrc.value = rtA.texture; pass(brightMat, LV[0][0], true);
      let src = LV[0][0];
      LV.forEach(([A, B]) => {
        blurMat.uniforms.tSrc.value = src.texture; blurMat.uniforms.uDir.value.set(1 / A.width, 0); pass(blurMat, B, true);
        blurMat.uniforms.tSrc.value = B.texture; blurMat.uniforms.uDir.value.set(0, 1 / A.height); pass(blurMat, A, true);
        src = A;
      });
      compMat.uniforms.tMain.value = rtA.texture;
      compMat.uniforms.t1.value = LV[0][0].texture; compMat.uniforms.t2.value = LV[1][0].texture; compMat.uniforms.t3.value = LV[2][0].texture;
      compMat.uniforms.uStr.value = bloom == null ? 0.3 : bloom;
      pass(compMat, null, true);
    }

    return { renderer, scene, camera, key, rim, hemi, shadowLight, shadowPlane, dirs, aim, frame, W, H };
  }

  // ---------- a painted, displaced sphere (the emoji face) ----------
  /** faceSphere({detail, shape(x,y,z)->[x,y,z], draw(ctx, hctx, S, params), depth, tex:2048, hmap:512, blur:6,
   *   vcolor(x,y,z)->[r,g,b], material:{...}})  ->  { mesh, geometry, material, update(params) }
   * The face is painted in front-projected unit-sphere coordinates: canvas px = ((x+1)/2 * S, (1-y)/2 * S).
   * The height canvas is mid-grey (128) at the surface; darker dents in, lighter raises out (by `depth` units at 0/255). */
  function faceSphere(o) {
    const geo = icoSphere(o.detail || 96);
    const P = geo.attributes.position.array, N = P.length / 3;
    const base = Float32Array.from(P), shaped = new Float32Array(P.length);
    const uv = new Float32Array(N * 2), col = new Float32Array(N * 3), front = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const x = base[i * 3], y = base[i * 3 + 1], z = base[i * 3 + 2];
      uv[i * 2] = x * 0.5 + 0.5; uv[i * 2 + 1] = y * 0.5 + 0.5;
      const s = o.shape ? o.shape(x, y, z) : [x, y, z];
      shaped[i * 3] = s[0]; shaped[i * 3 + 1] = s[1]; shaped[i * 3 + 2] = s[2];
      const c = o.vcolor ? o.vcolor(x, y, z) : [1, 1, 1];
      col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2];
      front[i] = sstep(0.04, 0.32, z);
    }
    geo.setAttribute("uv", new T.Float32BufferAttribute(uv, 2));
    geo.setAttribute("color", new T.Float32BufferAttribute(col, 3));
    const S = o.tex || 2048, HS = o.hmap || 512;
    const cC = document.createElement("canvas"); cC.width = cC.height = S;
    const hC = document.createElement("canvas"); hC.width = hC.height = S;
    const hS = document.createElement("canvas"); hS.width = hS.height = HS;
    const ctx = cC.getContext("2d"), hctx = hC.getContext("2d"), sctx = hS.getContext("2d", { willReadFrequently: true });
    const tex = new T.CanvasTexture(cC); tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = 8;
    const mat = new T.MeshPhysicalMaterial(Object.assign({ map: tex, vertexColors: true, roughness: 0.4, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1 }, o.material || {}));
    // optional coat map: R = clearcoat amount, G = roughness (material roughness is then the max)
    let kC = null, kctx = null, ktex = null;
    if (o.drawCoat) {
      kC = document.createElement("canvas"); kC.width = kC.height = 1024; kctx = kC.getContext("2d");
      ktex = new T.CanvasTexture(kC); ktex.colorSpace = T.NoColorSpace;
      mat.clearcoatMap = ktex; mat.roughnessMap = ktex; mat.roughness = 1;
    }
    const mesh = new T.Mesh(geo, mat);
    mesh.castShadow = true;
    const depth = o.depth || 0.1;
    let lastKey = null;
    function update(params) {
      const k = JSON.stringify(params || {});
      if (k === lastKey) return; lastKey = k;
      ctx.clearRect(0, 0, S, S); hctx.fillStyle = "#808080"; hctx.fillRect(0, 0, S, S);
      o.draw(ctx, hctx, S, params || {});
      tex.needsUpdate = true;
      if (kctx) { kctx.filter = "none"; kctx.clearRect(0, 0, 1024, 1024); o.drawCoat(kctx, 1024, params || {}); ktex.needsUpdate = true; }
      sctx.filter = "blur(" + (o.blur == null ? 3 : o.blur) + "px)";
      sctx.fillStyle = "#808080"; sctx.fillRect(0, 0, HS, HS);
      sctx.drawImage(hC, 0, 0, HS, HS);
      sctx.filter = "none";
      const d = sctx.getImageData(0, 0, HS, HS).data;
      const sample = (u, v) => {
        const fx = clamp(u * HS - 0.5, 0, HS - 1.001), fy = clamp((1 - v) * HS - 0.5, 0, HS - 1.001);
        const x0 = fx | 0, y0 = fy | 0, tx = fx - x0, ty = fy - y0;
        const g = (xx, yy) => d[(yy * HS + xx) * 4];
        return lerp(lerp(g(x0, y0), g(x0 + 1, y0), tx), lerp(g(x0, y0 + 1), g(x0 + 1, y0 + 1), tx), ty);
      };
      for (let i = 0; i < N; i++) {
        let h = 0;
        if (front[i] > 0) h = (sample(uv[i * 2], uv[i * 2 + 1]) - 128) / 127 * depth * front[i];
        const x = shaped[i * 3], y = shaped[i * 3 + 1], z = shaped[i * 3 + 2];
        const l = Math.hypot(x, y, z) || 1;
        P[i * 3] = x + x / l * h; P[i * 3 + 1] = y + y / l * h; P[i * 3 + 2] = z + z / l * h;
      }
      geo.attributes.position.needsUpdate = true;
      geo.computeVertexNormals();
      geo.computeBoundingSphere();
    }
    return { mesh, geometry: geo, material: mat, update, canvas: cC };
  }

  /** a smooth deformed icosphere for secondary parts (jaw, etc.) */
  function blob(detail, shape) {
    const g = icoSphere(detail), P = g.attributes.position.array;
    for (let i = 0; i < P.length; i += 3) { const s = shape(P[i], P[i + 1], P[i + 2]); P[i] = s[0]; P[i + 1] = s[1]; P[i + 2] = s[2]; }
    g.computeVertexNormals();
    return g;
  }

  root.Emoji3D = { Stage, faceSphere, blob, icoSphere, kf, clamp, lerp, sstep, ease };
})(window);
