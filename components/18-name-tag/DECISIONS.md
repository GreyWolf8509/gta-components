# 18 Name tag: decisions

## Evidence (what top creators ship)
- **yt-yytJ8ECir_M t00009 (79.6M views, Short):** the character's name in pastel bold italic with a thick black stroke and a hard grey offset shadow, no box, centred about 10% from the top; one colour per character; it hard-cuts to the next name on each character change. Static.
- **yt-o4nNjj44d4M t00295 (3.8M, long):** small rounded pills tracked above NPC heads (red HOTHEAD with white caps, white CALM with dark text), a pink outer glow, about 12% of frame width; they pop above the head and follow the character.
- **yt-_GUWVk2sbGE t00592 (3.1M, long):** player POV name, condensed heavy caps, about 9% of frame height, thick black outline, one fill colour per player (red / green / pink / cyan), top-left, hard swap on the POV cut.
- **yt-N47a2XeDe44 t00012 (2.9M, long):** gamertag credit strip top-left, dark translucent bar with an icon and condensed caps.
- Common job: say who this is, in that person's colour, sitting on or next to them. Rough execution: flat fills, default fonts, static or hard-cut, no light or depth.

## Variant A: Player tags (16:9)
- **Evidence match:** three pills tracked over three players' heads (o4nNjj44d4M), one colour per player (_GUWVk2sbGE palette: cyan / red / purple), white heavy caps with a thick ink outline (yytJ8ECir_M, _GUWVk2sbGE).
- **Shot:** `v49-gp-franklin-mural` (4.3 s gameplay, one continuous shot, HUD visible): Franklin walking past the Families mural plus two homies (plaid shirt, BMX). One long shot so the tags really track; heads tracked with OpenCV template matching (`a/media/track_heads.py` -> `a/media/tracks.js`), smoothed.
- **Our upgrade:** each tag is real Three.js geometry: an extruded, bevelled enamel capsule (clearcoat over a PMREM studio env, key + hemisphere light, face gradient, a soft top gloss band, a darker coloured underside that shows because the tag leans back 0.42 rad), a pointer tail, and a dark glossy rank puck set into its left end, right over the pointer. Names (Archivo 900 at 66% width, white with a 3.5 px ink outline) and ranks (Inter 800 tabular) are DOM pinned to the face with a matching orthographic CSS transform.
- **Physics:** pin drop (scale spring with overshoot, 64 px fall, a flip from edge-on into the resting tilt), the plate unfolds to the right from the puck with a 12% overshoot while the name rolls up out of a mask; a sine bob, a lean from the head's horizontal velocity (inertia), a slow turn by screen position, a depth scale (far players 0.84 -> 0.92).
- **Payoff (state change), 1.06-1.50 s:** the tags arrive in charcoal enamel; one light front runs left to right across the frame and lights each tag up in its player's colour as it passes, with a hot white edge, a 2-frame squash and damped wobble, a coloured halo bloom (3-frame peak) and a soft specular rake right after.
- **Exit 3.80-4.22:** name rolls down, plate folds back into the pin, the pin pops up 8% and shrinks into its tip (staggered). Cut on zero; 0.03 s of tail.
- **Hero:** 2.0 s.

## Variant B: Character intro (9:16)
- **Evidence match:** the big boxless character name above the character, heavy caps, thick black outline, one colour per character (yytJ8ECir_M, _GUWVk2sbGE), plus the brief's role line and freeze-tint.
- **Shot:** `v31-red-car-sunset-v` (Franklin at the wheel, looks into camera at 0.9 s). Franklin really is the crew's driver, so "THE GETAWAY DRIVER" is honest. Freeze frame = `b/media/freeze-v31.png` (frame 27 of the same clip, lightly unsharp-masked); the clip resumes from that exact media time.
- **Our upgrade:** the name is real geometry (adapted from the passing 03-word-captions payoff module): Archivo 900/64 outlines extruded 30 px with a 6.5 px rounded bevel, lands in white enamel and ignites into candy green (GTA V's Franklin colour) behind a feathered light front with a hot edge, a key light raking across the bevels, one soft specular sweep, HDR bloom, the vernacular ink outline around face + extrusion and a soft contact shade. A glossy ink role chip with a green rim, pip, gloss and one sheen, wiped open from the left, text rolling up; a green pointer tail drops to his head.
- **Freeze-tint:** 0.07 s punch-in (1.025 -> 1.085), small shake, 0.12 s RGB split at 4 px, and a duotone (Franklin green, contrast lifted, blacks kept) that spreads out from his face as a wave front; his face keeps a soft natural hole (lesson 16: colour around the head, never over the face). On release the wave recedes into him and the clip plays on with a push back to 1.0.
- **Payoff:** 1.24 s ignition (white -> green) after the 0.96 s slam; held until 3.64.
- **Exit 3.64-3.92:** chip wipes shut, tail retracts, the name pops up 5% and collapses down into the tail tip with a vertical smear.
- **Hero:** 2.2 s.

## Round 1
- First build of both variants as above.

## Round 2 (v1 only; v0 is locked at 8 and untouched)
Critic r01 gave v1 7: the 3D name was premium, the frame around it wasn't. Changes:
- **Real matte instead of the soft oval.** `b/media/freeze-v31-cut.png` is now a head-and-shoulders matte: the model head cutout (thresholded, holes filled) united with a neck / collar / shoulder silhouette that follows the shirt collar and stops on the window sill, feathered about 6 px. A green rim (#38E07B, about 24 px, screen) sits behind the head only (`b/media/freeze-v31-rim.png`). Lesson 16: colour behind the head, face natural.
- **Lifted duotone bed.** Shadows land on #0A3A1E instead of near-black, a gentler linear stage (1.45 / -0.08), the vignette cut from 0.55 to 0.3. The lower half of the freeze is now a readable mid green with the car's shapes, not mud.
- **Lock-in payoff with physics.** Ignite at 1.16 s, the front completes at 1.36 s and the name locks in: a 0.09 damped scale punch (about 1 -> 1.06 -> 0.98 -> 1), `Look.impact` (flash 0), and Name3D's bloom peaks on that frame with the bloom threshold dropped so the lit bevels flare, held 3 frames, plus a key-light kick.
- **Role plate is now green enamel** in Franklin's colour (#5AF094 -> #2BD46C -> #0E7A3A), a lit 2 px top rim, a dark bottom bevel, a 6 px extruded side and the same 6 px ink keyline as the 3D name; white Inter 800 at 0.08em. The dark capsule and its status pip are gone. The tail got the ink keyline too.
- **Release and ending.** The freeze no longer recedes back into a live face close-up (that was the one-frame green ring and the soft upscaled ending, lesson 21). The tag exits at 3.06 s (plate wipes shut, tail retracts, the name pops 5% and collapses into the tail tip), the frozen frame whips out left (0.12 s, push 1.1 -> 1.32, 10 px horizontal directional blur, the collapsing tag rides it) and the edit lands at 3.34 s on the getaway: `v17-deluxo-sunset` (sports car pulling away from explosions, a wide vehicle shot) entering from the right with the same blur. 4.0 s total; 0.66 s footage-only tail.
- **Hero:** 2.0 s (the settled tag over the matte).
