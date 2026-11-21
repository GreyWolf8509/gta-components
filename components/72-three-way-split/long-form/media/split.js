/* GTA-niche 72 Three-way split: one standalone kit object (GSAP 3 only), shared by copy between a/ (16:9 columns) and
   b/ (9:16 stacked bands). Port target: C.split3 in films/gta6-rdr2-gta5/assets/kit/film.js.

   Split.build(tl, host, cfg) reads the <video class="clip"> elements already inside `host` (data-game="g5|rdr|g6" for the
   cells, "<g>-open" for the opening full-frame plate, "<g>-full" for the winner's full-frame copy; data-focus = source x kept
   centred in a column), builds the DOM (opener -> cells with their chips -> full-frame winner copy -> edge light -> chrome
   dividers -> winner chip bloom -> winner chip) and adds every tween to `tl` as fromTo + immediateRender:false, so any seek
   is a pure function of time; proxy-driven parts go through `drive` (a setter property), the look.js pattern.

   Beats (cfg.t, seconds): hard cut in on the first plate full-frame (no stage colour ever) -> each chrome divider slams in
   with back.out(1.6) and the cells beside it clip-path-wipe in from its edge, a 3-frame impact on each land -> a soft
   specular band runs each divider, and again during the hold -> chips spring 0.6 -> 1.07 -> 1 with a 1-frame tick ->
   hold with cuts inside the cells -> the winner's full copy clip-path-wipes to the whole frame in cfg.t.wipeDur with a
   specular band riding its edge (dividers ride the edge off, losing chips are shoved off inside their own cell, the winner
   chip rides the edge to its dock) -> on the land a 3-frame bloom on the winner chip plus a capped plate lift -> hold. */
