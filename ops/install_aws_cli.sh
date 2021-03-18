# for alpine image
apk add --update --no-cache python3 py3-pip
pip3 install --upgrade pip
pip3 install awscli
aws --version