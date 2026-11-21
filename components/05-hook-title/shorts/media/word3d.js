/* Word3D: the hook title's keyword as real geometry (Three.js r160, global THREE).
   Extruded, bevelled letters traced from the title font's own outlines (media/glyphs.js), a clearcoat enamel face with a
   graded wall and a lit lip, a PMREM studio environment, a key light that rakes across the bevels, a feathered light front
   that can turn the word from one material state into another, one wide soft specular sweep, HDR bloom, and in post an
   optional ink edge around face + extrusion plus a soft contact shadow.
   Seek-safe: nothing animates on its own. renderAt(t) draws the frame for time t, with every pose value computed from t
   by the page's pose(t) function (no tween state is read), so a backward seek renders the same pixels.
   Shared by a/ and b/ (identical file). Adapted from the 03 word-captions payoff renderer. */
(function () {
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const srgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.substr(i, 2), 16) / 255);
  const toLin = (x) => (x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
  const lin = (hex) => { const a = srgb(hex).map(toLin); return new THREE.Color(a[0], a[1], a[2]); };
  const v3 = (c) => "vec3(" + c.r.toFixed(4) + "," + c.g.toFixed(4) + "," + c.b.toFixed(4) + ")";
  const v3s = (hex) => { const a = srgb(hex); return "vec3(" + a.map((x) => x.toFixed(4)).join(",") + ")"; };

  function layout(o) {
    const F = o.glyphs, text = o.upper ? o.text.toUpperCase() : o.text, track = (o.tracking || 0) * F.upm;
    const pens = []; let pen = 0;
    for (let i = 0; i < text.length; i++) {
      const ch = F.g[text[i]] ? text[i] : " ", g = F.g[ch];
      pens.push({ ch, x: pen, g });
      pen += g[0] + (i < text.length - 1 ? (F.k[text[i] + text[i + 1]] || 0) + track : 0);
    }
    const inks = pens.filter((p) => p.ch !== " ");
    const inkL = inks[0].x + inks[0].g[2], inkR = inks[inks.length - 1].x + inks[inks.length - 1].g[3];
    let core = inks.length; while (core > 1 && /[.,!?]/.test(inks[core - 1].ch)) core--;
    const optR = inks[core - 1].x + inks[core - 1].g[3];
    let s = o.size / F.upm;
    if (o.maxInk && (inkR - inkL) * s > o.maxInk) s = o.maxInk / (inkR - inkL);
    return { text, pens, inkL, inkR, optR, s, size: s * F.upm, cap: F.cap * s, inkW: (inkR - inkL) * s };
  }

  window.Word3D = function (o) {
    const W = o.W, H = o.H, F = o.glyphs, E = (n) => gsap.parseEase(n);

    // ---------- layout (font units -> px), kerning + tracking ----------
    const L = layout(o), text = L.text, pens = L.pens, inkL = L.inkL, inkR = L.inkR, optR = L.optR, s = L.s;
    const size = L.size, cap = L.cap, em = size, inkW = L.inkW;
    // placement: either the pen starts at penX (inline with DOM type) or the word is optically centred on cx
    let cx, ox;
    if (o.penX != null) { cx = o.penX + ((inkL + inkR) / 2) * s; ox = o.penX - cx; }
    else { cx = o.cx; ox = -((inkL + optR) / 2) * s; }
    const cy = o.cy;                                // cap-height centre, canvas px

    // ---------- renderer ----------
    const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
    canvas.style.cssText = "position:absolute;left:0;top:0;width:" + W + "px;height:" + H + "px;display:block";
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;
    const scene = new THREE.Scene();
    const FOV = o.fov || 18, DIST = (H / 2) / Math.tan((FOV / 2) * Math.PI / 180);
    const camera = new THREE.PerspectiveCamera(FOV, W / H, 10, DIST * 3);
    camera.position.set(0, 0, DIST); camera.lookAt(0, 0, 0);
    camera.setViewOffset(W, H, W / 2 - cx, H / 2 - cy, W, H);   // principal point on the word: the extrusion recedes straight back

    // ---------- environment: a studio (top softbox, floor bounce, dark sides) for the enamel and metal to reflect ----------
    const envScene = new THREE.Scene();
    const ET = o.envTint || [1.9, 1.72, 1.45];
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(" + ET.join(",") + "), hor = vec3(0.55,0.42,0.30), low = vec3(0.10,0.06,0.03);" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.0, 0.7, y)) : mix(hor, low, smoothstep(0.0, 0.5, -y));" +
        " c *= 0.75 + 0.35 * smoothstep(-0.2, 1.0, vP.z); gl_FragColor = vec4(c, 1.0); }"
    })));
    const panel = (w, h, x, y, z, k) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k * 0.97, k * 0.92), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); envScene.add(m); };
    panel(40, 12, 0, 30, 24, 2.6);      // big softbox above and in front: the face's even sheen
    panel(30, 2.2, 0, 9, 40, 3.2);      // a strip in front, slightly high: a crisp line along the top bevels
    panel(44, 6, 0, 26, -22, 3.4);      // a hot bar up and behind: the top bevels read as a lit lip
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(envScene, 0.0, 0.1, 200).texture;

    // ---------- lights ----------
    const key = new THREE.DirectionalLight(0xfff1dc, 2.2); scene.add(key); scene.add(key.target);
    const hemi = new THREE.HemisphereLight(0xfff4e6, 0x2a1606, 0.6); scene.add(hemi);

    // ---------- materials: one shader patch drives the state front, hot band and specular for face and sides ----------
    const U = {
      uFront: { value: -1e4 }, uFeather: { value: 0.35 * em }, uHotW: { value: 0.125 * em }, uHotAmp: { value: 0 },
      uSpecX: { value: -1e4 }, uSpecW: { value: 0.225 * em }, uSpecAmp: { value: 0 },
      uCapB: { value: -cap / 2 }, uCapH: { value: cap }, uDepth: { value: 1 }, uBevelZ: { value: 1 }
    };
    const C = o.colors, M = o.material || {};
    const preFace = C.preFace, preSide = C.preSide;
    const lip = lin(C.lip), sNear = lin(C.side[0]), sFar = lin(C.side[1]);
    const pNear = lin(preSide[0]), pFar = lin(preSide[1]), pBot = lin(preFace[1]), pTop = lin(preFace[0]), hot = lin(C.hot);
    const faceEm = M.faceEmissive == null ? 0.82 : M.faceEmissive, preEm = M.preEmissive == null ? 0.5 : M.preEmissive;
    function patch(mat, isFace) {
      mat.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, U);
        sh.vertexShader = "varying vec3 vLP;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vLP = position;");
        const head = "varying vec3 vLP; uniform float uFront, uFeather, uHotW, uHotAmp, uSpecX, uSpecW, uSpecAmp, uCapB, uCapH, uDepth, uBevelZ;\n" +
          "float igK(){ return 1.0 - smoothstep(uFront - uFeather, uFront + uFeather, vLP.x); }\n";
        const faceCol =
          "  float yy = clamp((vLP.y - uCapB) / uCapH, 0.0, 1.0);\n" +
          "  float u = 1.0 - yy; vec3 gT = " + v3s(C.face[0]) + ", gM = " + v3s(C.face[1]) + ", gB = " + v3s(C.face[2]) + ";\n" +
          "  vec3 gs = u < 0.22 ? mix(gT, mix(gT, gM, 0.55), u / 0.22) : u < 0.5 ? mix(mix(gT, gM, 0.55), gM, (u - 0.22) / 0.28) : u < 0.8 ? mix(gM, mix(gM, gB, 0.55), (u - 0.5) / 0.3) : mix(mix(gM, gB, 0.55), gB, (u - 0.8) / 0.2);\n" +
          "  vec3 gold = pow(gs, vec3(2.2));\n" +
          "  vec3 wht = mix(" + v3(pBot) + ", " + v3(pTop) + ", smoothstep(0.0, 0.8, yy));\n";
        const sideCol =
          "  float dz = clamp(-vLP.z / uDepth, 0.0, 1.0);\n" +
          "  float lipK = 1.0 - smoothstep(uBevelZ * 0.7, uBevelZ * 1.25, -vLP.z);\n" +
          "  vec3 gold = mix(mix(" + v3(sNear) + ", " + v3(sFar) + ", smoothstep(0.0, 1.0, dz)), " + v3(lip) + ", lipK);\n" +
          "  vec3 wht = mix(mix(" + v3(pNear) + ", " + v3(pFar) + ", dz) * 0.5, " + v3(pBot) + " * 0.85, lipK);\n";
        sh.fragmentShader = head + sh.fragmentShader
          .replace("#include <color_fragment>", "#include <color_fragment>\n {\n" + (isFace ? faceCol : sideCol) +
            "  float k = igK(); diffuseColor.rgb = mix(wht, gold, k);\n }")
          .replace("#include <metalnessmap_fragment>", "#include <metalnessmap_fragment>\n metalnessFactor = mix(" + (isFace ? "0.0" : "0.15") + ", metalnessFactor, igK());")
          .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\n roughnessFactor = mix(0.42, roughnessFactor" + (isFace ? "" : " * (1.0 - 0.45 * (1.0 - smoothstep(uBevelZ * 0.7, uBevelZ * 1.25, -vLP.z)))") + ", igK());")
          .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n {\n" + (isFace ? faceCol : sideCol) +
            "  float k = igK();\n" +
            "  totalEmissiveRadiance += wht * (1.0 - k) * " + (isFace ? preEm.toFixed(3) : "0.0") + ";\n" +
            "  totalEmissiveRadiance += gold * k * " + (isFace ? faceEm.toFixed(3) : "0.05") + ";\n" +
            "  float hd = (vLP.x - uFront) / uHotW; totalEmissiveRadiance += " + v3(hot) + " * exp(-hd * hd) * uHotAmp;\n" +
            "  float sd = (vLP.x + vLP.y * 0.36 - uSpecX) / uSpecW; float sb = exp(-sd * sd * 0.9) ;\n" +
            "  totalEmissiveRadiance += vec3(1.0, 0.96, 0.9) * sb * uSpecAmp * " + (isFace ? "1.0" : "0.6") + ";\n }");
      };
      return mat;
    }
    const faceMat = patch(new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: M.faceMetal == null ? 0.3 : M.faceMetal, roughness: M.faceRough == null ? 0.32 : M.faceRough,
      clearcoat: M.clearcoat == null ? 0.5 : M.clearcoat, clearcoatRoughness: 0.08, envMapIntensity: M.faceEnv == null ? 0.4 : M.faceEnv }), true);
    const sideMat = patch(new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: M.sideMetal == null ? 1.0 : M.sideMetal, roughness: 0.3, envMapIntensity: 1.0 }), false);

    // ---------- geometry: traced outlines, extruded with a rounded bevel, front face at z = 0 ----------
    const DEPTH = o.depth, BT = o.bevel, BS = o.bevel * 0.6, MIN_SEG = 0.6, CURVE_SEG = 10;
    U.uDepth.value = DEPTH + 2 * BT; U.uBevelZ.value = BT;
    function shapesFor(d, gx) {
      const sp = new THREE.ShapePath(), re = /([MLQCZ])([^MLQCZ]*)/g; let m;
      while ((m = re.exec(d))) {
        const n = m[2].trim() ? m[2].trim().split(/[\s,]+/).map(Number) : [], P = [];
        for (let i = 0; i < n.length; i += 2) P.push(ox + (gx + n[i]) * s, -n[i + 1] * s - cap / 2);
        if (m[1] === "M") sp.moveTo(P[0], P[1]); else if (m[1] === "L") sp.lineTo(P[0], P[1]);
        else if (m[1] === "Q") sp.quadraticCurveTo(P[0], P[1], P[2], P[3]); else if (m[1] === "C") sp.bezierCurveTo(P[0], P[1], P[2], P[3], P[4], P[5]);
      }
      const clean = (pts) => { const out = []; for (const p of pts) if (!out.length || p.distanceTo(out[out.length - 1]) > MIN_SEG) out.push(p);
        while (out.length > 3 && out[0].distanceTo(out[out.length - 1]) <= MIN_SEG) out.pop(); return out; };
      return sp.toShapes(o.ccw === undefined ? false : o.ccw).map((sh) => {
        const s2 = new THREE.Shape(clean(sh.getPoints(CURVE_SEG)));
        sh.holes.forEach((h) => s2.holes.push(new THREE.Path(clean(h.getPoints(CURVE_SEG)))));
        return s2;
      });
    }
    const word = new THREE.Group(); scene.add(word);
    pens.forEach((p) => {
      if (p.ch === " ") return;
      const geo = new THREE.ExtrudeGeometry(shapesFor(p.g[1], p.x), { depth: DEPTH, bevelEnabled: true, bevelThickness: BT, bevelSize: BS, bevelOffset: -BS, bevelSegments: 4, curveSegments: 1 });
      geo.translate(0, 0, -(DEPTH + BT));
      geo.computeVertexNormals();
      word.add(new THREE.Mesh(geo, [faceMat, sideMat]));
    });
    const TILT = o.tilt;                                // top leans back: the extrusion shows below the face

    // ---------- post: HDR bloom + optional ink edge around everything + soft contact shadow ----------
    const HF = renderer.capabilities.isWebGL2 && renderer.extensions.has("EXT_color_buffer_float");
    const TYPE = HF ? THREE.HalfFloatType : THREE.UnsignedByteType;
    const rtMain = new THREE.WebGLRenderTarget(W, H, { type: TYPE, samples: renderer.capabilities.isWebGL2 ? 4 : 0 });
    const RTO = { type: TYPE, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false };
    const LV = [2, 4, 8].map((d) => [new THREE.WebGLRenderTarget(Math.ceil(W / d), Math.ceil(H / d), RTO), new THREE.WebGLRenderTarget(Math.ceil(W / d), Math.ceil(H / d), RTO)]);
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
    const NT = 32, taps = [];
    for (let i = 0; i < NT; i++) taps.push("vec2(" + Math.cos(i / NT * 6.2832).toFixed(4) + "," + Math.sin(i / NT * 6.2832).toFixed(4) + ")");
    const useInk = (o.inkPx || 0) > 0;
    const compMat = post({
      tMain: { value: null }, t1: { value: null }, t2: { value: null }, t3: { value: null },
      uPx: { value: new THREE.Vector2(1 / W, 1 / H) }, uInk: { value: o.inkPx || 0 }, uInkC: { value: lin(o.inkColor || "#07080B") },
      uBloom: { value: 0.5 }, uShadow: { value: o.shadow == null ? 0.5 : o.shadow }, uShOff: { value: new THREE.Vector2(0, o.shadowOff || 8) },
      uShC: { value: lin(o.shadowColor || "#000000") }, uFade: { value: 1 }
    }, [
      "uniform sampler2D tMain, t1, t2, t3; uniform vec2 uPx, uShOff; uniform float uInk, uBloom, uShadow, uFade; uniform vec3 uInkC, uShC; varying vec2 vUv;",
      "vec3 shoulder(vec3 x){ return mix(x, 0.82 + 0.18 * (1.0 - exp(-max(x - 0.82, 0.0) / 0.18)), step(0.82, x)); }",
      "vec3 toSRGB(vec3 c){ c = clamp(c, 0.0, 1.0); return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }",
      "const vec2 TAPS[" + NT + "] = vec2[](" + taps.join(",") + ");",
      "void main(){",
      "  vec4 m = texture2D(tMain, vUv);",
      "  float dil = m.a;",
      useInk ? "  for (int i = 0; i < " + NT + "; i++) { dil = max(dil, texture2D(tMain, vUv + TAPS[i] * uPx * uInk).a); dil = max(dil, texture2D(tMain, vUv + TAPS[i] * uPx * uInk * 0.55).a); }" : "",
      "  float sh = (texture2D(t2, vUv + uShOff * uPx).a * 0.75 + texture2D(t3, vUv + uShOff * uPx * 2.2).a * 0.55) * uShadow;",
      "  vec3 wc = m.a > 0.0 ? toSRGB(shoulder(m.rgb / m.a)) : vec3(0.0);",
      "  vec3 inkS = toSRGB(uInkC), shS = toSRGB(uShC);",
      "  float a = m.a; vec3 col = wc * a;",
      "  col += inkS * dil * (1.0 - a); a += dil * (1.0 - a);",
      "  float sa = clamp(sh, 0.0, 0.8); col += shS * sa * (1.0 - a); a += sa * (1.0 - a);",
      "  vec3 b = (texture2D(t1, vUv).rgb + texture2D(t2, vUv).rgb * 0.8 + texture2D(t3, vUv).rgb * 0.6) * uBloom;",
      "  col += toSRGB(1.0 - exp(-b)) * 0.9;",
      "  gl_FragColor = vec4(col, a) * uFade;",
      "}"].join("\n"));
    function pass(mat, target) { quad.material = mat; renderer.setRenderTarget(target); renderer.render(postScene, postCam); }

    // ---------- timing ----------
    const T = o.timing;           // { ignite, frontDur, specAt, specDur, rakeAt, rakeDur, holdStart, holdEnd, hotAmp, specAmp, bloomBase, bloomPeak, keyBase, keyPeak }
    const x0 = ox + inkL * s, x1 = ox + inkR * s;     // ink span in word space
    const eFront = E("expo.out"), eSpec = E("power2.inOut"), eRake = E("power2.inOut");
    const pose = o.pose || (() => ({}));

    function renderAt(t) {
      // state front: a feathered light front runs left -> right, the pre-state material turns into the final one behind it
      const fp = clamp((t - T.ignite) / T.frontDur, 0, 1), fe = eFront(fp);
      U.uFront.value = t < T.ignite ? x0 - 2 * U.uFeather.value - 2 * U.uHotW.value : (x0 - U.uFeather.value - U.uHotW.value) + (x1 - x0 + 2 * U.uFeather.value + 3 * U.uHotW.value) * fe;
      U.uHotAmp.value = t < T.ignite ? 0 : (T.hotAmp == null ? 3.2 : T.hotAmp) * (1 - E("power2.in")(clamp((t - T.ignite) / (T.frontDur + 0.12), 0, 1)));
      U.uHotAmp.value *= clamp((x1 - 0.15 * em - U.uFront.value) / (0.5 * em), 0, 1);   // the hot band dies before the last letter: no orb parked on the end
      // one wide soft specular sweep
      const sp = clamp((t - T.specAt) / T.specDur, 0, 1);
      U.uSpecX.value = (x0 - 0.6 * em) + (x1 - x0 + 1.4 * em) * eSpec(sp);
      U.uSpecAmp.value = sp > 0 && sp < 1 ? (T.specAmp == null ? 0.6 : T.specAmp) * Math.sin(Math.PI * sp) : 0;
      // key light: rakes from upper left to upper right across the bevels, with a bump at the hit
      const rakeAt = T.rakeAt == null ? T.ignite - 0.05 : T.rakeAt;
      const rk = eRake(clamp((t - rakeAt) / T.rakeDur, 0, 1));
      const ka = -0.95 + 1.75 * rk;
      key.position.set(Math.sin(ka) * 9, 12, -5);   // above and behind: it rakes along the top bevels, never mirrors off the flat face
      const kb = T.keyBase == null ? 2.2 : T.keyBase, kp = T.keyPeak == null ? 3.4 : T.keyPeak;
      key.intensity = kb + kp * Math.exp(-Math.pow((t - rakeAt - 0.17) / 0.16, 2));
      // a slow living turn through the hold, so the bevel glints keep moving
      const hs = T.holdStart == null ? T.ignite : T.holdStart;
      const hold = clamp((t - hs) / Math.max(0.5, T.holdEnd - hs), 0, 1);
      const ps = pose(t) || {};
      const sx = ps.sx == null ? 1 : ps.sx, sy = ps.sy == null ? 1 : ps.sy, sc = ps.s == null ? 1 : ps.s;
      const turn = T.turn == null ? 0.06 : T.turn;
      word.rotation.set(-TILT + (ps.rx || 0), -turn + 2 * turn * E("sine.inOut")(hold) + (ps.ry || 0), ps.rz || 0);
      word.scale.set(sx * sc, sy * sc / Math.cos(TILT), sc);
      word.position.set(ps.x || 0, (ps.y || 0) - (cap / 2) * (1 - sy * sc), ps.z || 0);   // squash keeps the baseline planted
      // bloom: peaks at the hit, holds 3 frames, then settles
      const bt = t - T.ignite, env = bt < 0 ? 0 : bt < 0.1 ? 1 : Math.exp(-(bt - 0.1) / 0.28);
      compMat.uniforms.uBloom.value = (T.bloomBase == null ? 0.14 : T.bloomBase) + (T.bloomPeak == null ? 0.8 : T.bloomPeak) * env;
      compMat.uniforms.uShadow.value = ps.shadow == null ? (o.shadow == null ? 0.5 : o.shadow) : ps.shadow;
      compMat.uniforms.uShOff.value.set(0, ps.shadowOff == null ? (o.shadowOff || 8) : ps.shadowOff);
      compMat.uniforms.uFade.value = ps.fade == null ? 1 : ps.fade;
      brightMat.uniforms.uTh.value = T.bloomTh == null ? 1.35 : T.bloomTh;

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

    return { canvas, renderAt, size, cap, inkW, cx, cy, inkLeft: cx + x0, inkRight: cx + x1 };
  };
  window.Word3D.measure = layout;   // {size, cap, inkW, ...} before building, for page layout
})();
