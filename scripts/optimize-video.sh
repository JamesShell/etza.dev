#!/usr/bin/env bash
# Re-encodes a cover video for the web before it's uploaded in /admin.
#
# A cover is never shown wider than about 1000 CSS px, so anything past
# 1280 wide is downloaded and never seen. Screen recordings straight out of a
# recorder run at 3–4 Mbps; at this quality they look the same at a quarter
# of the size. The sound is dropped (covers play muted) and the index goes at
# the front of the file, so playback can start before the download ends.
#
#   scripts/optimize-video.sh input.mov            -> input.web.mp4
#   scripts/optimize-video.sh input.mov out.mp4
#   WIDTH=1440 CRF=24 scripts/optimize-video.sh input.mp4
#
# Output is H.264 MP4, which plays everywhere, Safari included. An output
# path ending in .webm gets VP9 instead.
#
# Needs ffmpeg (apt install ffmpeg / brew install ffmpeg).

set -euo pipefail

in=${1:?usage: optimize-video.sh input [output]}
out=${2:-${in%.*}.web.mp4}
width=${WIDTH:-1280}
fps=${FPS:-30}

# Never upscale: a narrower source keeps its own width (rounded to even).
scale="scale='min(${width},iw)':-2:flags=lanczos,fps=${fps}"

if [[ $out == *.webm ]]; then
  ffmpeg -hide_banner -y -i "$in" -an -vf "$scale" \
    -c:v libvpx-vp9 -crf "${CRF:-36}" -b:v 0 -row-mt 1 -deadline good -cpu-used 2 \
    -pix_fmt yuv420p "$out"
else
  ffmpeg -hide_banner -y -i "$in" -an -vf "$scale" \
    -c:v libx264 -preset slow -crf "${CRF:-26}" -profile:v high \
    -pix_fmt yuv420p -movflags +faststart "$out"
fi

printf '%s: %s -> %s\n' "$out" "$(du -h "$in" | cut -f1)" "$(du -h "$out" | cut -f1)"
