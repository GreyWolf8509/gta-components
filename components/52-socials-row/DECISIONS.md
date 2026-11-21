# 52 Socials row: decisions

## Evidence
- **yt-fbS-EgX1qrc t01422 (6.6M views, long):** the end tag. "THE END" in a red rounded tag (about 18% x 7% of frame), with a row of four app icons, each about 10% of frame height, bottom-centre (x 28-72%), over the final aircraft-in-the-clouds shot. Static stock icons and a default serif.
- **yt-eT7H9BAUPQw t00786 (3.1M, long):** handle tags in both top corners. Each is a gradient glyph tile next to a white rectangular label with black bold sans text (about 4% of frame height), no rounding, static.
- **yt-N47a2XeDe44 t01198 (2.9M, long):** "FOLLOW US ON INSTAGRAM! @REDARCADE": small caps above a heavy gradient handle with an orange glow, fading in on black.
- The job is the follow ask: the creator's marks plus handle, at the end of a video or pinned in a Short's corners. The neighbouring frames show no motion beyond cuts and fades.

## Shared upgrade: the marks are real objects (Three.js, `media/social3d.js` + `media/marks.js`, identical copies in a/ and b/)
- **Our own marks only** (`marks.js`): a rounded play triangle, a solid camera with a viewfinder hump and lens ring, a perched songbird, and beamed eighth notes. None of them is a platform logo. They're drawn as polygons in a 100-unit box and optically centred.
- **Tile:** a rounded square (r = 0.26 S), extruded 0.16 S, with a 7-segment rounded bevel and smoothed bevel normals, so it reads as one curve rather than facets. It's candy lacquer: a vertical two-tone gradient in vertex colours, clearcoat 1 / 0.05, and walls 18% deeper.
- **Mark:** extruded 0.042 S in glossy white, bevelled, and seated on the face. It casts a baked, blurred contact shadow down-right on the lacquer.
- **Shadows:** each object casts a soft blob shadow on the "screen" behind it.
- **Light:** a PMREM studio (softbox above, a hard strip in front for the bevel line, side strips), a warm key, a hemisphere fill and ACES. A raking point light and an emissive "/" specular band sweep left to right at the payoff, clipped to the geometry. The 3D canvas only gets a 3-frame exposure peak (+16-20%), not the footage.
- **Rendering:** shutter-sampled motion blur (5 sub-frames, 1/60 s) during fast moves. Everything renders from timeline time (`Look.drive` + `hf-seek`), with no RAF.

## Variant A: THE END + socials (16:9)
- **Placement:** a lockup in the lower-middle of the end shot.
  - THE END slab: 548 x 134, top at y 498.
  - Tile row: 4 x 150 px tiles at a 204 px pitch, centre y 762, spanning x 579-1341. That's bigger tiles than the evidence's 108 px icons, in the same bottom-centre band.
  - @everestchris6 under the row: Inter 800, 60 px, centre y 912.
