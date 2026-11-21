# 48 Mission HUD

A recreated mission HUD for GTA 5 / GTA Online challenge videos: a targets-left counter, a battery gauge, a plus-crosshair
and a GTA-style objective line. The lock-on brackets ride the target, the target blows up in the footage, a comet flies
to the counter and the 3D drum rolls the count down (3 -> 2). Our own lettering (Barlow Condensed) and marks; no game logos.

- **A (`a/`, 16:9 long-form):** counter docked top-right, battery bottom-left, crosshair centre, objective bottom-centre.
  Use it on any mission / challenge segment of a long video ("RC heli mission", "destroy every cop car", "100 days").
- **B (`b/`, 9:16 Shorts):** phone-first: one centred column, a big 3D counter at the top, the crosshair at frame centre,
  the objective, then the battery gauge with its % readout, above the platform UI. After the payoff the HUD docks out of
  the way (counter shrinks to the top, objective clears, gauge shrinks). All inside the Shorts safe zone.

## CONFIG (top of each `index.html`)
- `label`: counter label ("Targets left"). `count`: the count before the hit (single digit); the hit makes it `count - 1`.
- `objective`: the objective line as parts; a part starting with `*` is the red keyword, `|` breaks the line (B).
- `battery`: `from` / `to` lit cells (of `cells`), readout = cells x 20%.
- `colors`: crosshair idle / lock colours, comet colour.
- `counter`, `crosshair`, `batteryBox`, `objectiveTop`, `scrims`: layout in canvas px. B also has `counter.punch` /
  `counter.anchor` (payoff punch size and the fixed point, as a fraction down from the cap line), `counter.dock` /
  `batteryBox.dock` (docked scales) and `batteryBox.gap` / `yaw` (the gauge + readout row is centred on `cx`).
- `target`: the target's on-screen track (shot time -> source px, `map` = offset/scale onto the canvas). Re-measure it
  for your own clip, or set every point to the crosshair to lock dead centre.
- `timing`: boot (`cross`, `ctr`, `bat`, `obj`), lock-on (`acq`, `lock`, `fire`), `hit` (the explosion in the footage),
  `comet`, `flip` (the count rolls), `drain` (battery loses a cell; in B it is the shot's cost, right after `fire`),
  `dock` (B: the HUD shrinks out of the way), `out` (exit), `end`.

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                  # with the sample footage
```
Same in `b/`.

## Your own clip
Replace the `<video>` sources (`s0`, `s1`, `s2`, and `s3` in B) with your clip(s), keep `class="clip shot"`, `muted`, `playsinline`
and the timing attributes, then set `timing.hit` to the moment your target is destroyed and update `target.track`.

Keywords: mission HUD, objective, targets left, kill counter, battery, drone, RC helicopter, crosshair, lock-on, hit
marker, game UI recreation, GTA 5, GTA Online, challenge video, overlay.
