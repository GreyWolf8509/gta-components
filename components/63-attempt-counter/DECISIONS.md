# 63 Attempt counter: decisions

Kept distinct from `gta/31-collectible-tracker` (its v1 is a skull "x3" death tally with a cracking skull): no skull, no crack, no red-hot digits. Here the tally is a planted granite headstone with a mechanical drum counter (A), and an "ATTEMPT #N" badge whose payoff is the attempt that finally lands (B).

## Variant A (16:9): "Death tally"

**Evidence.** yt-wZhwEgpeg9c t00037.5 (26.6M views, and t00018-t00043.5 around it): a small cartoon RIP headstone sticker (grey rounded stone, engraved "R.I.P", bright green grass strip, thin dark outline) with a white heavy rounded "x0 / x1 / x2" multiplier with a black outline just to its right. It sits as a persistent HUD tally under the repair-cost line (icon about 9% of the frame width) and the number hard-cuts up after each crash. No motion, no light, no depth.

**Our upgrade.**
- The headstone is real Three.js geometry: a rounded-top slab extruded 34 px with a 7-segment bevel, polished grey granite (baked fine speckle, a domed normal map, clear coat, PMREM studio env), "R.I.P" engraved into the face (baked into the normal and cavity maps, dark in the cuts). It stands planted in a bevelled green sod block with a tufted top edge, with a dark ink outline plate behind the whole silhouette (the sticker outline of the evidence) and a soft traced shadow on the footage.
- The multiplier is traced Archivo 900 (wdth 80) glyphs, extruded and bevelled: white clear-coated faces, near-black sides (the evidence's white-with-black-outline, in 3D) plus an ink outline plate. The digit sits on a real odometer drum (radius 2.2x cap, 36 degrees per digit) behind a clip window: on each fail the drum rolls the next digit down over the top with overshoot and locks.
- Each fail: the drum rolls, the headstone hops and thuds back into the sod (squash, small tilt), a deterministic dust puff bursts from the sod at both sides, the footage shakes (Look.impact, flash 0).
- **Payoff (the last fail):** the bigger beat: the headstone jumps 44 px and slams down with a 0.86 squash and stays knocked 5 degrees askew in the sod (a lasting state change), a wide dust burst, the counter punches 1.22x and a raking key light sweeps across the granite and the glossy digit.
- Entrance: the sod pops up, the headstone drops from above the top edge and plants with a dust puff, the multiplier slams in from the camera side; it arrives 1.3x and docks into the top-right corner (title-safe) before the first fail. Exit: number collapses into the stone, the stone sinks into the sod, the sod collapses; cut on the zero frame.

**Shots and cuts.** v57 gameplay red car on the highway (HUD, 0-1.45), cut to v30 street explosion (fail 1 at 1.45), cut to v34 rocket hits the helicopter (fail 2, payoff, 2.8), cut to v36 bright hills over the city for the hold and exit (3.95-5.85). Shots overlap 2 frames underneath at every cut.

**Payoff beat.** 2.8 s (the slam lands about 2.92). Hero 2.95.

## Variant B (9:16): "Attempt badge"

**Evidence.** Same family: the tally that ticks up on every fail (yt-wZhwEgpeg9c), in a Short the creators' "ATTEMPT #7" is big heavy white caption type at the top of the frame, hard-cut to the next number on each new try.

**Our upgrade (phone-first, lesson 26).**
- The hero is a real 3D badge about 63% of the frame width: a red lacquer "ATTEMPT" tag (rounded slab, two lacquer layers with a black rim sandwiched between, raised extruded white letters, baked pillow normal map and clear coat) over a huge "#48" in extruded, bevelled Archivo 900 numerals (cap 330 px, depth 90 px, white clear-coated faces, near-black sides, ink outline), tilted a little so the extrusion shows.
- Each digit column is a real odometer drum: on each fail cut the ones drum rolls the next number down over the top with overshoot and slams; 49 -> 50 carries, so both drums roll. The slam squashes the numerals, the tag kicks up and swings back on a spring (follow-through), the footage shakes.
- **Payoff (state change): the attempt that lands.** On the cut to the success shot the tag flips over on its real thickness to its green "SUCCESS!" side, the numerals wipe from white to polished gold column by column, a raking key light sweeps across the gold bevels, a gold glow blooms behind the number (3-frame peak, settles to a low glow), the badge punches 1.15x and a few gold embers kick out.
- Entrance: the tag drops in from above tilted and lands on a spring; the number arrives 1.6x and settles while the ones drum spins up to 48 and locks with a slam. Exit: tag flips away and collapses, the number collapses into its centre (back.in), cut on the zero frame.

**Shots and cuts.** v26 bridge explosion (attempt 48 fails, 0-1.5), v30 street explosion (49, 1.5-2.85), v57 gameplay red car on the highway (50, the attempt that works, 2.85-4.0; r01 used the v32 skydiver), cut to v36 bright hills over Los Santos on the success (4.0-5.85). Shots overlap 2 frames underneath at every cut.

**Payoff beat.** Success at 4.0; flip lands about 4.3. Hero 4.35.

## Round log
- r01: first build of both variants as above. Critic: v0 7 (payoff reads like the first tick: small hop, invisible dust, no light; dead entrance beat; the slammed x2 crossed R.I.P), v1 7 (a hook title that never docks and covers the skydiver; white digits read as a 3D-text preset with a grey second slab; black unlit flip slabs).
- r02:
  - v0: state now builds per death: a hairline crack opens on the first fail and splits and branches on the last (decal clipped to the stone, 2-frame hot edge as it opens), three granite chips fly off, and the stone is left 3 then 9 degrees askew. The last landing is a light beat: a clipped 35-degree specular band sweeps the stone face (shader band on the camera-facing faces only), then the digit and the x, a warm bloom behind the stone peaks for 3 frames, a close light rakes across. Dust is 40-70 px puffs at 0.85 opacity rising about 30 px, plus 8-12 px clods (2 on the first fail, 4 on the last). Entrance: the stone falls while the sod pops (no lone grass bar), lands at 0.5; the x2 slams from 1.6x pinned at its left edge so it never crosses R.I.P.
  - v1: the badge docks after the entrance (0.78x, top edge pinned at y 244, number about 50% of the width) and punches on each tick; the success brings it back to full size. The digits lost the grey ink slab; faces carry a vertical tint (white to cool grey at the foot) and a clipped specular band sweeps across them on each tick and after the gold wipe; sides are warm charcoal #2E2723 with a fill light from below, so no face renders black. Rolls overshoot about 8%; the entrance rolls just 47 -> 48. Final attempt shot is now v57 gameplay (the car sits below the docked badge, blue sky behind the digits) instead of the v32 skydiver behind the number.
- r02 result: v0 8 / v1 8, no defects (PASSED, both locked). Nitpicks left: the stone shows its flat base on the payoff hop, the dust reads as a soft smudge, the gold is a touch satin, a 3-frame 47 on the entrance roll.
