# 74 Focus button: decisions

- Instanced 2026-11-21 from the film kit object in films/gta6-rdr2-gta5 (assets/kit/film.js, `focus`), over the official footage the film uses under it. Starting point for the gauntlet; the film's version is flat DOM and must be rebuilt with material, light and a real payoff.

## Round 1 (rebuild as real geometry, lesson 24)

**Evidence.** No census frame of its own: this is the ability-handoff object of the GTA VI vs RDR2 comparison (film ch04). Nearest vernacular is the ability/prompt objects creators recreate (47 selection wheel: a big round coin-like wheel object centred in frame with the character portraits; 48 mission HUD: in-game prompt objects over gameplay). Creators' versions are flat discs with a radial highlight; the job is "two abilities become one", shown as two named coins merging into one button that gets pressed on the word. It sits centred, big (300 px coins in the film), over the GTA VI car shot.

**Our upgrade (both variants).**
- The coins and the button are real Three.js geometry: a lathed disc (flat back, cylinder wall, a quarter-round bevelled rim, a shallow machined groove ring on the face). MeshPhysicalMaterial with clearcoat 0.9 in the game's identity colour (RDR2 oxblood for EAGLE EYE and DEAD EYE, GTA VI pink for FOCUS), PMREM environment (studio dome + overhead softbox + key strip), key + hemisphere + rim lights, ACES tone mapping. The FOCUS button sits in a gunmetal bezel ring, so the press has something to press into. Each object casts a soft contact shadow on the plate.
- Camera is a long lens (FOV 14) elevated 56° above the button plane, shifted lens (no keystone): the face is a slight ellipse, the top wall and bevel catch the key.
- Labels are crisp DOM, Oswald only (600 for the coins, 700 for FOCUS), pinned to the projected face plane every frame with a 2D affine matrix (so they foreshorten and move with the geometry). 16:9: 50 px coin labels, 84 px FOCUS; 9:16: 60 / 128 px.
- Entrance (t1): each coin slides in from off-frame on its side, with speed stretch along the travel axis and a bank about z that settles with overshoot (back.out), landing with a 3 px kick.
- Merge (t2): the coins accelerate into each other over 0.3 s (power2.in) with overshoot past centre; at contact they squash 2 frames, and the FOCUS button springs up from the contact point (0.55 → 1.08 → 1) with its bezel, the cap dropping into the bezel with a back.out settle; 5 px kick and a 3-frame glow on the new button.
- Press (t3, the payoff): the cap travels 22 units down into the bezel in 0.08 s (≈ 11 px on screen), a 2-frame squash (scaleY 0.86), a soft specular band (world-space, face-weighted, 70 units wide) rakes across the face over 0.26 s, a 3-frame localised expose (material glow + key light spike, no frame-wide flash), a 1-frame 7 px impact. Pressed state held 1 s.
- Release (t4): the cap springs back up (back.out(3), 0.24 s) with a quieter sheen.
- Exit: the whole button collapses into its centre (power3.in, 0.26 s) under a 6 px blur on the labels; cut on the zero frame, 0.2 s of footage tail.

**Shots and cut points.** Variant A: the official GTA VI clip already in `a/assets/clips/` (4.9 s), full frame, slow push 1.0 → 1.04, no cuts (the merge and press are the beats). The hero sits centre-left (x 720, y 600) so the driver's face on the right stays clear. Variant B: the same clip cover-cropped to 9:16 (object-position 80% so the driver stays in frame top-right), hero at x 504 (safe-zone centre), y 1130; coins 380 px, FOCUS button 640 px (59% of frame width).

**Payoff beat and time.** The press at t3 = 3.0 s (hero frame 3.15 s, pressed and lit). Beats (CONFIG.beats): t1 0.25 coins in, t2 1.9 merge, t3 3.0 press, t4 4.0 release, exit 4.45, end 4.9.

**Kit port.** The lead can port `a/index.html` (the Three.js focus object, `CONFIG` at the top) and `a/media/fonts/Oswald-wght.ttf` (+ OFL) into the film kit; `b/index.html` is the same code with the 9:16 CONFIG.

