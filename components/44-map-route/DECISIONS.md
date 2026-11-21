# 44 Map route: decisions

## Variant A (16:9, 1920x1080): "Tilted 3D map" (Three.js)

**Evidence.**
- c-I-jXpGuOk t00877 (8.1M): the editor cuts out of live footage into a light maps-app view. It has cream land, pale green parks, a blue sea, white roads, two red teardrop pins with a white rim and a thick crimson route (#C8102E) drawing between them, with bold dark city labels. It runs full frame for about 3 s, then cuts back to footage (t00873 to t00881).
- LzIibqRWGqw t00340: the same move on a flat game map, a thin red line with standard red pins and a slow push-in, dissolving back into gameplay (t00664).
- The creators' version is flat, a screen recording or a screenshot with a pasted line: no depth, no light, and pins that just appear.

**Our upgrade.**
- **Map.** Our own island city, drawn procedurally on a 4096x3072 canvas in the maps-app style:
  - a curved coastline with a shallow-water band on a two-tone sea;
  - a beach strip, a pier, a port with docks, an airport, golf and park greens, a reservoir;
  - a road hierarchy: yellow freeways (#F9C74F with an #E0A92E edge), white arterials with a grey casing, white hill roads and white local streets on slightly darker blocks.
- **3D ground.** The texture sits on a displaced 3D terrain: the northern hills are real geometry, raked by a low key light, with real shadow-mapped shadows. Downtown has about 90 extruded light-grey towers that cast shadows across the streets, the Google-3D look.
- **Route.** A ribbon that hugs the terrain: a crimson core (#D3122B) with a tube highlight, a darker edge, a real white casing and a #FF2E3A outer glow at 0.35, and a soft white-hot head that leads it. It draws on along the actual drawn roads: pier, then freeway, interchange, boulevard, and the hill switchbacks.
- **Pins.** Lathe-turned glossy 3D teardrops: an opaque body graded from #A50E1E at the point to #E1192C at the head, a white back-face rim like the app's white outline, and a white bead in the head. They drop from height with a spring, squash 2 frames on contact and recover. Each has a #2A1A12 contact-shadow ellipse that grows 0.4 to 1 as the pin falls and squashes wide on impact, plus a red ground ripple.
- **Labels.** All DOM (sharp), pinned to projected 3D positions every frame: grey spaced district caps, a blue spaced ocean label, and big bold place names on the pins.
- **Chip.** A maps-style route chip (white, car glyph, "18 min" in tabular figures, "7.4 mi") springs out of pin B when it lands.
- **Buildings.** Warm-white towers (#F4F1EC / #EFECE6) and low-rise (#F3EFE7) with baked base AO (vertex colours). Each block gets a lot pattern (four houses, two long buildings, or one big footprint), and heights vary 1–4x.

**Shots and cuts.**
- 0 to 0.95 s: `v57-gp-red-car-highway` (gameplay, HUD minimap visible).
- At 0.36 s our map cuts into the game's own dark HUD radar frame. WebGL renders natively into that rect (viewport and scissor), so the thumbnail is a sharp render, not a shrunken full-frame canvas. From 0.56 to 1.1 s (power3.inOut, so the growth spans about 7 frames) the frame grows to full screen with velocity blur (4 px at peak), a corner morph and a soft shadow that falls away. It's the editor's cut into the map, as a designed transition.
- 1.1 to 6.95 s: the map. Pin A lands at 2.0 s; the route draws from 2.06 to 4.12 s. The camera starts high and top-down over the whole island, tilts to about 50 degrees and flies along behind the route head, then settles by 4.25 s on an overview with both pins inside x 360–1530 and holds to 6.6 s.
- 6.6 s: the labels and the chip exit (the chip collapses into its pin). 6.7 to 7.2 s: the camera dives into pin B. 6.95 to 7.25 s: zoom-through: the map scales 1.35x into pin B with up to 6 px blur while a hard-edged iris opens out of the pin onto `v28-tennis-mansion-h` (a bright, sharp Vinewood Hills mansion court over the city), held to 7.8 s (0.55 s footage tail).

**Payoff.** At 4.3 s pin B lands (squash, ripple, contact shadow snaps tight, map punch), and a white-hot additive pulse with a soft bloom head runs the whole route from A to B in 0.45 s (power3.inOut). The light stays local: a 220 px additive white bloom on the ground at pin B's point (0.55, peak at 4.36 s, held 3 frames), drawn under the pin so the pin stays saturated. At 4.46 s the chip springs out of the pin (pivot at its pointer, scale 0.2 to 1, 120 px out, back.out(2.2)) and an overlay sheen crosses it. The finished A + B + chip state holds from about 4.9 to 6.6 s (1.7 s). Hero: 5.5 s.

## Variant B (9:16, 1080x1920): "Game-map route"

**Evidence.**
- mCDH5KnBx9o t00064 (8.3M) and its neighbours t00056 to t00072: a matte tan or ochre game map with darker terrain texture, flat teal water, thin dark roads and grey sans place labels ("Alamo Sea" larger). Over it:
  - a navy route strung with white beads that appear in sequence;
  - a thick cyan curved arrow;
  - a red block arrow pointing at a spot;
  - a blue flag marker.
- The camera slowly pushes and pans, then the edit cuts to gameplay of the place (t00068).
- The arrows are flat stock shapes and the beads are flat dots, with no shadow or light.

**Our upgrade.**
- **Map.** Our own drawn northern wilderness: coast, a mountain massif, a lake, a creek canyon, towns, a highway, a dashed trail and an airstrip. It's rendered at 2x (2160x3840) so the push-in stays sharp. On it:
  - computed shaded relief (lit from the north-west) and ridge hatching strokes that follow the slope, like the evidence's dark terrain texture;
  - ochre-to-sand land tones, forest stipple, a teal sea with a depth gradient and shore band, and paper grain.
- **Route.** Beads are lit spheres (white-to-grey radial, navy rim) that pop on one by one with overshoot along a navy line with a light casing, all casting a soft shadow on the paper.
- **Cyan arrow.** Tapered (thin tail, fat neck) and drawn on as one stroke with the head riding the tip. It has a cyan glow, a white specular core and a shadow on the map.
- **Red arrow.** A bevelled block arrow (gradient, top-edge highlight) that slams in from off-frame right, fully opaque the whole way, with a spring and a 2-frame squash, plus a small map shake.
- **Destination.** "MOUNT CHILIAD" slams on with a lit red ring (white rim, red gradient band, specular arc, ripple) around the summit.

**Shots and cuts.**
- 0 to 3.5 s: full-bleed map. It opens with a fast settle (scale and blur), labels arrive, the route steps on, then the arrows come in.
- 0 to 3.9 s: the map never freezes. It drifts 1.00 to 1.04 with a 12 px rise (sine.inOut), and the overlay (beads, arrows, flag, ring) rides to 1.05 for parallax. Both scale about (520, 1040), low in the frame, so edge labels barely move.
- 3.5 to 4.6 s: push in on the summit to 1.75x. The other place names blur out over 0.25 s first, so nothing gets cropped by the frame edge.
- 4.35 to 4.81 s: the target ring opens into an **836 px window** (r 86 to 418, moving to x 504, y 900, back.out) straight onto `v02-mountain-hikers-h` at 0.94 to 1.0x (sharp, never upscaled), while the map grades down to a bed (brightness .6, contrast 1.12, saturation .72, 4 px blur). The label rides above the window. As the window opens, both arrows pull back out of frame along their own axes (0.3 s, power3.in), so the end frame is title, window and route only. The piece ends on that window at 5.67 s (the shot's full length), with no full-frame 9:16 footage.

**Payoff.** The red arrow slams at 2.36 s (squash, sheen, map shake), and the ring swings in at 2.58 s. At the lock (2.76 s) the title slams on: opacity on in one frame, scale 1.2 to 1 with back.out(2.6). That comes with `Look.impact` (flash 0), a ripple, and a warm #FFE2A8 summit bloom (520 px, 0.8, held 3 frames). The ring is a lit band: a white rim, a red gradient band, a white specular arc, a dark edge line and a drop shadow. Hero: 3.3 s.

## Round 1 build notes
- **A.**
  - The first pass framed B at the top edge with small pins, and a blobby island with a sparse city. Fixes:
    - a coastline redrawn with a peninsula, bays and islets;
    - a base street grid over the whole lowland, plus district grids at their own angles;
    - dense, low low-rise blocks (sparse random cubes read as noise);
    - the hold reframed (positive yaw, D 72) so both pins and the chip sit inside title-safe;
    - pins sized to the camera distance (about 180 px, like the evidence's app pins);
    - pin sun-shadows dropped (they smudged the city), keeping the contact shadow.
  - Pin A now drops once the camera has tilted: a pin falling toward a top-down camera reads as a ball.
  - Labels fade at the frame edge so none is ever clipped.
- **B.**
  - The first pass had relief noise everywhere (a muddy, crumpled look). Now: a dominant massif, calm lowlands, softer shading, sparser hachures, crisp marching-squares contours, and a 2 px relief grid so the 2x push stays sharp.
  - The cyan arrow was fattened to evidence thickness.
  - The red-arrow sheen is clipped in a static group (it leaked).
  - The destination label was narrowed to fit 72–936.
  - The lake label and the start flag no longer collide.

## Round 2 (r01 verdict: v0 7, v1 7)
- **A, payoff framing and hold (defect).** The overview camera now settles by 4.25 s on target (-14, -13.3) at D 76, so pin A sits near x 370 and pin B near x 1510 (both inside x 160–1760). Label A stays on through the whole payoff. timing.out 6.6, dive 6.7, fade 6.95: the full state holds about 1.7 s. Pin B's drop is shortened (0.3x height) so it falls in from inside the frame.
- **A, light beat (defect).** The ribbon shader now outputs sRGB-correct colours (round 1 wrote linear values raw, which is why the route read dark crimson with no halo): a white casing, a #FF2E3A glow, and a separate additive pulse mesh (white-hot to pink, 2.4-sigma band) with a soft round bloom head (no star) running A to B at pin-B contact, plus `Look.expose` 1.12 held 3 frames.
- **A, entrance.** The minimap grow uses velocity blur, the corner-radius morph and a falling shadow. I used power3.inOut over 0.56–1.1 s instead of the suggested expo.inOut 0.62–1.02, because expo still crammed the growth into about 4 frames.
- **A, exit (lesson 14).** No dissolve: the chip collapses into pin B and the labels blur up and out; then a zoom-through with a hard-edged iris (a 36 px mask edge) opening out of pin B onto the destination shot. The footage tail is 0.55 s.
- **A, buildings.** Warm-white materials with baked AO; low-rise heights vary 0.6–1.8x.
- **B, terrain.** Every fbm/ridged octave is rotated about 37 degrees and offset, and the input is domain-warped at 0.35x the base frequency (about 40 px). Drainage is 8 gullies that start below the summit, wander downhill and branch into tributaries. They're drawn as tapered strokes into a mask canvas, blurred into a soft V, and carved out of the height field (h x (1 - 0.25 m)). A first try with analytic radial valleys read as a starfish, so I replaced it. Lit hachures are dimmer, so no ray pattern forms at the summit (lesson 19).
- **B, motion.** A continuous drift with overlay parallax (see Shots); the motion energy from 0.6 to 3.6 s is now about 0.4–0.7 (round 1: about 0.07).
- **B, labels (defect).** Non-target names fade with a 4 px blur at the push start. MOUNT CHILIAD has word-spacing .14em.
- **B, ending (lessons 12, 14, 17).** The gp aerial and the cross-dissolve are gone. The ring itself becomes the porthole onto two sharp -h shots at 1.0x, over a graded bed inside the lesson-17 limits, and then irises out. The tail is 0.48 s.
- **Lesson 18.** Every tweened SVG attribute has an explicit start value in the markup. Ring radii and positions are written by one `Look.drive` from timeline time, so seeks in either direction are exact.

## Round 3 (r02 verdict: v0 7, v1 6 capped)
- **B, safe zone (defect, the cap).** Grapeseed moved to (760, 760), Sandy Shores to (700, 1425), Alamo Sea to (760, 1180) and Paleto Bay to (440, 300). The red arrow is shortened to 330 (tail ink x ≤ 905), and the cyan arrow is raised 24 px. The slow drift now scales about (520, 1040), low in the frame, not the summit, so edge labels barely move. The title is centred on the safe column (x 504), so even its 1.2x slam frame fits.
  - **Measured.** I injected a getBoundingClientRect readout into a scratch copy and snapshotted it at 2.9, 3.45 and 5.6 s. Hero and payoff frames: every label box sits inside x 105–912 and y 241–1448. The red arrow body is at x ≤ 905 and the cyan body at y ≤ 1450. In the end frame the title is at x 143–865, y 372–452, and the window ring at x 74–934.
- **B, ending (defect, lessons 12 and 21).** No iris to full frame and no v29. The ring opens straight onto v02 hikers in a window at ≤ 1.0x over the dimmed map, and the piece ends there. The first r03 capture showed the red arrow's tail cut by the right frame edge and the cyan head at the bottom edge in the end frame, so both now pull out of frame as the window opens.
- **B, title slam (lesson 23).** It is on in one frame with a 1.2 to 1 back.out slam, an impact, and a warm summit bloom held 3 frames. The place names also switch on in one frame and spring in. The red arrow no longer fades in: it slides in fully opaque from off-frame (power2.in, 0.24 s). The frame-wide expose is gone (lesson 22). I kept the ring as a lit SVG band rather than Three.js geometry (lesson 24 was optional for v1).
- **A, contact shadow (defect).** The old shadow existed but was invisible for two reasons: its texture was treated as linear, so the dark core was re-encoded as pale grey, and its core was smaller than the pin's point. Now it's an sRGB #2A1A12 ellipse that ignores depth (drawn before the pins, which render in the transparent pass but stay opaque). It grows 0.4 to 1 as the pin falls and squashes wide on impact.
- **A, milky cones.** The cones were reflecting a bright lower environment through a strong clearcoat. The body now carries an opaque vertex-colour gradient (#A50E1E to #E1192C), with a darker lower environment, clearcoat 0.6 and env 0.8.
- **A, end shot (defect, lesson 4).** v36 (dim, hazy) is replaced by v28-tennis-mansion-h, which is bright and sharp.
- **A, payoff light (lesson 22).** No frame-wide expose. Instead there's a localised additive bloom at pin B's point, under the pin. I first tried a DOM screen-blend bloom, but it washed the pin itself milky, so the bloom moved into WebGL under the pin.
- **A, entrances (lesson 23).** The chip springs out of the pin. District and pin labels switch on in one frame with a scale spring, so there are no see-through frames.
- **A, map credibility.** The road hierarchy and the varied lots and heights are described above. The hill leg is a real switchback climb along the drawn road, which keeps winding past B. The freeway under the route is drawn narrower, so there's no yellow fringe.
- **A, radar.** The map renders natively inside the radar rect, in the game's dark radar frame (no white PIP border).
