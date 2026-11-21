/* Wheel3D: the prize wheel as real lit geometry (Three.js r160, global THREE).
   Rotating part: extruded, bevelled lacquer wedges (one canvas face texture: lacquer gradients + labels), gold divider
   bars, a gold rim band with pegs, a gold dome hub with a star cap. Fixed part: an ink-lacquer bulb ring with gold lips
   and bulbs, the red lacquer ticker (flapper) on a gold pin, and the result plaque (extruded lacquer card, gold bevel).
   Two passes per frame:
     1. the rotating wheel, rendered K times across the shutter and averaged into a 2D canvas (real motion blur);
     2. the fixed parts on top (the WebGL canvas itself), with a depth-only disc so the plaque can hide behind the wheel.
   Seek-safe: nothing animates on its own; render(S) draws the frame for state S (a pure function of time upstream). */
(function () {
  const rad = (d) => d * Math.PI / 180;
  const shade = (hex, k) => { const c = new THREE.Color(hex); const h = {}; c.getHSL(h); return "#" + new THREE.Color().setHSL(h.h, Math.min(1, h.s * (k < 1 ? 1.04 : 0.96)), Math.max(0, Math.min(1, h.l * k))).getHexString(); };

  window.Wheel3D = function (o) {
    const W = o.W, H = o.H, DPR = o.dpr || 1.5, G = o.geo;
    const D = 360 / o.wedges.length;

    // ---------- canvases ----------
    const host = o.host;
    const acc = document.createElement("canvas"); acc.width = W * DPR; acc.height = H * DPR;
    acc.style.cssText = "position:absolute;left:0;top:0;width:" + W + "px;height:" + H + "px;display:block;pointer-events:none";
    const glc = document.createElement("canvas"); glc.width = W * DPR; glc.height = H * DPR;
    glc.style.cssText = acc.style.cssText;
    host.appendChild(acc); host.appendChild(glc);
    const ctx = acc.getContext("2d");

    const renderer = new THREE.WebGLRenderer({ canvas: glc, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(DPR); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = o.exposure || 1.0;
    renderer.sortObjects = true;

    const scene = new THREE.Scene();
    const FOV = 18, DIST = (H / 2) / Math.tan(rad(FOV / 2));
    const camera = new THREE.PerspectiveCamera(FOV, W / H, 10, DIST * 3);
    camera.position.set(0, 0, DIST); camera.lookAt(0, 0, 0);
    const WX = (x) => x - W / 2, WY = (y) => H / 2 - y;

    // ---------- environment: a warm studio for the gold, a cool strip for the lacquer ----------
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(0.95,0.9,0.85), hor = vec3(0.16,0.10,0.10), low = vec3(0.02,0.015,0.02);" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.15, 0.9, y)) : mix(hor, low, smoothstep(0.0, 0.35, -y)); gl_FragColor = vec4(c, 1.0); }"
    })));
    const panel = (w, h, x, y, z, c) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); envScene.add(m); };
    panel(46, 12, -4, 30, 22, new THREE.Color(3.4, 3.2, 2.9));    // big softbox above-front
    panel(4, 30, -26, 4, 24, new THREE.Color(2.6, 2.7, 3.0));     // tall strip front-left: one glint line on bevels
    panel(30, 6, 18, -10, 26, new THREE.Color(2.2, 1.4, 0.8));    // warm bounce low-right: rich gold
    panel(40, 5, 0, 18, -30, new THREE.Color(2.4, 2.3, 2.2));     // hot bar behind: lit back lips
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(envScene, 0.0, 0.1, 200).texture;

    const key = new THREE.DirectionalLight(0xfff4e6, 1.5); key.position.set(-0.5 * DIST, 0.8 * DIST, DIST); scene.add(key); scene.add(key.target);
    const rim = new THREE.DirectionalLight(0xc8d8ff, 0.5); rim.position.set(0.7 * DIST, -0.3 * DIST, 0.4 * DIST); scene.add(rim); scene.add(rim.target);
    scene.add(new THREE.HemisphereLight(0xfff1e0, 0x160c1c, 0.55));

    // ---------- textures ----------
    const T = (c, premul) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.premultiplyAlpha = !!premul; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; return t; };
    const Rt = G.Rw + 6, TS = 2048, kT = TS / (2 * Rt);
    const faceCanvas = document.createElement("canvas"); faceCanvas.width = TS; faceCanvas.height = TS;
    paintFace(faceCanvas.getContext("2d"));
    const faceTex = T(faceCanvas, false);
    faceTex.repeat.set(1 / (2 * Rt), 1 / (2 * Rt)); faceTex.offset.set(0.5, 0.5);

    function fitFont(g, text, weight, family, stretch, size, maxW) {
      const set = (s) => { g.font = weight + " " + s + "px " + family; try { g.fontStretch = stretch || "normal"; } catch (e) {} };
      set(size); let w = g.measureText(text).width;
      if (w > maxW) { size = Math.floor(size * maxW / w); set(size); w = g.measureText(text).width; }
      return { size, w };
    }

    function paintFace(g) {
      g.setTransform(kT, 0, 0, kT, TS / 2, TS / 2);
      g.clearRect(-Rt, -Rt, 2 * Rt, 2 * Rt);
      o.wedges.forEach((wd, i) => {
        const a0 = rad(i * D - D / 2), a1 = rad(i * D + D / 2);
        g.save();
        g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, Rt, a0, a1); g.closePath(); g.clip();
        // lacquer: darker into the hub, the pure colour mid, a lifted rim
        const gr = g.createRadialGradient(0, 0, G.Rhub, 0, 0, G.Rw);
        gr.addColorStop(0, shade(wd.color, 0.66)); gr.addColorStop(0.42, wd.color); gr.addColorStop(0.86, shade(wd.color, 1.1)); gr.addColorStop(1, shade(wd.color, 1.02));
        g.fillStyle = gr; g.fillRect(-Rt, -Rt, 2 * Rt, 2 * Rt);
        // soft inner shadow along the wedge's sides (under the gold dividers)
        g.save(); g.filter = "blur(" + (5 * kT).toFixed(1) + "px)"; g.lineWidth = 16; g.strokeStyle = "rgba(10,4,20,0.42)";
        g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, Rt, a0, a1); g.closePath(); g.stroke(); g.restore();
        // label along the radius, reading outward, right-aligned near the rim
        g.rotate(rad(i * D));
        const x1 = G.Rw - G.labelPad, x0 = G.Rhub + 34;
        const f = fitFont(g, wd.label, 900, "Archivo", "condensed", G.labelSize, x1 - x0);
        // the wedge narrows toward the hub: keep the cap height inside it
        const capH = f.size * 0.72, xs = x1 - f.w, half = xs * Math.tan(rad(D / 2)) - 10;
        let size = f.size; if (capH / 2 > half) { size = Math.floor(f.size * (2 * half) / capH); g.font = "900 " + size + "px Archivo"; try { g.fontStretch = "condensed"; } catch (e) {} }
        g.textAlign = "right"; g.textBaseline = "alphabetic";
        const yb = size * 0.36;
        if (wd.ink) {
          g.shadowColor = "rgba(255,255,255,0.35)"; g.shadowBlur = 0; g.shadowOffsetY = 0;
          g.fillStyle = "#15101C"; g.fillText(wd.label, x1, yb);
        } else {
          g.lineJoin = "round"; g.lineWidth = Math.max(3, size * 0.09); g.strokeStyle = shade(wd.color, 0.42); g.strokeText(wd.label, x1, yb);
          g.shadowColor = "rgba(0,0,0,0.35)"; g.shadowBlur = 6 * kT;
          g.fillStyle = "#FFFFFF"; g.fillText(wd.label, x1, yb);
        }
        g.restore();
      });
      g.save();
      // rim and hub ambient occlusion (rotation-invariant, so it can live on the rotating texture)
      let ao = g.createRadialGradient(0, 0, G.Rw - 30, 0, 0, G.Rw + 2);
      ao.addColorStop(0, "rgba(0,0,0,0)"); ao.addColorStop(1, "rgba(8,2,16,0.38)");
      g.fillStyle = ao; g.beginPath(); g.arc(0, 0, Rt, 0, Math.PI * 2); g.fill();
      ao = g.createRadialGradient(0, 0, G.Rhub, 0, 0, G.Rhub + 46);
      ao.addColorStop(0, "rgba(8,2,16,0.5)"); ao.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = ao; g.beginPath(); g.arc(0, 0, Rt, 0, Math.PI * 2); g.fill();
      g.restore();
    }

    const glowCanvas = (() => { const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d");
      const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.18, "rgba(255,255,255,0.55)"); gr.addColorStop(0.5, "rgba(255,255,255,0.12)"); gr.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return c; })();
    const glowTex = T(glowCanvas, false); glowTex.colorSpace = THREE.LinearSRGBColorSpace;
    const blurCanvas = (w, h, r, blur, alpha) => { const pad = blur * 3, c = document.createElement("canvas"); c.width = w + 2 * pad; c.height = h + 2 * pad; const g = c.getContext("2d");
      g.filter = "blur(" + blur + "px)"; g.fillStyle = "rgba(0,0,0," + alpha + ")"; g.beginPath(); g.roundRect(pad, pad, w, h, r); g.fill(); return { c, pad }; };

    // ---------- materials ----------
    const gold = new THREE.MeshPhysicalMaterial({ color: new THREE.Color("#E8B24A"), metalness: 1, roughness: 0.24, clearcoat: 0.5, clearcoatRoughness: 0.12, envMapIntensity: 1.35 });
    const goldPol = new THREE.MeshPhysicalMaterial({ color: new THREE.Color("#F2C664"), metalness: 1, roughness: 0.16, clearcoat: 0.8, clearcoatRoughness: 0.06, envMapIntensity: 1.5 });
    const ink = new THREE.MeshPhysicalMaterial({ color: new THREE.Color("#1A1124"), metalness: 0.2, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.1 });
    const DS = (m) => { const c = m.clone(); c.side = THREE.DoubleSide; return c; };
    const goldDS = DS(gold), goldPolDS = DS(goldPol), inkDS = DS(ink);
    const redLac = (hex) => { const m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(hex), metalness: 0.05, roughness: 0.26, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 0.9, emissive: new THREE.Color(hex), emissiveIntensity: 0.18 }); m.toneMapped = false; return m; };

    function faceMat(U, tex, base) {
      const m = new THREE.MeshPhysicalMaterial({ map: tex, color: 0xffffff, roughness: 0.34, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 0.85, emissive: 0xffffff, emissiveIntensity: 1 });
      m.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, U);
        sh.vertexShader = "varying vec3 vWP;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vWP = (modelMatrix * vec4(transformed, 1.0)).xyz;");
        sh.fragmentShader = "varying vec3 vWP; uniform float uDim, uHot, uEmis, uSpecPos, uSpecW, uSpecAmp; uniform vec2 uSpecDir;\nvec3 gCol = vec3(0.0);\n" +
          sh.fragmentShader
            .replace("#include <map_fragment>", "#include <map_fragment>\n { float l = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722)); diffuseColor.rgb = mix(diffuseColor.rgb, vec3(l), 0.22 * uDim) * (1.0 - 0.62 * uDim); gCol = diffuseColor.rgb; }")
            .replace("#include <emissivemap_fragment>", "{ totalEmissiveRadiance = gCol * (uEmis + uHot); float sd = (dot(vWP.xy, uSpecDir) - uSpecPos) / uSpecW; totalEmissiveRadiance += vec3(1.0, 0.96, 0.9) * exp(-sd * sd) * uSpecAmp; }");
      };
      return m;
    }
    const mkU = () => ({ uDim: { value: 0 }, uHot: { value: 0 }, uEmis: { value: o.emis == null ? 0.32 : o.emis }, uSpecPos: { value: -1e5 }, uSpecW: { value: 46 }, uSpecAmp: { value: 0 }, uSpecDir: { value: new THREE.Vector2(Math.cos(rad(-35)), Math.sin(rad(-35))) } });

    // ---------- rig ----------
    const rig = new THREE.Group(); scene.add(rig);
    const tiltG = new THREE.Group(); rig.add(tiltG);
    const spin = new THREE.Group(); tiltG.add(spin);         // rotating wheel (pass 1)
    const fixed = new THREE.Group(); tiltG.add(fixed);       // ring, bulbs, pointer (pass 2)
    const under = new THREE.Group(); tiltG.add(under);       // pointer shadow on the wheel (pass 1, not rotating)

    const P = (r, a) => new THREE.Vector2(r * Math.cos(rad(a)), -r * Math.sin(rad(a)));   // screen angle (cw, y down) -> world
    const WD = 8, BT = 3, BS = 3;
    const wedges = o.wedges.map((wd, i) => {
      const mid = i * D, hg = G.gap / 2 + BS, ro = G.Rw - BS, ri = G.Rhub + 4 + BS;
      const dO = Math.asin(hg / ro) * 180 / Math.PI, dI = Math.asin(hg / ri) * 180 / Math.PI, a1 = mid - D / 2, a2 = mid + D / 2, pts = [];
      for (let k = 0; k <= 64; k++) pts.push(P(ro, a1 + dO + (a2 - a1 - 2 * dO) * k / 64));
      for (let k = 0; k <= 16; k++) pts.push(P(ri, a2 - dI - (a2 - a1 - 2 * dI) * k / 16));
      const shape = new THREE.Shape(pts.reverse());
      const geo = new THREE.ExtrudeGeometry(shape, { depth: WD, bevelEnabled: true, bevelThickness: BT, bevelSize: BS, bevelSegments: 4, curveSegments: 1, steps: 1 });
      geo.translate(0, 0, -(WD + BT));
      const U = mkU();
      const face = faceMat(U, faceTex); face.toneMapped = false;
      const side = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(shade(wd.color, 0.72)), roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.0, emissive: new THREE.Color(wd.color), emissiveIntensity: 0.12 });
      side.toneMapped = false;
      const mesh = new THREE.Mesh(geo, [face, side]); spin.add(mesh);
      const cR = (G.Rhub + G.Rw) / 2, c = P(cR, mid);
      return { mesh, U, face, side, env0: face.envMapIntensity, c: new THREE.Vector3(c.x, c.y, 0), mid, col: wd.color };
    });
    // gold divider bars on every boundary
    {
      const len = G.Rw + 3 - (G.Rhub - 6), w = G.divW;
      const sh = new THREE.Shape(); sh.moveTo(0, -w / 2); sh.lineTo(len, -w / 2); sh.lineTo(len, w / 2); sh.lineTo(0, w / 2); sh.lineTo(0, -w / 2);
      const geo = new THREE.ExtrudeGeometry(sh, { depth: 4, bevelEnabled: true, bevelThickness: 2.5, bevelSize: 2, bevelSegments: 4, steps: 1 });
      geo.translate(G.Rhub - 6, 0, -1);
      for (let i = 0; i < o.wedges.length; i++) { const m = new THREE.Mesh(geo, gold); m.rotation.z = -rad(i * D + D / 2); spin.add(m); }
    }
    // rotating rim band (gold lathe)
    {
      const prof = [], rc = G.Rw + 7, hw = 10, zb = 0;
      prof.push(new THREE.Vector2(rc + hw, zb - 18));
      for (let k = 0; k <= 20; k++) { const a = Math.PI * k / 20; prof.push(new THREE.Vector2(rc + hw * Math.cos(a), zb + 7 * Math.sin(a))); }
      prof.push(new THREE.Vector2(rc - hw, zb - 16));
      const g = new THREE.LatheGeometry(prof, 240); g.rotateX(Math.PI / 2);
      spin.add(new THREE.Mesh(g, goldDS));
    }
    // pegs at the boundaries, on the rim band
    {
      const cyl = new THREE.CylinderGeometry(G.pegR, G.pegR * 1.12, 18, 28); cyl.rotateX(Math.PI / 2); cyl.translate(0, 0, 13);
      const cap = new THREE.SphereGeometry(G.pegR, 28, 12, 0, Math.PI * 2, 0, Math.PI / 2); cap.rotateX(Math.PI / 2); cap.scale(1, 1, 0.6); cap.translate(0, 0, 22);
      for (let i = 0; i < o.wedges.length; i++) {
        const p = P(G.rPeg, i * D + D / 2);
        const a = new THREE.Mesh(cyl, goldPol), b = new THREE.Mesh(cap, goldPol);
        a.position.set(p.x, p.y, 0); b.position.set(p.x, p.y, 0); spin.add(a); spin.add(b);
      }
    }
    // back disc (shows as the wheel's dark edge when tilted)
    {
      const g = new THREE.CylinderGeometry(G.Rw + 16, G.Rw + 16, 18, 160); g.rotateX(Math.PI / 2); g.translate(0, 0, -(WD + 2 * BT) - 9);
      spin.add(new THREE.Mesh(g, ink));
    }
    // hub: gold dome, bolts, red star cap
    {
      const prof = [], R = G.Rhub, hh = 24;
      prof.push(new THREE.Vector2(R + 7, -4)); prof.push(new THREE.Vector2(R + 6, 4));
      for (let k = 24; k >= 1; k--) { const r = R * k / 24; prof.push(new THREE.Vector2(r, 6 + hh * Math.sqrt(Math.max(0, 1 - Math.pow(r / R, 2.2))))); }
      prof.push(new THREE.Vector2(0.001, 6 + hh));
      const g = new THREE.LatheGeometry(prof, 120); g.rotateX(Math.PI / 2);
      spin.add(new THREE.Mesh(g, goldPolDS));
      const bolt = new THREE.SphereGeometry(5, 16, 10);
      for (let k = 0; k < 8; k++) { const r = R * 0.74, z = 6 + hh * Math.sqrt(1 - Math.pow(0.74, 2.2)); const m = new THREE.Mesh(bolt, ink); m.position.set(r * Math.cos(k * Math.PI / 4 + 0.39), r * Math.sin(k * Math.PI / 4 + 0.39), z); spin.add(m); }
      const st = new THREE.Shape(), ro = R * 0.42, ri2 = ro * 0.42;
      for (let k = 0; k < 10; k++) { const a = Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? ri2 : ro; const x = r * Math.cos(a), y = r * Math.sin(a); k ? st.lineTo(x, y) : st.moveTo(x, y); }
      st.closePath();
      const sg = new THREE.ExtrudeGeometry(st, { depth: 3, bevelEnabled: true, bevelThickness: 2.5, bevelSize: 2, bevelSegments: 3 });
      sg.translate(0, 0, 6 + hh - 3);
      spin.add(new THREE.Mesh(sg, [redLac("#E3202F"), goldPol]));
    }

    // ---------- fixed: bulb ring ----------
    const bulbs = [];
    {
      const prof = [], a = G.ringIn, b = G.ringOut, top = 14;
      prof.push(new THREE.Vector2(b, -20));
      for (let k = 0; k <= 16; k++) { const t = k / 16; prof.push(new THREE.Vector2(b + (a - b) * t, top - 6 + 6 * Math.sin(Math.PI * t))); }
      prof.push(new THREE.Vector2(a, -14));
      const g = new THREE.LatheGeometry(prof, 240); g.rotateX(Math.PI / 2);
      fixed.add(new THREE.Mesh(g, inkDS));
      const lipI = new THREE.TorusGeometry(a, 3.6, 12, 240), lipO = new THREE.TorusGeometry(b, 4.2, 12, 240);
      const mi = new THREE.Mesh(lipI, gold); mi.position.z = top - 6; fixed.add(mi);
      const mo = new THREE.Mesh(lipO, gold); mo.position.z = top - 7; fixed.add(mo);
      const rb = (a + b) / 2, sock = new THREE.TorusGeometry(G.bulbR + 2.5, 2.4, 10, 32), sph = new THREE.SphereGeometry(G.bulbR, 24, 16);
      for (let i = 0; i < G.nBulbs; i++) {
        const ang = i * 360 / G.nBulbs + (G.bulbPhase || 0), p = P(rb, ang);
        const s = new THREE.Mesh(sock, gold); s.position.set(p.x, p.y, top + 1); fixed.add(s);
        const mat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color("#FFF1D8"), roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.03, emissive: new THREE.Color("#FFB648"), emissiveIntensity: 0.2, envMapIntensity: 0.9 });
        const m = new THREE.Mesh(sph, mat); m.position.set(p.x, p.y, top + 3); m.scale.set(1, 1, 0.8); fixed.add(m);
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: new THREE.Color("#FFD08A"), toneMapped: false, transparent: true, depthWrite: false, depthTest: true, opacity: 0 }));
        sp.position.set(p.x, p.y, top + 12); sp.scale.set(G.bulbR * 9, G.bulbR * 9, 1); sp.renderOrder = 5; fixed.add(sp);
        bulbs.push({ mat, sp, ang });
      }
    }

    // ---------- fixed: the ticker (flapper) ----------
    const ptr = new THREE.Group(); fixed.add(ptr);
    const ptrPivot = P(G.pivotR, o.pointerAngle);
    ptr.position.set(ptrPivot.x, ptrPivot.y, 20);
    const ptrBase = -rad(o.pointerAngle);
    const ptrFace = redLac(o.pointerColor || "#F0263A");
    {
      const L = G.L, rh = G.headR, beta = Math.acos(rh / L), sh = new THREE.Shape();
      const tipR = 3.5;
      sh.moveTo(-L + tipR, 0);
      const n = 48;
      for (let k = 0; k <= n; k++) { const a = Math.PI + beta + (2 * Math.PI - 2 * beta) * k / n; sh.lineTo(rh * Math.cos(a), rh * Math.sin(a)); }
      sh.lineTo(-L + tipR, 0);
      const g = new THREE.ExtrudeGeometry(sh, { depth: 8, bevelEnabled: true, bevelThickness: 4, bevelSize: 3.5, bevelSegments: 5, curveSegments: 1, steps: 1 });
      ptr.add(new THREE.Mesh(g, [ptrFace, gold]));
      const pin = new THREE.CylinderGeometry(rh * 0.42, rh * 0.46, 8, 40); pin.rotateX(Math.PI / 2); pin.translate(0, 0, 16);
      ptr.add(new THREE.Mesh(pin, goldPol));
      const dome = new THREE.SphereGeometry(rh * 0.42, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2); dome.rotateX(Math.PI / 2); dome.scale(1, 1, 0.5); dome.translate(0, 0, 20);
      ptr.add(new THREE.Mesh(dome, goldPol));
    }
    // its soft shadow on the wheel face (pass 1)
    const pshG = new THREE.Group(); under.add(pshG); pshG.position.set(ptrPivot.x + 10, ptrPivot.y - 14, 10);
    {
      const c = document.createElement("canvas"), L = G.L, rh = G.headR, pad = 30; c.width = L + rh + 2 * pad; c.height = 2 * rh + 2 * pad; const g = c.getContext("2d");
      g.filter = "blur(9px)"; g.fillStyle = "rgba(0,0,0,0.75)"; g.beginPath(); const beta = Math.acos(rh / L), cx = pad + L, cy = pad + rh;
      g.moveTo(cx - L, cy); for (let k = 0; k <= 40; k++) { const a = Math.PI + beta + (2 * Math.PI - 2 * beta) * k / 40; g.lineTo(cx + rh * Math.cos(a), cy - rh * Math.sin(a)); } g.closePath(); g.fill();
      const t = T(c, false); t.colorSpace = THREE.LinearSRGBColorSpace;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(c.width, c.height), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, opacity: 0.5, toneMapped: false }));
      m.position.x = (c.width / 2) - (pad + L);
      pshG.add(m);
    }

    // ---------- fixed: depth-only disc (the plaque hides behind the wheel) + the wheel's drop shadow ----------
    const occ = new THREE.Mesh(new THREE.CircleGeometry(G.Rw + 16, 128), new THREE.MeshBasicMaterial({ colorWrite: false }));
    occ.position.z = -(WD + 2 * BT); occ.renderOrder = -1; fixed.add(occ);
    const dropTex = (() => { const c = document.createElement("canvas"); c.width = c.height = 256; const g = c.getContext("2d");
      const gr = g.createRadialGradient(128, 128, 60, 128, 128, 128); gr.addColorStop(0, "rgba(0,0,0,0.85)"); gr.addColorStop(0.62, "rgba(0,0,0,0.6)"); gr.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = gr; g.fillRect(0, 0, 256, 256); const t = T(c, false); t.colorSpace = THREE.LinearSRGBColorSpace; return t; })();
    const drop = new THREE.Mesh(new THREE.PlaneGeometry(G.ringOut * 2.5, G.ringOut * 2.5), new THREE.MeshBasicMaterial({ map: dropTex, transparent: true, depthWrite: false, opacity: 0.55, toneMapped: false }));
    drop.position.set(14, -30, -60); fixed.add(drop);

    // ---------- the result plaque: a gold frame (real bevelled extrusion with a hole) around a recessed lacquer panel ----------
    const C = o.card, cardG = new THREE.Group(); scene.add(cardG);
    const FW = C.fw || 16;
    const cardCanvas = document.createElement("canvas"), CK = 2; cardCanvas.width = C.w * CK; cardCanvas.height = C.h * CK;
    const cardTex = T(cardCanvas, false); cardTex.repeat.set(1 / C.w, 1 / C.h); cardTex.offset.set(0.5, 0.5);
    const cardU = mkU(); cardU.uEmis.value = o.cardEmis == null ? 0.16 : o.cardEmis; cardU.uSpecW.value = 70;
    const cardFace = faceMat(cardU, cardTex); cardFace.toneMapped = false; cardFace.envMapIntensity = 0.7;
    const rr = (w, h, r) => { const sh = new THREE.Shape(); sh.moveTo(-w / 2 + r, -h / 2); sh.lineTo(w / 2 - r, -h / 2); sh.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r); sh.lineTo(w / 2, h / 2 - r); sh.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
      sh.lineTo(-w / 2 + r, h / 2); sh.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r); sh.lineTo(-w / 2, -h / 2 + r); sh.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2); return sh; };
    {
      const B = 4, outer = rr(C.w - 2 * B, C.h - 2 * B, C.r), hole = rr(C.w - 2 * FW, C.h - 2 * FW, Math.max(6, C.r - FW + 4));
      outer.holes.push(new THREE.Path(hole.getPoints(12)));
      const fg = new THREE.ExtrudeGeometry(outer, { depth: 12, bevelEnabled: true, bevelThickness: 4, bevelSize: B, bevelSegments: 6, curveSegments: 12, steps: 1 });
      fg.translate(0, 0, -16);
      cardG.add(new THREE.Mesh(fg, [goldPol, gold]));
      const pg = new THREE.ExtrudeGeometry(rr(C.w - 2 * FW + 10, C.h - 2 * FW + 10, Math.max(6, C.r - FW + 8)), { depth: 4, bevelEnabled: true, bevelThickness: 1.5, bevelSize: 1.5, bevelSegments: 2, curveSegments: 12, steps: 1 });
      pg.translate(0, 0, -13);
      cardG.add(new THREE.Mesh(pg, [cardFace, ink]));
      const rv = new THREE.SphereGeometry(4.2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2); rv.rotateX(Math.PI / 2); rv.scale(1, 1, 0.7);
      [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => { const m = new THREE.Mesh(rv, goldPol); m.position.set(sx * (C.w / 2 - FW / 2 - 2), sy * (C.h / 2 - FW / 2 - 2), 0); cardG.add(m); });
      const bc = blurCanvas(C.w, C.h, C.r, 16, 0.75), st = T(bc.c, false); st.colorSpace = THREE.LinearSRGBColorSpace;
      const shm = new THREE.Mesh(new THREE.PlaneGeometry(bc.c.width, bc.c.height), new THREE.MeshBasicMaterial({ map: st, transparent: true, depthWrite: false, opacity: 0.6, toneMapped: false }));
      shm.position.set(10, -22, -40); cardG.add(shm); cardG.userData.shadow = shm;
    }
    let cardKey = "";
    function paintCard(kick, res) {
      const k = kick.toFixed(3) + "|" + res.toFixed(3);
      if (k === cardKey) return; cardKey = k;
      const g = cardCanvas.getContext("2d"), w = C.w, h = C.h;
      g.setTransform(CK, 0, 0, CK, 0, 0); g.clearRect(0, 0, w, h);
      // deep lacquer panel in the winner's colour
      const gr = g.createLinearGradient(0, FW, 0, h - FW); gr.addColorStop(0, shade(C.color, 0.98)); gr.addColorStop(0.45, shade(C.color, 0.7)); gr.addColorStop(1, shade(C.color, 0.4));
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
      const gl2 = g.createRadialGradient(w * 0.32, -h * 0.1, 10, w * 0.32, -h * 0.1, w * 0.75); gl2.addColorStop(0, "rgba(255,255,255,0.18)"); gl2.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gl2; g.fillRect(0, 0, w, h);
      // the frame's shadow falling into the recess
      g.save(); g.filter = "blur(7px)"; g.strokeStyle = "rgba(8,0,20,0.7)"; g.lineWidth = 22; g.beginPath(); g.roundRect(FW - 6, FW - 2, w - 2 * FW + 12, h - 2 * FW + 12, C.r - FW + 6); g.stroke(); g.restore();
      // kicker (gold, tracked caps)
      const ky = C.kickY, ry = C.resY;
      g.save(); g.beginPath(); g.rect(0, ky - C.kickSize * 1.1, w, C.kickSize * 1.45); g.clip();
      g.font = "800 " + C.kickSize + "px Inter"; try { g.fontStretch = "normal"; } catch (e) {} try { g.letterSpacing = (C.kickSize * 0.22).toFixed(1) + "px"; } catch (e) {}
      g.textAlign = "center"; g.textBaseline = "alphabetic";
      const ko = (1 - kick) * C.kickSize * 1.6;
      if (kick > 0.001) { g.fillStyle = "rgba(10,0,24,0.55)"; g.fillText(C.kicker, w / 2 + C.kickSize * 0.11, ky + ko + 2);
      g.fillStyle = C.kickColor || "#FFCF5A"; g.fillText(C.kicker, w / 2 + C.kickSize * 0.11, ky + ko); }
      g.restore();
      // result
      g.save(); g.beginPath(); g.rect(0, ry - C.resSize * 0.9, w, C.resSize * 1.08); g.clip();
      try { g.letterSpacing = "0px"; } catch (e) {}
      const f = fitFont(g, C.result, 900, "Archivo", "condensed", C.resSize, w - 2 * C.padX);
      g.textAlign = "center"; g.textBaseline = "alphabetic";
      const ro = (1 - res) * f.size * 1.3, yb = ry - (C.resSize - f.size) * 0.36;
      if (res > 0.001) {
      g.save(); g.filter = "blur(4px)"; g.fillStyle = "rgba(10,0,24,0.6)"; g.fillText(C.result, w / 2, yb + ro + 6); g.restore();
      g.lineJoin = "round"; g.lineWidth = Math.max(4, f.size * 0.06); g.strokeStyle = shade(C.color, 0.3); g.strokeText(C.result, w / 2, yb + ro);
      const tg = g.createLinearGradient(0, yb - f.size * 0.75, 0, yb); tg.addColorStop(0, "#FFFFFF"); tg.addColorStop(0.55, "#FFFFFF"); tg.addColorStop(1, "#FFE9C4");
      g.fillStyle = tg; g.fillText(C.result, w / 2, yb + ro);
      }
      g.restore();
      cardTex.needsUpdate = true;
    }

    // ---------- render ----------
    const tmpV = new THREE.Vector3();
    function render(S) {
      const show = S.rig.s > 0.002;
      rig.visible = show;
      rig.position.set(WX(S.rig.x), WY(S.rig.y), 0);
      rig.scale.setScalar(Math.max(S.rig.s, 0.002));
      tiltG.rotation.set(rad(S.rig.rx || 0), rad(S.rig.ry || 0), 0);
      // wedges
      wedges.forEach((w, i) => {
        const st = S.wedges[i] || {};
        const s = 1 + (st.grow || 0);
        w.mesh.scale.set(s, s, 1 + (st.grow || 0) * 2);
        w.mesh.position.set(w.c.x * (1 - s), w.c.y * (1 - s), st.lift || 0);
        w.U.uDim.value = st.dim || 0; w.U.uHot.value = st.hot || 0;
        w.face.clearcoat = 1 - 0.75 * (st.dim || 0); w.face.envMapIntensity = w.env0 * (1 - 0.7 * (st.dim || 0));
        w.side.color.set(shade(w.col, 0.72 * (1 - 0.5 * (st.dim || 0))));
        w.side.emissiveIntensity = 0.12 + 0.8 * (st.hot || 0);
        w.U.uSpecAmp.value = st.spec > 0 && st.spec < 1 ? (st.specAmp || 0.5) * Math.sin(Math.PI * st.spec) : 0;
      });
      // flapper
      const phi = Math.asin(Math.max(-0.95, Math.min(0.95, (S.d || 0) / G.L)));
      ptr.rotation.z = ptrBase + phi; pshG.rotation.z = ptrBase + phi;
      ptrFace.emissiveIntensity = 0.18 + (S.ptrHot || 0);
      // bulbs
      bulbs.forEach((b, i) => { const v = S.bulbs ? S.bulbs[i] : 0; b.mat.emissiveIntensity = 0.1 + 5.5 * v; b.sp.material.opacity = 0.9 * v; });
      // card
      const cv = S.card && S.card.vis;
      cardG.visible = !!cv;
      if (cv) {
        const c = S.card;
        const kz = (DIST - (c.z || 0)) / DIST;   // keep the plaque's projected size and place exact at any depth
        if (c.hingeX != null) {
          // a door hinged on its left edge: the free edge swings away from the camera, so it never crosses in front of the wheel
          const a = rad(c.ry || 0), half = C.w / 2 * c.s * kz;
          cardG.position.set(WX(c.hingeX) * kz + half * Math.cos(a), WY(c.y) * kz, (c.z || 0) - half * Math.sin(a));
        } else cardG.position.set(WX(c.x) * kz, WY(c.y) * kz, c.z || 0);
        cardG.scale.set(c.s * kz * (c.sx || 1), c.s * kz * (c.sy || 1), c.s * kz);
        cardG.rotation.set(rad(c.rx || 0), rad(c.ry || 0), rad(c.rz || 0));
        paintCard(c.kick || 0, c.res || 0);
        cardU.uSpecAmp.value = c.spec > 0 && c.spec < 1 ? 0.55 * Math.sin(Math.PI * c.spec) : 0;
        cardU.uSpecPos.value = cardG.position.x * cardU.uSpecDir.value.x + cardG.position.y * cardU.uSpecDir.value.y + (c.spec * 2 - 1) * (C.w * 0.62);
        cardU.uHot.value = c.hot || 0;
        cardG.userData.shadow.material.opacity = 0.6 * Math.min(1, c.s);
      }
      if (!show && !cv) { ctx.clearRect(0, 0, acc.width, acc.height); renderer.clear(); return; }
      // spec sweep position for the winner wedge (world coords; the wheel is still by then)
      scene.updateMatrixWorld(true);
      // ---- pass 1: the rotating wheel, averaged over the shutter ----
      fixed.visible = false; cardG.visible = false; spin.visible = show; under.visible = show;
      const th = S.thetas && S.thetas.length ? S.thetas : [0], K = th.length;
      if (show) {
        for (let k = 0; k < K; k++) {
          spin.rotation.z = -rad(th[k]);
          spin.updateMatrixWorld(true);
          if (k === K - 1 || K === 1) wedges.forEach((w, i) => {
            const st = S.wedges[i] || {};
            if (st.spec > 0 && st.spec < 1) { tmpV.copy(w.c); w.mesh.localToWorld(tmpV); const dv = w.U.uSpecDir.value; w.U.uSpecPos.value = tmpV.x * dv.x + tmpV.y * dv.y + (st.spec * 2 - 1) * G.Rw * 0.45 * S.rig.s; w.U.uSpecW.value = 40 * S.rig.s; }
          });
          renderer.render(scene, camera);
          ctx.globalCompositeOperation = k === 0 ? "copy" : "lighter";
          ctx.globalAlpha = 1 / K;
          ctx.drawImage(glc, 0, 0);
        }
        ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
      } else ctx.clearRect(0, 0, acc.width, acc.height);
      // ---- pass 2: fixed parts + plaque ----
      spin.visible = false; under.visible = false; fixed.visible = show; cardG.visible = !!cv;
      renderer.render(scene, camera);
      spin.visible = true; under.visible = true; fixed.visible = true;
    }
    return { render, acc, glc, wedges: wedges.length };
  };
})();
