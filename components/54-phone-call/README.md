# 54 Phone call

A phone rises into frame with an incoming call, rings, is answered, and holds on the running call while the call audio
plays: the overlay GTA editors rebuild for in-game phone calls (Lamar, Lester, a crew boss). The handset is real 3D
(Three.js): a bevelled body, polished steel frame, side keys, black glass bezel and a reflective cover glass. The
screen is our own call UI (no OS, carrier or app marks) drawn into a canvas texture.

- **a/ Incoming call (16:9, long-form):** the phone docks bottom-right (about 316x650 px), rings with two vibration
  bursts, Accept presses and slides to the centre, a green shockwave and a light rake land the connect, and the screen
  rolls into a running timer with call controls. Use it over gameplay while a call plays.
- **b/ Call for Shorts (9:16):** the same phone, big and centred (540x1110 px), with the caller's line captioned
  above it, word by word, after the connect.

## CONFIG (top of each index.html)
- `caller.name`, `caller.sub`: the contact name and the line under it.
- `caller.photo`: the portrait (`media/caller.jpg` in a/, `media/caller-hd.jpg` in b/); `caller.focusY` is the face
  height (0-1) the slow push zooms around. Use a sharp, front-lit still, about as tall as the screen texture.
- `text`: `INCOMING CALL`, the button labels and the status-bar clock.
- `phone`: settled centre `cx`/`cy`, size `w`/`h` (px), and the 3D turn `yaw`/`pitch`/`roll` (radians).
- `colors`: frame metal, accept green, decline red.
- `lines` (b/ only): the caller's captioned line, one phrase per entry; wrap the keyword in `*stars*`.
- `timing`: `in` (rise), `buzz` ([start, length] bursts), `press`, `connect` (the payoff), `words`/`swap` (b/ captions),
  `out` (drop away), `end`.

## Render
- Transparent overlay: `cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm`
- With the sample footage: `cd a && npx hyperframes render . -o out.mp4` (same for `b/`).

## Your own clip
Replace the `<video class="clip shot">` sources in `#push` with your clip (keep the ids, `muted`, `playsinline`,
`data-start`, `data-duration`, `data-track-index`, and set `data-media-start` for the in-point), or render with
`bg:none` and lay the webm over your edit. Set `timing.connect` to the moment the call is picked up in your audio.

Keywords: phone call, incoming call, iPhone call overlay, call screen, ringing phone, answer call, call timer, GTA phone,
Lamar calling, 3D phone, Shorts phone call, caller caption.
