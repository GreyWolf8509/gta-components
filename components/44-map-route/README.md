# 44 Map route

A map with pins and a route that draws on: "here's where we're going". GTA creators cut out of gameplay into a map, draw the route from A to B, then cut back to the place.

- **Long-form (16:9):** the maps-app version (light map, red pins, crimson route).
- **Shorts (9:16):** the game-map version (paper map, bead route, cyan and red arrows).

## Variant A: `a/index.html` (16:9, 1920x1080, 7.8 s, Three.js)

"Tilted 3D map". Our own island city in a light maps-app style:
- It's drawn procedurally on a canvas and laid on displaced 3D terrain, with real hills, extruded downtown towers, a low-rise city and shadow-mapped light.
- The map cuts into the gameplay's dark HUD radar frame (rendered natively there, so it's sharp), then grows out of it to full screen (with motion blur, a corner morph and a shadow). The camera starts high and top-down, then tilts and flies along as the crimson route draws from pin A to pin B.
- The roads follow a maps-app hierarchy (yellow freeways, cased white arterials, white streets), with varied building lots and heights, and the last leg climbs a switchback hill road.
- Opaque glossy pins drop with a squash, a contact shadow that grows as they fall and squashes on impact, and a ripple. When pin B lands, a white-hot light pulse runs the whole route and a local bloom flares on the ground under pin B. A route-time chip springs out of pin B, and the finished route holds for about 1.7 s.
- The type exits, then the camera dives into pin B and an iris opens out of the pin onto footage of the destination (a zoom-through, no dissolve).

All type is DOM, pinned to projected 3D points, so it's razor sharp.

CONFIG fields:
- `from` / `to`: `name` (the big pin label) and `at` (map units; x east, z south).
- `chip`: `time`, `dist` and `note`, the route chip text.
- `route`: three polylines (freeway, boulevard, hill road). The roads are drawn from the same points, so the route always runs on a road.
- `districts` / `sea`: the small spaced-caps map labels and the ocean label.
- `colors`: `route`, `routeEdge`, `pin`, `land` and `water`.
- `timing`: when each beat happens:
  - `grow` / `full`: the minimap transition;
  - `pinA`, `drawStart`, `drawEnd`, `pinB` and `chip`;
  - `pulse`: the light pulse along the route;
  - `out`, `dive` and `fade` (the iris starts) plus `wipe` (its length): the exit;
  - `end`.

## Variant B: `b/index.html` (9:16, 1080x1920, 5.67 s)

"Game-map route". A textured paper game map of our own drawn wilderness: shaded relief with drainage gullies, hachures, contour lines, forest stipple, teal water and paper grain, rendered at 2x. The map drifts slowly the whole time, with the overlay floating a little faster (parallax). Over it:
1. A blue start flag plants, and a navy route of lit white beads steps on bead by bead.
2. A big tapered, glowing cyan arrow sweeps in.
3. A bevelled red block arrow slams in from off-frame onto the target.
4. A lit red ring swings onto the target, and on its lock the title slams on with a warm summit bloom (the payoff, about 2.8 s).
5. The map pushes in on the target (the other names clear first), and the ring opens into an 836 px window onto footage of the place (hikers on the mountain, at 1.0x so it stays sharp). The map dims to a graded bed around it, and the arrows pull out of frame.
6. The piece ends on that window. There's no full-frame footage, because 9:16 full frame would upscale a 16:9 shot.

Text and key objects stay inside the Shorts safe zone.

CONFIG fields:
- `target`: `name` and `at` (frame px).
- `start`: the flag position.
- `route`: the bead path's points.
- `cyan`: the four cubic Bezier points, tail to tip.
- `red`: `tip`, `angleDeg` and `length`.
- `places`: map labels (`water: true` for lake text).
- `porthole`: `center` and `radius` (default (504, 900), 418), where the ring opens to.
- `colors` and `timing`: `labels`, `flag`, `beads` / `beadStep`, `cyan` / `cyanDur`, `red`, `ring`, `lock` (the title slam), `push` / `pushEnd`, `port` / `portDur` (the window opens), and `end`.

## Render

```
cd a && npx hyperframes render . -o out.mp4      # 16:9 with footage
cd b && npx hyperframes render . -o out.mp4      # 9:16 with footage
```

This is a `full` component: it always shows footage, and `bg:none` keeps the footage.

## Swap in your own clip

Change the `src` of the `<video>` tags, keeping `class="clip"`, `muted`, `playsinline`, and `data-start` / `data-duration` / `data-media-start` within the clip's length:
- **A:** `#shotA` is the gameplay shot before the map (its HUD minimap sits at x 22–288, y 880–1052; the map grows out of that rectangle, so set CONFIG timing `grow` / `full` and the `MM` rect in the script if your minimap sits elsewhere). `#shotB` is the destination shot after the dive (default `v28-tennis-mansion-h`; use a bright, sharp shot).
- **B:** `#pv1` plays inside the window to the end. Use a `-h` (16:9) shot: it sits at no more than 1.0x inside the window, so it stays sharp. Keep its `data-start` = `timing.port`, and keep `timing.end` - `timing.port` within the clip's length.

## Keywords

map route, GPS route, porthole reveal, window reveal, iris reveal, route draw on, google maps style, map pins, location pin drop, travel route, 3D map, tilted map, flyover, Los Santos map, game map, RDR2 map, dotted route, map arrows, destination marker, push in on map, Shorts map
