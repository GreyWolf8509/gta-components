# GTA 6 component library: design system "Leonida", craft v2

These are clean, reusable motion graphics for GTA 6 compilation shorts on TikTok, YouTube Shorts and Reels. They sit on top of gameplay footage or frame it.

> **Why v2 exists (Nov 18).** The owner reviewed v1 and called it "basic, not professional or clean-looking". v1 scored 7/10 with our critics, but 7 meant "competent template". The library mostly looked like small dark rounded UI cards with modest type floating on soft, ungraded footage, which reads as a web dashboard rather than an edit. v2 raises the bar to **"a top motion designer would ship this in a paid pack"**, and gives every component the same finishing layer. v1's rules are kept in `DESIGN.v1.md` for history only. **Where they conflict, this file wins.**

## What the top GTA 6 edits actually do
Studied with Apify in Nov 2026: the top 47 non-official GTA 6 shorts, 0.6M–15.5M plays. Frames are in `research/gta6/refs/pro-edits/` and the contact sheets in `research/gta6/apify/sheets/`.
- **The footage is the hero, and it's beautiful.** Sharp, graded, rich: contrast, warm highlights, deep shadows, bloom on lights. Nothing soft or muddy. Edits cut on the beat, every 0.8–2 s, and use slow pushes, speed ramps and flash frames.
- **Type is sparse, confident and cinematic.**
  - One word or one short phrase at a time, centred, often in a **wide extended sans** with tracking ("WHOOP", "POLICE", "425 DAYS").
  - Or big bold caption words with a single colour highlight.
  - Labels are tiny and wide-tracked.
  - There are no paragraphs and no dashboards.
- **Light, not boxes.** Glow and bloom on type and shapes, light leaks, exposure flashes on cuts, RGB split on hits. Legibility comes from where the type is placed and from soft darkening, rarely from a card.
- **Letterbox is a look.** Several top edits keep the 16:9 shot in a centred band with black above and below, and put the type in the black. That's clean, cinematic and uses full resolution.
- **Where cards do appear** (news, posts, pills), they're faithful objects with exact proportions, never generic rounded rectangles.

Our job is to be **cleaner and more premium than those creators** while keeping what works for them. Benchmark: Rockstar's own marketing graphics (`research/gta6/refs/official-type/`), premium title design (Apple, Netflix, A24 trailers), and the craft level of `research/design-refs/craft/`. The house bar for the finishing layer is the kit demo: `gta6/_kitdemo/index.html` and its frames `research/gta6/refs/pro-edits/house-bar-kitdemo-*.jpg`.

## Format
- **Canvas:** 1080×1920 (9:16), 30 fps, 5–8 s.
- **Variables:**
  - `variant` ("0"/"1"): two meaningful variants with different real content and a real style difference.
  - `bg` ("plate"/"none"): "plate" shows footage; "none" must be a clean transparent overlay a creator can drop on their own clip.
    - The finishing stack (grain, vignette, flashes, leaks) is **off** in "none".
    - A legibility scrim that is part of the graphic may stay.
  - Full-frame components that frame or transform footage always show footage.
- **CONFIG:** all content lives in one `const CONFIG = {...}` at the top of the script: text, numbers, colours, clip paths and timing.

## Footage (v2): `assets/shots/`, 4K-sourced and graded
**Use these, not `assets/plates/`.** The old plates are soft 1080p crops, and several contain the GTA VI logo, "Rockstar Games Presents" cards or a PS5 ad.

The shots:
- are single continuous camera shots from the official trailers;
- are cut from the 4K masters and pre-graded (contrast, saturation, gentle highlight bloom);
- are each available as `-v.mp4` (1080×1920) and `-h.mp4` (1920×1080), plus a `-v.jpg` poster in `gta6/_shared/shots/`.

