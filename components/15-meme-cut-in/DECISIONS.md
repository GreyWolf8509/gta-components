# 15 Meme cut-in: decisions

## Variant A (16:9, "Framed slam")

**Evidence.**
- Creators hard-cut a reaction image or clip over gameplay for the joke beat and hold it 1–3 s (yt-3nVF2EY_iHg t00527 Gigachad, x 22–100 %, full height; t00523 the same video uses a boxed photo inset at about 35 % width, right of centre).
- Cut-out stickers pop in over gameplay with no box (yt-b5XEkjldydc t00956 kitten, yt-UbHlGkTHRUs t00006).
- The look is raw: no frame, no light, a hard cut in and out. The classic image-macro caption is white heavy caps with a black edge.

**Our upgrade.**
- The meme is a physical glossy print: an 18 px warm paper border (3-stop gradient, lit top lip, darker bottom lip) and a 10 px card edge built as real CSS-3D side faces (lit top, shaded bottom and right).
- The photo is recessed into the paper (inset keyline and shadow), with a soft top-left gloss and a vignette.
- The slam: the card falls from 1.5× toward the screen at -14° rotation, 18° rotateX and -10° rotateY on `power3.in`, so it accelerates into the hit. A 2-frame squash follows, then a spring settle to -3.5° with overshoot.
- The footage shakes (`impact`, flash 0) and gets a 4 px chroma hit.
- A two-layer cast shadow (contact plus ambient) starts far and soft while the card is "high" and tightens on landing.
- Captions are image-macro: Archivo 900 at 64 % width, white, with a black ink layer underneath and a 6 px extrusion.

**Shots.** `v52-gp-police-bridge-h` (police chase on the bridge, HUD gameplay) plays at 1.0× under the card, with a slow push. The meme image is Franklin "explaining" (a still from `v03-franklin-street-h`, frame 9), shown at ≤1.0× native.

**Payoff (1.45 s).** The punchline "IT WAS A TEST DRIVE" stamps in with a squash. At the same moment:
- the photo snap-zooms 0.88 → 1.0 onto Franklin's face;
- the card takes a second, smaller hit;
- a soft specular band rakes across the gloss;
- the keyword "TEST DRIVE" lands in gold with a 3-frame bloom peak.

The hold runs to 3.55 s with a living drift. The exit is a 3-frame wind-up, then a whip out to the upper right with motion blur, cut on the zero frame.

## Variant B (9:16, "Full cut-in"), rebuilt in r04

**Evidence.** Full-frame meme cut-ins (yt-232CmcU0wKg t00032, yt-c-I-jXpGuOk t00881, yt-ePQI2A8d6kQ t00922). A 4:3 or 16:9 source is pillarboxed on solid black rather than stretched (yt-gVyZUp6IWV4 t00068). The cut is hard in and hard out.

**What v0 taught (passed 8 in r03).** It reads as premium because the meme is a physical object, not a window: a paper-grain mount with a lit top lip and shaded bottom lip, a recessed photo with a passe-partout bevel, real CSS-3D card sides, a three-layer cast shadow that converges during the fall, a tilted slam with motion blur, a squash and an elastic settle, and one gloss band across the print. v1 now uses the same print construction.

**Our upgrade (r04).**
- **The record-scratch freeze becomes the bed.** The gameplay (`v56-gp-truck-crash-v`) freezes on the impact frame. The frozen still is the sharp `-h` frame, placed so it matches the `-v` crop exactly (`-v` = `-h` x 464-1072, x1.778). It needle-skips (an earlier frame for 2 frames, a 24 px skid), then pulls back from x1.778 to x1.0 so the frozen frame becomes a sharp picture on real black: feathered top and bottom, dimmed, a clean radial vignette. No blur bed, no grey: the bed's top and bottom are luma 3, and the visible plate is luma 10-60. The freeze grade is baked into the stills, with no CSS filters at the cut.
- **The setup caption** ("WHEN I SAID / I CAN PARK IT", Archivo 900 at 64% stretch, 120 px, bevel face, ink edge, 3-step extrusion) stamps onto the black above the frozen frame.
- **The meme is a physical print at 69% of frame width** (744x872, photo 692x820, a 26 px mount, 12 px thick). It uses v0's paper stock and lips, the recessed photo, the 3D sides, a board edge visible at rest, and the triple cast shadow. It rests at -2.5 deg.
- **One payoff beat (1.62-2.10).** The print falls from x1.45 at a tilt and lands at 1.75 with a squash, an elastic settle, a bed shake and a stage shake, and the bed's lights dim. The photo snap-zooms 0.80 -> 0.96 onto Franklin's side-eye. Two frames later the 3D "BRO." (the Payoff3D module) lands on the print's bottom edge. One soft 560 px light band rakes across the print, clipped to it, and reaches the word as it ignites gold (1.98). The gold holds 2 s.
- **The meme is our own game still** (`v06` frame 48, Franklin side-eyeing Lamar), unsharpened, at <=1.0x (0.80 -> 0.99).

**Exit.** Everything whips up with vertical motion blur. The gameplay resumes where it froze, with a punch-settle and a 0.35 s tail.

