# 65 · Scale slider: decisions

## Variant A: choice slider (16:9, 1920×1080, 5.8 s)

**Evidence.** `yt-o4nNjj44d4M` t00503 (3.8M views; t00507 shows the next state). A translucent dark-purple rounded card with a pink glow border, top-left at x 5–49 %, y 10–34 % (≈ 830×260 px). Inside: tiny tracked caps kicker "ONLY WHAT YOU NEED", a yellow fist icon + bold white "VIOLENCE", then a thin white track with a glowing white knob and four tiny caps stop labels (THREATEN · PUSH BACK · TAKE DOWN · LETHAL), the active one brighter. Motion: the knob slides between stops (TAKE DOWN at t00503, THREATEN at t00507). Flat vector UI: one-px track, flat fill, no light.

**Our upgrade.**
- **Same card, same place, slightly bigger:** x 96–996, y 86–390 (900×304), top-left. The card is a real Three.js slab: rounded extrusion 24 px deep + 8 px bevel, a 2-stop deep-purple glossy face (clear coat, PMREM studio env) with anodised violet metal sides that catch the key light, a pink neon inlay tube around the face with a soft outer glow (the evidence's pink border), and a soft contact shadow on the footage. Mild 3D tilt (ry 0.16 → 0.10 drift) for parallax.
- **Track = machined slot:** a dark glossy recessed channel inside a violet metal lip; a liquid-light fill (cyan → violet → pink → red, CALM → CHAOS) with a hot core line, a top specular strip and a glow that spills on the slab; the unfilled channel shows the ramp dimmed so the scale reads before it fills. 13 machined tick pegs that light in ramp colour as the fill passes.
- **Knob = chunky 3D fader cap** (58×100, 44 px deep, clear-coat white ceramic, LED slot in ramp colour) with inertia lean, detent overshoot at each stop and a soft contact shadow.
- **End stop:** a red glass dome in a chrome ring beyond CHAOS.
- **Type:** Inter 800 tracked kicker, Archivo 900 (75 %) 76 px title with our own flame icon, Inter 900 tabular readout (0–100 %), Inter 800 stop labels. All DOM, pinned to projected 3D anchors.

**Payoff (3.00 s).** Knob walks CALM → ROWDY → RECKLESS with detent clicks, winds back (2.55–2.82), then slams into the end stop on the cut to the explosion shot: 1.4× stretch during the slam, 0.74 squash on contact with a spring, inertia lean flip, two decaying rebounds; the dome flares red (3-frame peak), the knob turns glossy red, a red point light rakes the slab, a red bloom sits behind the knob only, a shock ring and a few embers leave the contact point, the fill and neon flip to red, CHAOS slams in red, readout locks at 100 %. Footage shake 6 px, flash 0.

**Shots.** v17 deluxo sunset 0–1.6 (calm) → v52 police bridge 1.533–3.0 (escalation) → v30 street explosion 2.933–4.6 (payoff on a bright sharp -h shot at 1.0×) → v26 bridge explosion 4.533–5.8. 2-frame overlaps, incoming clip underneath.

**Exit.** Labels roll out through their masks (4.95), then the slab tips back and collapses (5.05–5.33) with a 6 px blur, cut on the zero frame. 0.47 s footage tail.

## Variant B: vertical slider (9:16, 1080×1920, 5.8 s)

**Evidence.** Same object, the brief asks for a vertical slider for a Short with the knob rising. Phone-first (lesson 26): no card (a big card reads as an app widget at 360×640); the hero is a big 3D vertical fader spanning x 182–852 (≈ 62 % of the width).

**Our upgrade.** The same slot/fill/knob/end-stop system scaled for phone: channel 46 px wide over y 680–1440, a 236×112×70 ceramic knob carrying the live readout (Inter 900 72 px tabular) on its face, a 26 px red dome above CHAOS. Stop labels are Archivo 900 (66 %) 100 px caption type with a dark stroke, right of the track; header kicker 34 px + "VIOLENCE" 150 px in the hook band. A radial dim keeps the blacks under the hero.

**Payoff (3.00 s).** Identical beat to A, vertical: the knob slams up into the dome, turns red, readout locks at 100 %, CHAOS slams in red at 1.18×.

**Shots.** -v versions: v17 → v52 → v26 bridge explosion at the payoff (wide landscape, detail survives) → v44 bridge skyline tail.

## Round log
- r01: first build. Self-review before the critic: the CHAOS cap read pastel pink, so it is now a saturated glossy red (face 0.92/0.07/0.11, emissive 0.1–0.42); bigger, stronger knob-local bloom; the shock ring is a soft thick red ring instead of a hairline; a white-hot 3-frame flare on the dome; bigger domes (A 19, B 32); the knob drop no longer flies in from off-frame (lift 150/180 px + scale 1.5/1.4); the A card moved 16 px right with less tilt (ry 0.13 → 0.08) so its edge stays near title-safe; the A slab collapses face-down (no lilac flash); B's track retracts into CALM with the knob riding down instead of leaving a "T".
- r01 verdict: v0 8 (locked), v1 7; one defect in both (a repeated frame at 1.567 s because v17's last frame was requested).
- r02: **v0** only the listed defect: s1 ends at 1.533, s2 starts 1.467 underneath (media-start 0.534 keeps the footage in sync). **v1** (critic: murky soft payoff shot, invisible payoff light, white chip knob reads as an app toggle):
  - plate rebuilt as the Shorts blur-fill: every shot is the -h master at exactly 1.0× (centre 1080 px) in a band at y 470–1550, over a blurred, dimmed copy of itself; no push, so the band never exceeds 1.0×. Payoff now cuts to v30 street explosion (fireball in frame), tail v26. Blurred copies are offset by a frame so the renderer never de-duplicates them; no clip requests its final frame.
  - payoff light on the object: additive knob-local red bloom (3-frame peak, plate only), a white light sweep racing up the 13 ticks into the slam (0.12 s, bottom → top), dome flare and soft thick red ring; the cap turns red in 0.07 s and the readout flips to white only once the cap is red.
  - knob is a lavender bevelled ceramic body (240×116, 13 px bevel) with recessed grip ribs and an underline LED lit in the current ramp colour, so red at CHAOS is the last step of a progression.
  - lighter dim (radial .30/.18, top .45) plus a bottom gradient over the blur zone.
- r02 verdict: v0 8 (locked), v1 7; one v1 defect (the 100 % readout outgrew its pill on the slam frames because it inherited the knob's cross-squash and a 1.2 punch).
- r03 (v1 only; v0 untouched): the readout no longer scales with the squash and its punch is capped at 1.06; the pill is 256 wide with 2 ribs a side (≥ 18 px clearance); the cap turns red on the contact frame, together with the dome flare; the stop labels are now white Archivo caption type with a 4 px stroke and a soft dark legibility halo (not-yet-reached and post-payoff stops at 0.78 opacity, the active stop full white with a ramp glow, CHAOS red); the glass tube is thicker (66 px slot, 80 px with the lip) with a stronger specular stripe; labels moved to x 470.
