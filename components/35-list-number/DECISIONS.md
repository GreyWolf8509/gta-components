# 35 List number: decisions

The big number that opens each entry of a list video ("#5", "NUMBER 14"). Overlay kind: both variants render clean on `bg:none`.

## Variant A: Number card (16:9, 1920x1080, 6.0 s)

**Evidence.**
- `yt-o4nNjj44d4M` t80 (3.8M views): a huge glowing pink-to-violet numeral "14" (heavy geometric sans, about 40% of frame height, outer glow) on the right (x 68-95%, y 30-65%); on the left a title block: a tiny pink pill "NUMBER 14", a bold lowercase white title with the last word in pink (about 6% height), an italic subline, a dotted progress line with one pink dash. Held 3-4 s over drifting footage.
- `yt-LzIibqRWGqw` t886 (4.3M): the same job docked: a small bold white numeral "10" top-left (x 1-5%, y 2-10%, 6-7% of frame height), soft dark drop shadow, no box, static for the whole entry and swapped at the next section.
- So the vernacular: the big number + entry title card opens the entry, the small corner number keeps it on screen.

**Our upgrade.**
- **The same card, the same places.** Number on the right (ink x 1040-1730, cap 470 px = 44% of the frame, bigger than the evidence), title block on the left (x 150, vertically centred on the number): pill "NUMBER 5", two-line lowercase Inter 900 title (112 px, -0.045em) with the second line in a pink-violet gradient, italic Inter subline, a top-10 progress row (five done, the current one a glowing pink dash).
- **Real geometry (DESIGN 11.24).** "#5" is extruded, bevelled Archivo 900 (wdth 112) outlines (`media/num3d.js`, `media/glyphs.js`): depth 0.3 cap, rounded 4-segment bevel, tilted back 0.2 rad so the wall reads under the face; the "#" is a superscript at 46% of the numeral, top-aligned, with the same absolute depth. PMREM studio environment, key + hemisphere light, clearcoat, soft contact shadow down-right in deep violet.
- **State change: the countdown ticks.** The numeral is a counter drum. It slams in from near the lens as white enamel showing the previous entry's **6**, winds back 2 frames, rolls 6 -> 5 with back.out(1.6) and true motion blur, and on the lock floods behind a hot light front into pink-violet candy metal (face #FFA6F0 / #FF46D6 / #B314C4 horizon / #FF7AE4 / #7A2BFF, violet walls #8A1ED8 -> #1A0236, specular tinted by the base colour so it stays saturated). Punch 1.05 + 8 px recoil, a key rake across the bevels, a hot specular band, a 3-frame bloom peak settling to a neon glow; the footage takes a hit (impact amp 7, flash 0, expose 1.16) and a local pink bounce lights the plate behind the number.
- **Title build after the lock:** the pill springs open from its left edge (back.out 1.7) with a sheen; title lines and subline rise out of overflow windows (expo.out, a 2.5 degree settle); dots scale on; the current dash stretches with an elastic spring.
- **Dock (persistent tracker, DESIGN 11.7).** At 2.92 s the title lines drop back up into their windows and the pill folds into its left edge. At 3.0 s the number swells 3.5%, then is thrown along a shallow arc into the top-left corner (power4.inOut, 0.42 s, a 1/110 s shutter over 24 sub-frames, a 0.32 rad turn that shows the extrusion), lands with a squash and a small hit, and a glint crosses it. Docked: ink top-left at (66, 56), cap 86 px (7.8% of the frame), the evidence's corner number with a tight, darker shadow. It stays to the end, as in the evidence.

**Shots and cut points** (1.0x, slow push 1 -> 1.05):

| Time | Shot | In | Beat |
|---|---|---|---|
| 0-1.2 | v12-heli-city-dusk-h | 0 | pink dusk city; number slams 0.22, locks ~0.72 (cut before the heli fills the frame) |
| 1.2-3.1 | v38-freeway-dusk-h | 0 (ends 1.9) | held card read; exit 2.92 |
| 3.1-4.9 | v47-gp-chiliad-aerial-h | 0.3 (ends 2.1) | the dock throw lands on the cut to gameplay |
| 4.9-6.0 | v36-hills-city-view-h | 0.4 (ends 1.5) | bright, sharp end |

**Payoff:** the lock at about 0.72 s (drum hits 5, flood, bloom). Hero 1.6 s (title complete, settled).

## Variant B: Number stack (9:16, 1080x1920, 4.1 s)

**Evidence.** The same entry number, sized for a Short: one giant number with the entry name, in the top of the frame where Shorts put hook text, over the clip.

**Our upgrade.**
- The same 3D "#5" (cap 380 px, block centred on the Shorts safe-zone centre x 504, top at y 252) over the two-line entry name (Inter 900 108 px, centred, second line in the gradient) and the top-10 progress row: the whole stack is y 252-940, clear of the caption zone and the right-hand buttons.
- The same slam, drum roll 6 -> 5, flood, light and hit as A.
- **Exit:** at 3.26 s the name drops back up into its windows, the dots fold toward the current one, then the number swells 5% for 2 frames and collapses into the block centre with a 0.9 rad spin and motion blur (power3.in, 0.2 s); it is hidden on the zero frame (3.56 s), across the cut to the bright hills. 0.54 s tail.

**Shots and cut points:**

| Time | Shot | In | Beat |
|---|---|---|---|
| 0-1.6 | v12-heli-city-dusk-v | 0 | number slams 0.22, locks ~0.72 |
| 1.6-3.5 | v38-freeway-dusk-v | 0 (ends 1.9) | held read; exit 3.26 |
| 3.5-4.1 | v36-hills-city-view-v | 0.3 (ends 0.9) | wide bright end |

**Payoff:** about 0.72 s. Hero 1.6 s.

## Round log
- r01 self-review before capture: the first palette went pastel lilac (white env and clearcoat specular over the pink), so the state specular is now tinted by the base colour (tint 0.85), the face stops and walls are deeper, and the lip is mid-pink; the '#' slams from z 520 instead of 1150 (its off-axis slam smeared a big ghost across the top); the docked shadow is stronger (0.85) so the corner number holds on a bright sky; B's last cut moved to 3.5 s so the name exits over the same shot it was read on.
- r01 after the first capture (same round): A's first shot is cut at 1.2 s (the heli filled the frame between title and number at 1.4 s); the drum window is tighter (top 0.05 / bottom 0.06 cap, feather 0.08) so the outgoing 6 no longer shows as a pale arc under the window; the roll uses a 1/120 s shutter (the 1/60 one banded); the dock flight uses a 1/110 s shutter over 24 sub-frames and a smaller turn (it read as a banded smear); the pill is 48 px with 24 px caps; B's exit starts at 3.26 s so the name is gone before the cut to the bright sky, and B ends at 4.1 s.
- r01 verdict: v0 8 / v1 8, no defects or hard caps: PASSED (sticky). Open nitpicks (not acted on, both locked): the lock light double-pulses and whites out the '#' for a frame; the white #6 pre-state reads as default white 3D text; a faint crease across the '#' strokes at the crossbar; v0's title has no edge over bright clips during its exit; v1's collapse straddles the 3.5 s cut; v0's docked number has no designed out.
