/* Tags3D: floating player name tags as real geometry (Three.js r160, global THREE), all on one WebGL canvas in pixel space.
   Each tag is a glossy enamel capsule (its width animates: a round "blip" that unfolds into a nameplate), a pointer tail
   tucked under it and a dark rank puck set into its left end. All three are extruded and bevelled, clearcoated, and lit by
   a key + hemisphere light over a PMREM studio environment, so the bevels carry a lit top lip and a darker underside.
   A light front can run across a tag: white enamel turns into the player's colour behind it, with a hot edge at the front;
   a soft specular band can rake across the faces afterwards. Seek-safe: nothing animates on its own; the page sets every
   tag's state for time t and calls render(). The DOM labels are placed by the page with cssTransform(), which maps the same
   position / rotation / scale to CSS (orthographic, no perspective), so type stays razor-sharp and pinned to the face. */
(function () {
  window.Tags3D = function (o) {
    const W = o.W, H = o.H;
    const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
    canvas.style.cssText = "position:absolute;left:0;top:0;width:" + W + "px;height:" + H + "px;display:block";
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;
    const scene = new THREE.Scene();
    // pixel space: world x = screen x, world y = -screen y
    const cam = new THREE.OrthographicCamera(0, W, 0, -H, -4000, 4000); cam.position.set(0, 0, 1000); cam.lookAt(0, 0, 0);

    // ---------- environment: a studio with a big soft top light, a front fill strip and a dark floor ----------
    const env = new THREE.Scene();
    env.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(1.45), hor = vec3(0.42,0.43,0.46), low = vec3(0.05,0.05,0.06);" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.0, 0.75, y)) : mix(hor, low, smoothstep(0.0, 0.45, -y)); gl_FragColor = vec4(c, 1.0); }"
    })));
    const panel = (w, h, x, y, z, k) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k, k * 0.97), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); env.add(m); };
    panel(46, 14, 0, 30, 18, 3.0);      // big softbox above, slightly in front: the lit top lip on every bevel
    panel(36, 4, 0, 4, 40, 1.15);       // a low strip straight in front: the face's even gloss
    panel(8, 30, -34, 6, 22, 1.6);      // a tall kicker on the left: the left end caps catch a highlight
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(env, 0.0, 0.1, 200).texture;

    const key = new THREE.DirectionalLight(0xfff6ea, 1.35); key.position.set(-0.45, 0.9, 1.0); scene.add(key);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x3a3e48, 0.85));

    const col = (hex) => new THREE.Color(hex);   // sRGB hex -> linear (colour management is on in r160)

    // ---------- materials: one shader patch gives the face gradient, the ignition front, the hot edge and the rake ----------
    function enamel(U, isFace) {
      const m = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: isFace ? 0.26 : 0.32, metalness: 0.0,
        clearcoat: 1.0, clearcoatRoughness: isFace ? 0.07 : 0.12, envMapIntensity: isFace ? 0.55 : 0.9 });
      m.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, U);
        sh.vertexShader = "varying vec3 vLP;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vLP = position;");
        sh.fragmentShader = "varying vec3 vLP; uniform float uFront, uFeather, uHot, uSpecX, uSpecW, uSpecAmp, uY0, uY1, uGlow;\n" +
          "uniform vec3 uW0, uW1, uC0, uC1, uHotC;\n" + sh.fragmentShader
          .replace("#include <color_fragment>", "#include <color_fragment>\n" +
            " float ntY = clamp((vLP.y - uY0) / (uY1 - uY0), 0.0, 1.0);\n" +
            " float ntK = 1.0 - smoothstep(uFront - uFeather, uFront + uFeather, vLP.x);\n" +
            " vec3 ntW = mix(uW1, uW0, smoothstep(0.0, 1.0, ntY)); vec3 ntC = mix(uC1, uC0, smoothstep(0.0, 1.0, ntY));\n" +
            (isFace ? "" : " ntW *= 0.75; ntC *= 0.55;\n") +
            " diffuseColor.rgb = mix(ntW, ntC, ntK);")
          .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n" +
            " totalEmissiveRadiance += ntC * ntK * " + (isFace ? "0.30" : "0.34") + " * uGlow;\n" +
            (isFace ? " totalEmissiveRadiance += mix(vec3(0.10), vec3(0.22), ntK) * exp(-pow((ntY - 0.80) / 0.11, 2.0));\n" : "") +
            " float ntH = (vLP.x - uFront) / max(uFeather * 0.9, 1.0); totalEmissiveRadiance += uHotC * exp(-ntH * ntH) * uHot * " + (isFace ? "1.0" : "0.6") + ";\n" +
            " float ntS = (vLP.x + (vLP.y - uY0) * 0.55 - uSpecX) / uSpecW; totalEmissiveRadiance += vec3(1.0, 0.98, 0.94) * exp(-ntS * ntS) * uSpecAmp * " + (isFace ? "1.0" : "0.45") + ";");
      };
      return m;
    }
    const inkFace = new THREE.MeshPhysicalMaterial({ color: col(o.ink || "#08090C"), roughness: 0.34, metalness: 0.0, clearcoat: 0.5, clearcoatRoughness: 0.08, envMapIntensity: 0.14 });
    const inkSide = new THREE.MeshPhysicalMaterial({ color: col(o.inkSide || "#2A2E38"), roughness: 0.3, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 1.2 });

    // ---------- geometry ----------
    const D = o.depth || 16, BT = o.bevel || 6, BS = (o.bevel || 6) * 0.8;
    function capsule(w, h, cy, bx) {
      const r = h / 2, x0 = bx - w / 2 + r, x1 = bx + w / 2 - r, s = new THREE.Shape();
      s.moveTo(x0, cy - r); s.lineTo(x1, cy - r); s.absarc(x1, cy, r, -Math.PI / 2, Math.PI / 2, false);
      s.lineTo(x0, cy + r); s.absarc(x0, cy, r, Math.PI / 2, Math.PI * 1.5, false); return s;
    }
    function extrude(shape, depth, bt, bs, segs, front) {
      const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bt, bevelSize: bs, bevelOffset: -bs, bevelSegments: segs, curveSegments: 18 });
      g.translate(0, 0, -(depth + bt) + front); g.computeVertexNormals(); return g;
    }

    const tags = o.tags.map((T) => {
      const h = T.h, th = T.tailH, tw = T.tailW, cy = th + h / 2;
      const U = {
        uFront: { value: -1e4 }, uFeather: { value: 26 }, uHot: { value: 0 }, uSpecX: { value: -1e4 }, uSpecW: { value: 34 }, uSpecAmp: { value: 0 },
        uY0: { value: th }, uY1: { value: th + h }, uGlow: { value: 1 },
        uW0: { value: col(T.white[0]) }, uW1: { value: col(T.white[1]) }, uC0: { value: col(T.face[0]) }, uC1: { value: col(T.face[1]) }, uHotC: { value: col(T.hot) }
      };
      const face = enamel(U, true), side = enamel(U, false);
      const group = new THREE.Group(); scene.add(group);
      // tail: a tapered pointer with a rounded tip, tucked a hair behind the capsule face
      const ts = new THREE.Shape(); const tipR = 4;
      ts.moveTo(-tw / 2, th + h * 0.42); ts.lineTo(-tipR * 0.8, tipR * 0.9); ts.quadraticCurveTo(0, -tipR * 0.35, tipR * 0.8, tipR * 0.9);
      ts.lineTo(tw / 2, th + h * 0.42); ts.lineTo(-tw / 2, th + h * 0.42);
      const tail = new THREE.Mesh(extrude(ts, D * 0.8, BT * 0.7, BS * 0.55, 3, -1.2), [face, side]); group.add(tail);
      const pill = new THREE.Mesh(extrude(capsule(h + 1, h, cy, 0), D, BT, BS, 4, 0), [face, side]); group.add(pill);
      const pr = h / 2 - T.inset;
      const ps = new THREE.Shape(); ps.absarc(0, 0, pr, 0, Math.PI * 2, false);
      const puck = new THREE.Mesh(extrude(ps, 3, 2.6, 2.2, 4, 3.2), [inkFace, inkSide]); puck.position.y = cy; group.add(puck);
      return { T, U, group, pill, puck, h, th, cy, w: h + 1, bx: 0 };
    });

    function setTag(i, st) {
      const g = tags[i]; if (!g) return;
      const vis = st.s > 0.002; g.group.visible = vis; if (!vis) return;
      const w = Math.max(g.h + 1, st.w), bx = st.bx || 0;   // bx: the plate's centre relative to the pointer tip (local px)
      if (Math.abs(w - g.w) > 0.2 || Math.abs(bx - g.bx) > 0.2) {
        g.pill.geometry.dispose(); g.pill.geometry = extrude(capsule(w, g.h, g.cy, bx), D, BT, BS, 4, 0); g.w = w; g.bx = bx;
      }
      g.puck.position.x = g.bx - w / 2 + g.h / 2;
      g.group.position.set(st.x, -st.y, 0);
      g.group.rotation.set(st.rx || 0, st.ry || 0, st.rz || 0);
      g.group.scale.set(st.s * (st.sx || 1), st.s * (st.sy || 1), st.s);
      g.U.uFront.value = st.front == null ? -1e4 : st.front;
      g.U.uHot.value = st.hot || 0;
      g.U.uSpecX.value = st.specX == null ? -1e4 : st.specX;
      g.U.uSpecAmp.value = st.specAmp || 0;
      g.U.uGlow.value = st.glow == null ? 1 : st.glow;
    }
    // the same placement for a DOM element whose local origin is the tag's tip (transform-origin 0 0)
    function cssTransform(st) {
      return "translate(" + st.x.toFixed(2) + "px," + st.y.toFixed(2) + "px) rotateX(" + (-(st.rx || 0)).toFixed(4) + "rad) rotateY(" + (st.ry || 0).toFixed(4) +
        "rad) rotateZ(" + (-(st.rz || 0)).toFixed(4) + "rad) scale(" + (st.s * (st.sx || 1)).toFixed(4) + "," + (st.s * (st.sy || 1)).toFixed(4) + ")";
    }
    function render() { renderer.setRenderTarget(null); renderer.render(scene, cam); }
    return { canvas, setTag, render, cssTransform, tags };
  };
})();
