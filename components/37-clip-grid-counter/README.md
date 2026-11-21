# 37 Clip grid counter

The list-video grid: a wall of clip tiles with a big counter over it, ticked off as the list goes ("15 hidden details in GTA 5").
Creators use it in long-form list videos as the intro (the count runs up while the clips land) and as the recap at the end (every
clip gets its green check), and in Shorts as the hook frame of a "6 things" video.

- `a/index.html`: **Tile grid (3D)**, 16:9 1920x1080, 7.3 s. 5x3 tiles; the camera flies the grid tile by tile.
- `b/index.html`: **Vertical grid**, 9:16 1080x1920, 6.6 s. 2x3 bigger tiles for a Short; the camera glides down the grid.

Each tile is real Three.js geometry (clearcoat slab, live footage screen, neon tube rim, contact shadow). The current tile lifts
toward the camera, lights up and gets a 3D check badge stamped on; the extruded counter rolls one up on its odometer drums. On the
last tick the counter locks in (punch, rake light, bloom), a light ripple runs back across the grid and the caption rises.

## CONFIG (top of each index.html)
- `count`: items in the list (= tiles); the counter ends on it.
- `caption`: the line(s) under the grid; `{n}` is replaced by `count` (A); `key` is the word set in pink.
- `grid`: `cols`, `rows`, centre `cx`/`cy` (px), `tileW` (screen width; height is 16:9), `gap`, `border`, `radius`, `depth`.
- `counter`: centre, `cap` height, drum symbols per column (`" "` = blank), face gradient stops, wall colour, `punch`, `flash`,
  `rake` (glint strength), `flash`, `pop` (lock-in scale slam), bloom levels, `tilt`.
- `look`: `neon` colour, slab `body` colour, `pending` [brightness, saturation] of unticked tiles, `lift` (px toward camera),
  `badge` size, `glow`, motion blur `samples` / `shutter`.
- `camera`: FOV, start pose and the intro / fly / hold poses ([x, y, distance, yaw, pitch]), spring `omega` / `zeta`;
  `fly.follow` [x, y] is how far the fly follows each tile away from the grid centre (1 = all the way).
- `timing`: tile arrival, first tick `tick0`, tick intervals `iv` [first, last] (they ease between), `roll`, the settled `still`
  window (rendered without motion blur), `exit`, `end`.

## Render
```
cd a && npx hyperframes render . -o out.mp4          # 16:9
cd b && npx hyperframes render . -o out.mp4          # 9:16
```
It is a full-kind component (it carries its own bed), so `bg` has no transparent mode.

## Your own clips
- Tiles: replace `media/tiles/tNN.mp4` (one per tile, reading order, at least as long as the composition), or point the `#src`
  `<video>` tags at your files. `a/media/make-tiles.py` shows how the sample montages were cut (edit its `TILES` list and run it).
- Bed: swap the `#bed` `<video>` sources (any 16:9 / 9:16 clips; it is defocused and washed purple).
- More or fewer items: change `count`, `grid.cols` / `grid.rows`, and add or remove `#src` videos to match.

Keywords: clip grid, video grid, thumbnail grid, list counter, top 15, recap grid, checklist, tick off, feature list, GTA list video,
neon tiles, 3D counter, odometer, count up, Shorts list.
