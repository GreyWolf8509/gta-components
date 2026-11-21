# 18 Name tag

Who is this, in their colour, sitting on them. Two variants:

- **A, Player tags (16:9, long-form):** floating 3D name tags pinned over each player in a gameplay clip (GTA Online crews, RP, story recaps). They drop in as pins, unfold into nameplates and light up in each player's colour, then ride the players' heads.
- **B, Character intro (9:16, Shorts / TikTok):** the freeze-frame character intro. The shot freezes, the world drops into a duotone in the character's colour while he stays natural (a head-and-shoulders matte with a rim behind his head), a big 3D name slams in above him and locks in green, with a role plate and a pointer to his head; then the frame whips out to the next shot.

## CONFIG
**A (`a/index.html`)**
- `tags[]`: `name`, `rank` (the number in the puck), `track` (a head track in `media/tracks.js`), `tip` (pointer tip offset above the head centre at clip start / end, px), `scale` (start / end), `in` (pop time), `bx` (0 = plate centred on the pointer, 0.5 = puck over the pointer), `face` (enamel top / bottom colours), `hot` (front edge), `halo`.
- `look`: capsule height, tail, puck inset, name / rank sizes, the pre-payoff enamel `pre`, `tilt`, `depth`, `bevel`.
- `timing`: `unfold`, `ignite` + `igniteDur` + `frontFrom` / `frontTo` (the light front's screen x), `out[]` per tag, `end`.

**B (`b/index.html`)**
- `name`, `role`; `head` (face centre and head top on the frozen frame; the tail points at the top).
- `freeze`: `at` (media time of the frozen frame), `release` (the whip starts), `cut` (lands on the next shot).
- `name3d`: size, max ink width, centre, depth, bevel, tilt, ink outline px. `chip` (y, height, text size, tracking, padding), `tail` (width, ink px), `colors`, `timing` (`slam`, `ignite`, `frontDur`, `lock`, `chip`, `tail`, `out`, `end`).

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent tags
cd a && npx hyperframes render . -o out.mp4                                                    # over the sample clip
cd b && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm
```

## Your own clip
- **A:** swap the `<video>` src, then make head tracks: export frames (`ffmpeg -i clip.mp4 f%03d.png`), set each player's head centre on frame 1 in `media/track_heads.py`, run it with OpenCV, and re-smooth into `media/tracks.js` (or key `[x, y]` per frame by hand). Set `data-duration` to the clip length.
- **B:** set `shotA` to your character clip and `shotB` to the shot you cut to after the freeze. Export the freeze frame at `freeze.at` (`ffmpeg -ss <at> -i clip.mp4 -frames:v 1 media/freeze.png`) and point the two plain `<img>` at it. Make the matte: `npx hyperframes remove-background media/freeze.png` (or any roto tool) gives the head; extend it down over the neck and shoulders, feather about 6 px, save it as an RGBA PNG for `#cut`; the rim PNG is the head mask blurred outward in the character colour. Set `head` to the face on that frame.

Keywords: name tag, player tag, gamertag, nametag over head, character intro, freeze frame intro, who's who, GTA Online crew, RP character name, role title, colour per player.
