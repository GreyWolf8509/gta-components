# 53 Freeze-frame intro

The character intro creators cut into GTA videos: the action **freezes on a beat**, the character is called out with a big
metallic name and a role line, and the footage plays on from the same frame. Full kind: it is a treatment of your footage.

- **A, Character freeze (16:9, long-form):** letterbox bars slam in, the frame snaps into them, the world drops into a cool steel
  grade while the character stays warm with a gold light-wrap and keyline, a real 3D gold name slams in across the top band
  **behind his head**, locks in with a raking light, and a role plate wipes in. Then it all releases and the shot resumes.
- **B, Freeze for Shorts (9:16):** the same freeze phone-first. On the beat the shot stops and visibly holds full-frame (exposure
  hit, shake) while the world snaps into the steel grade from his face out; then the frozen frame settles into a **full-width
  frozen band**: a print on a real 3D slab (Three.js: rounded, a 19 px rounded gold lip, polished gold sides, a clearcoat face)
  wider than the Short, so its gold lips come in from the top and bottom like letterbox bars while the sides bleed off the frame,
  with the same frozen frame racked out above and below it. **His head breaks up out of the band's top edge**, his 3D gold name
  slams into the top hook band **behind his head** (his head covers the letters' bottoms) with the role plate above it as a kicker,
  and on the last landing the band settles while one light sweep crosses the name's bevel. The band pushes 1.15x in on him through
  the hold (mapped from the landscape frame at 0.92x -> 1.0x, never upscaled). Release: plate shuts, letters fly up and away, the
  camera **dives back into the frame**, the colour floods back from his face and **the shot plays on** from the frozen frame, then
  the edit cuts to the next shot.

## CONFIG
- `name`: the 3D title (A–Z, 0–9 and `. , ' ! ? - & : #`); `roleKicker` (gold) + `role` (white): the plate.
- `freeze.at` / `freeze.release` / `freeze.end` (A): the freeze window and the end (s). B: `freeze.at`, `pull`, `unfreeze`, `cut`, `end`.
- `face` (A): the face position on the still (the grade wave origin).
- A `cam` (letterbox snap: scale, drop, creep). B `freeze` also has `pull` (when the frame lifts off), `unfreeze` (the dive back)
  and `cut` (the next shot). B `slab`: `K` (how much the 9:16 shot is scaled from the 16:9 one), `size`, `radius`, `depth`,
  `bevel` (slab px), `F` (his face in the 16:9 frame), `FL` (where it sits on the slab at rest: its y sets how far his head breaks
  out above the top rim), `s0`/`s1` (print scale at rest and at the end of the push; keep `s1` <= 1), `head` (canvas x/y where the
  top of his head is anchored), `sig0` (band scale before the lock-in spring) and `push` (band scale at the end of the hold),
  `pull` and `dive` durations, `shadowOff` (slab shadow), `popShadow` (his contact shadow), gold `colors`.
- `title`: centre `cx`/`cy`, `maxInk` (px of ink), `depth`, `bevel`, `shear` (italic), `tilt`, `ink` (outline px), `colors`.
- `timing`: slam delay, stagger, slam duration, rake duration, plate delay after the lock-in; B also `plateOut` and `lettersOut`.

## Render
```
cd a && npx hyperframes render . -o out.mp4
cd b && npx hyperframes render . -o out.mp4
```
(`bg` is accepted but a full-kind component always shows footage.)

## Use your own clip
1. Point the three `<video>` tags at your clips: the lead-in, then your character clip twice (once up to the freeze, once from
   it). Keep the 2-frame overlaps: the incoming clip starts 2 frames early with its `data-media-start` 2 frames earlier.
2. Export the freeze frame from the same file: `ffmpeg -i clip.mp4 -vf "select=eq(n\,N)" -frames:v 1 media/frz.png`
   (N = freeze media time x 30), and set `freeze.at` to where that frame plays.
3. Cut him out: `npx hyperframes remove-background media/frz.png -o cut.png`, then
   `/usr/bin/python3 media/prep_freeze.py . cut.png` (writes `subj.png`, `grade.png`, `outline.js`). If the model also took
   someone next to him, add a split line in `prep_freeze.py` like the `franklin-a` one; for small leaks along his edge, cut them
   back locally like `a/media/fix_matte.py` does (it re-traces the keyline).
4. Set `face` (A), and move `title.cy` so his head overlaps the bottom of the name.
5. B prints the 16:9 version of the same frame on its slab: export that frame to `b/media/frz_h.png`, run `prep_freeze.py` on it
   with `DECON=1 WRAP=0.36 ERO=6` into a scratch folder, copy its `subj.png`/`grade.png` to `b/media/subj_h.png`/`grade_h.png`,
   then `/usr/bin/python3 media/prep_slab.py . <K>` (the frozen look `slab_frz.png`), `/usr/bin/python3 media/prep_window.py .`
   (his contact shadow `subj_h_shadow.png`) and `/usr/bin/python3 media/prep_pop.py . <K>` (the backdrop `back_pop.png`, the frozen
   frame racked out with him filled out). Save PNGs without gAMA/cHRM chunks (Chrome colour-manages them darker than the video).
   Point `#winVid` (the 16:9 clip that plays on after the dive) at the same frame time. Measure `slab.K` for your crop (here x
   1015-1622 of the 16:9 frame), set `slab.F` to his face in the 16:9 frame and `slab.FL` so the top rim crosses his forehead
   (his head breaks out above it); keep the print covered: `FL.y + s0 x (1080 - F.y) >= size.y - bevel`. The DOM head layer
   (`#headImg` = `subj_h.png`, `#headSh` = `subj_h_contact.png`) follows the band automatically. Point `shotC` at the shot
   the edit cuts to after the resume.
6. Other lettering widths: `NODE_PATH=<fontkit> AXES='{"wght":900,"wdth":80}' node media/gen-glyphs.js > media/glyphs.js`.

Keywords: freeze frame, frozen band, letterbox, photo slab, print, pop-out, out of bounds, 3D card, zoom blur, zoom-through, character intro, name intro, freeze-frame title, "that's me" freeze, record scratch intro, 3D gold
title, cutout, keyline, letterbox, GTA 5, GTA V, Franklin.
