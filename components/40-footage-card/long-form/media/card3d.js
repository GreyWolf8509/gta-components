/* Card3D: small Three.js (r160, global THREE) helper for the footage card's physical parts.
   A full-frame perspective stage (camera distance D px, so the z = 0 plane maps 1:1 to canvas pixels), a studio PMREM
   environment (top softbox, a hot bar behind, side strips, warm floor bounce), a key + hemisphere light, and extruded,
   bevelled rounded rectangles (bezels, lips, plates, chips) placed in DOM-like local pixels (x right, y down).
   One shader patch per material: a soft specular band in card-local px (uSpecX / uSpecAmp, clipped to the geometry by
   construction), an emissive ignite (uGlow) and an optional vertical colour ramp under the clearcoat.
   quadCSS(obj, x, y, w, h, z) returns the CSS matrix3d (a homography) that maps a w x h DOM element onto that rect of
   obj's local plane, so footage and type stay DOM-sharp and exactly pinned to the projected 3D faces.
   Seek-safe: nothing animates on its own; the caller sets transforms / uniforms and calls render() from timeline time.
   Shared by a/ and b/ (identical file). */
(function () {
  function clean(pts) {
    const out = [];
    for (const p of pts) if (!out.length || p.distanceTo(out[out.length - 1]) > 0.05) out.push(p);
    while (out.length > 3 && out[0].distanceTo(out[out.length - 1]) <= 0.05) out.pop();
    return out;
  }
  // DOM rect (x right, y down) -> y-up point loop, counter-clockwise, circular corners
  function rrPts(x, y, w, h, r, seg) {
    const p = new THREE.Path(), X0 = x, X1 = x + w, Y1 = -y, Y0 = -(y + h);
    r = Math.max(0.01, Math.min(r, w / 2, h / 2));
    p.moveTo(X0 + r, Y0);
    p.lineTo(X1 - r, Y0); p.absarc(X1 - r, Y0 + r, r, -Math.PI / 2, 0, false);
    p.lineTo(X1, Y1 - r); p.absarc(X1 - r, Y1 - r, r, 0, Math.PI / 2, false);
    p.lineTo(X0 + r, Y1); p.absarc(X0 + r, Y1 - r, r, Math.PI / 2, Math.PI, false);
    p.lineTo(X0, Y0 + r); p.absarc(X0 + r, Y0 + r, r, Math.PI, Math.PI * 1.5, false);
    return clean(p.getPoints(seg || 12));
  }
  function smoothNormals(geo, deg) {
    const pos = geo.attributes.position.array, n = pos.length / 3, cosT = Math.cos(deg * Math.PI / 180);
    const key = new Array(n), map = new Map();
    const faceN = new Float32Array(n);
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
  // homography: unit square -> quad P[0..3] (TL, TR, BR, TL-below), as a CSS matrix3d for a w x h element (origin 0 0)
  function homog(w, h, P) {
    const x0 = P[0][0], y0 = P[0][1], x1 = P[1][0], y1 = P[1][1], x2 = P[2][0], y2 = P[2][1], x3 = P[3][0], y3 = P[3][1];
    const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3, dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
    const den = dx1 * dy2 - dx2 * dy1;
    let g = 0, k = 0;
    if (Math.abs(den) > 1e-9) { g = (dx3 * dy2 - dx2 * dy3) / den; k = (dx1 * dy3 - dx3 * dy1) / den; }
    const a = x1 - x0 + g * x1, b = x3 - x0 + k * x3, c = x0, d = y1 - y0 + g * y1, e = y3 - y0 + k * y3, f = y0;
    const m = [a / w, d / w, 0, g / w, b / h, e / h, 0, k / h, 0, 0, 1, 0, c, f, 0, 1];
    return "matrix3d(" + m.map((v) => (Math.abs(v) < 1e-12 ? "0" : v.toPrecision(10))).join(",") + ")";
  }

  window.Card3D = function (o) {
    const W = o.W, H = o.H, D = o.D || 2400;
    const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
    canvas.style.cssText = "position:absolute;left:0;top:0;width:" + W + "px;height:" + H + "px;display:block;pointer-events:none";
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = o.exposure || 1.0;
    const scene = new THREE.Scene();
    const fov = 2 * Math.atan((H / 2) / D) * 180 / Math.PI;
    const camera = new THREE.PerspectiveCamera(fov, W / H, 20, D * 6); camera.position.set(0, 0, D); camera.lookAt(0, 0, 0);

    // ---------- studio environment ----------
    const es = new THREE.Scene();
    es.add(new THREE.Mesh(new THREE.SphereGeometry(60, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(0.62,0.66,0.74), hor = vec3(0.20,0.20,0.22), low = vec3(0.07,0.05,0.035);" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.0, 0.8, y)) : mix(hor, low, smoothstep(0.0, 0.6, -y)); gl_FragColor = vec4(c, 1.0); }"
    })));
    const panel = (w, h, x, y, z, r, g, b) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(r, g, b), side: THREE.DoubleSide }));
      m.position.set(x, y, z); m.lookAt(0, 0, 0); es.add(m);
    };
    const E = o.env || {};
    const k = (v, d) => (v == null ? d : v);
    panel(46, 14, 0, 38, 14, 9 * k(E.top, 1), 9.2 * k(E.top, 1), 9.6 * k(E.top, 1));
    panel(60, 4, 0, 24, -34, 14 * k(E.back, 1), 13.4 * k(E.back, 1), 12.6 * k(E.back, 1));
    panel(4, 34, -42, 6, 10, 4.2 * k(E.side, 1), 4.6 * k(E.side, 1), 5.2 * k(E.side, 1));
    panel(4, 34, 42, 6, 10, 4.6 * k(E.side, 1), 3.9 * k(E.side, 1), 3.0 * k(E.side, 1));
    panel(64, 40, 0, 6, 46, 1.25 * k(E.front, 1), 1.22 * k(E.front, 1), 1.2 * k(E.front, 1));
    panel(70, 26, 0, -36, 12, 1.6 * k(E.floor, 1), 0.95 * k(E.floor, 1), 0.5 * k(E.floor, 1));
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(es, 0.02, 0.1, 200).texture;

    const key = new THREE.DirectionalLight(0xfff3e4, o.key == null ? 2.4 : o.key); key.position.set(-0.55, 0.85, 1.0); scene.add(key);
    const hemi = new THREE.HemisphereLight(0xeef2ff, 0x2a1c10, o.hemi == null ? 0.7 : o.hemi); scene.add(hemi);

    const card = new THREE.Group(); scene.add(card);
    // shared light uniforms: a soft diagonal specular band, in card-local px (y up)
    const U = { uSpecX: { value: -1e5 }, uSpecW: { value: 60 }, uSpecAmp: { value: 0 }, uSpecDir: { value: new THREE.Vector2(0.86, 0.5) },
      uToLocal: { value: new THREE.Matrix4() } };
    let mid = 0;
    function mat(kind, opt) {
      opt = opt || {};
      const m = new THREE.MeshPhysicalMaterial(Object.assign({}, kind === "metal"
        ? { color: new THREE.Color(opt.color || "#4a4f58"), metalness: 1.0, roughness: 0.22, clearcoat: 0.6, clearcoatRoughness: 0.06, envMapIntensity: 1.0 }
        : { color: new THREE.Color(opt.color || "#FFD23C"), metalness: 0.0, roughness: 0.28, clearcoat: 1.0, clearcoatRoughness: 0.04, envMapIntensity: 1.0 },
      opt.params || {}));
      if (opt.toneMapped === false) m.toneMapped = false;
      const gr = opt.grad;   // optional vertical ramp: {top, bottom} in card-local DOM px (y down), {colTop, colBot}
      const G = { uGlow: { value: opt.glow || 0 }, uGlowCol: { value: new THREE.Color(opt.glowColor || opt.color || "#FFD23C") }, uSpecGain: { value: opt.specGain == null ? 1 : opt.specGain }, uSpecFace: { value: opt.specFace == null ? 0.35 : opt.specFace },
        uGradOn: { value: gr ? 1 : 0 }, uGradTop: { value: gr ? -gr.top : 1 }, uGradBot: { value: gr ? -gr.bottom : 0 },
        uColTop: { value: new THREE.Color(gr ? gr.colTop : "#ffffff") }, uColBot: { value: new THREE.Color(gr ? gr.colBot : "#ffffff") },
        uGradLocal: { value: gr && gr.local ? 1 : 0 } };
      const id = "c3d-" + kind + "-" + (++mid);
      m.customProgramCacheKey = () => id;
      m.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, U, G);
        sh.vertexShader = "varying vec3 vLP; varying vec3 vOP; uniform mat4 uToLocal;\n" + sh.vertexShader.replace("#include <begin_vertex>",
          "#include <begin_vertex>\n vLP = (uToLocal * modelMatrix * vec4(position, 1.0)).xyz; vOP = position;");
        sh.fragmentShader = "varying vec3 vLP; varying vec3 vOP; uniform float uSpecX, uSpecW, uSpecAmp, uGlow, uSpecGain, uSpecFace, uGradOn, uGradTop, uGradBot, uGradLocal; uniform vec2 uSpecDir; uniform vec3 uGlowCol, uColTop, uColBot;\n" +
          sh.fragmentShader
          .replace("#include <color_fragment>", "#include <color_fragment>\n if (uGradOn > 0.5) { float gy = mix(vLP.y, vOP.y, uGradLocal); float gk = smoothstep(uGradBot, uGradTop, gy); diffuseColor.rgb = mix(uColBot, uColTop, gk); }")
          .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n {\n" +
            "  float bev = 1.0 - clamp(normal.z, 0.0, 1.0);\n" +
            "  float dd = dot(vLP.xy, uSpecDir);\n" +
            "  float sd = (dd - uSpecX) / uSpecW; float sb = exp(-sd * sd);\n" +
            "  totalEmissiveRadiance += vec3(1.0, 0.97, 0.9) * sb * uSpecAmp * uSpecGain * (uSpecFace + 1.0 * bev);\n" +
            "  totalEmissiveRadiance += uGlowCol * uGlow;\n }");
      };
      m.userData.G = G;
      return m;
    }

    // shape: outer rect [x,y,w,h,r] and optional hole rects, in parent-local DOM px; extruded, bevelled, front face at z
    function add(parent, outer, holes, opt) {
      const seg = opt.seg || 12;
      const s = new THREE.Shape(rrPts(outer[0], outer[1], outer[2], outer[3], outer[4], seg));
      (holes || []).forEach((h) => s.holes.push(new THREE.Path(rrPts(h[0], h[1], h[2], h[3], h[4], seg))));
      const bt = opt.bt == null ? 6 : opt.bt, bs = opt.bs == null ? 6 : opt.bs, depth = opt.depth == null ? 4 : opt.depth;
      const geo = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: bt, bevelSize: bs, bevelOffset: -bs, bevelSegments: opt.bseg || 6, curveSegments: 1 });
      geo.translate(0, 0, (opt.z || 0) - (depth + bt));
      smoothNormals(geo, opt.crease || 50);
      const mesh = new THREE.Mesh(geo, opt.mat); (parent || card).add(mesh);
      return mesh;
    }
    const _v = new THREE.Vector3();
    function project(obj, x, y, z) {
      _v.set(x, -y, z).applyMatrix4(obj.matrixWorld).project(camera);
      return [(_v.x + 1) * 0.5 * W, (1 - _v.y) * 0.5 * H];
    }
    function quadCSS(obj, x, y, w, h, z) {
      const P = [project(obj, x, y, z), project(obj, x + w, y, z), project(obj, x + w, y + h, z), project(obj, x, y + h, z)];
      return homog(w, h, P);
    }
    // the signed screen area of a local rect (negative = the face looks away from the camera)
    function faceArea(obj, x, y, w, h, z) {
      const P = [project(obj, x, y, z), project(obj, x + w, y, z), project(obj, x + w, y + h, z), project(obj, x, y + h, z)];
      let A = 0; for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; A += P[i][0] * P[j][1] - P[j][0] * P[i][1]; }
      return A / 2;
    }
    function update() { scene.updateMatrixWorld(true); U.uToLocal.value.copy(card.matrixWorld).invert(); }
    function render() { renderer.setRenderTarget(null); renderer.render(scene, camera); }
    return { canvas, renderer, scene, camera, card, U, mat, add, project, quadCSS, faceArea, update, render, key, hemi, D };
  };
})();
