# 47 Selection wheel: decisions

## Round 1

### Variant A (16:9, 1920x1080): Character wheel

**Evidence.**
- `yt-c-I-jXpGuOk` t00088 (8.1M views): the GTA V switch wheel rebuilt as a held overlay on the right of frame (centre x ~80%, ~27% of frame width). A circle cut into four quadrant slices (green top, orange right, teal bottom, grey-blue left), each holding a cropped head. Thin dark rim, flat fills, no text, over a dark blurred plate.
- `yt-o4nNjj44d4M` t00539 (3.8M): the same switch wheel as a centred disc (~55% of frame height) with round portraits on the rim, a centre label and a red X strike for a blocked slot; it pops in over gameplay and the X strikes on.
- `yt-o4nNjj44d4M` t00092-t00100 and `yt-zvdxphGS07o` t01249: the selection glow moves from slot to slot while the centre content changes; the plate behind is heavily blurred, the way the game blurs and desaturates while a wheel is open.
- Their version is flat: single fills, no light, no lift, no state change beyond "this slot is lit".

**Our upgrade.**
- Faithful object: four 90-degree slices with a constant 10 px gap (parallel-offset edges, not a rotated rectangle), an inner hub, Franklin top / Trevor right / Lamar bottom / Michael left, coloured in the GTA V HUD character colours (Michael `#65B4D4`, Franklin `#ABEDAB`, Trevor `#FFA357`; Lamar in Vice purple `#B48CFF` so no two neighbours read as the same blue).
- Material: smoked-glass base disc (backdrop blur + a 3-stop radial ink gradient), a bezel band with 72 hairline ticks and 4 white index ticks, every slice outlined by a 1.5 px white inner rule; a top-left gloss and a lit crescent on the rim; each slice floats on its own drop shadow; portraits sit in a radial mask so the face melts into the slice colour, which intensifies toward the rim.
- State: unselected slices are colour-washed and dimmed (portrait brightness .62, saturation .45); the highlighted slice lifts to scale 1.035 with a 1-frame light tick, its colour fills toward the rim, its rule turns full white. The selector is a three-layer arc (blurred glow, colour core, white hot core) on the bezel that snaps 90 degrees per tick with `back.out` overshoot; the hub pointer follows it with a 1-frame lag (follow-through).
- Payoff: a hold-to-confirm ring fills around the hub (press), then the lock-in: the picked slice springs to 1.07 and steps 10 px out, full colour, a specular band sweeps across it, a coloured bloom and a light ring burst off the rim, the name underline extends; the other three slices drop further.
- Exit: the other slices and the base collapse into the picked slice, the picked slice shrinks to its own centre, and on that frame the footage snaps back sharp and in full colour on a cut to the new character, with an exposure pulse (`Look.expose`) and a small punch (`impact`, flash 0).
- Label: Barlow Condensed HUD name under the wheel, rolling slot-machine style on every tick, with a colour underline.

**Shots and cut points.** `v54-gp-trevor-walk` 0-3.25 s: despite its name this is gameplay of *Franklin* in a lumber-yard firefight (his HUD shows the Michael/Trevor switch icons), so Franklin is the current character; the plate blurs and desaturates from 0.2 s while the wheel is open. The selector ticks anticlockwise Franklin -> Michael -> Lamar -> Trevor and locks Trevor. Cut at 3.25 s to `v08-trevor-rifle` (Trevor, explosion, bright) then `v34-rocket-heli` at 4.2 s to 5.0 s: the switch has happened.

**Payoff beat.** Lock-in at 2.12 s (hero 2.3 s); the collapse-and-snap at 2.93-3.25 s finishes it.

### Variant B (9:16, 1080x1920): Radio wheel

**Evidence.**
- `yt-o4nNjj44d4M` t00092-t00104: a recreated radio wheel centred on a heavily blurred plate, ~55% of frame height: a dark purple disc with a pink neon rim, station logo badges in circles around the ring, a centre circle with an icon, the bold white station/category label and a small sub-line. The selected badge gets a pink neon halo; the halo moves around the ring while the centre label changes.
- A "now playing" card (rounded dark-purple rectangle, pink border, equaliser) appears on the same video (t00088).
- Rough edges: flat purple, a single glow, small type, no movement physics, the card is unrelated to the wheel.

