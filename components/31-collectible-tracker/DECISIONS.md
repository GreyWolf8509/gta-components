# 31 Collectible tracker: decisions

## Variant A (16:9): "Found 2/8 -> 3/8"

**Evidence.** yt-CKq35NK70h0 t00132: a heraldic shield, black fill with a thick gold border, "LAMBORGHINI" in small gold caps along the top and a big gold heavy italic "1/8" in the middle. It sits top-left (x 1-14%, y 0-23%, about 13% of the width) and slides down from the top edge on a find (cut off at the top at t00876). yt-232CmcU0wKg t00144: a row of round coin slots top-right (green rings, about 17% of the height each), static HUD. The job: a found-so-far count that ticks up on each find.

**Our upgrade.**
- The shield is real Three.js geometry: a polished gold rim (metal 1.0, roughness 0.2, clear coat, PMREM studio env), a recessed black lacquer face (clear coat over a diagonal falloff), a dark ink outline plate behind, and a soft silhouette shadow on the footage.
- The count is traced Archivo 900 (wdth 80) outlines, sheared 0.2 into italic and extruded with a rounded bevel. Faces carry a 4-stop gold ramp (cream cap to amber baseline), sides deep gold. The label is our own word ("SUPERCARS", no brand) in gold on an arc that follows the shield's top edge.
- A gunmetal socket rail (8 sockets, gold trim, dark floor with a ghost car relief in each empty socket) slides out from behind the shield; found sockets hold gold coins with a raised car relief (our own wedge supercar profile).
- **Payoff (state change):** on the find a coin pops off the car in the footage (2.5x, spinning on its real thickness), flies on an arc with a gold light trail into socket 3, slams in with a squash, a gold ring and a 3-frame socket bloom. Then the "2" folds back over its top edge and the "3" swings down with overshoot (real extruded edges, no cross-over), the shield kicks (scale 1.12 spring, 0.22 rad Y wobble that shows the gold edge), the key light rakes across the gold and a soft specular band crosses the shield.
- Entrance: the shield drops from above the top edge on a damped spring with a pendulum swing from its top pivot; the rail slides out; the two found coins pop in. Exit: rail retracts into the shield (back.in), shield lifts out of the top edge (back.in), cut on the zero frame.

**Shots and cuts.** v57 gameplay red car on the highway (0-1.95, HUD, the find pops off the red car), cut on the landing to v17 silver supercar at sunset (1.95-3.5), then v36 bright hills over the city (3.5-5.4). 5.4 s.

**Payoff beat.** Coin lands 1.95, count flips 2.02-2.45, light rake 2.05-2.55. Hero 2.3.

## Variant B (9:16): "Death counter"

**Evidence.** yt-wZhwEgpeg9c t00037.5: a small cartoon RIP headstone sticker with a thin dark outline and a white "x0 / x1 / x2" multiplier in a heavy rounded sans with a black outline, top-left (icon x 8-17%, y 24-29%). The number hard-cuts up after each crash.

**Our upgrade.**
- The icon is a real 3D skull: one bevelled ivory extrusion (cranium, cheeks, socket and nose holes) with a vertical bone ramp and clear coat, separate bevelled teeth, a hinged mandible, a dark ink outline plate and a soft silhouette shadow. Socket floors are a shader: near-black with a red ember at each pupil.
- The multiplier is extruded traced Archivo glyphs (italic 0.16): white clear-coated faces, crimson sides, a red "x", a dark ink outline and a shadow traced from the glyph outlines (no box).
- **Payoff (state change), per death:** the count folds back and the next one swings down (no overlap), its face flashes red-hot and cools; the counter shakes hard (deterministic hash, 0.5 s decay) and the jaw drops and snaps shut; the sockets flare white-hot red and settle to a lasting ember; a red rim light and a red halo bloom behind the skull; the footage punches (Look.impact, flash 0). The second death is 25% stronger.
- Entrance: the skull spins in on Y (its real thickness shows) and drops onto its mark, the jaw clacks; the "x1" slams in from the camera side. Exit: number slides into the skull, skull spins out with back.in, cut on the zero frame.

**Shots and cuts.** v56 gameplay van smashing through a wall (0-2.3, death 1 on the impact at 1.1), v30 street explosion (2.3-3.9, death 2 at 2.4), v36 bright hills over the city for the hold and exit (3.9-5.8).

**Payoff beat.** Death 2 at 2.9 (r02): crack splits, chips, 1.22x punch, roll lands 3.0-3.26. Hero 3.18.

## Round log
- r01: first build of both variants as above. Critic: v0 8 (locked), v1 7: matte clay bone reads as the free skull emoji, the two deaths were the same beat, x1 held only 0.65 s, never docked.
- r02 (v1 only; v0 locked and untouched):
  - Bone is now glazed: a baked domed normal map (cranium, cheeks, each tooth, the jaw; wide + shoulder + edge roll) drives the base and the clear coat, so the raking top-left key puts a crisp specular on the dome and the socket rims; a baked cavity term darkens into the sockets, nose and teeth gaps; a warm rim light picks out the right bevels.
  - Escalation, one payoff: death 1 is a hit (hairline crack from the crown, eyes light to an ember, a small shake). Death 2 is the payoff: the crack splits across the dome with two branches, four bone chips break off on ballistic arcs, the whole counter punches 1.22x, the jaw drops wide, the eyes go white-hot for 4 frames, the red halo grows 1.6x, the hardest shake and a stronger footage punch.
  - The count now rolls through a clipped window like a drum (old drops out the bottom tilting, then the next comes in from the top with overshoot), strictly sequential, no edge-on frames, no overlap.
  - Timing: a 0.5 s v51 police-chase pre-roll puts the van crash (death 1) at 1.6, so x1 holds about 1 s; death 2 on the v30 explosion at 2.9.
  - Dock: at 3.75 the tally settles to 0.8x into the corner (skull about 190 px wide) for the hold; exit 5.6, end 6.3.
