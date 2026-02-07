#!/usr/bin/env bash
set -euo pipefail

echo "git push"
git add . || echo "git add failed, continue"
git commit -m "quick update" || echo "git commit skipped/failed, continue"
git push || echo "git push failed, continue"


echo "deploy"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WEBSITE_DIR="$ROOT_DIR/website"

if [ ! -d "$WEBSITE_DIR" ]; then
  echo "website directory not found: $WEBSITE_DIR" >&2
  exit 1
fi

cd "$WEBSITE_DIR"

if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Building site..."
npm run build

echo "Deploying to GitHub Pages (gh-pages) via SSH..."
USE_SSH=true npm run deploy
