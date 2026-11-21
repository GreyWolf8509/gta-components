# 33 · Goal checklist: decisions

## Evidence (both variants)
`yt-E1Eu2_RUdEo` (5.2M views) is the only reference: t00500, t00930, t00950, t01360. A row of 2–5 round tokens, each a white ring (~8 % of frame width, ~150 px at 1920) around a picture of the thing to get. A collected slot turns its ring bright green (#2ED62E) and gets a green tick at its lower right; uncollected slots stay plain white. The row sits bottom-centre (y 80–96 %), slots tick one at a time across the video, and the row grows per stage (2 → 3 → 5). The look is flat: one-pixel rings, a stock tick glyph, no light, no state animation beyond the swap.

The manifest briefs move it: A is the left-edge checklist with strike-through and a check pop, B is a compact top checklist for a Short with the current goal highlighted. Both keep the evidence object, the round token that turns green and gets a tick.

## Shared upgrade: the token is real geometry (DESIGN 24)
`media/token3d.js`, Three.js r160, rendered from timeline time (Look.drive + hf-seek, no rAF).
- **Ring:** a lathe of a rounded cross-section with a slightly domed front, clear-coated white enamel lit by a key, a hemisphere fill and a PMREM studio env (ACES). It has real thickness, so it shows its edge on the entrance swing and the payoff rock.
- **Face:** the goal picture (a still cropped from the shot library at ≤ 1×) on a recessed dome, with a baked well shadow; an additive clear-coat glass lens over it catches the studio light as the token tilts. Pending goals are dimmed to 66 %.
- **Tick state change:** press 0.1 s before the cut (scale 0.9, tips back 16°, pushes 16 px into depth), then on the cut the ring's enamel is swept clockwise from white to green by a shader angle mask (0.3 s, inOut) with a hot white-green leading edge. At +0.2 s a green clear-coat coin with an extruded, bevelled white tick pops at the lower right on a spring (overshoot) while spinning a full turn (it has a real edge). At the lock (+0.3 s) the ring's green emissive flashes (1-frame attack, 3-frame hold) with a green halo, and a point light rakes across the token top-left to bottom-right. The release is a spring (scale overshoots to ~1.02).
- **Current goal:** a gold metal selector ring (emissive, clear-coat) plus a breathing gold halo around the token. It collapses into the rim as that goal ticks.
- **Payoff:** the last tick. Then every ring rocks through the light in turn (24° on Y, 0.07 s stagger) with a green glow swell, a localised green bloom behind the graphic (no frame-wide light, DESIGN 22) and a small plate shake.
- No GTA marks; type is Archivo narrow 900 caps with a dark stroke, Inter 800–900 for the counter and kicker.

## Variant A: side checklist (16:9, 6.6 s)
- **Layout:** header `GOALS 1/4` (Archivo 46 / Inter 46 tnum) at y 118, then 4 rows: token R 70 (140 px) at x 96, label 60 px at x 262, pitch 158 (centres 280–754). Clears the gameplay minimap (y > 880).
- **Labels:** wipe out of their token (clip-path + 46 px travel + blur 7→0). The current goal's label is caption yellow and punches 1.07. On a tick a 6 px green strike (gradient, dark keyline, glow, a hot tip) draws across in 0.26 s and the text settles to pale green.
- **Counter:** masked digit roll (back.out) on each lock; on the last one the header rolls to `COMPLETE` in green with a 1.14 punch and elastic settle.
- **Shots/cuts:** v49 gameplay (0–1.5) → v17 Deluxo (1.5, tick 2) → v52 police bridge (3.0, tick 3) → v11 yacht (4.5, tick 4 = payoff, bright and sharp).
- **Exit:** 6.0 s, tokens lift then fold edge-on into their centres, labels wipe back into them, header wipes left. Clean from ~6.45.
- **Payoff beat:** 4.5 s cut, lock 4.8 s, gold title 5.0 s. Hero 5.5 s.

## Variant B: top checklist (9:16, 6.6 s)
- **Layout:** 4 tokens R 76 (152 px, 14 % of width) in a row centred on x 540, y 340 (safe x 162–918 incl. the selector). Kicker `GOAL 2 OF 4` (Inter 800 34, yellow) at y 480 and the current goal at 96 px (auto-fit to 840 px) in a 118 px roll window at y 522.
- **Current goal highlighted:** the active token lifts (1.12, +18 px depth), a gold selector ring and halo sit on it, and a gold caret under it points at the label. After each tick the selector slides to the next token on a spring with a velocity stretch.
- **Tick:** the shared token state change, the label strikes through, then 0.48 s later both strips roll up to the next goal (overflow windows, no cross-dissolve).
- **Payoff:** last tick on the yacht cut (4.5), lock 4.8, label rolls to `CHALLENGE COMPLETE` in a gold gradient with an elastic 1.25→1 slam and a specular sheen, kicker `ALL GOALS DONE` in green, ring rock + bloom. Hero 5.7 s (r02).
- **Shots:** v49-v → v17-v (1.5) → v52-v (3.0) → v11-v yacht (4.5), a wide vehicle shot to end on (lesson 21).
- **Exit:** 6.05 s, strips roll out upward with blur, tokens fold away.

## Round log
- r01: first build. Critic 7/7: v0 list covered x 95–834 all video and its struck rows were mush at phone size; neither payoff escalated; v1 titles inked past x 936, kicker/title rolls touched, a blurred hairline lingered; v0 label clip strips left slivers at x≈200.
- r02:
  - **v0 docks (lesson 7):** the full list enters big, then 0.85 s after the first tick every name but the current goal's folds into its token, leaving a 140 px token column. Each later goal's name wipes out of its token when it becomes current, is struck, and folds away 0.85 s after its tick.
  - **v0 payoff escalates:** the last lock punches the whole column (+7 %, spring), the rings rock through the light, and a 2-line gold title CHALLENGE / COMPLETE (Archivo 900 112 px) wipes out of the column at tick + 0.5 s with a 1.16 → 1 elastic slam, a gold bloom on the title (3-frame peak) and a sheen. Holds 1.4 s. Header is `GOALS 4/4` at 52 px with the counter 14 px from the word, `/4` at 72 %.
  - **v1 payoff:** the struck last goal rolls out, then a 2-line gold title (138 px) slams in (snap-on, 1.45 → 1 elastic, blur 10 → 0) with a bloom and sheen. Both gold titles are a gradient face over a separate under-layer that carries the 13–15 px dark stroke and a 5-step extrude, so the stroke no longer eats the gold.
  - **v1 safe zone:** row, kicker and title centred on x 504 in 864 px windows (x 72–936), titles auto-fit to 830 px. Kicker window y 474–522 and title window y 532–650 no longer touch.
  - **Residue:** label clips, header, strips and title are `visibility:hidden` outside their windows (no slivers, no hairline).
  - Runtime 7.0 s on both; a short v45 beach aerial follows the yacht so the 1.4 s hold never overruns a shot.
- r03:
  - **Payoff is real geometry:** both titles are extruded, bevelled Archivo 900 glyphs (`media/title3d.js` + `media/glyphs.js`, the shared Payoff3D). They land as white enamel, then a light front sweeps them to polished gold (ignite staggered 0.07 s per line), followed by a raking key, one specular sweep, a bloom on the letters and a contact shadow. A wipes the title out of the token column (clip from the ink's left edge, 1.16 → 1 elastic). B slams it in (1.45 → 1 elastic) centred on x 504, under `ALL GOALS DONE`.
  - **No roll blur (r02 defect):** filter blur inside the `overflow:hidden` roll windows made a hard dark rectangle, so it is gone from every roll, entrance and exit. Rolls are pure masked travel.
  - **Exit finishes in time (r02 defect):** stagger 0.03 s, out at 6.45 s (A) / 6.5 s (B), and everything is `visibility:hidden` by about 6.85 s.
  - **Phone legibility:** bolder 512² goal pictures (cash brick in hand, Deluxo rear with tail-lights, police SUV, yacht bow on blue water), token R 76 in A, a stronger key light plus a rim light, and a broad specular band crossing ring and glass on each lock and on the payoff wave (the old point-light speck is gone). B's kicker is 44 px.
  - **B selector irises** instead of sliding: it springs in on the next goal (0.7 → 1 with overshoot), so it never travels as a flat ellipse.
  - Critic 8/8, no defects: PASSED (sticky). Nitpicks left: A's title arrival is a mask-only wipe (B's slam is stronger), the gold ignition reads as per-letter blinks, the cash token photo is soft at phone size, and the gold hold is about 1.0 s.
