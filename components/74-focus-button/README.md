# 74 Focus button

The ability-handoff object of a GTA VI vs RDR2 comparison: two named coins, **EAGLE EYE** and **DEAD EYE** (RDR2 oxblood), slide in, merge into one **FOCUS** button (GTA VI pink) in a gunmetal bezel, and the button presses on the cue word, lights its ring while held, and springs back. A creator uses it in a comparison or "what carries over" segment, long-form (A, 16:9) or Shorts (B, 9:16, the button at ~60% of frame width).

The coins and the button are real Three.js geometry (lathed discs with a bevelled rim and a machined face groove, clearcoat material, PMREM environment, key + hemisphere + rim light, real shadows, ACES). Labels are crisp DOM in Oswald, pinned to the projected faces every frame. Everything renders from the timeline through a GSAP proxy and `hf-seek`, so any frame is a pure function of time.

## CONFIG (top of each `index.html`)

| Field | What it is |
|---|---|
| `labels.a`, `labels.b`, `labels.f` | the two coin labels and the button word (two-word labels break after the first word) |
| `colors.a`, `colors.b`, `colors.f`, `colors.bezel`, `colors.ring` | coin colours, button colour, bezel, the lit ring while pressed (values are pre-ACES, keep them a touch deeper than the brand hex) |
| `beats.t1` | coins in (the second coin follows 0.28 s later) |
| `beats.t2` | merge (the coins slide together over 0.3 s; the button springs at t2 + 0.27) |
| `beats.t3` | press (the payoff: 0.08 s travel, 2-frame squash, specular rake, 3-frame glow, 1-frame kick) |
| `beats.t4` | release (the cap springs back up, the ring goes out) |
| `beats.exit`, `beats.end` | collapse exit and composition end |
| `pos.x`, `pos.y` | screen centre of the button |
| `size.*` | coin radius/height, coin spacing, button radius, cap height, bezel, press travel, camera elevation and FOV (world units = screen px at the button plane) |
| `type.coin`, `type.btn` | label sizes in px (36 px floor at 1080p) |

## Render

```
cd a && npx hyperframes@0.9.72 render . --variables '{"bg":"plate"}' -o out.mp4
cd b && npx hyperframes@0.9.72 render . --variables '{"bg":"plate"}' -o out.mp4
```

Full-kind component: `bg:none` keeps the footage.

## Your own clip

Replace the `<video class="clip shot">` `src` (A: `assets/clips/…`, B: `media/clips/…`) with your clip and keep `data-duration` at or under its length. In B, `object-position` on `.shot` chooses which part of a 16:9 clip the 9:16 crop keeps. The font lives in `media/fonts/Oswald-wght.ttf` (OFL).

## Keywords

focus button, dead eye, eagle eye, ability, comparison, GTA 6 vs RDR2, press, 3D button, coin, handoff
