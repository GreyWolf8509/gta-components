# 66 Time-passing clock

A big analog clock over your footage whose hands race forward through the hours, then lock onto the new time. Use it when a challenge, RP shift or grind skips ahead: "6 hours later", "by sunset", "all day grinding". Long-form (A, 16:9) and Shorts / TikTok (B, 9:16).

- **A, Clock face (1920x1080, 5.85 s):** the clock centred over gameplay at the evidence's size (36% of the width). 3:00 PM to 8:00 PM.
- **B, Clock for Shorts (1080x1920, 6.1 s):** the same clock at 69% of the width in the upper area. 2:00 PM to 9:00 PM.

It's a real Three.js object: black-ceramic bezel with polished steel lips, a frosted-glass dial the footage blurs through, applied 3 / 6 / 9 numerals, a 12 o'clock triangle and bars that cast shadows, faceted black-chrome hands with a comet motion trail, and a digital readout mounted on the crystal above the hands. The light on the clock moves with the time of day. At the lock-in the face lamp switches on.

## CONFIG (top of each `index.html`)
| Field | What it does |
|---|---|
| `start` | Clock time at the start, 24 h (`{h: 15, m: 0}` = 3:00 PM) |
| `hours` | Whole hours the hands sweep; the landing time is `start + hours` |
| `ampm` | Readout suffix (`"PM"`) |
| `clock` | `x`, `y` centre, `r` dial radius, `bezel` width (px) |
| `numeralCap` | Height of the applied 3 / 6 / 9, as a fraction of `r` |
| `readout` | Digital window `w`, `h`, `cy` (fractions of `r`) and `fs` (font size / window height); the digits auto-fit |
| `accent` | Minute-hand tip colour |
| `timing` | `in`, `spin` (spin start), `spinDur`, `out`, `end`; the lock-in is at `spin + spinDur` |

Keep the landing time's hands clear of the readout (8:00, 9:00, 10:00, 2:00, 3:00, 4:00 are clear; at 6:00 and 7:00 the hour hand sits under it).

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                    # with the sample footage
```
Same in `b/`. In the transparent render the dial is a translucent white disc. Over your footage in an editor it reads like the evidence's translucent face. The blurred-glass look only exists in the plate render, because it blurs the footage behind it.

## Your own clip
Replace the `<video class="clip shot">` elements in `index.html` with your own clips (keep `id`, `class="clip"`, `muted`, `playsinline`, `data-start`, `data-duration`, `data-media-start`, `data-track-index`). The sample cuts land on hour passes (A: 1.535 s = 4 PM, 2.199 s = 6 PM, 3.25 s = 8 PM lock-in). The engine is `media/clock3d.js` with Archivo outlines in `media/glyphs.js` (regenerate with `media/gen-glyphs.js`).

**Keywords:** time passing clock, hours later, time lapse clock, spinning clock hands, analog clock overlay, 3D clock, GTA time skip, challenge timer, RP shift clock, sunset time lapse.
