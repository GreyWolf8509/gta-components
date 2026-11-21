# 12 Punch-in zoom: decisions

## Variant A: "Detail punch" (16:9)

**Evidence.**
- Long-form creators snap the whole frame onto one piece of information and hold it for a beat: the HUD cash and wanted stars (yt-0FV42j9xSV0 t462, about 3x toward the top right), the FPS counter (yt-sYp0S6VQyCE t1367), the game's own text (yt-R24KBNuOiR4 t299), the facecam (yt-fp1Ywp3MmUU t20).
- It is a plain digital scale-up with no border: soft and pixelated, a hard cut or a linear scale in, held 1–4 s, then a cut back.
- One creator marks the target with thin white corner brackets (yt-0FV42j9xSV0 t458), so the focus frame is part of the vernacular.

**Our upgrade.**
- The punch is a camera move, not a scale.
  - It snaps 1.0 → 1.6 in 4 frames (cubic out), overshoots 6 % and settles with a damped spring over about 8 frames.
  - It reframes while it zooms: the detail travels from where it sits to the centre of the frame.
  - It is tracked: the detail's position is keyframed in source pixels, so it stays locked while the shot's own camera orbit continues.
- **Real zoom blur.** Six extra copies of the same frames are each scaled a little further about the detail and averaged (opacity 1/(k+1)).
  - The amount comes from the scale velocity, so it is strongest on the first 2 frames and gone by frame 4.
  - The copies are radially masked off the detail, so the detail stays sharp while the frame edges streak.
- **Shake.** A deterministic decaying shake lands with the punch: about 15 px and 0.45°, with alternate-frame vertical thumps. A small one lands when it snaps back. A cover-scale means no shake frame ever shows an edge.
- **Light.** A 1-frame-attack contrast and saturation pop on the landing (brightness only +5 %, so no veil). A vignette tightens with the punch, centred on the detail. A mild screen-space sharpen comes in while punched, to counter the upscale softness.
- **Focus frame (state change).** Thin corner brackets with a dark contact edge and a soft shadow:
  1. They hunt in from 2.1x with blur.
  2. They wobble like autofocus.
  3. They LOCK: a 2-frame snap inward, white turns to a caption-yellow gradient with a glow burst, and a centre cross appears.
  4. They ride the punch, scaling with the image, and stay framing the detail through the hold.
  5. They collapse into the detail with blur as the camera snaps back.
