/* Slab3D (B, r06): the frozen frame printed on a real photo slab (Three.js r160, global THREE).
   A rounded slab (o.size px, o.depth deep) with a rounded gold bevel lip and polished gold sides; the face is the photo under a
   clearcoat. The photo is mapped from the landscape (-h) frame in slab pixels, so it is never stretched: slab px p (from the face's
   top-left) shows -h px  h = F + (p - FL) / s,  where F is his face in the -h frame and FL is where it sits on the slab; s is the
   print scale (the push raises it towards 1.0, so the face is never upscaled at rest). The freeze look (steel world, Franklin in
   warm colour) spreads from his face as a hard wave front (uWave, -h px); on the release a second wave (uWave2) floods the colour back and the print plays on (tVid, the live -h clip).
   A soft rake band (uSpecX/uSpecAmp) crosses the face on the payoff while the key light swings over the gold bevel.
   Post: optional motion blur (N sub-frame poses averaged in a float target) and a premultiplied sRGB composite.
   r08 (pop-out): Franklin's cutout (o.imgSub, the -h matte) is a second plane on the slab, mapped exactly like the print, so
   inside the slab it is invisible, and it runs on above the top rim: as the camera pulls back his head breaks out of the
   frozen frame over the gold lip. His soft contact shadow (o.imgShadow) lands on the print and the lip only (uPop). The print's
   mapping FL and scale s come from the pose, so the freeze pose is the full Short framing and the rest pose crops under his head.
   Seek-safe: renderAt(t) poses everything from o.poseAt(t); nothing else animates. */