They are short, like real trailer shots. Work with that the way an editor would:
- **Cut on rhythm.** Sequence 2–5 shots with their own `data-start` / `data-duration` on track 0, cutting every 0.8–2.2 s. Put cuts on the graphic's beats: the reveal, the hit, the next item.
- **Hold.** For a component that needs one steady shot (a callout, magnifier, name tag or freeze), use a long one: `s016` (8.6 s), `s004` (5.0), `s008` (4.8), `s014` (4.4), `s007` (3.9), `s011` (3.6), `s119` (4.1, but flat grey). Add `Look.push`. **Play shots at 1.0×.** If the hold is longer than the shot, cut to a second shot. Don't stretch one shot.
  - **Slowed footage is the most common footage defect in critic verdicts (25 of 51).** `minterpolate mi_mode=blend` makes double-exposure ghosting. `data-playback-rate` or `setpts` below 1× repeats frames, which judders at 0.68× and smears faces at 0.17×.
  - Only a component whose job IS slow motion (slow-mo replay, freeze-frame detail) may slow footage. Even then, stay at 0.5× or faster, use motion-compensated interpolation, and check every frame of the slowed section for warping before you capture:
    ```
    ffmpeg -i in.mp4 -vf "minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,setpts=PTS/<rate>,fps=30" -an assets/clips/<name>.mp4
    ```
    Keep such clips inside your own project's `assets/clips/`.
- **Letterbox.** Put an `-h.mp4` shot at 1080×608 in a centred band (y ≈ 656–1264) on black, with type in the bands. This is a top-edit look; use it on purpose.
- Every `<video>` needs a unique `id`, `class="clip"`, `muted`, `playsinline`, `data-start`, `data-duration` and `data-track-index`. Use `data-media-start` to choose the in-point. Never let the playhead run past a shot's length: a frozen last frame is a defect.

| Shot | Length | Content |
|---|---|---|
| `s004-palm-shirt-truck` | 5.0 s | man in palm-print shirt gesturing by a white pickup, daylight |
| `s007-jason-door` | 3.9 s | shirtless Jason at a weathered wooden door |
| `s008-jason-driving` | 4.8 s | Jason driving in sunglasses, profile |
| `s011-vice-highway` | 3.6 s | Vice City highway, towers and green road signs, daylight |
| `s012-muscle-beach` | 3.1 s | outdoor beach gym, bench press, palms |
| `s014-driveby-police` | 4.4 s | drive-by past a mural, police car ahead |
| `s016-store-counter` | 8.6 s | man at a pawn-shop counter window |
| `s018-lucia-gate` | 3.0 s | Lucia at a chain-link gate, golden hour (hero portrait) |
| `s026-sunset-pier` | 1.6 s | boats at a pier, warm sunset |
| `s027-sunset-dock` | 1.9 s | dock with string lights over the sea at sunset |
| `s036-beach-bar` | 1.4 s | woman in a green dress at a sunset beach bar |
| `s039-blue-club` | 3.3 s | nightclub dancer under blue lights |
| `s047-car-hood-golden` | 1.2 s | woman on a car, golden hour |
| `s055-night-truck` | 3.7 s | pickup tail lights at night |
| `s057-ocean-drive` | 0.8 s | Vice City Ocean Drive street, day |
| `s064-jetski` | 1.7 s | couple on a jetski, bright water |
| `s065-biker-plane` | 1.8 s | biker riding beside a seaplane in the sky |
| `s074-keys-sign` | 2.2 s | "The Keys" roadside welcome sign |
| `s075-marina-aerial` | 1.8 s | aerial over a marina |
| `s076-jason-boat` | 2.9 s | Jason at a boat wheel |
| `s078-jason-phone` | 2.2 s | Jason on the phone at a marina |
| `s083-duo-convertible` | 1.3 s | Lucia and Jason in a red convertible |
| `s084-swamp-sunset` | 1.4 s | silhouettes wading in a swamp at sunset |
| `s092-duo-car` | 1.8 s | Jason and Lucia leaning on a car, container yard |
| `s096-police-street` | 1.8 s | police car on a palm-lined street |
| `s098-jason-fireworks` | 1.4 s | Jason at night with an explosion behind |
| `s100-biplane-beach` | 1.8 s | biplane trailing pink smoke over a beach |
| `s105-lucia-rooftop` | 0.7 s | Lucia on a rooftop at sunset |
| `s108-balcony-sunset` | 1.3 s | couple embracing on a balcony at sunset |
| `s113-lucia-firing` | 0.9 s | Lucia firing a weapon, explosion behind |
| `s119-gameplay-shootout` | 4.1 s | gameplay: shootout with a police SUV (real HUD) |
| `s123-gameplay-night-drive` | 3.4 s | gameplay: night drive in a red convertible (real HUD) |
| `s135-skydive-city` | 1.6 s | skydiver over Vice City |
| `g01-gta5-lifeguard-sunset` | 2.6 s | GTA V: lifeguard tower at sunset |
| `g05-gta5-jetski` | 1.0 s | GTA V: jetski |
| `g06-gta5-mountain` | 2.8 s | GTA V: hikers on a mountain |
| `g07-gta5-red-convertible` | 2.4 s | GTA V: red convertible on a street |
| `g16-gta5-michael-skyline` | 2.9 s | GTA V: Michael looking at the Los Santos skyline |
| `g28-gta5-liquor-store` | 2.2 s | GTA V: liquor store at dusk |
| `g33-gta5-oil-sunset` | 1.6 s | GTA V: oil pump and skyline at sunset |
| `g39-gta5-vinewood` | 1.1 s | GTA V: Vinewood sign at dusk |

