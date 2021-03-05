#!/bin/bash
if [ -z "$CI_COMMIT_BRANCH" ]; then
  echo "CI_COMMIT_BRANCH not set"
  echo "Please set the GitLab branch name as CI_COMMIT_BRANCH"
  exit 1
fi

git add .
git diff-index --quiet HEAD || (git commit -m "upload latest screenshots" -n && git config --list && git status && git push origin $CI_COMMIT_BRANCH)
