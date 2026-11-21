# 67 Feature steps: decisions

Overlay kind: both variants render clean on `bg:none`. Shared physical layer: `media/steps3d.js` (identical copy in `a/media` and
`b/media`), Three.js r160 rendered from timeline time (Look.drive + hf-seek, no rAF). Word outlines: `media/glyphs.js` (Archivo 900,
wdth 66 for the words and wdth 100 for the coin's "$", OFL, traced with fontkit by `media/gen-glyphs.js`).

Distinct from the siblings: 33 ticks goals (green ring + tick), 35 is the big "#5" list number, 37 is a 15-tile clip grid with a
counter. This one is a **process**: three icon tiles joined by arrows, lit one at a time as the narrator covers each step, ending on
the result step.

## Evidence (both variants)
- `yt-o4nNjj44d4M` t00551 (3.8M views, "crazy new features"): three rounded tiles (~18% of frame width, about 340x230 at 1920), deep
  purple fill (#3A1458), a pink glowing border, a white line icon (steering wheel, seat, pistol) over a bold white caps label
  (AI DRIVES / PASSENGER / LEAN OUT). Thin pink arrows join them. A row across the top of the frame (y 17-38%) over gameplay.
- t00064 (same video): the same pink-bordered tiles holding small clips, each with a pink pill caption under it
  ("• WORK OUT = MUSCLE"), a row across the middle.
- Motion: tiles pop in left to right in sequence; the evidence has no lighting state, no depth, flat 2 px borders, default type.
- Vernacular: **a row of 3 glowing purple tiles, icon + caps label / pink pill, pink arrows between, read left to right.**

## Shared upgrade (DESIGN 24: real geometry on the hero)
- **Tiles are real slabs:** a rounded-rect extrusion in purple candy clearcoat (bevel catches a PMREM studio with pink / violet
  strips and a warm top softbox), a face shader (purple vertical gradient, recessed inner shadow under the bevel, glass highlight,
  neon spill), a **real neon tube** (TubeGeometry) along the front edge with a white-hot core, an additive halo and a soft contact
  shadow.
- **Icons are real 3D objects** in white clear-coat enamel: a steering wheel (torus rim, capsule spokes, hub), a GTA-style wanted
  star (extruded, rounded bevel), and the result step's **gold coin** (lathed rim + recessed face, embossed Archivo "$", polished gold).
- **Arrows are neon tubes** (shaft + head strokes, round caps), unlit dark glass until charged.
- **State per step:** pending (unlit neon glass, dim lavender icon) -> current (the neon *draws itself* round the rim from the top-left
  with a hot head, flickers on, the face fills with pink light, the icon pops forward and turns: the wheel steers, the star spins on
  its axis, the tile lifts toward camera) -> done (rim and glow drop to 55%, the tile settles back). Before each step the arrow
  charges: a hot light front runs down the shaft into the head.
- **Payoff = the result step, on a cut:** the last tile ignites **gold** instead of pink (2-frame white-hot rim, gold halo with a
  3-frame peak), punches (+8% in 2 frames, damped), the gold coin flies in from the lens spinning 1.5 turns and lands face-on with a
  squash, and a warm rake light crosses coin and bevel. Follow-through 0.5 s later: a specular band runs across all three faces left
  to right, the arrows pulse and the done tiles relight to full (the chain is complete). Small plate shake only (flash 0), light is
  local to the tiles (DESIGN 22).
- **Exit:** labels roll back into their windows, then each slab tips back edge-on (its real thickness shows) and collapses into its
  centre with motion blur, left to right; hidden on the zero frame.
- Motion blur: fast moves render as shutter sub-frames averaged in a half-float target.

## Variant A: Tile row (16:9, 1920x1080, 6.5 s)
- **Layout = t00551:** 3 tiles 380x300 (20% of width, bigger than the evidence), centres x 440 / 960 / 1480, y 300 (tiles y 150-450).
  The outer tiles yaw 8 degrees toward the centre (a shallow arc that shows their side walls). Neon arrows (100 px) in the gaps.
- **Caption pills (t00064) under each tile:** DOM, Archivo 900 wdth 72 at 46 px caps with a white dot, pink candy (3-stop gradient,
  inner top highlight, inner bottom shade, keyline, glow, contact shadow). Each pill springs open from its centre as its step lights
  (clip-path + back.out scale), its label rising in an overflow window. The result step's pill is gold.
- **Shots** (1.0x, cut like an edit, 2-frame underlap): v17 Deluxo (0-1.2) -> v31 red car (1.2-2.35, step 2 lights on the cut) ->
  v52 police bridge (2.35-3.75) -> v11 yacht (3.75-5.45, the payoff cut) -> v36 hills over the city (5.45-6.5, the exit plays on it).
- **Steps:** STEAL A CAR (0.95) -> LOSE THE COPS (2.35) -> CASH OUT (3.75, payoff). Hero 4.5 s.

## Variant B: Step stack (9:16, 1080x1920, 6.5 s), phone-first (DESIGN 26)
- **Layout:** the same tiles as three wide slabs stacked down the frame, each **744x300 = 69% of the width**, centred on the
  Shorts safe centre x 504 (x 132-876), centres y 450 / 820 / 1190 (stack y 300-1340, clear of the caption and button zones).
- On each slab: the 3D icon at the left (190 px) and the step word as **extruded, bevelled Archivo 900 glyphs at ~124 px**
  (cap 86 px) with a sub-line under it (Inter 800 38 px on the slab face). Pending words are dim lavender enamel, lit words white;
  the result word CASH OUT turns **gold behind a hot light front** on the payoff cut.
- Neon arrows run down from slab to slab at the icon column, in front of the slabs.
- Same shots in -v crops; the payoff lands on the wide yacht (lesson 21), end on the beach aerial. Hero 4.6 s.

## Round log
- r01: first build. Self-review fixes before the critic: tighter halos (they fogged the footage as rectangles), a rounder deeper
  star bevel, 14 shutter sub-frames (8 banded on the entrance), shorter entrance travel, A's pill text hidden until it rises (it
  showed, jumped and rose again), A ends on v36 so the exit plays on one shot. Critic: v0 8 (LOCKED), v1 7: wide button plates
  without the creators' pills read as a game menu, grey-ivory type, beige gold, see-through entrance frames.
- r02 (B only; A is locked and untouched, B has its own copy of the module):
  - **Caption pills restored (the evidence vernacular):** each slab carries a candy pink 3D capsule hung over its bottom edge
    ("• A FAST CAR", "• LOSE THE COPS"), Archivo 900 condensed 44 px with a white dot, glass band, halo and a sheen; the result
    step's pill is gold with dark type. Pills spring open from their centre as the step lights, the label rolls up inside
    (masked), and on the exit the label rolls out as the pill closes. The sub-line on the face is gone, so the slab is
    270 px tall with the word centred (stack y 295-1380).
  - **White enamel** (#FFFFFF clear-coat, own exposure 1.18) for icons and words, a soft front env card so front faces read
    white, and a pink rim light from behind-left on the bevels.
  - **Metal gold:** coin and CASH OUT are metalness 1, roughness 0.18, a 3-stop #E59A1C > #F6C453 > #FFE08A gradient; a radial
    gold bloom behind the coin peaks for 3 frames as it lands face-on. The coin's lathe faces pointed inward (only its back
    half drew, and it vanished when the squash pushed it back): fixed, it is now a solid coin with a raised rim.
  - **Entrance:** shutter sub-frames never sample a slab before it exists, so no see-through first frames.
  - Critic: v0 8 / v1 8, no defects: PASSED (sticky). Nitpicks left: square-ish pill exits with a 1-frame label above the pill, dull unlit icons, matte white icons, pink haze on the bright yacht (A), CASH OUT tight to its border and a soft yacht -v plate (B).
