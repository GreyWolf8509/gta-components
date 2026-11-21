# 62 Like goal

A like-goal counter: a big rolling like count with thumbs-up beside it that ticks up toward a target and bursts when the goal is hit. Creators drop it over a punch-in moment ("smash like, goal 50K"), in long-form lower-centre and in Shorts in the upper area.

- **A, `a/index.html` (16:9, 1920x1080, 6.5 s):** two real 3D thumbs-up flank the number lower-centre (the evidence layout, cuffs turned in); a porcelain tube under the number fills with red liquid; the thumbs fill too.
- **B, `b/index.html` (9:16, 1080x1920, 6.5 s):** phone-first. One centred stack in the upper half: a big 3D thumb over the label, the count and a fat porcelain fill tube, all inside the Shorts safe zone.

At the goal (3.8 s) the last odometer carry rolls to the goal and the thumb digits and tube top out with red liquid. The thumbs pump and lean, the number lands with a squash and an overshoot, the liquid sloshes, a specular band rakes the porcelain, one ring shock and six speed streaks burst behind it, the label rolls to GOAL HIT! and the tube's target tag rolls to a check.

## CONFIG (top of the script in each file)
- `label`, `labelHit`: the label before and after the goal.
- `from`, `goal`: the like count when it appears and the goal. Built for 5-digit numbers with a comma (10,000-99,999).
- `tag`: the target printed on the tube end (e.g. "50K").
- `colors`: `porcelain` (empty), `like` (the liquid), `deep` (liquid at depth), `meniscus` (the bright surface line).
- `layout`: thumb size and centres, number centre and max width/font, label position, tube ends/radius.
- `burst`: the ring shock's centre, radii and width, and the speed streaks (angle, length, width, delay).
- `timing`: entrances, `count` (count start), `goal` (the payoff second), `out` (exit), `end`.

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                 # over the sample footage
```
Same for `b/`.

## Your own clip
Replace the `<video class="clip shot">` elements inside `#push` with your clip (keep `class="clip shot"`, `muted`, `playsinline`, a unique `id`, `data-start`, `data-duration`, `data-track-index`), or render `bg:none` and lay the WebM over your edit.

## Keywords
like goal, like counter, thumbs up, smash like, goal hit, like target, progress bar, odometer counter, 3D thumbs up, GTA, Shorts
