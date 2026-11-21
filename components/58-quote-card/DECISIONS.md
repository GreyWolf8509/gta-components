# 58 Quote card: decisions

Content rule: the quote is a **fictional in-world line** credited to a game character (Lester Crest, the heist planner),
never a real person. The manifest's studio line ("The map is bigger than anything we've made") would be an invented
quote from a real company, so it is replaced. Type is Inter italic (no serif), per the owner's type rule.

## Variant A: "Pull quote" (16:9, 1920x1080, 6.4 s)

**Evidence** (yt-o4nNjj44d4M t00499, 3.8M views, GTA essay/news video):
- Job: an italic pull-quote with an attribution line, held over dimmed footage while the narrator reads it.
- Quote at x 12-65%, y 43-63%, about 5% of frame height, white italic with the key words ("what kind") in pink #E35BF0,
  a thin vertical pink bar at its left, and a small caps attribution line "—— ROCKSTAR · EDGE 430 · paraphrased".
- On the right (x 70-88%, y 30-62%), a tilted rounded yellow logo tile for the source, with a pink glow.
- The footage behind is dimmed with a purple-magenta gradient. Motion: a held card (neighbouring frames t00495-t00511
  show the same channel's purple/pink UI language: Montserrat-like type, pink accents, glow).

**Our upgrade.**
- **Grade (plate only):** the footage drops into the quote look over 0.5 s: brightness 0.74, contrast 1.12, a multiply
  purple gradient (darkest behind the text) and a screen magenta bloom top-left, so blacks stay black (no grey veil).
- **Type:** Inter italic 800, 88 px (about 1.7x the evidence), -0.018em, three balanced lines. Words write on one at a
  time (0.14 s apart, a beat at the full stop): each rises through its own clip line with a 7 px blur resolving (expo.out).
- **Bar:** 11 px pink-to-violet gradient bar with a lit left edge and bloom; springs down (back.out) and flares on the payoff.
- **Source tile = real 3D** (Three.js, `media/quote3d.js`): a 360 px rounded slab, 40 px deep with a 9 px bevel, gold
  enamel face (3-stop gradient, a top-left hot spot, pillowed rim) under a clearcoat that catches a PMREM studio env,
  amber-metal walls, and a raised black-lacquer double quote mark (our own extruded geometry, not a logo) with its own
  contact shadow. It flips in from edge-on (shows its real thickness) on a spring and idles with a slow sway.
- **Payoff (2.32 s):** one beat. A light front (hot near-white band) crosses "the prepared." turning it hot pink with a
  bloom; the light jumps to the tile 0.2 s later: its pink neon halo switches on (3-frame peak, then settles hot), the
  tile kicks toward camera and settles, a specular band and a raking light cross the gold, and the attribution rolls in.
- **Exit (5.45 s):** words drop back through their clip lines with a 6 px blur, last word first; bar collapses; the tile
  spins away edge-on. About 0.5 s of footage tail.

**Shot:** `v35-penthouse-dusk-h` (sharp 1920x1080, 1.0x, in-point 1.6 s, ends at 8.0 < 8.97 s), slow push to 1.05.
A penthouse at dusk with a pink skyline: the evidence's interior mood and palette, ending on the bright dusk skyline.

**Hero:** 3.2 s (settled, halo on, attribution in).

## Variant B: "Quote for Shorts" (9:16, 1080x1920, 6.5 s)

**Evidence:** same frame, set for a phone: quote big, each word lighting as it is said (manifest brief).

**Our upgrade (phone-first, DESIGN 11.26).**
- **Layout:** tile top-right (x 480-920, y 250-690), quote left-aligned below with the pink bar, attribution under it;
  everything inside x 72-936, y 230-1480.
- **Type:** Inter italic 900, body 104 px (fitted to 790 px), the key word "prepared." alone on the last line at 150 px.
- **Lighting as said:** the whole quote lands unlit (opaque deep plum with a faint pink rim, never see-through), then
  each word lights 0.18 s apart: a light front with a hot band wipes it to white, a small spring pop and a transient bloom.
- **Payoff (2.72 s):** "prepared." ignites hot pink with a bigger pop and a lasting bloom; 0.18 s later the 3D tile's
  halo switches on, it kicks and a specular band crosses it; the attribution rolls in.
- **Bed:** `v35-penthouse-dusk-v`, 1.0x, in-point 1.6, blurred 4 px (the -v crop is upscaled, DESIGN 11.12/11.21, so it is
  used as a soft graded bed and never as the payoff), brightness 0.7, contrast 1.14, purple multiply + magenta screen.
  The payoff is on the graphic.

**Hero:** 3.5 s.

## Round log
- r01: first build. Blind critic 8/8, no defects (PASSED). Open nitpicks: the key-line fit in B measures the block line box, so "prepared." lands at about 112 px rather than 150; the tile carries a quote mark rather than a source monogram.
