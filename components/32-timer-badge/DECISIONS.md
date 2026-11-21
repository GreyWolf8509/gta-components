# 32 Timer badge: decisions

## Variant A (16:9): Countdown ring

**Evidence.**
- yt-E1Eu2_RUdEo t00020 / t00060: a red-ring countdown badge in the top-right corner (x 88-99%, y 2-20%, about 10-11% of frame width). It has a thick red outer ring, a white inner rim, a dark grey centre and white bold `19:58` digits. The ring drains (a dark gap at 12 o'clock growing clockwise; `19:01` later). It pops in for a few seconds between appearances.
- yt-zvdxphGS07o t00000: a static `TIME: 6:58` HUD counter top-right in a chunky display face.
- yt-0FV42j9xSV0 t00474: a plain white `00:00:00` under the facecam.
- What creators do: a corner ring with m:ss digits, flat fills, a default drop shadow, no light, no state change.

**Our upgrade.**
- The ring is real Three.js geometry:
  - a bevelled polished-steel bezel (R 120 px, 24 px deep);
  - a recessed dark channel with 60 ruler ticks;
  - a glossy clear-coat candy band (an extruded annular sector with round caps, rebuilt each frame) that drains clockwise from 12 o'clock like the evidence;
  - a hot glossy bead with an additive halo at the draining edge;
  - a steel inner lip, and a dark glass face lit by a PMREM studio env.
- Digits are DOM Inter 900 tabular figures in masked columns, pinned to the projected face. The countdown rolls each new digit down from above with a `back.out` settle. The 0 to 9 wrap rolls through a tenth cell, so it never runs the long way.
- Size: 240 px diameter docked 54 px from the top and right edges, slightly larger than the evidence (about 200 px).

**State change (the brief).**
- The ring is calm cyan until 0:10. At 0:10 (3.25 s), on a footage cut, it arms:
  - the band flips cyan to red in 3 frames with a white-hot emissive flash;
  - the key light swings across the steel and peaks for 3 frames;
  - a soft specular rake crosses the bezel and the glass;
  - the face's radial core glows red;
  - the badge punches (+16% spring);
  - one red ring wave leaves the bezel;
  - the footage gets a small shake (flash 0).
- Every second after that beats: a heartbeat pulse (+7.5%), a band re-heat and a smaller wave.

**Shots.**
- v52 police chase on the bridge (0-2.25).
- v27 first person, police ahead (2.25-3.25; in-point 1.6 s, past the trailer's text).
- v17 Deluxo at sunset from the payoff cut (3.25-4.8).
- v31 red car at sunset (4.8-6.4).

**Entrance and exit.**
- Entrance (lesson 7): it spins in edge-on at 1.6x near the upper middle-right (0.15 s, with blur on the spin), holds the read, then docks to the corner on an arc (0.72-1.16 s) with a landing settle. The band charges up as it lands.
- Exit (5.8 s): it spins edge-on and collapses into the corner with blur; the tail is about 0.3 s.

**Payoff: 3.25 s** (hero 3.4).

## Variant B (9:16): Stopwatch

**Evidence.** The same timer family. For Shorts, the brief is a big top-centre stopwatch counting up with hundredths: the speedrun-timer vernacular.

**Our upgrade.**
- The hero object is a real 3D stopwatch:
  - a lathed polished-steel case (R 128 px) with a raised bezel lip;
  - a dark glass dial with luminous 5-second marks and minute ticks;
  - a red sweep hand with a counterweight and a steel cap (one turn a minute; it nears 12 as the time nears 60 s);
  - a stem, a knurled crown and a bow ring on top, and a 1:30 side pusher.
- A chrome-rimmed dark-glass readout pill grows out from under the watch. It shows `mm:ss` in Inter 900 tabular at about 120 px, with `.hh` at 0.64x in caption yellow on a shared baseline. Seconds roll in masked columns; hundredths tick every frame.

**Payoff: 4.6 s, the stop.**
- The crown presses 11 px into the case (2 frames down, a 3-frame hold, an elastic return) and the watch dips and squashes.
- The hand stops dead with a damped 6 Hz jiggle.
- The steel case turns gold under a raking key and a specular band.
- The readout locks: the gold rim snaps on, the digits swap in place to a gold gradient with a sheen sweep, a warm glow sits behind the pill and the pill punches.
- A gold `NEW RECORD` chip rolls down from under the pill.
- The footage cuts to the bright v36 hills and skyline wide, with a small shake (flash 0).
- It reads `00:59.87`: just under a minute.

**Shots.** A stunt-race edit: v21 top-down (0-1.7), v19 race cars (1.7-2.75), v20 neon tube (2.75-3.35), v17 Deluxo (3.35-4.6), then v36 (4.6-6.5). Each cut is 0.6-1.9 s and none runs past its shot.

**Entrance and exit.**
- Entrance: the watch drops from above, spinning, with blur, and lands with a squash at 0.44 s. The pill extends out of it (0.42-0.97 s) with the digits sliding in behind it.
- Exit (6.0 s): the chip rolls up, the pill retracts into the watch, and the watch spins away upward with blur.

## Round log
- r01: first build, as above. The critic gave 7/7 with 3 defects.
- r02: the critic gave 8/8 with no defects (PASSED). Changes:
  - **A:**
    - Defect: shot 2 now starts at media 1.75 s, clear of the trailer's burned-in text, and shot 1 runs to 2.35.
    - The bezel is now a lathed, rounded chrome crown (roughness 0.11) in a high-contrast studio env, so it reads as chrome, not grey.
    - The key glint steps 15 degrees round the bezel on every tick.
    - A DOM glass layer over the face adds a top highlight and an inner edge shadow.
    - The arming is now an instant state flip. The band stays saturated red (not tone-mapped, with lower clear-coat reflection); before, it passed through lilac and pink-white.
    - The hairline ping rings are gone. Red light now blooms onto the steel and as a halo: a 3-frame peak, a low burn while armed and a lift on every beat.
    - Digits roll like an odometer (0.8 em pitch inside a clip-path window).
  - **B:**
    - Defect: digit windows are clip-path bands inside the pill, and the odometer pitch keeps each roll's fragments inside the pill.
    - Defect: seconds rolls start 2 frames before the carry, so the display never reads xx:56.00 after 56.97.
    - Gold now arrives as a wipe: a shader front crosses the case and crown with the rake riding it, then continues across the pill rim and the digits, with a light band on the clip-path wipe. It replaces the bronze cross-dissolve.
    - A gold bloom fires on the crown and the bezel at the press.
    - NEW RECORD is now 54 px with a bevel, a dark underside and a back.out(2) drop.
    - The stop moved to 4.5 s and the runtime is now 7 s, so the chip holds about 1.4 s; v45 beach is the tail shot.
