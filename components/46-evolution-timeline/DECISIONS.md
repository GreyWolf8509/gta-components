# 46 Evolution timeline: decisions

## Evidence (both variants)
- tt-7612456770161691920 t00004.5 (7.3M-view Short, the only evidence video): a split-screen "then vs now" comparison; each half carries a release-year tag ("2026", "2018") at its top-right, about 64-86% x and 6-12% y of the half, about 20% of the frame wide.
- Look: white heavy neo-grotesque numerals, a thin black stroke and a soft drop shadow, no box. Static, always on; the tag changes only when the clip changes (neighbouring frames t00000-t00016.5 show the same tags over every zoom cut).
- Job: tell the viewer which year each clip is from in an evolution / history edit. It sits in the corner and must read at a glance.

## Variant A (16:9 long-form): "3D timeline"
**Our upgrade.**
- **The tag stays the creators' tag:** the current year is white, heavy, outlined and docked top-right (ink x ~1357-1827, cap 128 px, about a quarter of the frame), no box.
- **Real geometry (DESIGN 11.24).** Every year is a card of extruded, bevelled Inter Black tabular figures (Three.js, `media/year3d.js`, outlines in `media/glyphs.js`): 26 px deep, 4 px bevel, white clearcoat enamel faces over dark graphite walls with a lit lip, one 6 px ink outline around face + extrusion (the evidence's thin black stroke) and a soft drop shadow. Past years keep the same white enamel (ported from the locked 9:16 variant): white face + dark walls + ink reads on bright skies and dark plates alike; hierarchy comes from size and depth, not from greying them out.
- **A timeline the camera travels along.** The years stand on a spine that recedes left into depth (a real perspective camera, FOV 34, seen from 0.13 rad above), so the edit's history reads left to right: 2013 — 2015 — 2022. Neighbouring cards are joined at cap-middle by a flat white enamel bar (23 x 12 px section, lit top, cool underside, inked like the digits: the dash in "2013—2015"), with one engraved groove per year in between (2014; 2016-2021). Each bar unrolls behind the arriving year.
- **Each year lands.** A new year arcs in from camera-right, swinging upright, while the camera eases into the next stop (power1.inOut); over the last 0.22 s it falls onto its slot (thrown down, gravity adds; stretches with speed) so horizontal speed dies as vertical speed peaks, and it hits on its cut. Contact: squash with the base pinned (2022: 0.82 / 1.09), a 21 px bounce while its shadow stays on the slot (the post shadow reads the card's height), then a second, smaller squash into place = the lock-in. The impact kicks the camera into a 2% recoil; the card tips 0.1 rad past upright. The previous year slides back along the spine into depth, still facing the camera (no per-card lean), shrinks 10% (plus perspective) and dims to steel. Real motion blur: while anything moves fast, a frame averages up to 28 sub-frame renders over a 0.45-frame shutter, so the swing-ins streak instead of strobing.
- **Payoff (state change), 5.0 s on the cut to the yacht:** 2022 slams onto its slot (plate punch amp 10, zoom 1.03, no flash); the impact pumps polished gold up through its digits behind a hot meniscus during the bounce (0.26 s): a mirrored horizon (pale top, deep amber band at 44% of the cap, bright bounce at the foot). Lock-in at 5.3 s (second contact, plate punch amp 4): the gold ignites (emissive flash on the gold region only, held 3 frames), bloom held 3 frames and clipped to the faces (no halo on the sky), the key rakes and keeps drifting through the hold, one gold-tinted specular band crosses the 2022 only, 5.36-5.78 s (amp 0.55, so the faces never clip to white).
- **Exit:** newest first (0.07 s stagger), each card tips back over its hinge (back.in(1.4)) and shrinks to nothing over 0.26 s; rails and studs shrink with their cards. No fades, no one-frame pops.

**Shots and cut points** (1.0x, slow 1 to 1.04 push; each incoming shot starts 2 frames early under the outgoing one):

| Time | Shot | Year |
|---|---|---|
| 0-2.55 | v49-gp-franklin-mural-h (gameplay, in 0.3) | 2013 flies in from 0.0, landed by 0.25 |
| 2.55-5.0 | v28-tennis-mansion-h | 2015 lands on the cut; travel to 2022 from 4.5 |
| 5.0-6.95 | v11-yacht-h (bright, sharp) | 2022 lands on the cut (payoff), exit 6.25-6.67 |

**Payoff beat:** 5.0 s (slam), 5.3 s (lock-in). **Hero:** 5.55 s.

## Variant B (9:16 Shorts): "Year stack"
**Our upgrade (phone-first, DESIGN 11.26).**
- **One big year, top-right of the Short:** Inter Black tabular figures, cap 190 px, ~655 px wide (60% of the frame), right ink edge at x 892, cap top y 286 (inside the hook zone y 230-620 and the safe zone x 72-936).
- **Real geometry:** the same extruded, bevelled digits at Short scale (50 px deep, 6 px bevel, extruding down-right), white enamel, a 10 px ink outline, drop shadow (6, 14).
- **The year rolls from one year to the next.** Each digit is a mechanical drum: the old digit tips back over the top (its bevel and walls catch the light), the next turns up from below. 2013 ticks to 2014 and 2015 on the first cut; then the years run 2016 to 2021, braking, hold and tremble (3.5 px jitter, a 3% creep, the key light rising).
- **Payoff, 4.25 s on the cut:** 2022 flips in hard, the block squashes (0.84 / 1.08) and springs back with a 9 px graphic shake and a plate impact (amp 12, zoom 1.03, no flash), gold rises through the digits behind a hot meniscus, the key rakes, one specular band sweeps 0.15 s later, bloom peaks for 3 frames.
- **Entrance:** every digit turns up into place left to right (40 ms stagger) while the block settles from 1.3x (back.out). **Exit:** every digit tips back over its drum, left to right, gone by 6.0.

**Shots** (1.0x, 2-frame overlaps): v49-gp-franklin-mural-v 0-2.05 (2013), v28-tennis-mansion-v 2.05-4.25 (2015, the run), v11-yacht-v 4.25-6.25 (2022, bright wide vehicle shot).

**Payoff beat:** 4.25 s. **Hero:** 4.6 s.

## Facts
GTA V release years only: 2013 (PS3 / X360), 2015 (PC), 2022 (PS5 / Xbox Series X|S). No logos, no platform marks, no Pricedown.

## Round log
- r01: first build. Critic: v0 7, v1 8 (v1 locked).
- r02 (v0 only; b/ untouched): the comma-like tick pills became a continuous cap-middle rail with round studs, unrolling only as each new year arrives (no future visible during holds); arrivals accelerate and slam into the slot on each cut, then overshoot; designed staggered exit (no single-frame pops); older years larger (recede 0.24 -> 0.1, lean 0.85 -> 0.6) and the line flatter (elev 0.22 -> 0.13) so 2013 reads at phone size and every crest sits below y 60; slot x 1592 -> 1578 so the 2022 ink stays inside x 1824; gold lower stop #E59A1C -> #F2B233 (less mustard); payoff light doubled and held 3 frames (emissive flash 0.32, bloom 0.75, specular band 1.0 at 0.22 cap width). Critic: v0 7, v1 8.
- r03 (v0 only; b/ untouched): polished-gold payoff (mirrored horizon gradient, emissive 0.5) with one raking specular sweep 5.10-5.55 at 2.4x; side-wall flash 0.35 -> 0.12 and key spike 1.6 -> 0.7 (no haze above the digits); passed years face the camera and recede by depth only (lean 0.6 -> 0, card yaw 0), so 2013 / 2015 no longer read as italics; spine 9 px white rail -> 20 px steel rod with white year collars; sub-frame motion blur on every fast move (entrance, swing-ins, payoff squash, exit) in A's copy of year3d.js; 2013 lands by 0.25 s (was 0.72); cards below 12% scale leave the frame instead of shrinking to an ink speck.
- r04 (v0 only; b/ untouched, v1 SSIM 1.0000): ported v1's choices. Past years are white enamel with dark graphite walls and a 6 px ink (were grey steel: grey on a pale sky); shadow 0.5 -> 0.62. The beaded steel rod (skewer at phone size) became a flat inked white enamel bar with engraved year grooves. Real landing: each year arcs in and falls onto its slot on its cut (drop 56 / 84 px), squash with the base pinned, a bounce whose shadow stays on the slot, a second squash = lock-in; plate punch on the slam and a small one on the lock-in. Payoff light: the spec band only touches the payoff card (per-instance gate), gold-tinted, amp 2.4 -> 0.55; the flash only lights the gold region; bloom 0.75 -> 0.5 and clipped to the glyph faces; the light beat moved to the lock-in (5.3).
