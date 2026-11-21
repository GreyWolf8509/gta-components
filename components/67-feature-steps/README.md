# 67 Feature steps

A row of glowing purple feature tiles joined by pink arrows, lit one step at a time as the narrator covers each step, ending on
the result step. The creators' "how it works" graphic in GTA list and feature videos (`yt-o4nNjj44d4M`: AI DRIVES -> PASSENGER ->
LEAN OUT; WORK OUT = MUSCLE). Overlay kind: drop it on your own clip.

- **A, Tile row (16:9, long-form):** three 3D tiles across the top of the frame with caption pills under them.
- **B, Step stack (9:16, Shorts):** the same tiles as three wide slabs stacked down the frame, the step word in extruded 3D type.

Tiles, icons, arrows and (B) words are real Three.js geometry (`media/steps3d.js`); A's pills are DOM.

## CONFIG (top of each `index.html`)
- `steps[]`: one entry per step, in order.
  - A: `label` (pill text), `icon` (`wheel` | `star` | `coin`), `cx`/`cy` (tile centre px), `ry` (yaw), `accent: "gold"` on the result step.
  - B: `word` (big 3D word, auto-fits), `sub` (line under it), `icon`, `cx`/`cy`, `accent`.
- `tile`: slab size, radius, depth, bevel, neon tube radius, glow / shadow pads, icon size and offset; B also `word` and `sub` layout.
- `arrow`: neon tube radius, head size, glow.
- `look`: neon / gold / body / face colours, done level, glow and payoff peak, lift, punch, sheens, rake, sway, motion-blur samples.
- `timing`: `in[]` (pop-in per tile), `light[]` (when each step lights; the last is the payoff), rim draw, arrow charge,
  payoff chain, coin flip, gold front (B), exit and `end`.

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                 # over the sample footage
```
Same for `b/`. To use your own clip, replace the `<video class="clip shot">` sources (keep ids unique and `data-*` timings
inside each clip's length), or render `bg:none` and lay the webm over your edit. Move `timing.light` to your narration beats.

## Keywords
feature steps, how it works, step tiles, process row, flow chart, neon tiles, icon tiles, caption pills, arrows, step 1 2 3,
GTA tutorial, money method, Shorts steps, 3D tiles, gold payoff
