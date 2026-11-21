# 48 Mission HUD: decisions

## Evidence (both variants)
- yt-zvdxphGS07o t00898 (5.8M views, long-form): a recreated RC-helicopter mission HUD over a dark drone shot.
  `TARGETS LEFT: 3` top-right (x 72-98%, y 3-9%, pale cyan heavy caps with a dark outline, ~4% frame height),
  an empty outlined battery bottom-left (~14% frame width, y 78-92%), a bright green plus-crosshair with a dot dead centre.
- Static; nothing animates; flat strokes, no light, no state change. The job: tell the viewer "this is a mission, here is
  the objective, here is how many targets are left, here is the resource running out".
- Neighbouring frames (t00890-t00906) are the creator's own TV-set B-roll; the HUD only lives on the gameplay shot.

## Variant A: Objective HUD (16:9, 1920x1080, 6.0 s)
**Evidence kept:** counter top-right docked 56-64 px from the edges, battery bottom-left, plus-crosshair dead centre,
plus the GTA-style objective line bottom-centre that the brief asks for (white Barlow Condensed with one red keyword).

**Our upgrade**
- The count is real geometry: Barlow Condensed Black numerals extruded 13 px with a rounded bevel. Face = pale-cyan
  enamel ramp (white cap to #2FB4E8 at the baseline) with a matching emissive so it glows like HUD light; sides =
  dark glossy ink metal (#0C1A24), so the evidence's dark outline becomes the numeral's real depth. Studio PMREM env,
  key + hemisphere light, ACES.
- The digits sit on a real drum (radius 0.75 x cap) behind a clipped window: the 3 rolls up and back, the 2 rolls in
  from below with overshoot. Nothing crosses the label.
- The battery is a 3D object: glossy white enamel shell with a nub over a dark ink backing slab (the outline),
  smoked-glass floor, five extruded cells that glow cyan. It boots up cell by cell and later loses one (80% -> 60%,
  the cell flickers out, readout rolls).
- Crosshair, lock brackets, hit marker and the "kill comet" are drawn per frame on a 2D canvas with dark outlines and
  canvas glow (no CSS/SVG filters, so nothing paints late at a cut, lesson 25).

**Shots and cuts (2-frame overlaps, outgoing on top)**
- 0.00-0.90 v45 beach aerial (drone view, HUD boots).
- 0.83-2.55 v21 race top-down (the target: the lime car; its real explosion lands at media 1.0 s = 1.83 s).
  Lock brackets track the car from per-frame colour tracking of the shot.
- 2.48-6.00 v52 police bridge (more targets incoming; HUD holds, battery drains).

**Payoff (2.12 s, hero 2.25 s):** lock (1.42, brackets snap and go red with the crosshair) -> fire (1.56) -> the
car explodes in the footage (1.83, hit marker, shake) -> a cyan comet flies from the wreck to the counter ->
the drum rolls 3 -> 2, the new face fires white-hot and cools to cyan, a key light rakes, a clipped specular band
sweeps the face, the counter punches 1.22x on a spring. Held to the exit at 5.25 (3.1 s).

## Variant B: HUD for Shorts (9:16, 1080x1920, 5.05 s)
Phone-first (lesson 26), r04: one centred column whose blocks share edges at about x 215-860 (60% of the width), all
inside the Shorts safe zone (measured on bg:none: x 213-861, y 234-1477):
- `TARGETS LEFT` 104 px (y 246-319) over the 3D numeral, cap 380 (y 367-747);
- the crosshair at frame centre with air on both sides (y 890-1030); the lock brackets ride the car (the -h shot mapped
  at 1.78x and offset so the car sits mid-frame);
- the objective in two 70 px lines (y 1133-1274);
- the gauge row: a 384x144 3D enamel battery and its 104 px readout, the pair centred (y 1312-1476).
One payoff: firing costs a cell (in the build), then hit -> comet -> the drum rolls 3 -> 2 with the hot face, rake and punch.
Then the HUD gets out of the way (lesson 7), r05: at 2.85 the counter docks to 0.56x (label cap line fixed, y 246-~527),
the objective clears, and the gauge row shrinks to 0.76x about its bottom centre (gauge ~292 px); the crosshair is left alone
over the action, the evidence's three-part HUD (counter / crosshair / battery). Shots: v45 beach, v21 race (payoff),
v12 heli dusk (dock), v36 hills view (bright end, exit at 4.45).

## Round log
- r01 (7/7, 1 defect): first build. Self-review fixes before capture: payoff glow drew over the numeral (depthTest) and was oversized on B (now sqrt-scaled, local); drum roll sped to 0.26 s and the old digit hidden past 56 deg so its dark underside never lingers; hidden readout spans no longer sit over the white shell (contrast false positives); B objective lifted 30 px off the battery label.
- r02: fixes from the r01 critic.
  - [defect] Hit marker: the reticle now slews onto the target from acquire (1.06) to lock (1.42), rides it to the hit, so
    the hit X is concentric with the reticle; X pops 1.4 -> 1 (back.out 3, 0.12 s), white 2 frames then red, collapses by
    2.09. Lock brackets no longer burst/fade: they collapse into the hit point in 0.1 s and cut on the zero frame.
  - Dead back half: the ground-level v52 chase is gone; the hold is the overhead v47 Chiliad drone shot (2.48-4.85), the
    reticle sways like a drone camera (+-5 px / 1.8 s), battery drains at 3.35; runtime 6.0 -> 4.85 s (payoff held 2.1 s).
  - v0 payoff punch: counter cap 104 -> 120, spring 1 -> 1.32 -> 1, label kicks 12 px toward the count, specular band
    over 0.28 s right after the roll, bloom radius 1.5x held 3 frames.
  - Battery labels 36 -> 44 (A), 46 -> 60 (B); the % rolls only after the dying cell settles.
  - B: counter label 92 px over a 300 px-cap numeral (phone-first hero); objective 60 px = battery label size (3 sizes).
  - Result r02: v0 8 (LOCKED), v1 7, 0 defects.
- r03 (B only; v0 locked, VS-PREV 0.996 unchanged): s2 is now the native -v v12 heli city dusk (sharp, no upscale), runtime
  4.07; battery centred on the axis under the objective (one centre column), objective at 1060; scrims x0.7 on bg:none and a
  tight glyph shadow; only the tens digit of the readout rolls; exit order label -> cells -> shell so the readout never
  disagrees with empty cells; numeral side faces get an emissive lift so the exit tumble is not a black slab.
  - Result r03: v0 8, v1 7, 1 defect (digit contact shadow clipped by the drum window's clipBot plane, hard edge under the
    numeral, both variants). Round limit reached; unresolved: that shadow clip, B column spacing (gap under the numeral,
    reticle close to the objective, small gauge).
- r04 (second pass; v1 only, plus the r03 defect, which the verdict listed for both variants):
  - [defect, v0+v1] The digit contact shadow no longer uses the drum window's hard clip planes. It is a ShaderMaterial
    whose alpha is multiplied by a soft vertical window feathered 14-52 x SC outside the drum window, so the settled
    shadow fades out (no shelf) and shadows of rolled-out digits still vanish. A changes only here (VS-PREV v0 0.9954).
  - v1 column (lesson 26): numeral cap 300 -> 380, label 92 -> 104 px (tracked .075em to the column edges), objective
    60 -> 70 px at y 1133, gauge 226x104 -> 384x144 (geometry scaled from the box height) in a row with its readout
    (104 px, the word "Battery" dropped: the gauge and the objective name it), the pair centred by projecting the
    gauge's ink edges. Reticle air: 143 px above, 103 px below.
  - One payoff beat: the drain moved from 2.75 (a second beat in the hold) to the fire (1.58): off, flicker, dead at
    +0.1 s, and the tens digit rolls 8 -> 6 on that frame through a cap-band odometer mask. The post-drain sheen is gone.
  - Payoff punch 1.32 -> 1.22, anchored 10% below the cap line so it grows away from the label; the label is shoved up
    7 px instead of down. Flip 2.12 -> 2.10, race shot held to media 1.75 s (s2 from 2.517). bg:none scrims x0.5.
  - Result r04: v0 8 (lock held, VS-PREV 0.9954), v1 7, 1 defect: the drum's clip planes cut the top of the landed digit
    flat when the roll overshoots (punch peak; also the entrance), both variants. v1 gaps: never docks (covers the
    gameplay for 4 s), the 415 px battery + 104 px readout read as an iOS widget, poster-wide label tracking, thin comet.
- r05 (final round):
  - [defect, v0+v1] The clip planes are live only while a digit is leaving (top: the old digit at the payoff, the exit) or
    entering (bottom: the entrance, the new digit until it reaches phi 0). Releasing is pop-free: at that frame nothing
    lies outside the window. A changes only here (VS-PREV v0 0.9956).
  - v1: the dock above; entrance overshoot back.out 1.4 -> 0.8 and payoff roll 1.5 -> 1.1 so the unclipped digit never
    reaches the label; label tracking .075 -> .04em; readout 104 -> 92 px (70 px docked); comet core 8K -> 13K px with a
    36K bloom and a 34K head; keyword red #FF4652 -> #FF737C (passes the 3:1 check over mid-tone asphalt); objective
    scrim 0.32; runtime 4.07 -> 5.05 (s3 v36 hills from 4.003).

