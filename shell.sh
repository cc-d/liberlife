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

if [ -s "$HOME/.nvm/nvm.sh" ]; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
    nvm use 20
fi


alias pytestargs='pytest tests -s -vv --show-capture=all -x --cov --cov-report=term-missing'

dateandcomhash() {
    echo "attempting dateandcomhash with input: $0 $1 $2"
    [ -z "$1" ] && \
        echo "no file arg included. usage: dateandcomhash  /example/path" \
        && return 1

    _DANDC_COMHASH="$(git rev-parse HEAD)"
    echo "$(date)" > "$1"
    echo "$_DANDC_COMHASH" >> "$1"
    echo "successfully dateandcomhash'd $1"
}

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
    gentypes
    mv "$FRONTDIR/.env" "/tmp/.env.bak"
    eval '(cd $FRONTDIR && npm run build)'
    mv "/tmp/.env.bak" "$FRONTDIR/.env"
    rm -r "$ROOTDIR/nginx/html"
    sudo mv "$FRONTDIR/build" "$ROOTDIR/nginx/html"
    fixhtmlinjs
    dateandcomhash "$ROOTDIR/nginx/html/build.txt"
    cp "$ROOTDIR/nginx/html/build.txt" "$ROOTDIR/frontend/public/build.txt"
}

# i keep mixing these up
alias buildrun='runbuild';

fixhtmlinjs() {
    if [ "$REACT_APP_API_BASEURL" = "https://life.liberfy.ai/api" ]; then
        echo "using prod url"
        _FIXURLS="https://life.liberfy.ai/api"
        _REPURLS="http://localhost:8999"
    else
        echo "using local url"
        _FIXURLS="http://localhost:8999"
        _REPURLS="https://life.liberfy.ai/api"
    fi

    echo "fixing urls in js files: $_FIXURLS -> $_REPURLS"
    sed -i.bak "s|$_FIXURLS|$_REPURLS|g" "$ROOTDIR/nginx/html/static/js/"*.js
    rm "$ROOTDIR/nginx/html/static/js/"*.bak

}


movetowww() {
    _WWW_REPOHTML="$ROOTDIR/nginx/html"
    _WWW_NGINXHTML="/var/www/html"

    [ -d "$_WWW_NGINXHTML" ] && \
        echo "nginx html exists at $_WWW_NGINXHTML deleting" && \
        sudo rm -r "$_WWW_NGINXHTML"

    echo "resetting repo nginx/html to head"
    git reset "nginx/html"; git checkout nginx/html

    sudo cp -r "nginx/html" "$_WWW_NGINXHTML"

    # echo current git commit hash to build.txt
    sudo chmod -R 755 "$_WWW_NGINXHTML/"
    sudo chown -R cary: "$_WWW_NGINXHTML/"

    sudo systemctl restart nginx
}
