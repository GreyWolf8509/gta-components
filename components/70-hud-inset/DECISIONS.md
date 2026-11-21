# 70 HUD inset: decisions

## Evidence (both variants)
- yt-Vom5ya5cbQY t00336 (3.8M, long): a boxed stat inset lower-left (x 8-38%, y 65-87%, ~30% of the width): a thin white
  border round a window of gameplay sky, white condensed "WATER 87 m  YOU 243 m" and a grey "next rise in 9 s". It sits
  over the talking head and the drive (t00328-t00340) and its numbers change with the story; flat, no light, no depth.
- yt-zvdxphGS07o t00898 (5.8M, long): a mission HUD whose resource gauge is an outlined battery bottom-left (~14% width,
  y 78-92%), shown empty: the "you're running out" state. Static, 2 px strokes.
- yt-o4nNjj44d4M t00287 (3.8M, long): a recreated game panel right side (x 63-88%), translucent purple box with glowing
  pink borders, condensed white caps; it zooms out of a small source box.
- The job: a boxed game-style panel parked in a corner whose meter tells the story (resource draining, a stat changing),
  so the viewer feels the stakes. Creators' versions are flat strokes and default type with no state change.

## Variant A: Boxed meter inset (16:9, 1920x1080, 5.6 s)
**Our version:** a VITALS module, our own HUD design (not GTA's minimap + strips): a chamfered slab (top-right and
bottom-left corners cut at 45 deg) docked bottom-left, 700x270 (36% width, like the evidence box), 64 px off the edges.
- Real 3D (Three.js): a 56 px-deep gunmetal body with bevelled edges, a raised machined rim (metal 0.85, clearcoat, PMREM
  studio env, so the top bevels catch a softbox), and a recessed smoked-glass face 12 px below the rim.
- Bars are real extruded geometry: slanted (parallelogram) glowing glass bars standing proud of dark troughs, emissive
  ramp (white top highlight, saturated core, dark base) plus clearcoat reflections, a glow halo in the face.
  Health green #3BE07D, armour cyan #33D6FF, critical red #FF2E3A.
- Type is painted into the face texture so it sits in the panel's perspective: Barlow Condensed 800 labels with our own
  heart / shield marks, and an Archivo 900 condensed readout (132 px) on masked odometer columns (lesson 6, 15).
- Damage reads like a fighting-game bar: the lost chunk goes white-hot, holds 0.2 s, then drains (chip trail).

**Shots and cuts (2-frame overlaps, outgoing on top):** v17 deluxo sunset (chase, boot) 0-1.2 / v23 minigun park
(hit: armour breaks on the muzzle flash, 1.6) 1.2-2.4 / v30 street firefight (PAYOFF on the cut, 2.4) 2.4-3.97 /
v44 bridge skyline (bright, dock and exit) 3.97-5.6.

**Payoff (2.40, on the cut; hero 2.55):** health 72 -> 9. The bar snaps to red with a white-hot chip, the readout rolls
72 -> 9 in red, the label rolls HEALTH -> CRITICAL, the slab recoils (scale 0.91 spring, a 10 deg hinge kick that shows
its thickness, a decaying 12 px jolt), red alarm lamps light the rim, and one soft specular band sweeps
the glass while the key light rakes the rim. Held 1.57 s at full size, then (lesson 7) it docks to 0.7x into the corner
on the cut to the skyline, the heart beating slowly; exit = power-off + the slab tips back into the corner.

## Variant B: Inset for Shorts (9:16, 1080x1920, 5.6 s)
Phone-first (lesson 26): the same module at 780x372 (72% of the width), bottom-left of the Shorts safe zone
(x 72-852, y 1098-1470), readout 196 px, labels 62 px, bars 70 / 34 px. Constant 9 deg yaw so the slab's thickness reads
at 360x640. Same story and cut points on the -v shots (v17, v23, v30, v44), docks to 0.62x after the payoff.

## Round log
- r01: first build. Self-review fixes before capture: tabular digit columns left a gap in "1 00" (now proportional
  columns, right-aligned); the rolling digit/label windows reached into the bar trough so a leaving "7" drew a red line over
  it (new text now always arrives from below, bottom pad 3 px); boot and exit no longer alpha-flicker type (labels, icons
  and the readout roll in and out); the damage chip is a lit glass bar, not a flat fill; a point-light sweep and the red
  alarm lamp left a specular dot on the glossy chip (sweep is now a key-light rake; red lamps sit outside the rim);
  yaw/pitch raised (A -0.13/-0.05, B -0.21/-0.08) and the body walls lightened so the thickness reads at phone size;
  exit tips back and collapses into the corner (no lingering dark slab).
  - Result r01: v0 7, v1 7, no defects. Gaps: soft payoff (colour flip + roll, no slam, no bloom from the number), a static
    critical hold, a white 60% chip next to a "9" at the hero, thin rim and small label at phone size, B rim 12 px past
    y 1480, B payoff on a blown-out muzzle flash, dead time before the boot.
- r02 (both variants open):
  - Payoff = one slam: on the cut (2.40) the old digits roll up and out in 0.11 s, then the "9" SLAMS in at 1.3x/1.2y and
    springs to 1 (back.out 2.6, 0.3 s, no overlap with the old digits), with a red bloom behind the numeral (peak held
    3 frames, 0.3 s decay), a red lamp at the numeral lighting the top-right rim, a red light pipe round the glass edge,
    then the glass sweep (2.56-3.02). Chip is pink #FF8C93 after 2 white-hot frames, held 0.12 s, drained in 0.26 s,
    so the bar reads 9% by 2.78. Hero 2.8.
  - Critical hold beats: 0.82 s double pulse from 3.02, heart 1 -> 1.35, numeral bloom, edge light, LED, rim lamps and the
    face's red ambient all on the beat.
  - Phone-size material: rim A 15 -> 21, B 21 -> 27 px, lighter machined gunmetal (#5A6572, env 1.7) so the lit top bevel
    survives at 360x640; body depth A 64, B 80; label A 44 -> 54, B 64 -> 80 px, heart + label centred on the numeral's cap
    height and the bars right under the numeral (no empty band); broken ARMOR lifted to #8A93A0.
  - B: panel at x 84, bottom 1440 (inside 72-936 / 230-1480 on settled frames), 772x416; payoff shot is now v26 bridge
    explosion -v (wide, dark river under the panel) instead of the muzzle-flash v30.
  - Boot sooner: hinge 0.06, power 0.26, HEALTH 100 reads by ~0.65; the armour hit moved to 1.80 (v23 still firing).
  - Result r02: v0 8, v1 8, no defects, no hard caps: PASSED (sticky). tile.json written (round 2, overlay, hero 2.8).