- **THE END:** a red lacquer slab (#FF4F59 -> #C8102E) with extruded, bevelled white Archivo 900 letters (cap 70 px, from fontkit outlines). It's our type, not a serif or Pricedown.
- **Shots:** v29 plane over clouds (the evidence's final-aircraft shot, in-point 0.25 s past its dissolve) -> v07 biplane sunset -> v36 hills/city -> v44 bridge skyline. All play at 1.0x, and each incoming clip starts 2 frames early under the outgoing one. Total 6.6 s.
- **Motion:**
  - 0.20 s: the slab swings down on its top hinge. It's a damped pendulum (-72° -> overshoot -> 0) while it drops 150 px and scales from 0.78.
  - 0.72-1.08 s: the tiles pop in one by one. Each does a half-turn spin, a spring scale with about 15% overshoot, and a rise from 70 px below.
  - 1.22 s: the handle's characters rise out of their line (back.out), with a short vertical smear.
  - **Payoff, 2.0-2.6 s (hero 2.3):** a hop wave runs left to right, 0.09 s apart. Each tile rises 36 px with a 6% stretch and a twist into the light, falls, lands with a 3-frame squash (sx 1.08 / sy 0.89) and rebounds 7 px. One raking light travels with the wave: a specular line strongest on the bevels, plus a grazing point light. It's over each tile at the top of its hop, catches the slab's top edge, then runs along the handle's satin face. The 3D gets a 3-frame exposure peak.
  - Hold to 5.65 s, with a slow idle float (±4 px, ±3-5°) so the lacquer keeps a moving highlight.
  - Exit: the tiles spin edge-on and shrink, last first. The slab swings back up and collapses. The characters drop into their line. The tail is 0.45 s.

## Variant B: Corner handles (9:16)
- **Placement (r04, phone-first, seated):** two stacked tags hanging from the top of the safe zone.
  - [tile][plate] sits in the top-left corner: tile x 76-226, y 236-386. A mirrored [plate][tile] sits against the right edge directly under it: tile x 782-932, its plate one 22 px gap below the left plate (y 393-513).
  - Each tag is 690 px wide (64% of the frame). The right tile clears the left tag's end (x 766), so the two read as one compact block at y 236-528 instead of a floating second tag.
  - Tile 150 px, plate 120 px tall. Handle: Archivo 800 at 66% width, auto-fit to the plate (about 86 px), so it reads at 360x640.
- **Each tag:** a 3D lacquer tile (pink camera left, ink music note right) and a real enamel plate (Three.js slab: 14 px deep, a fat 15 px rounded bevel, pillow clearcoat, PMREM studio). The plate is clipped at a line that tracks the tile's current edge and slides out from behind the tile; its DOM handle is clipped at the tile's edge.
  - White state: the enamel carries its own normal-weighted glow, so the face reads white, not grey, while the lower bevel stays shaded. A baked contact shadow darkens the plate where it tucks under the tile.
- **Camera:** one canvas with its axis between the tags (FOV 11), so the tiles read square-on.
- **Shots:** v44 bridge skyline -> v17 deluxo sunset (the payoff lands on this cut) -> v29 plane over clouds -> v11 yacht. 1.0x, with 2-frame overlaps.
- **Motion:**
  - 0.20 s / 0.34 s: each tile falls in from above the frame with a part turn into the light, lands with a 2-frame squash and a small bounce. The plate and handle ride the same drop offset, so the parked plate never peeks out above a settling tile.
  - +0.36 s: the plate and handle slide out from behind the tile (expo.out, 0.5 s), 16-sample shutter blur.
  - **Payoff, one beat on the 1.73 cut (hero 2.15): press -> flood -> lock.**
    - Each tile is pressed just before (scale 0.83, held 3 frames, back.out(2.6) release); its mark switches on (a 3-frame flare) and stays lit. The press stays in front of the plate (only 8 px in z).
    - As the tile springs back, its colour floods the plate from the tile outwards in 0.26 s (power2.out): white enamel -> pink lacquer (left) / blue lacquer (right). The left flood is already a quarter of the way out on the cut frame, so the colour change IS the cut; the right follows 0.1 s later.
    - The front is one hard edge, posed at the frame time (never smeared across shutter sub-frames), with a thin 3.5 px light line just behind it, strongest on the bevels. The handle flips from ink to white at exactly that x (two DOM layers clipped at the same line, no overlap, no fade), and the @ turns gold (#FFD84A).
    - The tag then locks in: a 1 -> 1.045 -> 1 pop about the tile centre, a 3-frame warm bloom on every bevel (tiles, marks, plates), and a 3-frame +16% exposure peak on the 3D.
  - **Dock, 3.0-3.38 s:** both tags spring (back.out(1.4)) back into their corners at 0.76 scale: the top tag about its top-left corner, the lower one about its right edge, rising so the stack stays one gap apart. Handle about 65 px, tags about 525 px wide, so y 460-620 is free for a hook title.
  - Hold quietly to 5.05 s, with only a +-2-3 degree tilt on the tiles.
  - Exit: the plates retract into the tiles (power2.in, 0.32 s, 16-sample shutter, so the last frames are one smooth smear, never stepped copies), then the tiles quarter-turn and lift out. Everything is gone by about 5.77 s.

## Round log
- r01: first build.
  - The rounded rects are explicit point loops. With `absarc`, the duplicate end point spiked the bevel into a sliver off the corner.
  - The camera near/far range is tight around the stage. With a loose range, the MSAA depth let back faces ghost through the front.
  - The payoff light moved onto the bevels (normal-weighted band, grazing rake). A point light in front of the faces had washed whole tiles pale.
  - A's press wave became a hop wave, because a z-press doesn't read at phone size.
  - B's plate sits at z -15, so a pressed tile never sinks behind it.
- r02, from the r01 critique (7/7, no defects):
  - **Both, material:**
    - The lacquer has a real reflection now. Tile, slab and plate caps carry a pillow clearcoat normal map (a gentle dome), so each flat face mirrors a soft gradient of the PMREM studio. Roughness is 0.16; cap clearcoat roughness is 0.15 so reflections stay soft gloss rather than hairlines.
    - The payoff band is a crisp specular line: uBandW 7 on A, 18 on B, with face weight 0.45. It's masked to front faces and top and side bevels, with nothing on bottom bevels, so there's no milky spill under the slab.
    - Contact shadows exist only within about 38 px of rest and while the slab isn't swinging, so no grey blob gets dragged across the sky.
  - **A, payoff as a state change:**
    - Press, pressed, released: the 3D light line crosses the row L->R, 0.12 s per tile. Each tile is pressed as the line reaches it: scale 0.92, sy 0.9, 14 px in, held 3 frames, then a back.out(2.4) release.
    - Its mark switches on, from soft white to lit white with a 3-frame flare, and stays lit.
    - The handle locks in on the 3.13 s cut: a scale punch 1.0 -> 1.07 -> 1.0 (back.out(2.2)), the @ flares for 3 frames, and the light runs along the satin face.
    - The payoff moved from 2.0 to 2.55 s. THE END's letter faces are brighter (#EEF1F6 -> #FFF, glow 0.2).
  - **B, phone-first:**
    - The tile grew 116 -> 132 px, the plate 84 -> 98 px, and the handle about 42 -> 58 px (Archivo 800, 70%).
    - The two tags no longer fit side by side, so they step down: [tile][plate] hugs the top-left (y 246), and a mirrored [plate][tile] hugs the right edge (y 404). Both stay inside x 72-936.
    - The payoff is a visible press as the band reaches each tile (same press curve as A).
    - The plate is a cooler enamel (#FBFCFE -> #D8DDE6, pillow clearcoat, 9 px bevel), with a 3.2x face weight, so the light visibly crosses the label.
    - The drop uses 9 shutter sub-frames.
- r03, from the r02 critique (v0 8, locked and untouched; v1 7, no defects). B only; `b/media/social3d.js` now differs from A's copy only in exposing the plate's cap material (`capM`).
  - Tags scaled up per lesson 26: tile 132 -> 168, plate 98 -> 124, handle about 58 -> 76 px, tag width about 47% -> 73% of the frame. The right tag steps down to y 450.
  - The payoff is now readable at phone size: a deep press, a lit mark, a tag pop and a plate bloom (above). The band is a crisp 12-px glint posed at frame time; at 40 px it smeared into a wash on the dark tile.
  - The drop turns 108 degrees instead of a full turn, so the dark tile no longer smears into a grey blob. The exit starts at 5.15 and ends by 5.87.
- r03 verdict: v0 8 (locked), v1 7, no defects. Round budget spent. v1's open notes: the plates read as flat light-grey chips at 360x640, the press still reads small at phone size, the right tag floats rather than sitting in a corner, and the plate retract shows a one-frame stepped ghost of its edge.
- r04 (B only; v0 locked and untouched; `b/media/social3d.js` now also has a fillable plate and `clipAt`, A's copy is unchanged), from the r03 critique:
  - **Plates are material objects now,** not chips. A fatter rounded bevel and depth; the white enamel glows so it reads white rather than #E3 grey; and the payoff turns each plate into coloured lacquer, which shows the studio reflections far more than white does.
  - **One bold state change:** the press floods the tile's colour into the plate and flips the handle to white. At 360x640 the whole tag visibly switches on, rather than a 2 px dip.
  - **Seated:** the right tag tucks one 22 px gap under the left one (the r03 gap was 80 px between plates), and each tag is 690 px wide, so the pair is one block in the top band.
  - **Ghost killed:** the retract is power2.in instead of expo.in, rendered with 16 shutter sub-frames (checked frame by frame from 5.05 to 5.9 s). Entrance slides also use 16.
  - The plate's clip line tracks the pressed tile's edge, so the press never uncovers the plate's parked root.
- r04 verdict: v0 8 (locked), v1 7, no defects. Open notes on v1: the fill front was a ~60 px milky feathered band that washed letters out for 3-5 frames; no light at the lock; the change landed ~0.15 s after the cut; the tags never docked.
- r05 (B only, last round), from the r04 critique:
  - The flood front is posed at frame time with a 1.5 px soft edge and a thin light line, so it is one hard edge, and the ink -> white flip happens exactly at it (no white-on-white letters).
  - The beat moved onto the cut (the flood is a quarter out on the 1.73 frame), and the lock now has light: a 3-frame bevel bloom on tiles, marks and plates (the shared band uniforms, infinitely wide, bevel-weighted).
  - The tags dock to 0.76 in their corners at 3.0 s, so they get out of the hook zone after the read (lesson 7).
  - The lit @ is gold on both plates, for contrast at phone size.
  - Fixed during self-review: the pressed tile was sinking 34 px in z with its bottom tipped back, so the plate's front face (z -15) occluded its lower corner; now 8 px. The plate's clip line sits 45% in from the tile's current edge, clear of its rounded corners.
- r05 verdict: v0 8, v1 8, no defects. STATUS: PASSED (sticky). tile.json: b -> r05 (overlay, crop pinned to the settled two-tag block).
