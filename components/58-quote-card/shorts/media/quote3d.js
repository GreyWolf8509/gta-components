/* Quote3D: the Three.js kit for 58 Quote card (a/ and b/ hold identical copies; not imported across).
   Adapted from the 25 Sponsor card kit.
   - stage(): a WebGL window onto the full frame (setViewOffset), pixel units, z toward the camera, ACES tone mapping,
     a PMREM studio environment (softbox, two vertical strips), key + hemisphere + a raking light.
   - tile(): the source tile: a rounded, bevelled, extruded gold-enamel slab (canvas face under a clearcoat) carrying a
     raised black-lacquer double quote mark (real extruded geometry), a soft shadow plane and a pink neon halo plane.
   - band(): a specular band shared by every material (one sweep crosses all). U holds its uniforms.
   Seek-safe: nothing animates on its own; callers set state from timeline time and call render(). */
(function () {
  const PI = Math.PI, D2R = PI / 180;
  const Q3D = {};
  Q3D.U = { uBand: { value: -1e5 }, uBandW: { value: 60 }, uBandAmp: { value: 0 }, uBandSlope: { value: 0.5 },
    uBandCol: { value: new THREE.Color(1.0, 0.92, 0.78) } };

  Q3D.stage = function (o) {
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
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(1.30,1.22,1.32), hor = vec3(0.30,0.24,0.32), low = vec3(0.04,0.025,0.05);" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.05, 0.8, y)) : mix(hor, low, smoothstep(0.0, 0.4, -y)); gl_FragColor = vec4(c, 1.0); }"
    })));
    const panel = (pw, ph, px, py, pz, r, g, b) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph), new THREE.MeshBasicMaterial({ color: new THREE.Color(r, g, b), side: THREE.DoubleSide }));
      m.position.set(px, py, pz); m.lookAt(0, 0, 0); env.add(m);
    };
    panel(40, 10, -8, 30, 24, 2.4, 2.25, 2.0);   // overhead softbox, front (warm)
    panel(4, 40, 30, 2, 26, 3.0, 2.9, 3.0);      // right strip (the long bevel highlight)
    panel(6, 34, -32, 0, 22, 1.25, 0.95, 0.95);  // left strip, warm with a hint of the scene's pink
    panel(22, 16, -16, 16, 40, 0.85, 0.8, 0.78); // upper-left front card: the broad gloss across the enamel face
    panel(26, 8, 0, -6, 44, 0.5, 0.42, 0.5);     // low front bounce
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(env, 0.0, 0.1, 200).texture;
    const key = new THREE.DirectionalLight(0xfff2e6, 1.45); key.position.set(-0.55, 0.8, 1).multiplyScalar(DIST); scene.add(key);
    const rake = new THREE.DirectionalLight(0xffe4f0, 0); rake.position.set(-DIST, DIST * 0.6, DIST * 0.4); scene.add(rake);
    const hemi = new THREE.HemisphereLight(0xfff0ff, 0x2a1430, 0.55); scene.add(hemi);
    const W = (fx, fy) => [fx - FW / 2, FH / 2 - fy];
    return { canvas, renderer, scene, camera, DIST, key, rake, hemi, W, render: () => renderer.render(scene, camera) };
  };

  Q3D.band = function (mat, k) {
    const U = Q3D.U;
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

  // rounded rect from explicit, unique points (lineTo + absarc leaves near-duplicate joints that break the bevel offset)
  function rrShape(w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    const x0 = -w / 2 + r, x1 = w / 2 - r, y0 = -h / 2 + r, y1 = h / 2 - r, N = 16, pts = [];
    const corner = (cx, cy, a0) => { for (let i = 0; i <= N; i++) { const a = a0 + (PI / 2) * (i / N); pts.push(new THREE.Vector2(cx + r * Math.cos(a), cy + r * Math.sin(a))); } };
    corner(x1, y0, -PI / 2); corner(x1, y1, 0); corner(x0, y1, PI / 2); corner(x0, y0, PI);
    return new THREE.Shape(pts);
  }
  Q3D.rrShape = rrShape;

  // one opening quote mark ("6" form): a ball of radius r at (cx, cy) with a tail rising to a point up and to the right
  function markShape(cx, cy, r) {
    const s = new THREE.Shape();
    const T = [cx + 0.70 * r, cy + 2.30 * r];
    s.moveTo(T[0], T[1]);
    s.bezierCurveTo(cx - 0.35 * r, cy + 2.05 * r, cx - 1.02 * r, cy + 1.25 * r, cx - r, cy + 0.02 * r);     // outer edge down to the ball
    s.absarc(cx, cy, r, PI, 2 * PI + 0.50, false);                                                         // round the ball
    s.bezierCurveTo(cx + 0.60 * r, cy + 1.05 * r, cx + 0.12 * r, cy + 1.62 * r, T[0], T[1]);               // inner edge back to the tip
    return s;
  }
  // the double mark, centred on (0, 0) by its ink box
  Q3D.quoteShapes = function (r) {
    const gap = 2.42 * r, h = 3.3 * r;
    return [markShape(-gap / 2 - 0.08 * r, -h / 2 + r, r), markShape(gap / 2 - 0.08 * r, -h / 2 + r, r)];
  };

  Q3D.shadow = function (w, h, r, blur) {
    const pad = blur * 2.5, cw = Math.ceil(w + pad * 2), chh = Math.ceil(h + pad * 2);
    const c = document.createElement("canvas"); c.width = cw; c.height = chh;
    const g = c.getContext("2d"); g.fillStyle = "#000"; g.fillRect(0, 0, cw, chh);
    g.filter = "blur(" + blur + "px)"; g.fillStyle = "#fff"; g.beginPath(); g.roundRect(pad, pad, w, h, r); g.fill();
    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.MeshBasicMaterial({ color: 0x000000, alphaMap: tex, transparent: true, opacity: 0.5, depthWrite: false, toneMapped: false });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(cw, chh), mat); mesh.renderOrder = 1;
    return { mesh, mat };
  };

  // neon halo: a pink rounded-rect glow (tight hot rim + wide bloom) on a plane behind the slab
  Q3D.halo = function (S, r, color) {
    const pad = 120, n = Math.ceil(S + pad * 2);
    const c = document.createElement("canvas"); c.width = n; c.height = n;
    const g = c.getContext("2d"); g.fillStyle = "#000"; g.fillRect(0, 0, n, n);   // opaque: coverage lives in the green channel
    const rr = (b, a, grow) => { g.filter = "blur(" + b + "px)"; g.globalAlpha = a; g.fillStyle = "#fff"; g.beginPath();
      g.roundRect(pad - grow, pad - grow, S + 2 * grow, S + 2 * grow, r + grow); g.fill(); };
    rr(46, 0.55, 10); rr(22, 0.75, 4); rr(7, 1.0, 1);
    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color), alphaMap: tex, transparent: true, opacity: 0, depthWrite: false, toneMapped: false });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(n, n), mat); mesh.renderOrder = 2;
    return { mesh, mat };
  };

  /* tile({S, r, depth, bevel, mark:{r, depth, bevel}, colors:{face:[3], side, ink, glow}})
     -> {group, slab, glyph, faceMat, sideMat, inkMat, shadow, halo, S, depth} ; front cap at z = 0 */
  Q3D.tile = function (o) {
    const S = o.S, b = o.bevel, cw = S - 2 * b, core = Math.max(0.5, o.depth - 2 * b), C = o.colors, TS = 2;
    const mk = o.mark || {}, mr = mk.r || S * 0.118;
    const shapes = Q3D.quoteShapes(mr);
    // face art: gold enamel, a soft top-left hot spot, a pillowed rim, and the mark's own contact shadow
    const face = document.createElement("canvas"); face.width = Math.round(cw * TS); face.height = Math.round(cw * TS);
    const g = face.getContext("2d"); g.scale(TS, TS);
    let gr = g.createLinearGradient(0, 0, cw, cw);
    gr.addColorStop(0, C.face[0]); gr.addColorStop(0.5, C.face[1]); gr.addColorStop(1, C.face[2]);
    g.fillStyle = gr; g.fillRect(0, 0, cw, cw);
    gr = g.createRadialGradient(cw * 0.26, cw * 0.18, 0, cw * 0.26, cw * 0.18, cw * 0.75);
    gr.addColorStop(0, "rgba(255,250,214,.42)"); gr.addColorStop(1, "rgba(255,250,214,0)"); g.fillStyle = gr; g.fillRect(0, 0, cw, cw);
    gr = g.createRadialGradient(cw / 2, cw / 2, cw * 0.36, cw / 2, cw / 2, cw * 0.74);
    gr.addColorStop(0, "rgba(140,60,0,0)"); gr.addColorStop(1, "rgba(140,60,0,.30)"); g.fillStyle = gr; g.fillRect(0, 0, cw, cw);
    const ox = (mk.x || 0), oy = (mk.y || 0);
    const pathOf = (dx, dy) => { g.beginPath(); shapes.forEach((sh) => { const pts = sh.getPoints(40); pts.forEach((p, i) => { const X = cw / 2 + p.x + ox + dx, Y = cw / 2 - (p.y + oy) + dy; i ? g.lineTo(X, Y) : g.moveTo(X, Y); }); g.closePath(); }); };
    g.save(); g.filter = "blur(9px)"; g.fillStyle = "rgba(96,38,0,.55)"; pathOf(7, 10); g.fill(); g.restore();
    g.save(); g.filter = "blur(2.5px)"; g.fillStyle = "rgba(80,30,0,.5)"; pathOf(2, 3); g.fill(); g.restore();
    const UVG = {
      generateTopUV: (gg, v, a, bb, c) => [a, bb, c].map((i) => new THREE.Vector2((v[i * 3] + cw / 2) / cw, (v[i * 3 + 1] + cw / 2) / cw)),
      generateSideWallUV: () => [new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()]
    };
    const geo = new THREE.ExtrudeGeometry(rrShape(cw, cw, Math.max(1, o.r - b)), { depth: core, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 6, curveSegments: 24, UVGenerator: UVG });
    geo.translate(0, 0, -(core + b));
    const tex = new THREE.CanvasTexture(face); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const faceMat = Q3D.band(new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0.1, 0.08, 0.04), map: tex, emissive: 0xffffff, emissiveMap: tex,
      emissiveIntensity: 0.9, roughness: 0.3, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.5, toneMapped: false }), 0.55);
    const sideMat = Q3D.band(new THREE.MeshPhysicalMaterial({ color: new THREE.Color(C.side), roughness: 0.24, metalness: 0.55,
      clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.3 }), 0.9);
    const slab = new THREE.Mesh(geo, [faceMat, sideMat]);
    // the raised mark: black lacquer with a rounded bevel that catches the softbox and the right strip
    const mb = mk.bevel || 4.5, md = mk.depth || 7;
    const ggeo = new THREE.ExtrudeGeometry(shapes, { depth: md, bevelEnabled: true, bevelThickness: mb, bevelSize: mb * 0.8, bevelSegments: 6, curveSegments: 36 });
    ggeo.translate(ox, oy, -1.5);
    const inkMat = Q3D.band(new THREE.MeshPhysicalMaterial({ color: new THREE.Color(C.ink), roughness: 0.38, metalness: 0.0, clearcoat: 1,
      clearcoatRoughness: 0.04, envMapIntensity: 1.9, emissive: new THREE.Color(C.glow), emissiveIntensity: 0 }), 0.7);
    const glyph = new THREE.Mesh(ggeo, inkMat);
    const group = new THREE.Group(); group.add(slab); group.add(glyph);
    const shadow = Q3D.shadow(S - 10, S - 10, o.r, 22); shadow.mesh.position.set(14, -26, -o.depth - 40); group.add(shadow.mesh);
    const halo = Q3D.halo(S, o.r, C.glow); halo.mesh.position.set(0, 0, -o.depth * 0.6); group.add(halo.mesh);
    return { group, slab, glyph, faceMat, sideMat, inkMat, shadow, halo, tex, S, depth: o.depth };
  };

  window.Q3D = Q3D;
})();
