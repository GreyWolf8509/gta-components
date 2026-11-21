# 53 Freeze-frame intro: decisions

## Evidence
- **yt-c-I-jXpGuOk t00116 (8.1M views, long):** the character intro. The shot holds on the character; "DETECTIVE" in huge heavy
  italic caps, gold-to-cream metallic face, thick black outline, dark extruded shadow; about 90% of the frame width and 22% of its
  height, in the top band (y 2–28%), breaking out over the top letterbox bar; the subject's hat overlaps the bottom of the
  middle letters, so the word sits **behind** his head. A gold ring is added on his prop.
- Neighbours t00108 / t00112 / t00120: plain playing shots either side, letterboxed. So the job is: action plays, holds on the
  character, the name/title slams in big, then the edit carries on.
- Rough parts: flat 2-stop gradient, no light moment, no state change, no designed freeze (it just holds).

## Shots and honesty
- Footage is GTA V (official trailer shots). The character is **Franklin** (`v06-franklin-lamar-portrait`, Franklin and Lamar in
  the hood, bright blue sky: the evidence's daylight look). Lead-in `v05-franklin-lamar-street` (Lamar on the street).
- Role line "THE HUSTLER": generic creator copy, no invented facts.
- Freeze = frame 24 of v06 (media 0.80 s), exported as `media/frz.png` from the same file the clip plays, so the freeze and the
  resume land on the identical frame. The resume clip starts 2 frames early underneath the still (lesson 25), as does every cut.
- Cutout: `npx hyperframes remove-background` on the frame, then `media/prep_freeze.py` (keeps only Franklin: split line along his
  hoodie edge against Lamar and the house wall, largest component, soft edge kept): `subj.png` (warm lift + gold light-wrap on the
  upper edges), `grade.png` (Franklin painted out with cv2.inpaint so the 2.5D parallax never shows a ghost, then the cool steel
  duotone, contrast 1.18, blacks kept), `outline.js` (his contour, split at the crown into two open paths).

## Our upgrade (both)
- **The freeze reads as designed, not as stuck footage:** on the beat a 1-frame-attack exposure hit (`Look.expose`, 2-frame hold)
  and a decaying shake; the world snaps into a cool steel grade as a hard wave front spreading from his face (clip-path circle,
  0.24 s) while he stays in full warm colour; a gold keyline zips down both sides of him from the crown (stroke-dashoffset, 0.36 s);
  through the hold he drifts towards camera faster than the world (2.5D parallax, 1.03 vs 1.01).
- **The name is real 3D** (lesson 24, `media/title3d.js`): Archivo 900 outlines traced with fontkit, italic shear 0.2, extruded
  with a rounded bevel and an oblique drop (the evidence's dark extrusion), two-band chrome gold face (cream sky band, a dark
  horizon line, bright gold ground, deep amber at the baseline) under clearcoat, polished gold bevel lip, extrusion falling to
  dark bronze; HDR bloom; heavy ink outline and contact shadow in post.
- **Slam + lock-in (the payoff state change):** letters slam in from the camera one by one (accelerating, 2-frame squash, damped
  settle); the last landing locks the word: a hot key light rakes across the bevels, a specular band crosses the faces, bloom
  peaks for 3 frames, a small punch.
- **Role plate:** a slanted ink slab in a 4-stop gold bevel frame with a gold end cap, wiped open, words roll up out of a mask
  (back.out), one sheen. Exit: wipes shut.
- **Release:** plate wipes shut, letters flip up and away (staggered), keyline retracts, the grade collapses back into his face,
  and the same shot plays on from the frozen frame.

## A (16:9) "Character freeze"
- Letterbox bars (132 px) slam in on the hit and the frozen frame snaps into them (scale 1.08 from the top edge + 80 px drop, the
  bars always lead so no frame edge shows); the title sits in the top band like the evidence, ~1600 px of ink (83% of the width),
  cap ~245 px (23% of the height), breaking out over the top bar, **behind Franklin's head** (cutout above the title canvas).
  Plate under the title's left end, clear of both faces.
- Times: lead-in 0–0.70, v06 from 0.70, **freeze 1.50**, lock-in 2.015, plate 2.10, release 4.00, resume to 4.80.
- Hero 2.5 s.

## B (9:16) "Freeze for Shorts" (r09: freeze, letterbox band, head through the name, resume)
- Why: r03-r05 boxed the frozen frame in a window over a filler (the -v shot is an upscale, lesson 12/21); r06-r07 made it a print
  on a real 3D photo slab (lesson 24) but the critics read a "profile card". r08 did r07's fix (visible freeze, Franklin breaking
  out above the rim, title across his chest, one light beat, steady bed) and scored 7: the slab still shrank the freeze into a
  gold card on a dark void (~55% dead stage) with the name mid-frame. r09 does the r08 critic's fix: the freeze stays full-bleed,
  the frame becomes a FULL-WIDTH band (v0's letterbox in 9:16), the name goes in the top hook band behind his head, the plate is
  near it and holds 1.3 s+, and the dive overlaps the letters' exit (no empty-card beat).
- **The freeze is a beat you can see:** at 1.50 the shot stops (still frame 24 of v06, exposure hit with a 2-frame hold, decaying
  shake) and HOLDS full-frame for 0.3 s while the world snaps into the cool steel grade from his face out (hard wave front,
  0.26 s) and Franklin stays warm. At 1.80 the frame settles into the band.
- **The band** (`media/slab3d.js`): a 1160 x 780 slab, radius 28, 64 deep + 19 px rounded gold lips; wider than the Short, so its
  gold top and bottom lips come in like letterbox bars while the sides bleed off the frame. Flat at rest (a -0.10 pitch bump only
  during the 0.36 s pull, motion-blurred). The print is the -h frame mapped at 0.92x -> 1.0x (never upscaled), FL [600, 79] so the
  top lip crosses his forehead. Band scale 1.03 -> 1.0 on the lock spring, then pushes 1.0 -> 1.06 through the hold, anchored at
  the top of his head (canvas 560, 486), so the head/name overlap stays put while he grows down into the band.
- **Head through the name:** above the band's top edge his head is a DOM layer (`subj_h.png`, the print's exact mapping as a 2D
  transform, on from the end of the pull to the dive; the WebGL cutout plane carries it during the pull and the dive). The DOM
  head runs down to the band's bottom edge (inside the band it matches the print and keeps the name's drop shadow off him: r09's
  first capture had a seam across his forehead where the title shadow fell on the in-band print); his soft contact shadow
  (`subj_h_contact.png`) lands on the letters above the rim only.