GTA V shots (`g*`) come from the 1080p 2013 trailer and are naturally softer. Use them only for GTA 5 vs GTA 6 content. The facecam stand-in is still `assets/plates/facecam-sample.mp4`.

## The finishing layer: `assets/kit/look/` (required)
Load `assets/kit/look/look.css` and `assets/kit/look/look.js` after GSAP. All helpers are seek-safe and return their end time. Read the header comments in `look.js`.

| Helper | What it does |
|---|---|
| `Look.install(tl, {duration, grain:.16, vignette:.5, enabled: bg==="plate"})` | Animated film grain and vignette on top. Required on plate renders, off for `bg:none`. Keep grain at .12–.2: grain should be felt, not seen. |
| `Look.reveal(tl, el, at, {by:"words"/"chars"})` | Masked line rise: the default way type appears. |
| `Look.enter` / `Look.exit` (`from`/`to`: blur, up, down, left, right, scale) | Opacity, transform and blur together. Directional moves get real motion blur. |
| `Look.fill(container, gradient, {sheen})` + `Look.sheen(tl, …)` | Gradient type that survives splitting and passes lint, plus a specular sweep. |
| `Look.bloom(el, {color, strength})` | Light around bright type or shapes. Match the scene light; strength .3–.7. |
| `Look.impact(tl, at, {shake:"#shake", flash:0, amp, zoom})` + `Look.expose(tl, at, {target:"#shake", peak:1.85})` | The beat hit: shake and punch-zoom from `impact`, light from `expose` (an exposure pulse that blows highlights and keeps blacks black). Wrap footage in `#shake` (and an inner `#push`). **Pass `flash:0`.** `impact`'s white overlay flash reads as a grey veil (see Critic-tested lessons). |
| `Look.chroma(tl, el, at, dur, {px})` | RGB split on the incoming hero only: `px` ≤ 6, `dur` ≤ 0.2. Optional. |
| `Look.leak(tl, at, dur, {colors})` | A light leak sweep, for transitions and payoffs. Use at most one per component. |
| `Look.push(tl, el, at, dur, {to:1.06})` | Slow camera push on held footage. |
| `Look.count(tl, el, at, dur, from, to)` | Rolling numbers. |
| `Look.drive(tl, at, dur, fn)` | Your own per-frame effects. |

`KitMotion` (`assets/kit/motion/motion.js`) is still there for UI-state motion (typing, menus, toggles) inside faithful UI objects.

## Safe zones (9:16 platforms)
Keep all text and key objects inside **x 72–936, y 230–1480**:
- the right ~150 px holds like/comment/share buttons;
- the bottom ~440 px holds caption and handle UI;
- the top ~200 px holds the status bar and search.

Hooks and titles sit in the upper third (y 230–700). Captions sit around y 1050–1400. Footage can bleed everywhere.

## Type (v2)
Fonts are in `assets/fonts/fonts.css`; never load fonts from the network.

| Face | Use |
|---|---|
| **Archivo, wide** (`.t-wide`: `font-stretch:125%`, 700–900, caps) | The cinematic edit face: single words, titles, locations, chapter cards, big numerals with a unit, impact words. |
| **Inter** | Display (`.t-display`: 800, tracking −0.045em, optical size auto) for heroes and numerals; 500–700 for supporting lines; captions 800–900. |
| **Labels** (`.t-label` Inter 600 caps, tracked .34em, or `.t-label-wide` Archivo) | Kickers, units, sources. 24–30 px. |
| **JetBrains Mono** | Only where a data feel is the point (timecodes, coordinates). |
| **Barlow Condensed** | Only in HUD-kit components that echo the in-game HUD. No longer a general impact face. |

