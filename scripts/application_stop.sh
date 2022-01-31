#!/bin/bash
#Stopping existing node servers
echo "Stopping any existing node servers"
DIR="/home/ec2-user/YoApp"
if [ -d "$DIR" ]; then
  echo "${DIR} exists"
else
  echo "Creating ${DIR} directory"
  mkdir ${DIR}
fi
cd /home/ec2-user/YoApp
pm2 stop app.js