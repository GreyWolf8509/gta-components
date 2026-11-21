# 06 Handle watermark

Your @handle stays on screen so re-uploads and reposts still credit you. 22 of the 106 top GTA videos we studied carry one. Our version gives the avatar a real 3D gold coin and puts the handle in crisp outlined type.

- **A: Corner handle** (`a/`, 16:9 long-form). Avatar coin + @handle in the top-left corner at 70% opacity. It drifts to the top-right mid-video so a crop can't remove it.
- **B: Typewriter handle** (`b/`, 9:16 Shorts / TikTok). The @handle types out bottom-centre (y 1415, under the caption lane). The gold caret is the coin seen edge-on: on "enter" it spins open into your avatar, then the mark settles to a semi-transparent hold.

## CONFIG (top of each `index.html`)
- `handle`: the text, e.g. `"@everestchris6"`.
- `avatar`: a square image (the coin shows its inscribed circle), e.g. `media/avatar.jpg`.
- `mark`: the glyph struck on the coin's back.
- Size and placement:
  - A: `corners` (start / drift-to corner: `top-left`, `top-right`, `bottom-left`, `bottom-right`), `margin`, `coin`, `text`, `gap`, `dockScale`.
  - B: `centre`, `text`, `coin` (caret height), `grow`, `gap`, `caretGap`, `holdScale`.
- `hold`: the watermark opacity once settled.
- `colors`: face gradient, "@" gold gradient, specular band, outline, glow.
- `timing`: entrance, payoff, dock / settle, drift, exit and end, in seconds.

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                 # over the sample footage
```
B is the same from `b/`. For a longer video, raise `timing.end` and the root and `#ov` `data-duration`, and move `timing.out` (and A's `timing.drift`) later.

## Your own clip
Replace the `<video class="clip shot">` sources in `#push` with your footage (keep `muted playsinline`, set `data-start`, `data-duration` and `data-media-start`). Or render `bg:none` and lay the webm over your edit.

Keywords: watermark, handle, @ name, channel credit, avatar, logo bug, corner bug, typewriter, caret, anti-crop, Shorts, TikTok, GTA 5, GTA Online.
