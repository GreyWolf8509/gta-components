/* Vinyl3D: a real vinyl record for the song credit (Three.js r160, global THREE). Shared by a/ and b/ (identical copies).
   - Record: one lathe profile (spindle hole wall, raised label plateau, groove field, raised outer lip, rounded edge),
     black vinyl with clearcoat. The grooves are a shader patch: fine rings + three glossy track gaps in the roughness, and
     the record's radial "bow-tie" light wedge, computed in world angle so it stays put while the record spins under it.
   - Printed paper label (canvas texture, asymmetric so the spin reads), spins with the record.
   - Optional album sleeve (laminated gloss front with canvas art, paper spine, open right edge the record slides out of).
   - Optional chrome tonearm (base, post, counterweight, tube, headshell) that swings and lifts, casting a soft shadow
     onto the record.
   - Studio PMREM environment, warm key (shadow caster), hemisphere fill, a rim light, ACES tone mapping.
   Seek-safe: nothing animates by itself; render(state) draws one frame from a state computed from timeline time.
   Coordinates: 1 world unit = 1 CSS px at z = 0; px(x, y) maps canvas pixels (top-left origin) to world. */
(function () {
  window.Vinyl3D = function (o) {
    const W = o.w, H = o.h, SS = o.ss || 2, PI = Math.PI;
    const canvas = document.createElement("canvas");
    canvas.width = W * SS; canvas.height = H * SS;
    canvas.style.cssText = "position:absolute;left:0;top:0;width:" + W + "px;height:" + H + "px;display:block";
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(1); renderer.setSize(W * SS, H * SS, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = o.exposure || 1.0;
    if (o.arm) { renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; }
    const scene = new THREE.Scene();
    const FOV = 16, DIST = (H / 2) / Math.tan((FOV / 2) * PI / 180);
    const camera = new THREE.PerspectiveCamera(FOV, W / H, 10, DIST * 4);
    camera.position.set(0, 0, DIST); camera.lookAt(0, 0, 0);
    const px = (x, y) => new THREE.Vector2(x - W / 2, H / 2 - y);

    // ---------- studio environment: warm softbox above, a cool strip right, a dim warm kicker left, dark floor ----------
    const env = new THREE.Scene();
    env.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(1.25,1.14,1.02), hor = vec3(0.075,0.065,0.075), low = vec3(0.02,0.018,0.02);" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.0, 0.8, y)) : mix(hor, low, smoothstep(0.0, 0.45, -y)); gl_FragColor = vec4(c, 1.0); }"
    })));
    const panel = (w, h, x, y, z, r, g, b) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(r, g, b), side: THREE.DoubleSide }));
      m.position.set(x, y, z); m.lookAt(0, 0, 0); env.add(m);
    };
    panel(40, 10, -4, 30, 28, 2.4, 2.2, 1.95);  // top-front softbox: the broad gloss on vinyl and laminate
    panel(5, 34, 34, 4, 22, 1.5, 1.7, 2.1);     // right cool strip
    panel(5, 26, -36, -4, 16, 1.2, 0.75, 0.5);  // warm left kicker (sunset side)
    panel(34, 7, 0, 9, 46, 0.42, 0.4, 0.38);    // a dim panel behind the lens: the laminate's soft gloss band
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(env, 0.0, 0.1, 200).texture;

    // ---------- lights ----------
    const key = new THREE.DirectionalLight(0xfff0dc, 1.5);
    const kp = o.key || [-0.62, 0.9, 0.85]; key.position.set(kp[0], kp[1], kp[2]).multiplyScalar(DIST); scene.add(key); scene.add(key.target);
    if (o.arm) {
      key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.6;
      const sc = key.shadow.camera; sc.left = -W * 0.7; sc.right = W * 0.7; sc.top = H * 0.7; sc.bottom = -H * 0.7; sc.near = DIST * 0.2; sc.far = DIST * 3;
      key.shadow.radius = 4;
    }
    const rim = new THREE.DirectionalLight(0xffd6b0, 0.9); rim.position.set(0.8, 0.7, -0.15).multiplyScalar(DIST); scene.add(rim);
    const rake = new THREE.DirectionalLight(0xfff2de, 0); scene.add(rake);
    scene.add(new THREE.HemisphereLight(0xfff1e6, 0x1a1418, 0.55));

    // ---------- record ----------
    const R = o.R, RL = R * (o.labelR || 0.355), RH = R * 0.024, T = Math.max(2.4, R * 0.032), TG = T * 0.38;
    const prof = [], D2R = PI / 180;
    const arc = (cx, cy, r, a0, a1, n) => { for (let i = 0; i <= n; i++) { const a = (a0 + (a1 - a0) * i / n) * D2R; prof.push(new THREE.Vector2(cx + r * Math.cos(a), cy + r * Math.sin(a))); } };
    // top surface from the hole outwards (lathe y = height, later turned to z), then the edge, then the underside back in
    prof.push(new THREE.Vector2(RH, -T / 2)); prof.push(new THREE.Vector2(RH, T / 2));
    prof.push(new THREE.Vector2(RL + R * 0.012, T / 2));
    prof.push(new THREE.Vector2(RL + R * 0.03, TG));
    prof.push(new THREE.Vector2(R * 0.945, TG));
    prof.push(new THREE.Vector2(R * 0.962, T / 2));
    const eR = T * 0.5;
    arc(R - eR, 0, eR, 90, -90, 10);
    prof.push(new THREE.Vector2(R * 0.962, -T / 2));
    prof.push(new THREE.Vector2(RH, -T / 2));
    // LatheGeometry wants the profile ordered so faces point outward: build it reversed (outer-first) for correct winding
    const bodyGeo = new THREE.LatheGeometry(prof.slice().reverse(), 220);
    bodyGeo.rotateX(PI / 2);
    const U = { uSpin: { value: 0 }, uLA: { value: o.wedgeAngle == null ? 0.9 : o.wedgeAngle }, uWA: { value: 0.35 }, uWP: { value: 26 },
      uR: { value: R }, uRl: { value: RL }, uGF: { value: R * SS * 2 * PI / 5.0 },
      uRim: { value: o.rim == null ? 0.8 : o.rim }, uRingR: { value: 2.0 }, uRingA: { value: 0 } };
    const vinylColor = new THREE.Color(o.vinyl || "#0b0b0e");
    const bodyMat = new THREE.MeshPhysicalMaterial({ color: vinylColor, metalness: 0, roughness: o.vinylRough == null ? 0.36 : o.vinylRough, clearcoat: 1.0, clearcoatRoughness: 0.1, envMapIntensity: o.vinylEnv == null ? 1.0 : o.vinylEnv, side: THREE.DoubleSide });
    bodyMat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, U);
      sh.vertexShader = "varying vec3 vOP;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vOP = position;");
      sh.fragmentShader = "varying vec3 vOP; uniform float uSpin, uLA, uWA, uWP, uR, uRl, uGF, uRim, uRingR, uRingA;\n" + sh.fragmentShader
        .replace("#include <roughnessmap_fragment>",
          "#include <roughnessmap_fragment>\n" +
          " float vr = length(vOP.xy) / uR;\n" +
          " float inG = smoothstep(uRl / uR + 0.035, uRl / uR + 0.05, vr) * (1.0 - smoothstep(0.935, 0.945, vr)) * step(0.0, vOP.z);\n" +
          " float gaps = (1.0 - smoothstep(0.0, 0.007, abs(vr - 0.55))) + (1.0 - smoothstep(0.0, 0.007, abs(vr - 0.685))) + (1.0 - smoothstep(0.0, 0.007, abs(vr - 0.815)));\n" +
          " float fine = 0.5 + 0.5 * sin(vr * uGF);\n" +
          " roughnessFactor = clamp(roughnessFactor + inG * (0.12 * fine - 0.2 * gaps), 0.05, 1.0);")
        .replace("#include <emissivemap_fragment>",
          "#include <emissivemap_fragment>\n" +
          " { float th = atan(vOP.y, vOP.x) + uSpin; float c = cos(th - uLA);\n" +
          "   float wd = pow(max(c, 0.0), uWP) + 0.6 * pow(max(-c, 0.0), uWP) + 0.05 * pow(max(c, 0.0), uWP * 0.15);\n" +
          "   float tt = vr * 7.0; vec3 iri = vec3(1.0, 0.9 + 0.1 * sin(tt * 3.1), 0.82 + 0.18 * cos(tt * 2.3));\n" +
          "   totalEmissiveRadiance += iri * wd * inG * (0.5 + 0.5 * fine) * (1.0 - 0.7 * min(gaps, 1.0)) * uWA;\n" +
          "   float fr = 1.0 - abs(dot(normal, normalize(vViewPosition))); float edge = smoothstep(0.95, 0.982, vr);\n" +
          "   totalEmissiveRadiance += vec3(1.0, 0.9, 0.8) * pow(fr, 1.6) * edge * uRim;\n" +
          "   float dr = (vr - uRingR) / " + (o.ringW || 0.024).toFixed(3) + "; totalEmissiveRadiance += vec3(1.0, 0.78, 0.42) * exp(-dr * dr) * inG * (0.65 + 0.35 * fine) * uRingA; }");
    };
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = false; body.receiveShadow = !!o.arm;
    const labTex = new THREE.CanvasTexture(o.label); labTex.colorSpace = THREE.SRGBColorSpace; labTex.anisotropy = 8;
    const labMat = new THREE.MeshPhysicalMaterial({ map: labTex, roughness: 0.55, clearcoat: 0.25, clearcoatRoughness: 0.4, envMapIntensity: 0.55 });
    const labGeo = new THREE.CircleGeometry(RL, 128); labGeo.translate(0, 0, T / 2 + 0.12);
    const label = new THREE.Mesh(labGeo, labMat); label.receiveShadow = !!o.arm;
    const disc = new THREE.Group(); disc.add(body, label);          // spins about z
    const discSlide = new THREE.Group(); discSlide.add(disc);        // slides out of the sleeve
    if (o.platter) {
      // aluminium platter proud of the record by a few px, with a dark groove ring and a lathe-turned rim
      const PR = R * (o.platter.r || 1.06), PH = o.platter.h || 14;
      const alu = new THREE.MeshPhysicalMaterial({ color: 0xaeb2ba, metalness: 1, roughness: 0.2, clearcoat: 0.4, clearcoatRoughness: 0.15, envMapIntensity: 0.85, side: THREE.DoubleSide });
      const aluDk = new THREE.MeshPhysicalMaterial({ color: 0x3a3d44, metalness: 1, roughness: 0.45, envMapIntensity: 0.8 });
      const pp = []; pp.push(new THREE.Vector2(R * 0.9, 0)); pp.push(new THREE.Vector2(PR - 2.2, 0)); pp.push(new THREE.Vector2(PR, -1.6));
      pp.push(new THREE.Vector2(PR, -PH * 0.42)); pp.push(new THREE.Vector2(PR - 1.4, -PH * 0.48)); pp.push(new THREE.Vector2(PR - 1.4, -PH * 0.58));
      pp.push(new THREE.Vector2(PR, -PH * 0.64)); pp.push(new THREE.Vector2(PR, -PH + 1.6)); pp.push(new THREE.Vector2(PR - 2.2, -PH));
      const pg = new THREE.LatheGeometry(pp.reverse(), 200); pg.rotateX(PI / 2);
      const platter = new THREE.Mesh(pg, alu); platter.position.z = -T / 2 - 0.3; platter.receiveShadow = true;
      const mat = new THREE.Mesh(new THREE.CircleGeometry(R * 0.995, 128), aluDk); mat.position.z = -T / 2 - 0.25;
      discSlide.add(platter, mat);
    }
    const rig = new THREE.Group(); rig.add(discSlide); scene.add(rig);
    rig.rotation.order = "XYZ";
    const discRest = px(o.disc[0], o.disc[1]);

    // ---------- sleeve ----------
    let sleeve = null, sleeveU = null;
    if (o.sleeve) {
      const S = o.sleeve.size, D = o.sleeve.depth || 5;
      const artTex = new THREE.CanvasTexture(o.sleeve.art); artTex.colorSpace = THREE.SRGBColorSpace; artTex.anisotropy = 8;
      const paper = new THREE.MeshStandardMaterial({ color: 0xece4d6, roughness: 0.82 });
      const front = new THREE.MeshPhysicalMaterial({ map: artTex, roughness: 0.42, clearcoat: 0.75, clearcoatRoughness: 0.22, envMapIntensity: 0.7 });
      sleeveU = { uBand: { value: -9 }, uBandAmp: { value: 0 } };
      front.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, sleeveU);
        sh.vertexShader = "varying vec3 vSP;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vSP = position;");
        sh.fragmentShader = "varying vec3 vSP; uniform float uBand, uBandAmp;\n" + sh.fragmentShader.replace("#include <emissivemap_fragment>",
          "#include <emissivemap_fragment>\n { float d = ((vSP.x + vSP.y * 0.55) / " + (S * 0.5).toFixed(2) + " - uBand) / 0.17;" +
          " totalEmissiveRadiance += vec3(1.0, 0.86, 0.7) * exp(-d * d) * uBandAmp; }");
      };
      const back = new THREE.MeshStandardMaterial({ color: 0x1a1420, roughness: 0.7 });
      const open = new THREE.MeshBasicMaterial({ visible: false });
      sleeve = new THREE.Mesh(new THREE.BoxGeometry(S, S, D), [open, paper, paper, paper, front, back]);
      const sp = px(o.sleeve.at[0], o.sleeve.at[1]); sleeve.position.set(sp.x, sp.y, 0);
      rig.add(sleeve);
    }

    // ---------- tonearm ----------
    let arm = null, swing = null, lift = null;
    if (o.arm) {
      const A = o.arm, L = A.len, zB = A.height || 18;
      const chrome = new THREE.MeshPhysicalMaterial({ color: 0xe6e9ee, metalness: 1, roughness: 0.18, clearcoat: 0.3, envMapIntensity: 1.25 });
      const satin = new THREE.MeshPhysicalMaterial({ color: 0x9ea4ad, metalness: 1, roughness: 0.38, envMapIntensity: 1.1 });
      const ink = new THREE.MeshPhysicalMaterial({ color: 0x121317, metalness: 0.2, roughness: 0.32, clearcoat: 0.8, clearcoatRoughness: 0.15 });
      const accent = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(A.accent || "#E59A1C"), metalness: 0.6, roughness: 0.3, clearcoat: 0.6 });
      const cyl = (r0, r1, h, seg, mat) => { const g = new THREE.CylinderGeometry(r0, r1, h, seg || 48); g.rotateX(PI / 2); const m = new THREE.Mesh(g, mat); m.castShadow = true; return m; };
      arm = new THREE.Group(); const pp = px(A.pivot[0], A.pivot[1]); arm.position.set(pp.x, pp.y, 0);
      // bearing plinth: a satin black plate the arm base is bolted into, so the arm never hangs in air
      const plinthM = new THREE.MeshPhysicalMaterial({ color: 0x17181c, metalness: 0.55, roughness: 0.34, clearcoat: 0.6, clearcoatRoughness: 0.2, envMapIntensity: 1.0 });
      const plinth = cyl(A.base * 1.5, A.base * 1.56, 7, 72, plinthM); plinth.position.z = -3.5; plinth.castShadow = false; plinth.receiveShadow = true; arm.add(plinth);
      const bez = cyl(A.base * 1.52, A.base * 1.52, 1.2, 72, satin); bez.position.z = 0.1; bez.castShadow = false; arm.add(bez);
      const base = cyl(A.base, A.base * 1.06, zB * 0.55, 64, satin); base.position.z = zB * 0.275; arm.add(base);
      const cap = cyl(A.base * 0.82, A.base * 0.86, 2.2, 64, chrome); cap.position.z = zB * 0.55 + 1.1; arm.add(cap);
      const post = cyl(A.base * 0.34, A.base * 0.34, zB * 0.6, 32, chrome); post.position.z = zB * 0.55 + zB * 0.3; arm.add(post);
      swing = new THREE.Group(); swing.position.z = zB; arm.add(swing);
      lift = new THREE.Group(); swing.add(lift);
      const tubeG = new THREE.CylinderGeometry(A.tube, A.tube, L, 24); tubeG.rotateZ(-PI / 2); tubeG.translate(L / 2, 0, 0);
      const tube = new THREE.Mesh(tubeG, chrome); tube.castShadow = true; lift.add(tube);
      const cwG = new THREE.CylinderGeometry(A.tube * 3.6, A.tube * 3.6, A.tube * 6, 40); cwG.rotateZ(-PI / 2); cwG.translate(-A.tube * 5.5, 0, 0);
      const cw = new THREE.Mesh(cwG, satin); cw.castShadow = true; lift.add(cw);
      const ringG = new THREE.CylinderGeometry(A.tube * 3.7, A.tube * 3.7, A.tube * 1.1, 40); ringG.rotateZ(-PI / 2); ringG.translate(-A.tube * 2.2, 0, 0);
      const ring = new THREE.Mesh(ringG, accent); lift.add(ring);
      const head = new THREE.Group(); head.position.set(L, 0, 0); head.rotation.z = A.headAngle == null ? 0.42 : A.headAngle; lift.add(head);
      const shellG = new THREE.BoxGeometry(A.tube * 9, A.tube * 4.6, A.tube * 1.3); shellG.translate(A.tube * 3.2, 0, 0);
      const shell = new THREE.Mesh(shellG, ink); shell.castShadow = true; head.add(shell);
      const cartG = new THREE.BoxGeometry(A.tube * 4.2, A.tube * 3.2, A.tube * 2.2); cartG.translate(A.tube * 4.2, 0, -A.tube * 1.4);
      const cart = new THREE.Mesh(cartG, accent); cart.castShadow = true; head.add(cart);
      const lipG = new THREE.BoxGeometry(A.tube * 3.4, A.tube * 0.9, A.tube * 0.9); lipG.translate(A.tube * 8.6, A.tube * 2.0, A.tube * 0.2);
      const fl = new THREE.Mesh(lipG, chrome); head.add(fl);
      rig.add(arm);
    }

    function render(st) {
      st = st || {};
      const g = st.rig || {};
      rig.position.set(g.x || 0, g.y || 0, 0);
      rig.rotation.set(g.rx || 0, g.ry || 0, g.rz || 0);
      const s = g.s == null ? 1 : g.s;
      rig.scale.set(Math.max(1e-3, s * (g.sx || 1)), Math.max(1e-3, s * (g.sy || 1)), Math.max(1e-3, s));
      discSlide.position.set(discRest.x + (st.out || 0), discRest.y, st.dz || 0);
      const ds = st.discS == null ? 1 : st.discS; disc.scale.set(ds, ds, 1);
      disc.rotation.z = -(st.spin || 0);                      // records turn clockwise as seen from above
      U.uSpin.value = disc.rotation.z;
      U.uWA.value = st.wedge == null ? 0.35 : st.wedge;
      U.uRingR.value = st.ringR == null ? 2.0 : st.ringR; U.uRingA.value = st.ringA || 0;
      if (st.wedgeAngle != null) U.uLA.value = st.wedgeAngle;
      if (sleeveU) { sleeveU.uBand.value = st.band == null ? -9 : st.band; sleeveU.uBandAmp.value = st.bandAmp || 0; }
      if (arm) { swing.rotation.z = st.swing || 0; lift.rotation.y = -(st.lift || 0); arm.visible = st.armOn !== false; }
      const sp = st.rake || 0, lx = st.rakeX == null ? -1.4 : st.rakeX;
      rake.position.set(lx * DIST, 0.9 * DIST, 0.7 * DIST); rake.intensity = sp * (o.rakeI == null ? 2.2 : o.rakeI);
      bodyMat.clearcoatRoughness = 0.1 - 0.04 * sp;
      renderer.toneMappingExposure = (o.exposure || 1.0) * (1 + (o.expoK == null ? 0.28 : o.expoK) * (st.expo || 0));
      renderer.render(scene, camera);
    }
    render({});
    return { canvas, render, R, RL, DIST, px };
  };

  /* ---------- printed art (our own drawings; call after fonts load) ---------- */
  // Label: cream paper, a striped coral sun offset from centre (so the spin reads), arched credit text, spindle hole.
  window.Vinyl3D.drawLabel = function (cfg) {
    const N = 1024, c = document.createElement("canvas"); c.width = c.height = N;
    const g = c.getContext("2d"), m = N / 2;
    g.save(); g.beginPath(); g.arc(m, m, m, 0, Math.PI * 2); g.clip();
    const base = g.createRadialGradient(m * 0.8, m * 0.7, 0, m, m, m); base.addColorStop(0, "#FFF4E2"); base.addColorStop(1, "#EAD7BC");
    g.fillStyle = base; g.fillRect(0, 0, N, N);
    // top half: a deep magenta field with the sun rising out of it
    const top = g.createLinearGradient(0, 0, 0, m * 1.06); top.addColorStop(0, "#3A0F4A"); top.addColorStop(0.55, "#B0225E"); top.addColorStop(1, "#FF5A4E");
    g.fillStyle = top; g.fillRect(0, 0, N, m * 1.06);
    const sun = g.createLinearGradient(0, m * 0.32, 0, m * 1.06); sun.addColorStop(0, "#FFE27A"); sun.addColorStop(0.6, "#FFA03C"); sun.addColorStop(1, "#FF5A4E");
    g.fillStyle = sun; g.beginPath(); g.arc(m, m * 1.06, m * 0.56, Math.PI, 0); g.fill();
    g.fillStyle = "#B0225E";
    [0.0, 0.11, 0.21, 0.3].forEach((k, i) => { const y = m * (0.78 + k * 0.95); g.fillRect(m * 0.4, y, m * 1.2, m * (0.022 + i * 0.012)); });
    g.fillStyle = "#1B1220"; g.fillRect(0, m * 1.06, N, m * 0.05);
    // ring and arched text
    g.strokeStyle = "rgba(27,18,32,.85)"; g.lineWidth = N * 0.008; g.beginPath(); g.arc(m, m, m * 0.9, 0, Math.PI * 2); g.stroke();
    const arcText = (txt, r, center, size, weight, color, inside) => {
      g.font = weight + " " + size + "px Inter"; g.fillStyle = color; g.textAlign = "center"; g.textBaseline = "middle";
      const chars = Array.from(txt), widths = chars.map((ch) => g.measureText(ch).width + size * 0.12), total = widths.reduce((a, b) => a + b, 0);
      let a = center - (inside ? -1 : 1) * total / (2 * r);
      chars.forEach((ch, i) => {
        const w = widths[i], ang = a + (inside ? -1 : 1) * w / (2 * r);
        g.save(); g.translate(m + r * Math.cos(ang), m + r * Math.sin(ang)); g.rotate(ang + (inside ? -Math.PI / 2 : Math.PI / 2)); g.fillText(ch, 0, 0); g.restore();
        a += (inside ? -1 : 1) * w / r;
      });
    };
    arcText(cfg.artist.toUpperCase(), m * 0.78, -Math.PI / 2, N * 0.07, 900, "#FFF4E2", false);
    arcText(cfg.side || "SIDE A  ·  33⅓", m * 0.79, Math.PI / 2, N * 0.05, 800, "#2A1A2E", true);
    g.font = "900 " + (N * 0.085) + "px Inter"; g.fillStyle = "#2A1A2E"; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(cfg.title.toUpperCase(), m, m * 1.36, N * 0.62);
    g.restore();
    // spindle hole with a pressed ring
    g.fillStyle = "rgba(0,0,0,.25)"; g.beginPath(); g.arc(m, m, N * 0.06, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#0b0b0e"; g.beginPath(); g.arc(m, m, N * 0.035, 0, Math.PI * 2); g.fill();
    return c;
  };
  // Sleeve: a synthwave sunset over the sea with a palm, the title set in our type.
  window.Vinyl3D.drawSleeve = function (cfg) {
    const N = 1024, c = document.createElement("canvas"); c.width = c.height = N;
    const g = c.getContext("2d"), hz = N * 0.64;
    if (cfg.cover && cfg.cover.naturalWidth) {   // a creator's own cover art (square crop, centred)
      const iw = cfg.cover.naturalWidth, ih = cfg.cover.naturalHeight, k = Math.min(iw, ih);
      g.drawImage(cfg.cover, (iw - k) / 2, (ih - k) / 2, k, k, 0, 0, N, N);
      return finishSleeve(g, N, c);
    }
    const sky = g.createLinearGradient(0, 0, 0, hz);
    sky.addColorStop(0, "#160A2E"); sky.addColorStop(0.42, "#5A1A6E"); sky.addColorStop(0.78, "#E23B6C"); sky.addColorStop(1, "#FF9A4A");
    g.fillStyle = sky; g.fillRect(0, 0, N, hz);
    const sun = g.createLinearGradient(0, hz - N * 0.36, 0, hz);
    sun.addColorStop(0, "#FFE680"); sun.addColorStop(0.55, "#FFA640"); sun.addColorStop(1, "#FF4F6E");
    g.save(); g.beginPath(); g.arc(N * 0.56, hz, N * 0.3, Math.PI, 0); g.clip();
    g.fillStyle = sun; g.fillRect(0, 0, N, hz);
    for (let i = 0; i < 6; i++) { const y = hz - N * 0.2 + i * N * 0.036; g.fillStyle = "rgba(226,59,108,.95)"; g.fillRect(0, y, N, N * (0.006 + i * 0.0045)); }
    g.restore();
    const sea = g.createLinearGradient(0, hz, 0, N); sea.addColorStop(0, "#3A1250"); sea.addColorStop(1, "#0E0820");
    g.fillStyle = sea; g.fillRect(0, hz, N, N - hz);
    for (let i = 0; i < 9; i++) {
      const y = hz + N * 0.02 + i * i * N * 0.0042, w = N * (0.26 - i * 0.02);
      g.fillStyle = "rgba(255,170,90," + (0.75 - i * 0.07).toFixed(2) + ")"; g.fillRect(N * 0.56 - w / 2, y, w, N * 0.006 + i * 0.6);
    }
    // palm silhouette (trunk + fronds)
    g.fillStyle = "#12081F"; g.strokeStyle = "#12081F"; g.lineCap = "round";
    g.lineWidth = N * 0.026; g.beginPath(); g.moveTo(N * 0.2, N); g.quadraticCurveTo(N * 0.12, N * 0.66, N * 0.21, N * 0.36); g.stroke();
    const frond = (a, len, bend) => {
      g.save(); g.translate(N * 0.21, N * 0.36); g.rotate(a); g.beginPath(); g.moveTo(0, 0);
      g.quadraticCurveTo(len * 0.5, -len * bend, len, len * 0.22); g.quadraticCurveTo(len * 0.5, -len * bend * 0.45, 0, N * 0.012); g.fill(); g.restore();
    };
    [[-2.7, 0.3, 0.32], [-2.2, 0.27, 0.3], [-1.55, 0.22, 0.2], [-0.95, 0.27, 0.28], [-0.35, 0.3, 0.3], [0.25, 0.25, 0.26], [2.6, 0.22, 0.25]].forEach((f) => frond(f[0], N * f[1], f[2]));
    // type: our wordmark, title wide, artist narrow
    g.fillStyle = "#FFF4E2"; g.textAlign = "left"; g.textBaseline = "alphabetic";
    g.font = "800 " + (N * 0.056) + "px Archivo"; g.fillText(cfg.artist.toUpperCase(), N * 0.07, N * 0.11);
    g.font = "900 " + (N * 0.1) + "px Archivo"; g.fillText(cfg.title.toUpperCase().split(" ")[0], N * 0.07, N * 0.215, N * 0.86);
    g.font = "900 " + (N * 0.1) + "px Archivo"; g.fillText(cfg.title.toUpperCase().split(" ").slice(1).join(" "), N * 0.07, N * 0.315, N * 0.86);
    // laminate edge wear + ring wear (the record inside)
    g.strokeStyle = "rgba(255,240,220,.06)"; g.lineWidth = N * 0.01; g.beginPath(); g.arc(N * 0.5, N * 0.5, N * 0.46, 0, Math.PI * 2); g.stroke();
    return finishSleeve(g, N, c);
  };
  // card finish shared by our art and a creator's cover: ring wear, falloff, a printed card edge with a lit top bevel, paper grain
  function finishSleeve(g, N, c) {
    const vg = g.createRadialGradient(N / 2, N / 2, N * 0.45, N / 2, N / 2, N * 0.75); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.28)");
    g.fillStyle = vg; g.fillRect(0, 0, N, N);
    const e = N * 0.014;
    g.strokeStyle = "rgba(20,14,30,.85)"; g.lineWidth = e * 2; g.strokeRect(0, 0, N, N);
    const tb = g.createLinearGradient(0, 0, 0, e * 2.4); tb.addColorStop(0, "rgba(255,240,225,.55)"); tb.addColorStop(1, "rgba(255,240,225,0)");
    g.fillStyle = tb; g.fillRect(e, e, N - 2 * e, e * 2.4);
    const lb = g.createLinearGradient(0, 0, e * 2.4, 0); lb.addColorStop(0, "rgba(255,240,225,.3)"); lb.addColorStop(1, "rgba(255,240,225,0)");
    g.fillStyle = lb; g.fillRect(e, e, e * 2.4, N - 2 * e);
    const im = g.getImageData(0, 0, N, N), d = im.data;
    for (let i = 0, n = 0; i < d.length; i += 4, n++) {
      let h = (n * 2654435761) >>> 0; h ^= h >>> 15; h = (h * 2246822519) >>> 0; h ^= h >>> 13;
      const v = ((h & 255) / 255 - 0.5) * 20;
      d[i] = Math.max(0, Math.min(255, d[i] + v)); d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + v)); d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + v));
    }
    g.putImageData(im, 0, 0);
    return c;
  }
})();
