# 20 Game title card

The game-logo sticker creators stamp over the first seconds of a video or a segment: stacked heavy white caps with a black edge and one coloured accent bar, no box. Ours is real 3D (Three.js): white enamel faces, polished bevel lips, black lacquer walls, a candy-enamel bar with raised letters, one ink outline and a soft contact shadow, and a light sweep on the lock-in. Our own lettering (Archivo), no game logos.

- **A, "Series title" (16:9, long-form):** a series lock-up ("LOS SANTOS STORIES") centred over intro footage.
- **B, "Corner title" (9:16, Shorts / TikTok):** a compact game title ("GTA 5" / "ROLEPLAY") docked top-left over gameplay.

## CONFIG (top of each `index.html`)
- `lines`: the stacked title lines (A–Z, 0–9, `& . , ' ! ? - : #`).
- `tag`: the word on the accent bar.
- `layout`: A uses `cx`/`cy` (lock-up centre); B uses `x`/`y` (top-left of the lock-up). `cap` (title cap height px), `lead`, `tracking`, `align`, `barH`, `barGap`, `tagCap`, `tagTracking`.
- `colors`: `face` (top, foot), `lip`, `wall` (near, far), `ink`, `bar` (left, right), `barWall`, `barLip`, `tagWall`.
- `timing`: letter stand-up (`lineIn`, `stagger`, `upDur`), bar (`barIn`, `barDur`), tag (`tagIn`, `tagStagger`, `tagDur`), lock-in punch (`lock`), light sweep (`sweep`, `sweepDur`, `bloomAt`), exit (`exit`, `exitStagger`, `exitDur`, `barOut`, `barOutDur`), `end`.
- New characters: re-run `media/gen-glyphs.js` (needs `npm i fontkit`), see its header.

## Render
- Transparent overlay: `cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm`
- With the sample footage: `cd a && npx hyperframes render . -o out.mp4`
- Same commands in `b/`.

## Your own clip
Replace the `<video>` tags inside `#push` with your clip (keep `class="clip shot"`, a unique `id`, `muted`, `playsinline`, `data-start`, `data-duration`, `data-track-index="0"`, and `data-media-start` for the in-point), or render `bg:none` and lay the webm over your edit.

## Keywords
game title, game logo, logo sticker, series title, title lock-up, GTA 5 title, GTA RP, roleplay, intro title, 3D logo, light sweep, shine, Shorts corner title
