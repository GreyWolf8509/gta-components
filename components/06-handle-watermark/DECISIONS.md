# 06 Handle watermark: decisions

## Evidence (both variants)
- The job: the creator's name stays on screen so re-uploads still credit them. 22 of the 106 videos carry one.
- Every evidence frame is a Short. The mark sits centred at the bottom (yt-dCXswKje8NE SMAXBOB at y≈89%, yt-5-QjENpFb98 RedDeadRagdolls at y≈89%, yt-wZhwEgpeg9c signature at y≈87%), in a corner (yt-ruZbW4MphOk @gtadrawing bottom-right, jumping corners between clips; yt-UbHlGkTHRUs lower-right) or top-centre (yt-lD9OGhd-xWE, yt-Mg6KF1jwwC4).
- Size: 12–45% of frame width, cap height 1.5–4.5% of frame height.
- Look: flat type at 25–80% opacity, no box. At best a white fill with a thin black outline and soft shadow (@gtadrawing), or an emblem plus a name (RedDeadRagdolls icon, the INDUSTRY GAMING wolf).
- Motion: static, or it jumps position between clips so it can't be cropped (@gtadrawing). Only INDUSTRY GAMING flashes in.

## Shared upgrade: the avatar is a real minted coin (Three.js, `media/coin3d.js`)
- The evidence's "emblem + name" becomes avatar + @handle. The avatar is the one object with physical depth, so it is real geometry (DESIGN lesson 24):
  - a lathe-turned gold rim with a rounded edge, a raised lip and a recessed bed;
  - the portrait under a domed glass cabochon, with an inner shadow from the rim wall;
  - an engine-turned gold back with an "@" struck in relief, seen whenever it spins.
- Lighting: PMREM studio environment (top softbox, right strip, dim kicker), a warm key, a hemisphere fill and ACES. A raking light crosses the rim and glass at the payoff.
- Everything renders from timeline time (analytic `coinAt(t)` driven by `Look.drive` and `hf-seek`). No RAF.
- The handle is two DOM layers. The back layer is an ink outline (0.14–0.15 em stroke) plus a contact shadow. The face layer is a satin gradient (#FFF → #C8D0DB) with a warm specular band. The "@" is gold (#FFE7A1 → #F6C453 → #E59A1C). Inter 800, −0.012 em.
- Portrait: Franklin, from `v06-franklin-lamar-portrait-h` at 1.15 s, front-lit 3/4 against blue sky.

## Variant A: Corner handle (16:9)
- **Evidence mapping:** the @gtadrawing corner mark that jumps corners so it can't be cropped, translated to long-form. Docked top-left 64/56 px from the edges, as persistent trackers dock (DESIGN §4). Width ≈ 25% of frame (coin 96 px, text 43 px once docked).
- **Shots:** v17 deluxo sunset (0–1.55) → v57 gameplay highway (1.55–3.4) → v11 yacht (3.4–5.4) → v44 bridge skyline (5.4–7.0). Each is ≤ its length, at 1.0×.
- **Motion:**
  - 0.15 s: the coin spins in 1.25 turns (power3.out) while scaling 0.3 → 1 (back.out), then a damped wobble.
  - 0.39 s: the handle pulls out from under the coin as one strip (expo.out, 12 px motion blur). Its letters start bunched against the coin and spring apart (back.out, stagger 0.012), so no letter crosses another.
  - **Payoff at 1.0–1.25 s (hero 1.12):** the coin seats (a 7.5% press and rebound), tilts 17°/23° into a raking light that crosses rim and glass, and blooms warm behind it. The light then runs out along the handle: a specular band, and each glyph blooms as the front passes.
  - 1.62 s dock: the mark shrinks 14% into its corner and drops to 70% opacity. This is the state change, from announce to watermark.
  - 3.4 s drift: the handle tucks under the coin, and the coin glides corner to corner. It makes two full turns about its axis (power2.inOut), with a 12 px hop and speed-matched motion blur, and lands with a wobble and a glint. The handle springs out on the inner side.
  - 6.2 s exit: the handle tucks in, then the coin turns edge-on as it shrinks into the corner (blur 6 px), cut on the zero frame. The tail is 0.26 s.

## Variant B: Typewriter handle (9:16)
- **Evidence mapping:** the centred Shorts handle (SMAXBOB, RedDeadRagdolls, E5 Game), placed bottom-centre as the evidence does, at the lowest safe slot: y 1415, under the 1050–1400 caption lane and inside the 1480 safe line. The lockup is centred at x 520, about 64% of width while typing and 54% at the hold.
- **The idea:** the caret is the avatar coin seen edge-on, which is exactly a rounded gold bar. On "enter" it spins open three quarters of a turn into the avatar. One object throughout.
- **Shots:** v17 deluxo (0–1.58) → v36 hills/city (1.58–3.48, payoff over dark hills) → v44 bridge (3.48–5.18) → v12 heli dusk (5.18–6.75).
- **Motion:**
  - 0.35 s: the caret springs in and blinks once.
  - 1.0–1.93 s: 14 keystrokes at a deterministic human rhythm (66 ms ± 15, with a beat after "@"). Each glyph lands 1.28 → 1 (back.out) with a 1-frame opacity attack and a small warm flash, and the caret glides after it (60 ms power3.out).
  - The caret blinks once more.
  - **Payoff at 2.48–3.1 s (hero 3.1):** the caret spins open 1.5π while growing to a 141 px coin (back.out), and slides to its lockup slot. A light runs along the handle into it: each glyph lifts 7 px and blooms. The coin seats, tilts into the raking light and blooms.
  - 3.62 s: settles to the semi-transparent hold (×0.84, 62% opacity).
  - 5.9 s exit: the coin closes back to an edge-on caret and backspaces the handle away, then the caret collapses. The tail is 0.19 s.

## Round log
- r01 (7/7, 1 defect): first build.
- r02, from the r01 critique:
  - v0 defect fixed: the handle is now one strip masked at the coin's centre line, with no per-letter accordion, so it can't tear or crush.
  - v0 drift: one turn instead of two. Blur is directional only (x ≤ 8 px), only at speed, and the last 0.15 s is sharp. The coin banks 7° into the glide and lands with a 2-frame squash (1.08 / 0.94).
  - Both payoffs: the radial haze is gone. The light now lives on the metal: a narrow emissive specular band crosses the bevel (and faintly the glass), the peak is held ≥ 3 frames, and exposure lifts +0.25 on the coin canvas only. The gold is deeper (1.0, 0.6, 0.17) so ACES keeps it gold at the peak.
  - v1 moved from y 1250 to y 1415: under the 1050–1400 caption lane and inside the 1480 safe line, even with the coin at full size.
  - v1 typing: starts at 0.3 s at 50 ms a key, reads in full by 1.0 s, with no lone-caret lead-in. The coin opens on the 1.58 s cut (hero 2.2).
  - v1 hold opacity 0.62 → 0.74. The coin slides to its slot ahead of its growth, so it never covers the '6'. The grown coin is 1.4× (123 px).
