# 09 Facecam frame

The webcam box over gameplay, the most common layout in GTA streams-turned-videos. Two variants, each its own HyperFrames
project:

- **a/ Corner cam (16:9, long-form).** The cam docked top-right, 48 px from the edges, in a bevelled gunmetal frame with a
  caption-yellow lip, a red LIVE plate and a yellow name plate. It scales out of the corner with a soft bounce, and on a
  reaction beat snaps up to the enlarged size (the "zoom on my face" moment creators cut to), the lip ignites and a light
  rakes across the rim, then it settles back to the dock.
- **b/ Stacked cam (9:16, Shorts / TikTok).** Facecam band across the top 42%, gameplay below, joined by a physical seam
  (gunmetal bar, yellow inlay) with a glossy yellow name pill and LIVE plate on it. On the beat the cam punches in on the
  face, the inlay lights up from the pill outward and the pill takes a press-and-spring hit.

The frame, lip, plates, seam and pill are real Three.js geometry (extruded, bevelled, PMREM-lit); all type is DOM, pinned
to the plates. Everything is seek-safe and renders from timeline time.

## CONFIG (top of each index.html)
- `name`, `live`: the name plate / pill text and the badge word (`"LIVE"` or `"REC"`).
- `colors`: rim / bar metal, lip / inlay, plate top/bottom ramp, LIVE top/bottom ramp.
- a/: `window` (cam window at the enlarged size, 4:3), `rim`, `restScale` (docked size, 0.68), `dock` (edge margins),
  `facecam` (how the clip sits in the window).
- b/: `seamY` (band height), `facecam` (position, face point for the punch-in, `punch` amount), `gameplay` (window fit).
- `timing`: entrance, reaction beat (`react`), return (`back`), exit (`out`), `end`.

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent frame
cd a && npx hyperframes render . -o out.mp4                                                  # with sample footage
```
Same for `b/`. With `bg:none` the cam window (a/) or the band and gameplay (b/) are transparent: lay the overlay on top of
your own edit, with your webcam under the window.

## Your own clip
Swap `assets/plates/facecam-sample.mp4` for your webcam recording in the `#fcv` video (`src`, `data-media-start`) and adjust
`CONFIG.facecam`; swap the gameplay `<video>` sources (`shotA/B/C`). Set `timing.react` to your reaction moment.

## Keywords
facecam, webcam frame, cam border, streamer overlay, reaction cam, zoom on face, split screen, stacked layout, shorts
layout, name tag, live badge, GTA 5, GTA Online, RP
