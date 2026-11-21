/* Title3D: the freeze-frame name as real geometry (Three.js r160, global THREE). Shared by a/ and b/ (identical file).
   Our own lettering: Archivo outlines (media/glyphs.js), italic-sheared, extruded with a rounded bevel and an oblique
   down-right "drop" extrusion (the movie-poster depth in the evidence). Face: two-band chrome gold (cream sky band,
   dark horizon line, bright gold ground band) over clearcoat metal; bevel lip polished gold; the extrusion falls off into
   dark bronze. Post: HDR bloom, one heavy ink outline around face + extrusion, soft contact shadow.
   Motion: each letter slams in from the camera (accelerating, a 2-frame squash, damped settle), staggered left to right;
   the lock-in fires on the last landing: a hot key rakes the bevels, a specular band crosses the faces, bloom peaks for
   3 frames. Exit: letters flip up and away, staggered. Seek-safe: renderAt(t) draws the frame for time t, nothing else
   animates. Adapted from gta/18-name-tag's Name3D (itself from 03-word-captions). */
(function () {
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const srgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.substr(i, 2), 16) / 255);
  const toLin = (x) => (x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
  const lin = (hex) => { const a = srgb(hex).map(toLin); return new THREE.Color(a[0], a[1], a[2]); };
  const v3 = (c) => "vec3(" + c.r.toFixed(4) + "," + c.g.toFixed(4) + "," + c.b.toFixed(4) + ")";

  window.Title3D = function (o) {
    const W = o.W, H = o.H, F = o.glyphs, E = (n) => gsap.parseEase(n);

    // ---------- layout: kerning + tracking, fit to maxInk, optical centre ----------
    const text = o.text.toUpperCase(), track = (o.tracking || 0) * F.upm;
    const pens = []; let pen = 0;
    for (let i = 0; i < text.length; i++) {
      const ch = F.g[text[i]] ? text[i] : " ", g = F.g[ch];
      pens.push({ ch, x: pen, g });
      pen += g[0] + (i < text.length - 1 ? (F.k[text[i] + text[i + 1]] || 0) + track : 0);
    }
    const inks = pens.filter((p) => p.ch !== " ");
    const inkL = inks[0].x + inks[0].g[2], inkR = inks[inks.length - 1].x + inks[inks.length - 1].g[3];
    const s = o.maxInk / (inkR - inkL);
    const cap = F.cap * s, em = F.upm * s;
    const SHEAR = o.shear == null ? 0.2 : o.shear;              // italic: x += y * SHEAR (y up)
    const ox = -((inkL + inkR) / 2) * s - SHEAR * 0;           // word centred on cx (shear is about the cap middle)

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
    camera.setViewOffset(W, H, W / 2 - o.cx, H / 2 - o.cy, W, H);

    // ---------- environment: warm studio (top softbox, a hot strip, dark floor) so the gold bands like chrome ----------
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(1.9,1.62,1.12), hor = vec3(0.42,0.27,0.10), low = vec3(0.03,0.02,0.01);" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.0, 0.6, y)) : mix(hor * 0.6, low, smoothstep(0.0, 0.35, -y));" +
        " c *= 0.75 + 0.35 * smoothstep(-0.2, 1.0, vP.z); gl_FragColor = vec4(c, 1.0); }"
    })));
    const panel = (w, h, x, y, z, k) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k * 0.9, k * 0.7), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); envScene.add(m); };
    panel(44, 12, 0, 30, 24, 2.4);
    panel(34, 2.0, 0, 8, 40, 3.4);
    panel(44, 6, 0, 26, -22, 3.6);
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(envScene, 0.0, 0.1, 200).texture;

    const key = new THREE.DirectionalLight(0xfff1d6, 2.4); scene.add(key); scene.add(key.target);
    const hemi = new THREE.HemisphereLight(0xfff2dc, 0x1a0f04, 0.55); scene.add(hemi);

    // ---------- materials ----------
    const C = o.colors;
    const U = {
      uSpecX: { value: -1e5 }, uSpecW: { value: 0.3 * em }, uSpecAmp: { value: 0 },
      uCapB: { value: 0 }, uCapH: { value: cap }, uDepth: { value: 1 }, uBevelZ: { value: 1 }, uGlow: { value: 0 }
    };
    const f0 = lin(C.face[0]), f1 = lin(C.face[1]), f2 = lin(C.face[2]), f3 = lin(C.face[3]), f4 = lin(C.face[4]);
    const lipC = lin(C.lip), sNear = lin(C.side[0]), sFar = lin(C.side[1]);
    function patch(mat, isFace) {
      mat.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, U);
        sh.vertexShader = "varying vec3 vLP; varying float vWX;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vLP = position;").replace("#include <project_vertex>", "#include <project_vertex>\n vWX = (modelMatrix * vec4(transformed, 1.0)).x;");
        const head = "varying vec3 vLP; varying float vWX; uniform float uSpecX, uSpecW, uSpecAmp, uCapB, uCapH, uDepth, uBevelZ, uGlow;\n";
        // two-band chrome gold: cream top -> gold -> dark horizon at 52% -> bright gold -> deep amber at the baseline
        const faceCol =
          "  float yy = clamp((vLP.y - uCapB) / uCapH, 0.0, 1.0);\n" +
          "  vec3 col = yy > 0.52 ? mix(" + v3(f1) + ", " + v3(f0) + ", smoothstep(0.52, 0.98, yy)) : mix(" + v3(f3) + ", " + v3(f2) + ", smoothstep(0.0, 0.47, yy));\n" +
          "  col = mix(col, " + v3(f4) + ", (1.0 - smoothstep(0.0, 0.035, abs(yy - 0.5))) * 0.85);\n";
        const sideCol =
          "  float dz = clamp(-vLP.z / uDepth, 0.0, 1.0);\n" +
          "  float lipK = 1.0 - smoothstep(uBevelZ * 0.6, uBevelZ * 1.3, -vLP.z);\n" +
          "  vec3 col = mix(mix(" + v3(sNear) + ", " + v3(sFar) + ", smoothstep(0.0, 0.7, dz)), " + v3(lipC) + ", lipK);\n";
        sh.fragmentShader = head + sh.fragmentShader
          .replace("#include <color_fragment>", "#include <color_fragment>\n {\n" + (isFace ? faceCol : sideCol) + "  diffuseColor.rgb = col;\n }")
          .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n {\n" + (isFace ? faceCol : sideCol) +
            "  totalEmissiveRadiance += col * " + (isFace ? "0.62" : "0.03") + " * (1.0 + uGlow * " + (isFace ? "0.35" : "0.0") + ");\n" +
            "  float sd = (vWX - vLP.y * 0.42 - uSpecX) / uSpecW; float sb = exp(-sd * sd);\n" +
            "  totalEmissiveRadiance += vec3(1.0, 0.92, 0.74) * sb * uSpecAmp * " + (isFace ? "1.0" : "0.7") + ";\n }");
      };
      return mat;
    }
    const faceMat = patch(new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.55, roughness: 0.26, clearcoat: 0.8, clearcoatRoughness: 0.06, envMapIntensity: 0.55 }), true);
    const sideMat = patch(new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.28, envMapIntensity: 1.1 }), false);

    // ---------- geometry: one mesh per letter, pivot at its baseline centre ----------
    const DEPTH = o.depth, BT = o.bevel, BS = o.bevel * 0.7, MIN_SEG = 0.6, CURVE_SEG = 10;
    const OBX = o.oblique ? o.oblique[0] : 0.32, OBY = o.oblique ? o.oblique[1] : 0.42;   // extrusion drop: x right, y down per unit depth
    U.uDepth.value = DEPTH + 2 * BT; U.uBevelZ.value = BT;
    function shapesFor(d, gx, cxL) {
      const sp = new THREE.ShapePath(), re = /([MLQCZ])([^MLQCZ]*)/g; let m;
      while ((m = re.exec(d))) {
        const n = m[2].trim() ? m[2].trim().split(/[\s,]+/).map(Number) : [], P = [];
        for (let i = 0; i < n.length; i += 2) { const y = -n[i + 1] * s; P.push(ox + (gx + n[i]) * s - cxL + (y - cap / 2) * SHEAR, y); }
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
    const word = new THREE.Group(); word.position.y = -cap / 2; scene.add(word);   // baseline at -cap/2: cap middle on cy
    const letters = [];
    pens.forEach((p) => {
      if (p.ch === " ") return;
      const cxL = ox + (p.x + (p.g[2] + p.g[3]) / 2) * s;                  // letter centre (baseline), before shear
      const geo = new THREE.ExtrudeGeometry(shapesFor(p.g[1], p.x, cxL), { depth: DEPTH, bevelEnabled: true, bevelThickness: BT, bevelSize: BS, bevelOffset: -BS, bevelSegments: 4, curveSegments: 1 });
      geo.translate(0, 0, -(DEPTH + BT));
      // oblique drop: deeper vertices slide right and down (classic poster extrusion), front face untouched
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) { const z = pos.getZ(i), dz = Math.max(0, -z - BT); pos.setX(i, pos.getX(i) + dz * OBX); pos.setY(i, pos.getY(i) - dz * OBY); }
      geo.computeVertexNormals();
      const mesh = new THREE.Mesh(geo, [faceMat, sideMat]);
      const g = new THREE.Group(); g.add(mesh); g.position.x = cxL; word.add(g);
      letters.push({ g, mesh, x: cxL });
    });
    const NL = letters.length;
    const TILT = o.tilt || 0.12;

    // ---------- post: bloom + ink outline + contact shadow ----------
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
    const NT = 32, taps = [];
    for (let i = 0; i < NT; i++) taps.push("vec2(" + Math.cos(i / NT * 6.2832).toFixed(4) + "," + Math.sin(i / NT * 6.2832).toFixed(4) + ")");
    const compMat = post({
      tMain: { value: null }, t1: { value: null }, t2: { value: null }, t3: { value: null },
      uPx: { value: new THREE.Vector2(1 / W, 1 / H) }, uInk: { value: o.inkPx }, uInkC: { value: lin(o.inkColor || "#060403") },
      uBloom: { value: 0.3 }, uShadow: { value: o.shadow == null ? 0.55 : o.shadow }, uShOff: { value: new THREE.Vector2(o.shadowOff ? o.shadowOff[0] : 6, o.shadowOff ? o.shadowOff[1] : -12) }
    }, [
      "uniform sampler2D tMain, t1, t2, t3; uniform vec2 uPx, uShOff; uniform float uInk, uBloom, uShadow; uniform vec3 uInkC; varying vec2 vUv;",
      "vec3 shoulder(vec3 x){ return mix(x, 0.82 + 0.18 * (1.0 - exp(-max(x - 0.82, 0.0) / 0.18)), step(0.82, x)); }",
      "vec3 toSRGB(vec3 c){ c = clamp(c, 0.0, 1.0); return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }",
      "const vec2 TAPS[" + NT + "] = vec2[](" + taps.join(",") + ");",
      "void main(){",
      "  vec4 m = texture2D(tMain, vUv);",
      "  float dil = m.a;",
      "  for (int i = 0; i < " + NT + "; i++) { dil = max(dil, texture2D(tMain, vUv + TAPS[i] * uPx * uInk).a); dil = max(dil, texture2D(tMain, vUv + TAPS[i] * uPx * uInk * 0.55).a); }",
      "  float sh = (texture2D(t2, vUv - uShOff * uPx).a * 0.75 + texture2D(t3, vUv - uShOff * uPx * 2.2).a * 0.6) * uShadow;",
      "  vec3 wc = m.a > 0.0 ? toSRGB(shoulder(m.rgb / m.a)) : vec3(0.0);",
      "  vec3 inkS = toSRGB(uInkC);",
      "  float a = m.a; vec3 col = wc * a;",
      "  col += inkS * dil * (1.0 - a); a += dil * (1.0 - a);",
      "  a += clamp(sh, 0.0, 0.8) * (1.0 - a);",
      "  vec3 b = (texture2D(t1, vUv).rgb + texture2D(t2, vUv).rgb * 0.8 + texture2D(t3, vUv).rgb * 0.6) * uBloom;",
      "  vec3 bl = toSRGB(1.0 - exp(-b)) * 0.9; col += bl; a = max(a, clamp(max(bl.r, max(bl.g, bl.b)), 0.0, 1.0));",
      "  gl_FragColor = vec4(col, a);",
      "}"].join("\n"));
    function pass(mat, target) { quad.material = mat; renderer.setRenderTarget(target); renderer.render(postScene, postCam); }

    // ---------- timing ----------
    const T = o.timing;   // { slam0, stagger, slamDur, rakeDur, holdEnd, exit0, exitStagger, exitDur }
    const lockAt = T.slam0 + (NL - 1) * T.stagger + T.slamDur;
    const x0 = letters[0].x - em * 0.5, x1 = letters[NL - 1].x + em * 0.5;
    const eIn = E("power3.in"), eRake = E("power2.inOut"), eSpec = E("power2.inOut"), eOut = E("power2.in");
    const Z0 = DIST * (o.slamZ || 0.36), SLAMY = o.slamY == null ? 0.22 : o.slamY, EXITD = o.exitDir || 1;   // slam from above (+) or below (-); exit up (1) or down (-1)
    function letterPose(i, t) {
      const L = letters[i], tin = T.slam0 + i * T.stagger, tout = T.exit0 + i * T.exitStagger;
      if (t < tin || t >= tout + T.exitDur) return null;
      let z = 0, y = 0, rx = 0, ry = 0, sx = 1, sy = 1;
      if (t < tin + T.slamDur) {
        const p = eIn(clamp((t - tin) / T.slamDur, 0, 1));
        z = Z0 * (1 - p); y = SLAMY * cap * (1 - p); rx = -0.32 * Math.sign(SLAMY || 1) * (1 - p);
      } else {
        // landing: a 2-frame squash, then a damped settle (spring, overshoot)
        const d = t - (tin + T.slamDur), k = Math.exp(-d / 0.09) * Math.cos(d * 38);
        sy = 1 - 0.16 * k; sx = 1 + 0.08 * k; y = -0.02 * cap * k;
      }
      if (t >= tout) {
        const p = eOut(clamp((t - tout) / T.exitDur, 0, 1));
        y += 1.6 * EXITD * cap * p; z += DIST * 0.18 * p; rx += -1.1 * EXITD * p; ry += (i - (NL - 1) / 2) * 0.05 * p;
        sy *= 1 + 0.25 * p;
      }
      return { z, y, rx, ry, sx, sy };
    }

    function renderAt(t) {
      for (let i = 0; i < NL; i++) {
        const L = letters[i], P = letterPose(i, t);
        if (!P) { L.g.visible = false; continue; }
        L.g.visible = true;
        L.g.position.set(L.x, P.y, P.z);
        L.g.rotation.set(P.rx, P.ry, 0);
        L.g.scale.set(P.sx, P.sy, 1);
      }
      // a slow living turn through the hold, so bevel glints keep moving
      const hold = clamp((t - lockAt) / Math.max(0.5, T.holdEnd - lockAt), 0, 1);
      word.rotation.set(-TILT, -0.05 + 0.1 * E("sine.inOut")(hold), 0);
      // lock-in: hot key rakes the top bevels left -> right, a specular band crosses the faces, bloom peaks 3 frames
      const rk = eRake(clamp((t - lockAt + 0.04) / T.rakeDur, 0, 1));
      const ka = -1.0 + 1.9 * rk;
      key.position.set(Math.sin(ka) * 10, 11, 6 - 9 * Math.abs(Math.cos(ka)));
      const bt = t - lockAt, pk = bt < 0 ? 0 : bt < 0.1 ? 1 : Math.exp(-(bt - 0.1) / 0.22);
      key.intensity = 2.4 + 4.2 * pk;
      const sp = clamp((t - lockAt - 0.02) / 0.62, 0, 1);
      U.uSpecX.value = (x0 - 0.8 * em) + (x1 - x0 + 1.6 * em) * eSpec(sp);
      // r08: the band sweeps in word space (vWX, as B since r07); letter-local x lit every letter in the same frame (a 1-frame flash)
      U.uSpecAmp.value = sp > 0 && sp < 1 ? 0.6 * Math.sin(Math.PI * sp) : 0;
      U.uGlow.value = pk;
      compMat.uniforms.uBloom.value = 0.16 + 1.05 * pk;
      brightMat.uniforms.uTh.value = 1.3 - 0.35 * pk;

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

    return { canvas, renderAt, lockAt, cap, em, letterX: letters.map((L) => o.cx + L.x) };
  };
})();
