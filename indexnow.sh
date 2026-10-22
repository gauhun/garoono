#!/bin/sh
# Tells Bing, Yandex and other IndexNow engines that every URL in the sitemap changed.
# Runs after `npm run deploy` (postdeploy); reads the sitemap the build just wrote.
cd "$(dirname "$0")"
KEY=$(cat .indexnow-key)
URLS=$(grep -o '<loc>[^<]*' out/sitemap.xml | sed 's/<loc>/"/;s/$/"/' | paste -sd, -)
curl -s -o /dev/null -w "IndexNow: HTTP %{http_code}\n" -X POST https://api.indexnow.org/indexnow \
  -H 'Content-Type: application/json; charset=utf-8' \
  -d "{\"host\":\"garoono.in\",\"key\":\"$KEY\",\"keyLocation\":\"https://garoono.in/$KEY.txt\",\"urlList\":[$URLS]}"
