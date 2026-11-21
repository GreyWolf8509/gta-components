# 35 List number

The big "#5" that opens each entry of a top-10 / ranking video. Creators use it in long-form list videos (a number + entry title card, then a small number kept in the corner for the whole entry) and in list Shorts (a giant number with the entry name at the top).

- **A (`a/`, 16:9, 6.0 s): Number card.** A giant 3D "#5" slams in on the right showing the previous entry's 6, the counter drum rolls 6 -> 5 and the lock floods it pink-violet; the entry card builds on the left (pill, title, subline, top-10 progress). Then the card folds away and the number flies into the top-left corner, where it stays.
- **B (`b/`, 9:16, 4.1 s): Number stack.** The same 3D number at the top of a Short with the two-line entry name and the progress row under it; the stack exits by folding the name away and collapsing the number into its centre.

The number is real Three.js geometry (`media/num3d.js`: extruded Archivo outlines from `media/glyphs.js`). Everything else is DOM type (Inter).

## CONFIG

- `number`: `from` (the previous entry, shown first), `to` (this entry, 0-9: the drum rolls to it and locks), `prefix` (the superscript glyph before the number, `"#"`).
- `pill` (A): the small label, e.g. `"NUMBER 5"`.
- `title`: two lines; `accent`: which line takes the pink-violet gradient.
- `sub` (A): the italic subline.
- `progress`: `total` entries and how many are `done`; the next one is the lit dash.
- `type`: glyph set, numeral `cap` height in px, position (A: `right` ink edge and `cy`; B: block centre `cx` and `top`), `hashScale`, `gap`, extrusion `depth`, `bevel`, `tilt`.
- `dock` (A): docked corner `x`, `y`, `cap`, start `at` and flight `dur`.
- `colors`: `white` (the pre-lock enamel), `state` (the locked candy metal: face stops + `facePos`, `lip`, `side` walls, `hot` band), `glow` (rgb of the plate bounce), `shadow`.
- `timing`: `in` / `inDur` (slam), `tick` / `rollDur` (drum), `out` (title exit; B: whole exit), `end`.

## Render

```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o list-number.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                    # with the sample footage
```
Same for `b/`.

## Your own clip

Replace the `<video class="clip shot">` elements (`#s1`...) with your footage, keeping each `data-duration` inside the clip's length (and `data-media-start` for an in-point), or render `bg:none` and lay the WebM over your edit. New digits or letters: `media/gen-glyphs.js` regenerates `media/glyphs.js` (needs fontkit).

## Keywords

list number, top 10, ranking number, countdown, number card, entry title, #5, number 1, corner number, rolling counter, odometer, 3D number, neon number, GTA 5, GTA Online, RDR2, list video, Shorts
