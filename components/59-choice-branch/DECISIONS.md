# 59 · Choice branch: decisions

## Variant A: neon branches (16:9, 1920×1080, 6.0 s)

**Evidence.** `yt-o4nNjj44d4M` t00495 (3.8M views, the only frame; t00499 shows the next beat). Over a dark, dimmed interior shot a thin glowing pink line enters from the left at x≈33 %, hits a white node at x≈47 %, and forks into two curved branches that end at x≈66 % on two small icons (a colourful app-like square on top, a white handcuffs glyph below). Diagram spans y 38–58 %. A caption sits above it ("it shapes how their **story** unfolds", white lowercase bold, keyword pink) under a small pink pill tag. Motion: the line draws left to right and splits. No labels, no choice state; it is flat SVG-grade strokes with a soft glow.

**Our upgrade.**
- **Real neon tubes (Three.js).** Every line is a TubeGeometry (r 6.5 px) with a custom neon shader: saturated pink edges, a white-hot core where the tube faces camera, a soft specular stripe along the top, plus a fat glow tube (4.2× r, falloff pow(facing, 2.4)) and a soft dark under-shadow tube so it reads on pale skies. Draw-on is a shader cut along arc length with a bright soft spark riding the head (round bloom, no 4-point star). The trunk fades in from nothing at its left end.
- **Fork node** is a white clear-coat pearl with a pink halo; it pops with a spring (0 → 1.3 → 1) and a soft ripple when the line splits.
- **Option tiles are real 3D slabs** (the evidence's icon squares): rounded-square ExtrudeGeometry, 148 px face, 26 px deep with a 7 px bevel, clear-coat over a 3-stop faction gradient (green for LAMAR, purple for STRETCH) with our own drawn icons (crew / dagger), PMREM studio env, key + hemisphere, ACES. Each branch plugs into its tile through a small chrome electrode sleeve, and a pink point light at each socket spills neon onto the tile's left bevel (light matches the source).
- **Labels** are crisp DOM: "SIDE WITH" kicker (Inter 800, tracked) over the name (Archivo 900, 66 % width, 100 px, dark stroke), pinned to projected 3D anchors, mask-rise in.
- **State change (payoff, 3.27 s):** a white-hot comet pulse runs the trunk and accelerates (power2.in) into the LAMAR branch. As it passes the node the STRETCH tube flickers out like a dying neon sign (deterministic 9-step flicker to unlit glass), its spill light dies, its tile tips back 0.45 rad, sinks 50 px and darkens, its label dims. The pulse hits LAMAR on the cut: the slab presses 18 px into the line with a squash, springs back proud (overshoot, settles 6 % larger and squared up to camera), its face lights from inside (emissive peak held 3 frames, then 0.35), a green bloom fires behind the slab only, a point light rakes across the clear coat, and a neon frame wraps around the tile from the socket (two halves meeting at the far side). Kicker rolls "SIDE WITH" → "YOU SIDED WITH" (pink) in an overflow window. Small shake, flash 0.
- **Hold** 3.6–5.05 s with two slower pulses running the chosen path; the diagram drifts a few degrees in yaw for parallax.
- **Exit:** labels and title roll out through their masks, the tubes erase from the trunk start toward the tiles, the node collapses as the tail passes it, tiles tumble shut into points. Gone by 5.55 s; 0.45 s footage tail.

**Shots and cut points** (2-frame overlaps, incoming clip underneath): v05 Franklin & Lamar street 0–1.30, v13 lowrider gang 1.30–2.40, v14 drive-by silhouette 2.40–3.27 (the threat), v39 lowriders downtown 3.27–4.37 (payoff on a bright, sharp, wide -h shot), v44 bridge skyline 4.37–6.0. Plate only: a radial black dim (≈ −34 %, blacks stay black) under the diagram like the evidence's dimmed shot; it lifts on exit so the tail is bright.

**Payoff beat.** 3.27 s hit, lock-in peak 3.31–3.41; hero frame 3.75 s.

## Variant B: branch for Shorts (9:16, 1080×1920, 6.0 s)

**Evidence.** Same object; the brief asks for a vertical tree. Phone-first (lesson 26): the tree is the hero at ~62 % of the width.

**Our upgrade.** Same neon/slab system scaled for phone: tube r 9 px, tiles 222 px (≈ 21 % width each, tree spans x 169–839), labels centred under the tiles (kicker 34 px, name Archivo 900 112 px). Title "one choice. / two **endings**." at 108 px in the hook band (y 300–520) under the pink pill. The stem drops from y 585 to the node at y 800 and forks into two S-curves that plug into the tiles' top edges; the wrap frame starts at the top socket. One payoff beat, identical to A.

**Shots.** -v versions of the same edit, payoff cut to v39 lowriders downtown (vehicles + skyline survive the upscale), tail on v44 bridge skyline. No face close-up at the payoff.

**Payoff beat.** 3.27 s hit; hero 3.75 s.

## Round log
- r01: first build. Self-review before the critic: loser label dims by colour (no see-through), loser tile stays plugged and darkens, point-light rake replaced by a clipped specular band, stronger halo, B payoff moved to the sharper v44 bridge shot. Blind critic: 8/8, no defects (PASSED).
