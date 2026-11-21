# 66 Time-passing clock: decisions

The "time passes" clock: an analog clock over the footage whose hands spin forward through hours. Overlay kind: both variants render clean on `bg:none`. Kept distinct from 55 (a type stamp with drum digits) and 32 (a countdown ring / stopwatch): here the hero is a real analog dial, and what moves is the hands and the light.

## Evidence
- `yt-LzIibqRWGqw` t96 (4.3M views, long-form): a large round clock face centred over gameplay (x 33-68%, y 20-80%, about 35% of the frame width). Grey serif numerals 1-12 on a whitish face at 30-40% opacity, so the road and car show through. No bezel, no hands visible in the sample, no depth, no light. Neighbouring frames (t92, t100) show it appears between segments over plain gameplay; the motion is a time-lapse of spinning hands.
- The vernacular: a big translucent clock centred mid-frame, the footage visible through the face, the hands racing forward. The clock is the information: "hours later".

## Shared object (both variants, `media/clock3d.js`, copied)
- **Real 3D (lesson 24).** Three.js, ACES, PMREM studio env, key + hemisphere + rim.
  - Bezel: three lathed rings, a polished steel inner chamfer, a gloss black-ceramic body (clearcoat 1) and a polished steel outer lip, 48-52 px wide and 32 px tall.
  - Dial: frosted glass. A DOM disc behind the canvas with `backdrop-filter: blur(10px) saturate(1.3)` and a 55-65% white radial gradient, so the footage blurs through it like the evidence's translucent face, but legibly. Its CSS 3D transform matches the Three.js camera exactly (perspective = camera distance), so glass and 3D parts tilt as one.
  - Applied numerals 12 / 3 / 6 / 9 extruded from Archivo outlines (wght 800, wdth 88, cap 0.22 R, 7 px deep, steel bevel, black lacquer face) and eight raised bars. They cast real shadows onto the glass (ShadowMaterial receiver).
  - Hands: extruded lacquer with steel edges; the minute hand has a red tip. A domed steel centre cap. Shutter motion blur: each hand is drawn as up to 18 transparent copies across a 180-degree shutter, so the minute hand smears into a fan at speed and is crisp at rest.
  - Readout: a recessed steel-framed window below the centre with a smoked display (canvas texture): hour, colon and minute drums in fixed tabular cells (Inter 900), PM in caption yellow. The drums are geared to the minute hand, so they roll and blur with it.
  - Crystal: a soft clipped glare crescent; no hairlines.
