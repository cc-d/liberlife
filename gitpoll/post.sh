#!/bin/sh
. `realpath $0`/shell.sh

sudo chown -R cary:cary /home/cary/liberlife
sudo cp /home/cary/liberlife/systemd/liberlife.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl start liberlife.service
