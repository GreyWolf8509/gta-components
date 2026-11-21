# 12 Punch-in zoom

The snap zoom creators put on a detail or a face to make a point: "look at this", "bro...", a reaction beat. It is used in long-form gameplay (onto the HUD, game text, a vehicle or a face) and in Shorts (stepped meme punch-ins on a character). It is a treatment of the footage itself (`kind: full`), so it always renders with footage.

- **A: Detail punch (16:9, 4.0 s).** One continuous gameplay shot with a sample wanted-level HUD. A focus frame springs onto the stars and locks (white to yellow). The camera punches 1.0 → 1.6 onto the HUD with a real zoom blur, a decaying shake and an exposure hit, while the 5th star ignites. It holds 1.67 s with a slow tracked push, then snaps back.
- **B: Face punch (9:16, 4.0 s).** The Shorts letterbox layout: the 16:9 clip in a band across the middle (1080×909) on true black bars. After a short setup (Franklin on the street), the edit cuts to the reaction shot in the band and holds 5 frames at 1.0. Three stepped punches land on the character's face (1.0 → 1.25 → 1.5 → 1.9), each opening the letterbox a notch (909 → 1000 → 1100 px); the third bursts it to 1728 px (black bars only 96 px), so the letterbox breaks. A payoff word, "BRO?!", slams in with it as real extruded, bevelled caption-yellow letters with an ink outline (Three.js). Each step is a 2-frame snap with zoom blur, a crisp 3-frame shake, an exposure kick and a tightening vignette. The face ends at about 1.6x of the source. The hold runs to the end of the shot, then the band snaps back on the cut to the next shot; the word docks onto the band edge and stomps out.

## CONFIG (top of each `index.html`)

**A**
- `shot.start`, `shot.dur`: the punch shot's place on the timeline. Keep it in step with `<video id="s0">` and the `z1`–`z6` zoom-blur taps.
- `hud`: the sample wanted-level stars (`show`, position, size, `count`, `lit`, and `ignite`, when the last star lights). Set `show:false` to punch on your own clip's detail.
- `track`: the detail's centre in source pixels of the 1920×1080 clip, `[shotTime, x, y]`. The punch follows it.
- `box`: the focus frame size around the detail (source px).
- `punch`: `at` / `back` (times), `scale` (1.6), `drift` (slow push during the hold), `land` (where the detail lands on screen), and the snap timings and overshoot.
- `focus`: when the frame enters (`in`) and locks (`lock`), and the bracket `arm` length.
- `shake`, `light`, `vignette`, `blur` (zoom-blur strength), `sharpen`.

**B**
- `base`: the band scale at 1.0 (0.842 gives a 1080×909 band; 0.5625 would show the whole 16:9 frame). `bandY`: the band's centre line.
- `shots`: each shot's `start` (including a 1-frame pre-roll under the previous shot), `cut` (when it shows), `media` in-point, `ax` (horizontal anchor at 1.0: 0 left, 0.5 centre, 1 right) and face `track` (source px).
- `creep` / `tailCreep`: slow pushes on the setup and tail shots.
- `steps`: `[{at, zoom, band}]`, three by default. `band` is the letterbox height factor after that step (1.10, 1.21, then 1.9 for the burst; capped at the image's full height).
- `push`: the continued push across the hold.
- `snap`: the punch speed and overshoot.
- `out`: the snap-out (lands in the band on the cut to the tail).
- `faceX`: where the face is re-centred.
- `shake` / `vignette` / `light`: one value per step (shake is a crisp 3-frame kick; light is a band-local exposure kick).
- `word`: the payoff word (`text`, `size`, `cx`/`cy` cap centre, extrusion `depth`/`bevel`/`tilt`/`yaw`, `ink` outline, colours), `dock` (where it settles on the snap-out) and `out` (when it stomps out). Glyphs A-Z, 0-9 and `.,'!?-*` are in `media/glyphs.js`.
- `sharpen`: the unsharp pass on the band, from step `from` until the snap-out.
- `blur`: zoom-blur strength.

## Render
```
cd a && npx hyperframes render . -o out.mp4
cd b && npx hyperframes render . -o out.mp4
```
`bg` exists for library consistency. This is a full-frame footage treatment, so `bg:"none"` still renders the footage.

## Use your own clip
1. Replace the `src` of the punch shot and of its zoom-blur taps (A: `s0` and `z1`–`z6`; B: `s1` and `z1`–`z6`, and its `.g1` grade (a light contrast and saturation snap; adjust to taste)). Use a 1080p (or larger) 16:9 clip in B so the face stays near native size.
2. Keep each tap's `data-start` / `data-media-start` offset consistent with its main clip.
3. Scrub your clip, note where the detail or face sits (in source pixels) at a few times, and enter those in `track`.
4. Set `punch.at` / `steps` on your beat.

## Keywords
punch in, punch-in zoom, snap zoom, zoom in on face, meme zoom, stepped zoom, zoom blur, camera shake, focus frame, lock on, reaction zoom, GTA 5, GTA Online, Shorts, TikTok
