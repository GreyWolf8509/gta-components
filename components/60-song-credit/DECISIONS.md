# 60 Song credit: decisions

## Evidence
- `yt-mCDH5KnBx9o t01822` (8.3M views, long-form): the creator credits the track the moment the music changes, as two
  plain lines, `song- everybody likes me` / `artist- the excellent man from minneapolis`: white lowercase sans at about
  3% of frame height, no box, no shadow, top-centre over the outro card, static (t01818 to t01838 show no motion).
- Job: tell the viewer what is playing, title on line 1 and artist on line 2, small, readable, out of the way, while the
  footage keeps playing. The manifest briefs move it to the creators' other usual spots: lower-left for long-form,
  near the top for a Short (the bottom of a Short is platform UI).
- What it lacks: everything except the information. Default font, no hierarchy, no "now playing" signal, no motion.

## Variant A: "Now playing" (16:9, lower-left, 6.8 s)
- **Form kept:** two lines, title over artist, left-aligned, lower-left, title 58 px (about 2x the evidence), artist 36 px.
- **Our upgrade:** a real record leaves its sleeve.
  - Three.js: a square album sleeve (a 200 x 200 x 5 px box, laminated gloss front with our own synthwave sunset art,
    cream paper spine) with a black vinyl record inside it. The record is a lathe: raised label plateau, groove field,
    raised outer lip, rounded edge, clearcoat. The grooves are a shader: fine rings and three glossy track gaps, plus the
    record's radial "bow-tie" light wedge that stays fixed in world space while the record spins under it.
  - Studio PMREM environment, warm key, hemisphere fill, ACES tone mapping. The printed label (two-tone with a striped
    sun) is asymmetric so the 33 1/3 rpm spin reads at phone size.
  - Type: Inter 900 title with a crisp dark edge and a two-layer shadow, Inter 600 artist, a gold `NOW PLAYING` kicker
    with a 4-bar live equaliser (lit top caps, gradient bodies) driven by deterministic noise.
- **Motion:** the sleeve slides in from the left edge with a spring, motion blur and a spine-forward swing that settles;
  the record slides out of the sleeve to the right with overshoot while it spins up; the text pulls out from under the
  record (clipped at the record's centre line) as the record locks.
- **Payoff, 1.1 s (state change: sleeved and still -> out and playing):** the record locks with a 2-frame squash, the
  light wedge flares across the grooves with an exposure lift on the 3D layer only, the equaliser springs from flat to
  live, a sheen runs along the title. Hold 4.6 s with the record spinning and the bars live.
- **Exit 6.0-6.35 s:** the text tucks back under the record, the bars drop flat, the record slides home, the sleeve slides
  out left with motion blur. Cut on the zero frame, 0.45 s tail.
- **Shots:** v17 deluxo sunset -> v38 freeway dusk (r2, replacing v14 whose bright sky sat behind the kicker) -> v12 heli city dusk -> v41 smokestacks -> v24 sunset powerlines, all
  -h at 1.0x, overlapped 2 frames (incoming underneath). The lower-left of every shot is dark road or city, so white
  type holds without a box.

## Variant B: "Track tag" (9:16, near the top, 7.0 s)
- **Form kept:** title + artist near the top of the Short, with a marquee title and a live equaliser.
- **Phone-first (lesson 26):** the tag spans x 84-936 (78% of the width); the hero is a 280 px real 3D record on a
  tilted deck with a chrome tonearm; the title is Archivo 75%-width 800 caps at 72 px; artist Inter 800 40 px.
- **Our upgrade:** the same lathe record, tilted back 24 degrees so its edge and the light wedge read as 3D, a chrome
  tonearm (base, post, counterweight, tube, headshell) that casts a real soft shadow onto the record.
- **Payoff, 1.25 s (state change: stopped -> playing, the needle drop):** the arm swings in and drops; on touchdown the
  shadow meets the arm, the record spins up from still, the wedge flares, the bars spring alive and the title rises out
  of its window. The marquee starts rolling 1.2 s later so the first words read first.
- **Exit 6.1-6.5 s:** the arm lifts, the text rolls down into its window, the deck slides out left with motion blur.
- **Shots:** v17 -> v41 -> v40 car meet -> v12 heli city -> v24 sunset powerlines, -v at 1.0x, 2-frame overlaps.

## Content
Fictional track "Coastline Ghosts" by the fictional artist Mara Solace. Sleeve and label art are our own drawings.
No real songs, artists, labels, platforms or music-app UI.

## Round log
- r1: first build. Self-review fixes before judging: shot stacking (overlay above footage), vinyl env lowered so the tilted record stays black, v1 record rolls in (no milky face-on env flash), a warm groove ring runs in from lip to label on the payoff, fresnel rim on the record edge so it separates from dark footage, title sized to fit `COASTLINE GHOSTS` in the marquee window before it scrolls.
- r2 (critic r1: 7/7, no defects). Fixes:
  - v1: payoff light made additive and local (no rake light on the tilted record, exposure lift 0.1, a narrower wedge
    flare, a wider warm groove ring), so the blacks stay black; vinyl deeper (roughness 0.3, env 0.2); the record now sits on
    a lathe-turned aluminium platter and the tonearm is bolted into a satin-black bearing plinth with a bezel, so nothing
    floats; EQ 9 x 42 px bars that slam to the top on the needle drop; the marquee runs one full loop on a trapezoid speed
    profile and is back on `COASTLINE GHOSTS` at 6.2 s, before the exit (runtime 7.55 s).
  - v0: lifted to anchor y 772 so the bottom-left minimap corner stays clear (CONFIG note for the evidence's top
    placement); `cover` slot for a creator's own art; sleeve card edge with a lit bevel and 4% paper grain; record pull on
    back.out(1.9) with a 2-frame seat pop and a wider groove ring; 5 EQ bars at 7 x 30 px with the payoff pump; a slow orbit
    and laminate sheen through the hold.