- **Scale like a title designer.**
  - Hero type: 110–200 px wide, or 140–300 px display.
  - Hero numerals: 220–480 px.
  - Keep a ≥ 4:1 size ratio between the hero and its label.
  - Use at most 3 sizes and at most 2 families per frame.
  - The hero element spans 70–88% of the safe width.
- **Fit.** Every line fits inside x 72–936 with margin, with no clipped glyphs. Use `text-wrap: balance`. Avoid orphans: one word alone on a line is a defect unless it's deliberate stacking. Measure long strings, and the longer variant, before choosing a size.
- **Legibility comes from placement first.** Put type in sky, shadow or a letterbox band, or away from faces. Then use a soft scrim (`.lk-scrim-top/-bottom/-spot`) and the soft lift shadow (`.t-lift`, or `filter: drop-shadow` on gradient type). Never use a hard stroke, except a 2–3 px `paint-order` edge on big caption words.

## Colour
- **Leonida sunset**, the accent. Use it on ONE element per frame: a highlighted word, a numeral, a fill or a rule.
  - Core: `#F84FA4 → #FE78A6 → #FE8E4E → #FEB747`.
  - Full logo-style sweep: `#365ECE → #A341C0 → #F84FA4 → #FE8E4E → #FEB747`.
  - Soft sunset surface: `#9C7AA8 → #D689A1 → #FAA08D → #FCB680 → #FFC88F`.
  - Use `Look.fill` or `.t-sunset`.
- **Ink** `#1F202B` (`.lk-ink`) for official-style tiles. Plum `#160123` for night.
- **Rockstar date style:** white wide-tracked caps with a ~2 px `#EE08F2` offset and soft bloom. Use it for "official"-feeling dates and places.
- **Teal** `#2EC4B6` only for success and "confirmed". **Police red/blue** `#FF3B3B` / `#3B82FF` only for wanted, police and breaking states.
- White type is pure `#FFFFFF`, or 86% for secondary. Never grey-on-grey.

## Craft rules (v2)
1. **Footage + finishing.**
   - Use `assets/shots` footage that is alive: cut on rhythm, or held with a push.
   - Plate renders always run `Look.install`.
   - Never show soft, muddy, frozen or logo-bearing footage.
2. **Graphic and image are designed together.**
   - Place type where the image gives it room.
   - Frame the subject; don't cover faces.
   - Scrims and light take the place of boxes.
   - The frame should look like a still from a trailer, not an app screen on top of a video.
3. **No generic cards.** A translucent dark rounded rectangle holding a title and a label is banned.
   - Use a card only when the format really is an object: social post, comment, news chyron, phone message, HUD element, spec sheet, ticket.
   - Then make it a faithful, high-craft object: real proportions, real detail (avatar, handle, timestamp, icons drawn as SVG), an 8 px grid, `.lk-glass` or `.lk-ink` material, a lit top edge and a contact shadow.
   - Size it for a phone, ≥ 80% of the safe width.
4. **Motion like an editor.**
   - Entrances combine 2–3 properties: masked reveals for type; opacity, transform and blur for objects; directional motion blur on travel.
   - Stagger 20–40 ms per character or 60–100 ms per word.
   - Exits are designed too (blur-out or mask-out), not just a fade.
   - Every component has **one payoff hit**, ideally on a cut: an impact, flash, chroma split, number slam, sheen or leak.
   - Ease with `expo.out` / `power3.out`. Only pushes are linear.
   - Hold each read for at least 1.2 s. The component reads within 0.6 s of appearing.
5. **Light.** Bright elements get bloom matched to the scene. Use one light moment at the payoff (sheen, leak or flash), with restraint: no glow soup, and at most one accent.
6. **Real content.** Use real names, places, dates and numbers from `research/gta6/FACTS.md`. Never invent quotes from real people or fake official Rockstar posts. Use @everestchris6 for social cards.
7. **No trademarks.** No GTA VI logo, no R* logo, no Pricedown, no copied key art. Write "GTA 6" or "GTA VI" in our own type.
8. **Three.js** only where depth genuinely helps. Keep it deterministic and seek-safe.
9. **Determinism.** One paused GSAP timeline on `window.__timelines["main"]`, ending with `tl.seek(0)`. No `Math.random`, `Date.now` or network at render.

