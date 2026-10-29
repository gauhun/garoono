#!/bin/sh
# Publishes garoono.in: GitHub Actions builds and deploys Pages on every push to main.
# Waits for that run to pass; postdeploy then pings IndexNow.
set -e
cd "$(dirname "$0")/.."
[ "$(git branch --show-current)" = main ] || { echo "Switch to main first"; exit 1; }
git diff --quiet HEAD || { echo "Commit your changes first"; exit 1; }
git push origin main
SHA=$(git rev-parse HEAD)
RUN=""
# The run shows up a few seconds after the push
for _ in 1 2 3 4 5 6 7 8 9 10; do
  RUN=$(gh run list --workflow nextjs.yml --commit "$SHA" --limit 1 --json databaseId -q '.[0].databaseId')
  [ -n "$RUN" ] && break
  sleep 3
done
[ -n "$RUN" ] || { echo "No Pages run found for $SHA"; exit 1; }
gh run watch "$RUN" --exit-status
