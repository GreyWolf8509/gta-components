# 25 Sponsor card: decisions

Fictional sponsor for both variants: **AFTERBURN ENERGY** (our own name, lettering and can art; no real brand marks).
Palette follows the strongest evidence card (yt-Vom5ya5cbQY t00084, Good Kernel): sponsor red + caption yellow + white, ink outlines.

## Variant A: "Tiers + QR" (16:9, 1920x1080, 6.3 s)

**Evidence.**
- yt-KedfEMhQdP8 t00526-t00538: the read cuts to the sponsor's pricing page: green condensed tier headings, price cells, an orange "New customer offer" tab, and a black-on-white QR fixed bottom-left (~13% of frame width). Flat web UI, slow pans.
- yt-Vom5ya5cbQY t00080/t00084: a red/white card with yellow outlined heavy caps, a QR in the middle and a "SHOP ..." strip; 21% x 45% of frame, top-left, holds for the whole read. Hard cut in, no motion.
- yt-mCDH5KnBx9o t01822: product cut-outs plus a bold CTA line.
- Job: during the ad read, show the product, the price tiers with the deal pushed, and a QR to scan. Big, held for seconds.

**Our upgrade.**
- The card is a real Three.js slab (640x820, 22 px thick, 6 px rounded bevel): glossy red clearcoat face, red-metal edge that catches the studio environment as it swings in.
- The product is a real 3D can (lathe-turned aluminium neck, rolled lip, lid with tab, printed label wrap with vertical AFTERBURN lettering) that stands proud of the card's top-left corner, casting a soft shadow on the card, idling in a slow turn.
- Three tier chips are separate white bevelled tiles that drop into recessed wells on the card with a squash and contact shadows.
- QR on a white tile, crisp 5 px modules (real code, scans), with "SCAN FOR / 30% OFF / url".
- Motion: card swings in from the right on a spring (rotY 0.75 -> -0.10 rad, x +900 -> 0) with horizontal motion blur; the can follows through with a spin.

**Payoff (2.50 s, on the cut v28 -> v11).** The CREW PACK chip presses (z -4), then lifts 46 px off the card on a spring and scales 1.07; its face wipes white -> gold; the price rolls $48 -> $39 in masked digit columns and a struck "$48" slides in; a BEST VALUE tab slams onto its corner; a specular band and a raking light cross the chip bevel and card; the other chips dim to push focus; the can spins one turn. The peak exposure on the chip is held 3 frames.

**Shots.** v28 tennis mansion 0-2.5, v11 yacht 2.5-4.6, v44 bridge skyline 4.6-6.3 (all 1.0x, slow push). Card covers the right third; footage stays readable left.

**Exit 5.6 s.** Card accelerates back out to the right with blur; the can leaves first. Tail 0.3 s.

## Variant B: "Code lower third" (16:9, 1920x1080, 6.25 s)

**Evidence.**
- yt-Vom5ya5cbQY t00124: "AT [retailer]" badge bottom-left (x 1-17%, y 64-94%), product box with a soft cyan-white glow, pops in during the read.
- yt-Vom5ya5cbQY t00320: blue rounded tag with a tee icon and "SHOPCAYLUS.COM", 23% x 7%, static.
- Job: a compact plug that keeps gameplay running: product + where to buy / the code.

**Our upgrade.**
- Product shot is the same real 3D can, bottom-left, with a warm yellow glow bloom behind it (the badge glow, done as light).
- A red glossy 3D plate hinges out from behind the can (real thickness visible mid-swing, spring overshoot).
- The code chip is an ink tile with a bevel; EVEREST30 types in character by character with a pop per key and a caret.

**Payoff (2.45 s, on the cut).** Lock-in: the code chip presses 6 px with a 2-frame squash, rebounds, its face wipes ink -> yellow and the text flips to ink; a specular band sweeps chip + plate; a white 30% OFF sticker slams onto the plate's corner; the can spins one turn and the glow pulses.

**Shots.** v28 0-2.45, v11 2.45-4.55, v44 4.55-6.25.

**Exit 5.5 s.** Sticker pops off, plate hinges back behind the can, can drops and shrinks out.

## Round log
- r01: first build. Critic: v0 8 (locked), v1 7 (constant outer glow on the can, half-empty bar, 14-18 px secondary type, stock scalloped sale seal, can over the radar zone, can idles away from camera).
- r02 (v1 only; v0 frozen): constant halo removed (bloom on the can only at the lock-in, 1-frame attack, 3-frame hold) plus a warm rim light from behind-left and the can's shadow on the plate; plate 780x190 with AFTERBURN 62 px, ENERGY 21 px, USE CODE 23 px, code 58 px in a 442 px tile that runs to 40 px from the plate edge; the confirm is now a visible press (tile sinks 4 px, shrinks 4.5%, darkens, springs back on back.out(2.4)) before the gold wipe; the can whips one turn that lands face-on on the lock-in and only sways +-0.14 rad after (brand faces camera through the hold); the scalloped seal is replaced by an ink tab with gold-foil "30% OFF" (wordmark system) that slams from scale 1.6 / -18 deg to 1 / -6 deg over the tile's corner; the whole unit moved up to bottom y 930 so the radar is clear; specular band narrowed (40 px) and kept faint on the plate.
- r02 critic: v0 8 (still locked), v1 7: plate rendered coral with little material, the 30% tab slammed across the code on the beat, the can grew from a speck that sat on the court, the code tile dropped from too high and swept over USE CODE.
- r03 (v1 only): brand red deepened (#F0303A / #D0101E / #7E0812), radial wash removed; key light confined to the top 40 px, a 2 px lit top bevel, a 10 px inner bottom shadow and one faint diagonal acrylic reflection; the plate rests angled 0.1 rad toward frame centre (a sign in depth); the can flies up from below the frame edge on a spring (f 2.4, z 0.67, ~6% overshoot) with vertical motion blur and leaves the same way; the code tile drops only 40 px (scale 1.03 -> 1); the press is a squash (scaleY 0.92 / scaleX 1.03) released on an under-damped spring (f 3.5, z 0.28, ~+3%); the 30% OFF tab now lands on the plate's top-right corner from above-right, 0.08 s after the gold fill completes, and never crosses the tile.
