# 17 Emoji pop

A real 3D emoji sticker that pops on the beat over a GTA clip: the "I'm dead" skull or the tears-of-joy face that creators drop
next to the subject when something funny happens. Long-form (A, 16:9) and Shorts / TikTok (B, 9:16). Overlay: renders
transparent with `bg:none`.

- **A, Skull pop (1920x1080):** our own glossy 3D skull (Three.js: shaped cranium with real eye-socket and nose dents,
  capsule teeth, hinged jaw) pops in beside the subject with stretch and squash, snaps its jaw open and winks as the light
  rakes across it, laughs for ~1.5 s, then hops and tumbles out of frame.
- **B, Emoji burst (1080x1920):** our own 3D tears-of-joy face, about 56% of the frame wide, pops in grinning, then bursts
  into the laugh: the mouth snaps open, the glossy 3D tears squirt out and fling glass droplets, one shockwave of light rolls
  out from behind it and dissipates, and the arcade-magenta rim flares. Two smaller faces land together as the echo; all
  three laugh in bounce, then fall out.

## CONFIG
A (`a/index.html`): `at` (cranium centre, px), `size` (px per skull unit), `wink` (`right` / `left` / `none`), `bone`,
`socket`, `rim` (rim-light colour, match your shot), `shadow` (drop-shadow opacity), `timing` (`pop`, `laugh` = payoff,
`out`, `end`), `shots` (keep in sync with the `<video>` tags).

B (`b/index.html`): `faces[]` (`x`, `y`, `size` = radius px, `pop`, `out`, `tilt`, `spin`; `faces[0]` also has `burst`, the
payoff second; give the echo faces the same `pop`), `face` colours, `tear`, `shockwave` (`on`, `from` / `to` radius in face
radii, `life`, `front` / `body` / `wake` colours), `splash` (droplet count), `rim` (rim light from screen-left, match your
shot), `key`, `shadow`, `laughBeat`, `timing.end`, `shots`.

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                  # over the sample footage
```
Same for `b/`.

## Your own clip
Render `bg:none` and lay the WebM over your clip, or replace the `<video>` `src` / `data-start` / `data-duration` /
`data-media-start` values (and `CONFIG.shots`) with your own clip in `assets/` or `media/`, then move `at` / `faces` next
to your subject and set `timing` to your beat.

Keywords: emoji pop, skull emoji, dead emoji, crying laughing emoji, tears of joy, 3D emoji sticker, reaction sticker,
meme pop, GTA 5, GTA Online, Shorts, overlay.
