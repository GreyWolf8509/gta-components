# 68 Settings label: decisions

## Evidence (both variants)
- Only source: `tt-7649064175435533598` (3.9M, RDR2 graphics-comparison Short), frames t0–t61.5. A setting name in heavy geometric caps (white, colon, 2 lines) sits horizontally centred at the top (9–26 % from the top), and under it the quality level in the same face, colour-coded: LOW red, MEDIUM yellow, ULTRA green (and a lower "HIGH" in red when compared with ULTRA). For water physics a small white superscript slider value (`0/4`, `2/4`, `4/4`) hangs to the right of the level.
- Scale: cap about 4 % of frame height per line; block 50–60 % of the frame width. Soft dark drop shadow, no stroke, no box.
- Motion: the label is fixed; the level word swaps on a hard cut when the footage replays the same action at the next setting (LOW → MEDIUM → ULTRA). No animation between samples. Sometimes a side-by-side split LOW | ULTRA (that format is component 39; not repeated here).
- Rough: default geometric font, flat colour fills, the level just pops, no light, no depth.

## Shared upgrade: the level is real geometry and the change is a flip (DESIGN 24, 19)
`media/level3d.js` (Three.js r160, rendered from timeline time via Look.drive + hf-seek, no rAF).
- **Level words are extruded, bevelled Archivo 900 (wdth 90) glyphs** traced from the font's own outlines (`media/glyphs.js`, generated with `media/gen-glyphs.js`). Each level has its own colour-coded enamel: a 3-stop face gradient (lighter top, deep bottom), a darker side extrusion fading to near-black, a lit bevel lip, clear coat reflecting a studio env (softbox, strip, hot bar, side strip), key + hemisphere light. Post adds a thin dark ink edge round face + extrusion (the creator caption edge) and a soft contact shadow.
- **State change = a flip, not a fade.** Each level step turns the panel about the word's horizontal axis: the old word tips back to edge-on (its real 22–44 px extrusion shows, never a paper-thin card), the switch happens edge-on to the camera, and the new word comes over the top of the same turn and locks with a spring overshoot. Only one word is ever on screen (no stacked labels).
- **Payoff light is localised colour:** on the payoff cut the ULTRA word gets a green-tinted light front sweeping across its glyphs (0.34 s), one soft specular sweep, a 3-frame boost + bloom on the letters, a green radial glow behind the word only (screen blend), a spring scale punch (kick, ~+8 %), a small plate shake (Look.impact, flash 0). No frame-wide light.
- **Footage tells the comparison:** the same shot replays per setting, as the evidence does. The LOW take is the shot with a "low textures" treatment (CSS blur 3.4–4.2 px, saturate .72, contrast .94; static filter per clip), MEDIUM a lighter one, ULTRA the clean shot graded slightly richer. Each incoming take starts 2 frames early underneath (lesson 25). Shot: `v11-yacht` (bright, sharp, colourful; never runs past 2.13 s).
- Type: Archivo 900 wdth 90 caps for names (white, 3–4 px dark edge, soft shadow); Inter 800 tabular for the slider fraction. Two families.

## Variant A: stacked settings (16:9, 4.15 s)
- **Layout:** top-left, the long-form place for a settings readout. Row 0 is the setting being compared and leads at hero size (name 76 px, level cap ~81 px); three supporting rows under it (name 56, level cap ~55): TEXTURES LOW→ULTRA, SHADOWS ULTRA, WATER MEDIUM, GRASS LOW. Names left at x 96; levels share one column (ink edges aligned) 34 px past the widest name. Rows y 176 / 302 / 394 / 486.
- **Tick on row by row** (0.15 s + 0.17 s per row): letters rise in each row's window (14 ms stagger), then that row's level flips in from edge-on and locks with a small kick.
- **Payoff (2.1 s cut, LOW footage → clean ULTRA footage):** the TEXTURES panel winds up two levels in one move (LOW → MEDIUM → ULTRA, MEDIUM flashing past) and locks green on the cut, with the shared payoff light. Hold to 3.62 s; rows flip out top to bottom while the names roll up out of their windows. Hero ≈ 2.45 s.

## Variant B: one setting for a Short (9:16, 5.0 s)
- **Layout (phone-first, DESIGN 26):** name `TEXTURE / QUALITY:` (Archivo 900, 116 px, cap ~80) centred on the level axis x 442 at y 236–436, trailing colon hanging. The level word is the hero: 205 px (cap ~141), ULTRA ≈ 680 px wide (63 % of the frame), MEDIUM fitted to 700 px. Slider fraction (`1/4`, `2/4`, `4/4`, Inter 800 76 px) top-aligned to the level's cap at its right edge; the composite stays inside x 72–936.
- **Beats:** name rises 0.10 s; LOW flips in 0.24 s; cut 1.5 s → MEDIUM (flip + small spec sweep); cut 3.0 s → ULTRA payoff. Fractions roll in their own windows (old out, new in, no overlap). Exit 4.5 s: the panel flips out, the name and fraction roll up out of their windows. Hero ≈ 3.35 s.

## Round log
- r01: first build (flip panels, ease-in tip-back + spring lock so no blank or stacked frames; v0 rows enlarged to hero 82/128 and 60/86). Critic 8/8, no defects or caps: PASSED (sticky). Nitpicks left: v1 ULTRA overshoot grazes the 4/4 for ~3 frames, peak bloom pales the green briefly, v0's MEDIUM flashes past in ~3 frames, LOW hold in v1 ~1.0 s, sample tiers are RDR2-style (LOW/MEDIUM/ULTRA) rather than GTA V's Normal/Very High.
