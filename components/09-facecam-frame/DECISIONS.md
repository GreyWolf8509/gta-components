# 09 Facecam frame: decisions

## Variant A: Corner cam (16:9)

**Evidence.** The streamer webcam docked top-right over gameplay, a hard-edged ~4:3 box about 24-26% of frame width and
35-44% of height, flush or 1-2% inset (yt-gVyZUp6IWV4 t00012, yt-ePQI2A8d6kQ t00064, yt-Vom5ya5cbQY t00000). Usually no
border; small radius at most (ePQI2A8d6kQ); a brand/sponsor border when there is one (Vom5ya5cbQY t00084, red/white
stripes ~1.5% of width). Static for whole segments, and it **snaps bigger for reactions** (35-50% width, Vom5ya5cbQY
t00148, 0FV42j9xSV0 t00052) and back.

**Our upgrade.** Same box, same corner, same reaction snap, built as an object:
- rim: real Three.js geometry, a 30 px (20 px docked) rounded-tube gunmetal profile (metal 1.0, rough .22, clearcoat .6)
  lit by a PMREM studio (top softbox, hot bar behind = lit top lip, cool/warm side strips, warm floor bounce);
- a caption-yellow lacquer lip between rim and picture, a red lacquer LIVE plate in the window corner with a breathing
  dot, a yellow lacquer name plate mounted over the rim's bottom-left edge (DOM type pinned to the faces);
- picture seated with an inset shadow; soft 3-layer contact shadow on the gameplay (outside the frame only).
- Docked: window 522x392, frame 563x430 (29% width), 48 px from the top and right edges.

**Shots.** v57 highway (0-2.0) -> v56 truck crash (2.0-4.7, the wall bursts at 2.9) -> v52 bridge (4.7-6.2, bright end).

**Motion.** 0.35 scale out of the corner anchor with a soft-bounce spring (~8% overshoot) + 2-frame opacity + blur 10->0;
the rim lands tipped back and wobbles flat (highlights slide); the picture racks in 1.1->1; LIVE and name land 0.78/0.86;
one soft specular pass along the rim. Exit 5.55: collapse into the corner with blur, cut on zero; 0.35 s tail.

**Payoff, 2.9 s (the crash).** Reaction state: the cam snaps from docked to the enlarged size (x0.68 -> x1.0, 43% width,
evidence-sized) with spring overshoot; the yellow lip ignites (1-frame attack, 3-frame peak, settles hot) and spills
warm light onto the picture edges; a hard specular rake crosses the rim while it rocks through the side lights; the
gameplay takes a small shake. Held 1.35 s, then it settles back to the dock (4.25).

## Variant B: Stacked cam (9:16)

**Evidence.** Shorts split: webcam band full width across the top ~30%, gameplay crop directly below, no gap or divider
(tt-7706698795853040917 t00000); the top-right box variant on Shorts (UbHlGkTHRUs t00013.5).

**Our upgrade.**
- Facecam band 0-800 (42%), the 1080p source at 1:1 (sharp), face centred at y ~300 (inside the 230 px status-bar line);
  gameplay 800-1920 from -h shots at 1.04x.
- The seam is a physical part: a 24 px bevelled gunmetal bar with a raised 9 px caption-yellow inlay (Three.js), with
  contact shadows cast up onto the cam and down onto the gameplay.
- Name pill on the seam: a chunky glossy yellow capsule (92 px, bevel 10) with a raised red LIVE plate; DOM type pinned
  to the faces. Centred, x ~270-810, inside the safe zone.

**Motion.** 0.3 the seam draws out from the centre with hot light at both tips; 0.55 the pill springs up out of the seam
tipped back and wobbles flat; LIVE pops, the name rises through a mask. Exit 5.5: pill folds into the seam, seam retracts
to the centre (light at the tips), cut on zero.

**Payoff, 2.9-3.0 s (the crash).** See r02 in the round log: the cam takes over (seam drops to 960), face punch-in, pill
squash on the landing, inlay ignition and light front. Held to 4.25, then springs back.

## Round log
- r01: first build. Critic: v0 8 (locked), v1 7: payoff too faint at phone size, stock pill, 2-frame ghost entrance.
- r02 (v1 only; v0 locked and untouched):
  - the reaction is now a real layout state change, the 9:16 version of A's enlarge: the cam takes over. The seam drops
    800 -> 960 on a spring (band grows over the gameplay), the face punches in 1.14 around the face point, the pill
    stretches while it is yanked, squashes 1.12/0.82 on the landing, rebounds 0.96/1.08 and settles; a softer squash
    when it lands back on the dock line at 4.25;
  - on the landing (3.0): the inlay ignites (3-frame peak), a light front runs outward from the pill, a specular rake
    crosses the pill, the LIVE dot flares, the pill face and chip glow, the gameplay takes the shake;
  - the pill is now a buckle: a gunmetal bezel ring around the yellow lacquer face, raised red LIVE chip, 104 px tall,
    name 44 px; the seam bar is 34 px with a 13 px inlay and a stronger contact shadow onto the gameplay;
  - the pill is opaque from its first frame (no 0.07 s opacity ramp).
