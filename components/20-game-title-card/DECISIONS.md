# 20 Game title card: decisions

## The evidence (both variants)
- The component is the **game logo sticker**: the game's stacked wordmark stamped over intro footage at a segment start, no box.
  - `yt-3nVF2EY_iHg` t56 (16.7M): stacked white heavy words over a gradient "VI" emblem, ~50% of frame width, centred, held.
  - `yt-LzIibqRWGqw` t8: stacked chrome-grey words with a dark outline over gameplay, ~30% width, centre-right, slight drop shadow.
  - `yt-o4nNjj44d4M` t16: stacked white wordmark + coloured badge, 20–25% width, top centre, pops in at a segment start.
  - `tt-7701088848582954253` t1.5 / `tt-7578844325090561287` t1.5 (Shorts): white stacked lettering with a black outline plus a coloured badge or a red bar under it ("ONLINE"), 35–40% of width, upper third (y 10–40%), on for ~1.5–3 s in the intro.
- The vernacular: **stacked heavy white caps, tight leading, a black edge, one coloured accent element (badge or bar) under or beside it, a soft shadow, no box.** Motion in the evidence is a pop or cut-in, then a hold.

## Variant A: "Series title", 16:9, 5.6 s
**Our upgrade.**
- Our own lettering: Archivo wdth 78 / wght 900 outlines (traced with fontkit, kerned from the font's pairs), stacked LOS / SANTOS, left-aligned on ink edges, leading 0.15 cap. Cap 168 px; the lock-up is 872 px wide (45%), centred at (960, 512).
- **Real geometry** (Three.js, `media/logo3d.js`): every letter extruded 0.42 cap deep with a rounded 5-segment bevel.
  - Face: white enamel (MeshPhysical, clearcoat 1), #FFFFFF at the top to #DCE1E8 at the foot.
  - Bevel lip: polished white (roughness 0.14, metalness 0.55) so edges catch light.
  - Walls: glossy black lacquer, the evidence's black edge built in depth; a warm card on the left and a cool card on the right of the env give the walls coloured streaks.
  - Post: one uniform 8 px ink outline around the whole silhouette (the sticker edge), a soft contact shadow offset down 12 px, HDR bloom on the hot lips only (threshold 2.2).
- **Accent bar:** a bevelled candy-enamel slab (pink #F0207F to orange #FF7A1A, lighter top, darker foot, deep magenta walls) carrying raised white "STORIES" letters (Archivo wdth 125 / 800, +0.14 em) with their own dark walls.
- A soft local shade (34% at the centre, radial) sits behind the lock-up on plate renders only.

**Motion.**
- 0.32–0.97: letters stand up from flat, hinged on the baseline (real extrusion shows as they rise), back.out(1.9) so each one tips past vertical and settles; 45 ms stagger, SANTOS starts 0.14 s after LOS.
- 0.80: the bar shoots out of its left end (back.out 1.25); 0.98: the tag letters push up out of the bar face (back.out 2.2, 26 ms stagger).
- Hold: a slow living turn (rotation y −0.19 to −0.07) so the black walls and lips keep moving.
- Exit 4.55–4.99: letters fall back flat in reading order (power3.in) and the bar retracts into its left end, cut on the zero frame; 0.6 s of clean footage after.

**Payoff (r01 description; see r02 in the log, hero 1.45 s).** The lock-in: the bar's tag letters land on the cut to `v36`, the lock-up punches 4% with a 3 px decaying shake, then a soft slanted light band rakes left to right over 0.9 s, firing the bevel lips and the black walls in turn while the key light rides with it; bloom peaks at 1.40 and holds 3 frames.

**Shots.** `v24` sunset powerlines (0–1.05, warm, the entrance) → `v36` hills over the city (1.05–2.95, bright, the payoff) → `v44` bridge + skyline (2.95–4.65) → `v11` yacht (4.65–5.6, bright tail).

## Variant B: "Corner title", 9:16, 5.2 s
**Our upgrade.** The same object as A, compact and docked top-left as the brief asks, at the evidence's Shorts scale (44% of width) and in its vertical band (y 262–500, inside the 230 px status-bar margin).
- "GTA 5" in the same white enamel / black lacquer letters (cap 136), over a red bar (#FF3A44 to #C8102E, the "ONLINE" slot) with raised white "ROLEPLAY" letters (cap 38).
- Same ink outline (7 px), contact shadow and bloom rules as A.

**Motion.** Letters stand up 0.28–0.85; the bar shoots out at 0.62; the tag pushes out at 0.78; lock-in punch on the cut to `v39` at 0.90; a quick shine (0.55 s) rakes the lips at 0.94–1.49, bloom peak 1.12 held 3 frames. Exit 4.35–4.72 like A.

**Payoff, hero 1.2 s.**

**Shots.** `v57` gameplay red car (0–0.9) → `v39` lowriders downtown (0.9–2.08, bright, sharp, the payoff) → `v49` gameplay mural (2.08–3.62, the RP look) → `v17` Deluxo sunset (3.62–5.2, bright tail). Nothing in the top-left covers a face.

## Round log
- r01: first build. Critic 7/7: payoff a soft shine that clipped white faces into haze, no visible lock-in, stock 3D-title recipe, LOS left-aligned left a hole, typewriter entrance, v1 duplicated frame at the end of v39.
- r02: critic 8/8, no defects: PASSED (sticky).
  - **Lock-in as a state change:** the lock-up builds floating (z +140/+150, ~5% larger, a far soft shadow), then slams onto the plate on the cut (power3.in fall over 0.14 s), with a damped contact squash (y 0.92 / x 1.05 ringing out), a 4 px decaying shake, the contact shadow snapping tight, a 3-frame light hit on the bar lip and a footage `Look.impact` (amp 6, flash 0). The tag letters push out of the bar on contact.
  - **Material:** faces are now pearl/chrome-white (3 stops #FFFFFF / #E8ECF1 / #A9B3C1, env 0.6, emissive 0.14) so light can land; the sweep is a narrow 0.18-cap slanted specular that brightens faces and fires the lips; bloom threshold 2.8, peak 0.3 (no haze).
  - **Bar:** candy gloss split (upper 45% lifted, lower half darker) with a 2–3 px inner highlight line; A's tag cap 48 → 56, bar 92 → 100 px.
  - **A layout:** the stack is centred (no hole top-right).
  - **Entrance:** stagger 0.045 → 0.022 (B 0.025), rise 0.5 → 0.32 s, with up to 7 px vertical motion blur on the rise; each line lands as one slam. Letters spring out of the baseline (stretch) and exit by squashing back into it.
  - **B shots:** v39 cut to 1.1 s (no duplicated frame); the soft v49 gameplay hold replaced by `v28` (2.0–3.6); `v17` tail 1.5 s; runtime 5.1 s.
