/* P3: shared Three.js stage for the price-tag component (r160, global THREE). Identical copy in a/media and b/media.
   - Screen-space world: 1 unit = 1 px on the z = 0 plane; x right from the canvas centre, y up.
   - Studio environment (PMREM) for clearcoat / metal reflections, ACES-free: tone shaping happens in the composite.
   - Post: MSAA scene render, optional sub-frame accumulation (true motion blur on fast travel), HDR bloom,
     a uniform ink outline around everything (the creator-caption edge), and a soft offset contact shadow.
   Seek-safe: nothing animates on its own; callers draw a frame for a time t. */
(function () {
  const srgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.substr(i, 2), 16) / 255);
  const toLin = (x) => (x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
  const lin = (hex) => { const a = srgb(hex).map(toLin); return new THREE.Color(a[0], a[1], a[2]); };
  const v3 = (c) => "vec3(" + c.r.toFixed(4) + "," + c.g.toFixed(4) + "," + c.b.toFixed(4) + ")";

  // SVG path (y-down font units) -> THREE.Shape[] in world units. map(x, y) returns [X, Y] (y up).
  function shapesFromPath(d, map, curveSeg) {
    const sp = new THREE.ShapePath(), re = /([MLQCZ])([^MLQCZ]*)/g; let m;
    while ((m = re.exec(d))) {
      const n = m[2].trim() ? m[2].trim().split(/[\s,]+/).map(Number) : [], P = [];
      for (let i = 0; i < n.length; i += 2) { const q = map(n[i], n[i + 1]); P.push(q[0], q[1]); }
      if (m[1] === "M") sp.moveTo(P[0], P[1]); else if (m[1] === "L") sp.lineTo(P[0], P[1]);
      else if (m[1] === "Q") sp.quadraticCurveTo(P[0], P[1], P[2], P[3]); else if (m[1] === "C") sp.bezierCurveTo(P[0], P[1], P[2], P[3], P[4], P[5]);
    }
    const MIN = 0.5;
    const clean = (pts) => { const out = []; for (const p of pts) if (!out.length || p.distanceTo(out[out.length - 1]) > MIN) out.push(p);
      while (out.length > 3 && out[0].distanceTo(out[out.length - 1]) <= MIN) out.pop(); return out; };
    return sp.toShapes(false).map((sh) => {
      const s2 = new THREE.Shape(clean(sh.getPoints(curveSeg || 10)));
      sh.holes.forEach((h) => s2.holes.push(new THREE.Path(clean(h.getPoints(curveSeg || 10)))));
      return s2;
    });
  }

  function Stage(W, H, o) {
    o = o || {};
    const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
    canvas.style.cssText = "position:absolute;left:0;top:0;width:" + W + "px;height:" + H + "px;display:block";
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;
    renderer.localClippingEnabled = true;
    renderer.autoClear = false;   // the accumulation target must not be cleared between sub-frame passes; targets are cleared explicitly
    if (o.shadows) { renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; }
    const scene = new THREE.Scene();
    const FOV = o.fov || 18, DIST = (H / 2) / Math.tan((FOV / 2) * Math.PI / 180);
    const camera = new THREE.PerspectiveCamera(FOV, W / H, 20, DIST * 3);
    camera.position.set(0, 0, DIST); camera.lookAt(0, 0, 0);
    if (o.principal) camera.setViewOffset(W, H, W / 2 - o.principal[0], H / 2 - o.principal[1], W, H);

    // ---------- studio environment: top softbox, a crisp front strip, a hot back bar, warm or neutral floor ----------
    const warm = o.warm == null ? 0.5 : o.warm;
    const envScene = new THREE.Scene();
    const top = [1.9, 1.82 - 0.1 * warm, 1.72 - 0.27 * warm], hor = [0.5 + 0.05 * warm, 0.46, 0.42 - 0.12 * warm], low = [0.08 + 0.02 * warm, 0.07, 0.06 - 0.03 * warm];
    const f3 = (a) => "vec3(" + a.map((x) => x.toFixed(3)).join(",") + ")";
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = " + f3(top) + ", hor = " + f3(hor) + ", low = " + f3(low) + ";" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.0, 0.7, y)) : mix(hor, low, smoothstep(0.0, 0.5, -y));" +
        " c *= 0.75 + 0.35 * smoothstep(-0.2, 1.0, vP.z); gl_FragColor = vec4(c, 1.0); }"
    })));
    const panel = (w, h, x, y, z, k) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k * (1 - 0.04 * warm), k * (1 - 0.1 * warm)), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); envScene.add(m); };
    panel(40, 12, 0, 30, 24, 2.4);
    panel(30, 2.2, 0, 9, 40, 3.0);
    panel(44, 6, 0, 26, -22, 3.2);
    panel(6, 26, -34, 4, 22, 1.4);
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(envScene, 0.0, 0.1, 200).texture;

    // ---------- post ----------
    const HF = renderer.capabilities.isWebGL2 && renderer.extensions.has("EXT_color_buffer_float");
    const TYPE = HF ? THREE.HalfFloatType : THREE.UnsignedByteType;
    const rtMain = new THREE.WebGLRenderTarget(W, H, { type: TYPE, samples: renderer.capabilities.isWebGL2 ? 4 : 0 });
    const RTO = { type: TYPE, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false };
    const rtAcc = new THREE.WebGLRenderTarget(W, H, RTO);
    const LV = [2, 4, 8].map((d) => [new THREE.WebGLRenderTarget(W / d, H / d, RTO), new THREE.WebGLRenderTarget(W / d, H / d, RTO)]);
    const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), postScene = new THREE.Scene();
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2)); quad.frustumCulled = false; postScene.add(quad);
    const VS = "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }";
    const post = (u, fs, blend) => new THREE.ShaderMaterial({ uniforms: u, vertexShader: VS, fragmentShader: fs, depthTest: false, depthWrite: false,
      blending: blend ? THREE.CustomBlending : THREE.NoBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneFactor,
      blendEquation: THREE.AddEquation, toneMapped: false });
    const accMat = post({ tSrc: { value: null }, uW: { value: 1 } }, "uniform sampler2D tSrc; uniform float uW; varying vec2 vUv; void main(){ gl_FragColor = texture2D(tSrc, vUv) * uW; }", true);
    const brightMat = post({ tSrc: { value: null }, uTh: { value: 1.0 } },
      "uniform sampler2D tSrc; uniform float uTh; varying vec2 vUv; void main(){ vec4 c = texture2D(tSrc, vUv); vec3 u = c.a > 0.004 ? c.rgb / c.a : vec3(0.0);" +
      " float l = max(u.r, max(u.g, u.b)); gl_FragColor = vec4(c.rgb * smoothstep(uTh, uTh + 0.8, l), c.a); }");
    const blurMat = post({ tSrc: { value: null }, uDir: { value: new THREE.Vector2() } },
      "uniform sampler2D tSrc; uniform vec2 uDir; varying vec2 vUv; void main(){ vec4 c = texture2D(tSrc, vUv) * 0.2270270270;" +
      " c += (texture2D(tSrc, vUv + uDir * 1.3846153846) + texture2D(tSrc, vUv - uDir * 1.3846153846)) * 0.3162162162;" +
      " c += (texture2D(tSrc, vUv + uDir * 3.2307692308) + texture2D(tSrc, vUv - uDir * 3.2307692308)) * 0.0702702703; gl_FragColor = c; }");
    const NT = 32, taps = [];
    for (let i = 0; i < NT; i++) taps.push("vec2(" + Math.cos(i / NT * 6.2832).toFixed(4) + "," + Math.sin(i / NT * 6.2832).toFixed(4) + ")");
    const compMat = post({
      tMain: { value: null }, t1: { value: null }, t2: { value: null }, t3: { value: null },
      uPx: { value: new THREE.Vector2(1 / W, 1 / H) }, uInk: { value: o.inkPx || 0 }, uInkA: { value: o.inkAlpha == null ? 1 : o.inkAlpha }, uInkC: { value: lin(o.inkColor || "#0b0c10") },
      uBloom: { value: 0.3 }, uShadow: { value: o.shadow == null ? 0.5 : o.shadow }, uShOff: { value: new THREE.Vector2(o.shadowOff ? o.shadowOff[0] : 0, o.shadowOff ? o.shadowOff[1] : 8) }
    }, [
      "uniform sampler2D tMain, t1, t2, t3; uniform vec2 uPx, uShOff; uniform float uInk, uInkA, uBloom, uShadow; uniform vec3 uInkC; varying vec2 vUv;",
      "vec3 shoulder(vec3 x){ return mix(x, 0.82 + 0.18 * (1.0 - exp(-max(x - 0.82, 0.0) / 0.18)), step(0.82, x)); }",
      "vec3 toSRGB(vec3 c){ c = clamp(c, 0.0, 1.0); return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }",
      "const vec2 TAPS[" + NT + "] = vec2[](" + taps.join(",") + ");",
      "void main(){",
      "  vec4 m = texture2D(tMain, vUv);",
      "  float dil = m.a;",
      "  if (uInk > 0.0) { for (int i = 0; i < " + NT + "; i++) { dil = max(dil, texture2D(tMain, vUv + TAPS[i] * uPx * uInk).a); dil = max(dil, texture2D(tMain, vUv + TAPS[i] * uPx * uInk * 0.55).a); } }",
      "  dil *= uInkA;",
      "  float sh = (texture2D(t2, vUv + uShOff * uPx).a * 0.75 + texture2D(t3, vUv + uShOff * uPx * 1.8).a * 0.55) * uShadow;",
      "  vec3 wc = m.a > 0.001 ? toSRGB(shoulder(m.rgb / m.a)) : vec3(0.0);",
      "  float a = clamp(m.a, 0.0, 1.0); vec3 col = wc * a;",
      "  col += toSRGB(uInkC) * dil * (1.0 - a); a += dil * (1.0 - a);",
      "  a += clamp(sh, 0.0, 0.8) * (1.0 - a);",
      "  vec3 b = (texture2D(t1, vUv).rgb + texture2D(t2, vUv).rgb * 0.8 + texture2D(t3, vUv).rgb * 0.6) * uBloom;",
      "  col += toSRGB(1.0 - exp(-b)) * 0.9;",
      "  gl_FragColor = vec4(col, a);",
      "}"].join("\n"));
    function pass(mat, target) { quad.material = mat; renderer.setRenderTarget(target); renderer.render(postScene, postCam); }

    // render(K, setSample(k, K), params): K sub-frame samples averaged (motion blur), then bloom + ink + shadow to the canvas.
    function render(K, setSample, p) {
      p = p || {};
      renderer.setRenderTarget(rtAcc); renderer.setClearColor(0x000000, 0); renderer.clear();
      for (let k = 0; k < K; k++) {
        setSample(k, K);
        renderer.setRenderTarget(rtMain); renderer.clear(); renderer.render(scene, camera);
        accMat.uniforms.tSrc.value = rtMain.texture; accMat.uniforms.uW.value = 1 / K; pass(accMat, rtAcc);
      }
      brightMat.uniforms.tSrc.value = rtAcc.texture; brightMat.uniforms.uTh.value = p.threshold == null ? 1.2 : p.threshold; pass(brightMat, LV[0][0]);
      let src = LV[0][0];
      LV.forEach(([A, B]) => {
        blurMat.uniforms.tSrc.value = src.texture; blurMat.uniforms.uDir.value.set(1 / A.width, 0); pass(blurMat, B);
        blurMat.uniforms.tSrc.value = B.texture; blurMat.uniforms.uDir.value.set(0, 1 / A.height); pass(blurMat, A);
        src = A;
      });
      const u = compMat.uniforms;
      u.tMain.value = rtAcc.texture; u.t1.value = LV[0][0].texture; u.t2.value = LV[1][0].texture; u.t3.value = LV[2][0].texture;
      if (p.bloom != null) u.uBloom.value = p.bloom;
      if (p.shadow != null) u.uShadow.value = p.shadow;
      if (p.ink != null) u.uInk.value = p.ink;
      pass(compMat, null);
    }
    return { canvas, renderer, scene, camera, render, W, H };
  }

  window.P3 = { Stage, shapesFromPath, lin, srgb, v3 };
})();
