# GTA-niche component library: design guide

Motion graphics for GTA 5 / GTA Online / GTA RP / RDR2-style videos, built from research on what top creators actually put on screen. Every component exists because top videos use it. Each one comes in two variants: usually one for long-form YouTube (16:9) and one for Shorts / TikTok (9:16).

> **Why this library exists (Nov 18).** Three earlier GTA 6 libraries were rejected:
> - v1 as "basic";
> - v2 as "basic lower thirds / text";
> - v3 (invented "objects") as "not getting it".
>
> The owner asked for the components that keep coming up in the top GTA videos, executed at a level above what those creators ship. So we studied 106 top videos (42 long-form, 64 short-form; `research/gta-niche/`, report at https://claude.ai/artifact/R35cSTp4mJR5Etm2AA6rqW) and picked the 50 most-used components. **Your job is the same component, in the same place, doing the same job, and executed at a premium motion-design level.**

## 1. Evidence first (non-negotiable)
Your manifest entry (`gta/manifest.json`) lists `evidence.frames`: real frames from top videos where creators use this component, highest-viewed first, each with the analyst's notes (`style`, `position`, `motion`).
1. Open **every** evidence frame before designing. Then open `research/gta-niche/frames/<key>/` around the best frame (the neighbouring `t…jpg` files) to see the motion.
2. Write down what the creators' version does: its job, where it sits, how big it is, what it looks like, and how it moves.
3. **Keep the vernacular.** A viewer must recognise it instantly as "the subscribe pill", "the word captions" or "the character wheel". Don't invent a new format. Don't make it a moody cinematic title when the evidence shows a punchy creator graphic.
4. **Then beat it on craft:** the same object, cleaner and richer. See §2.

The critic sees the same evidence frames. A component that doesn't do the evidence's job is capped at 6, however pretty it is.

## 2. What "next level" means here
Top GTA creators' graphics are recognisable but rough:
- stock button packs;
- jaggy strokes;
- default fonts;
- linear slides;
- no light or depth.

We keep the recognisable form and add what a top motion designer adds:
- **Material.** Real surfaces: gloss and bevel on a 3D button, a liquid fill with a meniscus and bubbles, metal with a moving specular, glass with refraction-like blur, paper with grain. Shapes have a lit top edge, an inner shadow and a soft contact shadow, built from layered gradients, not one flat fill.
- **Light.** Specular sweeps, bloom matched to the footage, a light moment on the payoff. Light adds; it never greys the frame.
- **Depth.** Layers at different depths, parallax, true 3D where it helps (Three.js, §8), shadows that land on something.
- **Physics.** Springs with overshoot, squash and stretch, inertia, follow-through on secondary parts (a bell clapper, a pin's shadow, a tag on a string). Avoid `power2` slides.
- **State.** Components change state the way real UI does: press, then pressed, then confirmed; fill, then overflow, then level up; select, then lock in. Each state change is the beat.
- **Type.** Exact typesetting: balanced lines, tight tracking on heavy caps, tabular figures on counters, optical alignment, and real size contrast.
- **Integration.** It sits where the evidence puts it, sized as creators size it, with legibility from placement, shadow and edge rather than a box.

The test: put our frame next to the best evidence frame. A creator should say "that's the thing I use, but it looks expensive."

## 3. Format
- **Two files per component**, two variants:
  - `index.html` = variant A (manifest `variants[0]`);
  - `v1.html` = variant B (`variants[1]`).
  - Each file is its own composition with its own canvas. 16:9 is 1920×1080 and 9:16 is 1080×1920 (`data-width` / `data-height` on the root).
- **Timing:** 30 fps, 4–8 s, one root composition per file with id `"main"`.
- **One variable:** `bg` ("plate" / "none").
  - "plate" shows sample footage.
  - "none" must be a clean transparent overlay a creator can drop on their own clip: no footage, no grain, no vignette, no full-frame flashes.
- **Kinds** (manifest `kind`):
  - `overlay`: graphics over footage; must work with `bg:none`.
  - `full`: the component is a treatment of footage itself (transitions, punch-ins, blur fill, end screen, chapter card). It always shows footage, and `bg:none` may simply keep the footage.
- **CONFIG:** all content goes in one `const CONFIG = {...}` at the top of the script: text, numbers, colours, clip paths and timings. A creator edits CONFIG only.
- **Fonts before measuring:** load each face explicitly (`document.fonts.load("900 100px Archivo")` etc.) before building the timeline. `document.fonts.ready` alone can resolve before a face that no visible text uses has loaded, so auto-fit sizes and gradient boxes get measured in a fallback font. The template does this.
- **Determinism:** one paused GSAP timeline on `window.__timelines["main"]`, ending with `tl.seek(0)`. No `Math.random`, `Date.now`, timers or network at render. Fonts are local.

## 4. Safe zones
- **16:9 long-form (1920×1080):**
  - title-safe is x 96–1824, y 54–1026;
  - persistent trackers (cash, level, meters, handles, facecam) dock 40–64 px from the edges, as creators place them;
  - centre-bottom captions sit at y 800–960;
  - keep the bottom-left 300×140 clear if the shot has a game minimap you want visible.
- **9:16 Shorts / TikTok (1080×1920):** all text and key objects stay inside x 72–936, y 230–1480.
  - The right ~150 px holds the platform buttons, the bottom ~440 px the caption and handle UI, and the top ~200 px the status bar.
  - Hook titles go at y 230–620, captions at y 1050–1400.

## 5. Footage: `assets/shots/` (GTA V, official Rockstar trailers)
`gta/_shared/shots/shots.json` lists every shot. Each shot is one continuous camera shot, graded, with no logos, rating cards or title text:
- `vNN-<slug>-h.mp4` is 1920×1080;
- `vNN-<slug>-v.mp4` is 1080×1920;
- each has a `.jpg` poster.

Shots named `gp-*` come from Rockstar's 2013 gameplay video and show the real HUD (minimap, wanted stars). They're softer, but they're what gameplay looks like. Use them where the component lives on top of gameplay (HUD, counters, captions in gameplay clips).

- **Play shots at 1.0×.** Trailer shots are short (mostly 1–2.7 s), like real trailer shots, so cut every 0.8–2.5 s like an edit. For one steady shot, use a long hold with a slow push (`Look.push`): `v35` (9 s), `v50` (7.1), `v58` (6.8), `v52` (4.7), `v49` (4.3), `v54` (3.4). Slowed footage judders or ghosts. Only a slow-motion component may slow footage.
- Never let the playhead run past a shot's length: a frozen last frame is a defect. Use `data-media-start` for in-points.
- **Cast the shot for the job:**
  - cash: `v10-cash-table`;
  - police and wanted: `v51`, `v52`, `v27` (police ahead);
  - cars and driving: `v17-deluxo-sunset`, `v27`, `v31`, `v57`;
  - characters: `v03`, `v06`, `v22`, `v33`;
  - scenic and title: `v36`, `v01`, `v11`, `v45`;
  - action: `v08`, `v26`, `v30`;
  - race: `v19`, `v20`, `v21`.

  Avoid dark or murky shots for the payoff (e.g. `v25-michael-door`, `v04` at night). End on a bright, sharp, colourful shot.
- Every `<video>` needs a unique `id`, `class="clip"`, `muted`, `playsinline`, `data-start`, `data-duration` and `data-track-index`. Wrap the videos in `<div id="shake"><div id="push">…</div></div>` if you use `Look.impact` / `Look.push`.
| Shot | Length | Content |
|---|---|---|
| `v01-lifeguard-sunset` | 1.33 s | lifeguard tower on the beach at sunset, warm |
| `v02-mountain-hikers` | 1.33 s | three hikers on a mountain ridge, bright day |
| `v03-franklin-street` | 1.23 s | Franklin gesturing on a sunny street |
| `v04-heli-cockpit-night` | 0.8 s | helicopter cockpit over the city at night |
| `v05-franklin-lamar-street` | 1.3 s | Franklin and Lamar on a street, Grove-style neighbourhood |
| `v06-franklin-lamar-portrait` | 1.63 s | Franklin and Lamar, two-shot portrait |
| `v07-biplane-sunset` | 2.23 s | biplane over desert hills at sunset |
| `v08-trevor-rifle` | 0.97 s | Trevor aiming a rifle, explosion behind |
| `v09-juggernaut-minigun` | 1.23 s | armoured juggernaut with a minigun |
| `v10-cash-table` | 1.27 s | stacks of cash and guns on a table |
| `v11-yacht` | 2.13 s | superyacht cutting through the sea |
| `v12-heli-city-dusk` | 1.6 s | helicopter over Los Santos at dusk |
| `v13-lowrider-gang` | 1.2 s | lowrider and crew on a neighbourhood street |
| `v14-driveby-sunset` | 1.5 s | drive-by silhouette at sunset |
| `v16-car-rear-lights` | 1.03 s | car driving away on a desert road, lights flaring |
| `v17-deluxo-sunset` | 1.6 s | silver sports car driving at sunset, smoke stacks (long hold) |
| `v18-pool-skyline` | 1.33 s | three people in an infinity pool, skyline at sunset |
| `v19-race-car-city` | 1.1 s | open-wheel race cars on a city street |
| `v20-neon-stunt-tunnel` | 0.63 s | neon green stunt tube, car with flame exhaust |
| `v21-race-topdown` | 1.77 s | top-down: cars racing on a stunt track |
| `v22-trio-jumpsuits` | 1.67 s | Michael, Franklin and Trevor in jumpsuits on a roof |
| `v23-minigun-park` | 1.3 s | minigun firing in a park |
| `v24-sunset-powerlines` | 1.7 s | sunset street with power lines and shoes on a wire |
| `v25-michael-door` | 1.63 s | Michael at a door, dark interior (long hold) |
| `v26-bridge-explosion` | 1.73 s | explosion on a rail bridge in the mountains |
| `v27-first-person-drive` | 2.67 s | first-person driving, police ahead |
| `v28-tennis-mansion` | 2.57 s | man walking on a tennis court at a mansion |
| `v29-plane-clouds` | 1.27 s | plane over clouds and mountains |
| `v30-street-explosion` | 1.67 s | street explosion and gunfire |
| `v31-red-car-sunset` | 1.73 s | man in a red car at sunset |
| `v32-skydive-towers` | 1.27 s | skydiver falling between towers |
| `v33-trio-kitchen` | 1.4 s | the three protagonists in a kitchen |
| `v34-rocket-heli` | 1.23 s | rocket launcher aimed at a helicopter |
| `v35-penthouse-dusk` | 8.97 s | man in orange in a penthouse: a party dissolves to an empty room at dusk at ~4.6 s (long hold) |
| `v36-hills-city-view` | 1.93 s | hills overlooking downtown Los Santos |
| `v37-tower-looking-up` | 1.97 s | glass skyscraper looking up, sun glint |
| `v38-freeway-dusk` | 1.93 s | freeway interchange at dusk |
| `v39-lowriders-downtown` | 1.2 s | lowriders on a downtown street |
| `v40-car-meet-night` | 1.5 s | car meet by a mural at night |
| `v41-smokestacks-dusk` | 1.47 s | smokestacks over the city at dusk |
| `v42-lighthouse` | 1.23 s | lighthouse on a cliff by the sea |
| `v43-club-alley-night` | 0.97 s | nightclub queue in an alley, purple lights |
| `v44-bridge-skyline` | 1.73 s | steel bridge with the downtown skyline |
| `v45-beach-aerial` | 0.93 s | aerial over a beach with palms and turquoise water |
| `v46-gp-speedboat` | 2.63 s | gameplay: speedboat under a bridge (HUD) |
| `v47-gp-chiliad-aerial` | 2.4 s | gameplay: aerial of Mount Chiliad |
| `v48-gp-jetski-beach` | 1.23 s | gameplay: jetski off the beach, skyline |
| `v49-gp-franklin-mural` | 4.3 s | gameplay: Franklin walking by a mural (HUD, long hold) |
| `v50-gp-bike-mansion` | 7.1 s | gameplay: riding a BMX out of a mansion drive (long hold) |
| `v51-gp-police-desert` | 0.93 s | gameplay: police chase in the desert (HUD) |
| `v52-gp-police-bridge` | 4.73 s | gameplay: police chase on a bridge (HUD, long hold) |
| `v53-gp-sunset-arms` | 1.3 s | gameplay: person with arms raised at sunset |
| `v54-gp-trevor-walk` | 3.37 s | gameplay: Franklin in a firefight by a car (HUD; the file name says trevor but it is Franklin) |
| `v55-gp-parachute` | 2.37 s | gameplay: rainbow parachute over the city (long hold) |
| `v56-gp-truck-crash` | 5.07 s | gameplay: tow truck rams an armoured van |
| `v57-gp-red-car-highway` | 2.03 s | gameplay: red sports car on the highway (HUD) |
| `v58-gp-franklin-window` | 6.77 s | gameplay: Franklin at a high window over the city (long hold) |

- The facecam stand-in is `assets/plates/facecam-sample.mp4`: 1920×1080, 9 s, a man talking to camera in a warm room.

## 6. Type
Fonts load from `assets/fonts/fonts.css`. Never use system or network fonts.

| Face | Use |
|---|---|
| **Inter** 700–900 | Captions, UI text (buttons, labels, cards), counters (with `tnum`). The workhorse. |
| **Archivo** (variable: `font-stretch` 62–125%, 100–900) | Narrow heavy caps (62–75%, 800–900) are the creator caption / impact / title face, the look of "ES ULTRAREALISTA" and "PLAYING AGAINST ANYONE" in the evidence. Wide (112–125%) is for titles, chapter cards and place names. |
| **Barlow Condensed** 600–900 | Game-HUD recreations only (wheel labels, mission text, banners). |
| **JetBrains Mono** | Only where a data feel is the point (timers, coordinates). |

- **Creator captions and impact words:** heavy (800–900), tight tracking (−0.01 to −0.03em), a crisp edge (`paint-order: stroke fill` with a 2–6 px dark stroke scaled to the size) and a soft drop shadow. A keyword in one accent colour.
- At most 2 families per frame and 3 sizes.
- `text-wrap: balance`, no orphans, no clipping. Measure the longer variant.
- Size like the evidence or bigger, never timid.
  - 16:9 captions: 64–96 px.
  - 9:16 captions: 84–130 px.
  - Hook titles: 72–110 px.
  - Counters on 16:9: 56–90 px.

## 7. Colour: "Los Santos"
These are the creators' accents, refined. Use one accent per element, two per frame at most.

| Token | Hex | Use |
|---|---|---|
| Caption yellow | `#FFD23C` | keyword highlight, the creator default |
| Cyan | `#33D6FF` | second speaker, cool highlight |
| Subscribe red | `#FF2E3A` (shade `#C8102E`) | subscribe, circle and arrow, alerts |
| Money green | `#38E07B` (HUD green `#72CC72`) | cash, gains, success |
| Gold | `#F6C453` → `#E59A1C` | milestones, passed banners, crowns |
| Vice pink / purple | `#FF4FA3` / `#9B5CFF` | neon, RP, radio wheel |
| HUD white | `#F4F4F4` on ink `#0E0F13` | HUD recreations |

White type is `#FFFFFF`. Never put grey on grey.

## 8. Three.js
Use it where real depth or material makes the component better: an extruded title with moving light, a tilted 3D map, money rain, a 3D tile grid, a prize wheel, a timeline the camera travels along. Don't use it for flat UI.
- Load `https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js` (a global `THREE`) after GSAP.
- Size the renderer to the canvas: `renderer.setPixelRatio(1)`, `antialias: true`, and `alpha: true` for overlays.
- Render from time, not a loop:
  - drive `renderAt(t)` from a GSAP proxy on the main timeline (setter calls `renderAt`);
  - also listen to `hf-seek` (`e.detail.time`);
  - call `renderAt(0)` at build.
  - No `requestAnimationFrame`, no `setAnimationLoop`.
- Materials and light:
  - `MeshStandardMaterial` / `MeshPhysicalMaterial`, a key light plus a `HemisphereLight` fill;
  - `renderer.outputColorSpace = THREE.SRGBColorSpace`;
  - ACES tone mapping for metal;
  - an environment from a `PMREMGenerator` of a simple gradient scene for reflections.
  - Unlit black cutouts are a defect.
- Text in 3D: build extruded letters from canvas-traced shapes or a font converted to shapes ahead of time. Simpler: render the title to a canvas texture with our local fonts after `document.fonts.ready`, and use it as a texture, alpha or bump map. Footage can be a `THREE.VideoTexture`, but only from a `<video>` the framework owns (one with `class="clip"`).
- Keep DOM type for anything that must be razor-sharp (labels), pinned to projected 3D positions.

## 9. The finishing kit: `assets/kit/look/` + `assets/kit/motion/`
Load `look.css` and `look.js` after GSAP. Every helper is seek-safe and returns its end time:
- `reveal` (masked text rise);
- `enter` / `exit` (opacity + transform + blur);
- `fill` + `sheen`;
- `bloom`;
- `impact` (shake / punch; **always `flash:0`**) + `expose` (exposure pulse);
- `chroma` (`px` ≤ 6, ≤ 0.2 s);
- `leak`;
- `push`;
- `count`;
- `drive`.

`Look.install` (grain + vignette) is **optional** in this library. GTA creators' footage is clean, so on plate renders use at most `grain:.08, vignette:.3` if it helps, and never on `bg:none`. `KitMotion` has typing, menus and toggles for UI-state motion.

## 10. Content and trademarks
- No Rockstar marks:
  - no GTA V / GTA Online / R* logos;
  - no Pricedown or a lookalike;
  - no official key-art renders.
- Write "GTA 5" / "GTA V" / "GTA Online" in our own type.
- No other brands' logos: no YouTube play logo, no TikTok, X or Discord marks. Subscribe buttons use our own bell, thumb and play-triangle icons.
- Portraits for wheels, badges and tags may be stills cropped from the shot library. Illustrated avatars are our own drawings.
- Social or web cards use fictional platforms and @everestchris6. Don't invent quotes from real people.
- **GTA facts you can use:**
  - GTA V released Sept 17, 2013 (PS3 / X360);
  - Nov 18, 2014 (PS4 / XB1);
  - Apr 14, 2015 (PC);
  - Mar 15, 2022 (PS5 / Xbox Series X|S).
  - Map: Los Santos and Blaine County. Places include Vinewood Hills, Del Perro, Vespucci Beach, Downtown, Sandy Shores, Paleto Bay, Mount Chiliad and Grove Street.
  - Protagonists: Michael De Santa, Franklin Clinton, Trevor Philips. Lamar Davis is Franklin's friend.
  - GTA VI releases Nov 19, 2026 (PS5 / Xbox Series X|S).
  - Anything else must be generic creator content (their own challenge numbers, their own commentary lines).

## 11. Critic-tested lessons (carried over from 100+ earlier verdicts)
1. **Payoff light must add light.** A white overlay flash lifts the blacks into a grey veil. Use `Look.expose` and `impact({flash:0})`. Hold the peak 2+ frames, and land it when the element is complete.
2. **RGB split is seasoning:** `px` ≤ 6, ≤ 0.2 s, or leave it out.
3. **Footage at 1.0×.** Cut, don't stretch.
4. **Murky shots kill payoffs.** End on bright, sharp footage.
5. **Optical alignment.** Align a numeral's or heavy cap's visible ink edge, not its box. Check in the hero PNG. A 20 px misalignment is a defect.
6. **Rolling digits never cross other type.** Mask each digit column.
7. **Persistent components get out of the way.** Trackers, counters and meters make their entrance big, then dock at the edge where the evidence puts them.
8. **Every component has ONE payoff beat:** the click, the level-up, the slam, the lock-in. It's built as a state change with light and physics, not just a bigger scale.
9. **Entrances combine 2–3 properties** (transform + opacity + blur or mask). Exits are designed too.
10. **Hold each read 1.2 s or more;** it must read within 0.6 s at phone size.

11. **No stock 4-point sparkle / star glint.** Critics call it a Canva/AI cliché every time. Let light come from the material: a clipped specular band, bloom on a bevel, a sheen across the face.
12. **Footage sharpness.** The `-v` shots are 9:16 crops of 1080p sources, upscaled about 1.8× (2.2× for the letterboxed trailers), so they're soft up close. When footage sits inside a window, letters or a small frame, map the `-h` shot at ≤ 1.0× instead. The `gp-*` shots (2013 gameplay) are the softest: never end or pay off on them unless the HUD is the point.
13. **Judge at phone size.** Before capturing, downscale your hero frames to 640×360 (16:9) or 360×640 (9:16). Thin extrusions, faint bloom and subtle bevels vanish there, and the critic judges there. Material has to be bold enough to survive.
14. **No see-through exits.** A fade or dissolve leaves milky, ghostly half-alpha slabs over the plate, and critics flag it every time. Collapse, scale into an anchor, or mask-wipe, with 6–8 px directional blur, and cut on the zero frame. Don't leave more than about 0.6 s of footage-only tail after the exit.
15. **Text swaps roll; they never cross-dissolve.** Changing a label (station name, counter word, chip) in place goes through an `overflow:hidden` window: old text out, new text in, with no opacity overlap. Two labels stacked even for 1 frame is a defect.
16. **Faces stay natural.** Portraits are sharp, front-lit 3/4 crops with natural skin and a closed or neutral mouth. Put state colour behind the head (radial or rim), never as a wash over the face. Dark backlit profiles don't read at phone size.
17. **Graded beds keep their blacks.** Footage blurred or dimmed under a UI needs contrast ≥ 1.1, brightness ≤ 0.7 and saturation ≥ 0.4. A mid-grey desaturated bed reads as a veil.
18. **GSAP `attr` on SVG:** give every tweened attribute an explicit starting value in the markup (e.g. `opacity="1"`). Otherwise a backward seek reverts it to 0.
19. **No zero-thickness flips, confetti or sunbursts.** A CSS `rotationY` flip on a flat card goes paper-thin edge-on and shows a blank back. Give it a real extruded edge (Three.js or layered sides), or swap with a scale punch plus an iris. Hairline multicoloured confetti and thin sunburst rays are the same cliché as lesson 11: use one specular sweep across the object, plus a few embers near the action.
20. **No franchise IP from other properties** (Dragon Ball orbs, Marvel, etc.), even when creators use it. Build our own equivalent, and offer the look as a CONFIG option at most.
21. **9:16 full-frame footage is always upscaled.** Don't end or pay off on a full-frame 9:16 close-up of faces. End on the graphic, on a window of an `-h` shot at ≤ 1.0×, or on a wide `-v` shot whose detail survives (skyline, landscape, vehicles).
22. **Localise payoff light on bright frames.** A frame-wide expose over a light map, white UI or sky reads as washout. Bloom the payoff object itself (radial on the pin, bevel or face), and hold the peak for 3 frames.
23. **Nothing ghost-fades in.** Labels, chips and titles arrive with a spring, slam or mask. Opacity reaches 1 within 0.05–0.08 s, and see-through frames of type are a defect.
24. **Real 3D on the payoff object breaks the 7 plateau.** Word captions sat at 7/7 for two rounds as "a CapCut gold preset". It passed 8/8 once the single payoff word became Three.js geometry: glyph outlines extruded and bevelled, lit by a light front plus a raking key, with the running words kept in the DOM. Where the evidence object has physical depth (a word, button, badge, orb or tube), make that one hero object real geometry and keep the rest crisp DOM.
25. **Cut-frame layers: no CSS `mask-image` and no image-based SVG filters.** In this renderer they paint one frame late after a cut (found on hit-transitions), so a masked or filtered layer that must land on the cut shows a stale frame. Use clip-path, overflow windows, or a canvas or Three.js layer instead. The same applies to footage: an incoming video clip can paint 1 frame late at a hard cut, which shows as a white or blank frame. Overlap consecutive shots by 2 frames, with the incoming clip starting early underneath, instead of butting them end to start. Also: the runtime forces `visibility: visible` on active clip videos, so hiding a wrapper with `visibility: hidden` leaves its videos on screen with stale transforms. Hide video wrappers with `opacity: 0` instead.
26. **Design the 9:16 Short phone-first.** Most components that stalled overnight passed v0 and failed only v1 at 7, judged as "an app widget" or "a stock FX pack" at 360×640. Guilloche, thin bevels, hairline rings and tracked small caps vanish there. For v1, make the hero object about 60–70% of the frame width, use Archivo or heavy display type at 64 px or more for the key word or number, and give the hero object real depth (lesson 24). Build one payoff beat, not three equal ones.

## 12. Auto-fail (the critic caps these at 6)
- It doesn't do the evidence's job, or sits somewhere creators never put it (wrong vernacular).
- A generic dark translucent rounded card holding a title and label (unless the evidence object really is a card, and then it must be a faithful, crafted object).
- Timid sizing: clearly smaller or weaker than the evidence's version.
- Flat graphics with no material, light or depth: a single flat fill and a default shadow, i.e. a stock template.
- Entrances that are only fades or slides; no payoff beat.
- Font fallback, more than 2 families, clipped text, text outside the safe zone.
- Trademark logos or Pricedown anywhere, or invented quotes.
- A `bg:none` render of an overlay that shows footage, grain or a full-frame veil.
