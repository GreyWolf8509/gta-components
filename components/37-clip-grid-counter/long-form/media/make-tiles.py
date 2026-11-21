#!/usr/bin/env python3
"""Builds the grid's tile clips (media/tiles/tNN.mp4): 960x540, 30 fps, DUR s each, hard-cut montages of shots from
gta/_shared/shots at 1.0x (no speed change), so no tile ever runs past a shot. Each tile is one themed "feature".
Run from this folder:  python3 make-tiles.py   (needs ffmpeg). Edit TILES to swap in your own clips."""
import json, os, subprocess
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../..'))
SH = os.path.join(ROOT, 'gta/_shared/shots')
DUR = 7.8
LEN = {s['name']: s['dur'] for s in json.load(open(os.path.join(SH, 'shots.json')))}
# each tile: list of (shot, in-point); the run is filled in order until DUR (last shot trimmed)
TILES = [
  [('v57-gp-red-car-highway', 0), ('v19-race-car-city', 0), ('v21-race-topdown', 0), ('v17-deluxo-sunset', 0), ('v16-car-rear-lights', 0), ('v20-neon-stunt-tunnel', 0)],
  [('v11-yacht', 0), ('v46-gp-speedboat', 0), ('v48-gp-jetski-beach', 0), ('v45-beach-aerial', 0), ('v11-yacht', 0.4)],
  [('v52-gp-police-bridge', 0), ('v51-gp-police-desert', 0), ('v30-street-explosion', 0), ('v26-bridge-explosion', 0)],
  [('v07-biplane-sunset', 0), ('v29-plane-clouds', 0), ('v32-skydive-towers', 0), ('v55-gp-parachute', 0), ('v12-heli-city-dusk', 0)],
  [('v28-tennis-mansion', 0), ('v18-pool-skyline', 0), ('v35-penthouse-dusk', 0.3), ('v42-lighthouse', 0)],
  [('v09-juggernaut-minigun', 0), ('v23-minigun-park', 0), ('v08-trevor-rifle', 0), ('v34-rocket-heli', 0), ('v54-gp-trevor-walk', 0)],
  [('v50-gp-bike-mansion', 0), ('v53-gp-sunset-arms', 0)],
  [('v13-lowrider-gang', 0), ('v39-lowriders-downtown', 0), ('v14-driveby-sunset', 0), ('v31-red-car-sunset', 0), ('v24-sunset-powerlines', 0), ('v40-car-meet-night', 0)],
  [('v56-gp-truck-crash', 0), ('v26-bridge-explosion', 0.2), ('v30-street-explosion', 0.3)],
  [('v22-trio-jumpsuits', 0), ('v33-trio-kitchen', 0), ('v06-franklin-lamar-portrait', 0), ('v10-cash-table', 0), ('v05-franklin-lamar-street', 0), ('v03-franklin-street', 0)],
  [('v47-gp-chiliad-aerial', 0), ('v02-mountain-hikers', 0), ('v01-lifeguard-sunset', 0), ('v42-lighthouse', 0), ('v45-beach-aerial', 0), ('v07-biplane-sunset', 0.5)],
  [('v49-gp-franklin-mural', 0), ('v05-franklin-lamar-street', 0), ('v03-franklin-street', 0), ('v13-lowrider-gang', 0.2), ('v39-lowriders-downtown', 0.1)],
  [('v37-tower-looking-up', 0), ('v44-bridge-skyline', 0), ('v38-freeway-dusk', 0), ('v41-smokestacks-dusk', 0), ('v36-hills-city-view', 0)],
  [('v58-gp-franklin-window', 0), ('v36-hills-city-view', 0.2)],
  [('v20-neon-stunt-tunnel', 0), ('v21-race-topdown', 0.3), ('v19-race-car-city', 0), ('v17-deluxo-sunset', 0), ('v57-gp-red-car-highway', 0.2), ('v31-red-car-sunset', 0)],
]
os.makedirs('tiles', exist_ok=True)
for i, seq in enumerate(TILES):
  parts, t = [], 0.0
  for name, a in seq:
    if t >= DUR - 1e-3: break
    d = min(LEN[name] - a - 0.04, DUR - t)        # never touch a shot's last frame
    parts.append((name, a, d)); t += d
  assert t >= DUR - 1e-3, ('tile', i + 1, 'too short', t)
  args, fc = ['ffmpeg', '-v', 'error', '-y'], ''
  for k, (name, a, d) in enumerate(parts):
    args += ['-ss', '%.3f' % a, '-t', '%.3f' % d, '-i', os.path.join(SH, name + '-h.mp4')]
    fc += '[%d:v]fps=30,scale=960:540:flags=lanczos,setsar=1,setpts=PTS-STARTPTS[v%d];' % (k, k)
  fc += ''.join('[v%d]' % k for k in range(len(parts))) + 'concat=n=%d:v=1:a=0,trim=duration=%.3f[out]' % (len(parts), DUR)
  out = 'tiles/t%02d.mp4' % (i + 1)
  subprocess.run(args + ['-filter_complex', fc, '-map', '[out]', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18',
                         '-pix_fmt', 'yuv420p', '-g', '15', '-movflags', '+faststart', out], check=True)
  print(out, ' + '.join('%s@%.2f(%.2fs)' % p for p in parts))
