/* SpinSim: deterministic prize-wheel physics (no randomness, no timers). Pure JS, no THREE.
   The wheel turns clockwise on screen (theta, degrees). Pegs sit at every wedge boundary; a sprung flapper (the ticker)
   rests between them. A peg that reaches the flapper's tip pushes it (the flapper's spring brakes the wheel) until the tip
   slips off at dMax, then the flapper snaps back with a damped spring. Dry friction plus a little air drag slow the wheel.
   The launch speed is solved by bisection so the wheel comes to rest exactly on CONFIG's target angle.
   simulate(o) -> { at(t) -> {theta, d, omega}, tStop, thetaStop, ticks[] }  (t in seconds from launch) */
(function (root) {
  function run(o, w0) {
    const dt = 1 / 2400, D = 360 / o.n, R = o.rPeg, e = o.e, dMax = o.dMax;
    const wf = 2 * Math.PI * o.flapHz, zeta = o.flapZeta;
    let th = o.theta0, om = 0, d = 0, vd = 0, contact = 0, side = 1, t = 0, stopped = false;
    const step = 1 / 240, samples = [], ticks = [];
    let nextS = 0;
    const rel = (th) => { let s = ((o.pegOffset + th - o.pointer) % D + D) % D; if (s >= D / 2) s -= D; return s; };
    const N = Math.ceil(o.tMax / dt);
    for (let i = 0; i <= N; i++) {
      t = i * dt;
      if (t >= nextS - 1e-9) { samples.push(th, d, om); nextS += step; }
      if (stopped) continue;
      // launch impulse: a short hand push
      const push = t < o.pushDur ? w0 / o.pushDur : 0;
      const s = rel(th), yp = R * Math.sin(s * Math.PI / 180);
      // flapper / peg contact
      if (contact) {
        const u = side > 0 ? yp + e : yp - e;
        if (side > 0) {
          if (u >= dMax) { contact = 0; d = dMax; vd = 0; ticks.push(t); }
          else if (u <= 0) { contact = 0; d = 0; vd = 0; }
          else { vd = (u - d) / dt; d = u; }
        } else {
          if (u <= -dMax) { contact = 0; d = -dMax; vd = 0; ticks.push(t); }
          else if (u >= 0) { contact = 0; d = 0; vd = 0; }
          else { vd = (u - d) / dt; d = u; }
        }
      } else {
        const a = -wf * wf * d - 2 * zeta * wf * vd; vd += a * dt; d += vd * dt;
        // a peg can only catch the tip from the side it travels toward: forward spin -> side A, rock-back -> side B
        if (om >= 0 && yp < d && yp + e >= d && yp + e < dMax) { contact = 1; side = 1; d = yp + e; vd = 0; }
        else if (om < 0 && yp > d && yp - e <= d && yp - e > -dMax) { contact = 1; side = -1; d = yp - e; vd = 0; }
      }
      const F = (contact ? -o.G * d : 0) + push;
      if (om === 0) {
        if (Math.abs(F) > o.mu) om += (F - o.mu * Math.sign(F)) * dt;
        else if (!contact && Math.abs(d) < 0.05 && Math.abs(vd) < 2 && t > o.pushDur) stopped = true;
      } else {
        const sg = Math.sign(om), nw = om + (F - o.drag * om - o.mu * sg) * dt;
        om = (Math.sign(nw) !== sg && Math.abs(F) <= o.mu) ? 0 : nw;
      }
      th += om * dt;
    }
    return { samples, step, ticks, thetaStop: th, stopped };
  }
  function at(sim, t) {
    const S = sim.samples, n = S.length / 3;
    let x = Math.max(0, t) / sim.step, i = Math.floor(x), f = x - i;
    if (i >= n - 1) { i = n - 1; f = 0; }
    const j = Math.min(n - 1, i + 1);
    return { theta: S[3 * i] + (S[3 * j] - S[3 * i]) * f, d: S[3 * i + 1] + (S[3 * j + 1] - S[3 * i + 1]) * f, omega: S[3 * i + 2] + (S[3 * j + 2] - S[3 * i + 2]) * f };
  }
  function tStop(sim) {
    const S = sim.samples, n = S.length / 3;
    for (let i = n - 1; i > 0; i--) if (Math.abs(S[3 * i] - S[3 * (i - 1)]) > 1e-6) return (i) * sim.step;
    return 0;
  }
  function simulate(o) {
    // bisection on the launch speed so the wheel rests on o.target (absolute theta)
    let lo = o.w0lo, hi = o.w0hi, best = null;
    for (let k = 0; k < (o.iters || 40); k++) {
      const mid = (lo + hi) / 2, r = run(o, mid);
      if (!best || Math.abs(r.thetaStop - o.target) < Math.abs(best.r.thetaStop - o.target)) best = { r, w0: mid };
      if (r.thetaStop < o.target) lo = mid; else hi = mid;
      if (Math.abs(r.thetaStop - o.target) < 0.05) break;
    }
    const r = best.r;
    return { at: (t) => at(r, t), tStop: tStop(r), thetaStop: r.thetaStop, ticks: r.ticks, w0: best.w0, err: r.thetaStop - o.target };
  }
  root.SpinSim = { simulate, run };
  if (typeof module !== "undefined") module.exports = root.SpinSim;
})(typeof window !== "undefined" ? window : globalThis);
