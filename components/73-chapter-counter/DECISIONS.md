# 73 Chapter counter card: decisions

Origin: built 2026-11-21 inside the film `films/gta6-rdr2-gta5` (kit `assets/kit/film.{css,js}`, `card` + `prog` objects), then
copied here. r01 (6/6) and r02 (fix capture, not judged) used the kit files directly. From r03 the component is standalone:
its own `<style>` + CONFIG + script, with the same object names (`.board`, `.kick`, drum, `.cof`, `.head .hl1/.hl2`, `.rule`,
`.prog`) and the same content structure so the CSS/JS can be ported back into the kit.

## Evidence (gta/19-chapter-card)
- Creators' chapter / "time later" cards are blunt: a plain black full-frame card with centred white text, hard cut in, held
  a few seconds, hard cut out (yt-R24KBNuOiR4 t128); a heavy-caps section label "ATTEMPT 2:" top-centre (yt-5-QjENpFb98);
  a big static date title over the landing shot (yt-3nVF2EY_iHg). The job: a full-frame divider that names the section,
  then the footage of the section lands. No material, no motion beyond the cut.
- Ours keeps that job and placement (full-frame card, hard cut in, slide out to the section's first shot) and adds the one
  object creators never build: a mechanical NN / 14 counter.

## Variant A (16:9)
- Board: a lit painted surface, not a gradient. Base #0B0E1C with a key-light pool (elliptical radial, #2B3462 core)
  top-left where the key hits the drum, a slow 60 px drift of the pool over the hold (the light rakes), a vignette that
  takes the corners to #05070E, 6% noise. Blacks stay black.
- Drum: real Three.js geometry. Two cylinders (R 360 px, one per column, 164 px long, 6 px gap), digits 0-9 painted on a
  canvas texture (Oswald 700, cap 176 px) wrapped round the circumference; MeshPhysicalMaterial (roughness .42,
  metalness .25, clearcoat .55) lit by a warm key top-left, a cool rim low-right, a hemisphere fill and a PMREM softbox env,
  ACES. Window 334x392 cut into a housing plate (gradient, 1 px lit top edge) with inner shadows at the window's top and
  bottom edges, a centre split line, and a contact + cast shadow onto the board.
- Roll: only the columns that change roll (00 -> 01 rolls the units wheel; 09 -> 10 rolls both). Wind back 0.12 digit
  (0.12 s), roll to +1.09 (0.36 s power2.inOut), snap back into the detent (0.10 s power3.in). Lock at 0.58 s = the one
  payoff: a 3-frame light burst on the drum face only (key x2 + a front flare light, specular band), a 1-frame 1.5% punch
  of the housing, 3 px shake. No frame-wide flash.
- Kicker, "/ 14", headline lines and the rule: clip-path wipes (opacity always 1, no ghost pre-frame), 0.26-0.30 s
  expo.out, inner x drift -36 px. Headline 112 px Oswald 700: line 1 in RDR2 red #D9444F, "BECOMES" #B9B7DA, the object in
  GTA VI pink #F2558E; pink rule 520x6.
- Optical alignment: the drum's first digit's ink edge, the kicker's S, the headline's T and the rule all sit on x = 192
  (the T's side bearing and the digit's bearing are measured at build).
- Exit: the whole card slides up off the frame (0.4 s power3.in) at 2.6 s onto v17-deluxo-sunset (then v31-red-car-sunset
  at 4.13 s). The progress chip docks: slides down into its corner (right 64 / top 48) at 3.0 s, holds, and leaves at
  4.78 s by sliding back up into the corner (power3.in, directional blur), never a dissolve.
- Shots: official GTA V trailer shots only (`assets/shots/`); the RDR2 clip from the film is gone.

## Variant B (9:16, Shorts)
- Phone-first from `gta/_template/b`: the drum is the hero at ~60% of frame width (R 600, wheels 300 px long, cap 290 px,
  window 608x564 at x 52-700), kicker 40 px, "/ 14" 84 px, headline 120 px two lines, rule 8 px, all inside x 72-936 /
  y 230-1480; chip 84 px tall at right 144 / top 240. Same choreography and payoff. `-v` shots (v17, v31).

## Round log
- r01: 6/6 (critic): font fallback, one-block drum, ghost pre-frame on the headline, chip dissolve, misalignment.
- r02: fix capture, not judged (Oswald inline, per-column drum).
- r03: rebuilt standalone as above; B rebuilt 9:16.
- r03: critic 7/7, no defects, no caps. Gap: "template-grade around the one good object": typewriter wipes, the lock
  firing at frame 9 before the headline exists, no drum-to-chip hand-off, kicker too small at phone size, B drum 53%.
- r04: order reversed so the lock is the climax (kicker 0.05, "/ 14" 0.22, headline 0.34/0.44, rule 0.62, roll from
  0.50, lock at 1.08 with overshoot to +1.14, a 3 px housing dip, 1-frame 1.6% squash, 3-frame key/flare burst and a
  22% local brightness on the cavity only). Reveals are mask rises (clip-path from the bottom + y + blur 8 -> 0, opacity
  always 1). The dock is now a hand-off: the housing lives in its own clip (`#fly`) and at 2.55 s lifts off the board
  and flies into the top-right corner, scaling to the chip's height, while the board slides up; the chip's left part is
  a mini housing with a dark cavity holding "01", so at 3.0 s the docked drum becomes the chip and the "/ 14" tail
  unfolds out of it. Kicker 44 px. B rebuilt: housing on x 72 at 64% of frame width (R 560, wheels 320, cap 270),
  three-line 128 px headline (verb and object on their own lines), 84 px chip, card cuts at 2.35 s, 4.7 s total,
  v17-v then v16-v (v27-v carries a title in that window). Oswald kept (the film's face, lead override); the board
  stays a lit surface, not a footage bed (lead spec), with a second pool so the right half is not dead.
- r04: critic 7/7, one v1 defect (the flying drum crossed the headline during the dock); gap: dead right half of 16:9,
  kicker and "/ 14" floating alone after the lift, no arrival for the drum, soft end shots.
- r05: the drum arrives at t=0 (scale .96 / 18 px / 6 px blur settle, opacity 1); a diagonal light band crosses the
  board over the hold; before the lift "/ 14" is swallowed by the drum (x + scale to 0.04) and the kicker wipes out, then
  the housing lifts straight off the top and drops into the corner (never across type), the chip's tail unfolds within
  two frames of landing and the chip stays to the end (persistent, as in the film). A: a sharp 824x464 window of
  v44-bridge-skyline-h irises open on the right at 1.5 s and expands into the full frame on the cut (transforms only),
  then v17-deluxo-sunset-h; 4.65 s. B: v17-v then v44-bridge-skyline-v (ends on a wide, sharp shot); "/ 14" at 76 px
  inside x 912. Critic: v0 7, v1 8 (PASS), no defects. v0's remaining asks: window in from the start as a built framed
  object, a designed headline exit instead of occlusion, the rule measured to the emphasised line, one accent only.