- **Light shift.** The sun on the clock moves with the clock time: the key swings from high-front to low-right and warms from white to orange; the hand and bezel shadows lengthen across the dial. The frost warms slightly as evening comes.
- **Physics.** Entrance: swings up from lying back (rotateX -1.18 rad, scale 0.58, z -260) with back.out(1.35), 9 px blur clearing in 0.13 s, opaque in 2 frames. The minute hand anticipates (pulls back 4.5 degrees), accelerates, cruises, decelerates and arrives still moving at about 180-240 deg/s. The body twists slightly against the spin-up torque.
- **Payoff: the lock-in.** The minute hand hits 12 and overshoots 5-7 degrees on a 5.5 Hz damped spring (the hour hand is geared, the readout's minute drum overshoots with it). Same frame: the face lamp switches on (the frost floods warm, a white-hot core for 3 frames, a halo spills past the bezel), a specular rake crosses the bezel and crystal (0.42 s), the clock punches 3.2% and recoils in rotation, the readout's digits light warm, and the footage cuts with a small shake (flash 0). Shadows soften because the face is now backlit.
- **Exit:** tips back past edge-on (rotateX -1.42 rad) with power3.in, lifting, shrinking 16% and blurring 8 px; cut on the zero frame.

## Variant A (16:9): Clock face, 5.8 s
- Clock centred at (960, 520), dial R 300, outer diameter 696 (36% of the width, the evidence's size and place). Readout window 228 x 84 px.
- 2:00 PM to 8:00 PM, six turns over 2.2 s (1.0-3.2). Cuts land on hour passes: v44 bridge skyline (2 PM) to v36 hills (3 PM) to v07 biplane sunset (6 PM) to **v24 sunset power lines at the 8:00 lock-in (3.2 s)**, then v01 lifeguard sunset. Incoming clips start 2 frames early underneath.
- Hold 3.2-5.0, exit 5.0-5.3, tail 0.5 s. **Hero: 3.45 s** (r02).

## Variant B (9:16): Clock for Shorts, 6.0 s
- Phone-first (lesson 26): centred in the upper area at (540, 720), dial R 322, outer diameter 748 (69% of the width), spanning x 166-914, y 346-1094. Numerals 71 px cap, readout window 283 x 103 px.
- Noon to 9:00 PM, nine turns over 2.5 s (1.0-3.5). Cuts on hour passes: v44 bridge (noon) to v36 hills (1 PM) to v07 biplane sunset (6 PM) to v24 power lines (8 PM) to **v12 heli over the lit city at dusk at the 9:00 lock-in (3.5 s)**, then v41 smokestacks at dusk. The lit warm face against the dusk city is the light moment.
- Hold 3.5-5.2, exit 5.2-5.5, tail 0.5 s. **Hero: 3.75 s** (r02).

## Round log
- r01: first build, as above.
- r01 self-review before the critic:
  - The lathed bezel rings were back-face culled (the ceramic didn't render): lathe materials are now double-sided.
  - Motion blur showed separate copies as lines: up to 44 shutter copies, one per 0.6 degrees of sweep.
  - The readout's minute drums smeared into solid white blocks at speed: shutter samples now spread over half a frame of travel with falling alpha, so they blur to a soft grey. The readout ignores the hands' anticipation (no "1:59") and settles after the lock with a quarter of the hand's overshoot.
  - Lacquer is deeper black (env 0.6); the frost is a little more see-through (46-60% white).
- r01 verdict: v0 7 / v1 7, no defects. The critic: only the lit-dial payoff reads premium; the spin looks like a stock clock time-lapse (a flat pink tip-trail band, hands crossing the readout digits, a mottled grey day face with no glass, flat black hands with a pale ghost shadow, "1|2" at the payoff).
- r02 (both variants):
  - **Hands:** faceted black chrome (a ridge down the centre, flat-shaded, so one facet catches the env and the other goes dark), sword hour hand, red-tipped minute hand.
  - **Motion trail:** the 3D hand stays solid; behind it a comet trail of up to 90 flat copies sampled at the hand's real positions over the last frame, with opacity falling along the trail (the red tip's trail is fainter and falls faster). No constant-alpha band, no strobing gaps.
  - **Slower peak:** A is 3:00-8:00 PM (5 turns over 2.3 s), B 2:00-9:00 PM (7 turns over 2.6 s), with a longer cruise; the peak is 36 and 45 degrees per frame. Cuts re-timed to the new hour passes. The lock-in is at 3.25 s (A) and 3.55 s (B).
  - **12 o'clock:** the numeral 12 is now a lacquer triangle index (3 / 6 / 9 stay numerals), the minute hand's landing target; it flashes red at the lock-in. The payoff reads as a clean hand-on-index, not "1|2".
  - **Readout on the crystal:** the display and its steel frame sit at crystal height, above the hands, so the hands pass beneath it and never cross the digits; it casts a shadow onto the dial.
  - **Glass:** the frost is whiter and smoother (68-76% white, blur 16 px). The crystal glare is about 2.4x stronger (a clipped upper-left arc) and the payoff rake crosses it at 0.3.
  - **Light:** the sun stays frontal (shadows 6-12 px), and shadows are darker (0.42) and stay at the lamp-on. The payoff has a 1-frame 3% pop and then a 4.5% spring punch, a cap glint for 3 frames and a stronger bezel rake (0.85).
  - **B:** the tail is v38 freeway at dusk (brighter) instead of v41.
- r02 verdict: v0 8 / v1 8, no defects, no hard caps (PASSED, both locked). Open nitpicks:
  - the readout plate sits tight to the 6 and the 5/7 bars, and the hour hand slides under it between 5 and 7;
  - the critic wants a visible mechanical recoil at the lock-in;
  - the minute tip over the red-flashing 12 triangle stacks into a double arrow;
  - the grey spin wedge reads as a pie slice at phone size;
  - the day-state dial is a little grey over bright skies.
