# 11 Reaction cutaway

The cut every GTA creator makes: gameplay with the facecam docked in a corner, then a hard cut to the full-frame webcam for the
reaction, then back to the game. Long-form (A, 16:9) and Shorts / TikTok (B, 9:16, the centre-band + blurred-fill layout).

- **A "Webcam cut"** (`a/index.html`, 1920x1080, 5.2 s): hard cut on the impact, snap punch-in on the face with shake and an
  exposure lift, a 3D "NO WAY!" that slams in and ignites to gold, whip-pan back to gameplay with the facecam riding in.
- **B "Vertical reaction"** (`b/index.html`, 1080x1920, 5.2 s): the band hard-cuts to the webcam, springs open to a 1080
  square (webcam at native 1:1), shake + punch, the same 3D word, whip-pan back as the band collapses.

## CONFIG (top of each file's script)
- `word`: the reaction word (A-Z, 0-9, space and `. , ' ! ? -`). Rendered as extruded, bevelled Three.js geometry from the
  Archivo outlines in `media/glyphs.js`.
- `type`: `size` (px), `maxInk` (px, the word shrinks to fit), `tracking` (em), `cx` / `cy` (cap-centre position).
- `word3d`: `depth`, `bevel` (px), `tilt` (rad, the top leans back), `edge` (ink outline px), `ink`, `shade` (contact shade).
- `colors`: white-enamel face/sides and the gold it ignites to.
- `face`: the punch-in origin in webcam pixels (put it on your head). `punch`: peak / settle / drift scale and shake amplitude.
- B only: `band.h` (the 16:9 strip height) and `band.open` (the square it opens to).
- `timing`: `cut` (hard cut), `punch` / `land` (punch + word slam), `ignite` (turns gold), `whip` + `whipDur`, `end`.

## Swap in your own clips
- Gameplay: the `<video>` elements `g1` (before the cut) and `g2` (after the whip); B also has their blurred fills `gf1` / `gf2`
  (use the same clip, or a 9:16 crop of it). Keep `data-media-start` + `data-duration` inside the clip's length.
- Webcam: `boxCam` (the docked facecam), `camFull` (the cutaway) and in B `camFill`. Use the same file and keep
  `data-media-start` equal to `data-start` so the speech runs on across the cut. Then set `CONFIG.face` to your head.
- Move `timing.cut` to the frame your gameplay moment hits.

## Render
```
cd a && npx hyperframes render . -o out.mp4
cd b && npx hyperframes render . -o out.mp4
```
This is a full-kind component (it is a treatment of your footage), so there is no transparent version; `bg:none` keeps the footage.

Keywords: reaction cutaway, facecam cut, webcam full screen, punch in, zoom on face, reaction word, NO WAY, whip pan, whip
transition, streamer reaction, GTA 5, GTA Online, Shorts blur fill, vertical gameplay layout.
