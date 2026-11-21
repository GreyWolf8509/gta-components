# 38 Spin wheel

The random-pick prize wheel from GTA challenge videos ("the wheel picks my car / my challenge"): it spins, ticks past the pegs, slows, lands on a result and shows it. This is not the radial weapon/character wheel (that is `47-selection-wheel`).

- **A, `a/index.html` (16:9, 1920x1080), long-form.** An 8-wedge 3D wheel, pointer at 3 o'clock so the winning label lands horizontal; the result plaque swings out of the wheel to the right of the pointer.
- **B, `b/index.html` (9:16, 1080x1920), Shorts.** A 6-wedge wheel inside the Shorts safe zone, pointer at 12 o'clock; the result plaque pops out of the hub and lands in front of the wheel's lower edge.

Both are real Three.js geometry (`media/wheel3d.js`): extruded lacquer wedges with printed labels, gold dividers, rim pegs and hub, a bulb ring, a sprung ticker, and a gold-framed plaque. The spin is a deterministic physics sim (`media/spinsim.js`): friction, air drag and every peg braking the ticker; the launch speed is solved so the wheel rests on your chosen winner. The fast spin is real motion blur (the wheel is rendered many times per frame across the shutter).

## CONFIG (top of each `index.html`)
- `wedges`: `{ label, color, ink }` per wedge, clockwise. `ink: true` prints a dark label (for yellow, cyan, green).
- `winner`: the wedge index it lands on. `land`: how far past the last peg it stops (0-1). `turns`: minimum full turns.
- `kicker`, `result`: the plaque's small line and big line (the result can be longer than the wedge label).
- `wheel`, `card`: positions/sizes in canvas px. `pointerAngle`: 0 = 3 o'clock, -90 = 12 o'clock.
- `timing`: `in`, `wind` (wind-up), `launch`; the lock time comes from the physics; `exit`, `cut` (wheel gone, footage cut), `end`.
- Shots: the `<video>` tags (bed `v35-penthouse-dusk`, blurred and graded while the wheel is up; the result shot after the cut).

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                   # over the sample footage
```
Swap in your own clip: change the `src` (and `data-media-start` / `data-duration`) of `#shotA` (the bed) and `#shotB` (the result shot), or render `bg:none` and drop the webm on your timeline.

Keywords: spin the wheel, wheel of fortune, random picker, prize wheel, challenge wheel, decide, GTA challenge, lucky wheel, roulette, result reveal.
