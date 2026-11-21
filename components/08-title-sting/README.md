# 08 Title sting

This is the big title reveal at the top of a video or a series: "THE CHILIAD MYSTERY" style metal title cards on long-form, and game-logo style drops with footage inside the letters on Shorts. It's a **full** component, so the footage always shows.

Each variant is its own HyperFrames project:

| Variant | File | Canvas | Use |
|---|---|---|---|
| A, Chrome title (3D) | `a/index.html` | 16:9 1920x1080, 5.3 s | Long-form cold open or chapter/series title |
| B, Footage in letters | `b/index.html` | 9:16 1080x1920, 4.3 s | Shorts / TikTok opener that opens into your clip |

## A: Chrome title (3D)
- **The title.**
  - Three.js extruded letters (Archivo outlines, kerned) with a deep blue anodised face and a polished gold bevel.
  - They're lit by a travelling key light and a live environment that holds the current footage frame, so the shot is reflected in the metal. The environment is banded dark-to-hot, so the gold shows bright and dark bands on every shot.
  - The playing shot is also mapped into the blue faces as a faint moving reflection.
  - Real HDR bloom (half-float render target, bright pass, 3-level blur) makes the gold bevel glow. There are no sprites.
- **The move.**
  - The camera dollies from a raking close-up to the wide lockup and arrives still moving, carries past its mark and settles back (a damped overshoot). Every letter slams forward onto its mark (staggered, with overshoot), the frame takes a hit and the plate gets a 3-frame exposure punch. Then a slow push.
  - On the landing, a hot key light rakes across in front of the title, left to right, so the gold bevels flare letter by letter through the bloom, and the glow behind (in the shot's own colour) swells.
- **The exit.** The camera flies through the gap between the lines, the letterbox retracts and the plate clears to full brightness.

**CONFIG** (top of the script):

| Field | What it does |
|---|---|
| `lines` | Title lines, top to bottom. Each line is justified to the same width, so short lines set bigger. |
| `tracking` | Extra letter spacing in font units. |
| `kicker` | The credit line in the bottom letterbox bar (HTML; `<b>` is gold, `<i>` is the dim divider). Use `""` to hide it. |
| `face` | 3 stops (top to bottom) for the letter faces. |
| `bevel` | The rim and side metal. |
| `shots` | Id, cut time, length and the `glow` colour behind the title (and its rim light) while that shot plays. Mirror the cuts on the `<video>` tags. |
| `faceReflect` | How strongly the playing shot reflects in the blue faces (0.15 = a faint moving reflection; 0 turns it off). |
| `rake` | The payoff light: `power` (how hot the bevels flare) and `dur` (seconds to cross the title). |
| `bloom` | `strength`, `threshold` (linear HDR) and `radius` of the bevel bloom. |
| `timing` | `land` (letters and camera arrive), `payoff` (the rake starts), `kicker`, `exit` (fly-through), `end`. Keep `end` about `exit + 1.2`: the title clears the lens at `exit + 0.62`, so that leaves about 0.6 s of clean footage. |

## B: Footage in letters
- **The stack.**
  - A huge stacked title on a black plate. The "window" lines are hollow 3D channel letters (Three.js: the outlines extruded with a hard chamfer lip and the front left open), so your footage is seen through each letter, framed by a lit lip and real walls.
  - The "solid" line is the red accent: a chiselled 3D slab of lacquered plastic (clearcoat over red), tilted back so its top chamfer catches the key. It reflects a small studio: a strip light lays one crisp band across its face, and an overhead softbox makes the top chamfers hot pink.
  - One light rig (a raking key from the upper left, a top light and a fill) lights all three lines.
  - One footage layer holds the native 16:9 shot at 1:1 (sharp) behind the whole window block, so LOS and SANTOS look into the same picture.
- **The move.**
  - The lines slam in (each opaque within 0.08 s), and STORIES lands with a squash.
  - Each cut inside the letters is a beat. On the first cut the lockup punches and the lips flare. The last cut is a state change: the lockup steps up to 1.07 and stays there, one soft 150 px white band crosses LOS, then SANTOS, then STORIES' top chamfer (with a bloom on the chrome lips only, at its 3-frame peak), and STORIES lands one frame later with a squash. While the lockup holds, it grows 5% and a broad soft light drifts across the chrome lips.
  - Then the letters open: the camera rushes through the "L" with a radial zoom blur and a 2-frame exposure lift through the stem, and cuts clean onto the full-frame shot.
- Without WebGL it falls back to 2D windows and a 2D slab.

**CONFIG:**

| Field | What it does |
|---|---|
| `lines` | `[{text, kind: "window" or "solid"}]`. |
| `width`, `centerX`, `centerY`, `gap` | The lockup box. Keep it inside x 72–936 *after* the beats' `step` and its overshoot (748 wide × 1.05 grow × 1.07 step peaks at about 850 px). |
| `tracking` | Extra letter spacing in font units. |
| `grow` | The slow scale-up while the lockup holds, about its centre (0.05 = 5%, sine.inOut over 0.5–2.9 s). |
| `frame` | The hollow window letters: `color` (the frame metal), `lip` (the chamfer as a share of the cap height, clamped to `lipMin` / `lipMax` px) and `depth` (the walls, as a share of the cap height, clamped to `depthMin` / `depthMax`). |
| `slab` | The solid line: `front` (the paint), `wallPx` (how tall the lower wall shows), `chamferPx`, `tilt` (degrees back), and the lacquer: `roughness`, `clearcoat`, `clearcoatRoughness` (lower is a sharper reflection). `top`, `low` and `wall` are the 2D fallback's colours. |
| `light` | The rig: `key`, `top`, and the fill for the frames (`fillFrame`) and the slab (`fillSlab`). The chrome lips have their own `keyFrame`, `keyFrameDir` and `topFrame`; keep their top chamfers below white, or the payoff band has nothing to brighten. Then the slab's studio reflections: `envTop` (the overhead softbox on the top chamfers), `envStrip` (the band across the face) and `envSide` (the left strip on the curves). |
| `shots` | Cut time; `tint` (the shot's light on the walls inside the letters); `frame` (the source pixel x/y at the centre of the window block); `cover` (the source x the full-frame crop centres on after the open); optional `grade` ({brightness, contrast, saturate, roll}) for that shot, where `roll` (0–1) rolls clipped highlights (a sun disc) into the sky's own orange. |
| `windowGrade` | The default grade inside the letters. A shot's `grade.roll` (0–1) adds a warm highlight roll-off, so a sun in the shot rolls into orange instead of turning a letter white. |
| `band` | The payoff band: `px` (width at half height), `dur` (seconds to cross), `slant` (how far right it leans per px of drop, so it crosses the lines one after another), `peak` (start and end of the full-strength hold, in seconds), `sheen` (how strongly every facet of the chrome lips answers it, not only the top chamfers) and `bloom` (the lip-only glow radius in px). |
| `drift` | The hold's light on the chrome lips: `from`, `dur`, `amt`, `px`. |
| `beats` | The cut beats. Keep them on the shot cuts. Each beat sets: `at`; `punch` (a transient scale that settles back); `step` (a scale the lockup steps up by and keeps, with back.out(2.6)); `flare` (the white lips, 3 frames); `rake` (the strength of the soft specular band along the top chamfers; its width and duration are in `band`); `slabLag` (how much later STORIES lands, in seconds); and `shake` (amplitude in px). |
| `openOn` | The letter the open flies into (pick one with a thick stem: L, I, H, T, E). |
| `open` | `blurPx` (the zoom-blur streak on the stem's edges), `liftEV` (the 2-frame exposure lift through the stem) and `cover` (the cut comes on the first frame the stem's opening covers this share of the frame width). |
| `timing` | `in`, `stagger`, `open`, `openDur`, `end`. Keep `end` about `open + 1.16`: the cut lands near `open + openDur`, so that leaves a clean tail of about 0.5 s (under 0.6). |

## Letters
- The outlines are pre-traced in `media/glyphs.js`: Archivo wdth 64 / wght 900, A–Z, 0–9 and `.,'!?-&:#`. Other characters render as a space.
- To change the face or weight, run `node media/gen-glyphs.js <wdth> <wght>` (needs `npm i fontkit`) and wrap the JSON as `window.TITLE_GLYPHS = …;`.

## Render
```
cd a && npx hyperframes render . -o title-a.mp4
cd b && npx hyperframes render . -o title-b.mp4
```
The `bg` variable exists for library consistency. As a full component, both values keep the footage.

## Your own clip
1. Drop the file in `a/media/` or `b/media/`.
2. Point the `<video>` `src` at it.
3. Set `data-start`, `data-duration` and `data-media-start` (the in-point). Never run past the clip's length.
4. Mirror the cut times in `CONFIG.shots`.

In B, use the 16:9 (`-h`) shot: each shot is one `<video>` in `#foot` (`#s0`, `#s1`, `#s2`). Set `frame` in `CONFIG.shots` to the point you want at the centre of the window block, and check that both words land on something readable (sky, a skyline, water, a clean hull): a dark car body reads as a hole in the letters, and a busy deck turns SANTOS to noise. If a shot's sun bleaches the letters, give it its own `grade`. Move the `beats` with your cuts. The last shot is the one the letters open onto, so it must run from before `timing.open` to the end. Pick a wide, detailed shot for it, because a 16:9 shot is upscaled to fill 9:16.

## Keywords
title card, title sting, intro, opener, series title, chrome title, 3D metal text, gold bevel, extruded title, footage in text, video in letters, track matte, text mask, zoom through text, logo drop, GTA 5, GTA V, Los Santos, Mount Chiliad mystery
