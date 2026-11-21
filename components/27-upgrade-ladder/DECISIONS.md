# 27 · Upgrade ladder: decisions

## Variant A: right-edge ladder (16:9, 1920×1080, 6.4 s)

**Evidence.** `yt-E1Eu2_RUdEo` t00012 (5.2M views) is the reference: a vertical ladder hugging the right edge (x 93–99 %, y 0–98 %). Eight white circular tokens (about 5 % of frame width, ~96 px) sit on a light-grey track about 40 % of a token wide, with ~30 px of track showing between tokens. Locked tiers are white discs with a big glossy red "?" over a blurred, desaturated silhouette of the hidden form; milestone tiers carry a gold crown over the blur and a yellow ring; the current tier has a thick green ring (bottom). Unlocked tiers show full-colour portraits and the track fills green (#33D433). It appears at a height milestone, the state updates, then it hides (t00008 → t00012 → t00016). The other frames (hex-badge pill t00524, the bottom token row with green check rings t00492–t01372) confirm the same tier-token language.

**Our upgrade.**
- **Tokens are real 3D coins (Three.js, lesson 24).** Each is a 14 px thick metal coin: an open cylinder rim plus a torus bezel on each face, silver (`#E9EDF3`, metalness 1, roughness .2) for normal tiers and polished gold (`#FFC54A`) for milestones, lit by a key light, a hemisphere fill and a PMREM studio environment (softboxes) under ACES. Faces are canvas textures: portraits for unlocked tiers, a white disc with a blurred, desaturated silhouette for locked tiers. Portrait faces carry a shallow glass dome (additive clear-coat layer) so the softboxes slide across them as the coin moves.
- **The "?" is a real glossy red 3D glyph** (torus hook, stem and ball dot, clear-coat red) standing on the locked face; the **crown is real extruded gold geometry** (5 points, ball tips, a raised band with a red gem).
- **Track:** frosted glass capsule (40 px) with a lit white edge, dark hairline and drop shadow; the green fill is a lit cylinder (5-stop shading), with rising light streaks and a bright meniscus head. Each coin drops a soft contact shadow onto the glass.
- **Current ring:** a separate glossy emissive green torus with a soft green halo and a running light (comet arc) circling it.
- **State change (payoff):** the ring leaves tier 3, stretches as it climbs (power3.inOut, 0.32 s) while the liquid surges up behind it, and lands on the gold milestone with a squash and an emissive pulse. On landing the milestone coin lifts toward camera, scales 1.35× and flips 180° on its thick gold edge (back.out), revealing the portrait; the crown hops off the face, spins one turn, and lands on the character's head, perched over the coin rim. A point light rakes across the coin during the flip, the gold bezel flares (3-frame peak), a gold halo blooms behind the coin only, and a few embers lift off. Footage gets a small shake (flash 0). The name rolls out of the token: "TIER 4 · MILESTONE" / "MICHAEL".
- **Entrance:** the track grows up from the bottom; coins spin in from edge-on (showing the thick rim, never a zero-thickness card) bottom to top, 0.055 s stagger, back.out; the liquid pours up to tier 2; the ring locks on from 2.2× scale.
- **Exit:** label rolls back into the token; ring collapses; coins spin back to edge-on and shrink top to bottom while the track retracts down. No fades.

**Shots and cuts.** v06 Franklin & Lamar 0–1.60 (tier 2 Lamar is current), v33 trio kitchen 1.60–2.98 (tier 3 Trevor unlocks at 1.92, Trevor faces camera), v28 tennis mansion 2.98–5.50 (Michael's mansion; the milestone lands at 3.32), v36 hills city view 5.50–6.40 (bright end).

**Payoff beat.** Ring lands on the crown milestone at 3.32 s, flip resolves 3.80 s. Hero frame ≈ 4.0 s.

## Variant B: horizontal token row (9:16, 1080×1920, 6.4 s)

**Evidence.** Same token language as A, laid out as the bottom-centre token row from `yt-E1Eu2_RUdEo` t00492–t01372 (round portrait tokens, green rings and check marks on completed forms), moved to the top of a Short per the brief.

**Our upgrade.** The same 3D coin system, five 132 px coins across x 72–936 at y 330 (inside the hook-title band), on a horizontal glass track with a green liquid that advances left to right. Completed tiers get a green check badge (pop with back.out). Payoff: the ring advances from Trevor to the gold Michael milestone with a glow; the coin flips, the crown hops onto his head, light rakes the coin, embers, and a label rises under the row: "TIER 4 · MILESTONE" / "MICHAEL UNLOCKED". The fifth token stays a locked red "?" so the ladder still has somewhere to go.

**Shots.** The -v versions: v06 0–1.60, v33 1.60–2.98, v28 2.98–5.50, v36 5.50–6.40 (no payoff on a face close-up, lesson 21).

**Payoff beat.** 3.32 s land, hero ≈ 4.0 s.

## Round log
- r01: first build. Self-review fixes before the critic: B row moved to y 380 (crown inside the 230 px top safe line), crown hop wobbles instead of spinning edge-on, raking light circles the rim instead of crossing the face, dome gloss fades at grazing angles, stronger gold halo at the payoff, fill hidden while the track is hidden. Blind critic: 8/8, no defects (PASSED).
