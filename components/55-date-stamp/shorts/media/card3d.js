/* Card3D (gta/55 date-stamp copy): stamp lettering as real geometry (Three.js r160, global THREE).
   55 changes: '%' is a 6-digit drum (0-5, the minute-tens wheel of a clock); a line with state:true floods as a whole
   (static glyphs too, e.g. ":" and "PM"); an optional caret bar (o.caret) rides a line for the type-on; slotInk[] gives
   each slot's ink box in line space.
   Lines of extruded, bevelled Archivo outlines (media/glyphs.js) in white clearcoat enamel with graphite walls and a lit lip,
   plus digit DRUMS: each '#' in a line is a mechanical counter wheel (ten digits round a cylinder about X) seen through a
   clipped window, so a number rolls like an odometer. Drum digits carry a state material: they land as the same white
   enamel and a feathered light front floods them into caption-yellow metal on the lock-in.
   Light: a PMREM studio environment, a key that rakes across the bevels, a hemisphere fill, one wide soft specular sweep.
   Post: true motion blur (sub-frame accumulation inside a shutter), HDR bloom, a soft contact shadow cast down-right.
   Seek-safe: nothing animates on its own. renderAt(t) draws the frame for time t from the page's pose(t) (pure functions
   of time), so a backward seek renders the same pixels. Identical file in a/ and b/. Adapted from gta/05 word3d.js. */