- **Hold.** About 1.1 s, with a slow 3.5 % push (the evidence's "continued push-in") and a faint handheld float.

**Shots.**
- `v45` beach aerial, 0–0.93.
- `v11` yacht, 0.93–3.03 (the punch shot, sharp trailer footage). The detail is the helicopter on the yacht's helipad.
- `v18` pool skyline, 3.03–4.03.

**Payoff.** The punch lands at 1.53–1.67, with the lock at 1.40. Hero time 2.2 s (mid-hold). Snap-back at 2.67.

## Variant B: "Face punch" (9:16)

**Evidence.**
- The 8.5M-view Short (tt-7669519999714725141) is the Shorts default: the gameplay clip in a letterboxed band. It then hard-cuts to an enlarged full-bleed shot of the character and keeps pushing.
- Meme-style comic punch-ins step in on a face in beats.

**Our upgrade.**
- The base is the band: the `-h` clip at 1.05x, centred, with a blurred and graded bed (brightness .40, contrast 1.12) and a soft contact shadow under the band.
- Three stepped punches (1.0 → 1.25 → 1.5 → 1.9), 8 frames apart:
  - each is a 3-frame snap with a 7 % overshoot and spring settle;
  - each has a real zoom blur about the face;
  - each has a shake that grows (9 → 12 → 18 px);
  - each has a contrast and saturation pop;
  - the vignette tightens a notch every step (.24 → .40 → .56), centred on the face.
- Every step re-centres on Franklin's tracked face.
- **State change.** The bars shrink on each step, and the third punch bursts the band out to full bleed: the letterbox breaks.
- **Footage.** The face ends at 2.0x of the 1080p source, the same as a normal 9:16 crop, because the base is the band rather than a full-bleed crop. That keeps the payoff sharp (DESIGN lesson 21).
- **Hold and exit.** Hold 0.77 s while he side-eyes, then a snap-out with zoom blur across the cut to his "what?" shot at the band.

**Shots.**
- `v05` street, 0–1.27 (setup).
- `v06` Franklin and Lamar portrait, 1.27–2.87 (the punches on Franklin).
- `v03` Franklin "what?", 2.87–4.07.

**Payoff.** The third punch at 2.00, full bleed. Hero time 2.5 s (the side-eye in the hold).

## Would a creator recognise it?
Yes. It is the plain punch-in they use, on the same kinds of targets and with the same hold-and-return rhythm, but it moves like a real camera: zoom blur, overshoot, shake and tracking, with the focus lock as the beat.

## Round 2 changes (critic r01: 7/7, no defects)

**A**
- **New target.** The punch now does the long-form creators' job: a HUD punch-in, as in yt-0FV42j9xSV0 t462, the 6.5M-view example.
  - It plays one continuous gameplay shot, `v52` police chase on the bridge, 0.6–4.6 s at 1.0x. There is no unrelated pre-roll, and the chase in the first 1.4 s is the setup.
  - A sample HUD wanted level (our own drawn stars, right-aligned top right like the game's) sits in the game layer, so it is zoomed with the footage and stays crisp.
- **Payoff.**
  - The focus frame springs in (opacity 1 in 2 frames, scale 1.35 → 1 back-out, no crosshair, 9 px stroke on a 13 px #0E0F13 ink edge).
  - It locks at 1.22. The punch starts at 1.40.
  - Star 5 ignites at 1.53 inside the close-up: a scale pop from 1.7x, a white-hot core and a bloom.
  - It lands with an exposure hit: brightness +15 %, 3-frame hold, blacks kept. The vignette lets go during the hit.
- **Hold.** 1.67 s from landing (1.53–3.20), then the snap-back. Tail 0.66 s on the same shot.

**B**
- **Steps.** v06 now starts 1 frame later (`data-media-start` 0.033), which fixes the duplicated first frame. The steps land 6 frames apart: 1.30, 1.50, 1.70.
- **Hold.** The full-bleed close-up holds from about 1.8 to 3.2 (1.4 s). It runs across a match cut from his side-eye to his "what?" (v03), still punched in and tracked on the face, then snaps out to the band at 3.2. The tail is 0.6 s.
- **Light.** An exposure hit on every step, the biggest on the third (+15 %, 3-frame hold). The vignette is capped at .16 / .24 / .30, so the payoff brightens.
- **Sharpness.** The band base is 0.975, so the face ends at 1.85x of the source. Sharpen raised to .34.

## Round 3 changes (critic r02: 7/7, no defects)

**A**
- **Ignition.** Star 5 pops inside its own slot (0.9 → 1.28 → 1.0) with a white-hot fill and a gold #F6C453 rim for 3 frames. A screen-blend bloom sits behind that star only (lesson 22). The frame-wide lift is down to +5 %.
- **Stars.** 56 px, with a #FFFFFF → #D6DCE6 fill, a top sheen, a 3 px ink edge and a contact shadow. The unlit star is #232A38 with a #7E879A outline, so the change from 4 to 5 stars reads at phone size.
- **Hold.** Vignette .12. A hold grade (brightness +7 %, contrast +6 %, saturation +8 %) lifts mean luma from 101 to about 110.
- **Exit.** The corners retract outward from 3.06 to 3.18 (they grow 36 px a side and the arms shrink to nothing), before the snap-back at 3.20, so no bracket pixel crosses a star.
- r03 critic: **8 (locked).**

**B**
- **One shot.** The steps, the hold and the start of the snap-out all play on one continuous shot (v06).
  - The steps fire 4 frames apart, as the brief's "quick" calls for.
  - The full-bleed hold runs about 1.2 s with a slow push.
  - The snap-out starts on v06 and lands in the band across the cut to v03, a 0.7 s "what?" tail.
- **Setup.** v30 (minigun chaos) with a 3.5 % creep. Its bed is darkened, so the flashes don't grey it.
- r03 critic: 7, with one defect: v30's last frame repeated at the cut. **Fixed in source after round 3, not re-rendered:** the cut and all timings moved 1 frame earlier.
- The tile shows r02, the best B round with no defects.

## Round 4 changes (critic r03: 8/7, one defect in B). A is locked and untouched.

**B** (rebuilt on the r03 critic's timing, with a sharp payoff)
- **Sharp payoff (lesson 21).** The band at 1.0 is now the whole 16:9 `-h` frame fitted to the width (0.5625x, 1080x608). The brief's 1.0 → 1.25 → 1.5 → 1.9 then ends at **1.07x of the source**, near native, instead of a 1.85x upscaled full-bleed face. v06 stays: it is the sharpest bright, front-lit reaction face in the library (checked at 360x640).
- **State change.** The band grows with every punch (608 → 760 → 912 → 1154 px tall), springing with the overshoot, so the letterbox breaks open step by step. The zoom-blur taps scale the band's window as well as the image, so its edges smear on each snap.
- **Timing.** Setup v30 cut to 1.27 s (media 0.03–1.30, so a flash lands on the cut). Franklin in the band, held at 1.0 for 5 frames (1.27–1.40). Punches 6 frames apart at 1.43 / 1.63 / 1.83 (3-frame snap, settle 0.07, 2+ rest frames each). Hold on the same shot with a 4 % push to 2.70, snap-out on v06 landing in the band on the cut to the "what?" tail (v03, 2.83–4.0, slight creep).
- **Light.** The third punch lands with an exposure hit (+12 %) and a screen-blend bloom on the face, a 3-frame peak (face luma 138 → 170). Vignette steps .24 / .38 / .50, narrowing on the face, inside the band only.
- **Bars.** The bed is an ambient wash: the same shot blurred 80 px, brightness .70 / contrast 1.12, with a falloff that keeps the far top and bottom dark. The explosion's bed is warmed so its flashes never grey the bars; v06's bed shows sky above the band; the tail's bed uses the bright street side of v03.
- **Frozen frame fixed.** No shot runs past its end, and each incoming shot starts 2 frames early underneath the outgoing one (lesson 25). Consecutive-frame PSNR peaks at 35 dB (natural motion).
- **Renderer finding.** The runtime forces `visibility: visible` on active clip videos, so hiding a tap window with `visibility` leaves it on screen with stale geometry. Taps switch off with opacity, and go off 2+ frames before a cut.
- r04 critic: A 8 (locked), B 7, no defects. The critic's notes on B: step 3 was only a bigger zoom plus a frame-wide exposure lift, the 1.9x read held 0.87 s, the band never broke its bars, and the shake let a few edge pixels peek.

## Round 5 changes (B only; A is locked and untouched)

- **The burst is the state change.** The band at 1.0 is now 1080x778 (the 16:9 clip at 0.72x with the sides trimmed, close to the evidence's 4:3 band). Steps 1 and 2 punch inside that fixed band. Step 3 bursts it to 1477 px tall (y 222-1700), with the bars collapsing into the platform-UI zones, as in the evidence's letterbox-to-full-bleed punch. The brief's 1.0 → 1.25 → 1.5 → 1.9 is unchanged, and the face ends at 1.37x of the source with an unsharp pass (0.25, constant kernel) on the band from step 2 until the snap-out.
- **Hold of at least 1.1 s.** 1-frame pre-rolls replace the 2-frame ones. The band holds 4 frames, and the steps accelerate into the burst (1.40 / 1.57 / 1.70). A 2-frame snap-out on v06 (2.80) lands in the band on the cut to the tail (2.87). The 1.9x read now runs from 1.70 to 2.80.
- **Light localised (lessons 16, 22).** There is no frame-wide exposure lift. The per-step kick is +3 % brightness with contrast and saturation. The payoff light is a backlight: a broad soft glow from behind his crown on the sky, rim-lighting the hair, masked off below the hairline (3-frame peak, 0.45 s decay). A thin ring was tried and rejected because it read as a halo.
- **Edges.** Taps are clipped to the band (no lit hairline), and the vignette, bloom and shadow layers are padded 60 px past the sides. The edge strips measure the same as their neighbours on every shake frame.
- **Checks.** Taps have unique durations (no duplicate-media merge with s1). The cuts are clean, and consecutive-frame PSNR peaks at 34 dB.

## Round 6 changes (critic r05: 8/7, no defects). A is locked and untouched.

The r05 verdict and the two before it read B as "a CapCut zoom + shake + blur-bg preset". Round 6 rebuilds B around a sharper face, a real black letterbox and one payoff accent.

**B**
- **New punch shot (sharpness, DESIGN 11.12 and 11.21).** I scanned all 57 shots at 3 fps. No character close-up runs longer than 1.67 s; the longer shots (v35, v49, v54, v58) show characters from behind or small in frame. `v25-michael-door` is the only big, sharp face with a clear reaction: Michael bursts through a door, and Franklin turns and yells at him in a large foreground close-up.
  - Franklin's face is about 330 px wide in the 1080p source, against about 250 px in v06.
  - The 1.9 step therefore sits at 1.37x of the source and stays crisp, where v06's 1.37x was soft.
  - Downside: the shot is very dark (source mean luma 22). It is graded `brightness(1.95) contrast(1.06) saturate(1.06)`. Brightness multiplies, so the blacks stay black and the hold reads at mean luma ~37 including the bars, with the face properly exposed.
- **Real blacks, no blur bed (lesson 21 feedback).** The blurred, graded bed is gone. The band sits on true black bars (#020203), as in the 8.5M-view letterboxed Short.
- **Framing.** At 1.0 the band is right-aligned on v25, so it reads as a two-shot: Michael in the door, Franklin's head at the right edge.
  - Steps 1 and 2 punch in on Franklin as he turns (the band clamps at the clip's edge).
  - Step 3 bursts the band 778 → 1477 px tall on his open-mouthed yell.
  - The face is tracked frame by frame (11 keys) and slides to centre through the hold.
- **Steps land hard.**
  - Each snap is 2 frames, with a 6 % overshoot and spring.
  - Each has a crisp 3-frame shake: a hard offset, a smaller kick back, a tap, then still. It runs 12 / 16 / 26 px, mostly vertical, with a little rotation.
  - Each has a band-local exposure kick (+7 / +9 / +16 %, multiplicative, no veil) and the zoom-blur taps.
  - The vignette tightens .22 / .34 / .46 on the face.
- **The payoff accent (lessons 24 and 26).** "WHAT?!" is real Three.js geometry, using the engine from 16-sfx-word, copied to `b/media/`.
  - Material: extruded and bevelled Archivo Black letters (80 % width), with caption-yellow enamel faces over amber walls. Our own lettering, with the creator ink outline (14 px) and a drop shadow.
  - Size: 229 px type (cap 158 px, ink about 780 px = 72 % of the frame width), lower third over his dark shirt (cap centre y 1268, inside x 72-936).
  - The slam: it lands with step 3, letters slamming in from 1.85x within 2 frames, centre letters first. The word squashes onto its baseline and springs back, with its own share of the shake.
  - The light: the key light rakes the bevels, one specular sweeps the faces, and bloom peaks for 3 frames.
- **Hold and exit.**
  - The punched hold runs from the landing (1.77) to the snap-out (2.80). That is about 1.03 s: v25 is 1.63 s long, and the 4-frame baseline and three steps have to fit inside it.
  - The word stays on screen for about 1.5 s. It docks onto the band's lower edge as the band snaps back on the cut to Franklin's "what?" shrug (v03, bright).
  - It then stomps flat into its baseline with a vertical motion blur (3.24-3.42). The footage-only tail is 0.58 s.

## Round 7 changes (critic r06: v0 7 (locked at 8 from r03, render unchanged) / v1 7, no defects). A is untouched.

The r06 critic praised the 3D word but named four gaps: v25 reads murky (and DESIGN §5 names it), steps 1 and 2 clamp at the clip's edge and read as one beat, the burst still leaves bars (y 222-1699), and the hold is 1.1 s.

**B**
- **Bright, centred punch shot.** Back to `v06-franklin-lamar-portrait-h` (bright sky, Franklin centre frame, Lamar beside him), framed centred (`ax` 0.5) so all three steps travel straight into the face with no edge clamp. A light `.g1` snap (contrast 1.05, saturate 1.08); no lift needed.
- **Setup from the same scene.** `v05-franklin-lamar-street-h` (Franklin and Lamar on the street) replaces v25's door, so the cut into the reaction is a continuity cut, not a jump.
- **Three distinct beats.** The steps sit at 1.40 / 1.60 / 1.77 (5 frames of 1.0 first, then 6 and 5 frames between punches), and each one opens the letterbox a notch (909 → 1000 → 1100 px) as well as punching the content, so every beat changes the frame's shape as well as the scale.
- **The burst breaks the letterbox.** Step 3 opens the band to 1728 px (y 96-1824), the image's full height at 1.6x. The remaining 96 px bars sit in the platform UI zones. Going full-bleed would need 1.78x, which reads soft on this source, so 1.6x is the sharpness cap.
- **Word: "BRO?!"** (the Shorts reaction beat on Franklin's look). 298 px type, ink about 790 px (73 % of the width), cap centre y 1290 over his hoodie, inside x 72-936 / y 230-1480 on the settled hold. Every letter appears on the burst's first frame (no lone centre letter); the centre letters land first (a 0.012 s per-letter stagger in landing speed), then a small spring.
- **Hold.** The punched hold runs from the landing (1.83) to the snap-out (2.77): 0.93 s. The word's read is about 1.5 s (1.78-3.24), because it docks to the band edge (y 1378, 0.76x) over the cut to v03 and stays into the tail.
- **Unresolved.** No library character close-up is longer than 1.67 s (scanned all 57 shots at 3 fps), so the 1.0 baseline, three spaced steps and a 1.2 s hold cannot all fit in one continuous shot.
