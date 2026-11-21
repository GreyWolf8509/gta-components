/* Sponsor3D: the shared Three.js kit for 25 Sponsor card (a/ and b/ hold identical copies; not imported across).
   - stage(): a WebGL window onto the full 1920x1080 frame (setViewOffset), pixel units, z toward the camera,
     ACES tone mapping, a PMREM studio environment (softbox, two vertical strips), key + hemisphere + a raking light.
   - slab(): a rounded, bevelled, extruded tile whose front cap carries a canvas texture (emissive, so printed
     colours stay exact) under a clearcoat that catches the environment; separate edge material.
   - can(): a lathe-turned aluminium can (shoulder, rolled lip, lid with tab, domed base) with a printed label wrap.
   - shadow(): a soft contact-shadow plane. band(): a specular band shared by every material (one sweep crosses all).
   Seek-safe: nothing animates on its own; callers set state from timeline time and call render(). */
(function () {
  const PI = Math.PI, D2R = PI / 180;
  const S3D = {};
  S3D.U = { uBand: { value: -1e5 }, uBandW: { value: 90 }, uBandAmp: { value: 0 }, uBandSlope: { value: 0.55 },
    uBandCol: { value: new THREE.Color(1.0, 0.86, 0.55) } };

  S3D.stage = function (o) {
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

    // studio environment: bright softbox overhead, a hard vertical strip right (the can's long highlight), a softer one left
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
    panel(40, 10, -8, 30, 24, 2.4, true);   // overhead softbox, front
    panel(4, 40, 30, 2, 26, 3.0, false);    // right strip
    panel(6, 34, -32, 0, 22, 1.3, true);    // left strip
    panel(26, 8, 0, -6, 44, 0.55, true);    // low front bounce (a faint sheen on a frontal gloss face)
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(env, 0.0, 0.1, 200).texture;

    const key = new THREE.DirectionalLight(0xfff4e6, 1.5); key.position.set(-0.55, 0.8, 1).multiplyScalar(DIST); scene.add(key);
    const rake = new THREE.DirectionalLight(0xffe7c2, 0); rake.position.set(-DIST, DIST * 0.6, DIST * 0.4); scene.add(rake);
    const hemi = new THREE.HemisphereLight(0xffffff, 0x2a1a14, 0.55); scene.add(hemi);
    const W = (fx, fy) => [fx - FW / 2, FH / 2 - fy];
    return { canvas, renderer, scene, camera, DIST, key, rake, hemi, W, render: () => renderer.render(scene, camera) };
  };

  // specular band: an additive warm stripe in view space (px), one sweep crosses every patched material coherently
  S3D.band = function (mat, k) {
    const U = S3D.U;
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

  function rrShape(w, h, r) {
    const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    r = Math.min(r, w / 2, h / 2);
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -PI / 2, 0, false);
    s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, PI / 2, false);
    s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, PI / 2, PI, false);
    s.lineTo(x, y + r); s.absarc(x + r, y + r, r, PI, PI * 1.5, false);
    return s;
  }
  S3D.rrShape = rrShape;

  // slab: front cap at z = 0, back at z = -depth. Face canvas covers the cap (outer size minus the bevel).
  S3D.slab = function (o) {
    const b = o.bevel, cw = o.w - 2 * b, ch = o.h - 2 * b, core = Math.max(0.5, o.depth - 2 * b);
    const UVG = {
      generateTopUV: (g, v, a, bb, c) => [a, bb, c].map((i) => new THREE.Vector2((v[i * 3] + cw / 2) / cw, (v[i * 3 + 1] + ch / 2) / ch)),
      generateSideWallUV: () => [new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()]
    };
    const geo = o.shape ? new THREE.ExtrudeGeometry(o.shape, { depth: core, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 5, curveSegments: 48, UVGenerator: UVG })
      : new THREE.ExtrudeGeometry(rrShape(cw, ch, Math.max(1, o.r - b)), { depth: core, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 5, curveSegments: 20, UVGenerator: UVG });
    geo.translate(0, 0, -(core + b));
    const tex = new THREE.CanvasTexture(o.face); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const faceMat = S3D.band(new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(o.diffuse == null ? 0.08 : o.diffuse, o.diffuse == null ? 0.08 : o.diffuse, o.diffuse == null ? 0.08 : o.diffuse),
      map: tex, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: o.emissive == null ? 0.94 : o.emissive,
      roughness: o.rough == null ? 0.32 : o.rough, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.06,
      envMapIntensity: o.env == null ? 1.0 : o.env, toneMapped: false
    }), o.bandK == null ? 0.35 : o.bandK);
    const sideMat = S3D.band(new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(o.side || "#a01020"), roughness: 0.26, metalness: o.sideMetal == null ? 0.35 : o.sideMetal,
      clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.25
    }), 0.9);
    const mesh = new THREE.Mesh(geo, [faceMat, sideMat]);
    return { mesh, tex, faceMat, sideMat, cw, ch, depth: core + 2 * b };
  };

  // soft contact shadow: a blurred rounded rect (or ellipse) in a canvas, on a plane
  S3D.shadow = function (w, h, r, blur, ellipse) {
    const pad = blur * 2.5, cw = Math.ceil(w + pad * 2), chh = Math.ceil(h + pad * 2), k = 1;
    const c = document.createElement("canvas"); c.width = cw * k; c.height = chh * k;
    const g = c.getContext("2d"); g.fillStyle = "#000"; g.fillRect(0, 0, c.width, c.height);   // opaque: coverage lives in the green channel
    g.filter = "blur(" + blur * k + "px)"; g.fillStyle = "#fff";
    g.beginPath();
    if (ellipse) g.ellipse(c.width / 2, c.height / 2, w / 2 * k, h / 2 * k, 0, 0, PI * 2);
    else g.roundRect(pad * k, pad * k, w * k, h * k, r * k);
    g.fill();
    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.MeshBasicMaterial({ color: 0x000000, alphaMap: tex, transparent: true, opacity: 0.5, depthWrite: false, toneMapped: false });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(cw, chh), mat);
    mesh.renderOrder = 1;
    return { mesh, mat };
  };

  // the product: a slim 250 ml can. R = radius px, H = label body height px. Origin at the body's centre.
  S3D.can = function (o) {
    const R = o.R, Hb = o.H, grp = new THREE.Group();
    const labelTex = new THREE.CanvasTexture(o.label); labelTex.colorSpace = THREE.SRGBColorSpace; labelTex.anisotropy = 8;
    const bodyMat = S3D.band(new THREE.MeshPhysicalMaterial({ map: labelTex, metalness: o.metal == null ? 0.45 : o.metal, roughness: 0.24,
      clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.25 }), 0.22);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(R, R, Hb, 160, 1, true, PI, PI * 2), bodyMat);
    const metal = S3D.band(new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0.86, 0.87, 0.9), metalness: 1, roughness: 0.2, envMapIntensity: 1.15 }), 0.3);
    const V = (x, y) => new THREE.Vector2(x * R, y * R);
    const topP = [V(1.0, 0), V(0.995, 0.035), V(0.978, 0.08), V(0.948, 0.13), V(0.912, 0.175), V(0.885, 0.205), V(0.883, 0.228),
      V(0.9, 0.24), V(0.912, 0.258), V(0.905, 0.278), V(0.885, 0.287), V(0.862, 0.276), V(0.855, 0.25), V(0.835, 0.232), V(0.0, 0.232)];
    const top = new THREE.Mesh(new THREE.LatheGeometry(topP, 128), metal); top.position.y = Hb / 2;
    const botP = [V(0.0, -0.045), V(0.55, -0.06), V(0.78, -0.1), V(0.86, -0.112), V(0.935, -0.094), V(0.982, -0.052), V(1.0, 0)];
    const bot = new THREE.Mesh(new THREE.LatheGeometry(botP, 128), metal); bot.position.y = -Hb / 2;
    // pull tab on the lid
    const tabS = rrShape(0.52 * R, 0.3 * R, 0.13 * R);
    const hole = new THREE.Path(); hole.absellipse(0.06 * R, 0, 0.1 * R, 0.07 * R, 0, PI * 2, false); tabS.holes.push(hole);
    const tabG = new THREE.ExtrudeGeometry(tabS, { depth: 0.02 * R, bevelEnabled: true, bevelThickness: 0.008 * R, bevelSize: 0.008 * R, bevelSegments: 2, curveSegments: 12 });
    const tab = new THREE.Mesh(tabG, metal); tab.rotation.x = -PI / 2; tab.position.set(0.12 * R, Hb / 2 + 0.236 * R, 0.0);
    grp.add(body, top, bot, tab);
    return { group: grp, bodyMat, metal, labelTex, R, H: Hb, total: Hb + 0.287 * R + 0.112 * R };
  };

  // label art for the can: our own wordmark, vertical, on sponsor red with a yellow burn band
  S3D.drawLabel = function (cfg, R, Hb) {
    const Wc = 2048, Hc = Math.round(Wc * Hb / (2 * PI * R));
    const c = document.createElement("canvas"); c.width = Wc; c.height = Hc;
    const g = c.getContext("2d"), C = cfg.colors;
    let gr = g.createLinearGradient(0, 0, 0, Hc);
    gr.addColorStop(0, C.canTop); gr.addColorStop(0.5, C.canMid); gr.addColorStop(1, C.canBot);
    g.fillStyle = gr; g.fillRect(0, 0, Wc, Hc);
    const cx = Wc * 0.5;   // u = 0.5 faces the camera at rotation 0
    // yellow burn band: a wide diagonal ribbon behind the word, wrapping round the front
    g.save(); g.translate(cx, Hc * 0.55); g.rotate(-0.42);
    gr = g.createLinearGradient(0, -170, 0, 170); gr.addColorStop(0, "rgba(255,210,60,0)"); gr.addColorStop(0.18, C.accent); gr.addColorStop(0.82, "#F5A812"); gr.addColorStop(1, "rgba(245,168,18,0)");
    g.fillStyle = gr; g.fillRect(-1400, -170, 2800, 340); g.restore();
    // ink band top + bottom with thin gold rules
    g.fillStyle = C.ink; g.fillRect(0, 0, Wc, Hc * 0.1); g.fillRect(0, Hc * 0.9, Wc, Hc * 0.1);
    g.fillStyle = C.accent; g.fillRect(0, Hc * 0.1, Wc, 10); g.fillRect(0, Hc * 0.9 - 10, Wc, 10);
    g.textAlign = "center"; g.textBaseline = "middle";
    g.font = "800 58px Inter"; g.letterSpacing = "26px"; g.fillStyle = "#ffffff";
    g.fillText(cfg.brand.sub, cx + 13, Hc * 0.05);
    g.font = "800 40px Inter"; g.letterSpacing = "14px"; g.fillStyle = "rgba(255,255,255,.85)";
    g.fillText(cfg.canFoot || "ZERO SUGAR · 250 ML", cx + 7, Hc * 0.95);
    // the vertical wordmark, reading bottom to top, fitted to 78% of the label height
    g.save(); g.translate(cx, Hc * 0.5); g.rotate(-PI / 2);
    let fs = 300; g.letterSpacing = "0px";
    const setF = () => { g.font = "900 " + fs + "px Archivo"; try { g.fontStretch = "condensed"; } catch (e) {} };
    setF(); const tw = g.measureText(cfg.brand.name).width; fs = Math.min(330, fs * (Hc * 0.76) / tw); setF();
    g.lineJoin = "round"; g.lineWidth = fs * 0.13; g.strokeStyle = C.ink; g.strokeText(cfg.brand.name, 0, fs * 0.04);
    gr = g.createLinearGradient(0, -fs * 0.4, 0, fs * 0.4); gr.addColorStop(0, "#FFF4B8"); gr.addColorStop(0.45, C.accent); gr.addColorStop(1, "#F59E0B");
    g.fillStyle = gr; g.fillText(cfg.brand.name, 0, fs * 0.04);
    g.restore();
    // back of the can (seen as it turns): a small horizontal wordmark and a barcode panel, kept quiet
    g.save(); g.translate(260, Hc * 0.36); g.font = "900 120px Archivo"; try { g.fontStretch = "condensed"; } catch (e) {}
    g.textAlign = "center"; g.lineWidth = 14; g.strokeStyle = C.ink; g.strokeText(cfg.brand.name.slice(0, 5), 0, 0); g.fillStyle = C.accent; g.fillText(cfg.brand.name.slice(0, 5), 0, 0);
    g.strokeText(cfg.brand.name.slice(5), 0, 118); g.fillText(cfg.brand.name.slice(5), 0, 118); g.restore();
    const bx = Wc - 360, by = Hc * 0.58;
    g.fillStyle = "rgba(255,255,255,.92)"; g.beginPath(); g.roundRect(bx, by, 190, 150, 14); g.fill();
    g.fillStyle = C.ink;
    for (let i = 0, x = bx + 18; x < bx + 172; i++) { const w = [3, 6, 2, 4, 8, 3, 5, 2][i % 8]; g.fillRect(x, by + 16, w, 96); x += w + [3, 2, 4, 3][i % 4]; }
    g.font = "700 18px Inter"; g.textAlign = "center"; g.fillText("0 48127 30019 4", bx + 95, by + 136);
    return c;
  };

  window.S3D = S3D;
})();
