# 58 Quote card

An italic pull-quote card with an attribution line and a real 3D source tile, for GTA essay, lore and news videos:
the moment the narrator reads a line from someone ("as Lester put it..."). Long-form (A, 16:9) and Shorts (B, 9:16).

- **A "Pull quote"** (`a/index.html`, 1920x1080, 6.4 s): the quote writes on word by word over dimmed purple-graded
  footage; the key phrase ignites pink and the gold tile's neon halo switches on.
- **B "Quote for Shorts"** (`b/index.html`, 1080x1920, 6.5 s): the quote set big; each word lights as it is said and the
  key word, set bigger, ignites pink.

## CONFIG (top of each file's script)
- `quote`: one string per line; wrap the key phrase in `*asterisks*` (it ignites pink). In B a line that is only
  `*word*` is set at `type.keySize`.
- `source`: attribution parts, joined with pink dots (the first is set bold).
- `type`: position, size, line height (B: `maxW` auto-fits the body lines, `keySize` the key line).
- `tile`: centre, size, depth, tilt and turn of the 3D tile.
- `colors`: accent gradient, lit gradient (B), tile face stops, side, ink, glow.
- `grade`: the purple-magenta footage grade (plate renders only).
- `timing`: entrance, word timing (A `words`/`step`, B `light0`/`step`), `pause` after a full stop, `payoff`, `out`, `end`.

Use fictional in-world lines credited to characters, or your own lines credited to your handle. Never invent quotes
from real people.

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                    # over the sample footage
```
Same for `b/`.

## Your own clip
Replace the `src` of `#shot1` (keep `class="clip"`, `muted`, `playsinline`; set `data-media-start` and keep
`data-duration` within the clip's length), or render `bg:none` and lay the webm over your edit (add your own dim).

## Keywords
quote card, pull quote, quotation, citation, attribution, source card, essay, lore, news, interview quote, GTA, Shorts,
kinetic type, karaoke words, 3D tile, neon glow