**Our upgrade.**
- Sized for a Short: wheel diameter 760 px (88% of the 864 px safe width), centred at (540, 790); 8 station tokens on a 272 px radius, 148 px each, every one a designed badge of our own (Palms FM, Soul Cruise, 808 Block, Static Talk, Desert Rock, Night Drive FM, Bahia 98, Deep End) with a bevel, inner shadow and drop shadow.
- Material: smoked purple glass disc with a neon tube rim (pink tube + white-hot core line + outer bloom) and a second hairline track; the hub is a lighter glass lens with its own neon ring.
- Selector: a halo + neon ring + rim arc group that rotates around the wheel centre, so the light physically travels from badge to badge; it ticks through 5 stations with decelerating intervals, each tick a 45-degree snap with overshoot, the landing badge scales 1.12 and the hub label (Barlow Condensed) swaps per tick.
- Payoff: lock-in at 2.3 s: the badge springs to 1.24, its ring flashes white-hot, a light ring bursts off it, a comet of light runs once round the neon rim, the hub equaliser starts moving. Then the NOW PLAYING strip slides out from behind the wheel (it starts tucked under the disc) with a spring: mini badge, kicker, track name, artist, live equaliser and a progress line.
- Exit: the badges retract into the hub, the disc collapses, the plate snaps back to colour on the same shot (the game does not cut), with an exposure pulse; the strip stays as the "now playing" read, then leaves with a blur exit.

**Shots and cut points.** `v52-gp-police-bridge` (gameplay chase, bright) 0-4.7 s, blurred and desaturated from 0.3 s, snapping back at 4.45 s (collapse 4.1-4.43 s); cut to `v31-red-car-sunset` (Franklin driving at sunset) 4.7-6.4 s.

**Payoff beat.** Lock-in at 2.3 s, strip landed by ~2.9 s (hero 3.3 s).

### Round 1 self-review fixes (before hand-in)
- A: the locked slice's glow was clipped flat by the slice layer's filter box; slice layers are now 820 px so the bloom has room. Bezel ticks moved under the slices (they were drawn over the locked slice). The selector arc now travels out with the locked slice so it stays on its rim. Unselected slices lightened (portrait brightness .7 / .54 after lock, softer colour wash) so faces never go muddy; portraits use a tighter radial mask so trailer backgrounds melt into the slice colour.
- A: story corrected to the footage (Franklin is the one playing in `v54`), so the cut lands on Trevor footage.
- A/B: collapse retimed so every piece is gone before the snap frame (no ghost wheel over the sharp plate); entrances lead with the slices/badges instead of an empty disc.
- B: station marks re-laid so no text touches the badge edge (Palms, Static Talk) and the Desert Rock sun no longer sits under the word.
- Check: the slot-roll name column (A) is marked as intentional overflow/occlusion; the station-logo art (B) is marked `data-layout-ignore` (set dressing, not copy). All faces are loaded explicitly before the timeline is built.
- A: Michael's trailer still (hazy sunset) is graded up slightly in the crop (contrast/gamma) so his slice matches the others; dropped slices sit at brightness .6.
- Hero times for round 1: A 2.3 s (locked Trevor slice, bloom, hold ring full), B 3.4 s (locked Night Drive FM + NOW PLAYING strip landed).

## Round 2

Verdict r01: v0 7, v1 7 (objects right, content inside not premium yet). Every fix and both defects are worked below, plus DESIGN §11 lessons 13-20.

