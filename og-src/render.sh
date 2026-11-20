#!/bin/sh
# Renders a 1200x630 link preview: sh og-src/render.sh [page] [output]
# Default: og.html to public/og.jpg (garoono.in). Example: sh og-src/render.sh glowmetry-play og-glowmetry-play.jpg
set -e
cd "$(dirname "$0")"
SRC="${1:-og}"
OUT="${2:-og.jpg}"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files \
  --virtual-time-budget=5000 --window-size=1200,630 --screenshot="$PWD/$SRC.png" "file://$PWD/$SRC.html"
sips -s format jpeg -s formatOptions 88 "$SRC.png" --out "../public/$OUT" >/dev/null
sips -g pixelWidth -g pixelHeight "../public/$OUT"
