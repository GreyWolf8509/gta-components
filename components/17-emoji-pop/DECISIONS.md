# 17 Emoji pop: decisions

## Variant A: "Skull pop" (16:9, 1920x1080)

**Evidence.** The top frame (yt-Knl2mNkODsk t21, 18.8M views) is a glossy 3D white skull emoji (Telegram / Apple animated
style), winking with its jaw open laughing, about a third of the frame wide, sitting right next to / over the subject, no
outline, no box. yt-c-I-jXpGuOk t4 (long-form) is the same vernacular at 16:9: a 3D emoji about 10% of frame width,
right of centre, beside the subject's hands, popped in for one beat. yt-5zKoq7EabvQ t773 tags a 3D emoji onto a moment.
Job: a reaction sticker that pops on the beat ("I'm dead"), holds for a second or two, and leaves.

**Our upgrade.** The skull is real Three.js geometry, not a PNG:
- cranium: a dense icosphere (about 100k verts) shaped wide at the brow and narrow at the maxilla; the eye sockets and nose
  are real dents displaced from a painted height map (so the rims catch light and the sockets hold shadow), coloured from
  the same painted map (bone with warm-grey AO, near-black sockets);
- separate glossy capsule teeth on an arc, a hinged mandible with its own lower teeth, and a dark mouth cavity behind;
- MeshPhysicalMaterial bone: satin base (roughness 0.42) under a hard clearcoat that reflects a PMREM studio (top softbox,
  side strip), key + hemisphere + warm rim, ACES; a soft VSM shadow cast onto a plane behind, so it sits over the shot;
- HDR bloom on the clearcoat speculars, and sub-frame motion blur (6-sample accumulation) on every fast move.

**State change / payoff (0.85 s).** Pops in closed-mouthed (0.45 s, stretch on the way up, squash on landing, a 3D turn into
frame), then the jaw snaps open, the right socket squeezes into a wink, and the key light rakes across the cranium with a rim
pulse. It laughs (jaw chatter 4 beats with a head bob and tilt), then anticipates, hops and tumbles out of frame under gravity.

**Shots (r03).** One Franklin scene: v06 lead-in (0-0.4), v03 Franklin gesturing (0.4-1.6, the pop lands on the 0.40 cut,
payoff 0.7), v31 red car at sunset (1.6-3.26, second laugh snap on the cut, out 2.75), back to v06 (3.26-4.0, Lamar stays
right of x 700). The skull sits upper-left, clear of every face, ~370 px wide.

## Variant B: "Emoji burst" (9:16, 1080x1920)

**Evidence.** Same vernacular in Shorts: the skull frame is 9:16, the emoji sits over the subject's chest at ~33% of frame
width, mid-lower frame (y 53-80%). Creators drop the crying-laughing face the same way, often in a cluster.

**Our upgrade (r04).** Our own tears-of-joy face in real 3D, sized phone-first (lesson 26): the hero face is 600 px wide
(56% of the frame, ~84% with its tears), so it reads at 360x640. A golden clearcoat sphere (top-lit yellow to orange, warm
edge falloff and a faint warm emissive so the shaded half never goes olive), raised closed-eye arcs, a recessed mouth with
a teeth band and tongue (painted + displaced), glossy 3D glass teardrops. Lit for the shot: warm key, warm carpet bounce,
and the arcade's magenta-red neon (#FF4F7A) from screen-left as a rim light plus a fresnel edge on the faces' left side
(computed from the smooth sphere normal, so the raised eyes and lips never catch it).

**State change / payoff (one beat, 0.74 s).** The hero pops in at 0.40 GRINNING (closed toothy smile, no tears) with
stretch / squash and a spin-in under motion blur, holds the grin ~0.2 s, squashes in anticipation, then BURSTS into the
laugh: the mouth snaps open (painted + displaced mouth re-built per frame over 3 frames), the tears squirt out (back.out),
8 glass droplets fly, the magenta edge and key flare and bloom held 3 frames, and ONE shockwave rolls out from behind the
face: a tilted band of light (hot gold-white front, short magenta wake), 0.95 -> 1.7x the face in 0.34 s, thinning and
dimming together to zero (premultiplied, mostly additive, so it never darkens the plate or blinks off). The two small
faces land TOGETHER at 1.08 as the echo, with a squash and a tear spurt and no ring. All three laugh in bounce; exits are
staggered so no falling face crosses another (lower-right 2.72, hero 2.84, upper-left 3.0), gone by 3.8.

