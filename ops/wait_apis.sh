#!/bin/bash

# for alpine image
# apk --no-cache --update add curl
# disable exitting on error temporarily
set +e

# for i in {1..15}
# do
#   sleep 5
#   echo "Try #$i"
#   nc -4 -d -z -w 1 0.0.0.0 5000 &> /dev/null

#   if [[ $? == 0 ]]; then
#     break
#   fi
# done

# if [[ $? != 0 ]]; then
#   set -e
#   exit 1
# fi

# set -e


for i in {1..15}
do
  sleep 5
  echo "Try #$i"
  response=`curl --silent http://127.0.0.1:5000/`
  exit_code=$?

  if [[ $exit_code == 0 ]]; then
    break
  fi
done

if [[ $exit_code != 0 ]]; then
  set -e
  exit 1
fi

set -e