# 36 · Ranking board: decisions

## Evidence (both variants)
`yt-ruZbW4MphOk` (27.6M-view Short, "Ranking the Funniest GTA Situation draw"), frames t00000 → t00052.5:
- **Job:** a 1–5 rank column that sits on screen for the whole countdown and fills in, one rank per clip, as each clip finishes (5 at t00000, 4 at t00016.5, 3 at t00027, 2 at t00033, 1 at t00046.5).
- **Where / size:** left edge (~2 % in), rows at 34 / 43 / 51 / 60 / 68 % of frame height (~163 px apart on 1920), cap height ~3 % of frame height, filled rows reach ~30 % of frame width.
- **Look:** heavy geometric sans "1." … "5." with coloured numerals (1 yellow, 2 red-pink, 3 slate blue-grey, 4–5 white), white percentages, thin black outline + soft shadow, no box.
- **Motion:** none. The empty numerals sit there from the start and each percentage cuts on after its clip. Rough: default font, jaggy outline, no material, no state change.

## Variant A: rank column (9:16, 1080×1920, 7.5 s)
**Our upgrade.** The same left-edge column at the evidence's rows (y 650 / 813 / 976 / 1139 / 1302, ink-left at x 72), each row = coloured numeral "N." + a thumbnail slot + percentage.
- **Numerals:** Inter 900, 88 px (cap ≈ 64 px, a touch bigger than the evidence's ~58), evidence colours refined as 4-stop lacquer ramps with a lit top (gold for 1, red-pink for 2, slate for 3, white for 4–5), a 12 px ink outline and a soft drop shadow from a separate ink layer (no box).
- **Slots are real 3D tiles (Three.js, lesson 24):** 184×104 rounded slabs, 14 px thick, bevelled metal rims in the rank colour (polished gold for 1, anodised red, slate, silver), clearcoat faces under a PMREM studio env + key + hemisphere, ACES. Face-down side = graphite enamel with a rank-coloured "?"; face-up side = a still of that rank's clip. Each tile casts a soft contact shadow on the footage.
- **State change per reveal:** at the cut after a rank's clip, its tile winds up (lifts 5 %, tips back 6°), flips 180° about Y with a back.out overshoot, travels toward camera mid-flip (scale 1.16) and lands with a 2-frame squash; a soft specular band rakes across the clearcoat; the numeral kicks (1.14 → 1, elastic); the percentage rolls up out of an overflow window and counts up in tabular figures.
- **Payoff (#1, 4.10 s):** the gold tile flips bigger (1.24 peak, settles at 1.1), the gold rim flares (3-frame peak), the key light rakes across, a localized gold bloom swells behind the row, "1." and "100%" are gold with a specular sheen sweep, "100%" locks with a punch, footage takes a small shake (flash 0).
- **Entrance / exit:** rows slide in from the left edge top-to-bottom (back.out, CSS blur 10 → 0, opacity 1 within 0.06 s) while tiles swing in from edge-on; ranks 5 and 4 arrive already filled (the countdown is mid-way). Exit bottom-up: tiles turn edge-on and shrink into the edge while type wipes into the left edge; no fades.

**Shots and cuts (-v):** v26 bridge explosion 0–1.45 (#3's clip) → v32 skydive 1.45–2.65 (#2) → v30 street explosion 2.65–4.10 (#1) → v11 yacht 4.10–6.10 (bright hold) → v36 hills 6.10–7.5.
**Payoff:** 4.10 s flip, hero ≈ 4.55 s.

## Variant B: rank board (16:9, 1920×1080, 7.5 s)
**Our upgrade.** The same five ranks laid out horizontally along the top of a long-form frame (title-safe, y 72–252): five slots, each = coloured numeral "N." beside a 208×117 3D tile, percentage centred under the tile. Same tile system, numerals, percentages and payoff as A; slots drop in from above (tile tips down from 80° on X with back.out) left to right, and each reveal is the tile flipping over on Y. #1 is the leftmost slot (reading order 1 → 5, as the evidence column reads top → bottom), so the countdown fills right to left and pays off on the left.
**Shots (-h):** same edit as A. **Payoff:** 4.10 s, hero ≈ 4.55 s.

## Round log
- r01: first build. Self-review before the critic: plaques turned slightly toward frame centre at rest (A 7°, B a shallow arc ±9°) so the bevels and walls read as objects even when held; metal bezels thickened (5 px bevel + 5 px lip, 18–20 px thick); specular band narrowed (it washed the photo); face-down plaques darkened to black enamel; #1 percentage delayed until the gold slot has landed (it was colliding); B numeral gap 24 px and #1 slot nudged right; a damped ripple knocks through ranks 2–5 when #1 locks in.
- r01 verdict: v0 8 (locked), v1 7: the arc yaw read as crooked plaques against straight type, #1 crowded its neighbours at the peak, 52 px percentages, centred count jumped, payoff light invisible on the bright sea.
- r02 (v1 only; v0 locked and untouched): board squared (no rest yaw, idle drift cut to 0.012–0.015 rad, duplicate drift line removed); a glint pass runs along the settled board at 5.55 s to keep the gloss alive with light instead of motion; slot 1 gets 10 % extra room and the gold slot grows from its top-left corner (bump 0.04, lift 40 px) so "1." and "2." keep their gaps; percentages 60 px in a fixed right-aligned box sized to the final figure (the % stays put while digits roll); the payoff light moved into the gold rim (emissive 1.6, 3-frame peak, 0.5 s decay) and the 100 % sheen lands with the punch; B thumbnails re-cropped 1.3× on the action and lifted (+exposure, less edge darkening) so they read at 640×360. Layout 80 px numerals, 204×115 slots, 38 px gaps (x 114–1806).
- r02 verdict: v0 8, v1 8, no defects: PASSED (sticky).
