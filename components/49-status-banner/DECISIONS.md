# 49 Status banner: decisions

## Variant A: Passed banner (16:9, 5.8 s)

**Evidence.** `yt-c-I-jXpGuOk` t00514 / t00076: a "mission passed" line in chunky mustard-yellow display type with a thick black outline, centred slightly above middle (y 40-55 %), about 35-45 % of frame width, with a white second line ("respect +") under it. It hard-pops on a held shot and sits there; the GTA V version (t00913) adds a full-width dark translucent band (~25 % of frame height) and drains the footage of colour. Flat fill, default outline, no light, no motion.

**Our upgrade.**
- Same job, same place: a full-width band centred at y 520 (48 %), 300 px tall, with the status line across 75 % of the width (cap height 122 px) and a white sub-line in it (`$1,000,000 IN 24 HOURS`, gold figures).
- The status line is real Three.js geometry: Archivo 68/900 outlines traced to shapes, kerned, extruded 0.62 units with a 4-segment rounded bevel. Face: a 4-stop gold gradient (cream top to deep amber) under a clearcoat. The front bevel is a polished gold lip, and the walls behind it fall to black chrome: our version of the game's black outline, but lit. A studio PMREM environment (top softbox, horizon strip, side cards) and a key plus hemisphere light, with ACES tone mapping and HDR bloom.
- The band is glass, not a box: the same shot pre-blurred (`media/party-glass-h.mp4`), smoked to 36 %, with a warm lit top edge, a darker bottom, gold edge lines and soft shadows above and below.
- The desaturate: on the hit the held shot drains to a contrasty black-and-white copy (`media/party-bw-h.mp4`).

**Shots.** `v10-cash-table` 0-0.93 s (the challenge), then `v35-penthouse-dusk` from 0.87 s (2-frame overlap underneath the cut) to the end: the party is the reward.

**Payoff (one beat, about 2.0-2.8 s).** The letters flip up into the band one by one (rising off their backs, rocking past upright on back.out and locking), and as the last one locks, one gold light sweep crosses the frame on a slanted front. It rakes the bevels left to right (a moving specular lobe in both materials, with bloom), and the black-and-white copy is clipped away behind it, so the light paints the colour back into the party. The sub-line rises through its window after it.

**Exit.** At 4.95 s the band and title collapse into the band's centre line (scaleY with a 3 px blur), and the gold line retracts. 0.4 s of footage tail.

## Variant B: Wasted banner (9:16 Short, 4.16 s)

**Evidence.** `yt-c-I-jXpGuOk` t00913: a red lowercase "wasted" with a thin black outline, centred on a full-width translucent black band (y 40-63 %), over a slowed, desaturated, darkened shot.

**Our upgrade (phone-first).**
- WASTED at 740 px ink width (69 % of the frame, r05), centred in a full-width band at x 540, y 880 (380 px tall), cap height 142 px, Archivo 72/900. Everything stays inside x 72-936, y 230-1480, including the contact squash and shake.
- The word is real 3D: extruded 2.0 units with a rounded bevel and tilted back 0.19 rad (r05), so its undersides show under each glyph even at 360x640. The walls run lip red, then deep red #7A0E14 (lit by a low red floor bounce in the environment), then black chrome at the back. Face: red candy lacquer (4-stop gradient with clearcoat). Lip: polished red. A neutral studio environment.
- The slow-down is real, not stretched, and built only from real frames (r04): `media/bridge-ramp-v.mp4` is v26-bridge-explosion-v (a locked-off wide shot: the train going off the bridge) at 1.0x until the hit, easing to 0.48x over 0.22 s. Each output frame is a real frame or a straight blend of the two nearest real frames (`media/gen-ramp.py`). There is no optical flow, so nothing warps, and on a locked-off shot a blend only softens what actually moves (the falling car, the smoke). A light unsharp offsets the 9:16 upscale. It ends on source frame 49.9 of 51, so it never freezes.
- The death grade (r04): saturate 0.05, then a levels stretch (brightness 1.5, contrast 1.5, brightness 0.92), plus a closing vignette. The dusk shot drains to a contrasty black-and-white: a bright sky, a textured mountain, a black truss and white spray. Blacks stay black; the only colour left is the word.

**Shots.** `v23-minigun-park` 0-1.27 s (the threat), then the bridge ramp from 1.2 s (2-frame overlap) to the end.

**Payoff (one beat, 2.03 s, then the rake to 2.75 s).** The death hit at 1.58 s is only a small knock (4 px); then the drain and the slow-mo. The band line draws out (1.76 s) and splits open. WASTED slams out of the lens straight down the lens axis: from an apparent 1.45x with a 16 px defocus, it accelerates (power2.in, 4 frames). On the contact frame (2.033 s) it stops dead on its mark, flattened (scaleY 0.87, scaleX 1.045), and a damped spring settles it in about 0.2 s. On that same frame come Look.impact (12 px, 0.26 s, 1.02 punch), a 4 px RGB split for 0.1 s, a 7 px flex of the band, a flare on both rules, and the lacquer landing hot. The hot lacquer is extra red light on the face only, with green and blue clamped so it never washes to white, plus the bloom peak; it holds 3 frames and cools into the lacquer. Then the rake crosses (2.15-2.75 s) and a slow push runs toward the lens through the hold.

