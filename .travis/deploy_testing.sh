#!/bin/bash 
eval "$(ssh-agent -s)"
chmod 600 .travis/travis_rsa
ssh-add .travis/travis_rsa

git config --global push.default simple
git remote add testing "${TEST_LOCATION}"

if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  exit 0
fi

if [ "$TRAVIS_BRANCH" == "master" ]; then
  echo "NOTE: Testing master merge branch, not continuing."
  exit 0
fi
  
echo "NOTE: Pushing to Test!"
git push testing master --force