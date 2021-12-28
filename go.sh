#!/bin/sh
echo
echo  npm install
echo  npm run serve
echo  npm run build
echo
# s3bucket="iot.mosf.cn"
s3bucket="iot.xnexcharger.com"
echo 
echo
npm install
npm run build
aws s3 rm s3://${s3bucket}/css --quiet --recursive
aws s3 rm s3://${s3bucket}/img --quiet --recursive
aws s3 rm s3://${s3bucket}/js --quiet --recursive
aws s3 rm s3://${s3bucket}/404.html --quiet --recursive
aws s3 rm s3://${s3bucket}/index.html --quiet --recursive
aws s3 rm s3://${s3bucket}/charger.html --quiet --recursive
aws s3 rm s3://${s3bucket}/devices.html --quiet --recursive
aws s3 rm s3://${s3bucket}/error.html --quiet --recursive
aws s3 sync dist/ s3://${s3bucket}/
