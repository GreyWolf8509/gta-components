# 76 Police report icons: decisions

- Instanced 2026-11-21 from the film kit object in films/gta6-rdr2-gta5 (assets/kit/film.js, `report`), over the official footage the film uses under it. The film's version was flat DOM (navy rounded squares, thin white lines, no light) and `hyperframes check` failed on the docked row (labels overlapping). Rebuilt in r01.

## Evidence
- Nearest census objects: `gta/50-star-checklist` (the GTA VI wanted card with a row of "heat" icons: together, camera, put away, changed, masked, swapped; top-centre, ~30% of frame width; stars drop and icons tick one by one), `gta/33-goal-checklist` (portrait slots that tick green one at a time, bottom-centre, ~8% width each) and `gta/48-mission-hud` (HUD rows docked at the frame edge). The job in all three: a small set of marks that arrive one by one on the beats, then live as a row at the frame edge while the video goes on.
- The film's object: three of our own line icons (OUTFIT, CAMERA, WEAPON), each stamped on the word that names it, then docked as a row under THE POLICE REPORT at the top of the frame. We keep exactly that structure (CONFIG: icons kind/label/at, dockAt, dockLabel).

## Variant A (16:9, 1920x1080, 7.6 s)
- Shots (official GTA VI clips already in a/assets/clips, 1.0x, cut like an edit, incoming clip 2 frames early underneath): bar 0-3.0 (gta6-t2-031), green car + police cruiser 2.93-4.95 (gta6-launch-021), police chase 4.88-7.6 (gta6-ps5feat-013). The lock-in lands on the cut to the police shot.
- Each icon is a real Three.js slab: a 260 px rounded square extruded 18 px with a 7 px bevel, navy clearcoat lacquer (MeshPhysicalMaterial, clearcoat 1, PMREM studio env: cool softbox overhead, pink strip left), a canvas-textured face whose icon strokes are 14 px GTA VI pink (#F2558E) painted as emissive (map + emissiveMap), a key light + hemisphere fill, ACES. A soft contact shadow plane sits 24 px behind each slab and darkens whatever is under it.
- Stamp (0.9 / 1.9 / 3.2 s): the kit spring 0.6 -> 1.07 -> 1 on scale, with the slab arriving from z +60 tilted -20 deg and flattening onto the plane, a 3-frame shake (5 px) at +0.1 s, the face's emissive peaking x2.4 for 3 frames and the key kicking. Label (Oswald 600, 40 px, tracked) rises through an overflow window 0.1 s after the stamp, opacity 1 in 2 frames.
- Dock (4.45 s, the payoff): 0.1 s anticipation dip, then all three slabs travel to the top band with back.out(1.6) overshoot on position and a scale overshoot to 0.43 (112 px), leaning into the travel. Lock-in at 4.95: a 1-frame squash on each slab, a 1-frame 4 px shake, a point light raking across the row and a soft sheen across the band, all faces pulsing pink for 3 frames. The band is a lacquer strip (3-stop navy gradient, lit top edge, inset bottom shade, pink spine, contact shadow, 0.94 opacity so pink and white type sit at > 4.5:1), revealed by a clip-path wipe from the top as the slabs arrive. THE POLICE REPORT (Oswald 600, 40 px, 0.2 em, pink) rolls up through a window on the band. Docked tiles are 200 px apart edge to edge (>= 48 px) with 36 px labels beside each.
- Hold 2.1 s docked; exit at 7.1: the band wipes up (clip-path + 6 px blur), the slabs and labels leave upward with power3.in, zero frame at 7.4, end 7.6.
- Hero: 5.15 s (lock-in + sweep).

## Variant B (9:16, 1080x1920, 7.6 s), phone-first (lesson 26)
- Same beats and the same three clips, cover-cropped to the centre. Stamp tiles 250 px (23% of the frame width, the row spans 76%) at y 940 inside the safe zone, labels 40 px under each. Dock band x 72-936 (80% of the frame width), y 236-556: title 44 px, docked slabs 160 px (15% width each, 102 px apart) with 36 px labels beneath, so every mark survives at 360x640.
- Hero: 5.15 s.

## Rules kept
- Oswald only (local woff2 in media/fonts, inline @font-face), nothing under 36 px, no glow halos, no sparkles, no logos or real badges: our own line marks. One paused GSAP timeline; the Three.js scene renders from timeline time through Look.drive and hf-seek, never rAF.

## r01 self-review (before the critic)
- The launch-021 clip carries the next trailer shot in its last 0.13 s (a bike at sunset): clip ends now at media 1.8667, cuts frame-aligned (s1 0-3.0, s2 2.9333-4.8, s3 4.7333-7.5), the lock-in moved to the cut at 4.8 (dockAt 4.3), CAMERA stamps on the bar clip's internal cut at 2.0, end 7.5.
- The point-light rake left a hard white specular blob on the first slab: replaced by a soft additive sheen band clipped to each face (ShaderMaterial on the face shape) plus a key-light kick, 0.62 s across the row.
- Bevel deepened (9 px), slabs rest tilted 0.1 rad toward the key with a slow idle wobble so the lacquer moves; a recessed tray in the band gives the slabs something to lock into.
- Exit unified: band, slabs, labels and title leave upward as one piece (power3.in, 0.3 s, 6 px blur on the type), zero frame at 7.3.
- No census frame exists for this object: evidence.jpg and the blind pairs were composed from the nearest census frame (50-star-checklist's wanted card) with blind.py's side rule.

## r02 (critic r01: 7/7, no defects; "the dock is a reshuffle, tiles read flat, dead time, v0 docked tiles small")
- First stamp at 0.5 s (was 0.9); the rest of the beats unchanged so the lock-in still lands on the cut to the police shot (4.8).
- The lock-in is now a state change: each slab's face lights pink for 3 frames in turn (0.08 s stagger) after the 1-frame squash, its socket in the tray lights with it, the band takes a 3-frame exposure pulse (brightness 1.38), the sheen crosses the three faces and the band (0.62 s). Every stamp also lights its face for 3 frames (pink additive flash on the face shape, no halo).
- Lacquer pushed: env reflections 1.5 on the body, clearcoat roughness 0.04, a static top gloss on each face; the band gets a brushed diagonal highlight and a brighter top edge.
- v0 docked tiles 136 px with 40 px labels (band 1120 x 252); v1 docked tiles 176 px (band 864 x 336). Hero 5.12 s (sweep peak, confirms decayed).
- Not taken: the critic's star/heat strip above the title. Stars would turn the object into a wanted-level card; the brief is the film's police report (three evidence icons). Could be a CONFIG option later.

## r02 verdict: 8/8, no defects, no hard caps -> PASSED (sticky). Both variants locked.
- Critic's remaining nits, not applied (locked): the band header is empty for ~10 frames before the title rolls up at the lock-in; v0 title could be larger; strokes could be heavier; Oswald instead of a DESIGN §6 face (Oswald is the film kit's one family, required by the lead); flat pink spine.
- `make_b.py` derives b/index.html from a/index.html (canvas, layout block, push amount): run it from this folder after editing A, so the lead can port one source into the film kit.
