# 26 · Transformation meter: decisions

## Variant A: Badge + fill (16:9, 1920×1080, 7.0 s)

**Evidence.** `yt-EP_LdrobwPg` t01043 (5.5M views) is the reference. A pointy-top hexagon portrait badge sits at the top-left, x 2–12 %, y 3–25 %, about 240 px tall at 1080, with a thick royal-purple rim and a white inner ring. A wavy sine-wave tube about 110 px thick runs out of its right side to x ≈ 37 %. The empty track is translucent white. The fill is a left-to-right lime → yellow → orange → red gradient with a textured, liquid-looking leading edge. Between beats it is static, and it steps up over the video: t00370 ≈ 20 %, t00715 ≈ 50 %, t01011 ≈ 80 %, t01043 full. At the end it animates out piece by piece; at t01055 the hexagon is gone first. `yt-E1Eu2_RUdEo` t00524 shows the same badge-plus-fill pill at the top-right, with a per-form portrait and colour, which "pops larger on completion" (t00144, t00524, t01372).

**Our upgrade.**
- **Badge.** It's the same pointy-top hexagon, at the same size (216×250) and the same dock (left 44, top 40), drawn in SVG with rounded corners. The rim is a 3-stop violet gradient (#B48DFF → #7B3BF2 → #4C1AB0), with a lit bevel stroke that fades out down the top half, an inner groove shadow and a white ring with a cool falloff. Behind it sits a soft contact shadow. The portrait (a still cropped from the shot library) gets an inner vignette and a diagonal gloss.
- **Tube.** The same 1.75-period sine tube, drawn per frame on a 2× canvas. The glass is milky and desaturated: a backdrop blur (`blur(10px) saturate(.35) brightness(1.25)`, clipped to the tube outline) under an `rgba(255,255,255,.38)` base, with a 2 px inner top shadow for the glass thickness. Footage behind the empty track reads as frost, never as fill. A machined metal collar sleeves the tube where it leaves the badge, 24 px past the hex edge, so the tube's start cap is never visible. The rim is lit from above: a light band along the top edge and a dark band along the bottom edge, both following the wave. The glass carries a broken top specular, a soft wide highlight, a bottom rim reflection and a glint that travels along the tube.
- **Liquid.** It uses the evidence gradient, fixed in space, so warmer colours appear as it climbs. On top of that:
  - cylinder shading: a screen-blended top light and a multiply-blended belly shadow;
  - flow streaks that travel downstream;
  - about 34 deterministic bubbles that rise from the belly to the top wall and pop;
  - a convex meniscus front with a glowing rim line. It bulges forward with velocity during a surge and sloshes (a damped spring) when it lands;
  - light that spills into the empty glass ahead of the front.
- **Ticks.** Two stage rings on the glass (46 %, 73 %), with a measuring scale (major and minor ticks every 5 %) along the inner wall. A ring flashes gold when the liquid reaches it.
- **State change on each stage.** The surge uses `back.inOut`, so the liquid pulls back, rushes, overshoots and settles. When it lands:
  - the stage ring flashes, and 7 additive embers lift off the fill head (within 80 px);
  - the badge punches (1 → 1.18 in 0.07 s, then `back.out(2.2)` back over 0.35 s);
  - the new portrait opens over the old one in a 0.13 s radial iris from the centre, with a thin gold edge ring, settling in from a 1.16× push while the old one sinks to 0.9×;
  - the rim itself takes the light: a white-gold flash off the metal, decaying over 0.4 s. Nothing washes over the face;
  - the LV chip under the badge rolls to the next level in a masked roll and slams (1.5 → 1).
- **Payoff (MAX).** The fill reaches 100 %:
  - the whole meter pops to 1.16× (the E1Eu2 completion pop) with an elastic settle;
  - the rim turns from violet through white-hot to polished gold under the rim flash, on badge, collar and tube;
  - the new form irises in and the chip becomes a gold MAX;
  - one specular band (screen, skewed 30°, 0.35 s) sweeps the whole tube; embers lift off the full end and keep trickling while it holds;
  - the payoff light stays on the object (DESIGN 22): a screen-blended bloom on the badge and tube peaks for 3 frames and decays, plus the coloured aura round the tube and an impact shake. There is no frame-wide exposure.

  At 5.6 s the meter settles back to the dock.
- **Entrance and exit.** It enters big (1.42×): the badge spins in from blur (opacity cut to 1 on the first frame, DESIGN 23), the collar slides out, and the tube extrudes out of it like toothpaste. It docks to 1.0 with a spring while the first pour fills to 20 % (LV 1 reads charged, not empty). On exit (6.15 s, DESIGN 14):
  1. the chip collapses into the badge;
  2. the tube retracts into the collar;
  3. the collar slides under the badge;
  4. the badge spins down to a point with blur.

  The frame is clean from 6.73 s.

