#!/bin/bash
if [ "$TRAVIS_PULL_REQUEST" != false ]; then
  echo "PULL REQUEST IS:"
  echo $TRAVIS_PULL_REQUEST
else
  echo "PULL REQUEST IS FALSE."
fi

if [ "$TRAVIS_BRANCH" == "master" ] && [ "$TRAVIS_PULL_REQUEST" != false ]; then
  echo "NOTE: Main or Pull request merge branch, stopping."
  exit 0
fi

# Peform install
echo "NOTE: Pull request branch, building"
npm install