# 43 Alert toast: decisions

## Variant A: Cheat toast (16:9)

**Evidence.**
- `yt-zvdxphGS07o` t01253 (5.8M views): the classic GTA help box, top-left (x 1–25%, y 2–8%). A square-cornered dark-grey translucent rectangle with white bold "Cheat Activated" at about 4% of frame height. It pops on with the cheat beat, holds briefly and has no motion design.
- `yt-0FV42j9xSV0` / `yt-fp1Ywp3MmUU`: stream alerts (sub cat, donation pills, the inflated "67" gift sticker). They pop in, sit in a corner for a few seconds and leave. They're flat, with tiny type.

**Our upgrade.**
- Same object in the same place. A square-cornered charcoal help slab is docked top-left at (84, 62), 152 px tall: about 2.5× the evidence's area, still a corner toast.
- Slab material: a 3-stop charcoal gradient, a 1.5 px lit top lip, a dark bottom lip, a faint brushed texture, an inner hairline and a two-layer contact shadow.
- A recessed badge well on the left with its own inner shadow.
- Hero object (lesson 24): the cheat's emblem as real Three.js geometry. It's a heater shield with a smooth-shaded bevelled chrome rim (metal, clearcoat, PMREM studio env, ACES), a clear-coated enamel field, a bevelled check standing proud of the enamel, and a closed back so the spin shows a solid object.
- The code is struck in on GTA-help-style keycaps (JetBrains Mono on lit-edge keys with a 3 px lip). Each key drops in, presses 3 px and releases.
- **State change at 1.50 s, on the cut to the street explosion:**
  - the shield punches (+20%) and spins a full turn (back.out);
  - edge-on, it swaps from slate enamel with a dead steel check to green enamel with a white-hot check (3-frame emissive peak);
  - the key light swings across and peaks, then a soft specular band rakes the face;
  - a green wave runs across the keys, the spine fills bottom-up, the top edge lights left to right and a sheen crosses the slab;
  - the header rolls "ENTER CHEAT" → "CHEAT ACTIVATED" through a masked window;
  - "INVINCIBILITY" slides out from behind the last key;
  - a green halo blooms behind the shield and the plate gets a small shake (flash 0).
- **Entrance:** the shield spins up from 12% with blur, and the slab wipes open from behind it (clip-path, slide and directional blur).
- **Exit:** text rolls out, keys drop through a mask, the slab collapses back into the shield, and the shield spins away edge-on.
- **Facts:** PAINKILLER = invincibility is a real GTA V cheat (PC/phone).

**Shots.** v54 gameplay firefight (HUD) 0–1.5 → v30 street explosion (payoff) 1.5–3.1 → v09 juggernaut 3.1–4.3 → v26 bridge explosion 4.3–5.8.

**Payoff:** 1.50 s (lock-in). Hero frame 2.3 s.

## Variant B: Phone notification (9:16)

**Evidence.** The donation pill (`yt-fp1Ywp3MmUU` t00116): a tier-coloured rounded pill with an avatar, a bold name and the amount right-aligned. The jewel-gift sticker (t00068): an inflated 3D "67" with the username in pink under it. The brief asks for a phone-style notification on a Short.

**Our upgrade.**
- A phone banner drops into the top of the Short (x 72–936, y 240): light frosted glass, a radial highlight, a white top lip, a hairline and a deep two-layer drop.
- Our own app icon: a glossy pink-to-purple squircle with a white live-signal mark.
- iOS-style hierarchy: app name and "now", a bold title, and a body with the amount bold in the tier colour.
- **State change at 1.60 s, on the cut:**
  - the banner springs open into a rich notification (204 → 640 px, back.out);
  - a tier-coloured panel appears (pink for $500; teal and orange tiers in CONFIG, like the stream pills);
  - the amount inflates out of it as real Three.js numerals: Archivo 900 outlines extruded with a deep round bevel (balloon profile), smooth normals, pearl clearcoat with a pink sheen, and pink floor bounce in the env. Glyph by glyph with squash and stretch, they pop up 70 px;
  - light lands at 2.08 s: a 3-frame panel lift, a key-light peak, a soft rake across the numerals and a sheen across the panel;
  - the tier label rolls up.
- **Hold:** a subtle idle bob, then a second rake at 3.7 s.
- **Exit:** the numerals deflate, the card collapses and swipes up with blur.

**Shots.** v24 sunset power lines 0–1.6 → v12 heli city dusk (payoff) 1.6–3.15 → v39 lowriders 3.15–4.33 → v44 bridge skyline 4.33–6.05.

**Payoff:** 1.60 s (expand) / 2.08 s (light). Hero frame 2.6 s. *(r04: one landing frame at 1.60 s for the slam and the light; see the round log.)*

