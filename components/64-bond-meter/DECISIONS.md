# 64 · Bond meter: decisions

## Variant A: Heart meter (16:9, 1920×1080, 6.4 s)

**Evidence.** `yt-o4nNjj44d4M` t00004 (3.8M views, long-form): a slim dark pill about 40 % of the frame wide at the bottom centre (x 30–70 %, y 88–94 %), with a glowing pink border, a magenta → pink fill (#B832E6 → #FF5BC8), circular portrait badges at both ends and small heart marks on the track; a glowing heart rides the track. The neighbouring frame t00008 shows the same language as a HUD: two portraits with a heart between them. Motion: the fill grows or drains with the story and the heart slides/pulses.

**Our upgrade.** The whole meter is real Three.js geometry; only the status word is DOM.
- **Heart (the hero, lesson 24):** a true 3D balloon heart (a sphere mapped onto the heart outline, elliptical cross-section ~0.42 w thick) in candy MeshPhysical (clearcoat 1, sheen) lit by a PMREM studio, a warm key and a pink rim. It sits on the centre of the track; the two fills pour toward it from the two portraits, so the bond literally meets in the middle.
- **Crack state:** on the drain the heart splits along a zig-zag crack (shader discard on two halves of the same mesh, so the halves are seamless when shut): a white-hot crack line flashes for 2 frames, the halves hinge open like a book (±0.38 rad) and tilt off the tip, the dark interior shows, the candy dims to dusty mauve.
- **Track:** a lacquered plum stadium housing with a bevel that catches the env, a neon pink inlay line and soft outer glow (the evidence's glowing border), a recessed channel and a glass capsule tube (fresnel edge, top specular strip, travelling glint). The liquid is a shaded cylinder + meniscus cap: magenta at the portraits to hot pink at the heart, cylinder shading, flow bands running toward the heart, a lit meniscus that sloshes on a damped spring. Three heart ticks per side light and pop as the liquid passes.
- **Portraits:** stills of Lamar and Franklin (v06, neutral mouths) on raised lacquer medallions with a pink-chrome torus ring and a neon edge; they sit proud of the bar (depth layering).
- **Payoff (MAX):** the refill pulls back (back.in) then surges into the heart; the halves slam shut on the last 3 frames, the seam blazes white-hot along the crack, the heart ignites (emissive peak held 3 frames), punches 1 → 1.42 → 1.12 and spins one full turn so the light rakes across its depth; a specular sweep runs out along the glass to both portraits, whose rings flash; 8 embers lift; the status rolls BEEF → MAX BOND with a slam. Light stays on the object (no frame-wide expose).
- **Status word:** Archivo 900 72 % caps above the heart in a rolling window: TIGHT → BEEF → MAX BOND (lesson 15, no cross-dissolve).
- **Entrance/exit:** the heart drops in spinning, the bar extrudes out of it both ways, the medallions pop out at the ends, then the pour. Exit: status rolls out, medallions shrink and ride the bar back into the heart, the heart spins down to nothing with blur. Clean at 6.05 s.

**Shots and cuts (all -h at 1.0×, 2-frame overlaps per lesson 25).** v06 Franklin + Lamar two-shot 0–1.60 (bond established at 62 %), v30 street explosion 1.60–2.85 (drain to 16 %, crack at 1.78), v05 Franklin + Lamar street 2.85–4.05 (refill), v18 pool skyline sunset 4.05–5.30 (MAX lands on the cut), v24 sunset street 5.30–6.40 (hold and exit).

**Payoff beat.** MAX at 4.05 s. Hero frame 4.45 s.

## Variant B: Bond for Shorts (9:16, 1080×1920, 6.4 s), rebuilt in r04, r05 and r06

**Evidence.** The same relationship meter: a pill track running portrait to portrait, round portrait badges at both ends, a magenta → pink fill (#B832E6 → #FF5BC8), a glowing pink border and heart marks on the track. Brief: "the same two-portrait meter stacked for a Short".
**Our upgrade (r06: v0's meter stacked, job first).** The hero is the whole assembly: portrait, capsule, portrait, with the heart as the payoff gauge on it.
- **Capsule:** a lacquered pill (100 px housing, neon-pink border, glass tube Ø 72) fully visible between two Ø 176 medallions; the assembly spans x ≈ 80–928 (~80 % of the width, the most the 72–936 Shorts safe zone allows). Liquid pours from both portraits toward the centre exactly as in v0; three heart ticks per side light and pop as the fronts pass.
- **Heart, the payoff gauge:** a real 3D glass balloon heart 480 px wide perched on the capsule's centre, its tip seated 6 px into the capsule's top edge. It fills from the tip in sync with the capsule. The liquid now has depth: deeper magenta at the tip, a hot-pink band under the meniscus, darker toward the glass wall.
- **Type:** the % (Archivo 900, 140 px, tabular) and the status word (84 px) on one line 48 px above the heart, centred on the meter. Until the payoff the windows clip just under the baseline, so roll-ins never cross the heart.
- **Crack (1.78 s):** the heart splits on a zig-zag, the halves hinge off the tip with lit break faces, both fills retreat to the faces (16 %), and the medallions are pushed apart, turned and greyed.
- **Refill:** the bond creeps back on the reconciliation shot (16 → 28 %), then surges. BEEF holds until the surge passes 40 % and snaps out 2 frames before the payoff.
- **Payoff, one beat on the cut frame (4.067 s, frame 122):** the two fronts collide under the heart's tip (a soft weld bloom on the tube), the halves slam shut, the seam welds white, the count hits 100 and MAX BOND slams in. From that frame the two runs are one continuous column. A localised diagonal sweep rakes the heart, a sheen runs out along the glass to both portraits, the rings flash, a few embers lift.
**Footage:** a Shorts split layout (each -h shot at 0.5625× in a full-width window, y 130–690, over a blurred, graded bed of itself). Same shots and cuts as A.
**Payoff beat:** 4.05 s (first payoff frame 4.067). Hero frame 4.4 s.

## Round log
- r01: first build. Critic: v0 8 (locked), v1 7 + 1 defect (clipped number glow).
- r02 (v1 only; A is locked and untouched):
  - [defect] the % and status windows are padded 60 / 40 px and the % line box is 1.6 em, so no glow meets a clip edge.
  - The weld is fast (2-frame seam peak, 35 ms decay), so the heart is whole when MAX BOND lands; the payoff turn is a half-turn with back.out(1.6) (the heart is symmetric), so it faces camera again in ~0.3 s.
  - The status follows the count: BEEF rolls out as the count passes ~50 % and MAX BOND lands with 100 %. The readout uses the un-sloshed level (no 64→61→62 wobble).
  - The heart punch is capped at 1.26 (settle 1.08), the entrance drop is 50 px and the type line baseline moves up 16 px to y 1190, so the heart never touches the digits.
  - The blurred bed keeps colour: brightness .62, saturation 1.6, contrast 1.2 under a plum multiply gradient (#8A4A82 → #1A0819) instead of a grey dim.
  - Critic: v0 8 (still locked), v1 7 + 1 defect (the type line sat 43 px off the meter centre).
- r03 (v1 only):
  - [defect] the type line [number %][gap][status] is measured after the fonts load (every % value and each word) and centred on the meter (x 504) every frame; the number width eases over 5 frames and the word width follows the roll, so the group glides instead of jumping.
  - The rail reads as one glass pill: fatter tube (Ø60 in a 104 px housing), no channel stripe, the neon inlay moved to the outer edge, brighter liquid specular. Medallions raised (MZ = HF + 20) so the fatter tube still tucks under them.
  - Portrait crops tightened (face ≈ 70 % of the disc; Lamar from a closed-mouth frame). B's own media only.
  - Payoff: a damped ±30° twist (never edge-on) with the 1.26 punch; the weld seam is gone within 4 frames; MAX BOND rolls in as the count passes ~80 % and lands with 100 %.
  - Spread 330 and a softer medallion pop (back.out 1.2) keep the ring glow inside x 936.
- r04 (v1 only; A is locked and untouched). The v1 meter was rebuilt phone-first, with the heart as the meter (owner direction, lesson 26):
  - [defect] The track pips are gone with the track, so nothing paints over the cracked halves. Checked every 5 frames through BEEF (1.7–4.07 s). The heart's halo also drops its outline core while the halves are split, so no ghost outline shows in the gap.
  - The heart is 660 px (61 % of the width) and holds the fill. The liquid uses the evidence's bright #B832E6 → #FF5BC8 with emissive, a meniscus and bubbles. At 360×640, 62 % TIGHT, 16 % BEEF and 100 % MAX BOND all read instantly.
  - New portraits from v06 at ≤ 1.0× (downscaled 0.37–0.42×): Franklin frame 42 (closed mouth, 3/4, centred) and Lamar frame 33 (neutral, centred).
  - The heal, 100 %, MAX BOND and the seam weld all land on frame 122 (the cut to the pool). The light sweep is a 56 px soft band clipped to the heart surface.
  - The pour starts at 0.60 s and TIGHT at 0.66 s, so TIGHT holds 1.2 s before the crack.
  - Critic: v0 8 (locked), v1 7, job match "partly": dropping the portrait-to-portrait pill made it read as a generic love meter. Also flagged "62 % BEEF", the flat crack faces and BEEF sinking into the plate.
- r05 (v1 only):
  - The track is back: badge, pill, badge across x 84–924, seated through the heart's lower half, with liquid that pours from both portraits in sync with the heart. The heart is 600 px.
  - The break faces are lit (clearcoat, magenta edge emission), and the BEEF glass gets a 1.4× rim plus an inner magenta glow.
  - Portraits act: pushed apart, turned and greyed in BEEF; snapped inward on MAX.
  - BEEF rolls out at 30 % on the refill, the window is empty while the count climbs, and MAX BOND slams in on the heal frame.
  - Critic: v0 8 (locked), v1 7, job match "partly", no defects. The track reads as stubs behind the 600 px heart ("a heart jar flanked by faces"). The critic would shrink the heart to ~480 px with a fully visible 640 px capsule, which conflicts with the owner's phone-first direction (heart at 60–70 % of the width). The hard stop after r05 left this unresolved; tile b points at r05.
- r06 (v1 only; A untouched, VS-PREV v0 1.0000). The lead's call: job match wins, so v0's meter is stacked for 9:16.
  - The capsule is fully visible portrait to portrait (x ≈ 80–928), with a 480 px heart perched on its centre. The liquid fills along the capsule from both faces and the fronts collide under the heart's tip on the payoff frame.
  - Added the evidence's heart ticks on the tube (3 per side) and a weld bloom where the fronts meet. After the merge the two runs overlap, so no seam stays in the column.
  - TIGHT now holds ~1.3 s (pour 0.48, TIGHT 0.50). BEEF stays on screen through the creep and snaps out at 40 %, 2 frames before MAX BOND (r05: ~10 empty frames).
  - The type windows clip just under the baseline until the payoff, so the "0 %" and TIGHT roll-ins never cross the heart. The heart halo is faded below the tip, so it doesn't streak a hairline down across the capsule on the flash.
  - Heart liquid depth: a gradient plus a darker band at the glass wall (r05: "flat").
  - Critic: v0 8 (locked), v1 8, job match "yes" for both, no defects. STATUS: PASSED (sticky). Tile b now points at r06. Nitpicks left for v1: the number group slides ~90 px as it re-centres during the surge, a 1 px bar sliver at 0.17–0.27 s and 5.85–6.07 s, and ~3 frames of BEEF at the payoff.