## Variety across the library (added mid-run, Nov 18)
The first v2 rounds converged on one look: a letterboxed 16:9 band on black, wide Archivo caps, a sunset gradient word, and the same two shots (`s018` Lucia at the gate, `s098` Jason with fireworks). Each one is good. Fifty of them would make a monotonous library. So:
- **Letterbox is reserved.** Use it as the main frame only where cinematic framing IS the job: cinematic bars, chapter card, time skip, wasted stamp, sunset wipe, character intro, or a variant whose manifest name asks for it. Every other component is **full-bleed vertical** footage, with type placed in the image's own negative space plus soft scrims.
- **Each component gets a visual signature from its job.** HUD-kit pieces echo the in-game HUD's thin white restraint. News and social pieces are faithful broadcast or platform objects. Comparisons use real split geometry. Countdowns and stats are numeral-led. Callouts draw on the footage itself. The wide Archivo face is one tool; Inter display, tight and huge, is just as valid and often better for numerals and captions.
- **Cast the shot for the job.** Don't default to `s018` or `s098`:
  - police and wanted: `s014`, `s096`, `s119`;
  - cars and driving: `s008`, `s083`, `s123`, `s011`;
  - Vice City and places: `s011`, `s057`, `s075`, `s135`, `s074`;
  - nightlife: `s039` (and `s055` only as a quick cut: it's foggy);
  - action: `s113`, `s098`, `s119`;
  - romance and duo: `s083`, `s092`, `s108`;
  - sunset and mood: `s026`, `s108`, `s047`, `s036` (`s027`, `s084` and `s100` only as quick cuts, never the payoff);
  - water: `s064`, `s076`.

  Lucia (`s018`, `s105`) and Jason (`s007`, `s008`, `s078`) portraits are for character-led components.

## Critic-tested lessons (from the first 51 v2 verdicts, Nov 18)
These are the recurring reasons components stall at 7. Each one is cheap to avoid up front.
1. **The payoff light must ADD light.**
   - A white overlay flash (`Look.impact` `flash` ≥ 0.3) lifts the blacks and reads as a "flat grey veil" or "milky wash". Critics flagged it in 10+ components.
   - Use `Look.impact(..., {flash:0})` together with `Look.expose(tl, at, {target:"#shake"})`.
   - Hold the peak for at least 2 frames: a 1-frame peak reads as flicker.
   - Land the hit when the hero is complete and in its final colour, not while it's still building or grey.
2. **RGB split is seasoning.** At `px` 12–16 the chroma split reads as a "stock rainbow glitch". Use `px` ≤ 6 for ≤ 0.2 s on the incoming hero only, or leave it out.
3. **Footage speed.** Play shots at 1.0× and cut, as covered in Footage above. Ghosting, judder and repeated frames are defects.
4. **Shot casting: murky shots kill the payoff.** Critics repeatedly called these muddy, dark or hazy:
   - `s123` (dark gameplay; the bottom 40% is near-black);
   - `s055` (foggy);
   - `s027` and `g01` (hazy, low-contrast sunsets; "mud on mud" side by side);
   - `s084` (brown silhouettes);
   - `s100` (milky);
   - `s075-h` (soft).

   Don't put the payoff or a long hold on them, and never end on them. End on your brightest, sharpest, most colourful shot.
5. **Stock idioms critics name as template.** Avoid these:
   - stepper and progress dot rails;
   - pin + hairline + ring callouts;
   - the centred kicker / hero / hairline-label stack;
   - five centred stars that read as a product rating;
   - a 12 px dot UI;
   - a "fit loop" that quietly shrinks the hero below the size floor.
6. **Optical alignment.** Big numerals and wide caps carry side bearing. Align the hero's visible ink edge, not its box, to the column shared by the kicker and rules: measure it in a hero PNG and offset it. 20–30 px misalignments are called out as defects.
7. **Rolling digits and moving type never cross other type.** Mask each digit-roll inside its own clip box so outgoing glyphs don't smear over labels.
8. **Persistent components (trackers, counters, HUD) must get out of the way.** After the hit they dock small, at the edge, without covering a third of every clip.

## Auto-fail patterns (the critic caps these at 6)
- A small widget or card floating mid-frame, under 60% of the safe width.
- A generic dark translucent rounded card used as the container for a title or label.
- Soft, ungraded or old `assets/plates/` footage; a plate render without `Look.install`; a frozen or dead plate.
- Timid type (hero under the size floor) or more than 2 families on screen.
- Entrances that are only fades or slides with no blur, mask or motion blur; no payoff hit.
- Anything that reads as a web dashboard, SaaS widget, or stock After Effects template.
