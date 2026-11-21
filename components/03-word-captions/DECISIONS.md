# 03 Word captions: decisions

## Variant A (16:9 Long-form, 1920x1080)

**Evidence.** Long-form GTA creators burn in 1-3 word phrases, bottom-centre, with no box:
- yt-uX_iqFlUdqI t00056/t00052/t00064 ("THE WHAT?!", "THERE YOU ARE!", "FARMING CLIPS"): heavy geometric caps, white with a thin near-black stroke and a small hard shadow, baseline at about 80-84%, cap height about 6% of the frame.
- yt-5zKoq7EabvQ t00004 ("ES ULTRAREALISTA"): heavy condensed caps, white-to-cyan fill, bottom-centre at y 78-92%, cap height 10-12%.
- yt-E1Eu2_RUdEo t00016 ("YOU'RE LIKE 1 METER"): colour-coded fills with an outline.
- Motion in all three is a hard swap per phrase, timed to speech. Nothing moves once it lands.

**Our upgrade (r03: the payoff is real geometry, the running words are bevelled DOM).**
- **Type.** Inter 900 caps at 100 px (cap height about 73 px, 6.7% of the frame), tracking -0.02em, centred, cap centre at y 885 (82%). The payoff is 150 px.
- **Running words (DOM).** One ink edge (4 px) wraps the face and a 7 px extrusion graded per pixel, over a soft contact shadow. The white face runs #FFFFFF to #E4E9F0; r02's #CAD1DB read as dingy grey on concrete.
- **Gold keywords (DOM)** are a bevelled material, not the white word recoloured:
  - a curved 3-stop face (#FFF1A0, #FFC21E, #E07F0A) with intermediate stops;
  - an SVG-filter bevel: a 2 px highlight along every upward-facing edge and a warm #8A3E00 seam along every downward-facing edge (alpha offset-and-subtract, so it follows the actual glyph edges);
  - a 1.5 px warm seam rim;
  - an extrusion with a 1 px lit lip (#F7B23A) then graded #C46A00 to #3A1400.

  The flat cream top band is gone.
- **Keyword ignition (DOM).** A feathered mask wipe (0.35em feather, 0.18 s expo.out) led by a hot-white #FFF6D0 band (0.25em) that rides just inside the gold edge, with a 10 px blurred, screen-blended bloom. The gold reads as catching fire behind a light front; no letter is ever split hard white/gold. One wide soft specular (0.45em band, 10 px falloff, 0.45 s power2.inOut) fires at the ignite peak (+0.06 s).
- **The payoff "YACHT." is Three.js geometry** (`media/payoff3d.js`, DESIGN §8):
  - **Geometry.** Inter outlines (wght 900, opsz 32, pre-extracted with fontkit to `media/glyphs.js`), kerned and extruded 22 px with a 4.5 px rounded bevel. The word is tilted 0.3 rad top-back under an 18° camera whose principal point sits on the word, so the extrusion recedes below the face like the DOM words, but in true perspective.
  - **Material.** The face is MeshPhysical with clearcoat, its colour the same curved gold gradient. The bevels and walls are polished metal graded #C46A00 to #3A1400, with a lit lip. A PMREM studio environment (top softbox, a hot bar up and behind) makes the top bevels read as a bright lip.
  - **Ignition.** It lands as white enamel, then a feathered light front (0.35em feather, 0.25em HDR hot band) sweeps left to right in 0.18 s expo.out, turning enamel to gold (colour, metalness and roughness all switch behind the front). A key light above and behind rakes across the bevels over 0.6 s. One wide soft specular band (0.45em, 0.45 s power2.inOut) fires at ignite +0.06. HDR bloom peaks at the ignite, holds 3 frames, then settles to a warm glint. A slow ±3.4° turn through the hold keeps the bevel glints alive.
  - **Caption vernacular in post.** A 32-tap alpha dilation draws the same 4 px ink edge around face and extrusion, and a blurred-alpha contact shadow sits under it. A soft local shade (rgba 0,0,0,.24, 1.3x the word width) separates it from the bright wake.
  - **Determinism.** It renders from time only: `renderAt(t)` is driven by the main timeline plus `hf-seek`, with no animation loop.
  - **Centring.** The word is optically centred, with the trailing period hanging outside the centre.
- **Light on the plate (DESIGN 11.22).** The light belongs to the word. The plate gets only a gentle `Look.expose` (peak 1.07, 3-frame hold, saturate 1.15) plus the impact punch (amp 9, zoom 1.03, flash:0). r02's 1.4 clipped the sky.
- **Motion** is kept from r02 (the critic praised it): the drop-squash entrance (back.out(2.2), 4 px motion blur), opaque 2-frame compress swaps with a hard cut, and the 5-frame opaque snap-out with an 8 px vertical blur. The 3D word gets the same moves, applied to its layer.

**Shots and cut points** (cut on phrase boundaries, all 1.0x, a slow 1 to 1.035 push per shot):

| Time | Shot | In-point | Caption |
|---|---|---|---|
| 0-1.32 | v57-gp-red-car-highway-h | 0.3 | I HAD / FIVE STARS, |
| 1.32-2.95 | v52-gp-police-bridge-h | 1.15 (cops in frame) | THE BRIDGE / WAS BLOCKED... |
| 2.95-4.42 | v55-gp-parachute-h, graded contrast 1.15 / saturate 1.25 | 0 | SO I JUMPED / AND STOLE A |
| 4.42-6.5 | v11-yacht-h (trailer, sharp) | 0.02 (ends 2.10 < 2.133) | YACHT. |

The payoff moved off the soft 2013 gp-speedboat shot onto the sharp trailer yacht (DESIGN 11.12).

**Payoff beat:** 4.55 s, "YACHT." ignites gold. The hero is at 5.3 s: settled gold, after the specular sweep, with the bloom at its resting level.

**Commentary line** (creator's own, no quotes): "I had five stars, the bridge was blocked... so I jumped and stole a yacht."

## Variant B (9:16 Shorts, 1080x1920)

**Evidence.** Shorts captions are one word, or a tiny phrase, at a time, centred in the lower-middle of the picture:
- yt-5kRYSMMFsAo t00004.5 ("CAREFULLY?"): yellow condensed caps with a thin black outline, about 80% down, hard cut per word with the speech.
- yt-KMzt08VK4Jo t00004.5 ("178 animals"), the most viewed: white heavy sans with a **hard drop shadow straight down**, about 72% down.
- yt-mQUhZgeHv34 t00006 ("menjatuhkan"): one white word with a black glow, about 72% down.
- tt-7599774531066006786 t00052.5: one word at a time, with a colour block wiping through the letters as it lands.
- The evidence's version is small (cap height 2-4% of the frame) and static.

**Our upgrade (r03).**
- **Type.** Archivo at 64% width, weight 900, caps. Running words are 168 px (cap height about 118 px, 6% of the frame, double the evidence) and hit words 186 px. Every DOM word auto-fits to 690 px so the landing squash stays inside x 72-936.
- **Running words and the hit word COPS** use the same bevelled DOM builder as A, scaled up: a 6 px ink edge and an 11/13 px extrusion; a 3.2 px top-edge highlight and a 2.2 px warm seam on gold. COPS lands gold, with a warm flare and one wide soft specular at the landing peak.
- **The payoff "MINIGUN." is Three.js geometry** with the same renderer as A. Archivo outlines (wdth 64, wght 900) are extruded 30 px with a 6.5 px bevel and capped at 660 px ink. The word is optically centred, ignoring the period, which fixes r02's MINIGUN ink sitting about 22 px left. The ink edge is 6 px, with a contact shadow and a local shade (rgba 0,0,0,.35, 1.3x the word width) that keeps it legible on the blast.
- **Payoff timing.** It lands white on the cut (3.36). It **ignites at 3.50**: the light front crosses before the muzzle blast whites out the street (v30 media 0.6, comp 3.58), so the gold reads first and then rides the blast. The plate gets `Look.expose` peak 1.03 only, so the footage supplies the light and the overpass blacks stay black. The impact (amp 14, zoom 1.04, flash:0) carries the hit.
- **Ending (DESIGN 11.21).** It no longer ends on the v23 close-up of a masked figure. It cuts to v26, the bridge explosion: a wide landscape shot where the bridge the cops blocked loses its traffic into the river. That closes the story, and the shot holds up upscaled.
- **Motion** is the same as A: drop-squash with tilt, opaque compress swaps, and the opaque snap-out.

**Shots and cut points** (all 1.0x, each in-point plus duration checked against the shot length):

| Time | Shot | In-point | Caption |
|---|---|---|---|
| 0-2.45 | v52-gp-police-bridge-v | 0.75 (police cars pass) | THE COPS BLOCKED THE WHOLE BRIDGE... |
| 2.45-3.36 | v09-juggernaut-minigun-v | 0.3 (ends 1.21 < 1.233) | SO I BROUGHT A |
| 3.36-4.62 | v30-street-explosion-v | 0.38 (ends 1.64 < 1.667) | MINIGUN. (ignites at 3.50, blast whites out at 3.58) |
| 4.62-5.9 | v26-bridge-explosion-v (trailer, wide) | 0.1 (ends 1.38 < 1.733) | MINIGUN. hold + exit |

The payoff and the ending moved off the soft gp-truck-crash shot (DESIGN 11.12).

**Payoff beat:** 3.50 s ignite, riding the 3.58 blast. The hero is at 4.3 s: settled 3D gold, after the sweep, over the muzzle fire.

**Commentary line** (creator's own): "The cops blocked the whole bridge... so I brought a minigun."

## Round log
- r01: first build, then these fixes from my own review before hand-off:
  - **Font loading.** `document.fonts.ready` resolved before Archivo or Inter had been requested, because no text used them at load. Measurements were therefore taken in a fallback face. That gave wrong auto-fit sizes, gradient boxes narrower than the glyphs (a black half-period on "SPEEDBOAT.", grey-looking words) and misplaced glints. Each file now calls `document.fonts.load()` for its caption face before building. B also declares Archivo inline so the static guard sees it.
  - **Group pop (A).** The squash now runs on the whole line instead of each word, so word gaps scale with it and never close up during the overshoot ("THEBRIDGE"). Words still arrive 1 frame apart with a 14 px rise. The ignition bump is now 1.07.
  - **Descenders.** Layers have 0.25em bottom padding, so the comma in "STARS," is filled.
  - **Entrances.** The pop is snappier: opacity snaps on, and the defocus is 3 px over 2 frames, which removes the grey first frame.
  - **Ignition timing (A).** The payoff ignites on its first frame.
  - **B sizes** are 168 / 186 / 220 px. The payoff auto-fits to 780 px, which is 186 px for "SHORTCUT.".
  - **B glint** moved above the T so it no longer blows out the letter.
  - **B crash shot** has a mild grade (brightness 1.1, contrast 1.06, saturation 1.12) so the payoff isn't murky.
  - **Layout check.** The intentional layer stacks are marked `data-layout-allow-overlap` / `-occlusion`.
- r02, from the r01 verdict (7/7). The critic's core gap: at phone size both read as the stock "gold keyword pop" preset, the extrusion and bloom didn't survive, and the squash was a twitch.
  - **Builder rewritten** as a lit 3D block: a stepped-colour shaded side, an ink silhouette wrapping face and side, a rim, a baked baseline shade and a hard gloss band. Every frame was checked at 640x360 / 360x640 before capture, and the gold block and gloss stay legible there.
  - **Sparkle removed** from both variants (it also covered the T). Light now comes from the clipped specular band.
  - **Motion.** A drop, a 2-frame squash with motion blur and a 6-frame `back.out` spring replace the 3-frame 1.12/0.86 twitch.
  - **Payoffs arrive white, then ignite:** A 4 frames after the cut to the yacht, B on the minigun muzzle blast (3.58, frame-verified).
  - **Safe zone.** B auto-fits to 690 px, so its peak stays inside x 72-936.
  - **Shots.** The payoffs moved to sharp trailer shots (v11-yacht-h, v30 then v23 minigun), and the story changed to match.
  - **B expose peak** is 1.16 on the already-white blast.
  - **Exits.** Per DESIGN 11.14/11.15, word swaps hard-cut after an opaque compress, and payoff exits are an opaque scale-into-anchor with an 8 px directional blur and a cut on the zero frame. There are no alpha fades anywhere on the type.
  - Hero frames are 5.25 (A) and 4.3 (B), after the specular sweep, so no stray band crosses a letter in the still.
  - Checked against DESIGN 11.16-11.20: no faces are graded or composited, no dimmed beds, no SVG attr tweens, no CSS flips, confetti or rays (one specular sweep per lit word is the only light effect), and no third-party franchise IP. All footage and type are GTA V gameplay/trailer footage plus our own captions.
- r03, from the r02 verdict (7/7, no defects). The gap: "the stock gold 3D caption preset", and the payoff light vanished at phone size.
  - **3D payoff.** "YACHT." and "MINIGUN." are now real Three.js geometry, as described above. Running words stay DOM.
  - **DOM gold rebuilt** as a bevel material: a curved 3-stop face, an SVG-filter top-edge highlight and warm seam, and a lit lip on the graded extrusion. The cream band is removed. The white face bottom is now #E4E9F0.
  - **Ignition.** Every ignition (DOM and 3D) is a feathered mask wipe led by a hot-white band with bloom. The r02 hard clip-path split is gone.
  - **Specular.** One wide soft band (0.45em, 0.45 s), fired at the ignite peak.
  - **A plate.** The expose is 1.07 with the light localised on the word (DESIGN 11.22; the critic suggested 1.18, and 11.22 since asks for less on bright frames). The v55 plate is graded contrast 1.15 / saturate 1.25.
  - **B plate.** The expose is 1.03, the ignite moved to 3.50, and a local contact shade sits behind the word. The payoff is optically centred without its period.
  - **B ending** moved from the v23 close-up to the v26 bridge explosion (DESIGN 11.21).
  - **Checks.** Every frame was checked at 640x360 / 360x640: the bevel lip, extrusion and gold gradient survive, and the light front reads as a moving white-hot band. `hyperframes check` passes; the only warning is three.min.js's own deprecation notice, from the DESIGN §8 URL.
