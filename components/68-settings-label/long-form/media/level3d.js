/* Level3D: graphics-setting level words (LOW / MEDIUM / ULTRA) as real geometry on flip panels (Three.js r160, global THREE).
   Each panel holds one extruded, bevelled word per level, traced from Archivo 900's own outlines (media/glyphs.js) and finished in
   its colour-coded enamel (red / yellow / green). A level change is a flip about the word's horizontal axis: the old word tips back
   to edge-on (its real extruded edge shows, never a paper-thin card), the new one comes over the top of the same turn and locks with
   overshoot, so only one word is ever on screen and each one turns through the light: clear-coat studio reflections, a key light,
   a hot light front and one soft specular sweep per word, HDR bloom. Post adds a thin ink edge and a soft contact shadow.
   Seek-safe: nothing animates on its own; render(states, g) draws the frame the caller computed from timeline time.
   Shared by a/ and b/ (identical file). */
(function () {
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const srgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.substr(i, 2), 16) / 255);
  const toLin = (x) => (x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
  const lin = (hex) => { const a = srgb(hex).map(toLin); return new THREE.Color(a[0], a[1], a[2]); };
  const v3 = (c) => "vec3(" + c.r.toFixed(4) + "," + c.g.toFixed(4) + "," + c.b.toFixed(4) + ")";
  const v3s = (hex) => { const a = srgb(hex); return "vec3(" + a.map((x) => x.toFixed(4)).join(",") + ")"; };

  window.Level3D = function (o) {
    const W = o.W, H = o.H, F = o.glyphs, TILT = o.tilt || 0.3;

    // ---------- renderer + camera (principal point at o.px, o.py so the extrusions recede straight back there) ----------
    const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
    canvas.style.cssText = "position:absolute;left:0;top:0;width:" + W + "px;height:" + H + "px;display:block";
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;
    const scene = new THREE.Scene();
    const FOV = o.fov || 18, DIST = (H / 2) / Math.tan((FOV / 2) * Math.PI / 180);
    const camera = new THREE.PerspectiveCamera(FOV, W / H, 10, DIST * 3);
    camera.position.set(0, 0, DIST); camera.lookAt(0, 0, 0);
    const PX = o.px == null ? W / 2 : o.px, PY = o.py == null ? H / 2 : o.py;
    camera.setViewOffset(W, H, W / 2 - PX, H / 2 - PY, W, H);
    const wx = (X) => X - PX, wy = (Y) => PY - Y;          // canvas px -> world (z = 0 plane is 1:1)

    // ---------- environment: a neutral studio (top softbox, strip lights, dark floor) for the clear coat to reflect ----------
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(1.5,1.5,1.55), hor = vec3(0.34,0.34,0.38), low = vec3(0.03,0.03,0.035);" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.0, 0.75, y)) : mix(hor, low, smoothstep(0.0, 0.45, -y));" +
        " c *= 0.7 + 0.4 * smoothstep(-0.2, 1.0, vP.z); gl_FragColor = vec4(c, 1.0); }"
    })));
    const panel = (w, h, x, y, z, k) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k, k * 1.02), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); envScene.add(m); };
    panel(40, 11, 0, 30, 22, 2.4);      // big softbox above and in front: the face's even sheen
    panel(34, 2.0, 0, 8, 40, 3.0);      // a strip in front, slightly high: a crisp line along the top bevels
    panel(46, 5, 0, 26, -22, 3.2);      // a hot bar up and behind: the top bevels read as a lit lip
    panel(3, 26, -30, 4, 26, 1.6);      // a tall side strip: the left bevels catch a line as the reel turns
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(envScene, 0.0, 0.1, 200).texture;

    // ---------- lights ----------
    const key = new THREE.DirectionalLight(0xffffff, 2.0); scene.add(key); scene.add(key.target);
    const hemi = new THREE.HemisphereLight(0xf4f6ff, 0x101014, 0.7); scene.add(hemi);

    // ---------- geometry helpers ----------
    const DEPTH = o.depth, BT = o.bevel, BS = o.bevel * 0.6, MIN_SEG = 0.6, CURVE_SEG = 10, DT = DEPTH + 2 * BT;
    function layout(text, size, maxInk) {
      text = text.toUpperCase();
      const track = (o.tracking || 0) * F.upm, pens = []; let pen = 0;
      for (let i = 0; i < text.length; i++) {
        const ch = F.g[text[i]] ? text[i] : " ", g = F.g[ch];
        pens.push({ ch, x: pen, g });
        pen += g[0] + (i < text.length - 1 ? (F.k[text[i] + text[i + 1]] || 0) + track : 0);
      }
      const inks = pens.filter((p) => p.ch !== " ");
      const inkL = inks[0].x + inks[0].g[2], inkR = inks[inks.length - 1].x + inks[inks.length - 1].g[3];
      let s = size / F.upm;
      if (maxInk && (inkR - inkL) * s > maxInk) s = maxInk / (inkR - inkL);
      return { pens, s, cap: F.cap * s, inkL, inkR, inkW: (inkR - inkL) * s };
    }
    function shapesFor(d, gx, s, ox, cap) {
      const sp = new THREE.ShapePath(), re = /([MLQCZ])([^MLQCZ]*)/g; let m;
      while ((m = re.exec(d))) {
        const n = m[2].trim() ? m[2].trim().split(/[\s,]+/).map(Number) : [], P = [];
        for (let i = 0; i < n.length; i += 2) P.push(ox + (gx + n[i]) * s, -n[i + 1] * s - cap / 2);
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

    // ---------- materials: colour-coded enamel, one shader patch for face and sides; per-face uniforms drive the light ----------
    function makeMats(C, cap, inkX0, inkX1) {
      const U = {
        uHotX: { value: -1e5 }, uHotW: { value: 0.36 * cap }, uHotAmp: { value: 0 },
        uSpecX: { value: -1e5 }, uSpecW: { value: 0.5 * cap }, uSpecAmp: { value: 0 },
        uBoost: { value: 0 }, uCapB: { value: -cap / 2 }, uCapH: { value: cap }, uDepth: { value: DT }, uBevelZ: { value: BT }
      };
      const sNear = lin(C.side[0]), sFar = lin(C.side[1]), lip = lin(C.lip), hot = lin(C.hot);
      function patch(mat, isFace) {
        mat.onBeforeCompile = (sh) => {
          Object.assign(sh.uniforms, U);
          sh.vertexShader = "varying vec3 vLP;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vLP = position;");
          const head = "varying vec3 vLP; uniform float uHotX, uHotW, uHotAmp, uSpecX, uSpecW, uSpecAmp, uBoost, uCapB, uCapH, uDepth, uBevelZ;\n";
          const faceCol =
            "  float yy = clamp((vLP.y - uCapB) / uCapH, 0.0, 1.0); float u = 1.0 - yy;\n" +
            "  vec3 cT = " + v3s(C.face[0]) + ", cM = " + v3s(C.face[1]) + ", cB = " + v3s(C.face[2]) + ";\n" +
            "  vec3 cs = u < 0.42 ? mix(cT, cM, smoothstep(0.0, 0.42, u)) : mix(cM, cB, smoothstep(0.42, 1.0, u));\n" +
            "  vec3 col = pow(cs, vec3(2.2));\n";
          const sideCol =
            "  float dz = clamp(-vLP.z / uDepth, 0.0, 1.0);\n" +
            "  float lipK = 1.0 - smoothstep(uBevelZ * 0.7, uBevelZ * 1.3, -vLP.z);\n" +
            "  vec3 col = mix(mix(" + v3(sNear) + ", " + v3(sFar) + ", smoothstep(0.0, 1.0, dz)), " + v3(lip) + ", lipK);\n";
          sh.fragmentShader = head + sh.fragmentShader
            .replace("#include <color_fragment>", "#include <color_fragment>\n {\n" + (isFace ? faceCol : sideCol) + "  diffuseColor.rgb = col;\n }")
            .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n {\n" + (isFace ? faceCol : sideCol) +
              "  totalEmissiveRadiance += col * (" + (isFace ? (C.em || 0.5).toFixed(3) : "0.10") + " + uBoost * " + (isFace ? "1.0" : "0.6") + ");\n" +
              (isFace ? "" : "  totalEmissiveRadiance += col * lipK * 0.35;\n") +
              "  float hd = (vLP.x - uHotX) / uHotW; totalEmissiveRadiance += " + v3(hot) + " * exp(-hd * hd) * uHotAmp * " + (isFace ? "1.0" : "0.7") + ";\n" +
              "  float sd = (vLP.x + vLP.y * 0.45 - uSpecX) / uSpecW; float sb = exp(-sd * sd);\n" +
              "  totalEmissiveRadiance += vec3(1.0, 1.0, 0.97) * sb * uSpecAmp * " + (isFace ? "1.0" : "0.55") + ";\n }");
        };
        const ck = JSON.stringify(C) + (isFace ? "|face" : "|side");
        mat.customProgramCacheKey = () => ck;     // colours are baked into the shader text: one program per palette entry
        return mat;
      }
      const face = patch(new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.0, roughness: 0.3, clearcoat: 1.0, clearcoatRoughness: 0.07, envMapIntensity: 0.5 }), true);
      const side = patch(new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.15, roughness: 0.32, clearcoat: 0.7, clearcoatRoughness: 0.1, envMapIntensity: 0.85 }), false);
      return { face, side, U, x0: inkX0, x1: inkX1 };
    }

    // ---------- reels ----------
    const drums = o.drums.map((d) => {
      const group = new THREE.Group(); group.rotation.order = "YXZ"; scene.add(group);
      let capMax = 0;
      const faces = d.faces.map((f, j) => {
        if (!f) return null;
        const L = layout(f.text, f.size, f.maxInk);
        capMax = Math.max(capMax, L.cap);
        // left: ink left edge at local x = 0; center: ink centre at local x = 0 (plus the face's own dx)
        const ox = (d.align === "left" ? -L.inkL * L.s : -((L.inkL + L.inkR) / 2) * L.s) + (f.dx || 0);
        const M = makeMats(o.palette[f.color], L.cap, ox + L.inkL * L.s, ox + L.inkR * L.s);
        const fg = new THREE.Group(); fg.visible = false; group.add(fg);
        const word = new THREE.Group(); fg.add(word);
        L.pens.forEach((p) => {
          if (p.ch === " ") return;
          const geo = new THREE.ExtrudeGeometry(shapesFor(p.g[1], p.x, L.s, ox, L.cap), { depth: DEPTH, bevelEnabled: true, bevelThickness: BT, bevelSize: BS, bevelOffset: -BS, bevelSegments: 4, curveSegments: 1 });
          geo.translate(0, 0, -(DEPTH + BT)); geo.computeVertexNormals();
          word.add(new THREE.Mesh(geo, [M.face, M.side]));
        });
        word.scale.set(1, 1 / Math.cos(TILT), 1);
        return { fg, word, M, cap: L.cap, inkW: L.inkW, x0: M.x0, x1: M.x1, ox };
      });
      faces.forEach((f) => { if (f) f.word.position.z = DT / 2; });       // the flip axis runs through the middle of the extrusion
      return { d, group, faces, capMax, X: wx(d.x), Y: wy(d.y) };
    });

    // ---------- post: HDR bloom + ink edge + soft contact shadow ----------
    const HF = renderer.capabilities.isWebGL2 && renderer.extensions.has("EXT_color_buffer_float");
    const TYPE = HF ? THREE.HalfFloatType : THREE.UnsignedByteType;
    const rtMain = new THREE.WebGLRenderTarget(W, H, { type: TYPE, samples: renderer.capabilities.isWebGL2 ? 4 : 0 });
    const RTO = { type: TYPE, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false };
    const LV = [2, 4, 8].map((k) => [new THREE.WebGLRenderTarget(Math.ceil(W / k), Math.ceil(H / k), RTO), new THREE.WebGLRenderTarget(Math.ceil(W / k), Math.ceil(H / k), RTO)]);
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
      uPx: { value: new THREE.Vector2(1 / W, 1 / H) }, uInk: { value: o.inkPx }, uInkC: { value: lin(o.inkColor) },
      uBloom: { value: 0.2 }, uShadow: { value: o.shadow == null ? 0.5 : o.shadow }, uShOff: { value: new THREE.Vector2(0, o.shadowOff || 8) }
    }, [
      "uniform sampler2D tMain, t1, t2, t3; uniform vec2 uPx, uShOff; uniform float uInk, uBloom, uShadow; uniform vec3 uInkC; varying vec2 vUv;",
      "vec3 shoulder(vec3 x){ return mix(x, 0.82 + 0.18 * (1.0 - exp(-max(x - 0.82, 0.0) / 0.18)), step(0.82, x)); }",
      "vec3 toSRGB(vec3 c){ c = clamp(c, 0.0, 1.0); return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }",
      "const vec2 TAPS[" + NT + "] = vec2[](" + taps.join(",") + ");",
      "void main(){",
      "  vec4 m = texture2D(tMain, vUv);",
      "  float dil = m.a;",
      "  for (int i = 0; i < " + NT + "; i++) { dil = max(dil, texture2D(tMain, vUv + TAPS[i] * uPx * uInk).a); dil = max(dil, texture2D(tMain, vUv + TAPS[i] * uPx * uInk * 0.55).a); }",
      "  float sh = (texture2D(t2, vUv + uShOff * uPx).a * 0.75 + texture2D(t3, vUv + uShOff * uPx * 2.2).a * 0.55) * uShadow;",
      "  vec3 wc = m.a > 0.0 ? toSRGB(shoulder(m.rgb / m.a)) : vec3(0.0);",
      "  vec3 inkS = toSRGB(uInkC);",
      "  float a = m.a; vec3 col = wc * a;",
      "  col += inkS * dil * (1.0 - a); a += dil * (1.0 - a);",
      "  a += clamp(sh, 0.0, 0.8) * (1.0 - a);",
      "  vec3 b = (texture2D(t1, vUv).rgb + texture2D(t2, vUv).rgb * 0.8 + texture2D(t3, vUv).rgb * 0.6) * uBloom;",
      "  col += toSRGB(1.0 - exp(-b)) * 0.9;",
      "  gl_FragColor = vec4(col, a);",
      "}"].join("\n"));
    function pass(mat, target) { quad.material = mat; renderer.setRenderTarget(target); renderer.render(postScene, postCam); }

    // ---------- frame ----------
    // states[i]: { pos (continuous level index: k = word k at rest, k..k+1 = flipping from k to k+1), s, x, y (px offsets), ry, rx,
    //              lit:{ [face]: { hot:0..1, hotAmp, spec:0..1, specAmp, boost } } }
    // g: { bloom, th, keyA (key light angle), keyI }
    function render(states, g) {
      g = g || {};
      drums.forEach((D, i) => {
        const S = states[i] || {}, sc = S.s == null ? 1 : S.s, pos = S.pos || 0;
        // one turn per level step: the first half tips the old word back to edge-on, the second brings the new one over the top
        const k = Math.floor(pos + 1e-6), fr = pos - k, cur = fr < 0.5 ? k : k + 1;
        // the switch happens edge-on to the camera (the panel rests tilted back by TILT), so neither word ever shows its back
        const ang = fr < 0.5 ? -fr * 2 * (Math.PI / 2 - TILT) : (1 - fr) * 2 * (Math.PI / 2 + TILT);
        D.group.visible = sc > 0.001;
        D.group.scale.setScalar(Math.max(sc, 0.001));
        D.group.position.set(D.X + (S.x || 0), D.Y - (S.y || 0), -(DT / 2) * sc);
        D.group.rotation.set(-TILT + (S.rx || 0), S.ry || 0, 0);
        D.faces.forEach((f, j) => {
          if (!f) return;
          f.fg.visible = j === cur;                    // edge-on frames show the real extruded edge, never a blank
          f.fg.rotation.x = ang;
          const L = (S.lit && S.lit[j]) || {}, U = f.M.U, span = f.x1 - f.x0;
          U.uHotX.value = L.hotAmp ? f.x0 - 0.6 * f.cap + (span + 1.2 * f.cap) * clamp(L.hot || 0, 0, 1) : -1e5;
          U.uHotAmp.value = L.hotAmp || 0;
          U.uSpecX.value = L.specAmp ? f.x0 - 0.9 * f.cap + (span + 1.8 * f.cap) * clamp(L.spec || 0, 0, 1) : -1e5;
          U.uSpecAmp.value = L.specAmp || 0;
          U.uBoost.value = L.boost || 0;
        });
      });
      const ka = g.keyA == null ? -0.5 : g.keyA;
      key.position.set(Math.sin(ka) * 9, 11, 4 + Math.cos(ka) * 2); key.intensity = g.keyI == null ? 2.0 : g.keyI;
      compMat.uniforms.uBloom.value = g.bloom == null ? 0.16 : g.bloom;
      brightMat.uniforms.uTh.value = g.th == null ? 1.3 : g.th;

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

    return {
      canvas, render,
      // geometry readouts (canvas px) for pinning DOM: ink span and cap of drum i, face j at rest
      face: (i, j) => { const D = drums[i], f = D.faces[j]; return { left: D.d.x + f.x0, right: D.d.x + f.x1, cap: f.cap, top: D.d.y - f.cap / 2, bottom: D.d.y + f.cap / 2 }; },
      capMax: (i) => drums[i].capMax
    };
  };
})();
