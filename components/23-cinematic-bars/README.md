# 23 Cinematic bars

Animated letterbox bars for story and character edits: the bars close on a cut, the picture takes a film grade,
a title sits in the black, and the bars open again (bottom first) when the sequence ends.

- **A, `a/index.html` (16:9, 1920x1080, 5.3 s):** 2.39:1 bars for long-form cold opens, story beats and title
  sequences. Gold kicker in the top bar, chrome title in the lower bar.
- **B, `b/index.html` (9:16, 1080x1920, 5.2 s):** vertical-edit bars for Shorts / TikTok story edits. Thin always-on
  bars (190 px each, the Shorts look) that slam deeper (380 px) into a chapter card on a cut, carry the kicker and title
  in the top bar inside the safe zone, then relax back to thin and stay on.

## CONFIG (top of each file)
- `kicker`, `title`: the two lines of type ("" hides one).
- A: `ratio` (2.39, 2.0, 1.85 ...) sets the bar height. B: `thin` (always-on depth) and `chapter` (title-card depth).
- `titleSize`, `kickerSize` (px); B also `maxWidth` (title auto-fits).
- `tracking.from` / `to` / `drift` (em): tracks in wide -> settled, then drifts out over the hold; `kickerTracking`.
- `accent` (kicker gold); `overshoot` (px the bars travel past the line when they slam).
- `grade.amount` (0 = no grade shift), `grade.sat`, `grade.vignette`.
- `timing`: barsIn, cut (the slam), titleIn, flare (light on the title), titleOut, barsOut, end.

## Render
```
cd a && npx hyperframes render . -o out.mp4                                   # with the sample footage
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o bars.webm   # bars + type only, transparent
```
Same for `b/`.

## Your own clip
Replace the `<video class="clip shot">` sources in `#grade` (A) or in `#grade` / `#band` (B) with your clips in
`media/`, keeping `data-start`, `data-duration` and `data-media-start` inside each clip's length, and move
`timing.cut` / `timing.barsOut` onto your cuts. Or render `bg:none` and lay the transparent bars over your edit.

Keywords: cinematic bars, letterbox, black bars, 2.39, anamorphic, movie bars, story edit, chapter title, GTA 5, Shorts.
