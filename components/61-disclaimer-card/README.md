# 61 Disclaimer card

The tongue-in-cheek disclaimer creators put before a mod or story video ("No NPCs were harmed...", "*mods used, not real gameplay"). Two HyperFrames projects:

- **A, `a/index.html`: Full-screen disclaimer** (16:9 long-form, 1920x1080, 5.6 s). A hard cut from gameplay to a black card: a red enamel warning plate (real 3D: steel bevel, chrome screws, cut-through warning triangle, raised "DISCLAIMER" letters) slams on, a red rule draws, the first line rises in, the red bracketed punchline stamps down with a raking light, a 3 s hold, then a rush at the lens and a hard cut back to gameplay. Use it in the first seconds of a long-form mod / story video.
- **B, `b/index.html`: Corner disclaimer** (9:16 Shorts, 1080x1920, 6 s). The same plate as a one-row "MODS USED" sign with the line "*not real gameplay (sadly)" hung under it slams in big at 0.5 s, then whips into the top-right corner on the first cut (the payoff: overshoot, hot rim, raking light) and stays there as a small chip for the whole Short (legible at 360x640).

The copy is a joke, not a legal notice, and never claims to come from Rockstar or any company. Keep it that way when you edit it.

## CONFIG (top of each file's script)
- A: `heading` (plate letters: A-Z 0-9 . , ' ! ? - & : #), `line1` (white), `line2` (the red bracketed punchline), `type` (cap height, tracking, line size), `colors` (plate enamel stops, steel, white enamel, walls, the red light pool), `plate` (padding, height, radius, depth, bevel, pinstripe, screws), `layout` (plate centre, rule and line positions), `timing` (cut in, slam, rule, lines, stamp, cut out, exit, end).
- B: `heading`, `line` (hung under the plate), `type` (cap, tracking, word gap, line size), `colors`, `plate`, `layout` (hero position, line gap, dock corner, chip and line scale), `timing` (in, slam, line, dock, dock duration, end). Keep the dock landing on one of your cuts.
- The footage cuts are on the `<video>` tags (`data-start`, `data-duration`, `data-media-start`).

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay (no black card, no footage)
cd a && npx hyperframes render . -o out.mp4                                                 # with the sample footage and the black card
cd b && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm
```
With `bg:"none"` A drops its black backing so you can lay the card over your own black or footage; the plate and lines carry their own shadow.

## Your own clip
Replace the `src` of the `<video class="clip shot">` tags (A: `s1` before the card, `s2` after it; B: `s1`-`s4`) and keep each `data-duration` within the clip's length. Keep the 2-frame overlaps (the next clip starts under the current one).

## Keywords
disclaimer, warning, mods used, not real gameplay, no NPCs were harmed, entertainment purposes, viewer discretion, intro card, black card, corner note, GTA 5, GTA Online, mod video, story video, Shorts
