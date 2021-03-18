#!/bin/bash

if [ -z "$GIT_PRIVATE_KEY" ] || [ -z "$GIT_REPO" ]; then
  echo "GIT_PRIVATE_KEY or GIT_REPO is not set"
  exit 1
fi

mkdir -p ~/.ssh
echo "$GIT_PRIVATE_KEY" | tr -d '\r' > ~/.ssh/id_rsa
chmod 700 ~/.ssh/id_rsa
#if not installed, it will install
hash ssh-agent || (apt-get update -y && apt-get install openssh-client -y )

eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
ssh-keyscan gitlab.com >> ~/.ssh/known_hosts
chmod 644 ~/.ssh/known_hosts
# git init
git checkout $CI_COMMIT_BRANCH
git remote set-url origin $GIT_REPO
git config --global user.email "ci-cd@agent.com"
git config --global user.name "ci-cd-agent"
# git fetch origin $BRANCH

