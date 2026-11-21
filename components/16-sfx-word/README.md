# 16 SFX word

A huge outlined reaction word that lands on the beat: the "NOOOOOO!!!", "BRUH", "W" moment that GTA creators burn in when something goes wrong (or very right). Built as real 3D type: each letter is an extruded, bevelled Three.js mesh with an enamel face, metal walls, a thick ink outline and a drop shadow.

- **A, `a/index.html` (16:9 long-form, 1920x1080, 4.0 s):** "NOOOOOOO!!!" in the bottom-centre caption band. Letters slam in one after another and the word stretches out from the centre; the "!!!" slam squashes the word, punches it to full depth and ripples a hop back through the letters. Use it in long-form gameplay commentary on a fail, a death or a loss.
- **B, `b/index.html` (9:16 Shorts, 1080x1920, 4.0 s):** a stacked "BR / UH" block in the middle of the safe zone. Letters pop in white, a yellow liquid fills them from the bottom, and the block locks in with a pop and a quick shake. Use it on the punchline beat of a Short.

## CONFIG (top of each file's script)
- A: `text` (trailing `!` / `?` take the accent colour and land together as the payoff), `font.size`, `font.maxInk` (auto-fit width), `font.tracking`, `place.cx` / `place.base` (ink centre and baseline), `depth`, `bevel`, `tilt`, `yaw` (extrusion size and direction), `ink` (outline px), `shadow`, `colors.*` (face, walls, lip, accent, ink), `timing.*` (first slam, letter step, the beat before the marks, mark step, exit, end).
- B: `lines` (one string per stacked line), `font.size`, `font.gap`, `place.cx` / `place.cy` (block centre), `depth`, `bevel`, `tilt`, `yaw`, `ink`, `shadow`, `colors.*` (white state, fill state, hot band, ink), `timing.*` (first pop, step, fill start, lock-in, exit, end).
- Letters available: A-Z, 0-9 and `. , ' ! ? - *` (`media/glyphs.js`; regenerate with `media/gen-glyphs.js` for other characters or fonts).

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                 # over the sample footage
```
Same for `b/`.

## Your own clip
Replace the `<video class="clip shot">` elements inside `#push` with your clip (keep `class="clip"`, a unique id, `muted`, `playsinline`, `data-start`, `data-duration`, `data-track-index="0"`, and `data-media-start` for the in-point), then move `timing.first` (A) or `timing.first` / `timing.lock` (B) onto your beat. Or render `bg:none` and lay the webm over your edit.

## Keywords
sfx word, reaction text, shout caption, NOOO, BRUH, meme text, impact word, outlined text, 3D text, extruded type, slam, squash, wobble, colour fill, GTA 5, GTA Online, Shorts
