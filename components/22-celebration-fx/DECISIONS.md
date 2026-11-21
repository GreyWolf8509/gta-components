# 22 Celebration FX: decisions

## Variant A (16:9): money rain (3D)

**Evidence.** `yt-5zKoq7EabvQ t00000` (7.4M views): flat 2D $100-style bill cut-outs, bright and slightly green, very large (30–40% of
frame width), rotated at random and cropped by the frame edges, flying over the gameplay with smeared motion blur, mostly round the
edges and corners so the player stays visible. The other evidence (confetti, light leak, aura) shows the same job: a full-frame
celebratory FX laid over gameplay on a milestone beat, no box, no type.

**Our upgrade.**
- The bills are real Three.js paper: a 24×8 segment plane per bill, bent every frame (curl along the length, cross-bow, a travelling
  flutter wave), with our own fictional "Los Santos 100" artwork (`a/media/make_notes.py`): an engraved line-screen portrait,
  guilloche border, seal, serials, a colour-shift copper-to-green 100 and a blue foil ribbon. Different front and back.
- Material: MeshPhysicalMaterial with a bump map from the intaglio ink, a satin clearcoat (0.3) and sheen; the ribbon and the big 100 are
  metallic in the ORM map, so they flash when a bill turns into the sun box of the PMREM environment. Warm key upper left, hemisphere fill,
  cool rim, ACES.
- Physics: closed-form drag toward a terminal flutter (sway with matching bank, a 38% share of long-axis tumblers), so every seek is exact.
- Depth: three layers by distance. Far bills (z −9…−4) are small and 2.2 px soft, the focus band is sharp with a soft contact shadow,
  near bills (z 5…6) are huge, off the frame edges and 9 px out of focus.
- Motion blur: 15 sub-frame samples over a 180° shutter, averaged exactly ('lighter' at 1/15).

**Shots and cuts.** v28 tennis mansion (0–2.4) → v18 pool skyline (2.4–3.7) → v11 yacht (3.7–5.8): a bright "rich life" montage at 1.0×.

**Payoff (1.08 s).** A money-gun burst fires from below the bottom edge at 0.22 s (small camera kick, no flash): 15 bills fan out, hang at the top
of their arc and turn. The hero bill comes up showing its back, flips to face the lens at the apex (1.08 s) and the key light rakes across
its clearcoat and foil. Then rain from above; every bill has fallen out of frame by 5.2 s (0.6 s tail).

## Variant B (9:16): confetti burst + power-up aura

**Evidence.** `yt-eT7H9BAUPQw t00072`: an electric cyan barbed ring (~35% of frame height) centred on the character, white-hot core, crossed by
slashes, a burst-and-fade. `yt-yycAimqjdjw t01134`: an aura and portal ring around the transformed character. `yt-Vom5ya5cbQY t00860`:
full-frame flat confetti ribbons and rectangles (teal / magenta), no light at all.

**Our upgrade (r04: the ring rebuilt as a real lit object).**
- The aura is a thick glass torus (tube radius 31 px, ring radius 330 px, about 69% of the frame width) filled with cyan plasma,
  in one custom shader: plasma emission from the chord through the tube (a white core, a cyan body), lit by a key so the top of the
  tube is brighter and the underside falls off, a white key specular band clipped to the tube's surface, a Fresnel glass rim
  reflecting a dusk environment, and a dark glass tint at the edges. Flow noise surges round it at about 0.45 rev/s.
- A two-strand plasma braid twists inside the tube (7 twists); the strand behind the core is dimmer, so it reads as depth.
- 11 faceted crystal barbs (diamond section, hooked tip, flat-shaded facets lit by the key, a white-hot root, a luminous edge),
  8 out and 3 in on the near half. They are real geometry and depth-test against the tube, so the tube covers their roots.
- Real screen-space bloom: an emissive-only pass is blurred at 1/4 and 1/8 size and added back, instead of a painted halo.
- No hairline crackles, no sunburst spark rays, no gather motes (lessons 11 and 19). On the lock-in: 9 ember droplets with short
  tails off the near arc (drag and gravity), and 6 slow rising embers in the hold. The shockwave is the only radial element.
- Head matte: the head was measured on the plate every 0.1 s (centre x, top y, width; dark-run tracking, checked frame by frame and
  hand-corrected at 3.6 to 3.9 s where a window mullion fooled it). The matte ellipse follows that track through the footage push
  and kick (the camera moves are now computed in the script, so the mapping is exact). The ring follows the smoothed track.
- `subject.matte` and `subject.lightWrap` (default "plate"): the head notch and the cyan light wrap are fitted to the sample
  subject, so the transparent render has neither unless you ask for them.
- Confetti: thin foil boxes in gold metal, pearl iridescent and cyan metal, plus gold ribbons, PMREM reflections, 15-sample motion
  blur and three depth layers (near blur 5 px).

**Shots and cuts.** v35 penthouse, the -h shot framed so the subject sits mid-frame (object-position 31.5%): party (media 0.2–1.7) then a jump cut to
the sunset window (media 5.0–8.9). Cut lands on the payoff.

