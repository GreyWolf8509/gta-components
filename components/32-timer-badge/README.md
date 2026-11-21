# Timer badge (32)

The challenge timer creators put on screen for timed challenges ("escape the cops in 30 seconds", "fastest lap"). There are two variants:

- **A, Countdown ring (16:9, long-form):** a 3D steel ring with a draining band in the top-right corner. It arms red at 0:10 and beats every second after that.
- **B, Stopwatch (9:16, Shorts):** a 3D stopwatch with a readout counting up in hundredths at top-centre. The payoff is the stop: crown press, gold lock-in and a `NEW RECORD` chip.

Both are overlays. With `bg: "none"` they render on transparency, with no footage, grain or vignette.

## CONFIG

**A** (`a/index.html`):

| Field | What it sets |
|---|---|
| `start` | Seconds left when the badge lands (shown as m:ss) |
| `total` | Challenge length; the full sweep of the ring |
| `warnAt` | When the ring arms red |
| `dock` | Badge centre on the canvas |
| `radius` | Badge size |
| `digitWidth` | Width the m:ss row fits |
| `big` | Where and how big the entrance read is before docking |
| `colors` | `calm`, `warn`, `steel` |
| `timing` | `in`, `dock`, `firstTick`, `out`, `end` |

**B** (`b/index.html`):

| Field | What it sets |
|---|---|
| `startAt` | Stopwatch reading at t = 0, in seconds |
| `stopAt` | Timeline second the crown is pressed; the final reading is `startAt + stopAt` |
| `chip` | The label that rolls out at the stop |
| `watch` | Watch position and radius |
| `pill` | Readout x range and height |
| `digitWidth` | Width the readout row fits |
| `colors` | `steel`, `gold`, `hand` |
| `timing` | `in`, `pill`, `out`, `end` |

## Render

```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                 # over the sample footage
```

The same commands work in `b/`.

## Use your own clip

Replace the `<video class="clip shot">` sources in the project with your gameplay, keeping `data-start`, `data-duration` and `data-media-start` within the clip's length. Alternatively, render `bg:none` and lay the webm over your edit.

## Keywords

timer, countdown, stopwatch, challenge timer, time left, speedrun, clock ring, last 10 seconds, new record, GTA challenge, overlay
