# 16 SFX word: decisions

## Variant A (16:9 long-form, 1920x1080): "NOOOOOOO!!!"

**Evidence.**
- yt-232CmcU0wKg t00687 (10.6M views, the top frame): "NOOOOOOOOOOOOOOOOOO!!!" as a heavy rounded sans, white fill, thick black stroke, drop shadow, no box. Bottom-centre, y 84-95%, about 9% of frame height, spanning about 80% of the width. Hard cut on.
- yt-KedfEMhQdP8 t01478: "buh bye" white with a deep 3D extrusion going down-left, WordArt-style, centre.
- yt-ePQI2A8d6kQ t01359: orange-red cartoon caps, thick black outline, single line, upper centre, pop-in.
- yt-yycAimqjdjw t00438 ("CLASH") and yt-N47a2XeDe44 t00072 ("*TUAH*"): the word lands on the beat of the moment, held 1-2 s.
- So the job: one huge outlined shout word, on the beat, white with a black edge, readable instantly.

**Our upgrade.**
- **Real geometry (DESIGN §11.24).** Every letter is its own Three.js mesh (`media/sfx3d.js`): Inter Black outlines (wght 900, opsz 32, pre-extracted with fontkit to `media/glyphs.js`), extruded 64 px with a 7 px rounded bevel. The extrusion recedes down and to the right (tilt 0.30, yaw -0.24, 10° camera), like the creators' 3D WordArt but lit.
- **Material.** Faces are white clearcoat enamel (#FFFFFF to #DCE2EB, top to bottom); walls are polished graphite (#4E5566 to #0F1116) with a lit #DDE3EE lip; a PMREM studio (top softbox, front strip, hot bar behind, side card) gives the bevels a bright top edge. The "!!!" is the one accent: subscribe-red enamel (#FF3C48 / #EE1528 / #A80A1E) over wine walls, with its reflections tinted by the base colour so the red stays saturated instead of going pink.
- **Vernacular kept in post.** One 11 px ink outline (32-tap x 3-ring alpha dilation) wraps face and extrusion together, the evidence's thick black stroke, and a soft drop shadow (offset 6, 12).
- **Motion.** Each letter slams in from the camera (1.9x to 1x in 3 frames, a hashed spin settling to a ±2° tilt and ±6 px baseline jitter, so the letters sit slightly staggered), then squashes on landing (sy 0.76, sx 1.13) and springs back. The word grows from the centre: the visible ink stays centred as each letter arrives (back.out re-centre), so it stretches outward like the scream.
- **Payoff (state change).** After a 0.12 s beat the three red marks slam together. On the hit: the whole word squashes onto its baseline (0.8 / 1.085) and wobbles back; the extrusion punches from half to full depth with overshoot (0.5 to 1.32 to 1); a hop ripples back through the letters from the marks to the N; the key light rakes across the bevels; one wide soft specular crosses the faces; bloom and face emission peak for 3 frames. The footage gets an impact (amp 12, zoom 1.035, flash 0) and a small local-feeling expose (1.08); the word layer shakes 7 px.
- **Exit.** A 2-frame stretch, then the word is stomped flat into its baseline in 4 frames with a vertical motion blur; the ink thins with it, and it is cut on the zero frame. No fade.
- **Placement.** Ink centre x 960, baseline y 908 (cap 168 px, 15.5% of the frame; ink 1480 px, 77% of the width, like the evidence). The squash stays inside x 96-1824 and the shadow above y 1026.

**Shots and cut points** (1.0x, a slow 1 to 1.04 push):

| Time | Shot | In-point | Beat |
|---|---|---|---|
| 0-0.72 | v12-heli-city-dusk-h | 0.68 (ends 1.40 < 1.6) | the heli over the city |
| 0.72-1.92 | v34-rocket-heli-h | 0.02 (ends 1.22 < 1.23) | the rocket hits: N slams at 0.74, the O's stream, "!!!" hits at 1.47 |
| 1.92-3.62 | v26-bridge-explosion-h | 0.02 (ends 1.72 < 1.73) | wide bright hold; exit 3.42, gone on the 3.62 cut |
| 3.62-4.0 | v30-street-explosion-h | 1.0 (ends 1.38 < 1.67) | footage-only tail |

**Payoff beat:** 1.47 s ("!!!" lands). **Hero:** 2.3 s, settled over the bright bridge shot.

## Variant B (9:16 Shorts, 1080x1920): stacked "BR / UH"

**Evidence.** The same reaction-word job, sized for Shorts: one heavy outlined word on the beat, no box, coloured fill (yt-ePQI2A8d6kQ orange-red caps with a black edge; the yellow caption default from DESIGN §7). The manifest brief asks for a stacked vertical word with a colour fill, a pop scale and a quick shake in the middle of the safe zone.

**Our upgrade.**
- **Real geometry.** Archivo Black at 80% width (wght 900, wdth 80, fontkit outlines), size 600 (cap 413 px), stacked "BR" over "UH" with a 66 px gap: a 728 x 892 px block centred at (504, 842), the middle of the Shorts safe zone (x 72-936, y 230-1480). Extruded 104 px, 12 px bevel, receding down-right; a 16 px ink outline and a drop shadow wrap it.
- **State 1, white enamel.** The letters pop in one by one on the cut (0.35x to 1.16x in 3 frames with a hashed spin, then a damped spring), white enamel over cool steel walls.
- **State 2, the fill.** A caption-yellow liquid rises through the block from the bottom (0.5 s, sine.inOut): a two-frequency wobbling meniscus (11 px, settling as it rises) with a hot #FFF8D8 band riding the surface. Below the surface, faces turn to yellow candy enamel (#FFE84A / #FFC814 / #FF8E0A) and walls to amber-brown metal; the reflections are tinted so the yellow stays saturated.
- **Payoff, lock-in.** The fill hits the top: the block punches to 1.08 and wobbles back, a quick 8 px shake, the key rakes across the bevels, one specular sweeps the faces, bloom peaks for 3 frames. Footage: impact amp 16, zoom 1.04, flash 0, expose 1.06.
- **Exit.** A 2-frame pop, then the block snaps shut into its centre with a small turn and a motion blur; cut on the zero frame.

**Shots and cut points** (1.0x, 1 to 1.04 push):

| Time | Shot | In-point | Beat |
|---|---|---|---|
| 0-0.8 | v32-skydive-towers-v | 0.05 (ends 0.85 < 1.27) | the jump |
| 0.8-2.74 | v37-tower-looking-up-v | 0 (ends 1.94 < 1.97) | BRUH pops on the cut, fills 1.12-1.62, locks at 1.62 |
| 2.74-3.70 | v36-hills-city-view-v | 0.1 (ends 1.06 < 1.93) | wide hold, exit 3.5, gone on the 3.70 cut |
| 3.70-4.0 | v45-beach-aerial-v | 0.2 | footage-only tail |

**Payoff beat:** 1.62 s (lock-in). **Hero:** 2.3 s, settled yellow.

## Round log
- r01: first build. From my own review before capture: the red "!!!" and the yellow fill went pink / cream because the white specular (env, fill light and clearcoat) was added on top of saturated colours; fixed by tinting direct + indirect specular by the base colour on coloured faces. Payoff bloom cut from 0.8 to 0.5 and shortened, so the outline is not lost in a halo. Slam start scale cut from 2.15x to 1.9x. After the first capture: the heads were 1.2 s of plain footage, now 0.7-0.8 s; a near-mirror clearcoat highlight from the raking key blew a white hotspot onto the H at the lock, so direct and clearcoat specular are clamped and colour-tinted on coloured faces, and the specular sweep is tinted and narrower on B; a 1 px triangulation pinhole in the N is closed in post.
- r02 (critic r01: 7/7, defect in both: the exit froze a half-finished word on screen to the end).
  - **Freeze fixed at the root.** The base pass skipped `render()` when no letter was visible, and a multisampled target is only resolved into its texture by a render call, so the last exit frame stayed in the texture. The scene is now always rendered, and `#word` is hidden outright once the draw reports nothing on screen.
  - **A build.** Letters mid-slam now ride in a second layer with their own ink outline, composited over the settled word, so a slamming O never merges white-on-white with its neighbours. Slam overshoot 1.9x to 1.45x, landing squash 0.24 to 0.15, step 0.06 to 0.05 (word complete by 1.37 s).
  - **A material and light.** The face ramp is deeper (#FFFFFF / #EEF2F7 / #C3CCDA) with lower self-emission (0.5 to 0.36), so the key and bevels model it. The payoff halo is cut (bloom peak 0.5 to 0.2) and replaced by a narrower, faster specular band across the faces (0.3 s, 0.28 cap wide).
  - **B exit.** A 0.2 s power3.in collapse into the block centre, height leading width, with an 8 px vertical motion blur, reaching zero on a new cut at 3.70 (v45 beach aerial, 0.3 s tail); the film ends at 4.0.
  - **B lock light.** A warm #FFF8D8-leaning specular band sweeps the faces in 0.25 s; the meniscus hot band is wider (9 px sigma) and brighter. Bevel 12 to 9 px, which removes the bevel-offset slivers in the B and R counters.
- r02: critic 8/8, no defects; PASSED (sticky). tile.json written (round 2 both, overlay, hero 2.3).
