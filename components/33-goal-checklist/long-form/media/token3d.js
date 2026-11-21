/* Tokens3D: the goal checklist's round goal tokens as real lit geometry (Three.js r160, global THREE).
   Each token is a machined ring (a lathe of a rounded, slightly domed cross-section) around a recessed, domed photo face
   under an additive glass lens. The ring is one clear-coated enamel whose colour is swept clockwise from white to green
   by a shader angle mask (a hot leading edge rides the sweep), so "ticking" a goal is a real material state change.
   A green coin with an extruded white tick pops at the lower right; a gold selector ring marks the current goal.
   Seek-safe: nothing animates on its own; render(S) draws the frame for the state S (a pure function of time upstream). */
(function () {
  const TAU = Math.PI * 2, D2R = Math.PI / 180;
  window.Tokens3D = function (o) {
    const W = o.W, H = o.H, DPR = o.dpr || 2, R = o.R, TH = o.depth || R * 0.24;
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:absolute;left:" + o.left + "px;top:" + o.top + "px;width:" + W + "px;height:" + H + "px;display:block;pointer-events:none";
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(DPR); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = o.exposure || 1.25;
    const scene = new THREE.Scene();
    const FOV = 16, DIST = (H / 2) / Math.tan((FOV / 2) * D2R);
    const camera = new THREE.PerspectiveCamera(FOV, W / H, 10, DIST * 3);
    camera.position.set(0, 0, DIST); camera.lookAt(0, 0, 0);
    const toW = (px, py) => [px - (o.left + W / 2), (o.top + H / 2) - py];

    // ---------- studio environment: top softbox, a front-left strip, a warm bar low right ----------
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(1.0,1.03,1.08), hor = vec3(0.16,0.17,0.2), low = vec3(0.02,0.02,0.025);" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.05, 0.8, y)) : mix(hor, low, smoothstep(0.0, 0.45, -y)); gl_FragColor = vec4(c, 1.0); }"
    })));
    const panel = (w, h, x, y, z, c) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); envScene.add(m); };
    panel(40, 12, -4, 30, 22, new THREE.Color(3.2, 3.2, 3.3));
    panel(4, 28, -26, 4, 26, new THREE.Color(2.6, 2.7, 2.9));
    panel(26, 5, 16, -14, 24, new THREE.Color(1.6, 1.25, 0.9));
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(envScene, 0.0, 0.1, 200).texture;

    const key = new THREE.DirectionalLight(0xffffff, 2.1); key.position.set(-0.55, 0.9, 1.0); scene.add(key);
    const rimL = new THREE.DirectionalLight(0xffffff, 1.3); rimL.position.set(-0.95, 0.85, 0.22); scene.add(rimL);   // grazing from upper left: a hard lit lip at 10-11 o'clock
    scene.add(new THREE.HemisphereLight(0xf4f7ff, 0x1a1c22, 0.55));
    const rake = new THREE.PointLight(0xffffff, 0, R * 3.2, 0); scene.add(rake);

    // ---------- canvas textures ----------
    const tex = (c, srgb) => { const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
    function radialCanvas(size, stops) {
      const c = document.createElement("canvas"); c.width = c.height = size; const g = c.getContext("2d");
      const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2); stops.forEach((s) => gr.addColorStop(s[0], s[1]));
      g.fillStyle = gr; g.fillRect(0, 0, size, size); return c;
    }
    const shadowTex = tex(radialCanvas(256, [[0, "rgba(0,0,0,0.7)"], [0.45, "rgba(0,0,0,0.5)"], [0.68, "rgba(0,0,0,0.16)"], [1, "rgba(0,0,0,0)"]]));
    const haloTex = tex(radialCanvas(256, [[0, "rgba(255,255,255,0)"], [0.5, "rgba(255,255,255,0.0)"], [0.6, "rgba(255,255,255,0.85)"], [0.7, "rgba(255,255,255,0.42)"], [0.85, "rgba(255,255,255,0.1)"], [1, "rgba(255,255,255,0)"]]));
    function faceCanvas(img) {
      const S = 512, c = document.createElement("canvas"); c.width = c.height = S; const g = c.getContext("2d");
      const iw = img.naturalWidth, ih = img.naturalHeight, k = Math.max(S / iw, S / ih);
      g.drawImage(img, (S - iw * k) / 2, (S - ih * k) / 2, iw * k, ih * k);
      let gr = g.createRadialGradient(S / 2, S / 2, S * 0.3, S / 2, S / 2, S / 2);   // recess: the ring casts a soft inner shadow
      gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(0.78, "rgba(0,0,0,0.16)"); gr.addColorStop(0.93, "rgba(0,0,0,0.5)"); gr.addColorStop(1, "rgba(0,0,0,0.72)");
      g.fillStyle = gr; g.fillRect(0, 0, S, S);
      gr = g.createLinearGradient(0, 0, 0, S);                                         // key from above: the top of the well is in shade
      gr.addColorStop(0, "rgba(0,0,0,0.3)"); gr.addColorStop(0.22, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = gr; g.fillRect(0, 0, S, S);
      return c;
    }

    // ---------- geometry ----------
    function lathe(pts, seg) { const g = new THREE.LatheGeometry(pts, seg); g.rotateX(Math.PI / 2); return g; }
    function ringProfile(ri, ro, T, c, bulge, n) {
      const P = [], V = (x, y) => P.push(new THREE.Vector2(x, y));
      const arc = (cx, cy, a0, a1) => { for (let k = 0; k <= n; k++) { const a = a0 + (a1 - a0) * k / n; V(cx + c * Math.cos(a), cy + c * Math.sin(a)); } };
      arc(ri + c, c, Math.PI, 1.5 * Math.PI);
      arc(ro - c, c, 1.5 * Math.PI, TAU);
      arc(ro - c, T - c, 0, 0.5 * Math.PI);
      const m = 12; for (let k = 1; k < m; k++) { const u = k / m, r = (ro - c) + ((ri + c) - (ro - c)) * u; V(r, T + bulge * Math.sin(Math.PI * u)); }
      arc(ri + c, T - c, 0.5 * Math.PI, Math.PI);
      P.push(P[0].clone());
      return P;
    }
    function domeProfile(r, z0, dome) { const P = []; for (let k = 0; k <= 16; k++) { const u = 1 - k / 16, rr = r * u; P.push(new THREE.Vector2(Math.max(rr, 0.001), z0 + dome * (1 - u * u))); } return P; }
    function planarUV(g, r) { const p = g.attributes.position, uv = g.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / (2 * r) + 0.5, p.getY(i) / (2 * r) + 0.5); uv.needsUpdate = true; }

    const RI = R * 0.79, RC = Math.min((R - RI) * 0.42, TH * 0.45);
    const ringGeo = lathe(ringProfile(RI, R, TH, RC, R * 0.05, 7), 160);
    const faceGeo = lathe(domeProfile(RI + 1.5, TH * 0.3, TH * 0.32), 96); planarUV(faceGeo, RI + 1.5);
    const lensGeo = lathe(domeProfile(RI + 0.5, TH * 0.3 + 1.2, TH * 0.36), 96);
    const backGeo = new THREE.CircleGeometry(R * 0.98, 64); backGeo.rotateY(Math.PI);
    const RB = R * 0.36, TB = R * 0.13, RBC = TB * 0.45;
    const coinGeo = lathe((() => { const P = [], n = 6, V = (x, y) => P.push(new THREE.Vector2(x, y));
      V(0.001, 0); for (let k = 0; k <= n; k++) { const a = 1.5 * Math.PI + 0.5 * Math.PI * k / n; V(RB - RBC + RBC * Math.cos(a), RBC + RBC * Math.sin(a)); }
      for (let k = 0; k <= n; k++) { const a = 0.5 * Math.PI * k / n; V(RB - RBC + RBC * Math.cos(a), TB - RBC + RBC * Math.sin(a)); }
      for (let k = 1; k <= 6; k++) { const u = k / 6; V((RB - RBC) * (1 - u) + 0.001, TB + TB * 0.18 * Math.sin(u * Math.PI / 2)); }
      return P; })(), 72);
    // the tick: a thick check stroke with a mitred elbow, extruded and bevelled
    const tickGeo = (() => {
      const A = [-0.46, 0.02], B = [-0.13, -0.3], C = [0.47, 0.33], h = 0.115;
      const nrm = (d) => { const l = Math.hypot(d[0], d[1]); return [-d[1] / l, d[0] / l]; };
      const n1 = nrm([B[0] - A[0], B[1] - A[1]]), n2 = nrm([C[0] - B[0], C[1] - B[1]]);
      const mi = [n1[0] + n2[0], n1[1] + n2[1]], ml = Math.hypot(mi[0], mi[1]); const mu = [mi[0] / ml, mi[1] / ml];
      const md = h / (mu[0] * n1[0] + mu[1] * n1[1]);
      const pts = [[A[0] + n1[0] * h, A[1] + n1[1] * h], [B[0] + mu[0] * md, B[1] + mu[1] * md], [C[0] + n2[0] * h, C[1] + n2[1] * h],
        [C[0] - n2[0] * h, C[1] - n2[1] * h], [B[0] - mu[0] * md, B[1] - mu[1] * md], [A[0] - n1[0] * h, A[1] - n1[1] * h]];
      const s = new THREE.Shape(); const k = RB * 1.02;
      pts.forEach((p, i) => (i ? s.lineTo(p[0] * k, p[1] * k) : s.moveTo(p[0] * k, p[1] * k)));
      s.closePath();
      const g = new THREE.ExtrudeGeometry(s, { depth: TB * 0.25, bevelEnabled: true, bevelThickness: TB * 0.22, bevelSize: RB * 0.045, bevelSegments: 3, curveSegments: 4 });
      g.translate(0, 0, TB * 1.12); return g;
    })();
    const selGeo = lathe(ringProfile(R * 1.06, R * 1.06 + R * 0.1, TH * 0.6, R * 0.04, R * 0.015, 5), 160);

    // ---------- materials ----------
    const cWhite = new THREE.Color(o.white || "#F4F6F9"), cGreen = new THREE.Color(o.green || "#2BD65A");
    function rimMaterial() {
      const U = { uProg: { value: 0 }, uHot: { value: 0 }, uGlow: { value: 0 }, uColA: { value: cWhite.clone() }, uColB: { value: cGreen.clone() }, uBand: { value: -9 }, uBandAmp: { value: 0 }, uR: { value: R } };
      const m = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 0.9, side: THREE.DoubleSide });
      m.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, U);
        sh.vertexShader = "varying vec3 vObjP;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vObjP = position;");
        sh.fragmentShader = "uniform float uProg; uniform float uHot; uniform float uGlow; uniform vec3 uColA; uniform vec3 uColB; uniform float uBand; uniform float uBandAmp; uniform float uR; varying vec3 vObjP;\n" +
          sh.fragmentShader
            .replace("#include <color_fragment>", "#include <color_fragment>\n float gAng = atan(vObjP.x, vObjP.y); gAng = gAng < 0.0 ? gAng + 6.2831853 : gAng; float gA = gAng / 6.2831853;\n" +
              " float gK = uProg >= 0.999 ? 1.0 : 1.0 - smoothstep(uProg - 0.006, uProg + 0.006, gA); if (uProg <= 0.0005) gK = 0.0;\n diffuseColor.rgb = mix(uColA, uColB, gK);")
            .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n float gD = gA - uProg; float gE = exp(-gD * gD * 700.0) * uHot;\n" +
              " totalEmissiveRadiance += vec3(0.85, 1.0, 0.88) * gE * 1.4 + uColB * uGlow * gK;\n" +
              " float bd = (vObjP.x * 0.62 - vObjP.y * 0.78) / uR - uBand; totalEmissiveRadiance += vec3(1.0, 1.0, 0.96) * exp(-bd * bd * 7.0) * uBandAmp;");
      };
      m.customProgramCacheKey = () => "gc-rim";
      m.__U = U; return m;
    }
    function lensMaterial() {
      const U = { uBand: { value: -9 }, uBandAmp: { value: 0 }, uR: { value: R } };
      const m = new THREE.MeshPhysicalMaterial({ color: 0x000000, roughness: 0.05, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.5,
        transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
      m.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, U);
        sh.vertexShader = "varying vec3 vObjP;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vObjP = position;");
        sh.fragmentShader = "uniform float uBand; uniform float uBandAmp; uniform float uR; varying vec3 vObjP;\n" + sh.fragmentShader
          .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n float bd = (vObjP.x * 0.62 - vObjP.y * 0.78) / uR - uBand; float bw = exp(-bd * bd * 9.0);\n" +
            " totalEmissiveRadiance += vec3(1.0, 1.0, 0.97) * (bw * 0.55 + exp(-bd * bd * 60.0) * 0.35) * uBandAmp;");
      };
      m.customProgramCacheKey = () => "gc-lens";
      m.__U = U; return m;
    }
    const backMat = new THREE.MeshStandardMaterial({ color: 0x15171c, roughness: 0.6, metalness: 0.1 });
    const coinMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(o.coin || "#1DBE4E"), roughness: 0.26, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.0,
      emissive: new THREE.Color(o.coin || "#1DBE4E"), emissiveIntensity: 0.12 });
    const tickMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.22, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 0.8 });
    const selMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(o.select || "#FFD23C"), roughness: 0.22, metalness: 0.55, clearcoat: 1, clearcoatRoughness: 0.05,
      emissive: new THREE.Color(o.select || "#FFD23C"), emissiveIntensity: 0.45, envMapIntensity: 1.2, transparent: true });

    // ---------- tokens ----------
    const toks = o.tokens.map((d) => {
      const grp = new THREE.Group(), spin = new THREE.Group(); grp.add(spin); scene.add(grp);
      const rimMat = rimMaterial();
      spin.add(new THREE.Mesh(ringGeo, rimMat));
      const faceMat = new THREE.MeshBasicMaterial({ map: tex(faceCanvas(d.img), true), toneMapped: false });
      spin.add(new THREE.Mesh(faceGeo, faceMat));
      const lensMat = lensMaterial(); const lens = new THREE.Mesh(lensGeo, lensMat); lens.renderOrder = 2; spin.add(lens);
      spin.add(new THREE.Mesh(backGeo, backMat));
      const badge = new THREE.Group(), coinSpin = new THREE.Group(); badge.add(coinSpin);
      badge.position.set(R * 0.7, -R * 0.7, TH * 0.75); spin.add(badge);
      coinSpin.add(new THREE.Mesh(coinGeo, coinMat)); coinSpin.add(new THREE.Mesh(tickGeo, tickMat));
      const sh = new THREE.Mesh(new THREE.PlaneGeometry(R * 2.9, R * 2.9), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, toneMapped: false, color: 0x000000 }));
      sh.renderOrder = -2; scene.add(sh);
      const mkHalo = (col) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(R * 3.3, R * 3.3), new THREE.MeshBasicMaterial({ map: haloTex, color: new THREE.Color(col), transparent: true, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending, opacity: 0 })); m.renderOrder = -1; scene.add(m); return m; };
      return { d, grp, spin, rimMat, lensMat, faceMat, badge, coinSpin, sh, hy: mkHalo(o.select || "#FFD23C"), hg: mkHalo(o.green || "#2BD65A") };
    });
    const sel = new THREE.Group(); const selMesh = new THREE.Mesh(selGeo, selMat); sel.add(selMesh); scene.add(sel);

    function render(S) {
      S.tokens.forEach((s, i) => {
        const k = toks[i], [x, y] = toW(s.x, s.y), vis = s.s > 0.004;
        k.grp.visible = vis; k.sh.visible = vis && s.shadow > 0.002;
        k.grp.position.set(x, y, s.z || 0); k.grp.scale.setScalar(Math.max(s.s, 0.0001));
        k.spin.rotation.set((s.rx || 0) * D2R, (s.ry || 0) * D2R, (s.rz || 0) * D2R);
        k.rimMat.__U.uProg.value = s.prog; k.rimMat.__U.uHot.value = s.hot || 0; k.rimMat.__U.uGlow.value = s.glow || 0;
        const bp = s.band == null ? -9 : s.band, ba = s.bandAmp || 0;
        k.rimMat.__U.uBand.value = bp; k.rimMat.__U.uBandAmp.value = ba; k.lensMat.__U.uBand.value = bp; k.lensMat.__U.uBandAmp.value = ba;
        const dm = s.dim == null ? 1 : s.dim; k.faceMat.color.setRGB(dm, dm, dm);
        const ts = s.tick ? s.tick.s : 0; k.badge.visible = ts > 0.004; k.badge.scale.setScalar(Math.max(ts, 0.0001));
        k.coinSpin.rotation.set(0, (s.tick ? s.tick.ry || 0 : 0) * D2R, (s.tick ? s.tick.rz || 0 : 0) * D2R);
        k.sh.position.set(x + R * 0.06, y - R * 0.14, -TH); k.sh.scale.setScalar(Math.max(s.s, 0.0001)); k.sh.material.opacity = s.shadow;
        k.hy.visible = vis && (s.hy || 0) > 0.003; k.hy.position.set(x, y, -TH * 0.5); k.hy.scale.setScalar(s.s * (s.hyS || 1)); k.hy.material.opacity = Math.min(1, s.hy || 0);
        k.hg.visible = vis && (s.hg || 0) > 0.003; k.hg.position.set(x, y, -TH * 0.6); k.hg.scale.setScalar(s.s * (s.hgS || 1)); k.hg.material.opacity = Math.min(1, s.hg || 0);
      });
      const L = S.sel;
      sel.visible = !!L && L.a > 0.004 && L.s > 0.004;
      if (sel.visible) { const [x, y] = toW(L.x, L.y); sel.position.set(x, y, L.z || 0); sel.scale.set(L.s * (L.sx || 1), L.s, L.s); selMat.opacity = Math.min(1, L.a); selMat.emissiveIntensity = 0.45 + 0.5 * (L.glow || 0); }
      const K = S.rake;
      if (K && K.i > 0.001) { const [x, y] = toW(K.x, K.y); rake.position.set(x, y, K.z || R * 1.4); rake.intensity = K.i; } else rake.intensity = 0;
      renderer.render(scene, camera);
    }
    return { canvas, render, R };
  };
})();
