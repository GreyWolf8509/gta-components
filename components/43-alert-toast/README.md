# 43 Alert toast

The pop-in alert creators drop on a beat. In long-form it's the "Cheat activated" help box top-left. In streams and Shorts it's a donation or sub alert.

- **A, Cheat toast (16:9, long-form):**
  - the GTA help box docked top-left;
  - the cheat code is struck in on keycaps;
  - on the lock-in, a real 3D shield emblem spins and ignites green, and the header rolls to CHEAT ACTIVATED.
- **B, Phone notification (9:16, Shorts):**
  - the creators' tier-coloured donation pill drops in at the top like a phone banner;
  - on the beat the amount drops out of the pill, and a tray slams open beneath it with the amount seated inside as real 3D gold numerals (slam, squash and light on one frame);
  - "TOP DONOR" rolls into the pill's amount slot.
  - The sample footage uses the Shorts layout for landscape gameplay: the 16:9 shot at 1.0x in a full-width window over its own blur.

## CONFIG

**A:**
- `header.before` / `header.after`: the header before and after the lock-in.
- `code`: keycap text.
- `name`: the cheat's effect.
- `pos`: the slab's top-left corner.
- `colors`: accent, enamel off/on, steel.
- `timing`: `in`, `type` (first key), `step` (per key), `act` (lock-in), `out`, `end`.

**B:**
- `label`, `when`: the meta line ("NEW DONATION · now").
- `user`, `initial`: the username (shown in caps) and the avatar initial.
- `amount` and `currency`: the 3D numerals use `$0-9 , . + K`.
- `tierText`: the word that rolls into the pill's amount slot ("TOP DONOR").
- `tiers`: pill and tray colours by minimum amount.
- `card`: x, y, width, collapsed and expanded heights.
- `timing`: `in` (drop), `swap` (amount leaves the pill), `open` (the tray starts), `pop` (the landing frame: put it on your beat), `out`, `end`.

To change the numeral font or characters, regenerate `b/media/glyphs.js` with `b/media/gen-glyphs.js` (fontkit).

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                 # over the sample footage
```
Same for `b/`.

## Your own clip
- Replace the `<video class="clip shot">` sources in `#push`, keeping the data-start / data-duration / data-media-start attributes.
- Or render `bg:none` and lay the webm over your edit.
- Move `timing.act` (A) or `timing.pop` (B) onto your beat. For B, keep `swap` about 0.2 s and `open` 0.1 s before `pop`.
- B's sample layout: the `#bed` videos are the blurred fill (any crop), and the `#win` videos are your 16:9 clip at 1.0x.

Keywords: cheat activated, help text, GTA cheat, alert, toast, notification, donation alert, tip alert, sub alert, phone banner, 3D numbers, stream alert.
