# 72 Three-way split: decisions

## Evidence
- No census frames of its own (manifest: new object from `films/gta6-rdr2-gta5`). Nearest vernacular: `gta/39-comparison-split/evidence.jpg`,
  the two-way comparison splits top creators really use: stacked game-vs-game splits with a logo-and-year label per plate (tt-7612…,
  7.3 M views), side-by-side LOW | ULTRA with a hard centre line (tt-7649…, 3.9 M), three labelled game screenshots on black
  (yt-KedfEMhQdP8, 4.9 M), and the Jason | Lucia split-screen with name pills (yt-o4nNjj44d4M). The job: put the games side by side,
  live, label each plate with name + year, cut the frame with a hard divider, and let the comparison resolve.
- Our object keeps that form: three live plates, a chip per plate (accent spine + name + year), chrome dividers, and the one beat
  creators build to: the winner takes the frame.

## Variant A (16:9, 1920x1080, 6.4 s): the triptych
- **Columns.** Three 640 px live columns, official footage only, -h shots at 1.0x with a per-shot `data-focus` (source x kept
  centred in the column). Cut like an edit, every 1.2–2.7 s, no column cutting on the same frame as another:
  - All three columns hard-cut on the same two beats, 1.87 s and 3.67 s (r05; comparison splits cut in sync, a stagger reads as a montage).
  - GTA V (assets/shots): v36 hills-city-view 0–1.9 → v11 yacht 1.87–3.7 → v07 biplane-sunset 3.67–5.23 (→ v29 plane-clouds 5.2–6.4, under the winner).
  - RDR2 (official Rockstar trailer / gameplay-video shots, in `media/`): rider under a blue sky with the mesa 0–1.9 → graveyard under a blue
    sky 1.87–3.7 → horse rearing against the sunset sky 3.67–5.0 (the column is covered by the winner from ~4.8 s; a hilltop vista runs
    underneath to 6.4 so nothing can ever freeze).
  - GTA VI (official trailer shots, in `media/`): beach gym 0–1.9 → rooftop over the water 1.87–3.7 → highway with the towers 3.67–6.4;
    this last shot's focus is 1600, its own right third, so the full-frame copy is pixel-continuous when it takes the frame.
  - Consecutive shots overlap by 2 frames (lesson 25); no clip runs past its source (the trailer files' last frame is never reached).
- **Entrance (r04).** Hard cut in on the GTA V plate full-frame at 1.0x (no stage colour on screen, ever). At 0.10 s divider 1 slams
  down from above with back.out(1.6) in 0.26 s and the GTA V and RDR2 columns clip-path-wipe in from its edge; at 0.20 s divider 2
  does the same and the GTA VI column wipes in from it; 3-frame 5 px impact on each land (0.36 / 0.46 s). The opener plate is
  covered by then and drops out at 0.53 s.
- **Dividers.** 14 px steel bars: 7-stop gradient across the bar (#23263A → #C9CCD8 → #F4F5F8 at 50 % → #23263A), 1 px #0B0E18 edge
  lines both sides plus a 1 px #05060C outline, contact shadow onto both plates (0 0 10px .75 + 0 0 30px .65 black). After each
  slam a 220 px soft specular band runs their length over 1.0 s, and a slower 1.8 s pass runs during the hold from 2.4 s, both
  clipped to the bar (no hairlines).
- **Chips (r04 weight).** 100 px bevelled tags: Oswald 700 name at 54 px, year 36 px tabular in the game accent (GTA V #46B64F, RDR2
  text #D9444F, GTA VI #F2558E); surface gradient #2B3160 → #0F1226 with a 2 px lit top edge (inset 0 2px white .26), a 3 px inner
  bottom shadow, a 46 % gloss and a contact shadow (0 2px 4px + 0 14px 30px); 10 px lit accent spine (light → accent → dark with a
  2 px lit core line). The two losing chips live inside their own column (clipped by it), the winner chip at host level.
  Centred at the top of each column (y 96, title-safe), stamped in with the spring 0.6 → 1.07 → 1 over 9 frames, opacity 1 within
  2 frames, and a 1-frame 3 px tick on the overshoot (0.50 / 0.60 / 0.70 s).
- **Payoff (4.6 s, r04).** GTA VI takes the frame: its full-frame copy (a real `.clip` on its own track, same source and timing as the
  column's last shot) clip-path-wipes from the column to the whole frame in 0.36 s power3.inOut, with a 140 px additive specular
  band riding the wipe edge. The dividers ride the edge off the left (no opacity fade), the GTA V and RDR2 chips are shoved off by
  the edge inside their own column (they can never label a neighbour), and the winner chip rides the edge to its dock at (96, 96).
  On the land (4.96 s): a 3-frame accent bloom behind the winner chip (radial, blur 26 px, 1-frame attack, 0.35 s decay), a capped
  lift on the plate (brightness 1.10 / saturate 1.06, same envelope) and a 3-frame 4 px impact. The winner holds 1.44 s to 6.4 s.

## Variant B (9:16, 1080x1920, 6.4 s): the stacked Shorts split (phone-first, lesson 26)
- Three stacked 1080x640 bands, same shots and cut points as A; the 1920x1080 sources shown at 0.8x (1536x864), centred across and
  top-aligned (the crop takes the bottom 280 px, which hides the gameplay HUD of the two RDR2 gameplay shots).
- Hard cut in on the GTA V plate at cover scale for 0.1 s; divider 1 slams in from the left and bands 1 and 2 wipe up / down from it,
  divider 2 follows with band 3; same impacts and specular passes (left to right).
- 112 px chips (Oswald 700 at 64 px, year 42 px, 12 px spine) on a stair down the left edge: x 72, y 480 / 904 / 1328 (bottom of
  band 1, centre of band 2, top of band 3), each inside its band and inside the Shorts safe zone (x 72–936, y 230–1480).
- Payoff: the GTA VI band wipes upward to take the frame while its plate pushes in from 0.8x to cover (1.78x) over the same 0.36 s;
  the dividers ride the edge off the top, the two losing chips are shoved off inside their bands, the winner chip rides the edge and
  docks at (72, 260). Same edge light, chip bloom, capped plate lift and impact on the land.

## Rounds
- r05: after the r04 critic (7/7, no defects): cuts synced to 1.87 / 3.67 in all cells; the land is now a beat (3-frame exposure peak
  brightness 1.22 / saturate 1.08 on the winner plate, a 4-frame 1.035 scale punch, the chip bloom and the impact); chips show
  opacity 1 on their first frame, carry a light spill from the spine onto the plate and get a specular sweep across the face during
  the hold's divider pass; A dividers 10 px (B 12 px) with a 36 px contact shadow; B's band-2 chip moved to the band's top-left
  (sky) so bands 2 and 3 share the anchor and no chip sits on the rider. Oswald kept on purpose (the film kit is Oswald-only; the
  face is bundled locally), against the critic's Archivo/Inter suggestion.
- r04: after the r03 critic (7/7, 1 defect: a shoved RDR2 chip crossed into the GTA V column for 6 frames; opens from a navy void;
  chips template-weight; frame-wide payoff flash; winner held 0.54 s). Fixed as above: chips clipped inside their own column, hard
  cut in on footage with dividers slamming and columns wiping in behind them, 100/112 px bevelled chips, light carried on the wipe
  edge plus a chip bloom instead of a frame-wide expose, wipe at 4.6 s so the winner holds 1.44 s, steel dividers with edge lines
  and a second specular pass during the hold.
- r01 (judged 5/5, 1 defect, 2 hard caps): the winner reveal painted black (the full copy was a cloned video the runtime never
  seeked), chips and dividers were flat fills, murky RDR2 shots. r02: fix capture, never judged (full copy became a real `.clip` but
  jumped to a different shot; the RDR2 clip ran out and went black).
- r03 (this run, fresh build): everything above. The old film-kit copy (`assets/kit/film.*`) is no longer used; the mechanics now live in
  `a/media/split.{css,js}` (shared with `b/` by copy) so the lead can port them into `films/gta6-rdr2-gta5/assets/kit/film.{css,js}`.
  Oswald is bundled locally (`media/fonts/oswald.woff2`, variable 200–700) with explicit `document.fonts.load` before the build.