**Payoff (1.5 s, on the cut).** 0.42–1.34 s: the slim tube draws on round him with a hot head, contracting, then a squeeze.
1.5 s: lock-in. The tube inflates to full thickness with a spring, runs white-hot for 3 frames, the barbs erupt from it (spring,
rippling out from the near point in 0.07 s), a light rakes once round the glass (0.42 s), a shockwave and the wing slashes leave it,
ember droplets fly, two confetti cannons fire and the footage takes a small kick. Hold to 4.3 s, then the barbs retract and the ring
collapses into him (4.3–4.66), and the last confetti clears by 5.0 s.

## Round log
- r01 (7/7, no defects): critic wanted a real payoff on A (the hero turn went by unlit; paper read pale), no milky ignition on B,
  no stepped motion blur, a ring that wraps the subject instead of a pasted halo, no '9'/'@' streamers, ring inside x 936.
- r02:
  - A: the hero bill now flips face-on exactly on the tennis-to-pool cut (apex 2.38 s): a specular band clipped to its face sweeps
    across it in 0.36 s (soft, 0.62 peak, no bloom sprite: it banded), a small camera kick lands the cut. Paper and ink greener
    (#C6DBB1 base, #184A30 / #2F7A4C ink), exposure 0.9, less fill so curls keep a shaded side. 15 sub-frame samples (no steps).
  - B: the ring is tilted 60 degrees round the shoulder line; its far arc is hidden behind the head with a tracked soft head matte,
    its near arc crosses his back. The barbs became rising aura flames (local +Z), 3 thick crackle strikes held 2 frames each.
    Ignition no longer washes the frame: no footage exposure pulse, smaller bloom sprite, glow alpha halved (more additive).
    Ribbons replace the helix streamers. Radius 350, follow capped at 25 px (safe zone). 15 sub-frame samples for confetti;
    the aura renders once per frame into its own layer (lAura, focus-band confetti depth-only in front) so its soft glows don't band.
- r02 critic (7/7, no defects): A's bills the same milky mint on every shot and evenly lit, the hero a rigid card whose sweep
  washed its lettering, a near bill cutting its "100"; B's ring a slim halo with hairline spikes, no light on the subject, matte
  mustard confetti, near confetti smearing over him on the hero frame.
- r03:
  - A: every shot lights the bills its own way (tennis warm white from the top right, pool #FF9A55 low from frame left with
    dark green shadow sides, yacht cool white from above), each with its own reflection environment. Ink #24452C on paper
    #CFDCC2. The hero rises showing its back, flips in the last 0.34 s and lands face-on on the cut with a damped spring
    (about 6 degrees of overshoot, settled in 0.3 s), with a 13 degree bow and a corner flutter; softer rake (rougher
    clearcoat on the hero only), and its own blurred image screened behind it for 3 frames as the bloom (single pass, no
    banding). A second burst of 9 bills behind it on the cut. Near bills are mirrored or re-timed out of the hero's corner.
  - B: bolder ring (core 0.037, glow tube 0.14), 12 lens-facing barbs in and out plus fine flames, a wing-slash pair
    crossing under the ring on the lock-in (0.34 s), a cyan light wrap screened on his shoulders and hair (peak 3 frames,
    settles to a hold, dies with the collapse). Darker reflection dome with six bright soft boxes so the foil flashes as it
    turns; 100 pieces + 12 ribbons; near pieces re-aimed up the outer edges, clear of his head and the ring around the lock-in.
- r03 critic: A 8 (pass), B 7. Open on B: the held ring reads as a uniform neon ellipse with single-line crackles and hairline
  spark rays; the head matte gaps about 45 px at 2.0 s and 3.8 s; the notch and wrap haze are baked into bg:none.
  A polish left: 0.75 s footage-only tail, khaki near-bill bokeh on the pool shot. Tile uses r03 for both.
- r04 (v1 only; v0 untouched, VS-PREV 1.0000):
  - The flat neon ellipse is gone: the ring is a lit 3D glass torus of plasma (key-lit top, shaded underside, a white specular band
    clipped to the tube, a Fresnel rim, surging flow noise) with a two-strand plasma braid inside and 11 faceted crystal barbs that
    erupt from it on the lock-in. Real screen-space bloom of the emissive pass replaces the painted halo and bloom sprite.
  - Removed the single-line crackles, the fine flames, the 64 hairline spark rays and the gather motes; 9 ember droplets with short
    tails on the lock-in and 6 rising embers in the hold instead.
  - Head matte re-measured every 0.1 s (x, top, width) and mapped through the push/kick, which the script now computes itself;
    checked at 0.8, 1.2, 2.0, 2.4, 3.0 and 3.6 to 4.1 s (the r03 gaps were 38 to 45 px of track error).
  - `subject.matte` / `subject.lightWrap` toggles (default "plate"): bg:none has no head notch and no wrap haze.
- r04 critic: 8/8, no defects, STATUS PASSED (sticky). Polish left on v1: the evenly spiked ring at neck height can read as a
  collar and the barbs hold still; the confetti is a generic three-colour set. Tile: a = r03, b = r04.
