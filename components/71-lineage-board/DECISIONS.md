# 71 Lineage board: decisions

- Built 2026-11-21 inside the film `films/gta6-rdr2-gta5` (part 1 of "GTA 6 is Red Dead 2's systems inside GTA 5's world"), then copied here as a standalone 16:9 project. The source of truth for the mechanics is the film kit `assets/kit/film.js` (data-driven `.fk[data-fk]` objects on one paused GSAP timeline; every tween fromTo with immediateRender:false; pre-tween states pinned at the clip start).
- Look: Oswald only; navy #181E38 board, #0E1226 solid chips; identity accents GTA V green #46B64F, RDR2 oxblood #A3262F (text #D9444F), GTA VI pink #F2558E; no glow, no glass, no stacked stat cards.
- Entrances 0.22–0.30 s expo.out as mask wipes or slides; exits whole-object power3.in; stamps 0.6 → 1.07 → 1 springs.
- Variant B is a 16:9 copy for now (the film needed 16:9 only); the 9:16 version should be designed phone-first (DESIGN lesson 26).

## Gauntlet
- Round 1 critic: 7/7 (void + flat light, ghost fades, 2013 clipped at the start). Round 2: linear 40% dolly with lateral drift, key-light sweep + lift on the payoff, labels rise in instead of fading, shadow normalBias, type floor 36 px, framing starts wider. Not re-judged.

## Round 3 (fresh run, 2026-11-21): rebuild of the surface, light and payoff

**Evidence.** No census frames: this is the hero object of `films/gta6-rdr2-gta5` (three year slabs 2013 · 2018 · 2026 on a navy board). Judged against DESIGN.md §2/§8/§11 and the r01 critique: "a 3D template, not a lit object; slabs float in a vignetted void; payoff is a hue swap; labels ghost-fade; 2013 cropped; no exit".

