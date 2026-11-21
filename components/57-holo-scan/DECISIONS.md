# 57 Holo scan: decisions

## Variant A (16:9, long-form)

**Evidence.** `yt-c-I-jXpGuOk` t00100 (8.1M views): the frame becomes a holographic point cloud (cream particles on black), with
thin-line HUD data boxes (bracket corners, tiny mono text) floating in columns at x 3–15% and 82–98%. It is a
"scanning / analysing" beat; the particles imply an assemble or dissolve. Rough: flat 2D particle filter, unreadable HUD text,
no object state, no payoff.

**Our upgrade** (r01-r03 design below; r04 replaced the car, the scan and the exit, r05 smoothed the car and rebuilt the payoff, see the round log).
- Hero object is real Three.js geometry: a procedural mid-engine sports car (parametric body with fender bulges,
  side intake scallop, wheel wells cut into the flank with rolled arch lips, glass cabin with painted pillars, lathe tyres,
  extruded 5-spoke rims, discs + calipers, airfoil wing on struts, swept lamps).
- Scan phase: a volumetric curtain (7 stacked planes) that fills the car's actual cross-section at the plane (a CT-style slice
  from the same profile functions) sweeps nose to tail. Behind it ~110k surface-sampled points condense onto the body and
  world-space lidar contours (x rings, y waterlines, z on top surfaces, constant-pixel width via fwidth) plus a fresnel rim
  light up; the laser contour wraps the body where the plane cuts it. No rings, rays or sparkles.
- HUD tags lock as the curtain crosses each part: bracket reticle lands at 2.6x rotated 45 deg and snaps tight (back.out),
  2-frame white flash, leader draws anchor -> elbow -> tag, tag wipes open from the leader side, value rolls up in a window.
  Values in Archivo 900 narrow 56 px, keys JetBrains Mono 21 px, index chips.
- Readout under the car: scan % (tabular) + segmented bar.
- **Payoff (2.94 s): the lock.** The curtain bounces at the tail and runs back as a lock wave that prints the car solid:
  clearcoat chrome-teal body (PMREM studio with a horizon reflection ring), dark tinted glass, chrome rims, rubber, carbon wing.
  Localized light on the car (fresnel rim + emissive, peak held 3 frames), the % rolls out and "213 MPH" slams up in
  caption yellow, bar flips yellow. Hold with a raking light 3.2–4.6 and a slow 16 deg orbit.
- Exit: the curtain re-ignites and erases the car nose to tail (points kicked up, slice fills the cut face), tags retract
  into their anchors, readout wipes. Bed released to a bright skyline shot for the 0.4 s tail.
- Bed: v17 -> v31 -> v38 -> v44 (-h), cut like an edit with 2-frame overlaps, graded under the hologram
  (brightness .52, contrast 1.2, saturation .7, 5 px blur), slow push.

**Payoff beat:** 2.94 s (hero 3.15).

## Variant B (9:16, Shorts), phone-first

**Evidence** as above; the brief asks for the object centred and labels stacked down one side.

**Our upgrade** (r01-r04; r05 moved to a 2x2 data-box grid and an ~80% car, see the round log). Same 3D car and scan, framed phone-first: the car is ~69% of the frame width mid-frame (y 660–1050),
the readout is the hook-zone headline (Archivo 900 236 px number, 32 px mono kicker, 18 px segmented bar, y 236–572).
Numbered reticles lock onto the parts on the car with numbered pins on short leaders; the matching spec rows (72 px index
chip, 66 px value, 25 px key) stack down the left under the car (y 1096–1476), each wiping open as its part locks.
Same lock-wave payoff, same exit. Everything inside x 72–936, y 230–1480.

**Payoff beat:** 2.94 s (hero 3.15).

