# 47 Selection wheel

The game wheel that top GTA essays and Shorts rebuild: the GTA V character-switch wheel and the radio station wheel. The plate blurs and desaturates while the wheel is open (as it does in the game; the radio wheel also drops it to slow motion), the highlight ticks from slot to slot, lands, is pressed and locks in, then the wheel folds away and the footage snaps back to full colour on that frame.

- **Long-form (16:9), `a/index.html`, "Character wheel":** use it when the video talks about switching characters, picking a protagonist or "who would you play as". Sits on the right of frame like the essay rebuilds, with a HUD name label under it. The four slices are real lit 3D wedges (Three.js, `a/media/wheel3d.js`): glass bevels, a gunmetal bezel, and a picked slice that is physically pressed and pops out.
- **Shorts (9:16), `b/index.html`, "Radio wheel":** use it for a "best station / what's playing" beat. A ring of 8 station badges (our own invented stations, no real station marks) round a centre label. The locked badge turns into a real lit 3D coin (Three.js: chrome rim, clear-coated face) that is pressed, springs and then flies, spinning, into the socket of a NOW PLAYING strip. The coin is a duplicate: the badge stays seated in the wheel, lit with a pink rim and bloom, until the wheel closes. The strip wipes open from it and stays on screen after the wheel closes.

Both are overlays: render with `bg:"none"` for a transparent wheel you can drop on your own clip (the blur/desaturate of the footage is only part of the sample plate; on your own edit, blur your clip under the wheel or use the plate render).

## CONFIG (top of each file's script)

### A: Character wheel
| Field | What it does |
|---|---|
| `kicker` | small HUD line above the name ("Switch character") |
| `slots[]` | the four quadrant slices: `name`, `angle` (-90 top, 0 right, 90 bottom, 180 left), `color` (GTA V HUD colours by default; it fills the slice behind the head, never the face), `img` (square transparent PNG cutout, head and shoulders, in `a/media/`), `face` (`[x, y, h]`: head centre and head height as fractions of the image, so every head lands at the same size and spot) |
| `current` | slot lit when the wheel opens (the character you are playing) |
| `path` | slots the selector ticks through; the last one is picked and locked in |
| `wheel` | `cx`, `cy`, `radius` of the wheel on the 1920x1080 canvas; `head` = on-screen head height in px; `depth`, `bevel` = slice thickness and bevel in px |
| `bloom` | colour of the warm light behind the picked head at the lock |
| `plate` | how the footage looks while the wheel is open (`blur`, `saturate`, `brightness`, `contrast`); keep contrast >= 1.1, brightness <= 0.7, saturate >= 0.4 so the bed keeps its blacks |
| `timing` | `open`, `ticks[]` (one per `path` entry), `press` (the slice squashes to .96 and sinks in; keep it 0.06 s before `lock`), `lock` (22 px radial pop with overshoot; on the overshoot frame two white-hot arcs run the bezel; a specular band and a warm bloom light the pick), `collapse` (label rolls out, slices fold into the hub; keep about 1.4 s after `lock`), `snap` (= collapse + 0.4: the picked slice hits zero, the plate is back to colour; also the cut), `end` (keep the tail after `snap` at about 0.75 s) |

Portraits are cutouts (macOS Vision foreground mask, matte choked 1 px with a 0.6 px feather, light unsharp) of stills from the GTA V shot library (`v22` Michael, `v06` Franklin and Lamar, `v33` Trevor), never Rockstar key art. Each PNG is the shot's native-resolution crop, shown at or below 1.0× (head 138 px). Swap one by dropping a square transparent PNG in `a/media/`, pointing `img` at it and setting `face` to where the head sits in it. Keep `head / face[2]` at or below the PNG's pixel size, or the face goes soft.

### B: Radio wheel
| Field | What it does |
|---|---|
| `kicker` | small line at the top of the hub ("Radio") |
| `stations[]` | 8 stations clockwise from the top: `name` (72 px, wraps to two lines in the hub), `genre` (one short sub-line, e.g. "Synthwave"), `art` (one of `palms`, `soul`, `block`, `talk`, `rock`, `night`, `bahia`, `deep`; the landed one is also painted onto the 3D coin) |
| `current` / `land` | station lit when it opens / station it ticks to and locks in (clockwise; `timing.ticks` needs one entry per step) |
| `nowPlaying` | `kicker`, `title`, `artist` for the strip under the wheel |
| `wheel` | `cx`, `cy` of the wheel on the 1080x1920 canvas |
| `strip` | `left`, `top` of the 720x188 NOW PLAYING strip (default x 180-900, inside the 9:16 safe column) |
| `coin` | the landed badge as a 3D coin: `thick` (edge thickness in px), `rim` (chrome tint), `hot` (rim flash colour at the lock) |
| `plate` | open-wheel footage look (`blur`, `saturate`, `brightness`, `contrast`) |
| `timing` | `open`, `ticks[]`, `lock` (press; springs out 0.06 s later while a white-hot arc runs the rim), `fly` + `flyDur` (the coin duplicate leaves for the strip, uncovering the lit badge still seated in its slot, and lands `flyDur` later, then the strip wipes open), `collapse` (badges fold into the hub), `snap` (= collapse + 0.32: disc cut, plate back to colour, cut to the next shot), `stripOut` (strip wipes shut into its socket, the coin pops out), `end` |

The coin is drawn by `b/media/coin3d.js` (Three.js r160 from jsDelivr), always from the timeline time, so scrubbing and rendering are exact. A's wheel works the same way (`a/media/wheel3d.js`); its face textures are painted from the PNGs and colours in CONFIG when the page loads.

## Render
```
cd gta/47-selection-wheel/a
npx hyperframes render . -o out.mp4                                              # over the sample footage
npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
```
Same in `b/`.

## Your own clip
Change the `src` of the `<video class="clip shot">` tags in `index.html` and their `data-start` / `data-duration` / `data-media-start`, keeping each inside its clip's length. In A, `#shotA` runs to `timing.snap` and `#shotB` (the new character) starts there. In B, `#shotA` plays at normal speed until the wheel opens and `#shotA2` continues the same moment in slow motion until `timing.snap`, where `#shotB` takes over (the sample lands on a wide freeway shot; in 9:16, land on a wide rather than a full-frame face close-up, which is upscaled). The sample slow-mo (`b/media/v57-slowmo-v.mp4`) is the clip from 0.3 s stretched 2.5x with motion interpolation: `ffmpeg -ss 0.3 -t 1.65 -i clip.mp4 -an -vf "minterpolate=fps=75:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,setpts=2.5*PTS" -r 30 -g 15 slowmo.mp4`. For your own clip, make the same stretch (or set `data-playback-rate="0.4"` on `#shotA2` with `data-media-start` at the open time; that is quicker but steps at 12 fps).

## Keywords
GTA 5 character wheel, switch wheel, character switch, Michael Franklin Trevor, radio wheel, radio station selector, weapon wheel, selection wheel, now playing, game UI, HUD recreation, GTA essay, GTA Shorts overlay
