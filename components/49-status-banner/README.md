# Status banner (49)

The full-width result banner GTA creators drop on a moment: **CHALLENGE PASSED** for a win (long-form, 16:9) and **WASTED** for a fail (Shorts, 9:16). The footage drains of colour, a smoked-glass band splits open, and the status line lands as real 3D lettering (our own Archivo type, not Pricedown).

- `a/` Passed banner, 1920x1080, 5.8 s. The letters flip up into the band, then a gold light sweep rakes the metal and paints the colour back into the shot.
- `b/` Wasted banner, 1080x1920, 4.16 s. A hit, a speed ramp into slow motion, a hard black-and-white drain, then WASTED slams out of the lens, stops dead on its mark (squash, band flex, rule flare, hot lacquer cooling), takes a raking light and collapses into its line.

## CONFIG (top of each `index.html`)
- `title`: the status line, e.g. `MISSION PASSED`, `BUSTED`, `HEIST FAILED`. Letters A-Z, digits, space and `. , ' ! ? - & : # $ +`.
- `sub` (A): the white line under it (`<b>` = gold); `""` hides it.
- `tracking`: extra letter spacing in font units.
- `face` / `lip` / `wall` (`wallMid` in B): the face gradient, the bevel lip and the walls behind it (B: deep red, then black chrome at the back).
- `band`: `{y, h}` in px. `word`: `{x, y, width}` (centre x, cap-centre y, ink width).
- `bloom`: `{strength, threshold}`. `grade` (B): the death grade. `slamFrom` / `squash` / `tilt` (B): the apparent scale the word slams in from, how flat it goes on the contact frame, and the settled tilt that shows its undersides.
- `timing`: every beat in seconds (hit, band, flip or slam, sweep or rake, exit, end).

## Render
```
cd a && npx hyperframes render . -o out.mp4
cd b && npx hyperframes render . -o out.mp4
```
This is a full-kind component, so the footage always shows (`bg` is ignored).

## Your own clip
Swap the `src` of the `<video>` tags and keep their `data-start` / `data-duration` / `data-media-start`.
- **A:** the held shot has 3 layers: colour, a black-and-white copy and a blurred "glass" copy. Make the two copies with
  `ffmpeg -i clip.mp4 -vf hue=s=0 media/clip-bw.mp4` and `ffmpeg -i clip.mp4 -vf gblur=sigma=18:steps=3 media/clip-glass.mp4`.
- **B:** make the slow-motion ramp from real frames (no optical flow, so nothing warps), then a blurred copy for the band. Use a locked-off wide shot; a blend only softens what moves. Dump the clip's frames, then run the script (edit `T_HIT`, `R`, `DUR` at its top to match your timing):
  `ffmpeg -i clip.mp4 frames/f%03d.png && python3 media/gen-ramp.py frames media/ramp.mp4`
  `ffmpeg -i media/ramp.mp4 -vf gblur=sigma=40:steps=3 -c:v libx264 -crf 18 -pix_fmt yuv420p media/ramp-glass.mp4`

Glyph outlines: `media/gen-glyphs.js` (fontkit) writes `media/glyphs.js` from `assets/fonts/Archivo.ttf`.

Keywords: mission passed, challenge passed, wasted, busted, failed, result banner, death screen, desaturate, slow motion, speed ramp, 3D text, gold, GTA 5, GTA Online, RP.
