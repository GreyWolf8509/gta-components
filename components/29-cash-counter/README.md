# 29 Cash counter

The cash HUD from "$1 to $1,000,000,000" challenge videos: a cash pill with rolling digits, where each gain pops in as a neon green "+$" and rolls the total up.

- **A: Cash HUD (16:9, long-form).** A smoked-glass pill with a white enamel bezel docks top-right. Lime odometer digits; gains float up into it. The big gain switches it to the neon gain state, every column spins, and it locks in.
- **B: Cash pill (9:16, Shorts).** A chunky 3D money-green slab with a white enamel bezel and a reeded coin edge, sitting in the hook zone under an Archivo "BANK BALANCE" label. Gains pop in under it. Crossing $1,000,000 grows a new digit column, re-skins the slab to gold on the cut and rolls the label to "MILLIONAIRE".

The pill is real Three.js geometry (`media/gloss3d.js`). The digits are DOM, so they stay razor-sharp.

## CONFIG (top of each `index.html`)
- `start`: the balance when the pill lands.
- `gains[]`: `{ amount, pop, merge, payoff }`.
  - `pop` is when the "+$" appears; `merge` is when it hits the pill (put merges on your cuts).
  - `payoff: true` marks the big one.
- B only:
  - `milestone`: 1,000,000. The payoff should cross it.
  - `label.idle` / `label.payoff`.
- `timing`: `in`, `dock` (A), `out`, `end`, and `lockAfter` (the spin length before lock-in).
- `pill`: box, radius and bezel width; B also has `depth` (the slab thickness) and `lip` (how far the bezel stands proud of the face).
- `view` (B only): camera distance `D`, eye point (`eyeX`, `eyeY`; a low eye shows the bottom wall) and the held tilt.
  - A docks it top-right; move `x` to 48 for top-left.
  - B is centred at `cx`.
- `type`: digit face (Archivo, stretch %, size), the chip sizes and, in B, the label size and stretch.
- `colors`: digit ramp, glass or lacquer ramps, bezel, neon, gold, chip. B has separate `body` (the reeded wall) and `face` ramps.
- `shots`: the footage clips (plate renders only).

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                   # over the sample footage
```
Use the same commands in `b/` for the Shorts version.

## Your own clip
Render `bg:none` to WebM and lay it over your edit. Or swap the `<video>` sources in `index.html` for your own clip (keep `class="clip"`, `muted`, `playsinline`, `data-start`, `data-duration`, `data-track-index`).

## Keywords
cash counter, money counter, balance HUD, rolling digits, odometer, +$ gain, money pop, $1 to $1 billion, GTA Online money, millionaire, cash pill
