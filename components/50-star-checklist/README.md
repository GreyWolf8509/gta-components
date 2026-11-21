# 50 Star checklist

A row of stars that fill as conditions are met, the creators' "heat system / rating" card. It's a plum lacquer card with a neon edge. Each condition ticks red to green and drops a real faceted 3D star into its socket. On the last star, the whole row turns gold, a light rakes across it, and the payoff word lands.

- **A (`a/`, 16:9 long-form):** a tracker docked top-right while you explain a heist, challenge or heat system. The tab rolls to the payoff word.
- **B (`b/`, 9:16 Shorts):** the same card, phone-first, in the upper frame with a label per star. The payoff word ("PERFECT RUN") slams in under it.

## CONFIG (top of each `index.html`)
- `title`: the tab text ("HEIST RATING").
- `payoff`: the payoff word ("PERFECT RUN"). In A it's the tab roll. In B it's the big word (`tabRoll: true` also rolls the tab).
- `conditions`: one `{ label, icon }` per star, left to right. The icons are `eye`, `bell`, `crosshair`, `watch`, `shield`, `car`, `mask` and `cash`. With 3-4 conditions, also cut `timing.fills`.
- `colors`: `neon` (edge), `lacquer` (card), `pearl` (filled star), `gold` (payoff star).
- `card`: centre `cx`/`cy`, `w`/`h`, corner `r`, in canvas px. `layout`: star pitch, star radius, and the disc, label and tab sizes.
- `fly`: each star's flight, from the start depth (`z`), offset and scale.
- `timing`:
  - `drop`: the card drop;
  - `fills`: when each star lands (the last one is the payoff);
  - `out`: the exit lift;
  - `end`.
- B only: `word` (centre y, font size, max width).

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                  # over the sample footage
```
Same for `b/`.

## Your own clip
Render `bg:none` to a webm and lay it over your footage. Or replace the `<video>` sources in `#push` with your own clip (keep `class="clip"`, a unique id, `data-start`, `data-duration` and `data-track-index`).

Keywords: star rating, wanted stars, heat level, checklist, mission rating, challenge stars, 5 stars, perfect run, heist rating, GTA overlay.
