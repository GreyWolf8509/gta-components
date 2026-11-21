# 15 Meme cut-in

The joke-beat meme insert that top GTA creators cut into gameplay: a reaction image hits the screen for 1–3 s, then the edit goes back to the action. Long-form creators drop it over the gameplay (variant A). Shorts and TikTok creators hard-cut to it full-frame (variant B).

## Variants

**`a/` (16:9, 1920×1080, 4.3 s), "Framed slam".** Use it in long-form, over gameplay.
1. A glossy meme print, with a paper border and real card thickness, slams onto the footage at a tilt. The footage shakes and the cast shadow tightens.
2. The top caption is on the print from the start.
3. On the payoff, the punchline stamps in, the photo snap-zooms onto the face, a gloss sweep crosses the print and the keyword lands in gold.
4. The print holds, then whips out to the upper right.

**`b/` (9:16, 1080x1920, 4.05 s), "Full cut-in".** Use it in Shorts and TikTok.
1. The gameplay record-scratch freezes: it stops, needle-skips, and the frozen frame pulls back into a sharp, dimmed picture on black.
2. The setup caption stamps on above it.
3. The payoff is one beat. The meme slams in as a physical print (paper mount, thickness, cast shadow) and snap-zooms onto the face. A real 3D stamp word (Three.js, extruded and bevelled) lands on the print's edge on the same frame.
4. The word ignites gold with a punch, bloom and a warm glow, the print takes the hit, and one light sweep crosses it.
5. Everything whips up and the gameplay resumes where it froze.

## CONFIG (top of each `index.html`)

**Variant A**
- `image.src`: your meme still (put it in `media/`).
- `image.face`: the face position in image pixels, the point the zoom closes in on.
- `image.faceAt`: where the face sits in the photo window before the zoom.
- `image.faceAtZoomed`: where the face sits in the photo window after the zoom.
- `image.zoomFrom` / `image.zoomTo`: the zoom scales. Keep them ≤ 1.0 for a sharp image.
- `top`, `bottom`: the image-macro captions. Wrap the keyword in `[brackets]`; it lands in gold.
- `type`: caption sizes, auto-fitted to `maxWidth`.
- `card`: the print's centre, photo size, border, thickness and resting tilt.
- `colors`: the ink, white and gold gradients and the glow.
- `timing`: slam, land, punch, wind-up, whip, gone, end.

**Variant B**
- `image.src`: your meme still at 1920x1080, shown at <=1.0x.
- `image.focus`, `image.focusAt` and `image.focusAtZoomed`: the face, and where it sits in the photo window before and after the snap zoom.
- `image.z0` -> `image.z1` -> `image.zHold`: the zoom scales. Keep them <= 1.0.
- `freeze.still`: a graded 1920x1080 still of the frame where your clip stops.
- `freeze.skip`: a still from about 4 frames earlier (the needle skip).
- `freeze.focus`: the still's pixel at the canvas centre (where your 9:16 clip was cropped from).
- `lines`: the 1–2 caption lines.
- `stamp`: the 3D word, using A–Z, 0–9 and `. , ' ! ? -`.
- `type`, `card` and `stamp3d`: sizes and positions.
- `colors`: the colours.
- `timing`: every beat.

## Render

```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                   # over the sample gameplay
```

Variant B works the same way. With `bg:none`, the gameplay and the freeze bed are hidden, and only the caption, the print (with its shadow) and the stamp render.

## Your own clip

- **Variant A:** swap the `src` of `#shotA` (keep `data-media-start` / `data-duration` inside the clip's length).
- **Variant B:** swap `#clipA` (the setup) and `#clipC` (the return, starting where the freeze stopped). To make the freeze stills, run:

  ```
  ffmpeg -i clip.mp4 -vf "select='eq(n\,48)'" -vsync 0 -frames:v 1 media/freeze-a.jpg
  ```

  Grab the frame from your 16:9 master (the 1920x1080 source of the 9:16 clip), so the freeze sharpens as it pulls back to 1.0x. Bake the freeze grade in, e.g. `-vf "select='eq(n\,36)',eq=saturation=0.6:contrast=1.1"`. Make `freeze-b.jpg` from a frame about 4 frames earlier.

## Keywords

meme cut-in, meme insert, reaction image, image macro, top text bottom text, record scratch, freeze frame, vine boom zoom, joke beat, GTA 5 meme, Shorts meme panel, stamp word, 3D text.
