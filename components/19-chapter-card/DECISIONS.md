# 19 Chapter card: decisions

The marker between sections: "ATTEMPT 2:", "10 SECONDS LATER", "DAY 3". Both variants are full-kind: the card is a treatment of the footage it sits on.

## Variant A: Full card (16:9, 1920x1080, 4.25 s)

**Evidence.**
- `yt-5-QjENpFb98` t6 (29.8M views): "ATTEMPT 2:" in white heavy geometric caps with a colon, no box, a soft dark drop shadow down-right, centred, about half the frame wide. It hard-cuts to the next number on each new attempt (t3 "ATTEMPT 1:", t9 "ATTEMPT 2:", t12 "ATTEMPT 3:").
- `yt-3nVF2EY_iHg` t96 (16.7M): "JULIO 2026" white display caps, centred at mid-frame, about 9% of the frame height, slight shadow, static over the landing shot.
- `yt-R24KBNuOiR4` t128: the plain black "10 seconds later" card, centred.
- The vernacular: big white heavy caps, centred, no box, a soft shadow, the number is the information, static, hard cuts.

**Our upgrade.**
- **Same object, the same place:** "ATTEMPT 2:" centred on the frame (cap centre y 532), white wide heavy caps (Archivo wdth 112 / wght 900), colon kept, about 1330 px of ink (69% of the frame), cap height about 128 px (12% of the frame: bigger than both evidence cards).
- **Real geometry** (DESIGN 11.24). Every letter is extruded from the font's own outlines (media/glyphs.js, fontkit), 26% of the cap deep with a rounded 4-segment bevel, tilted back 0.24 rad so the wall reads under the face. White clearcoat enamel face (#FFFFFF to #DCE1E8), graphite metal walls (#3A404C to #08090C) with a lit lip, a PMREM studio environment, a key plus hemisphere light, and a soft contact shadow cast down-right on the footage (the evidence's shadow, done as a real cast shadow).
- **The number is a mechanical counter drum.** The digit sits on a ten-digit wheel about X (radius 2.15 caps) seen through a clipped window, so the count rolls like an odometer: a 2-frame wind-back, then a roll 1 -> 2 with back.out(1.6) and true motion blur (20 sub-frames across a 1/60 s shutter). Only digits inside the count are drawn (no slivers of the next digit).
- **State change on the lock (1.33 s).** The moment the 2 reaches its mark it floods from white enamel to caption-yellow polished metal (5-stop face with a reflection horizon: #FFF6B8 / #FFD23C / #EFA514 / #FFD54A / #E0920F), led by a hot band; a key light rakes across the bevels; bloom peaks for 3 frames; the line punches 1.045 and springs home; the footage takes a hit (Look.impact amp 7, flash 0) and a local warm bounce lights the footage behind the number (screen, 3-frame peak, settles to 25%), plus a 3-frame Look.expose on the bed only.
- **The bed.** The gameplay (v52 police chase, attempt 1) dims, blurs and pushes in under the card: brightness 0.5, contrast 1.14, saturation 0.82, 5 px blur, a radial shade behind the title, a slow push to 1.07.
- **Entrance.** The letters slam in from near the lens in reading order (28 ms stagger): z 560 -> 0 with back.out, a small turn that shows the extrusion, motion blur, and a squash on landing; a small hit when the last one lands.
- **Exit: the wipe back to gameplay.** A slanted hard-edged wipe (feather 28 px) runs left to right in 0.42 s (power3.inOut) and takes the card and the bed off together; a soft light seam rides the edge; the next gameplay clip (v57) pushes in from 1.1 with a horizontal blur that resolves. The card layer is cut on the frame the wipe ends.

**Shots and cut points.**

| Time | Shot | Why |
|---|---|---|
| 0-3.87 | `v52-gp-police-bridge-h` (in 0.6) | attempt 1: the bridge chase, the bed under the card |
| 3.4-4.25 | `v21-race-topdown-h` (in 0.0) | attempt 2: bright, sharp race footage the wipe hands back to (0.41 s tail) |

**Payoff:** 1.33 s, the drum locks on 2 and floods yellow, then the light runs back across the whole word. Hero 1.6 s.

## Variant B: Time skip (9:16, 1080x1920, 4.06 s)

**Evidence.** The "time later" card (`yt-R24KBNuOiR4` t128: centred white words on a held card) and the Shorts label (`yt-5-QjENpFb98`: white heavy caps, centred, no box). The brief: big and quick, over a frozen-and-blurred frame, in and out under 1.5 s.

**Our upgrade.**
- **The freeze.** The crash clip (v56, the van through the wall) freezes on the debris at 2.0 s on the exact next frame (media/freeze.jpg is source frame 60), punches in 1.045 in 3 frames, dims and blurs (brightness 0.62, contrast 1.18, saturation 0.6, 12 px), and keeps pushing to 1.08 while it is held, so the still never reads as dead.
- **Type.** A huge counter "10" (Archivo wdth 112 / 900, ink about 760 px, cap about 370 px) over "SECONDS LATER" (Archivo wdth 78 / 900, ink 790 px), a justified centred block in the safe zone (y about 600-1060). All real geometry: the same white enamel and graphite walls as A.
- **The counter fast-forwards.** Two drums: the units wheel spins a full revolution 00 -> 10 in 0.42 s (back.out(0.55): fast, decelerating onto the mark with a 0.1-step overshoot), and the tens carries on the last step, like a stopwatch run forward. 36 sub-frames of motion blur keep the spin a smooth blur, not a strobe.
- **Lock (2.39 s):** the same state change as A (white -> yellow metal behind a hot front, a key rake, 3-frame bloom peak, a 1.05 punch, a warm bounce on the frozen frame, a hit).
- **Exit (3.32-3.47 s):** the card rushes at the lens (power3.in) with motion blur while the still pushes 1.22; cut on the frame it fills the screen to the clip "later" (v11 yacht), which lands with a 1.1 -> 1.0 punch and a vertical blur that resolves.
- The card is on screen 2.02-3.47 s: 1.44 s, in and out under 1.5 s as the brief asks.

**Shots and cut points.**

| Time | Shot | Why |
|---|---|---|
| 0-2.0 | `v56-gp-truck-crash-v` (in 0) | the setup: the van smashes through the wall |
| 2.0-3.47 | freeze of v56 frame 60 | the frozen, blurred bed |
| 3.47-4.06 | `v11-yacht-v` (in 0.1) | "10 seconds later": bright, sharp, wide |

**Payoff:** 2.20 s, the counter locks on 10 and floods yellow. Hero 2.6 s.

## Round log
- r01 self-review fixes before the critic: the card layer is hidden with opacity, not visibility (a clip forces its own visibility, so the bed flashed back for a frame after the wipe); the digit after the count no longer shows a sliver under the number; letters are hidden by frame time so no first frame of a slam is see-through; the B spin and exit use 32-36 sub-frames (8 gave a stepped strobe ladder); the yellow face got a reflection horizon; the B freeze bed is less murky (brightness 0.5 -> 0.62, shade 0.38 -> 0.32).
- r01 verdict: v0 7 / v1 7, 2 defects. v0: ink centred about 30 px right (the centring ignored the colon); white enamel flat-lit and static through the hold, the payoff confined to one digit; a 0.77 s soft gp tail. v1: the spinning digit read as a banded grey slab whose window cut into "TER"; the locked read held under 1 s; "LATER" 3 px inside the safe edge.
- r02 changes:
  - **[defect v0] centring:** lines now centre on the full visible ink, colon included (measured: ink x 299-1615, centre 957).
  - **[defect v1] drum window:** the caption sits 92 px under the number (was 58) and lands in its own row (slam from z 260, no vertical drop); the window margin is 0.07 cap (was 0.13); the window edges are soft (digits fade over 0.14 cap into the slot edge, front faces only); the spin uses a short shutter (1/400 s, 12 sub-frames), so each frame shows real digits (05, 07, 09) instead of an averaged grey slab.
  - **Whole-word payoff (v0):** on the lock one hot specular band runs from the number back across ATTEMPT (0.42 s, power3.inOut) with bloom, and the word recoils 7 px (back.out(2.5), 0.2 s) on top of the 1.045 punch. B gets the same band across "10" and the caption.
  - **Material that survives phone size (both):** deeper extrusion (A 0.32 cap, B 0.26 / 0.34) and bolder bevels (A 0.085, B 0.06 / 0.09); brushed steel walls (#8A93A2 to #1C2028) so the sides read as material, not a drop shadow; a stronger face gradient (#FFFFFF to #CDD4DE); the key keeps travelling through the hold and a broad soft sheen drifts across, so the faces never sit flat.
  - **v1 timing:** the counter spins from the slam (2.02 s) and locks at 2.20 s; the exit starts at 3.37 s, so the locked read holds 1.17 s while the card stays in and out in 1.47 s as the brief asks. Caption maxInk 790 -> 740 (ink x 174-908).
  - **v0 tail:** the wipe hands back to the sharp, bright v21 race shot; the comp ends at 4.25 s (0.41 s tail), with a lighter 8 px blur on the incoming shot.
- r02 verdict: v0 8 / v1 8, no defects or hard caps: PASSED (sticky). Open nitpicks (not acted on, both locked): v0's white faces still read mostly flat white with a faint hold sheen over a dim, emptied bed; v1's post-lock band whites out each digit for about 2 frames, a hairline seam on the "0" wall, a 1.15 s locked hold, a tight word space in "SECONDS LATER".
