# 33 · Goal checklist

The challenge-video checklist: round goal tokens that turn green and get a tick as each goal is done ("GTA 5 but I have to…", collect-them-all and 100-days videos). Overlay.

- **A, side checklist (16:9 long-form):** a column of tokens down the left edge with the goal names; each goal ticks with a strike-through and a check pop, the counter rolls, and the header becomes COMPLETE.
- **B, top checklist (9:16 Shorts):** a row of tokens at the top with the current goal written underneath, highlighted by a gold selector ring and caret; each tick strikes the goal and rolls to the next, ending on CHALLENGE COMPLETE.

The tokens are real Three.js geometry (`media/token3d.js`): enamel rings swept green by a shader, a domed photo face under a glass lens, and a tick coin that spins in. The CHALLENGE COMPLETE payoff is extruded 3D type (`media/title3d.js` with the glyph outlines in `media/glyphs.js`) that lands white and is lit to gold.

## CONFIG
- `goals[]`: `text`, `img` (square picture, `media/…`), `done` (second it ticks; `0` = already ticked when the list enters; `null` = not ticked in this clip).
- A: `title`, `doneTitle`, `title3d` (size, depth, bevel, colours of the 3D payoff type), `layout` (`x`, `top`, `R`, `pitch`, `labelGap`).
- B: `kicker` (`{n}`/`{N}` placeholders), `doneKicker`, `doneTitle`, `title3d`, `layout` (`cx`, `cy`, `R`, `pitch`, `kickTop`, `labTop`, `goldMid`, `maxW`).
- `doneTitle` letters must exist in `media/glyphs.js` (A–Z, 0–9 and basic punctuation).
- `colors`: `ring`, `done`, `coin`, `active`, plus `doneText` (A) or `gold` (B).
- `timing`: `in`, `out`, `end`.

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                  # over the sample footage
```
Same for `b/`.

## Your own clip
Use the transparent `bg:none` render on top of your edit, or swap the `<video>` sources in `#push` (keep `data-start`, `data-duration`, `data-media-start` inside the clip's length). Put your goal pictures in `media/` and set each goal's `done` time to the moment it happens in your clip.

Keywords: checklist, goals, to-do, challenge, objectives, tick, check, strike-through, collectibles, progress, GTA, Shorts.
