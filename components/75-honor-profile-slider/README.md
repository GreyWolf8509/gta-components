# 75 Honor to profile slider

RDR2's honor slider flips into GTA VI's Criminal Profile and slides to IRREDEEMABLE: a meter that changes identity, the comparison object for a system that crossed games.

**When a creator uses it.** Long-form (A, 16:9): a thesis or comparison beat ("the honor system became the criminal profile") over official footage; the meter enters, shows the RDR2 state, flips identity, then slides to the hero end on a cut. Shorts (B, 9:16): the same beat phone-first at 72 % of the frame width over a 1.0x footage band with a blurred fill.

**What it is.** A Three.js instrument: a brushed-metal bezel with a real recess, a key-lit navy panel sunk into it, a title tab that widens with the title, a lit slot (metal lip, dark channel with an inner shadow and a lit bottom edge, a liquid fill with a specular band and a hot core), a bevelled ceramic puck in a metal collar with an identity LED and a contact shadow. Labels are DOM Oswald pinned to the panel face. Beats: enter 0-0.4 s, knob lands on HIGH HONOR 0.42 s, flip 2.3 s (light sweep, colour swap, labels roll through windows, knob returns to PROFESSIONAL), slide 3.6-4.2 s to IRREDEEMABLE with a slam (payoff 4.2 s), hold, exit 5.85-6.3 s.

## CONFIG
- `title`, `left`, `right`: `[before, after]` strings for the identity flip (title tab, left end, right end).
- `colour`, `hot`, `tint`: `[before, after]` hex: fill / LED colour, the fill's hot core, the active end label's tint.
- `home`: knob position (0-1) after the first state settles; `flipHome`: where it returns on the flip; `end`: the slide's target.
- `timing`: `in`, `knob`, `flip`, `slide`, `hit`, `out`, `end` in seconds (`hit` is the payoff).
- Layout (sizes, positions, label sizes) sits in `LY` right under CONFIG.

## Render
```
cd a && npx hyperframes@0.9.72 render . -o out.mp4
cd b && npx hyperframes@0.9.72 render . -o out.mp4
```
Full-kind component: `bg:"none"` keeps the footage.

## Your own clip
Replace the `<video>` sources (A: `s0`/`s1`; B: the sharp `s0`/`s1` in `.band` and the blurred copies `s0b`/`s1b` in `.bed`) and keep `data-duration` within the clip's length. The second clip starts 2 frames under the first.

Fonts: Oswald (local, `media/fonts/Oswald.ttf`), nothing else.

Keywords: honor, criminal profile, slider, meter, RDR2, GTA VI, comparison, identity flip, irredeemable.
