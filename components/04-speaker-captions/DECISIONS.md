# 04 Speaker captions: decisions

## Variant A (16:9 RP dialogue, 1920x1080)

**Evidence.**
- yt-232CmcU0wKg t00004 (10.6M): per-speaker coloured dialogue bar, bottom (y 85-96%), with a round avatar circle (26% of frame height) overlapping its left end: thick ring in the speaker colour, white outer rim, the character's head inside. Glossy two-tone fill (light top half, darker below). Colour and avatar swap instantly per speaker.
- yt-aIKdwI6GA7w t00028/t00032/t01098 (3.6M): no box, heavy rounded caps in the speaker's colour (blue dispatch, yellow, pink...) with a thick dark outline, bottom-centre y 80-94%, cap height 6-7%. Radio lines get a static tear.
- yt-CKq35NK70h0 t00044, yt-c-I-jXpGuOk t00490: plain outlined bottom-centre lines, line by line.
- Motion in all of them: hard cuts line by line, no designed transition.

**Our upgrade.**
- **Type.** Inter 900 caps at 84 px (cap 61 px, 5.7% of frame), two rows at cap-centre y 846 / 934, left-aligned at the line start; the group (badge + gap + rows) is centred. Each word is a bevelled block: 5 px ink edge wrapping face and extrusion, a 7 px extrusion graded in the speaker's own dark shade, a 1.4 px rim, a glossy two-tone face (light top half, a fast turn at 50% cap height, saturated body darkening into the baseline: the evidence bar's gloss, applied to the letters), an SVG bevel (white highlight on every upward edge, dark seam on downward edges) and a two-layer contact shadow.
- **Badge = real 3D medallion (Three.js, `media/coin3d.js`).** Polished steel squircle rim, raised clearcoat enamel ring in the speaker colour on each face, a recessed portrait disc under a reflection-only glass dome, 20 px real edge. PMREM studio env, key + hemisphere, ACES. Portraits are sharp front-lit crops from the v06 trailer shot (Lamar, Franklin; neutral mouths); Dispatch is our own drawn radio. A 2-layer ink edge + drop shadow on the canvas.
- **State change = the flip.** On every speaker change the medallion flips 180° on its real edge (back.out 1.5, 0.62 s, lift + forward tilt), travelling to the new line start while the plate folds into it and springs back out with the new name and colour. The key light rakes across the bevels after each landing. Old line rises out through its mask (0.17 s, power3.in), new line rises in word by word (back.out 1.6 overshoot, 9 px vertical motion blur). No cross-dissolves.
- **Dispatch line** lands with a 5-frame horizontal tear and a 5 px / 0.18 s RGB split (the evidence's radio treatment).
- **Payoff (4.35 s).** Lamar's reply lands on the cut to the v06 two-shot: flip + plate + rake, a small punch (amp 5, flash 0), `Look.expose` 1.06 on the plate, and one wide 116° screen-blended specular band across the line at 4.85.

**Shots.** v52 police bridge (0-2.25, media 0.35) under Dispatch; v03 Franklin gesturing (2.25-3.45) and v52 again (3.45-4.35, media 2.6) under Franklin; v06 Franklin+Lamar (4.35-5.95) and v05 (5.95-6.9) under Lamar. All 1.0x, in-points inside shot lengths.

**Hero:** 5.7 s (settled payoff over v06).

## Variant B (9:16 Shorts dialogue, 1080x1920)

**Evidence.** Same family, Shorts placement: lower-middle captions (yt-Mg6KF1jwwC4, yt-ruZbW4MphOk at 62-78% from top), big heavy caps, line by line. The brief adds the badge pop per speaker change and the active-word highlight.

**Our upgrade.**
- **Type.** Archivo 72% width, 900, 118 px caps (cap 84 px), two rows at cap-centre y 1262 / 1382, centred on the safe-zone centre x 504. Same bevelled block build: 6 px ink edge, 9 px extrusion, gloss face, bevel, contact shadow.
- **Active word.** Words sit in glossy white; the spoken word lights up in the speaker colour behind a hot light front (clip wipe 0.14 s expo.out, with a blurred hot band) and springs up (scale 1.1, -6 px, back.out 3), then hands off to the next word (wipe out to the right, settle). The last word of a line stays lit.
- **Badges.** One 3D medallion per speaker on their own side (Lamar left, Franklin right, inside x 72-936), R 112. Each pops in on its edge (back.out 2.3 scale, a 180° spin that shows the real rim) when its speaker starts, and spins shut into its centre when the other speaker takes over. The name plate springs out from behind it.
- **Payoff (4.12 s, "...YOURS,").** Lands bigger (scale 1.24) and stays lit, the badge bounces and the key rakes it, one specular sweep crosses the word, a small punch (amp 9, flash 0) and `Look.expose` 1.07 on the lowrider shot.

**Shots.** v05 Lamar (0-1.28), v06 Franklin listening (1.28-2.46, media 0.35), v03 Franklin gesturing (2.46-3.68), v39 lowriders bouncing (3.68-4.86: the payoff), v24 sunset (4.86-6.55). All 1.0x.

**Hero:** 5.75 s.

## Round log
- r01: first build (above). Self-review fixes before capture: a double `px` unit put every row at y 0; masks enlarged in B so the 1.24 payoff word and its comma are not clipped; badge and plate enlarged for phone size (A R 100 / plate 31 px; B R 112 / plate 40 px).
- r02, from the r01 verdict (7/7, 2 defects).
  - **[defect] clipped shadow boxes.** Row masks are now `clip-path: inset(0 -420px 0 -420px)` (only the travel edges clip; shadows spill sideways freely), bottom pad 0.8em so a settled word's 26 px shadow never meets the edge, and words travel 200% / -205% and are `visibility:hidden` outside their windows, so an exited word's shadow tail can't streak along the row top (that was the y~782 streak in bg:none).
  - **[defect][B] 1-frame freeze.** Every in-point + duration now stops at least 1 frame before the shot's last frame (v05-v 1.233 of 1.3, etc.).
  - **[A] the payoff is built.** Lamar's punchline lands white-hot and from 4.72 ignites word by word (2 frames apart) into his yellow: a feathered hot light front wipes the colour in, a screen bloom over the face attacks in 2 frames, holds 3, settles to a glint; the medallion squashes 1 -> 1.12 -> 0.96 -> 1 with a forward tilt and a key-light rake; impact amp 8 (flash 0); one 112deg specular band (0.4 peak) crosses the line after the last word. The frame-wide expose is gone: the light is on the words.
  - **[A] sync.** Outgoing words now clear 0.16 s before the line start and the flip begins at -0.22, so the new face turns past edge-on only after the old line is gone.
  - **[A/B] material.** A 1 px lit lip tops every extrusion (the side now reads as a lit solid, not a stacked shadow).
  - **[B] karaoke** is a discrete per-word state: colour snaps in over 2 frames (opacity of the colour set, no mid-glyph wipe), scale 1 -> 1.10 -> 1 (back.out 3), one active word. The payoff word keeps the light-front ignition, springs to 1.24, blooms (2-frame attack, 3-frame hold) and takes the specular sweep; the frame expose is removed.
  - **[B] timing and shots.** Franklin's line holds to 4.28 (settled ~1.3 s); Lamar's reply lands at 4.7 with "...YOURS," on the lowrider's hydraulic hop (4.86); a Lamar reaction cut (v06-h framed on Lamar, 3.65-4.23); the hold ends on the bright v44 bridge skyline instead of the dark v24 silhouette. Runtime 7.0 s.
  - **[B] badge anchoring.** Each pop places the badge just inside its line's text-block edge (clamped to x 72-936), not at the frame edge.
- r02 verdict: 8/8, no defects, both variants locked (sticky PASSED). Open nitpicks: leading 88 on 84 px lets the comma in 'RELAX,' touch the D below; rows cross for 2-3 frames on exit; the coin's enamel ring reads plastic; B handoffs leave a badge alone for about 0.3 s twice.
