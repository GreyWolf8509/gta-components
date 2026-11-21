# 10 Avatar cutout

Your avatar or mascot docked at the edge of the frame, popping in to deliver lines: the cartoon "reaction avatar"
GTA creators put in the bottom corner of long-form videos, and above the caption area in Shorts. Our own illustrated
presenter, built as a die-cut vinyl sticker (thick ink lines, cel shading, white border, contact shadow), with lip-sync,
blinks, a SHOCK expression on the payoff and a cyan name blade.

- **A (`a/`, 16:9, 6.4 s): Presenter avatar.** Bottom-left, cropped by the frame edge, name blade across the chest.
  Long-form commentary, reactions to a crazy moment.
- **B (`b/`, 9:16, 6.2 s): Mascot pop-up.** Rises from behind its name blade with a comic speech balloon, which flips to
  a yellow SHOUT on the payoff. Shorts / TikTok.

## CONFIG (top of each `index.html`)
- `name`, `handle`: the blade text (`handle: ""` hides the tag).
- `line`, `shout` (B): the balloon line and the payoff shout.
- `colors`: the avatar palette (hoodie, skin, hair, headset gear, accent, rim light, iris; each [light, base, shadow]).
- `bar`: blade colours, size and type sizes. `bubble` (B): balloon box, type sizes, tail `[base0, base1, tipX, tipY]`.
- `place`: avatar scale and position (art space to screen), blade position.
- `talk`: lip-sync windows `[start, end]` in seconds; `mood`: `[time, "talk"|"shock"|"laugh"]` (each mood is its own drawing: talk, shock with hands up, laugh pointing at the gameplay); `blinks`; `glance` (looks at camera).
- `timing`: entrance, blade, balloon, payoff (`hit`), exit and end times.
- The drawing itself is in `media/avatar.js` (`Avatar.build`, `Avatar.bar`, `Avatar.bubble`).

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                    # over the sample footage
```
Same for `b/`.

## Your own clip
Replace the `<video class="clip shot">` sources in `index.html` (keep unique ids, `data-start`, `data-duration`,
`data-media-start`, `data-track-index`), or render `bg:none` and lay the webm over your edit. Move `timing.hit` and
`mood` to land the SHOCK on your clip's crazy moment.

Keywords: avatar, mascot, cartoon, reaction, facecam cutout, sticker, presenter, talking head, speech bubble, shock face,
name tag, GTA 5, GTA Online, gaming commentary, long-form, Shorts.
