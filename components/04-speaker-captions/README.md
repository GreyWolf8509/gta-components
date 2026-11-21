# 04 Speaker captions

Dialogue captions for GTA RP and story clips: every speaker's lines in their own colour, with a round 3D avatar medallion and a name plate at the line start. Long-form RP videos use variant A (16:9, bottom-centre, 3 speakers incl. a radio Dispatch); Shorts use variant B (9:16, caption band, two-speaker back-and-forth with the spoken word lit).

- `a/index.html`: 16:9, 1920x1080, 6.9 s.
- `b/index.html`: 9:16, 1080x1920, 6.55 s.

## CONFIG
- `speakers`: `name`, `face` (an image in `media/`, or `"radio"` in A for the drawn dispatch radio), `colour` (`white` / `yellow` / `cyan`, keys of `palette`), and in B `side` (`left` / `right`).
- `lines`: `spk` (index into speakers), `t` (line start, seconds), `rows` (explicit line breaks). A: `radio:1` adds the radio tear, `pay:1` marks the payoff line. B: each row is a list of `[word, secondSpoken, pay?]`.
- `out`, `end`: exit time and composition end.
- `type`: face, size, row positions (`capY`), ink edge, extrusion depth. `badge`: medallion radius, centre y, canvas size.
- `palette`: face gradient stops, extrusion shades, ring and plate colours per speaker colour.

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                 # over the sample footage
```

## Your own clip and cast
Replace the `<video>` elements' `src` (keep `class="clip"`, unique ids, `data-start`/`data-duration`/`data-media-start`), or render `bg:none` and lay the webm over your edit. Put square head crops in `media/` (front-lit, about 400 px) and point `speakers[].face` at them. Time `lines[].t` (and B's word seconds) to your dialogue.

Keywords: speaker captions, dialogue subtitles, RP captions, coloured captions, avatar badge, name tag, karaoke highlight, GTA RP, Shorts captions.
