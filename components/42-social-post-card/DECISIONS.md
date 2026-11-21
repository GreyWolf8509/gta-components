# 42 Social post card: decisions

Platform: **sunwire**, our own in-world Los Santos network. Mark = a retro sunset disc (yellow -> orange -> pink, three
horizontal cuts in the lower half) + a lowercase Inter 800 wordmark. Our own icons (reply bubble with one sharp corner,
loop arrow "relay", heart, share tray), our own verified mark (a sunset-gradient diamond with a check). No X / Reddit /
Instagram / TikTok / Bluesky logos, wordmarks or exact layouts. Handles: @everestchris6 (the creator), @grove.jay and
@vinewood.vic (fictional). Facts used: GTA 5 Sept 2013, GTA 6 Nov 19 2026 (13 years apart).

## Variant A: "Post card" (16:9, 1920x1080, 6.1 s)

**Evidence.**
- yt-mCDH5KnBx9o t01782-t01818 (8.3M): a white rounded post screenshot, ~62% of frame width, x 20-82% / y 14-82%,
  avatar + name + @handle + time, dark body text, quoted media (two gameplay thumbs), an icon row with counts. Soft shadow,
  slow push-in. The job: a black highlight extends word by word across the sentence the creator is reading.
- yt-0FV42j9xSV0 t00490: a single chat message pop-up (dark box, pink username) lower centre.
- yt-KedfEMhQdP8 t00574: a recreated comment UI with typing and punch-ins.
- All flat screenshots: no material, linear or no motion, no state change.

**Our upgrade.**
- The post is a real Three.js slab (1200x730, 18 px thick, 5 px bevel): porcelain-white clearcoat face (white -> #F2F3F6
  with a soft top-left light), a satin light-grey edge that catches the studio environment, a soft drop shadow on the plate.
- It drops in from above on a spring (f 1.35, z 0.58), top edge tipped toward camera (rotX 0.42 -> 0) with a vertical
  motion blur that resolves sharp; settles at a slight 3D angle (rotY -0.075) so the thickness reads, then drifts in.
