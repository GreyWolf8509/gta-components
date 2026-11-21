# 30 Price tag: decisions

## Variant A: Pinned price (16:9)

**Evidence.**
- `yt-5zKoq7EabvQ t00012` (7.4M views) is a centred price pill under the item at x 39–60%, y 68–80%, about 20% of frame width.
- The pill is a grey translucent fill with a glowing mint outline (#5DFFA0, about 3 px, soft outer glow) and white heavy condensed figures with a dark drop shadow.
- It is cut in per item: the neighbouring frame t00016 shows the same pill on a different item ($50).
- It is a flat, static 2D pill with a default glow.

**Our upgrade.** The same pill, made into a physical hang tag pinned to the car.
- **Body:** real Three.js geometry, a 372×140 px stadium pill with a top tab, 20 px thick, with a rounded bevel.
- **Face:** smoked graphite acrylic (3-stop gradient, clearcoat reflecting a studio env map).
- **Edge:** mint edge-lit acrylic sides and bevel. This is the evidence's glowing mint outline, made a material.
- **Hardware:** a chrome grommet on both faces, and a cotton cord looped through it (one strand in front, one behind) to a chrome pin on the car.
- **Figures:** white heavy condensed Archivo (wdth 74, traced outlines), printed with a dark drop shadow inside a soft recessed odometer window.
- **Physics:** a damped pendulum swing and torsional twist, precomputed. The swing is driven by the tracked anchor's acceleration, so the tag reacts when the car swerves.
  - **Entrance:** the tag unfurls out of the pin, and the cord snaps taut with a bounce.
- **Motion blur:** sub-frame accumulation on fast travel.
- **Light:** the key light matches each shot (daylight, then sunset).
- **Placement:** pinned to the tracked boot of the gameplay car, hanging under the car at evidence scale (about 19% of frame width). After the cut it hangs from the windscreen header of the red car close-up.

**Shots and cuts.**
- `v57` gameplay chase-cam red car, 0–2.03.
- Cut to `v31` red car at sunset (sharp), 2.03–3.77.
- `v17` tail, 3.77–4.1.
- Anchors are tracked with OpenCV template matching. The tracked points are in CONFIG.

**Payoff, 2.03 s (on the cut).** The figures roll from 0.16 s and land left to right (2, then 6, then 3). The last figure locks on the cut. Then:
- a neon ignition runs round the mint rim from the tab to the bottom (0.32 s, with a hot head);
- the figures flash;
- the tag gets a kick (swing and twist);
- a soft specular band crosses the clearcoat.

The rim then holds lit.

**Exit, 3.42 s.** The cord snaps, the tag drops out with a spin and motion blur, and the pin collapses. The tag is gone before the tail cut.

**Hero:** 2.75 s.

## Variant B: Giant tier (9:16)

**Evidence.**
- `yt-sGVjaj2zYYU t01383` (5.0M views) has "$1,000,000,000" top-left, about 13% of frame height, spanning about 42% of the width.
- It is a heavy rounded-bold sans in red #F01C1C (green for the cheap tier), with a thin dark outline and a soft shadow, and no box.
- It holds over the tier segment.

**Our upgrade.** The same giant number across the top hook zone (ink 816 px wide, centred at x 504, y 352).
- **Figures:** real extruded, bevelled glyphs traced from Archivo (wdth 64, wght 900).
- **Drums:** each digit is a physical drum (10 figures round a wheel turning about x), clipped to the label band so rolling figures never cross other type. The figures roll in with true curvature, and accumulation gives a real spin blur.
- **Landing:** the drums land left to right with a detent wobble.
- **Lock (state change):** the last figure lands on the cut to the bright sky. Then:
  - a feathered light front runs left to right, turning white enamel into candy red (the evidence's billion-tier red);
  - a hot band, a raking key and a 3-frame bloom peak follow;
  - the label punches (+5.5%), and the footage gets a small shake (flash 0).
- **Finish:** the caption vernacular is kept in post, with a 6 px ink outline and a soft drop shadow.
- **Hold:** a slow living turn, with two specular sweeps.

**Shots and cuts.**
- `v11` superyacht, 0–2.13.
- `v36` hills/city view, 2.13–4.07. Bright sky behind the red payoff.
- `v44` bridge skyline, 4.07–5.7.

**Payoff:** 2.13 s in r1, moved to 1.23 s in r2.

**Exit, 5.0 s.** Every drum rolls on to its blank slot, and "$" and the commas collapse. Everything is gone by 5.45 s.

**Hero:** 2.75 s.

## Round log
- **r1:** first build. Critic: 7/7, with a white frame at the second cut on both variants.
- **r2: both variants.** Each incoming shot now starts 2 frames early under the outgoing one, with an ink backdrop on the plate.
- **r2: A, face.**
  - The face is now glass: a diagonal sheen and a lit inner lip (#A9B3BA, 55%).
  - The clearcoat specular band at the lock is stronger (0.45).
  - The figures get a neutral base emission, so the sunset key no longer tints them beige.
- **r2: A, cord and pin.** The cord is now 5.8 px (it was 3.4), the pin head is a 16 px brass ball, and the contact shadow is stronger (0.5, offset 12/22).
- **r2: A, exit.** The tag now clears before 3.70, and the tail cut is at 3.70.
- **r2: B, timing.** The lock moves from 2.13 s to 1.23 s (turns 1, land gap 0.06), so the tier reads by about 1.2 s. The shots are re-cut: v11 0–1.23, v36 1.17–3.10, v44 3.03–4.77.
- **r2: B, slot rails.** Two thin dark glossy rails frame the drum band while the drums roll, so the clipped figures read as a mechanism. They part and fold away on the lock, as part of the state change.
- **r2: B, glyph fixes.**
  - The visible drum arc is limited to 0.62 rad, which removes the stray off-band specks (the faint ring marks).
  - The bar of the "$" is now its own part, set behind the S, so the bevel no longer draws inside the S.
- **r2 verdict:** v0 7 / v1 8. v1 is now locked, and b/ is untouched from here on.
- **r3: A only, payoff light.**
  - The figure flash goes from 0.9 to 0.32, with a 3-frame peak and a fast decay.
  - The bloom peak goes from 0.9 to 0.5, and the rim peak from 4.2 to 3.0.
  - The specular band is now 30 px, clipped to the face and kept off the figures, from 2.20 to 2.50.
  - Result: "$263" stays legible on every payoff frame.
- **r3: A only, build.** The rim now glows at about 40% neon from the entrance (base 1.1), so the lock is a 40%→100% ignition and the tag no longer reads as grey plastic on gameplay.
- **r3: A only, hold and exit.** The exit moves from 3.34 to 3.42, which gives a clean lit hold of about 1.3 s. The drop is faster and clears by the 3.70 cut.
- **r3: A only, cord.** On the close-up the cord is 86 px, so the tag visibly hangs from the pin.

