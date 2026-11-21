# 21 Speed lines: decisions

## Variant A (16:9, "Radial streaks")

**Evidence.** Six long-form videos (2.9M to 10.6M views) lay white anime speed streaks over climbs, flights, skydives and chases.
- `yt-u7AAlXG6INE t00000` / `t00008`: 20 to 40 sharp, tapered white spikes from all four edges; the centre ~50% stays clear for the subject; the pattern re-randomises every few frames.
- `yt-EP_LdrobwPg t00999`: the same at 60-90% opacity, longest in the corners.
- `yt-eT7H9BAUPQw t00329` / `yt-yycAimqjdjw t01110`: thinner 1-4 px lines, weighted to the top third and the sides, during a skydive and a run.
- The streaks are a flat stock PNG/MOV overlay: one layer, one opacity, no depth, no relation to the cut or the subject, a constant strobe.

**Our upgrade.**
- *Geometry.* Each streak is a vector spike: a concave-sided wedge (quadratic sides, control at 55% of length, 0.18 w inset) that is fully opaque past the frame edge and fades to a sharp point at the tip ("soft fade"). Base widths 8-26 px (front), 1.6-5 px (mid).
- *Depth.* Three layers with parallax: a blurred haze layer (40-110 px wedges, 10-20% alpha, 10 px blur, slow 8-12 frame lives), a mid layer of thin lines (5-9 frames), and a front layer of bold spikes (4-7 frames, the fastest = nearest). A navy separation halo (5 px blur) sits under the crisp lines so white still reads over bright sky, and an ice-blue bloom (16 px blur) sits behind them.
- *Motion.* Every streak "jabs": it shoots in over 2 frames, holds, and retracts outward over 2 frames, then respawns at a new angle (stratified, so coverage stays even). The whole pattern re-seeds on every cut.
- *Subject.* The clear zone is an ellipse centred on the subject of each shot (CONFIG focus, tracked across the shot), so the lines converge on the car, the plane, the skydiver.
- *State change, the payoff (t = 1.70).* Cruise state: 62% density, 0.9 width. 0.22 s wind-up: the lines pull back towards the edges (anticipation). On the cut: one-frame slam to full density, the clear zone tightens to 0.78 then springs to 0.90 (damped spring, 3.2 Hz), widths x1.35 and the bloom goes hot for 3 frames, then settles to a 0.84 hold. Footage: punch-zoom 1.05 with an 8 px decaying shake, an exposure kick of 1.08 held 3 frames, an edge-masked radial zoom-blur punch (a 4 px blurred, 1.04x copy of the shot at 60%, masked to the outside of the clear zone, decaying over 0.45 s), and a 4 px chroma split on the lines for 0.14 s.
- *Re-hits.* Later cuts (2.65, 3.60) re-slam the lines at 40% strength with a small punch, like an editor hitting each beat.
- *Exit.* The clear zone expands to 3x in 0.30 s (power3.in): the lines retract out through the frame edges with a 6 px blur, and cut on the zero frame. No fade.

**Shots and cuts.** v57 gameplay highway chase (0-1.70, cruise and build) | beat | v29 plane over clouds (1.70-2.65, payoff) | v32 skydive between towers (2.65-3.60) | v11 yacht at speed (3.60-5.65, hold, exit at 4.95-5.25).

**Payoff: 1.70 s; hero frame 1.95 s.**

## Variant B (9:16, "Vertical streaks")

**Evidence.** Same component on Shorts-style framing: streaks from the edges, centre clear, strobe-like. The 9:16 frame has short sides and long top and bottom runs, so the lines that carry the speed are the near-vertical ones.

**Our upgrade.**
- Same streak engine, re-weighted for a vertical frame: 55% vertical bias (streaks favour the top and bottom edges), a tall clear zone (0.30 W x 0.20 H) around the subject.
- *Colour tint.* Each front streak is two-tone: a caption-yellow (#FFD23C) body with a white core (42% width), a tinted bloom behind. On the beat the bodies go white-hot (tint to white over 3 frames) and cool back to yellow: the light state change.
- *Ramp on the beat (t = 1.60).* Sparse white-yellow cruise on the tower climb, a 0.2 s pull-back, then a 1-frame ramp to full density with a deeper slam (clear zone 0.74, spring to 0.9), a 1.06 punch-zoom, 10 px shake, exposure 1.08, the edge zoom-blur punch and a 4 px chroma.

**Shots and cuts.** v37 glass tower looking up (0-1.60, cruise: a climb) | beat | v11 yacht at speed (1.60-2.95, payoff) | v29 plane (2.95-3.80) | v44 bridge and skyline (3.80-5.50, exit at 4.85-5.15). A full-frame v32 skydive and a cover-cropped v29 were tried and dropped: soft, oversized subjects.

**Payoff: 1.60 s; hero frame 1.85 s.**

## Round log
- r01: first build. In self-review, the beat frame was drawn from the pre-beat state (time not snapped to the frame grid). Fixed: envelopes are evaluated at f/30. The edge zoom blur was a persistent milky veil and is now a 0.45 s punch. The navy halo was dropped on B (it read olive under the yellow bloom). The cruise state was made denser and deeper.
- r02 (critic r01: 7/7, 1 defect on v1). Changes for both variants:
  - *Light, not grey.* The dark halo is off (`shadeOpacity: 0`). The bloom and the haze are screen-blended, and haze alpha drops to 0.03-0.07. There is no frame-wide expose and no RGB split: the payoff light is the streak bloom going hot (glow x1.4 for 3 frames). B's bloom is pale gold #FFE7A0, not amber, so it no longer turns olive over the sky.
  - *Travel.* Every streak keeps rushing inward through its life: front 125 px (B 105), mid 90 (B 75), haze 40. Mid streaks detach from the edge for their last 2 frames and fly in as thin needles. Front spikes jab in and out.
  - *A near layer.* 4 oversized, defocused corner wedges (70-130 px, 12 px blur, 26-40% alpha, travelling 200 px), present only in the burst: haze, mid, front and near now give 4 parallax depths.
  - *Slam.* The clear zone compresses to 0.70 on the beat frame and springs open to 0.95 (3 Hz, z 0.34, overshoot to ~1.03).
  - *B.* Opens on the v46 speedboat run, a real speed moment, instead of the tower tilt. Front widths go to 14-34 px, mid to 3-7 px, cruise density to 0.85. The plane shot (defect: subject cut by the right edge, in the button strip) is replaced by the v45 beach aerial, which has no off-centre subject.
- r02 verdict: 8/8, no defects or hard caps. PASSED (sticky).
