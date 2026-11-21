/* Social3D: the physical layer of the socials row (Three.js r160, global THREE). Identical copy in a/media and b/media.
   One perspective camera whose z = 0 plane maps 1 world unit to 1 canvas px (principal point at the canvas centre), so DOM
   type can sit on the 3D objects. Everything here is real geometry:
     - tile():  a candy-lacquer app tile (rounded square, extruded, rounded bevel, vertical two-tone gradient) carrying one
                of our own marks (media/marks.js) extruded in glossy white, with a baked soft contact shadow on the face and
                a blob shadow behind it on the "screen";
     - slab():  a lacquered rounded slab, optionally carrying extruded, bevelled letters traced from Archivo's outlines
                (media/glyphs.js), hinged at its top edge so it can swing in like a sign;
     - plate(): a white enamel name plate (variant B), clipped at a vertical line so it can slide out from behind a tile.
   Light: PMREM studio environment (big softbox above, a hard strip in front for the bevel line, side strips), a warm key,
   a hemisphere fill, and a "rake" point light plus an emissive specular band that the payoff sweeps across every bevel.
   ACES + sRGB in one output pass after shutter-sampled motion blur (accumulated in linear HDR).
   Seek-safe: nothing animates on its own. The caller poses nodes and calls render() from timeline time. */
