#!/bin/sh

# Navigate to the directory of the project
cd /home/cary/liberlife || exit

# Fetch without making changes to see if there are updates
git fetch

# Check if there are any new commits
if [ "$(git rev-list HEAD...origin/main --count)" -ne 0 ]; then
    # Pull the latest changes
    git pull
    cp -r /home/cary/liberlife/nginx/html/* /var/www/html/
else
    echo "No changes to pull."
fi

