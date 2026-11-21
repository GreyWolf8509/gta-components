# 42 Social post card

A social post or chat message that drops in over gameplay and pays off with a reaction. Both variants live on
**sunwire**, our own in-world Los Santos network (own name, sunset-disc mark, icons and verified mark); no real platform
logos or layouts.

- **A / Post card (16:9, long-form).** A post from @everestchris6 (avatar, verified mark, handle, two media thumbs,
  action row) drops in as a glossy 3D slab, a yellow marker extends word by word across the phrase you're reading,
  then the like lands: a 3D heart bursts out of its slot and the count rolls up. Use it when you read a post or
  comment on camera (reaction, drama, news, "people are saying...").
- **B / Chat bubble (9:16, Shorts).** A lobby chat thread: messages pop in as 3D bubbles and push the thread up, typing
  dots bounce, your reply lands and a 3D heart reaction slams onto it while the count rolls. Use it for "POV" texts,
  setups and punchlines in Shorts.

## CONFIG
- A: `platform.name`; `author` {name, handle, time, verified}; `body` (wrap the highlighted phrase in [brackets]);
  `media` (two image paths), `clip` (duration chip on the 2nd image); `counts` {replies, relays, likesFrom, likesTo};
  `colors`; `card` {x, y, w, h}; `timing` {in, hiFrom, hiTo, payoff, out, end}.
- B: `platform` {name, room, online}; `messages` [{from, initial, text: [lines], color, av: [2 colours]}, ... the last
  one with `mine: true`]; `reactions` {from, to}; `colors`; `layout` {left, right, bottom}; `timing` {head, m: [..],
  typing, mine, payoff, out, end}.

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                   # over the sample footage
```
Same for `b/`.

## Your own clip
Replace the `<video class="clip shot">` sources (keep `data-start` / `data-duration` / `data-media-start`), or render
`bg:none` and drop the webm over your edit. Swap the post images in `a/media/post-1.jpg`, `post-2.jpg`.

## Keywords
social post, tweet card, post screenshot, highlight, like burst, like counter, comment, chat bubble, text thread,
typing dots, reaction, heart, DM, lobby chat, GTA, overlay, 3D, Shorts
