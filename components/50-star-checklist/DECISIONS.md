# 50 Star checklist: decisions

## Evidence (yt-o4nNjj44d4M, 3.8M views, t00688 to t00724)
- **Job:** a row of stars tied to a row of conditions. Each condition icon changes state and the star row changes with it ("the heat system: what the cops know").
- **Where and how big:** a card docked top-right at x 66-98%, y 5-30% (about 30% of frame width). It enters centred and large at t00692 (x 31-69%), then docks top-right; also seen top-left at t00720.
- **Look:** dark purple translucent rounded card with a pink neon glow border. Top row: five white 5-point stars, unfilled ones dark grey. Bottom row: small red #E8344A icon discs with tiny white lowercase labels, which flip to green #2ECC71 tick discs. The same creator's other card has a pink pill tab on its top-left edge ("HIDE UNDERWATER", t00700).
- **Motion:** stars change one by one and icons flip to ticks over about 24 s, with hard state swaps (no physics, no light). Flat fills, a default glow, tiny labels, stars that are a font glyph.

## The concept (both variants)
A "HEIST RATING" star checklist: five conditions (stealth, no alarm, headshots, under 6:00, no damage). Each condition ticks red to green, and its star drops into the card. The fifth star is the payoff: a perfect run. The content is CONFIG (title, payoff word, 3-7 conditions with icons), so a creator can make it a heat checklist, a challenge rating or a mission rating. Our own star (chunky 5-point, ratio 0.49, rounded tips, 10 raised facets), our own icons and Archivo lettering: not the game's wanted-level HUD.

Distinct from the siblings: 33 (goal checklist) is a list of photo tokens with a title payoff; 31 (collectible tracker) is a found-so-far count. Here the stars ARE the meter, and the payoff is the row hitting max.

## Our upgrade (both variants)
- **The stars are real geometry (lesson 24).** Custom BufferGeometry: a 10-facet raised star (apex at 0.37R) on a 0.22R side wall with a 3-segment rounded bevel. Flat facet normals, so each arm splits into a lit and a shaded half and reads as 3D even at phone size. Filled stars are pearl: MeshPhysicalMaterial, white, clearcoat 1, a lilac-and-pink PMREM studio env, so the neon shows as a reflection in the facets.
- **The card is a crafted object, not a translucent box.** Plum lacquer slab (12 px extrusion, rounded bevel, a clearcoat over a top-left-lit gradient map). Five star-shaped sockets are cut through it, with chamfered lit rims, a dark floor 14 px down and an embossed ghost star in each. So an empty star is a real empty socket, and filling it is a real object landing in it.
- **Neon edge:** a real tube (TubeGeometry) around the card edge, with a white-hot core falling off to pink at grazing angles. An SDF halo goes outside and an inner light spill on the lacquer. It is unlit glass while the card falls, then flickers on (on, off, on, dim, on) as it lands.
- **Physics:** the card drops in from above the top edge with power2.in gravity, a damped landing bounce (14 px, 2.2 Hz) and a 2 degree pendulum swing. Each star flies in from the camera (z 650, 3/4 turn on Y, ease-in), slams into its socket, squashes (z 0.55, xy 1.10, decaying spring), and the card dips 3.5 px. Each landing gets a 3-frame bloom on the star itself.
- **Icons:** DOM discs with gradient bodies, a lit top edge and an inner shadow. The tick is a green iris (clip-path) opening inside the red disc, a drawn stroke check and a 0.22 punch, 0.3 s before the star launches (the tick causes the star).
- **Payoff, one beat (the fifth star on a cut):** the star comes from z 1000 with a full turn. On impact the card punches (to 1.045, spring), and all five stars turn from pearl to polished gold in a left-to-right wave (metalness 0.12 to 1). A real point light rakes across the facets left to right, a white-gold pulse runs round the neon tube, and a warm glow lands on the lacquer under the row. A shake (6 px, flash 0) hits the footage.

## Variant A (16:9, top-right tracker)
- 656 x 248 card docked top-right (x 1208-1864, y 72-320), just over the evidence's 30% width. Stars R46 at a 118 px pitch, 52 px icon discs and labels in Archivo 78% 800 at 17 px. Pink tab "HEIST RATING" on the top-left edge rolls to a gold "PERFECT RUN" at the payoff (overflow window, no dissolve).
- Shots: v56 armoured-van ram (0-2.15), v10 cash table (2.15-3.35), v17 getaway at sunset from the payoff cut (3.35-4.85), v36 hills (4.85-6.4). Shots overlap 2 frames under each cut (lesson 25).
- Times: drop 0.15, stars land 0.95 / 1.5 / 2.15 (on cut 1) / 2.7, payoff 3.35 (on cut 2), exit lift 5.7, end 6.4. Hero frame 3.75.

## Variant B (9:16 Short, phone-first)
- The same object, built for 360x640. 860 x 330 card (80% of the width; the star row is 69%), centred on the safe zone at x 504. Stars R64 at a 158 px pitch, 68 px discs, a label per star under each disc (Archivo 75% 800, 25 px), and a 52 px tab.
- Payoff word under the card: "PERFECT RUN" in Archivo 900 at 70% width and 124 px, a white-to-pale-gold fill with one sheen pass, slammed in with a spring. One payoff beat: the word lands with the gold wave and the rake.
- Same shots in -v. Times as in A. Hero frame 3.8.

## Round log
- r01: first build. During the build the stars moved to their own GL layer above the DOM, so a star in flight never passes under a label; the slab is a depth-only occluder there, so seated stars still sit in their sockets. Critic: v0 8 (locked), v1 7: the per-star labels ran together, the PERFECT RUN word space was choked, the word's first frame was a ghost, the card was unlit on the drop, the gold cascade dragged, and the gold went dark at phone size.
- r02 (v1 only; v0 is locked and unchanged):
  - **Labels:** Archivo 62% at 27 px, tracking .035em, so the gaps between labels are 31-35 px against 7 px word spaces.
  - **PERFECT RUN:** word-spacing .14em and an 11 px stroke (from 15). It's now a stamp: solid from frame 1 at min(1.3, 856/width) so it stays inside the safe zone, accelerates down 34 px onto the hit, squashes 0.91/1.045 and springs back.
  - **One payoff hit at PAY+0.24:** the gold wave runs over 0.24 s (0.035 s stagger, 0.08 s per star). On the frame it reaches star 5, the card punches, the neon peaks (held 3 frames), the key and row glow flash, the rake sweeps and the word lands.
  - **Gold:** a warm low-front env bounce plus a warm emissive floor (#5A3608) keep the shadow facets gold at 360x640.
  - **Entrance:** the tab, discs and labels ride in on the card from frame 1, and the neon idles at 0.45 during the fall, then strikes. The card stretches 7% with the fall speed and squashes 5% on the landing. The lacquer env goes up to 0.45.
  - **Exit:** a stretch of up to 8% on the fly-up.
