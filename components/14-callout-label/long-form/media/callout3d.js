/* Callout3D: the callout labels as real geometry (Three.js r160, global THREE).
   Each label is extruded, bevelled Inter 900 traced from the font's own outlines (media/glyphs.js): a white-enamel face with
   graded metal sides that a feathered light front turns into polished gold (or any CONFIG colour), a key light that rakes the
   bevels, one soft specular sweep, HDR bloom, and the creator caption vernacular kept in post (one uniform ink outline around
   face + extrusion, soft contact shadow). Labels can carry a second text on a drum (a real 3D roll through a clipped window).
   The anchor pins are glossy clearcoat beads with a coloured collar. Seek-safe: nothing animates on its own; the page sets
   every label/pin state for time t and calls render(). Shared by a/ and b/ (identical file). */
(function () {
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const srgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.substr(i, 2), 16) / 255);
  const toLin = (x) => (x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
  const lin = (hex) => { const a = srgb(hex).map(toLin); return new THREE.Color(a[0], a[1], a[2]); };
  const v3 = (c) => "vec3(" + c.r.toFixed(4) + "," + c.g.toFixed(4) + "," + c.b.toFixed(4) + ")";

  // SVG path (M L H V Q C Z, implicit repeats) -> THREE.ShapePath, font units y-down -> label space y-up
  function parsePath(d, sp, ox, s) {
    const re = /([MLHVQCZ])([^MLHVQCZ]*)/gi; let m, cx = 0, cy = 0;
    const P = (x, y) => [ox + x * s, -y * s];
    while ((m = re.exec(d))) {
      const c = m[1].toUpperCase(), n = m[2].trim() ? m[2].trim().split(/[\s,]+/).map(Number) : [];
      if (c === "M") { for (let i = 0; i < n.length; i += 2) { cx = n[i]; cy = n[i + 1]; const p = P(cx, cy); i === 0 ? sp.moveTo(p[0], p[1]) : sp.lineTo(p[0], p[1]); } }
      else if (c === "L") { for (let i = 0; i < n.length; i += 2) { cx = n[i]; cy = n[i + 1]; const p = P(cx, cy); sp.lineTo(p[0], p[1]); } }
      else if (c === "H") { for (const v of n) { cx = v; const p = P(cx, cy); sp.lineTo(p[0], p[1]); } }
      else if (c === "V") { for (const v of n) { cy = v; const p = P(cx, cy); sp.lineTo(p[0], p[1]); } }
      else if (c === "Q") { for (let i = 0; i < n.length; i += 4) { const a = P(n[i], n[i + 1]), b = P(n[i + 2], n[i + 3]); cx = n[i + 2]; cy = n[i + 3]; sp.quadraticCurveTo(a[0], a[1], b[0], b[1]); } }
      else if (c === "C") { for (let i = 0; i < n.length; i += 6) { const a = P(n[i], n[i + 1]), b = P(n[i + 2], n[i + 3]), e = P(n[i + 4], n[i + 5]); cx = n[i + 4]; cy = n[i + 5]; sp.bezierCurveTo(a[0], a[1], b[0], b[1], e[0], e[1]); } }
    }
  }

  window.Callout3D = function (o) {
    const W = o.W, H = o.H, F = o.glyphs;
    const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
    canvas.style.cssText = "position:absolute;left:0;top:0;width:" + W + "px;height:" + H + "px;display:block;pointer-events:none";
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;
    renderer.localClippingEnabled = true;
    const scene = new THREE.Scene();
    const FOV = 18, DIST = (H / 2) / Math.tan((FOV / 2) * Math.PI / 180);
    const camera = new THREE.PerspectiveCamera(FOV, W / H, 10, DIST * 3);
    camera.position.set(0, 0, DIST); camera.lookAt(0, 0, 0);
    const toWorld = (x, y) => [x - W / 2, H / 2 - y];

    // environment: a warm studio (top softbox, floor bounce, dark sides) for the metal and the clearcoat to reflect
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(1.9,1.78,1.6), hor = vec3(0.5,0.42,0.34), low = vec3(0.08,0.06,0.05);" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.0, 0.7, y)) : mix(hor, low, smoothstep(0.0, 0.5, -y));" +
        " c *= 0.75 + 0.35 * smoothstep(-0.2, 1.0, vP.z); gl_FragColor = vec4(c, 1.0); }"
    })));
    const panel = (w, h, x, y, z, k) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k * 0.97, k * 0.92), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); envScene.add(m); };
    panel(40, 12, 0, 30, 24, 2.6); panel(30, 2.2, 0, 9, 40, 3.2); panel(44, 6, 0, 26, -22, 3.4); panel(8, 30, -30, 6, 18, 1.4);
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(envScene, 0.0, 0.1, 200).texture;
    const key = new THREE.DirectionalLight(0xfff3e2, 2.2); scene.add(key); scene.add(key.target);
    const hemi = new THREE.HemisphereLight(0xfff6ea, 0x2a1c10, 0.65); scene.add(hemi);

    const labels = [], pins = [];

    // ---------------- labels ----------------
    function layout(text, size, tracking) {
      const s = size / F.upm, tr = (tracking || 0) * F.upm;
      const ctx = document.createElement("canvas").getContext("2d"); ctx.font = "900 1000px Inter";
      const kern = (a, b) => (ctx.measureText(a + b).width - ctx.measureText(a).width - ctx.measureText(b).width) * F.upm / 1000;
      const pens = []; let pen = 0;
      for (let i = 0; i < text.length; i++) {
        const ch = F.g[text[i]] ? text[i] : " ", g = F.g[ch];
        pens.push({ ch, x: pen, g });
        pen += g[0] + (i < text.length - 1 ? kern(text[i], text[i + 1]) + tr : 0);
      }
      const inks = pens.filter((p) => p.ch !== " ");
      const inkL = inks[0].x + inks[0].g[2], inkR = inks[inks.length - 1].x + inks[inks.length - 1].g[3];
      return { pens, s, inkL, inkR, width: (inkR - inkL) * s, cap: F.cap * s };
    }
    function textMesh(L, matFace, matSide, depth, bevel) {
      const grp = new THREE.Group(); const ox = -L.inkL * L.s;
      L.pens.forEach((p) => {
        if (p.ch === " ") return;
        const sp = new THREE.ShapePath(); parsePath(p.g[1], sp, ox + p.x * L.s, L.s);
        const shapes = sp.toShapes(false).map((sh) => {
          const clean = (pts) => { const out = []; for (const q of pts) if (!out.length || q.distanceTo(out[out.length - 1]) > 0.5) out.push(q); while (out.length > 3 && out[0].distanceTo(out[out.length - 1]) <= 0.5) out.pop(); return out; };
          const s2 = new THREE.Shape(clean(sh.getPoints(10))); sh.holes.forEach((h) => s2.holes.push(new THREE.Path(clean(h.getPoints(10))))); return s2;
        });
        const BS = bevel * 0.7;
        const geo = new THREE.ExtrudeGeometry(shapes, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: BS, bevelOffset: -BS, bevelSegments: 4, curveSegments: 1 });
        geo.translate(0, 0, -(depth + bevel)); geo.computeVertexNormals();
        grp.add(new THREE.Mesh(geo, [matFace, matSide]));
      });
      return grp;
    }
    function makeMats(U, C, clip) {
      const base = lin(C.base[0]), baseB = lin(C.base[1]), sNear = lin(C.baseSide[0]), sFar = lin(C.baseSide[1]);
      const lip = lin(C.lip), gNear = lin(C.side[0]), gFar = lin(C.side[1]), hot = lin(C.hot);
      const gT = lin(C.face[0]), gM = lin(C.face[1]), gB = lin(C.face[2]);
      function patch(mat, isFace) {
        mat.onBeforeCompile = (sh) => {
          Object.assign(sh.uniforms, U);
          sh.vertexShader = "varying vec3 vLP;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vLP = position;");
          const head = "varying vec3 vLP; uniform float uFront, uFeather, uHotW, uHotAmp, uSpecX, uSpecW, uSpecAmp, uCapH, uDepth, uBevelZ, uBaseGain;\n" +
            "float igK(){ return 1.0 - smoothstep(uFront - uFeather, uFront + uFeather, vLP.x); }\n";
          const faceCol =
            "  float yy = clamp(vLP.y / uCapH, 0.0, 1.0); float u = 1.0 - yy;\n" +
            "  vec3 gold = u < 0.48 ? mix(" + v3(gT) + ", " + v3(gM) + ", smoothstep(0.0, 0.48, u)) : mix(" + v3(gM) + ", " + v3(gB) + ", smoothstep(0.48, 1.0, u));\n" +
            "  gold *= 1.0 - 0.28 * exp(-pow((yy - 0.47) / 0.05, 2.0));\n" +   // a dark reflection horizon across the metal face
            "  vec3 wht = mix(" + v3(baseB) + ", " + v3(base) + ", smoothstep(0.0, 0.85, yy));\n";
          const sideCol =
            "  float dz = clamp(-vLP.z / uDepth, 0.0, 1.0);\n" +
            "  float lipK = 1.0 - smoothstep(uBevelZ * 0.7, uBevelZ * 1.3, -vLP.z);\n" +
            "  vec3 gold = mix(mix(" + v3(gNear) + ", " + v3(gFar) + ", smoothstep(0.0, 1.0, dz)), " + v3(lip) + ", lipK);\n" +
            "  vec3 wht = mix(mix(" + v3(sNear) + ", " + v3(sFar) + ", dz), " + v3(baseB) + " * 0.9, lipK);\n";
          sh.fragmentShader = head + sh.fragmentShader
            .replace("#include <color_fragment>", "#include <color_fragment>\n {\n" + (isFace ? faceCol : sideCol) + "  float k = igK(); diffuseColor.rgb = mix(wht, gold, k);\n }")
            .replace("#include <metalnessmap_fragment>", "#include <metalnessmap_fragment>\n metalnessFactor = mix(" + (isFace ? "0.0" : "0.2") + ", metalnessFactor, igK());")
            .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\n roughnessFactor = mix(" + (isFace ? "0.36" : "0.4") + ", roughnessFactor, igK());")
            .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n {\n" + (isFace ? faceCol : sideCol) +
              "  float k = igK();\n" +
              "  totalEmissiveRadiance += wht * (1.0 - k) * " + (isFace ? "0.42" : "0.04") + " * uBaseGain;\n" +
              "  totalEmissiveRadiance += gold * k * " + (isFace ? "0.62" : "0.06") + ";\n" +
              "  float hd = (vLP.x - uFront) / uHotW; totalEmissiveRadiance += " + v3(hot) + " * exp(-hd * hd) * uHotAmp;\n" +
              "  float sd = (vLP.x + vLP.y * 0.5 - uSpecX) / uSpecW; float sb = exp(-sd * sd);\n" +
              "  totalEmissiveRadiance += vec3(1.0, 0.96, 0.88) * sb * uSpecAmp * " + (isFace ? "1.0" : "0.5") + ";\n }");
        };
        if (clip) mat.clippingPlanes = clip;
        return mat;
      }
      const face = patch(new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.35, roughness: 0.26, clearcoat: 0.6, clearcoatRoughness: 0.08, envMapIntensity: 0.55 }), true);
      const side = patch(new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.3, envMapIntensity: 1.0 }), false);
      return [face, side];
    }

    // add({text, size, depth, bevel, tracking, colors, drum: second text (optional)}) -> label handle
    function add(cfg) {
      const C = cfg.colors, L = layout(cfg.text, cfg.size, cfg.tracking);
      const L2 = cfg.drum ? layout(cfg.drum, cfg.size, cfg.tracking) : null;
      const em = cfg.size;
      const U = {
        uFront: { value: -1e4 }, uFeather: { value: 0.32 * em }, uHotW: { value: 0.12 * em }, uHotAmp: { value: 0 },
        uSpecX: { value: -1e4 }, uSpecW: { value: 0.22 * em }, uSpecAmp: { value: 0 },
        uCapH: { value: L.cap }, uDepth: { value: cfg.depth + 2 * cfg.bevel }, uBevelZ: { value: cfg.bevel }, uBaseGain: { value: 1 }
      };
      const clip = [new THREE.Plane(), new THREE.Plane()];   // the label's window: it rises out of its shelf and rolls through it
      const [mf, ms] = makeMats(U, C, clip);
      const root = new THREE.Group(); scene.add(root);           // origin: bottom centre of the ink box, on the baseline
      const tilt = new THREE.Group(); root.add(tilt);
      const R = L.cap * 0.62;
      const drum = new THREE.Group(); drum.position.set(0, L.cap / 2, -R); tilt.add(drum);
      const a = textMesh(L, mf, ms, cfg.depth, cfg.bevel); a.position.set(-L.width / 2, -L.cap / 2, R); drum.add(a);
      let b = null;
      if (L2) {
        const holder = new THREE.Group(); holder.rotation.x = Math.PI / 2; drum.add(holder);
        b = textMesh(L2, mf, ms, cfg.depth, cfg.bevel); b.position.set(-L2.width / 2, -L2.cap / 2, R); holder.add(b);
      }
      const h = {
        cfg, U, root, tilt, drum, a, b, L, L2, width: L.width, width2: L2 ? L2.width : L.width, cap: L.cap,
        st: { x: 0, y: 0, s: 1, sx: 1, sy: 1, rx: -0.2, ry: -0.16, rz: 0, drum: 0, ignite: 0, hot: 0, spec: -1, vis: false, rise: 0 },
        apply() {
          const st = this.st; root.visible = st.vis && st.s > 0.002;
          if (!root.visible) return;
          const w = toWorld(st.x, st.y); root.position.set(w[0], w[1], 0);
          root.rotation.set(0, 0, st.rz); root.scale.set(st.s * st.sx, st.s * st.sy, st.s);
          tilt.rotation.set(st.rx, st.ry, 0); tilt.scale.set(1, 1 / Math.cos(st.rx), 1); tilt.position.y = -st.rise * L.cap * 1.35;
          drum.rotation.x = -st.drum * Math.PI / 2;
          // drum: exactly one face shows at a time (outgoing until it has rolled 45 deg, then the incoming one), so the
          // extruded faces never show through or pile onto each other mid-roll
          a.visible = b ? st.drum < 0.5 : st.drum < 0.999; if (b) b.visible = st.drum >= 0.5;
          // ignition runs across the label that is showing; shader x is label-local (0 = ink left)
          const wNow = st.drum > 0.5 ? this.width2 : this.width;
          U.uFront.value = -U.uFeather.value - U.uHotW.value + (wNow + 2 * U.uFeather.value + 3 * U.uHotW.value) * st.ignite + (st.ignite <= 0 ? -1e4 : 0);
          U.uHotAmp.value = st.hot;
          U.uSpecX.value = st.spec < 0 ? -1e4 : (-0.6 * em) + (wNow + 1.4 * em) * st.spec;
          U.uSpecAmp.value = st.spec > 0 && st.spec < 1 ? 0.55 * Math.sin(Math.PI * st.spec) : 0;
          {
            root.updateMatrixWorld(true);
            const up = new THREE.Vector3(0, 1, 0).applyQuaternion(root.quaternion).normalize();
            const top = new THREE.Vector3(0, L.cap * (cfg.drum ? 1.2 : 4), 0).applyMatrix4(root.matrixWorld), bot = new THREE.Vector3(0, -L.cap * 0.22, 0).applyMatrix4(root.matrixWorld);
            clip[0].setFromNormalAndCoplanarPoint(up.clone().negate(), top); clip[1].setFromNormalAndCoplanarPoint(up, bot);
          }
        }
      };
      labels.push(h); return h;
    }

    // ---------------- pins: glossy bead + coloured collar ----------------
    function addPin(cfg) {
      const g = new THREE.Group(); scene.add(g);
      const bead = new THREE.Mesh(new THREE.SphereGeometry(cfg.r, 40, 24), new THREE.MeshPhysicalMaterial({ color: lin(cfg.bead || "#FFFFFF"), roughness: 0.22, metalness: 0.0, clearcoat: 1.0, clearcoatRoughness: 0.05, emissive: lin(cfg.bead || "#FFFFFF"), emissiveIntensity: 0.22 }));
      const collarMat = new THREE.MeshPhysicalMaterial({ color: lin(cfg.collar), roughness: 0.25, metalness: 0.55, clearcoat: 0.8, clearcoatRoughness: 0.1, emissive: lin(cfg.collar), emissiveIntensity: 0.35 });
      const collar = new THREE.Mesh(new THREE.TorusGeometry(cfg.r * 1.55, cfg.r * 0.34, 20, 64), collarMat);
      g.add(bead); g.add(collar);
      const h = { g, bead, collar, collarMat, st: { x: 0, y: 0, s: 0, sy: 1, vis: false, glow: 0 },
        apply() { const st = this.st; g.visible = st.vis && st.s > 0.002; if (!g.visible) return;
          const w = toWorld(st.x, st.y); g.position.set(w[0], w[1], 0); g.scale.set(st.s, st.s * st.sy, st.s);
          g.rotation.set(-0.35, 0.25, 0); collarMat.emissiveIntensity = 0.35 + 2.2 * st.glow; } };
      pins.push(h); return h;
    }

    // ---------------- post: HDR bloom + ink outline + contact shadow ----------------
    const HF = renderer.capabilities.isWebGL2 && renderer.extensions.has("EXT_color_buffer_float");
    const TYPE = HF ? THREE.HalfFloatType : THREE.UnsignedByteType;
    const rtMain = new THREE.WebGLRenderTarget(W, H, { type: TYPE, samples: renderer.capabilities.isWebGL2 ? 4 : 0 });
    const RTO = { type: TYPE, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false };
    const LV = [2, 4, 8].map((d) => [new THREE.WebGLRenderTarget(W / d, H / d, RTO), new THREE.WebGLRenderTarget(W / d, H / d, RTO)]);
    const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), postScene = new THREE.Scene();
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2)); quad.frustumCulled = false; postScene.add(quad);
    const VS = "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }";
    const post = (u, fs) => new THREE.ShaderMaterial({ uniforms: u, vertexShader: VS, fragmentShader: fs, depthTest: false, depthWrite: false, blending: THREE.NoBlending, toneMapped: false });
    const brightMat = post({ tSrc: { value: null }, uTh: { value: 1.3 } },
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
      uPx: { value: new THREE.Vector2(1 / W, 1 / H) }, uInk: { value: o.inkPx || 5 }, uInkC: { value: lin(o.inkColor || "#0E0F13") },
      uBloom: { value: 0.12 }, uShadow: { value: o.shadow == null ? 0.55 : o.shadow }, uShOff: { value: new THREE.Vector2(-(o.shadowOffX || 3), o.shadowOff || 9) }
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
      "  a += clamp(sh, 0.0, 0.75) * (1.0 - a);",
      "  vec3 b = (texture2D(t1, vUv).rgb + texture2D(t2, vUv).rgb * 0.8 + texture2D(t3, vUv).rgb * 0.6) * uBloom;",
      "  col += toSRGB(1.0 - exp(-b)) * 0.9;",
      "  gl_FragColor = vec4(col, a);",
      "}"].join("\n"));
    function pass(mat, target) { quad.material = mat; renderer.setRenderTarget(target); renderer.render(postScene, postCam); }

    // render: o.light = {keyAngle, keyBoost, bloom}
    function render(lt) {
      lt = lt || {};
      labels.forEach((l) => l.apply()); pins.forEach((p) => p.apply());
      const ka = lt.keyAngle == null ? -0.4 : lt.keyAngle;
      key.position.set(Math.sin(ka) * 9, 12, -5);   // above and behind: rakes the top bevels, never mirrors off the flat face
      key.intensity = 2.0 + (lt.keyBoost || 0);
      compMat.uniforms.uBloom.value = lt.bloom == null ? 0.12 : lt.bloom;
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
    return { canvas, add, addPin, render, layout };
  };
})();
