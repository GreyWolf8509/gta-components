/* Pill3D: the source pill as real geometry (Three.js r160, global THREE).
   A hot-pink candy-gloss capsule (a stadium extruded with a deep, rounded bevel so it reads as a moulded pill), a
   dark plum glass lens at its left end ringed by a polished chrome bezel, and our own link mark inside the lens: two
   chrome stadium rings that really interlock (the second ring is tilted about its axis so it weaves over and under).
   The capsule stretches from a disc to full length in the vertex shader (caps translate, the straight run scales),
   so the moulded ends never distort. The printed text is crisp DOM, pinned to the face with project().
   Light: a PMREM studio environment (softboxes the clearcoat reflects), a raking key, a hemisphere fill, a soft
   specular band for the payoff sweep, a candy rim glow, a hot rim on the bezel and a lit lens on the payoff.
   Post: sub-frame motion blur, HDR bloom (threshold-gated, only hot parts bloom) and a soft contact shadow.
   Seek-safe: nothing animates on its own; renderAt(t) draws time t from o.pose(t, frameTime).
   Pipeline adapted from the library's card / plate renderers. Identical file in a/ and b/. */
(function () {
  const srgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.substr(i, 2), 16) / 255);
  const toLin = (x) => (x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
  const lin = (hex) => { const a = srgb(hex).map(toLin); return new THREE.Color(a[0], a[1], a[2]); };
  const v3 = (c) => "vec3(" + c.r.toFixed(4) + "," + c.g.toFixed(4) + "," + c.b.toFixed(4) + ")";
  const f3 = (x) => (+x).toFixed(4);
  let KEY = 0;

  const MIN_SEG = 0.2;
  function clean(pts) {
    const out = []; for (const p of pts) if (!out.length || p.distanceTo(out[out.length - 1]) > MIN_SEG) out.push(p);
    while (out.length > 3 && out[0].distanceTo(out[out.length - 1]) <= MIN_SEG) out.pop(); return out;
  }
  // a stadium (capsule outline): straight half-length a, cap radius r, centred on the origin, CCW
  function stadium(a, r, seg, cx) {
    cx = cx || 0; const pts = [];
    for (let k = 0; k <= seg; k++) { const an = -Math.PI / 2 + Math.PI * k / seg; pts.push(new THREE.Vector2(cx + a + r * Math.cos(an), r * Math.sin(an))); }
    for (let k = 0; k <= seg; k++) { const an = Math.PI / 2 + Math.PI * k / seg; pts.push(new THREE.Vector2(cx - a + r * Math.cos(an), r * Math.sin(an))); }
    return clean(pts);
  }
  function circle(r, seg) { const p = []; for (let k = 0; k < seg; k++) { const a = k / seg * Math.PI * 2; p.push(new THREE.Vector2(r * Math.cos(a), r * Math.sin(a))); } return p; }

  window.Pill3D = function (o) {
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

    // ---------- environment: a studio for the clearcoat and chrome (softboxes, a gloss strip, a hot back bar) ----------
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(1.7,1.66,1.64), hor = vec3(0.34,0.30,0.33), low = vec3(0.035,0.026,0.032);" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.05, 0.75, y)) : mix(hor, low, smoothstep(0.0, 0.4, -y));" +
        " c *= 0.7 + 0.4 * smoothstep(-0.2, 1.0, vP.z); gl_FragColor = vec4(c, 1.0); }"
    })));
    const panel = (w, h, x, y, z, k) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k * 0.97, k * 0.98), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); envScene.add(m); };
    panel(40, 10, 0, 30, 24, 2.4);      // big softbox above, in front: lights the top bevel
    const GL = o.gloss || { elev: 2.2, span: 1.6, k: 4.2 }, tg = (d) => Math.tan(d * Math.PI / 180) * 40;
    panel(70, tg(GL.elev + GL.span / 2) - tg(GL.elev - GL.span / 2), 0, tg(GL.elev), 40, GL.k);   // the gloss band on the upper face
    panel(46, 6, 0, 26, -22, 3.2);      // hot bar up and behind: the rounded top edge reads as a lit lip
    panel(4, 30, -34, 4, 18, 1.8);      // tall strip at the left
    panel(4, 30, 34, -2, 18, 0.9);      // weaker strip at the right
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(envScene, 0.0, 0.1, 200).texture;

    // ---------- lights ----------
    const key = new THREE.DirectionalLight(0xfff1e6, 2.0); scene.add(key); scene.add(key.target);
    const hemi = new THREE.HemisphereLight(0xfff0f6, 0x1a0e14, 0.6); scene.add(hemi);

    // ---------- materials: one shader patch for gradients, the stretch, the sweep, candy rim, hot rim and lens glow ----------
    const GU = { uSpecX: { value: -1e5 }, uSpecW: { value: 100 }, uSpecAmp: { value: 0 }, uA: { value: 0 } };
    const A0 = Math.max(1, (o.w - o.h) / 2);       // the straight half-length the capsule is built at
    function mat(opt) {
      const U = Object.assign({ uHot: { value: 0 }, uGlow: { value: 0 }, uOff: { value: new THREE.Vector2(0, 0) } }, GU);
      const ck = "pill3d-" + (++KEY);
      let col;
      if (opt.kind === "face") {
        const st = opt.stops.map(lin), y0 = f3(opt.y0), y1 = f3(opt.y1);
        col = "  float u = clamp((vLP.y - (" + y0 + ")) / ((" + y1 + ") - (" + y0 + ")), 0.0, 1.0); vec3 base = " + v3(st[0]) + ";\n";
        for (let i = 1; i < st.length; i++) col += "  base = mix(base, " + v3(st[i]) + ", smoothstep(" + f3((i - 1) / (st.length - 1)) + ", " + f3(i / (st.length - 1)) + ", 1.0 - u));\n";
      } else if (opt.kind === "side") {
        const near = lin(opt.near), far = lin(opt.far), lip = lin(opt.lip || opt.near);
        col = "  float dzz = clamp(((" + f3(opt.zF) + ") - vLP.z) / " + f3(opt.depth) + ", 0.0, 1.0);\n" +
          "  float lipK = 1.0 - smoothstep(" + f3(opt.bevel * 0.25) + ", " + f3(opt.bevel * 0.9) + ", (" + f3(opt.zF) + ") - vLP.z);\n" +
          "  float upK = smoothstep(-0.2, 1.0, vLP.y / " + f3(opt.halfH || 1) + ");\n" +
          "  vec3 base = mix(mix(" + v3(near) + ", " + v3(far) + ", smoothstep(0.0, 1.0, dzz)), " + v3(lip) + ", lipK * (0.35 + 0.65 * upK));\n";
      } else {
        col = "  vec3 base = " + v3(lin(opt.color)) + ";\n";
      }
      const hot = lin(opt.hot || "#FFF2F8"), rim = lin(opt.rim || "#FF7AC0"), glow = lin(opt.glow || "#FF5FB4");
      const m = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, metalness: opt.metal, roughness: opt.rough, clearcoat: opt.clearcoat || 0, clearcoatRoughness: opt.ccRough == null ? 0.06 : opt.ccRough,
        envMapIntensity: opt.env == null ? 1 : opt.env, side: THREE.FrontSide
      });
      m.customProgramCacheKey = () => ck;
      const stretch = opt.stretch ? " { float ax = abs(transformed.x); float nx = ax > " + f3(A0) + " ? ax - " + f3(A0) + " + uA : ax * (uA / " + f3(A0) + "); transformed.x = sign(transformed.x) * nx; }\n" : "";
      m.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, U);
        sh.vertexShader = "varying vec3 vLP;\nuniform float uA;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n" + stretch + " vLP = transformed;");
        sh.fragmentShader = "varying vec3 vLP; uniform float uSpecX, uSpecW, uSpecAmp, uHot, uGlow, uA; uniform vec2 uOff;\n" + sh.fragmentShader
          .replace("#include <color_fragment>", "#include <color_fragment>\n {\n" + col + "  diffuseColor.rgb = base;\n }")
          .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n {\n" + col +
            "  totalEmissiveRadiance += base * " + f3(opt.em || 0) + ";\n" +
            "  totalEmissiveRadiance += " + v3(hot) + " * uHot;\n" +
            "  vec2 pp = vLP.xy + uOff; float sd = (pp.x + pp.y * 0.42 - uSpecX) / uSpecW; float sb = exp(-sd * sd * 0.9);\n" +
            "  totalEmissiveRadiance += vec3(1.0, 0.95, 0.97) * sb * uSpecAmp * " + f3(opt.specK == null ? 1 : opt.specK) + ";\n" +
            "  vec3 vdir = normalize(vViewPosition); float fr = pow(1.0 - clamp(dot(normal, vdir), 0.0, 1.0), 2.2);\n" +
            "  totalEmissiveRadiance += " + v3(rim) + " * fr * " + f3(opt.rimK || 0) + ";\n" +
            (opt.glowR ? "  float gr = length(vLP.xy) / " + f3(opt.glowR) + "; totalEmissiveRadiance += " + v3(glow) + " * uGlow * pow(1.0 - smoothstep(0.0, 0.98, gr), 1.7);\n" : "") +
            " }");
      };
      m.userData.U = U;
      return m;
    }
    function extrude(shapes, zFront, total, bevel, bsK, mats, segs) {
      const depth = Math.max(0.3, total - 2 * bevel), BS = bevel * (bsK || 0.62);
      const geo = new THREE.ExtrudeGeometry(shapes, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: BS, bevelOffset: -BS, bevelSegments: segs || 5, curveSegments: 1 });
      geo.translate(0, 0, zFront - (depth + 2 * bevel));
      geo.computeVertexNormals();
      return new THREE.Mesh(geo, mats);
    }

    // ---------- the capsule ----------
    const C = o.colors, h = o.h, R = h / 2, PD = o.depth || h * 0.42, PB = o.bevel || h * 0.2;
    const group = new THREE.Group(); scene.add(group);
    const faceM = mat({ kind: "face", stops: C.pill, y0: -R, y1: R, metal: 0.0, rough: 0.3, clearcoat: 1.0, ccRough: 0.035, env: 0.6, em: C.pillEm == null ? 0.28 : C.pillEm, specK: 1.0, stretch: true, rimK: 0.0 });
    const sideM = mat({ kind: "side", near: C.side[0], far: C.side[1], lip: C.side[2], zF: 0, depth: PD, bevel: PB, halfH: R, metal: 0.0, rough: 0.32, clearcoat: 1.0, ccRough: 0.04, env: 0.75, em: 0.22, specK: 0.8, stretch: true, rimK: C.rimK == null ? 0.55 : C.rimK, rim: C.rim });
    group.add(extrude([new THREE.Shape(stadium(A0, R, 48))], 0, PD, PB, o.bevelSize || 0.92, [faceM, sideM], 9));

    // ---------- the lens (dark plum glass), its chrome bezel and the link mark, at the left cap ----------
    const L = o.lens || {}, RW = L.r || h * 0.34, BZ = L.bezel || h * 0.05;
    const lensG = new THREE.Group(); group.add(lensG);
    const lensM = mat({ kind: "face", stops: C.lens, y0: -RW, y1: RW, metal: 0.0, rough: 0.22, clearcoat: 1.0, ccRough: 0.03, env: 0.9, em: 0.05, specK: 0.35, glowR: RW, glow: C.glow, rimK: 0 });
    const lensS = mat({ kind: "plain", color: C.lens[C.lens.length - 1], metal: 0.0, rough: 0.3, env: 0.6, specK: 0.2 });
    const lensMesh = extrude([new THREE.Shape(circle(RW, 72))], L.z || h * 0.035, h * 0.06, h * 0.022, 0.6, [lensM, lensS], 4);
    lensG.add(lensMesh);
    const chromeM = (hot) => mat({ kind: "plain", color: C.chrome || "#E9ECF2", metal: 1.0, rough: 0.16, env: 1.35, em: 0.0, specK: 0.5, hot: hot || "#FFE6F3" });
    const bezelM = chromeM("#FFF0F7");
    const bezel = new THREE.Mesh(new THREE.TorusGeometry(RW + BZ * 0.55, BZ, 20, 96), bezelM);
    bezel.position.z = (L.z || h * 0.035) - BZ * 0.15; lensG.add(bezel);
    // the link mark: two chrome stadium rings along a 45 degree axis
    const LK = o.link || {}, D = RW * 2, LL = LK.len || D * 0.47, LWd = LK.wid || D * 0.34, LTh = LK.th || D * 0.12, LO = LK.off || LL * 0.28;
    const ringShape = () => { const s = new THREE.Shape(stadium((LL - LWd) / 2, LWd / 2, 28)); s.holes.push(new THREE.Path(stadium((LL - LWd) / 2, LWd / 2 - LTh, 28).reverse())); return s; };
    const linkM = chromeM("#FFF4FA");
    const ringGeo = () => { const m = extrude([ringShape()], LTh * 0.5, LTh * 1.0, LTh * 0.42, 0.55, [linkM, linkM], 5); return m; };
    const linkG = new THREE.Group(); linkG.rotation.z = Math.PI / 4; linkG.position.z = (L.z || h * 0.035) + LTh * 0.9; lensG.add(linkG);
    const ringAP = new THREE.Group(); linkG.add(ringAP); const ringA = ringGeo(); ringA.rotation.x = -0.22; ringAP.add(ringA);
    const ringBP = new THREE.Group(); ringBP.rotation.order = "ZYX"; linkG.add(ringBP);
    const ringB = ringGeo(); ringBP.add(ringB);

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
      uBloom: { value: 0.2 }, uShadow: { value: o.shadow == null ? 0.55 : o.shadow }, uShOff: { value: new THREE.Vector2(o.shadowOff ? -o.shadowOff[0] : 0, o.shadowOff ? o.shadowOff[1] : 10) },
      uWide: { value: o.wideShadow == null ? 0.3 : o.wideShadow }, uBloomC: { value: lin(o.bloomColor || "#FF8CC8") }
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
      "  float sa = clamp(sh, 0.0, 0.8); a += sa * (1.0 - a);",
      "  vec3 b = (texture2D(t1, vUv).rgb + texture2D(t2, vUv).rgb * 0.8 + texture2D(t3, vUv).rgb * 0.6) * uBloom * uBloomC;",
      "  col += toSRGB(1.0 - exp(-b)) * 0.9;",
      "  gl_FragColor = vec4(col, a);",
      "}"].join("\n"));
    function pass(m, target, noClear) { quad.material = m; renderer.setRenderTarget(target); if (!noClear) renderer.clear(); renderer.render(postScene, postCam); }

    // ---------- pose ----------
    let hidden = false, last = {};
    const lerp = (a, b, k) => a + (b - a) * k;
    function setPose(t, tf) {
      const P = o.pose(t, tf == null ? t : tf) || {};
      last = P; hidden = !!P.hide;
      const sc = P.s == null ? 1 : P.s;
      group.position.set((P.cx == null ? PX : P.cx) - PX + (P.x || 0), -((P.cy == null ? PY : P.cy) - PY + (P.y || 0)), P.z || 0);
      group.rotation.set(P.rx || 0, P.ry || 0, P.rz || 0);
      group.scale.set(sc * (P.sx == null ? 1 : P.sx), sc * (P.sy == null ? 1 : P.sy), sc);
      const uA = Math.max(0, P.uA == null ? A0 : P.uA);
      GU.uA.value = uA;
      lensG.position.x = -uA;
      const off = new THREE.Vector2(-uA, 0);
      [lensM, lensS, bezelM, linkM].forEach((m) => m.userData.U.uOff.value.copy(off));
      // the link: open = pulled out along its axis, swung and turned edge-on; 0 = interlocked
      const op = P.open == null ? 0 : P.open, opc = Math.max(0, op);
      // open: two separate, face-on loops pulled apart along the axis with a clear gap (slightly smaller, offset like
      // a broken chain); closed: they overlap and the second ring tilts into the weave. op < 0 = the snap's overshoot.
      const half = ((LL - 2 * LO) + D * 0.05) / 2, ls = 1 - 0.1 * opc;
      ringAP.position.set(-LO - op * half, opc * D * 0.035, 0); ringAP.scale.setScalar(ls);
      ringBP.position.set(LO + op * half, -opc * D * 0.035, opc * LTh * 0.3); ringBP.scale.setScalar(ls);
      ringBP.rotation.set(0.5 * (1 - opc) + 0.08 * opc, 0, 0);
      lensG.scale.setScalar(P.lensS == null ? 1 : P.lensS);
      GU.uSpecX.value = P.specX == null ? -1e5 : P.specX; GU.uSpecAmp.value = P.specAmp || 0; GU.uSpecW.value = P.specW || 100;
      bezelM.userData.U.uHot.value = P.rimHot || 0;
      linkM.userData.U.uHot.value = P.linkHot || 0;
      lensM.userData.U.uGlow.value = P.glow || 0;
      const ka = P.keyAngle == null ? -0.5 : P.keyAngle;
      key.position.set(Math.sin(ka) * 10, 8 + (P.keyY || 0), 9);
      key.intensity = P.key == null ? 2.0 : P.key;
      hemi.intensity = P.hemi == null ? 0.6 : P.hemi;
      compMat.uniforms.uBloom.value = P.bloom == null ? 0.1 : P.bloom;
      compMat.uniforms.uShadow.value = P.shadow == null ? (o.shadow == null ? 0.55 : o.shadow) : P.shadow;
      brightMat.uniforms.uTh.value = P.bloomTh == null ? 1.3 : P.bloomTh;
      scene.updateMatrixWorld(true);
    }
    function renderAt(t) {
      const sh = o.shutter ? o.shutter(t) : 0;
      const N = sh > 0 ? (o.subframes || 10) : 1;
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
    // project pill-local points (px, y up, z toward the lens; uses the pose of the last renderAt) to canvas px
    const _v = new THREE.Vector3();
    function project(pts) {
      return pts.map((p) => { _v.set(p[0], p[1], p[2] || 0).applyMatrix4(group.matrixWorld).project(camera); return [(_v.x + 1) / 2 * W, (1 - _v.y) / 2 * H]; });
    }
    return { canvas, renderAt, project, DIST, A0, R, RW, isHidden: () => hidden, pose: () => last };
  };

  // CSS matrix3d that maps the rect (0,0)-(w,h) onto the quad q = [tl, tr, br, bl] (canvas px)
  function adj(m) {
    return [m[4] * m[8] - m[5] * m[7], m[2] * m[7] - m[1] * m[8], m[1] * m[5] - m[2] * m[4],
      m[5] * m[6] - m[3] * m[8], m[0] * m[8] - m[2] * m[6], m[2] * m[3] - m[0] * m[5],
      m[3] * m[7] - m[4] * m[6], m[1] * m[6] - m[0] * m[7], m[0] * m[4] - m[1] * m[3]];
  }
  function mm(a, b) { const c = []; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { let s = 0; for (let k = 0; k < 3; k++) s += a[3 * i + k] * b[3 * k + j]; c[3 * i + j] = s; } return c; }
  function mv(m, v) { return [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], m[6] * v[0] + m[7] * v[1] + m[8] * v[2]]; }
  function basis(p) { const m = [p[0][0], p[1][0], p[2][0], p[0][1], p[1][1], p[2][1], 1, 1, 1]; const v = mv(adj(m), [p[3][0], p[3][1], 1]); return mm(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]]); }
  window.Pill3D.quadMatrix = function (w, h, q) {
    const s = basis([[0, 0], [w, 0], [0, h], [w, h]]), d = basis([q[0], q[1], q[3], q[2]]);
    let t = mm(d, adj(s)); const k = t[8]; t = t.map((x) => x / k);
    return "matrix3d(" + [t[0], t[3], 0, t[6], t[1], t[4], 0, t[7], 0, 0, 1, 0, t[2], t[5], 0, t[8]].map((x) => x.toFixed(8)).join(",") + ")";
  };
})();
