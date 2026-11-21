# 61 Disclaimer card: decisions

The creators' tongue-in-cheek disclaimer at the top of a mod / story video. Copy is our own joke ("No NPCs were harmed...", "*not real gameplay (sadly)"); it never reads as a legal notice and never claims to come from Rockstar or any company. Overlay kind: `bg:none` is a clean transparent overlay.

## Variant A: Full-screen disclaimer (16:9, 1920x1080, 5.6 s)

**Evidence.**
- `yt-u7AAlXG6INE` t4 (8.4M views): a solid black frame, three centred lines of regular sans at about 4.5% of frame height, lines 1 and 3 white, the middle line red in square brackets; hard cut in and out between intro shots, held a couple of seconds.
- `yt-u7AAlXG6INE` t72 and `yt-c-I-jXpGuOk` t12: the small plain white note version (top-right line, bottom note).
- The vernacular: black card, centred, white + one red bracketed line, hard cuts, a few seconds' hold. Rough: default Roboto, no hierarchy, no heading, no light.

**Our upgrade.**
- Same object, same place: a hard cut from gameplay to a black card, a centred block (y 286-780), white line + the red bracketed middle line kept, hard cut back to gameplay.
- The heading is a real object (DESIGN 11.24): a red enamel warning plate in Three.js, 66% of the frame wide. Rounded slab 40 px deep with a rounded polished-steel bevel, four domed chrome screws, a raised white pinstripe, a raised white enamel warning triangle with its "!" cut through to the red, and "DISCLAIMER" in raised white enamel letters extruded from Archivo's outlines (cap 126 px). Clearcoat enamel reflecting a PMREM studio (a gloss band across the upper face that slides as the plate tilts), a key light, hemisphere fill, HDR bloom, sub-frame motion blur.
- The plate's own red light pools softly on the black (local, never a veil).
- A glossy red rule draws out from the centre (expo.out) with a hot core riding it.
- Line 1 (Inter 600, 54 px, white) rises in word by word through masks.
- **Payoff (1.86 s):** the red punchline "[Okay, a few. They all respawned.]" (Inter 800) stamps down, opaque from its first frame (scale 1.36 to 1 in 0.1 s with blur, then a squash), the plate recoils on a spring, the key rakes across the bevels, one soft specular band crosses the enamel, bloom peaks for 3 frames, the card takes a 5 px hit.
- Hold 3.1 s with a slow living turn and one faint sheen. Exit: the plate rushes at the lens (motion blur) and the lines scale with it by the same perspective factor, then the hard cut to bright footage, which lands with a 1.08 punch.

**Shots.** 0-0.6 `v05-franklin-lamar-street-h` (the story opener) | 0.6-5.0 the black card | 5.0-5.6 `v11-yacht-h` (bright, sharp; starts under the card at 4.9).

**Payoff:** 1.86 s. Hero 2.2 s.

## Variant B: Corner disclaimer (9:16, 1080x1920, 6.0 s)

**Evidence.** `yt-u7AAlXG6INE` t72: "This video is only for entertainment purposes", tiny white sans in the top-right corner, about 2% of frame height, no box, static from 8 s to the end; it disappears against bright sky. The brief: a small persistent top-right line, in after 0.5 s, holds.

**Our upgrade (phone-first, DESIGN 11.26 and 11.7).**
- The same persistent top-right line, legible at 360x640, that makes its entrance big and then docks out of the way.
- The hero object is the same red enamel plate as A (Three.js), one row: the cut-through warning triangle and "MODS USED" in raised white enamel letters (cap 84 px, word gap opened 0.14 em). The line "*not real gameplay (sadly)" hangs under it in DOM type (Inter 800 46 px, 3 px ink stroke, soft shadow), pinned to the plate's projected edge every frame (it follows the plate's scale, perspective and rotation).
- The 3D camera's principal point rides with the plate, so the enamel's reflections and gradient are identical wherever it sits (r01 washed to salmon when docked off-axis).
- 0.5 s: it slams in from the lens with motion blur at 72% of the frame width (centre 504, 520), squash and spring recoil; the line rises in word by word under it (0.74 s).
- **Payoff (2.0 s, on the first cut):** the plate whips into the top-right corner (0.26 s, accelerating, motion blur; the line smears with it) and lands exactly on the cut: a -3 deg / +1 deg rotation overshoot, a push back and a squash, the key rakes across it, the steel rim goes hot and blooms for 3 frames (the bloom threshold rises so the white letters stay crisp), the footage takes a small hit (flash 0).
- Docked: a 445 x 95 px chip (scale 0.57, right edge x 936, top y 238) with the line right-aligned under it at 36 px (12 px at 360x640); the heading is a 48 px cap. Holds to the end with a slow turn and one faint sheen; the soft contact shadow lands on the footage.

**Shots** (2-frame overlaps, earlier shot on top): 0-2.0 `v11-yacht-v` | 2.0-3.68 `v21-race-topdown-v` | 3.68-5.18 `v17-deluxo-sunset-v` | 5.18-6.0 `v45-beach-aerial-v` (bright, sharp, wide).

**Payoff:** 2.0 s. Hero 2.1 s.

## Round log
- r01 self-review before the critic: the payoff specular band and a triangle flare blew the letters and the "!" to white (band amp 1.05 -> 0.5, letters take 0.16 of it, triangle pulse removed (bloom filled the "!"), bloom peaks 0.6 -> 0.26); added a gloss strip to the environment so the enamel shows a real reflection band; the slam was slow on its first frames (power2.in) and now travels at near-constant speed into a hard stop from 1.43x; A's lines now follow the plate's exit zoom exactly with a matching blur (they sat still while the plate rushed).
- r01 verdict: v0 8 (locked), v1 7. v1: the docked sign was the full two-row plate at 0.78 scale (55% of the width, y 238-435) sitting in the hook band; the enamel washed to salmon off-axis; the sheen at 1.0 s was not a state change and the dock landed mid-shot.
- r02 (v1 only; a/ untouched): one-row chip + hung DOM line (docked block 445 x 147 px instead of 590 x 197); the dock is now the payoff and lands on the 2.0 cut with rotation overshoot, squash, hot rim and a bevel-only bloom; principal point follows the plate (no off-axis wash); the slam sheen removed; word gap opened; reordered shots so the dock lands on a cut and the Short ends on the bright v45 aerial instead of the hazy v36; the slam starts at 1.28x so its first frame stays inside the frame.
- r02 verdict: v0 8 / v1 8, no defects: PASSED (sticky). tile.json written.
