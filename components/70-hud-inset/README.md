# 70 HUD inset

A boxed, game-style VITALS panel that sits in a corner and tells the story with its bars: the armour breaks on a hit,
then the big hit drains health to CRITICAL (white-hot damage chip, red bar, rolling readout, HEALTH -> CRITICAL, recoil,
red alarm light and a light sweep across the glass). After the payoff it docks smaller into the corner and powers off.
Our own HUD design: a chamfered gunmetal slab with a recessed smoked-glass face and extruded glowing glass bars (Three.js).

- **Long-form (a/, 16:9 1920x1080):** bottom-left, 700x270, 64 px off the edges, like a creator's stat box over gameplay
  or a talking head ("we were on 9 HP").
- **Shorts (b/, 9:16 1080x1920):** the same module phone-first, 780x372 (72% of the width), bottom-left of the Shorts safe
  zone (x 72-852, y 1098-1470).

## CONFIG
- `start`: `{ health, armor }` values the bars fill to at boot (0-100).
- `events`: the story, `[{ at: seconds, health?, armor? }]`. The first event that drops health to `critAt` or below is the
  payoff (big recoil, red state, label roll, sweep); other events are small hits.
- `critAt`: the critical threshold.
- `labels`: `health`, `critical`, `armor` (uppercase is applied).
- `colors`: `health`, `armor`, `crit`, `label`, `text`.
- `panel`: `x`, `bottom` (bottom-left corner on the canvas), `w`, `h`, `depth`, `rim`, `chamfer`, `yaw`, `pitch`
  (radians), `dock` (scale after the payoff).
- `layout`: positions in panel px (y down from the top) for the heart, label, readout, bars, shield and armour label.
- `led`: the status light in the top rim.
- `timing`: `in` (hinge up), `boot` (power on), `dock`, `out` (power off), `end`.

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                  # over the sample footage
```
(Same for `b/`.)

## Your own clip
Replace the `<video>` elements in `#push` with your clip (keep `class="clip shot"`, a unique id, `muted playsinline`,
`data-start`, `data-duration`, `data-track-index`), then set `events[].at` to your hit moments, ideally the payoff on a cut.
Or render `bg:none` and lay the webm over your edit.

Keywords: HUD, health bar, armour bar, armor, vitals, critical, low health, damage, game UI, inset, corner box, meter,
gauge, stat box, GTA, firefight, story beat, overlay.