**Placement (r04).** The camera still aims at the word, so the slam travels down the lens axis and the drift only turns the extrusion. `camera.setViewOffset` (a lens shift of W/2 - word.x, H/2 - band.y) moves that axis from the canvas centre to the word's mark. In the hero the face ink measures x 110-880 (centre 495) and y 798-953, with the dark wall to about 963. That leaves about 108 px of band above and below.

**Exit.** At 3.72 s the band and word collapse into the line (0.26 s); the line retracts by 4.1 s and the edit ends at 4.16 s. There is no fade to black.

## Round log
- r01: first build. Self-review fixes before the critic: NaN-guarded bloom and sanitized bevel normals (a black box flashed on the N in the sweep), a narrower rake (it blew a whole letter to white), the WASTED slam starts at 1.35x with a 16 px defocus instead of 2x crisp, a deeper lacquer red with less halo bloom, and WASTED narrowed to 770 px to keep the settled word inside x 936.
- r02 (v0 locked at 8, unchanged; v1 was 7 with a defect): v1 only. The stall and jump at 4.5 s came from the ramp running across the source's camera whip and its duplicate frames. I rebuilt the ramp (mpdecimate, then MCI, ending at source 2.35 s), which removes the stall, the jump and the ghosting. I also made one payoff beat: the death hit is now a 4 px knock with no exposure kick, and on the slam's touchdown come the impact, the 1.05 punch and the glint, all on the same frame. The glint is clamped red, so the S no longer washes pink-white. The fade to black is gone: it ends on the collapse.
- r03 (v0 locked, unchanged; v1 was 7 with no defects): v1 only.
  - The slam is one spring now: apparent scale 1.40 to its mark, a 0.95 undershoot and settle (back.out 2.0, 0.32 s). On the frame it first hits its mark come Look.impact (10 px, 0.22 s), a 4 px RGB split on the word for 0.1 s, a bloom peak held 3 frames, the red spill and the glint start.
  - The face is deep lacquer red (#E8262E to #8C0D14) with a baked reflection horizon at 24 % of the cap, lower exposure and env, so it no longer reads salmon.
  - The band rules are 4 px with a lit red centre and a glow.
  - The plate is 0.5x instead of 0.31x, with light grain (0.06).
- After r03 (stopped at the 3-round limit): the r03 v1 defect, WASTED sitting about 72 px low and 46 px right in its band, comes from `camera.lookAt(gx, gy, 0)` in b/index.html. It aims the camera at the word, so the word projects to the canvas centre (540, 960) instead of CONFIG.word. The fix is to keep the camera axis parallel: position it at (drift, 0.4, DIST) and look at (drift, 0.4, 0), so the group offset (gx, gy) lands at its pixel. Variant A has the same pattern; it is 20 px off there, and A is locked. Not applied, because the fix is unjudged.
- r04 (second owner; v0 locked and unchanged, VS-PREV 0.995; v1 only):
  - The r03 defect: a lens shift (`setViewOffset`) puts the word on CONFIG.word / band.y while the camera keeps aiming at it. I measured the hero: centre 495 / 876 for target 494 / 880, with even gaps above and below.
  - The plate is recast on v26 (wide, locked off, the train off the bridge), slowed from real frames and straight blends, with no optical flow, and graded to a contrasty B&W. It is verified at 1:1 (rock texture survives) and at 360x640.
  - The slam is a contact, not a zoom: an accelerating approach, a dead stop with a squash and a spring, a band flex, a rule flare, the hot lacquer cooling, and the 12 px impact.
  - The glass blur is sigma 40 with an even ink layer, so the band reads as one dark surface.
  - A first pass let the hot lacquer wash to cream under ACES. Fixed: red-only heat with green and blue clamped.
- r05 (v0 locked and unchanged, VS-PREV 0.995; v1 only; the r04 critic: 7, no defects. It found the word off-centre in the band, flat at phone size, the lower face dull, and a hot spot on the T):
  - The word is centred in the band at x 540, narrowed 770 to 740 so the contact squash and shake stay inside x 936. I measured the hold: ink x 175-908 (centre 542), y 792-965, with gaps of 102 / 104 px above and below.
  - The depth reads at phone size: the extrusion is 2.0 units, tilted back 0.19 rad. The undersides run lip red, then deep red (a low red floor bounce in the environment), then black.
  - The lacquer's lower stops are lifted (#B5121E, #6E0610).
  - The face's red is capped at 1.45 (+0.5 only during the contact heat) and the rake is softened, so the T no longer blooms pink-white.
  - The band has a lit top lip and an inner shadow at the bottom. Bloom is 0.42.

