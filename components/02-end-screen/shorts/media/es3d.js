/* ES3D: the physical layer of the end screen (Three.js r160, global THREE). Identical file in a/media and b/media.
   One perspective camera whose projection matches CSS perspective exactly (1 world unit = 1 px on the z=0 plane, principal
   point at the canvas centre), so DOM screens (framework-owned <video>s, the avatar) can sit under the WebGL bezels and follow
   them through 3D moves with a matching CSS transform. Everything here is real geometry:
     - frame():  a rounded-rect bezel with a hole (ExtrudeGeometry + rounded bevel) that the DOM screen shows through;
     - ring():   an annulus bezel for the subscribe slot;
     - title():  extruded, bevelled, sheared (italic) letters traced from Archivo's own outlines (media/glyphs.js).
   Lighting: PMREM studio environment (softboxes, so chrome bands read at phone size), a key + hemisphere fill, and a
   decay-free "rake" point light that the payoff sweeps across the bevels. ACES, sRGB.
   Seek-safe: nothing animates on its own. The caller poses nodes and calls render() from timeline time. */
(function () {
  window.ES3D = function (o) {
    const W = o.W, H = o.H;
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H; canvas.id = o.id || "gl";
    canvas.style.cssText = "position:absolute;left:0;top:0;width:" + W + "px;height:" + H + "px;display:block;pointer-events:none";
    o.host.appendChild(canvas);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = o.exposure || 1.0;
    const scene = new THREE.Scene();
    const FOV = o.fov || 20, DIST = (H / 2) / Math.tan((FOV / 2) * Math.PI / 180);
    const camera = new THREE.PerspectiveCamera(FOV, W / H, 40, DIST * 4);
    camera.position.set(0, 0, DIST); camera.lookAt(0, 0, 0);

    // ---------- environment: a dark studio with hard softboxes (chrome needs contrast to read as chrome) ----------
    const envScene = new THREE.Scene();
    const tint = o.envTint || [1, 1, 1];
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(0.55,0.57,0.62), hor = vec3(0.10,0.105,0.12), low = vec3(0.012,0.012,0.016);" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.05, 0.85, y)) : mix(hor, low, smoothstep(0.0, 0.45, -y));" +
        " gl_FragColor = vec4(c * vec3(" + tint.map((x) => x.toFixed(3)).join(",") + "), 1.0); }"
    })));
    const panel = (w, h, x, y, z, k, col) => {
      const c = col || [1, 1, 1];
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k * c[0], k * c[1], k * c[2]), side: THREE.DoubleSide }));
      m.position.set(x, y, z); m.lookAt(0, 0, 0); envScene.add(m);
    };
    panel(64, 16, 0, 34, 22, 2.4);            // big softbox above-front: the even sheen on faces
    panel(40, 2.6, 0, 8, 44, 4.0);            // a hard strip in front, a little high: the crisp line along top bevels
    panel(7, 34, -40, 2, 22, 2.2);            // left strip: the vertical bands on chrome walls
    panel(7, 34, 40, 2, 22, 1.6);             // right strip
    panel(46, 4, 0, -18, 40, 1.1);            // low front bounce, so lower bevels are not black
    if (o.envAccent) panel(30, 10, 0, -30, 10, 1.2, o.envAccent);   // a coloured floor bounce
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(envScene, 0.0, 0.1, 200).texture;

    // ---------- lights ----------
    const key = new THREE.DirectionalLight(0xfff4e8, o.key == null ? 1.6 : o.key); key.position.set(-0.55, 0.85, 1.0); scene.add(key);
    const hemi = new THREE.HemisphereLight(0xeef2ff, 0x1a120c, o.hemi == null ? 0.55 : o.hemi); scene.add(hemi);
    const rake = new THREE.PointLight(0xffffff, 0, 0, 0); rake.position.set(-W, H * 0.2, 700); scene.add(rake);

    // ---------- helpers ----------
    const toX = (px) => px - W / 2, toY = (py) => H / 2 - py;
    function rr(p, x, y, w, h, r) {   // rounded rect, x,y = bottom-left (world, y up)
      p.moveTo(x + r, y); p.lineTo(x + w - r, y); p.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
      p.lineTo(x + w, y + h - r); p.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
      p.lineTo(x + r, y + h); p.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
      p.lineTo(x, y + r); p.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
    }
    function node(group, cx, cy, dom) {
      group.position.set(toX(cx), toY(cy), 0); scene.add(group);
      return { group, X: toX(cx), Y: toY(cy), dom: dom || null };
    }
    const P0 = { dx: 0, dy: 0, dz: 0, rx: 0, ry: 0, rz: 0, s: 1 };
    function css(p) {
      return "translate3d(" + p.dx.toFixed(2) + "px," + (-p.dy).toFixed(2) + "px," + p.dz.toFixed(2) + "px) rotateX(" + (-p.rx).toFixed(5) +
        "rad) rotateY(" + p.ry.toFixed(5) + "rad) rotateZ(" + (-p.rz).toFixed(5) + "rad) scale(" + p.s.toFixed(5) + ")";
    }
    function pose(n, q) {
      const p = Object.assign({}, P0, q || {});
      n.group.position.set(n.X + p.dx, n.Y + p.dy, p.dz); n.group.rotation.set(p.rx, p.ry, p.rz); n.group.scale.setScalar(p.s);
      n.group.visible = p.s > 0.001 && p.hide !== true;
      if (n.dom) { n.dom.style.transform = css(p); n.dom.style.opacity = n.group.visible ? "1" : "0"; }
      return p;
    }

    /** bands(mat, asp): two hot light bands that run round a bezel (angle-parametrised, aspect-normalised so they travel
        evenly round a 16:9 frame). Drive mat.userData.band = {a1, a2, w, amp} each render. Emission is added before tone
        mapping, so the peak burns to a hot white-red on the bevel and the face, clipped to the geometry (no overlay). */
    function bands(mat, asp, col) {
      const U = { uA1: { value: 0 }, uA2: { value: 0 }, uBW: { value: 0.13 }, uBAmp: { value: 0 }, uRun: { value: 0 }, uTail: { value: 0.45 }, uAsp: { value: asp }, uBCol: { value: new THREE.Color().fromArray(col || [1.0, 0.62, 0.55]) } };
      mat.userData.band = U;
      mat.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, U);
        sh.vertexShader = "varying vec3 vObj;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\nvObj = position;");
        // two comet bands: a tight head plus a dim tail back to where they started (signed angle, head 2 runs the other way)
        sh.fragmentShader = "varying vec3 vObj;\nuniform float uA1, uA2, uBW, uBAmp, uRun, uTail, uAsp; uniform vec3 uBCol;\n" +
          sh.fragmentShader.replace("#include <opaque_fragment>",
            "{ float ang = atan(vObj.y * uAsp, vObj.x);\n" +
            "  float s1 = mod(ang - uA1 + 3.14159265, 6.2831853) - 3.14159265;\n" +
            "  float s2 = -(mod(ang - uA2 + 3.14159265, 6.2831853) - 3.14159265);\n" +
            "  float b = exp(-s1 * s1 / (uBW * uBW)) + exp(-s2 * s2 / (uBW * uBW));\n" +
            "  b += 0.35 * ((s1 < 0.0 && s1 > -uRun) ? exp(s1 / uTail) : 0.0) + 0.35 * ((s2 < 0.0 && s2 > -uRun) ? exp(s2 / uTail) : 0.0);\n" +
            "  outgoingLight += uBCol * b * uBAmp; }\n#include <opaque_fragment>");
      };
      mat.customProgramCacheKey = () => "es3d-bands";
      return U;
    }

    /** frame({cx, cy, w, h, r, border, depth, bevel, mat}): a bezel around a w x h screen centred at (cx, cy) px. */
    function frame(f) {
      const b = f.border, r = f.r, bs = f.bevel || 5, bt = f.bevelT || bs, d = f.depth || 20;
      const sh = new THREE.Shape(); rr(sh, -f.w / 2 - b, -f.h / 2 - b, f.w + 2 * b, f.h + 2 * b, r + b);
      const hole = new THREE.Path(); rr(hole, -f.w / 2, -f.h / 2, f.w, f.h, r); sh.holes.push(hole);
      const geo = new THREE.ExtrudeGeometry(sh, { depth: d, bevelEnabled: true, bevelThickness: bt, bevelSize: bs, bevelOffset: -bs, bevelSegments: 5, curveSegments: 14 });
      geo.translate(0, 0, bt);
      const mesh = new THREE.Mesh(geo, f.mat);
      const g = new THREE.Group(); g.add(mesh);
      const n = node(g, f.cx, f.cy, f.dom); n.mesh = mesh;
      n.band = bands(f.mat, f.w / f.h, f.bandColor);
      n.angleOf = (px, py) => Math.atan2((f.cy - py) * (f.w / f.h), px - f.cx);   // band angle of a canvas point (e.g. the arrow tip)
      return n;
    }
    /** ring({cx, cy, r, width, depth, bevel, mat}): an annulus from r to r + width. */
    function ring(f) {
      const bs = f.bevel || 5, bt = f.bevelT || bs, d = f.depth || 18;
      const sh = new THREE.Shape(); sh.absarc(0, 0, f.r + f.width, 0, Math.PI * 2, false);
      const hole = new THREE.Path(); hole.absarc(0, 0, f.r, 0, Math.PI * 2, true); sh.holes.push(hole);
      const geo = new THREE.ExtrudeGeometry(sh, { depth: d, bevelEnabled: true, bevelThickness: bt, bevelSize: bs, bevelOffset: -bs, bevelSegments: 5, curveSegments: 96 });
      geo.translate(0, 0, bt);
      const mesh = new THREE.Mesh(geo, f.mat);
      const g = new THREE.Group(); g.add(mesh);
      const n = node(g, f.cx, f.cy, f.dom); n.mesh = mesh; return n;
    }

    /** gradTex(stops): a vertical gradient (bottom -> top) for title faces; uv.y runs baseline -> cap top. */
    function gradTex(stops) {
      const c = document.createElement("canvas"); c.width = 4; c.height = 256;
      const x = c.getContext("2d"), gr = x.createLinearGradient(0, 256, 0, 0);
      stops.forEach((s, i) => { const col = typeof s === "string" ? s : s[0], at = typeof s === "string" ? i / (stops.length - 1) : s[1]; gr.addColorStop(at, col); });
      x.fillStyle = gr; x.fillRect(0, 0, 4, 256);
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; return t;
    }

    /** title({glyphs, cap, baseline, x | cx, shear, depth, bevel, tracking, runs:[{text, face, side}]}) -> {nodes:[letter nodes], ink:{l,r}} */
    function title(T) {
      const F = T.glyphs, s = T.cap / F.cap, k = T.shear || 0, track = (T.tracking || 0) * F.upm;
      const MIN_SEG = 1.4, CURVE_SEG = 8;
      const text = T.runs.map((r) => r.text).join("");
      const runOf = []; T.runs.forEach((r, ri) => { for (let i = 0; i < r.text.length; i++) runOf.push(ri); });
      const pens = []; let pen = 0;
      for (let i = 0; i < text.length; i++) {
        const ch = F.g[text[i]] ? text[i] : " ", g = F.g[ch];
        pens.push({ ch, x: pen, g, run: runOf[i] });
        pen += g[0] + (i < text.length - 1 ? (F.k[text[i] + text[i + 1]] || 0) + track : 0);
      }
      const ink = pens.filter((p) => p.ch !== " ");
      const inkL = ink[0].x + ink[0].g[2], inkR = ink[ink.length - 1].x + ink[ink.length - 1].g[3];
      const inkW = (inkR - inkL) * s, shearW = k * T.cap;
      // optical: x is the left ink edge at the baseline; cx centres the sheared ink box
      const left = T.cx != null ? T.cx - (inkW + shearW) / 2 : T.x;
      const ox = toX(left) - inkL * s, base = toY(T.baseline);
      const bs = T.bevel || 4, bt = T.bevelT || bs, d = T.depth || 26;
      const mats = T.runs.map((r) => {
        const tex = gradTex(r.face);
        tex.repeat.set(1, 1 / T.cap); tex.offset.set(0, -base / T.cap);
        const face = new THREE.MeshPhysicalMaterial(Object.assign({ map: tex, roughness: 0.3, metalness: 0.0, clearcoat: 1.0, clearcoatRoughness: 0.06, envMapIntensity: 0.9 }, r.faceOpts || {}));
        const side = new THREE.MeshPhysicalMaterial(Object.assign({ color: new THREE.Color(r.side), roughness: 0.2, metalness: 1.0, clearcoat: 0.6, clearcoatRoughness: 0.1, envMapIntensity: 1.3 }, r.sideOpts || {}));
        return [face, side];
      });
      const nodes = [];
      ink.forEach((G, i) => {
        const sp = new THREE.ShapePath(), re = /([MLQCZ])([^MLQCZ]*)/g; let m;
        const px = (nx, ny) => [ox + (G.x + nx) * s - k * ny * s, base - ny * s];
        while ((m = re.exec(G.g[1]))) {
          const n = m[2].trim() ? m[2].trim().split(/[\s,]+/).map(Number) : [];
          const P = []; for (let j = 0; j < n.length; j += 2) P.push(...px(n[j], n[j + 1]));
          if (m[1] === "M") sp.moveTo(P[0], P[1]);
          else if (m[1] === "L") sp.lineTo(P[0], P[1]);
          else if (m[1] === "Q") sp.quadraticCurveTo(P[0], P[1], P[2], P[3]);
          else if (m[1] === "C") sp.bezierCurveTo(P[0], P[1], P[2], P[3], P[4], P[5]);
        }
        const clean = (pts) => {
          const out = [];
          for (const p of pts) if (!out.length || p.distanceTo(out[out.length - 1]) > MIN_SEG) out.push(p);
          while (out.length > 3 && out[0].distanceTo(out[out.length - 1]) <= MIN_SEG) out.pop();
          return out;
        };
        const shapes = sp.toShapes(false).map((sh) => {
          const s2 = new THREE.Shape(clean(sh.getPoints(CURVE_SEG)));
          sh.holes.forEach((h) => s2.holes.push(new THREE.Path(clean(h.getPoints(CURVE_SEG)))));
          return s2;
        });
        const geo = new THREE.ExtrudeGeometry(shapes, { depth: d, bevelEnabled: true, bevelThickness: bt, bevelSize: bs, bevelOffset: -bs, bevelSegments: 4, curveSegments: 1 });
        geo.computeBoundingBox();
        const bb = geo.boundingBox, cx = (bb.min.x + bb.max.x) / 2, cy = (bb.min.y + bb.max.y) / 2;
        geo.translate(-cx, -cy, bt);
        const mesh = new THREE.Mesh(geo, mats[G.run]);
        const g = new THREE.Group(); g.add(mesh); scene.add(g);
        g.position.set(cx, cy, 0);
        nodes.push({ group: g, X: cx, Y: cy, dom: null, i, run: G.run, mesh, px: cx + W / 2, py: H / 2 - cy });
      });
      return { nodes, mats, ink: { l: left, r: left + inkW + shearW, top: T.baseline - T.cap, base: T.baseline } };
    }

    // ---------- render: shutter-sampled motion blur (accumulation in linear HDR), then one ACES + sRGB pass ----------
    const rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 });
    const acc = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType });
    const qCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const addMat = new THREE.ShaderMaterial({
      uniforms: { tex: { value: rt.texture }, k: { value: 1 } }, depthTest: false, depthWrite: false, transparent: true,
      blending: THREE.CustomBlending, blendEquation: THREE.AddEquation, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor,
      blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneFactor,
      vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
      fragmentShader: "uniform sampler2D tex; uniform float k; varying vec2 vUv; void main(){ gl_FragColor = texture2D(tex, vUv) * k; }"
    });
    const addScene = new THREE.Scene(); addScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), addMat));
    const outMat = new THREE.MeshBasicMaterial({ map: acc.texture, depthTest: false, depthWrite: false, blending: THREE.NoBlending, toneMapped: true });
    const outScene = new THREE.Scene(); outScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), outMat));
    /** render(state, t, n, shutter): state(time) poses everything; n sub-frames across [t - shutter, t] are averaged. The last
        call is state(t), so DOM layers end on the exact frame time. */
    function render(state, t, n, shutter) {
      n = Math.max(1, n | 0);
      const ac = renderer.autoClear; renderer.autoClear = false;
      renderer.setClearColor(0x000000, 0);
      renderer.setRenderTarget(acc); renderer.clear();
      for (let i = n - 1; i >= 0; i--) {
        if (state) state(n > 1 ? t - shutter * (i / (n - 1)) : t);
        renderer.setRenderTarget(rt); renderer.clear(); renderer.render(scene, camera);
        addMat.uniforms.k.value = 1 / n; renderer.setRenderTarget(acc); renderer.render(addScene, qCam);
      }
      renderer.setRenderTarget(null); renderer.clear(); renderer.render(outScene, qCam);
      renderer.autoClear = ac;
    }
    return { canvas, renderer, scene, camera, DIST, key, hemi, rake, frame, ring, title, pose, css, render, toX, toY, gradTex, bands };
  };
})();
