/* Gloss3D (cash-counter build): small Three.js (r160, global THREE) helper for the cash pill's physical parts.
   Adapted copy of the facecam frame's helper: extruded, bevelled rounded rectangles in canvas pixel coordinates,
   smooth creased normals so a bevel reads as one rounded profile, a studio PMREM environment, a key + hemisphere
   light, and one shader patch per material:
     - a vertical lacquer ramp (object space, so it travels and scales with the pill),
     - a soft diagonal specular band (uSpecX / uSpecAmp), clipped to the geometry by construction,
     - an emissive glow (uGlow / uGlowCol) for neon and light-flood states,
     - an optional re-skin front (uFront): left of the front the ramp becomes a second ramp (e.g. green -> gold),
       with a hot emissive band riding the front (uFrontAmp).
   Seek-safe: nothing animates on its own; the caller sets uniforms / transforms and calls render() from timeline time. */
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
    return clean(p.getPoints(seg || 14));
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

  window.Gloss3D = function (o) {
    const W = o.W, H = o.H;
    const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
    canvas.style.cssText = "position:absolute;left:" + (o.left || 0) + "px;top:" + (o.top || 0) + "px;width:" + W + "px;height:" + H + "px;display:block;pointer-events:none";
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = o.exposure || 1.0;
    const scene = new THREE.Scene();
    // o.persp = { D, ox, oy }: a perspective camera D px from the z = 0 plane, principal point at canvas (ox, oy).
    // z = 0 maps 1:1 to canvas px, so a DOM layer with CSS `perspective: D; perspective-origin: ox oy` on its parent matches.
    let camera;
    if (o.persp) {
      const D = o.persp.D, ox = o.persp.ox, oy = o.persp.oy;
      const fw = 2 * Math.max(ox, W - ox), fh = 2 * Math.max(oy, H - oy);
      camera = new THREE.PerspectiveCamera(2 * Math.atan(fh / 2 / D) * 180 / Math.PI, fw / fh, 20, D * 4);
      camera.setViewOffset(fw, fh, fw / 2 - ox, fh / 2 - oy, W, H);
      camera.position.set(ox, -oy, D);
    } else { camera = new THREE.OrthographicCamera(0, W, 0, -H, 1, 6000); camera.position.set(0, 0, 3000); }

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
    panel(46, 14, 0, 38, 14, 9 * k(E.top, 1), 9.2 * k(E.top, 1), 9.6 * k(E.top, 1));      // big softbox above, slightly in front
    panel(60, 4, 0, 24, -34, 14 * k(E.back, 1), 13.4 * k(E.back, 1), 12.6 * k(E.back, 1)); // hot bar up and behind: lit top lip
    panel(4, 34, -42, 6, 10, 4.2 * k(E.side, 1), 4.6 * k(E.side, 1), 5.2 * k(E.side, 1));   // cool strip, left
    panel(4, 34, 42, 6, 10, 4.6 * k(E.side, 1), 3.9 * k(E.side, 1), 3.0 * k(E.side, 1));    // warm strip, right
    panel(64, 40, 0, 6, 46, 1.25 * k(E.front, 1), 1.22 * k(E.front, 1), 1.2 * k(E.front, 1)); // soft front fill
    panel(70, 26, 0, -36, 12, 1.6 * k(E.floor, 1), 0.95 * k(E.floor, 1), 0.5 * k(E.floor, 1)); // warm floor bounce
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(es, 0.02, 0.1, 200).texture;

    const key = new THREE.DirectionalLight(0xfff3e4, o.key == null ? 2.4 : o.key); key.position.set(-0.55, 0.85, 1.0); scene.add(key);
    const hemi = new THREE.HemisphereLight(0xeef2ff, 0x2a1c10, o.hemi == null ? 0.7 : o.hemi); scene.add(hemi);

    // shared light uniforms: a soft diagonal specular band (object-space px), and the re-skin front
    const U = { uSpecX: { value: -1e5 }, uSpecW: { value: 60 }, uSpecAmp: { value: 0 }, uSpecDir: { value: new THREE.Vector2(0.86, 0.5) },
      uFront: { value: -1e5 }, uFrontF: { value: 40 }, uFrontAmp: { value: 0 }, uFrontCol: { value: new THREE.Color("#FFF4C8") } };
    let mid = 0;
    function mat(kind, opt) {
      opt = opt || {};
      const m = new THREE.MeshPhysicalMaterial(Object.assign({}, kind === "metal"
        ? { color: new THREE.Color(opt.color || "#4a4f58"), metalness: 1.0, roughness: 0.22, clearcoat: 0.6, clearcoatRoughness: 0.06, envMapIntensity: 1.0 }
        : { color: new THREE.Color(opt.color || "#FFD23C"), metalness: 0.0, roughness: 0.28, clearcoat: 1.0, clearcoatRoughness: 0.04, envMapIntensity: 1.0 },
      opt.params || {}));
      if (opt.toneMapped === false) m.toneMapped = false;
      const gr = opt.grad, rs = opt.reskin;
      const G = { uGlow: { value: opt.glow || 0 }, uGlowCol: { value: new THREE.Color(opt.glowColor || opt.color || "#FFD23C") }, uSpecGain: { value: opt.specGain == null ? 1 : opt.specGain },
        uGradOn: { value: gr ? 1 : 0 }, uGradTop: { value: gr ? gr.top : 1 }, uGradBot: { value: gr ? gr.bottom : 0 },
        uColTop: { value: new THREE.Color(gr ? gr.colTop : "#ffffff") }, uColBot: { value: new THREE.Color(gr ? gr.colBot : "#ffffff") },
        uReOn: { value: rs ? 1 : 0 }, uCol2Top: { value: new THREE.Color(rs ? rs.colTop : "#ffffff") }, uCol2Bot: { value: new THREE.Color(rs ? rs.colBot : "#ffffff") },
        uFrontGain: { value: rs && rs.frontGain != null ? rs.frontGain : 1 } };
      // optional reeded (coin) edge on the side wall of a rounded-rect extrusion: hw = half width, r = corner radius,
      // z0..z1 = the straight wall's z range (object space), period in px, depth = how dark the grooves get
      const rd = opt.reed;
      Object.assign(G, { uReedOn: { value: rd ? 1 : 0 }, uReedHW: { value: rd ? rd.hw : 1 }, uReedR: { value: rd ? rd.r : 1 },
        uReedZ0: { value: rd ? rd.z0 : 0 }, uReedZ1: { value: rd ? rd.z1 : 0 }, uReedP: { value: rd ? rd.period : 8 }, uReedD: { value: rd ? rd.depth : 0.4 } });
      const id = "g3d-" + kind + "-" + (++mid);
      m.customProgramCacheKey = () => id;
      m.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, U, G);
        sh.vertexShader = "varying vec3 vLP;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vLP = position;");
        sh.fragmentShader = "varying vec3 vLP; uniform float uSpecX, uSpecW, uSpecAmp, uGlow, uSpecGain, uGradOn, uGradTop, uGradBot, uReOn, uFront, uFrontF, uFrontAmp, uFrontGain; uniform vec2 uSpecDir; uniform vec3 uGlowCol, uColTop, uColBot, uCol2Top, uCol2Bot, uFrontCol;\n" +
          "uniform float uReedOn, uReedHW, uReedR, uReedZ0, uReedZ1, uReedP, uReedD;\n" +
          sh.fragmentShader
          .replace("#include <color_fragment>", "#include <color_fragment>\n if (uGradOn > 0.5) { float gk = smoothstep(uGradBot, uGradTop, vLP.y); vec3 c1 = mix(uColBot, uColTop, gk);" +
            " if (uReOn > 0.5) { float rk = smoothstep(uFront + uFrontF, uFront - uFrontF, vLP.x); c1 = mix(c1, mix(uCol2Bot, uCol2Top, gk), rk); } diffuseColor.rgb = c1; }\n" +
            " if (uReedOn > 0.5) { float ex = uReedHW - uReedR; float ax = abs(vLP.x);" +
            "  float s = ax <= ex ? vLP.x : sign(vLP.x) * ex + atan(vLP.y, ax - ex) * uReedR;" +
            "  float zk = smoothstep(uReedZ0, uReedZ0 + 3.0, vLP.z) * (1.0 - smoothstep(uReedZ1 - 3.0, uReedZ1, vLP.z));" +
            "  float ph = fract(s / uReedP); float ridge = smoothstep(0.0, 0.18, ph) * (1.0 - smoothstep(0.55, 0.8, ph));" +
            "  float lit = exp(-pow((ph - 0.22) / 0.08, 2.0));" +
            "  diffuseColor.rgb *= mix(1.0, mix(1.0 - uReedD, 1.0, ridge) + 0.35 * lit, zk); }")
          .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n {\n" +
            "  float bev = 1.0 - clamp(normal.z, 0.0, 1.0);\n" +
            "  float dd = dot(vLP.xy, uSpecDir);\n" +
            "  float sd = (dd - uSpecX) / uSpecW; float sb = exp(-sd * sd);\n" +
            "  totalEmissiveRadiance += vec3(1.0, 0.98, 0.93) * sb * uSpecAmp * uSpecGain * (0.3 + 1.1 * bev);\n" +
            "  float fd = (vLP.x - uFront) / (uFrontF * 0.9); totalEmissiveRadiance += uFrontCol * exp(-fd * fd) * uFrontAmp * uFrontGain * (0.55 + 0.9 * bev);\n" +
            "  totalEmissiveRadiance += uGlowCol * uGlow;\n }");
      };
      m.userData.G = G;
      return m;
    }

    const group = new THREE.Group(); scene.add(group);
    const px = o.pivot ? o.pivot[0] : W / 2, py = o.pivot ? o.pivot[1] : H / 2;
    group.position.set(px, -py, 0);
    // shape: outer rect [x,y,w,h,r] and optional hole rects, in canvas px; extruded, bevelled, front face at z = opt.z
    function add(outer, holes, opt) {
      const seg = opt.seg || 14;
      const s = new THREE.Shape(rrPts(outer[0] - px, outer[1] - py, outer[2], outer[3], outer[4], seg));
      (holes || []).forEach((h) => s.holes.push(new THREE.Path(rrPts(h[0] - px, h[1] - py, h[2], h[3], h[4], seg))));
      const bt = opt.bt == null ? 6 : opt.bt, bs = opt.bs == null ? 6 : opt.bs, depth = opt.depth == null ? 4 : opt.depth;
      const geo = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: bt, bevelSize: bs, bevelOffset: -bs, bevelSegments: opt.bseg || 6, curveSegments: 1 });
      geo.translate(0, 0, (opt.z || 0) - (depth + bt));
      smoothNormals(geo, opt.crease || 50);
      const mesh = new THREE.Mesh(geo, opt.mat); if (opt.order != null) mesh.renderOrder = opt.order; group.add(mesh);
      return mesh;
    }
    // pose: offset (dx, dy) in canvas px, scale (sx, sy), rotation (rx, ry) in radians (three.js sense: +rx tips the top toward camera)
    function pose(p) {
      group.position.set(px + (p.dx || 0), -(py + (p.dy || 0)), 0);
      group.scale.set(p.sx == null ? 1 : p.sx, p.sy == null ? 1 : p.sy, 1);
      group.rotation.set(p.rx || 0, p.ry || 0, 0);
    }
    // the matching CSS transform for a DOM layer covering the canvas (transform-origin = pivot), with its plane at depth z
    function css(p, z) {
      return "translate(" + (p.dx || 0).toFixed(2) + "px," + (p.dy || 0).toFixed(2) + "px) rotateX(" + (-(p.rx || 0)).toFixed(4) + "rad) rotateY(" + (p.ry || 0).toFixed(4) +
        "rad) scale(" + (p.sx == null ? 1 : p.sx).toFixed(4) + "," + (p.sy == null ? 1 : p.sy).toFixed(4) + ") translateZ(" + (z || 0).toFixed(1) + "px)";
    }
    function render() { renderer.setRenderTarget(null); renderer.render(scene, camera); }
    return { canvas, renderer, scene, camera, group, U, mat, add, pose, css, render, key, hemi, px, py };
  };
})();
