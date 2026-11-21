# 05 Hook title: decisions

The headline at the top of a Short that holds the whole time: the premise in a few words. Both variants are 9:16.

## Variant A: Meme top bar (1080x1920)

**Evidence.**
- yt-ruZbW4MphOk t00052.5 (27.6M views, the most viewed): a solid band across the top (0-14% of the frame) holding a two-line, centred, heavy geometric sans headline in white with two words recoloured (blue, yellow); the gameplay clip sits in a near-4:5 window right under it (14-82%). Static for the whole video.
- tt-7706698795853040917 t00000: TikTok "classic" white boxes with black medium-bold Title Case, centred, stepped per line.
- yt-Ii3kCBjVDi4 t00003 / yt-5kRYSMMFsAo t00009: one keyword in an accent colour; burned in, no motion.
- What creators ship: a flat band, default bold sans, no light, no motion, a keyword simply recoloured.

**Our upgrade.**
- **The bar is a slab, not a fill.** White face (#FFFFFF to #F2F3F6 in the last 22%), a 7 px bottom edge (1 px white highlight, then #E8EAEE to #BEC3CC) so the panel has thickness, and a cast shadow on the clip (rgba(6,8,12,.62) at the edge falling to 0 over 90 px). It runs 400 px past the top edge so the bounce never opens a gap.
- **The slam pushes the footage.** The bar falls from above the frame with an accelerating p^3 curve and a vertical motion blur (0 to 26 px), hits 22 px past rest at 0.27 s, then springs home with one tiny counter-bounce (damped cosine, 0.26 s period). The footage window's top edge rides the bar's bottom edge, so the clip is physically shoved down and squeezed into its slot; Look.impact (amp 9, zoom 1.03, flash 0) on the hit.
- **Type.** Inter 900 sentence case, 112 px (cap 81 px, 4.2% of the frame vs the evidence's 3%), tracking -0.035em, word space +0.03em, ink #0E0F13. Two balanced lines, each centred, set on exact baselines; the block auto-fits to 792 px so it stays inside x 144-936. Words stamp on 2 frames apart: big and slightly soft (1.38, 3 px blur), a 3-frame squash onto the baseline (0.95), then back.out(2.4) home.
- **The keyword is real geometry** (DESIGN 11.24): "swim" is extruded, bevelled Inter 900 outlines (media/glyphs.js, fontkit), 20 px deep with a 3.8 px bevel, tilted 0.32 rad so the wall shows under the face, inline on line 2 at the exact pen position of the DOM text. It drops in from above the paper (1.32x, a 3 degree lean, shadow wide and faint), lands at 1.0 s with a 2-frame squash anchored on its left edge (so it never covers "can't") and its contact shadow snapping tight; the bar takes a second, smaller hit (7 px) and the footage a small impact (amp 6).
- **State change at the payoff.** It lands as the same black ink as the sentence, then a feathered front floods it left to right in 0.16 s into glossy red enamel (#FF4651 / #E8101F / #A90716 face, clearcoat 0.7, #FF6F78 lit lip, #8E0612 to #2A0104 wall), led by a warm red hot band (never white: a white band on a white bar makes the letter vanish). A key light rakes across the bevels over 0.7 s, one soft specular passes at +0.3 s, and through the hold the word turns +-2.9 degrees so the bevel glints keep moving.
- **Exit.** At 5.42 s the bar retracts upward (p^3, 0.22 s, the same vertical blur) and the window grows back to full frame; the bar is opaque the whole way, no fade.

**Shots and cut points** (the clip window shows -h shots at about 1.29x; all 1.0x speed):

| Time | Shot | In-point | Beat |
|---|---|---|---|
| 0-1.0 | v52-gp-police-bridge-h | 1.05 | cops on the bridge; bar slams at 0.27 |
| 1.0-3.1 | v11-yacht-h | 0.0 (ends 2.10 < 2.13) | the punchline: "swim" lands on the cut |
| 3.1-4.85 | v46-gp-speedboat-h | 0.45 | escape under the bridge |
| 4.85-5.7 | v45-beach-aerial-h | 0.04 | bright end; bar exits 5.42 |

**Payoff beat:** 1.0 s, "swim" stamps and floods red on the cut to the yacht. Hero 2.4 s (settled, after the specular).

## Variant B: Keyword headline (1080x1920)

**Evidence.**
- yt-5kRYSMMFsAo t00009 (19.7M): "PLAYING AGAINST MICAH": narrow display caps, white with a soft dark shadow, key word in red, no box, centred at 4-10% from the top, about 70% of the width; the red word hard-cuts.
- yt-CKq35NK70h0 t00004: "LAMBORGHINI / DE ORO": two stacked lines, the second about twice the size, gold gradient fill with a dark outline and a warm glow.
- tt-7665791067140246817 t00012, tt-7708957490922278164 t00000: TikTok-native white sans with a soft shadow, held static.
- Creators' version: flat white type, a default shadow, a recoloured word, no motion.

**Our upgrade.**
- **Line 1, "I SURVIVED" (DOM):** Archivo 64% width, 900, 150 px caps (cap 103 px), centred, cap top at y 250. Built as a bevelled block: a 4-stop white face (#FFFFFF to #E2E7EF), a 1.6 px rim, a 4 px ink edge (#07080B), a 9 px graded extrusion (#2A2F3A to #07080B) and two soft shadows. Word space x1.5 (Archivo narrow's space is tight).
- **Line 2, the keyword "5 STARS", is real geometry:** extruded, bevelled Archivo 64%/900 outlines, 256 px (cap 174 px, about 9% of the frame, double the evidence), 30 px deep with a 6.5 px bevel, tilt 0.3 rad, MeshPhysical clearcoat face, metal wall with a lit lip, PMREM studio environment, an ink edge drawn in post (5 px) and a contact shadow, plus a soft local shade behind it that stays inside its mask. Ink width capped at 740 px, optically centred: x about 160-910.
- **Entrance (the brief's masked reveal):** each word of line 1 rises out of its own clip line (expo.out 0.42 s, 0.08 s stagger, a 10 px vertical smear decaying over 0.16 s); the keyword rises out of its own mask at 0.28 s.
- **State change at the payoff, 0.9 s on the cut:** the keyword arrives white enamel like line 1, then a feathered light front floods it into caption-yellow metal (#FFF4A8 / #FFD23C / #EE9C06, wall #C07A00 to #3A1E00) led by a hot band that dies before the last letter (no orb on the end). A key light rakes the bevels, a 1.06 punch springs home, bloom peaks for 3 frames then settles, one specular passes at +0.32 s. On the plate: Look.expose 1.06 (3-frame hold) and Look.impact (amp 12, zoom 1.035, flash 0).
- **Hold (the brief's breathing scale):** from 1.3 s the whole headline breathes 1.000 to 1.018 on a 2.6 s cosine around its optical centre (DOM line by CSS scale, the 3D word in its own pose, from the same function of time), and the keyword turns +-3.2 degrees.
- **Exit:** every word drops back into its mask (power3.in 0.22 s, staggered 0.03 s), opaque, then the masks are cut.

**Shots and cut points** (-v shots, all 1.0x):

| Time | Shot | In-point | Beat |
|---|---|---|---|
| 0-0.9 | v51-gp-police-desert-v | 0.0 | the chase; headline reveals |
| 0.9-2.4 | v52-gp-police-bridge-v | 1.0 | ignite on the cut |
| 2.4-3.65 | v30-street-explosion-v | 0.3 | chaos |
| 3.65-5.36 | v44-bridge-skyline-v | 0.0 (ends 1.71 < 1.73) | bright, sharp skyline end; exit 4.96 |

**Payoff beat:** 0.9 s ignite. Hero 4.4 s (settled yellow over the bright skyline).

## Round log
- r01: first build. Self-review fixes before capture: the red was salmon-pink (env reflection and emissive too high: faceEnv .22, emissive .42, deeper face stops); the drop and squash now anchor on the keyword's left edge so it never covers "can't"; A's hot band is warm red at 1.1 (a white band erased the "m" on the white bar); B's hot band fades out before the last letter; B's local shade fits inside the keyword mask (it showed a clipped edge); B ends on the bright v44 skyline instead of the dark v17 sunset.
- r02, from the r01 verdict (v0 7, v1 8 and LOCKED: b/ untouched, VS-PREV v1 1.0000). v0's gap: "all the premium sits in one small 3D red word whose depth and payoff light vanish at 360x640; the stamps collide; the bar is a flat slab". Changes, all in a/:
  - **Keyword bigger and deeper:** 1.16x the running words (130 px), depth 20 to 30 px, bevel 4.6 px, tilt 0.38 rad (about 15 px of visible wall), lip #FF9AA0. Face is now a 5-stop glossy enamel with a reflection horizon (#FF5E68 / #F21E2E / #B80614 at 50% / #D30C1C / #860410), env .16 so it stays saturated red, not salmon.
  - **Payoff light:** a red bounce on the paper around the word (radial rgb(255,59,71), 2-frame attack to .55, 3-frame hold, settles to .1 over 0.6 s), a warm-pink hot front (#FF8E80, 1.6) with bloom threshold 1.0, the specular narrowed to .38.
  - **No collisions:** stamps start at 1.08x (was 1.38) from the baseline, with a 24 px drop (14 px on line 2 so it never reaches line 1), 6 then 2 px blur, a 3-frame squash to .97 and back.out(2.4) over 0.18 s.
  - **No grey ghost:** the falling keyword casts no shadow until the last half of its fall, offset at most 23 px.
  - **Bar material:** a lit panel (broad top-left key falling off to #ECEEF2 at the bottom edge), an 8 px lip (2 px #FFFFFF top-light, then #E9ECF1 to #C3C9D2), a deeper two-stage cast shadow, and a 2.5% stretch from the top edge on the slam that relaxes with the bounce (the footage window follows the stretched edge).
  - **Running words:** a soft raised-ink contact shadow (0 3px 3px .16 plus 0 8px 10px .10) so they sit on the paper like the 3D word.
- r02 verdict: v0 8 / v1 8, no defects or hard caps: PASSED (sticky). Open nitpicks the critic listed (not acted on, both variants locked): v0's premise completes at 1.0 s; its paper glow reads slightly pink; the black pre-state reads a little grey for 5 frames; s3's in-point 0.45 is a half frame (one repeated frame at 4.80 s). v1's hot front is on screen for only one frame; its payoff lands on the soft v52 gameplay shot.