- **Name in the top hook band:** the Three.js gold title, 840 px of ink, cx 504 cy 450, BEHIND his head (it covers the bottom
  ~28% of N-K-L, as the hat covers DETECTIVE in the evidence). Letters drop along their italic slant (`slantPath`), stagger 0.04,
  slamZ 0.05 / slamY 0.6. Role plate as a kicker above the name (top 248), no sheen.
- **Backdrop** (`media/prep_pop.py` -> `back_pop.png`): the Short's framing of the frozen frame in the steel grade, sigma 12, level
  x0.62, contrast 1.15, a warm pool behind the head. Above the band Franklin is filled out (normalized convolution, so the
  breaking-out head never sits over a blurred copy of itself); below it the bed is the frozen frame itself, his body racked out
  (the seam is hidden behind the band), falling towards ink at the bottom (never a black slab). Its level never changes.
- **One light beat (lock-in, ~2.49 s):** the band settles (stiff spring), the sweep crosses the name's bevel in word space, bloom
  held 3 frames, the key swings over the gold lips, Look.expose 1.1 (3-frame hold). No sheen on the print or the plate.
- **Resume:** plate shuts (4.15), letters fly up and away (4.25-4.54), the camera DIVES back into the frame from 4.45 (overlapping
  the exit; 0.267 s, power2.in, motion-blurred; the band lands flat on the exact Short framing), the colour floods back from his
  face and the shot PLAYS ON from the frozen frame (the -h clip through the print, 4.717-5.25), with a small kick on the landing.
  Then the edit cuts to `v39-lowriders-downtown` (wide, sharp; zoom settle).
- Times: freeze 1.50, hold to 1.80, pull 1.80-2.16, slam 2.08, lock-in ~2.49, plate 2.57-4.15, letters out 4.25, dive
  4.45-4.717, play-on to 5.25, cut 5.25, end 5.75. Hero 3.2 s.

## Round log
- r01: first build.
- r02 (v0 locked at 8): B lost the face push (lesson 21, the -v is an upscale), got a jaw-line head occluder over the title, a
  dark contact stroke on the keyline, a bigger plate.
