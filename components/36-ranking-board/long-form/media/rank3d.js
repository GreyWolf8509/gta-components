/* Rank3D: the ranking board's slots as real geometry (Three.js r160, global THREE).
   Each slot is a thick rounded slab (bevelled metal rim in the rank colour) with two clearcoat faces: a face-down plaque and
   a face-up thumbnail. Faces are emissive photos under a clearcoat, so the picture keeps its own exposure while the studio
   environment, a key light and a soft specular band slide over the gloss. Each slab drops a soft contact shadow on the plate.
   World units are canvas px (x right, y up = -canvas y); a narrow perspective camera maps the z = 0 plane 1:1 to the canvas.
   Seek-safe: nothing animates on its own; the page sets every pose from timeline time and calls render().
   Identical file in a/ and b/. Helpers adapted from gta/09 gloss3d.js. */
(function () {
  function clean(pts) {
    const out = [];
    for (const p of pts) if (!out.length || p.distanceTo(out[out.length - 1]) > 0.05) out.push(p);
    while (out.length > 3 && out[0].distanceTo(out[out.length - 1]) <= 0.05) out.pop();
    return out;
  }
  // centred rounded rect, counter-clockwise, y up
  function rrPts(w, h, r, seg) {
    const p = new THREE.Path(), X0 = -w / 2, X1 = w / 2, Y0 = -h / 2, Y1 = h / 2;
    r = Math.max(0.01, Math.min(r, w / 2, h / 2));
    p.moveTo(X0 + r, Y0);
    p.lineTo(X1 - r, Y0); p.absarc(X1 - r, Y0 + r, r, -Math.PI / 2, 0, false);
    p.lineTo(X1, Y1 - r); p.absarc(X1 - r, Y1 - r, r, 0, Math.PI / 2, false);
    p.lineTo(X0 + r, Y1); p.absarc(X0 + r, Y1 - r, r, Math.PI / 2, Math.PI, false);
    p.lineTo(X0, Y0 + r); p.absarc(X0 + r, Y0 + r, r, Math.PI, Math.PI * 1.5, false);
    return clean(p.getPoints(seg || 10));
  }
  function smoothNormals(geo, deg) {
    geo = geo.index ? geo.toNonIndexed() : geo;
    const pos = geo.attributes.position.array, n = pos.length / 3, cosT = Math.cos(deg * Math.PI / 180);
    const key = new Array(n), map = new Map(), faceN = new Float32Array(n);
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
    for (let f = 0; f < n / 3; f++) {
      a.fromArray(pos, f * 9); b.fromArray(pos, f * 9 + 3); c.fromArray(pos, f * 9 + 6);
      b.sub(a); c.sub(a); b.cross(c); const L = b.length() || 1; b.divideScalar(L);
      faceN[f * 3] = b.x; faceN[f * 3 + 1] = b.y; faceN[f * 3 + 2] = b.z;
    }
    for (let v = 0; v < n; v++) {
      const k = Math.round(pos[v * 3] * 50) + "," + Math.round(pos[v * 3 + 1] * 50) + "," + Math.round(pos[v * 3 + 2] * 50);
      key[v] = k; let l = map.get(k); if (!l) { l = []; map.set(k, l); } l.push(Math.floor(v / 3));
    }
    const nor = new Float32Array(n * 3);
    for (let v = 0; v < n; v++) {
      const f = Math.floor(v / 3), fx = faceN[f * 3], fy = faceN[f * 3 + 1], fz = faceN[f * 3 + 2];
      let sx = 0, sy = 0, sz = 0;
      for (const g of map.get(key[v])) {
        const gx = faceN[g * 3], gy = faceN[g * 3 + 1], gz = faceN[g * 3 + 2];
        if (fx * gx + fy * gy + fz * gz >= cosT) { sx += gx; sy += gy; sz += gz; }
      }
      const L = Math.hypot(sx, sy, sz) || 1; nor[v * 3] = sx / L; nor[v * 3 + 1] = sy / L; nor[v * 3 + 2] = sz / L;
    }
    geo.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
    return geo;
  }

  window.Rank3D = function (o) {
    const W = o.W, H = o.H;
    const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
    canvas.style.cssText = "position:absolute;left:0;top:0;width:" + W + "px;height:" + H + "px;display:block;pointer-events:none";
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = o.exposure || 1.0;
    const scene = new THREE.Scene();
    const FOV = o.fov || 24, DIST = (H / 2) / Math.tan((FOV / 2) * Math.PI / 180);
    const camera = new THREE.PerspectiveCamera(FOV, W / H, 20, DIST * 3);
    camera.position.set(W / 2, -H / 2, DIST); camera.lookAt(W / 2, -H / 2, 0);

    // ---------- studio environment: top softbox, hot bar behind (lit lips), side strips, warm floor bounce ----------
    const es = new THREE.Scene();
    es.add(new THREE.Mesh(new THREE.SphereGeometry(60, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(0.62,0.66,0.74), hor = vec3(0.16,0.16,0.18), low = vec3(0.06,0.045,0.03);" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.0, 0.8, y)) : mix(hor, low, smoothstep(0.0, 0.6, -y)); gl_FragColor = vec4(c, 1.0); }"
    })));
    const panel = (w, h, x, y, z, r, g, b) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(r, g, b), side: THREE.DoubleSide }));
      m.position.set(x, y, z); m.lookAt(0, 0, 0); es.add(m);
    };
    panel(46, 14, 0, 38, 14, 9, 9.2, 9.6);       // big softbox above, slightly in front
    panel(60, 4, 0, 24, -34, 14, 13.4, 12.6);    // hot bar up and behind: lit top lip
    panel(4, 34, -42, 6, 10, 4.2, 4.6, 5.2);     // cool strip, left
    panel(4, 34, 42, 6, 10, 4.6, 3.9, 3.0);      // warm strip, right
    panel(64, 40, 0, 6, 46, 0.9, 0.88, 0.86);    // soft front fill
    panel(70, 26, 0, -36, 12, 1.6, 0.95, 0.5);   // warm floor bounce
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(es, 0.02, 0.1, 200).texture;

    const key = new THREE.DirectionalLight(0xfff3e4, 2.2); key.position.set(-0.55, 0.85, 1.0); scene.add(key); scene.add(key.target);
    const hemi = new THREE.HemisphereLight(0xeef2ff, 0x2a1c10, 0.65); scene.add(hemi);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    function tex(src) {
      const t = new THREE.CanvasTexture(src);
      t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = maxAniso;
      t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter; t.generateMipmaps = true;
      return t;
    }
    // face: the picture is emissive (keeps its exposure, not re-lit), the gloss is a real clearcoat on top
    let mid = 0;
    function faceMat(t, opt) {
      const m = new THREE.MeshPhysicalMaterial({ color: 0x000000, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: 1,
        roughness: 0.34, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: opt.env == null ? 0.42 : opt.env });
      m.toneMapped = false;
      const U = { uSpecX: { value: -9 }, uSpecAmp: { value: 0 }, uSpecW: { value: 0.1 }, uEdge: { value: 0.42 } };
      const id = "rk-face-" + (++mid);
      m.customProgramCacheKey = () => id;
      m.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, U);
        sh.fragmentShader = "uniform float uSpecX, uSpecAmp, uSpecW, uEdge;\n" + sh.fragmentShader.replace("#include <emissivemap_fragment>",
          "#include <emissivemap_fragment>\n {\n" +
          "  float fac = clamp(abs(normal.z), 0.0, 1.0);\n" +
          "  totalEmissiveRadiance *= mix(uEdge, 1.0, pow(fac, 0.8));\n" +
          "  float dd = vEmissiveMapUv.x * 0.82 + (1.0 - vEmissiveMapUv.y) * 0.42;\n" +
          "  float sd = (dd - uSpecX) / uSpecW; float sb = exp(-sd * sd);\n" +
          "  totalEmissiveRadiance += vec3(1.0, 0.96, 0.88) * sb * uSpecAmp;\n }");
      };
      m.userData.U = U;
      return m;
    }
    function rimMat(color, opt) {
      const m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(color), metalness: 1.0, roughness: opt.rough == null ? 0.24 : opt.rough,
        clearcoat: 0.7, clearcoatRoughness: 0.06, envMapIntensity: opt.env == null ? 1.15 : opt.env });
      const U = { uGlow: { value: 0 }, uGlowCol: { value: new THREE.Color(opt.glowColor || color) } };
      const id = "rk-rim-" + (++mid);
      m.customProgramCacheKey = () => id;
      m.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, U);
        sh.fragmentShader = "uniform float uGlow; uniform vec3 uGlowCol;\n" + sh.fragmentShader.replace("#include <emissivemap_fragment>",
          "#include <emissivemap_fragment>\n totalEmissiveRadiance += uGlowCol * uGlow;");
      };
      m.userData.U = U;
      return m;
    }
    // soft contact shadow texture
    const shCanvas = document.createElement("canvas"); shCanvas.width = 256; shCanvas.height = 160;
    (function () {
      const c = shCanvas.getContext("2d"); c.filter = "blur(14px)"; c.fillStyle = "rgba(0,0,0,1)";
      const x = 40, y = 34, w = 176, h = 92, r = 14;
      c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); c.fill();
    })();
    const shTex = tex(shCanvas);

    function faceGeo(w, h, r) {
      const g = new THREE.ShapeGeometry(new THREE.Shape(rrPts(w, h, r, 12)));
      const p = g.attributes.position, uv = g.attributes.uv;
      for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / w + 0.5, p.getY(i) / h + 0.5);
      uv.needsUpdate = true;
      return g;
    }

    const tiles = (o.tiles || []).map((t) => {
      const w = t.w, h = t.h, r = t.r || 14, D = t.depth || 14, bt = t.bt || 4, bs = t.bs || 4, lip = t.lip == null ? 3 : t.lip;
      const g = new THREE.Group(); scene.add(g);
      const piv = new THREE.Group(); g.add(piv);
      const body = new THREE.ExtrudeGeometry(new THREE.Shape(rrPts(w, h, r, 12)), { depth: D - 2 * bt, bevelEnabled: true, bevelThickness: bt, bevelSize: bs, bevelOffset: -bs, bevelSegments: 5, curveSegments: 1 });
      body.translate(0, 0, -(D - 2 * bt) / 2);
      const rim = rimMat(t.rim || "#E3E7EE", t.rimOpt || {});
      piv.add(new THREE.Mesh(smoothNormals(body, 50), rim));
      const ins = bs + lip, fw = w - 2 * ins, fh = h - 2 * ins, fr = Math.max(2, r - ins);
      const fg = faceGeo(fw, fh, fr);
      const front = faceMat(tex(t.front), t.faceOpt || {});
      const fm = new THREE.Mesh(fg, front); fm.position.z = D / 2 + 0.4; piv.add(fm);
      const back = faceMat(tex(t.back), t.backOpt || { env: 0.75 });
      const bm = new THREE.Mesh(fg, back); bm.position.z = -(D / 2 + 0.4);
      if (t.axis === "x") bm.rotation.x = Math.PI; else bm.rotation.y = Math.PI;
      piv.add(bm);
      const shm = new THREE.Mesh(new THREE.PlaneGeometry(w * 256 / 176, h * 160 / 92), new THREE.MeshBasicMaterial({ map: shTex, transparent: true, depthWrite: false, opacity: 0.65, toneMapped: false }));
      shm.position.set(t.shadowOff ? t.shadowOff[0] : 6, t.shadowOff ? -t.shadowOff[1] : -12, -D / 2 - 30); shm.renderOrder = -1;
      g.add(shm);
      return { t, g, piv, rim, front, back, shm, D };
    });

    // pose: {vis, x, y, z, rx, ry, rz, s, sx, sy, spec, specAmp, backSpec, backSpecAmp, glow, shadow}
    function set(i, p) {
      const T = tiles[i]; if (!T) return;
      T.g.visible = p.vis !== false && (p.s == null || p.s > 0.001);
      if (!T.g.visible) return;
      const s = p.s == null ? 1 : p.s;
      T.g.position.set(T.t.cx + (p.x || 0), -(T.t.cy + (p.y || 0)), p.z || 0);
      T.piv.rotation.set(p.rx || 0, p.ry || 0, p.rz || 0);
      T.piv.scale.set(s * (p.sx == null ? 1 : p.sx), s * (p.sy == null ? 1 : p.sy), s);
      T.front.userData.U.uSpecX.value = p.spec == null ? -9 : p.spec;
      T.front.userData.U.uSpecAmp.value = p.specAmp || 0;
      T.back.userData.U.uSpecX.value = p.backSpec == null ? -9 : p.backSpec;
      T.back.userData.U.uSpecAmp.value = p.backSpecAmp || 0;
      T.rim.userData.U.uGlow.value = p.glow || 0;
      // the shadow stays on the plate: it narrows as the slab turns edge-on and softens as the slab lifts
      const turnY = Math.max(0.12, Math.abs(Math.cos(p.ry || 0))), turnX = Math.max(0.12, Math.abs(Math.cos(p.rx || 0)));
      T.shm.scale.set(s * turnY * (1 + (p.z || 0) / 600), s * turnX * (1 + (p.z || 0) / 600), 1);
      T.shm.material.opacity = 0.65 * (p.shadow == null ? 1 : p.shadow) * (1 - Math.min(0.5, (p.z || 0) / 400));
    }
    function render() { renderer.setRenderTarget(null); renderer.render(scene, camera); }
    return { canvas, renderer, scene, camera, key, hemi, tiles, set, render };
  };
})();