### Variant A: Character wheel
- **Faces (lesson 16).** All four portraits are rebuilt as natural-skin cutouts: macOS Vision foreground masks on full-res shot-library stills, cropped tight, scaled to 600x600 with a light unsharp mask. Michael is front-lit 3/4 from `v22` (replacing the backlit profile), Franklin and Lamar come from `v06` with closed mouths, and Trevor is from `v33`. There is no colour wash on any face. The slice colour lives in a radial behind the head (alpha 1 at the centre, .55 at 70% r, .3 at the edge). Every head is normalised to 150 px through `face: [x, y, h]`, so all four read at the same size. Dim state: brightness .78, saturate .9. Locked state is capped at brightness 1.08, so Trevor no longer goes milky. A 12 px rim bloom in the pick colour (`#FFA357`) replaces the brightness push.
- **Chrome back to the game's geometry.** The 72-hairline bezel is gone. In its place: one 2 px white outer rule that draws on at open, plus 4 white index ticks. The hub is a 56 px ink disc with a 2 px white ring and a small notch that turns to the selected slice (back.out(1.6), 0.18 s, one frame behind the selector). The notch takes the pick colour at lock. The dot and play-triangle are gone, and so is the hold ring. The inner radius drops to 52 px, so the slices sit closer to the hub.
- **Lock-in.** Press: the pick and the selector sink to .985, and the hub and notch to .86. Then a spring to 1.07 with back.out(3.4), a 30 px to 12 px rim bloom, one subtler specular sweep (peak .34), a pulse off the rule, and the underline extends.
- **Exit (lesson 14).** The label rolls up out of its masked windows; there is no fade. The selector arc draws off into its own centre. The three dropped slices scale into the hub (0.22 s power3.in, 6 px blur along their axis) along with the base disc, rule, ticks and hub. All of them are cut on the frame they land. The Trevor wedge squashes 1.07 to .92 to 0 over 0.2 s, pinned to its own centre, while its bloom swells. The plate snaps to colour and cuts to Trevor on that zero frame.
- **Shots and tail.** `v49-gp-franklin-mural` runs 0-3.35 s. It is Franklin gameplay, he is the one playing, and he stays visible left of the wheel. The cut at 3.35 s goes to `v08-trevor-rifle` (media 0.3 s, explosion behind him). The end is 3.95 s: the footage-only tail is 0.6 s, down from 1.67 s.
- **Plate (lesson 17).** blur 10, saturate .45, brightness .66, contrast 1.15.
- **Timing.** open .3, ticks 1.0/1.32/1.66, press 1.92, lock 2.02, collapse 2.95, snap 3.35, end 3.95. Hero 2.45 s.

### Variant B: Radio wheel
- **Defect: label double exposure.** The hub label is now a slot window (280x152, overflow hidden) with one block per station in tick order. Each tick rolls the column one block, 0.14 s power3.out. Old and new labels are never on screen together, and there is no opacity tween at all.
- **Defect: strip edge.** The strip is now 720 px wide at x 180-900 (it was 938).
- **Bed (lesson 17).** `v57-gp-red-car-highway` (dark road, red car, a hint of blue). When the wheel opens it drops to 0.4x, the game's wheel slow-mo. A plain `data-playback-rate` stepped at 12 fps, so the second clip is `b/media/v57-slowmo-v.mp4`: the shot from 0.3 s, stretched 2.5x with ffmpeg motion interpolation into smooth 30 fps. Grade: blur 12, saturate .45, brightness .66, contrast 1.15. The disc fill is a near-opaque radial (`#4A1670` to `#2B0E44`, alpha .95), so no grey shows through. The 64 rim hairlines are cut down to 8 detents.
- **Lock-in.** The Night Drive token presses from 1.12 to .92 (0.06 s). It springs back to 1.12 (back.out(2.2), 0.28 s) and settles at 1.06. On the spring frame it gets a 2-frame bloom on the token only, the shockwave ring, a selector ring spring, one specular sweep across the badge, the hub flash, and a comet once round the rim.
- **Badge to strip.** A copy of the badge lifts off the token (1.06 to 1.16) and flies to the strip's socket: 0.3 s, power3/power2.inOut on a slightly curved path, with an 8 px directional blur that peaks mid-flight. It seats with a squash and its ring lights. The strip then wipes open out of it: a per-frame clip-path inset from the socket, 0.25 s expo.out, with a light riding the wipe edge. Title, kicker and artist start with the wipe, so no frame shows an empty slab.
- **Exit.** The badges fold into the hub (stagger 0.015, 0.2 s power3.in, radial blur) and the selector scales in with them. The disc zooms 1 to .6 with 8 px blur over 0.16 s and is cut on the snap frame. The plate snaps back and cuts to `v31-red-car-sunset` at 4.32 s, and the strip bumps. Strip out at 5.22 s: it wipes shut into its badge, then the badge pops (1.1, then 0) and is cut. End 5.75 s.
- **Timing.** open .3, ticks 1.0/1.15/1.33/1.56/1.88, lock 2.26, fly 2.62 (lands 2.92), collapse 4.0, snap 4.32, stripOut 5.22, end 5.75. Hero 3.6 s.

### Shared
- Every SVG attribute tweened with GSAP gets its starting value in markup (lesson 18). The new tweens are the rule dash, selector dash, ring radii and stroke widths.
- No confetti or rays (lesson 19): each lock gets one specular sweep plus the ring pulse. All station marks and names are our own (lesson 20).
- The hero frames were judged at phone size (640x360 / 360x640) before capture (lesson 13).

