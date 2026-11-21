/* Coin3D: the creator's avatar as a real minted medallion (Three.js r160, global THREE).
   A lathe-turned gold rim (rounded edge, raised lip, recessed bed), the portrait set under a domed glass cabochon,
   and an engine-turned gold back with the handle mark struck in relief, so the coin has true thickness when it spins
   (edge-on it is a gold bar: variant B uses that as its typing caret). Lit by a PMREM studio environment, a warm key,
   a hemisphere fill and a raking light that the payoff sweeps across the rim and the glass. ACES tone mapping.
   Seek-safe: nothing animates on its own; render(state) draws one frame from the state the caller computes from time.
   Shared by a/ and b/ (identical copies). */
(function () {
  window.Coin3D = function (o) {
    const SZ = o.size, SS = o.ss || 2, R = o.R, H = o.h || 0.11, RI = o.ri || 0.79, HF = H * 0.5;
    const canvas = document.createElement("canvas");
    canvas.width = SZ * SS; canvas.height = SZ * SS;
    canvas.style.cssText = "position:absolute;left:0;top:0;width:" + SZ + "px;height:" + SZ + "px;display:block";
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(1); renderer.setSize(SZ * SS, SZ * SS, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = o.exposure || 1.0;
    const scene = new THREE.Scene();
    const FOV = 14, DIST = (SZ / 2) / Math.tan((FOV / 2) * Math.PI / 180);
    const camera = new THREE.PerspectiveCamera(FOV, 1, 10, DIST * 4);
    camera.position.set(0, 0, DIST); camera.lookAt(0, 0, 0);

    // ---------- studio environment: warm softbox above, a vertical strip right, a dim kicker left, dark floor ----------
    const env = new THREE.Scene();
    env.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(1.55,1.38,1.15), hor = vec3(0.40,0.31,0.24), low = vec3(0.045,0.035,0.03);" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.0, 0.75, y)) : mix(hor, low, smoothstep(0.0, 0.45, -y)); gl_FragColor = vec4(c, 1.0); }"
    })));
    const panel = (w, h, x, y, z, k) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k * 0.95, k * 0.86), side: THREE.DoubleSide }));
      m.position.set(x, y, z); m.lookAt(0, 0, 0); env.add(m);
    };
    panel(36, 9, -6, 30, 26, 2.6);    // top-front softbox: the lit upper lip of the rim
    panel(5, 34, 34, 4, 22, 2.2);     // right strip: a vertical line that runs round the rim as it spins
    panel(5, 26, -36, -4, 16, 0.9);   // dim left kicker
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(env, 0.0, 0.1, 200).texture;

    // ---------- lights ----------
    const key = new THREE.DirectionalLight(0xfff0dc, 1.6); key.position.set(-0.55, 0.75, 1).multiplyScalar(DIST); scene.add(key);
    const rake = new THREE.DirectionalLight(0xffe9c8, 0); scene.add(rake);
    scene.add(new THREE.HemisphereLight(0xfff1e0, 0x22180e, 0.5));

    // ---------- rim: one lathe profile, back lip -> back face -> rounded edge -> front face -> front lip ----------
    const P = [], D2R = Math.PI / 180;
    const arc = (cx, cy, r, a0, a1, n) => { for (let i = 0; i <= n; i++) { const a = (a0 + (a1 - a0) * i / n) * D2R; P.push(new THREE.Vector2(cx + r * Math.cos(a), cy + r * Math.sin(a))); } };
    const lip = 0.035, edge = Math.min(0.06, H * 0.55);
    P.push(new THREE.Vector2(RI, -HF));
    arc(RI + lip, -(H - lip), lip, 180, 270, 6);
    arc(1 - edge, -(H - edge), edge, 270, 360, 10);
    arc(1 - edge, H - edge, edge, 0, 90, 10);
    arc(RI + lip, H - lip, lip, 90, 180, 6);
    P.push(new THREE.Vector2(RI, HF));
    const rimGeo = new THREE.LatheGeometry(P, 160);
    rimGeo.rotateX(Math.PI / 2); rimGeo.scale(R, R, R);
    const gold = new THREE.Color(o.gold ? o.gold[0] : 1.0, o.gold ? o.gold[1] : 0.6, o.gold ? o.gold[2] : 0.17);   // deep enough that ACES keeps it gold at the peak
    const rimMat = new THREE.MeshPhysicalMaterial({ color: gold, emissive: new THREE.Color(1.0, 0.55, 0.12), emissiveIntensity: 0, metalness: 1, roughness: 0.2, clearcoat: 0.5, clearcoatRoughness: 0.08, envMapIntensity: 1.0, side: THREE.DoubleSide });
    const U = { uBand: { value: -9 }, uBandW: { value: 0.16 }, uBandAmp: { value: 0 } };
    const bandPatch = (mat, k) => {
      mat.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, U);
        sh.vertexShader = "varying vec3 vVP;\n" + sh.vertexShader.replace("#include <project_vertex>", "#include <project_vertex>\n vVP = mvPosition.xyz;");
        sh.fragmentShader = "varying vec3 vVP; uniform float uBand, uBandW, uBandAmp;\n" + sh.fragmentShader.replace("#include <emissivemap_fragment>",
          "#include <emissivemap_fragment>\n { float d = ((vVP.x + vVP.y * 0.5) / " + R.toFixed(3) + " - uBand) / uBandW;" +
          " totalEmissiveRadiance += vec3(1.0, 0.66, 0.24) * exp(-d * d) * uBandAmp * " + k.toFixed(3) + "; }");
      };
    };
    bandPatch(rimMat, 1.25);
    const rim = new THREE.Mesh(rimGeo, rimMat);

    // ---------- face: portrait (inner shadow baked from the rim wall) under a domed glass cabochon ----------
    const tc = document.createElement("canvas"); tc.width = tc.height = 512;
    const g = tc.getContext("2d");
    g.drawImage(o.avatar, 0, 0, 512, 512);
    const vg = g.createRadialGradient(256, 256, 256 * 0.70, 256, 256, 256);
    vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(0.75, "rgba(0,0,0,.22)"); vg.addColorStop(1, "rgba(0,0,0,.62)");
    g.fillStyle = vg; g.fillRect(0, 0, 512, 512);
    const faceTex = new THREE.CanvasTexture(tc); faceTex.colorSpace = THREE.SRGBColorSpace; faceTex.anisotropy = 4;
    const faceMat = new THREE.MeshBasicMaterial({ map: faceTex, toneMapped: false });
    const faceGeo = new THREE.CircleGeometry(RI * R * 1.004, 128); faceGeo.translate(0, 0, HF * R);
    const face = new THREE.Mesh(faceGeo, faceMat);
    const a = RI * R, sag = 0.07 * R, rad = (a * a + sag * sag) / (2 * sag), th = Math.asin(a / rad);
    const domeGeo = new THREE.SphereGeometry(rad, 96, 24, 0, Math.PI * 2, 0, th);
    domeGeo.rotateX(Math.PI / 2); domeGeo.translate(0, 0, HF * R - rad * Math.cos(th) + 0.3);
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x000000, metalness: 0, roughness: 0.16, clearcoat: 0.7, clearcoatRoughness: 0.08,
      envMapIntensity: 0.9, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    bandPatch(glassMat, 0.1);
    const dome = new THREE.Mesh(domeGeo, glassMat);

    // ---------- back: engine-turned gold with the mark struck in relief ----------
    const bc = document.createElement("canvas"); bc.width = bc.height = 512;
    const bb = document.createElement("canvas"); bb.width = bb.height = 512;
    const gc = bc.getContext("2d"), gb = bb.getContext("2d");
    const rg = gc.createRadialGradient(220, 200, 0, 256, 256, 256); rg.addColorStop(0, "#ffffff"); rg.addColorStop(1, "#b9b9b9");
    gc.fillStyle = rg; gc.fillRect(0, 0, 512, 512); gb.fillStyle = "#000"; gb.fillRect(0, 0, 512, 512);
    for (let r = 10, k = 0; r < 256; r += 9, k++) {
      gc.strokeStyle = k % 2 ? "rgba(0,0,0,.10)" : "rgba(255,255,255,.12)"; gc.lineWidth = 4; gc.beginPath(); gc.arc(256, 256, r, 0, Math.PI * 2); gc.stroke();
      gb.strokeStyle = k % 2 ? "rgba(255,255,255,.18)" : "rgba(0,0,0,0)"; gb.lineWidth = 3; gb.beginPath(); gb.arc(256, 256, r, 0, Math.PI * 2); gb.stroke();
    }
    const markFont = o.markFont || "900 330px Inter";
    gc.font = markFont; gc.textAlign = "center"; gc.textBaseline = "middle"; gc.fillStyle = "#ffffff"; gc.fillText(o.mark || "@", 256, 270);
    gb.filter = "blur(5px)"; gb.font = markFont; gb.textAlign = "center"; gb.textBaseline = "middle"; gb.fillStyle = "#ffffff"; gb.fillText(o.mark || "@", 256, 270);
    const backTex = new THREE.CanvasTexture(bc); backTex.colorSpace = THREE.SRGBColorSpace;
    const bumpTex = new THREE.CanvasTexture(bb);
    const backMat = new THREE.MeshPhysicalMaterial({ color: gold, map: backTex, bumpMap: bumpTex, bumpScale: o.bump || 6, metalness: 1, roughness: 0.28, envMapIntensity: 1.1 });
    const backGeo = new THREE.CircleGeometry(RI * R * 1.004, 128); backGeo.rotateY(Math.PI); backGeo.translate(0, 0, -HF * R);
    const back = new THREE.Mesh(backGeo, backMat);

    const coin = new THREE.Group(); coin.add(rim, face, dome, back); scene.add(coin);
    coin.rotation.order = "ZYX";                                   // bank (z) is applied in world space, after the spin

    function render(st) {
      st = st || {};
      const rx = st.rx || 0, ry = st.ry || 0, s = st.s == null ? 1 : st.s;
      coin.rotation.set(rx, ry, st.rz || 0);
      coin.scale.set(Math.max(1e-3, s * (st.sx || 1)), Math.max(1e-3, s * (st.sy || 1)), Math.max(1e-3, s));
      coin.position.set(st.x || 0, st.y || 0, 0);
      const fz = Math.cos(ry) * Math.cos(rx);                       // the unlit portrait darkens as it turns from the lens
      faceMat.color.setScalar(0.5 + 0.5 * Math.max(0, fz));
      const lx = st.lx == null ? -1.6 : st.lx, sp = st.spec || 0;    // the payoff's raking light, left -> right
      rake.position.set(lx * DIST * 1.1, 1.0 * DIST, 0.5 * DIST);   // high: its glint runs along the top of rim and glass, never across the face rake.intensity = sp * (o.rakeI || 4.5) * 0.7;
      glassMat.envMapIntensity = 0.6 + 0.3 * sp;                   // the glass catches the light without washing the face
      rimMat.envMapIntensity = 1.0 + 0.2 * sp; rimMat.emissiveIntensity = 0.12 * sp;    // the gold runs hot as the light crosses it
      U.uBand.value = st.band == null ? -9 : st.band; U.uBandAmp.value = st.bandAmp || 0;   // specular band across bevel and glass
      renderer.toneMappingExposure = (o.exposure || 1.0) * (1 + 0.25 * (st.expo || 0));          // exposure lift on the coin only
      renderer.render(scene, camera);
    }
    render({});
    return { canvas, render, R, SZ };
  };
})();
