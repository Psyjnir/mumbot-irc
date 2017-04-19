#!/bin/bash 
if [ "$TRAVIS_BRANCH" == "master" ]; then
  echo "NOTE: Main or Pull Request merge branch, stopping deploy to test."
  exit 0
fi

eval "$(ssh-agent -s)"
chmod 600 .travis/travis_rsa
ssh-add .travis/travis_rsa

git config --global push.default simple
git remote add testing "${TEST_LOCATION}"

echo "NOTE: Pushing $TRAVIS_BRANCH to Test!"
git push testing HEAD:master --force