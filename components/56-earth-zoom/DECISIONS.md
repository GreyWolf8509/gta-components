# 56 Earth zoom: decisions

## Evidence (yt-c-I-jXpGuOk, 8.1M views, t00136-t00148, t00474-t00478)
- Job: the "zoom from space down to the location" establishing move, used once at a video's open or a location change.
- Look: a photoreal globe on black, then the GTA satellite map seen straight down (hills, roads, a golf course, city blocks)
  with small white in-game district labels (VINEWOOD HILLS, ROCKFORD HILLS), a slight chromatic aberration at the edges.
- Motion: one continuous push-down zoom; soft white cloud puffs cross the map and wipe between shots; a white motion streak.
- Rough edges: flat stock globe, puffs are flat white blobs pasted over the map (no shading, no parallax), soft upscaled map,
  no landing beat at all, the dive just cuts to the next shot.

## Sources and licence (r04)
All Earth imagery is NASA, public domain (US Government works, no copyright; NASA asks for credit and no implied
endorsement). Downloaded from the NASA Earth Observatory image store (assets.science.nasa.gov, the current host behind
earthobservatory.nasa.gov / visibleearth.nasa.gov), processed locally into `a/media/` and `b/media/` (identical copies):
- Day colour, ocean mask: Blue Marble Next Generation, July 2004 (Reto Stöckli, NASA Earth Observatory),
  `.../eo/images/bmng/bmng-topography-bathymetry/july/world.topo.bathy.200407.3x5400x2700.jpg` and
  `.../bmng/bmng-topography/july/world.topo.200407.3x5400x2700.jpg` -> `earth_day_4k.jpg` (4096x2048), `earth_water_4k.jpg`.
- Close-in detail: the same BMNG July 2004 tile A1 (`world.topo.bathy.200407.3x21600x21600.A1.jpg`, 500 m/px) cropped to
  western North America (`wna_mid.jpg`, lon -140..-92, lat 12..52) and southern California (`socal_detail.jpg`,
  lon -123..-113, lat 29.5..38.5), each with a water mask.
- Night lights: Black Marble 2016 (NASA Earth Observatory, `.../imagerecords/144000/144898/BlackMarble_2016_01deg.jpg`)
  -> `earth_lights_4k.jpg`.
- Clouds: Blue Marble 2002 cloud composite (Reto Stöckli / Robert Simmon, MODIS) `cloud_combined_2048.jpg` -> `earth_clouds_2k.jpg`.
- City level (r06): Landsat WELD annual true colour, 2000 (USGS/NASA Web-Enabled Landsat Data, 30 m, public domain),
  from NASA GIBS WMS (`https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&
  LAYERS=Landsat_WELD_CorrectedReflectance_TrueColor_Global_Annual&CRS=EPSG:4326&BBOX=33.55,-118.95,34.45,-117.75&
  WIDTH=4096&HEIGHT=3072&FORMAT=image/jpeg&TIME=2000-12-01`), Los Angeles basin lon -118.95..-117.75 / lat 33.55..34.45
  -> `la_city.jpg` + `la_city_water.jpg`. Processing: scan-gap artefacts patched from the 1999 annual layer; colour
  matched to BMNG by a low-frequency ratio (so the level change is invisible) with a feathered border; sea pixels set to the
  BMNG sea colour; water mask from the raw WELD sea.

## Our upgrade (both variants, r04 rebuild)
The r01-r03 procedural planet, stylised island and SimCity map read as procedural (critics: cut-out continents, a house grid,
cotton-ball puffs). r04 replaces all of it with real satellite imagery and a physically lit dive.
- **Hero object = a real Three.js globe** (lesson 24) in one ShaderMaterial on NASA Blue Marble: a sun-lit day side with a
  physical terminator (the sun reddens through the limb), Black Marble city lights on the night side (fading as we dive),
  a GGX ocean glint masked to water and roughened by wind, the Blue Marble cloud shell turning over the ground and casting
  shadows on it, Fresnel aerial perspective, and a back-face atmosphere shell (closest-approach altitude, blue rim with a
  thin warm band at the terminator). Faint stars behind, gone before the dive.
- **No soft zoom**: three texture levels (global 4K, western North America, southern California at native 500 m/px)
  blend by lon/lat box with gradient-matched sampling, so the coast stays sharp from orbit to ~15 km.
