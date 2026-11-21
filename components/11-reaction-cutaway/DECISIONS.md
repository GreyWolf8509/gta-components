# 11 Reaction cutaway: decisions

## Variant A: "Webcam cut" (16:9, 1920x1080, 5.2 s)

**Evidence.** Long-form creators (yt-gVyZUp6IWV4 t00064, yt-0FV42j9xSV0 t00865, yt-Vom5ya5cbQY t00068) run gameplay with a
small facecam box docked top-left or top-right (t00861, t00064 neighbours), then hard-cut to the same webcam full-bleed 16:9,
no frame or text, held 2-8 s, and hard-cut back. Its job: the creator's face reaction, full screen, as the punchline to a
gameplay moment. Rough edges: upscaled soft webcam, no motivation for the cut, no beat, a dead hard cut back.

**Our upgrade.**
- Gameplay (v56 tow-truck crash) with the creator's facecam docked top-right as creators place it (456x256, 56/48 px from the
  edges), a built frame: 5 px lit ring (white top to cool grey bottom), 1.5 px ink keyline, glass top sheen, inner shadow,
  two-layer contact shadow.
- Hard cut to the full-frame webcam on the frame the wall bursts (1.30 s), the speech continuous across the cut (same media time).
- 7 frames later the beat: a snap punch-in on the face (1.0 -> 1.21 in 3 frames, settle to 1.18 with back.out), 2-frame
  zoom-softness, decaying shake (amp 12), a 4 px chroma kiss and an exposure lift on the room lamps (peak 1.12, blacks hold).
- The reaction word "NO WAY!" is real geometry (lesson 24): Archivo 64/900 outlines extruded and bevelled in Three.js, slammed
  in on the punch (scale 1.7 -> squash -> back.out spring, vertical motion blur), landing white enamel, then a light front
  ignites it to polished caption gold with a raking key, a soft specular sweep and HDR bloom (the state change).
- Return: a whip-pan, both clips on one strip (power3.inOut, 0.30 s) with up to 70 px horizontal motion blur at the seam; the
  gameplay arrives with the facecam box riding in on it, on a bright sunset driving shot (v17).

**Shots / cuts.** v56 gameplay 0-1.30 (media 0.30-1.60) | webcam 1.30-3.90 (media continuous) | v17 3.60-5.20.
**Payoff.** 1.53 punch + word slam; 1.76 ignition to gold. Hero 2.3 (settled gold).

## Variant B: "Vertical reaction" (9:16, 1080x1920, 5.2 s)

**Evidence.** The 16M-view Short (yt-UbHlGkTHRUs t00007.5-t00012): the 16:9 gameplay band sits in the centre with a blurred
copy filling above and below and the facecam inset in the band; the reaction hard-cuts the band to the webcam with the same
blurred fill made from the webcam, then hard-cuts back.

**Our upgrade.**
- Same band layout (1080x608 at y 656, native -h footage so it stays sharp) over a graded blurred fill (blur 40, brightness .7,
  contrast 1.12, saturation 1.25: keeps blacks, no grey veil), with a soft shadow cast onto the fill so the band floats.
  Facecam inset in the band's top-right inside the safe x (584-924).
- The takeover: hard cut on the crash, then the band springs open from 608 to a 1080x1280 window (back.out overshoot) and the
  webcam scales with it to 1.19x (stays sharp, no full 9:16 upscale, lesson 21); shake + punch on the face as it lands.
- The same 3D "NO WAY!" word slams in over the chest (cap centre y 1320, ink 760 px inside x 130-925) and ignites.
- Return: whip-pan back to gameplay while the band collapses to 608, fill whips with it.

**Payoff.** 1.62 window lands + word slam; 1.85 ignition. Hero 2.35.

## Round log
- r01: first build (critic r01: 8/8, PASSED). Self-review fixes inside r01: punch-in raised to 1.30/1.26 (A) so the reframe reads; B window opens to
  1080x1280 (webcam 1.19x) instead of the square, so the webcam owns more of the frame; the whip blurs both screens as one
  image (one filter on a wrapper, alpha renormalised) so the seam and frame edges never go dark; slam start scale 1.4/1.3.
