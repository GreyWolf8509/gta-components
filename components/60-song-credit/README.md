# 60 Song credit

The track and artist credit a creator drops in when the music changes. Two HyperFrames projects:

- `a/` **Now playing** (16:9, 1920x1080, 6.9 s, long-form). Lower-left: a real 3D record slides out of its album sleeve
  and spins at 33 1/3, the title and artist pull out from under it, a gold `NOW PLAYING` kicker with a live 4-bar
  equaliser. Exits by tucking the text back under the record and sliding the sleeve off the left edge.
- `b/` **Track tag** (9:16, 1080x1920, 7.55 s, Shorts / TikTok). Near the top: a real 3D record with a chrome tonearm that
  swings in and drops the needle; on touchdown the equaliser comes alive and the title rises, then scrolls as a marquee.

Both are overlays: `bg:"none"` renders a clean transparent layer (no footage, grain or vignette).

## CONFIG (top of each `index.html`)
- `title`, `artist`, `kicker`, `side` (label print). B also has `labelTitle` (short title printed on the label).
- A: `anchor` (sleeve left edge and vertical centre; default lower-left above the minimap), `sleeve` (size px), `cover` (your own square cover image, or null for our art), `rpm`, `colors`, `timing`.
- B: `disc` (record centre and radius), `text` (tag left, right limit, top), `marquee` (start and end of one full loop,
  edge fade), `rpm`, `colors`, `timing` (`touch` is the needle drop).
- The sleeve and label art are drawn in `media/vinyl3d.js` (`Vinyl3D.drawSleeve`, `Vinyl3D.drawLabel`); swap the
  canvas for your own cover image if you have one.

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                  # over the sample footage
```
Same for `b/`.

## Your own clip
Replace the `<video class="clip shot">` elements (keep `id`, `muted`, `playsinline`, `data-start`, `data-duration`,
`data-track-index`, `data-media-start`), or render `bg:"none"` and lay the webm over your edit.

## Keywords
song credit, now playing, music credit, track name, artist credit, vinyl, record, album sleeve, turntable, tonearm,
needle drop, equaliser, marquee, lower third, Shorts track tag, GTA 5, GTA Online, GTA RP montage music.

All names (Mara Solace, "Coastline Ghosts") are fictional; the art is our own.