- The highlight is a caption-yellow marker band (#FFE45C -> #FFD23C) that extends word by word behind
  "GTA 6 is finally here" (1.15-1.95 s); the phrase is set in Inter 700 inside a 500 body.
- Payoff = the like. The flat outline heart squashes (0.78), then a real extruded, bevelled, glossy 3D heart (pink -> red
  gradient, clearcoat, sheen) bursts out of the slot: 0.8 -> 3.1x, 160 px toward camera, a specular band crosses it,
  a pink bloom on the card around the slot (3-frame peak), a soft ring and six small glossy hearts as embers.
  It falls back into the slot with a squash and stays raised (1.25x) with a contact shadow. A pink pill wipes in behind
  the like group and the count rolls 12,481 -> 48,213 in masked odometer columns (tabular), grey -> brand pink.

**Shots and cuts.** v28 tennis mansion 0-2.5, v11 yacht 2.5-4.6, v44 bridge skyline 4.6-6.1 (1.0x, slow push).

**Payoff beat: 2.5 s, on the v28 -> v11 cut.** Exit 5.45: the card tips back and drops out of frame with blur (0.4 s).

## Variant B: "Chat bubble" (9:16, 1080x1920, 6.65 s)

**Evidence.**
- yt-0FV42j9xSV0 t00482-t00498 (6.5M): one chat message pops over gameplay in the lower centre, ~46% of frame width,
  pink username + white message on a charcoal box. yt-o4nNjj44d4M t00740-t00760: a purple phone with comment rows,
  chips and a POST pill, typing into the input. Shorts creators run text threads that pop in one message at a time.
- Flat boxes, default fonts, hard cuts or typing only; nothing has depth or a reaction beat.

**Our upgrade.**
- The whole thread is real 3D: a glossy ink header pill (sunwire mark + wordmark | LS LOBBY | live dot 2,418),
  porcelain-white message bubbles (one sharp corner toward the sender's avatar, our own shape), glossy avatar discs
  with initials, and the creator's reply in a sunset-gradient clearcoat bubble with a red edge.
- Messages pop from their sender corner on an under-damped spring (0.25 -> 1, f 2.3, z 0.42) with a slight rotation and
  a 50 px z settle while the thread pushes up (expo.out 0.38 s); the stack bottom stays anchored at y 1215.
- Typing: a gradient pill with three glossy white spheres bouncing in sequence (2 Hz), breathing slightly; it collapses
  into its corner and the reply lands in its place.
- Payoff (3.55 s, on the v36 -> v11 cut): a white reaction badge springs out over the reply's bottom-left corner and a
  glossy extruded 3D heart slams onto it from the camera (3.4x, z 300 -> badge in 0.1 s) with a squash, the bubble recoils,
  a soft bloom on the bubble corner (3-frame peak), a specular band crosses the reply + heart, five small glossy hearts
  puff out, and the count rolls 1 -> 486 in masked odometer columns.

**Shots and cuts.** v24 sunset powerlines 0-1.65, v36 hills city view 1.65-3.55, v12 heli city dusk 3.55-5.1, v17
deluxo sunset 5.1-6.65 (all -v, wide, 1.0x, slow push; the dusk city keeps the white bubbles in contrast on the payoff). Text stays inside x 84-920, y ~460-1260.

**Exit 6.05 s.** Badge, reply, messages and header collapse into their anchor corners (0.2 s power3.in, 0.05 s stagger).

## Round log
- r01: first build of both. Self-review fixes before the critic: A: the payoff ring (clipped by the card edge) removed,
  the specular band kept off the white face (it streaked milky over the media), heart deepened (#FF5A86 -> #F2164A ->
  #A00A2C, emissive 0.3), odometer window tightened and fast columns snap instead of showing half-rolled glyphs, card at a
  stronger angle (rotY -0.12 -> -0.065 slow turn) so the slab reads as an object. B: reply bubble +16 px bottom padding and
  the badge moved down-left so it never covers the text, heart band softened, payoff shot v11 (white hull, low contrast)
  replaced by v12 dusk city, thread tilted (rotY -0.1 -> -0.055) for depth.
- r01 critic: v0 7 / v1 7, no defects, no caps. Gaps: v0 the big heart covered the "0:34" chip (orphan "34"), the
  marker sweep (the evidence's signature beat) was a flat fill with no camera or light, seven mini hearts read as a stock
  pack. v1 the hero reply was only 46% of frame width, its diagonal pink -> orange fill read as a stock gradient, the heart
  chip was small, no light moment, a repeated last frame.
- r02 (both open):
  - A: duration chip moved to the thumbnail's top-left (16 px inset) so the heart never covers it; heart peak 2.6x
    (~110 px), landing squash 1.25 / 0.80 under-damped back; embers 6 -> 3; a red rim bloom (#FF2E3A 55%, 26 px) on the
    like pill as the heart lands (6 frames); the card pushes in 1.00 -> 1.07 about the marked phrase while the marker
    sweeps (power3.inOut, phrase held in place); on completion a marker-only glow (3-frame peak) and one clipped specular
    pass across the marker; slab 30 px thick and angled so its bottom edge faces camera.
  - B: hero reply at 94 px Inter 800 (-2 tracking), ~65% of frame width; candy material: vertical coral -> red -> deep
    pink (#FF7A4D / #F8344F / #D0103F), a gloss lens over the top 45%, a 14 px inner bottom shadow, lit top edge,
    30 px deep extrusion with a dark-red edge; reaction chip 280x108 with a 76 px heart and 64 px count; the heart slam
    starts 0.1 s early so it LANDS on the 3.55 cut, with a face emissive pulse (3-frame peak), a 56 px specular band across
    the reply + heart and the corner bloom; embers 5 -> 3; thread tilted bottom-toward-camera; end 6.6 s (no repeated frame).
  - r02 self-review fix: B's heart was scaled by the badge pop (it grew from 0.2x with the chip instead of slamming);
    its scale and offsets are now compensated for the pop, so it arrives at 2.6x from z +300 and lands on the 3.55 cut.
    A's marker glow raised to 95% / 34 px and the sheen pass widened to 88 px at 80% white.
  - r02 critic not run: the session's concurrent-subagent limit was reached when launching it.
