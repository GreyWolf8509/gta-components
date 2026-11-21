# 39 Comparison split

The "GTA V vs GTA VI" / "LOW vs ULTRA" split creators use to compare two clips: two synced halves, a divider, a name + year label per side. Ours turns the divider into a real chrome blade with a VS coin and ends on a verdict: the blade locks, the coin flips to an arrow at the winner, the winner lights up and the loser greys out, then the winner takes the frame.

- **A `a/index.html`** (16:9 long-form): side by side, chips top-left / top-right, a SETTING tag (HIGH -> ULTRA) under the winner.
- **B `b/index.html`** (9:16 Shorts): stacked, badges on the seam.

## CONFIG (top of each script)
- `left` / `right` (A) or `top` / `bottom` (B): `name`, `year`. The right / top side is the winner.
- `setting` (A): `label`, `from`, `to`.
- `vs`: the coin text (A-Z, 0-9; real 3D glyphs).
- `focus`: per clip id, the source x (px) kept centred in its half.
- `colors`: `accent` (winner pink, blade glow, arrow), `chrome`, `ink`, `letter`, `ultra` (A).
- `blade`, `puck`: sizes in px. `timing`: every beat (`lock` is the verdict; keep it on a cut).

## Swap in your own clips
Each side has one `<video>` per synced segment (`l1..l3` / `r1..r3` in A, `t1..t3` / `b1..b3` in B). Change `src`, keep `data-start` / `data-duration` in sync across the pair, use `data-media-start` for in-points and never run past a clip's length. Clips should be 1920x1080.

## Render
```
cd a && npx hyperframes render . -o out.mp4
cd b && npx hyperframes render . -o out.mp4
```
Full-kind component: the footage is the component, so `bg` has no transparent mode.

Keywords: comparison, split screen, side by side, stacked, before after, vs, GTA 5 vs GTA 6, low vs ultra, graphics comparison, divider, verdict, winner.
