# 56 Earth zoom

The "zoom from space down to the location" establishing move. A real Three.js globe on NASA Blue Marble imagery (day side,
city lights on the night side, ocean glint, atmosphere, a turning cloud layer) dives in one continuous log-altitude zoom onto
southern California and down onto the Los Angeles basin (30 m Landsat, sharp all the way), where small in-game style
district labels sit on the real city. The dive falls into a cumulus cluster over downtown, the cloud breaks open at the
landing spot onto real Los Santos footage (the hills over downtown, 1.0x): a glossy 3D map pin drops onto the skyline and
the place name springs out under it.

- **Long-form (a/, 16:9 1920x1080):** opening a video or a new location chapter ("we're going to Los Santos").
- **Shorts (b/, 9:16 1080x1920):** same dive, phone-first: the globe fills ~85% of the width, labels and title sit in the
  9:16 safe zone, the pin is ~40% of the frame width, and the landing is the wide vertical v36 skyline shot, full-bleed.

Kind: full (it is a treatment of footage; it always shows footage). Duration 6.47 s, 30 fps.

Imagery: NASA Blue Marble Next Generation (Reto Stöckli, NASA Earth Observatory), Black Marble 2016, the Blue Marble
cloud composite and Landsat WELD 2000 (USGS/NASA, via NASA GIBS), all public domain; files in `media/`, sources in
DECISIONS.md.

## CONFIG (top of each index.html)
- `place.name`, `place.kicker`: the landing label (default "Los Santos" / "San Andreas").
- `target`: `[lat, lon]` the dive lands on (default downtown LA, which Los Santos stands in for). The close-in textures
  cover lon -140..-92 / lat 12..52 (`wna_mid`), lon -123..-113 / lat 29.5..38.5 (`socal_detail`) and lon -118.95..-117.75 /
  lat 33.55..34.45 (`la_city`, 30 m); a target outside them still works but goes soft in the last second.
- `city`: the closest texture level (`src`, `water` mask, `box` = `[lon0, lon1, lat0, lat1]`). Default: 30 m Landsat of the
  LA basin. Drop in your own top-down map capture (an in-game map screenshot works) with its box to land on that instead.
- `start`: `[lat, lon]` the camera looks at on frame 0. `sun`: `[lat, lon]` of the sub-solar point (sets the terminator).
  `spin`: degrees the planet turns over the opening.
- `pin`: `screen` (where the pin's tip stands, px: put it on the place in your landing shot), `height` (px), `color`.
- `cam.fov`, `cam.alt` (log-altitude keys `[t, altitude in planet radii, slope]`), `cam.swing` (seconds over which the view
  swings from `start` to straight down over `target`), `cam.aim` (seconds over which the dive's vanishing point slides
  from frame centre onto `pin.screen`).
- `deck`: the cumulus field `base`/`top` heights and cell `size`, and the `tower` we fall into (`r` radius, `top`,
  `off` offset from the target, `skirt` height), in 1/1000 planet radius.
- `labels`: `px` (size), `safe` (title-safe box, px), `list` of `{ t, ll: [lat, lon], at: s, water }`. Each label is pinned to
  its place on the globe, rises in at `at` and leaves by itself before it would cross `safe` or be swallowed by the tower
  (a label that would get under 0.45 s is skipped). `water` gives the italic sea style.
- `timing`: `swap` (full cloud cover; the globe goes off and the landing shot is under the cloud), `part`..`partEnd` (the
  cloud breaks open from the pin), `land` (pin impact + title), `out` (exit), `end`.

## Render
```
cd a && npx hyperframes render . -o out.mp4
cd b && npx hyperframes render . -o out.mp4
```

## Your own clips
- Landing: replace the `src` of `#shotLand` (an -h shot in a/, a wide -v shot in b/). It must start 2+ frames before the
  break-out opens (`part` + ~0.1 s, under the cloud) and its `data-duration` must stay within the clip's length; set `end`
  (and both `data-duration`s) to where it ends and `out` ~0.16 s before. Move `target` to the place you land on (and its
  `labels`) and `pin.screen` onto the place in your shot.

Keywords: earth zoom, globe zoom, zoom from space, google earth style zoom, satellite dive, cloud dive, location reveal,
map pin, district labels, establishing shot, GTA 5, Los Santos, San Andreas, Three.js globe, NASA Blue Marble.
