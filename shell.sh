#!/bin/sh
ROOTDIR="$HOME/liberlife"
FRONTDIR="$ROOTDIR/frontend"
APIDIR="$ROOTDIR/api"

if [ -z "$LIBLIFE_ENV" ]; then
    export LIBLIFE_ENV="dev"
fi


if [ -z "$LIBLIFE_ENV" ]; then
    echo "LIBLIFE_ENV not set"
    return 1
fi
for l in $(cat "$ROOTDIR/.envs/$LIBLIFE_ENV.env" | grep -v "^#" | grep -v "^$"); do
    echo "export $l"
    export $l
done


uvistart() {
    cd $ROOTDIR
    if [ ! -z "$VIRTUAL_ENV" ]; then
        echo "venv already created"
    else
        . "$APIDIR/venv/bin/activate"
    fi
    uvicorn api.app.main:app --port $API_PORT --host $API_HOST --reload
}

gentypes() {
    BASE="http://$API_HOST:$API_PORT"
    OPENAPI_URL="$BASE/openapi.json"
    echo "generating types url: $OPENAPI_URL"
    npx openapi-typescript-codegen generate \
        --exportSchemas true \
        --input "$OPENAPI_URL" \
        --output "$FRONTDIR/src/api/"
}

npmapi() {
    gentypes
    echo "copying $LIBLIFE_ENV.env to $FRONTDIR/.env"
    cp "$ROOTDIR/.envs/$LIBLIFE_ENV.env" "$FRONTDIR/.env"
    echo "PORT=$REACT_APP_PORT" >> "$FRONTDIR/.env"
    echo "HOST=$REACT_APP_HOST" >> "$FRONTDIR/.env"

    cd $FRONTDIR && npm start && cd $ROOTDIR
}

dc () {
    if [ "$1" = "rebuild" ]; then
        docker compose stop
        docker compose build
        docker compose up -d
    else
        docker compose $@
    fi
}


automigrate() {
    cd $APIDIR
    alembic revision --autogenerate && alembic upgrade head
    cd -
}

alias psqldb="psql -U pguser -h 127.0.0.1 -p 5432 liblifedb"

if [ -d "$HOME/.pyenv" ]; then
    if [ command -v pyenv 1>/dev/null 2>&1 ]; then
        eval "$(pyenv init -)"
    fi
fi

if [ -d "$HOME/.nvm" ]; then
    nvm use 20
fi

alias pytestargs='pytest tests -s -vv --show-capture=all -x --cov --cov-report=term-missing'


runbuild() {
    if ! nc -z localhost 8999; then
        echo "uvicorn not running"
        eval "uvistart" &
        pid=$!
        until nc -z localhost 8999; do
            echo "waiting for uvicorn to start"
            sleep 1

            done
        wait $pid
    else
        echo "uvicorn already running"
    fi

    echo "generating types"
    gentypes

    echo "mving $FRONTDIR/.env to /tmp"
    mv "$FRONTDIR/.env" "/tmp/.env.bak"
    ls -Aa /tmp/

    echo "copying $ROOTDIR/.envs/prod.env to $FRONTDIR/.env"
    cp "$ROOTDIR/.envs/prod.env" "$FRONTDIR/.env"


    echo "building with prod.env in $FRONTDIR"
    eval '(cd $FRONTDIR && npm run build)'

    echo "moving back .env from /tmp to $FRONTDIR"
    mv "/tmp/.env.bak" "$FRONTDIR/.env"
}

movetowww() {
    if [ -d "/var/www/html" ]; then
        sudo rm -r /var/www/html
    fi
    sudo mv "$FRONTDIR/build" /var/www/html
    sudo systemctl restart nginx
}
