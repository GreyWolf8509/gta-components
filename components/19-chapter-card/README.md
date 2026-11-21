# 19 Chapter card

The section marker between parts of a GTA video: "ATTEMPT 2:", "10 SECONDS LATER", "DAY 3". Creators drop it between attempts of a challenge or stunt (long-form and Shorts) and as the time skip in a Short.

- **A (`a/`, 16:9, 4.25 s): Full card.** Gameplay dims, blurs and pushes in; "ATTEMPT 1:" slams on in big white 3D enamel caps; the number is a counter drum that rolls 1 -> 2, locks and floods yellow; a slanted wipe hands back to gameplay.
- **B (`b/`, 9:16, 4.06 s): Time skip.** The clip freezes, dims and blurs; "00 / SECONDS LATER" slams on, the counter fast-forwards to 10 and locks in yellow, and the card rushes at the lens into the next clip. In and out in 1.44 s.

The lettering is real Three.js geometry (`media/card3d.js`, extruded Archivo outlines from `media/glyphs.js`).

## CONFIG

A (`a/index.html`):
- `text`: the line; `#` is the counter drum (e.g. `"ATTEMPT #:"`, `"DAY #"`, `"ROUND #"`).
- `from`, `to`: the drum shows `from`, rolls to `to` (single digit, 0-9) and locks.
- `type`: glyph set (`wide` / `narrow`), size, `maxInk` (auto-fit width), tracking, centre `cx`/`cy`, extrusion `depth`, `bevel`, `tilt`.
- `colors`: `white` (face, walls), `state` (the locked yellow metal: face stops + `facePos`, lip, walls, hot band), `glow` (the warm bounce, rgb).
- `bed`: brightness, contrast, saturate, blur, shade, push of the footage under the card.
- `timing`: dim, letter `in` / `stagger` / `inDur`, `tick` / `rollDur`, `out` / `wipeDur`, `end`.

B (`b/index.html`):
- `number`: `"##"` (two drums), `from`, `to` (0 -> 10: the units spin a full turn, the tens carry).
- `caption`: the line under the number (`"SECONDS LATER"`, `"MINUTES LATER"`, `"HOURS LATER"`).
- `type.num`, `type.cap`: glyph set, size, max ink width, tracking, depth, bevel, tilt; `blockCY`, `gap`.
- `freeze`: the freeze time `at` and its grade (brightness, contrast, saturate, blur), `punch`, `push`, `shade`.
- `timing`: `in`, `stagger`, `inDur`, `spin`, `spinDur`, `out`, `outDur`, `end`.

## Render

```
cd a && npx hyperframes render . -o out.mp4
cd b && npx hyperframes render . -o out.mp4
```

`bg: "none"` hides the sample footage and renders the card (with its shade and glow) on a transparent background: `npx hyperframes render . --variables '{"bg":"none"}' --format webm -o card.webm`.

## Your own clip

- A: replace `#s1` (the clip under the card; keep `data-duration` within the clip's length) and `#s2` (the clip the wipe reveals).
- B: replace `#s1` (the clip that freezes), regenerate `media/freeze.jpg` from the frame right after `#s1` ends (`ffmpeg -i clip.mp4 -vf "select=eq(n\,60)" -frames:v 1 media/freeze.jpg` for a 2.0 s in-point at 30 fps), and replace `#s2` (the clip "later").
- New letters: `media/gen-glyphs.js` regenerates `media/glyphs.js` (needs fontkit).

## Keywords

chapter card, section title, attempt counter, attempt 2, time skip, 10 seconds later, day counter, odometer, rolling number, 3D title, freeze frame, wipe transition, GTA 5, GTA Online, RDR2, Shorts
