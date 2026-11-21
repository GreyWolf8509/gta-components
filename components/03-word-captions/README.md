# 03 Word captions

Burned-in commentary captions in the style of top GTA 5 / GTA Online creators: one word or a short phrase at a time, in heavy caps with one ink edge around the face and a graded extrusion, over a soft contact shadow. Every word is timed to the voice-over from CONFIG start times. It drops in with a squash, motion blur and a spring, and swaps with a hard cut (no fades).

- **Gold keywords** are bevelled: a top-edge highlight, a curved 3-stop face, a warm seam and an extrusion with a lit lip. In A they catch fire from white to gold behind a feathered hot-white light front when spoken.
- **The payoff word is real 3D** (Three.js): extruded, bevelled letters traced from the caption font. They land white, turn to polished gold as the light front crosses, take a raking key light, one wide specular sweep and bloom, and stay wrapped in the same ink edge. Then they snap out.

| Variant | File | Canvas | When a creator uses it |
|---|---|---|---|
| A, Long-form | `a/index.html` | 1920x1080, 6.5 s | YouTube commentary or gameplay videos. 1-3 word groups, bottom-centre (cap centre at y 885, 82%). Inter 900 caps at 100 px, payoff at 150 px. |
| B, Shorts | `b/index.html` | 1080x1920, 5.9 s | Shorts / TikTok / Reels. One word at a time in narrow heavy caps (Archivo 64% width, 900), cap centre at y 1240, auto-fitted inside the safe zone. Hit words land gold and bigger. |

Files: `index.html`, plus in `media/` the payoff renderer `payoff3d.js` (identical in a/ and b/), the font outlines `glyphs.js`, and `gen-glyphs.js`, which regenerates them.

## CONFIG fields
Edit only the `const CONFIG` at the top of each file.

### Text and timing
- **`words`**: `[{ w, t, g, hot, pay, ignite }]`. Fields:
  - `w`: the word as displayed (punctuation included).
  - `t`: the second it is spoken.
  - `g: 1` (A only): starts a new caption group.
  - `hot: 1`: a keyword. In A it arrives white and catches fire to gold at `t`. In B it lands already gold.
  - `pay: 1`: the payoff word, rendered in 3D. It lands white at `t`.
  - `ignite`: the second the payoff turns gold. Put it on, or just before, the big moment in your clip, so the gold reads before any white-out.

  To time words, paste a transcript's word timestamps here (for example from `npx hyperframes transcribe voice.wav`).
- **`lastOut`**: when the payoff starts its 5-frame snap-out exit. **`end`**: the composition length. Keep this in step with `data-duration` on `#root`.

### Type
- **`type.family / weight / size`**: the face and its size in px.
- **`type.paySize`** (A, a multiplier) and **`type.hotSize / paySize`** (B, px).
- **`type.maxWidth`** (B): DOM words auto-fit to this width. 690 keeps the landing squash inside the 9:16 safe zone (x 72-936).
- **`type.payMaxInk`** (B): the ink-width cap for the 3D payoff. The payoff is optically centred, with any trailing period hanging outside the centre.
- **`type.capCentreY`**: the vertical position of the caption, as the y of its cap-height centre.
- **`type.edge`**: the visible outer ink edge in px. It wraps the face and the extrusion as one block, in DOM and 3D alike.
- **`type.rim`**: the thin line between face and side, in px. It is ink on white words and the warm seam on gold.
- **`type.depth`** (and **`type.hotDepth`** in B): the DOM extrusion in px.
- **`type.ink`**: the edge colour.
- **`type.tracking`** and **`type.wordGap`** (A): spacing in em.
- **`type.tilt`** (B): the entry tilt in degrees, which springs to 0.

### The 3D payoff
- **`payoff3d.depth`**: the extrusion in px.
- **`payoff3d.bevel`**: the bevel in px.
- **`payoff3d.tilt`**: how far the top leans back, in radians, which shows the extrusion below the face.
- **`payoff3d.shade`**: the opacity of the soft local shade behind the word.

### Colour and footage
- **`colors.face`**: the white face's stops: top, mid, pre-shade, baseline.
- **`colors.side`**: the white words' extrusion, from near to far.
- **`colors.goldFace`**: the gold face's top, middle and bottom.
- **`colors.goldLip`**: the lit 1 px lip at the top of the gold extrusion.
- **`colors.goldSide`**: the gold extrusion, from near to far.
- **`colors.seam`**: the warm seam on gold.
- **`colors.hot`**: the hot-white light front.
- **`colors.glow`**: the warm bloom.
- **`shots`**: the `<video>` ids that get a slow push.
- **`grade`** (A): a CSS filter for a shot's wrapper (the parachute plate is lifted with `contrast(1.15) saturate(1.25)`).

### Changing the payoff word or font
`media/glyphs.js` holds outlines for A–Z, 0–9 and `. , ' ! ? -`, so any payoff word made of those characters works with no rebuild. For a different font, run `gen-glyphs.js` (instructions at its top; it needs `fontkit`).

## Render
```
cd a && npx hyperframes render . -o out.mp4                                            # with the sample footage
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
```
The same commands work for `b/`. With `bg:none`:
- every `<video>` is hidden, and the footage punch is skipped;
- only the captions are rendered, with their own ink edge, shadows and shade;
- the 3D payoff's bloom is additive light, so it drops out of the alpha.

## Use your own clip
1. Put the clip in `a/media/` (or `b/media/`).
2. Replace the `<video>` elements in `#push` with yours. Each one needs:
   - a unique `id` and `class="clip shot"`;
   - `muted` and `playsinline`;
   - `data-start`, `data-duration`, `data-media-start` and `data-track-index="0"`.
3. List the ids in `CONFIG.shots`.
4. Retime `CONFIG.words` to your voice-over.

The payoff word lands white at its `t` and turns gold at `ignite`. Cut to your best shot on `t`, and put `ignite` on the hit inside it.

## Keywords
word captions, burned-in subtitles, kinetic captions, karaoke captions, keyword highlight, gold keyword, word by word, one word at a time, pop captions, squash and stretch, bevelled caption, gold caption, 3D text, Three.js extruded text, specular sweep, light sweep, Shorts captions, TikTok captions, GTA 5 commentary, GTA Online, YouTube gameplay captions, transparent overlay
