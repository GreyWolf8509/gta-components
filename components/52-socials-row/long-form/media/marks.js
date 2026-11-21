/* Our own social marks (no platform logos): play triangle, camera, bird, music note.
   SocialMarks(kind) -> [{o: [[x, y], ...], h: [[[x, y], ...], ...]}]: filled outlines with holes, in a 100 x 100 box,
   y down, optically centred on (50, 50). Overlapping outlines are a union (same height, same material), so a mark can be
   built from simple parts. Used by social3d.js for the extruded marks and for the soft contact shadow they cast on the
   tile face. Identical copy in a/media and b/media. */
(function (root) {
  const D = Math.PI / 180;
  // a polygon with every corner rounded by a quadratic fillet (r = distance from the corner along each edge)
  function roundPoly(V, R, n) {
    n = n || 8; const out = [], N = V.length;
    for (let i = 0; i < N; i++) {
      const P = V[i], A = V[(i + N - 1) % N], B = V[(i + 1) % N], r = Array.isArray(R) ? R[i] : R;
      const la = Math.hypot(A[0] - P[0], A[1] - P[1]), lb = Math.hypot(B[0] - P[0], B[1] - P[1]);
      const ra = Math.min(r, la * 0.5), rb = Math.min(r, lb * 0.5);
      const p0 = [P[0] + (A[0] - P[0]) / la * ra, P[1] + (A[1] - P[1]) / la * ra];
      const p1 = [P[0] + (B[0] - P[0]) / lb * rb, P[1] + (B[1] - P[1]) / lb * rb];
      for (let k = 0; k <= n; k++) {
        const t = k / n, u = 1 - t;
        out.push([u * u * p0[0] + 2 * u * t * P[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * P[1] + t * t * p1[1]]);
      }
    }
    return out;
  }
  function ellipse(cx, cy, rx, ry, rot, n, rev) {
    n = n || 64; const out = [], c = Math.cos(rot * D), s = Math.sin(rot * D);
    for (let k = 0; k < n; k++) {
      const a = (rev ? -1 : 1) * k / n * Math.PI * 2, x = rx * Math.cos(a), y = ry * Math.sin(a);
      out.push([cx + x * c - y * s, cy + x * s + y * c]);
    }
    return out;
  }
  const circle = (cx, cy, r, n, rev) => ellipse(cx, cy, r, r, 0, n, rev);
  // cubic path: start + [c1x, c1y, c2x, c2y, x, y] segments
  function cubic(start, segs, n) {
    n = n || 10; const out = [start.slice()]; let p = start;
    segs.forEach((s) => {
      for (let k = 1; k <= n; k++) {
        const t = k / n, u = 1 - t;
        out.push([u * u * u * p[0] + 3 * u * u * t * s[0] + 3 * u * t * t * s[2] + t * t * t * s[4],
                  u * u * u * p[1] + 3 * u * u * t * s[1] + 3 * u * t * t * s[3] + t * t * t * s[5]]);
      }
      p = [s[4], s[5]];
    });
    out.pop();
    return out;
  }

  function SocialMarks(kind) {
    if (kind === "play") {
      // rounded play triangle; its centroid sits at x 50.7 so it reads centred
      return [{ o: roundPoly([[34, 20], [34, 80], [84, 50]], 10, 10), h: [] }];
    }
    if (kind === "camera") {
      // a solid camera body with a viewfinder hump, a lens ring (hole) around a lens disc, and a flash window
      const body = roundPoly([[13, 33], [35, 33], [40, 22], [60, 22], [65, 33], [87, 33], [87, 80], [13, 80]], [12, 3, 4, 4, 3, 12, 12, 12], 8);
      return [
        { o: body, h: [circle(50, 57, 17.5, 72, true), circle(76.5, 43, 3.8, 24, true)] },
        { o: circle(50, 57, 10.5, 60), h: [] }
      ];
    }
    if (kind === "bird") {
      // a perched songbird facing right: round head, short beak, tilted body, a forked tail and a wing raised off the back
      const head = circle(63, 35, 13.5, 56);
      const beak = roundPoly([[73, 29.5], [90, 36], [73, 42]], [2, 2.2, 2], 6);
      const body = ellipse(48, 57, 27, 18.5, -16, 72);
      const tail = roundPoly([[30, 55], [7, 62], [14, 67], [8, 74], [34, 69]], [3, 2.5, 3, 2.5, 3], 6);
      const wing = cubic([60, 52], [[52, 37, 37, 26, 16, 22], [20, 36, 27, 51, 38, 61], [46, 64, 55, 60, 60, 52]], 14);
      return [
        { o: body, h: [] }, { o: tail, h: [] }, { o: beak, h: [] },
        { o: head, h: [circle(66.5, 31, 3.0, 20, true)] },
        { o: wing, h: [] }
      ];
    }
    if (kind === "note") {
      // two beamed eighth notes: tilted heads, upright stems on the heads' right, one thick slanted beam
      return [
        { o: ellipse(31, 75, 12.5, 9, -22, 56), h: [] },
        { o: ellipse(69, 66, 12.5, 9, -22, 56), h: [] },
        { o: [[36.5, 74], [36.5, 30], [43.5, 30], [43.5, 72]], h: [] },
        { o: [[74.5, 65], [74.5, 21], [81.5, 21], [81.5, 63]], h: [] },
        { o: roundPoly([[36.5, 24], [81.5, 13], [81.5, 27], [36.5, 38]], 2.5, 4), h: [] }
      ];
    }
    return [];
  }
  root.SocialMarks = SocialMarks;
  if (typeof module !== "undefined") module.exports = SocialMarks;
})(typeof window !== "undefined" ? window : globalThis);
