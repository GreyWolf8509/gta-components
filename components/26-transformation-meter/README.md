# 26 · Transformation meter

The progress meter from "Upgrading X to Y" / evolution GTA videos: a portrait badge plus a fill that climbs as the character evolves, with a state change at every stage and a MAX payoff. It's a persistent overlay: it makes a big entrance, docks at the edge where creators put it, steps up between beats, and exits piece by piece.

| Variant | File | Use |
|---|---|---|
| A, Badge + fill (16:9) | `a/index.html` | Long-form. Top-left hexagon portrait badge joined to a wavy glass tube. A lime → red liquid surges stage by stage in milky glass. On each stage the badge punches, the next form irises open over the last one, the rim flashes and the LV chip rolls and slams. At MAX the meter pops, turns gold, a specular band sweeps the tube, embers lift off and a bloom lights the badge. Evidence: yt-EP_LdrobwPg, yt-E1Eu2_RUdEo. |
| B, Power tube (9:16) | `b/index.html` | Shorts. A gold-rimmed glass power tube at the left edge with an amber chevron power orb at its base. The liquid rises with bubbles while a true odometer counter beside the orb rolls up to 2,500. At MAX the padlock flies off, the final form wipes up out of its silhouette with gold light behind the head, and the counter slams gold. Evidence: yt-J2ed1YF71ZU. |

Both run 7.0 s at 30 fps.

## CONFIG

### A (`a/index.html`)
- `forms`: one entry per form, as `{label, portrait}`. The meter starts on `forms[0]`, swaps on each stage, and the last entry is the MAX form. The portraits are square stills (480×480 is plenty) in `a/media/`.
- `liquid`: the gradient stops along the tube.
- `rim` / `gold`: the badge and tube rim colours, before and at MAX.
- `start`: the LV 1 level after the first pour, as a fraction of the tube. The default is `0.2`.
- `surges`: each entry is `[start time, level reached]`, where the level is a fraction of the tube and `1` is MAX. A stage ring is drawn at each level below 1. The defaults are 0.46 / 0.73 / 1. `surgeDur` sets how long each surge takes.
- `timing`:
  - `in` is the entrance;
  - `dock` is when it shrinks to its dock;
  - `pour` is the first pour;
  - `settle` is when it returns from the MAX pop;
  - `out` is when the exit starts. It needs about 0.6 s before `end`; the collapse is chip → tube → collar → badge.
  - `end` is the duration.

### B (`b/index.html`)
- `label` / `maxLabel`: the counter's eyebrow before and at MAX.
- `max`: the value at the top of the tube. `tickEvery` is the tick spacing.
- `steps`: each entry is `[start time, value reached]`; the last must reach `max`. `stepDur` sets how long each step takes. Values are multiples of 100: the odometer turns a hundreds wheel and carries into the thousands wheel, while the tens and ones stay at 0.
- `crest.unlocked` / `crest.locked`: the final form as a cut-out portrait PNG (transparent background, face about 65 % of the frame) and its silhouette. `crest.halo` is the gold light behind the head once it's unlocked.
  - To key a portrait shot against sky: `ffmpeg -i p.png -vf "colorkey=color=0xDFC898:similarity=0.15:blend=0.07,format=rgba" cut.png`. Set `color` to the sky colour.
  - To make the silhouette: `ffmpeg -i cut.png -vf "format=rgba,lutrgb=r=5:g=8:b=26" silhouette.png`.
- `liquid`: the four colour stops of the gold liquid.
- `orb.mark`: the emblem engraved in the orb. It is `"chevron"` by default (our own double up-chevron, which charges white-hot with the level), or `"star"` for an anime-style star. `orb.glass` holds the five amber stops of the orb glass, from centre to rim.
- `timing`: `in`, `out` (when the exit starts: counter wipe → crest fold → drain → tube retract → orb pop, about 0.6 s) and `end`.

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                  # over the sample footage
```
Do the same in `b/` for the Short.

## Use your own clip
Either render `bg:none` and drop the webm over your edit, or replace the `<video class="clip shot">` elements, keeping a unique `id`, `muted`, `playsinline`, `data-start`, `data-duration`, `data-track-index` and `data-media-start`. Time the CONFIG surges / steps to your beats; MAX is the payoff.

## Keywords
transformation meter, evolution bar, upgrade meter, power level, power tube, power orb, level up, hexagon badge, portrait badge, iris swap, progress bar, liquid fill, gauge, counter, odometer, MAX, GTA 5, GTA V, Shorts, overlay
