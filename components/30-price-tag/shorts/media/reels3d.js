/* Reels3D: the giant price tier label as real geometry (Three.js r160 via P3.Stage).
   Every figure is an extruded, bevelled glyph traced from Archivo (media/glyphs-64.js). Each digit column is a real drum:
   ten figures around a wheel that turns about x, clipped to the label's band (lesson 6: rolling figures never cross other
   type), so figures roll in with true curvature. "$" and the commas are static glyphs. Sub-frame accumulation gives the
   spinning drums real motion blur. Payoff: the leading "1" lands last; a feathered light front then runs left to right and
   turns the white-enamel figures into polished candy red (the creators' billion-tier red), with a hot band, a raking key
   and a bloom peak. Exit: every drum rolls on to its blank slot and the static glyphs collapse.
   Seek-safe: renderAt(t) draws the frame for time t. */
(function () {
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const E = (n) => gsap.parseEase(n);
  const SLOTS = 11, DA = 2 * Math.PI / SLOTS;   // 0-9 + one blank slot

  window.Reels3D = function (o) {
    const st = o.stage, W = st.W, H = st.H, scene = st.scene, C = o.config, T = o.timing, G = o.glyphs;
    const lin = P3.lin, v3 = P3.v3;
    const v3s = (hex) => "vec3(" + P3.srgb(hex).map((x) => x.toFixed(4)).join(",") + ")";

    // ---------------- layout ----------------
    let colW = 0; for (let d = 0; d <= 9; d++) colW = Math.max(colW, G.g[String(d)][0]);
    const chars = C.price.split(""), items = []; let pen = 0;
    chars.forEach((ch, i) => {
      const g = G.g[ch]; if (!g) return;
      const isD = /[0-9]/.test(ch), adv = isD ? colW : (ch === "," ? C.commaAdv : g[0]);
      const x = ch === "," ? pen - (g[2] - (C.commaAdv - (g[3] - g[2])) / 2) : pen;   // centre the comma ink in its tightened advance
      items.push({ ch, isD, pen, x, adv, g });
      pen += adv + (i < chars.length - 1 ? C.tracking * G.upm : 0);
    });
    const it0 = items[0], itN = items[items.length - 1];
    const inkL = it0.x + it0.g[2];
    const inkR = itN.isD ? itN.pen + (colW + (itN.g[3] - itN.g[2])) / 2 : itN.x + itN.g[3];
    const s = C.maxInk / (inkR - inkL), fig = G.fig * s;
    const ox = -((inkL + inkR) / 2) * s;

    // ---------------- geometry ----------------
    const DEPTH = C.depth * fig, BT = C.bevel * fig, BS = C.bevel * fig * 0.7;
    const ext = (shapes) => {
      const g = new THREE.ExtrudeGeometry(shapes, { depth: DEPTH, bevelEnabled: true, bevelThickness: BT, bevelSize: BS, bevelOffset: -BS, bevelSegments: 4, curveSegments: 1 });
      g.translate(0, 0, -(DEPTH + BT)); g.computeVertexNormals(); return g;
    };
    const digitGeo = [];
    for (let d = 0; d <= 9; d++) {
      const g = G.g[String(d)], cxu = (g[2] + g[3]) / 2;
      digitGeo.push(ext(P3.shapesFromPath(g[1], (x, y) => [(x - cxu) * s, (-y - G.fig / 2) * s], 10)));
    }

    // ---------------- materials: white enamel -> candy red behind a feathered light front ----------------
    const U = {
      uFront: { value: -1e4 }, uFeather: { value: 0.5 * fig }, uHotW: { value: 0.22 * fig }, uHotAmp: { value: 0 },
      uSpecX: { value: -1e4 }, uSpecW: { value: 0.5 * fig }, uSpecAmp: { value: 0 }, uFig: { value: fig }, uDepth: { value: DEPTH + 2 * BT }, uBevelZ: { value: BT }
    };
    const K = C.colors;
    function patch(mat, isFace) {
      mat.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, U);
        sh.vertexShader = "varying vec3 vLP; varying vec3 vWP;\n" + sh.vertexShader.replace("#include <begin_vertex>",
          "#include <begin_vertex>\n vLP = position; vWP = (modelMatrix * vec4(position, 1.0)).xyz;");
        const head = "varying vec3 vLP; varying vec3 vWP; uniform float uFront, uFeather, uHotW, uHotAmp, uSpecX, uSpecW, uSpecAmp, uFig, uDepth, uBevelZ;\n" +
          "float igK(){ return 1.0 - smoothstep(uFront - uFeather, uFront + uFeather, vWP.x); }\n";
        const faceCol =
          "  float yy = clamp((vLP.y + uFig * 0.5) / uFig, 0.0, 1.0); float u = 1.0 - yy;\n" +
          "  vec3 rT = " + v3s(K.redFace[0]) + ", rM = " + v3s(K.redFace[1]) + ", rB = " + v3s(K.redFace[2]) + ";\n" +
          "  vec3 rs = u < 0.45 ? mix(rT, rM, u / 0.45) : mix(rM, rB, (u - 0.45) / 0.55);\n" +
          "  vec3 red = pow(rs, vec3(2.2));\n" +
          "  vec3 wht = mix(" + v3(lin(K.whiteFace[1])) + ", " + v3(lin(K.whiteFace[0])) + ", smoothstep(0.0, 0.85, yy));\n";
        const sideCol =
          "  float dz = clamp(-vLP.z / uDepth, 0.0, 1.0);\n" +
          "  float lipK = 1.0 - smoothstep(uBevelZ * 0.7, uBevelZ * 1.3, -vLP.z);\n" +
          "  vec3 red = mix(mix(" + v3(lin(K.redSide[0])) + ", " + v3(lin(K.redSide[1])) + ", smoothstep(0.0, 1.0, dz)), " + v3(lin(K.redLip)) + ", lipK);\n" +
          "  vec3 wht = mix(mix(" + v3(lin(K.whiteSide[0])) + ", " + v3(lin(K.whiteSide[1])) + ", dz), " + v3(lin(K.whiteFace[1])) + ", lipK);\n";
        sh.fragmentShader = head + sh.fragmentShader
          .replace("#include <color_fragment>", "#include <color_fragment>\n {\n" + (isFace ? faceCol : sideCol) + "  diffuseColor.rgb = mix(wht, red, igK());\n }")
          .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\n roughnessFactor = mix(0.42, roughnessFactor, igK());")
          .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n {\n" + (isFace ? faceCol : sideCol) +
            "  float k = igK();\n" +
            "  totalEmissiveRadiance += wht * (1.0 - k) * " + (isFace ? "0.42" : "0.04") + ";\n" +
            "  totalEmissiveRadiance += red * k * " + (isFace ? "0.62" : "0.12") + ";\n" +
            "  float hd = (vWP.x - uFront) / uHotW; totalEmissiveRadiance += " + v3(lin(K.hot)) + " * exp(-hd * hd) * uHotAmp;\n" +
            "  float sd = (vWP.x + vWP.y * 0.4 - uSpecX) / uSpecW; totalEmissiveRadiance += vec3(1.0, 0.94, 0.9) * exp(-sd * sd) * uSpecAmp * " + (isFace ? "1.0" : "0.5") + ";\n }");
      };
      return mat;
    }
    const pTop = new THREE.Plane(), pBot = new THREE.Plane();
    function mats(clip) {
      const face = patch(new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.0, roughness: 0.26, clearcoat: 1.0, clearcoatRoughness: 0.06, envMapIntensity: 0.55 }), true);
      const side = patch(new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.25, roughness: 0.3, clearcoat: 0.8, envMapIntensity: 0.9 }), false);
      if (clip) { [face, side].forEach((m) => { m.clippingPlanes = [pTop, pBot]; m.side = THREE.DoubleSide; }); }
      return [face, side];
    }
    const reelMats = mats(true), staticMats = mats(false);

    // ---------------- scene graph ----------------
    const label = new THREE.Group(); scene.add(label);
    const inner = new THREE.Group(); label.add(inner);       // punch / living turn
    const R = C.drum * fig, hb = fig * (0.5 + C.bandPad);
    const cols = [], statics = [];
    items.forEach((it) => {
      if (it.isD) {
        const grp = new THREE.Group(); grp.position.set(ox + (it.pen + colW / 2) * s, 0, -R); inner.add(grp);
        const meshes = digitGeo.map((g) => { const m = new THREE.Mesh(g, reelMats); grp.add(m); return m; });
        cols.push({ it, grp, meshes, target: Number(it.ch) });
      } else {
        const g = it.g, mapF = (x, y) => [ox + (it.x + x) * s, (-y - G.fig / 2) * s];
        const subs = g[1].match(/M[^M]*/g) || [g[1]];
        const narrow = (sp) => { const n = (sp.match(/-?\d+(\.\d+)?/g) || []).map(Number), xs = n.filter((_, i) => i % 2 === 0); return Math.max(...xs) - Math.min(...xs) < 0.22 * G.upm; };
        const m = new THREE.Group(); inner.add(m);
        if (subs.length > 1 && subs.some(narrow) && subs.some((sp) => !narrow(sp))) {
          const body = new THREE.Mesh(ext(P3.shapesFromPath(subs.filter((sp) => !narrow(sp)).join(""), mapF, 10)), staticMats);
          const bar = new THREE.Mesh(ext(P3.shapesFromPath(subs.filter(narrow).join(""), mapF, 10)), staticMats);
          bar.position.z = -BT * 1.6; m.add(body, bar);
        } else m.add(new THREE.Mesh(ext(P3.shapesFromPath(g[1], mapF, 10)), staticMats));
        const cxw = ox + (it.x + (g[2] + g[3]) / 2) * s, cyw = it.ch === "," ? -fig * 0.5 : 0;
        statics.push({ it, m, cxw, cyw });
      }
    });
    cols.forEach((c, j) => { c.j = j; c.fromRight = cols.length - 1 - j; });
    const railW = (inkR - inkL) * s + 0.34 * fig, railH = C.railH * fig, railR = railH * 0.5;
    const rs = new THREE.Shape(); rs.moveTo(-railW / 2 + railR, -railH / 2); rs.lineTo(railW / 2 - railR, -railH / 2);
    rs.absarc(railW / 2 - railR, 0, railR, -Math.PI / 2, Math.PI / 2, false); rs.lineTo(-railW / 2 + railR, railH / 2);
    rs.absarc(-railW / 2 + railR, 0, railR, Math.PI / 2, Math.PI * 1.5, false);
    const railGeo = new THREE.ExtrudeGeometry(rs, { depth: 0.08 * fig, bevelEnabled: true, bevelThickness: railH * 0.3, bevelSize: railH * 0.3, bevelOffset: -railH * 0.3, bevelSegments: 3, curveSegments: 16 });
    railGeo.translate(0, 0, -0.04 * fig); railGeo.computeVertexNormals();
    const railMat = new THREE.MeshPhysicalMaterial({ color: lin(K.rail), metalness: 0.6, roughness: 0.28, clearcoat: 1.0, clearcoatRoughness: 0.08, envMapIntensity: 1.1 });
    const rails = [1, -1].map((sg) => { const m = new THREE.Mesh(railGeo, railMat); m.userData.sg = sg; inner.add(m); return m; });
    const key = new THREE.DirectionalLight(0xfff2e2, 2.2); scene.add(key); scene.add(key.target);
    const hemi = new THREE.HemisphereLight(0xfff6ec, 0x2a1408, 0.6); scene.add(hemi);
    const LX = 0, LY = 0;   // the stage's principal point sits on (cx, cy): the label lives at the world origin, extrusion recedes straight back

    // ---------------- drum values ----------------
    const eRoll = (p) => 1 - Math.pow(1 - p, 3.2), eOut = E("power2.in");
    function landAt(c) { return T.lock - c.fromRight * T.landGap; }   // left to right, the last zero completes the billion on the lock
    function turns(c) { return C.turns + Math.floor(c.j / 4); }   // later landings spin a little longer
    function colValue(c, t) {
      const t1 = landAt(c), vEnd = SLOTS * turns(c) + c.target, dist = vEnd + 1;
      let v;
      if (t <= T.roll) v = -1;
      else if (t < t1) v = -1 + dist * eRoll((t - T.roll) / (t1 - T.roll));
      else { const tau = t - t1; v = vEnd + 0.12 * Math.sin(2 * Math.PI * tau / 0.16) * Math.exp(-tau / 0.055); }
      const to = T.out + c.j * T.outGap;
      if (t > to) v += (SLOTS - 1 - c.target + SLOTS) * eOut(clamp((t - to) / T.outDur, 0, 1));
      return v;
    }
    function maxSpeed(t) { let m = 0; cols.forEach((c) => (m = Math.max(m, Math.abs(colValue(c, t) - colValue(c, t - 1 / 60)) * 60))); return m; }

    // ---------------- pose ----------------
    const eIn = E("back.out(1.5)"), ePunch = E("power2.out");
    function pose(t) {
      const vis = t >= T.in && t < T.gone; label.visible = vis; if (!vis) return;
      const pi = clamp((t - T.in) / T.inDur, 0, 1), ei = eIn(pi);
      const po = clamp((t - T.out - 0.1) / 0.32, 0, 1), eo = E("power3.in")(po);
      label.position.set(LX, LY + 70 * (1 - ei) + 26 * eo, 0);
      label.rotation.set(-C.tilt - 1.2 * (1 - ei) - 0.5 * eo, 0, 0);
      label.scale.set(1, 1 / Math.cos(C.tilt), 1);
      // lock punch + a slow living turn through the hold
      const tl = t - T.lock, pk = tl > 0 ? 1 + 0.055 * Math.sin(Math.PI * clamp(tl / 0.24, 0, 1)) * Math.exp(-tl / 0.2) : 1;
      inner.scale.setScalar(pk);
      const hold = clamp((t - T.lock) / Math.max(0.5, T.out - T.lock), 0, 1);
      inner.rotation.set(0, t > T.lock ? -0.05 + 0.1 * E("sine.inOut")(hold) - 0.05 * (1 - Math.min(1, tl / 0.4)) * 0 : -0.05, 0);
      // drums
      cols.forEach((c) => {
        const v = colValue(c, t);
        c.meshes.forEach((m, k) => {
          let a = (k - v) * DA; a = a - 2 * Math.PI * Math.round(a / (2 * Math.PI));
          if (Math.abs(a) > C.arc) { m.visible = false; return; }
          m.visible = true; m.position.set(0, -R * Math.sin(a), R * Math.cos(a)); m.rotation.set(a, 0, 0);
        });
      });
      // slot rails: hug the band while the drums roll, then part and fold away on the lock
      const pr = clamp((t - T.lock) / 0.2, 0, 1), er = E("power3.in")(pr);
      rails.forEach((m) => {
        m.visible = pr < 1;
        m.position.set(ox + ((inkL + inkR) / 2) * s, m.userData.sg * (hb + railH * 0.5 + 0.55 * fig * er), 0.03 * fig);
        m.scale.set(1 - 0.15 * er, Math.max(0.001, 1 - er), 1);
      });
      // static glyphs pop in with the label and collapse on exit
      statics.forEach((st2, i) => {
        const pe = clamp((t - T.out - 0.04 - i * 0.03) / 0.22, 0, 1), sc = 1 - E("back.in(1.6)")(pe);
        st2.m.scale.setScalar(Math.max(0.001, sc)); st2.m.position.set(st2.cxw * (1 - sc), st2.cyw * (1 - sc), 0);
      });
      label.updateMatrixWorld(true);
      pTop.set(new THREE.Vector3(0, -1, 0), hb).applyMatrix4(label.matrixWorld);
      pBot.set(new THREE.Vector3(0, 1, 0), hb).applyMatrix4(label.matrixWorld);
    }

    // ---------------- light ----------------
    const x0 = LX + ox + inkL * s, x1 = LX + ox + inkR * s, eFront = E("expo.out"), eSpec = E("power2.inOut");
    function lightAt(t) {
      const tl = t - T.lock, fp = clamp(tl / T.frontDur, 0, 1), fe = eFront(fp);
      U.uFront.value = tl < 0 ? x0 - 3 * U.uFeather.value - 2 * U.uHotW.value : (x0 - U.uFeather.value - U.uHotW.value) + (x1 - x0 + 2 * U.uFeather.value + 3 * U.uHotW.value) * fe;
      U.uHotAmp.value = tl < 0 ? 0 : 3.0 * (1 - E("power2.in")(clamp(tl / (T.frontDur + 0.14), 0, 1)));
      let sAmp = 0, sx = -1e4;
      for (const at of T.spec) {
        const sp = clamp((t - at) / 0.75, 0, 1);
        if (sp > 0 && sp < 1) { sx = (x0 - 1.2 * fig) + (x1 - x0 + 2.6 * fig) * eSpec(sp); sAmp = C.spec * Math.sin(Math.PI * sp); }
      }
      U.uSpecX.value = sx; U.uSpecAmp.value = sAmp;
      const rk = E("power2.inOut")(clamp((tl + 0.05) / 0.6, 0, 1)), ka = -0.95 + 1.75 * rk;
      key.position.set(LX + Math.sin(ka) * 900, LY + 1200, -500 + 900);
      key.target.position.set(LX, LY, 0);
      key.intensity = 2.2 + 3.0 * Math.exp(-Math.pow((tl - 0.12) / 0.16, 2));
      const env = tl < 0 ? 0 : tl < 0.1 ? 1 : Math.exp(-(tl - 0.1) / 0.3);
      return 0.16 + 0.85 * env;
    }

    function renderAt(t) {
      const bloom = lightAt(t);
      let KS = 1;
      if (t >= T.in && t < T.gone) {
        const sp = maxSpeed(t) / 60;                      // slots per half frame
        if (sp > 0.04) KS = Math.min(24, Math.ceil(sp / 0.035));
        if (t < T.in + T.inDur * 0.7) KS = Math.max(KS, 8);
        if (t > T.out && t < T.out + 0.45) KS = Math.max(KS, 8);
      }
      st.render(KS, (k, KK) => pose(KK > 1 ? t - (1 / 60) * (1 - k / (KK - 1)) : t), { bloom, threshold: 1.05 });
    }
    window.addEventListener("hf-seek", (e) => { if (e && e.detail && typeof e.detail.time === "number") renderAt(e.detail.time); });
    return { renderAt, fig, inkW: (inkR - inkL) * s };
  };
})();