(function () {
  window.Social3D = function (o) {
    const W = o.W, H = o.H;
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    canvas.style.cssText = "position:absolute;left:0;top:0;width:" + W + "px;height:" + H + "px;display:block;pointer-events:none";
    if (o.host) o.host.appendChild(canvas);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
    renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = o.exposure || 1.0;
    renderer.localClippingEnabled = true;
    const scene = new THREE.Scene();
    const FOV = o.fov || 16, DIST = (H / 2) / Math.tan((FOV / 2) * Math.PI / 180);
    // a tight near/far around the z = 0 stage: the MSAA target's depth buffer may be 16-bit, and a loose range lets back
    // faces z-fight through the front (ghost outlines on the bevels)
    const camera = new THREE.PerspectiveCamera(FOV, W / H, Math.max(20, DIST - 900), DIST + 900);
    camera.position.set(0, 0, DIST); camera.lookAt(0, 0, 0);
    const toX = (px) => px - W / 2, toY = (py) => H / 2 - py;

    // ---------- environment: a warm studio with hard softboxes (lacquer needs contrast to read as lacquer) ----------
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vP; void main(){ float y = vP.y; vec3 top = vec3(0.66,0.64,0.62), hor = vec3(0.26,0.25,0.25), low = vec3(0.05,0.045,0.045);" +
        " vec3 c = y > 0.0 ? mix(hor, top, smoothstep(0.05, 0.85, y)) : mix(hor, low, smoothstep(0.0, 0.45, -y)); gl_FragColor = vec4(c, 1.0); }"
    })));
    const panel = (w, h, x, y, z, k, col) => {
      const c = col || [1, 0.97, 0.92];
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k * c[0], k * c[1], k * c[2]), side: THREE.DoubleSide }));
      m.position.set(x, y, z); m.lookAt(0, 0, 0); envScene.add(m);
    };
    panel(64, 18, 0, 34, 22, 2.2);            // big softbox above-front: the sheen on the upper faces
    panel(46, 3.2, 0, 9, 44, 3.6);            // a hard strip in front, a little high: the gloss line across faces and top bevels
    panel(7, 34, -40, 2, 22, 1.9);            // left strip: vertical bands on the side walls
    panel(7, 34, 40, 2, 22, 1.4);             // right strip
    panel(46, 4, 0, -18, 40, 0.9);            // low front bounce, so lower bevels are not black
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(envScene, 0.0, 0.1, 200).texture;

    // ---------- lights ----------
    const key = new THREE.DirectionalLight(0xfff2e4, o.key == null ? 1.5 : o.key); key.position.set(-0.5, 0.85, 1.0); scene.add(key);
    const hemi = new THREE.HemisphereLight(0xf2f4ff, 0x1c140e, o.hemi == null ? 0.55 : o.hemi); scene.add(hemi);
    const rake = new THREE.PointLight(0xfff1dc, 0, 0, 0); rake.position.set(-W, H * 0.4, 600); scene.add(rake);

    // ---------- the payoff's specular band: emission added before tone mapping, clipped to the geometry ----------
    // the band runs along s = x - 0.45 y (world px): a '/' line that sweeps left -> right, its top leading. It is strongest
    // where the surface turns from the lens (bevels, edges) and softer on flat faces (uBandFace), so it reads as a specular line
    const U = { uBand: { value: -1e5 }, uBandW: { value: 70 }, uBandAmp: { value: 0 }, uBandFace: { value: 0.35 }, uBandCol: { value: new THREE.Color(1.0, 0.86, 0.66) } };
    function band(mat, k, faceK) {
      const fk = faceK == null ? 1 : faceK;
      mat.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, U);
        sh.vertexShader = "varying vec3 vWP;\n" + sh.vertexShader.replace("#include <worldpos_vertex>", "#include <worldpos_vertex>\n vWP = (modelMatrix * vec4(transformed, 1.0)).xyz;");
        sh.fragmentShader = "varying vec3 vWP; uniform float uBand, uBandW, uBandAmp, uBandFace; uniform vec3 uBandCol;\n" + sh.fragmentShader.replace("#include <emissivemap_fragment>",
          "#include <emissivemap_fragment>\n { float d = ((vWP.x - 0.45 * vWP.y) - uBand) / uBandW; vec3 bn = normalize(vNormal);" +
          // only front faces and top / side bevels catch it: nothing on the backs or the bottom bevels (no spill under objects)
          " float m = clamp(bn.z / 0.25 + 0.2, 0.0, 1.0) * (1.0 - clamp((-bn.y - 0.05) / 0.3, 0.0, 1.0));" +
          " float w = uBandFace * " + fk.toFixed(3) + " + (1.0 - uBandFace) * 2.2 * (1.0 - abs(bn.z));" +
          " totalEmissiveRadiance += uBandCol * exp(-d * d) * uBandAmp * m * w * " + k.toFixed(3) + "; }");
      };
      mat.customProgramCacheKey = () => "s3d-band-" + k.toFixed(3) + "-" + fk.toFixed(3) + (mat.clearcoatNormalMap ? "-cn" : "");
      return mat;
    }

    // ---------- helpers ----------
    // rounded rect as an explicit point loop (x,y = bottom-left, world, y up). No repeated end point: absarc() lands back on
    // the start within float error, which ExtrudeGeometry does not dedupe, and its bevel then spikes a sliver off the corner.
    function rrShape(x, y, w, h, r, n) {
      n = n || 14; const pts = [];
      const C = [[x + w - r, y + r, -Math.PI / 2], [x + w - r, y + h - r, 0], [x + r, y + h - r, Math.PI / 2], [x + r, y + r, Math.PI]];
      C.forEach((c) => { for (let k = 0; k <= n; k++) { const a = c[2] + (k / n) * Math.PI / 2; pts.push(new THREE.Vector2(c[0] + r * Math.cos(a), c[1] + r * Math.sin(a))); } });
      return new THREE.Shape(pts);
    }
    // vertical two-tone gradient as vertex colours (linear space; exact on flat faces since it is linear in y)
    function gradient(geo, top, bot, y0, y1, side) {
      const a = new THREE.Color(top), b = new THREE.Color(bot), sd = side != null ? side : 1;
      const pos = geo.attributes.position, nor = geo.attributes.normal, col = new Float32Array(pos.count * 3);
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i), f = Math.min(1, Math.max(0, (y - y0) / (y1 - y0)));
        const wall = sd + (1 - sd) * Math.abs(nor.getZ(i));                // side walls a touch deeper, blended round the bevel
        col[i * 3] = (b.r + (a.r - b.r) * f) * wall; col[i * 3 + 1] = (b.g + (a.g - b.g) * f) * wall; col[i * 3 + 2] = (b.b + (a.b - b.b) * f) * wall;
      }
      geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    }
    // smooth the side + bevel normals of an ExtrudeGeometry (group 1), so the rounded bevel reads as one continuous curve
    // instead of flat facets that each mirror a different strip of the studio (thin dark/bright lines at phone size).
    // Normals are averaged only between coincident side vertices within maxDeg of each other, so real corners stay crisp.
    function smoothSides(geo, maxDeg) {
      const pos = geo.attributes.position, nor = geo.attributes.normal, cosT = Math.cos((maxDeg || 40) * Math.PI / 180);
      const g = geo.groups.find((q) => q.materialIndex === 1) || { start: 0, count: pos.count };
      const key = (i) => Math.round(pos.getX(i) * 64) + "," + Math.round(pos.getY(i) * 64) + "," + Math.round(pos.getZ(i) * 64);
      const buckets = new Map();
      for (let i = g.start; i < g.start + g.count; i++) { const k = key(i); let b = buckets.get(k); if (!b) buckets.set(k, (b = [])); b.push(i); }
      const src = new Float32Array(nor.array), out = nor.array;
      buckets.forEach((b) => {
        b.forEach((i) => {
          const nx = src[i * 3], ny = src[i * 3 + 1], nz = src[i * 3 + 2]; let sx = 0, sy = 0, sz = 0;
          b.forEach((j) => { const mx = src[j * 3], my = src[j * 3 + 1], mz = src[j * 3 + 2]; if (nx * mx + ny * my + nz * mz >= cosT) { sx += mx; sy += my; sz += mz; } });
          const l = Math.hypot(sx, sy, sz) || 1; out[i * 3] = sx / l; out[i * 3 + 1] = sy / l; out[i * 3 + 2] = sz / l;
        });
      });
      nor.needsUpdate = true;
      return geo;
    }
    function lacquer(o2) {
      const q = Object.assign({}, o2 || {}), k = q.bandK || 1.0, fk = q.faceK; delete q.bandK; delete q.faceK;
      return band(new THREE.MeshPhysicalMaterial(Object.assign({ color: 0xffffff, vertexColors: true, roughness: 0.3, metalness: 0.0,
        clearcoat: 1.0, clearcoatRoughness: 0.05, envMapIntensity: 1.0 }, q)), k, fk);
    }
    // a pillow normal map for the clearcoat of flat faces: a gentle dome, so the face mirrors a gradient of the studio
    // (bright softbox on the upper half, the dark floor on the lower) the way a real lacquered tile does, instead of one flat tone
    const pillowTex = (() => {
      const N = 256, c = document.createElement("canvas"); c.width = c.height = N; const g = c.getContext("2d"), im = g.createImageData(N, N);
      for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
        const x = (i + 0.5) / N * 2 - 1, y = 1 - (j + 0.5) / N * 2;
        // h = (1 - x^2)(1 - y^2): one gentle dome across the whole face (a gradient, not an inner rim)
        const dx = -2 * x * (1 - y * y), dy = -2 * y * (1 - x * x), kz = 3.4;
        const l = Math.hypot(dx, dy, kz), o = (j * N + i) * 4;
        im.data[o] = Math.round((-dx / l * 0.5 + 0.5) * 255); im.data[o + 1] = Math.round((-dy / l * 0.5 + 0.5) * 255); im.data[o + 2] = Math.round((kz / l * 0.5 + 0.5) * 255); im.data[o + 3] = 255;
      }
      g.putImageData(im, 0, 0);
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.NoColorSpace; t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; return t;
    })();
    function pillowFor(w, h, x0, y0) {   // the cap's UVs are its shape coordinates (px): map the box [x0, x0 + w] x [y0, y0 + h] to 0..1
      const t = pillowTex.clone(); t.needsUpdate = true; t.repeat.set(1 / w, 1 / h); t.offset.set(-x0 / w, -y0 / h); return t;
    }
    // a soft blob shadow texture (radial, black)
    const blobTex = (() => {
      const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d");
      const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      r.addColorStop(0, "rgba(0,0,0,1)"); r.addColorStop(0.45, "rgba(0,0,0,.72)"); r.addColorStop(0.75, "rgba(0,0,0,.24)"); r.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = r; g.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(c);
    })();
    function blob(w, h, op) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: blobTex, color: 0x000000, transparent: true, opacity: op, depthWrite: false, toneMapped: false }));
      m.renderOrder = -1; scene.add(m); return m;
    }

    const nodes = [];
    function node(group, cx, cy, extra) {
      group.position.set(toX(cx), toY(cy), 0); scene.add(group);
      const n = Object.assign({ group, X: toX(cx), Y: toY(cy), px: cx, py: cy }, extra || {}); nodes.push(n); return n;
    }
    const P0 = { dx: 0, dy: 0, dz: 0, rx: 0, ry: 0, rz: 0, s: 1, sx: 1, sy: 1, sz: 1, sh: 1 };
    function pose(n, q) {
      const p = Object.assign({}, P0, q || {});
      n.group.position.set(n.X + p.dx, n.Y + p.dy, p.dz); n.group.rotation.set(p.rx, p.ry, p.rz);
      n.group.scale.set(Math.max(1e-4, p.s * p.sx), Math.max(1e-4, p.s * p.sy), Math.max(1e-4, p.s * p.sz));
      n.group.visible = p.s > 0.002 && p.hide !== true;
      if (n.shadow) {
        // the contact shadow exists only near rest: no grey blob dragged across the sky while an object flies in or out
        const off = Math.hypot(p.dx, p.dy), near = n.noNear ? 1 : 1 - Math.min(1, Math.max(0, (off - 8) / 30));
        const swing = 1 - Math.min(1, Math.max(0, (Math.abs(p.rx) - 0.12) / 0.3));
        const k = Math.max(0, p.s) * p.sh * near * swing;
        n.shadow.visible = n.group.visible && k > 0.01;
        n.shadow.position.set(n.X + p.dx + n.shOff[0], n.Y + p.dy * 0.9 + n.shOff[1], -n.shZ + Math.min(0, p.dz));
        n.shadow.scale.set(Math.max(1e-4, p.s * (1 + Math.abs(Math.sin(p.ry)) * 0.25)), Math.max(1e-4, p.s), 1);
        n.shadow.material.opacity = n.shOp * Math.min(1, k) * (1 - Math.min(0.6, Math.max(0, p.dz) / 120));
      }
      return p;
    }

    /** tile({cx, cy, size, r, depth, colors: [top, bottom], mark, markColor, markScale, side}) -> node */
    function tile(t) {
      const S = t.size, r = t.r || S * 0.26, bt = S * 0.075, bs = S * 0.075, d = t.depth || S * 0.16;
      const sh = rrShape(-S / 2, -S / 2, S, S, r, 16);
      const geo = new THREE.ExtrudeGeometry(sh, { depth: d, bevelEnabled: true, bevelThickness: bt, bevelSize: bs, bevelOffset: -bs, bevelSegments: 7, curveSegments: 18 });
      geo.translate(0, 0, -d / 2); smoothSides(geo, 40);
      gradient(geo, t.colors[0], t.colors[1], -S / 2, S / 2, t.side == null ? 0.82 : t.side);
      const rough = t.rough == null ? 0.16 : t.rough;
      // the domed clearcoat is a little rough so the studio reads as soft gloss gradients, never hairline reflections
      const capMat = lacquer({ roughness: rough, clearcoatRoughness: 0.15, bandK: 1.0, clearcoatNormalMap: pillowFor(S, S, -S / 2, -S / 2),
        clearcoatNormalScale: new THREE.Vector2(1, 1), envMapIntensity: 1.15 });
      const bodyMat = lacquer({ roughness: rough, clearcoatRoughness: 0.03, bandK: 1.0, envMapIntensity: 1.15 });
      const body = new THREE.Mesh(geo, [capMat, bodyMat]);
      const zf = d / 2 + bt, k = S * (t.markScale || 0.58) / 100;
      const parts = (window.SocialMarks ? window.SocialMarks(t.mark) : []);
      const shapes = parts.map((pt) => {
        const s2 = new THREE.Shape(pt.o.map((v) => new THREE.Vector2((v[0] - 50) * k, (50 - v[1]) * k)));
        pt.h.forEach((h) => s2.holes.push(new THREE.Path(h.map((v) => new THREE.Vector2((v[0] - 50) * k, (50 - v[1]) * k)))));
        return s2;
      });
      const mbt = S * 0.026, mbs = S * 0.021, md = S * 0.042;
      const mgeo = new THREE.ExtrudeGeometry(shapes, { depth: md, bevelEnabled: true, bevelThickness: mbt, bevelSize: mbs, bevelOffset: -mbs, bevelSegments: 4, curveSegments: 4 });
      mgeo.translate(0, 0, zf - mbt * 0.6); smoothSides(mgeo, 50);
      const markMat = band(new THREE.MeshPhysicalMaterial({ color: new THREE.Color(t.markColor || 0xffffff), roughness: 0.16, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 0.85,
        emissive: new THREE.Color(1, 1, 1), emissiveIntensity: t.markGlow || 0.0 }), 1.15);
      const mark = new THREE.Mesh(mgeo, markMat);
      // soft contact shadow the raised mark casts on the face (down-right, from the key)
      const SZc = 256, pad = 0.2, c = document.createElement("canvas"); c.width = c.height = SZc;
      const g = c.getContext("2d"), q = SZc / (100 * (1 + 2 * pad));
      g.filter = "blur(" + Math.round(SZc * 0.018) + "px)"; g.fillStyle = "#000";
      const off = [2.2, 3.6];
      const pathOf = (pts) => { g.moveTo((pts[0][0] + off[0] + 100 * pad) * q, (pts[0][1] + off[1] + 100 * pad) * q); for (let i = 1; i < pts.length; i++) g.lineTo((pts[i][0] + off[0] + 100 * pad) * q, (pts[i][1] + off[1] + 100 * pad) * q); g.closePath(); };
      parts.forEach((pt) => { g.beginPath(); pathOf(pt.o); pt.h.forEach(pathOf); g.fill("evenodd"); });
      const decTex = new THREE.CanvasTexture(c);
      const decal = new THREE.Mesh(new THREE.PlaneGeometry(100 * (1 + 2 * pad) * k, 100 * (1 + 2 * pad) * k),
        new THREE.MeshBasicMaterial({ map: decTex, color: 0x000000, transparent: true, opacity: t.decal == null ? 0.42 : t.decal, depthWrite: false, toneMapped: false }));
      decal.position.z = zf + 0.35;
      const grp = new THREE.Group(); grp.add(body, decal, mark);
      const n = node(grp, t.cx, t.cy, { body, mark, bodyMat, capMat, markMat, S, zf });
      n.shadow = blob(S * 1.5, S * 1.35, t.shadow == null ? 0.5 : t.shadow); n.shOff = [S * 0.05, -S * 0.16]; n.shZ = S * 0.9; n.shOp = t.shadow == null ? 0.5 : t.shadow;
      return n;
    }

    /** gradTex(stops): a vertical gradient (bottom -> top) for letter faces; uv.y runs baseline -> cap top. */
    function gradTex(stops) {
      const c = document.createElement("canvas"); c.width = 4; c.height = 256;
      const x = c.getContext("2d"), gr = x.createLinearGradient(0, 256, 0, 0);
      stops.forEach((s, i) => gr.addColorStop(i / (stops.length - 1), s));
      x.fillStyle = gr; x.fillRect(0, 0, 4, 256);
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; return t;
    }

    /** slab({cx, top, w, h, r, depth, colors, text, glyphs, cap, tracking, letterDepth}) -> node, hinged at its top edge. */
    function slab(f) {
      const bt = f.bevelT || 9, bs = f.bevel || 10, d = f.depth || 22;
      const sh = rrShape(-f.w / 2, -f.h, f.w, f.h, f.r, 16);
      const geo = new THREE.ExtrudeGeometry(sh, { depth: d, bevelEnabled: true, bevelThickness: bt, bevelSize: bs, bevelOffset: -bs, bevelSegments: 7, curveSegments: 18 });
      geo.translate(0, 0, -d / 2); smoothSides(geo, 40);
      gradient(geo, f.colors[0], f.colors[1], -f.h, 0, 0.8);
      const mat = lacquer({ roughness: 0.16, clearcoatRoughness: 0.03, bandK: 1.0, envMapIntensity: 1.1 });
      const capM = lacquer({ roughness: 0.16, clearcoatRoughness: 0.15, bandK: 1.0, envMapIntensity: 1.1, clearcoatNormalMap: pillowFor(f.w, f.h, -f.w / 2, -f.h),
        clearcoatNormalScale: new THREE.Vector2(0.35, 0.8) });
      const grp = new THREE.Group(); grp.add(new THREE.Mesh(geo, [capM, mat]));
      const zf = d / 2 + bt, letters = [];
      if (f.text && f.glyphs) {
        const F = f.glyphs, s = f.cap / F.cap, track = (f.tracking || 0) * F.upm;
        const pens = []; let pen = 0;
        for (let i = 0; i < f.text.length; i++) {
          const ch = F.g[f.text[i]] ? f.text[i] : " ", gl = F.g[ch];
          pens.push({ ch, x: pen, g: gl });
          pen += gl[0] + (i < f.text.length - 1 ? (F.k[f.text[i] + f.text[i + 1]] || 0) + track : 0);
        }
        const ink = pens.filter((p) => p.ch !== " ");
        const inkL = ink[0].x + ink[0].g[2], inkR = ink[ink.length - 1].x + ink[ink.length - 1].g[3];
        const ox = -((inkL + inkR) / 2) * s, base = -f.h / 2 - f.cap / 2 + (f.baseNudge || 0);   // optical: ink box centred on the face
        const lb = f.letterBevel || 2.6, ld = f.letterDepth || 6;
        const tex = gradTex(f.face || ["#d9dde6", "#ffffff", "#ffffff"]);
        tex.repeat.set(1, 1 / f.cap); tex.offset.set(0, -base / f.cap);
        const faceM = band(new THREE.MeshPhysicalMaterial({ map: tex, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 0.8, emissive: new THREE.Color(1, 1, 1), emissiveIntensity: f.letterGlow == null ? 0.14 : f.letterGlow }), 1.15);
        const sideM = band(new THREE.MeshPhysicalMaterial({ color: new THREE.Color(f.side || 0xe9ebf0), roughness: 0.3, clearcoat: 0.8, envMapIntensity: 0.9 }), 1.0);
        const MIN_SEG = 0.9, CURVE_SEG = 8;
        ink.forEach((G) => {
          const sp = new THREE.ShapePath(), re = /([MLQCZ])([^MLQCZ]*)/g; let m;
          const px = (nx, ny) => [ox + (G.x + nx) * s, base - ny * s];
          while ((m = re.exec(G.g[1]))) {
            const nn = m[2].trim() ? m[2].trim().split(/[\s,]+/).map(Number) : [];
            const P = []; for (let j = 0; j < nn.length; j += 2) P.push(...px(nn[j], nn[j + 1]));
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
          const shapes = sp.toShapes(false).map((sh2) => {
            const s2 = new THREE.Shape(clean(sh2.getPoints(CURVE_SEG)));
            sh2.holes.forEach((h) => s2.holes.push(new THREE.Path(clean(h.getPoints(CURVE_SEG)))));
            return s2;
          });
          const lg = new THREE.ExtrudeGeometry(shapes, { depth: ld, bevelEnabled: true, bevelThickness: lb, bevelSize: lb * 0.85, bevelOffset: -lb * 0.85, bevelSegments: 3, curveSegments: 1 });
          lg.translate(0, 0, zf - lb * 0.5); smoothSides(lg, 50);
          const mesh = new THREE.Mesh(lg, [faceM, sideM]);
          grp.add(mesh); letters.push(mesh);
        });
        // the letters' contact shadow on the lacquer: a blurred copy of the ink, baked onto a decal just above the face
        const cw = 1024, chh = Math.round(cw * f.h / f.w), c = document.createElement("canvas"); c.width = cw; c.height = chh;
        const g = c.getContext("2d"), q = cw / f.w;
        g.filter = "blur(" + Math.round(f.cap * 0.07 * q) + "px)"; g.fillStyle = "#000";
        g.translate(cw / 2 + 3 * q, chh / 2 + 5 * q);
        ink.forEach((G) => {
          const p2 = new Path2D(), re = /([MLQCZ])([^MLQCZ]*)/g; let m;
          const px = (nx, ny) => [(ox + (G.x + nx) * s) * q, -(base - ny * s + f.h / 2) * q];
          while ((m = re.exec(G.g[1]))) {
            const nn = m[2].trim() ? m[2].trim().split(/[\s,]+/).map(Number) : [];
            const P = []; for (let j = 0; j < nn.length; j += 2) P.push(...px(nn[j], nn[j + 1]));
            if (m[1] === "M") p2.moveTo(P[0], P[1]); else if (m[1] === "L") p2.lineTo(P[0], P[1]);
            else if (m[1] === "Q") p2.quadraticCurveTo(P[0], P[1], P[2], P[3]); else if (m[1] === "C") p2.bezierCurveTo(P[0], P[1], P[2], P[3], P[4], P[5]);
            else if (m[1] === "Z") p2.closePath();
          }
          g.fill(p2, "nonzero");
        });
        const dt = new THREE.CanvasTexture(c);
        const dec = new THREE.Mesh(new THREE.PlaneGeometry(f.w, f.h), new THREE.MeshBasicMaterial({ map: dt, color: 0x000000, transparent: true, opacity: 0.5, depthWrite: false, toneMapped: false }));
        dec.position.set(0, -f.h / 2, zf + 0.35); grp.add(dec);
      }
      const n = node(grp, f.cx, f.top, { mat, letters, zf, w: f.w, h: f.h });
      n.shadow = blob(f.w * 1.18, f.h * 1.5, f.shadow == null ? 0.45 : f.shadow); n.shOff = [8, -f.h / 2 - 16]; n.shZ = 60; n.shOp = f.shadow == null ? 0.45 : f.shadow;
      return n;
    }

    /** plate({x0, cy, w, h, r, depth, colors, clipX, dir, zFront, glow, faceK}): a white enamel name plate. dir = 1: its left
        edge is at x0 and it is drawn only right of clipX; dir = -1: mirrored (right edge at x0, drawn only left of clipX). So it
        can slide out from behind a tile. Pose dx slides it. Its contact shadow follows it (clipped the same way). */
    function plate(f) {
      const bt = f.bevelT || 5, bs = f.bevel || 6, d = f.depth || 10, dir = f.dir || 1;
      const sh = rrShape(dir > 0 ? 0 : -f.w, -f.h / 2, f.w, f.h, f.r, 14);
      const geo = new THREE.ExtrudeGeometry(sh, { depth: d, bevelEnabled: true, bevelThickness: bt, bevelSize: bs, bevelOffset: -bs, bevelSegments: 6, curveSegments: 14 });
      geo.translate(0, 0, (f.zFront || 0) - d - bt); smoothSides(geo, 40);   // front face at zFront (behind the tile's face)
      gradient(geo, f.colors[0], f.colors[1], -f.h / 2, f.h / 2, 0.86);
      const clip = new THREE.Plane(new THREE.Vector3(dir, 0, 0), -dir * toX(f.clipX));
      const opts = { roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 0.85, bandK: f.bandK || 1.0, faceK: f.faceK == null ? 1 : f.faceK,
        emissive: new THREE.Color(1, 1, 1), emissiveIntensity: f.glow || 0 };
      const capM = lacquer(Object.assign({}, opts, { clearcoatRoughness: 0.15, clearcoatNormalMap: pillowFor(f.w, f.h, dir > 0 ? 0 : -f.w, -f.h / 2), clearcoatNormalScale: new THREE.Vector2(0.3, 0.9) }));
      const mat = lacquer(opts);
      capM.clippingPlanes = [clip]; mat.clippingPlanes = [clip];
      const grp = new THREE.Group(); grp.add(new THREE.Mesh(geo, [capM, mat]));
      grp.position.set(toX(f.x0), toY(f.cy), 0); scene.add(grp);
      const n = { group: grp, X: toX(f.x0), Y: toY(f.cy), mat, zf: f.zFront || 0, noNear: true };
      n.shadow = blob(f.w * 1.12, f.h * 1.6, 0.42); n.shOff = [dir * (f.w / 2 + 6), -12]; n.shZ = 40; n.shOp = f.shadow == null ? 0.42 : f.shadow;
      n.shadow.material.clippingPlanes = [clip];
      nodes.push(n);
      return n;
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
        if (state) state(n > 1 ? t - shutter * (i / (n - 1)) : t, i === 0);
        renderer.setRenderTarget(rt); renderer.clear(); renderer.render(scene, camera);
        addMat.uniforms.k.value = 1 / n; renderer.setRenderTarget(acc); renderer.render(addScene, qCam);
      }
      renderer.setRenderTarget(null); renderer.clear(); renderer.render(outScene, qCam);
      renderer.autoClear = ac;
    }
    return { canvas, renderer, scene, camera, DIST, key, hemi, rake, U, tile, slab, plate, pose, render, toX, toY };
  };
})();