## Round log
- r01: first build.
- **r02 fixes.** The r01 critic scored 7/7 with one defect: torn bevels on the 3D "$" and "5".
  - **A:**
    - The lock-in now lands on the 1.50 s cut. The spin starts 3 frames early so the edge-on state swap is the cut frame; keys, spine, edge, sheen and the plate shake all fire on 1.50.
    - The slab punches 1.05 (elastic) on the cut. The sheen is a stronger green-white specular band, and there's a deeper bottom inner shadow.
    - The keys are bigger (37×46, 26 px). At 2.05 s they roll out and INVINCIBILITY rolls up in their place at 40 px, through the same masked window. It used to be 30 px on line 2, which was too small at phone size.
    - The shield is bigger (half-width 58) and enters lit and turning from 30% (no dark back-face speck). The back plate is steel. It collapses to zero on exit with a cut on the zero frame.
  - **B:**
    - The torn-bevel defect is fixed by rebuilding the numerals. The geometry keeps a small clean bevel (3/6 px). The inflated balloon form now comes from a distance-field normal map (exact EDT of the outlines, quarter-circle profile R = 19 px) on the front faces, and it drives the clearcoat normal too. That gives real specular roll-off instead of matte clay.
    - All 4 glyphs slam together on the 1.60 s cut; the panel opens 0.12 s ahead.
    - A 3-frame light hit lands at 1.80 s (panel lift, key-light peak, 0.35 s power3.inOut rake across the digits).
    - The card is phone glass (80–84% white with backdrop blur 30 px and saturate 1.6).
    - The tier label has no separator dot; TOP DONOR is set in a chip.
- **r03 (B only; A is locked at 8).** The r02 critic gave v1 a 7: the top half read as an iOS-notification clone, the job match was partial, the numerals were matte with creases, the exit blur was backwards, and the bg:none header was milky.
  - **The alert is now the creators' donation pill**, delivered like a phone banner. It's a fully rounded, tier-coloured candy pill (gloss cap, white lip, inner bottom shadow) with:
    - a plum avatar disc with an initial and a white ring;
    - a heavy-caps username at 54 px in dark ink, as in the evidence pills;
    - "NEW DONATION · now" meta;
    - the amount right-aligned in white.
    It drops in from the top. On the cut it opens (the radius morphs from pill to card) into a recessed tray, and the 3D amount inflates out of the tray.
  - **The numerals are gold foil balloons:** metal plus clearcoat, a warm studio env with a frontal card, a magenta floor and a raking key at about 35°. The height field is box-blurred, so corner creases round off.
  - **Other fixes:**
    - one centred chip, "TOP DONOR · THIS STREAM";
    - the exit blur follows speed (the blur peaks as the swipe accelerates, and the card is cut on the frame it clears the top);
    - the pill is opaque in bg:none.
- **r04 (B only; A is locked at 8, a/ untouched).** The r03 critic gave v1 a 7: "$500" twice in the hero, a mushy payoff (empty panel for about 4 frames, staggered digit pops, a sweep 0.3 s late), cream/rose numerals and a dim night-city bed.
  - **The amount shows once.** "$500" sits right-aligned on the pill as in the evidence. At 1.40 s it rolls down out of its masked slot, toward the tray, and is gone by 1.49 s. The first numeral pixel appears at 1.533 s. "TOP DONOR" rolls into the same slot at 1.70 s, through the same kind of window, with no overlap. The tray chip is gone, so the tray holds only the hero.
  - **One landing beat at 1.60 s, on the cut.** The tray is attached to the card's bottom edge and shoots out from under the pill. It's 46%, 73% and 100% open on the three frames before the stop, so the numerals are in view, already seated, from its first frame. On 1.60 s, in the same frame:
    - the tray slams to its stop, with a damped 22 px bounce;
    - the numerals squash onto their baseline (scaleY 0.90 to 1.03 to 1) and the floor shadow spreads;
    - the key light spikes and swings in from the left;
    - a warm bevel bloom fires (emission weighted to the stroke edges by the normal map; 3-frame hold);
    - the clipped rake is already on the "$" at full strength and crosses in 0.3 s;
    - the panel glow peaks, the header sheen starts and the plate shakes.
    Then it holds for 3.6 s, with a soft second rake at 3.55 s.
  - **True gold.** Metal, F0 (1.0, 0.62, 0.17), roughness 0.24, no clear coat (the dielectric coat was washing it to cream). No tone curve, so it stays saturated and hot spots clip warm. The env is a dark warm studio: top softbox, line light, white left strip, amber right kicker and a dim gold frontal card. There's no pink in the env, so no rose cast. Each stroke reads bright top band, then rich gold, then a dark brown underside.
    - The tray is deep wine (#8C1046 to #4C0526), so the gold pops.
    - The "$" rod is 1.45x thicker.
    - The numerals are bigger: cap 196, ink about 66% of the frame width.
  - **Footage: the Shorts layout for landscape gameplay.** The -h shot plays at exactly 1.0x in a full-width window from y 840 to the bottom, over its own graded blur (-v, blur 34, brightness 0.68, contrast 1.16, saturation 1.35). The alert lives in the top band. Shots: v24 sunset power lines, then v44 bridge skyline (the payoff, bright and sharp), then v39 lowriders, then v11 yacht. Incoming shots start 2 frames early underneath.
  - The meta line is 30 px at 0.06em.
  - **Exit:** the tray retracts under the pill (blur on the move), then the pill swipes up and is cut on the frame it clears the top.
