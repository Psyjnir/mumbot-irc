#!/bin/bash 
eval "$(ssh-agent -s)"
chmod 600 .travis/travis_rsa
ssh-add .travis/travis_rsa

git config --global push.default simple
git remote add deploy "${DEPLOY_LOCATION}"
echo "NOTE: Deploying to Production"
git push deploy master | awk '/([0-9a-z]{7}\.\.[0-9a-z]{7})|(fatal)/ { print }'