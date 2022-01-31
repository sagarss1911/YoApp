#!/bin/bash
#Stopping existing node servers
echo "Stopping any existing node servers"
cd /home/ec2-user/YoApp
pm2 stop app.js