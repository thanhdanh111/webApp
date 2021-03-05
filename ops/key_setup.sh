#!/bin/bash

# if [ -z "$DEPLOY_AWS_PRIVATE_KEY" ]; then
#   echo "DEPLOY_AWS_PRIVATE_KEY is not set"
#   echo "Please set the DEPLOY_AWS_PRIVATE_KEY"
#   exit 1
# fi

# apk add openssh-client -f --allow-untrusted
# mkdir -p ~/.ssh
# eval "$(ssh-agent -s)"
# echo "$DEPLOY_AWS_PRIVATE_KEY" | tr -d '\r' > ~/.ssh/ec2-cc.pem
# chmod 700 ~/.ssh/ec2-cc.pem
# ssh-add ~/.ssh/ec2-cc.pem