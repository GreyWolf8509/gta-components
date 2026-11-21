# 69 Source tag

A small source pill that sits centred just above your caption line, so a claim on screen carries its source
("SOURCE: OFFICIAL TRAILER"). GTA news / breakdown creators use it in long-form when they quote a trailer, a
newswire or an interview; on Shorts it sits in the upper safe zone over the hook line.

- `a/` long-form 16:9 (1920x1080, 5.8 s): one-row pill above a one-line caption.
- `b/` Shorts 9:16 (1080x1920, 6 s): two-row pill ("SOURCE" over the source name) above a two-line claim.

The pill is a real 3D object (Three.js): a candy-gloss pink capsule with a chrome-bezelled glass lens holding our own
link mark. It pops up, unrolls, and on the payoff the link snaps shut and the lens lights up.

## CONFIG (top of each `index.html`)
- `rows`: the pill's text, as rows of `{text, cls}` parts (`k` = pale kicker, `m` = white). B's last row auto-fits.
- `rowFont`: family (Inter / Archivo), weight, size, tracking (em), stretch (%), gap above the row.
- `caption`: `show` (false = the pill alone over your own captions), the text (`text` in A, `lines` in B), the pink
  `keyword`, size.
- `colors`: pill gradient, moulded edge, rim glow, lens glass, lens glow, chrome.
- `layout`: pill centre `cx`/`cy`, height `h`, lens and bezel size, gaps, resting tilt, caption baseline.
- `timing`: caption in, pill in, stretch, `click` (the payoff: put it on your cut), out, end.

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                   # over the sample footage
```
Same for `b/`.

## Your own clip
Replace the `<video class="clip shot">` sources in `index.html` (keep a unique id, `data-start`, `data-duration`,
`data-track-index`, `data-media-start`), or render `bg:none` and lay the WebM over your edit. Move `timing.click` to
your cut.

Keywords: source tag, source pill, citation, credit, claim source, official trailer, GTA news, breakdown, caption
label, link chip, 3D pill, Shorts.
