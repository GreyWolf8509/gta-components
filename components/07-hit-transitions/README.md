# 07 Hit transitions

The cuts GTA editors throw between clips: whip pans, zoom punches, speed-line shake hits, VHS colour-bar tears, flash hits and dips to black. These are full-frame footage treatments, not overlays. Every top GTA channel (long-form and Shorts) cuts with some of these. This pack does them the way a motion designer would: the whip blur comes from the image's real velocity; from the zoom on, a WebGL pass draws each frame from the footage itself, with a true radial shutter blur (48 jittered taps, sharp centre, streaking edges), light added from the footage's own highlights (threshold bloom, highlight-only exposure) instead of a grey veil, a real VHS signal model, and a luma dip where the shadows go first.

- **Variant A, `a/index.html` (16:9, 1920x1080, 7.2 s, "Transition pack").** Long-form. Whip pan 1.40, zoom-through punch 2.80, speed-line shake hit 4.20 (the payoff: lines rush inward over the outgoing shot, converge on the cut over an explosion, burst outward; warm core, bloom, shake), luma dip to black 4.90 with a hold on black and a highlights-first rise into the yacht on the beat at 5.60.
- **Variant B, `b/index.html` (9:16, 1080x1920, 7.07 s, "Vertical pack").** Shorts / TikTok. Slide-split 1.40 (three slabs with motion blur, cast and contact shadows and lit edges, then a lock-in kick), VHS colour-bar tear 2.80, zoom-through punch 4.20 (the Deluxo rushes the lens, the glass tower lands out of it), flash hit 5.40 (the payoff: the tower's own sun glare blooms into the cut under a radial suck-in; on the bridge's first 3 frames a hard exposure punch: the skyline's tall tower goes white-hot with a tight bloom, the lit steel and sunlit concrete go near-white, the shadows go deeper and the sky is held (and deepened) by a skyline matte, under a 1.38 back.out punch and a 52 px shake; it releases in about 0.2 s, then a 1.37 s settled hold).

A's cuts sit on a 1.4 s beat grid; B's last cut comes 0.2 s early so the pack accelerates into the payoff. Retime by moving the `CONFIG` times and clip windows together.

## How it renders
The DOM draws the opening move (A's whip to 2.60 s, B's slide-split to 2.67 s). From then on a WebGL2 canvas (`#fx`) draws the whole frame from the video frames: it is drawn from the GSAP timeline and again on `hf-seek`, which the HyperFrames renderer re-dispatches after injecting each video frame, so a cut frame always shows its own footage. Clips the WebGL pass reads sit in `#fxsrc` (hidden with `opacity: 0`) and start 2 frames before their cut.

## CONFIG
All tuning is in `const CONFIG` at the top of each file's script.
- `end`: the comp length in seconds. `shots`: the shot names, for reference (the `<video>` tags hold the real `src`).
- A, `whip`: `at`, `dur`, `maxBlur`, `blurPerPx`, `swell`, `tilt`, `lift`, `streak`, `chroma`/`chromaMax`.
- A and B, `zoom`: `at`, `outDur`/`outTo` (outgoing accelerates to this scale), `inDur`/`inFrom` (incoming lands from this scale), `shutter`, `taps` (radial blur samples), `lens` (barrel warp at the cut), `lensIn`, `chroma` (edge chroma px), `contrast`, `edgeDark`, `bloom`.
- A, `hit`: `at`, `center` (where the lines converge, canvas px), `suck`/`suckTo`/`suckShutter`/`suckVig`/`inhale` (the pre-hit suck-in), `lines` (count), `rush` (pre-cut frames: inner radius, alpha), `burst` (post-cut frames: inner radius, alpha, width), `core`/`coreA`/`coreHold`/`coreDecay`, `punchFrom`/`rest`/`punchDur`/`punchShutter`, `shakeDur`/`ampX`/`ampY`/`rot`/`shakeBlur`, `lift`/`key`/`warm`/`hold`/`decay` (warm highlight-only exposure), `chroma`/`chromaDur`, `bloom`, `hitVig`.
- A, `dip`: `outAt`/`out` (luma crush), `riseAt`/`rise` (highlights-first rise; the gap is the hold on black), `settleFrom`/`settle`.
- B, `split`: `starts`, `dur`, `dirs`, `maxBlur`, `blurPerPx`, `shadow`, `drop`, `rim`/`rimH`, `lock` (lock-in time), `kick`, `tick`, `recede`, `pushEnd`.
- B, `vhs`: `start` and `frames`, one entry per frame: `a` main signal ("a" outgoing, "b" incoming, "bars"), `b` + `mix` rows ripped in from a second signal, `jit` line jitter, `sine` travelling tear, `tear` block tears, `noise`, `bleed`/`off` chroma bleed and offset, `trackY`/`trackA` tracking-noise bar, `scan` scanlines.
- B, `flash`: `at`, `build`/`buildGain`/`buildLift`/`buildBloom`/`buildTh`/`buildShutter`/`suckTo` (the build on the outgoing shot), `gain` (the peak exposure gain on the core), `hot` (the light core: source-px centre x, y and radii x, y on the end shot; aim it at your subject) / `hotFall`, `floor`/`floorR`/`floorV` (the share of the gain the rest of the frame takes, falling off from the core over the `floorR` source-px radii; `floorV` = [y0, y1, share]: above y0 only that share, so skyline buildings stay textured), `toe` (luma range below which no gain applies, so blacks stay black), `zone`/`archY`/`ownKey` (where the sky is keyed per pixel instead of by the matte: left of `zone` x, for a foreground that moves against the sky), `skyDim`/`sat` (the sky deepens slightly at the peak), `lift`/`key`/`warm`/`contrast` (highlight lift and warmth on the core, extra contrast), `hold`/`peak` (peak frames and their levels), `decay` (release), `bloom`/`bloomTh`/`skyRej`/`bloomStep` (threshold bloom off the lit core), `knee` (filmic shoulder), `centre` (the point the punch scales about, canvas px), `punchFrom`/`rest`/`punchDur`/`punchEase`/`punchShutter`/`push`, `shakeDur`/`ampX`/`ampY`/`rot`/`shakeBlur` (clamped inside the punch's overscan), `chroma`/`chromaDur`. `SKYLINE` (after CONFIG) is the end shot's skyline matte: run-lengths of [columns, skyline y] in source px. If you swap `s5`, re-roto it (or set `flash.hot` z to 0 to switch the keyed flash off).

## Swap in your own clips
Change the `src` of a shot's `<video>`: `s1`/`s2` (A's whip), `s3`-`s5` in `#fxsrc` (A), `s1`, the three slab copies `s2a`/`s2b`/`s2c`, and `s3`-`s5` in `#fxsrc` (B: Deluxo, tower, bridge). B's flash builds off the outgoing shot's brightest highlights, so give `s4` a sun glint or bright sky near its end, and end on a bright, sharp wide shot. Keep each clip's `data-start`/`data-duration` window, including the 2-frame early start, and keep in-point + duration within the clip's length. If you move a cut, move the `CONFIG` time and the clip windows together. For A's hit, set `hit.center` on your shot's impact point.

## Render
```
cd a && npx hyperframes render . -o out.mp4
cd b && npx hyperframes render . -o out.mp4
```
This is a full-kind component: `bg:"none"` keeps the footage, because the transitions are the footage.

## Keywords
transition, whip pan, swipe, zoom transition, zoom punch, radial blur, shake, impact, hit, speed lines, impact frame, anime burst, flash, light sweep, exposure, bloom, glitch, VHS, colour bars, tear, RGB split, slide split, dip to black, fade to black, luma fade, GTA edit, Shorts transition, beat cut
