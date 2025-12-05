#!/bin/bash
# Archive Playwright .last-run.json with a timestamp after each test run

SRC="test-results/.last-run.json"
DST="test-results/archive-$(date '+%Y%m%d-%H%M%S').json"

if [ -f "$SRC" ]; then
  cp "$SRC" "$DST"
  echo "Archived $SRC to $DST"
else
  echo "No .last-run.json found to archive."
fi
