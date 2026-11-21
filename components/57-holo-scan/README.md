# 57 Holo scan

A holographic lidar scan of a car: a thin laser contour sweeps the vehicle nose to tail, a point cloud condenses onto the body
and its crease lines light up, HUD tags lock onto parts, then a lock wave prints the car as a thin dark clearcoat shell, a specular band
rakes it, the lamps switch on and the result counts up and lands on a spring. Creators use it for a
"scanning the car" / "let's analyse it" beat: car showcases, "fastest car in GTA" lists, comparisons.

- `a/` 16:9 long-form: tags in left/right HUD columns with leaders, readout under the car.
- `b/` 9:16 Shorts: car centred at ~75% width on a holographic projector pad (rim, turning ticks, radar sweep, contact glow), readout as the headline, numbered bracketed data boxes in a 2x2 grid under it. Everything stays inside the Shorts safe zone x 72-936 across the orbit; if you raise `dist` less or move `shift`, re-check the tail and the wing pin against x 936.

The car is real Three.js geometry (`media/holo3d.js`: a wedge supercar lofted smoothly from 8 rails with sharp
creases, round wheel arches, glass, louvres, intake, lamps, wing; procedural, no external models), rendered from timeline time.

## CONFIG (top of each `index.html`)
- `kicker`, `done`: the mono line while scanning and after the lock.
- `result`: `{ value, unit }`, the payoff readout (e.g. `"213"`, `"MPH"`).
- `tags`: `{ k, v, anchor }` per part (A also `side`, `y`). Anchors: tyre/brakes (front wheel), roof, intake (engine), wing.
- A: `columns`, `colW` (tag columns). B: `rows` (`top`, `pitch`, `x` column lefts of the 2x2 data boxes).
- `car`: `yaw` [start, end] orbit in degrees, `pitch`, `dist`, `target`, `shift` (px, moves the car on screen).
- `colors.body`: shell tint (dark clearcoat). `points`: surface point count (the crease lines are sampled on top of it).
- `timing`: ignite, scan0/scan1 (sweep), wave0/lock (payoff: shell prints, lamps on, reticles tick), rake0/rake1 (hold light), exit, erase0/erase1, end.

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                 # over sample footage
```
Same in `b/`. Use hardware GPU rendering (`PRODUCER_BROWSER_GPU_MODE=hardware`) for speed.

## Your own clip
Replace the `<video class="clip shot">` sources in `#push` with your clip (keep `muted playsinline`, unique ids,
`data-start` / `data-duration` / `data-media-start`), or render `bg:none` and drop the webm over your edit.

Keywords: hologram, holo scan, lidar, point cloud, car scan, vehicle analysis, HUD, specs, scan complete, top speed, GTA 5, GTA Online.
