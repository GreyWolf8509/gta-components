# 40 Footage card: decisions

## Variant A: Inset card (16:9, 1920x1080, 30 fps, 6.1 s)

**Evidence.**
- The job: a reference clip or photo dropped over the creator's own footage, in a bordered card, with a credit line
  (title + year). yt-mCDH5KnBx9o t00656: a thin white-bordered inset at ~88% width with a soft drop shadow over a
  blurred, darkened copy of the footage; its t00104 variant is tilted in 3D perspective (x 3-60%) and swings in.
- yt-o4nNjj44d4M t00072: a rounded inset with a glowing pink border and a credit pill on the bottom edge
  ("CJ - GTA: SAN ANDREAS (2004)"), pops in with a slight scale and holds.
- yt-3nVF2EY_iHg t00072 / t00523, yt-mCDH5KnBx9o t00688: 37-80% wide insets, square corners, hard cut or pop, held 2-4 s.
- yt-5-QjENpFb98 t00000 (Short): a near-square film band full width across the middle, credit bottom-left "( 1928 )".
- Rough parts: hairline 2 px borders, default drop shadows, no light, linear slides, tiny default-font credits.

**Our upgrade.** The same white-bordered card, built as a physical object:
- The bezel is real Three.js geometry: an extruded white porcelain-lacquer frame (26 px border, 20 px thick, rounded
  6 px bevels, clearcoat, PMREM studio env, key + hemisphere, ACES). A white-to-cool-grey ramp under the clearcoat so it
  is never one flat fill. A recessed graphite lip (6 px) seats the picture 12 px below the bezel face.
- A perspective camera (2400 px) so the tilt is true 3D: the side walls show and light slides across the bevels as it
  turns. The picture and the tag type are DOM layers mapped onto the projected 3D faces with a homography (matrix3d),
  so they stay sharp and exactly pinned.
- A contact + soft shadow on the card's back plane, outside the outline only (the bg:none window stays clean).
- The credit tag is a hinged black-lacquer plate on the bezel's bottom-left edge with a raised yellow lamp chip (our own
  play glyph) and the credit "LOS SANTOS - GTA V (2013)" in Inter 800 / 600.
- Plate render: the gameplay racks out of focus and dims under the card (blur 9 px, brightness .7, contrast 1.12,
  saturation 1.0, lesson 17), then racks back on the exit.

**Shots.** Background: v58 gp Franklin at the window (one 6.1 s hold, slow push). In the card (-h at 0.6x, sharp):
v44 bridge skyline (0.30-2.00) -> v36 hills city view (2.00-3.90) -> v37 tower looking up (3.90-5.80).

**Motion.**
- 0.30 the card slides in from the right at a tilt (rotY -42 deg, rotZ 7 deg, z -260, blur 12 px), swings to face
  the camera on a spring with overshoot (rotY +4 deg), lands ~1.05; a soft specular band crosses the bezel as it turns.
- Hold: a resting 3D drift (rotY -1 -> -3.5 deg, rotX 1.2 -> -0.8 deg) so the bevel light keeps moving.
- 5.30 exit: it swings out to the left (rotY +38 deg, z -200) with blur, the tag lagging; cut on the zero frame.

**Payoff, 1.32 s (the tag slap).** The tag, held out flat toward the camera, is released when the card lands: it falls
on its hinge under gravity (0.2 s), slaps onto the bezel, bounces twice (-11 deg, -1.3 deg) and locks. On the slap the
card takes the knock (rotX kick + 4 px dip, spring back), the yellow lamp chip switches on (1-frame attack, 3-frame
peak, settles hot, glow spill on the tag), and a specular rake runs along the tag and the bezel's bottom edge.

## Variant B: Inset for Shorts (9:16, 1080x1920, 30 fps, 6.1 s)

**Evidence.** yt-5-QjENpFb98 t00000: the reference is a near-square band across the middle (~58% of height, full
width), the credit small at its bottom-left, over a dark blurred fill.

**Our upgrade.** The same object as A, sized for the Shorts safe area: a square 796 x 796 window (848 px frame, 79%
of width), centred on the safe area's axis (x 504) at y ~800 so the right 150 px of platform buttons stay clear; the
tag hangs to y ~1290 (inside 1480). The card picture is -h footage cropped square at 0.74x (sharp, lesson 12/21);
the background is v58 -v, blurred and dimmed under the card.

**Shots / motion / payoff.** As A, same timings, so the two read as one pack.

## Round log
- r01: first build. Self-review fixes before the critic:
  - the card hides with parent opacity, not visibility (the framework's own video visibility overrode a hidden
    parent and showed one unpinned picture frame at 0.30), and its transforms are always set;
  - the slap rake is narrower (34 px), faster (0.4 s) and mostly on the tag's bevels (face factor 0.1), because the
    first pass washed "(2013)" milky;
  - hero 1.9 s (settled tag, lamp still hot, after the rake).
- r01 verdict: v0 7 / v1 7, no defects. Right component; craft did not read at viewing size: frontal flat white
  border at rest, a 1.5 deg slap nobody sees, payoff read as "a colour filter switching on", 0.7 s faded pre-state,
  v1 credit ~13 px at phone size, tag half-transparent on the exit.
- r02 (both variants):
  - held 3D pose: the card rests at ry 8 / rx 3 / rz -1.2 deg (B: 6 / 2.5 / -1) and drifts 2 deg through the hold,
    so the bezel's side wall, bevels and specular show; the bed counter-pulls 1.10 -> 1.05 for parallax;
  - the payoff lands on the object: on the slap (1.15 s) the card pops toward camera (z +85 px = 3.5%, B +60 px) in
    2 frames and springs back, tips 5 deg, and a hot specular band sweeps the bezel left -> right in 0.3 s, at full
    strength from the colour-on frame; the lamp chip and the picture's exposure pop land on the same frame;
  - bolder bezel: 34 px with 10 px bevels (B 30 / 9), a cooler, darker ramp (#E8EBEF -> #A6ADB9) so the bevels and the
    sweep read; deeper contact shadow (0 30 60 / .55);
  - shorter, lighter pre-state: the tag releases at 0.95 (slap 1.15) and the standby grade is .9 / .72;
  - A tag 44 px in a 96 px plate; B tag is two lines, "LOS SANTOS" 54 px over "GTA V (2013)" 36 px, in a 128 px plate
    with an 82 px lamp chip (~18 px at 360x640); B window 768 so the punch stays inside x 72-936;
  - exit: the tag rides with the card (no lag, no foreshortened half-alpha look), blur capped at 8 px.

- r02 verdict: v0 8 / v1 8, no defects or hard caps: PASSED (both locked). Open nitpicks: the bezel is matte through the hold,
  the lamp lights while the clip is already playing, the entrance blur is isotropic, there is a 1-frame pale flare on the tag
  at ~1.08 s, and the v1 meta line is ~12 px at phone size.