**Shots and cuts.** Each cut lands on the form it introduces:
- v49 gameplay of Franklin by the mural, 0–1.23: the LV1 portrait is Franklin;
- v06 Franklin and Lamar, 1.23–2.83: LV2 is Lamar, at 2.05;
- v08 Trevor with the rifle, 2.83–3.60: LV3 is Trevor, at 3.25;
- v30 street explosion, 3.60–4.55: the final surge builds;
- v09 Juggernaut, 4.55–5.75: MAX lands on this cut, and the badge irises to the Juggernaut;
- v23 minigun park, 5.75–7.0: bright, for the settle and exit.

**Payoff beat.** MAX at 4.55 s. Hero frame 5.0 s.

## Variant B: Power tube (9:16, 1080×1920, 7.0 s)

**Evidence.** `yt-J2ed1YF71ZU` t00464 (4.9M views) is the reference. A tall rounded capsule tube hugs the left edge: about 6 % of the frame wide and 85 % of its height. It has a white/light-grey empty track, a golden-yellow fill (#F7C21E) rising from the bottom and a thin gold border. A warm yellow-orange glow bleeds about 10 % into the frame, and an illustrated emblem crowns the top. An orange orb with a red star sits low on the tube, with a heavy white rounded number beside it ("2,500", about 5 % of frame height, with a dark shadow). The number steps between cuts: 1,200 at t00440, 1,500 at t00448 and 2,500 at t00464. `yt-E1Eu2_RUdEo` t00012 adds the locked "?" tier language.

**Our upgrade.**
- **Tube.** A glass capsule (inner width 108 px, inner top y 470 to the orb at y 1296). It has a milky, desaturated backdrop blur (`saturate(.5) brightness(1.18)`) behind a frosted white track, with a 2 px inner wall shadow. It has a polished cylindrical gold rim: a 6-stop metal gradient, with a dark outer line and a contact shadow.
- **Liquid.**
  - It is amber-gold, from #E8890F at the bottom through #F7C21E to #FFE45C near the surface.
  - Cylinder shading: a left highlight and a right belly shadow.
  - Light streaks rise through it, and about 40 deterministic bubbles climb out of the orb, wobble and pop at the surface.
  - The meniscus is concave (it climbs the walls), with a bright surface line, foam and a glow that spills up into the empty glass. After each surge it tilts and sloshes on a damped spring.
- **Glass.** It carries a broken left specular, a right rim light and a glint that rides up the tube on every surge.
- **Ticks.** Gold notches every 500, each with a label. Each notch lights gold, with a pop, as the liquid passes.
- **Glow.** The evidence's warm edge glow, as a screen-blended side light round the tube. It reaches at most 200 px from the tube centre, peaks at 0.14 alpha and strengthens with the level. It is off in `bg:none`, where the light lives on the objects instead (tube aura, orb bloom, crest halo).
- **Orb.** Our own power orb at the base (DESIGN 20): amber glass (#FFF3C0 → #FFD24A → #F2A21A → #C9600C → #7A2A04) with an engraved double up-chevron. The engraving has a shadowed upper wall, a lit lower lip and a groove floor that charges toward white-hot with the level and flares on each step. It also has swirling bubbles, a top-left specular, a bottom caustic, a rim light and a gold collar where the tube meets it. On each surge the orb pulses and the chevrons kick up. The evidence's red star is kept only as a CONFIG option (`orb.mark: "star"`).
- **Counter.** It sits beside the orb, as in the evidence: a true odometer in Inter 900 at 140 px with tabular figures.
  - The ones and tens are fixed "0" wheels and the hundreds wheel turns. The thousands wheel only turns while the hundreds wheel wraps 9 → 0 (the carry).
  - Digits sit 170 px apart on each wheel, inside a 150 px window with feathered top and bottom edges (mask 12 %/88 %), so no neighbour digit shows at rest.
  - It has a 4–6 px vertical blur only while a wheel moves.
  - Each step runs fast, then settles its last hundred with `back.out(1.6)` over 0.28 s, timed so the target digit arrives on the liquid hit. It never runs backwards or past the target.
  - A dark 26 px glow (`rgba(0,0,0,.45)`) keeps the white numerals legible over the muzzle flash.

  Above it sits a gold "POWER LEVEL" label (feathered roll window), and a "+600" delta pops beside the meniscus on each surge, then collapses back into it. Punches scale a wrapper (`#numWrap`) from the numerals' baseline: 1.08 on each step, 1.12 at MAX. Nothing clips and the digits never reach the label row.
- **Crest.** Our own replacement for the dragon: a gold hexagon crest holding the *locked* final form. The locked state is a black silhouette under a padlock, against a blue radial. The final form is Michael (v22 at 0.2 s: front-lit 3/4 view, closed neutral mouth), keyed off the sky so a gold radial halo (#FFD98A) sits behind the head and never over the face.
- **Payoff.** The liquid floods the top:
  - the shackle pops and the padlock is thrown up and right, shrinking to nothing;
  - the final form wipes up out of its silhouette in a 0.12 s feathered bottom-up mask, with no ring; the gold rim takes a white flash;
  - the crest punches (1.3), then grows to 1.15 (elastic) so the reveal reads at phone size;
  - one specular band (screen, skewed 30°, 0.35 s) sweeps up the tube and orb, and embers lift off the full tube behind the crest;
  - the counter punches 2,500 from its baseline (1.12 → 1) and turns gold, and once the punch has settled (TMAX + 0.14) the label rolls to "MAX POWER";
  - the payoff light sits on the objects: an aura round the tube, a bloom round the orb and a halo round the crest edge (peak held 3 frames), plus an impact shake. There is no frame-wide exposure (DESIGN 22).
- **Entrance and exit.** On entrance:
  - the orb pops in big and the tube shoots up out of it;
  - the crest drops onto the top with a bounce (solid from its first frame, with a short motion blur);
  - the counter wipes out of the orb behind a mask.

  On exit (6.15 s, DESIGN 14):
  1. the counter mask-wipes back into the orb, with an 8 px horizontal blur;
  2. the crest folds into the tube top;
  3. the liquid drains into the orb;
  4. the tube retracts into the orb;
  5. the orb pops shut.

  The frame is clean from 6.73 s.

**Shots and cuts.**
- v54 gameplay of Trevor walking (HUD, like the evidence), 0–1.75;
- v08 rifle, 1.75–2.72;
- v23 minigun, 2.72–3.80;
- v30 street explosion, 3.80–4.70;
- v34 rocket at the helicopter, 4.70–5.53: the payoff lands on the launch flash. The figure is seen from behind over the skyline; DESIGN 21 rules out paying off on the full-frame 9:16 Juggernaut close-up;
- v26 bridge explosion, 5.53–7.0: a wide landscape to settle and exit on.

**Steps.** 0 → 600 (1.2 s) → 1,200 (2.15 s) → 1,500 (3.05 s) → 2,500 (3.95–4.70 s), echoing the evidence's 1,200 → 1,500 → 2,500.

**Payoff beat.** 4.70 s. Hero frame 5.1 s.

## Recognition check
- **A.** A creator from EP_LdrobwPg would see their hexagon-plus-wavy-rainbow tube in the same corner at the same size. The material, light, physics and per-stage swaps are the step up.
- **B.** A creator from J2ed1YF71ZU would see their left-edge gold power tube, the orb at its base and the number beside it. The franchise star orb becomes our own chevron power orb, and the dragon becomes a locked final-form crest, which is the transformation payoff.

## Round log
- **r01:** first build, with self-review fixes applied inside the round:
  - **A, opening shot.** It opens on v49 (gameplay of Franklin by the mural) instead of v03, so the 1.42× entrance doesn't cover a face.
  - **A, framing.** v09 and v23 are scaled (1.08 / 1.12) from the left so the popped and docked tube clears the faces.
  - **A, colour.** The liquid was too milky, so it's now more saturated, with a deeper belly shadow.
  - **A, gold transition.** The rim now goes purple → white-hot → gold, hidden behind the edge-on flip, so it never passes through a muddy brown.
  - **A, exit.** Stage collars are hidden once the tube has retracted past them.
  - **B, size.** The tube is wider (inner 108 px) and the crest is 1.24× bigger.
  - **B, counter.**
    - Leading columns unfold (0 → 600 → 1,200); there are no leading zeros.
    - The ones column is static and only the tens spin, with the blur capped at 5 px.
    - It never runs backwards: its own eases have no overshoot or anticipation, while the liquid keeps its slosh.
  - **B, glow.** The glow is a full-height canvas feathered on every edge; it had hard edges in `bg:none`.
  - **B, payoff shot.** It lands on v09 at media 0.4 (face lit by sky) instead of the dark armour, and closes on v26.
  - **B, entrance.** The orb now pops to 1.42× before settling.
  - **Both.** Faces are explicitly loaded before the counter digits are measured.
  - **Both, phone-size pass (lessons 11–13).**
    - No 4-point glints: the light comes from the glass specular, the liquid and the aura.
    - Crest portraits are cropped from the -h shots.
    - No payoff or ending on a gp-* shot.
    - A: the chip is bigger (140×56, 34 px) and the MAX aura and rays are stronger.
    - B: the tube has moved to CX 190, so the crest holds at 1.1× inside x ≥ 72; the rays are brighter and the crest vignette is lighter.
- **r02** (verdict r01: 7 / 7. The objects were right, the beats template-grade):
  - **A, stage swap.** The zero-thickness rotationY coin-flip is gone. The swap is now:
    - a scale punch (1 → 1.18, then `back.out(2.2)` over 0.35 s);
    - a 0.13 s radial iris from the old portrait to the new one, with a gold edge ring and a 1.16× settle;
    - a white-gold flash on the rim metal.

    The badge stays face-on throughout, and a metal collar sleeves the tube end.
  - **A, exit.** It collapses (chip into badge → tube into collar → collar under badge → badge spins to a point). `T.out` is 6.15, and the frame is clean from 6.73 s, so the last 8 frames are empty.
  - **A, glass.** `saturate(.35) brightness(1.25)` over a milky .38 white base with a 2 px inner top shadow. LV1 pours to 20 %, and the stage rings move to 46 % / 73 %. At phone size the LV1 frame reads as about a fifth full.
  - **A, portraits.** Re-cropped to neutral-mouth, front-lit frames (lesson 16):
    - Franklin: v06 at 0.75 s;
    - Lamar: v06 at 1.2 s;
    - Trevor: v33 at 0.9 s;
    - Juggernaut: v09 at 0.55 s. This is the least open-mouthed frame the clip has; every frame shows gritted teeth.
  - **B, counter.** Rebuilt as a true odometer:
    - fixed tens and ones, carry-only thousands;
    - 170 px pitch in a 150 px feathered window;
    - blur only while moving;
    - a `back.out(1.6)` 0.28 s settle that lands on the hit;
    - a 26 px dark glow.

    It can no longer show neighbour digits, a stray bar or a value above the target.
  - **B, orb.** Our own amber chevron power orb. The star is a CONFIG option only (lesson 20).
  - **Both.** The confetti sparks, the sunburst rays, the shockwave rings and the white swap flashes are removed (lesson 19). The light now comes from:
    - one 30°-skewed specular band at MAX;
    - 6–8 additive embers near the fill head, plus a short trickle at MAX;
    - rim flashes on the metal.
  - **Both, lessons 21–23** (arrived mid-round):
    - The frame-wide `Look.expose` at MAX is replaced by localised bloom on the objects, with the peak held 3 frames.
    - B's payoff moves off the full-frame 9:16 Juggernaut close-up to v34, with v26 for the exit.
    - Chips, deltas, the crest and the badge cut to opacity 1 on their first frame, and B's counter enters through a mask.
  - **Kept.** The MAX aura and glow (light without a veil), the padlock-to-portrait unlock on the 4.70 s cut, the 2,500 type, and the liquid, meniscus and gloss tubes.
- **r03** (verdict r02: v0 8 PASS, now locked and untouched; v1 7). v1 only:
  - **Counter clip (defect).** The hard clip at x≈805 was the entrance mask: `#ctr` kept `clip-path: inset(-60px)` after the wipe. The clip is now cleared once the wipe opens (1.06 s), and the exit wipe starts from `inset(-140px)`.
  - **Label collision (defect).** The punch moved to a `#numWrap` wrapper, scaled from the baseline (`transform-origin: 0 84%`) at 1.12. The label roll starts at TMAX + 0.14, after the punch. The alpha export confirms the glow is soft all round and the digits stay below the label.
  - **Reveal face.** The MAX form is now Michael (v22 at 0.2 s): a 3/4 view with a closed mouth, keyed out so a gold radial sits behind the head. The locked state is his silhouette on a lighter blue radial. The crest grows to 1.15 at MAX. The Juggernaut stills are removed from `b/media`.
  - **Iris monocle.** The ring iris is replaced by a 0.12 s bottom-up feathered mask wipe.
  - **Glow.** The side light reaches ≤ 200 px at peak 0.14 and is off in `bg:none`. The MAX light moved onto the tube, orb and crest edge (tube canvas). The haze strip and the olive cast are gone.
  - **Not taken.** The Three.js orb (lesson 24) stayed optional. The fixes above address everything the critic listed for 8, and WebGL would add render risk to a seek-safe canvas build.
