/* Tag3D: the price pill as a real hang tag (Three.js r160 via P3.Stage).
   A bevelled smoked-acrylic pill with a top tab, a chrome grommet, a cotton cord looped through it to a pin on the car,
   edge-lit mint acrylic sides (the creators' glowing mint outline, made physical), and the price printed on the face as
   rolling odometer digits (canvas texture, masked columns, smeared on fast travel).
   Physics: a damped pendulum (swing) + torsional spring (twist) + pitch, driven by the tracked anchor's acceleration,
   precomputed at build time so any time t renders the same frame. Lock-in: the last digit lands, a neon ignition runs
   round the rim from the tab, the digits flash, a soft specular band crosses the clearcoat. Exit: the cord snaps and the
   tag drops out of frame, sub-frame motion blur on the fall. */
(function () {
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const E = (n) => gsap.parseEase(n);

  window.Tag3D = function (o) {
    const st = o.stage, W = st.W, H = st.H, scene = st.scene, C = o.config, D = C.tag, T = o.timing, G = o.glyphs;
    const lin = P3.lin, v3 = P3.v3;

    // ---------------- tag outline (origin = grommet hole centre, y up) ----------------
    const R = D.h / 2, yt = -D.holeAbove, yb = yt - D.h, yc = yt - R, ytab = yt + D.tabH, tw = D.tabW, rt = D.tabR, f = D.fillet;
    const xl = -D.w / 2 + R, xr = D.w / 2 - R;
    const sh = new THREE.Shape();
    sh.moveTo(xl, yt); sh.lineTo(-tw / 2 - f, yt);
    sh.quadraticCurveTo(-tw / 2, yt, -tw / 2, yt + f); sh.lineTo(-tw / 2, ytab - rt);
    sh.quadraticCurveTo(-tw / 2, ytab, -tw / 2 + rt, ytab); sh.lineTo(tw / 2 - rt, ytab);
    sh.quadraticCurveTo(tw / 2, ytab, tw / 2, ytab - rt); sh.lineTo(tw / 2, yt + f);
    sh.quadraticCurveTo(tw / 2, yt, tw / 2 + f, yt); sh.lineTo(xr, yt);
    sh.absarc(xr, yc, R, Math.PI / 2, -Math.PI / 2, true); sh.lineTo(xl, yb);
    sh.absarc(xl, yc, R, -Math.PI / 2, Math.PI / 2, true);
    const hole = new THREE.Path(); hole.absarc(0, 0, D.hole, 0, Math.PI * 2, false); sh.holes.push(hole);
    const minX = -D.w / 2, maxY = ytab, bw = D.w, bh = ytab - yb;
    const UVGen = {
      generateTopUV: (g, v, a, b, c) => [a, b, c].map((i) => new THREE.Vector2((v[i * 3] - minX) / bw, (v[i * 3 + 1] - yb) / bh)),
      generateSideWallUV: () => [new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1), new THREE.Vector2(0, 1)]
    };
    const BT = D.bevel, BS = D.bevel, DEP = D.depth;
    const geo = new THREE.ExtrudeGeometry(sh, { depth: DEP, bevelEnabled: true, bevelThickness: BT, bevelSize: BS, bevelOffset: -BS, bevelSegments: 5, curveSegments: 40, UVGenerator: UVGen });
    geo.translate(0, 0, -DEP / 2); geo.computeVertexNormals();
    const ZF = DEP / 2 + BT;   // front cap z

    // ---------------- face print: canvas texture (graphite face, odometer window, white digits) ----------------
    const TX = 1024 / bw, CW = 1024, CH = Math.round(bh * TX);
    const cv = document.createElement("canvas"); cv.width = CW; cv.height = CH;
    const ctx = cv.getContext("2d");
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter;
    const cx = (X) => (X - minX) * TX, cy = (Y) => (maxY - Y) * TX;
    // price layout (font units -> tag units)
    const fig = G.fig, sF = (C.figH) / fig;
    const chars = C.price.split("");
    let colW = 0; for (let d = 0; d <= 9; d++) colW = Math.max(colW, G.g[String(d)][0]);
    const items = []; let pen = 0;
    chars.forEach((ch, i) => {
      const g = G.g[ch]; if (!g) return;
      const isD = /[0-9]/.test(ch), adv = isD ? colW : g[0];
      items.push({ ch, isD, x: pen, adv, g });
      pen += adv + (i < chars.length - 1 ? C.tracking * G.upm : 0);
    });
    const first = items[0], last = items[items.length - 1];
    const inkL = first.x + (first.isD ? (colW - (first.g[3] - first.g[2])) / 2 : first.g[2]);
    const inkR = last.x + (last.isD ? (colW + (last.g[3] - last.g[2])) / 2 : last.g[3]);
    const ox = -((inkL + inkR) / 2) * sF;                          // optical centre of the price on the pill
    const baseY = yc - C.figH / 2 + C.figDy;                       // baseline in tag units (figures centred on the pill)
    const paths = {}; Object.keys(G.g).forEach((k) => (paths[k] = new Path2D(G.g[k][1])));
    const digitItems = items.filter((it) => it.isD);
    digitItems.forEach((it, j) => { it.target = Number(it.ch); it.j = j; });
    const bandPad = C.figH * 0.2, bandTop = baseY + C.figH + bandPad, bandBot = baseY - bandPad * 0.75;
    const pitch = C.figH * 1.32;

    function glyphAt(ch, xUnits, yBaseUnits) {   // draw glyph with origin (baseline-left) at tag units
      ctx.setTransform(TX * sF, 0, 0, TX * sF, cx(xUnits), cy(yBaseUnits)); ctx.fill(paths[ch]);
    }
    function colValue(it, t) {   // continuous odometer value for a digit column at time t
      const t0 = T.roll, t1 = T.lock - (digitItems.length - 1 - it.j) * T.landGap;
      const dist = 10 * (C.turns + it.j) + it.target;
      if (t <= t0) return 0;
      if (t >= t1) { const tau = t - t1; return dist + 0.16 * Math.sin(2 * Math.PI * tau / 0.17) * Math.exp(-tau / 0.06); }
      const p = (t - t0) / (t1 - t0);
      return dist * (1 - Math.pow(1 - p, 3.2));
    }
    function colSpeed(it, t) { return Math.abs(colValue(it, t) - colValue(it, t - 1 / 60)) * 60; }
    function drawFace(t) {
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, CW, CH);
      // graphite face: 3-stop vertical gradient
      const gr = ctx.createLinearGradient(0, cy(yt), 0, cy(yb));
      gr.addColorStop(0, C.colors.faceTop); gr.addColorStop(0.45, C.colors.faceMid); gr.addColorStop(1, C.colors.faceBot);
      ctx.fillStyle = gr; ctx.fillRect(0, 0, CW, CH);
      // glass: a soft diagonal sheen across the upper face and a lit inner lip along the top edge
      const sg = ctx.createLinearGradient(cx(-D.w / 2), cy(yt), cx(D.w * 0.1), cy(yb + D.h * 0.15));
      sg.addColorStop(0, "rgba(255,255,255,0.13)"); sg.addColorStop(0.42, "rgba(255,255,255,0.05)"); sg.addColorStop(0.43, "rgba(255,255,255,0.0)"); sg.addColorStop(1, "rgba(255,255,255,0.0)");
      ctx.fillStyle = sg; ctx.fillRect(0, 0, CW, CH);
      ctx.save(); ctx.strokeStyle = C.colors.lip; ctx.globalAlpha = 0.55; ctx.lineWidth = 2.2 * TX;
      ctx.beginPath(); ctx.moveTo(cx(xl), cy(yt - BS - 2.5)); ctx.lineTo(cx(xr), cy(yt - BS - 2.5)); ctx.stroke();
      ctx.globalAlpha = 0.28; ctx.beginPath(); ctx.arc(cx(xl), cy(yc), (R - BS - 2.5) * TX, Math.PI * 1.08, Math.PI * 1.5); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx(xr), cy(yc), (R - BS - 2.5) * TX, Math.PI * 1.5, Math.PI * 1.92); ctx.stroke(); ctx.restore();
      // tab: a touch lighter, a thin printed hairline where the tab meets the pill
      ctx.fillStyle = "rgba(255,255,255,0.05)"; ctx.fillRect(cx(-tw / 2), cy(ytab), tw * TX, (ytab - yt) * TX);
      // odometer window: a soft recessed band behind the digits
      const wx0 = cx(ox + inkL * sF - C.figH * 0.16), wx1 = cx(ox + inkR * sF + C.figH * 0.16), wy0 = cy(bandTop), wy1 = cy(bandBot);
      const wg = ctx.createLinearGradient(0, wy0, 0, wy1);
      wg.addColorStop(0, "rgba(0,0,0,0.42)"); wg.addColorStop(0.18, "rgba(0,0,0,0.16)"); wg.addColorStop(0.82, "rgba(0,0,0,0.12)"); wg.addColorStop(1, "rgba(0,0,0,0.30)");
      ctx.fillStyle = wg; roundRect(wx0, wy0, wx1 - wx0, wy1 - wy0, 10 * TX); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.10)"; ctx.fillRect(wx0 + 8 * TX, wy1 - 1.2 * TX, wx1 - wx0 - 16 * TX, 1.2 * TX);
      // digits: white with a dark drop shadow
      const dg = ctx.createLinearGradient(0, cy(baseY + C.figH), 0, cy(baseY));
      dg.addColorStop(0, "#FFFFFF"); dg.addColorStop(1, C.colors.digitBot);
      ctx.fillStyle = dg;
      ctx.shadowColor = "rgba(0,0,0,0.6)"; ctx.shadowBlur = 5 * TX; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 3.2 * TX;
      items.forEach((it) => {
        const x0 = ox + it.x * sF;
        if (!it.isD) { ctx.globalAlpha = 1; glyphAt(it.ch, x0, baseY); return; }
        const v = colValue(it, t), sp = colSpeed(it, t);
        const smear = sp / 60 * pitch;                               // half-frame travel in tag units
        const N = smear > 6 ? Math.min(9, Math.ceil(smear / 3)) : 1;
        const aN = N > 1 ? 1 - Math.pow(0.04, 1 / N) : 1;            // N fully overlapped copies reach 96% coverage
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.beginPath(); ctx.rect(cx(x0 - 4), cy(bandTop), (colW * sF + 8) * TX, (bandTop - bandBot) * TX); ctx.clip();
        for (let n = 0; n < N; n++) {
          const vv = v - (N > 1 ? (n / (N - 1)) * (sp / 60) : 0);
          const base = Math.floor(vv), fr = vv - base;
          ctx.globalAlpha = aN;
          for (let k = 0; k < 2; k++) {
            const dgt = ((base + k) % 10 + 10) % 10, ch = String(dgt), g = G.g[ch];
            const gx = x0 + ((colW - (g[3] - g[2])) / 2 - g[2]) * sF;   // centre the ink in the tabular column
            glyphAt(ch, gx, baseY + (fr - k) * pitch);
          }
        }
        ctx.restore();
      });
      ctx.globalAlpha = 1; ctx.shadowColor = "transparent";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      tex.needsUpdate = true;
    }
    function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

    // ---------------- materials ----------------
    const U = { uDigitBase: { value: C.light.digitBase }, uFlash: { value: 0 }, uSpecX: { value: -1e4 }, uSpecAmp: { value: 0 }, uIgn: { value: 0 }, uRimBase: { value: 0.3 }, uRimLit: { value: 0 }, uHead: { value: 0 }, uYc: { value: yc } };
    const mint = lin(C.colors.mint), mintHot = lin(C.colors.mintHot);
    const capMat = new THREE.MeshPhysicalMaterial({ map: tex, roughness: 0.38, metalness: 0.0, clearcoat: 1.0, clearcoatRoughness: 0.08, envMapIntensity: C.light.env });
    capMat.onBeforeCompile = (s) => {
      Object.assign(s.uniforms, U);
      s.vertexShader = "varying vec3 vObjN; varying vec3 vLP;\n" + s.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vObjN = normal; vLP = position;");
      s.fragmentShader = "varying vec3 vObjN; varying vec3 vLP; uniform float uFlash, uSpecX, uSpecAmp, uDigitBase;\n" + s.fragmentShader
        .replace("#include <map_fragment>",
          "vec4 texel = texture2D(map, vMapUv); bool front = vObjN.z > 0.0;\n" +
          " if (!front) texel = vec4(" + v3(lin(C.colors.back)) + ", 1.0);\n diffuseColor *= texel;")
        .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n if (front) {\n" +
          "  float lum = dot(texel.rgb, vec3(0.2126, 0.7152, 0.0722));\n" +
          "  float dm = smoothstep(0.55, 0.9, lum); totalEmissiveRadiance += mix(texel.rgb, vec3(1.0), 0.6) * dm * (uDigitBase + uFlash);\n" +
          "  float sd = (vLP.x + vLP.y * 0.45 - uSpecX) / 30.0; totalEmissiveRadiance += vec3(1.0, 0.98, 0.94) * exp(-sd * sd) * uSpecAmp * (1.0 - 0.85 * dm);\n }");
    };
    const rimMat = new THREE.MeshPhysicalMaterial({ color: lin(C.colors.rimBody), roughness: 0.16, metalness: 0.0, clearcoat: 1.0, clearcoatRoughness: 0.05, envMapIntensity: 1.0, emissive: 0xffffff, emissiveIntensity: 1 });
    rimMat.onBeforeCompile = (s) => {
      Object.assign(s.uniforms, U);
      s.vertexShader = "varying vec3 vLP;\n" + s.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vLP = position;");
      s.fragmentShader = "varying vec3 vLP; uniform float uIgn, uRimBase, uRimLit, uHead, uYc;\n" + s.fragmentShader
        .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n {\n" +
          "  float ang = abs(atan(vLP.x, vLP.y - uYc));\n" +            // 0 at the tab, pi at the bottom centre
          "  float lit = 1.0 - smoothstep(uIgn - 0.35, uIgn, ang);\n" +
          "  float hd = (ang - uIgn + 0.12) / 0.16; float head = exp(-hd * hd) * uHead;\n" +
          "  totalEmissiveRadiance = " + v3(mint) + " * (uRimBase + lit * uRimLit) + " + v3(mintHot) + " * head;\n }");
    };
    const tag = new THREE.Mesh(geo, [capMat, rimMat]);
    tag.castShadow = false;
    const chrome = new THREE.MeshPhysicalMaterial({ color: lin("#E3E6EA"), metalness: 1.0, roughness: 0.2, clearcoat: 0.6, envMapIntensity: 1.25 });
    const gromGeo = new THREE.TorusGeometry(D.hole + 2.6, 3.4, 14, 44);
    const gF = new THREE.Mesh(gromGeo, chrome); gF.position.z = ZF + 0.6;
    const gB = new THREE.Mesh(gromGeo, chrome); gB.position.z = -ZF - 0.6;
    const cord = new THREE.MeshStandardMaterial({ color: lin(C.colors.cord), roughness: 0.82, metalness: 0 });
    const cylGeo = new THREE.CylinderGeometry(1, 1, 1, 10, 1, false);
    const strandF = new THREE.Mesh(cylGeo, cord), strandB = new THREE.Mesh(cylGeo, cord);
    const knot = new THREE.Mesh(new THREE.SphereGeometry(C.cordR * 2.1, 18, 12), cord);
    const brass = new THREE.MeshPhysicalMaterial({ color: lin(C.colors.pin), metalness: 1.0, roughness: 0.24, clearcoat: 0.8, clearcoatRoughness: 0.1, envMapIntensity: 1.3 });
    const pin = new THREE.Mesh(new THREE.SphereGeometry(D.pinR, 28, 18), brass);

    const G0 = new THREE.Group();          // at the anchor, rotation z = swing
    const H0 = new THREE.Group();          // hangs below on the cord: twist (y) and pitch (x)
    H0.add(tag, gF, gB); G0.add(H0); scene.add(G0);
    scene.add(strandF, strandB, knot, pin);
    const key = new THREE.DirectionalLight(0xffffff, 2.0); key.position.set(-500, 800, 900); scene.add(key);
    const hemi = new THREE.HemisphereLight(0xffffff, 0x302418, 0.7); scene.add(hemi);

    // ---------------- anchor path (tracked car points, smoothed) ----------------
    const shots = o.anchors;          // [{t0, t1, pts:[[x,y],...] at 30 fps from the shot's in-point, key, warm}]
    shots.forEach((s) => {
      const p = s.pts, n = p.length, sm = [];
      for (let i = 0; i < n; i++) { let sx = 0, sy = 0, c = 0; for (let k = -3; k <= 3; k++) { const j = clamp(i + k, 0, n - 1); sx += p[j][0]; sy += p[j][1]; c++; } sm.push([sx / c + (s.dx || 0), sy / c + (s.dy || 0)]); }
      s.sm = sm;
    });
    function shotAt(t) { for (let i = shots.length - 1; i >= 0; i--) if (t >= shots[i].t0) return i; return 0; }
    function anchorAt(t) {        // screen px
      const s = shots[shotAt(t)], u = clamp((t - s.t0) * 30, 0, s.sm.length - 1), i = Math.floor(u), fr = u - i, a = s.sm[i], b = s.sm[Math.min(i + 1, s.sm.length - 1)];
      return [a[0] + (b[0] - a[0]) * fr, a[1] + (b[1] - a[1]) * fr];
    }
    function accelX(t) {          // px/s^2, within a shot only
      const s = shots[shotAt(t)], h = 1 / 30;
      if (t - h < s.t0 || t + h >= s.t1) return 0;
      return (anchorAt(t + h)[0] - 2 * anchorAt(t)[0] + anchorAt(t - h)[0]) / (h * h);
    }

    // ---------------- physics, precomputed ----------------
    const DT = 1 / 240, N = Math.ceil((T.end + 0.2) / DT) + 2;
    const th = new Float32Array(N), ph = new Float32Array(N);
    {
      const wS = 2 * Math.PI / C.phys.swingPeriod, zS = C.phys.swingDamp, wT = 2 * Math.PI / C.phys.twistPeriod, zT = C.phys.twistDamp, Leff = C.phys.leff;
      let a = 0, av = 0, b = 0, bv = 0, kicked = {};
      for (let i = 0; i < N; i++) {
        const t = i * DT;
        if (t < T.in) { a = C.phys.swing0; av = 0; b = C.phys.twist0; bv = 0; }
        else {
          for (const k of C.phys.kicks) if (!kicked[k.t] && t >= k.t) { kicked[k.t] = 1; av += k.swing; bv += k.twist; }
          const ax = accelX(t) * C.phys.accelGain;
          const aa = -wS * wS * Math.sin(a) - (ax / Leff) * Math.cos(a) - 2 * zS * wS * av;
          av += aa * DT; a += av * DT;
          const ba = -wT * wT * b - 2 * zT * wT * bv; bv += ba * DT; b += bv * DT;
        }
        th[i] = a; ph[i] = b + C.phys.twistRest;
      }
    }
    const sample = (arr, t) => { const u = clamp(t / DT, 0, N - 1.001), i = Math.floor(u), fr = u - i; return arr[i] + (arr[i + 1] - arr[i]) * fr; };

    // ---------------- pose at time t ----------------
    const eUnf = E("power2.in"), eScale = E("back.out(1.6)");
    const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
    function strand(m, A, B, r) {
      const d = tmpB.copy(B).sub(A), len = d.length();
      if (len < 0.5) { m.visible = false; return; }
      m.visible = true; m.position.copy(A).addScaledVector(d, 0.5);
      m.quaternion.setFromUnitVectors(up, d.normalize()); m.scale.set(r, len, r);
    }
    function pose(t) {
      const vis = t >= T.in && t < T.gone;
      G0.visible = H0.visible = vis; strandF.visible = strandB.visible = knot.visible = pin.visible = vis;
      if (!vis) return;
      const an = anchorAt(Math.min(t, T.out)), AX = an[0] - W / 2, AY = H / 2 - an[1];
      const ap = anchorAt(t), PX = ap[0] - W / 2, PY = H / 2 - ap[1];
      const sIdx = shotAt(t);
      // unfurl out of the pin: cord length and scale
      const u = clamp((t - T.in) / T.unfurl, 0, 1);
      const cordL = shots[sIdx].cord || C.cord;
      let L = 6 + (cordL - 6) * eUnf(u), sc = 0.3 + 0.7 * eScale(u);
      const tt = t - (T.in + T.unfurl);
      if (tt > 0) L += 10 * Math.sin(2 * Math.PI * tt / 0.2) * Math.exp(-tt / 0.1);    // taut-cord bounce
      // lock-in punch
      const tl = t - T.lock; if (tl > 0) sc *= 1 + 0.05 * Math.sin(Math.PI * clamp(tl / 0.22, 0, 1)) * Math.exp(-tl / 0.18);
      let swing = sample(th, Math.min(t, T.out)), twist = sample(ph, Math.min(t, T.out));
      const pitch = C.phys.pitch0 * Math.exp(-Math.max(0, t - T.in) / 0.35) * Math.cos(2 * Math.PI * Math.max(0, t - T.in) / 0.55);
      G0.position.set(AX, AY, 0); G0.rotation.set(0, 0, swing);
      H0.position.set(0, -L, 0); H0.rotation.set(pitch, twist, 0, "YXZ"); H0.scale.setScalar(sc);
      const pinS = (t < T.in + 0.08 ? 0.2 + 0.8 * clamp((t - T.in) / 0.08, 0, 1) : 1) * (t > T.out + 0.1 ? Math.max(0, 1 - (t - T.out - 0.1) / 0.14) : 1);
      pin.position.set(PX, PY + D.pinR * 0.35, 3); pin.scale.setScalar(Math.max(0.001, pinS)); knot.position.set(PX, PY - 4, 2); knot.scale.setScalar(Math.max(0.001, pinS));
      // exit: the cord snaps at the pin, the tag drops with a spin; the cord recoils into the pin
      const te = t - T.out;
      if (te > 0) {
        G0.updateMatrixWorld(true);
        const g = C.phys.dropG, dy = 260 * te - 0.5 * g * te * te, dx = C.phys.dropDx * te;
        G0.position.set(AX + dx, AY + dy, 0); G0.rotation.z = swing + C.phys.dropSpin * te;
        H0.rotation.y = twist + 6.5 * te;
      }
      G0.updateMatrixWorld(true);
      // cord: two strands from the pin through the grommet (one in front of the tag, one behind)
      tmpA.set(PX, PY - 3, 0);
      const holeTop = (z) => H0.localToWorld(new THREE.Vector3(0, D.hole * 0.55, z));
      let BF = holeTop(ZF * 0.55), BB = holeTop(-ZF * 0.55);
      if (te > 0) { const k = clamp(te / 0.09, 0, 1); BF = BF.lerp(tmpA.clone(), k); BB = BB.lerp(tmpA.clone(), k); }
      strand(strandF, tmpA, BF, C.cordR); strand(strandB, tmpA, BB, C.cordR);
      // light per shot (daylight vs sunset) so the tag sits in the footage
      const s = shots[sIdx];
      key.color.set(s.key); key.intensity = s.keyI; key.position.set(s.keyPos[0], s.keyPos[1], s.keyPos[2]);
      hemi.color.set(s.sky); hemi.groundColor.set(s.ground);
    }
    function centreAt(t) { pose(t); const v = new THREE.Vector3(0, yc, 0); H0.localToWorld(v); return v; }

    // ---------------- light state ----------------
    const eIgn = E("power3.out");
    function lightAt(t) {
      const tl = t - T.lock;
      U.uIgn.value = tl < 0 ? 0 : (Math.PI + 0.4) * eIgn(clamp(tl / 0.32, 0, 1));
      U.uHead.value = tl < 0 ? 0 : C.light.head * (1 - clamp(tl / 0.42, 0, 1));
      U.uRimBase.value = C.light.rimBase;
      U.uRimLit.value = tl < 0 ? 0 : C.light.rimHold + (C.light.rimPeak - C.light.rimHold) * Math.exp(-Math.max(0, tl - 0.1) / 0.3);
      U.uFlash.value = tl < 0 ? 0 : C.light.flash * (tl < 0.1 ? 1 : Math.exp(-(tl - 0.1) / 0.12));   // 3-frame peak, figures stay crisp
      const sp = clamp((t - T.lock - C.light.specAt) / C.light.specDur, 0, 1);
      U.uSpecX.value = -D.w / 2 - 80 + (D.w + 200) * E("power2.inOut")(sp);
      U.uSpecAmp.value = sp > 0 && sp < 1 ? C.light.spec * Math.sin(Math.PI * sp) : 0;
      return tl < 0 ? C.light.bloom : C.light.bloom + C.light.bloomPeak * (tl < 0.1 ? 1 : Math.exp(-(tl - 0.1) / 0.3));
    }

    function renderAt(t) {
      drawFace(t);
      const bloom = lightAt(t);
      // sub-frame motion blur when the tag travels fast (unfurl, swing peaks, the drop)
      let K = 1;
      const tMin = Math.max(T.in, shots[shotAt(t)].t0);      // sub-frames never reach back across a cut
      const tb = Math.max(tMin, t - 1 / 60);
      if (t >= T.in && tb < t) {
        const a = centreAt(t), b = centreAt(tb);
        const d = a.distanceTo(b) + Math.abs(sample(ph, t) - sample(ph, tb)) * 120;
        if (d > 3) K = Math.min(8, Math.ceil(d / 3));
      }
      st.render(K, (k, KK) => pose(KK > 1 ? tb + (t - tb) * (k / (KK - 1)) : t), { bloom, threshold: 1.0 });
    }
    window.addEventListener("hf-seek", (e) => { if (e && e.detail && typeof e.detail.time === "number") renderAt(e.detail.time); });
    return { renderAt, anchorAt };
  };
})();
