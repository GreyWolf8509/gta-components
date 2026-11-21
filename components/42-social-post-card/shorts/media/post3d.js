/* Post3D: the Three.js kit for 42 Social post card (a/ and b/ hold identical copies; not imported across).
   - stage(): a WebGL window onto the full frame (setViewOffset), pixel units, z toward the camera, ACES tone mapping,
     a PMREM studio environment (softbox + two strips), key + hemisphere + a raking light.
   - slab(): a rounded (per-corner radii), bevelled, extruded tile whose front cap carries a canvas texture (emissive, so
     printed colours stay exact) under a clearcoat that catches the environment; separate edge material.
   - heart(): a puffy extruded heart (two circles + tangents to the tip), glossy clearcoat, gradient by position.
   - shadow(): a soft contact-shadow plane. band(): one specular band shared by every patched material.
   Seek-safe: nothing animates on its own; callers set state from timeline time and call render(). */
(function () {
  const PI = Math.PI, D2R = PI / 180;
  const K3 = {};
  K3.U = { uBand: { value: -1e5 }, uBandW: { value: 90 }, uBandAmp: { value: 0 }, uBandSlope: { value: 0.55 },
    uBandCol: { value: new THREE.Color(1.0, 0.93, 0.86) } };

  K3.stage = function (o) {
    const FW = o.frameW || 1920, FH = o.frameH || 1080, x = o.x, y = o.y, w = o.w, h = o.h, ss = o.ss || 2, fov = o.fov || 24;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(w * ss); canvas.height = Math.round(h * ss);
    canvas.style.cssText = "position:absolute;left:" + x + "px;top:" + y + "px;width:" + w + "px;height:" + h + "px;display:block";
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(1); renderer.setSize(canvas.width, canvas.height, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = o.exposure || 1.0;
    const scene = new THREE.Scene();
    const DIST = (FH / 2) / Math.tan((fov / 2) * D2R);
    const camera = new THREE.PerspectiveCamera(fov, FW / FH, 20, DIST * 4);
    camera.position.set(0, 0, DIST); camera.lookAt(0, 0, 0);
    camera.setViewOffset(FW, FH, x, y, w, h);

    const env = new THREE.Scene();
    env.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(1.35,1.33,1.30), hor = vec3(0.30,0.29,0.30), low = vec3(0.035,0.03,0.03);" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.05, 0.8, y)) : mix(hor, low, smoothstep(0.0, 0.4, -y)); gl_FragColor = vec4(c, 1.0); }"
    })));
    const panel = (pw, ph, px, py, pz, k, warm) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k * (warm ? 0.93 : 0.99), k * (warm ? 0.82 : 1.0)), side: THREE.DoubleSide }));
      m.position.set(px, py, pz); m.lookAt(0, 0, 0); env.add(m);
    };
    panel(40, 10, -8, 30, 24, 2.4, true);
    panel(4, 40, 30, 2, 26, 3.0, false);
    panel(6, 34, -32, 0, 22, 1.3, true);
    panel(26, 8, 0, -6, 44, 0.5, true);
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(env, 0.0, 0.1, 200).texture;

    const key = new THREE.DirectionalLight(0xfff4e6, 1.5); key.position.set(-0.55, 0.8, 1).multiplyScalar(DIST); scene.add(key);
    const rake = new THREE.DirectionalLight(0xffe7d2, 0); rake.position.set(-DIST, DIST * 0.6, DIST * 0.4); scene.add(rake);
    const hemi = new THREE.HemisphereLight(0xffffff, 0x2a1a14, 0.55); scene.add(hemi);
    const W = (fx, fy) => [fx - FW / 2, FH / 2 - fy];
    return { canvas, renderer, scene, camera, DIST, key, rake, hemi, W, render: () => renderer.render(scene, camera) };
  };

  K3.band = function (mat, k) {
    const U = K3.U;
    mat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, U);
      sh.vertexShader = "varying vec3 vVP;\n" + sh.vertexShader.replace("#include <project_vertex>", "#include <project_vertex>\n vVP = mvPosition.xyz;");
      sh.fragmentShader = "varying vec3 vVP; uniform float uBand, uBandW, uBandAmp, uBandSlope; uniform vec3 uBandCol;\n" +
        sh.fragmentShader.replace("#include <emissivemap_fragment>",
          "#include <emissivemap_fragment>\n { float d = ((vVP.x + vVP.y * uBandSlope) - uBand) / uBandW;" +
          " totalEmissiveRadiance += uBandCol * exp(-d * d) * uBandAmp * " + k.toFixed(3) + "; }");
    };
    mat.customProgramCacheKey = () => "band" + k.toFixed(3);
    return mat;
  };

  // rounded rect, radii [tl, tr, br, bl] (or one number), centred on the origin, y up
  function rrShape(w, h, r) {
    const R = Array.isArray(r) ? r : [r, r, r, r], s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    const c = (v) => Math.max(0.01, Math.min(v, w / 2, h / 2));
    const tl = c(R[0]), tr = c(R[1]), br = c(R[2]), bl = c(R[3]);
    s.moveTo(x + bl, y); s.lineTo(x + w - br, y); s.absarc(x + w - br, y + br, br, -PI / 2, 0, false);
    s.lineTo(x + w, y + h - tr); s.absarc(x + w - tr, y + h - tr, tr, 0, PI / 2, false);
    s.lineTo(x + tl, y + h); s.absarc(x + tl, y + h - tl, tl, PI / 2, PI, false);
    s.lineTo(x, y + bl); s.absarc(x + bl, y + bl, bl, PI, PI * 1.5, false);
    return s;
  }
  K3.rrShape = rrShape;

  // slab: front cap at z = 0, back at z = -depth. Face canvas covers the cap (outer size minus the bevel).
  K3.slab = function (o) {
    const b = o.bevel, cw = o.w - 2 * b, ch = o.h - 2 * b, core = Math.max(0.5, o.depth - 2 * b);
    const rr = Array.isArray(o.r) ? o.r.map((v) => Math.max(1, v - b)) : Math.max(1, o.r - b);
    const UVG = {
      generateTopUV: (g, v, a, bb, c) => [a, bb, c].map((i) => new THREE.Vector2((v[i * 3] + cw / 2) / cw, (v[i * 3 + 1] + ch / 2) / ch)),
      generateSideWallUV: () => [new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()]
    };
    const geo = new THREE.ExtrudeGeometry(rrShape(cw, ch, rr), { depth: core, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 5, curveSegments: o.seg || 20, UVGenerator: UVG });
    geo.translate(0, 0, -(core + b));
    const tex = new THREE.CanvasTexture(o.face); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const dif = o.diffuse == null ? 0.06 : o.diffuse;
    const faceMat = K3.band(new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(dif, dif, dif), map: tex, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: o.emissive == null ? 0.94 : o.emissive,
      roughness: o.rough == null ? 0.32 : o.rough, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.06,
      envMapIntensity: o.env == null ? 1.0 : o.env, toneMapped: false, transparent: !!o.transparent
    }), o.bandK == null ? 0.3 : o.bandK);
    const sideMat = K3.band(new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(o.side || "#d5d8de"), roughness: 0.26, metalness: o.sideMetal == null ? 0.3 : o.sideMetal,
      clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.2
    }), o.sideBandK == null ? 0.6 : o.sideBandK);
    const mesh = new THREE.Mesh(geo, [faceMat, sideMat]);
    return { mesh, tex, faceMat, sideMat, cw, ch, depth: core + 2 * b };
  };

  // soft contact shadow: a blurred rounded rect (or ellipse / heart) in a canvas, on a plane
  K3.shadow = function (w, h, r, blur, ellipse) {
    const pad = blur * 2.5, cw = Math.ceil(w + pad * 2), chh = Math.ceil(h + pad * 2);
    const c = document.createElement("canvas"); c.width = cw; c.height = chh;
    const g = c.getContext("2d"); g.fillStyle = "#000"; g.fillRect(0, 0, c.width, c.height);
    g.filter = "blur(" + blur + "px)"; g.fillStyle = "#fff";
    g.beginPath();
    if (ellipse) g.ellipse(c.width / 2, c.height / 2, w / 2, h / 2, 0, 0, PI * 2);
    else g.roundRect(pad, pad, w, h, r);
    g.fill();
    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.MeshBasicMaterial({ color: 0x000000, alphaMap: tex, transparent: true, opacity: 0.5, depthWrite: false, toneMapped: false });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(cw, chh), mat);
    mesh.renderOrder = 1;
    return { mesh, mat };
  };

  // heart outline: two circles (centres +-a, radius r) joined by tangents to the tip; returns points in unit space,
  // width 2(a+r), centred on its bounding box
  const HA = 0.52, HR = 0.56, HTIP = -1.2;
  K3.heartPath = function (target, W, cx, cy, flipY) {
    const k = W / (2 * (HA + HR)), oy = -(HR + HTIP) / 2, sy = flipY ? -1 : 1;
    const X = (v) => cx + v * k, Y = (v) => cy + sy * (v + oy) * k;
    const d = Math.hypot(HA, HTIP), off = Math.acos(HR / d);
    const bL = Math.atan2(HTIP, HA) - off, bR = Math.atan2(HTIP, -HA) + off;
    const top = Math.sqrt(HR * HR - HA * HA), aL = Math.atan2(top, HA), aR = Math.atan2(top, -HA);
    const pts = [[0, HTIP]];
    const arc = (ccx, a0, a1, n, i0) => { for (let i = i0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; pts.push([ccx + HR * Math.cos(a), HR * Math.sin(a)]); } };
    arc(-HA, bL, aL - 2 * PI, 40, 0);
    arc(HA, aR, bR, 40, 1);
    if (target && target.moveTo) {
      target.moveTo(X(pts[0][0]), Y(pts[0][1]));
      for (let i = 1; i < pts.length; i++) target.lineTo(X(pts[i][0]), Y(pts[i][1]));
      if (target.closePath) target.closePath();
    }
    return { w: W, h: (HR - HTIP) * k };
  };

  K3.heart = function (o) {
    const W = o.w, s = new THREE.Shape(); K3.heartPath(s, W, 0, 0, false);
    const H = (HR - HTIP) * W / (2 * (HA + HR));
    const posUV = (v, i) => new THREE.Vector2((v[i * 3] + W / 2) / W, (v[i * 3 + 1] + H / 2) / H);
    const UVG = {
      generateTopUV: (g, v, a, b, c) => [a, b, c].map((i) => posUV(v, i)),
      generateSideWallUV: (g, v, a, b, c, d) => [a, b, c, d].map((i) => posUV(v, i))
    };
    const geo = new THREE.ExtrudeGeometry(s, { depth: o.depth, bevelEnabled: true, bevelThickness: o.bevelT, bevelSize: o.bevelS, bevelSegments: 8, curveSegments: 8, UVGenerator: UVG });
    geo.translate(0, 0, -(o.depth + o.bevelT));
    const c = document.createElement("canvas"); c.width = 64; c.height = 256;
    const g = c.getContext("2d"), gr = g.createLinearGradient(0, 0, 0, 256);
    (o.stops || [[0, "#FF5A86"], [0.45, "#F2164A"], [1, "#A00A2C"]]).forEach((s2) => gr.addColorStop(s2[0], s2[1]));
    g.fillStyle = gr; g.fillRect(0, 0, 64, 256);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const mat = K3.band(new THREE.MeshPhysicalMaterial({
      color: 0xffffff, map: tex, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: o.emissive == null ? 0.3 : o.emissive,
      roughness: 0.24, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.0, sheen: 0.25, sheenColor: new THREE.Color(1, 0.6, 0.7)
    }), o.bandK == null ? 1.0 : o.bandK);
    const mesh = new THREE.Mesh(geo, mat);
    return { mesh, mat, w: W, h: H, depth: o.depth + 2 * o.bevelT };
  };

  window.K3 = K3;
})();
