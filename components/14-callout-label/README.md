# 14 Callout label

A short label pinned to a thing in the shot with a bead pin and an elbow leader, tracking it as it moves. Creators use it to name, price or roast whatever is on screen: the car, the player, the NPC, the spot on the map. Long-form (A, 16:9) and Shorts / TikTok (B, 9:16).

- **A "Leader callout"** (`a/index.html`, 1920x1080, 4.0 s): a price callout on a car that re-targets on the cut, rolls the price on a 3D drum and ignites to gold with a RARE CAR stamp.
- **B "Stacked callouts"** (`b/index.html`, 1080x1920, 4.03 s): three staggered callouts on different people in a gameplay shot (one hangs under its pin); two retract, and on the cut to a close shot of Franklin his callout re-pins on his hair and locks in: the leader charges green, a bevelled lacquer plaque hinges up behind the word and locks, the type ignites to green metal, and the locked label holds at hero size while its leader follows him.

The labels are real Three.js geometry (extruded, bevelled Inter 900 from `media/glyphs.js`), lit and bloomed, with the creator ink outline + shadow done in post (`media/callout3d.js`). Pins, leaders and pings are SVG; A's tags are DOM.

## CONFIG
- A: `price`, `price2` (the drum roll), `tag`, `tag2`, `size`, `depth`, `bevel`, `colors` (enamel `base*`, metal `face/side/lip/hot`, `collar`, `ink`, `pulse`), `shots[]` (which track, `pinOff`, `elbowOff`, frame range), `safe`, `timing` (`land`, `cut`, `roll`, `ignite`, `stamp`, `spec`, `out`, `end`).
- B: `callouts[]` (`text`, `size`, `collar` (and `collar2`, the colour it turns on the lock), `land`, `out`, `track`, `pin` offset, `label` offset from the pin, `elbowDx`, `hang` (label hangs under the pin from an overline), and for the one `payoff` callout `lock` (label centre x, baseline y it locks to) and `lockScale`), `payoff` timings (`pulse`, `pulseDur`, `lock`, `lockDur`, `ignite`, `frontDur`, `punch`, `spec`, `specDur`), `plate` (the plaque: `padX`, `padTop`, `yb`, `chamfer`, `depth`, `bevel`, lacquer `top`/`bot`, `gloss`), `leader` (tube widths), `depth`, `bevel`, `colors`, `safe`, `end`. B also has `cut` (when the payoff callout re-pins on the next shot) and per-callout `ping` (landing ring radii). B's sample plate is `b/media/plate-v.mp4`: the Shorts blur-fill layout with every shot at native 1.0x (v49-h, then v06-h at 2.40 s), built by `b/media/make_plate.sh`.

## Your own clip
1. Swap the `<video>` src / durations.
2. Track each subject: `/usr/bin/python3 media/track.py <clip.mp4> <seedFrame> <x> <y> <box> <f0> <f1>` prints one `[x,y]` per frame; convert to canvas px if the clip is reframed (B's plate: x - window x0, y + 440), paste the arrays into `media/tracks.js` under a name and point the callout's `track` (A: `shots[]`, B: `callouts[]`) at it. B's payoff track continues onto the second shot after `cut`.
3. Change the label text: any of `A-Z 0-9 $.,'!?-+%#&` (re-run `media/gen_glyphs.py > media/glyphs.js` for more).

## Render
- Transparent overlay: `cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm`
- With footage: `cd a && npx hyperframes render . -o out.mp4`

Keywords: callout, label, leader line, pointer, tag, annotation, tracked label, price tag, name tag, name plate, lock-in, rare car, GTA, Shorts.