**Our upgrade (A, 16:9).**
- Board: a real surface, not a vignette. A 34×0.5×20 navy clearcoat board (brushed roughness map, deterministic hash noise) with its front edge in frame over a dark floor, fog only past the back edge, one spot pool from above-front and a warm key from upper-left. PCFSoft shadows (2048) land behind each slab; a radial contact-shadow decal grounds each slab and spreads/lightens as it lifts or falls.
- Slab: a two-part object. Matte navy wedge base (front 0.57, back 1.22 units, top inclined 17° toward the lens so the numerals read) under a bevelled clearcoat cap (3.4×2.2, r .14, thickness .12, bevel .035) tinted 12% toward the identity colour. The accent bar is a real through-slot cut in the cap geometry (hole in the extrude shape, bevelled lip) with an emissive bar sunk 0.03 inside it: a lit groove, not a stripe on top.
- Numerals: real extruded bevelled Oswald 700 glyphs (outlines exported from the bundled font with fontTools, holes detected by containment; cap height 0.95 units ≈ 85 px at 1080p, satin white clearcoat, depth .07, bevel .014) sitting on the cap. Game names are crisp canvas-texture labels on the vertical front face (cap height 0.3 units ≈ 38 px apparent), left-aligned to the numeral inset so the three slabs share one grid. "13 YEARS" and the measure are DOM pinned to projected points.
- Fonts: Oswald wasn't bundled anywhere (it rendered off a system copy); now `media/fonts/oswald-latin.woff2` (wght 400–700) is loaded explicitly before building textures and the timeline.
- Motion: all three slabs in frame from frame 1; they drop in 2013 → 2018 → 2026 (power3.in fall from 0.7, 0.14 s stagger) and land with a 2–3 frame squash; the groove lights on contact. Game labels wipe in (texture repeat + plane scale, 0.24 s expo.out) 0.1 s after each landing. Measure draws 1.0–1.7 s expo.out from 2013; "13 YEARS" clip-wipes up from the line (opacity to 1 in 0.06 s). A baton light run (2013 groove 2.5–3.1, 2018 2.9–3.5) pre-motivates the payoff.
- Payoff 4.1 s: the 2026 slab lifts 0.06 with back.out(1.6) over 0.45 s, a narrow rake spot sweeps x +1.5 → +7.5 across its clearcoat (specular band travels across the cap and the white numerals), the groove peaks at 2.6 for 3 frames then holds 1.9, the cap tints pink, a pink point light spills onto the board around the slab only. Hold lit ~1 s.
- Exit 5.05–5.5: measure wipes out, slabs sink into the board in sequence (0.28 s power3.in, 2026 last), grooves go out as they sink; the composition ends on the empty lit board (zero frame).
- Camera: linear push 81% → 86% row width with a small lateral drift; no stall. Fog starts past the slabs (r01's fog began in front of them, dimming the faces).

**Variant B (9:16).** Phone-first per lesson 26: the same scene stacked in depth, 2013 far, 2018 mid, 2026 nearest and largest (about 60% of frame width), camera at 38° elevation, 52° lens so the far slabs recede. Numerals cap 1.0 units (hero ≈ 140 px, 2013 ≈ 98 px). Game names on the top face under the numerals (the front faces fall below the safe zone). Headline "13 YEARS" at y ≈ 330 (112 px pink) with a rule that draws from its centre, wiping the headline up from it. Same drop-in, baton run, payoff and sink exit.

**Modes.** `mode` / `dur` variables and the renderAt(t)-from-GSAP-proxy + `hf-seek` structure are kept so the film can port the scene; stuck / carry / tally / question still work on the new geometry (`topAt(z)` gives the inclined cap height for the tokens).

## Round 4 (critic r03: 7/7, 2 defects)
- Entrance: frame 0 is the empty board; the slabs slam in from above the frame (power3.in from 6 units in A, 9.5 in B, 0.3 s, staggered 0.06/0.20/0.34) with a contact point-light pulse in the identity colour and a landing squash. Slabs above the frame no longer cast key shadows (no ghost patches on the empty board).
- Payoff moved 4.1 → 3.5 s (baton 2.3/2.7) so the lit state holds ~1.5 s; exit 5.05. Exit changed from sink-through-board to a collapse flat into the board (no intersection slices); the pink pool fades before the last frame.
- A: fov 28 → 25 with the camera pulled back 10 %, end slabs yawed ±5° toward the lens, numeral extrusion 0.07 → 0.04 (the three years now read as one face), cool rim light from camera-right, board extended back so the horizon void is gone. Labels white.
- B: cap incline 17° → 8° (lower backs so the 2013/2018 bars clear the next slab), numerals 1.1 units, step 2.75, rule without ticks under the headline.
- Found afterwards: a line-wrap bug left `s.scale.set(...)` inside a `//` comment in placeSlab, so r04's collapse and squash never applied (the critic's "3-frame blink-off"). Fixed in r05.

## Round 5 (critic r04: 7/7, 1 defect: B hero lip in the caption zone)
- Exit: 0.34 s power2.in collapse, 0.1 s stagger, the slab spreads 18 % in x/z as it flattens, groove out in the first 0.1 s, visible until flat; the measure collapses with the 2013 slab. Exit at 4.9 so 2026 is gone before the last frame.
- Payoff physics: the 2026 slab lifts 0.22 units with back.out(1.8) overshoot and stays raised; its contact shadow spreads (scale 1.26, opacity 0.44); a 0.2 s settle squash; the groove peak is flat for 6 frames before decaying.
- Hold: the camera push is doubled (13 % dolly + lateral drift over the whole take); a soft specular pool sweeps across the board behind the slabs 1.5–4.7 s; the baton is a bright runner sliding along each groove (2013 at 2.3, 2018 at 2.75, 2026 on the payoff) with a +3.0 emissive pulse, so it reads at 360×640.
- A measure: the DOM line is replaced by an emissive pink tube with end ticks lying on the board behind the row (z −5.4), drawn from 2013 over 0.5 s expo.out; "13 YEARS" at 80 px pinned above it.
- B: camera 5 % back and aimed so the hero lip sits above y 1480.
- Oswald stays (lead's instruction: Oswald only), noted by the critic as a consistency point, not a defect.
