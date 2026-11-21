# 13 Circle and arrow: decisions

## Variant A (16:9, 1920x1080): "Draw-on circle"

**Evidence.**
- zvdxphGS07o t00485 (5.8M): a plain 3 px white ellipse round a target in gameplay, about 12% of frame width, static.
- sYp0S6VQyCE t00032 (3.0M): a thick red curved arrow (cartoon sticker, black outline) above the target, x 55-70%, y 22-42%, pops in.
- c-I-jXpGuOk t00004 (8.1M): a thin white hand-drawn curved arrow with an open head next to the target.
- mCDH5KnBx9o t00008 (8.3M): a white marker line drawn on over the shot.
- The creators' version: one flat stroke, jaggy, no light, no shadow, usually static or popped on, and it never follows the subject when the camera moves.

**Our upgrade.**
- **Tracked.** The annotation is pinned to the player (orange jacket) through a moving, crowded party shot. The track was measured from the clip (OpenCV colour track, median and Gaussian smoothed) and lives in `CONFIG.track`, so the circle stays on him as the camera follows. `track: null` + `target` gives a fixed position for your own clip.
- **Brush.** Each stroke is a real variable-width brush: pressure taper in, a flick out, a slight pressure wobble and 5 bristle strands (dark grooves and light ridges) that splay into a dry-brush tail at the end. The circle is hand-imperfect: an egg-shaped loop with two low-frequency wobbles, tilted -8 degrees, spiralling outward so the end overlaps and passes the start (about 395 degrees).
- **Material.** One SVG filter on all the ink: a clean 2 px dark ink edge (#5A0010 at 70%), a tight contact shadow on the footage (black 0.45, blur 2.5, offset 3/5), and a bump from the blurred alpha lit by a fixed top-left specular (a low, marker-like sheen) plus a low point light that rakes the strokes at the payoff. Fill is a 3-stop red (#FF4A3D, #EE1C25, #B20E1C) with a 5 px wet highlight and a 10 px dark core whose sides follow the light. The brush is a chisel-tip marker (nib 40 degrees).
- **Arrow.** A curled "↶" brush shaft from the right that starts in dry bristles and ends full width at a tip placed automatically 10 px off the ring's outer edge (`arrow.aim`, `arrow.gap`). The head is two more brush flicks of the same ink (36 px at the root to 11 px, 104 px long, ±36°), so it shares the shaft's highlight, core, edge and shadow and has no seam. The head pops last.

**Shot.** `v35-penthouse-dusk-h`, media 0.3 to 5.3 s (one continuous 1.0x shot, the camera following the player through the party toward the dusk window). No cuts: a tracked annotation needs one shot.

**Timing (comp 5.0 s).** Circle draws 0.40-1.02 (sine.inOut, like a hand); arrow shaft 1.02-1.32 (power2.out); head pops 1.32 (spring, 16% overshoot, -18 degree rotation settle).

**Payoff, 1.32-1.91 s.** The two head flicks draw in 0.08 s with a scale pop about the tip (0.7 -> 1.16 -> 0.96 -> 1), the circle thumps (+4.5% decaying spring), a white-hot bloom (40 px core) sits on the head for 3 frames, a low point light crosses the head and then runs once round the whole ring in 0.45 s as a hard glint with a small bloom, and the frame takes a small impact (amp 5, zoom 1.012, flash 0). Hold 1.6-4.3 s (2.7 s). Exit 4.30: the head snaps shut (back.in 0.12 s), the shaft retracts, and the circle unwinds chasing its own end (0.3 s), cut on the zero frame; 0.38 s tail. Hero 1.7 s.

## Variant B (9:16, 1080x1920): "Arrow + label"

**Evidence.**
- mQUhZgeHv34 t00000 (19.3M, Short): a chunky flat red block arrow (#E8231C, thick shaft, wide triangular head, thin dark drop edge), about 25% of frame width, diagonal, its tip just beside the subject's head. On for a beat, gone 1.5 s later.
- E1Eu2_RUdEo t00068 (5.2M): the same red block arrow with a thin white edge, about 10% of width, pointing diagonally at the target.
- The creators' arrows are flat stock shapes, pasted on, with no light, depth or physics.

**Our upgrade.**
- **Real 3D arrow (Three.js).** An extruded, bevelled block arrow (shaft 104 px, head 250 px wide, 430 px long; depth 40, bevel 12/9, round-cornered) in clear-coated red MeshPhysicalMaterial with a PMREM studio environment, a warm key, a dusk-pink rim light from behind-right and a hemisphere fill, under ACES. A dark backing plate gives the evidence's thin dark edge; a blurred silhouette shadow lands on the footage.
- **Swoop with physics.** It flies in from off-frame upper-left on a curve, banked 70 degrees on its long axis (the bevel and side are visible), unbanks as it arrives, overshoots 30 px along its axis and springs back with an axial squash (0.86) and recovery. The unbank slides the studio reflections across the clear coat: the light moment. Then it bobs toward the target (12 px, 1.6 Hz), as creators' arrows do.
- **Label.** "THAT'S ME" in Archivo 900 at 70% width, 112 px, white with a dark outline and a stepped dark-red extrusion, "ME" in caption yellow. It slams out of the arrow's tail on the landing.
- **Quick circle.** The same brush engine as A: a fast 0.3 s brush loop around his head right after the landing.
- **Tracked**, like A, to the player's head (`CONFIG.track`).

**Shot.** `v35-penthouse-dusk-v`, media 4.45 to 8.95 s: the player walks to the window, dusk skyline, alone in frame.

**Timing (comp 4.5 s).** Arrow in 0.42, lands 0.78 (payoff); label 0.84; circle 0.88-1.18; bob from 1.3; exit 3.85 (arrow retracts along its axis, label collapses into the tail, circle unwinds); 0.35 s tail. Hero 1.4 s.

## Round log
- r01: first build. Self-review fixes before the critic:
  - tracking switched from a jacket colour track (drifted when he turned) to a template track of his head; verified on crops every 0.5 s;
  - B reframes the 16:9 master to 9:16 (object-position 25.7%) so the head circle stays inside x 72-936 while he walks;
  - A brush is a chisel-tip marker (nib 40 degrees, 50% thick/thin), 40 px, red shifted toward the evidence hue (#FF4A3D / #EE1C25 / #B20E1C), specular softened so it stops reading pink.
- r02 (critic r01: 7/7, no defects):
  - A: the arrow gets the ring's weight (30 px shaft, only the first 15% tapers, from 42%), a 108x116 px barbed head that pops 0 -> 1.25 -> 0.92 -> 1 (back.out(3) keyframes, 0.22 s) on the glint; the ring is tightened to 172x152 round head and shoulders; the shaft now arcs in through the open window space instead of over another head. The displacement jag is gone: a clean 2 px #5A0010 ink edge at 70%. The paint reads at phone size through a 7 px wet highlight and a 10 px dark core whose side follows the light (offset = dot(normal, up-left light)), like a lit tube of paint.
  - B: payoff light: a clipped specular band (additive shader on the arrow's front face, 0.42 peak, 0.32 s) at 1.12 s and a 3-frame #FF5A66 bloom on the ring as it closes (1.18 s). Landing physics: the arrow arrives with speed (no ease-out), holds a 2-frame axial squash (0.82 / 1.12), recoils 18 px, then elastic.out(1, 0.5) over 0.35 s. Caption: origin at its centre, slam capped at 1.2x and clamped so the overshoot frames stay inside x 72; word-spacing 0.14em; the exit collapses it fully opaque into the arrow's tail with a 6 px blur (no half-alpha frames). Ring 118x132, clean ink edge, lit highlight and dark core as in A.
- r03 (critic r02: v0 7 / v1 8, no defects; v1 locked and untouched):
  - A head: rebuilt as two tapered brush flicks drawn from the tip (power3.out, 0.08 s, the second 0.03 s behind) under the same filter as the shaft, so there is no seam and the head has the shaft's material.
  - A payoff light: a 3-frame white-hot bloom on the head, then a point light (z 70, specular 3.2) crosses the head and runs once round the ring in 0.45 s with a 72 px bloom riding it. The ink bloom is cut to blur 5, 0.5 peak, gone within 0.35 s.
  - A ink: the soft dark halo is now a tight contact shadow (black 0.45, blur 2.5, offset 3/5); flatter body (specular 0.42), thinner, less pink highlight; three dry-brush bristles split off over the last 17% of the ring and the first 15% of the shaft.
  - A fit: ring 145x128 (width 42, nib 40%), offset y 32; the arrow tip is computed from the ring (10 px off its outer edge at -42 degrees).
- r03 result: critic v0 8 / v1 8, no defects, no hard caps. STATUS: PASSED (sticky).