- r03 (v0 locked): B rebuilt as the -h window at 1.0x (above): the r02 critic's top fix. No keyline on B (the window edge and the
  head breaking out do that job).
- r03 result: v0 7 (render unchanged since r01's 8; lock kept), v1 7. Open: role-plate words show for 1-4 frames before the wipe
  (set `.pl-txt span` to yPercent 115 at build, both variants), B's empty stage around the window, no motion blur on the slams.
  Tile: A r01, B r03.
- r04 (second pass): [defect, both] the role-plate words start below their mask (`gsap.set('.pl-txt span', {yPercent: 115})` at
  build), so the wipe never opens on them. [defect, A] matte leak: `a/media/fix_matte.py` cuts the palm frond and the sliver of
  Lamar's tee off the left shoulder (frame y 546-626) and the house's window frame/wall off the right hem (y 738-882) back to the
  measured hoodie edge, then re-traces outline.js with prep_freeze's own tracer (the keyline moves only there). Nothing else in A
  changed. B: the navy stage replaced by the defocused frozen frame (above), the pull-out zoom-blurred, slam/exit motion blur, and
  the release plays on in the 1.0x window instead of the upscaled 9:16 close-up.
- r04 result: v0 8 (defects fixed, lock kept), v1 7: the iris collapsed into a navy disc behind his head, the Short ended boxed
  in the window with a blurred head blob above it, the hold was static, the fill murky, letters crossed in flight.
- r05 (B only; A untouched): the colour returns by fading the grade (no iris); the backdrop is a brighter painted-out plate
  (fill_col.png, no head blob; media/prep_backdrop.py replaces prep_r04.py and fill_v.mp4); a push through the hold (window 1.06,
  Franklin 1.085, about his face, back to 1.0 by the release); his head casts a contact shadow on the name (subj_h_contact.png,
  clipped above the window); letters drop in their own columns (slamZ 0.08, slamY 1.25); the plate drifts 1.03; after 0.12 s
  of play-on in the window it expands (motion-blurred, rules riding out) back to the full-bleed Short. End 4.90.
- r05 result: v0 8, v1 7 (no defects). Hard stop. Open for v1: critics split on the ending (r03/r05: don't end on the upscaled
  9:16 face; r04: return to full bleed) and on the blur-fill band (wants the frozen frame to fill more of the phone frame).
  Tile: A r05, B r05.
- r06 (third pass, B only; A untouched): B rebuilt as the photo slab (above). New files `b/media/slab3d.js`, `prep_slab.py`,
  `slab_frz.png`, `stage.png`; the window/backdrop files of r03-r05 stay on disk but are no longer used.
- r06 result: v0 7 d1, v1 7 d1 (job match "partly"). Defect, both: the title flashes white for one frame ~0.32 s after the
  lock-in (title3d's specular band was computed in letter-local x, so it crossed every letter in the same frame). v1 gaps: a
  gold card on a black void reads as a "player card", not a frozen shot; no resume (cut straight to v39); slab edge at x ~970.
- r07 (B only; a/ left untouched as briefed, so v0's flash stays open, see below):
  - [defect] `b/media/title3d.js`: the band now sweeps in word space (world x, `vWX`), a real rake across the letters, peak 0.6.
  - The whole Short stays the frozen shot: behind the slab is the same frame at the Short's framing (`back_steel.png`: the whole
    frame incl. Franklin in the slab's steel grade via a luma LUT fitted on grade_h, sigma 16 defocus, x0.62, contrast 1.12,
    warm pool, the floor under the name falling to ink). The sharp colour still sits under it and the steel backdrop fades in over
    0.3 s as the print lifts off (a rack-out), so the frame never leaves the screen. The world creeps 1.0 -> 1.05 with the push.
  - The action resumes: on the unfreeze beat (4.10) the colour floods back from his face across the print (second wave front,
    0.24 s) and the backdrop (`back_col.png`), and the print PLAYS ON: the slab face is the live -h clip (#winVid, v06 from media
    0.80, drawn into a canvas texture from the renderer's decoded frame) at 0.89x, sharp, with a 2% kick; 0.36 s later the
    camera rushes through it (and the world rushes with it, 1.05 -> 1.45) into v39 at 4.733. End 5.2 (v39 tail 0.47 s).
  - Slab 856 x 866 at cx 496 (rest yaw -0.22): its right gold side ends ~x 930, inside the 936 line; print scale 0.777 ->
    0.894 (the 1.15x push). Name cx 500, 800 px of ink; plate at 500/1306; plate tracking 0.01em; rake band on the print 0.34.
  - Times: freeze 1.50, pull 1.533-1.95, lock-in 2.275, plate 2.355, plate out 3.68, letters out 3.80, unfreeze 4.10, rush
    4.463-4.733, cut 4.733, end 5.2. Hero 3.0 s.
  - Open: v0 has the same 1-frame title flash (a/media/title3d.js line ~228, `uSpecAmp`); the fix is one line (drop the band or
    sweep it in world x like B), but this pass was briefed not to change v0's render.
- r07 result: v0 8 (locked, render unchanged, SSIM 0.998 vs r06), v1 7, no defects, job match v1 "partly": the critic reads the
  photo slab as a profile card rather than a freeze (Franklin never overlaps the title; the in-slab resume lifts the bed to a grey
  veil; three light beats compete). Hard stop after r07. Every v1 round from r01 to r07 scored 7; tile b stays on r05 (score 7, job match
  "yes", no defects). If v1 is reopened, the next step is the critic's: Franklin's matte breaking above the slab rim, with the title in
  front of his chest.
- r08 (fourth pass):
  - [v0, the one fix the lead approved in a/] `a/media/title3d.js`: the specular band now sweeps in word space (world x, `vWX`, as
    B since r07), peak 0.6. Title-band luma at 2.27-2.43 s is now 162 -> 154 -> 150 -> 148 (r07: 147 -> 178 -> 143, the 1-frame
    flash). Nothing else in a/ changed (SSIM vs r07 0.997).
  - [v1] rebuilt as above: visible freeze hold, pop-out above the rim, title across his chest, one light beat, steady bed, dive
    back into the frame and play-on. New: `b/media/prep_pop.py` -> `back_pop.png`; `slab3d.js` cutout + contact-shadow planes and
    pose-driven FL; `title3d.js` `slantPath`. `frz.png` / `frz_h.png` re-saved without their gAMA/cHRM chunks (Chrome
    colour-managed them 5% darker than the video, a 1-frame dip at the freeze). back_steel/back_col/stage stay on disk, unused.

- r08 result: v0 8 (job match yes), v1 7 (partly), no defects. The critic: v1 shrank the freeze into a gold trading card on a dark
  navy void (~55% dead stage) with the name mid-frame over his chest. Its v1 fixes: keep the freeze full-bleed (the frozen frame
  as the bed, a full-width window whose gold frame bleeds off both sides, push 1.0 -> 1.06); the name in the hook band with his
  head in front of the letters' bottoms; the plate holding 1.3 s+, the dive overlapping the last letter's exit. v0 notes (sticker
  stroke, cam.scale 1.08, plate slant) stay open: v0 is locked.
- r09 (B only; a/ unchanged since r08's fix, SSIM 0.998): B rebuilt as the full-width band (above). Head pop-out moved to a DOM
  layer above the rim (registered to the print), running down to the band's bottom edge so the name's drop shadow never lands on
  him (the first r09 capture had a seam across his forehead there); `prep_pop.py` now shows his racked-out body in the bed below
  the band; `slab3d.js` draws the contact shadow and the cutout in explicit passes after the slab. Plate holds 2.57-4.15, letters
  out 4.25, dive 4.45 (overlapping the exit). No 1-frame luma spikes outside the freeze, lock, dive and cut beats.
- r09 result: v0 8 (yes), v1 7 (job match yes), 1 defect in v1: on the settled hold the name's ink reaches x ~67 and ~950, just
  outside the 72-936 safe zone. Critic's read: the name only reads ~0.95 s after the freeze (the pull runs before the slam), the
  pull shrinks Franklin when he should be pushed in on, and the blurred still under the band reads as the stock canvas-blur Shorts
  look; Lamar's half-face is cut by the band's left edge. Its next steps for v1: slam the name at freeze +0.10 s with the pull
  running alongside (locked by freeze +0.40 s), grow the band to y 470-1480 (about 0.94x, no upscale) with an ink gradient under
  it instead of the blur, shift the -h source ~+140 px in x, cap maxInk so the ink stays inside x 90-920. Hard stop after r09.
  Tiles: a -> r09 (v0 8, the title flash fixed); b stays on r05 (7, job match yes, no defects).
