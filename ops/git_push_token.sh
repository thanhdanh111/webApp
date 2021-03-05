# status = unable to use

if [ -z "$GITLAB_USER_NAME" ] || [ -z "$CI_JOB_TOKEN" ]; then
  echo "CI_JOB_TOKEN or GITLAB_USER_NAME is not set yet"
  exit 1
fi

# git init
git config --global user.email "ci-cd@agent.com"
git config --global user.name "ci-cd-agent"

# git push with CI token
git add .
git diff-index --quiet HEAD || git commit -m "upload latest screenshots" && \
git push https://$GITLAB_USER_NAME:$CI_JOB_TOKEN@gitlab.com/coreproducts/snt-app/web-app.git  HEAD:$CI_COMMIT_BRANCH
