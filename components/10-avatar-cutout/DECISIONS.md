# 10 Avatar cutout: decisions

## Evidence (both variants)
- **Job:** the creator's own avatar/mascot docked at a frame edge, popping in to deliver lines over gameplay, swapping
  expression on each beat (DRjdwi4zAzU t00020/t00028, _GUWVk2sbGE t00008/t00088, sYp0S6VQyCE t00064).
- **Look:** flat cartoon with thick black outlines, flat fills, big white eyes, sweat drops; no box; cropped by the bottom
  edge as if peeking up, 25-30% width, 50-70% height (DRjdwi4zAzU). Variants: a bust on a slanted cyan blade bar with a
  glossy top and dark chevrons (E1Eu2_RUdEo t00008), a cut-out cropped flat on a thin rule (CKq35NK70h0), a white sticker
  border around the cut-out (sYp0S6VQyCE). Names appear as heavy caps (_GUWVk2sbGE "TECHY").
- **Motion:** scale-up pop in, hold while the player talks, expression swaps every few seconds, pop/slide out.

## Our upgrade (shared avatar, `media/avatar.js`)
- Our own character (gamer presenter: yellow hoodie, headset with boom mic, messy quiff), drawn in SVG in the evidence's
  thick-ink cartoon vernacular, but every part is lit: base radial gradient, hard cel-shadow crescent (shape minus its
  offset copy), warm rim crescent on the right, cast shadows (hair on forehead, chin on neck, hood fold on chest),
  specular on the cups, hair strands and highlights.
- A real die-cut **vinyl sticker**: one SVG filter builds a round white border (dilate+blur+threshold), a grey vinyl
  edge offset below it (thickness) and a soft contact shadow onto the footage. A laminate gloss band sweeps across on the payoff.
- Physics: springs up from below with stretch on the rise and squash at the apex; hair and drawstrings follow through;
  head bob while talking; decaying tremble after the shock.
- State: talk (5-shape lip-sync from `Look.hash`, brow lifts, blink, glance to camera) -> **SHOCK** (anticipation dip,
  jolt with stretch, huge eyes + screaming mouth, hair springs up, ink shock marks pop with white sticker borders,
  sweat drop slides) -> LAUGH (r02) -> exit.
- Name blade: slanted cyan slab with a 4-stop face gradient, white lit top lip, darker underside (depth 13 px), ink edge,
  chevrons, gloss pass; same sticker border. "EVEREST" in Archivo 900/72% white with ink stroke, handle in Inter 800.

## A (16:9) "Presenter avatar"
- Bottom-left, cropped by the frame bottom (DRjdwi4zAzU placement), bust 470 px wide, head top y~330 (about 70% height),
  blade across the chest at y 930-1008 (text inside title-safe). Shock marks stay x >= 67.
- Shots: v31 red car (0-1.45) -> v17 Deluxo, which lifts off at ~2.65 (1.45-3.03) -> v26 bridge explosion (3.03-4.71)
  -> v11 yacht (4.71-6.0). Cut like an edit, all 1.0x, in-points inside each shot's length.
- Beats: pop-in 0.30, blade 0.62, talk 0.8-2.5, **payoff 2.66** (SHOCK on the Deluxo lift-off, shake on the plate,
  gloss), shock hold to 4.16, grin + talk, exit 5.0 (blade retracts with blur, avatar dips then drops out), end 6.0.

## B (9:16) "Mascot pop-up"
- Rises from behind its name blade at the bottom of the Shorts safe zone (blade y 1376-1458), so it "enters from the
  bottom edge" without sitting under the caption/handle UI. Balloon at y 344-612 (hook zone), x 128-920.
- Comic balloon: white-to-cool slab, ink edge, sticker border, tail to the head. Pops out of its tail with a spring;
  words rise in masks. **Payoff 2.52**: balloon punches, a yellow SHOUT fill bursts out from the tail, "WAIT FOR IT..."
  rolls up out of the window and "NO WAY!!" rolls in at 176 px; same SHOCK face, gloss over balloon and sticker.
- Shots: v11 yacht -> v17 Deluxo lift-off (payoff) -> v26 bridge explosion -> v36 hills (wide, end).
- Exit 4.58: balloon sucks back into its tail, avatar ducks behind the blade, blade retracts. End 5.8.

## Round log
- r01: first build. Critic 7/7: generic one-pose emote, payoff = face swap + uniform stretch (cups went oval), payoff
  light too faint, [v1 defect] blurred avatar remnant in the 34 px clip strip after the blade left.
- r02: three real drawings instead of one: TALK, SHOCK (wide eyes, scream, both hands up beside the face, anatomically
  mirrored palms, sleeves with cuffs and cast shadows on the hoodie) and LAUGH (squeezed eyes with tears, pointing at
  the gameplay), so the hold has the evidence's per-beat expression cadence. Payoff split into layers: the head snaps up
  and tilts back (no non-uniform scale), the body squashes, arms spring up from below, hair/strings/mic boom lag.
  Payoff light is now an explosion-side hot rim on the sticker's right edges (1-frame attack, 3-frame peak, ember decay)
  plus yellow ink-edged flash marks, shake and a 1.3 exposure pulse on the plate; the milky face sweep moved to the
  landing. v1: clip line at the blade's top edge + avatar/balloon/blade hidden after their exits (remnant fixed);
  group moved inside x 72-936 / y <= 1480, balloon lifted so the tail clears the hair. A runs 6.4 s, B 6.2 s.
- r02 verdict: 8/8, no defects (PASSED, both locked). Open nitpicks: thin rim light at phone size, v1 stack covers the clip's action, small handle.
