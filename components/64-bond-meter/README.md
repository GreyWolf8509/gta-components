# 64 · Bond meter

A relationship meter between two characters that fills or drains with the story: two portrait medallions joined by a glass tube on a lacquered pink-neon pill, with a real 3D candy heart in the middle. The bond pours from both portraits toward the heart; when it drains the heart cracks open, and when it hits max the heart slams shut, ignites and spins (MAX BOND).

- **A, Heart meter (16:9, 1920×1080):** long-form. Sits bottom centre like the creators' version (x ≈ 28–72 %, y ≈ 82–94 %). Use it for "will they stay friends" / duo challenge / story-mode commentary beats.
- **B, Bond for Shorts (9:16, 1080×1920):** phone-first. A's meter stacked: portrait, a fully visible glass capsule, portrait (≈ 80 % of the width, inside the Shorts safe zone), with a 480 px 3D glass heart perched on the capsule's centre as the payoff gauge, under a heavy "62 % TIGHT" line. The liquid pours along the capsule from both faces toward the centre and fills the heart in sync. It cracks on BEEF (both fills retreat to the faces); on MAX BOND the two fronts collide under the heart's tip, the weld blazes and the heart heals on the same frame. The sample plate is a Shorts split layout (the clip sharp in a window over a blurred bed).

The meter, heart, medallions and liquid are Three.js (rendered from timeline time, seek-safe); the status word and the % are DOM type.

## CONFIG
- `portraits`: two square image paths (face centred), left then right. Put your own in `media/`.
- `states`: status words for the start level, after the drain, and at max (e.g. `["TIGHT", "BEEF", "MAX BOND"]`).
- `levels.start`, `levels.low`: the bond level (0–1) before and after the drain. The refill always goes to 1.
- `colors`: `magenta` / `pink` (fill gradient, ends → heart), `heart`, `cracked`, `hot`, `neon` (border glow), `housing`, `chrome` (portrait rings). In B: `magenta` / `pink` (liquid, depth → surface), `hot` (payoff tint), `empty` (empty glass), `neon` (rim and glow), `chrome`, `bezel`, `housing` (track).
- `layout`: centre, spread (portrait centre offset), sizes of portraits, housing, tube and heart; type size and baseline. In B: `cx` (meter centre), `barY` (capsule centre line), `heartW`, `tipIn` (how far the heart's tip sits into the capsule; the heart centre is derived from it), `spread`, `portraitR`, `bezelR`, `housingH`, `tubeR`, `k` (bevel scale), `numSize`, `statusSize`, `typeGap` (type baseline above the heart).
- `timing`: entrance, pour, crack/drain, refill, max (the payoff), out, end (seconds).

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                 # with the sample footage
```
Same for `b/`.

## Swap in your own clip
Render the transparent overlay (`bg: none`) and drop it over your clip in your editor, or replace the `<video>` `src` values (A: `#shot1`–`#shot5`; B: each shot is a `#bedN` + `#winN` pair, with the window shown full-width at 1080×608) and keep `data-start` / `data-duration` within the clip length.

Keywords: relationship meter, love meter heart fill, liquid heart, bond meter, friendship bar, love meter, heart meter, duo, couple, Franklin, Lamar, GTA 5, GTA RP, story mode, Shorts.
