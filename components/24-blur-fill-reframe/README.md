# 24 Blur-fill reframe

The Shorts reframe: a horizontal 16:9 clip placed on a vertical 9:16 canvas, with the empty space filled by a blurred,
enlarged, darkened copy of the same clip instead of black bars. Creators use it on almost every gameplay Short and
TikTok cut down from long-form footage. Both variants are 1080x1920, 30 fps, kind `full` (they always show footage).

- **A, Blur fill** (`a/index.html`, 5.7 s): the clip plays on the face of a real 3D slab (Three.js: machined graphite
  bezel, polished rounded chamfers, 60 px thick, reflections of a studio and of the shot itself), a 1:1 crop of the 16:9
  clip by default (4:3 and 16:9 in CONFIG), floating over a dark, graded blur of the same clip. It opens tilted in 3D,
  swings flat and seats on the first cut, and a light rakes along the top chamfer with bloom on the metal. Every later
  cut jolts the slab and defocuses the bed; it tips back to its opening pose on the last frame, so it loops.
- **B, Split stack** (`b/index.html`, 5.93 s): gameplay on top, the creator's cam underneath, both on one 3D slab
  (1040x1274, a slim lit edge: 3 px ring + 5 px polished chamfers) split by one seam, over a blur of each clip, with a
  tab notched into each pane's top-left corner ("IN GAME", "@everestchris6"). The slab swings in tilted and lands flat on
  the lock cut; a polished rod grows out of the seam's slot from the centre and hits the bezel on that frame (squash,
  overshoot), the rod flares and light runs out along the side rails. It stays seated to the end; the tabs retract.

## CONFIG
A:
- `shots` `[{id, cut, focusX}]`: each shot's <video> id, the time it takes over, and where the crop centres.
- `slab` `{width, aspect, centerY, radius, bevel, ring, depth}`: size, crop of the 16:9 clip ("16:9", "4:3", "1:1"),
  centre line, corner radius, chamfer size, flat bezel width and thickness. `metal` `{ring, chamfer}`: the two metal colours.
- `bed` `{blur, brightness, contrast, saturate, grain}`: the bed grade (keep contrast >= 1.1 and brightness <= .7).
- `open` `{x, y, z, rx, ry, rz}`: the tilted opening pose; `settle`, `kick`: the seat spring and the per-cut jolt.
- `rake` `{dur, power, bloom}`: the light rake after the seat. `timing` `{land, close, end}`.

B:
- `topLabel`, `bottomLabel`: the tab words (bottom defaults to the creator handle).
- `shots` `[{id, cut}]`: the gameplay shots; `cam` `{id, scale, focusX, top}`: the face crop (focusX is the source x at
  the pane centre; 700 puts the face right so the tab sits on the background).
- `slab` `{width, top, bottom, seamY, radius, bevel, ring, depth}`; `divider` `{height, bevel, proud}`; `metal`.
- `open`, `settle`, `kick`: the tilted opening pose, the landing spring, the per-cut jolt.
- `rake` `{dur, power, bloom}`; `timing` `{grow, lock, tabTop, tabBot, tabsOut, end}`: put `lock` on a cut or a hit in
  your gameplay; `grow` is how long the rod takes to reach the bezel.

## Swap in your own clip
Each shot is one `<video>`: it is the blurred bed, and its frame is drawn onto the slab's face every frame. Change its
`src`, and list its id and cut time in `CONFIG.shots`. Every shot after the first starts 2 frames before its cut
(`data-start = cut - 0.0667`; it stays hidden until the cut) so its frame is ready on the cut frame. Keep
`data-media-start + data-duration` inside the clip's length. Use 16:9 sources.

## Render
```
cd a && npx hyperframes render . -o blur-fill.mp4
cd b && npx hyperframes render . -o split-stack.mp4
```
(`bg` exists for library consistency; this is a full-frame treatment, so footage always shows.)

## Keywords
blur fill, blurred background, 3D frame, device frame, glass slab, blur bars, vertical reframe, 16:9 to 9:16, Shorts, TikTok, Reels, background blur,
split screen, stacked video, gameplay and facecam, reaction stack, GTA 5 Shorts, GTA Online clips
