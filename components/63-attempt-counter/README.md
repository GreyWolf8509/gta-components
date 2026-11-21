# 63 Attempt counter

The tally that ticks up every time the run fails, the way GTA challenge and stunt creators keep score of deaths and tries.

- **A (16:9, long-form): "Death tally".** A real 3D granite RIP headstone planted in a tufted sod block, top-right, with an extruded "x N" multiplier on an odometer drum. Each fail rolls the count, the stone hops and thuds back into the sod with a dust puff; the last fail knocks it askew for good, with a light sweep across the stone.
- **B (9:16, Shorts): "Attempt badge".** "ATTEMPT #48" as a big 3D badge at the top of the Short: a red lacquer tag over huge extruded numerals on odometer drums. Each fail cut rolls the number up with a slam (49 -> 50 carries); the attempt that lands flips the tag to its green "SUCCESS!" side and wipes the numerals to gold with a raking light.

Both are overlays: render with `bg: "none"` for a transparent file to drop on your own clip.

## CONFIG (top of each `index.html`)
- **A:** `epitaph` (engraved word), `start` (count on entrance), `deaths` (seconds of each fail; the last is the big beat), `x`, `y` (headstone centre on the canvas), `cap` (number cap height), colours `stone`, `sod`, `digit`, `digitSide`, `ink`, `dust`, `enter` (arrival scale/offset and dock time), `timing` (`in`, `out`, `end`).
- **B:** `label`, `successLabel` (front and back of the tag), `start` (attempt number on entrance), `fails` (seconds of each failed attempt, put them on your cuts), `success` (second the attempt lands), `x`, `tagY`, `numY` (centres), `cap`, `tagCap`, colours `tag`, `tagSide`, `win`, `winSide`, `digit`, `digitSide`, `gold`, `goldSide`, `ink`, `timing`.

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                    # over the sample footage
```
Same in `b/`.

## Your own clip
Replace the `<video>` sources in `#push` (keep `class="clip"`, unique ids, `data-start` / `data-duration` / `data-media-start`), then set the fail and success times in CONFIG to your cut frames. Keep each incoming shot starting 2 frames early underneath the outgoing one (lower `z-index`).

## Keywords
attempt counter, death counter, death tally, tries, RIP, tombstone, headstone, x0 multiplier, fail counter, challenge, stunt, odometer, flip counter, success, GTA 5, GTA Online, Shorts
