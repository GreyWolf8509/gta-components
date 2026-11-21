# 02 End screen: decisions

Both variants are 16:9 1920x1080 (manifest), 30 fps, 8 s (hold set by `CONFIG.timing.hold`), full kind (footage always on). Shared 3D layer: `media/es3d.js`
(identical copy in `a/media` and `b/media`), glyph outlines `media/glyphs.js` (Archivo wdth 64 / wght 900, OFL, fontkit-traced).

## The evidence (what creators ship)
- `yt-Abw3fK1JIRs` t1055 (6.7M): black card, "WATCH THIS" in heavy red italic comic caps across the top (~70% width, ~18% height),
  a red hand-drawn curved arrow with a yellow keyline pointing down-left into the empty tile area, "PLEASE SUBSCRIBE" below.
- `yt-fbS-EgX1qrc` t1430 (6.6M): red bokeh template; a white circle placeholder (subscribe) with a white curved arrow into it,
  "SUBSCRIBE" / "WATCH MORE" labels, two white 16:9 tile placeholders (34% width each).
- `yt-b5XEkjldydc` t968 (15M): hard cut to black, red brush arrow top-right pointing at the subscribe element, "SUBSCRIBE".
- `yt-e2malhQbCUg` t1566 (11.5M): neon-tube frames for two stacked tiles plus a neon circle.
- Motion in the evidence: static or near static, held 15-20 s; at most a drift or a light streak; it ends by going to black.
- The vernacular: **dark card, big italic caps title, a hand-drawn arrow, empty 16:9 slots + a round subscribe slot where
  YouTube drops its elements.** Our job: the same object, built and lit like a premium template.

## Variant A: "Two slots + subscribe"
**Evidence used:** fbS (two 16:9 slots + circle + labels), Abw3 (title + arrow), b5X (arrow toward an element).

**Our upgrade.**
- **Real 3D bezels.** Each slot is a chrome bezel (ExtrudeGeometry rounded rect with a hole, rounded 5-segment bevel, depth 20 px),
  MeshPhysical metal (metalness 1, roughness 0.2, clearcoat 0.5) lit by a PMREM studio (softboxes, hard front strip) + key + hemisphere.
  The screen inside is DOM (framework-owned videos) posed with a CSS 3D transform that matches the WebGL camera exactly, so the
  footage stays pin-sharp (-h shots at 0.4x) and the bezel occludes it correctly through the 3D fly-in.
- **Screens** are dark smoked glass (radial gradient, inner shadow, top reflection) that power on with a vertical open from the
  centre line and a short exposure overshoot local to the screen; a soft clipped sheen crosses them on the payoff.
