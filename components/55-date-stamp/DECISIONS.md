# 55 Date stamp: decisions

The "later that night" date and time stamp. Overlay kind: both variants render clean on `bg:none`.

## Evidence
- `tt-7698608560544009486` t0 to t6 (5M views, Short): "NOV 18th 2026" over "23:59", centred, about 47-57% from the top and 55% of the frame wide. Bold geometric sans (Montserrat or Gotham feel), white with a thin black outline and a soft dark shadow, no box, both lines at the same size. It's static over a busy freeway shot for about 6 s, then gone at the hard cut to empty streets (t7.5).
- The vernacular: big white heavy type, centred mid-frame, no box, a day or date line and a clock. The clock is the information.

## Variant A (16:9): Date and time, 5.2 s
**Our upgrade.**
- It's the same object in the same place: a centred two-line stamp (block centre y 556). "SATURDAY 7:59 PM" sits over "LOS SANTOS". The row is 1180 px of ink (61% of the frame), the cap 76 px (7% of the frame height), bigger than the evidence.
- **Real geometry** (lesson 24). Every letter is extruded from Archivo's own outlines (`media/glyphs.js`, wdth 106 / wght 900; the place line is wdth 125 / 800, tracked 0.26). It's 30% of the cap deep with a rounded bevel, tilted back 0.2 rad so the brushed-steel walls read under the white clearcoat enamel face. A PMREM studio env, key and hemisphere light, and a soft cast contact shadow (the evidence's outline and shadow, done as a real shadow).
- **Types on** (the brief) behind a glossy caption-yellow caret bar. Each key strike lands from 190 px toward the lens with a tip-down and a 3-frame squash, hidden by frame time, so no first frame is see-through. The caret jumps ahead on word pauses, blinks when the line is done, then folds away.
- **The clock ticks.** The digits are tabular drum slots (the brief's "mono" figures, so a tick never shifts the line). The colon blinks off for 0.5 s. Then the clock flips 7:59 to 8:00: three mechanical drums (the minute tens is a 0-5 wheel) roll forward, carrying right to left 35 ms apart, with back.out(2.2) overshoot and motion blur.
- **Payoff, 2.62 s, on the cut to v12 (city lights).** The hour drum lands. The whole time line ("8:00 PM", colon and suffix too) floods from white enamel to caption-yellow metal behind a hot light front. A key light rakes the bevels, bloom peaks for 3 frames, and the time punches 1.06 and springs back. The day and place recoil, and one hot specular band crosses the whole stamp. On the footage: a warm local bounce behind the time, a 3-frame expose at 1.18 and a small shake (flash 0).
- **Exit (4.39-4.75 s):** a short slanted wipe (clip-path, never mask-image) left to right. The light band rides the cut edge on the letters. It ends on the cut to the last shot; the tail is 0.45 s.

**Shots** (sunset into dusk, so the copy is 8 PM, honest to the GTA V footage). Each incoming clip starts 2 frames early underneath (lesson 25).

| Time | Shot |
|---|---|
| 0-1.53 | v38 freeway dusk (in 0.25): the evidence's freeway |
| 1.47-2.62 | v17 Deluxo at sunset (in 0.2) |
| 2.55-3.90 | v12 heli over the city at dusk, lights on: the payoff cut |
| 3.83-4.75 | v41 smokestacks at dusk |
| 4.68-5.2 | v24 sunset power lines (tail) |

**Hero:** 3.0 s.

## Variant B (9:16): Time jump, 5.6 s
**Our upgrade.**
- "THREE HOURS LATER" (Archivo wdth 66 / 900, cap 63 px, 740 px ink) sits over a big 24 h clock "03:12" (wdth 100 / 900, tabular, cap 180 px, 740 px ink, 69% of the frame width; lesson 26). The block is centred at y 860 and the ink spans x 170-910.
- The materials and light match A. The clock is four drums: hour tens, hour units, a 0-5 minute-tens wheel and the minute units.
- **Fast-forward (1.15-3.0 s).** The clock eases in, then spins three full hours (the minutes revolve, the hours carry 03 to 04 to 05 to 06). It arrives still moving and **stops dead with a click**: the units overshoot 0.32 of a digit and snap back, and the clock squashes and springs. The shutter is short (1/900), so every frame shows real digits rather than a grey smear.
- **One continuous GTA V shot** (v35 penthouse, in 1.4, at 1.0x with a slow push). The party at the arcades empties out and the windows turn pink while the clock runs, so the time jump is honest to the footage. The room is empty right at the click.
- **Payoff, 3.0 s:** the same state change as A (the flood to yellow metal, a key rake, a 3-frame bloom peak, a punch to 1.07, a warm bounce and a shake). The caption recoils.
- **Entrance:** the caption's glyphs slam from the lens (staggered 14 ms), then the clock digits (40 ms) with a landing squash and a small hit.
- **Exit (4.95-5.11 s):** each line collapses into its own centre line with a forward rush and motion blur, the caption first. It's cut on the zero frame; the tail is 0.5 s.

**Hero:** 3.4 s.

## Round log
- r01 self-review before the critic:
  - **A:** the day-to-time gap is now 0.30 em (it was 0.40, which read as a hole). The wipe is 0.36 s and lands on the cut; it was 0.28 s, ending mid-shot. The edge band is brighter. The expose is down to 1.18. The tail is down to 0.45 s.
  - **B:** the roll shutter is 1/900 (1/400 smeared the units into grey blobs).
- r01 verdict: v0 8 / v1 8, no defects, no hard caps (PASSED, both locked). Open nitpicks:
  - the lower white faces fade to cool grey;
  - "LOS SANTOS" is thin and wide-tracked;
  - a dark inner-wall arc shows in the 6 and 0 counters;
  - the v0 light-front peak lasts about 2 frames.
