/* Split3D: the comparison split's divider as real geometry (Three.js r160, global THREE).
   - The blade: a polished chrome bar with rounded bevels running the full height (A) or width (B) of the frame. Its front
     face carries an accent glow uniform (it ignites in the winner's colour on the lock) and a specular streak that runs
     along it.
   - The puck: a thick coin riding the blade. Ink-enamel faces, polished chrome rim and inlaid ring, extruded white-enamel
     "VS" glyphs (Archivo outlines, media/glyphs.js) on the front, and an extruded accent arrow on the back. On the verdict
     it flips (real thickness, chrome edge) to point the arrow at the winner.
   Seek-safe: nothing animates on its own; render(st) draws the frame for a state computed from timeline time.
   Shared by a/ and b/ (identical file). */
(function () {
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

  window.Split3D = function (o) {
    const W = o.W, H = o.H, VERT = o.orient === "v";
    const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
    canvas.style.cssText = "position:absolute;left:0;top:0;width:" + W + "px;height:" + H + "px;display:block";
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = o.exposure || 1.0;
    const scene = new THREE.Scene();
    const FOV = 18, DIST = (H / 2) / Math.tan((FOV / 2) * Math.PI / 180);
    const camera = new THREE.PerspectiveCamera(FOV, W / H, 10, DIST * 3);
    camera.position.set(0, 0, DIST); camera.lookAt(0, 0, 0);

    // ---------- environment: dark studio with a big top softbox, two tall strip lights and a warm floor bounce ----------
    const env = new THREE.Scene();
    env.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(1.25,1.28,1.34), hor = vec3(0.16,0.17,0.2), low = vec3(0.05,0.04,0.035);" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.05, 0.85, y)) : mix(hor, low, smoothstep(0.0, 0.45, -y)); gl_FragColor = vec4(c, 1.0); }"
    })));
    const panel = (w, h, x, y, z, k, tint) => {
      const c = tint || [1, 1, 1];
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k * c[0], k * c[1], k * c[2]), side: THREE.DoubleSide }));
      m.position.set(x, y, z); m.lookAt(0, 0, 0); env.add(m);
    };
    panel(36, 10, 0, 30, 20, 3.0);                 // top softbox: the face sheen
    panel(2.4, 40, -30, 4, 22, 7.0);               // tall strip left-front: a crisp line down the left bevel
    panel(2.4, 40, 30, 4, 22, 4.6, [1, 0.97, 0.94]); // tall strip right-front
    panel(40, 2.4, 0, 12, 40, 3.6);                // thin strip in front, high: a line along top bevels
    panel(44, 8, 0, -24, 18, 0.55, [1, 0.8, 0.6]);   // warm floor bounce
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(env, 0.0, 0.1, 200).texture;

    const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(-0.55, 0.8, 1.0); scene.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 0.6); rim.position.set(0.7, -0.2, 0.5); scene.add(rim);
    scene.add(new THREE.HemisphereLight(0xf2f5ff, 0x1a1410, 0.45));

    const C = o.colors;
    const col = (hex) => new THREE.Color(hex);

    // ---------- shader patch: accent glow, a specular streak along local y, and a diagonal sheen across local x ----------
    const U = {
      uGlow: { value: 0 }, uGlowC: { value: col(C.accent) },
      uStreak: { value: -1e5 }, uStreakW: { value: 70 }, uStreakAmp: { value: 0 },
      uSheen: { value: -1e5 }, uSheenW: { value: o.sheenW || 26 }, uSheenAmp: { value: 0 }
    };
    function patch(mat, opt) {
      mat.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, U);
        sh.vertexShader = "varying vec3 vLP;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vLP = position;");
        sh.fragmentShader = "varying vec3 vLP; uniform float uGlow, uStreak, uStreakW, uStreakAmp, uSheen, uSheenW, uSheenAmp; uniform vec3 uGlowC;\n" +
          sh.fragmentShader.replace("#include <color_fragment>", "#include <color_fragment>\n" +
            (opt.grad ? " diffuseColor.rgb *= mix(" + opt.grad[0].toFixed(3) + ", " + opt.grad[1].toFixed(3) + ", smoothstep(" + (-opt.grad[2]).toFixed(1) + ", " + opt.grad[2].toFixed(1) + ", vLP.y));\n" : "") +
            (opt.radial ? " diffuseColor.rgb = mix(vec3(" + opt.radial[0] + "), vec3(" + opt.radial[1] + "), smoothstep(0.0, " + opt.radial[2].toFixed(1) + ", length(vLP.xy - vec2(" + (-0.22 * opt.radial[2]).toFixed(1) + ", " + (0.3 * opt.radial[2]).toFixed(1) + "))));\n" : ""))
          .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n {\n" +
            (opt.glow ? "  totalEmissiveRadiance += uGlowC * uGlow * " + opt.glow.toFixed(3) + ";\n" : "") +
            (opt.streak ? "  float sd = (vLP.y - uStreak) / uStreakW; totalEmissiveRadiance += vec3(1.0, 0.97, 0.94) * exp(-sd * sd) * uStreakAmp * " + opt.streak.toFixed(3) + ";\n" : "") +
            (opt.sheen ? "  float hd = abs(vLP.x * 0.8 + vLP.y * 0.6 - uSheen) / uSheenW; totalEmissiveRadiance += vec3(1.0, 0.98, 0.95) * (1.0 - smoothstep(0.55, 1.0, hd)) * uSheenAmp * " + opt.sheen.toFixed(3) + ";\n" : "") +
            " }");
      };
      const keyStr = "split3d:" + JSON.stringify(opt);
      mat.customProgramCacheKey = () => keyStr;   // each patch variant compiles its own program (the default key is the shared function source)
      return mat;
    }
    const chrome = () => new THREE.MeshPhysicalMaterial({ color: col(C.chrome), metalness: 1.0, roughness: 0.16, clearcoat: 1.0, clearcoatRoughness: 0.05, envMapIntensity: 1.35 });
    const gradL = (VERT ? H : W) / 2;
    const bladeFace = patch(new THREE.MeshPhysicalMaterial({ color: col(C.chrome), metalness: 1.0, roughness: 0.22, clearcoat: 1.0, clearcoatRoughness: 0.05, envMapIntensity: 1.2 }),
      { glow: 1.0, streak: 1.0, grad: VERT ? [0.42, 1.05, gradL] : [0.8, 0.8, 1] });
    const bladeSide = patch(chrome(), { glow: 0.35, streak: 0.8, grad: VERT ? [0.7, 1.1, gradL] : [1, 1, 1] });
    const lin3 = (hex) => { const c = col(hex); return c.r.toFixed(4) + "," + c.g.toFixed(4) + "," + c.b.toFixed(4); };
    const inkFace = patch(new THREE.MeshPhysicalMaterial({ color: col(C.ink), metalness: 0.25, roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.04, envMapIntensity: 0.6 }),
      C.inkHi ? { sheen: 0.3, radial: [lin3(C.inkHi), lin3(C.ink), o.puck.r * 1.05] } : { sheen: 0.35 });
    const puckRim = patch(chrome(), { sheen: 0.5 });
    const letterFace = patch(new THREE.MeshPhysicalMaterial({ color: col(C.letter), metalness: 0.0, roughness: 0.3, clearcoat: 0.9, clearcoatRoughness: 0.08,
      emissive: col(C.letter), emissiveIntensity: 0.32, envMapIntensity: 0.7 }), { sheen: 1.0 });
    const letterSide = patch(chrome(), { sheen: 0.6 });
    const arrowFace = patch(new THREE.MeshPhysicalMaterial({ color: col(C.accent), metalness: 0.1, roughness: 0.3, clearcoat: 1.0, clearcoatRoughness: 0.06,
      emissive: col(C.accent), emissiveIntensity: 0.55, envMapIntensity: 0.8 }), { sheen: 1.0 });
    const arrowSide = patch(new THREE.MeshPhysicalMaterial({ color: col(C.accentDeep), metalness: 0.9, roughness: 0.25, clearcoat: 1.0, envMapIntensity: 1.1 }), { sheen: 0.5 });

    // ---------- the blade (built vertical: local y is the long axis) ----------
    const BW = o.blade.w, BT = o.blade.t, BB = o.blade.bevel, BL = (VERT ? H : W) + 400;
    const bShape = new THREE.Shape();
    { const w = BW / 2 - BB, h = BL / 2; bShape.moveTo(-w, -h); bShape.lineTo(w, -h); bShape.lineTo(w, h); bShape.lineTo(-w, h); bShape.lineTo(-w, -h); }
    const bGeo = new THREE.ExtrudeGeometry(bShape, { depth: BT - 2 * BB, bevelEnabled: true, bevelThickness: BB, bevelSize: BB, bevelSegments: 6, curveSegments: 1 });
    bGeo.translate(0, 0, -(BT - 2 * BB) / 2); bGeo.computeVertexNormals();
    const blade = new THREE.Mesh(bGeo, [bladeFace, bladeSide]);
    if (!VERT) blade.rotation.z = -Math.PI / 2;     // local +y -> world +x
    scene.add(blade);

    // ---------- the puck ----------
    const R = o.puck.r, PT = o.puck.t, PB = o.puck.bevel, ZP = o.puck.z;
    const puck = new THREE.Group(); scene.add(puck);
    const spinner = new THREE.Group(); puck.add(spinner);
    const disc = new THREE.Shape(); disc.absarc(0, 0, R - PB, 0, Math.PI * 2, false);
    const dGeo = new THREE.ExtrudeGeometry(disc, { depth: PT - 2 * PB, bevelEnabled: true, bevelThickness: PB, bevelSize: PB, bevelSegments: 6, curveSegments: 96 });
    dGeo.translate(0, 0, -(PT - 2 * PB) / 2); dGeo.computeVertexNormals();
    spinner.add(new THREE.Mesh(dGeo, [inkFace, puckRim]));
    const front = PT / 2, ringR = R * 0.82, ringT = R * 0.04;
    [1, -1].forEach((sgn) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(ringR, ringT, 16, 128), puckRim);
      ring.position.z = sgn * (front - ringT * 0.35); spinner.add(ring);
    });

    // glyph outlines -> shapes (font units, y down) centred on the puck
    const F = o.glyphs, LD = o.puck.letterDepth, LB = o.puck.letterBevel;
    function shapesFromPath(d, map) {
      const sp = new THREE.ShapePath(), re = /([MLQCZ])([^MLQCZ]*)/g; let m;
      while ((m = re.exec(d))) {
        const n = m[2].trim() ? m[2].trim().split(/[\s,]+/).map(Number) : [], P = [];
        for (let i = 0; i < n.length; i += 2) { const q = map(n[i], n[i + 1]); P.push(q[0], q[1]); }
        if (m[1] === "M") sp.moveTo(P[0], P[1]); else if (m[1] === "L") sp.lineTo(P[0], P[1]);
        else if (m[1] === "Q") sp.quadraticCurveTo(P[0], P[1], P[2], P[3]); else if (m[1] === "C") sp.bezierCurveTo(P[0], P[1], P[2], P[3], P[4], P[5]);
      }
      return sp.toShapes(false).map((sh) => {
        const s2 = new THREE.Shape(sh.getPoints(10)); sh.holes.forEach((h) => s2.holes.push(new THREE.Path(h.getPoints(10)))); return s2;
      });
    }
    const text = o.puck.text, pens = []; let pen = 0;
    for (let i = 0; i < text.length; i++) { const g = F.g[text[i]]; pens.push({ x: pen, g }); pen += g[0] + (i < text.length - 1 ? ((F.k && F.k[text[i] + text[i + 1]]) || 0) + (o.puck.tracking || 0) * F.upm : 0); }
    const inkL = pens[0].x + pens[0].g[2], inkR = pens[pens.length - 1].x + pens[pens.length - 1].g[3];
    const ls = (o.puck.inkW) / (inkR - inkL), capPx = F.cap * ls, ox = -((inkL + inkR) / 2) * ls, oy = o.puck.letterDy || 0;
    const letters = new THREE.Group(); spinner.add(letters);
    pens.forEach((p) => {
      const geo = new THREE.ExtrudeGeometry(shapesFromPath(p.g[1], (x, y) => [ox + (p.x + x) * ls, -y * ls - capPx / 2 + oy]),
        { depth: LD, bevelEnabled: true, bevelThickness: LB, bevelSize: LB * 0.7, bevelOffset: -LB * 0.7, bevelSegments: 4, curveSegments: 1 });
      geo.computeVertexNormals();
      letters.add(new THREE.Mesh(geo, [letterFace, letterSide]));
    });
    letters.position.z = front - LB * 0.6;

    // the back: an extruded arrow pointing at the winner (+x in its own frame), turned to face -z
    const A = o.puck.arrow, aS = new THREE.Shape();
    { const L0 = -A.len * 0.5, hx = A.len * 0.5 - A.head, sh = A.shaft / 2, hh = A.headH / 2;
      aS.moveTo(L0, -sh); aS.lineTo(hx, -sh); aS.lineTo(hx, -hh); aS.lineTo(A.len * 0.5, 0); aS.lineTo(hx, hh); aS.lineTo(hx, sh); aS.lineTo(L0, sh); aS.lineTo(L0, -sh); }
    const aGeo = new THREE.ExtrudeGeometry(aS, { depth: LD, bevelEnabled: true, bevelThickness: LB, bevelSize: LB * 0.8, bevelOffset: -LB * 0.8, bevelSegments: 4, curveSegments: 1 });
    aGeo.translate(A.dx || 0, 0, 0); aGeo.computeVertexNormals();
    const arrowHold = new THREE.Group(); spinner.add(arrowHold);
    const arrow = new THREE.Mesh(aGeo, [arrowFace, arrowSide]); arrowHold.add(arrow);
    arrow.position.z = front - LB * 0.6;
    if (VERT) { arrowHold.rotation.y = Math.PI; }               // A flips about Y: after the flip the arrow points +x (right)
    else { arrow.rotation.z = Math.PI / 2; arrowHold.rotation.x = Math.PI; }  // B flips about X: after the flip it points +y (up)

    const kP = DIST / (DIST - ZP);   // the puck sits forward of the blade: place it so it projects exactly onto the seam

    // ---------- render one frame ----------
    // st: { d: seam position px, along: puck position along the seam px, spin: rad, flip: 0..1(+overshoot),
    //       scale, glow, streak: 0..1 (-1 = off), streakAmp, sheen: 0..1 (-1 = off), sheenAmp }
    function render(st) {
      if (VERT) {
        blade.position.set(st.d - W / 2, 0, 0);
        puck.position.set((st.d - W / 2) / kP, (H / 2 - st.along) / kP, ZP);
        spinner.rotation.set(0, st.spin + Math.PI * st.flip, 0);
      } else {
        blade.position.set(0, H / 2 - st.d, 0);
        puck.position.set((st.along - W / 2) / kP, (H / 2 - st.d) / kP, ZP);
        spinner.rotation.set(-(st.spin + Math.PI * st.flip), 0, 0);
      }
      puck.scale.setScalar(st.scale || 1);
      U.uGlow.value = st.glow || 0;
      const ext = (VERT ? H : W) / 2 + 120;
      U.uStreak.value = st.streak < 0 ? -1e5 : (VERT ? ext - st.streak * ext * 2 : -ext + st.streak * ext * 2);
      U.uStreakAmp.value = st.streakAmp || 0;
      U.uSheen.value = st.sheen < 0 ? -1e5 : (-1.3 * R + st.sheen * 2.6 * R);
      U.uSheenAmp.value = st.sheenAmp || 0;
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);
    }
    return { canvas, render, R, kP };
  };
})();
