# 39 Comparison split: decisions

## Evidence (both variants)
- **tt-7612456770161691920 t4.5 (7.3M, short):** stacked 50/50 game-vs-game, thin light divider (~1% height), game name top-left and year top-right of each half, no boxes. Labels static, both halves hard-cut in sync every ~3 s.
- **tt-7649064175435533598 t42 (3.9M, short):** side-by-side LOW | ULTRA, thin hard divider, heavy caps level words (red LOW, green ULTRA) centred over each half at ~26% from the top; the setting word cycles LOW/MEDIUM/ULTRA. Hard cut into the split, held 2-3 s.
- **yt-o4nNjj44d4M t68 (3.8M, long):** Jason | Lucia 50/50 split, a thin glowing pink divider that wipes in, small pink name pills at the bottom corners.
- **yt-KedfEMhQdP8 t84 (4.9M, long):** three labelled screenshots on black.
- So the component is: two synced clips, a thin divider, a name/year label per side, often a setting word. Rough: plain lines, default fonts, labels pasted on, no verdict.

## Our upgrade (shared)
- **The divider is a real object (Three.js, `media/split3d.js`):** a polished chrome blade (rounded bevels, vertical reflectance gradient, crisp strip-light lines on the bevels, soft cast shadow on the footage) carrying a thick coin: ink-enamel faces, chrome rim and inlaid ring, extruded bevelled white-enamel "VS" glyphs (Archivo outlines) on the front, an extruded pink arrow on the back.
- **Physics:** the blade slams in (accelerating, then a damped overshoot) with speed-scaled directional blur and a 5 px shake; the coin spins in on it and lands with a scale bounce; a light streak runs down the blade on landing.
- **Labels are designed chips:** an ink plate (lit top edge, keyline, contact shadow) holding an enamel name tab (GTA VI: Vice-pink 4-stop gradient, inner highlight, gloss; GTA V: white enamel) and the year in Inter 800 tabular. Chips drop in with a squash landing; years roll up in a masked window.
- **Verdict = state change on the third cut (3.28 s):** the blade winds into the winner's half, snaps back and LOCKS (overshoot, 8 px shake, no flash); the coin flips (real thickness, chrome edge) from VS to an arrow at the winner; the blade ignites pink with a streak running its length; the winner half gets a 3-frame exposure lift (1.14) and its chip punches with a pink ring and a sheen; the loser half and chip drain to grey (blacks kept: brightness .73, contrast 1.14, saturate .4).
- **Exit:** the blade sweeps off and the winner takes the frame (each clip re-centres in its window as the seam moves, so the winner ends full-frame at 1.0x in A).
- **Footage:** GTA V side = 2013 gameplay (`gp-*`, genuinely older-looking), GTA VI side = trailer shots of the same subject: red car / Deluxo, Chiliad aerial / hills over downtown, speedboat / superyacht. Cuts at 1.45 and 3.28 (the lock), all shots within length.

## A: Side by side (16:9)
- Chips top-left (x 96) and top-right (right edge 1824), y 72, 104 px tall, name 80 px. SETTING tag hangs under the winner chip with a 4-bar level meter; on the verdict it rolls HIGH -> ULTRA (masked, no cross-fade) and the bars go green.
- Payoff 3.28-3.9; hero 3.9.

## B: Stacked (9:16)
- Top = GTA VI (winner), bottom = GTA V. Each half is a -h shot at 0.889x (sharp). Badges sit ON the seam: the winner's rests on the blade (year above the name tab), the challenger's hangs under it (name tab, year below), mirrored across the coin. They rise/drop out of the seam on a spring and ride it when it moves. Safe zone: badges y 758-1162 settled.
- Payoff 3.28; hero 3.9.

## Round 1
- First build.

## Round 2 (v0 locked at 8; only b/ changed)
r01 critic: v1 7, "two small chips on a line at phone size, years half the evidence size, thinner payoff, purple haze above the seam".
- Badges scaled ~1.3x: name 110 px (cap ~76), year 78 px Inter 800 tnum (cap ~57), badge ~350 px wide (32% of width). Word space opened to ~0.21em so "GTA VI" never collapses. Both badges now left-aligned at x 72 (one on the seam, one under it) so the 3D coin keeps the seam's centre without collisions.
- Payoff light on the object: a 3-frame radial pink bloom under and over the coin when the flip lands (3.52 s), then a 0.12 s decay; the winner-half expose is 1.12. The badge ring is now keycap-shaped (2 px ring + 18/44 px glow, no spread). The seam haze is 96 px tall instead of 240.
- Coin: dark-glass enamel face (radial #2E323C -> #0B0C10), a crisper clipped specular band after the flip, no roll back to VS on the exit.
- Loser grade milder but keeps blacks: saturate .55, brightness .78, contrast 1.12.
- Like-for-like first pair: red car (gp) vs v31 red car at sunset (was the Deluxo).

## Round 3 (v0 locked; only b/ changed)
r02 critic: v1 7 + defect "magenta smear ~75 px above the seam through the hold".
- [defect] The seam glow band was 96 px tall but still offset for 240: now centred on the seam (d - 48).
- The screen flare over the coin face is gone; the flip now lands from below with no overshoot, so the black face never tilts into the top softbox; ink clearcoat/env lowered. Light stays a radial bloom under the coin + the clipped face sheen.
- The coin grows into the verdict and stays 12% bigger (180 -> ~202 px, 19% of the width), with a spring.
- Enamel: the hard-edged half-pill gloss is replaced by a 1.5 px lit top edge, a tight 3-stop gradient, a 2 px inner lip and a soft top light.
- Loser grade milder (saturate .7, brightness .87, contrast 1.06); the loser badge greys, sinks 8 px and shrinks to 0.94.
- Years roll in with their badges (no empty capsule frames).
