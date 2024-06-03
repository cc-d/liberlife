#!/bin/sh
_REPO="$(dirname $(dirname $(realpath $0)))"
echo $_REPO
sudo systemctl stop liberlife.service