(function () {
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const srgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.substr(i, 2), 16) / 255);
  const toLin = (x) => (x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
  const lin = (hex) => { const a = srgb(hex).map(toLin); return new THREE.Color(a[0], a[1], a[2]); };
  const v3 = (c) => "vec3(" + c.r.toFixed(4) + "," + c.g.toFixed(4) + "," + c.b.toFixed(4) + ")";
  const v3s = (hex) => { const a = srgb(hex); return "vec3(" + a.map((x) => x.toFixed(4)).join(",") + ")"; };
  let KEY = 0;

  // ---------- layout: a line is a string where '#' is a drum slot (tabular: the widest digit's advance) ----------
  function layout(F, text, size, tracking) {
    const s = size / F.upm, track = (tracking || 0) * F.upm;
    const slotAdv = Math.max.apply(null, "0123456789".split("").map((d) => F.g[d][0]));
    const items = []; let pen = 0;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === "#" || ch === "%") {
        const g0 = F.g["0"];
        items.push({ ch, drum: true, n: ch === "%" ? 6 : 10, x: pen, adv: slotAdv, inkL: pen + (slotAdv - (g0[3] - g0[2])) / 2, inkR: pen + (slotAdv + (g0[3] - g0[2])) / 2 });
        pen += slotAdv + track;
      } else {
        const c = F.g[ch] ? ch : " ", g = F.g[c], nx = text[i + 1];
        items.push({ ch: c, x: pen, adv: g[0], g, inkL: pen + g[2], inkR: pen + g[3] });
        pen += g[0] + (nx && nx !== "#" && nx !== "%" ? (F.k[c + nx] || 0) : 0) + (i < text.length - 1 ? track : 0);
      }
    }
    const inks = items.filter((p) => p.ch !== " ");
    const inkL = inks[0].inkL, inkR = inks[inks.length - 1].inkR;
    let core = inks.length; while (core > 1 && /[.,!?:]/.test(inks[core - 1].ch)) core--;
    const optR = inks[core - 1].inkR;          // optical centre ignores trailing punctuation
    return { items, s, cap: F.cap * s, inkL, inkR, optR, inkW: (inkR - inkL) * s, slotAdv };
  }

  window.Card3D = function (o) {
    const W = o.W, H = o.H, E = (n) => gsap.parseEase(n);
    const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
    canvas.style.cssText = "position:absolute;left:0;top:0;width:" + W + "px;height:" + H + "px;display:block";
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;
    renderer.localClippingEnabled = true; renderer.autoClear = false;
    const scene = new THREE.Scene();
    const FOV = o.fov || 18, DIST = (H / 2) / Math.tan((FOV / 2) * Math.PI / 180);
    const camera = new THREE.PerspectiveCamera(FOV, W / H, 10, DIST * 4);
    camera.position.set(0, 0, DIST); camera.lookAt(0, 0, 0);
    const PX = o.px == null ? W / 2 : o.px, PY = o.py == null ? H / 2 : o.py;      // principal point (canvas px)
    camera.setViewOffset(W, H, W / 2 - PX, H / 2 - PY, W, H);

    // ---------- environment: a studio (top softbox, front strip, hot back bar) for the enamel and metal to reflect ----------
    const envScene = new THREE.Scene();
    const ET = o.envTint || [1.9, 1.78, 1.6];
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(" + ET.join(",") + "), hor = vec3(0.50,0.44,0.38), low = vec3(0.06,0.05,0.045);" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.0, 0.7, y)) : mix(hor, low, smoothstep(0.0, 0.5, -y));" +
        " c *= 0.75 + 0.35 * smoothstep(-0.2, 1.0, vP.z); gl_FragColor = vec4(c, 1.0); }"
    })));
    const panel = (w, h, x, y, z, k) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k * 0.98, k * 0.95), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); envScene.add(m); };
    panel(40, 12, 0, 30, 24, 2.4);      // big softbox above and in front: the face's even sheen
    panel(30, 2.2, 0, 9, 40, 3.0);      // a strip in front, slightly high: a crisp line along the top bevels
    panel(44, 6, 0, 26, -22, 3.4);      // a hot bar up and behind: the top bevels read as a lit lip
    panel(4, 30, -34, 4, 18, 1.6);      // a tall strip at the left: the left walls catch a highlight
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(envScene, 0.0, 0.1, 200).texture;

    // ---------- lights ----------
    const key = new THREE.DirectionalLight(0xfff1dc, 2.2); scene.add(key); scene.add(key.target);
    const hemi = new THREE.HemisphereLight(0xfff4e6, 0x1a1410, 0.6); scene.add(hemi);

    // ---------- materials ----------
    const GU = { uSpecX: { value: -1e5 }, uSpecW: { value: 100 }, uSpecAmp: { value: 0 } };    // the specular sweep, shared by every line
    function makeMats(C, cap, depth, bevel, isState, clip) {
      const U = Object.assign({
        uFront: { value: -1e5 }, uFeather: { value: 0.35 * cap }, uHotW: { value: 0.18 * cap }, uHotAmp: { value: 0 },
        uCapB: { value: -cap / 2 }, uCapH: { value: cap }, uDepth: { value: depth + 2 * bevel }, uBevelZ: { value: bevel }, uSpecWk: { value: cap },
        uPT: { value: new THREE.Vector4(0, 0, 0, 1e6) }, uPB: { value: new THREE.Vector4(0, 0, 0, 1e6) }, uWinF: { value: 0.16 * cap }
      }, GU);
      const W0 = C.white, S0 = C.state || C.white;
      const lip = lin(S0.lip), sNear = lin(S0.side[0]), sFar = lin(S0.side[1]), hot = lin(S0.hot || "#FFF8DC");
      const pTop = lin(W0.face[0]), pBot = lin(W0.face[1]), pNear = lin(W0.side[0]), pFar = lin(W0.side[1]);
      const faceEm = C.faceEmissive == null ? 0.82 : C.faceEmissive, preEm = C.preEmissive == null ? 0.5 : C.preEmissive;
      const key = "card3d-" + (++KEY);
      // the post-state face: N colour stops top -> bottom (S0.facePos, default evenly spaced), e.g. a metal reflection horizon
      const FP = S0.facePos || S0.face.map((_, i) => i / (S0.face.length - 1));
      let gradGLSL = "";
      for (let i = 1; i < S0.face.length; i++) gradGLSL += "  gs = mix(gs, " + v3s(S0.face[i]) + ", clamp((u - " + FP[i - 1].toFixed(4) + ") / " + Math.max(1e-4, FP[i] - FP[i - 1]).toFixed(4) + ", 0.0, 1.0));\n";
      function patch(mat, isFace) {
        mat.customProgramCacheKey = () => key + (isFace ? "f" : "s");
        mat.onBeforeCompile = (sh) => {
          Object.assign(sh.uniforms, U);
          sh.vertexShader = "varying vec3 vLP; varying vec3 vWP;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vLP = position;")
            .replace("#include <project_vertex>", "#include <project_vertex>\n vWP = (modelMatrix * vec4(transformed, 1.0)).xyz;");
          const head = "varying vec3 vLP; varying vec3 vWP; uniform vec4 uPT, uPB; uniform float uWinF, uFront, uFeather, uHotW, uHotAmp, uSpecX, uSpecW, uSpecAmp, uCapB, uCapH, uDepth, uBevelZ, uSpecWk;\n" +
            "float igK(){ return 1.0 - smoothstep(uFront - uFeather, uFront + uFeather, vLP.x); }\n";
          const faceCol =
            "  float yy = clamp((vLP.y - uCapB) / uCapH, 0.0, 1.0);\n" +
            "  float u = 1.0 - yy; vec3 gs = " + v3s(S0.face[0]) + ";\n" + gradGLSL +
            "  vec3 gold = pow(gs, vec3(2.2));\n" +
            "  vec3 wht = mix(" + v3(pBot) + ", " + v3(pTop) + ", smoothstep(0.0, 0.85, yy));\n";
          const sideCol =
            "  float dz = clamp(-vLP.z / uDepth, 0.0, 1.0);\n" +
            "  float lipK = 1.0 - smoothstep(uBevelZ * 0.7, uBevelZ * 1.25, -vLP.z);\n" +
            "  vec3 gold = mix(mix(" + v3(sNear) + ", " + v3(sFar) + ", smoothstep(0.0, 1.0, dz)), " + v3(lip) + ", lipK);\n" +
            "  vec3 wht = mix(mix(" + v3(pNear) + ", " + v3(pFar) + ", dz), " + v3(pBot) + " * 0.85, lipK);\n";
          const K = isState ? "igK()" : "0.0";
          sh.fragmentShader = head + sh.fragmentShader
            .replace("#include <color_fragment>", "#include <color_fragment>\n {\n" + (isFace ? faceCol : sideCol) +
              "  float k = " + K + "; diffuseColor.rgb = mix(wht, gold, k);\n" +
              (clip ? "  float wa = smoothstep(0.0, uWinF, dot(uPT.xyz, vWP) + uPT.w) * smoothstep(0.0, uWinF, dot(uPB.xyz, vWP) + uPB.w); diffuseColor.a *= wa;\n" : "") +   // soft drum window: digits fade into the slot edges
              " }")
            .replace("#include <metalnessmap_fragment>", "#include <metalnessmap_fragment>\n metalnessFactor = mix(" + (isFace ? "0.0" : "0.25") + ", metalnessFactor, " + K + ");")
            .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\n roughnessFactor = mix(" + (isFace ? "0.34" : "0.36") + ", roughnessFactor" + (isFace ? "" : " * (1.0 - 0.45 * (1.0 - smoothstep(uBevelZ * 0.7, uBevelZ * 1.25, -vLP.z)))") + ", " + K + ");")
            .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n {\n" + (isFace ? faceCol : sideCol) +
              "  float k = " + K + ";\n" +
              "  totalEmissiveRadiance += wht * (1.0 - k) * " + (isFace ? preEm.toFixed(3) : "0.0") + ";\n" +
              "  totalEmissiveRadiance += gold * k * " + (isFace ? faceEm.toFixed(3) : "0.05") + ";\n" +
              (isState ? "  float hd = (vLP.x - uFront) / uHotW; totalEmissiveRadiance += " + v3(hot) + " * exp(-hd * hd) * uHotAmp;\n" : "") +
              "  float sd = (vWP.x + vWP.y * 0.36 - uSpecX) / (uSpecW * uSpecWk); float sb = exp(-sd * sd * 0.9);\n" +
              "  totalEmissiveRadiance += vec3(1.0, 0.97, 0.92) * sb * uSpecAmp * " + (isFace ? "1.0" : "0.6") + ";\n }");
        };
        return mat;
      }
      const M = C.material || {};
      const face = patch(new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: M.faceMetal == null ? 0.3 : M.faceMetal, roughness: M.faceRough == null ? 0.3 : M.faceRough,
        clearcoat: M.clearcoat == null ? 0.6 : M.clearcoat, clearcoatRoughness: 0.08, envMapIntensity: M.faceEnv == null ? 0.42 : M.faceEnv, clippingPlanes: clip || null, side: THREE.FrontSide, transparent: !!clip }), true);
      const side = patch(new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: M.sideMetal == null ? 1.0 : M.sideMetal, roughness: 0.3, envMapIntensity: 1.0,
        clippingPlanes: clip || null, side: THREE.FrontSide, transparent: !!clip }), false);
      return { mats: [face, side], U };
    }

    // ---------- geometry: traced outlines extruded with a rounded bevel, front face at z = 0 ----------
    const MIN_SEG = 0.6, CURVE_SEG = 10;
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
    function glyphMesh(d, gx, s, ox, cap, depth, bevel, mats) {
      const BS = bevel * 0.6;
      const geo = new THREE.ExtrudeGeometry(shapesFor(d, gx, s, ox, cap), { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: BS, bevelOffset: -BS, bevelSegments: 4, curveSegments: 1 });
      geo.translate(0, 0, -(depth + bevel));
      geo.computeVertexNormals();
      return new THREE.Mesh(geo, mats);
    }

    // ---------- build the lines ----------
    const DIGITS = "0123456789", STEP = (2 * Math.PI) / 10;
    const lines = o.lines.map((L) => {
      const F = o.glyphs[L.set];
      const Lay = layout(F, L.text, L.size, L.tracking), s = Lay.s, cap = Lay.cap;
      const ox = -((Lay.inkL + (L.optical ? Lay.optR : Lay.inkR)) / 2) * s;   // centred on the visible ink (or ignoring trailing punctuation with optical:true)
      const depth = cap * (L.depth == null ? 0.24 : L.depth), bevel = cap * (L.bevel == null ? 0.05 : L.bevel);
      const white = makeMats(o.colors, cap, depth, bevel, !!L.state, null);
      const group = new THREE.Group(); scene.add(group);
      const slots = [], drums = [];
      Lay.items.forEach((it) => {
        if (it.ch === " ") return;
        const cx = ox + ((it.inkL + it.inkR) / 2) * s;                // pivot: ink centre on the baseline
        const slot = new THREE.Group(); slot.position.set(cx, -cap / 2, 0); group.add(slot);
        const inner = new THREE.Group(); inner.position.set(-cx, cap / 2, 0); slot.add(inner);
        if (it.drum) {
          const nD = it.n || 10, stepD = (2 * Math.PI) / nD;
          const R = cap * (L.drumR || 2.15) * (nD === 6 ? 0.6 : 1);
          const planes = [new THREE.Plane(), new THREE.Plane()];
          const st = makeMats(o.colors, cap, depth, bevel, true, planes);
          const drum = new THREE.Group(); drum.position.set(0, 0, -R); inner.add(drum);
          const holders = [];
          for (let k = 0; k < nD; k++) {
            const g = F.g[DIGITS[k]];
            const pen = it.x + (it.adv - (g[2] + g[3])) / 2;             // digit ink centred in its tabular slot
            const h = new THREE.Group(); h.rotation.x = k * stepD; drum.add(h);
            const mesh = glyphMesh(g[1], pen, s, ox, cap, depth, bevel, st.mats); mesh.position.z = R; h.add(mesh);
            holders.push(h);
          }
          const win = { top: cap + cap * (L.winTop == null ? 0.1 : L.winTop), bot: -cap * (L.winBot == null ? 0.16 : L.winBot) };
          drums.push({ slot, drum, holders, planes, st, win, n: nD, step: stepD, winF: cap * (L.winFeather == null ? 0.16 : L.winFeather), x0: ox + it.inkL * s, x1: ox + it.inkR * s });
          slots.push(slot);
        } else {
          inner.add(glyphMesh(it.g[1], it.x, s, ox, cap, depth, bevel, white.mats));
          slots.push(slot);
        }
      });
      const slotInk = Lay.items.filter((it) => it.ch !== " ").map((it) => [ox + it.inkL * s, ox + it.inkR * s]);
      return { L, F, Lay, s, cap, ox, group, slots, drums, white, slotInk, depth, bevel, lineInk: [ox + Lay.inkL * s, ox + Lay.inkR * s], tilt: L.tilt == null ? 0.24 : L.tilt, cx: L.cx, cy: L.cy,
        inkLeft: L.cx + ox + Lay.inkL * s, inkRight: L.cx + ox + Lay.inkR * s };
    });

    // ---------- caret: a glossy bar that rides a line during the type-on ----------
    let caret = null;
    if (o.caret) {
      const cm = new THREE.MeshPhysicalMaterial({ color: new THREE.Color().setRGB(...srgb(o.caret.color || "#FFD23C").map(toLin)), metalness: 0.2, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.06,
        emissive: new THREE.Color().setRGB(...srgb(o.caret.color || "#FFD23C").map(toLin)), emissiveIntensity: o.caret.glow == null ? 0.9 : o.caret.glow });
      caret = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), cm); caret.visible = false; scene.add(caret);
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
      uWide: { value: o.wideShadow == null ? 0.35 : o.wideShadow }, uShC: { value: lin(o.shadowColor || "#000000") }, uFade: { value: 1 }
    }, [
      "uniform sampler2D tMain, t1, t2, t3, t4; uniform vec2 uPx, uShOff; uniform float uBloom, uShadow, uWide, uFade; uniform vec3 uShC; varying vec2 vUv;",
      "vec3 shoulder(vec3 x){ return mix(x, 0.82 + 0.18 * (1.0 - exp(-max(x - 0.82, 0.0) / 0.18)), step(0.82, x)); }",
      "vec3 toSRGB(vec3 c){ c = clamp(c, 0.0, 1.0); return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }",
      "void main(){",
      "  vec4 m = texture2D(tMain, vUv);",
      "  float sh = (texture2D(t2, vUv + uShOff * uPx).a * 0.7 + texture2D(t3, vUv + uShOff * uPx * 2.0).a * 0.5) * uShadow;",
      "  sh += texture2D(t4, vUv + uShOff * uPx * 3.5).a * uWide;",
      "  vec3 wc = m.a > 0.0 ? toSRGB(shoulder(m.rgb / m.a)) : vec3(0.0);",
      "  vec3 shS = toSRGB(uShC);",
      "  float a = m.a; vec3 col = wc * a;",
      "  float sa = clamp(sh, 0.0, 0.82); col += shS * sa * (1.0 - a); a += sa * (1.0 - a);",
      "  vec3 b = (texture2D(t1, vUv).rgb + texture2D(t2, vUv).rgb * 0.8 + texture2D(t3, vUv).rgb * 0.6) * uBloom;",
      "  col += toSRGB(1.0 - exp(-b)) * 0.9;",
      "  gl_FragColor = vec4(col, a) * uFade;",
      "}"].join("\n"));
    function pass(mat, target, noClear) { quad.material = mat; renderer.setRenderTarget(target); if (!noClear) renderer.clear(); renderer.render(postScene, postCam); }

    // ---------- pose ----------
    const T = o.timing || {};
    const ePose = (p, d) => (p && p[d] != null ? p[d] : null);
    const tmpPlane = new THREE.Plane();
    function setPose(t, tf) {
      const P = o.pose(t, tf == null ? t : tf) || {};      // (sub-frame time, frame time): visibility decisions use the frame time
      lines.forEach((Ln) => {
        const lp = (P.lines && P.lines[Ln.L.id]) || {};
        const sc = lp.s == null ? 1 : lp.s, sx = lp.sx == null ? 1 : lp.sx, sy = lp.sy == null ? 1 : lp.sy;
        Ln.group.position.set(Ln.cx - PX + (lp.x || 0), -(Ln.cy - PY) - (lp.y || 0), lp.z || 0);
        Ln.group.rotation.set(-Ln.tilt + (lp.rx || 0), lp.ry || 0, lp.rz || 0);
        Ln.group.scale.set(sc * sx, sc * sy / Math.cos(Ln.tilt), sc);
        const gp = (P.glyphs && P.glyphs[Ln.L.id]) || null;
        Ln.slots.forEach((sl, i) => {
          const q = gp ? gp(i, Ln.slots.length) || {} : {};
          const qs = q.s == null ? 1 : q.s;
          sl.position.z = q.z || 0;
          sl.userData.base = sl.userData.base || sl.position.clone();
          sl.position.x = sl.userData.base.x + (q.x || 0); sl.position.y = sl.userData.base.y + (q.y || 0);
          sl.rotation.set(q.rx || 0, q.ry || 0, q.rz || 0);
          sl.scale.set(qs * (q.sx == null ? 1 : q.sx), qs * (q.sy == null ? 1 : q.sy), qs);
          sl.visible = q.hide ? false : true;
        });
        Ln.drums.forEach((D, j) => {
          const idx = P.drums && P.drums[Ln.L.id] ? P.drums[Ln.L.id][j] : 0;
          D.drum.rotation.x = -idx * D.step;
          const mn = P.drumMin && P.drumMin[Ln.L.id] ? P.drumMin[Ln.L.id][j] : -1e9, mx = P.drumMax && P.drumMax[Ln.L.id] ? P.drumMax[Ln.L.id][j] : 1e9;
          D.holders.forEach((h, k) => {                                 // only digits facing the window are drawn
            let a = (k - idx) * D.step; a = Math.atan2(Math.sin(a), Math.cos(a));
            const v = idx + a / D.step;                                 // this digit's unwrapped value on the wheel
            h.visible = Math.abs(a) < Math.min(D.step - 0.02, 0.62) && v > mn - 0.5 && v < mx + 0.5;   // no slivers of digits outside the count
          });
        });
        // the state front (white enamel -> yellow metal) and its hot band, per line (drums, and every glyph of a state:true line)
        const st = (P.state && P.state[Ln.L.id]) || null;
        const Us = Ln.drums.map((D) => D.st.U); if (Ln.L.state) Us.push(Ln.white.U);
        const x0 = Ln.L.state ? Ln.lineInk[0] : (Ln.drums.length ? Ln.drums[0].x0 : 0), x1 = Ln.L.state ? Ln.lineInk[1] : (Ln.drums.length ? Ln.drums[Ln.drums.length - 1].x1 : 0);
        Us.forEach((U) => {
          if (!st) { U.uFront.value = -1e5; U.uHotAmp.value = 0; return; }
          const fw = U.uFeather.value, hw = U.uHotW.value;
          U.uFront.value = (x0 - fw - 2 * hw) + (x1 - x0 + 2 * fw + 4 * hw) * clamp(st.p, 0, 1);
          U.uHotAmp.value = st.hot || 0;
        });
      });
      if (caret) {
        const cp = P.caret, Ln = cp && lines.find((l) => l.L.id === cp.line);
        if (!cp || !cp.on || !Ln) caret.visible = false;
        else {
          if (caret.parent !== Ln.group) Ln.group.add(caret);
          const w = Ln.cap * (o.caret.w || 0.12), h = Ln.cap * (o.caret.h || 1.22), d = Ln.depth + 2 * Ln.bevel;
          caret.visible = true; caret.scale.set(w * (cp.sx == null ? 1 : cp.sx), h * (cp.sy == null ? 1 : cp.sy), d);
          caret.position.set(cp.x + w / 2, Ln.cap * (o.caret.dy || 0), -d / 2 + (cp.z || 0));
        }
      }
      // the specular sweep (world x = canvas x - px at the face plane, all lines together; the band leans like x + 0.36 y)
      GU.uSpecX.value = P.specX == null ? -1e5 : P.specX; GU.uSpecAmp.value = P.specAmp || 0; GU.uSpecW.value = P.specW || 0.5;
      // key light: rakes over the top bevels from above and behind
      const ka = P.keyAngle == null ? -0.6 : P.keyAngle;
      key.position.set(Math.sin(ka) * 9, 12, -5);
      key.intensity = P.key == null ? 2.2 : P.key;
      hemi.intensity = P.hemi == null ? 0.6 : P.hemi;
      compMat.uniforms.uBloom.value = P.bloom == null ? 0.16 : P.bloom;
      compMat.uniforms.uShadow.value = P.shadow == null ? (o.shadow == null ? 0.55 : o.shadow) : P.shadow;
      brightMat.uniforms.uTh.value = P.bloomTh == null ? 1.3 : P.bloomTh;
      scene.updateMatrixWorld(true);
      lines.forEach((Ln) => Ln.drums.forEach((D) => {
        // the drum window: two planes in the slot's frame (moves, tilts and scales with the letter)
        const mw = D.slot.matrixWorld;
        D.planes[0].copy(tmpPlane.set(new THREE.Vector3(0, -1, 0), D.win.top).applyMatrix4(mw));
        D.planes[1].copy(tmpPlane.set(new THREE.Vector3(0, 1, 0), -D.win.bot).applyMatrix4(mw));
        const U = D.st.U; U.uPT.value.set(D.planes[0].normal.x, D.planes[0].normal.y, D.planes[0].normal.z, D.planes[0].constant);
        U.uPB.value.set(D.planes[1].normal.x, D.planes[1].normal.y, D.planes[1].normal.z, D.planes[1].constant);
        U.uWinF.value = D.winF * mw.getMaxScaleOnAxis();
      }));
    }

    function renderAt(t) {
      const sh = o.shutter ? o.shutter(t) : 0;                 // shutter (s): > 0 averages sub-frames across it
      const N = sh > 0 ? (typeof o.subframes === "function" ? o.subframes(t) : (o.subframes || 8)) : 1;
      renderer.setRenderTarget(rtAcc); renderer.clear();
      for (let i = 0; i < N; i++) {
        const ti = N === 1 ? t : t + sh * ((i + 0.5) / N - 0.5);
        setPose(ti, t);
        renderer.setRenderTarget(rtMain); renderer.clear(); renderer.render(scene, camera);
        accMat.uniforms.tSrc.value = rtMain.texture; accMat.uniforms.uW.value = 1 / N;
        pass(accMat, rtAcc, true);
      }
      if (N > 1) setPose(t);
      brightMat.uniforms.tSrc.value = rtAcc.texture; pass(brightMat, LV[0][0]);
      let src = LV[0][0];
      LV.forEach(([A, B]) => {
        blurMat.uniforms.tSrc.value = src.texture; blurMat.uniforms.uDir.value.set(1 / A.width, 0); pass(blurMat, B);
        blurMat.uniforms.tSrc.value = B.texture; blurMat.uniforms.uDir.value.set(0, 1 / A.height); pass(blurMat, A);
        src = A;
      });
      compMat.uniforms.tMain.value = rtAcc.texture; compMat.uniforms.t1.value = LV[0][0].texture;
      compMat.uniforms.t2.value = LV[1][0].texture; compMat.uniforms.t3.value = LV[2][0].texture; compMat.uniforms.t4.value = LV[3][0].texture;
      compMat.uniforms.uFade.value = 1;
      pass(compMat, null);
    }
    window.addEventListener("hf-seek", (e) => { if (e && e.detail && typeof e.detail.time === "number") renderAt(e.detail.time); });
    return { canvas, renderAt, lines, DIST, E };
  };
  window.Card3D.measure = (F, text, size, tracking) => layout(F, text, size, tracking);
})();
