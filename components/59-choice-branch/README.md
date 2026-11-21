# 59 · Choice branch

A neon line that draws in, forks at a glowing node into two branches, and ends at two option tiles. A white-hot pulse runs into the chosen branch: that tile presses in, lights up and gets a neon frame, while the other branch flickers out like a dying neon sign. Creators use it when a story video reaches a decision ("who do you side with", "which ending", "which path"), over a dimmed shot with a caption on top.

- **A: `a/index.html`, 16:9 (1920×1080), long-form.** Horizontal branch: trunk from the left, options stacked on the right with labels.
- **B: `b/index.html`, 9:16 (1080×1920), Shorts / TikTok.** Vertical tree: stem from under the hook title, two tiles side by side, labels under them.

Tubes, the fork node and the option tiles are real Three.js geometry. The title and labels are DOM, pinned to the 3D anchors.

## CONFIG (top of the script in each file)
- `pill`: the small tag above the caption.
- `title`: the caption. Put the pink keyword in `[brackets]`; `|` breaks the line (B uses two lines).
- `options[]` (two entries): `kicker` ("SIDE WITH"), `chosenKicker` (shown on the chosen option after the lock-in), `name`, `icon` (`"crew"` or `"dagger"`, drawn on the tile face), `color` (3-stop tile gradient: light, mid, dark).
- `chosen`: index of the option that wins (0 or 1).
- `neon`, `neonHot`: tube colour and its white-hot core.
- `timing`: `title`, `trunk`/`trunkDur` (draw-on), `fork`, `branchDur`, `tiles`, `labels`, `pulse` (pulse departs), `hit` (pulse lands: the payoff), `out` (exit starts), `end`.

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                    # over the sample footage
```
Same for `b/`.

## Use your own clip
Render the `bg:none` overlay and drop it over your footage, or replace the `<video>` sources in `#push` with your own clip (keep `class="clip"`, a unique `id`, `muted`, `playsinline`, `data-start`, `data-duration`, `data-track-index`). On plate renders a radial dim (`#dim`) darkens the footage under the diagram, like the creators' dimmed shot; it never appears in the transparent render.

## Keywords
choice, decision, branch, fork, path, ending, side with, neon, story choice, tree, options, pick a side, GTA story, mission choice