## Round log
- r01: first build.
- r02 (r01 critic: both 7): hold is now a dense locked point-cloud sculpture (points snap onto the surface with a back.out, density fill, white flip) over a dark clearcoat body; ghost silhouette from 0.3 s so the car reads early; payoff = 3-frame bloom peak + cut to the bright bridge shot on the beat + 213 MPH slam; projector pool, floor dot bed, scanlines. A: tags auto-width, word-spacing, 20″. B: full-width numbered spec rows (76 px values) under bigger on-car pins. Mirrors removed, thicker wing. Bed v17 -> v31 -> v44 -> v36.
- r03 (r02 critic: both 7, cloud a uniform speckle, hold dimmer than the build, slab a rounded rectangle): points now sit on lidar strata (80% slid along the surface onto 3 cm waterlines on flanks / 3.5 cm cross lines on top surfaces; wheels' rims stay free), depth-scaled size (pow 2.5), silhouette weighting (face-on fill thinned, edges denser, brighter, bigger); the lock snaps the loose cloud onto those strata, so the payoff is speckle -> engraved scan. Hold kept at ~75%+ of the peak (hot x1.35 instead of x2), plus a one-pass rake band (0.3 m, x2.5) nose to tail 3.2-4.6 s. Printed body is a translucent lit shell (alpha .55 over a depth prepass) so the hologram stays light. Build wire is waterlines only (no CAD grid); the scan slice is hatched with the strata on the core plane only. A: keys 27 px, leaders 5 px with a dark edge, chips numbered in reading order. Bar collapses to the centre on exit (0.18 s power3.in, 6 px blur) in both.
- r04 (r03 critic: both 7; car a rounded blob, scan a glowing slab / white pill at the exit, holo over the plate's own car, readout pops in, v1 washes out): **new hero object.** `media/holo3d.js` v2 builds a faceted wedge supercar as a hard-surface loft of 8 crease rails (keel, floor, sill, side crease, shoulder, beltline, roof edge, crown), linear between key stations, so every panel is a flat facet and every crease a real edge: blade nose with a slatted lower intake, fender peaks over a hood valley, steep windshield, side glass, rear glass + 8-louvre engine deck, a scoop intake ahead of the rear wheel, hexagonal wheel arches cut into the flank, door / lid / vent seams, swept headlight clusters (outline + DRL + lens fill), tail light bars, rear wing on struts. The point cloud is now ~60k surface strata points + ~50k feature points sampled along every crease (dihedral > 9 deg), material boundary (window frames) and panel seam, so the car reads from its edges; a faint ghost of those edges is up from 0.12 s, so "car" reads before the scan. **Scan** = a 1.1 cm laser contour where the plane cuts the body (end faces excluded) + hot points at the plane + a thin floor line; the slab planes are gone. **Lock (2.94 s)** = the wave runs tail to nose printing a dark clearcoat facet shell (flat shaded, PMREM studio) with a hatched glowing section at the cut; the lamps switch on white; the 4 reticles kick out and snap tight (white 3 frames); 213 MPH slams; 3-frame localized glow. Hold: rake light + soft band across the facets. **Exit** = a linear nose-to-tail erase with the same glowing section; the shell and section thin out before the tail and the last 0.3 m dissolves as points, so no end slice is left floating. Plate: v12 dusk city -> v41 smokestacks -> v44 (payoff) -> v36, no cars in shot; bed blur 4 / brightness .64 / contrast 1.15 / saturation .85 plus a black radial behind the car (plate only). Readout enters with a mask wipe + 6 px blur. B: row keys 40 px heavy mono, pins 44 px, reticles R 30.
- r05 (r04 critic: both 7, no defects; car a blocky cube-built wedge, the lock floods into a flat cyan shell and the cloud dies, 213 just appears, HUD hairlines vanish at phone size, v1 table reads as an app widget): **smooth loft.** The 8 rails are pchip curves along the car and Hermite-subdivided across (sharp only at the sill, side crease, shoulder and roof edge), with smoothing groups per panel band and per-vertex normals, round wheel arches (r .42), a tapered rounded tail; crease / seam / lamp lines are still sampled as feature points. **Living lock.** The shell is thin (alpha .36, no flat shading, no emissive flood) so the point cloud stays the hero after the lock: points keep a shimmer, ~3.5% sparkle points twinkle, rim points are brighter; at the lock one specular band rakes the shell nose to tail (0.24 s) and the cloud squeezes 6% and springs back (back.out 2.2). **Readout.** 213 counts up 000 -> 213 over 0.45 s, swells to 1.1 and lands on elastic.out at lock + 0.35 s over a local gold bloom; the bar fills gold left to right (0.3 s) and a sheen crosses it. A: HUD weights up (corners 6 px, leaders 6 px + glow, reticle strokes 6 px, keys bolder) so it holds at phone size; 140k points. B: car ~80% width (dist 21.5); the spec rows are now 4 bracketed HUD data boxes (420 x 178, corners 40/6 px, glowing spine, numbered chip + 40 px heavy mono key + 78 px Archivo value) in a 2x2 grid at y 1098-1476, each wiping open as its reticle locks and flashing white with the reticles at the lock; 100k points.
- r05 critic: v0 8 (locked), v1 6 with one defect: the wing pin "04" sits at x 955-994 and the car tail reaches x 951 through the hold (safe-zone limit 936). Open fix for the next pass (B only): flip the wing pin inboard (POFF.wing x negative) and move the car left ~60 px (CONFIG.car.shift x) or back off dist, then re-check x <= 936 across yaw 128-146. tile.json: a -> r05, b -> r04 (7, no defects).
- r06 (B only; v0 locked, a/ untouched; b/media/holo3d.js is b's own copy): **safe-zone fix.** dist 21.5 -> 23.5 and shift x -30 -> -36 (car ~75% width, settled x 92-916 across yaw 128-146, measured on every bg:none frame); the wing pin flips inboard (POFF.wing [-64, -96]); reticle snap-in 2.6x -> 2.3x; the readout rises in from below (+30 px) and exits with -6 px, so no frame crosses y 230; the erase kick's outward push 0.25 -> 0.15. **Projector pad** (critic: the hold floats): a 2.2 m holo emitter disc under the car (3 px rim with halo that draws round from the nose on boot and retracts toward the tail behind the erase, dashed inner ring, slowly turning tick ring, a radar sweep during the hold, the scan line crossing it, a lock ripple running out to the rim at 2.94 s), a concentric dot lens bed, and a contact glow brightest along the footprint edge and under the tyres (masked behind the erase so no flat slab is revealed). **Rear flank:** body samples on the rear half of the flanks x1.7, intake weight .5 -> .85, 115k points, plus a cool rim light from behind the tail on the points and the printed shell. **Bed:** the dim / scrim now clears with the erase (gone at erase1 + 0.04). r06 critic: v0 8, v1 8, no defects -> PASSED. tile.json b -> r06.
