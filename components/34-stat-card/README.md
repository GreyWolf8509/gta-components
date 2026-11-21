# 34 · Stat card

The purple glass stat panel GTA creators put on screen while they explain a car, a character or a weapon: a pink header pill on the edge, rows of icon + caps label + bar, or neon arc gauges with needles. Two HyperFrames projects:

- `a/` **Car stats** (16:9 long-form, 1920×1080, 5.33 s). Top-left card: car name, class coin, TOP SPEED / ACCELERATION / BRAKING / HANDLING bars. Stock values fill, an upgrade surges gold, then locks in: light front across the bars, the class coin flips B → S.
- `b/` **Character stats** (9:16 Shorts, 1080×1920, 5.53 s). Portrait, name and two neon arc gauges. DRIVING revs up and slams into MAX.

Both are overlays: the card body (3D rim, neon seam, coin, gauges) is Three.js; the frosted glass face and all type are DOM pinned to it.

## CONFIG (top of each `index.html`)
- **A:** `pill`, `name`, `sub` (two lines: before / after the upgrade, HTML allowed), `grade` (coin letters before/after, from `A B C D S +`; regenerate `media/glyphs.js` with `media/gen-glyphs.js` for others), `stats[]` (`label`, `icon`: speed / bolt / brake / wheel, `base`, `up`, 0–100), `card` (position, size, tilt), `timing` (`in`, `upgrade`, `lock`, `out`, `end`).
- **B:** `pill`, `name`, `portrait` (a keyed PNG with a transparent background), `sub`, `gauges[]` (`label`, `value`, and on the hero gauge `rev` + `hero: true`), `maxText`, `card`, `timing` (`in`, `rev`, `lock`, `out`, `end`).

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                 # over the sample footage
```
Same for `b/`.

## Your own clip
Replace the `<video class="clip shot">` sources (keep unique ids, `data-start`, `data-duration`, `data-media-start`), or render with `bg:none` and lay the webm over your edit. Move the payoff (`timing.lock`) onto your own cut or beat.

## Keywords
stat card, car stats, vehicle stats, character stats, skill gauge, upgrade, maxed out, class badge, tier, purple glass panel, neon gauge, GTA 5, GTA Online