### Round 2 self-review fixes (before hand-in)
- B: the first capture's bed used `data-playback-rate="0.4"`, which repeats every source frame 2-3 times, so the blurred road stepped at 12 fps. It is now the motion-interpolated `b/media/v57-slowmo-v.mp4`, which is smooth. The switch from 1x to slow-mo at 0.3 s is continuous.
- A/B: the entrance fades are tightened: the wheel opacity takes 2 frames and the base disc 0.12 s. The disc no longer reads translucent while it scales in.
- B: the clip-path wipe is driven per frame. A plain GSAP clip-path tween did not interpolate in the renderer, and the strip jumped from the socket stub to fully open. The kicker, title and artist start with the wipe, so the revealed strip is never empty.
- A: the selector arc is cut on the frame its draw-off ends, so its round cap does not linger as a dot. The base disc folds all the way to zero rather than stopping at .18 and popping off.
- Old round-1 JPG portraits removed from `a/media/`.
- Hero times: A 2.45 s (Trevor locked, rim bloom, notch on Trevor), B 3.6 s (Night Drive FM locked, badge seated, NOW PLAYING strip open).

## Round 3 (last pilot round)

Verdict r02: v0 7, v1 7, no hard caps. The critique: surfaces were flat fills plus a glow, and the lock-in was a thin local ring. All four defects and every fix are worked with the critic's values, plus DESIGN §11 lessons 21-24.

