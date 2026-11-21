# 41 · Web evidence card

The "here's the source" capture lore and myth creators cut to: a web page (wiki, article) shown big beside the creator, pushed in on the line that matters. This version makes the page a lit browser object, sweeps a real marker stroke across the key sentence and slams a rubber stamp as the beat.

- **A, Wiki page (16:9, long-form):** fictional wiki "LS LORE" in a browser window in the right two-thirds; scrolls, pushes in to full frame, marker sweeps the key sentence, "CONFIRMED" stamp lands on the infobox. 6.4 s.
- **B, Article card (9:16, Shorts):** fictional paper "THE BLAINE BULLETIN" in a phone-browser card; rises in, scrolls to headline + photo + body, marker sweeps the key sentence, "DEBUNKED" stamp presses onto the paper under it. 6.2 s.

All sites, mastheads, marks and stories are fictional, in-world rumours.

## CONFIG (top of each `index.html`)
- A: `site` (name, nav, URL), `crumb`, `title`, `from`, `intro`, `section`, `pre` / `key` / `post` (the key sentence is `key`), `section2`, `para2`, `infobox` (title, image, rows; `chip:` prefix makes a status chip), `stamp` (word, top, bottom, ink colour, size, rotation, `anchorRow` = which infobox row it lands on), `marker` colours, `push` scale, `timing`.
- B: `paper` (name, mark letter, URL, dateline), `tag`, `headline`, `byline`, `initials`, `photo`, `caption`, `pre` / `key`, `comments`, `stamp` (word, labels, `label` size, `blend`, `at` offset), `marker`, `push`, `timing`.
- Images live in `a/media/` and `b/media/`.

## Render
- Transparent overlay: `cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm`
- With sample footage: `cd a && npx hyperframes render . -o out.mp4`
- Same for `b/`.

## Your own clip
Replace the `<video class="clip shot">` sources (keep unique ids, `data-start`, `data-duration`, `data-media-start`), or render `bg:none` and lay the webm over your edit, with your facecam in the free left third (A) or below the card (B).

Keywords: web evidence, wiki screenshot, article card, news screenshot, highlighter, marker sweep, rubber stamp, confirmed, debunked, myth, lore, GTA, source card, browser window.
