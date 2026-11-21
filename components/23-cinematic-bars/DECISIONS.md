# 23 Cinematic bars: decisions

## Variant A (16:9, "2.39 bars")

**Evidence.** Long-form creators drop solid #000 letterbox bars on story beats, cold opens and title sequences
(yt-c-I-jXpGuOk t00084-t00132, yt-KedfEMhQdP8 t00016, yt-EP_LdrobwPg t00691, yt-J2ed1YF71ZU t00148). Bars are
hard-edged pure black, 5-13% of the frame height each (the 2.39:1 crop is 12.8%), full width, empty or carrying a
small place name (yt-c-I t00132 "Los Santos" in the corner). Motion: they appear for a sequence and are removed
after it, bottom bar first, then top (yt-c-I t00128-t00132). The edit cuts underneath them.

**Our upgrade.**
- Bars are exact 2.39:1 (138 px each at 1080), pure #000, hard edge, computed from `CONFIG.ratio`.
- They close on a damped spring (zeta 0.72), carry a vertical motion blur (16 px -> 0) on travel, overshoot about
  8 px past the 2.39 line and lock on the cut at 1.0 s. The footage takes a 2-frame camera "clunk" (2.5 px,
  1.4% punch) and a gentle exposure pulse (1.12) on the lock.
- Depth: each bar casts a 44 px contact shadow onto the picture (black 38% -> 0), so the matte sits in front of the image.
- Grade shift: an SVG feComponentTransfer S-curve with warm highlights and teal-cool shadows (blacks stay at 0-0.015),
  +8% saturation and a soft side vignette, faded in with the bars and released when they open.
- Type in the black: the lower bar carries "LOS SANTOS" in Archivo 125% 800, 62 px, chrome fill (white -> silver,
  lit from above) that rises char by char out of a mask while the tracking settles .34em -> .18em (film-title
  tracking-in); the top bar carries the kicker "CHAPTER 01" (Inter 800, 24 px, .42em, gold #F6C453). Both hug the
  picture edge (20 px gap), mirrored.
- Payoff light: a specular sheen crosses the chrome title and a warm glow blooms behind it (in the bar only) as it settles.
- Exit: title drops back into its mask, then the bars open on the cut, bottom first then top (as the evidence),
  accelerating out with motion blur; grade releases with them.

**Shots / cuts.** v24 sunset powerlines (0-1.0, bars close) | v44 bridge skyline (1.0-2.73, title in) |
v12 heli over the city at dusk (2.73-4.33) | v11 yacht (4.33-5.3, bars open; r02). Every shot at 1.0x,
none overruns.

**Payoff.** Bars slam shut on the cut at 1.0 s; the title lands and flares at 1.42 s. Hero 1.53 s (r02).

## Variant B (9:16, "Vertical bars")

**Evidence.** Shorts creators put vertical gameplay in a full-width band with black above and below
(tt-7600449291240459533 t00012, tt-7669519999714725141 t00018, tt-7680185717292567826 t00075,
tt-7626617216212946197 t00030): pure #000, hard edge, empty, roughly 8-10% each, static for the whole video.

**Our upgrade.**
- Same matte system as A, retuned for vertical: the picture band is 1080 x 1140 (y 380-1520). The bars are thicker
  than the evidence on purpose: the brief puts type in the black, and the only black that is inside the 9:16 safe
  zone (y 230-1480) is a top bar reaching below y 230. The bottom bar is sized to the platform's caption/handle zone
  (bottom ~400 px), so the UI sits on clean black and never on the picture.
- The band shows the 16:9 (-h) shots at 1.056x, i.e. near-native sharpness (the evidence upscales 9:16 crops).
- Top bar: kicker "CHAPTER 03" (gold) + title "THE GETAWAY" (chrome Archivo 125% 800, auto-fit to 780 px, centred),
  same tracking-in rise, sheen and glow as A.
- Spring close with motion blur and overshoot, lock on the cut, clunk + exposure, grade, contact shadow, exit bottom-first.

**Shots / cuts (r02).** All 16:9 shots in the band at 1.43x: v39 lowriders downtown (0-1.0, thin bars) | v17 silver
car at sunset (1.0-2.6, slam into chapter mode, title) | v44 bridge skyline (2.6-4.2) | v11 yacht (4.2-5.2, relax to thin).

**Payoff.** Bars slam from thin into chapter mode on the cut at 1.0 s, title lands and flares at 1.42 s. Hero 1.53 s (r02).

## Round log
- r01: first build. Critic 7/7, defect: 1-frame grade pop at 0.40 s (the SVG grade filter switching on).
- r02 (both):
  - Defect fix: the grade filter stays applied for the whole piece from exact identity values, so nothing switches on.
  - The lock is now the payoff: bars accelerate in (power2.in, blur growing with speed), cross the line at full speed
    exactly on the cut frame, overshoot 7 px and settle in 0.26 s (damped sine), with clunk + exposure 1.15 on the cut.
    The plate pushes 1.00 -> 1.04 while they close (lens-change feel).
  - Title light: glyph-clipped chrome (lit top, steel horizon, warm rim) with a narrow 100% specular band, plus an
    anamorphic flare: two light spikes that leave the title's outer edges (never through the type), peak held
    3 frames, decay 0.4 s; warm bloom behind. Fires at 1.42 s as the last glyph lands.
  - The hold breathes: slow track-out .18 -> .215em and scale 1.00 -> 1.022.
  - Kicker legible at phone size: A 38 px, B 40 px, tracking .30em.
  - A: ends on the bright yacht shot (v11). Title exits before the bars open.
  - B redesigned for the vernacular: thin always-on bars (190 px, ~10%, as every 9:16 evidence frame) from frame 0;
    on the cut they slam deeper (380 px) into a chapter card carrying the type inside the safe zone, then relax back to
    thin (bottom first) and stay on. Footage is 16:9 shots at 1.43x in the band (sharper than 9:16 crops); the murky
    Franklin close-up is gone (v39 lowriders, v17, v44, v11).
  - Hero moved to the flare (1.53 s). Critic r02: 8/8, no defects -> PASSED.
