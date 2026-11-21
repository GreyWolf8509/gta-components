# 36 · Ranking board

The rank column from "Ranking the craziest / funniest GTA moments" videos: ranks 1–5 sit on screen for the whole countdown and fill in one by one, each right after its clip plays. Here each rank's slot is a thick 3D tile that flips over to a still of that clip, and the score rolls in beside it. #1 is the payoff: a gold slot, a raking light and 100 %.

- **A · Rank column** (`a/`, 9:16, 1080×1920): Shorts / TikTok. The left-edge column (rows at 34–68 % of the frame height, the creators' spot), numeral + slot + percentage per row.
- **B · Rank board** (`b/`, 16:9, 1920×1080): long-form. The same five slots laid out along the top of the frame, percentage under each slot.

## CONFIG (top of each `index.html`)
| Field | What it does |
|---|---|
| `ranks[]` | `rank`, `pct` (the score that fills in), `thumb` (any 16:9 still of that rank's clip, e.g. `media/thumbs/rank3.jpg`), `color` (`gold` / `red` / `slate` / `white`, the creators' numeral colours) |
| `prefilled` | ranks already revealed when the board enters (the countdown is already under way) |
| `reveals[]` | `{rank, at}`: the second each rank flips in. Put each on the cut after that rank's clip. `rank: 1` gets the gold payoff. |
| `layout` | A: `x`, `y0`, `step` (row spacing), `numSize`, `tileW/H`, `pctSize`. B: `top`, `numSize`, `numGap`, `tileW/H`, `gap`, `pctSize`, `pctGap`. |
| `colors` | per colour: numeral lacquer gradient, metal rim colour, face-down "?" colour |
| `timing` | `in` (board enters), `out` (board exits), `end` |

## Render
```bash
cd a   # or b
npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay for your edit
npx hyperframes render . -o out.mp4                                                  # over the sample GTA V footage
```
The assets folder is synced from `gta/_shared` (`bash tools/gtalib/sync_shared.sh gta/36-ranking-board/a`).

## Use your own clips
- Put a still of each ranked clip in `media/thumbs/` (any 16:9 JPG; grab one with `ffmpeg -ss 3.2 -i clip.mp4 -frames:v 1 media/thumbs/rank3.jpg`) and point `ranks[].thumb` at it.
- Set `reveals[].at` to your cut times, and `timing.out` / `end` to your edit's length (the board can stay up as long as you like).
- To preview over your footage, swap the `<video>` `src`s (keep `class="clip"`, unique ids, `data-start` / `data-duration` / `data-media-start`).

Keywords: ranking, top 5, countdown, rank column, tier list, leaderboard, list overlay, percentage, thumbnail slots, flip, GTA 5, Shorts.