**Times (r05).**
- Gameplay 0-1.00
- Freeze 1.00, skip 1.067, pullback 1.12-1.48 (to x1.2)
- Caption 1.20 / 1.32
- Slam 1.62; print, word and snap zoom land together at 1.75
- Sweep 1.73-2.11, ignite 1.85
- Hold push 2.2-3.52
- Out 3.60, gone 3.75, end 4.05
- Hero 2.6

## Round log
- r01: first build.
- **r02** (r01 critic: 7/7 "template-grade outside the hero word").
  - **A.**
    - Sharper, bigger meme: Lamar's shocked face from `v06` frame 42. The photo is 1220×780 (it was 1100×690) and is graded with contrast 1.1.
    - New joke: "LAMAR WHEN I SAY / THE CAR IS [STOLEN]".
    - The keyword "STOLEN" is now real Three.js geometry, using the Payoff3D module pinned to the DOM keyword's exact box inside the card. It lands white on the stamp and ignites gold at 1.60.
    - The paper border gets grain, lit and shaded lips and a triple cast shadow (occlusion, contact, ambient).
    - The milky sweep is replaced by one crisp 110 px gloss band clipped to the photo. The resting gloss is cut to .11.
    - The punchline lands with a 2-frame squash of 1.03/0.97.
    - The slam starts at 26°/-14° rotateX/rotateY.
    - The captions get a bevel gradient face and a graded 3-step extrusion.
  - **B.**
    - The freeze is on the truck-meets-wall frame (frame 36), with saturation .38 and a 1.0 → 1.13 push. Everything is retimed: freeze 1.20, cut 1.62, zoom steps 2.60 and 2.85, ignite 2.97, out 4.45, end 5.05.
    - The bed is rebuilt as a blurred sky colour field from the meme (top band, mirrored bottom band), keeping the blue with dark gradients. Tight contact shadows now fall above and below the window.
    - The stamp moves up to cy 1338 to clear y 1480.
    - The setup lines get the bevel face and graded extrusion.
- **r03** (r02 critic: 7/7 "containers template-grade, soft zoom, ignite pop").
  - **A.**
    - The meme stays within source resolution: zoom 0.74 → 0.88 as a two-shot, with a light 3×3 sharpen and grade.
    - The border is 26 px of deeper stock with a heavier grain, a 1 px lit lip and a passe-partout mount bevel around the recessed photo.
    - A 220 px, 100° specular band sweeps across the whole card at landing (0.60) and at the ignite (1.62).
    - Contact shadow: darker and tighter, with the lift converging over the whole fall.
    - Captions get word-spacing .16em.
  - **B.**
    - The bed is a graded blur of the meme itself (blur 40, brightness .58, saturation .75, contrast 1.15).
    - The ignite moves to 3.25, after the landing settle, so the two scale tweens no longer overlap. The hot light front is halved: no 1-frame flare.
    - The freeze keeps saturation .55. The soft gameplay tail is cut to 0.35 s (end 4.80).
    - Captions get word-spacing .16em.
- **r04** (r03 critic: v0 8 locked, v1 7 "half the frame is mud; the window is a flat rectangle"). Only v1 was changed.
  - v1 is rebuilt as above.
  - The muddy blur bed is replaced by the frozen frame, pulled back to a sharp x1.0 plate on real black.
  - The meme window is now a physical print at 69% width (v0's construction).
  - The payoff is one beat: slam, snap zoom, stamp, sweep and ignite.
  - There are new stills (no sharpening) and a 4.45 s runtime.
- **r05** (r04 critic: v1 7 "the freeze is crushed to near-black and static; three beats in 0.4 s; the payoff is a colour wipe; greige border").
  - **One compound payoff beat.** The print, the 3D word and the face snap-zoom land on the same frame (1.75). Three frames later (1.85) the word ignites gold. At the ignite:
    - the word punches 1.0 -> 1.12 -> 1.0 on its own wrapper, so there is no tween fight;
    - its bloom peaks harder (b/media/payoff3d.js gets `bloomPeak` / `bloomBase` options);
    - a warm radial glow screens onto the print behind it, with a 1-frame attack, a 3-frame hold, then a .3 glint;
    - the print takes the hit: 8 px down and a 1.5 deg counter-turn, with an elastic settle;
    - the bed and stage jolt.
  - **The light sweep** is retimed so its centre crosses the word as the gold front runs.
  - **The freeze reads.** It pulls back to x1.2 (not x1.0), so the frozen crash fills y 312-1608. The dim is .30 (was .52), the vignette is softer and the feathers are shorter. The sides now sit at luma 26-46 and the top and bottom at ~10.
  - **The hold lives.**
    - The plate pushes x1.035.
    - The print, word and glow push x1.02 (parallax).
    - The photo pushes .96 -> .99.
    - The drift is .8 deg.
    - Grain is .06 on plate renders only.
  - **Brighter photo-paper stock** (#FFFFFD -> #E8E3D9, grain alpha .5).
  - **Rest tilt -2 deg.**
  - **Shorter runtime:** hold to 3.60, tail 0.30 s, end 4.05.
