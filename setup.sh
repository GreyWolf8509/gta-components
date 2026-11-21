#!/bin/bash
# Copies the shared fonts and the look/motion kit into a component's assets/ folder, and creates the empty
# footage folders. Usage: ./setup.sh components/38-spin-wheel/long-form   (or shorts/27-podium-3d)
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
P="$1"; [ -d "$P" ] || P="$ROOT/$1"
[ -f "$P/index.html" ] || { echo "no index.html in $P"; exit 1; }
mkdir -p "$P/assets/fonts" "$P/assets/kit" "$P/assets/shots" "$P/assets/plates" "$P/assets/clips"
cp -R "$ROOT/shared/fonts/." "$P/assets/fonts/"
case "$P" in
  */shorts/[0-9]*) cp -R "$ROOT/shared/kit-shorts/." "$P/assets/kit/" ;;
  *) cp -R "$ROOT/shared/kit/." "$P/assets/kit/" ;;
esac
echo "ready: $P (put your own clips in assets/shots/ or render with bg=none)"
