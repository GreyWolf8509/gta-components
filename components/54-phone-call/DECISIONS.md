# 54 Phone call: decisions

Caller for both variants: **LAMAR** (Lamar Davis is listed in DESIGN.md §10). His portrait is a still cropped from
`v06-franklin-lamar-portrait-h` at 1.05 s (sharp, front-lit, mouth closed, blue sky behind; 460x944 crop at <=1.0x,
`a/media/caller.jpg`). The phone and its call UI are our own design: no OS, carrier or app marks, no copy of the
in-game phone. The brief named Lester, but the shot library has no Lester, so the name follows the portrait (CONFIG).

## Variant A: Incoming call (16:9, 1920x1080, 6.3 s)

**Evidence.**
- `yt-eT7H9BAUPQw` t00325 (3.1M views): a realistic phone at the bottom-right (x 83-97%, y 42-98%), about 15% of
  the frame width and 57% of its height. The screen is a full-bleed caller portrait with a small white `00:01` call
  timer, round grey call buttons and a red end-call button. It is a flat 2D overlay over gameplay; the neighbouring
  frames (t00321, t00329) show it is cut in and out with the call audio. No depth, no light, no state change on screen.

**Our upgrade.**
- The handset is real Three.js geometry: a bevelled extruded body (depth 30 px at 316 px wide) with a polished steel
  frame (MeshPhysical, metalness 1, roughness 0.2, clearcoat), side buttons, a black glass bezel, and a separate
  glass sheet in front of the screen that reflects a PMREM studio environment, so the glass and frame catch light as
  the phone turns. ACES tone mapping, key + rim + hemisphere light, a soft contact shadow behind it on the footage.
- The screen is a 2x canvas texture of our own call UI: full-bleed portrait (slow push), status row, a punch-hole
  lens, `INCOMING CALL`, the name in Inter 900, glossy red/green buttons (3-stop radial gradients, top highlight,
  inner shadow) with ripple halos ringing out of the accept button.
- Physics: it rises from below the frame with a spring (back.out) while untwisting from a 3D tilt, then vibrates in
  two buzz bursts (frame-alternating jitter, handset glyph wiggles), and lands a "thunk" (scale + pitch kick) at the
  connect.

**Payoff (2.75 s): accept slides, the call connects.** The green button presses in (squash 0.86), slides to the
centre leaving a green trail while it turns red and its handset rotates 135 deg into the end-call button, the
decline button collapses into it, and on lock-in a green shockwave rings out of the button (lower screen only, never
over the face), a specular rake crosses the glass and frame, the name block springs up 14u, `INCOMING CALL` rolls
out as the `00:00` timer rolls in (masked rows, no cross-dissolve), voice bars start and frosted control buttons
(real blur of the portrait behind them) spring in. The timer then ticks 00:01, 00:02 in rolling digits.

**Shots and cuts.** `v49-gp-franklin-mural` (gameplay, Franklin walking: the phone rings on gameplay) 0-2.75, a
hard cut on the connect to `v28-tennis-mansion` (bright, sharp) 2.75-5.0, then `v36-hills-city-view` to the end.
Incoming clips start 2 frames early underneath (lesson 25). Exit at 5.62: the phone tips back and drops out of frame
with blur (no fade), 0.3 s tail.

## Variant B: Call for Shorts (9:16, 1080x1920, 6.5 s)

**Evidence.** Same object; the Short version is the phone as the hero, centred, with the caller's line captioned.

**Our upgrade.** The same 3D handset at 540x1110 px (50% of the frame width, 58% of its height: as big as fits
inside the Shorts safe zone x 72-936, y 230-1480 with a caption row above), centred on x 504, bottom at about y 1470.
Same ring, buzz and connect payoff. After the connect the caller's line pops in above the phone word by word in
heavy Archivo caption caps (86 px, ink stroke, yellow keyword), then rolls to the second phrase through a masked
window.

**Payoff (2.95 s).** Identical connect beat, bigger; captions follow at 3.25 s.

**Shots.** `v49-gp-franklin-mural-v` 0-2.95 (Franklin walks at the left edge, visible beside the phone), cut on the
connect to `v44-bridge-skyline-v`, then `v28-tennis-mansion-v` (a back view, no face close-up) to the end.

## Round log
- r01: first build. Critic: v0 8 (locked), v1 7 (smeary upscaled portrait with a parted mouth, mid-grey frosted
  bed, small secondary type, hairline payoff ring, faint buzz, caption crowding the bezel).
- r02 (v1 only; v0 frozen, SSIM 1.0):
  - portrait: frame 32 of v06 (lips closed), cropped 508x1080 so it maps at about 1.0x on the 505 px screen,
    lanczos 2.17x + CAS sharpen into `b/media/caller-hd.jpg` (1104x2347), so the canvas never upscales it;
  - lower bed: ink #0A0B0E gradient from 42% (0.5) to 0.88 by 55% and 0.93 at the bottom; measured bed luma 13-42;
    the glass reflection on B dropped to envMapIntensity 0.28 (its yaw pointed the glass at the front-left env strip,
    which lifted the left of the bed to 65); frosted control discs darkened;
  - Shorts-size type: name 21u (106 px), INCOMING CALL 5.8u (29 px), timer 10.5u (53 px), labels 5u (25 px), keys 10.5u;
  - ringing: buzz ±1.3 deg / ±7 px with sustain-then-decay, plus two stroke halos leaving the accept key per burst;
  - payoff: shockwave core 3.2-5.6u (16-28 px) with an inner and outer glow, brighter key bloom, rake 0.44 over 0.4 s;
  - caption 86 px with its baseline about 55 px above the phone's top edge; phone 540x1110 so the bottom clears 1480.
