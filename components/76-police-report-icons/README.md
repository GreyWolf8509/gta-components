# 76 Police report icons

Three of our own line icons (OUTFIT, CAMERA, WEAPON) stamp in one by one on the beats as real 3D lacquer slabs, then travel to a
band at the top of the frame and lock in as THE POLICE REPORT: the witness-evidence object. Long-form (a/, 16:9) and Shorts (b/, 9:16,
phone-first). A creator uses it in a "how wanted levels work" or "what the cops know" explainer, over their own footage.

## CONFIG (top of each index.html)
- `dockLabel`: the band's title.
- `icons`: `[{ kind, label, at }]`: `kind` is `outfit` | `camera` | `weapon` (our own marks, add more in `MARK`), `label` the caption, `at` the stamp second.
- `dockAt`: when the slabs start travelling to the band; they lock in 0.5 s later (put that on a cut).
- `out`, `end`: the exit and the composition length.
- `colors`: pink (GTA VI identity, the strokes), navy (the slab lacquer), ink.
- `layout.stamp`: slab size and positions for the stamp phase; `layout.dock`: the band box, title size, docked slab size, label size and side.

## Render
- Over footage: `cd a && npx hyperframes@0.9.72 render . -o out.mp4`
- Footage hidden (graphic only): `npx hyperframes@0.9.72 render . --variables '{"bg":"none"}' --format webm -o overlay.webm`
- Swap in your own clip: replace the `<video class="clip shot">` sources (keep ids, `data-start` / `data-duration`), or point them at any shot in `assets/shots/`.
- Fonts: Oswald only (`media/fonts/oswald-latin.woff2`, inline @font-face).

## Keywords
police report, wanted level, evidence, witness, icons, checklist row, HUD band, GTA VI, stamp, dock
