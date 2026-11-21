# 27 · Upgrade ladder

The tier-token track from "upgrading every …" / transformation-challenge videos: a column (long-form) or row (Shorts) of round tokens where locked tiers show a red "?", milestone tiers carry a gold crown, and the current tier wears a green ring that climbs one step each time the creator unlocks the next form. The tokens are real 3D coins (Three.js): metal rims, glass-domed portrait faces, a glossy 3D "?" and an extruded gold crown.

- **A (`a/`, 16:9 long-form):** 8-tier vertical ladder docked on the right edge. Use it at each upgrade beat, then let it hide.
- **B (`b/`, 9:16 Shorts):** 5-tier horizontal row at the top of the Short with check badges on completed tiers and a "TIER n · MILESTONE / NAME UNLOCKED" label under it.

## CONFIG
- `tiers[]`: bottom/left first. `name`, `img` (square portrait in `media/`), `state` (`"done"` shows the portrait, `"locked"` shows the "?"), `crown: true` for a gold milestone tier.
- `start`: index of the current tier when the ladder appears.
- `steps[]`: times (s) at which the ring climbs one tier and that tier flips open; the last step is the payoff (bigger flip, crown hop, halo, label).
- `label.kicker` / `label.name`: `{n}` = tier number, `{name}` = the unlocked tier's name (HTML allowed in B for the gold word).
- `layout`: position, pitch, coin radius `R`, thickness `D`, track width, entrance offset, check badges (B).
- `colors`: ring green, gold, silver, "?" red.
- `timing`: entrance, stagger, travel, flip, label in/out, exit, end.

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                 # over the sample footage
```
Same for `b/`.

## Your own clip
Replace the `<video class="clip shot">` sources in `index.html` (keep `data-start` / `data-duration` / `data-media-start` within the clip length), or render `bg:none` and drop the webm over your edit. Put your own square portraits in `media/` and point `tiers[].img` at them; set `steps` to your upgrade beats.

## Keywords
upgrade ladder, tier track, evolution track, transformation progress, level tokens, locked question mark, milestone crown, current tier ring, unlock, GTA 5 challenge, upgrading every minute
