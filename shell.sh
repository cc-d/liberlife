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
    echo "generating types url: http://$API_HOST:$API_PORT/openapi.json"
    npx openapi-typescript-codegen generate \
    --exportSchemas true --input "http://$API_HOST:$API_PORT/openapi.json" \
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
    pyenv local 3.11
fi

if [ -d "$HOME/.nvm" ]; then
    nvm use 20
fi
