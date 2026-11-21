# 45 District pop-up: decisions

## Variant A (16:9, "Corner place")
**Evidence.** Both evidence frames are a script place name with no box: white bold brush script "Los Santos" bottom-right
(yt-c-I-jXpGuOk t132, x 83-97%, ~4% frame height, soft dark shadow) and gold cursive "Ocean Drive" (yt-zvdxphGS07o t457,
x 55-98%, y 78-95%, ~7% height, darker gold edge + soft shadow). It sits static on the establishing shot after the scene
changes; the creators' motion is a fade at best.

**Our upgrade.** Same object, same corner, same scale (~970 px wide, letters ~130 px tall, right ink edge at x 1800, baseline 922).
- The script is real geometry (Three.js, `media/script3d.js`): single-line centre strokes of an OFL brush script
  (EMS Brush = Alex Brush) swept into a gold tube with a brush-pen pressure model (heavy downstrokes 0.12 em, hairline
  upstrokes 0.045 em, tapered free ends), a flattened elliptic cross-section (a lit relief), MeshPhysical gold
  (metalness 1, clearcoat) under a warm PMREM studio, key + hemisphere light.
- It literally writes on: the tube is cut at a pen tip that travels the strokes in order with pen lifts; the fresh ink is
  hot white-gold and cools into polished gold behind the tip.
- Lock-in (payoff, 2.34 s): a swash flicks under the word (fast attack, long release), a soft specular band rakes the
  letters, the key light crosses the relief, bloom peaks 3 frames, a 2.8% punch; the district line ("— LOS SANTOS",
  Archivo wide 800) rises letter by letter out of a window under the swash with a gold rule shooting out.
- Legibility without a box: a 1.6 px dark bronze edge, an offset soft shadow and a soft dark halo (post, from the alpha).
- Exit: the district line drops back into its window, then the pen un-writes the script (no fade).

**Shots / cuts.** v05 (Franklin's street, the scene before) 0-0.80 → cut to v36 hills over downtown (the establishing
shot; write-on starts 0.84) → v12 Los Santos at dusk 2.63 → v28 mansion tennis court 4.13 → end 5.5. Incoming shots start
2 frames early underneath (lesson 25).

**Payoff:** 2.34 s (lock-in); hero 2.55.

## Variant B (9:16, "Place for Shorts")
**Evidence.** Same component; on Shorts the creators' version has to read at phone size.
**Our upgrade.** Phone-first: "Grove / Street" stacked in two big lines (em 290 px, ~660 px wide each) in the lower
safe zone (y ~840-1450, x 76-930), same 3D gold brush-pen relief in the EMS Allure (Allura) strokes, which read clearest at phone size (Alex Brush's r-o join read as "Grave"), thicker strokes (8-9 px thick at 360x640), 2.4 px
bronze edge, stronger halo, district line at 52 px. Same write-on, swash lock-in and un-write exit.
**Shots / cuts.** v17 driving at sunset 0-0.80 → v24 sunset power lines (Grove-style street, establishing) → v13 lowrider
crew 2.43 → v39 lowriders 3.53 → v14 drive-by sunset 4.63 → end 5.6.
**Payoff:** 2.32 s; hero 2.55 (r03: 2.133 s on the cut, hero 2.3).

## Round log
- r01: first build. Self-review fixes before the critic: B font Brush -> Allure (legibility), sharper stroke tapers (no ball ends), flatter relief, warmer and softer payoff sweep (no white blow-out), dark halo for bright footage.
- r02 (v0 locked at 8, untouched; v1 was 7): B's helper became a "union relief" renderer: every stroke writes height into one
  field that is lit once (softened normals, foil-gold environment bands: pale top, gold body, dark band under the crown, warm
  amber bounce, sharp key specular, bronze rim), so joins and crossings merge like ink instead of stacking highlights. Halo
  0.42 -> 0.18, size 290 -> 255 (block x 120-900, ~72% width), stroke 0.135 / 0.046 em (more contrast kept legible: higher
  contrast turned the o of "Grove" into an a), font Allure -> EMS Decorous Script (Petit Formal Script strokes), whose o and v
  stay distinct at any weight, line gap 0.91 em, the hold recast onto v49 (Franklin by the Grove-style mural, bright day) and
  the piece ends on bright v39 lowriders; the district rule is now a tapered, tube-lit wedge; lock-in breathe 3.6%.
- r03 (v0 locked, untouched; v1 was 7 for "piped icing" knobs and paying off on soft gameplay): every free stroke end now
  tapers to a 0.012 em point over ~12% of the stroke, corner joints are buried (0.92x), joins merge at 0.06 em, the relief is
  flatter (z 0.42) and the strokes lighter (0.118 / 0.042 em): engraved gold terminals, no beads. Write-on 1.2 -> 1.0 s.
  Recut: v17 drive-in -> v49 Grove-style mural (write-on, Franklin's full face clear of the type) -> the lock-in lands ON the
  cut to v39 lowriders (2.133 s, bright, sharp trailer shot) -> v24 sunset power lines to the end. A slow key-light drift
  through the hold keeps the highlights moving. Hero 2.3 s.
- r03 verdict: 8/8, no defects; PASSED (sticky).