**Round 1 self-review fixes (before the critic).** First snapshots came out over-lit (coral instead of oxblood, the pink washed to white by a broad softbox reflection): deepened the pre-ACES colours (#6E0F19 / #D4286A), exposure 0.92, the softbox shrunk to a highlight strip behind the camera axis, key 1.7, env 0.7; camera elevation 56° → 50° so the wall and bevel read; wall darkening in the shader (normal-y based); bigger bevels (42% of height); real shadow maps from the key (cap, coins) onto a ShadowMaterial ground plus the bezel; a lit pink ring in the bezel groove that holds while the button is down (press → lit state), coin B raised 4 units so the coins overlap cleanly as they merge; narrower diagonal specular band (w 52). Round-1 capture showed the coin labels sitting over the FOCUS button for 2 frames at the merge (DOM over canvas): labels now go the frame the button pops. Re-captured the same round. No blind pairs or evidence.jpg exist (no census frames for this object).

## Round 2 (r01 verdict 7/7, no defects: the press barely read, the merge read as a cut)

- **Pressed state is now a different object:** the lit ring is the inner 62% of the bezel's top face (not a hairline), a soft pink under-glow (DOM radial, pinned to the button) comes up with it, the cap face darkens 14% while held (shader `uHeld`), and the travel is 34 units (A) / 50 (B), about 22 / 32 px on screen. Rest vs pressed reads at 640×360 and 360×640.
- **Merge is a collision:** the coins accelerate (power2.in, 0.3 s) to edge-to-edge contact, squash 3 frames (sx 0.84 / sz 1.08), a 2-frame localised spark at the contact point (screen-blended radial, decays over 0.07 s), and the FOCUS button grows out of the contact from 0.5 with back.out(2.2) over 0.26 s while the coins slide under it and sink. The kick lands on the contact frame.
- **Specular softened:** band sigma 40, alpha 0.5, 0.2 s; the release sheen 0.3.
- **A's stage scaled up:** coins R 200 (400 px), gap 400, labels 58 px; button R 235, FOCUS 96 px; hero centre x 690 so the right coin stays off the driver's face.
- **Timeline tightened:** t1 0.10 (coins land by ~0.45 s), t2 1.8, t3 2.9, t4 3.95, exit 4.42, end 4.72 (cut on the frame after the collapse reaches zero).
- **Kept Oswald** (the lead's requirement for the film kit port): critic fix 3 not applied, by design.

## Round 3 (r02 verdict 7/7, no defects: merge still a pop-in, coins flat, pressed hold under 1.2 s, template exit)

- **Merge is a squash-and-fuse state change on the geometry:** anticipation first (the coins pull 14 units apart and charge with a glow over 0.22 s), then they accelerate to edge contact (power2.in, 0.3 s), a 2-frame contact spark, squash (sx/sz 1.12, sy 0.80), and over 0.22 s the two bodies slide into one and morph to the cap's footprint and profile (scale to btnR/coinR and capH/coinH with back.out(1.4)) while their material colour lerps oxblood → GTA VI pink. Because the coin and the cap share the same lathe profile, the swap to the real cap on the fuse's last frame is invisible; the cap then springs up to its rest height (back.out(2.2), 0.26 s) as the gunmetal bezel rises up under it (power3.out, 0.2 s) and the FOCUS label pops in with the cap (0.72 → 1, back.out(2)). The coins are never dropped on a frame: they become the button.
- **Coins lit:** face #8A1622 (lit oxblood, the film's --rdr), the clipped specular band crosses each coin on its settle (0.3 s, alpha 0.4), the anticipation glow before the merge gives the hold a state.
- **Pressed state held 1.2 s+:** t4 4.25 (press at 2.9 + 0.08 → release 4.25), ring opacity 0.9, under-glow 0.85, face darkening 22%.
- **Designed exit (4.55):** the cap sinks into the bezel (power3.in, 0.12 s; the label goes when the cap is inside the bezel), then the base flattens into the plate (scale-y → 0, power3.in, 0.16 s), cut on the zero frame; end 4.85.
- A: pos.x 702 (the settled left coin edge inside title-safe). B: coinGap 224, entrance overshoot back.out(1.2) and stretch 0.30 so the DEAD EYE label box stays inside x 936.
- The "frame-wide streak at the pop" in the r02 critique is the sun flare in the official clip itself (present with no graphic), not ours.
- **Tail retimed (r03 re-capture):** the official clip cuts to another shot at 4.733 s, so the composition ends at 4.70 with the exit's zero frame at 4.66: t3 2.85, t4 4.15 (pressed hold 1.22 s), exit 4.40.
- **r03 verdict 7/7, one defect: the exit.** `scy = 1 - ex` scaled the disc's thickness axis, which the elevated camera cannot see, so the button held blank and popped. Fixed as the listed defect only: the whole button collapses uniformly into its centre over 0.2 s (power3.in) with the label on the cap until it is gone, zero frame at 4.60, end 4.70. r03 re-captured after the verdict so the round files match the source; not re-judged (three judged rounds is the cap). Other r03 fixes (label crush at contact, bezel rise in 0.12 s, entrance blur, tighter coin tracking) are left for the lead.
