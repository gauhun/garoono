#!/bin/sh
# Renders og.html to public/og.jpg (1200x630), the link preview for garoono.in
set -e
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files \
  --virtual-time-budget=5000 --window-size=1200,630 --screenshot="$PWD/og.png" "file://$PWD/og.html"
sips -s format jpeg -s formatOptions 88 og.png --out ../public/og.jpg >/dev/null
sips -g pixelWidth -g pixelHeight ../public/og.jpg
