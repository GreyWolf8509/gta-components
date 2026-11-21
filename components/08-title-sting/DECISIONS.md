# 08 Title sting: decisions

## Variant A: "Chrome title (3D)", 16:9 1920x1080, 5.3 s

**Evidence.**
- `yt-c-I-jXpGuOk` t124 (8.1M views) is the reference: "THE MOUNT / CHILIAD MYSTERY" in huge condensed heavy caps, a blue metallic face (#2A6FA8 to #1B3E66) with a gold/bronze bevel rim and a green glow behind.
  - It sits in letterbox bars and fills the whole picture (it even overflows the edges).
  - It's a single held card with a slow push.
- The same creator's t116 neighbour uses the same idea in gold ("DETECTIVE", bevelled metal caps over footage).
- `tt-7579217066415099158` and `yt-uX_iqFlUdqI` show the sting is held for 1–4 s and then hard-cut into the video.
- The vernacular: **giant two-line metal caps, blue face, gold bevel rim, glow behind, letterbox, held big, then into the video.**

**Our upgrade.**
- **Real 3D letters.** Our own lettering: Archivo wdth 64 / wght 900 outlines, traced to paths with fontkit and kerned from the font's own pairs, extruded 0.78 units with a rounded 5-segment bevel.
  - ExtrudeGeometry's two material groups give the evidence's look:
    - the cap faces are deep blue anodised metal (MeshPhysical, metalness 0.8, roughness 0.22, a blue gradient map, light clearcoat, env intensity 0.65 so the face stays blue);
    - the bevel and walls are polished gold: metalness 1, roughness 0.15, env intensity 1.5.
- **Gold that bands on every shot.** The environment is a PMREM rebuilt every frame from a small studio scene:
  - a high-contrast banded dome (#2A1A08-dark to #FFF1C4-hot stripes);
  - the current footage frame on a 120° band facing the title;
  - a top softbox.
  - So the gold always shows hard bright and dark bands, whatever plays behind it.
- **The shot in the faces.** The playing shot is also mapped into the blue faces in the material shader, about 15%, offset by the reflection vector. It moves with the camera and changes on every cut.
- **Lighting.** A directional key orbits slowly; HemisphereLight fill; a rim light in the shot's glow colour; ACES, sRGB.
- **HDR bloom instead of a sprite** (lesson 11). The scene renders linear HDR into an MSAA half-float target. A bright pass (threshold 1.3, alpha-weighted so only the metal blooms) feeds a 3-level gaussian chain, and a composite applies ACES + sRGB once.
- **Plate** (lessons 4, 17).
  - Opens on the warm `v07` sunset; the hold is `v47` Mount Chiliad from above (the title's own subject).
  - The plate keeps its blacks: brightness 0.68, contrast 1.15, saturation 1.15, a 6 px defocus (≤ 8 px).
  - A lighter radial darkening (32% at the centre) sits only behind the lockup.
  - The glow behind the title takes each shot's own light: amber, warm gold, then cool on the tower. No green.
- **Camera.**
  - A raking close-up across "THE CHIL" (readable from about 0.3 s) pulls back and swings round to the front-on lockup.
  - It arrives at 1.45 s still moving: the dolly is 70% linear, so the camera carries past its mark and settles back with a velocity-matched damped spring (k 5, w 8).
  - Then a slow push through the hold.
- **The landing (physical).**
  - As the camera arrives, every letter winds back 3.2 units (0.24 s) and slams forward onto its mark with back.out(2.2), staggered 25 ms in reading order.
  - `Look.impact` (amp 5, flash 0) and a 3-frame `Look.expose` on the plate (peak 1.25) land it.
  - The canvas sits inside `#shake`, so the title and the plate shake together.

**Shots and cut points.**

| Time | Shot | Why |
|---|---|---|
| 0–2.2 | `v07-biplane-sunset-h` | Warm, bright, sharp; the lights-on entrance hides its in-clip cut at 0.3 s |
| 2.2–4.1 | `v47-gp-chiliad-aerial-h` | Mount Chiliad itself, warm light: the subject of the title, for the hold |
| 4.1–5.3 | `v37-tower-looking-up-h` | Bright and sharp: the shot the camera rushes out into |

**Payoff (1.5–2.05 s): a lighting event, not a layer style.**
- Hero for review: 1.76 s (the flare crossing C and S).
- On the landing, a hot key light (evaluated only in the gold material, with a 1.7-unit lateral window) rakes left to right in front of the title over 0.55 s, so the bevels flare letter by letter: TH, then C/S, LI/ER, AD/Y.
- The bloom rises 50% with it and the glow behind swells.
- The camera is still settling and the plate takes its 3-frame expose, so the camera, the light and the plate all change together.
- The old diagonal band, the env whip and the pale vertical strip are gone.
- The credit line rolls up inside its bar at 1.42 s (a mask reveal, opaque from the first frame it shows).

**Exit (4.1–4.72 s).**
- The camera rushes forward through the gap between the lines (fov 30 to 52, up to 22 px blur on the 3D layer).
- The glow behind dies before the lens reaches its plane.
- The title clears the lens and is cut on that frame (lesson 14: no dissolve).
- The plate clears to full brightness and sharpness, the letterbox bars retract and the kicker leaves inside its bar.
- 0.58 s of clean tower shot remains.

## Variant B: "Footage in letters", 9:16 1080x1920, 4.3 s

**Evidence.**
- `tt-7579217066415099158` t12–t15 (8M views): the RDR2 logo drop.
  - Stacked heavy condensed caps on pure black, with game footage playing inside the letters. The fill changes over time: sky and forest, then grassland with a horse.
  - It uses a solid blood-red accent element ("II") beside the footage-filled words.
  - It's about 85% of frame width, with a slight scale-up (75 to 88% width) while held for 3–4 s, then a hard cut to gameplay.
- `yt-uX_iqFlUdqI` shows the same "black card, big type, then cut" grammar.

**Our upgrade.**
- **Type.** Our own type (Archivo wdth 64 / 900), an equal-width justified stack on ink edges, 748 px wide (r7: 770 → 748, so the 5% hold grow, the payoff step to 1.07, its overshoot and the shake keep every frame's ink inside x 72–936).
- **The window words are real 3D: hollow channel letters** (lesson 24, the r3 critic's "better still").
  - LOS and SANTOS are extruded in Three.js from the same outlines, with a hard 45° chamfer lip and the front cap left open, so the footage is seen *through* each letter.
  - The lip is 3% of the cap height (12 px on LOS, 5 px on SANTOS, so the thin SANTOS strokes keep their picture). The walls are 10% of the cap height deep.
  - The matte punches exactly the 3D opening: the front cap is rendered as a mask and drawn destination-out.
  - Light: a raking key from the upper left, a top light and a low fill. Since r7 the chrome lips have their own key (4.4, lower and further left: (−0.85, 0.32, 0.43)) and a weak top light (0.35).
    - The left lip facets go white, the top chamfers rest at a bright grey (about 200, which leaves headroom for the payoff band), and the right and lower facets go dark.
    - Through the opening, the inner top walls show the letter's depth, lit by the shot's own tint (pale sky on downtown and the lowriders, amber on the sunset).
    - A contact shadow (24 px, offset 10) sits on the plate, which has a slight lift behind the lockup so the shadow reads. The lift and the shadow fade out evenly over 3.00–3.14 s, so the plate is pure black (luma 0) before the open starts.
  - The 8 px soft inner glow of r3 is gone.
- **STORIES**, the solid red accent (the "II" role), is a chiselled slab of lacquered red plastic.
  - A 12 px chamfer; the wall shows 14 px.
  - Tilted back 6° on X so its top chamfer faces the key: left and top chamfers lit, right and lower chamfers dark, under the same rig.
  - **Material (r5).** MeshPhysicalMaterial, roughness 0.3, clearcoat 1, clearcoatRoughness 0.06, on a PMREM studio env. The env is dark, with:
    - a 6×3 overhead softbox, so the top chamfers read hot pink (about #FC7878; the brief's target is #FF6B74);
    - a thin strip 7.5° up in front, which lays one crisp hot reflection band across the upper third of every front face;
    - a vertical strip at the left, which catches the chamfers on the curves.
  - **Reflections from a perspective eye.** The orthographic camera would give every pixel of a flat face the same reflection, so the slab's view vector comes from a virtual eye 1500 px in front of the line and 150 px above it. This makes the band sit at one height across the word, as a strip light does on a glossy sign.
  - **Settled colours.** Front #E42430, low chamfers and walls #60000C–#78000C. The slab's ambient fill is 0.15 (was 0.48), so the front no longer clips to #FC3C48.
- **Screen-sharp at any zoom.** Each line renders on its own through an orthographic camera whose frustum is that line's current transform inverted, sheared so depth reads as a drop. The slam, the squash and the 18x open stay pixel-sharp, with no upscaled render. Without WebGL it falls back to 2D windows and a 2D slab.
- **Sharp footage, one continuous picture** (lesson 12). One layer holds the native 1920x1080 `-h` shot at exactly 1:1 behind the whole window block (one framing point at the block's centre). The grade inside the letters is brightness 1.1 / contrast 1.15 / saturation 1.25. The sunset shot gets brightness 0.9, contrast 1.35, saturation 1.2, plus a warm highlight roll-off at half strength (r8: was full). The roll-off is an SVG table on G and B above 0.72, eased out through the open. It keeps the sun's clipped white in the sky's own orange while the sky keeps its gradient and haze.
- **Entrance.** The three lines slam in, each opaque within 0.08 s (lesson 23): scale 1.32 to 1 with back.out, blur 12 px to 0, staggered 0.14 s. STORIES lands with a squash (scaleY 0.9 to 1) and a hit. Since r6 there is no raking pass; its lacquer strip reflection carries the light.
- **The payoff is a lit state change on the cut to shot 3 (2.42 s)**, built to register at 360×640:
  - **The step.** The lockup steps up to 1.07 with back.out(2.6) over 0.28 s and stays there; it doesn't settle back. The scale is applied inside each line's camera, about the lockup's centre, so the footage stays 1:1 and the letters stay screen-sharp.
  - **The band (r8).** One soft white specular band runs left to right across the stack in 0.30 s from the cut. It is 150 px at half height (gaussian, feathered), at strength 2.2.
    - It is slanted 0.6 px per px of drop, so it crosses LOS first, then SANTOS, then STORIES' top chamfer.
    - It peaks for 3 frames (2.467–2.533 s).
    - It lights top-facing facets by angle and screen-adds, so lit facets brighten without clipping flat and the lips keep their gradient.
    - On the chrome window lips a sheen of 1.1 rides with it on every facet that faces it, so the whole lip goes white in the band at phone size, not only the thin top chamfer. On the slab the sheen stays 0.3.
    - **Bloom on the lips only.** A glint pass renders the band's light above a threshold, on the window-lip facets only, and adds it back with a 12 px blur (plus a 4 px core). It is weighted by the band's envelope squared, so it is there only at the peak. Nothing lights the footage or the plate.
  - **STORIES lands 1 frame later.** Its step is delayed 1/30 s and it lands with a 0.9 → 1 squash on its baseline (back.out(2), 0.12 s).
  - **The shake.** Amp 3, so the transient frames stay inside x 936.
  - **The cut at 1.22 s** gets a smaller beat: a transient 1.02 punch that settles back, with no step and no band.
- **Hold.** About 2.5 s fully set (STORIES lands about 0.58 s; the open starts at 3.14 s).
  - A 5% grow (sine.inOut, 0.5–2.9 s) about the lockup's centre echoes the evidence's slow scale-up.
  - A broad soft specular light (220 px, strength 0.32) drifts across the chrome lips from 0.7 to 2.2 s.
- **The open.**
  - The stack zooms through the centre of the "L" stem, above its foot (power2-in on a log scale, after a 3.5% breath back). A radial zoom blur is centred there. Its streak is a half-frame shutter, capped so the stem's edges streak about 11 px (an exact 21-tap additive mean).
  - The walls darken as they rush past the lens. From 40% of the zoom the chrome lips blend into a reflection of the sunset by screen height (a dark ground, a warm sky and a hot horizon line, lit by the key), so a lip blown up past the lens reads as a chrome streak, never a flat grey slab (r8).
  - The clean cut comes on the first frame the stem's opening covers 60% of the frame width: 3.733 s (r8: was 3.8 s, 2 frames earlier). The last letter frame (3.7 s) shows the opening across most of the frame between two warm chrome bars. A 2-frame local exposure lift (+0.35 EV, colour-dodge, radial on the stem) plays on the 2 frames before the cut.
  - During the open the footage blends from its 1:1 framing to the full-frame cover, never less than the zoomed letters need.
- **Landing** (lessons 14, 21, 22).
  - It lands on the wide `v07` sunset with the biplane, which survives the 9:16 upscale.
  - One hit on landing; no frame-wide flash.
  - 0.567 s of footage after the clean cut.

**Shots and cut points** (4.3 s total).

| Time | Shot | Framing (source x, y at the centre of the window block) |
|---|---|---|
| 0–1.22 | `v44-bridge-skyline-h` (in 0.1) | (1350, 380): the crisp downtown Los Santos towers in LOS, the city blocks in SANTOS. This is the first read (r5: was the soft grey yacht). |
| 1.22–2.42 | `v39-lowriders-downtown-h` (in 0) | (1009, 760): hard-edged and high-contrast (r8: replaces the soft `v11` yacht). The lowrider's grille, plate and headlights sit across the O of LOS for the whole shot, with the blue and green lowriders in the L and S. SANTOS shows the street. |
| 2.42–4.3 | `v07-biplane-sunset-h` (in 0.34) | (1150, 580): the biplane crosses LOS at mid-height against the sky gradient (r8: was 400). SANTOS carries the dark ridge and the power line. Grade 0.9 / 1.35 / 1.2, roll-off 0.5. The full-frame crop centres on x 1010. |

**Payoff (2.42 s, the cut to the sunset).** Hero for review: 2.533 s. The lockup has stepped to 1.07, the white band is at its peak (on the O of LOS, then SANTOS's A and N, then STORIES' S and T, with the lip bloom), and the biplane crosses LOS.

## Round log
- **r1: first build.** Fixes made inside the round:
  - **A, geometry.**
    - Torn bevel faces on S and R: contours are now flattened and de-duplicated before extrusion.
    - A pin-hole at the M's inner V: the bevel material is now double-sided.
  - **A, glint.** The glint anchor was misplaced (it read the bounding box after recentering).
  - **A, sweep.** The env "whip" alone washed the whole title white. It's now a narrow world-space specular band in the material shader (face plus gold), with a softer env strip.
  - **A, look.** The face is a deeper blue and the gold rim thicker (bevel 0.105), closer to the evidence.
  - **A, exit.** The camera now flies through the gap instead of the title cross-fading.
  - **A, entrance.** A lights-on exposure ramp, and the dolly moves from frame 1.
  - **A, footage reflection.** It's routed through a fixed 480x270 canvas (GL texture-size warnings).
  - **B, safe zone.** The lockup width is 760 (the 5% grow stays inside x 72–936).
  - **B, the open.** The translation follows the zoom curve, with a small anticipation.
  - **B, footage.** It's lifted so the biplane flies through "LOS"; the middle shot is now the beach (v46 read grey); the sheen is broader.
- **r2: fixing the r1 verdict (7 / 7) and the [v0] kicker defect.**
  - **A, defect.** The kicker is now 30 px, tracking .28em, bottom 54 px (ink inside y 1026). The divider dot is centred.
  - **A, plate.** Opens on `v07` (warm, sharp) instead of `v47`; the grade keeps its blacks (0.68 / contrast 1.15 / 6 px) with a radial darkening only behind the lockup; the glow takes each shot's light (no fixed green over the sunset).
  - **A, material.** Deep blue face (metalness 0.8, roughness 0.22, env 0.65), a 1.0-unit strip (one streak), footage reflection at 2x. No more chalky two-paint faces.
  - **A, read and landing.** Land at 1.45 s (was 2.32); the camera starts wider so "THE CHIL" reads from about 0.3 s; a per-letter wind-back and z-slam with overshoot (a first version without the wind-back was invisible, because the camera pulls back while the letters come forward) and `Look.impact` on the land.
  - **A, glint.** The DOM star sparkles are gone; real HDR bloom on the gold bevel (custom MSAA half-float pipeline), plus a narrow specular band.
  - **A, exit.** 5.3 s total; the tail after the fly-through is 0.58 s (lesson 14); the kicker exits with its bar instead of fading.
  - **B, footage.** Rebuilt on the `-h` shots at 1:1 in per-line layers (was a 2.2x upscaled `-v` crop); SANTOS framed on sky or wake, never road or hull.
  - **B, open and landing.** Rush blur up to 26 px; opens onto the `v07` sunset (sharp) instead of `gp-*` gameplay; expose peak 1.22 (was 1.55); 3.7 s total, so 0.58 s of footage after the payoff.
  - **B, accent.** A real lit bevel on STORIES, a contact shadow and a landing squash; the star sparkle is removed.
  - **DESIGN §11 lessons 11–20, checked.**
    - No star sparkle; light comes from bloom, a specular band and a sheen.
    - The windows use `-h` shots at 1:1, and nothing pays off on `gp-*`.
    - Heroes are judged at 640×360 and 360×640.
    - There are no fade exits:
      - A cuts on the frame the title clears the lens;
      - B zooms through the letter;
      - each tail is ≤ 0.6 s.
    - The graded bed keeps its blacks (0.68 / contrast 1.15 / saturation 1.15).
    - There are no CSS flips, confetti or rays, and no other franchise's IP.
- **r3: fixing the r2 verdict (7 / 7) and the [v1] runtime defect.**
  - **B, defect.** The runtime is 4.3 s (was 3.7). The open is at 3.1 s, so the full lockup holds about 2.4 s. The letters clear at about 3.73 s, leaving 0.57 s of footage (a first r3 capture opened at 3.0 and left 0.67 s, so the open moved 0.1 s later). Every shot is within its length (v07 0.34 + 1.88 = 2.22 of 2.23 s).
  - **A, payoff as a state change.**
    - The camera now arrives moving and settles with a damped overshoot.
    - A raking key light flares the bevels left to right through the bloom, and a 3-frame expose hits the plate.
    - The diagonal band, the env whip and the pale vertical strip on S and C are removed.
    - A first PointLight rake made a round white hotspot on the faces, so the rake moved into the gold shader with a lateral window.
  - **A, gold.** Metalness 1, roughness 0.15, env 1.5, on a high-contrast banded dome (#2A1A08 / #FFF1C4), so the walls band on every shot instead of going flat cream. The playing shot is mapped into the faces at 15%.
  - **A, plate.**
    - Shot B is `v47-gp-chiliad-aerial` (was `v36`) with a warm glow (the green #2EE6A6 is gone).
    - The blur is 6 px and the central darkening is lighter (32%), so the plate reads bright.
    - The glow behind now dies during the exit rush (the first r3 capture had one washed frame at 4.68 s, where the lens flew through the glow plane).
  - **B, STORIES.** Rebuilt as a chiselled slab: top chamfer, flat front, lower chamfer, 6 px wall, one raking specular on landing. The 40 px outer halo is replaced by an 8 px inner rim light tinted per shot.
    - First as 2D chamfers.
    - Then, after DESIGN lesson 24, as real Three.js extruded and chamfered geometry, lit by a front key, a top light and a raking key. In the first lit version the key sat on the face's mirror angle and turned the paint pink (232, 64, 72), so the key moved to the upper left.
  - **B, lockup and framing.**
    - 834 px wide (was 760), grow 3% (was 5%), and the largest frame stays inside x 87–921.
    - One footage layer and one framing point across LOS and SANTOS (was a per-line layer).
    - The dark blob in "TO" was the Deluxo's black rear panel from `v17`. That shot is replaced by `v44` downtown, which also puts Los Santos in the words.
  - **B, payoff light.** The full-frame expose is replaced by a local burst on the landing subject (lesson 22).
  - **DESIGN §11 lessons 21–23, checked.**
    - B's full-frame payoff is the wide v07 sunset.
    - Both payoffs are localised light (the rake on the gold; the burst on the sun and plane).
    - Nothing ghost-fades in: B's lines are opaque within 0.08 s, and A's kicker is a mask roll.
- **r4 (v1 only; v0 is locked at 8 and a/ is unchanged).** Fixing the r3 verdict (v1 7: "a competent footage-in-letters template").
  - **Window material.** LOS/SANTOS rebuilt as hollow Three.js channel letters: a hard chamfer lip, real walls, the footage seen through them, plus a contact shadow. This replaces the 8 px inner glow.
  - **STORIES.** Wall 6 → 14 px, chamfer 8 → 12 px, tilted −6° on X; it shares the raking-key rig.
  - **Payoff.** One beat on the cut to shot 3: a 1.045 punch, a 3-frame lip flare and a 90 px rake across STORIES' top chamfer in 0.3 s. A smaller beat at the 1.15 s cut. The invisible 0.95 s sheen is removed.
    - A first version flared STORIES' whole face to pink-white and held the flare 0.3 s. The flare is now lip-only, on lit facets, and gone 0.12 s after its 3 frames.
  - **Framing and grade.** Shot 3 frame.y 430 → 540 (the biplane and ridge in LOS) with brightness 0.95 / contrast 1.15; shot 1 frame.x 820 → 600 (SANTOS on the hull, off the deck).
  - **Open.**
    - The gaussian smear is replaced by a radial zoom blur on the L, a 2-frame +0.35 EV stem lift and a clean cut.
    - A first version showed huge flat grey lip planes at 18x; the walls now darken through the rush, and the cut comes right after the lift.
    - The plate lift and contact shadows fade as the open starts (they made a dark-disc halo).
    - The open moved to 3.14 s so the tail stays 0.57 s.
  - **Edge sliver.** The shakes slid the 1920-wide footage past the matte's edge (a bright sliver at x 0 / 1079 during the landing and payoff shakes, also present in earlier rounds). The footage is now clipped 3 px inside the frame while the lockup holds, and bleeds freely once it is the frame.
- **r5 (FINAL; v1 only; v0 is locked at 8 and a/ is unchanged).** Fixing the r4 verdict (v1 7: "matte template plastic"; "the payoff is a footage cut plus a ~3% grow").
  - **Defect: the shrinking navy disc at 3.17–3.23 s.** The plate lift and contact shadow now fade evenly over 3.00–3.14 s, by time instead of open progress. The plate measures luma 0 at 3.17, 3.20, 3.23 and 3.30 s.
  - **STORIES material.** MeshStandard is replaced by MeshPhysical (clearcoat 1 / 0.06, roughness 0.3) on a PMREM studio env, with reflections taken from a perspective eye.
    - A first version used a large bright softbox, which lit the front diffusely and clipped it to #FC3C48 with no visible reflection.
    - The fix: small bright panels, a fill of 0.15 and a front strip at 7.5°. Result: front #E42430, chamfer tops about #FC7878, one crisp reflection band.
  - **Payoff state change.** The `#punch` CSS scale is removed. The lockup now steps to 1.07 with back.out(2.6), with a 3-frame white flare on every lip; STORIES lands 1 frame later with a 0.9 → 1 squash, and a 40 px white band (was a 90 px pink wash) sweeps it in 0.42 s. The zoom's focal point follows the stepped stem, so the open still flies through the L.
    - **Fitting it in the safe zone.** At 780 px wide the step peak plus the shake reached x 937. The width is now 770 and the shake amp 3; the measured maximum is x 931 at 2.533 s, and the minimum is x 81.
  - **Footage.** The skyline is now shot 1 (the first read) and the yacht shot 2; the window contrast is 1.15.
    - The biplane frame.y went 540 → 420 (the verdict's number). At 420 SANTOS still sat on the mauve haze and the far ridge, so it went to 350, where SANTOS is the sky band (mean RGB about 182,136,116 → 212,159,120 over the hold).
    - The shot-3 grade went to 0.82 / 1.18 / 1.25, to keep LOS from washing out near the sun.
- **r6 (polish after the final verdict; v1 only; a/ unchanged).** Two changes, as capped.
  - **[defect] The white hairline slash across STORIES.** The 40 px rake is dropped: beat 2.42 has rake 0. The landing rake at about 0.61 s used the same band and made the same slash (on the R at 0.7 s and on the final S at 0.8 s), so it is dropped too. The 3-frame white lip flare and the clearcoat strip reflection carry the light; no white slash shows at 0.62–0.95 s or 2.5–2.73 s.
  - **The sun in LOS.** Shot 3 frame.y is 350 → 520 and the grade is 0.82 / 1.18 → 0.70 / 1.25 (saturation 1.25). LOS holds the horizon and the biplane, and the O shows the plane with detail through the hold. Near-white pixels inside the O: 1.7% at 2.9 and 3.1 s, which are the lips; the flare frame at 2.45 s is the intended exception.
- **r7 (v1 only; v0 is locked at 8 and a/ is unchanged).** Fixing the r6 verdict (v1 7: "payoff light is a flat white stroke and glow preset, SANTOS brown mush, a dead hold").
  - **Payoff light.**
    - The 3-frame all-lip white flare and the glint bloom pass are gone. One soft 90 px band now runs along the top chamfers in 0.30 s, with a 3-frame peak, as described above.
    - First version: it was invisible on the chrome, because the chrome's top chamfers already sat at (248, 250, 255) with no headroom. The lips got their own key and a weak top light (top chamfers now rest at about 200). The band strength went to 1.0, with a ≤0.3 soft sheen.
    - Checked 2.40–2.80 s at full size and at 360×640: no thin white line.
  - **Sunset framing.**
    - Set frame.y 520 → 400 and the grade to 0.9 / 1.2 / 1.2. At x 1150 this put the sun disc in the O (near-white in the O rose to 19% by 3.1 s).
    - Moving sideways didn't fix it. At x 1300–1490 the O or the L went white. At x 850–1000 the S went white. At x 700 no letter went white, but SANTOS fell on the dark left mountain.
    - The fix: keep x 1150 and add the warm highlight roll-off to the grade. Near-white in L, O and S is 2% (the lips) at 2.5, 2.7, 2.9 and 3.1 s.
  - **Hold.**
    - grow 0.01 → 0.05, sine.inOut 0.5–2.9 s.
    - First version: the grow lived in the camera zoom, which scales about the L stem, so the lockup grew rightwards to x 946. It moved into the lockup scale, about the centre.
    - Width 770 → 748. Hold ink stays within x 78–929.
    - Added the 1.5 s specular drift on the chrome lips (diff up to 36 levels, moving left to right).
  - **Open-out.**
    - The focal moved to the stem's centre, 360 units above the baseline (it was left of centre, at the foot).
    - The zoom blur is capped at about 11 px on the stem's edges.
    - The cut is coverage-driven: the last letter frame shows the opening across about 97% of the width (it was 56%), and the cut is at 3.8 s (tail 0.5 s).
- **r8 (FINAL; v1 only; v0 is locked at 8 and a/ is unchanged).** Fixing the r7 critique: LOS a flat peach fill, the band barely registering, the soft yacht, and grey slabs at 3.70–3.77 s.
  - **Payoff footage.** Shot 3 frame.y 400 → 580, grade contrast 1.2 → 1.35, roll-off 1 → 0.5. The biplane crosses LOS at mid-height against the sky gradient, and SANTOS carries the ridge and the power line. The O shows no white sun disc (near-white in the O is only the lips).
  - **Payoff light.** Band 90 → 150 px, strength 1.0 → 2.2, slanted so it crosses LOS, then SANTOS, then STORIES. It peaks for 3 frames at 2.467–2.533 s, with the lip-only 12 px bloom.
    - First version: on the window letters the band only caught the thin top chamfer, so at 360×640 it read on STORIES and barely on LOS and SANTOS. The window-lip sheen went 0.3 → 1.1 (the slab keeps 0.3).
    - The diff against a no-band render shows light only on the lips and the slab (about 11k pixels over 120 levels at 2.533 s), none on the footage, and none before 2.467 or after 2.6 s. No thin white line shows at full size or at 360×640.
  - **Middle shot.** `v11-yacht-h` is replaced by `v39-lowriders-downtown-h` at (1009, 760), 1.22–2.42 s; the first cut moved 1.15 → 1.22 s. The frame.y options 610, 700 and 760 were compared. At 610 the car sank out of the O by 1.8 s. At 760 the grille, plate and headlights stay across the O through 2.4 s.
  - **Fly-through.** Both fixes. The chrome lips carry a sunset env gradient and the key into the close-up, and the cut comes 2 frames earlier (coverage 0.6, at 3.733 s; tail 0.567 s). The last letter frame shows warm chrome bars with a gradient, not grey slabs.
