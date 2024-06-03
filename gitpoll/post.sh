#!/bin/sh
_REPO="$(dirname $(dirname $(realpath $0)))"
echo $_REPO

sudo cp "$_REPO/systemd/liberlife.service" /etc/systemd/system/
sudo systemctl enable liberlife
sudo systemctl daemon-reload
sudo systemctl start liberlife