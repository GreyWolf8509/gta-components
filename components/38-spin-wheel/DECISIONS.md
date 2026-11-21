# 38 Spin wheel: decisions

## Round 1

### Evidence (both variants)
- `yt-ePQI2A8d6kQ` t00024 / t00028 (6.4M views, long-form): the random-picker web wheel (wheelofnames-style) dropped full-screen into the edit. Flat pie, five flat slices (orange, red, blue, white, green), white rim, white hub, thin black sans labels running along the radius (the left-side ones upside down). Centred at x 50% / y 50%, ~80% of frame height, facecam top-left, purple sunburst behind.
- Motion: the wheel spins (rotation differs t00024 -> t00028), stops, and a small grey web dialog "Result: MOTU PATLU" pops over the wheel. No pointer craft, no light, no physics, default fonts.
- Job: the challenge-video decider. "The wheel picks my car / my challenge", spin, suspense, result.

### Variant A (16:9): 3D wheel
- **Object.** A real Three.js prize wheel (`a/media/wheel3d.js`): 8 extruded, bevelled lacquer wedges (one canvas face texture with radial lacquer gradients and Archivo 900 condensed labels along the radius, the left ones upside down like the evidence), gold divider bars, a rotating gold rim band with 8 gold pegs at the wedge boundaries, a gold dome hub with a red star cap and bolts. Around it a fixed ink-lacquer bulb ring with gold lips and 24 bulbs. A red lacquer ticker (flapper) with a gold bevel on a gold pin at 3 o'clock, so the winning label lands horizontal and readable (the web pickers put the arrow there too).
- **Physics.** `spinsim.js`: a deterministic simulation (dry friction + air drag, every peg pushes the sprung flapper, which brakes the wheel until it slips off and snaps back with a damped spring). The launch speed is solved by bisection so the wheel rests on the CONFIG winner. Ticks slow down naturally, the last peg strains the flapper, then the wheel crawls into the winner.
- **Motion blur.** The wheel pass is rendered K times per frame across a 180-degree shutter (K from the rim's pixel travel, up to 28) and averaged in a 2D canvas, so the fast spin smears like a real camera while the fixed ring, bulbs and pointer stay sharp (separate pass on top).
- **Entrance.** Scale .6 -> 1 (back.out), tilt 28 -> 3 degrees, 20-degree spin-in, canvases opaque in 2 frames, 8 px blur resolving; bulbs power on in a wave. Then a 14-degree wind-up and the launch.
- **Payoff (state change).** The wheel stops on LOWRIDER: the winner wedge lifts 16 px out of the wheel with a spring and lights (emissive hit held 3 frames), a soft specular band crosses it, the other wedges dim; the bulbs pulse twice together; the wheel clunks (1.025 punch). Then the result plaque (extruded lacquer card in the winner's purple with a gold bevel) slides out from behind the wheel past the pointer and swings flat; kicker and result rise from a clip line printed on the card.
- **Shots.** Bed `v50-gp-bike-mansion` (bright gameplay) blurred and graded while the wheel is up (blur 10, brightness .68, contrast 1.15, saturate .55). Cut on the wheel's zero frame to `v39-lowriders-downtown` (the result), sharp, with a localised expose. 0.6 s tail.

### Variant B (9:16): Vertical wheel
- Same object sized for a Short: 6 wedges (bigger labels at phone size), wheel centre (504, 830) inside the 72-936 safe band, pointer at 12 o'clock.
- Content: "the wheel picks my challenge": 5 STARS / NO GUNS / BIPLANE / SKYDIVE / BMX ONLY / YACHT, lands on BIPLANE.
- **Payoff.** Winner wedge pops out (lift + light + sweep), then the result plaque pops out of the hub, flies down in front of the wheel and lands overlapping the ring's bottom edge (y ~1225-1435) with a squash, "YOUR CHALLENGE / FLY A BIPLANE". Cut to `v07-biplane-sunset` (wide, bright sunset, survives the 9:16 upscale).

### Round 1 self-review fixes (before hand-in)
- A: the plaque swung its free edge toward the camera and crossed in front of the wheel for a few frames; it is now a door hinged on its left edge (the free edge always swings away), sliding out from behind the wheel past the pointer.
- Lacquer faces, sides, plaque panel and pointer render without tone mapping (exact brand colours; ACES only on gold and ink). Losers dim as "lights off": darker, saturation kept, clearcoat and reflections drop, so they no longer go pastel.
- Plaque rebuilt as an object: a polished gold frame (extruded with a hole, bevelled) with four rivets around a recessed deep-lacquer panel; the frame's shadow falls into the recess. Gold tracked kicker (cream on B's orange).
- Bigger pointer (A head 44 / length 118; B 40 / 108), bigger polished pegs, 9 px dividers, bigger bulbs with real glow (emissive x5.5, 9x halo).
- Motion blur: up to 56 samples (4 px step at the rim); the comb on the labels is gone except the natural concentric streaks.
- Bed changed from the murky `v50` driveway to `v35-penthouse-dusk` (media 2.2 s: the party dissolves to the pink dusk skyline under the blur during the spin). Grade blur 10, brightness .7, contrast 1.15, saturate .65.
- Entrance: no half-transparent frame; the wheel arrives at full opacity from scale .35 with an 8 px blur resolving and a back.out spring. The collapse reaches zero one frame before the cut.
- Plaque text starts rising with the swing / pop, so no frame shows an empty panel.
- Hero: A 4.7 s (LOWRIDER lit, plaque open), B 4.75 s (BIPLANE lit, plaque landed).

### Result
- r01 blind critic: v0 8 / v1 8, no defects, no hard caps. STATUS PASSED (sticky). Both variants locked; tile.json written (round 1).
- Open nitpicks from the critic, not acted on (variants locked): bulb strobe / pointer kick at lock-in, ghosting on the labels at mid-spin, dimmed label ink, B's plaque leaving the hub with no text for a few frames, B's cream kicker contrast on orange.
