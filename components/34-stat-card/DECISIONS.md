# 34 · Stat card: decisions

## Variant A: Car stats (16:9, 1920×1080, 5.33 s)

**Evidence.** `yt-o4nNjj44d4M` t00040 (3.8M views): a glass stat panel docked top-left (x 5–37 %, y 5–33 %), deep translucent purple #2A0F45 at ~85 %, a 1–2 px glowing pink #FF5BD6 border, a pink header pill ("GTA V'S STATS") sitting on the top-left edge, then rows of small coloured icon + bold white caps label + rounded bar with a teal #3DE0C8 or amber #F5A623 fill on a dark track. It pops in, the bars fill, and it holds while the narration explains. t00136 / t00112 show the same purple-card-with-pink-glow language as gauges, sliding in from a pink wipe.

**Our upgrade.**
- **Same object, same corner, same scale:** a purple glass card at x 96–736, y 72–512 (5–38 % × 7–47 %, taller only because it carries four rows plus the car's name), pink pill on the top-left edge, icon + caps label + value + rounded bar per row, teal fills, amber for the upgrade.
- **Card body is a real slab (Three.js):** a quarter-round bevel swept round the rounded rectangle, 16 px wall, pink clearcoat acrylic lit by a key + hemisphere + PMREM studio env (top softbox gives the lit top edge). A neon seam tube (white-hot core, pink → violet, additive halo) runs where the glass meets the bevel: the evidence's glowing border made physical. The face is a DOM frosted-glass layer (backdrop blur 16 px, saturate 1.35, brightness .68, layered purple gradients, inner pink glow, drop shadow) pinned exactly under the rim with a CSS matrix3d computed from the Three.js camera, so the card tilts as one object (~6° toward frame centre, idle float) and its thickness shows in perspective.
- **Bars are liquid tubes:** recessed glass track (inset shadows, lit bottom lip, 10 % tick notches), 4-stop cylindrical teal fill with a gloss strip and teal bloom, a hot meniscus that rides the leading edge while liquid moves.
- **Class badge is a real coin:** rounded hexagon, bevelled metal rim, domed enamel faces, extruded bevelled Archivo Black letters on both faces (outlines from `media/glyphs.js`). Violet enamel + white "B" on the front, gold + ink "S" on the back.
- **Type:** Archivo 900 at 75 % width for the name (64 px), Inter 800/900 for UI with tabular figures on values.

**State change / payoff.** Stock stats fill teal (values count up). At 1.42 s the upgrade preview surges gold segments past each teal bar on a spring with slosh (striped = preview), values count up, "+30" chips pop. **Lock-in at 2.00 s, on the cut to v31:** a white-hot light front sweeps each bar left → right (stripes vanish behind it, the gold blooms, the value punches and turns gold); the coin flips B → S with real thickness (overshoot, rim turns silver → gold, 3-frame flash, bloom behind it inside the glass); the card punches toward camera; the subline rolls "STOCK" → "FULLY UPGRADED"; a soft sheen crosses the glass; small footage shake (no flash, no frame-wide exposure on the bright sunset).

**Shots.** v57 gameplay red sports car on the highway (HUD, like the evidence) 0–2.0 → v31 red car at sunset 2.0–3.73 (payoff) → v17 sunset drive 3.73–5.33. Exit 4.86–5.16: the card folds into its pill anchor with a swing and blur.

**Hero:** 2.5 s.

## Variant B: Character stats (9:16, 1080×1920, 5.53 s)

**Evidence.** `yt-o4nNjj44d4M` t00136 (and t00128–t00140): square purple cards (#3A1458) with a pink glowing border and rounded corners, a white pill label on top ("FUEL", "ENGINE"), a neon magenta semicircle arc gauge with a white needle, small icons under the hub; needles rotate across frames, cards slide in from a pink wipe. Combined with t00040's portrait-less stat panel.

**Our upgrade.**
- **Same language for a Short:** one purple glass card centred low (x 100–912, y 962–1450, inside the 9:16 safe zone), a portrait popping out of its top-left corner, "CHARACTER STATS" pill on the edge, FRANKLIN in Archivo 900 (92 px), and the evidence's two gauge cells side by side (white pill label, neon arc, needle, value under the hub).
- **Gauges are real geometry:** a torus-arc neon tube (shader: white-hot core facing camera, pink → magenta edges, lit up to the value, hot tip at the leading end) in a clear glass sleeve with end caps, two additive halo tubes for bloom, 11 ticks (majors at 0/50/100), a bevelled white enamel needle with a contact shadow, a chrome hub with a pink enamel dome.
- **Card:** the same edge-lit acrylic slab + neon seam + frosted face as A; gauge cells are recessed glass panels.
- **Portrait:** a keyed still of Franklin (v06-h at 1.45 s, front-lit 3/4, closed mouth) on a pink radial (colour behind the head, never over the face), in a gold → pink → violet gradient frame with gloss; it irises open with a spring.

**State change / payoff.** Needles swing to STAMINA 64 / DRIVING 78 with overshoot. From 1.5 s DRIVING revs: the needle climbs to 93 with a shudder, the tube pulses. **Lock at 2.2 s on the cut to v17:** the needle slams into the stop and bounces, the tube flares white-hot and turns gold, the value rolls 93 → MAX (gold, punch), the cell border lights gold, the hub dome flashes, a bloom lights the glass behind the gauge, the subline rolls to "DRIVING · MAXED OUT", the card punches.

**Shots.** v49 gameplay Franklin by the mural 0–2.2 → v17 sunset drive 2.2–3.8 (payoff) → v44 bridge skyline 3.8–5.53 (bright, sharp end). Exit 4.96–5.26: the card folds back flat and shrinks into its bottom-centre anchor with blur.

**Hero:** 2.6 s.

## Recognition check
A creator from o4nNjj44d4M sees their purple pink-bordered stat panel with the pill on the edge and teal/amber bars (A), and their magenta arc gauges with white pills and needles (B). The step up: real slab thickness and lit bevel, a physical neon seam, liquid bars, a coin that flips with depth, neon tubes in glass with a chrome hub, and a lock-in payoff.

## Round log
- **r01:** first build (blind critic 8/8, PASSED). Before the critic, the bars were rebuilt as width-driven pills with box-shadow bloom: CSS drop-shadow filters inside the 3D-pinned layer smeared edge pixels into horizontal streaks across the frame. Self-review fixes inside the round: values count monotonically (the bar sloshes, the number never runs past its target); rim made pinker with a neon seam tube; coin enlarged (R 58) with domed faces and a more saturated gold; payoff glows moved inside the glass face so no orange haze lands on the footage; B value text moved clear of the hub.
