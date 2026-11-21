# 73 Chapter counter card

A long-form chapter card with a mechanical NN / 14 counter drum and an "X BECOMES Y" headline, plus the chapter's
persistent progress chip. The card is the full-frame section divider creators cut to between chapters (the plain
"10 seconds later" / "ATTEMPT 2:" card in the census), built as a lit board with a real counter: two Three.js cylinders
with the digits painted round them roll the chapter number in, snap into the detent and lock with a light hit; the
headline rises in; then the drum lifts off the board and flies into the top-right corner, becoming the persistent NN / 14
chip, while the board slides up to the chapter's first shot (on 16:9 a sharp window of that footage sits on the right of the
card and expands into the full frame on the cut).

- `a/index.html`: 16:9, 1920x1080, 4.65 s. Long-form chapter card; the chip docks at right 64 / top 48.
- `b/index.html`: 9:16, 1080x1920, 4.7 s. Shorts version, phone-first: the drum at 64% of frame width, three-line 128 px
  headline, 84 px chip at right 144 / top 240, everything inside x 72-936 / y 230-1480.

Origin: the film `films/gta6-rdr2-gta5` (kit `assets/kit/film.{css,js}`, objects `card` + `prog`). Same object structure,
so the CSS (`.board/.pool/.vig`, `.housing/.cavity/.winshade/.split`, `.kick`, `.cof`, `.head .hl1/.hl2`, `.rule`,
`.prog`) and the drum/roll/lock JS port back into the kit.

## CONFIG (top of each file)
- `num`, `of`, `from`: chapter number, total, and the number the drum rolls from (default `num - 1`; `09 -> 10` rolls both wheels).
- `kick`, `a`, `verb`, `b`: the kicker ("SYSTEM"), headline line 1, the verb ("BECOMES") and the object in the accent colour.
- `colors`: digit ink and drum paint.
- `layout`: pixel layout for the variant (x of the ink edge, drum radius `R`, wheel length `colLen`, window height `winH`,
  digit cap height `cap`, tops of the kicker / housing / headline / rule, chip inset, camera distance `camD`).
- `timing`: kicker, "/ 14", headline lines, rule, `roll` / `lock` (the payoff), `win` (the footage window), `fold`, `fly`,
  `cardOut`, `chipIn`, `chipOut` (= `end` keeps the chip persistent), `end`.
- `layout.win`: `[x, y, w, h]` of the footage window on 16:9, or `null`.

## Render
```
cd a && npx --yes hyperframes@0.9.72 render . -o out.mp4
cd b && npx --yes hyperframes@0.9.72 render . -o out.mp4
```
Full-kind component: it always shows footage after the card (the `bg` variable is accepted but does nothing).

## Swap in your own clip
Replace the `<video class="clip shot">` elements (A: `#win` is the window shot, `#shot1` the shot after the cut; B: two shots after
the cut at 2.25 s).
Any 1920x1080 (A) or 1080x1920 (B) clip works; keep each clip's `data-duration` within its length.

## Fonts
Oswald only (variable TTF bundled in `media/fonts/`, OFL licence alongside). No other families.

Keywords: chapter card, section divider, counter, odometer, drum, progress chip, "X becomes Y", GTA 6, RDR2, GTA 5, long-form, Shorts.