### Variant A: Character wheel
- **Material (critic's spec).**
  - Each slice has a 3-stop radial behind the head: centre +12% L, the HUD colour, edge ×0.62 L.
  - A 1.5 px lit inner edge (.35) on the outer arc, plus a soft 9 px band at .1. Both come from a vertical gradient, so the edge is brightest at the top of the wheel and gone by 90° round.
  - A blurred black inner stroke (28 px, stdDev 9, .55) runs along every edge. Its inner half survives the wedge clip as the gap shadow.
  - The bezel is a 16 px top-lit ring (`#4A5470` → `#1C2130` → `#0B0E16`) with a lit top lip and a dark inner seat. The 2 px white rule (draw-on) and the 4 ticks sit just outside it.
- **Lock-in light (2.02 s).** Two white-hot 40° arcs (8 px core, 16 px hot halo, 36 px glow in the pick colour) leave the pick and run both halves of the bezel ring. They meet opposite it in 0.45 s power2.inOut. One clipped specular band (115°, 110 px, 0 → .28 → 0) crosses the Trevor slice in 0.4 s power2.out, starting and ending just clear of the wedge. The thin pulse rings are gone. The rim bloom breathes once (12 → 18 → 12 px) through the hold, so the 1.43 s lock never freezes.
- **Portraits (lesson 16).** Michael and Lamar are re-cut from -h shots shown at ≤ 1.0×. The head is 145 px, so every portrait is shown at or below its source size (Trevor ≈ 0.95×).
  - Michael: `v22` t 0.3, a 3/4 view, front-lit, mouth closed.
  - Lamar: `v06` t 1.13, a near-neutral mouth.
  - Trevor: `v33` frame 16, a 3/4 view, mouth closed.
  - Franklin keeps the r2 cutout, re-matted.
  - Every matte is choked 1 px with a 0.6 px feather, so there is no halo. Unselected faces are dimmed only by brightness .72 / saturate .7, with no wash.
- **Timing (defect).** Collapse 3.45, snap 3.85, end 4.6. Trevor holds locked for 1.43 s. `v49` runs 0-3.85. `v08` starts at 3.85 with media-start 0.2 and duration 0.75, ending at 0.95 of 0.97 s. That shot is one continuous push-in with no internal cut.
- **bg:none residue (defect).** `tl.set('#label', {autoAlpha: 0})` at collapse + 0.2, after the label has rolled out of its windows.
- **Nothing ghost-fades (lesson 23).** The kicker, name and underline roll up into masked windows with no opacity. Wheel, base, slice and selector opacity reach 1 in 0.066 s; the scale spring does the arrival.
- **Snap light (lesson 22).** The landing frame (explosion, bright sky) gets a gentle expose (peak 1.16, 3-frame hold), not 1.42.

### Variant B: Radio wheel
- **The landed badge is real geometry (lesson 24).** `b/media/coin3d.js` uses Three.js r160 and is seek-safe: `renderAt(t)` draws from a pure function of t, driven by `Look.drive` plus an `hf-seek` listener.
  - Geometry: a pink-chrome lathe bead rim, 16 px thick with metalness 1, lit by a PMREM studio env. Two domed, clear-coated faces carry the station art. That art is painted into a canvas: the SVG shapes go in as an image, then the text is redrawn with canvas type in the loaded page fonts, because an SVG image cannot see page fonts.
  - Light and shadow: a key light, a magenta rake light, a hemisphere light, and a soft shadow card.
  - Takeover: the coin replaces the DOM token at the landing tick, growing into the highlight with the token's own ease. It is pressed (.92, sinks 26 px, tips away from the press) and springs (1.14 → 1.08) with a damped wobble that shows its edge. The key light sweeps across it while one object-space specular band (115°, sigma 11 px, peak .6, 0.4 s power2.out) crosses the face and rim. The first capture used a 17 px band, which read as a wash, so it was narrowed before hand-in. The rim's emissive pulses.
  - Flight and seat: it flies 0.42 s to the strip socket on an arc with one full spin, reading edge-on twice. It seats with a squash and holds a slight living tilt. The DOM `#fly` copy is gone. (r05: the wheel slot no longer shows an empty seat; see Round 5.)
- **Lock-in light (2.32 s).**
  - One 40° white-hot arc (7 px white core, 14 px hot halo, 36 px `#FF4FA3` bloom) runs the full neon rim in 0.45 s power2.inOut.
  - The tube flares as it passes: glow from .55 to 1, core from `#FF5CAE` to `#FFC2E1`.
  - `Look.expose` on `#shake` (peak 1.25, hold 2/30).
  - The milky token wash, the shockwave rings and the comet are removed. Tick flashes drop to .25.
- **Label roll (defect).** The name (72 px, 2 lines at 66 px) has its own 132 px window. The genre (28 px; frequencies dropped) has its own 34 px window. Pitch equals window height; each roll is 0.12 s power3.inOut, the genre 0.02 s behind. Each column carries its own 6 px vertical motion blur peaking mid-roll, one driver per column, so the ticks never fight. The hub is now 348 px and sits in a recess; the kicker is 24 px.
- **Disc material.** The disc has a 3-stop lacquer radial (`#6A2C9E` → `#431470` → `#1F0636`), a slow conic sheen, and a 16 px top-lit bevel inside the neon tube. The hub sits in a recess.
- **Strip.** 720×188. Title 64 px, artist line 28 px, kicker 24 px. The coin socket is 136 px. Kicker, title and artist arrive by masked rise and the dot pops with a spring, so nothing fades in.
- **End shot (lesson 21).** `v38-freeway-dusk-v`, a wide shot, plays from the snap at 4.32 s with media-start 0.2. It replaces the upscaled `v31` face close-up. The snap expose is 1.32 because the frame is dark (luma 62).
- **Timing.** open .3, ticks 1.0/1.15/1.33/1.56/1.88, lock 2.26 (spring 2.32), fly 2.7 + 0.42 (lands 3.12), collapse 4.0, snap 4.32, stripOut 5.22, end 5.75.

### Shared
- Hero times: A 2.2 s (arcs running, specular on Trevor), B 2.45 s (coin sprung with the rim arc running).
- The coin canvas is a full-frame layer over the strip and hub on purpose. Those subtrees carry `data-layout-allow-occlusion`, and `hyperframes check` passes. The only remaining warning is the stock three.min.js deprecation line, the same as in word-captions.

## Round 4 (extra round, A only)

Verdict r03: B passed at 8 and is LOCKED; nothing in `b/` changed this round. A scored 7. The verdict found three gaps:
- soft, upscaled, unevenly lit faces;
- flat colour slices;
- a lock-in lit only by two hairline arcs.

The coordinator pointed at lesson 24 (real 3D) as the strongest lever.

### Variant A: Character wheel, now real geometry
- **3D slices.** `a/media/wheel3d.js` uses Three.js r160 and is seek-safe. The four slices are extruded wedges: 10 px deep, with a 3 px bevel in 8 segments.
  - Each wedge outline is shrunk by the bevel, so the bevelled wedge lands exactly on the flat design.
  - Face: a smoked-glass cap, clear-coated, so the key light glints on it.
  - Edges: coloured glass bevels and walls that catch the light.
  - Behind each slice: a soft drop-shadow card and a rim-glow card in the slice colour.
  - Bezel: a gunmetal lathe ring with a rounded section, top-lit by a studio PMREM environment.
- **Face shader.** The face is built from three canvas textures painted at 2x box size. The canvas renders at device-pixel-ratio 2, so the type and faces stay crisp.
  - The colour: a top-lit 2-stop radial, from the hub at ×0.82 L, through the base, to the outer rim at +12% L, with a hub shade.
  - The portrait: premultiplied and clipped to the bevelled face.
  - The overlay: an inner shadow along every edge, plus a 1 px lit inner rim (.42 at the top, .14 at the bottom).
  - State (colour alpha, portrait brightness and saturation) goes through uniforms. The CSS-like values are converted to linear light, otherwise dim slices go pastel.
  - Light uniforms: warm bloom `#FF9A3C` behind the head, flash, and one 60° specular band.
- **Driver.** Slice state lives on plain objects in a separate GSAP timeline, seeked to t on every frame by `Look.drive`, and also on `hf-seek`. That makes it a pure function of t. The DOM layers keep the label, hub, notch, selector, lock arcs, rule and ticks.
- **The lock is a press.**
  - Press (1.96 s): the slice squashes to .96 for 0.06 s, sinks 10 px and tips in. The selector goes to .96 and the hub and notch to .86.
  - Pop (2.02 s): a 22 px radial pop to 1.07 with back.out(2.2), lifting 14 px toward camera. It tips back past flat and settles with an elastic ease.
  - On the overshoot frame (2.22 s) the two white-hot arcs fire: 10 px core, 22 px hot halo, 44 px glow in the pick colour.
  - At the lock (2.02 s):
    - The warm bloom behind Trevor's head rises in 2 frames, holds 3 frames, then settles.
    - One clipped specular band (60°, 0 → .4 → 0) crosses the slice in 0.35 s.
    - The key light rakes across the wheel, so glints run along the bevels.
    - The rim glow flares and breathes once in the hold.
- **Portraits re-sourced.** Each PNG is the native-resolution crop (no scaling) and is shown at or below 1.0×.
  - Head 138 px: Trevor 0.85×, Michael 0.6×, Franklin 0.53×, Lamar 0.5×.
  - Trevor: `v33` t 1.0, frontal, mouth closed. `v08` was checked: the rifle or his arm crosses his face in every frame where it is large, so it can't make a clean wheel portrait.
  - Michael: `v22` t 0.15, a 3/4 view, eyes forward, not downcast.
  - Franklin: `v06` t 0.5, neutral.
  - Lamar: the r3 `v06` cut.
  - All mattes are choked 1 px with a 0.6 px feather, with a 0.6 unsharp. That also removes the stair-stepped jaw.
  - Exposure matched: face luma was Trevor 113, Franklin 121, Michael 55, Lamar 53. Michael is lifted to 78 and Lamar to 67; both are darker-lit in their shots.
- **Unchanged:** timing apart from the press (collapse 3.45, snap 3.85, end 4.6), the plate grade, the masked label rolls, `#label` autoAlpha at collapse + 0.2, and the fold-out and cut.
- Hero times: A 2.28 s (popped and lit, arcs running), B 2.45 s (unchanged).

## Round 5 (B only: one defect)
- Verdict r04: v0 passed at 8, both variants LOCKED. Open defect [v1]: from 2.95 s to 4.2 s the selected slot was an empty black seat, the darkest spot on the wheel at 360×640. It read as a missing asset where the evidence shows a glowing selected slot.
- **Fix: the coin is a duplicate.** At `timing.fly` (2.7 s) the NIGHT DRIVE badge reappears in its slot, directly under the Coin3D coin. On that frame the coin still covers it, so the coin reads as a copy peeling off the lit badge. The coin still flies to the NOW PLAYING socket, with no change to its motion.
  - The badge stays lit: scale 1.12 and the HI filter from the landing tick. It gets a full-strength pink rim (`.tok-rim`: 3 px `#FF4FA3` plus a white hairline) and a 24 px `#FF4FA3` bloom behind it (`.tok-bloom`).
  - The bloom is outer box-shadows, so it paints only outside the badge and never veils the art. It swells in over 0.2 s as the coin clears, then breathes between .76 and 1.0 on a 1.1 s period until the collapse.
  - The other badges stay at their dropped level.
  - The dark `.tsock` seat is now visible only while the coin is pressed in the wheel (1.91 to 2.7 s, always under the coin), and is hidden from the fly frame on.
  - At the collapse the lit badge folds into the hub last, from 1.12, with its rim and bloom, in place of the seat.
- **Unchanged:** everything before 2.7 s, the coin, the strip, the entrance, the label rolls, the end shot (v38) and the timing. a/ was not touched.
- Hero times: A 2.28 s, B 2.45 s (both unchanged). VS-PREV r05 vs r04: v0 0.9963 (unchanged), v1 0.9943.

