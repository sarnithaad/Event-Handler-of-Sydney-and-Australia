#!/usr/bin/env bash
set -o errexit

# Install dependencies and build
npm install
npm run build

# Ensure Puppeteer cache directory exists
export PUPPETEER_CACHE_DIR=/opt/render/project/src/backend/.cache/puppeteer
mkdir -p $PUPPETEER_CACHE_DIR

# Copy the Chromium binary from the build cache to the runtime cache
cp -R /opt/render/project/src/backend/.cache/puppeteer/chrome $PUPPETEER_CACHE_DIR
