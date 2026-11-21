# 21 Speed lines

Anime speed streaks from the frame edges for the fast or hype beats of a GTA video: a climb, a skydive, a flight, a chase or a big jump. Top long-form GTA 5 creators lay a white speed-line overlay over these moments. Shorts use the same overlay, often tinted. This version is drawn live: vector spikes in three depth layers converge on the subject. They slam in on the beat, re-hit on each cut and retract off the edges at the end.

- **A, `a/index.html` (16:9, 1920x1080, 5.65 s): radial streaks.** White, with a soft fade to a sharp tip and an ice-blue bloom. Cruise state, a wind-up, then the slam on the cut at 1.70 s with a punch-zoom, an edge zoom blur and a hot bloom.
- **B, `b/index.html` (9:16, 1080x1920, 5.55 s): vertical streaks for Shorts.** Weighted to the top and bottom edges. Two-tone caption-yellow streaks with white cores, a quick ramp-up on the beat at 1.60 s, and white-hot for 3 frames.

## CONFIG (top of the script in each file)
- `shots[]`: one per `<video>` pair (`s#` is the shot, `z#` is its zoom-blur copy). Each has `start`, `dur`, `focus: [x, y]`, the subject as a 0-1 fraction of the frame the streaks converge on, and an optional `to: [x, y]` to track a moving subject.
- `lines.color`: the streak colour.
- `lines.tint`: a body tint for two-tone streaks with a white core, or `null` for pure white.
- `lines.glow`, `lines.glowOpacity`: the bloom behind the streaks.
- `lines.shade`, `lines.shadeOpacity`: a soft dark halo that keeps the streaks legible on bright sky (`null` for none).
- `lines.cruise`: density before the beat.
- `lines.clear: [rx, ry]`: the clear zone around the subject.
- `lines.bottom`: thins the streaks along the bottom edge.
- `lines.vertical`: bias towards the top and bottom edges.
- `lines.layers.{haze, mid, front, near}`:
  - count `n`, base width range `w`, alpha range `a`, life in frames `life` and length jitter `len`;
  - `travel`: px a streak rushes inward over its life;
  - `detach`: the streak leaves the edge and flies in as a needle;
  - `near` is a defocused corner layer that only exists in the burst.
- `timing`:
  - `in`: the streaks shoot in;
  - `beat`: the slam, so put it on your cut or drop;
  - `kicks[]`: smaller re-hits on later cuts;
  - `out`: the streaks retract off the edges;
  - `end`.
- `footage`: `punch` (zoom on the beat), `shake` (px), `push` (slow zoom per shot) and `zoomBlur` (0 turns off the edge zoom blur).

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent streaks only
cd a && npx hyperframes render . -o out.mp4                                                 # over the sample footage
```
Variant B is the same, from `b/`.

## Use your own clip
Replace the `src` of each `s#` video and its `z#` copy, keeping their `data-start`, `data-duration` and `data-media-start` identical. Set each shot's `focus` on your subject, and set `timing.beat` to your hit. For a transparent overlay you drop on your own edit, render `bg:none` and line up `timing.beat` with your cut.

Keywords: speed lines, anime speed lines, manga lines, concentration lines, focus lines, radial streaks, zoom lines, hype overlay, GTA 5 montage, skydive, flight, chase, Shorts.