(function () {
  const GAMES = { g5: { name: "GTA V", year: "2013", c: "#46B64F" }, rdr: { name: "RED DEAD 2", year: "2018", c: "#D9444F" }, g6: { name: "GTA VI", year: "2026", c: "#F2558E" } };
  const F = 1 / 30;
  function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  let REG = null;
  function T(tl, target, from, to, dur, at, ease) {
    if (REG) REG.push({ target, from, at });
    tl.fromTo(target, from, Object.assign({ duration: dur, ease: ease || "expo.out", immediateRender: false }, to), at);
  }
  function pinStarts(tl, s) { // hold each element's first `from` state from the clip start, so frames before its first tween are defined
    const first = new Map();
    for (const r of REG) { const f = first.get(r.target); if (!f || r.at < f.at) first.set(r.target, r); }
    first.forEach(r => { if (r.at > s + 0.001) { const from = Object.assign({}, r.from); delete from.transformOrigin; tl.set(r.target, Object.assign(from, { immediateRender: false }), s); } });
    REG = null;
  }
  function drive(tl, at, dur, fn) { // seek-safe proxy: fn(p) runs on every render of the tween, including reverse seeks
    const o = {}; let v = 0;
    Object.defineProperty(o, "p", { get: () => v, set: (x) => { v = x; fn(x); } });
    fn(0);
    tl.fromTo(o, { p: 0 }, { p: 1, duration: Math.max(dur, F), ease: "none", immediateRender: false }, at);
    return at + dur;
  }
  function shake(tl, host, at, px, frames) { // short deterministic hit on the stage wrapper: 3 frames (frames=3) or a 1-frame tick (frames=1)
    if (!host) return;
    if (frames === 1) {
      T(tl, host, { x: 0, y: 0 }, { x: -px, y: px * 0.5 }, F, at, "none");
      T(tl, host, { x: -px, y: px * 0.5 }, { x: 0, y: 0 }, F, at + F, "none");
      return;
    }
    T(tl, host, { x: 0, y: 0 }, { x: -px, y: px * 0.6 }, F, at, "none");
    T(tl, host, { x: -px, y: px * 0.6 }, { x: px * 0.7, y: -px * 0.4 }, F, at + F, "none");
    T(tl, host, { x: px * 0.7, y: -px * 0.4 }, { x: 0, y: 0 }, F * 1.5, at + 2 * F, "none");
  }
  function spring(tl, target, at) { // stamp: 0.6 -> 1.07 -> 1 over 9 frames; opacity is 1 from its first frame (never a ghost fade)
    T(tl, target, { scale: 0.6 }, { scale: 1.07 }, 0.14, at, "power2.out");
    tl.fromTo(target, { opacity: 0 }, { opacity: 1, duration: F * 0.5, ease: "none", immediateRender: false }, at - F * 0.5);
    T(tl, target, { scale: 1.07 }, { scale: 1.0 }, 0.16, at + 0.14, "power2.inOut");
  }

  function build(tl, host, cfg) {
    const ax = cfg.axis === "y" ? "y" : "x", W = cfg.W, H = cfg.H, n = cfg.order.length;
    const along = ax === "x" ? W : H, cellLen = along / n;      // 640 on both canvases
    const cellW = ax === "x" ? cellLen : W, cellH = ax === "x" ? H : cellLen;
    const t = cfg.t, stage = cfg.shake ? document.querySelector(cfg.shake) : null;
    host.classList.add("split", ax === "x" ? "ax" : "ay");
    host.style.width = W + "px"; host.style.height = H + "px";
    const vids = Array.from(host.querySelectorAll("video[data-game]"));
    const bandS = cfg.band ? cfg.band.scale : 1, bandOx = cfg.band ? cfg.band.ox : 0, bandOy = cfg.band ? cfg.band.oy : 0;
    const s1 = Math.max(W / 1920, H / 1080), tx1 = (W - 1920 * s1) / 2, ty1 = (H - 1080 * s1) / 2;   // full-frame cover transform
    const wi = cfg.order.indexOf(cfg.winner);

    // ---- opener: the first plate full-frame under everything (the hard cut in) ----
    const openV = vids.find(v => v.dataset.game.endsWith("-open"));
    const opener = el("div", "opener"); opener.style.width = W + "px"; opener.style.height = H + "px";
    if (openV) { openV.style.transform = ax === "x" ? "translate(0px, 0px)" : `translate(${tx1}px, ${ty1}px) scale(${s1})`; opener.appendChild(openV); }
    host.appendChild(opener);

    // ---- cells with their timed clips; the losing chips live inside their cell so they can never label a neighbour ----
    const cells = cfg.order.map((g, i) => {
      const cell = el("div", "cell " + g);
      cell.style.left = (ax === "x" ? i * cellLen : 0) + "px"; cell.style.top = (ax === "x" ? 0 : i * cellLen) + "px";
      cell.style.width = cellW + "px"; cell.style.height = cellH + "px";
      vids.filter(v => v.dataset.game === g).sort((a, b) => parseFloat(a.dataset.start) - parseFloat(b.dataset.start)).forEach(v => {
        if (ax === "x") v.style.left = (cellLen / 2 - parseFloat(v.dataset.focus || 960)) + "px";
        else v.style.transform = `translate(${bandOx}px, ${bandOy}px) scale(${bandS})`;
        cell.appendChild(v);
      });
      host.appendChild(cell);
      return { g, i, cell, a: i * cellLen, b: (i + 1) * cellLen };
    });
    const win = cells[wi];

    // ---- the winner's full-frame copy (hidden until the wipe) and the light riding the wipe edge ----
    const fullV = vids.find(v => v.dataset.game === cfg.winner + "-full");
    const full = el("div", "full"); full.style.width = W + "px"; full.style.height = H + "px";
    if (fullV) full.appendChild(fullV);
    host.appendChild(full);
    const edge = el("div", "edge"); host.appendChild(edge);

    // ---- chrome dividers ----
    const D = cfg.div || 14;
    const divs = [];
    for (let j = 1; j < n; j++) {
      const dv = el("div", "div"); dv.appendChild(el("i", "spec"));
      if (ax === "x") { dv.style.left = (j * cellLen - D / 2) + "px"; dv.style.top = "0"; dv.style.width = D + "px"; dv.style.height = H + "px"; }
      else { dv.style.top = (j * cellLen - D / 2) + "px"; dv.style.left = "0"; dv.style.height = D + "px"; dv.style.width = W + "px"; }
      host.appendChild(dv); divs.push({ dv, pos: j * cellLen, spec: dv.firstChild });
    }

    // ---- identity chips: losers inside their cell (cell-local coordinates), the winner at host level with a bloom behind it ----
    const bloom = el("div", "bloom " + cfg.winner); host.appendChild(bloom);
    const chips = cells.map((c, i) => {
      const g = c.g, ch = el("div", "chip " + g, `<i class="spine"></i><span class="name">${GAMES[g].name}</span><span class="year">${GAMES[g].year}</span><i class="gloss"></i>`);
      const parent = i === wi ? host : c.cell; parent.appendChild(ch);
      const w = ch.offsetWidth, h = ch.offsetHeight;
      const p = cfg.chip.pos(i, c, w, h);           // settled position in host coordinates
      const lx = i === wi ? p.x : p.x - (ax === "x" ? c.a : 0), ly = i === wi ? p.y : p.y - (ax === "x" ? 0 : c.a);
      ch.style.left = lx + "px"; ch.style.top = ly + "px"; ch.style.transformOrigin = "50% 50%";
      return { ch, x: p.x, y: p.y, w, h, gloss: ch.querySelector(".gloss") };
    });
    const wc = chips[wi], dock = cfg.chip.dock;
    bloom.style.width = (wc.w + 160) + "px"; bloom.style.height = (wc.h + 160) + "px";
    bloom.style.left = (dock.x - 80) + "px"; bloom.style.top = (dock.y - 80) + "px";

    // ================= timeline =================
    REG = [];
    // 1. dividers slam in with overshoot; the cells beside each one wipe in from its edge; 3-frame impact on each land
    const wipeFrom = (i, j) => { // cell i wipes from divider j (pos j*cellLen): anchored at the divider edge
      const fromDividerSide = (i * cellLen >= j * cellLen); // cell is after the divider -> anchored at its start edge
      if (ax === "x") return fromDividerSide ? "inset(0px 100% 0px 0px)" : "inset(0px 0px 0px 100%)";
      return fromDividerSide ? "inset(0px 0px 100% 0px)" : "inset(100% 0px 0px 0px)";
    };
    divs.forEach((d, j) => {
      const at = t.divAt[j], dur = t.divDur, jj = j + 1;   // divider jj sits at jj * cellLen
      if (ax === "x") T(tl, d.dv, { y: -H }, { y: 0 }, dur, at, "back.out(1.6)"); else T(tl, d.dv, { x: -W }, { x: 0 }, dur, at, "back.out(1.6)");
      const owned = jj === 1 ? [0, 1] : [jj];            // the first divider brings both plates beside it, later ones the plate after them
      owned.forEach(i => T(tl, cells[i].cell, { clipPath: wipeFrom(i, jj) }, { clipPath: "inset(0px 0px 0px 0px)" }, dur, at, "expo.out"));
      shake(tl, stage, at + dur, 5, 3);
      // specular pass right after the land, and a slower one during the hold
      const run = (s0, len) => ax === "x" ? T(tl, d.spec, { y: -220 }, { y: H }, len, s0, "power2.inOut") : T(tl, d.spec, { x: -220 }, { x: W }, len, s0, "power2.inOut");
      run(at + dur, 1.0); run(t.specAt + j * 0.15, 1.8);
    });
    T(tl, opener, { opacity: 1 }, { opacity: 0 }, F, t.divAt[t.divAt.length - 1] + t.divDur + 2 * F, "none");
    // 2. chips stamp in with a 1-frame tick on the overshoot; the hold's specular pass also sweeps each chip's face
    chips.forEach((ch, i) => {
      spring(tl, ch.ch, t.chipAt[i]); shake(tl, stage, t.chipAt[i] + 0.14, 3, 1);
      T(tl, ch.gloss, { x: -160 }, { x: ch.w + 160 }, 0.5, t.specAt + 0.35 + i * 0.15, "power2.inOut");
    });

    // 3. the winner takes the frame: clip-path wipe with a lit edge; dividers and losing chips ride the edge off; winner chip docks
    const wa = t.wipeAt, wd = t.wipeDur, E = gsap.parseEase("power3.inOut");
    T(tl, full, { opacity: 0 }, { opacity: 1 }, F, wa - F, "none");
    const winV = vids.filter(v => v.dataset.game === cfg.winner).sort((a, b) => parseFloat(b.dataset.start) - parseFloat(a.dataset.start))[0];
    const focus = winV ? parseFloat(winV.dataset.focus || 960) : 960;
    drive(tl, wa, wd, (p) => {
      const q = E(p), k = 1 - q;
      const lo = win.a * k, hi = along - (along - win.b) * k;   // revealed span along the axis
      if (ax === "x") {
        full.style.clipPath = `inset(0px ${(W - hi).toFixed(2)}px 0px ${lo.toFixed(2)}px)`;
        if (fullV) fullV.style.transform = `translate(${((win.a + cellLen / 2 - focus) * k).toFixed(2)}px, 0px)`;
        edge.style.left = (lo - 70).toFixed(2) + "px";
      } else {
        full.style.clipPath = `inset(${lo.toFixed(2)}px 0px ${(H - hi).toFixed(2)}px 0px)`;
        const s = bandS + (s1 - bandS) * q, tx = bandOx + (tx1 - bandOx) * q, ty = (win.a + bandOy) + (ty1 - (win.a + bandOy)) * q;
        if (fullV) fullV.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${s.toFixed(4)})`;
        edge.style.top = (lo - 70).toFixed(2) + "px";
      }
      edge.style.opacity = (p > 0 && p < 1) ? (p < 0.1 ? p / 0.1 : p > 0.85 ? (1 - p) / 0.15 : 1).toFixed(3) : "0";
      divs.forEach(d => {
        const v = d.pos <= win.a ? Math.min(d.pos - D / 2, lo - D) : Math.max(d.pos - D / 2, hi);
        if (ax === "x") d.dv.style.left = v.toFixed(2) + "px"; else d.dv.style.top = v.toFixed(2) + "px";
      });
      chips.forEach((c, i) => {
        if (i === wi) { c.ch.style.left = (dock.x + (c.x - dock.x) * k).toFixed(2) + "px"; c.ch.style.top = (dock.y + (c.y - dock.y) * k).toFixed(2) + "px"; return; }
        if (ax === "x") { const sh = cells[i].a < win.a ? Math.min(0, lo - (c.x + c.w + 24)) : Math.max(0, hi + 24 - c.x); c.ch.style.transform = `translate(${sh.toFixed(2)}px, 0px) scale(1)`; }
        else { const sh = cells[i].a < win.a ? Math.min(0, lo - (c.y + c.h + 24)) : Math.max(0, hi + 24 - c.y); c.ch.style.transform = `translate(0px, ${sh.toFixed(2)}px) scale(1)`; }
      });
    });
    // 4. the land beat: 3-frame exposure peak on the winner plate (highlights bloom, blacks stay), a 4-frame 1.035 scale punch,
    //    a 3-frame accent bloom behind the winner chip, and a 3-frame impact
    const land = wa + wd, hold = 3 * F, decay = 0.3;
    drive(tl, land, F + hold + decay, (p) => {
      const tt = p * (F + hold + decay); let k = 0;
      if (p > 0 && p < 1) k = tt < F ? tt / F : tt < F + hold ? 1 : 1 - gsap.parseEase("power2.out")((tt - F - hold) / decay);
      bloom.style.opacity = k.toFixed(3); bloom.style.transform = `scale(${(0.7 + 0.5 * Math.min(1, tt / (F + hold))).toFixed(3)})`;
      full.style.filter = k > 0.002 ? `brightness(${(1 + 0.22 * k).toFixed(3)}) saturate(${(1 + 0.08 * k).toFixed(3)})` : "";
    });
    full.style.transformOrigin = "50% 50%";
    T(tl, full, { scale: 1.035 }, { scale: 1 }, 4 * F, land, "power2.out");
    shake(tl, stage, land, 4, 3);
    pinStarts(tl, 0);
    tl.set({}, {}, t.end);
  }
  window.Split = { build, GAMES };
})();
