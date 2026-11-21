# District pop-up (gta/45-district-popup)

A place name that writes on in a bottom corner when the scene moves to a new area: the script location tag GTA creators put
on establishing shots ("Los Santos", "Vinewood Hills", "Grove Street"). Long-form (A, 16:9, bottom-right) and Shorts
(B, 9:16, big two-line version in the lower safe zone).

The script is real 3D gold lettering (Three.js), written by a hot pen tip, locked in by a swash with a light rake, then a
small district line rises under it. It un-writes on exit.

## CONFIG
A (`a/index.html`): `place`, `district`, `font` ("brush" / "allure"), `right` / `baseline` / `size` (px), `stroke`
(thick / thin / swash widths in em), `swash` (from / to as fractions of the ink width, `dy` under the baseline, `bend`),
`ink` (bronze edge px), `sub` (district line top / size), `colors` (gold, goldDeep, hot, shadow, ink; B also pale, amber, spec), `timing`
(write, writeDur, swash, swashDur, out, outDur, end; seconds).
B (`b/index.html`): `lines` (two script lines), `district`, `font`, `left` / `right` / `baseline[2]` / `size`, the rest as A.

Any Latin text works: the glyphs are single-line script strokes in `media/script-glyphs.js` (EMS Brush / EMS Allure, plus
EMS Decorous Script in `b/`; SIL OFL 1.1, see `media/OFL-EMS.txt`). B's `media/script3d.js` lights all strokes as one
relief (foil-gold bands), so crossings merge like ink.

## Render
- Transparent overlay: `cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm`
- With the sample footage: `cd a && npx hyperframes render . -o out.mp4` (same for `b`).

## Your own clip
Replace the `<video>` sources in `#push` with your clip (keep `class="clip"`, a unique id, `data-start`,
`data-duration`, `data-track-index`), or render the transparent overlay and lay it over your edit at the cut into the
new location.

Keywords: location tag, place name, district name, area title, script title, establishing shot, GTA 5, GTA Online, Los Santos.
