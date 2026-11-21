# Builder protocol: GTA-niche component library (`gta/`)

> **STOP CHECK, before anything else.** Run `python3 tools/gtalib/sticky_status.py gta/NN-<slug>`. If it prints `STATUS: PASSED`, the component is done: change nothing and immediately return `ok: false` with summary `"already passed (sticky)"`.

You build one component of a motion-graphics library for GTA 5 / GTA Online / RP / RDR2-style YouTube videos and Shorts. It has 2 variants, each its own HyperFrames project:
- `gta/NN-<slug>/a/index.html` is variant A;
- `gta/NN-<slug>/b/index.html` is variant B.

Your entry in `gta/manifest.json` gives each variant's aspect, canvas size, label and brief.

After each round, a fresh blind critic judges your render against **real frames from top GTA videos that use this same component**. **The pass mark is 8/10 on both variants with no defects.**

**Context.** The owner rejected three earlier libraries:
- "basic";
- "basic lower thirds / text";
- invented formats that "aren't what creators use".

This library is built from research on 106 top GTA videos. The brief is: **the component creators actually use, in the place they use it, executed far better.** It should be recognisable instantly and look expensive.

Project root: ``.

## Read first (about 10 minutes)
1. **`gta/DESIGN.md`, all of it.** It's non-negotiable, especially §1 (evidence first), §2 (what next level means), §11 (critic-tested lessons) and §12 (auto-fail).
2. **The evidence.**
   - Open `gta/NN-<slug>/evidence.jpg` (run `python3 tools/gtalib/evidence_sheet.py gta/NN-<slug>` if it's missing).
   - Then open each frame in your manifest entry's `evidence.frames` at full size, and read its `name` / `style` / `position` / `motion` notes.
   - For motion, open 3–4 neighbouring frames in `research/gta-niche/frames/<key>/` (names are seconds: `t00012.jpg`, `t00001.5.jpg`).
3. `gta/_shared/kit/look/look.js`: the header comment of each helper.
4. The template: `gta/_template/a/index.html` (16:9) and `gta/_template/b/index.html` (9:16).
5. Only if you need it:
   - HyperFrames contract: `~/.claude/skills/hyperframes-core/SKILL.md`;
   - Three.js: `~/.claude/skills/hyperframes-animation/adapters/three.md`, and DESIGN.md §8.

## Design before code
Write `gta/NN-<slug>/DECISIONS.md`. For each variant, start with:
- **Evidence:** 3–5 lines on what top creators' version does. Its job, where it sits, its size, look and motion, citing frame keys.
- **Our upgrade:** the material, light, depth, physics and state change you add, concretely (e.g. "button face is a 3-stop red gradient with an inner top highlight; it travels 10 px down on press with a 2-frame squash; …").
- **Shots and cut points.**
- **The payoff beat and its time.**

Then ask yourself: *would a top GTA creator recognise this as their component in half a second? Would they think it looks clearly more expensive than anything in the evidence?* If not, redesign before building.

## Build
- **Files:** `a/index.html` and `b/index.html`. Copy from `gta/_template/a` (16:9) or `gta/_template/b` (9:16) to match each variant's manifest aspect.
  - Root composition id `"main"`, `data-width` / `data-height` set to the variant's canvas, 30 fps, 4–8 s.
  - The two variants may share code by copy, not by import.
- **Head:**
  - `assets/fonts/fonts.css`;
  - `assets/kit/look/look.css`;
  - GSAP 3.14.2 (CDN);
  - `assets/kit/look/look.js`;
  - Three.js 0.160.0 (CDN global) only if you use it.
- **Variable:** `bg` ("plate" / "none").
  - With "none" on an overlay: transparent, every `<video>` hidden, no grain, vignette or full-frame flashes.
  - Full-kind components always show footage.
- **Footage:** `assets/shots/` (see DESIGN.md §5 and `gta/_shared/shots/shots.json`).
  - Cast shots for the job and cut like an edit.
  - Every `<video>` needs a unique id, `class="clip"`, `muted`, `playsinline`, `data-start`, `data-duration` and `data-track-index`, plus `data-media-start` for in-points.
  - Never run past a shot's length.
- **CONFIG:** all content for the variant in one `const CONFIG` at the top.
- **Determinism:** one paused GSAP timeline on `window.__timelines["main"]`, ending with `tl.seek(0)`. No randomness: use `Look.hash(n)` for pseudo-random values.
- **Lint:** `hyperframes check` flags transparent-fill text. For gradient type on split text, use `Look.fill`.
- **Assets:** `assets/` in each of `a/` and `b/` is synced by the capture script. Don't edit it; your own extra files go in `a/media/` or `b/media/`.

## Capture each round
Run:
```
bash tools/gtalib/capture.sh gta/NN-<slug> <round> <hero-time-A> <hero-time-B>
```
The hero time is the second that best shows the payoff. The script:
- syncs assets;
- runs `hyperframes check` on both;
- renders `rounds/rNN/v0.mp4` (A) and `v1.mp4` (B) over footage;
- for overlays, also renders `bg:none`;
- saves `vN-hero.png`, `vN-strip.jpg`, `vN-entrance.jpg`, `vN-none.png` (transparent render over a checkerboard) and the blind pairs.

Fix anything until it passes. Then **review it yourself, as harshly as the critic will:**
- open both hero PNGs, strips, entrance sheets and `-none.png`;
- put each hero next to the best evidence frame;
- pull 4–6 more frames per variant with `ffmpeg -v error -ss <t> -i <mp4> -frames:v 1 <tmp>.png` (entrance, state change, payoff, hold, exit) and a 10-frame burst around the payoff.

Check for:
- the wrong vernacular or job;
- flat surfaces with no material;
- timid size;
- clipped or overflowing text;
- the safe zone;
- font fallback;
- faces covered;
- muddy contrast;
- frozen footage;
- grey veils;
- a `bg:none` that shows footage.

Fix, then re-run the capture with the same round number.

## Every round
Keep these current:
- `DECISIONS.md`: what changed this round and why.
- `README.md`:
  - what it is and when a creator uses it (long-form / Shorts);
  - the CONFIG fields;
  - how to render, e.g. `cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm` for a transparent overlay, or `-o out.mp4` with footage;
  - how to swap in your own clip;
  - keywords.

## Fix rounds
- Read `rounds/r<prev>/critique.md` and `verdict.json`, and the sticky-status output from the stop check.
- **Locked variants are frozen.** A `LOCKED` variant scored 8+ from a blind critic and hasn't changed since.
  - Don't change anything that affects its render, apart from exactly a defect the latest verdict lists for it.
  - The capture ends with a `VS-PREV` SSIM line. If it warns that a locked variant changed, revert and re-capture.
- Spend the round on the open variant(s). Fix defects and hard caps first, then the biggest gap.
- Don't reverse a deliberate decision just because a critic's taste differs. Reverse it only for a concrete defect, a hard cap, or a clear mismatch with the evidence.

## Rules
- Don't ask the user anything. Don't open Studio.
- Don't touch other component folders, `gta/_shared`, `gta/_template` or the manifest.
- Don't read `research/.gauntlet_keys*`.
- About 30–40 minutes per round; spend the first 10 on evidence and design.
- **Final output:**
  - the hero times;
  - what you built or changed per variant (2–3 lines each);
  - anything unresolved.
