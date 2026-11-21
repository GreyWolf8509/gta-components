/* YEAR3D: release-year numerals as real geometry (Three.js r160, global THREE). Variant A's copy (b/ keeps its own): adds sub-frame motion blur (st.subs),
   a flat enamel spine bar with grooves + a gold pulse, a per-card spec gate, face-clipped bloom and a lifted-card shadow.
   Every digit is an extruded, bevelled mesh traced from Inter Black's tabular figures (media/glyphs.js). Faces are clearcoated
   enamel over polished-metal walls with a lit lip. Each glyph instance owns a "lit" mix (a dormant colour set -> the lit set) and
   clip rows; a global liquid fill turns any set into the payoff set behind a wobbling hot meniscus. A key light rakes across the
   bevels, one specular band sweeps the faces, HDR bloom peaks on the payoff. Optional: a glossy enamel rail (the timeline spine)
   with a travelling light pulse. The creator vernacular is kept in post: one ink outline around face + extrusion, soft drop shadow.
   Seek-safe: nothing animates on its own. draw(state) renders one frame from a plain state object computed from timeline time. */
(function () {
  const srgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.substr(i, 2), 16) / 255);
  const toLin = (x) => (x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
  const vs = (hex) => "vec3(" + srgb(hex).map((x) => x.toFixed(4)).join(",") + ")";
  const vl = (hex) => "vec3(" + srgb(hex).map((x) => toLin(x).toFixed(4)).join(",") + ")";
  const f = (x) => (+x).toFixed(4);

  window.YEAR3D = function (o) {
    const W = o.W, H = o.H, F = o.glyphs, PCX = o.pcx, PCY = o.pcy, SIZE = o.size, SC = SIZE / F.upm, CAP = F.cap * SC;
    const wx = (px) => px - PCX, wy = (py) => PCY - py;

    // ---------- renderer + camera (1 world unit = 1 px on the z = 0 plane, principal point at PCX, PCY) ----------
    const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
    canvas.style.cssText = "position:absolute;left:0;top:0;width:" + W + "px;height:" + H + "px;display:block";
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;
    const scene = new THREE.Scene();
    const FOV = o.fov || 10, DIST = (H / 2) / Math.tan((FOV / 2) * Math.PI / 180);
    const camera = new THREE.PerspectiveCamera(FOV, W / H, 10, DIST * 4);
    camera.position.set(0, 0, DIST); camera.lookAt(0, 0, 0);
    camera.setViewOffset(W, H, W / 2 - PCX, H / 2 - PCY, W, H);

    // ---------- environment: a neutral studio (top softbox, a crisp strip, a hot bar behind, a side card) ----------
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(1.85,1.80,1.72), hor = vec3(0.46,0.45,0.44), low = vec3(0.05,0.05,0.06);" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.0, 0.7, y)) : mix(hor, low, smoothstep(0.0, 0.5, -y));" +
        " c *= 0.75 + 0.35 * smoothstep(-0.2, 1.0, vP.z); gl_FragColor = vec4(c, 1.0); }"
    })));
    const panel = (w, h, x, y, z, k) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k * 0.98, k * 0.95), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); envScene.add(m); };
    panel(40, 12, 0, 30, 24, 2.4);
    panel(30, 2.2, 0, 9, 40, 3.0);
    panel(44, 6, 0, 26, -22, 3.2);
    panel(6, 30, -34, 4, 10, 1.4);
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(envScene, 0.0, 0.1, 200).texture;

    // ---------- lights ----------
    const key = new THREE.DirectionalLight(0xffffff, 2.0); scene.add(key); scene.add(key.target);
    const fillL = new THREE.DirectionalLight(0xffffff, 0.7); fillL.position.set(-4, 6, 10); scene.add(fillL);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x1c1c24, 0.55));

    // ---------- materials: one program per (set, lit set, fill set); every glyph instance owns its material pair ----------
    const U = {
      uCap: { value: CAP }, uDepth: { value: 1 }, uBevelZ: { value: 1 },
      uFillOn: { value: o.fill ? 1 : 0 }, uFillY: { value: -1e5 }, uFillAmp: { value: 0 }, uFillK: { value: 0.024 }, uFillPh: { value: 0 },
      uHotW: { value: o.hotW || 6 }, uHotAmp: { value: 0 },
      uSpecX: { value: -1e5 }, uSpecW: { value: (o.specW || 0.5) * CAP }, uSpecAmp: { value: 0 }, uFlash: { value: 0 }
    };
    const SETS = o.sets, HOT = vl(o.hot || "#FFF6D0");
    const grad3 = (c, h) => c.length === 4
      ? "grad4(" + vs(c[3]) + "," + vs(c[2]) + "," + vs(c[1]) + "," + vs(c[0]) + ", yy, " + f(h == null ? 0.5 : h) + ")"
      : "grad3(" + vs(c[2]) + "," + vs(c[1]) + "," + vs(c[0]) + ", yy)";
    const mixv = (a, b, w) => "mix(" + f(a) + ", " + f(b) + ", " + w + ")";
    function makeMats(name) {
      const A = SETS[name], Lt = A.lit ? SETS[A.lit] : A, B = o.fill && !A.nofill ? SETS[o.fill.set] : Lt, fillOn = o.fill && !A.nofill ? 1 : 0;
      const make = (isFace) => {
        const m = isFace
          ? new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.3, clearcoat: 1.0, clearcoatRoughness: 0.06, envMapIntensity: A.env ? A.env[0] : 0.55 })
          : new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.6, roughness: 0.32, envMapIntensity: A.env ? A.env[1] : 1.0 });
        const UC = { uClip: { value: new THREE.Vector2(1e5, -1e5) }, uLit: { value: 0 }, uFillEn: { value: 1 }, uSpecEn: { value: 1 } };
        m.userData.clip = UC.uClip.value; m.userData.lit = UC.uLit; m.userData.fillEn = UC.uFillEn; m.userData.specEn = UC.uSpecEn;
        const sideC = (S) => "mix(mix(" + vl(S.side[0]) + ", " + vl(S.side[1]) + ", smoothstep(0.0, 1.0, dz)), " + vl(S.lip) + ", lipK)";
        const col = isFace
          ? "  float yy = clamp(vLP.y / uCap + 0.5, 0.0, 1.0);\n  vec3 cA = mix(pow(" + grad3(A.face, A.horizon) + ", vec3(2.2)), pow(" + grad3(Lt.face, Lt.horizon) + ", vec3(2.2)), uLit);\n" +
            "  vec3 cB = pow(" + grad3(B.face, B.horizon) + ", vec3(2.2));\n"
          : "  float dz = clamp(-vLP.z / uDepth, 0.0, 1.0); float lipK = 1.0 - smoothstep(uBevelZ * 0.6, uBevelZ * 1.3, -vLP.z);\n" +
            "  vec3 cA = mix(" + sideC(A) + ", " + sideC(Lt) + ", uLit);\n  vec3 cB = " + sideC(B) + ";\n";
        const i = isFace ? 0 : 1;
        const pr = (k, d) => (S) => (S[k] ? S[k][i] : d);
        const L3 = (k, d) => "mix(" + mixv(pr(k, d)(A), pr(k, d)(Lt), "uLit") + ", " + f(pr(k, d)(B)) + ", fk)";
        m.onBeforeCompile = (sh) => {
          Object.assign(sh.uniforms, U, UC);
          sh.vertexShader = "varying vec3 vLP; varying vec3 vWP;\n" + sh.vertexShader.replace("#include <begin_vertex>",
            "#include <begin_vertex>\n vLP = position; vWP = (modelMatrix * vec4(transformed, 1.0)).xyz;");
          const head = "varying vec3 vLP; varying vec3 vWP;\n" +
            "uniform float uCap, uDepth, uBevelZ, uFillOn, uFillY, uFillAmp, uFillK, uFillPh, uHotW, uHotAmp, uSpecX, uSpecW, uSpecAmp, uFlash, uLit, uFillEn, uSpecEn; uniform vec2 uClip;\n" +
            "vec3 grad3(vec3 b, vec3 m, vec3 t, float y){ return y < 0.5 ? mix(b, m, smoothstep(0.0, 0.5, y)) : mix(m, t, smoothstep(0.5, 1.0, y)); }\n" +
            "vec3 grad4(vec3 b, vec3 lo, vec3 hi, vec3 t, float y, float h){ float w = 0.018; if (y < h - w) return mix(b, lo, y / (h - w));" +
            " if (y > h + w) return mix(hi, t, smoothstep(0.0, 1.0, (y - h - w) / (1.0 - h - w))); return mix(lo, hi, smoothstep(0.0, 1.0, (y - h + w) / (2.0 * w))); }\n" +
            "float lvlAt(float x){ return uFillY + uFillAmp * (sin(x * uFillK + uFillPh) + 0.45 * sin(x * uFillK * 2.3 - uFillPh * 1.37)); }\n" +
            "float fillK(){ if (uFillOn < 0.5 || uFillEn < 0.5 || " + f(fillOn) + " < 0.5) return 0.0; float l = lvlAt(vWP.x); return 1.0 - smoothstep(l - 1.4, l + 1.4, vWP.y); }\n";
          sh.fragmentShader = head + sh.fragmentShader
            .replace("#include <clipping_planes_fragment>", "#include <clipping_planes_fragment>\n if (gl_FragCoord.y > uClip.x || gl_FragCoord.y < uClip.y) discard;")
            .replace("#include <color_fragment>", "#include <color_fragment>\n {\n" + col + "  diffuseColor.rgb = mix(cA, cB, fillK());\n }")
            .replace("#include <metalnessmap_fragment>", "#include <metalnessmap_fragment>\n { float fk = fillK(); metalnessFactor = " + L3("metal", 0) + "; }")
            .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\n { float fk = fillK(); roughnessFactor = " + L3("rough", 0.3) + "; }")
            .replace("#include <aomap_fragment>", "#include <aomap_fragment>\n {\n  float fk = fillK(); float tk = " + L3("tint", 0) + ";\n" +
              "  vec3 tint = mix(vec3(1.0), diffuseColor.rgb * 1.25, tk);\n" +
              "  reflectedLight.indirectSpecular *= tint; reflectedLight.directSpecular = min(reflectedLight.directSpecular, vec3(1.5)) * tint * (1.0 - 0.75 * tk);\n" +
              (isFace ? "  #ifdef USE_CLEARCOAT\n  vec3 ctint = mix(vec3(1.0), 0.04 + diffuseColor.rgb * 0.5, tk); clearcoatSpecularIndirect *= ctint; clearcoatSpecularDirect = min(clearcoatSpecularDirect, vec3(1.2)) * ctint * (1.0 - 0.85 * tk);\n  #endif\n" : "") + " }")
            .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n {\n" + col +
              "  float fk = fillK(); vec3 c = mix(cA, cB, fk);\n" +
              "  totalEmissiveRadiance += c * " + L3("emis", 0) + " * (1.0 + uFlash * fk * " + (isFace ? "1.0" : "0.12") + ");\n" +
              "  float hd = (vWP.y - lvlAt(vWP.x)) / uHotW; totalEmissiveRadiance += " + HOT + " * exp(-hd * hd) * uHotAmp * uFillOn * " + f(fillOn) + " * " + (isFace ? "1.0" : "0.5") + ";\n" +
              "  float tk2 = " + L3("tint", 0) + ";\n" +
              "  vec3 band = mix(vec3(1.0, 0.97, 0.88), c * 1.35 + vec3(0.03, 0.02, 0.0), tk2 * " + f(o.specTint == null ? 0.55 : o.specTint) + ");\n" +
              "  float sd = (vWP.x + vWP.y * 0.45 - uSpecX) / uSpecW; totalEmissiveRadiance += band * exp(-sd * sd) * uSpecAmp * uSpecEn * " + (isFace ? "1.0" : "0.55") + ";\n }");
        };
        m.customProgramCacheKey = () => "year3d-" + name + "-" + (o.fill ? o.fill.set : "") + "-" + i;
        return m;
      };
      return [make(true), make(false)];
    }

    // ---------- geometry: one extruded, bevelled geometry per glyph, pivot at its ink centre (x) and the cap middle (y) ----------
    const DEPTH = o.depth, BT = o.bevel, BS = o.bevel * (o.bevelK || 0.6), MIN_SEG = 0.6, CURVE_SEG = o.curveSeg || 12;
    const DTOT = DEPTH + 2 * BT;
    U.uDepth.value = DTOT; U.uBevelZ.value = BT;
    const geos = {};
    function geoFor(ch) {
      if (geos[ch]) return geos[ch];
      const g = F.g[ch], gmid = (g[2] + g[3]) / 2;
      const sp = new THREE.ShapePath(), re = /([MLQCZ])([^MLQCZ]*)/g; let m;
      while ((m = re.exec(g[1]))) {
        const n = m[2].trim() ? m[2].trim().split(/[\s,]+/).map(Number) : [], P = [];
        for (let i = 0; i < n.length; i += 2) P.push((n[i] - gmid) * SC, -n[i + 1] * SC - CAP / 2);
        if (m[1] === "M") sp.moveTo(P[0], P[1]); else if (m[1] === "L") sp.lineTo(P[0], P[1]);
        else if (m[1] === "Q") sp.quadraticCurveTo(P[0], P[1], P[2], P[3]); else if (m[1] === "C") sp.bezierCurveTo(P[0], P[1], P[2], P[3], P[4], P[5]);
      }
      const clean = (pts) => { const out = []; for (const p of pts) if (!out.length || p.distanceTo(out[out.length - 1]) > MIN_SEG) out.push(p);
        while (out.length > 3 && out[0].distanceTo(out[out.length - 1]) <= MIN_SEG) out.pop(); return out; };
      const shapes = sp.toShapes(false).map((sh) => {
        const s2 = new THREE.Shape(clean(sh.getPoints(CURVE_SEG)));
        sh.holes.forEach((h) => s2.holes.push(new THREE.Path(clean(h.getPoints(CURVE_SEG)))));
        return s2;
      });
      const geo = new THREE.ExtrudeGeometry(shapes, { depth: DEPTH, bevelEnabled: true, bevelThickness: BT, bevelSize: BS, bevelOffset: -BS, bevelSegments: o.bevelSeg || 4, curveSegments: 1 });
      geo.translate(0, 0, -(DEPTH + BT));   // front face at z = 0
      geo.computeVertexNormals();
      return (geos[ch] = geo);
    }
    const adv = (ch) => F.g[ch][0] * SC, inkL = (ch) => F.g[ch][2] * SC, inkR = (ch) => F.g[ch][3] * SC;
    const kern = (a, b) => (F.k[a + b] || 0) * SC;

    // ---------- instance pools: per glyph + colour set, created on demand (deterministic: same frame -> same draw) ----------
    const pools = {}, used = {};
    const root = new THREE.Group(); scene.add(root);
    function acquire(ch, set) {
      const k = ch + "|" + set, P = pools[k] || (pools[k] = []), n = used[k] || 0;
      used[k] = n + 1;
      if (n < P.length) return P[n];
      const mats = makeMats(set), mesh = new THREE.Mesh(geoFor(ch), mats);
      mesh.frustumCulled = false; root.add(mesh); P.push(mesh); return mesh;
    }
    (o.prewarm || []).forEach(([ch, set, n]) => { for (let i = 0; i < n; i++) acquire(ch, set); });

    // ---------- optional rail: a glossy enamel bar (rounded cross-section) extruded along local z, scaled to length ----------
    let rail = null;
    const RU = { uPulse: { value: -1e5 }, uPulseW: { value: 60 }, uPulseAmp: { value: 0 }, uLen: { value: 1 } };
    if (o.rail) {
      const rw = o.rail.w, rh = o.rail.h, rr = Math.min(rw, rh) * 0.45, sh = new THREE.Shape();
      sh.moveTo(-rw / 2 + rr, -rh / 2); sh.lineTo(rw / 2 - rr, -rh / 2); sh.quadraticCurveTo(rw / 2, -rh / 2, rw / 2, -rh / 2 + rr);
      sh.lineTo(rw / 2, rh / 2 - rr); sh.quadraticCurveTo(rw / 2, rh / 2, rw / 2 - rr, rh / 2); sh.lineTo(-rw / 2 + rr, rh / 2);
      sh.quadraticCurveTo(-rw / 2, rh / 2, -rw / 2, rh / 2 - rr); sh.lineTo(-rw / 2, -rh / 2 + rr); sh.quadraticCurveTo(-rw / 2, -rh / 2, -rw / 2 + rr, -rh / 2);
      const geo = new THREE.ExtrudeGeometry(sh, { depth: 1, bevelEnabled: false, curveSegments: 6 });
      geo.computeVertexNormals();
      const RC = o.rail.colors || ["#F4F6FA", "#9AA3B4"];
      const mat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color().setRGB(...srgb(RC[0]).map(toLin)), metalness: 0.1, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 0.7 });
      mat.onBeforeCompile = (s) => {
        Object.assign(s.uniforms, RU);
        s.vertexShader = "varying vec3 vRP;\n" + s.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vRP = position;");
        s.fragmentShader = "varying vec3 vRP; uniform float uPulse, uPulseW, uPulseAmp, uLen;\n" + s.fragmentShader
          .replace("#include <color_fragment>", "#include <color_fragment>\n { float k = smoothstep(" + f(-o.rail.h / 2) + ", " + f(o.rail.h / 2) + ", vRP.y); diffuseColor.rgb = mix(" + vl(RC[1]) + ", diffuseColor.rgb, k); }")
          .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n { float d = (vRP.z * uLen - uPulse) / uPulseW; totalEmissiveRadiance += " + HOT + " * exp(-d * d) * uPulseAmp; totalEmissiveRadiance += diffuseColor.rgb * 0.18; }");
      };
      rail = new THREE.Mesh(geo, mat); rail.frustumCulled = false; rail.visible = false; root.add(rail);
    }
    // ---------- optional ticks: small rounded enamel blocks standing on the rail (pooled; each owns a glow uniform) ----------
    const tickPool = [], tickGeos = {};
    function tickGeo(w, h, d) {
      const k = w + "x" + h + "x" + d; if (tickGeos[k]) return tickGeos[k];
      const r = Math.min(w, h) * 0.3, sh = new THREE.Shape();
      sh.moveTo(-w / 2 + r, -h / 2); sh.lineTo(w / 2 - r, -h / 2); sh.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
      sh.lineTo(w / 2, h / 2 - r); sh.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2); sh.lineTo(-w / 2 + r, h / 2);
      sh.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r); sh.lineTo(-w / 2, -h / 2 + r); sh.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
      const g = new THREE.ExtrudeGeometry(sh, { depth: d, bevelEnabled: true, bevelThickness: 1.2, bevelSize: 1.2, bevelOffset: -1.2, bevelSegments: 2, curveSegments: 4 });
      g.translate(0, 0, -d / 2); g.computeVertexNormals(); return (tickGeos[k] = g);
    }
    function tickMesh(i, w, h, d) {
      if (!tickPool[i]) {
        const RC = (o.rail && o.rail.colors) || ["#F4F6FA", "#9AA3B4"], TU = { uGlow: { value: 0 }, uTH: { value: h } };
        const mat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color().setRGB(...srgb(RC[0]).map(toLin)), metalness: 0.1, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 0.7 });
        mat.onBeforeCompile = (s) => {
          Object.assign(s.uniforms, TU);
          s.vertexShader = "varying vec3 vTP;\n" + s.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vTP = position;");
          s.fragmentShader = "varying vec3 vTP; uniform float uGlow, uTH;\n" + s.fragmentShader
            .replace("#include <color_fragment>", "#include <color_fragment>\n { float k = smoothstep(-uTH * 0.5, uTH * 0.5, vTP.y); diffuseColor.rgb = mix(" + vl(RC[1]) + ", diffuseColor.rgb, k); }")
            .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n totalEmissiveRadiance += diffuseColor.rgb * 0.18 + " + HOT + " * uGlow;");
        };
        mat.customProgramCacheKey = () => "year3d-tick";
        const m = new THREE.Mesh(tickGeo(w, h, d), mat); m.frustumCulled = false; m.userData.TU = TU; root.add(m); tickPool[i] = m;
      }
      const m = tickPool[i]; m.geometry = tickGeo(w, h, d); m.userData.TU.uTH.value = h; return m;
    }
    // ---------- spine segments (pooled rails, unit length along local z, scaled) and round studs (enamel beads) ----------
    const segPool = [], studPool = [];
    const RC2d = (o.rail && o.rail.colors) || ["#F4F6FA", "#9AA3B4"], RCrod = (o.rail && o.rail.rod) || RC2d;
    function enamel(key, hRange, cols) {
      const RC2 = cols || RC2d;
      const TU = { uGlow: { value: 0 }, uTH: { value: hRange } };
      const mat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color().setRGB(...srgb(RC2[0]).map(toLin)), metalness: 0.1, roughness: 0.26, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 0.8 });
      mat.onBeforeCompile = (s) => {
        Object.assign(s.uniforms, TU);
        s.vertexShader = "varying vec3 vTP;\n" + s.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vTP = position;");
        s.fragmentShader = "varying vec3 vTP; uniform float uGlow, uTH;\n" + s.fragmentShader
          .replace("#include <color_fragment>", "#include <color_fragment>\n { float k = smoothstep(-uTH * 0.5, uTH * 0.5, vTP.y); diffuseColor.rgb = mix(" + vl(RC2[1]) + ", diffuseColor.rgb, k); }")
          .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n totalEmissiveRadiance += diffuseColor.rgb * 0.2 + " + HOT + " * uGlow;");
      };
      mat.customProgramCacheKey = () => "year3d-" + key;
      return { mat, TU };
    }
    // spine bar: a flat enamel bar (rounded-rect section, unit size, extruded along local z, scaled per segment).
    // Lit top edge, darker underside, engraved grooves (one per year in between) and a liquid-gold pulse that can travel along it.
    let segGeo = null, studGeo = null;
    const GOLDP = vl(o.pulseColor || "#FFB21E");
    function segMesh(i) {
      if (!segGeo) {
        const r = 0.32, sh = new THREE.Shape();
        sh.moveTo(-0.5 + r, -0.5); sh.lineTo(0.5 - r, -0.5); sh.quadraticCurveTo(0.5, -0.5, 0.5, -0.5 + r);
        sh.lineTo(0.5, 0.5 - r); sh.quadraticCurveTo(0.5, 0.5, 0.5 - r, 0.5); sh.lineTo(-0.5 + r, 0.5);
        sh.quadraticCurveTo(-0.5, 0.5, -0.5, 0.5 - r); sh.lineTo(-0.5, -0.5 + r); sh.quadraticCurveTo(-0.5, -0.5, -0.5 + r, -0.5);
        segGeo = new THREE.ExtrudeGeometry(sh, { depth: 1, bevelEnabled: false, curveSegments: 6 }); segGeo.computeVertexNormals();
      }
      if (!segPool[i]) {
        const RC2 = RC2d;
        const TU = { uLen: { value: 1 }, uPulse: { value: -10 }, uPulseW: { value: 40 }, uPulseAmp: { value: 0 }, uNStep: { value: 1 }, uNN: { value: 0 }, uNW: { value: 3 }, uGlow: { value: 0 } };
        const mat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color().setRGB(...srgb(RC2[0]).map(toLin)), metalness: 0.05, roughness: 0.26, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 0.8 });
        mat.onBeforeCompile = (s) => {
          Object.assign(s.uniforms, TU);
          s.vertexShader = "varying vec3 vTP;\n" + s.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vTP = position;");
          s.fragmentShader = "varying vec3 vTP; uniform float uLen, uPulse, uPulseW, uPulseAmp, uNStep, uNN, uNW, uGlow;\n" + s.fragmentShader
            .replace("#include <color_fragment>", "#include <color_fragment>\n {\n" +
              "  float k = smoothstep(-0.45, 0.4, vTP.y); diffuseColor.rgb = mix(" + vl(RC2[1]) + ", diffuseColor.rgb, k);\n" +
              "  float zz = vTP.z / uNStep, kn = floor(zz + 0.5), dn = abs(zz - kn) * uNStep * uLen;\n" +
              "  if (kn >= 1.0 && kn <= uNN) diffuseColor.rgb *= mix(0.16, 1.0, smoothstep(uNW * 0.55, uNW, dn));\n" +
              "  float dp = (vTP.z - uPulse) * uLen / uPulseW; float pk = clamp(exp(-dp * dp) * uPulseAmp, 0.0, 1.0);\n" +
              "  diffuseColor.rgb = mix(diffuseColor.rgb, " + GOLDP + " * mix(0.55, 1.0, k), pk);\n }")
            .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n {\n" +
              "  float dp = (vTP.z - uPulse) * uLen / uPulseW; float pk = clamp(exp(-dp * dp) * uPulseAmp, 0.0, 1.0);\n" +
              "  totalEmissiveRadiance += diffuseColor.rgb * (0.2 + 0.9 * pk) + " + HOT + " * uGlow;\n }");
        };
        mat.customProgramCacheKey = () => "year3d-bar";
        const m = new THREE.Mesh(segGeo, mat); m.frustumCulled = false; m.userData.TU = TU; root.add(m); segPool[i] = m;
      }
      return segPool[i];
    }
    function studMesh(i) {
      if (!studGeo) studGeo = new THREE.SphereGeometry(1, 24, 16);
      if (!studPool[i]) { const e = enamel("stud", 2.0), m = new THREE.Mesh(studGeo, e.mat); m.frustumCulled = false; m.userData.TU = e.TU; root.add(m); studPool[i] = m; }
      return studPool[i];
    }

    // ---------- post: HDR bloom + the creator vernacular (ink outline around everything, soft drop shadow) ----------
    const HF = renderer.capabilities.isWebGL2 && renderer.extensions.has("EXT_color_buffer_float");
    const TYPE = HF ? THREE.HalfFloatType : THREE.UnsignedByteType;
    const rtMain = new THREE.WebGLRenderTarget(W, H, { type: TYPE, samples: renderer.capabilities.isWebGL2 ? 4 : 0 });
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
      tMain: { value: null }, t1: { value: null }, t2: { value: null }, t3: { value: null },
      uPx: { value: new THREE.Vector2(1 / W, 1 / H) }, uInk: { value: o.inkPx }, uInkC: { value: new THREE.Vector3(inkC[0], inkC[1], inkC[2]) },
      uBloom: { value: 0.2 }, uShadow: { value: o.shadow == null ? 0.55 : o.shadow },
      uShOff: { value: new THREE.Vector2((o.shadowOff || [0, 10])[0], -(o.shadowOff || [0, 10])[1]) },
      uShLift: { value: 0 }, uShX0: { value: 1e5 }, uBloomClip: { value: o.bloomClip || 0 }
    }, [
      "uniform sampler2D tMain, t1, t2, t3; uniform vec2 uPx, uShOff; uniform float uInk, uBloom, uShadow, uShLift, uShX0, uBloomClip; uniform vec3 uInkC; varying vec2 vUv;",
      "vec3 shoulder(vec3 x){ return mix(x, 0.82 + 0.18 * (1.0 - exp(-max(x - 0.82, 0.0) / 0.18)), step(0.82, x)); }",
      "vec3 toSRGB(vec3 c){ c = clamp(c, 0.0, 1.0); return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }",
      "const vec2 TAPS[" + NT + "] = vec2[](" + taps.join(",") + ");",
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
      "  float fa = texture2D(tMain, vUv).a, ga = B.a;",
      // a card in the air (right of uShX0): its shadow stays down on the slot it will land in, lighter and softer, and tightens on contact
      "  float rx = smoothstep(uShX0, uShX0 + 70.0, vUv.x / uPx.x), lf = uShLift * rx, sf = clamp(lf / 90.0, 0.0, 1.0);",
      "  vec2 lo = vec2(lf * 0.12, -lf);",
      "  float sh = (texture2D(t2, vUv - (uShOff + lo) * uPx).a * 0.7 * (1.0 - 0.6 * sf) + texture2D(t3, vUv - (uShOff * 1.8 + lo) * uPx).a * 0.6 * (1.0 - 0.25 * sf)) * uShadow;",
      "  B.a += clamp(sh, 0.0, 0.85) * (1.0 - B.a);",
      "  vec3 b = (texture2D(t1, vUv).rgb + texture2D(t2, vUv).rgb * 0.8 + texture2D(t3, vUv).rgb * 0.6) * uBloom;",
      // bloom can be kept on the faces (plus a little on the ink rim): no halo puff on bright skies
      "  float bm = mix(1.0, clamp(fa + (ga - fa) * 0.3, 0.0, 1.0), uBloomClip);",
      "  B.rgb += toSRGB(1.0 - exp(-b)) * 0.9 * bm;",
      "  gl_FragColor = B;",
      "}"].join("\n"));
    function pass(mat, target) { quad.material = mat; renderer.setRenderTarget(target); renderer.render(postScene, postCam); }
    // motion blur: several sub-frame scene renders averaged (premultiplied, additive) into one half-float target
    const rtAcc = new THREE.WebGLRenderTarget(W, H, RTO);
    const accMat = post({ tSrc: { value: null }, uW: { value: 1 } }, "uniform sampler2D tSrc; uniform float uW; varying vec2 vUv; void main(){ gl_FragColor = texture2D(tSrc, vUv) * uW; }");
    accMat.blending = THREE.CustomBlending; accMat.blendEquation = THREE.AddEquation; accMat.blendEquationAlpha = THREE.AddEquation;
    accMat.blendSrc = THREE.OneFactor; accMat.blendDst = THREE.OneFactor; accMat.blendSrcAlpha = THREE.OneFactor; accMat.blendDstAlpha = THREE.OneFactor;

    // ---------- draw one frame from a state object ----------
    // st.items[]: screen mode {ch, set, x (ink centre px), y (cap middle px), z, s, sx, sy, rx, ry, rz, clip, lit}
    //             or world mode {ch, set, p:[X,Y,Z] (world, z = 0 plane in px around the principal point), q:THREE.Quaternion, s, lit}
    // st.rail {p:[X,Y,Z] near end, q:THREE.Quaternion (local z = along the rail, local y = up), len, pulse:{z, amp, w}}
    // st.fill {y (screen px), amp, ph, hot}; st.spec {x (screen px), amp}; st.key {ang, int}; st.flash; st.bloom; st.ink (0..1)
    const TILT = o.tilt || 0, YAW = o.yaw || 0;
    function setup(st) {
      for (const k in used) used[k] = 0;
      for (const k in pools) pools[k].forEach((m) => (m.visible = false));
      let any = false;
      (st.items || []).forEach((it) => {
        if (it.s === 0 || it.sx === 0 || it.sy === 0) return;
        const m = acquire(it.ch, it.set || "base"); m.visible = true; any = true;
        const s = it.s == null ? 1 : it.s;
        if (it.p) {
          m.position.set(it.p[0], it.p[1], it.p[2]); m.quaternion.copy(it.q); m.scale.set(s * (it.sx == null ? 1 : it.sx), s * (it.sy == null ? 1 : it.sy), s);
        } else {
          const tilt = TILT + (it.tilt || 0), yaw = YAW + (it.ry || 0);
          m.position.set(wx(it.x), wy(it.y), it.z || 0);
          m.rotation.set(-tilt + (it.rx || 0), yaw, it.rz || 0);
          m.scale.set(s * (it.sx == null ? 1 : it.sx) / Math.cos(YAW), s * (it.sy == null ? 1 : it.sy) / Math.cos(TILT), s * (it.sz == null ? 1 : it.sz));
        }
        const c = it.clip;
        m.material.forEach((mm) => { mm.userData.clip.set(c ? H - c[0] : 1e5, c ? H - c[1] : -1e5); mm.userData.lit.value = it.lit || 0; mm.userData.fillEn.value = it.fillOn == null ? 1 : it.fillOn; mm.userData.specEn.value = it.specOn == null ? 1 : it.specOn; });
      });
      if (rail) {
        const R = st.rail;
        rail.visible = !!(R && R.len > 0.5);
        if (rail.visible) {
          any = true; rail.position.set(R.p[0], R.p[1], R.p[2]); rail.quaternion.copy(R.q); rail.scale.set(1, 1, R.len);
          RU.uLen.value = R.len; const pu = R.pulse || {}; RU.uPulse.value = pu.z == null ? -1e5 : pu.z; RU.uPulseAmp.value = pu.amp || 0; RU.uPulseW.value = pu.w || 60;
        }
      }
      tickPool.forEach((m) => (m.visible = false));
      (st.ticks || []).forEach((tk, i) => {
        if (tk.s <= 0.002) return;
        const m = tickMesh(i, tk.w, tk.h, tk.d); m.visible = true; any = true;
        m.position.set(tk.p[0], tk.p[1], tk.p[2]); m.quaternion.copy(tk.q); m.scale.set(tk.s, tk.s * (tk.sy == null ? 1 : tk.sy), tk.s);
        m.userData.TU.uGlow.value = tk.glow || 0;
      });
      segPool.forEach((m) => (m.visible = false)); studPool.forEach((m) => (m.visible = false));
      (st.segs || []).forEach((sg, i) => {
        if (sg.th <= 0.05 || sg.len <= 0.5) return;
        const m = segMesh(i); m.visible = true; any = true;
        m.position.set(sg.p[0], sg.p[1], sg.p[2]); m.quaternion.copy(sg.q); m.scale.set(sg.thx || sg.th, sg.thy || sg.th, sg.len);
        const TU = m.userData.TU; TU.uGlow.value = sg.glow || 0;
        if (TU.uLen) { TU.uLen.value = sg.len; const pu = sg.pulse || {}; TU.uPulse.value = pu.z == null ? -10 : pu.z; TU.uPulseAmp.value = pu.amp || 0; TU.uPulseW.value = pu.w || 40;
          const nt = sg.notch || {}; TU.uNStep.value = nt.step || 1; TU.uNN.value = nt.n || 0; TU.uNW.value = nt.w || 3; }
      });
      (st.studs || []).forEach((sd, i) => {
        if (sd.r <= 0.05) return;
        const m = studMesh(i); m.visible = true; any = true;
        m.position.set(sd.p[0], sd.p[1], sd.p[2]); if (sd.q) m.quaternion.copy(sd.q); else m.quaternion.identity(); m.scale.set(sd.r, sd.r, sd.r * (sd.sz == null ? 1 : sd.sz));
        m.userData.TU.uGlow.value = sd.glow || 0;
      });
      const fl = st.fill || {};
      U.uFillY.value = fl.y == null ? -1e5 : wy(fl.y); U.uFillAmp.value = fl.amp || 0; U.uFillPh.value = fl.ph || 0; U.uHotAmp.value = fl.hot || 0;
      const sp = st.spec || {};
      U.uSpecX.value = sp.x == null ? -1e5 : wx(sp.x); U.uSpecAmp.value = sp.amp || 0;
      U.uFlash.value = st.flash || 0;
      const k = st.key || {}, ka = k.ang == null ? -0.6 : k.ang;
      key.position.set(Math.sin(ka) * 9, 12, -5 + (k.z || 0)); key.intensity = k.int == null ? 2.0 : k.int;
      compMat.uniforms.uBloom.value = st.bloom == null ? 0.2 : st.bloom;
      compMat.uniforms.uInk.value = o.inkPx * (st.ink == null ? 1 : st.ink);
      compMat.uniforms.uShadow.value = (o.shadow == null ? 0.55 : o.shadow) * (st.ink == null ? 1 : st.ink);
      const shl = st.shLift || {}; compMat.uniforms.uShLift.value = shl.h || 0; compMat.uniforms.uShX0.value = shl.x0 == null ? 1e5 : shl.x0;
      return any;
    }
    function draw(st) {
      let any = false, SRC = rtMain;
      const subs = st.subs && st.subs.length > 1 ? st.subs : null;
      if (subs) {
        renderer.setRenderTarget(rtAcc); renderer.setClearColor(0x000000, 0); renderer.clear();
        accMat.uniforms.uW.value = 1 / subs.length; accMat.uniforms.tSrc.value = rtMain.texture;
        subs.forEach((ss) => {
          any = setup(ss) || any;
          renderer.setRenderTarget(rtMain); renderer.clear(); renderer.render(scene, camera);
          const ac = renderer.autoClear; renderer.autoClear = false; pass(accMat, rtAcc); renderer.autoClear = ac;
        });
        SRC = rtAcc;
      }
      any = setup(st) || any;   // the frame's own state sets the post uniforms (and the scene when there is no blur)
      if (!subs) { renderer.setRenderTarget(rtMain); renderer.clear(); renderer.render(scene, camera); }
      brightMat.uniforms.tSrc.value = SRC.texture; pass(brightMat, LV[0][0]);
      let src = LV[0][0];
      LV.forEach(([A, B]) => {
        blurMat.uniforms.tSrc.value = src.texture; blurMat.uniforms.uDir.value.set(1 / A.width, 0); pass(blurMat, B);
        blurMat.uniforms.tSrc.value = B.texture; blurMat.uniforms.uDir.value.set(0, 1 / A.height); pass(blurMat, A);
        src = A;
      });
      compMat.uniforms.tMain.value = SRC.texture; compMat.uniforms.t1.value = LV[0][0].texture;
      compMat.uniforms.t2.value = LV[1][0].texture; compMat.uniforms.t3.value = LV[2][0].texture;
      pass(compMat, null);
      return any;
    }
    // world <-> screen helpers for the composition (z = 0 plane is 1:1 px around the principal point)
    const project = (P) => { const k = DIST / (DIST - P[2]); return [PCX + P[0] * k, PCY - P[1] * k, k]; };
    return { canvas, draw, cap: CAP, adv, inkL, inkR, kern, size: SIZE, depthTot: DTOT, dist: DIST, wx, wy, project };
  };
})();
