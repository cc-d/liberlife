#!/bin/sh
ROOTDIR="$HOME/liberlife"
FRONTDIR="$ROOTDIR/frontend"
APIDIR="$ROOTDIR/api"

alias gentypes="npx openapi-typescript-codegen generate \
--exportSchemas true --input http://localhost:8999/openapi.json \
--output $FRONTDIR/src/api/"

alias uvistart=". api/venv/bin/activate && uvicorn --port=8999 api.app.main:app --reload"

alias gptfindpy="find $APIDIR -type f -name '*.py' -not -path '*venv*' -not -path '*alembic*'"


dc () {
    if [ "$1" = "rebuild" ]; then
        docker compose stop
        docker compose build
        docker compose up -d
    else
        docker compose $@
    fi
}


npmapi() {
    gentypes
    cd $FRONTDIR &&  npm start
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