**Shots.** One continuous shot, v35-v penthouse at dusk (media 0.2-4.2): the man in orange seen from behind; the hero sits
on his back under his head, the echo faces upper-left over the arcade cabinets and lower-right on his jacket. No face is
covered. Settled hold inside x 82-931, y 670-1460.

## Round log
- r01: first build. Self-review fixes before the critic: moved shots so the skull / small faces never cover a face;
  sockets made truly black (coat map: no clearcoat, full roughness inside); exposure and softbox down (the bone was blown
  out); bloom only on the payoff light hit; sub-frames clamped to the pop and a short shutter on the first frames (no
  see-through first frame); B rings reduced to one thick gold ring (no white hairline ring, no glow disc veil).
- r02 (critic r01: 7/7, no defects). A: lead-in cut to 0.4 s, the pop lands on the cut (0.44), payoff 0.74, a second
  laugh snap on the next cut (1.63), out 2.95; new shot plan v05 -> v03 -> v28 (from 1.0 s, upper-left clear) -> v06, and
  the tumble falls left, away from Lamar. Smooth cranium (brow/cheek lumps gone, AO blotches halved), enamel coat, rim light
  halved (no white edge halo), matte recessed mouth void, jaw rami tucked under the cheeks, and the payoff light is now a
  clipped specular band (world-space emissive band in the bone shaders, masked off sockets and silhouettes) sweeping across
  skull, teeth and jaw for 0.42 s. Exit blur at 24 sub-samples. B: the pop moves onto people (v22 trio, the faces over
  Franklin's jumpsuit, clear of every face), ends on v39 / v11; the CSS border rings are replaced by a 0.22 s tapered
  radial-gradient shockwave (1.0 -> 1.75x the face, band 20% -> 0); exit blur at 24 sub-samples.
- r03 (critic r02: 7/7, 1 defect, a repeated last frame on v22). A: whole edit is one Franklin scene (v06 -> v03 -> v31 ->
  v06), pop on the 0.40 cut; darker bone with a brighter softbox and less hemi, so the clearcoat kicks; grey bevelled
  socket and nose walls (AO); the payoff is now a fast clipped specular sweep (0.5 s, no rim or bloom pulse). B: one
  continuous v35 shot (no overrun possible), Linear tone mapping and richer yellow-to-orange so the faces stay saturated,
  the CSS shockwave replaced by a lit 3D gold torus per pop (1.05 -> 1.7x, cut at ~0.17 s while still a solid band), 8 glass
  droplets flung irregularly from the main pop under gravity, tear glow cut to 0.18, cluster spread on a diagonal
  (no face overlaps another face's tear, tears inside x 920).
- Critic r03: A 8 (LOCKED), B 7, no defects. B still open after the 3-round budget: the critic wants one hero shockwave that fades
  out (not a gold hoop that blinks off, repeated on all three pops), followers landing together as an echo, and an arcade-magenta rim.
- r04 (v1 only; v0 locked, render untouched, SSIM 1.0000 vs r03). Rebuilt B around one payoff: the hero at 600 px (was
  370) pops grinning and bursts into the laugh at 0.74 (new state change), one dissipating shockwave of light on the burst
  only (the gold torus hoops on all three pops are gone), followers land together at 1.08 as an echo, magenta-red neon rim
  light + fresnel edge from screen-left, warmer key and bounce, lower half lifted toward #F7A51C / #F0901A. Self-review
  fixes before the critic: the tilted shockwave was sliced by the shadow-catcher's depth (depthWrite off), its magenta
  wake darkened the plate (alpha cut to 0.32, front-heavy profile), the rim fresnel fringed the eyes (smooth normal),
  tear droplets flew off both frame edges (shorter arcs, edge fade), the falling hero swept over an echo face (staggered
  exits), and the ring fades out before it can thin to a hairline.
- Critic r04: A 7 (render unchanged since its r03 8, so it stays LOCKED under the sticky rule), B 8, no defects or hard caps.
  STATUS: PASSED (sticky). B nitpicks left: the ring's soft inner glow reads slightly preset, a red cast on the lower-left
  face at the peak, stepped blur on the exit fall around 3.3 s, and the two echo faces are clones.
