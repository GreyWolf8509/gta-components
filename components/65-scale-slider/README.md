# 65 · Scale slider

A labelled CALM → CHAOS slider whose knob walks the stops and slams into the end value. Creators use it in challenge and "how I'm playing this" videos to show where a choice or a run sits on a scale (violence, stealth, difficulty, how unhinged an RP character is).

- **A (`a/index.html`, 16:9, long-form):** the top-left choice-slider card. A real 3D slab with a pink neon inlay, a machined slot with a liquid-light fill, a ceramic fader knob, a red end-stop dome, kicker + title + live % readout + stop labels.
- **B (`b/index.html`, 9:16, Shorts):** a big vertical fader (no card), the knob climbing to CHAOS with the live % on its face, stop labels as heavy caption type.

Both: 5.8 s, 30 fps, payoff at 3.0 s (the knob slams into the end stop, turns red, the dome flares, readout locks at 100 %).

## CONFIG (top of each file's script)
| Field | What it does |
|---|---|
| `kicker` | small tracked caps line above the title |
| `title` | the scale's name ("VIOLENCE") |
| `stops` | the stop labels, evenly spaced from 0 % to 100 % (A: left → right, B: bottom → top) |
| `ramp` | fill gradient stops `[position, hex]`, CALM → CHAOS |
| `neon`, `chaos` | card neon colour (A) and the payoff red |
| `knob` | the knob's path: `[time s, value 0..1, move]`, move = `"detent"` (settle with overshoot), `"wind"` (pull back), `"slam"` (accelerate into the end stop). The last entry is the payoff time. End on a value of 1 for the slam; end lower for a calmer landing |
| `timing` | `in` (card / track in), `knob` (knob drops in), `labels`, `out` (exit starts), `end` |

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                 # over the sample footage
```
Same for `b/`.

## Your own clip
Replace the `<video class="clip shot">` sources (`assets/shots/...`) with your footage, keeping a unique `id`, `data-start`, `data-duration` and `data-media-start` per clip, or render `bg:none` and lay the WebM over your edit.

## Keywords
scale slider, choice slider, violence meter, chaos meter, calm to chaos, difficulty slider, rating bar, fader, GTA challenge, GTA RP, overlay
