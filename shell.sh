#!/bin/sh
ROOTDIR="$HOME/liberlife"
FRONTDIR="$ROOTDIR/frontend"
APIDIR="$ROOTDIR/api"

if [ -z "$LIBLIFE_ENV" ]; then
    LIBLIFE_ENV=dev
fi

alias gentypes="npx openapi-typescript-codegen generate --exportSchemas true --input http://localhost:8999/openapi.json --output $FRONTDIR/src/api/"


uvistart() {
    cd $ROOTDIR
    if [ ! -z "$VIRTUAL_ENV" ]; then
        echo "venv already created"
    else
        . "$APIDIR/venv/bin/activate"
    fi
    source $ROOTDIR/.envs/$LIBLIFE_ENV.env
    uvicorn api.app.main:app --port $API_PORT --host $API_HOST --reload
}

npmapi() {
    gentypes
    cd $FRONTDIR
    cp ../.envs/$LIBLIFE_ENV.env .env
    source $ROOTDIR/.envs/$LIBLIFE_ENV.env
    echo "PORT=$REACT_APP_PORT" >> .env
    echo "HOST=$REACT_APP_HOST" >> .env
    npm start
    cd $ROOTDIR
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
