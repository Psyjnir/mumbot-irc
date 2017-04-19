#!/bin/bash
if [ "$TRAVIS_BRANCH" == "master" ] && [ "$TRAVIS_PULL_REQUEST" != false ]; then
  echo "NOTE: Main or Pull Request merge branch, stopping installation."
  exit 0
fi

# Peform install
npm install