(function () {
  const srgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.substr(i, 2), 16) / 255);
  const toLin = (x) => (x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
  const lin = (hex) => { const a = srgb(hex).map(toLin); return new THREE.Color(a[0], a[1], a[2]); };
  const v3 = (c) => "vec3(" + c.r.toFixed(4) + "," + c.g.toFixed(4) + "," + c.b.toFixed(4) + ")";

  window.Slab3D = function (o) {
    const W = o.W, H = o.H, SW = o.size[0], SH = o.size[1], R = o.radius, D = o.depth, BV = o.bevel;

    // ---------- renderer + camera: 1 world unit = 1 canvas px on the z = 0 plane ----------
    const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
    canvas.style.cssText = "position:absolute;left:0;top:0;width:" + W + "px;height:" + H + "px;display:block";
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;
    const scene = new THREE.Scene();
    const FOV = o.fov || 20, DIST = (H / 2) / Math.tan((FOV / 2) * Math.PI / 180);
    const camera = new THREE.PerspectiveCamera(FOV, W / H, 10, DIST * 4);
    camera.position.set(0, 0, DIST); camera.lookAt(0, 0, 0);

    // ---------- environment: warm studio overhead (the gold lip bands like chrome), dark towards the camera (no veil on the photo) ----------
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(1.7,1.42,0.98), hor = vec3(0.30,0.19,0.07), low = vec3(0.02,0.015,0.01);" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.05, 0.7, y)) : mix(hor * 0.5, low, smoothstep(0.0, 0.3, -y));" +
        " c *= mix(1.0, 0.18, smoothstep(0.55, 0.95, vP.z) * (1.0 - smoothstep(0.25, 0.6, y))); gl_FragColor = vec4(c, 1.0); }"
    })));
    const panel = (w, h, x, y, z, k) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k * 0.88, k * 0.66), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); envScene.add(m); };
    panel(40, 10, 0, 32, 18, 2.6);       // overhead softbox
    panel(4, 36, 34, 6, 20, 2.2);        // right strip (the key side)
    panel(30, 2.4, -6, 18, -36, 3.0);    // a hot back strip for the far rim
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(envScene, 0.0, 0.1, 200).texture;
    const key = new THREE.DirectionalLight(0xfff0d2, 2.2); scene.add(key); scene.add(key.target);
    const hemi = new THREE.HemisphereLight(0xfff2dc, 0x120a03, 0.45); scene.add(hemi);

    // ---------- textures: the colour frame and the frozen look (both 1920x1080, already decoded <img>) ----------
    // (drawn into a 2D canvas first: an <img> handed straight to THREE.Texture sampled black in this renderer)
    const tex = (img) => { const c = document.createElement("canvas"); c.width = img.naturalWidth || 1920; c.height = img.naturalHeight || 1080;
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
      t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter; t.generateMipmaps = true; t.needsUpdate = true; return t; };
    const U = {
      tCol: { value: tex(o.imgCol) }, tFrz: { value: tex(o.imgFrz) },
      uF: { value: new THREE.Vector2(o.F[0], o.F[1]) }, uFL: { value: new THREE.Vector2(o.FL[0], o.FL[1]) }, uS: { value: 1 },
      uSize: { value: new THREE.Vector2(SW, SH) }, uWave: { value: 0 }, uWave2: { value: 0 }, uVid: { value: 0 }, tVid: { value: null },
      uSpecX: { value: -1e5 }, uSpecW: { value: 140 }, uSpecAmp: { value: 0 }, uGlint: { value: 0 }, uEdge: { value: 0 },
      tSub: { value: o.imgSub ? tex(o.imgSub) : null }, tSh: { value: o.imgShadow ? tex(o.imgShadow) : null },
      uPop: { value: 0 }, uCut: { value: 0 }, uShOff: { value: new THREE.Vector2((o.popShadow || [6, 10])[0], (o.popShadow || [6, 10])[1]) }
    };
    const vidC = document.createElement("canvas"); vidC.width = 1920; vidC.height = 1080;
    const vidX = vidC.getContext("2d"), vidT = new THREE.CanvasTexture(vidC);
    vidT.colorSpace = THREE.SRGBColorSpace; vidT.minFilter = THREE.LinearFilter; vidT.magFilter = THREE.LinearFilter; vidT.generateMipmaps = false;
    U.tVid.value = vidT;
    function pullVideo(on) {
      U.uVid.value = 0;
      if (!on || !o.videoSource) return;
      const src = o.videoSource(); if (!src) return;
      try { vidX.drawImage(src, 0, 0, 1920, 1080); vidT.needsUpdate = true; U.uVid.value = 1; } catch (e) {}
    }
    const gLip = lin(o.colors.lip), gSide = lin(o.colors.side), gDeep = lin(o.colors.deep);
    const faceMat = new THREE.MeshPhysicalMaterial({ color: 0x000000, roughness: 0.5, metalness: 0, specularIntensity: 0.25,
      clearcoat: 1.0, clearcoatRoughness: 0.07, envMapIntensity: 0.6 });
    faceMat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, U);
      sh.vertexShader = "varying vec3 vLP;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vLP = position;");
      sh.fragmentShader = "varying vec3 vLP; uniform sampler2D tCol, tFrz, tVid; uniform vec2 uF, uFL, uSize; uniform float uS, uWave, uWave2, uVid, uSpecX, uSpecW, uSpecAmp, uEdge;\n" +
        sh.fragmentShader.replace("#include <emissivemap_fragment>", [
          "#include <emissivemap_fragment>",
          "{",
          "  vec2 p = vec2(vLP.x + uSize.x * 0.5, uSize.y * 0.5 - vLP.y);",
          "  vec2 h = uF + (p - uFL) / uS;",
          "  vec2 uv = clamp(vec2(h.x / 1920.0, 1.0 - h.y / 1080.0), vec2(0.0004), vec2(0.9996));",
          "  vec3 c0 = texture2D(tCol, uv).rgb, c1 = texture2D(tFrz, uv).rgb;",
          "  float dF = length(h - uF), k = 1.0 - smoothstep(uWave - 3.0, uWave + 3.0, dF);",
          // the release: the colour floods back from his face as a second wave front, and the print plays on (tVid)
          "  float k2 = 1.0 - smoothstep(uWave2 - 3.0, uWave2 + 3.0, dF);",
          "  vec3 live = uVid > 0.5 ? texture2D(tVid, uv).rgb : c0;",
          "  vec3 col = mix(mix(c0, c1, k), live, k2);",
          // the lip's inner shadow on the print (it sits a hair under the gold, under the clearcoat)
          "  vec2 q = abs(vLP.xy) - (uSize * 0.5 - vec2(" + (BV + R - BV * 0.6).toFixed(2) + "));",
          "  float dE = -(length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - " + (R - BV * 0.6).toFixed(2) + ");",
          "  col *= mix(1.0 - 0.58 * uEdge, 1.0, smoothstep(0.0, 9.0, dE));",
          "  float sd = (p.x + p.y * 0.55 - uSpecX) / uSpecW; float sb = exp(-sd * sd);",
          "  col += vec3(1.0, 0.93, 0.78) * sb * uSpecAmp;",
          "  totalEmissiveRadiance = vLP.z > -1.0 ? col : vec3(0.0);",
          "}"].join("\n"));
    };
    const edgeMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.2, clearcoat: 0.6, clearcoatRoughness: 0.08, envMapIntensity: 1.25 });
    edgeMat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, U);
      sh.vertexShader = "varying vec3 vLP;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vLP = position;");
      sh.fragmentShader = "varying vec3 vLP; uniform float uGlint;\n" + sh.fragmentShader
        .replace("#include <color_fragment>", "#include <color_fragment>\n { float dz = clamp((-vLP.z - " + (BV * 0.6).toFixed(2) + ") / " + (D + BV).toFixed(2) + ", 0.0, 1.0);" +
          " diffuseColor.rgb = mix(mix(" + v3(gLip) + ", " + v3(gSide) + ", smoothstep(0.0, 0.25, dz)), " + v3(gDeep) + ", smoothstep(0.35, 1.0, dz)); }")
        .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n totalEmissiveRadiance += " + v3(gLip) + " * 0.05 * (1.0 + 3.0 * uGlint) * (1.0 - smoothstep(0.0, " + (BV * 1.6).toFixed(2) + ", -vLP.z));");
    };

    // ---------- geometry: a rounded slab, front face on z = 0, rounded gold bevel lip ----------
    const rr = (w, h, r) => { const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
      s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r);
      s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
      s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; };
    const geo = new THREE.ExtrudeGeometry(rr(SW, SH, R), { depth: D, bevelEnabled: true, bevelThickness: BV, bevelSize: BV, bevelOffset: -BV, bevelSegments: 6, curveSegments: 12, steps: 1 });
    geo.translate(0, 0, -(D + BV));
    geo.computeVertexNormals();
    const slab = new THREE.Mesh(geo, [faceMat, edgeMat]);
    const group = new THREE.Group(); group.add(slab); scene.add(group);

    // ---------- r08 pop-out: Franklin's cutout on the print, running on above the top rim; his contact shadow on print + lip ----------
    const popVS = "varying vec3 vLP; void main(){ vLP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }";
    const popHead = "varying vec3 vLP; uniform sampler2D tCol, tSub, tSh, tVid; uniform vec2 uF, uFL, uSize, uShOff; uniform float uS, uWave, uWave2, uVid, uPop, uCut;\n" +
      "vec2 slabP(){ return vec2(vLP.x + uSize.x * 0.5, uSize.y * 0.5 - vLP.y); }\n" +
      "vec2 toUV(vec2 h){ return vec2(h.x / 1920.0, 1.0 - h.y / 1080.0); }\n";
    const passes = [];   // r09: drawn in explicit passes after the slab (slab -> contact shadow -> cutout); renderOrder alone let the print cover him
    if (U.tSub.value) {
      const POP = o.popRoom || 260, x0 = -SW / 2 + BV, x1 = SW / 2 - BV, y0 = -SH / 2 + BV, y1 = SH / 2 + POP;
      const cg = new THREE.PlaneGeometry(x1 - x0, y1 - y0); cg.translate((x0 + x1) / 2, (y0 + y1) / 2, 0.2);
      const cutMat = new THREE.ShaderMaterial({ uniforms: U, vertexShader: popVS, transparent: true, depthTest: false, depthWrite: false, toneMapped: false,
        fragmentShader: popHead + [
          "void main(){",
          "  vec2 p = slabP(); vec2 h = uF + (p - uFL) / uS;",
          "  if (h.y < 0.5 || h.x < 0.5 || h.x > 1919.5 || h.y > 1079.5) discard;",
          "  vec2 uv = toUV(h); vec4 sb = texture2D(tSub, uv);",
          "  float a = sb.a * uCut; if (a < 0.002) discard;",
          "  vec3 c0 = texture2D(tCol, uv).rgb;",
          "  float dF = length(h - uF), k = 1.0 - smoothstep(uWave - 3.0, uWave + 3.0, dF), k2 = 1.0 - smoothstep(uWave2 - 3.0, uWave2 + 3.0, dF);",
          "  vec3 live = uVid > 0.5 ? texture2D(tVid, uv).rgb : c0;",
          "  gl_FragColor = vec4(mix(mix(c0, sb.rgb, k), live, k2), a);",
          "}"].join("\n") });
      const cut = new THREE.Mesh(cg, cutMat); cut.renderOrder = 3; cut.frustumCulled = false; group.add(cut); passes[1] = cut;
      if (U.tSh.value) {
        const sg = new THREE.PlaneGeometry(SW, SH); sg.translate(0, 0, 0.1);
        const shPopMat = new THREE.ShaderMaterial({ uniforms: U, vertexShader: popVS, transparent: true, depthTest: false, depthWrite: false, toneMapped: false,
          fragmentShader: popHead + [
            "void main(){",
            "  vec2 q = abs(vLP.xy) - (uSize * 0.5 - vec2(" + R.toFixed(2) + "));",
            "  float sd = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - " + R.toFixed(2) + ";",
            "  if (sd > 0.0) discard;",
            "  vec2 p = slabP(); vec2 h = uF + (p - uFL - uShOff) / uS;",
            "  float a = texture2D(tSh, clamp(toUV(h), vec2(0.0005), vec2(0.9995))).a * 1.1 * uPop * smoothstep(0.0, 1.5, -sd);",
            "  if (a < 0.002) discard;",
            "  gl_FragColor = vec4(0.0, 0.0, 0.0, a);",
            "}"].join("\n") });
        const shp = new THREE.Mesh(sg, shPopMat); shp.renderOrder = 2; shp.frustumCulled = false; group.add(shp); passes[0] = shp;
      }
    }

    // soft shadow cast onto the stage behind (darkening only), part of the slab's group so it follows every pose
    const SHP = 300, shC = document.createElement("canvas"); shC.width = 512; shC.height = Math.round(512 * (SH + 2 * SHP) / (SW + 2 * SHP));
    { const x = shC.getContext("2d"), k = 512 / (SW + 2 * SHP); x.filter = "blur(" + Math.round(56 * k) + "px)"; x.fillStyle = "#000";
      x.beginPath(); x.roundRect(SHP * k, SHP * k, SW * k, SH * k, R * k); x.fill(); }
    const shTex = new THREE.CanvasTexture(shC);
    const shMat = new THREE.MeshBasicMaterial({ color: 0x000000, alphaMap: shTex, transparent: true, depthWrite: false, opacity: 0 });
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(SW + 2 * SHP, SH + 2 * SHP), shMat);
    shadow.position.set(o.shadowOff[0], -o.shadowOff[1], -(D + 2 * BV) - o.shadowOff[2]); shadow.renderOrder = -1; group.add(shadow);

    // ---------- post: MSAA float target, optional sub-frame accumulation, premultiplied sRGB out ----------
    const HF = renderer.capabilities.isWebGL2 && renderer.extensions.has("EXT_color_buffer_float");
    const TYPE = HF ? THREE.HalfFloatType : THREE.UnsignedByteType;
    const rtMain = new THREE.WebGLRenderTarget(W, H, { type: TYPE, samples: renderer.capabilities.isWebGL2 ? 4 : 0 });
    const rtAcc = new THREE.WebGLRenderTarget(W, H, { type: TYPE, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false });
    const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), postScene = new THREE.Scene();
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2)); quad.frustumCulled = false; postScene.add(quad);
    const VS = "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }";
    const accMat = new THREE.ShaderMaterial({ uniforms: { tSrc: { value: null }, uW: { value: 1 } }, vertexShader: VS,
      fragmentShader: "uniform sampler2D tSrc; uniform float uW; varying vec2 vUv; void main(){ gl_FragColor = texture2D(tSrc, vUv) * uW; }",
      depthTest: false, depthWrite: false, toneMapped: false, transparent: true, blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor,
      blendEquationAlpha: THREE.AddEquation, blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneFactor });
    const outMat = new THREE.ShaderMaterial({ uniforms: { tSrc: { value: null } }, vertexShader: VS, depthTest: false, depthWrite: false, toneMapped: false, blending: THREE.NoBlending,
      fragmentShader: [
        "uniform sampler2D tSrc; varying vec2 vUv;",
        "vec3 shoulder(vec3 x){ return mix(x, 0.85 + 0.15 * (1.0 - exp(-max(x - 0.85, 0.0) / 0.15)), step(0.85, x)); }",
        "vec3 toSRGB(vec3 c){ c = clamp(c, 0.0, 1.0); return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }",
        "void main(){ vec4 m = texture2D(tSrc, vUv); float a = clamp(m.a, 0.0, 1.0); vec3 c = a > 0.0 ? toSRGB(shoulder(m.rgb / m.a)) : vec3(0.0); gl_FragColor = vec4(c * a, a); }"].join("\n") });
    function pass(mat, target) { quad.material = mat; renderer.setRenderTarget(target); renderer.render(postScene, postCam); }

    function apply(P) {
      group.position.set(P.cx - W / 2, H / 2 - P.cy, P.z || 0);
      group.rotation.set(P.rx, P.ry, P.rz);
      group.scale.set(P.sig, P.sig, 1);
      U.uS.value = P.s; U.uWave.value = P.wave; U.uWave2.value = P.wave2 || 0;
      if (P.FL) U.uFL.value.set(P.FL[0], P.FL[1]);
      U.uPop.value = P.pop || 0; U.uCut.value = P.cut || 0;
      U.uSpecX.value = P.specX; U.uSpecAmp.value = P.specAmp; U.uGlint.value = P.glint || 0; U.uEdge.value = P.edge == null ? 1 : P.edge;
      const ka = P.keyA; key.position.set(Math.sin(ka) * 10, 9, 7 - 6 * Math.abs(Math.cos(ka))); key.intensity = P.keyI;
      shMat.opacity = P.shadow;
    }
    const NS = (o.blur && o.blur.samples) || 1, SHUT = ((o.blur && o.blur.shutter) || 0.5) / 30;
    // one frame into rtMain: the slab (and its cast shadow), then each pop-out layer on top, in order
    function draw() {
      const extra = passes.filter(Boolean);
      extra.forEach((m) => { m.visible = false; });
      renderer.setRenderTarget(rtMain); renderer.clear(); renderer.render(scene, camera);
      if (!extra.length) return;
      const ac = renderer.autoClear, bg = [];
      renderer.autoClear = false;
      group.children.forEach((c) => { bg.push(c.visible); c.visible = false; });
      extra.forEach((m) => { m.visible = true; renderer.render(scene, camera); m.visible = false; });
      group.children.forEach((c, i) => { c.visible = bg[i]; });
      extra.forEach((m) => { m.visible = true; });
      renderer.autoClear = ac;
    }
    function renderAt(t) {
      const P = o.poseAt(t);
      canvas.style.visibility = P.on ? "visible" : "hidden";
      if (!P.on) return;
      pullVideo(P.vid);
      let main = rtMain;
      if (NS > 1 && o.moving && o.moving(t)) {
        renderer.setRenderTarget(rtAcc); renderer.setClearColor(0x000000, 0); renderer.clear();
        const ac = renderer.autoClear;
        for (let j = 0; j < NS; j++) {
          apply(o.poseAt(t - SHUT * j / (NS - 1)));
          draw();
          accMat.uniforms.tSrc.value = rtMain.texture; accMat.uniforms.uW.value = 1 / NS; quad.material = accMat;
          renderer.autoClear = false; renderer.setRenderTarget(rtAcc); renderer.render(postScene, postCam); renderer.autoClear = ac;
        }
        main = rtAcc;
      } else {
        apply(P);
        draw();
      }
      outMat.uniforms.tSrc.value = main.texture; pass(outMat, null);
    }
    window.addEventListener("hf-seek", (e) => { if (e && e.detail && typeof e.detail.time === "number") renderAt(e.detail.time); });
    return { canvas, renderAt, DIST };
  };
})();
