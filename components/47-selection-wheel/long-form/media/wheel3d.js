/* Wheel3D: the character wheel's four slices and its bezel as real lit geometry (Three.js r160, global THREE).
   Each slice is an extruded, bevelled wedge: a smoked-glass face that carries the slice colour, the portrait and a lit inner
   rim (canvas textures at 2x), clear-coated so the key light glints on it, with coloured glass bevels that catch the light
   as the slice is pressed, pops and tilts. The bezel is a gunmetal lathe ring lit by a studio environment.
   Seek-safe: nothing animates on its own; render(S) draws the frame for the state S (a pure function of time upstream). */
(function () {
  window.Wheel3D = function (o) {
    const SZ = o.size, DPR = o.dpr || 2, BOX = o.box, HB = BOX / 2;
    const R = o.R, R0 = o.R0, GAP = o.GAP, D = o.depth, BT = o.bevel, BS = o.bevel;

    // ---------- renderer: z = 0 maps 1:1 to css px, the wheel centre is the principal point ----------
    const canvas = document.createElement("canvas"); canvas.width = SZ * DPR; canvas.height = SZ * DPR;
    canvas.style.cssText = "position:absolute;left:" + ((BOX - SZ) / 2) + "px;top:" + ((BOX - SZ) / 2) + "px;width:" + SZ + "px;height:" + SZ + "px;display:block;pointer-events:none";
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(DPR); renderer.setSize(SZ, SZ, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;
    const scene = new THREE.Scene();
    const FOV = 20, DIST = (SZ / 2) / Math.tan((FOV / 2) * Math.PI / 180);
    const camera = new THREE.PerspectiveCamera(FOV, 1, 10, DIST * 3);
    camera.position.set(0, 0, DIST); camera.lookAt(0, 0, 0);

    // ---------- environment: a cool studio (top softbox, a front strip, dark floor) ----------
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(1.0,1.04,1.12), hor = vec3(0.10,0.12,0.17), low = vec3(0.012,0.014,0.02);" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.1, 0.85, y)) : mix(hor, low, smoothstep(0.0, 0.4, -y)); gl_FragColor = vec4(c, 1.0); }"
    })));
    const panel = (w, h, x, y, z, c) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); envScene.add(m); };
    panel(40, 10, 0, 30, 20, new THREE.Color(3.0, 3.05, 3.2));   // softbox above-front: the top-lit look
    panel(3, 26, -24, 6, 28, new THREE.Color(2.6, 2.7, 2.9));    // a tall strip front-left: one glint line on the bevels
    panel(36, 4, 0, 20, -28, new THREE.Color(2.8, 2.9, 3.1));    // hot bar behind: lit back lips
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(envScene, 0.0, 0.1, 200).texture;

    const key = new THREE.DirectionalLight(0xffffff, 1.2); scene.add(key); scene.add(key.target);
    const rake = new THREE.DirectionalLight(0xbfd2ff, 0.5); rake.position.set(6, -4, 3); scene.add(rake); scene.add(rake.target);
    scene.add(new THREE.HemisphereLight(0xf2f5ff, 0x0b0d14, 0.4));

    // ---------- shared textures (box coords at 2x; every slice samples only its own region) ----------
    const T = (c, premul) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.premultiplyAlpha = !!premul; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; return t; };
    const bgTex = T(o.tex.bg, false), porTex = T(o.tex.por, true), ovTex = T(o.tex.ov, true);
    const glowTex = T(o.tex.glow, true);

    // ---------- wedge outline, shrunk by the bevel so the bevelled wedge lands on the flat design ----------
    const rad = (d) => d * Math.PI / 180;
    const W = (r, a) => new THREE.Vector2(r * Math.cos(rad(a)), -r * Math.sin(rad(a)));   // box angle (y down) -> world (y up)
    function wedgeShape(mid) {
      const hg = GAP / 2 + BS, ro = R - BS, ri = R0 + BS, dO = Math.asin(hg / ro) * 180 / Math.PI, dI = Math.asin(hg / ri) * 180 / Math.PI;
      const a1 = mid - 45, a2 = mid + 45, pts = [];
      pts.push(W(ri, a1 + dI));
      for (let k = 0; k <= 72; k++) pts.push(W(ro, a1 + dO + (a2 - a1 - 2 * dO) * k / 72));
      for (let k = 0; k <= 18; k++) pts.push(W(ri, a2 - dI - (a2 - a1 - 2 * dI) * k / 18));
      return new THREE.Shape(pts.reverse());   // counter-clockwise in world space
    }

    function faceMaterial(U) {
      const m = new THREE.MeshPhysicalMaterial({ map: porTex, color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1, roughness: 0.42, metalness: 0,
        clearcoat: 0.3, clearcoatRoughness: 0.08, envMapIntensity: 0.06 });
      m.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, U, { uBg: { value: bgTex }, uOv: { value: ovTex } });
        sh.vertexShader = "varying vec2 vP;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vP = position.xy;");
        sh.fragmentShader = "varying vec2 vP; uniform sampler2D uBg, uOv; uniform vec3 uInk, uBloomCol; uniform vec2 uHead, uSpecDir;\n" +
          "uniform float uColA, uBright, uSat, uBloom, uBloomR, uFlash, uSpecX, uSpecW, uSpecAmp, uEmis;\nvec3 gCol = vec3(0.0);\n" +
          sh.fragmentShader
            .replace("#include <map_fragment>", [
              "{ vec2 tuv = vec2(0.5 + vP.x / " + BOX.toFixed(1) + ", 0.5 + vP.y / " + BOX.toFixed(1) + ");",
              "  vec3 bg = mix(uInk, texture2D(uBg, tuv).rgb, pow(uColA, 2.2));",   // CSS-like (sRGB) opacity and brightness, applied in linear light
              "  vec2 hd = vP - uHead; bg += uBloomCol * uBloom * exp(-dot(hd, hd) / (2.0 * uBloomR * uBloomR));",
              "  vec4 pc = texture2D(map, tuv); float pl = dot(pc.rgb, vec3(0.2126, 0.7152, 0.0722)); pc.rgb = mix(vec3(pl), pc.rgb, uSat) * pow(uBright, 2.2);",
              "  vec3 cc = bg * (1.0 - pc.a) + pc.rgb;",
              "  vec4 ov = texture2D(uOv, tuv); cc = cc * (1.0 - ov.a) + ov.rgb;",
              "  gCol = cc; diffuseColor.rgb *= cc; }"].join("\n"))
            .replace("#include <emissivemap_fragment>", [
              "{ totalEmissiveRadiance = gCol * uEmis;",
              "  float rr = length(vP); totalEmissiveRadiance += vec3(1.0) * uFlash * 0.45 * smoothstep(120.0, 300.0, rr);",
              "  float sd = (dot(vP, uSpecDir) - uSpecX) / uSpecW; totalEmissiveRadiance += vec3(1.0, 0.98, 0.95) * exp(-sd * sd) * uSpecAmp; }"].join("\n"));
      };
      return m;
    }

    // ---------- slices ----------
    const geoBase = [];
    const slices = o.slots.map((sl, i) => {
      const g = new THREE.ExtrudeGeometry(wedgeShape(sl.angle), { depth: D, bevelEnabled: true, bevelThickness: BT, bevelSize: BS, bevelSegments: 8, curveSegments: 1, steps: 1 });
      g.translate(0, 0, -(D + BT));
      geoBase.push(g);
      const col = new THREE.Color(sl.color);
      const U = {
        uInk: { value: new THREE.Color(0x07090d) }, uColA: { value: 0.46 }, uBright: { value: 0.72 }, uSat: { value: 0.7 },
        uBloom: { value: 0 }, uBloomR: { value: 82 }, uBloomCol: { value: new THREE.Color(o.bloomColor || "#FF9A3C") },
        uHead: { value: new THREE.Vector2(sl.head[0] - HB, HB - sl.head[1]) }, uFlash: { value: 0 },
        uSpecDir: { value: new THREE.Vector2(Math.cos(rad(-60)), Math.sin(rad(-60))) }, uSpecX: { value: -1e4 }, uSpecW: { value: 34 }, uSpecAmp: { value: 0 },
        uEmis: { value: 0.7 }
      };
      const face = faceMaterial(U);
      const side = new THREE.MeshPhysicalMaterial({ color: col.clone().multiplyScalar(0.55), metalness: 0.15, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.06,
        envMapIntensity: 1.1, emissive: col.clone(), emissiveIntensity: 0.12 });
      const mesh = new THREE.Mesh(g, [face, side]);
      // glow (pick colour) and soft shadow cards behind the slice: one blurred wedge, turned to the slice
      const card = (color, blend, opacity, z) => {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(o.tex.glowSize, o.tex.glowSize), new THREE.MeshBasicMaterial({ map: glowTex, color, transparent: true, depthWrite: false, opacity, blending: blend }));
        m.rotation.z = rad(-(sl.angle + 90)); m.position.z = z; return m;
      };
      const glow = card(col, THREE.AdditiveBlending, 0, -(D + 2 * BT) - 6);
      const shadow = card(new THREE.Color(0x000000), THREE.NormalBlending, 0.5, -(D + 2 * BT) - 10);
      const tilt = new THREE.Group(); tilt.add(mesh);
      const grp = new THREE.Group(); grp.add(shadow); grp.add(glow); grp.add(tilt); scene.add(grp);
      const ux = Math.cos(rad(sl.angle)), uy = -Math.sin(rad(sl.angle));
      return { grp, tilt, mesh, glow, shadow, U, face, side, col, ux, uy, base: col.clone().multiplyScalar(0.55) };
    });

    // ---------- bezel: a gunmetal ring with a rounded section ----------
    const prof = [], RB = o.ring.r, RW = o.ring.w / 2, RH = o.ring.h;
    for (let k = 0; k <= 24; k++) { const a = Math.PI * k / 24; prof.push(new THREE.Vector2(RB - RW * Math.cos(a), RH * Math.sin(a) - RH)); }
    const ringG = new THREE.LatheGeometry(prof, 200); ringG.rotateX(Math.PI / 2);
    const ring = new THREE.Mesh(ringG, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(o.ring.color || "#5A6482"), metalness: 0.85, roughness: 0.3,
      clearcoat: 0.5, clearcoatRoughness: 0.1, envMapIntensity: 1.25, side: THREE.DoubleSide }));
    const ringGrp = new THREE.Group(); ringGrp.add(ring); scene.add(ringGrp);

    // ---------- draw ----------
    function render(S) {
      slices.forEach((s, i) => {
        const st = S.slices[i];
        s.grp.visible = !!st.vis;
        if (!st.vis) return;
        s.grp.position.set(st.x, -st.y, st.z || 0);
        s.grp.scale.set(st.s, st.s, st.s);
        // tilt about the slice's own tangent axis, pivoting on its centre (positive tips the outer edge back)
        const cx = s.ux * o.CEN, cy = s.uy * o.CEN;
        s.tilt.position.set(cx, cy, 0); s.mesh.position.set(-cx, -cy, 0);
        s.tilt.setRotationFromAxisAngle(new THREE.Vector3(-s.uy, s.ux, 0), st.tilt || 0);
        s.U.uColA.value = st.colA; s.U.uBright.value = st.bright; s.U.uSat.value = st.sat;
        s.U.uBloom.value = 0.45 * (st.bloom || 0); s.U.uFlash.value = st.flash || 0;
        s.U.uSpecAmp.value = st.spec > 0 && st.spec < 1 ? 0.4 * Math.sin(Math.PI * st.spec) : 0;
        s.U.uSpecX.value = st.specX0 + (st.specX1 - st.specX0) * (st.spec || 0);
        s.side.color.copy(s.base).multiplyScalar(Math.pow(st.bright, 2.2));
        s.side.emissiveIntensity = 0.12 + 0.9 * (st.hot || 0);
        s.glow.material.opacity = st.glow || 0;
        s.shadow.material.opacity = 0.5 * Math.min(1, st.s);
        s.shadow.position.set(0, -10, -(D + 2 * BT) - 10);
      });
      ringGrp.visible = S.ring.s > 0.001; ringGrp.scale.setScalar(Math.max(S.ring.s, 0.001));
      key.position.set(Math.sin(S.key) * 8, 7, Math.cos(S.key) * 8);
      key.intensity = 1.2 + (S.keyBoost || 0);
      renderer.render(scene, camera);
    }
    return { canvas, render, slices };
  };
})();
