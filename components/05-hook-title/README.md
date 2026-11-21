# 05 Hook title

The headline that sits at the top of a Short for its whole length and states the premise in a few words ("When the cops can't swim", "I SURVIVED 5 STARS"). Used on GTA 5 / GTA Online / RP Shorts and TikToks from the first frame; long-form creators use the B look for cold-open titles.

- **A, Meme top bar** (`a/index.html`, 1080x1920): the classic Shorts meme layout. A white bar with heavy black sentence-case type slams down and pushes your clip into the window below; the keyword drops in as a real 3D word that floods from black ink to glossy red.
- **B, Keyword headline** (`b/index.html`, 1080x1920): a two-line headline straight on the footage. Narrow heavy white caps, then the keyword as a big 3D word that rises out of a mask, ignites from white to caption-yellow metal, and breathes while it holds.

## CONFIG (top of each file's script)
A:
- `title`: the hook; `\n` splits the two lines, `*word*` marks the keyword (rendered in 3D). Letters A-Z, a-z, 0-9 and `.,'!?-$’` are in `media/glyphs.js`.
- `type`: family, weight, size (auto-fits to `maxWidth`), lineHeight, tracking, wordSpacing, ink colour.
- `bar.height`, `bar.textCentreY`: the bar's bottom edge and the type block's centre.
- `keyword`: depth, bevel, tilt, dropScale, face / lip / side colours, the `pre` ink state, hot band colour, shadow.
- `timing`: barIn, barLand, words, stagger, line2, kwIn, kwLand, out, end (seconds).
- `shots`: the `<video>` ids; edit the `<video>` tags' `src`, `data-start`, `data-duration`, `data-media-start`.

B:
- `line1`, `keyword`: the two lines (keyword glyphs: A-Z, 0-9, punctuation).
- `type`: family, weight, stretch, tracking, size1 / maxWidth1, sizeKw / maxInkKw, capTop1, gap, edge, rim, depth, space.
- `keyword3d`: depth, bevel, tilt, ink edge, local shade.
- `colors`: white face stops, side, keyword face / lip / side / hot, and its white pre-state.
- `timing`: l1, stagger, riseDur, kwIn, ignite, holdStart, breathe, period, out, end.

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay (A: the bar alone)
cd a && npx hyperframes render . -o out.mp4                                                    # with the sample footage
```
Same for `b/`.

## Your own clip
- A: replace the `<video>` tags inside `#win` (they fill the window under the bar with object-fit: cover), or render `bg:none` and put the overlay over your edit with your clip framed below y 532.
- B: replace the `<video>` tags inside `#push`, or render `bg:none` and drop the webm on top of your Short.
- To change the keyword's letters beyond the included set, regenerate `media/glyphs.js` with `media/gen-glyphs.js` (fontkit).

Keywords: hook title, Shorts title, meme caption, top bar, headline, keyword highlight, TikTok title, GTA 5, 3D text, Three.js.
