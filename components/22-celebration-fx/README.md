# 22 Celebration FX

The milestone hit GTA creators drop over gameplay: money raining over the screen when the cash lands, or a power-up ring and a confetti
burst on the subject when something levels up. Overlay kind: both variants render transparent with `bg:none`.

- **A, `a/index.html` (16:9, long-form):** 3D money rain. Fictional "Los Santos 100" bills as real bent, fluttering paper with a satin
  clearcoat and a foil ribbon; a money-gun burst from the bottom edge, a hero bill that flips to the lens, then rain from above.
  Depth of field and real motion blur.
- **B, `b/index.html` (9:16, Shorts):** a cyan power-up aura round the subject's shoulders, built as a real lit 3D object: a thick
  glass torus full of plasma with a white-hot braided filament twisting inside it, a key-light specular band and a glass rim, crowned by
  faceted crystal barbs. It draws on, then locks in on the cut (the tube inflates, runs white-hot, the barbs erupt, a light rakes round
  the glass, a shockwave, wing slashes and a few embers), with two foil confetti cannons (gold, pearl iridescent, cyan).

## CONFIG

A (`a/index.html`):
- `notes`: the front/back colour PNGs and their ORM maps (R bump, G roughness, B metalness). Rebuild with `/usr/bin/python3 a/media/make_notes.py`.
- `burst.at` / `burst.count`: when the money gun fires and how many bills; `burst2`: the smaller burst on the cut.
- `rain.from` / `rain.count`: rain start and bills; spawn times are solved so every bill is gone by `timing.clear`.
- `hero.apex`, `hero.x`, `hero.y`: when and where the hero bill faces the lens.
- `dof.nearBlur` / `dof.farBlur` (px), `motionBlur.samples` / `motionBlur.shutter` (frames), `light.exposure`.
- `light.shots`: one entry per shot (`until` = cut time): key colour `key`, strength `ki`, direction `from`, `rim`, fill `sky` / `ground` / `fill`,
  reflection environment `env` (`day`, `sunset`, `sea`). Match these to your own shots.
- `timing.clear`, `timing.end`.

B (`b/index.html`):
- `aura.color`, `aura.center` (px), `aura.radius` / `aura.tube` (px), `aura.tilt`.
- `aura.barbs`: one `[angle deg, out 1 / in 0, length px]` per crystal barb; `aura.barbBase` (root half-width, px); `aura.braid` (strands, twists).
- `aura.track`: the subject's head per 0.1 s as `[s, centre x, top y, width]` in footage px. It drives the head matte (the far arc passes
  behind the head), the light wrap and the ring follow (`aura.follow`). Re-measure it for your own clip.
- `subject.matte` / `subject.lightWrap`: the head matte and the cyan light on the subject are fitted to the sample clip. `"plate"` (default)
  uses them only over the sample footage, so the transparent render has neither; `true` keeps them on `bg:none` too, `false` turns them off.
- `aura.slash` (wing-slash half-span / tip height, px), `aura.wrap` (peak, hold, shoulder and hair ellipses), `aura.embers`.
- `confetti.count`, `confetti.streamers`, `confetti.colors`.
- `timing`: `drawOn`, `payoff` (the lock-in, put it on your cut), `collapse`, `gone`, `clear`, `end`; `camera.push` / `camera.kick`.
- `dof`, `motionBlur` as in A.

## Render

```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                 # over the sample footage
```
Same for `b/`.

## Your own clip
Swap the `<video>` `src` (keep `class="clip"`, the ids, `data-start` / `data-duration` / `data-media-start`), or render `bg:none` and lay
the webm over your edit. For B, set `aura.center` on your subject and `timing.payoff` on your beat; refill `aura.track` for your subject, or set `subject.matte` to `false`.

Keywords: money rain, make it rain, cash rain, dollar bills, banknotes, money gun, confetti, confetti cannon, power-up, aura, energy ring,
level up, milestone, celebration, GTA 5, GTA Online, Shorts overlay.
