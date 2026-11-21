# Price tag (GTA-niche library #30)

The price graphic GTA creators put on things in challenge and shopping videos: "I bought the cheapest car", "every tier of car", "$1 vs $1,000,000,000".

## Variants
- **A: Pinned price** (`a/`, 16:9 long-form). The creators' mint-outlined price pill, built as a real 3D hang tag.
  - It hangs on a cord from a tracked point on a car and swings with the car's motion.
  - The figures roll up and lock with a neon rim ignition.
- **B: Giant tier** (`b/`, 9:16 Shorts). The giant "$1,000,000,000" tier label across the top of a Short.
  - Every digit is an extruded 3D figure on a rolling drum.
  - When the last figure locks, the label ignites from white enamel to billion-tier candy red.

## CONFIG (top of each `index.html`)
**A**
- `price`: the price text.
- `tag`: the pill's size, tab, hole and thickness.
- `figH`: the figure height.
- `turns`: the odometer turns.
- `cord`: the cord length.
- `colors`: face, rim mint, cord.
- `light`: rim glow levels, specular, env.
- `phys`: swing and twist periods and damping, the response to the car's motion, kicks, and the exit drop.
- `timing`: in, roll, landGap, lock, out, gone, end.
- `anchors`: the tracked pin points per shot (30 fps), plus light colours per shot.

**B**
- `price`: the price text.
- `cx`, `cy`, `maxInk`: position and width.
- `tracking`, `commaAdv`: spacing.
- `depth`, `bevel`, `tilt`: the extrusion.
- `drum`, `bandPad`: drum radius and clip band.
- `turns`: drum turns before landing.
- `colors`: white and red faces and sides, hot band.
- `timing`: in, landGap, lock, frontDur, spec, out, end.

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                   # over the sample footage
```
B renders the same way from `b/`.

## Your own clip
**A**
1. Replace the `<video>` sources.
2. Track a point on your car, for example with a template-matching tracker or your editor's point tracker.
3. Paste it into `CONFIG.anchors[i].pts` as `[x, y]` per frame at 30 fps, with `t0` and `t1` for each shot.
4. The swing reacts to the tracked motion automatically.
5. With `bg:none` the tag follows the anchors over transparency.

**B:** replace the `<video>` sources and set `price`.

## Keywords
price tag, price pill, hang tag, cost, cheapest vs most expensive, tier label, billion, $1B, odometer, rolling digits, slot drum, GTA 5, GTA Online, challenge, shopping, car price
