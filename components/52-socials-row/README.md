# 52 Socials row

The follow ask, built from real 3D social marks. We use our own simple marks (play, camera, bird, music note), never platform logos.

- **A, `a/index.html` (16:9, 1920x1080, 6.6 s): THE END + socials.** The end tag for long-form. A red lacquer THE END slab swings in, then a row of 3D candy-lacquer mark tiles pops on with @everestchris6 under it. A press wave and a raking light run across the row.
- **B, `b/index.html` (9:16, 1080x1920, 6 s): Corner handles.** For Shorts and TikTok. Two big handle tags drop into the top corners, stacked (camera mark top-left, music-note mark against the right edge under it). Their white enamel plates slide out; on the cut each tile is pressed and its colour floods the plate, the handle flips to white and the tag locks in with a bevel bloom; then both spring back into their corners at a smaller size and hold quietly.

## CONFIG
- A:
  - `title`, `handle`;
  - `socials`: a list of `{mark, colors:[top, bottom]}`, where `mark` is one of `play`, `camera`, `bird` or `note`;
  - `slab` (position, size, colours, cap height, tracking);
  - `row` (centre y, tile size, gap);
  - `text` (handle size and y);
  - `colors` (handle face, @ gradient, band, stroke);
  - `timing`.
- B:
  - `tags`: two entries of `{mark, handle, colors, lit, at, litAt}`: `colors` is the tile's lacquer, `lit` the plate's lacquer after the press, `at` / `litAt` the @ colour before / after;
  - `safe` (left, right and top edges);
  - `tile`, `plateH`, `stackGap`, `tagW`, `dock` (the scale the tags settle to after the read);
  - `text` (`max` / `min` auto-fit size, Archivo width and weight);
  - `plate` (enamel colours);
  - `timing` (`payoff` is the cut the press lands on; `echo` delays the second tag; `dock` is when they shrink into the corners).
- If you change A's title to letters other than A-Z, 0-9 or `.,'!?-*`, regenerate `a/media/glyphs.js`:

  ```
  FONT=../assets/fonts/Archivo.ttf AXES='{"wght":900,"wdth":100}' node gen-glyphs.js > glyphs.js
  ```

  This needs fontkit.

## Render
- Transparent overlay to drop on your own clip:

  ```
  cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm
  ```

- With the sample footage:

  ```
  cd a && npx hyperframes render . -o out.mp4
  ```

- B works the same way from `b/`.

## Your own clip
Replace the `<video class="clip shot">` tags (`s1`-`s4`) with your clip. Keep the unique id, `muted`, `playsinline`, `data-start` and `data-duration` (no longer than the clip), and use `data-media-start` for the in-point. Or render `bg:none` and composite the webm.

## Keywords
socials row, follow me, end tag, THE END, social icons, handle tag, corner handle, follow tag, lacquer tag, @handle, Instagram-style tag, TikTok-style tag, Shorts handle, 3D icons, app tiles, follow CTA, outro.
