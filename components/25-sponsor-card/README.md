# 25 Sponsor card

The sponsor / merch read graphic. Long-form GTA creators put it up during the ad read (often 10+ s): the product, the deal, and a QR code or discount code. Two variants, both 16:9 overlays (they also work in a 9:16 edit if you scale the overlay down).

- **A: Tiers + QR** (`a/index.html`, 6.3 s). A glossy 3D sponsor card swings in from the right with the product can standing proud of its corner. Three price-tier tiles drop into their wells; the best tier locks in (lifts, turns gold, price rolls down, BEST VALUE tab). Scannable QR + "SCAN FOR 30% OFF". Use it for the main ad-read segment.
- **B: Code lower third** (`b/index.html`, 6.25 s). A compact plug bottom-left, sitting above the GTA radar: the can pops in, a 3D plate hinges out from behind it, the discount code types into a coupon tile, the can whips a turn and lands face-on as the tile is pressed and locks in (gold fill, tick, bloom on the can), and a gold-foil 30% OFF tab slams onto the tile's corner. Use it to keep gameplay running while you read, or as the recurring reminder.

Everything 3D is Three.js r160 (`media/sponsor3d.js`, identical copies in a/ and b/), rendered from timeline time (seek-safe).

## CONFIG
A: `brand` (name, sub, tag), `tiers[]` (qty, unit, name, note, price, optional `was` + `best:true` for the tier that locks in), `bestLabel`, `qr` (path to a 1-px-per-module PNG; the sample encodes https://everestchris.com), `scan` (3 lines), `canFoot`, `colors` (card, edge, accent, ink, chip, gold, price, can label), `card` (centre and size), `timing` (in, payoff, out, end).

B: `brand`, `label` ("USE CODE"), `code`, `tab` (the discount line), `canFoot`, `colors`, `can` (x, bottom, R, H), `plate` (left, top, w, h): move `can` and `plate` together to re-anchor (the default bottom at y 930 keeps the radar clear), `timing` (in, type, perChar, payoff, out, end).

The can label is drawn from `brand` + `colors.can*` (`S3D.drawLabel`), so a rename re-skins the product too.

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                 # over the sample footage
```
Same for `b/`.

## Your own clip
Replace the `<video class="clip shot">` sources (keep `data-start` / `data-duration` / `data-media-start`, never past the clip's length), or render `bg:none` and lay the webm over your edit.

## Keywords
sponsor, ad read, merch, promo code, discount code, coupon, QR code, price tiers, pricing, best value, product card, energy drink, lower third, GTA 5, GTA Online, YouTube
