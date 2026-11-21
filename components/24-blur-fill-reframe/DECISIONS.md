# 24 Blur-fill reframe: decisions

## Variant A: Blur fill (9:16, 1080x1920)

**Evidence.** The 16:9 gameplay sits full width in the middle of a vertical Short; the empty bands above and below are a
heavily Gaussian-blurred, enlarged copy of the same clip (yt-UbHlGkTHRUs t12: band 30-62%; yt-KMzt08VK4Jo t12 and
tt-7578844325090561287 t3: zoomed crop, thin bands; tt-7681770221350260000 t4.5: blurred copy slightly darker). Hard edge,
no border, no shadow. Always on; the blur follows every cut. The job: put a horizontal clip on a vertical canvas without black bars.

**Our upgrade.**
- The window is a 1000x562 16:9 screen (x 40-1040, centre y 930) with a 30 px radius, a 2 px rim lit from the top
  (white .55 at the top fading to .06 at the bottom), a faint inner edge shadow and a screen-glass gloss on the top 40%.
- Depth: a three-layer drop shadow (2/4, 14/28, 40/90 px) plus a colour spill: a 1.16x copy of the clip, blurred 48 px,
  opacity .55, sits behind the window so the screen lights the bed around it (ambient light), while the shadow darkens below.
- The bed is the same clip at the same geometry as a full-bleed crop, graded blur 34 px (enough to keep the scene's
  shapes, as in the evidence), brightness .74, contrast 1.20, saturate 1.5: darker than the window but saturated and
  contrasty so it never reads as a grey veil (DESIGN 11.17's intent; the evidence bands are much brighter), with a light
  top/bottom vignette and a 0.06 grain on the bed only (de-banding).
- Parallax: the bed pushes 1.00 to 1.05 during the hold while the window drifts up 8 px.

**State change and payoff (0.0-0.62 s, landing 0.62).** The file opens full-bleed (the clip cropped to 9:16, the "before").
The window pulls out from 3.9x to 1.0x in log scale (power3.inOut, 0.62 s) with a speed-matched blur, while the bed it
leaves behind defocuses from 0 to 34 px and dims from 1.0 to .74: a focus pull that reveals the whole 16:9 frame.
It undershoots to 0.978 and springs back (damped 1.4 Hz). At 0.62 the screen "powers on": the colour spill flares to
1.6 brightness for 3 frames, the screen lifts 1.16 and a soft 26% specular band rakes across the glass (0.66-1.32 s).

**Shots.** v11-yacht 0-2.1 (bright, sharp, the pull-out reveal), v17-deluxo-sunset 2.1-3.67 (pink bed),
v52-gp-police-bridge 3.67-5.9 (gameplay HUD, bright sky). The bed follows every cut. Exit 5.4-5.87: the window pushes
back to full-bleed (power2.in, landing on the last frame) while the bed refocuses, so the loop closes where it opened.

## Variant B: Split stack (9:16, 1080x1920)

**Evidence / format.** The stacked Short: gameplay on top, a second clip (the creator's cam) underneath, a clean seam and
a tag on each half. Same blur-fill bed language as A (evidence above), two 16:9 windows instead of one.

**Our upgrade.**
- Two 1000x562 windows (top y 348, bottom y 930, 20 px seam) with A's rim, gloss, shadow and colour spill (spill and
  shadow on an under-layer so neither window spills over the other). The bed is split:
  blurred gameplay above the seam, blurred cam below, meeting at the seam with a 120 px feather.
- Tags are solid lit pills, not cards: yellow "IN GAME" (3-stop #FFE680/#FFD23C/#F0B416, our own gamepad glyph) on the top
  window's top-left, red "IRL" (#FF5A63/#FF2E3A/#C8102E, white rec dot that pulses) on the bottom window's bottom-left;
  Inter 900 44 px, 2 px lit top edge, 3 px bevel underneath, contact shadow. Outer corners keep the seam clean.

**State change and payoff (lock-in at 0.95 s).** It opens reframed (A's single window). At 0.30 the cam window rises from
below the frame (power2.in, accelerating, directional motion blur) while the gameplay window lifts to its slot; they
slam together at 0.95 on the truck crash, with a 3-frame squash (0.965 / 0.975 toward the seam), a recoil spring, a soft
warm light along the seam (3-frame hold) and a 6 px shake. The cam's blurred bed wipes up behind its window.
Tags snap in at 1.05 and 1.20: the icon tile pops on a spring, then the pill extends right and wipes the word on.

**Shots.** v56-gp-truck-crash 0-2.2 (crash on the lock), v52-gp-police-bridge 2.2-4.3, v57-gp-red-car-highway 4.3-6.3;
facecam plate 0-6.3 continuous. Tags retract (word drops, pill retracts, icon shrinks) at 5.85-6.15.

## Round log
- r01: first build. Self-review fixes before the critic: the tight 22 px spill read as a cheap outer-glow ring, so it is
  now wide and soft; beds were murky (bottom bands luma 18-21 against 64-170 in the evidence), so less blur, less shade,
  more saturation; A's pull starts on frame 0 (no dead open); A's exit lands on the last frame; B's tag no longer shows an
  empty pill before the word.
- r02 (critic r01: 7/7, no defects; gaps: timid size, material invisible at phone size, dead hold after landing,
  soft upscaled ending, v1 read as a podcast layout).
  - A: the screen is now a 4:3 crop of the 16:9 clip (CONFIG aspect "16:9" | "4:3" | "1:1"), 1040x780 at x 20-1060,
    y 540-1320 (41% of the height, toward the evidence's 68-78% crops while keeping a real bed). Rim is 3 px, lit at the
    top and gone by 42%, with a 2 px dark bottom inner edge. Landing: a 115 deg specular band (160 px core, 0.45 s
    power3.inOut) plus an edge bloom in the shot's own colour (3 px line + 22/64 px glow, 3-frame hold). Every cut (2.1,
    3.63) kicks the screen 1.0 -> 1.018 -> 1.0 (back.out(2.2), 0.28 s) and re-fires the bloom in the new shot's colour.
    The exit to full-bleed is gone: it holds the reframe to the last frame (no soft 2x gp ending). v17 now ends at 1.53 s
    of media (the source's last frame repeated). The pull now moves from frame 1 (power 2.4 out) and lands at 0.66.
  - B: rebuilt as near edge-to-edge panels: gameplay 1040x660 (y 206-866), 12 px seam, cam 1040x600 (y 878-1478) with
    a tight face crop (source at 0.95x, face ~300 px tall). Tags are 96 px chips with 62 px Inter 900 and slam in on the
    lock (scale 1.25 -> 1, back.out(3), opaque in 2 frames). The lock: the cam overshoots 13 px into the seam, the
    gameplay panel is knocked up, a 4 px #FFD23C seam line with bloom fires from the centre out (3-frame hold), 6 px
    shake. Gameplay cuts kick the top panel 1.012.
- r03 (critic r02: 7/7, no defects; gaps: the hold is a stock preset with nothing authored after the entrance, the
  landing glow read as a UI focus ring, the window was 40% of the height, soft open and no designed close; v1's "IRL"
  label was semantically off, its pills started at x 52, and it opened with 0.3 s of no motion).
  - A: 1:1 crop by default (1040x1040, centre y 900, 54% of the height; at 0.96x of the source, so sharp). Opens in the
    creators' own thin-band crop (1.6x, bands of 68/188 px, 4 px zoom blur already on) and pulls into the framed screen.
    The focus-ring bloom is gone; the edge is now a light-wrap (a 1.3x blurred copy of the clip in a soft 30 px inner ring,
    screen blend, .35 at rest) that flares to .85 on the landing with the spill and a 60% specular band. Landing spring
    undershoot 0.045, and the bed breathes focus 34 -> 46 -> 34 px. Each cut (2.0, 4.2): kick 0.035 with back.out(2.2),
    an 8 px vertical directional blur on the screen for 2 frames, a bed defocus pulse to 48 px and a light-wrap lift.
    Bed saturation 1.25 (the gp road no longer goes mustard). Shots: v11 -> v52-gp -> v17; it closes on the v17
    sunset with a 0.45 s power3.in push back to full-bleed (zoom blur up to 8 px) and cuts on the last frame.
  - B: the cam tag is the creator handle "@everestchris6" (cyan #33D6FF chip, our own camera glyph, 54 px); tags sit
    bottom-left of each panel at x 72 (the game tag rides the seam), clear of the face (the plate's head touches the top
    of the frame, so a top-left tag would sit on the hair). No static open: the panel lifts from frame 0 (power2.out)
    and the cam locks at 0.65 on the wall break (v56 in-point 0.4). A localized impact light (color-dodge radial, so the
    blacks stay black) blooms on the crash point for 3 frames. Gameplay cuts kick 0.03 with an 8 px directional blur.
    Bed saturation 1.25.
- Result after r03 (critic r03: v0 6 with 1 defect, v1 7): not passed. Best rounds for the tile are A r02 (7, no defects)
  and B r03 (7, job match yes). Open in r03: A's screen-blend sheen rendered as a hard-edged milky slab (needs an
  alpha-to-zero band with clip-path); A's close ends on a ~2x upscale; B's "IN GAME" tag covers the gp radar (dock it
  top-left); B's colour-dodge impact light reads as a stain.
- r04 (second pass; every critic r01-r03 called it "a polished CapCut blur-bg / split preset", r03 v0 had a defect: the
  screen-blend sheen drew a hard-edged milky slab, and the close ended on a ~2x upscale). The frame object is now real:
  - Both variants: the clip plays on the face of a Three.js slab: a rounded-rect ExtrudeGeometry with a hole (graphite
    ring cap, metalness 1 / roughness .34 / clearcoat 1; polished rounded chamfers outside and inside, roughness .18,
    smoothed normals), 60 px thick, with the face recessed behind the inner chamfer. The face is a canvas texture fed from
    the framework's injected frame of the bed's own <video> each frame (1:1 crop at 0.92x in A, 0.57x / 0.95x in B: never
    above 1.0x), unlit (toneMapped false) so the footage is exact; a 22 px darkening lip under the bezel. Lighting: a PMREM
    env regenerated every frame from a dark studio (top softbox, two strips, a floor bounce) plus the current shot on a
    band in front, so the chamfers carry the shot's colours; key + hemisphere, ACES. A soft shadow plane sits 1400 px back.
  - The payoff light is a raking point light added only to the metal (a Blinn lobe windowed in x and y around the raked
    edge), with an HDR bloom pass that sees only the rake term (the faces render black in it): no DOM sheen, no screen
    blend, no sheet over the footage. The old #sheen, light-wrap, spill and focus-ring layers are all gone.
  - Sub-frame motion blur (up to 10 sub-renders averaged) whenever the slab's corners move more than 4 px a frame.
  - Beds: one <video> per shot (it is both the bed and the face source), blur 38, brightness .6, contrast 1.2,
    saturate 1.15-1.25, plus a vignette shade: dark with real blacks. Incoming shots start 2 frames early, hidden (lesson 25).
  - A: opens with the slab tilted in 3D (ry -30 deg, rx 12 deg, set back 150 px; side wall and chamfers visible) on
    v07 biplane, swings flat from frame 0 and seats on the cut to v11 yacht at 0.733 (arrives with speed, rigid-body settle
    2.2 Hz past the seat); the rake streaks left to right along the top chamfer 0.8-1.46 (hero 1.13). Cuts at 2.6 (v52 gp)
    and 4.2 (v17) jolt the slab (1.8 deg tip + 40 px toward camera, sprung) with a bed defocus pulse. 5.3-5.67: it tips back
    to the opening pose, so the last frame matches frame 0 (loop). No full-bleed push, no upscale.
  - B: gameplay slab (1040x660) lifts from the single-screen position from frame 0; the cam slab (1040x600) rises from
    below the frame tilted 18 deg toward camera with motion blur, slams the seam at 0.667 on the v56 wall break; both bodies
    recoil on springs, a 5 px shake, and four rake lights run from the centre of the seam out to both sides, lighting the
    four seam chamfers (hero 1.0). "IN GAME" is docked top-left of the gameplay screen (x 72, y 252), clear of the radar;
    the handle tag bottom-left of the cam. Tags are opaque from their first frame (clip-path wipe + back.out scale), and
    exit by wiping back. The colour-dodge impact light is gone. Gameplay ends on v21-race-topdown (-h, sharp) instead of
    v57. 5.52-5.9: the cam slab drops back out and the gameplay slab returns to centre (loop).
- Result r04 (critic): v0 8 (LOCKED, no defects; a/ is frozen from here), v1 7: "two separate bezelled tablets with a 14 px
  gap: four chrome rails across mid-frame", icon+handle pills read as a video-call tag, the cam tag sat on the beard, and
  the panes never showed their depth.
- r05 (v1 only; a/ untouched, VS-PREV v0 0.993): B rebuilt as ONE slab (1040x1274, y 206-1480, one window) with the two
  clips on one face and ONE seam: a polished divider bar (16 px rounded rod, 4 px proud of the bezel, ends buried in the
  inner chamfer) at y 866. The slab opens tilted (rx -0.28, ry 0.17, set back 150 px) and lands flat on the v56 wall
  break at 0.667 with v0's arrival-with-speed + 2.2 Hz settle; on the same frame the divider, which flew in from the camera
  side (z +380, tilted, motion-blurred), slams into its slot: 2-frame scaleY 0.94 squash, 3.2 Hz overshoot to ~1.02,
  settle; 5 px shake; a light runs out from the centre along the divider (4 raking lights, windowed to the seam, HDR bloom
  on the metal only). Tags are now tabs inlaid into the bezel at each pane's top-left corner (flush with the window edge,
  top-left radius = the window's corner radius, 2 px chrome rim on the exposed edges, inner shadow; "IN GAME" Inter 900
  66 px, the handle 54 px, no icons); the cam tab is tucked under the divider, and the cam crop moved right (focusX 700)
  so the tab sits on the background, not the face. Beds lifted to brightness .7 (lesson 17's ceiling), shadow -30%.
  Close: tabs retract into their corners, the divider lifts out and the slab tips back to the opening pose (loop).
- Result r05 (critic): v0 7 (same locked render; the r04 lock stands), v1 7 with 1 defect: the divider's fly-in reads as a
  stray 2 px line ~100 px above the seam that overhangs the bezel (0-0.6 s, 5.7-5.93 s). Hard stop after r05: not fixed.
  The critic also asked for a slimmer bezel (ring 3, bevel 5-6) so it reads as a lit edge, not a tablet mock-up. Tile:
  A r04 (8), B r04 (7, no defects). Note: b/index.html now holds the r05 one-slab build, not the r04 render the tile shows.
- r06 (third pass, v1 only; a/ untouched, VS-PREV v0 0.995). The r05 defect is fixed at its root: there is no fly-in.
  - The seam is a dark machined slot drawn in the face itself, so it is registered with the panes on every frame, even
    tilted. The rod is parented to the slab, seated at z 0 from frame 0, and rebuilt at its current length each frame
    (a pill profile, cached per 2 px). It grows from the centre of the slot to both edges (0.407-0.667, accelerating) and
    is never longer than the window, so it cannot overhang. It hits the bezel on the lock frame: a 2-frame scaleY 0.86
    squash, 3.2 Hz overshoot, a z bounce and a 5 px shake. Checked frame by frame over 0-0.77 s and 5.5-5.93 s.
  - The bezel is slimmed to a lit edge: ring 3, bevel 5 (radius 44), so the screen is 1014 px wide.
  - One payoff, now on a cut. The lock is the cut to v08 (fireball). The rod's tips carry a light while it grows; on the
    lock the rod flares (peak held 3 frames, then decays). Two light packets run out of each seam end up and down the side
    rails and die before the corners: an earlier test that ran them around all four corners read as a lit outline, so it
    was cut. Each light is a gaussian window, anisotropic along the rail. Bloom is tight (threshold .7, weights 1/.5/.22).
  - Sharp trailer shots only, every pane at about 0.6x: v45 beach aerial (tilt-in) -> v08 (lock) -> v17 deluxo
    -> v44 bridge skyline -> v21 race. v30 was tried and dropped: its muzzle flash blew out the seam area on the lock.
    v26 was dropped too: its explosion is a soft smudge.
  - It stays seated to the last frame (no mid-tilt ending). The tabs retract into their corners at 5.56-5.79.
  - The bottom bed shows only the desk side of the cam (object-position right, scale 1.5), so no blurred arm or face
    shows in the band. Brightness .6 / contrast 1.25: dark but warm.
- Result r06 (critic): v1 8, no defects. That locks v1, and the component is PASSED (sticky). The critic re-scored v0's
  unchanged r04 render at 7; the r04 lock stands. v1 nitpicks left: the rail bloom is white and spills ~20 px outside the
  slab, the tabs arrive with a linear wipe, the rod is a hairline at 360x640, and the "@" ink sits at x 70.