- **A real cloud layer**: a raymarched cumulus deck (fbm cauliflower tops, flat bases, eroded edges, single + multiple
  scattering, a powder term, ground shadows) built in a local frame over the target; the global cloud shell thins from its
  edges as we dive so the 2K texture never magnifies into mush. We fall into the deck, through a short white-out (the
  footage swap happens there), and the cloud breaks up outward in streaming wisps onto the footage.
- **Motion blur**: a 32-tap radial zoom blur + slight edge CA in a post shader, driven from the log-altitude rate (and the
  near cloud rate inside the deck), computed from timeline time only (seek-safe). It applies to the globe/cloud layer only,
  the footage under the canvas stays sharp.
- **One continuous dive (r06)**: the r05 game-map stage (Chiliad / Paleto Bay, far from downtown) is gone. A fourth texture
  level (30 m Landsat of the LA basin) keeps the dive sharp from orbit to ~3 km: globe -> western US -> SoCal coast -> the LA
  basin with its street grid, all one camera move, no plate and no haze card.
- **In-game style district labels (r06)** on the real city, in our own lettering (Inter 800 caps, tracked, dark halo; an
  italic PACIFIC OCEAN water label in a/): each is pinned to its real place (Vinewood Hills = Griffith Park hills, Del Perro
  = Santa Monica, Los Santos Int'l = LAX), rises out of a mask, and drops back in before its ink reaches title-safe or the
  cloud tower's silhouette (both precomputed from the camera path). The cumulus field keeps clear air over each label while
  it is up, so no puff cuts a word.
- **The cloud pass (r06)**: the dive falls into a cumulus cluster over downtown (turrets of different heights, a lumpy
  stratocumulus skirt, cloud shadows on the basin). The cumulus field only builds in below ~500 km (3.2-3.35 s), when its
  cells are bigger than a pixel, so the approach over the coast is clean (no speckle of sub-pixel puffs and shadows). It grows from ~1/3 of the frame to full cover over ~8 frames
  (4.2-4.48) with parallax between turret tops and the ground; the last gaps close on a deeper cloud layer (never the
  footage); full cover ~3 frames over the swap (4.52).
- **Break-out**: under full cover a hole opens at the pin's landing spot (4.62), its centre drifting to frame centre, with a
  firm edge a few pixels wide (screen-space derivative, no see-through veil) and ragged wisps; the remaining cloud swells
  outward past the camera as it opens; clear by 4.8. The pin's ground shadow appears only once the hole is open round it.
- **Landing (the payoff, one beat)**: v36 (the hills over downtown Los Santos) at native 1.0x, no push. The glossy 3D map
  pin (lathe body, clearcoat, PMREM env, lens cap) drops onto the downtown towers, squashes, rebounds, two thin additive
  ripples and a bloom; LOS SANTOS / SAN ANDREAS (our own Archivo + Inter lettering, no game marks) springs out of a mask
  (settled by 4.96) with a short sheen. Hold to 6.31 (1.35 s settled), exit rolls the type into its masks and pops the pin
  into its tip, done by 6.46.

## Variant A (16:9, 1920x1080) "Globe dive (3D)"
- Globe ~76% of frame height at t=0; FOV 28 deg. Orbit to the LA basin by 3.5 s, labels 3.56-4.41, cloud cluster close
  4.2-4.48, swap 4.52, break-out 4.62-4.8, touchdown 4.66.
- Shot: v36-hills-city-view-h 4.54-6.47 (1.93 s, the whole clip, 1.0x). Pin tip on the downtown towers (1217, 606).
- Hero 5.4 s. Runtime 6.47 s.

## Variant B (9:16, 1080x1920) "Dive for Shorts"
- Phone-first (lesson 26): the globe opens at ~85% of the frame width, mostly lit (sub-solar point further east), FOV 44;
  labels at 44 px (VINEWOOD HILLS, LOS SANTOS INT'L; no label that the tower or the safe edge would cut), title 98 px
  Archivo centred on the 9:16 safe zone (ink x 101-911), pin 600 px tall (~40% of the frame width, r07) with its tip at
  (680, 1015), well inboard of the right safe edge.
- Shot: v36-hills-city-view-v full-bleed (a wide skyline -v shot, lesson 21), same timing as A. Hero 5.4 s.

## Round log
- r01: first build. v0 7 / v1 7, defect: star points wrote alpha 1 (dark specks over the hold).
- r02: stars premultiplied + hidden after the cloud deck; globe reworked (soft coasts, shallow shelf gradient, water-only
  glint, own cloud shell with shadows, push starts at frame 0); map reworked (varied parcels and zones, commercial strips,
  tree clumps, shaded hills, real coast with pier); the hi-deck punch-through is now a fully opaque white-out at
  2.82-2.86 s (three track puffs at one height), so no double exposure; v1 lands full-bleed on the turned -h shot with a
  camera roll, hold on v36-v; the pin shadow fades out before the cut so it never floats on the hold sky.
- r03: v45 dropped (critic: most likely the Cayo Perico beach party, not Los Santos); landing and hold are one Los Santos
  shot (v36), the dive retargeted to Vinewood over downtown with matching district labels (in by 3.5 s, out as the cover
  arrives); cover billows in instead of dissolving, solid over the 3-frame swap, parts outward with an ease-out into the
  pin impact (no milky veil); puff alpha eroded by smooth value noise (the 8x8 hash blocks made the mosaic); the punch thins
  over ~3 frames instead of a 1-frame luma cut; globe coasts get a fine domain warp (no stair steps), clouds get zonal
  bands, the globe opens bigger; map photo pass (mottling, contrast, slight desaturation); pin lens cap + groove, thicker
  ripples; v1 labels confined to the 9:16 safe zone.
- r04: full rebuild on NASA imagery (sources above): Blue Marble globe with terminator, lights, glint, cloud shell,
  atmosphere; 3-level texture LOD; raymarched cumulus deck with shadows; radial-blur shader pass; SimCity map, district
  labels and procedural island removed; one v36 landing with a push that settles to 1.0x, touchdown 4.58 s, hold to 5.9 s.
- r04 critic: 7/7, no defects; gaps: no game-map stage (job is globe -> game map -> shot), a flat 0.2 s white card, dark
  smeared lobes in the reveal, muddy satellite/foil ocean, a grey disk in the ripple, pin still up on the last frame.
- r05: game-map stage added (v47 aerial + in-game style labels between two cloud punches); textured screen-space cloud
  punches replace the flat fog and the view-space mask (the second opens at the pin, over the hazy skyline, not the dark
  hills); BMNG sea-floor relief flattened on the oceans; the deck is a cumulus field, not one cluster; thin additive ripples,
  smaller contact shadow; pin and title exits finish inside the comp; b/ map is the -h aerial turned 90 deg at 1.0x.
- r05 critic: v0 6 (PACIFIC OCEAN label ink to x 1890, past title-safe 1824: hard cap), v1 7, job match yes for both.
  Gaps left: the map stage is short, hazy and geographically far from the downtown landing (Chiliad / Paleto Bay); the
  second cloud closes in 1-2 frames; the settled title hold is 1.14 s; b/ opens on a small globe and the pin sits near the
  right safe edge. After r05 (hard stop, not re-rendered) the a/ PACIFIC OCEAN label was moved to x 1560 so its ink stays
  inside title-safe through the push. Tiles: a/ shows r04 (best score, 7, no defects), b/ shows r05 (7, job match yes).
- r06 (third pass): map stage cut; one continuous dive onto a new 30 m Landsat level of the LA basin with district labels
  on the real city (title-safe and tower-aware lifetimes, clear air over each label); the second cloud is now one cumulus
  cluster that closes over ~8 frames with parallax and a lumpy skirt; firm-edged break-out at the pin; v36 at 1.0x; title
  settles faster and the hold is 1.35 s; b/ opens on a ~85% lit globe, pin moved inboard to x 680.
- r06 critic: v0 7 / v1 7, no defects, job match partly. Gaps: the dive never enters the game's map (real Landsat LA with
  GTA names); the tower read as one putty-like cotton ball; the break-out a die-cut hole; a flat vector-blue sea with
  stain-like cloud shadows; a template-looking flat title; the v1 pin too small to own the payoff on a phone.
- r07 (last round): no in-game top-down Los Santos capture exists in the shared shots (the only top-down is v47 Chiliad,
  which r05 showed lands far from downtown), so the city level is now a CONFIG slot (`city`: src / water / box) for a
  creator's own map capture, default the Landsat basin. Craft: the sea gets a shallow coastal shelf (distance to coast
  from a blurred mip of the water masks) and cloud shadows at ~1/3 strength over water; cumulus shading has longer light
  steps and a darker single-scatter term (shaded turret sides, blue-grey folds, no clipped white), stronger edge erosion
  and a faint sunlit rim; the break-out tears outward under a radial streak (0.03 falling to 0) with an 18/24 px edge;
  the name gets a crisp extruded edge under the face; v1 pin 420 -> 600 px, name 86 -> 98 px.