- **Title:** extruded, bevelled Archivo caps sheared 0.16 into an italic (the evidence's comic-italic energy), candy-red face
  (3-stop gradient, clearcoat) with chrome walls/bevel. Letters stamp in one by one from z +900 with a damped overshoot.
- **Subscribe slot:** the creator's avatar (a crop from the shot library) inside a red clearcoat ring bezel that coin-spins in
  (real thickness, so no paper-thin edge) and then breathes slowly so its highlight walks round the bevel; "SUBSCRIBE" rises under it.
- **Arrow:** a painted brush arrow: tapered shaft polygon along a cubic, painted head, yellow keyline (Abw3), paint gloss streak,
  turbulence-rough edges and a drop shadow; drawn on through a stroke mask, head pops on its base.
- **Bed:** the last shot (v35 penthouse at dusk) racks to a 16 px blur and drops to brightness 0.6 / contrast 1.14 / saturation 1.18
  (keeps its blacks), slow push; a dark radial behind the title.

**Shots.** Bed `v35-penthouse-dusk-h` 0-8 (1.0x). Slot 1: `v57` 1.25-3.28 then `v52` 3.28-8. Slot 2: `v56` 1.35-6.4 then `v54` 6.4-8.

**Payoff (2.1 s, hero 2.6): slot 2 is picked.** The arrow tip lands on its bezel: the slot taps back 16 px, then lifts 40 px toward
camera with overshoot, the bezel turns from chrome to anodised red, a point light rakes across it, a red halo lights behind it, its
screen takes a 3-frame exposure hit and the sheen crosses the glass. Held to 5.7 s.

**Exit (5.72-6.3):** 3D recedes into depth (staggered, power3.in), arrow and label leave with blur, the picture goes to black (the
video is over, as in b5X). 3 frames of black at the end.

## Variant B: "Watch this next"
**Evidence used:** Abw3 (big title, arrow into the slot), fbS (circle + label), b5X.

**Our upgrade.**
- One big slot (984x554 screen, 26 px chrome bezel), swinging in from the left out of depth. It starts **off**: dark glass with a
  faint play glyph.
- Title centred across the top, white enamel face with red metal walls; the keyword NEXT is red with chrome walls.
- The avatar sits in a thicker red ring; a glossy red SUBSCRIBE pill (3-stop gradient, inner top highlight, ink keyline, drop
  shadow) springs onto the ring's base like a badge.
- White painted arrow with a red keyline, from under the title into the slot's right edge.
- Bed: the last gameplay shot (v50) keeps rolling at 1.0x, darkened (brightness 0.46, contrast 1.16) with a slight 3 px defocus
  and a slow drift (push to 1.1, x -46 px). The brief says "frozen-then-drifting"; a frozen frame reads as a defect here, so the
  shot keeps playing under the drift.

**Shots.** Bed `v50-gp-bike-mansion-h` 0-7.1, `v58` 7.1-8. Slot: `v52-gp-police-bridge-h` 2.0-6.7, `v57` 6.7-8.

**Payoff (2.0 s, hero 2.5): the slot powers on.** The arrow lands: the slot taps back 18 px and settles forward, the screen opens
from the centre line with an exposure overshoot, the bezel turns anodised red, the rake light crosses, the halo lights.

## Round log
- r01: first build. Critic 7/7: payoff a soft chrome->red cross-fade (mauve frames, bleached screen), exit tore the title
  apart per letter and the arrow crossed the label, no motion blur on fly-ins, A crammed top-right, B bed murky, hold too short.
- r02:
  - **Payoff = lock-in (both):** the picked bezel snaps chrome -> anodised red on the hit frame (no blend), a 3.5% scale punch
    (2-frame rise, damped spring), and two tight comet bands of hot light race round the bevel from the arrow tip in opposite
    directions and meet on the far side (shader emission on the bezel, clipped to the geometry). The halo bloom snaps on in
    2 frames, holds 3, then settles. In-screen exposure pulses removed (A), B's power-on has no brightness bleach.
  - **Exit (both):** the arrow retracts along its path, then the whole card dollies back on one rigid clock (title letters,
    slots, ring, pill, arrow all share it), into black. No per-letter tilt, nothing crosses.
  - **Motion blur:** the 3D layer renders 16 shutter sub-frames (0.42 frame) during fly-ins and the exit, accumulated in linear
    HDR, then ACES once; DOM screens/avatar get a matching velocity-scaled blur, and each slot's contact shadow tightens as it lands.
  - **A layout:** title x 102 (ink aligns with the slot bezel), ring moved to (1684, 236) with a glossy SUBSCRIBE pill as a
    badge (replaces the plain label), arrow re-drawn so its tail clears the T and the ring; red arrow with a 8 px yellow keyline.
  - **B bed:** 8 px defocus, brightness .45, 0.7 vignette, push anchored left (1.14 -> 1.2) so the source's right-edge HUD
    stays cropped; cut to v58 for the last 0.9 s (inside the fade to black).
  - **Runtime:** 8 s (hold ~4.4 s settled), `CONFIG.timing.hold` drives the exit and end.
  - Arrow: smoother width profile (10/36/30), soft gloss band instead of a thin specular line.
- r02 critic 8/8, no defects: PASSED (sticky). Both variants locked.
