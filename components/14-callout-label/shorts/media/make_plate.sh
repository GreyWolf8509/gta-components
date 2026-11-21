#!/bin/bash
# Builds media/plate-v.mp4 (1080x1920, 30 fps, 121 frames): the Shorts blur-fill layout with every shot at native 1.0x.
# A 1080x1080 window of each 16:9 master (no upscale, no sharpening) sits at y 440 over a blurred, darkened copy of the same shot.
#   0.000-2.400  v49-gp-franklin-mural-h  frames 0-71, window x 480-1560 (Franklin + the Families crew, no HUD)
#   2.400-4.033  v06-franklin-lamar-portrait-h frames 0-48, window x 640-1720 (Franklin close, sunny Grove Street)
# usage: bash media/make_plate.sh   (run from b/)
set -e
S=assets/shots
seg() { # src frames x0 bedx out
  ffmpeg -v error -y -i "$S/$1" -filter_complex "[0:v]trim=start_frame=0:end_frame=$2,setpts=PTS-STARTPTS,split[a][b];\
[a]scale=-2:1920:flags=lanczos,crop=1080:1920:$4:0,gblur=sigma=34,colorchannelmixer=rr=0.58:gg=0.58:bb=0.58,eq=contrast=1.12:saturation=1.15[bed];\
[b]crop=1080:1080:$3:0[win];[bed][win]overlay=0:440,format=yuv420p[v]" -map "[v]" -r 30 -c:v libx264 -preset slow -crf 10 -an "$5"
}
seg v49-gp-franklin-mural-h.mp4 72 480 1273 /tmp/plate-a.mp4
seg v06-franklin-lamar-portrait-h.mp4 49 640 1558 /tmp/plate-b.mp4
printf "file '/tmp/plate-a.mp4'\nfile '/tmp/plate-b.mp4'\n" > /tmp/plate-list.txt
ffmpeg -v error -y -f concat -safe 0 -i /tmp/plate-list.txt -c copy media/plate-v.mp4
rm -f /tmp/plate-a.mp4 /tmp/plate-b.mp4 /tmp/plate-list.txt
