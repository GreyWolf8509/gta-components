/* SFX3D: the reaction word as real geometry (Three.js r160, global THREE).
   Every letter is its own extruded, bevelled mesh traced from the font's outlines (media/glyphs.js), so each one can slam,
   squash, hop and tilt on its own. Faces are clearcoated enamel (white / red / yellow) over polished-metal walls with a lit
   lip; an optional liquid fill turns one colour set into another behind a wobbling meniscus with a hot band. A key light
   rakes across the bevels, one wide soft specular sweeps the faces, HDR bloom peaks on the payoff, and the creator
   vernacular is kept in post: one thick ink outline around face + extrusion, and a soft drop shadow.
   Seek-safe: nothing animates on its own. draw(state) renders one frame from a plain state object that the composition
   computes from timeline time. Shared by a/ and b/ (identical file, copied). */
(function () {
  const srgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.substr(i, 2), 16) / 255);
  const toLin = (x) => (x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
  const vs = (hex) => "vec3(" + srgb(hex).map((x) => x.toFixed(4)).join(",") + ")";            // sRGB components (graded, then pow 2.2)
  const vl = (hex) => "vec3(" + srgb(hex).map((x) => toLin(x).toFixed(4)).join(",") + ")";     // linear
  const f = (x) => (+x).toFixed(4);

  window.SFX3D = function (o) {
    const W = o.W, H = o.H, F = o.glyphs, PCX = o.pcx, PCY = o.pcy;
    const wx = (px) => px - PCX, wy = (py) => PCY - py;

    // ---------- layout: per line, kerning + tracking, fit to maxInk, centred on the line's cx ----------
    const letters = [];
    o.lines.forEach((ln, li) => {
      const text = ln.text.toUpperCase(), track = (o.tracking || 0) * F.upm, pens = [];
      let pen = 0;
      for (let i = 0; i < text.length; i++) {
        const ch = F.g[text[i]] ? text[i] : " ", g = F.g[ch];
        pens.push({ ch, x: pen, g });
        pen += g[0] + (i < text.length - 1 ? (F.k[text[i] + text[i + 1]] || 0) + track : 0);
      }
      const inks = pens.filter((p) => p.ch !== " ");
      const inkL = inks[0].x + inks[0].g[2], inkR = inks[inks.length - 1].x + inks[inks.length - 1].g[3];
      let s = ln.size / F.upm;
      if (ln.maxInk && (inkR - inkL) * s > ln.maxInk) s = ln.maxInk / (inkR - inkL);
      const x0 = ln.cx - ((inkR - inkL) * s) / 2;
      ln.scale = s; ln.cap = F.cap * s; ln.inkW = (inkR - inkL) * s; ln.inkL = x0; ln.inkR = x0 + ln.inkW;
      inks.forEach((p, k) => {
        const L = x0 + (p.x + p.g[2] - inkL) * s, R = x0 + (p.x + p.g[3] - inkL) * s;
        letters.push({ ch: p.ch, line: li, k, n: inks.length, path: p.g[1], gmid: (p.g[2] + p.g[3]) / 2, s, cap: F.cap * s,
          inkL: L, inkR: R, cx: (L + R) / 2, base: ln.base, set: o.setFor ? o.setFor(p.ch, li, k, inks.length) : "base" });
      });
    });
    const CAP = o.lines[0].cap;

    // ---------- renderer + camera (1 world unit = 1 px on the z = 0 plane, principal point at PCX, PCY) ----------
    const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
    canvas.style.cssText = "position:absolute;left:0;top:0;width:" + W + "px;height:" + H + "px;display:block";
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;
    const scene = new THREE.Scene();
    const FOV = o.fov || 10, DIST = (H / 2) / Math.tan((FOV / 2) * Math.PI / 180);
    const camera = new THREE.PerspectiveCamera(FOV, W / H, 10, DIST * 3);
    camera.position.set(0, 0, DIST); camera.lookAt(0, 0, 0);
    camera.setViewOffset(W, H, W / 2 - PCX, H / 2 - PCY, W, H);

    // ---------- environment: a neutral studio (big top softbox, a crisp strip, a hot bar behind) for enamel + metal ----------
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = " + (o.envTop || "vec3(1.85,1.80,1.72)") + ", hor = vec3(0.46,0.45,0.44), low = vec3(0.05,0.05,0.06);" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.0, 0.7, y)) : mix(hor, low, smoothstep(0.0, 0.5, -y));" +
        " c *= 0.75 + 0.35 * smoothstep(-0.2, 1.0, vP.z); gl_FragColor = vec4(c, 1.0); }"
    })));
    const panel = (w, h, x, y, z, k) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k * 0.98, k * 0.95), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); envScene.add(m); };
    panel(40, 12, 0, 30, 24, 2.4);      // big softbox above and in front: an even sheen on the faces
    panel(30, 2.2, 0, 9, 40, 3.0);      // a strip in front, slightly high: a crisp line along the top bevels
    panel(44, 6, 0, 26, -22, 3.2);      // a hot bar up and behind: the top bevels read as a lit lip
    panel(6, 30, -34, 4, 10, 1.4);      // a tall side card on the left: the left walls catch a soft edge
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(envScene, 0.0, 0.1, 200).texture;

    // ---------- lights ----------
    const key = new THREE.DirectionalLight(0xffffff, 2.0); scene.add(key); scene.add(key.target);
    const fillL = new THREE.DirectionalLight(0xffffff, 0.7); fillL.position.set(-4, 6, 10); scene.add(fillL);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x1c1c24, 0.55));

    // ---------- materials: one shader patch per colour set (face + walls), sharing the animated uniforms ----------
    const U = {
      uCap: { value: CAP }, uDepth: { value: 1 }, uBevelZ: { value: 1 },
      uFillOn: { value: o.fill ? 1 : 0 }, uFillY: { value: -1e5 }, uFillAmp: { value: 0 }, uFillK: { value: 0.024 }, uFillPh: { value: 0 },
      uHotW: { value: o.hotW || 6 }, uHotAmp: { value: 0 },
      uSpecX: { value: -1e5 }, uSpecW: { value: (o.specW || 0.5) * CAP }, uSpecAmp: { value: 0 }, uFlash: { value: 0 }
    };
    const SETS = o.sets, HOT = vl(o.hot || "#FFF6D0");
    const grad3 = (c) => "grad3(" + vs(c[2]) + "," + vs(c[1]) + "," + vs(c[0]) + ", yy)";
    const mats = {};
    function matsFor(name) {
      if (mats[name]) return mats[name];
      const A = SETS[name], B = o.fill ? SETS[o.fill.set] : A;
      const make = (isFace) => {
        const m = isFace
          ? new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.3, clearcoat: 1.0, clearcoatRoughness: 0.06, envMapIntensity: A.env ? A.env[0] : 0.55 })
          : new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.6, roughness: 0.32, envMapIntensity: A.env ? A.env[1] : 1.0 });
        const col = isFace
          ? "  float yy = clamp(vLP.y / uCap, 0.0, 1.0);\n  vec3 cA = pow(" + grad3(A.face) + ", vec3(2.2)); vec3 cB = pow(" + grad3(B.face) + ", vec3(2.2));\n"
          : "  float dz = clamp(-vLP.z / uDepth, 0.0, 1.0); float lipK = 1.0 - smoothstep(uBevelZ * 0.6, uBevelZ * 1.3, -vLP.z);\n" +
            "  vec3 cA = mix(mix(" + vl(A.side[0]) + ", " + vl(A.side[1]) + ", smoothstep(0.0, 1.0, dz)), " + vl(A.lip) + ", lipK);\n" +
            "  vec3 cB = mix(mix(" + vl(B.side[0]) + ", " + vl(B.side[1]) + ", smoothstep(0.0, 1.0, dz)), " + vl(B.lip) + ", lipK);\n";
        const i = isFace ? 0 : 1;
        m.onBeforeCompile = (sh) => {
          Object.assign(sh.uniforms, U);
          sh.vertexShader = "varying vec3 vLP; varying vec3 vWP;\n" + sh.vertexShader.replace("#include <begin_vertex>",
            "#include <begin_vertex>\n vLP = position; vWP = (modelMatrix * vec4(transformed, 1.0)).xyz;");
          const head = "varying vec3 vLP; varying vec3 vWP;\n" +
            "uniform float uCap, uDepth, uBevelZ, uFillOn, uFillY, uFillAmp, uFillK, uFillPh, uHotW, uHotAmp, uSpecX, uSpecW, uSpecAmp, uFlash;\n" +
            "vec3 grad3(vec3 b, vec3 m, vec3 t, float y){ return y < 0.5 ? mix(b, m, smoothstep(0.0, 0.5, y)) : mix(m, t, smoothstep(0.5, 1.0, y)); }\n" +
            "float lvlAt(float x){ return uFillY + uFillAmp * (sin(x * uFillK + uFillPh) + 0.45 * sin(x * uFillK * 2.3 - uFillPh * 1.37)); }\n" +
            "float fillK(){ if (uFillOn < 0.5) return 0.0; float l = lvlAt(vWP.x); return 1.0 - smoothstep(l - 1.4, l + 1.4, vWP.y); }\n";
          sh.fragmentShader = head + sh.fragmentShader
            .replace("#include <color_fragment>", "#include <color_fragment>\n {\n" + col + "  diffuseColor.rgb = mix(cA, cB, fillK());\n }")
            .replace("#include <metalnessmap_fragment>", "#include <metalnessmap_fragment>\n metalnessFactor = mix(" + f(A.metal[i]) + ", " + f(B.metal[i]) + ", fillK());")
            .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\n roughnessFactor = mix(" + f(A.rough[i]) + ", " + f(B.rough[i]) + ", fillK());")
            .replace("#include <aomap_fragment>", "#include <aomap_fragment>\n {\n  float tk = mix(" + f(A.tint ? A.tint[i] : 0) + ", " + f(B.tint ? B.tint[i] : 0) + ", fillK());\n" +
              "  vec3 tint = mix(vec3(1.0), diffuseColor.rgb * 1.25, tk);\n" +
              "  reflectedLight.indirectSpecular *= tint; reflectedLight.directSpecular = min(reflectedLight.directSpecular, vec3(1.5)) * tint * (1.0 - 0.75 * tk);\n" +
              (isFace ? "  #ifdef USE_CLEARCOAT\n  vec3 ctint = mix(vec3(1.0), 0.04 + diffuseColor.rgb * 0.5, tk); clearcoatSpecularIndirect *= ctint; clearcoatSpecularDirect = min(clearcoatSpecularDirect, vec3(1.2)) * ctint * (1.0 - 0.85 * tk);\n  #endif\n" : "") + " }")
            .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n {\n" + col +
              "  float k = fillK(); vec3 c = mix(cA, cB, k);\n" +
              "  totalEmissiveRadiance += c * mix(" + f(A.emis[i]) + ", " + f(B.emis[i]) + ", k) * (1.0 + uFlash * " + (isFace ? "1.0" : "0.35") + ");\n" +
              "  float hd = (vWP.y - lvlAt(vWP.x)) / uHotW; totalEmissiveRadiance += " + HOT + " * exp(-hd * hd) * uHotAmp * uFillOn * " + (isFace ? "1.0" : "0.5") + ";\n" +
              "  float tk2 = mix(" + f(A.tint ? A.tint[i] : 0) + ", " + f(B.tint ? B.tint[i] : 0) + ", k);\n" +
              "  vec3 band = mix(vec3(1.0, 0.97, 0.88), c * 1.5 + vec3(0.06), tk2 * 0.55);\n" +
              "  float sd = (vWP.x + vWP.y * 0.45 - uSpecX) / uSpecW; totalEmissiveRadiance += band * exp(-sd * sd) * uSpecAmp * " + (isFace ? "1.0" : "0.55") + ";\n }");
        };
        m.customProgramCacheKey = () => "sfx3d-" + name + "-" + (o.fill ? o.fill.set : "") + "-" + i;
        return m;
      };
      return (mats[name] = [make(true), make(false)]);
    }

    // ---------- geometry: one extruded, bevelled mesh per letter; pivot at the letter's ink centre on the baseline ----------
    const DEPTH = o.depth, BT = o.bevel, BS = o.bevel * 0.6, MIN_SEG = 0.6, CURVE_SEG = o.curveSeg || 12;
    U.uDepth.value = DEPTH + 2 * BT; U.uBevelZ.value = BT;
    function shapesFor(L) {
      const sp = new THREE.ShapePath(), re = /([MLQCZ])([^MLQCZ]*)/g; let m;
      while ((m = re.exec(L.path))) {
        const n = m[2].trim() ? m[2].trim().split(/[\s,]+/).map(Number) : [], P = [];
        for (let i = 0; i < n.length; i += 2) P.push((n[i] - L.gmid) * L.s, -n[i + 1] * L.s);
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
    const word = new THREE.Group(), inner = new THREE.Group(); word.add(inner); scene.add(word);
    letters.forEach((L) => {
      const geo = new THREE.ExtrudeGeometry(shapesFor(L), { depth: DEPTH, bevelEnabled: true, bevelThickness: BT, bevelSize: BS, bevelOffset: -BS, bevelSegments: o.bevelSeg || 4, curveSegments: 1 });
      geo.translate(0, 0, -(DEPTH + BT));
      geo.computeVertexNormals();
      const pivot = new THREE.Group(); pivot.add(new THREE.Mesh(geo, matsFor(L.set)));
      inner.add(pivot); L.node = pivot; L.wx = wx(L.cx); L.wy = wy(L.base);
    });

    // ---------- post: HDR bloom + the creator vernacular (thick ink outline around everything, soft drop shadow) ----------
    const HF = renderer.capabilities.isWebGL2 && renderer.extensions.has("EXT_color_buffer_float");
    const TYPE = HF ? THREE.HalfFloatType : THREE.UnsignedByteType;
    const rtMain = new THREE.WebGLRenderTarget(W, H, { type: TYPE, samples: renderer.capabilities.isWebGL2 ? 4 : 0 });
    const rtTop = new THREE.WebGLRenderTarget(W, H, { type: TYPE, samples: renderer.capabilities.isWebGL2 ? 4 : 0 });
    const RTO = { type: TYPE, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false };
    const LV = [2, 4, 8].map((d) => [new THREE.WebGLRenderTarget(W / d, H / d, RTO), new THREE.WebGLRenderTarget(W / d, H / d, RTO)]);
    const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), postScene = new THREE.Scene();
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2)); quad.frustumCulled = false; postScene.add(quad);
    const VS = "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }";
    const post = (u, fs) => new THREE.ShaderMaterial({ uniforms: u, vertexShader: VS, fragmentShader: fs, depthTest: false, depthWrite: false, blending: THREE.NoBlending, toneMapped: false });
    const brightMat = post({ tSrc: { value: null }, uTh: { value: 1.35 } },
      "uniform sampler2D tSrc; uniform float uTh; varying vec2 vUv; void main(){ vec4 c = texture2D(tSrc, vUv); vec3 u = c.a > 0.0 ? c.rgb / c.a : vec3(0.0);" +
      " float l = max(u.r, max(u.g, u.b)); vec3 cl = min(u, vec3(3.0)) * c.a; gl_FragColor = vec4(cl * smoothstep(uTh, uTh + 0.8, l), c.a); }");
    const blurMat = post({ tSrc: { value: null }, uDir: { value: new THREE.Vector2() } },
      "uniform sampler2D tSrc; uniform vec2 uDir; varying vec2 vUv; void main(){ vec4 c = texture2D(tSrc, vUv) * 0.2270270270;" +
      " c += (texture2D(tSrc, vUv + uDir * 1.3846153846) + texture2D(tSrc, vUv - uDir * 1.3846153846)) * 0.3162162162;" +
      " c += (texture2D(tSrc, vUv + uDir * 3.2307692308) + texture2D(tSrc, vUv - uDir * 3.2307692308)) * 0.0702702703; gl_FragColor = c; }");
    const NT = 32, taps = [];
    for (let i = 0; i < NT; i++) taps.push("vec2(" + Math.cos(i / NT * 6.2832).toFixed(4) + "," + Math.sin(i / NT * 6.2832).toFixed(4) + ")");
    const inkC = srgb(o.inkColor || "#0B0C10");
    const compMat = post({
      tMain: { value: null }, tTop: { value: null }, t1: { value: null }, t2: { value: null }, t3: { value: null }, uTopOn: { value: 0 },
      uPx: { value: new THREE.Vector2(1 / W, 1 / H) }, uInk: { value: o.inkPx }, uInkC: { value: new THREE.Vector3(inkC[0], inkC[1], inkC[2]) },
      uBloom: { value: 0.2 }, uShadow: { value: o.shadow == null ? 0.55 : o.shadow },
      uShOff: { value: new THREE.Vector2((o.shadowOff || [0, 10])[0], -(o.shadowOff || [0, 10])[1]) }
    }, [
      "uniform sampler2D tMain, tTop, t1, t2, t3; uniform vec2 uPx, uShOff; uniform float uInk, uBloom, uShadow, uTopOn; uniform vec3 uInkC; varying vec2 vUv;",
      "vec3 shoulder(vec3 x){ return mix(x, 0.82 + 0.18 * (1.0 - exp(-max(x - 0.82, 0.0) / 0.18)), step(0.82, x)); }",
      "vec3 toSRGB(vec3 c){ c = clamp(c, 0.0, 1.0); return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }",
      "const vec2 TAPS[" + NT + "] = vec2[](" + taps.join(",") + ");",
      // one layer: pinhole close, then the ink outline around its own silhouette (premultiplied out)
      "vec4 inked(sampler2D tex){",
      "  vec4 m = texture2D(tex, vUv);",
      "  if (m.a < 0.98) {",
      "    vec4 r1 = texture2D(tex, vUv + vec2(uPx.x, 0.0)), r2 = texture2D(tex, vUv + vec2(2.0 * uPx.x, 0.0));",
      "    vec4 l1 = texture2D(tex, vUv - vec2(uPx.x, 0.0)), l2 = texture2D(tex, vUv - vec2(2.0 * uPx.x, 0.0));",
      "    vec4 u1 = texture2D(tex, vUv + vec2(0.0, uPx.y)), u2 = texture2D(tex, vUv + vec2(0.0, 2.0 * uPx.y));",
      "    vec4 d1 = texture2D(tex, vUv - vec2(0.0, uPx.y)), d2 = texture2D(tex, vUv - vec2(0.0, 2.0 * uPx.y));",
      "    vec4 R = r1.a > r2.a ? r1 : r2, L = l1.a > l2.a ? l1 : l2, Uu = u1.a > u2.a ? u1 : u2, D = d1.a > d2.a ? d1 : d2;",
      "    if (min(min(R.a, L.a), min(Uu.a, D.a)) > 0.95) m = (R + L + Uu + D) * 0.25;",
      "  }",
      "  float dil = m.a;",
      "  for (int i = 0; i < " + NT + "; i++) { vec2 d = TAPS[i] * uPx * uInk; dil = max(dil, texture2D(tex, vUv + d).a); dil = max(dil, texture2D(tex, vUv + d * 0.7).a); dil = max(dil, texture2D(tex, vUv + d * 0.4).a); }",
      "  vec3 wc = m.a > 0.0 ? toSRGB(shoulder(m.rgb / m.a)) : vec3(0.0);",
      "  float a = m.a; vec3 col = wc * a;",
      "  col += uInkC * dil * (1.0 - a); a += dil * (1.0 - a);",
      "  return vec4(col, a);",
      "}",
      "void main(){",
      "  vec4 B = inked(tMain);",
      "  float sh = (texture2D(t2, vUv - uShOff * uPx).a * 0.7 + texture2D(t3, vUv - uShOff * uPx * 1.8).a * 0.6) * uShadow;",
      "  B.a += clamp(sh, 0.0, 0.85) * (1.0 - B.a);",
      "  vec3 b = (texture2D(t1, vUv).rgb + texture2D(t2, vUv).rgb * 0.8 + texture2D(t3, vUv).rgb * 0.6) * uBloom;",
      "  B.rgb += toSRGB(1.0 - exp(-b)) * 0.9;",
      // letters mid-slam ride on top with their own outline, so they never merge white-on-white with their neighbours
      "  if (uTopOn > 0.5) { vec4 T = inked(tTop); B = vec4(T.rgb + B.rgb * (1.0 - T.a), T.a + B.a * (1.0 - T.a)); }",
      "  gl_FragColor = B;",
      "}"].join("\n"));
    function pass(mat, target) { quad.material = mat; renderer.setRenderTarget(target); renderer.render(postScene, postCam); }

    // ---------- draw one frame from a state object ----------
    // st.word {x, y (px, screen-down), sx, sy, rz, px, py (pivot, screen px)}; st.letters[i] {vis, top (own ink, drawn over the rest), x, y (px, screen-down), s, sx, sy, sz, rz, yaw, tilt};
    // st.fill {y (screen px), amp, ph, hot}; st.spec {x (screen px at the word's baseline), amp}; st.key {ang, int}; st.flash; st.bloom; st.ink (0..1 scale)
    const TILT = o.tilt || 0, YAW = o.yaw || 0;
    function draw(st) {
      const w = st.word || {};
      const pX = wx(w.px == null ? PCX : w.px), pY = wy(w.py == null ? PCY : w.py);
      word.position.set(pX + (w.x || 0), pY - (w.y || 0), 0);
      inner.position.set(-pX, -pY, 0);
      word.scale.set(w.sx == null ? 1 : w.sx, w.sy == null ? 1 : w.sy, 1);
      word.rotation.set(0, 0, w.rz || 0);
      let any = false, anyTop = false;
      letters.forEach((L, i) => {
        const p = (st.letters && st.letters[i]) || {}, n = L.node;
        L.on = p.vis !== false; L.top = L.on && !!p.top;
        if (L.on && !L.top) any = true; if (L.top) anyTop = true;
        const s = p.s == null ? 1 : p.s, tilt = p.tilt == null ? TILT : p.tilt, yaw = YAW + (p.yaw || 0);
        n.position.set(L.wx + (p.x || 0), L.wy - (p.y || 0), p.z || 0);
        n.rotation.set(-tilt, yaw, p.rz || 0);
        n.scale.set(s * (p.sx == null ? 1 : p.sx) / Math.cos(yaw), s * (p.sy == null ? 1 : p.sy) / Math.cos(tilt), (p.sz == null ? 1 : p.sz));
      });
      const fl = st.fill || {};
      U.uFillY.value = fl.y == null ? -1e5 : wy(fl.y); U.uFillAmp.value = fl.amp || 0; U.uFillPh.value = fl.ph || 0; U.uHotAmp.value = fl.hot || 0;
      const sp = st.spec || {};
      U.uSpecX.value = sp.x == null ? -1e5 : wx(sp.x); U.uSpecAmp.value = sp.amp || 0;
      U.uFlash.value = st.flash || 0;
      const k = st.key || {}, ka = k.ang == null ? -0.6 : k.ang;
      key.position.set(Math.sin(ka) * 9, 12, -5); key.intensity = k.int == null ? 2.0 : k.int;
      compMat.uniforms.uBloom.value = st.bloom == null ? 0.2 : st.bloom;
      compMat.uniforms.uInk.value = o.inkPx * (st.ink == null ? 1 : st.ink);
      compMat.uniforms.uShadow.value = (o.shadow == null ? 0.55 : o.shadow) * (st.ink == null ? 1 : st.ink);

      letters.forEach((L) => (L.node.visible = L.on && !L.top));
      // always render (even an empty scene): a multisampled target is only resolved into its texture by a render call,
      // so clear() alone would leave the previous frame's letters in the texture
      renderer.setRenderTarget(rtMain); renderer.clear(); renderer.render(scene, camera);
      compMat.uniforms.uTopOn.value = anyTop ? 1 : 0;
      if (anyTop) { letters.forEach((L) => (L.node.visible = L.top)); renderer.setRenderTarget(rtTop); renderer.clear(); renderer.render(scene, camera); }
      brightMat.uniforms.tSrc.value = rtMain.texture; pass(brightMat, LV[0][0]);
      let src = LV[0][0];
      LV.forEach(([A, B]) => {
        blurMat.uniforms.tSrc.value = src.texture; blurMat.uniforms.uDir.value.set(1 / A.width, 0); pass(blurMat, B);
        blurMat.uniforms.tSrc.value = B.texture; blurMat.uniforms.uDir.value.set(0, 1 / A.height); pass(blurMat, A);
        src = A;
      });
      compMat.uniforms.tMain.value = rtMain.texture; compMat.uniforms.tTop.value = rtTop.texture; compMat.uniforms.t1.value = LV[0][0].texture;
      compMat.uniforms.t2.value = LV[1][0].texture; compMat.uniforms.t3.value = LV[2][0].texture;
      pass(compMat, null);
      return any || anyTop;
    }
    return { canvas, draw, letters, lines: o.lines, cap: CAP };
  };
})();
