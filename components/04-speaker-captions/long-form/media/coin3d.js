/* Coin3D: the speaker's avatar badge as a real object (Three.js r160, global THREE).
   A thick medallion: a polished steel outer rim (rounded squircle section), a raised enamel ring in the speaker's colour on
   each face (clearcoat), a recessed portrait disc under a reflection-only glass dome, and a real edge you see when it flips.
   PMREM studio environment, key + hemisphere light, ACES tone mapping. The key light can rake across the bevels.
   Seek-safe: nothing animates on its own; set(state) + render() draw the frame the caller computed from timeline time.
   Shared by a/ and b/ (identical file). */
(function () {
  const sgnPow = (v, e) => Math.sign(v) * Math.pow(Math.abs(v), e);
  // squircle cross-section in (radius, height): centre rc, half-width a, half-height b, exponent n, from angle t0 to t1
  function squircle(rc, a, b, n, t0, t1, N) {
    const pts = [], e = 2 / n;
    for (let i = 0; i <= N; i++) {
      const t = t0 + (t1 - t0) * (i / N);
      pts.push(new THREE.Vector2(Math.max(0.01, rc + a * sgnPow(Math.cos(t), e)), b * sgnPow(Math.sin(t), e)));
    }
    return pts;
  }
  function lathe(pts, segs) {
    const g = new THREE.LatheGeometry(pts, segs);
    g.rotateX(Math.PI / 2);          // lathe axis (Y) becomes the coin axis (Z): +Y height -> +Z (front)
    g.computeVertexNormals();
    return g;
  }

  window.Coin3D = function (o) {
    const S = o.size, R = o.R, T = (o.thick || 0.2) * R;
    const canvas = document.createElement("canvas"); canvas.width = S; canvas.height = S;
    canvas.style.cssText = "position:absolute;left:" + (-S / 2) + "px;top:" + (-S / 2) + "px;width:" + S + "px;height:" + S + "px;display:block";
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(1); renderer.setSize(S, S, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = o.exposure || 1.05;
    const scene = new THREE.Scene();
    const FOV = 24, DIST = (S / 2) / Math.tan((FOV / 2) * Math.PI / 180);
    const camera = new THREE.PerspectiveCamera(FOV, 1, 10, DIST * 4);
    camera.position.set(0, 0, DIST); camera.lookAt(0, 0, 0);

    // ---------- environment: neutral studio (big top softbox, a front strip, a hot rim bar behind, dark floor) ----------
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(1.25,1.3,1.4), hor = vec3(0.22,0.24,0.28), low = vec3(0.025,0.028,0.035);" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.05, 0.75, y)) : mix(hor, low, smoothstep(0.0, 0.35, -y));" +
        " gl_FragColor = vec4(c, 1.0); }"
    })));
    const panel = (w, h, x, y, z, k) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k, k * 1.02), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); envScene.add(m); };
    panel(36, 10, -6, 28, 26, 3.2);     // big softbox above-left, in front: the even sheen on the enamel
    panel(4, 30, 34, 4, 18, 2.4);       // tall strip at the right: a vertical line on the steel
    panel(40, 3, 0, 14, -36, 4.0);      // hot bar up and behind: the rim's lit lip
    panel(26, 2.2, 0, -6, 40, 1.6);     // low front strip: catches the lower bevel
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(envScene, 0.0, 0.1, 200).texture;

    // ---------- lights ----------
    const key = new THREE.DirectionalLight(0xffffff, 2.4); scene.add(key); scene.add(key.target);
    const rimL = new THREE.DirectionalLight(0xdfe9ff, 1.1); rimL.position.set(0.7, 0.5, -0.6); scene.add(rimL);
    const hemi = new THREE.HemisphereLight(0xffffff, 0x1a2230, 0.55); scene.add(hemi);

    // ---------- geometry ----------
    const coin = new THREE.Group(), tilt = new THREE.Group(); tilt.add(coin); scene.add(tilt);
    const steel = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(o.steel || "#cfd6e0"), metalness: 1.0, roughness: 0.17, clearcoat: 0.6, clearcoatRoughness: 0.06, envMapIntensity: 1.25, side: THREE.DoubleSide });
    const rimR = o.rimIn || 0.86, ringIn = o.ringIn || 0.64, port = o.portrait || 0.66;
    coin.add(new THREE.Mesh(lathe(squircle((rimR + 1) / 2 * R, (1 - rimR) / 2 * R, T / 2, 3.2, 0, Math.PI * 2, 72), 96), steel));
    const ringMat = (hex) => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(hex), metalness: 0.0, roughness: 0.32, clearcoat: 1.0, clearcoatRoughness: 0.05, envMapIntensity: 0.95, side: THREE.DoubleSide });
    const ringFront = ringMat("#ffffff"), ringBack = ringMat("#ffffff");
    const rc = (ringIn + rimR + 0.01) / 2 * R, ra = (rimR + 0.01 - ringIn) / 2 * R, rb = T * 0.36;
    coin.add(new THREE.Mesh(lathe(squircle(rc, ra, rb, 3.0, 0, Math.PI, 40), 96), ringFront));
    coin.add(new THREE.Mesh(lathe(squircle(rc, ra, rb, 3.0, Math.PI, Math.PI * 2, 40), 96), ringBack));
    // portrait discs (unlit: faces keep their natural colour; dimmed by the caller's facing factor)
    const zP = T * 0.22;
    const portMat = () => new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
    const pFront = portMat(), pBack = portMat();
    // start with a map bound so the shader is compiled with map support from the first frame
    const disc = new THREE.CircleGeometry(port * R, 96);
    const mF = new THREE.Mesh(disc, pFront); mF.position.z = zP; coin.add(mF);
    const mB = new THREE.Mesh(disc, pBack); mB.rotation.y = Math.PI; mB.position.z = -zP; coin.add(mB);
    // reflection-only glass domes over the portraits (additive: they only ever add light)
    const hD = 0.075 * R, rD = port * R, Rs = (rD * rD + hD * hD) / (2 * hD), th = Math.asin(rD / Rs);
    const glass = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.06, envMapIntensity: 1.0, transparent: true, opacity: o.glass == null ? 0.2 : o.glass, blending: THREE.AdditiveBlending, depthWrite: false });
    const domeG = new THREE.SphereGeometry(Rs, 64, 12, 0, Math.PI * 2, 0, th); domeG.rotateX(Math.PI / 2);
    const dF = new THREE.Mesh(domeG, glass); dF.position.z = zP + hD - Rs; coin.add(dF);
    const dB = new THREE.Mesh(domeG, glass); dB.rotation.y = Math.PI; dB.position.z = -(zP + hD - Rs); coin.add(dB);

    // ---------- faces: one texture per speaker ----------
    const faces = (o.faces || []).map((src) => { const t = new THREE.CanvasTexture(src); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; });
    const rings = (o.rings || []).map((h) => new THREE.Color(h));

    const st = { yaw: 0, pitch: 0, roll: 0, scale: 1, front: 0, back: 0, rake: 0, visible: true };
    function set(s) { Object.assign(st, s); }
    function render() {
      if (!st.visible || st.scale <= 0.001) { renderer.clear(); return; }
      coin.rotation.set(0, st.yaw, 0);
      tilt.rotation.set(st.pitch, 0, st.roll);
      tilt.scale.setScalar(st.scale);
      const fm = faces[st.front] || null, bm = faces[st.back] || null;
      if (pFront.map !== fm) { if (!pFront.map !== !fm) pFront.needsUpdate = true; pFront.map = fm; }
      if (pBack.map !== bm) { if (!pBack.map !== !bm) pBack.needsUpdate = true; pBack.map = bm; }
      ringFront.color.copy(rings[st.front] || rings[0]); ringBack.color.copy(rings[st.back] || rings[0]);
      // portraits darken a little as they turn away from the camera (they are unlit)
      const c = Math.abs(Math.cos(st.yaw)) * Math.cos(st.pitch);
      const k = 0.5 + 0.5 * Math.pow(c, 0.7);
      pFront.color.setScalar(k * (o.faceGain || 1)); pBack.color.setScalar(k * (o.faceGain || 1));
      // key light: upper-left by default; rake sweeps it across the top to the right (bevel and clearcoat glints travel)
      const az = -0.95 + 1.7 * st.rake, el = 0.75 - 0.25 * Math.sin(Math.PI * st.rake);
      key.position.set(Math.sin(az) * Math.cos(el) * 1000, Math.sin(el) * 1000, Math.cos(az) * Math.cos(el) * 1000);
      key.intensity = 2.4 + 1.4 * Math.sin(Math.PI * st.rake);
      renderer.render(scene, camera);
    }
    render();
    return { canvas, set, render, R, S };
  };

  // Portrait texture: the photo cropped to a circle, gently lifted, with a recess shadow at the rim and a soft colour
  // bounce from the speaker's ring at the very edge (never over the face).
  window.Coin3D.portrait = function (img, ring, opt) {
    opt = opt || {};
    const N = 512, cv = document.createElement("canvas"); cv.width = cv.height = N;
    const g = cv.getContext("2d");
    g.save(); g.beginPath(); g.arc(N / 2, N / 2, N / 2, 0, Math.PI * 2); g.clip();
    g.filter = opt.filter || "brightness(1.08) contrast(1.06) saturate(1.06)";
    const z = opt.zoom || 1, w = N * z, ox = (N - w) / 2 + (opt.dx || 0) * N, oy = (N - w) / 2 + (opt.dy || 0) * N;
    g.drawImage(img, ox, oy, w, w); g.filter = "none";
    const rg = g.createRadialGradient(N / 2, N / 2, N * 0.36, N / 2, N / 2, N / 2);
    rg.addColorStop(0, "rgba(0,0,0,0)"); rg.addColorStop(0.72, "rgba(0,0,0,0.06)"); rg.addColorStop(1, "rgba(0,0,0,0.55)");
    g.fillStyle = rg; g.fillRect(0, 0, N, N);
    g.restore();
    return cv;
  };
})();
