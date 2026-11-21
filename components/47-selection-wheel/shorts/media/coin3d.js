/* Coin3D: the locked station badge as a real lit object (Three.js r160, global THREE).
   A pink-chrome lathe rim (a rounded bead you can see the thickness of), two domed clear-coated faces carrying the station
   art, a key light that sweeps across it at the lock, one clipped specular band, an emissive rim pulse and a soft shadow.
   It takes over from the DOM token at the landing tick, is pressed and springs out with a wobble that shows its edge,
   flies to the NOW PLAYING socket with one full spin, seats with a squash and holds a slight living tilt.
   Seek-safe: nothing animates on its own; renderAt(t) draws the frame for time t (state is a pure function of t). */
(function () {
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, k) => a + (b - a) * k;
  const seg = (t, a, d) => clamp((t - a) / d, 0, 1);

  window.Coin3D = function (o) {
    const W = o.W, H = o.H, R = o.radius, HT = o.thick / 2, T = o.timing, E = (n) => gsap.parseEase(n);

    // ---------- renderer: z = 0 maps 1:1 to page px ----------
    const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
    canvas.style.cssText = "position:absolute;left:0;top:0;width:" + W + "px;height:" + H + "px;display:block;pointer-events:none";
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;
    const scene = new THREE.Scene();
    const FOV = 20, DIST = (H / 2) / Math.tan((FOV / 2) * Math.PI / 180);
    const camera = new THREE.PerspectiveCamera(FOV, W / H, 10, DIST * 3);
    camera.position.set(0, 0, DIST); camera.lookAt(0, 0, 0);
    const px = (x, y) => [x - W / 2, H / 2 - y];

    // ---------- environment: a dark magenta studio with a top softbox, a front strip and a hot back bar ----------
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(1.0,0.9,1.0), hor = vec3(0.10,0.03,0.09), low = vec3(0.015,0.0,0.025);" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.05, 0.8, y)) : mix(hor, low, smoothstep(0.0, 0.45, -y)); gl_FragColor = vec4(c, 1.0); }"
    })));
    const panel = (w, h, x, y, z, c) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); envScene.add(m); };
    panel(36, 10, 0, 30, 22, new THREE.Color(3.2, 3.1, 3.2));     // softbox above-front: the bead's top highlight
    panel(3, 30, -26, 4, 26, new THREE.Color(3.4, 3.2, 3.4));     // tall strip front-left: a vertical glint line on the rim
    panel(40, 4, 0, 22, -26, new THREE.Color(3.6, 3.0, 3.4));     // hot bar behind: lit lip
    panel(22, 22, 30, -8, 18, new THREE.Color(1.6, 0.35, 0.9));   // magenta card right-low: the coloured bounce
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(envScene, 0.0, 0.1, 200).texture;

    // ---------- lights ----------
    const key = new THREE.DirectionalLight(0xffffff, 1.4); scene.add(key); scene.add(key.target);
    const rake = new THREE.DirectionalLight(0xff8fc8, 0.9); rake.position.set(8, -3, 4); scene.add(rake); scene.add(rake.target);
    scene.add(new THREE.HemisphereLight(0xfff0f8, 0x2a0838, 0.45));

    // ---------- materials ----------
    const tex = new THREE.CanvasTexture(o.face);
    tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter;
    const U = { uSpecX: { value: -1e4 }, uSpecW: { value: o.specW || 11 }, uSpecAmp: { value: 0 } };
    function patch(mat, gain) {     // one slanted specular band in object space (115 deg), clipped by the geometry itself
      mat.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, U);
        sh.vertexShader = "varying vec3 vLP;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vLP = position;");
        sh.fragmentShader = "varying vec3 vLP; uniform float uSpecX, uSpecW, uSpecAmp;\n" + sh.fragmentShader.replace("#include <emissivemap_fragment>",
          "#include <emissivemap_fragment>\n { float sd = (vLP.x * 0.906 + vLP.y * 0.423 - uSpecX) / uSpecW; totalEmissiveRadiance += vec3(1.0, 0.97, 0.99) * exp(-sd * sd) * uSpecAmp * " + gain.toFixed(2) + "; }");
      };
      return mat;
    }
    // the art keeps its own colours (mostly emissive), the light only adds sheen and glints on top
    const faceMat = patch(new THREE.MeshPhysicalMaterial({ map: tex, color: 0x4a4a4a, emissiveMap: tex, emissive: 0xffffff, emissiveIntensity: 0.8,
      roughness: 0.55, metalness: 0, clearcoat: 0.45, clearcoatRoughness: 0.08, envMapIntensity: 0.12 }), 1);
    const rimMat = patch(new THREE.MeshPhysicalMaterial({ color: new THREE.Color(o.rimColor || "#FF6FB8"), metalness: 1, roughness: 0.15,
      clearcoat: 0.6, clearcoatRoughness: 0.08, envMapIntensity: 1.7, emissive: new THREE.Color(o.hotColor || "#FF4FA3"), emissiveIntensity: 0, side: THREE.DoubleSide }), 0.7);

    // ---------- geometry ----------
    const coin = new THREE.Group(), spin = new THREE.Group(); coin.add(spin); scene.add(coin);
    // rim: a rounded bead from the face seat up over the lip, round the edge and back
    const FR = R * 0.85, prof = [];
    prof.push(new THREE.Vector2(FR - 0.4, HT * 0.5), new THREE.Vector2(FR + 0.6, HT * 0.78), new THREE.Vector2(FR + 2.0, HT * 0.96));
    for (let i = 0; i <= 20; i++) { const a = Math.PI / 2 - i * Math.PI / 20, c = Math.cos(a); prof.push(new THREE.Vector2(FR + 3.6 + (R - FR - 3.6) * Math.pow(Math.max(c, 0), 0.6), HT * 1.05 * Math.sin(a))); }
    prof.push(new THREE.Vector2(FR + 2.0, -HT * 0.96), new THREE.Vector2(FR + 0.6, -HT * 0.78), new THREE.Vector2(FR - 0.4, -HT * 0.5));
    const rimG = new THREE.LatheGeometry(prof, 160); rimG.rotateX(Math.PI / 2);
    spin.add(new THREE.Mesh(rimG, rimMat));
    // faces: domed discs (2.6 px rise) so the key light's glint rolls across them; the art is mapped at 0.94 so its type clears the lip
    const ART = o.artScale || 0.94;
    function faceGeo(back) {
      const g = new THREE.RingGeometry(0.01, FR, 128, 20), p = g.attributes.position, uv = g.attributes.uv;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), y = p.getY(i), r = Math.hypot(x, y) / FR;
        p.setZ(i, HT * 0.5 + 2.6 * (1 - r * r));
        uv.setXY(i, 0.5 + x / (2 * R * ART), 0.5 + y / (2 * R * ART));   // the back is turned by the spin, so its art reads the right way round
      }
      g.computeVertexNormals();
      if (back) g.rotateY(Math.PI);
      return g;
    }
    spin.add(new THREE.Mesh(faceGeo(false), faceMat));
    spin.add(new THREE.Mesh(faceGeo(true), faceMat));
    // soft shadow card behind the coin (does not spin)
    const sc = document.createElement("canvas"); sc.width = sc.height = 128;
    const sx = sc.getContext("2d"), gr = sx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, "rgba(0,0,0,1)"); gr.addColorStop(0.45, "rgba(0,0,0,.65)"); gr.addColorStop(1, "rgba(0,0,0,0)");
    sx.fillStyle = gr; sx.fillRect(0, 0, 128, 128);
    const shTex = new THREE.CanvasTexture(sc);
    const shMat = new THREE.MeshBasicMaterial({ map: shTex, transparent: true, depthWrite: false, color: 0x12001c, opacity: 0.5 });
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(R * 2.9, R * 2.9), shMat); scene.add(shadow);

    // ---------- state: a pure function of t ----------
    const A = o.from, B = o.to, BADGE = o.badge;
    const eB3 = E("back.out(3)"), eB22 = E("back.out(2.2)"), eP2o = E("power2.out"), eP2io = E("power2.inOut"), eP3io = E("power3.inOut"), eP3i = E("power3.in"), eS = E("sine.inOut");
    function stateAt(t) {
      const S = { vis: false, x: A[0], y: A[1], s: 1, sx: 1, sy: 1, z: 0, rx: 0, ry: 0, rz: 0, key: -0.9, spec: -1, hot: 0, sh: 0.5, shOff: 9 };
      if (t < T.swap || t >= T.out + 0.21) return S;
      S.vis = true;
      // takeover at the landing tick: grows into the highlight with the DOM token's own ease
      S.s = lerp(1, 1.12, eB3(seg(t, T.swap, 0.22)));
      // press: shrinks and sinks back, tipping away from a thumb at its upper left
      if (t >= T.press) {
        const k = eP2o(seg(t, T.press, 0.06));
        S.s = lerp(1.12, 0.92, k); S.z = -26 * k; S.rx = -0.22 * k; S.ry = 0.2 * k;
      }
      // spring: out past rest, then settles; a damped wobble shows the edge
      if (t >= T.spring) {
        const u = t - T.spring, k = eB22(seg(t, T.spring, 0.28));
        S.s = u < 0.28 ? lerp(0.92, 1.14, k) : lerp(1.14, 1.08, eP2io(seg(t, T.spring + 0.28, 0.22)));
        S.z = lerp(-26, 0, eB22(seg(t, T.spring, 0.32)));
        const damp = Math.exp(-u / 0.26);
        S.rx = -0.22 * Math.cos(2 * Math.PI * u / 0.52) * damp;
        S.ry = 0.2 * Math.cos(2 * Math.PI * u / 0.46) * damp + 0.34 * Math.sin(2 * Math.PI * u / 0.46) * damp;
        S.hot = 1.4 * Math.exp(-u / 0.2);
      }
      // the key light sweeps across the coin through the spring: the glint runs over the bead and the domed face
      S.key = lerp(-0.95, 0.85, eP2io(seg(t, T.spring - 0.04, 0.6)));
      const sp = seg(t, T.spring + 0.04, 0.4);
      if (sp > 0 && sp < 1) { S.spec = eP2o(sp); }
      // flight to the socket: an arc with a lift toward camera and one full spin (the thickness reads edge-on twice)
      if (t >= T.fly) {
        const f = seg(t, T.fly, T.flyDur), ex = eP3io(f), ey = eP2io(f), lift = Math.sin(Math.PI * f);
        S.x = lerp(A[0], B[0], ex) + 70 * lift; S.y = lerp(A[1], B[1], ey) - 40 * lift;
        S.s = lerp(1.08, BADGE, eP2io(f)) + 0.2 * lift;
        S.ry += -2 * Math.PI * eP3io(f); S.rx += 0.3 * lift; S.rz = -0.12 * lift;
        S.z = 60 * lift; S.sh = lerp(0.5, 0.26, lift); S.shOff = 9 + 40 * lift;
        S.key = lerp(0.85, 0.25, eP2io(f));
      }
      // seat: squash on contact, spring back, then hold a slight residual tilt that drifts so the glints keep moving
      if (t >= T.land) {
        const u = t - T.land;
        const q = u < 0.05 ? eP2o(u / 0.05) : 1 - eB3(seg(t, T.land + 0.05, 0.3));
        S.sx = 1 + 0.07 * q; S.sy = 1 - 0.09 * q;
        const settle = eP2io(seg(t, T.land, 0.45)), damp = Math.exp(-u / 0.2);
        S.rx = 0.26 * Math.sin(2 * Math.PI * u / 0.36) * damp + 0.12 * settle;
        S.ry = -0.18 * settle + 0.07 * Math.sin(2 * Math.PI * (u - 0.45) / 2.6) * settle;
        S.hot = 0.9 * Math.exp(-u / 0.18);
        S.key = lerp(0.25, -0.35, eS(seg(t, T.land, 2.2)));
      }
      // out: a beat up, then it shrinks away on a quarter turn (cut on its zero frame)
      if (t >= T.out) {
        const k1 = eP2o(seg(t, T.out, 0.07)), k2 = eP3i(seg(t, T.out + 0.07, 0.14));
        S.s = BADGE * (1 + 0.1 * k1) * (1 - k2); S.ry += 1.2 * k2; S.sh *= 1 - k2;
      }
      return S;
    }

    // ---------- draw ----------
    const sx0 = -R * 1.1, sx1 = R * 1.1;
    function renderAt(t) {
      const S = stateAt(t);
      coin.visible = shadow.visible = S.vis;
      if (S.vis) {
        const p = px(S.x, S.y);
        coin.position.set(p[0], p[1], S.z);
        coin.scale.set(S.s * S.sx, S.s * S.sy, S.s);
        spin.rotation.set(S.rx, S.ry, S.rz);
        shadow.position.set(p[0] + S.shOff * 0.35, p[1] - S.shOff, -60 + S.z * 0.5);
        shadow.scale.setScalar(S.s * (1 + S.shOff / 160));
        shMat.opacity = S.sh;
        key.position.set(Math.sin(S.key) * 10, 6, Math.cos(S.key) * 10);
        key.intensity = 1.4 + 2.2 * Math.exp(-Math.pow((t - T.spring - 0.18) / 0.18, 2));
        rimMat.emissiveIntensity = S.hot;
        U.uSpecX.value = S.spec < 0 ? -1e4 : lerp(sx0, sx1, S.spec);
        U.uSpecAmp.value = S.spec < 0 ? 0 : 0.6 * Math.sin(Math.PI * S.spec);
      }
      renderer.render(scene, camera);
      if (o.onState) o.onState(S, t);
    }
    window.addEventListener("hf-seek", (e) => { if (e && e.detail && typeof e.detail.time === "number") renderAt(e.detail.time); });
    return { canvas, renderAt, stateAt };
  };

  // Paint a station mark into a canvas: the SVG art without its text (an SVG image cannot see page fonts),
  // then the text drawn again with canvas type in the loaded page fonts.
  window.Coin3D.paintArt = function (svgString, size) {
    const doc = new DOMParser().parseFromString(svgString, "image/svg+xml"), svg = doc.documentElement;
    const texts = Array.from(svg.querySelectorAll("text"));
    const items = texts.map((n) => {
      const g = (k, d) => n.getAttribute(k) || d;
      let fill = g("fill", "#fff");
      if (/^url\(/.test(fill)) { const id = fill.replace(/^url\(#|\)$/g, ""), st = svg.querySelector("#" + CSS.escape(id) + " stop"); fill = st ? st.getAttribute("stop-color") : "#fff"; }
      let stroke = g("stroke", null);
      if (stroke && /^url\(/.test(stroke)) stroke = "#000";
      const tr = g("transform", ""), sk = /skewX\(([-\d.]+)\)/.exec(tr), tt = /translate\(([-\d.]+)[ ,]+([-\d.]+)\)/.exec(tr);
      return { text: n.textContent, x: +g("x", 0), y: +g("y", 0), anchor: g("text-anchor", "start"), family: g("font-family", "Inter"), weight: g("font-weight", "400"),
        style: g("font-style", "normal"), size: +g("font-size", 16), ls: +g("letter-spacing", 0), fill: g("fill", "#fff") === "none" ? null : fill,
        stroke, sw: +g("stroke-width", 1), skew: sk ? +sk[1] : 0, tx: tt ? +tt[1] : 0, ty: tt ? +tt[2] : 0 };
    });
    texts.forEach((n) => n.remove());
    const src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(svg));
    const img = new Image(); img.src = src;
    return img.decode().then(() => {
      const c = document.createElement("canvas"); c.width = c.height = size;
      const x = c.getContext("2d"), k = size / 148;
      x.drawImage(img, 0, 0, size, size);
      items.forEach((it) => {
        x.save(); x.scale(k, k);
        if (it.skew) x.transform(1, 0, Math.tan(it.skew * Math.PI / 180), 1, 0, 0);
        x.translate(it.tx, it.ty);
        x.font = (it.style === "italic" ? "italic " : "") + it.weight + " " + it.size + "px \"" + it.family + "\"";
        x.letterSpacing = it.ls + "px";
        x.textAlign = it.anchor === "middle" ? "center" : it.anchor === "end" ? "right" : "left";
        x.textBaseline = "alphabetic"; x.lineJoin = "round";
        const ax = it.x;
        if (it.stroke) { x.strokeStyle = it.stroke; x.lineWidth = it.sw; x.strokeText(it.text, ax, it.y); }
        if (it.fill) { x.fillStyle = it.fill; x.fillText(it.text, ax, it.y); }
        x.restore();
      });
      return c;
    });
  };
})();
