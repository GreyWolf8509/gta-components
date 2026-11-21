# 28 Level counter: decisions

## Variant A (16:9 long-form, 1920x1080): "Level roll"

**Evidence.**
- yt-232CmcU0wKg t00048 (10.6M views, the top frame): "LVL 1,340" in a heavy rounded white sans with a thick charcoal stroke and a soft drop shadow, no box, about 7% of frame height, comma separators. It sits top-centre (sometimes bottom-centre) and climbs between cuts: 835, 2,000, 97,241, 100,000, then holds 150,000 at a milestone (t00116-t00120).
- yt-eT7H9BAUPQw t00750: "LVL 442857", same white outlined type, no separators, floating above the character; it counts up continuously over ~16 s (8333 to 225000 to 659524 to 1000000) and holds at the max.
- yt-yycAimqjdjw t00778: a top-left strength badge whose number (224790) counts up rapidly in white with a black outline.
- So the job: one outlined white "LVL n" number, no box, that rolls up through the challenge and holds on a milestone. The brief docks it top-left.

**Our upgrade.**
- **Real geometry (DESIGN 11.24).** Every glyph is an extruded, bevelled Three.js mesh traced from Inter Black (wght 900, tabular figures, `media/glyphs.js`, `media/lvl3d.js`): 22 px deep, 3 px bevel, receding down-right. Faces are white clearcoat enamel (#FFFFFF / #EEF2F7 / #C3CCDA) over graphite walls with a lit lip; the "LVL" label is polished gold: a hard-horizon face (#FFF1A8 / #FFD23C above, #E59A1C / #B5650E below), a key-lit #FFF4C2 chamfer, metal 0.35 to 0.8, over amber walls.
- **Vernacular kept in post.** One 6 px ink outline (#0C0D11) wraps face and extrusion together, the evidence's charcoal stroke, plus a soft drop shadow (4, 9).
- **Mechanical digits, always whole.** Every digit change is a quarter turn of a square drum carrying the real glyphs: the old digit tips back over the top (its bevel and graphite walls catch the light) while the next one turns up from below into place, with a small settle (back.out(1.4)); mid-turn both faces show, so no frame is ever empty. No windows or clipping, so there are no half-digits, slivers or orphan fragments in any frame, and nothing crosses other type (DESIGN 11.6). High columns flip smoothly (column k turns over the last ~0.11 s of the lower columns' cycle); columns spinning faster than 9 digits/s show whole digits, like the creators' counters, instead of a strobing blur.
- **Level-up pulses, left edge pinned.** The climb is log-scale (1 to 999,996), so the number gains a digit every ~0.25 s. The left ink edge never moves: the new digit turns up into a new slot on the right at full size, every existing slot flips to the digit it now reads (0.12 s), and the slots spring right only where a comma opens (commas pop in and shrink out at their own ink centre). Each level-up gets a 6% punch and a light tick. Higher columns never turn toward a carry the climb will not reach. The last three levels tick in one at a time (999,997 / 998 / 999), then a held beat.
- **Payoff (state change).** The carry flips right to left through all six nines (24 ms stagger; the leading 9 flips to 1), the commas re-seat, the new last "0" slams in from the camera (1.28x, power2.in) and everything lands on the cut to the bright hills shot: the counter squashes (0.86 / 1.07) and rebounds, a gold liquid fills the white digits from the bottom behind a hot meniscus (0.28 s), the key light rakes across the bevels, one clean diagonal specular band sweeps the faces 0.15 s after the fill completes (0.35 s, power3.inOut), bloom peaks for 3 frames, the plate takes a small punch (amp 7, zoom 1.02, no flash).
- **Placement and size.** Docked top-left (DESIGN 4: trackers 40-64 px from the edges): label ink at x 66, digit caps 64-132 px (cap 68 px, about 6.3% of the frame), "LVL 1,000,000" about 690 px wide. It enters 1.4x big at the corner and settles (DESIGN 11.7): the gold LVL letters turn up into place with the first digit, which turns up as 0 and flips over to 1. `place.align: "center"` docks it top-centre instead (the evidence's other position).
- **Exit.** Left to right, every glyph tips back and shrinks away into its drum (0.16 s each, 22 ms stagger), gone before the cut, with no edge-on slab left behind.

**Shots and cut points** (1.0x, slow 1 to 1.04 push):

| Time | Shot | In-point | Beat |
|---|---|---|---|
| 0-1.3 | v37-tower-looking-up-h | 0.3 | the climb begins: counter enters 0.25, climb from 0.5 |
| 1.3-2.5 | v32-skydive-towers-h | 0.04 | columns pile on (100, 1,000, 10,000, 100,000), brake at 999,996 |
| 2.5-3.3 | v29-plane-clouds-h | 0.4 | ticks to 999,999 (2.6 / 2.71 / 2.82), held beat, the carry from 3.02 |
| 3.3-5.2 | v36-hills-city-view-h | 0 | payoff lands on the cut, gold hold, exit 4.78, gone 5.17 |
| 5.2-5.7 | v11-yacht-h | 0.6 | footage-only tail |

**Payoff beat:** 3.3 s. **Hero:** 3.62 s.

## Variant B (9:16 Shorts, 1080x1920): "Level slam"

**Evidence.** The same outlined white level number (above), sized for a Short: one big number with a punchy beat. The brief asks for a big level number that slams to the next level with a shake and a "LEVEL UP" kicker.

**Our upgrade.**
- **Same geometry and drums** at Short scale: digit cap 250 px (Inter Black, tabular), 62 px deep with a 7 px bevel, 13 px ink outline, drop shadow (7, 16). Centred on x 504 (the middle of the Shorts safe zone, x 72-936), caps at y 640-890, a small polished-gold "LVL" label (cap 96) above. Digits flip on drums as in A.
- **Build.** LVL and the digit arrive together (0 turns up and flips over to 1), it counts 1 to 98 (the tens digit turns up into view at full size with a pulse while the number springs to re-centre), ticks to 99, then holds and trembles (up to 3.5 px jitter and a 2.5% creep, the key light rising): anticipation.
- **Payoff, the slam, all converging on the 2.1 cut.** In the last 0.36 s: the gold "LVL" tips back and away, the nines flip to 0 (40 ms stagger), a green enamel "LEVEL UP!" (word space opened by 0.1 em) turns up into place centre-out (DESIGN 11.15: text swaps roll), the new "1" slams in from the camera (power2.in, 1.28x to 1x) as the number makes room, and gold rises through the digits behind a wobbling hot meniscus (0.14 s). All of it is complete on the cut, where the block squashes (0.82 / 1.09) and springs back, a 10 px graphic shake and a plate impact (amp 14, zoom 1.04, no flash), bloom peaks for 3 frames, the key rakes, and one clean specular band sweeps the gold 0.15 s later.
- **Exit.** Left to right, every glyph tips back and shrinks away into its drum, gone by 3.92, before the 4.0 cut.

**Shots and cut points** (1.0x, slow 1 to 1.04 push):

| Time | Shot | In-point | Beat |
|---|---|---|---|
| 0-1.25 | v37-tower-looking-up-v | 0.3 | number enters 0.3, rolls up |
| 1.25-2.1 | v32-skydive-towers-v | 0.2 | 99, the trembling hold |
| 2.1-4.0 | v36-hills-city-view-v | 0 | the slam lands on the cut; hold; exit 3.62 |
| 4.0-4.45 | v45-beach-aerial-v | 0.1 | footage-only tail |

**Payoff beat:** 2.1 s. **Hero:** 2.7 s.

## Round log
- r01: first build. Self-review fixes before the critic:
  - **Drum neighbours showed.** With true drums (60 degrees per digit) the extruded walls of the neighbour digits poked into the window as dark bars above and below every settled digit. Now reels (1.55 cap pitch, 24 degrees tilt per step): neighbours are fully hidden at rest.
  - **Seams in V, P, 1, 4, 8.** The variable font keeps overlapping / self-intersecting contours, which extruded as grooves and light hairlines. Those outlines are now overlap-free by hand (`FIX` in gen-glyphs.js), checked with a segment-intersection test.
  - **New columns crossed the label.** Columns were right-anchored, so a new leading digit appeared over "LVL" and slid right. Now the leading column holds the left edge and the number makes room first. The payoff "1" in B dropped from above through the label; both now slam in place from the camera.
  - **Phantom carries.** The tick overshoot (back.out) started a 50% carry in every column for a frame; ticks no longer carry. Fast columns snap to whole digits; no leading zeros on column arrival.
  - Exits tightened so everything is gone before the cut (A 4.78 to 5.18, B 3.62 to 3.96).
- r02 (critic r01: v0 7, v1 7, 1 defect: the number lurched ~90 px against LVL as columns arrived, the new digit at 40% scale):
  - **A is slot-based and left-anchored.** New digits roll in at full size in a new slot on the right; existing slots roll forward to their new digit; only comma openings move slots (back.out(1.6) spring). No pre-reserved empty slot, no scaled-up digit.
  - **No more windows.** Self-review of the first r02 capture showed tight windows still made fragment frames (a rising digit's top below the baseline, overshoots clipping tops, "U" shapes and dashes on the exit). Digits and labels now flip as whole glyphs on short drums in both variants; exits tip back; ticks and flips settle gently (back.out 1.3 / 1.4).
  - **Gold made metal**: 4-stop hard-horizon face, lit #FFF4C2 chamfer (bevel 3.5, 95% inset in A), metal 0.35 to 0.8, a narrow specular band 0.15 s after the fill.
  - **B payoff converges on the cut** (fill and LEVEL UP! complete on 2.1; LVL leaves before LEVEL UP! arrives, so they never jumble), the entrance brings LVL and the digit in together, LEVEL UP! word space opened. The 3-comma frame at A's payoff is gone (the old comma leaves before the new ones pop).
  - Fixed in self-review: the upper columns rolled toward a carry near 999,996 and snapped back (phantom carry); now clamped. A's ticks moved earlier so the carry starts on a held 999,999. Added `place.align` ("left" / "center").
- r02 critic: v0 8, v1 8, no defects. PASSED; both variants locked.
